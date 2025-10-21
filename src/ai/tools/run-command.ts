import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import { Command, Sandbox } from '@vercel/sandbox'
import { getRichError } from './get-rich-error'
import { tool } from 'ai'
import description from './run-command.md'
import { createSandbox } from '../config'
import z from 'zod/v4'

interface Params {
  projectId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const runCommand = ({ writer, projectId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      command: z
        .string()
        .describe(
          "The base command to run (e.g., 'npm', 'node', 'python', 'ls', 'cat'). Do NOT include arguments here. IMPORTANT: Each command runs independently in a fresh shell session - there is no persistent state between commands. You cannot use 'cd' to change directories for subsequent commands."
        ),
      args: z
        .array(z.string())
        .optional()
        .describe(
          "Array of arguments for the command. Each argument should be a separate string (e.g., ['install', '--verbose'] for npm install --verbose, or ['src/index.js'] to run a file, or ['-la', './src'] to list files). IMPORTANT: Use relative paths (e.g., 'src/file.js') or absolute paths instead of trying to change directories with 'cd' first, since each command runs in a fresh shell session."
        ),
      sudo: z
        .boolean()
        .optional()
        .describe('Whether to run the command with sudo'),
      wait: z
        .boolean()
        .describe(
          'Whether to wait for the command to finish before returning. If true, the command will block until it completes, and you will receive its output.'
        ),
    }),
    execute: async (
      { command, sudo, wait, args = [] },
      { toolCallId }
    ) => {
      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: { command, args, status: 'executing' },
      })

      let sandbox: Sandbox | null = null

      try {
        sandbox = await createSandbox(projectId);
      } catch (error) {
        const richError = getRichError({
          action: 'get sandbox id',
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            command,
            args,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }

      let cmd: Command | null = null

      try {
        cmd = await sandbox.runCommand({
          detached: true,
          cmd: command,
          args,
          sudo,
        })
      } catch (error) {
        const richError = getRichError({
          action: 'run command in sandbox',
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            command,
            args,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          commandId: cmd.cmdId,
          command,
          args,
          status: 'executing',
        },
      })

      if (!wait) {
        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            commandId: cmd.cmdId,
            command,
            args,
            status: 'running',
          },
        })

        return {
          message: `The command '${command} ${args.join(' ')}' has been started in the background in the sandbox.`,
          commandId: cmd.cmdId,
        }
      }

      writer.write({
        id: toolCallId,
        type: 'data-run-command',
        data: {
          commandId: cmd.cmdId,
          command,
          args,
          status: 'waiting',
        },
      })

      const done = await cmd.wait()
      try {
        const [stdout, stderr] = await Promise.all([
          done.stdout(),
          done.stderr(),
        ])

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            commandId: cmd.cmdId,
            command,
            args,
            exitCode: done.exitCode,
            status: 'done',
          },
        })

        return {
          message: `The command has finished with exit code ${done.exitCode}.`,
          stdout,
          stderr,
        }
      } catch (error) {
        const richError = getRichError({
          action: 'wait for command to finish',
          args: { commandId: cmd.cmdId },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-run-command',
          data: {
            commandId: cmd.cmdId,
            command,
            args,
            error: richError.error,
            status: 'error',
          },
        })

        return richError.message
      }
    },
  })
