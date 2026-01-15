export interface RegexMatch {
  match: string;
  index: number;
  groups?: Record<string, string>;
}

export interface RegexResult {
  success: boolean;
  matches?: RegexMatch[];
  error?: string;
}

export interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
}

export function buildFlagsString(flags: RegexFlags): string {
  let result = "";
  if (flags.global) result += "g";
  if (flags.caseInsensitive) result += "i";
  if (flags.multiline) result += "m";
  if (flags.dotAll) result += "s";
  if (flags.unicode) result += "u";
  return result;
}

export function testRegex(
  pattern: string,
  testString: string,
  flags: RegexFlags
): RegexResult {
  if (!pattern) {
    return { success: true, matches: [] };
  }

  try {
    const flagString = buildFlagsString(flags);
    const regex = new RegExp(pattern, flagString);
    const matches: RegexMatch[] = [];

    if (flags.global) {
      let match;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
        // Prevent infinite loop on zero-width matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups,
        });
      }
    }

    return { success: true, matches };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid regular expression",
    };
  }
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const commonPatterns: { name: string; pattern: string; description: string }[] = [
  {
    name: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    description: "Match email addresses",
  },
  {
    name: "URL",
    pattern: "https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=%]+",
    description: "Match HTTP/HTTPS URLs",
  },
  {
    name: "Phone (US)",
    pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
    description: "Match US phone numbers",
  },
  {
    name: "IP Address",
    pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    description: "Match IPv4 addresses",
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "\\d{4}-\\d{2}-\\d{2}",
    description: "Match ISO date format",
  },
  {
    name: "Hex Color",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    description: "Match hex color codes",
  },
  {
    name: "HTML Tag",
    pattern: "<([a-z]+)[^>]*>.*?<\\/\\1>",
    description: "Match HTML tags with content",
  },
  {
    name: "Digits Only",
    pattern: "\\d+",
    description: "Match one or more digits",
  },
  {
    name: "Words",
    pattern: "\\b\\w+\\b",
    description: "Match whole words",
  },
  {
    name: "Whitespace",
    pattern: "\\s+",
    description: "Match whitespace characters",
  },
];
