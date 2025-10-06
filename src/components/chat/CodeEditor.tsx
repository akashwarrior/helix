'use client';

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ChevronRight, FileCode } from "lucide-react";
import { shikiToMonaco } from "@shikijs/monaco";
import { type BundledLanguage, BundledTheme, createHighlighter } from "shiki";
import { useTheme } from "next-themes";
import type { Monaco } from "@monaco-editor/react";
import { PulseLoader } from "react-spinners";
import useSWR from "swr";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const themes: BundledTheme[] = ["vitesse-dark", "vitesse-light"];
const extensionMap: Record<string, BundledLanguage> = {
  // JavaScript/TypeScript
  js: 'jsx',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  mjs: 'javascript',
  cjs: 'javascript',

  // Python
  py: 'python',
  pyw: 'python',
  pyi: 'python',

  // Web technologies
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  less: 'less',

  // Other popular languages
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  h: 'c',
  hpp: 'cpp',
  cs: 'csharp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  fish: 'bash',
  ps1: 'powershell',

  // Data formats
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  ini: 'ini',

  // Markup
  md: 'markdown',
  markdown: 'markdown',
  tex: 'latex',

  // Database
  sql: 'sql',

  // Config files
  dockerfile: 'dockerfile',
  gitignore: 'bash',
  env: 'bash',
}

function detectLanguageFromFilename(path: string): string {
  const pathParts = path.split('/')
  const extension = pathParts[pathParts.length - 1]
    ?.split('.')
    .pop()
    ?.toLowerCase()

  return extensionMap[extension || ''] || 'text'
}


const Breadcrumb = ({ path }: { path: string }) => {
  const parts = path.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1 py-2">
      {parts.map((part, index) => (
        <motion.span
          key={`${index}-${part}`}
          className={cn(
            "flex items-center gap-1 transition-colors cursor-pointer text-xs",
            index < parts.length - 1
              ? "text-muted-foreground hover:text-foreground"
              : "text-foreground font-medium",
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          {index < parts.length - 1 ? (
            <>
              <span className="hover:text-primary transition-colors">
                {part}
              </span>
              <ChevronRight size={12} className="text-muted-foreground/50" />
            </>
          ) : (
            <span className="text-foreground">{part}</span>
          )}
        </motion.span>
      ))}
    </div>
  );
};

export default function CodeEditor({ sandboxId, path }: { sandboxId: string, path: string }) {
  const content = useSWR(
    `/api/sandboxes/${sandboxId}/files?path=${path}`,
    async (pathname: string, init: RequestInit) => {
      const response = await fetch(pathname, init)
      const text = await response.text()
      return text
    },
    { refreshInterval: 1000 }
  )

  const { theme } = useTheme();
  const activeTheme = theme === "light" ? themes[1] : themes[0];

  const monacoBeforeMount = async (monaco: Monaco) => {
    try {
      const languages = Object.values(extensionMap);
      const highlighter = await createHighlighter({
        themes,
        langs: languages,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      });

      languages.forEach((lang) => monaco.languages.register({ id: lang }));
      shikiToMonaco(highlighter, monaco);
      monaco.editor.setTheme(activeTheme);
    } catch (error) {
      console.error("Failed to setup Monaco editor:", error);
    }
  };

  if (!path) {
    return (
      <div className="h-full w-3/4 flex items-center justify-center bg-card/50 border border-border/50 rounded-lg">
        <div className="text-center text-muted-foreground">
          <FileCode size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No file selected</p>
          <p className="text-sm">
            Open a file from the explorer to start editing
          </p>
        </div>
      </div>
    );
  }

  if (content.isLoading || !content.data) {
    return (
      <div className="w-3/4 h-full flex items-center text-center">
        <div className="flex-1">
          <PulseLoader className="opacity-60" size={8} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-3/4 h-full flex flex-col border bg-card/50 border-border/50 overflow-hidden">
      <div className="px-4 bg-muted/20 border-b border-border/30 text-xs">
        <Breadcrumb path={path} />
      </div>

      <div className="flex-1 relative">
        <Editor
          value={content.data}
          language={detectLanguageFromFilename(path)}
          theme={activeTheme}
          beforeMount={monacoBeforeMount}
          options={{
            readOnly: true,
            fontSize: 13.5,
            fontLigatures: true,
            lineHeight: 22,
            minimap: { enabled: false },
            autoClosingBrackets: "always",
            autoIndent: "full",
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            wordWrap: "on",
            renderWhitespace: "selection",
          }}
        />
      </div>

      <div className="border-t border-border/30 bg-muted/20 px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {content.data.split("\n").length}</span>
          <span>Size: {new Blob([content.data]).size} bytes</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
