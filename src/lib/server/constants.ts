import { MessageStore, useMessagesStore } from "@/store/messagesStore";
import type { Role } from "@prisma/client";

const MODIFICATIONS_TAG_NAME = "file_modifications";

enum StepType {
  CREATE_FILE = "create_file",
  RUN_SCRIPT = "run_script",
}

const ARTIFACT_TAG_OPEN = "<Artifact>";
const ARTIFACT_TAG_CLOSE = "</Artifact>";

function parseXml(
  response: string,
  id: string,
  role: "user" | "assistant" | "data" | "system",
): void {
  if (!response) return;

  const artifactStartIndex = response.indexOf(ARTIFACT_TAG_OPEN);
  let beforeArtifact = "";
  let artifactCandidate = "";

  if (artifactStartIndex !== -1) {
    beforeArtifact = response.substring(0, artifactStartIndex);
    const artifactEndIndex = response.indexOf(
      ARTIFACT_TAG_CLOSE,
      artifactStartIndex,
    );
    if (artifactEndIndex !== -1) {
      artifactCandidate = response.substring(
        artifactStartIndex + ARTIFACT_TAG_OPEN.length,
        artifactEndIndex,
      );
    } else {
      artifactCandidate = response.substring(
        artifactStartIndex + ARTIFACT_TAG_OPEN.length,
      );
    }
  } else {
    beforeArtifact = response;
  }

  const message: MessageStore = {
    id,
    content: beforeArtifact.trim() || "",
    role: role as Role,
    createdAt: new Date(),
    steps: [],
  };

  if (artifactCandidate.trim()) {
    const actionRegex =
      /<Action\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?\s*>([\s\S]*?)(?:<\/Action>|$)/g;
    let match: RegExpExecArray | null;

    while ((match = actionRegex.exec(artifactCandidate)) !== null) {
      const [fullMatch, type, filePath, content] = match;
      switch (type) {
        case "file":
          if (filePath) {
            message.steps.push({
              stepType: StepType.CREATE_FILE,
              isPending: true,
              path: filePath,
              content: content,
            });
          }
          break;
        case "shell":
          message.steps.push({
            stepType: StepType.RUN_SCRIPT,
            isPending: true,
            content: content,
          });
          break;
      }
    }
  }

  useMessagesStore.getState().updateMessage(message);
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

export { MODIFICATIONS_TAG_NAME, allowedHTMLElements, parseXml, StepType };
