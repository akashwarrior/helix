import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  FileCode,
  X,
  Save,
  FileText,
  Braces,
} from "lucide-react";
import { shikiToMonaco } from "@shikijs/monaco";
import { type BundledLanguage, BundledTheme, createHighlighter } from "shiki";
import { useTheme } from "next-themes";
import { useFileTabStore } from "@/store/fileTabStore";
import { Button } from "@/components/ui/button";
import type { Monaco } from "@monaco-editor/react";
import { useWebContainerStore } from "@/store/webContainerStore";
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

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    tsx: "typescript",
    ts: "typescript",
    jsx: "javascript",
    js: "javascript",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
  };
  return languageMap[ext || ""] || "javascript";
};

interface TabProps {
  tab: {
    path: string;
    name: string;
    modified: boolean;
    active: boolean;
  };
  onTabChange: (path: string) => void;
  onTabClose: (path: string, e: React.MouseEvent) => void;
}

function Tab({ tab, onTabChange, onTabClose }: TabProps) {
  const handleClick = () => onTabChange(tab.path);
  const handleClose = (e: React.MouseEvent) => onTabClose(tab.path, e);

  const getFileIcon = (filename: string) => {
    const language = getLanguageFromExtension(filename);

    if (["typescript", "javascript"].includes(language)) {
      return <Braces size={16} className="flex-shrink-0" />;
    }
    if (["json", "yaml", "toml"].includes(language)) {
      return <Braces size={16} className="flex-shrink-0" />;
    }
    if (["markdown", "plaintext"].includes(language)) {
      return <FileText size={16} className="flex-shrink-0" />;
    }
    return <FileCode size={16} className="flex-shrink-0" />;
  };

  return (
    <motion.div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 text-sm h-max cursor-pointer",
        "transition-[border, width] duration-200 group min-w-0 flex-shrink-0",
        tab.active
          ? "bg-muted/50 text-foreground border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      title={tab.path}
    >
      <div
        className={cn(tab.active ? "text-primary" : "text-muted-foreground")}
      >
        {getFileIcon(tab.name)}
      </div>
      <span className="truncate max-w-[120px]">{tab.name}</span>

      <div
        className={cn(
          "w-1.5 rounded-full bg-orange-400 transition-all duration-200 mx-auto",
          tab.modified ? "h-1.5 opacity-100" : "h-0 opacity-0",
        )}
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={handleClose}
        className="h-4 w-4 hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </Button>
    </motion.div>
  );
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

export default function CodeEditor() {
  const { fileTabs, setActiveTab, setModified, removeTab } = useFileTabStore();
  const { theme } = useTheme();
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const webContainer = useWebContainerStore((state) => state.webContainer);

  const activeTab = fileTabs.find((tab) => tab.active);
  const activeTheme = theme === "light" ? themes[1] : themes[0];

  // Load file content when active tab changes
  useEffect(() => {
    const loadFileContent = async () => {
      if (!webContainer || !activeTab) {
        setFileContent("");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const content = await webContainer.fs.readFile(activeTab.path, "utf-8");
        setFileContent(content);
      } catch (err) {
        console.error("Failed to read file:", err);
        setError(`Failed to read file: ${activeTab.path}`);
        setFileContent("");
      } finally {
        setIsLoading(false);
      }
    };

    loadFileContent();
  }, [webContainer, activeTab?.path]);

  const saveFile = async (path: string) => {
    if (!webContainer || !fileContent) return;

    try {
      await webContainer.fs.writeFile(path, fileContent);
      setModified(path, false);
      toast.success(`File saved: ${path.split("/").pop()}`);
    } catch (err) {
      console.error("Failed to save file:", err);
      const errorMessage = `Failed to save file: ${path.split("/").pop()}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditorChange = (value?: string) => {
    if (value === undefined || !activeTab) return;

    setFileContent(value);
    if (!activeTab.modified) {
      setModified(activeTab.path, true);
    }
  };

  const handleTabChange = (path: string) => setActiveTab(path);

  const handleTabClose = (path: string, e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    removeTab(path);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeTab && activeTab.modified) {
          saveFile(activeTab.path);
        }
      }
      // Close tab with Ctrl+W
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        if (activeTab) {
          handleTabClose(activeTab.path, e);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  // Auto-save functionality
  useEffect(() => {
    if (!activeTab?.modified) return;

    const autoSaveTimeout = setTimeout(() => {
      if (activeTab.modified) {
        saveFile(activeTab.path);
        toast.success("Auto-saved", { duration: 1000 });
      }
    }, 30000); // Auto-save after 30 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [fileContent, activeTab?.path]);

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
      setError("Failed to initialize code editor");
    }
  };

  if (!activeTab) {
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-card border border-border/50 rounded-lg">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-card border border-border/50 rounded-lg">
        <div className="text-center text-destructive">
          <FileCode size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Error loading file</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border/50 overflow-hidden">
      <div className="border-b border-border/50 overflow-x-auto flex overflow-y-hidden relative h-fit [&::-webkit-scrollbar]:hidden">
        {fileTabs.map((tab) => (
          <Tab
            key={tab.path}
            tab={tab}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
          />
        ))}
      </div>

      <div className="px-4 bg-muted/20 border-b border-border/30 flex items-center justify-between text-xs">
        <Breadcrumb path={activeTab.path} />

        <div className="flex items-center gap-2">
          {activeTab.modified && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveFile(activeTab.path)}
              className="h-6 px-2 text-xs hover:bg-primary/10"
            >
              <Save size={12} className="mr-1" />
              Save
            </Button>
          )}
          <span className="text-xs text-muted-foreground">
            {getLanguageFromExtension(activeTab.name)}
          </span>
        </div>
      </div>

      <div className="flex-1 relative">
        <Editor
          value={fileContent}
          language={getLanguageFromExtension(activeTab.name)}
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

      {/* Status Bar */}
      <div className="border-t border-border/30 bg-muted/20 px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {fileContent.split("\n").length}</span>
          <span>Size: {new Blob([fileContent]).size} bytes</span>
          <span className="capitalize">
            {getLanguageFromExtension(activeTab.name)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab.modified && (
            <span className="text-orange-400">● Unsaved changes</span>
          )}
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
