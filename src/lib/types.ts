import type { Metadata } from '@/ai/messages/metadata'
import type { DataPart } from '@/ai/messages/data-parts'
import type { ToolSet } from '@/ai/tools'
import type { UIMessage } from 'ai'

export interface ErrorState {
  type: "network" | "auth" | "validation" | "server" | null;
  message: string;
}

export interface File {
  path: string;
  content: string;
}

export interface FileNode {
  type: "file" | "folder";
  path: string;
}

export interface Command {
  background?: boolean
  cmdId: string
  startedAt: number
  command: string
  args: string[]
  exitCode?: number
  logs?: CommandLog[]
}

export interface CommandLog {
  data: string
  stream: 'stdout' | 'stderr'
  timestamp: number
}


export type ChatUIMessage = UIMessage<Metadata, DataPart, ToolSet>