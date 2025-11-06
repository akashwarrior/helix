import type { UIMessageStreamWriter, UIMessage } from "ai";
import type { DataPart } from "../messages/data-parts";
import { getContents } from "./generate-files/get-contents";
import { getRichError } from "./get-rich-error";
import { uploadFilesToS3 } from "@/lib/s3";
import { createSandbox, writeFilesToSandbox } from "@/lib/sandbox";
import description from "./generate-files.md";
import { tool } from "ai";
import z from "zod/v4";

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
  projectId: string;
}

export const generateFiles = ({ writer, projectId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      paths: z.array(z.string()).min(1),
    }),
    execute: async ({ paths }, { toolCallId, messages }) => {
      const files: DataPart["generating-files"]["files"] = paths.map(
        (path) => ({ path, content: "", status: "generating" }),
      );

      writer.write({
        id: toolCallId,
        type: "data-generating-files",
        data: { files },
      });

      const sandbox = createSandbox(projectId);
      const iterator = getContents({ messages, paths });

      try {
        for await (const chunk of iterator) {
          files.forEach((file) => {
            const chunkFile = chunk.find((f) => f.path === file.path);
            if (chunkFile) {
              file.content = chunkFile.content;
              file.status = "done";
            }
          });
          writer.write({
            id: toolCallId,
            type: "data-generating-files",
            data: { files },
          });
        }
      } catch (error) {
        const richError = getRichError({
          action: "generate file contents",
          args: { paths },
          error,
        });

        writer.write({
          id: toolCallId,
          type: "data-generating-files",
          data: {
            error: richError.error,
            files: files.map((file) => ({ ...file, status: "error" })),
          },
        });
        return richError.message;
      }

      try {
        const sandboxInstance = await sandbox;
        await Promise.all([
          uploadFilesToS3(projectId, files),
          writeFilesToSandbox(sandboxInstance, files),
        ]);

        const url = sandboxInstance.domain(3000);

        writer.write({
          id: toolCallId,
          type: "data-generating-files",
          data: { files, sandboxId: sandboxInstance.sandboxId, url },
        });
      } catch (error) {
        const richError = getRichError({
          action: "write files to sandbox",
          args: { files },
          error,
        });

        writer.write({
          id: toolCallId,
          type: "data-generating-files",
          data: {
            error: richError.error,
            files: files.map((file) => ({ ...file, status: "error" })),
          },
        });

        return richError.message;
      }

      return `Successfully generated and uploaded ${files.length} files.`;
    },
  });
