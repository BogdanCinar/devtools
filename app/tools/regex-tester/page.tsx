"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Trash2, BookOpen, Check } from "lucide-react";
import { ToolLayout, ToolPanel } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/shared/CopyButton";
import {
  testRegex,
  commonPatterns,
  type RegexFlags,
  type RegexResult,
} from "@/lib/tools/regex";
import { cn } from "@/lib/utils";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [result, setResult] = useState<RegexResult | null>(null);
  const [showPatterns, setShowPatterns] = useState(false);
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    caseInsensitive: false,
    multiline: false,
    dotAll: false,
    unicode: false,
  });

  const handleTest = useCallback(() => {
    const testResult = testRegex(pattern, testString, flags);
    setResult(testResult);
  }, [pattern, testString, flags]);

  const handleClear = useCallback(() => {
    setPattern("");
    setTestString("");
    setResult(null);
  }, []);

  const handleSelectPattern = useCallback((p: string) => {
    setPattern(p);
    setShowPatterns(false);
  }, []);

  const toggleFlag = useCallback((flag: keyof RegexFlags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  // Auto-test on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTest();
    }, 200);
    return () => clearTimeout(timer);
  }, [handleTest]);

  // Highlighted test string with matches
  const highlightedText = useMemo(() => {
    if (!result?.success || !result.matches?.length || !testString) {
      return null;
    }

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    // Sort matches by index
    const sortedMatches = [...result.matches].sort((a, b) => a.index - b.index);

    for (const match of sortedMatches) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, match.index),
          isMatch: false,
        });
      }
      // Add match
      parts.push({
        text: match.match,
        isMatch: true,
      });
      lastIndex = match.index + match.match.length;
    }

    // Add remaining text
    if (lastIndex < testString.length) {
      parts.push({
        text: testString.slice(lastIndex),
        isMatch: false,
      });
    }

    return parts;
  }, [result, testString]);

  const flagButtons: { key: keyof RegexFlags; label: string; title: string }[] = [
    { key: "global", label: "g", title: "Global - Find all matches" },
    { key: "caseInsensitive", label: "i", title: "Case Insensitive" },
    { key: "multiline", label: "m", title: "Multiline - ^ and $ match line boundaries" },
    { key: "dotAll", label: "s", title: "DotAll - . matches newlines" },
    { key: "unicode", label: "u", title: "Unicode" },
  ];

  return (
    <ToolLayout
      title="RegEx Tester"
      description="Test and debug regular expressions with live highlighting and match detection."
    >
      {/* Pattern Panel */}
      <ToolPanel
        title="Pattern"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-secondary hover:bg-secondary/80 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              title="Common patterns"
            >
              <BookOpen className="h-4 w-4" />
              <span>Examples</span>
            </button>
            <button
              onClick={handleClear}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md",
                "bg-secondary hover:bg-secondary/80 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              title="Clear all"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        }
        className="min-h-[400px]"
      >
        <div className="space-y-4">
          {/* Pattern input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl text-muted-foreground">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className={cn(
                  "flex-1 px-3 py-2 rounded-md",
                  "bg-background border font-mono text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  result?.error && "border-destructive"
                )}
                spellCheck={false}
              />
              <span className="text-2xl text-muted-foreground">/</span>
              <CopyButton text={pattern} />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Flags:</span>
              {flagButtons.map(({ key, label, title }) => (
                <button
                  key={key}
                  onClick={() => toggleFlag(key)}
                  title={title}
                  className={cn(
                    "w-8 h-8 rounded-md font-mono text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    flags[key]
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Error message */}
            {result?.error && (
              <p className="text-sm text-destructive mt-2">{result.error}</p>
            )}
          </div>

          {/* Common patterns dropdown */}
          {showPatterns && (
            <div className="border rounded-md bg-card overflow-hidden">
              <div className="px-3 py-2 bg-muted/50 border-b text-sm font-medium">
                Common Patterns
              </div>
              <div className="max-h-48 overflow-y-auto">
                {commonPatterns.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleSelectPattern(p.pattern)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-muted transition-colors",
                      "border-b last:border-b-0"
                    )}
                  >
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {p.pattern}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Test string input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              className={cn(
                "w-full min-h-[150px] p-4 rounded-md resize-none",
                "bg-background border font-mono text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              spellCheck={false}
            />
          </div>
        </div>
      </ToolPanel>

      {/* Results Panel */}
      <ToolPanel
        title="Results"
        actions={
          result?.success && result.matches && (
            <span className="text-sm text-muted-foreground">
              {result.matches.length} match{result.matches.length !== 1 ? "es" : ""}
            </span>
          )
        }
        className="min-h-[400px]"
      >
        {!pattern ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Enter a pattern to see matches...</p>
          </div>
        ) : result?.error ? (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive">
            <p className="font-semibold text-destructive mb-1">Invalid Pattern</p>
            <p className="text-sm text-destructive/90">{result.error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Highlighted text */}
            {highlightedText && highlightedText.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Highlighted Matches
                </label>
                <div className="p-4 rounded-md bg-muted/50 border font-mono text-sm whitespace-pre-wrap break-all">
                  {highlightedText.map((part, i) =>
                    part.isMatch ? (
                      <mark
                        key={i}
                        className="bg-primary/30 text-foreground px-0.5 rounded"
                      >
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Match list */}
            {result?.matches && result.matches.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Match Details
                </label>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">#</th>
                        <th className="px-3 py-2 text-left font-medium">Match</th>
                        <th className="px-3 py-2 text-left font-medium">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.map((match, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2 font-mono break-all">
                            {match.match || <span className="text-muted-foreground">(empty)</span>}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {match.index}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No matches */}
            {result?.success && result.matches?.length === 0 && testString && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>No matches found</p>
              </div>
            )}
          </div>
        )}
      </ToolPanel>
    </ToolLayout>
  );
}
