"use client";

import { useState, useCallback, useEffect } from "react";
import { Trash2, Minimize2, Maximize2 } from "lucide-react";
import { ToolLayout, ToolPanel } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/shared/CopyButton";
import { formatJson, minifyJson, type JsonResult } from "@/lib/tools/json";
import { cn } from "@/lib/utils";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<JsonResult["error"] | null>(null);
  const [indent, setIndent] = useState(2);

  const handleFormat = useCallback(() => {
    const result = formatJson(input, indent);
    if (result.success) {
      setOutput(result.formatted || "");
      setError(null);
    } else {
      setOutput("");
      setError(result.error || null);
    }
  }, [input, indent]);

  const handleMinify = useCallback(() => {
    const result = minifyJson(input);
    if (result.success) {
      setOutput(result.formatted || "");
      setError(null);
    } else {
      setOutput("");
      setError(result.error || null);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  // Auto-format on input change (debounced)
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      handleFormat();
    }, 300);

    return () => clearTimeout(timer);
  }, [input, handleFormat]);

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, and beautify JSON with syntax highlighting and error detection."
    >
      {/* Input Panel */}
      <ToolPanel
        title="Input"
        actions={
          <button
            onClick={handleClear}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
              "bg-secondary hover:bg-secondary/80 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            title="Clear input"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </button>
        }
        className="min-h-[400px]"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className={cn(
            "w-full h-full min-h-[350px] p-4 rounded-md resize-none",
            "bg-background border font-mono text-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            error && "border-destructive"
          )}
          spellCheck={false}
        />
      </ToolPanel>

      {/* Output Panel */}
      <ToolPanel
        title="Output"
        actions={
          <div className="flex items-center gap-2">
            {/* Indent selector */}
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className={cn(
                "px-2 py-1.5 text-sm rounded-md",
                "bg-secondary border-none",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>

            <button
              onClick={handleFormat}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            >
              <Maximize2 className="h-4 w-4" />
              <span>Format</span>
            </button>

            <button
              onClick={handleMinify}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-secondary hover:bg-secondary/80 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            >
              <Minimize2 className="h-4 w-4" />
              <span>Minify</span>
            </button>

            <CopyButton text={output} />
          </div>
        }
        className="min-h-[400px]"
      >
        {error ? (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive">
            <p className="font-semibold text-destructive mb-1">Invalid JSON</p>
            <p className="text-sm text-destructive/90">{error.message}</p>
            {error.line && (
              <p className="text-sm text-muted-foreground mt-2">
                Error at line {error.line}
                {error.column && `, column ${error.column}`}
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className={cn(
              "w-full h-full min-h-[350px] p-4 rounded-md resize-none",
              "bg-muted/50 border font-mono text-sm",
              "focus:outline-none"
            )}
            spellCheck={false}
          />
        )}
      </ToolPanel>
    </ToolLayout>
  );
}
