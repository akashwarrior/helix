"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { StepType } from "@/lib/server/constants";
import type { Step } from "@/store/messages";

interface StepListProps {
  messageId: string;
  steps: Step[];
  title?: string;
}

export default function StepList({
  messageId,
  steps,
  title = "Build plan",
}: StepListProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pending = steps.some((s) => s.isPending);

  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="mt-3 overflow-hidden bg-card/70 border rounded-xl backdrop-blur-sm shadow-sm"
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={`steps-panel-${messageId}`}
        className="flex items-center gap-3 w-full text-left group hover:bg-muted/40 rounded-xl p-3 transition-colors"
      >
        <ChevronRight
          size={16}
          className={cn(
            "text-muted-foreground group-hover:text-foreground transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />

        <span className="text-sm font-medium text-foreground truncate flex-1">
          {title}
        </span>

        <div
          className={cn(
            "w-2 h-2 rounded-full",
            pending ? "bg-cyan-400 animate-pulse" : "bg-muted-foreground/70",
          )}
          aria-label={pending ? "In progress" : "Complete"}
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="px-4 pb-3 pt-1 space-y-2" aria-live="polite">
              {steps.map((step, index) => {
                const isCommand = step.stepType === StepType.RUN_COMMAND;
                const text = isCommand
                  ? `${step.isPending ? "Running" : "Executed"} ${step.command}`
                  : `${step.isPending ? "Creating" : "Created"} ${step.filePath}`;

                return (
                  <motion.li
                    key={`step-${index}-${messageId}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-4 w-4 mt-0.5 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      {step.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                    </div>

                    <div className="relative">
                      <span className="text-muted-foreground truncate">
                        {text}
                      </span>
                      {step.isPending && (
                        <motion.span
                          className="absolute inset-0 bg-clip-text text-transparent truncate"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, rgba(34,211,238,0) 0%, rgba(34,211,238,0) 45%, rgba(34,211,238,1) 50%, rgba(34,211,238,0) 55%, rgba(34,211,238,0) 100%)",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{
                            backgroundPosition: ["110% 0%", "-10% 0%"],
                          }}
                          transition={{
                            duration: 1.2,
                            delay: 0.5,
                            ease: "linear",
                            repeat: Infinity,
                          }}
                        >
                          {text}
                        </motion.span>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
