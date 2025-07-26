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
    id: id,
    content: beforeArtifact.trim() || "",
    role: role as Role,
    createdAt: new Date(),
    steps: [],
  };

  const currentMessages = useMessagesStore.getState().messages;
  let existingMessage = currentMessages.find(m => m.id === message.id);

  if (!existingMessage) {
    useMessagesStore.getState().updateMessage(message);
    existingMessage = message;
  } else if (existingMessage.content !== message.content) {
    existingMessage.content = message.content;
    useMessagesStore.getState().updateMessage(existingMessage);
  }

  if (artifactCandidate.trim()) {
    const actionRegex =
      /<Action\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?\s*>([\s\S]*?)(?:<\/Action>|$)/g;
    let match: RegExpExecArray | null;

    while ((match = actionRegex.exec(artifactCandidate)) !== null) {
      const [, type, filePath, content] = match;
      const isArtifactComplete = match[0].trim().endsWith("</Action>");

      const newStep = {
        stepType: type === "file" ? StepType.CREATE_FILE : StepType.RUN_SCRIPT,
        isPending: true,
        content: content,
        isArtifactComplete,
        ...(filePath && { path: filePath })
      };

      const stepIndex = existingMessage.steps.findIndex(step =>
        step.stepType === newStep.stepType &&
        step.path === newStep.path
      );

      if (stepIndex === -1) {
        existingMessage.steps.push(newStep);
      } else if (newStep.isArtifactComplete && newStep.isPending) {
        const existingStep = existingMessage.steps[stepIndex];
        if (existingStep.content !== newStep.content ||
          existingStep.isArtifactComplete !== newStep.isArtifactComplete) {
          existingMessage.steps[stepIndex] = newStep;
        }
      }

      useMessagesStore.getState().updateMessage(existingMessage);
    }
  }
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
