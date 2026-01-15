import { Braces, Key, Binary, Regex, LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: "formatters" | "encoders" | "converters" | "generators";
}

export const tools: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate and beautify JSON with syntax highlighting",
    icon: Braces,
    path: "/tools/json-formatter",
    category: "formatters",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JWT tokens, validate expiration",
    icon: Key,
    path: "/tools/jwt-decoder",
    category: "encoders",
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings and files",
    icon: Binary,
    path: "/tools/base64",
    category: "encoders",
  },
  {
    id: "regex-tester",
    name: "RegEx Tester",
    description: "Test and debug regular expressions with live highlighting",
    icon: Regex,
    path: "/tools/regex-tester",
    category: "formatters",
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
