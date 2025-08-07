const MODIFICATIONS_TAG_NAME = "file_modifications";

enum StepType {
  CREATE_FILE = "CREATE_FILE",
  DELETE_FILE = "DELETE_FILE",
  UPDATE_FILE = "UPDATE_FILE",
  RUN_COMMAND = "RUN_COMMAND",
}

const ARTIFACT_TAG_OPEN = "<Artifact";
const ARTIFACT_TAG_CLOSE = "</Artifact>";

export interface ParsedAction {
  type: "shell" | "file";
  filePath?: string;
  content: string;
  isComplete: boolean;
}

export function parseXml(response: string): {
  beforeArtifact: string;
  actions: ParsedAction[];
} {
  if (!response) {
    return { beforeArtifact: "", actions: [] };
  }

  const artifactStartIndex = response.indexOf(ARTIFACT_TAG_OPEN);
  let beforeArtifact = "";
  let artifactCandidate = "";

  if (artifactStartIndex !== -1) {
    beforeArtifact = response.substring(0, artifactStartIndex);
    const artifactEndIndex = response.indexOf(
      ARTIFACT_TAG_CLOSE,
      artifactStartIndex,
    );

    // Prefer to start right after the closing '>' of the opening <Artifact ...>
    const artifactOpenEnd = response.indexOf(">", artifactStartIndex);

    if (artifactEndIndex !== -1) {
      artifactCandidate = response.substring(
        artifactOpenEnd !== -1
          ? artifactOpenEnd + 1
          : artifactStartIndex + ARTIFACT_TAG_OPEN.length,
        artifactEndIndex,
      );
    } else {
      artifactCandidate = response.substring(
        artifactOpenEnd !== -1
          ? artifactOpenEnd + 1
          : artifactStartIndex + ARTIFACT_TAG_OPEN.length,
      );
    }
  } else {
    beforeArtifact = response;
  }

  const actionRegex = /<Action\b([^>]*)>([\s\S]*?)(?:<\/Action>|$)/g;
  const actions: ParsedAction[] = [];
  let match: RegExpExecArray | null;

  while ((match = actionRegex.exec(artifactCandidate)) !== null) {
    const [, rawAttrs, content] = match;
    const isComplete = match[0].trim().endsWith("</Action>");

    let actionType: "shell" | "file" = "file";
    let filePath: string | undefined = undefined;
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2];
      if (key === "type") {
        const normalized = value.toLowerCase();
        actionType = normalized === "shell" ? "shell" : "file";
      } else if (key === "filePath") {
        filePath = value;
      }
    }

    actions.push({ type: actionType, filePath, content, isComplete });
  }

  return { beforeArtifact: beforeArtifact.trim(), actions };
}

const allowedHTMLElements = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "ins",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "source",
  "span",
  "strike",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
  "var",
];

export {
  MODIFICATIONS_TAG_NAME,
  allowedHTMLElements,
  StepType,
  ARTIFACT_TAG_OPEN,
  ARTIFACT_TAG_CLOSE,
};
