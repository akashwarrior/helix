import { createTwoFilesPatch } from "diff";
import { MODIFICATIONS_TAG_NAME } from "@/lib/server/constants";

interface ModifiedFile {
  type: "diff" | "file";
  content: string;
}

type FileModifications = Record<string, ModifiedFile>;

// TODO: needs to be refactored
export function computeFileModifications(
  // @ts-expect-error - need to fix types
  files,
  modifiedFiles: Map<string, string>,
) {
  const modifications: FileModifications = {};

  for (const [filePath, originalContent] of modifiedFiles) {
    const file = files[filePath];

    if (file?.type !== "file") {
      continue;
    }

    const unifiedDiff = diffFiles(filePath, originalContent, file.content);

    if (!unifiedDiff) {
      continue;
    }

    if (unifiedDiff.length > file.content.length) {
      modifications[filePath] = { type: "file", content: file.content };
    } else {
      modifications[filePath] = { type: "diff", content: unifiedDiff };
    }
  }

  return modifications;
}

export function diffFiles(
  fileName: string,
  oldFileContent: string,
  newFileContent: string,
) {
  let unifiedDiff = createTwoFilesPatch(
    fileName,
    fileName,
    oldFileContent,
    newFileContent,
  );

  const patchHeaderEnd = `--- ${fileName}\n+++ ${fileName}\n`;
  const headerEndIndex = unifiedDiff.indexOf(patchHeaderEnd);

  if (headerEndIndex >= 0) {
    unifiedDiff = unifiedDiff.slice(headerEndIndex + patchHeaderEnd.length);
  }

  if (unifiedDiff === "") {
    return undefined;
  }

  return unifiedDiff;
}

/**
 * Converts the unified diff to HTML.
 *
 * Example:
 *
 * ```html
 * <file_modifications>
 * <diff path="/home/project/index.js">
 * - console.log('Hello, World!');
 * + console.log('Hello, Bolt!');
 * </diff>
 * </file_modifications>
 * ```
 */
export function fileModificationsToHTML(modifications: FileModifications) {
  const entries = Object.entries(modifications);

  if (entries.length === 0) {
    return undefined;
  }

  const result: string[] = [`<${MODIFICATIONS_TAG_NAME}>`];

  for (const [filePath, { type, content }] of entries) {
    result.push(
      `<${type} path=${JSON.stringify(filePath)}>`,
      content,
      `</${type}>`,
    );
  }

  result.push(`</${MODIFICATIONS_TAG_NAME}>`);

  return result.join("\n");
}
