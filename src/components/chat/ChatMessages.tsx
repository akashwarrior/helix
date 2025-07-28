'use client';

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { StepType } from "@/lib/server/constants";
import { useMessagesStore } from "@/store/messagesStore";
import {
    Check,
    FileCode,
    Terminal,
    Folder,
} from "lucide-react";

export default function ChatMessages() {
    const messages = useMessagesStore((state) => state.messages);

    return messages.map(({ id, role, content, steps }) => (
        <div
            key={id}
            className={cn(
                "rounded-2xl py-4 px-5",
                role === "user" && "bg-primary/8 max-w-[85%] ml-auto",
            )}
        >
            <p className="whitespace-pre-wrap leading-relaxed text-foreground overflow-hidden truncate">
                {content.trim()}
            </p>

            {steps?.length > 0 && (
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                        <span className="px-3 py-1 bg-background/80 rounded-full border border-border/50 text-xs">
                            Execution Steps ({steps.length})
                        </span>
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                    </div>

                    <div className="space-y-3">
                        {steps.map(({ stepType, content, isPending, path }, index) => {
                            const isFile = stepType === StepType.CREATE_FILE;
                            return (
                                <motion.div
                                    key={`msg-${id}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                                        isPending
                                            ? "bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30"
                                            : "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/30 hover:bg-green-50/70 dark:hover:bg-green-950/30",
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-200",
                                                isPending
                                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                                                    : "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400",
                                            )}
                                        >
                                            {isPending ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                                                />
                                            ) : (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 20,
                                                    }}
                                                >
                                                    <Check size={12} />
                                                </motion.div>
                                            )}
                                        </div>

                                        {!isPending && (
                                            <motion.div
                                                className="w-px bg-border/50 mt-2"
                                                initial={{ height: 0 }}
                                                animate={{ height: 32 }}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            {isFile ? (
                                                <FileCode
                                                    size={14}
                                                    className="text-blue-500 flex-shrink-0"
                                                />
                                            ) : (
                                                <Terminal
                                                    size={14}
                                                    className="text-green-500 flex-shrink-0"
                                                />
                                            )}
                                            <span className="text-sm font-medium text-foreground truncate">
                                                {isFile
                                                    ? isPending
                                                        ? "Creating File"
                                                        : "File Created"
                                                    : isPending
                                                        ? "Running Command"
                                                        : "Command Executed"}
                                            </span>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={cn(
                                                    "px-2 py-0.5 text-xs rounded-full font-medium ml-auto",
                                                    isPending
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                        : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                                                )}
                                            >
                                                {isPending ? "In Progress" : "Completed"}
                                            </motion.div>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            {isFile ? (
                                                <div className="flex items-center gap-2 font-mono bg-muted/30 px-3 py-2 rounded-md border">
                                                    <Folder
                                                        size={12}
                                                        className="text-muted-foreground"
                                                    />
                                                    <span className="text-primary break-all font-medium">
                                                        {path}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="font-mono bg-muted/30 px-3 py-2 rounded-md border text-xs">
                                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                                        $
                                                    </span>{" "}
                                                    <span className="text-foreground/80">
                                                        {content}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    ))

}