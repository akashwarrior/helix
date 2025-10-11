import type { Command, CommandLog } from '@/lib/types'
import { create } from 'zustand'

interface CommandStore {
    commands: Command[]
    upsertCommand: (command: Omit<Command, 'startedAt'>) => void
    addLog: (data: { sandboxId: string; cmdId: string; log: CommandLog }) => void
}

export const useCommandStore = create<CommandStore>((set) => ({
    commands: [],

    upsertCommand: (cmd) => {
        set((state) => {
            const existingIdx = state.commands.findIndex((c) => c.cmdId === cmd.cmdId)
            const idx = existingIdx !== -1 ? existingIdx : state.commands.length
            const prev = state.commands[idx] ?? { startedAt: Date.now(), logs: [] }
            const cmds = [...state.commands]
            cmds[idx] = { ...prev, ...cmd }
            return { commands: cmds }
        })
    },

    addLog: (data) => {
        set((state) => {
            const idx = state.commands.findIndex((c) => c.cmdId === data.cmdId)
            if (idx === -1) {
                console.warn(`Command with ID ${data.cmdId} not found.`)
                return state
            }
            const updatedCmds = [...state.commands]
            updatedCmds[idx] = {
                ...updatedCmds[idx],
                logs: [...(updatedCmds[idx].logs ?? []), data.log],
            }
            return { commands: updatedCmds }
        })
    },
}))