"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Trash2, Upload, ArrowRightLeft, Download } from "lucide-react";
import { ToolLayout, ToolPanel } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/shared/CopyButton";
import {
  encodeBase64,
  decodeBase64,
  isValidBase64,
  fileToBase64,
} from "@/lib/tools/base64";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processInput = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    const result = mode === "encode" ? encodeBase64(input) : decodeBase64(input);

    if (result.success) {
      setOutput(result.output || "");
      setError(null);
    } else {
      setOutput("");
      setError(result.error || "An error occurred");
    }
  }, [input, mode]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  const handleSwap = useCallback(() => {
    // Swap mode and use current output as new input
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    if (output) {
      setInput(output);
    }
  }, [mode, output]);

  const handleFileUpload = useCallback(async (file: File) => {
    const result = await fileToBase64(file);
    if (result.success) {
      setMode("decode");
      setInput(result.output || "");
      setOutput("");
      setError(null);
    } else {
      setError(result.error || "Failed to read file");
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDownload = useCallback(() => {
    if (!output) return;

    // Create blob and download
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, mode]);

  // Auto-detect mode when pasting
  useEffect(() => {
    if (input && isValidBase64(input) && mode === "encode") {
      // If input looks like Base64 and we're in encode mode, suggest decode
      // But don't auto-switch to avoid confusion
    }
  }, [input, mode]);

  // Process on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      processInput();
    }, 300);

    return () => clearTimeout(timer);
  }, [processInput]);

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 strings. Supports file uploads."
    >
      {/* Input Panel */}
      <ToolPanel
        title={mode === "encode" ? "Text Input" : "Base64 Input"}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-secondary hover:bg-secondary/80 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              title="Upload file"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
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
          </div>
        }
        className="min-h-[400px]"
      >
        <div
          className={cn(
            "relative h-full",
            isDragging && "ring-2 ring-primary ring-offset-2 rounded-md"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 string to decode..."
            }
            className={cn(
              "w-full h-full min-h-[350px] p-4 rounded-md resize-none",
              "bg-background border font-mono text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              error && "border-destructive"
            )}
            spellCheck={false}
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <p className="text-lg font-medium">Drop file here</p>
            </div>
          )}
        </div>
      </ToolPanel>

      {/* Output Panel */}
      <ToolPanel
        title={mode === "encode" ? "Base64 Output" : "Decoded Text"}
        actions={
          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <button
              onClick={handleSwap}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>{mode === "encode" ? "Decode" : "Encode"}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!output}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-secondary hover:bg-secondary/80 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              title="Download result"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>

            <CopyButton text={output} />
          </div>
        }
        className="min-h-[400px]"
      >
        {error ? (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive">
            <p className="font-semibold text-destructive mb-1">Error</p>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
        ) : (
          <textarea
            value={output}
            readOnly
            placeholder={
              mode === "encode"
                ? "Base64 encoded string will appear here..."
                : "Decoded text will appear here..."
            }
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
