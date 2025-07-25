"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, FileCode, X, Save, Loader2 } from "lucide-react";
import { shikiToMonaco } from "@shikijs/monaco";
import { type BundledLanguage, createHighlighter } from "shiki";
import { useTheme } from "next-themes";
import { useFileTabStore } from "@/store/fileTabStore";
import { Button } from "@/components/ui/button";
import type { WebContainer } from "@webcontainer/api";
import type { Monaco } from "@monaco-editor/react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const themes = ["dark-plus", "light-plus"];
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
    yml: "yaml",
    yaml: "yaml",
    sh: "shell",
    toml: "toml",
  };
  return languageMap[ext || "javascript"];
};

const getLanguageIcon = (language: string) => {
  const iconProps = { size: 14 };
  const iconMap: Record<string, React.ReactNode> = {
    tsx: <FileCode {...iconProps} className="text-blue-400" />,
    typescript: <FileCode {...iconProps} className="text-blue-400" />,
    css: <FileCode {...iconProps} className="text-purple-400" />,
    javascript: <FileCode {...iconProps} className="text-yellow-400" />,
    jsx: <FileCode {...iconProps} className="text-yellow-400" />,
    html: <FileCode {...iconProps} className="text-orange-400" />,
    json: <FileCode {...iconProps} className="text-green-400" />,
    markdown: <FileCode {...iconProps} className="text-gray-400" />,
  };
  return (
    iconMap[language] || (
      <FileCode {...iconProps} className="text-muted-foreground" />
    )
  );
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

  return (
    <motion.div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 text-sm h-max",
        "transition-[border, width] duration-200 group min-w-0 flex-shrink-0",
        tab.active
          ? "bg-muted/50 text-foreground border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      {getLanguageIcon(getLanguageFromExtension(tab.name))}
      <span className="truncate max-w-[120px]">{tab.name}</span>

      <div
        className={cn(
          "w-1.5 rounded-full bg-orange-400 transition-height duration-200 mx-auto",
          tab.modified ? "h-1.5" : "h-0",
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
  const parts = path.split("/");

  return (
    <div className="flex items-center gap-1 py-2">
      {parts.map((part, index) => (
        <motion.span
          key={index}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.05 }}
        >
          {index < parts.length - 1 ? (
            <>
              {part}
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

export default function CodeEditor({
  webContainer,
}: {
  webContainer: WebContainer;
}) {
  const { fileTabs, setActiveTab, setModified, removeTab } = useFileTabStore();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileContent = useRef<string>("");

  const activeTab = fileTabs.find((tab) => tab.active);
  const activeTheme = theme === "light" ? themes[1] : themes[0];

  useEffect(() => {
    if (!activeTab) {
      return;
    }
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const content = await webContainer.fs.readFile(activeTab.path, "utf-8");
        fileContent.current = content;
      } catch (err) {
        console.error("Failed to load file:", err);
        setError(err instanceof Error ? err.message : "Failed to load file");
        fileContent.current = "";
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activeTab?.path, webContainer]);

  const saveFile = async (path: string) => {
    try {
      await webContainer.fs.writeFile(path, fileContent.current);
      setModified(path, false);
    } catch (err) {
      console.error("Failed to save file:", err);
      setError(err instanceof Error ? err.message : "Failed to save file");
    }
  };

  const handleEditorChange = (value?: string) => {
    if (!value || !activeTab) return;

    fileContent.current = value;
    if (!activeTab.modified) {
      setModified(activeTab.path, true);
    }
  };

  const handleTabChange = (path: string) => setActiveTab(path);

  const handleTabClose = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeTab(path);
  };

  const monacoBeforeMount = async (monaco: Monaco) => {
    try {
      const highlighter = createHighlighter({
        themes,
        langs: languages,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        skipLibCheck: true,
      });

      languages.forEach((lang) => monaco.languages.register({ id: lang }));
      shikiToMonaco(await highlighter, monaco);
      monaco.editor.setTheme(activeTheme);
    } catch (error) {
      console.error("Failed to setup Monaco editor:", error);
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

  return (
    <div className="h-full flex flex-col bg-card border border-border/50 rounded-lg overflow-hidden">
      <div className="border-b border-border/50 overflow-x-auto flex overflow-y-hidden relative h-fit">
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
          {isLoading && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Loader2 size={12} className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}
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
        </div>
      </div>

      <div className="flex-1 relative">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-destructive">
              <p className="font-medium">Failed to load file</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Loader2 size={32} className="mx-auto mb-4 animate-spin" />
              <p>Loading file...</p>
            </div>
          </div>
        ) : (
          <Editor
            value={fileContent.current}
            language={getLanguageFromExtension(activeTab.name)}
            theme={activeTheme}
            onChange={handleEditorChange}
            beforeMount={monacoBeforeMount}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
              fontLigatures: true,
              lineHeight: 22,
              minimap: { enabled: false },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              autoClosingBrackets: "always",
              autoIndent: "full",
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
            }}
          />
        )}
      </div>
    </div>
  );
}
