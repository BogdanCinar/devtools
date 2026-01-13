export interface Base64Result {
  success: boolean;
  output?: string;
  error?: string;
}

export function encodeBase64(input: string): Base64Result {
  if (!input) {
    return { success: true, output: "" };
  }

  try {
    // Handle Unicode characters properly
    const bytes = new TextEncoder().encode(input);
    const binString = Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    const encoded = btoa(binString);
    return { success: true, output: encoded };
  } catch (err) {
    return {
      success: false,
      error: `Encoding failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export function decodeBase64(input: string): Base64Result {
  if (!input) {
    return { success: true, output: "" };
  }

  try {
    // Remove whitespace and newlines
    const cleanInput = input.replace(/\s/g, "");

    // Decode base64
    const binString = atob(cleanInput);
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return { success: true, output: decoded };
  } catch (err) {
    return {
      success: false,
      error: `Decoding failed: ${err instanceof Error ? err.message : "Invalid Base64 string"}`,
    };
  }
}

export function isValidBase64(input: string): boolean {
  if (!input) return false;

  // Remove whitespace
  const cleanInput = input.replace(/\s/g, "");

  // Check if it matches base64 pattern
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(cleanInput)) {
    return false;
  }

  // Check length is valid (must be divisible by 4)
  if (cleanInput.length % 4 !== 0) {
    return false;
  }

  // Try to decode
  try {
    atob(cleanInput);
    return true;
  } catch {
    return false;
  }
}

export function fileToBase64(file: File): Promise<Base64Result> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve({ success: true, output: base64 });
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: "Failed to read file",
      });
    };

    reader.readAsDataURL(file);
  });
}

export function base64ToDataUrl(base64: string, mimeType: string = "application/octet-stream"): string {
  return `data:${mimeType};base64,${base64}`;
}
