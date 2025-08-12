import { useMessages, type MessageStore, type Step } from "@/store/messages";
import { useWebContainerStore } from "@/store/webContainer";
import { executeCommand } from "@/lib/webcontainer";
import type { WebContainer } from "@webcontainer/api";
import type { Role } from "@prisma/client";
import { StepType, parseXml, type ParsedAction } from "./constants";
import { useFiles } from "@/store/files";

let isExecuting = false;

function createStepFromAction(action: ParsedAction): Step {
  switch (action.type) {
    case StepType.RUN_COMMAND:
      return {
        stepType: StepType.RUN_COMMAND,
        isPending: true,
        isComplete: action.isComplete,
        command: action.content,
      };
    case StepType.CREATE_FILE:
    default:
      return {
        stepType: StepType.CREATE_FILE,
        isPending: true,
        isComplete: action.isComplete,
        filePath: action.filePath || "",
      };
  }
}

export function processXmlResponse(
  response: string,
  id: string,
  role: Role,
): void {
  if (!response) return;
  const { beforeArtifact, actions, title } = parseXml(response);

  const message: MessageStore = {
    id,
    content: beforeArtifact,
    role: role,
    createdAt: new Date(),
    steps: actions.map(createStepFromAction),
    title: title || "Build plan",
  };

  const existingMessage = useMessages
    .getState()
    .messages.findLast((m) => m.id === id);

  if (!existingMessage) {
    useMessages.getState().addMessage(message);
    executeSteps(message, actions);
    return;
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
      useMessages.getState().updateMessage(existingMessage);
      executeSteps(existingMessage, actions);
    }
  }
}

export async function executeSteps(
  msg: MessageStore,
  actions: ParsedAction[],
): Promise<void> {
  if (isExecuting || !msg.steps.length || !actions.length) {
    return;
  }
  isExecuting = true;
  console.log(msg.steps.length, actions.length);
  const wc = useWebContainerStore.getState().webContainer;
  if (!wc) {
    await new Promise((res) => setTimeout(res, 2000));
    isExecuting = false;
    executeSteps(msg, actions);
    return;
  }

  try {
    for (let i = 0; i < msg.steps.length; i++) {
      const step = msg.steps[i];

      if (step.isPending && step.isComplete) {
        try {
          console.log(
            `Executing step ${i + 1}/${msg.steps.length}: ${step.stepType}`,
          );
          await executeStep(wc, actions[i]);

          msg.steps[i] = {
            ...step,
            isPending: false,
          };
          console.log(`Step ${i + 1} completed: ${step.stepType}`);
        } catch (error) {
          console.error(`Error executing step ${step.stepType}:`, error);
          msg.steps[i] = {
            ...step,
            isPending: false,
          };
        }
      }
      useMessages.getState().updateMessage(msg);
    }
  } finally {
    const messages = useMessages.getState().messages;
    const lastMessage = messages[messages.length - 1];
    const pendingExecution = lastMessage.steps.some(
      (step) => step.isPending && step.isComplete,
    );

    isExecuting = false;

    if (pendingExecution) {
      await executeSteps(lastMessage, actions);
    }
  }
}

async function executeStep(
  wc: WebContainer,
  action: ParsedAction,
): Promise<void> {
  switch (action.type) {
    case StepType.CREATE_FILE:
      console.log(`Creating file: ${action.filePath}`);
      await createOrUpdateFile(wc, action.filePath!, action.content);
      useFiles.getState().addFile(action.filePath!, action.content ?? "");
      break;

    case StepType.UPDATE_FILE:
      console.log(`Updating file: ${action.filePath}`);
      await createOrUpdateFile(wc, action.filePath!, action.content);
      // Reflect update in store if file exists
      useFiles.getState().modifyContent(action.filePath!, action.content ?? "");
      break;

    case StepType.DELETE_FILE:
      console.log(`Deleting file: ${action.filePath}`);
      try {
        await wc.fs.rm(action.filePath!, { force: true, recursive: true });
      } catch {
        // File might not exist
      }
      useFiles.getState().removeFile(action.filePath!);
      break;

    case StepType.RUN_COMMAND:
      console.log(`Running command: ${action.content}`);
      const [cmd, ...args] = action.content
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
      console.warn("Unknown step type:", action.type);
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
