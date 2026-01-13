export interface JsonResult {
  success: boolean;
  formatted?: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

export function formatJson(input: string, indent: number = 2): JsonResult {
  if (!input.trim()) {
    return { success: true, formatted: "" };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    return { success: true, formatted };
  } catch (err) {
    const error = err as SyntaxError;
    const match = error.message.match(/position (\d+)/);
    let line: number | undefined;
    let column: number | undefined;

    if (match) {
      const position = parseInt(match[1], 10);
      const lines = input.substring(0, position).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      success: false,
      error: {
        message: error.message,
        line,
        column,
      },
    };
  }
}

export function minifyJson(input: string): JsonResult {
  if (!input.trim()) {
    return { success: true, formatted: "" };
  }

  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { success: true, formatted: minified };
  } catch (err) {
    const error = err as SyntaxError;
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
}

export function validateJson(input: string): JsonResult {
  if (!input.trim()) {
    return { success: true };
  }

  try {
    JSON.parse(input);
    return { success: true };
  } catch (err) {
    const error = err as SyntaxError;
    const match = error.message.match(/position (\d+)/);
    let line: number | undefined;
    let column: number | undefined;

    if (match) {
      const position = parseInt(match[1], 10);
      const lines = input.substring(0, position).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      success: false,
      error: {
        message: error.message,
        line,
        column,
      },
    };
  }
}
