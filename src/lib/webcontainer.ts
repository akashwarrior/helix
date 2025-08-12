import type { WebContainer } from "@webcontainer/api";
import { toast } from "sonner";

export const createFile = async (
  webContainer: WebContainer,
  fileName: string,
  targetDir: string = "",
) => {
  try {
    if (!fileName || fileName.includes("/") || fileName.includes("\\")) {
      throw new Error("Invalid file name");
    }
    try {
      await webContainer.fs.readFile(targetDir + "/" + fileName);
      throw new Error("File already exists");
    } catch {
      console.log("File does not exist");
    }

    await webContainer.fs.writeFile(targetDir + "/" + fileName, "");
    toast.success(`File "${fileName}" created successfully`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create file";
    toast.error(message);
    throw error;
  }
};

export const createFolder = async (
  webContainer: WebContainer,
  folderName: string,
  targetDir: string = ".",
) => {
  try {
    if (!folderName || folderName.includes("/") || folderName.includes("\\")) {
      throw new Error("Invalid folder name");
    }
    const fullPath =
      targetDir === "." ? folderName : `${targetDir}/${folderName}`;
    try {
      await webContainer.fs.readdir(fullPath);
      throw new Error("Folder already exists");
    } catch {
      console.log("Folder does not exist");
    }

    await webContainer.fs.mkdir(fullPath, { recursive: true });
    toast.success(`Folder "${folderName}" created successfully`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create folder";
    toast.error(message);
    throw error;
  }
};

export const renameItem = async (
  webContainer: WebContainer,
  oldPath: string,
  newName: string,
) => {
  try {
    if (!newName || newName.includes("/") || newName.includes("\\")) {
      throw new Error("Invalid name");
    }

    const pathParts = oldPath.split("/");
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join("/");

    try {
      await webContainer.fs.readFile(newPath, "utf-8");
      throw new Error(`File already exists`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw error;
      }
    }
    try {
      await webContainer.fs.readdir(newPath);
      throw new Error(`Folder already exists`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw error;
      }
    }

    await webContainer.fs.rename(oldPath, newPath);
    toast.success(`${newPath.split("/").pop()} renamed successfully`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to rename";
    toast.error(message);
    throw error;
  }
};

export const deleteItem = async (webContainer: WebContainer, path: string) => {
  try {
    await webContainer.fs.rm(path, { recursive: true });
    toast.success(`${path.split("/").pop()} deleted successfully`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete";
    toast.error(message);
    throw error;
  }
};

export async function executeCommand(
  container: WebContainer,
  command: string,
  args: string[] = [],
): Promise<{
  success: boolean;
  output: string;
  error: string | undefined;
  exitCode: number;
}> {
  try {
    const process = await container.spawn(command, args);

    let output = "";

    process.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
      }),
    );

    const exitCode = await process.exit;

    return {
      success: exitCode === 0,
      output: output.trim(),
      error: undefined,
      exitCode,
    };
  } catch (err) {
    return {
      success: false,
      output: "",
      error: err instanceof Error ? err.message : "Unknown error",
      exitCode: 1,
    };
  }
}
