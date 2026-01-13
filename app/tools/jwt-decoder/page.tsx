"use client";

import { useState, useCallback, useEffect } from "react";
import { Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { ToolLayout, ToolPanel } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/shared/CopyButton";
import { decodeJwt, claimDescriptions, type JwtResult } from "@/lib/tools/jwt";
import { cn } from "@/lib/utils";

export default function JwtDecoderPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JwtResult | null>(null);

  const handleDecode = useCallback(() => {
    const decoded = decodeJwt(input);
    setResult(decoded);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  // Auto-decode on input change (debounced)
  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const timer = setTimeout(() => {
      handleDecode();
    }, 300);

    return () => clearTimeout(timer);
  }, [input, handleDecode]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "long",
    });
  };

  const renderClaimValue = (key: string, value: unknown) => {
    // Format timestamps
    if ((key === "exp" || key === "iat" || key === "nbf") && typeof value === "number") {
      const date = new Date(value * 1000);
      return (
        <div>
          <span className="text-muted-foreground">{value}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({formatTimestamp(date)})
          </span>
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JWT tokens. Validate expiration and view claims."
    >
      {/* Input Panel */}
      <ToolPanel
        title="JWT Token"
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
          placeholder="Paste your JWT token here..."
          className={cn(
            "w-full h-full min-h-[350px] p-4 rounded-md resize-none",
            "bg-background border font-mono text-sm break-all",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          spellCheck={false}
        />
      </ToolPanel>

      {/* Output Panel */}
      <ToolPanel
        title="Decoded"
        className="min-h-[400px]"
      >
        {!result ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Decoded JWT will appear here...</p>
          </div>
        ) : !result.success ? (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive">
            <p className="font-semibold text-destructive mb-1">Invalid JWT</p>
            <p className="text-sm text-destructive/90">{result.error}</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-auto max-h-[500px]">
            {/* Status */}
            {result.isExpired !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-2 p-3 rounded-md",
                  result.isExpired
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-600 dark:text-green-400"
                )}
              >
                {result.isExpired ? (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Token has expired</span>
                    {result.expiresAt && (
                      <span className="text-sm ml-auto">
                        {formatTimestamp(result.expiresAt)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Token is valid</span>
                    {result.expiresAt && (
                      <span className="text-sm ml-auto">
                        Expires: {formatTimestamp(result.expiresAt)}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Header */}
            <div className="rounded-md border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <span className="font-medium text-sm">Header</span>
                <CopyButton
                  text={JSON.stringify(result.parts?.header, null, 2)}
                />
              </div>
              <div className="p-4">
                <pre className="text-sm font-mono overflow-x-auto">
                  {JSON.stringify(result.parts?.header, null, 2)}
                </pre>
              </div>
            </div>

            {/* Payload */}
            <div className="rounded-md border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <span className="font-medium text-sm">Payload</span>
                <CopyButton
                  text={JSON.stringify(result.parts?.payload, null, 2)}
                />
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.parts?.payload || {}).map(
                      ([key, value]) => (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="py-2 pr-4 font-mono font-medium align-top w-24">
                            <div className="flex items-center gap-1">
                              {key}
                              {claimDescriptions[key] && (
                                <span
                                  className="text-muted-foreground cursor-help"
                                  title={claimDescriptions[key]}
                                >
                                  <Info className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 font-mono break-all">
                            {renderClaimValue(key, value)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature */}
            <div className="rounded-md border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <span className="font-medium text-sm">Signature</span>
                <CopyButton text={result.parts?.signature || ""} />
              </div>
              <div className="p-4">
                <p className="text-sm font-mono break-all text-muted-foreground">
                  {result.parts?.signature}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Signature verification requires the secret key, which is
                  not done client-side for security reasons.
                </p>
              </div>
            </div>
          </div>
        )}
      </ToolPanel>
    </ToolLayout>
  );
}
