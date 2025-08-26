import { useFiles } from "@/store/files";
import { Step } from "@/store/messages";

const MODIFICATIONS_TAG_NAME = "file_modifications";

enum StepType {
  CREATE_FILE = "CREATE_FILE",
  DELETE_FILE = "DELETE_FILE",
  UPDATE_FILE = "UPDATE_FILE",
  RUN_COMMAND = "RUN_COMMAND",
}

const ARTIFACT_TAG_OPEN = "<Artifact";
const ARTIFACT_TAG_CLOSE = "</Artifact>";

interface parseXmlResponse {
  beforeArtifact: string;
  steps: Step[];
  title: string;
}

export function parseXml(response: string): parseXmlResponse {
  let title = "Build plan";

  const artifactStartIndex = response.indexOf(ARTIFACT_TAG_OPEN);
  let beforeArtifact = "";
  let artifactCandidate = "";

  const artifactRegex = /<Artifact\b([^>]*)>([\s\S]*?)(?:<\/Artifact>|$)/g;
  const artifactMatch = artifactRegex.exec(response);
  if (artifactMatch) {
    const [, rawAttrs] = artifactMatch;
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2];
      if (key === "title") {
        title = value;
      }
    }
  }

  if (artifactStartIndex !== -1) {
    beforeArtifact = response.substring(0, artifactStartIndex);
    const artifactEndIndex = response.indexOf(
      ARTIFACT_TAG_CLOSE,
      artifactStartIndex,
    );

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
  const steps: Step[] = [];
  let match: RegExpExecArray | null;

  while ((match = actionRegex.exec(artifactCandidate)) !== null) {
    const [, rawAttrs, content] = match;
    const isComplete = match[0].trim().endsWith("</Action>");

    let type: StepType = StepType.CREATE_FILE;
    let filePath: string | undefined = undefined;
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2];
      if (key === "type") {
        if (value.toLowerCase() === "shell") {
          type = StepType.RUN_COMMAND;
        }
      } else if (key === "filePath") {
        filePath = value;
      }
    }

    if (type === StepType.RUN_COMMAND) {
      steps.push({
        stepType: type,
        isPending: true,
        isComplete: isComplete,
        command: content.trim(),
      });
    } else {
      steps.push({
        stepType: type,
        isPending: true,
        isComplete: isComplete,
        filePath: filePath || "",
      });
      if (isComplete && !useFiles.getState().getFile(filePath || "")) {
        useFiles.getState().addFile(filePath || "", content.trim());
      }
    }
  }

  return { beforeArtifact: beforeArtifact.trim(), steps, title };
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
