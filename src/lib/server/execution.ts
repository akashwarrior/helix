import {
  useMessagesStore,
  type MessageStore,
  type Step,
} from "@/store/messagesStore";
import { useWebContainerStore } from "@/store/webContainerStore";
import { executeCommand } from "@/lib/webcontainer";
import type { WebContainer } from "@webcontainer/api";
import type { Role } from "@prisma/client";
import { StepType, parseXml, type ParsedAction } from "./constants";

let isExecuting = false;

function createStepFromAction(action: ParsedAction): Step {
  switch (action.type) {
    case "shell":
      return {
        stepType: StepType.RUN_COMMAND,
        isPending: true,
        isComplete: action.isComplete,
        command: action.content,
      };
    case "file":
    default:
      return {
        stepType: StepType.CREATE_FILE,
        isPending: true,
        isComplete: action.isComplete,
        filePath: action.filePath || "",
        content: action.content,
      };
  }
}

export function processXmlResponse(
  response: string,
  id: string,
  role: Role,
): void {
  if (!response) return;
  const { beforeArtifact, actions } = parseXml(response);

  const message: MessageStore = {
    id,
    content: beforeArtifact,
    role: role as "user" | "assistant" | "data",
    createdAt: new Date(),
    steps: actions.map(createStepFromAction),
  };

  const existingMessage = useMessagesStore
    .getState()
    .messages.findLast((m) => m.id === id);

  if (!existingMessage) {
    useMessagesStore.getState().addMessage(message);
  } else {
    const hasNewSteps = existingMessage.steps.length !== message.steps.length;
    const hasContentChange = existingMessage.content !== message.content;
    const hasIncompleteSteps = existingMessage.steps.findLast(
      (s) => !s.isComplete,
    );

    if (hasNewSteps || hasContentChange || hasIncompleteSteps) {
      existingMessage.content = message.content;
      message.steps.forEach((step, index) => {
        const existingStep = existingMessage.steps[index];
        if (!existingStep) {
          existingMessage.steps.push(step);
        } else if (!existingStep.isComplete && step.isComplete) {
          existingMessage.steps[index] = step;
        }
      });
      useMessagesStore.getState().updateMessage(existingMessage);
      executeSteps();
    }
  }
}

export const executeSteps = async (): Promise<void> => {
  const wc = useWebContainerStore.getState().webContainer;
  if (!wc) {
    console.warn("WebContainer is not initialized");
    return;
  }

  if (isExecuting) {
    return;
  }

  isExecuting = true;
  try {
    const msg = useMessagesStore
      .getState()
      .messages.findLast((m: MessageStore) => m.steps.length > 0);
    if (!msg) {
      return;
    }

    const updatedMessage = { ...msg, steps: [...msg.steps] };

    for (let i = 0; i < updatedMessage.steps.length; i++) {
      const step = updatedMessage.steps[i];

      if (step.isPending && step.isComplete) {
        try {
          console.log(
            `Executing step ${i + 1}/${updatedMessage.steps.length}: ${step.stepType}`,
          );
          await executeStep(wc, step);

          updatedMessage.steps[i] = {
            ...step,
            isPending: false,
          };
          console.log(`Step ${i + 1} completed: ${step.stepType}`);
        } catch (error) {
          console.error(`Error executing step ${step.stepType}:`, error);
          updatedMessage.steps[i] = {
            ...step,
            isPending: false,
          };
        }
      }
    }

    useMessagesStore.getState().updateMessage(updatedMessage);
  } finally {
    const pendingExecution = useMessagesStore
      .getState()
      .messages.findLast((m: MessageStore) =>
        m.steps.some((s: Step) => s.isPending && s.isComplete),
      );
    isExecuting = false;
    if (pendingExecution) {
      executeSteps();
    }
  }
};

async function executeStep(wc: WebContainer, step: Step): Promise<void> {
  switch (step.stepType) {
    case StepType.CREATE_FILE:
      console.log(`Creating file: ${step.filePath}`);
      await createOrUpdateFile(wc, step.filePath, step.content || "");
      break;

    case StepType.UPDATE_FILE:
      console.log(`Updating file: ${step.filePath}`);
      await createOrUpdateFile(wc, step.filePath, step.content || "");
      break;

    case StepType.DELETE_FILE:
      console.log(`Deleting file: ${step.filePath}`);
      try {
        await wc.fs.rm(step.filePath, { force: true, recursive: true });
      } catch {
        // File might not exist
      }
      break;

    case StepType.RUN_COMMAND:
      console.log(`Running command: ${step.command}`);
      const [cmd, ...args] = step.command
        .split(" ")
        .map((part: string) => part.trim())
        .filter((part: string) => part.length > 0);

      if (cmd) {
        await executeCommand(wc, cmd, args);
      } else {
        console.warn("Empty command provided");
      }
      break;

    default:
      console.warn(
        "Unknown step type:",
        (step as { stepType: string }).stepType,
      );
      break;
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

  try {
    await wc.fs.writeFile(filePath, content || "");
    console.log(`File operation successful: ${filePath}`);
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
    throw error;
  }
}
