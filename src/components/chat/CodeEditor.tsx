import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, FileCode } from "lucide-react";
import { shikiToMonaco } from "@shikijs/monaco";
import { type BundledLanguage, BundledTheme, createHighlighter } from "shiki";
import { useTheme } from "next-themes";
import { useFiles } from "@/store/files";
import type { Monaco } from "@monaco-editor/react";
import { useWebContainerStore } from "@/store/webContainer";
import { toast } from "sonner";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const themes: BundledTheme[] = ["vitesse-dark", "vitesse-light"];
const languages: BundledLanguage[] = [
  "tsx",
  "jsx",
  "css",
  "html",
  "json",
  "ts",
  "js",
  "toml",
  "md",
  "yaml",
  "sh",
];

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

export default function CodeEditor() {
  const files = useFiles((s) => s.files);
  const modifyContent = useFiles((s) => s.modifyContent);
  const openFilePath = useFiles((s) => s.openFilePath);
  const { theme } = useTheme();
  const webContainer = useWebContainerStore((state) => state.webContainer);

  const openedFile = openFilePath
    ? files.find((f) => f.path === openFilePath)
    : undefined;
  const fileName = openedFile?.path.split("/").pop() || "untitled";
  const activeTheme = theme === "light" ? themes[1] : themes[0];

  const saveFile = async (path: string) => {
    if (!webContainer) return;
    const fileContent = openedFile?.content || "";

    try {
      await webContainer.fs.writeFile(path, fileContent);
      modifyContent(path, fileContent);
      toast.success(`File saved: ${path.split("/").pop()}`);
    } catch (err) {
      console.error("Failed to save file:", err);
      const errorMessage = `Failed to save file: ${path.split("/").pop()}`;
      toast.error(errorMessage);
    }
  };

  const handleEditorChange = (value?: string) => {
    if (value === undefined || !openedFile) return;
    modifyContent(openedFile.path, value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!openedFile) return;
        saveFile(openedFile.path);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openedFile]);

  const monacoBeforeMount = async (monaco: Monaco) => {
    try {
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

  if (!openedFile) {
    return (
      <div className="h-full flex items-center justify-center bg-card border border-border/50 rounded-lg">
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

  return (
    <div className="h-full flex flex-col bg-card border border-border/50 overflow-hidden">
      <div className="px-4 bg-muted/20 border-b border-border/30 text-xs">
        <Breadcrumb path={openedFile.path} />
      </div>

      <div className="flex-1 relative">
        <Editor
          value={openedFile.content}
          language={fileName.split(".").pop() || "js"}
          theme={activeTheme}
          onChange={handleEditorChange}
          beforeMount={monacoBeforeMount}
          options={{
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
          <span>Lines: {openedFile.content?.split("\n").length}</span>
          <span>Size: {new Blob([openedFile.content || ""]).size} bytes</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
