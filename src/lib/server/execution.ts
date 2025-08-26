import { Step, useMessages, type MessageStore } from "@/store/messages";
import { useWebContainerStore } from "@/store/webContainer";
import { executeCommand } from "@/lib/webcontainer";
import type { WebContainer } from "@webcontainer/api";
import type { Role } from "@prisma/client";
import { StepType, parseXml } from "./constants";
import type { Message } from "ai";
import { useFiles } from "@/store/files";

let isExecuting = false;

export function processXmlResponse({ content, id, role, createdAt }: Message): void {
  if (!content.trim()) return;

  const { beforeArtifact, steps, title } = parseXml(content);

  const message: MessageStore = {
    id,
    content: beforeArtifact,
    role: role as Role,
    createdAt: createdAt || new Date(),
    steps: steps,
    title: title,
  };

  const existingMessage = useMessages
    .getState()
    .messages.findLast((m) => m.id === id);

  if (!existingMessage) {
    useMessages.getState().addMessage(message);
    executeSteps(message);
    return;
  } else {
    const hasNewSteps = existingMessage.steps.length !== message.steps.length;
    const hasContentChange = existingMessage.content !== message.content;
    const hasIncompleteSteps = existingMessage.steps.findLast(
      (s) => !s.isComplete,
    );

    if (hasNewSteps || hasContentChange || (hasIncompleteSteps && message.steps[message.steps.length - 1].isComplete)) {
      existingMessage.content = message.content;
      message.steps.forEach((step, index) => {
        const existingStep = existingMessage.steps[index];
        if (!existingStep) {
          existingMessage.steps.push(step);
        } else if (!existingStep.isComplete && step.isComplete) {
          existingMessage.steps[index] = step;
        }
      });
      useMessages.getState().updateMessage(existingMessage);
      executeSteps(existingMessage);
    }
  }
}

export async function executeSteps(msg: MessageStore): Promise<void> {
  if (isExecuting || !msg.steps.length) {
    return;
  }
  const wc = useWebContainerStore.getState().webContainer;
  if (!wc) {
    return;
  }
  isExecuting = true;

  for (const step of msg.steps) {
    try {
      if (step.isPending && step.isComplete) {
        console.log(
          `Executing step: ${step.stepType}`,
        );
        await executeStep(wc, step);

        msg.steps[msg.steps.indexOf(step)] = {
          ...step,
          isPending: false,
        };
        console.log(`Step completed: ${step.stepType}`);
        useMessages.getState().updateMessage(msg);
      }
    } catch (error) {
      console.error('Error executing step:', error);
    }
  }
  const messages = useMessages.getState().messages;
  const lastMessage = messages[messages.length - 1];
  const pendingExecution = lastMessage.steps.some(
    (step) => step.isPending && step.isComplete,
  );

  isExecuting = false;

  if (pendingExecution) {
    await executeSteps(lastMessage);
  }
}

async function executeStep(wc: WebContainer, step: Step) {
  switch (step.stepType) {
    case StepType.CREATE_FILE:
      console.log(`Creating file: ${step.filePath}`);
      const file = useFiles.getState().getFile(step.filePath)
      if (!file) {
        console.log(`File already exists: ${step.filePath}, skipping creation.`);
        return;
      }
      return createOrUpdateFile(wc, step.filePath!, file.content);

    case StepType.UPDATE_FILE:
      console.log(`Updating file: ${step.filePath}`);
      const file1 = useFiles.getState().getFile(step.filePath)
      if (!file1) {
        console.log(`File already exists: ${step.filePath}, skipping creation.`);
        return;
      }
      return createOrUpdateFile(wc, step.filePath!, file1.content);

    case StepType.DELETE_FILE:
      console.log(`Deleting file: ${step.filePath}`);
      useFiles.getState().removeFile(step.filePath);
      return wc.fs.rm(step.filePath!, { force: true, recursive: true });

    case StepType.RUN_COMMAND:
      console.log(`Running command: ${step.command}`);
      const [cmd, ...args] = step.command
        .split(" ")
        .map((part: string) => part.trim())
        .filter((part: string) => part.length > 0);

      return executeCommand(wc, cmd, args);
  }
}

async function createOrUpdateFile(
  wc: WebContainer,
  filePath: string,
  content: string,
): Promise<void> {
  const pathParts = filePath.split("/").slice(0, -1);
  const directory = pathParts.join("/");

  try {
    if (directory && directory.trim()) {
      await wc.fs.mkdir(directory, { recursive: true });
    }
  } catch {
    // Directory might already exist
  }

  return wc.fs.writeFile(filePath, content || "");
}
