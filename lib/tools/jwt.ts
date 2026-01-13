export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JwtResult {
  success: boolean;
  parts?: JwtParts;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
  error?: string;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters with standard base64 characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if necessary
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  // Decode base64
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(base64);
  }
}

export function decodeJwt(token: string): JwtResult {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    return { success: false, error: "Please enter a JWT token" };
  }

  const parts = trimmedToken.split(".");

  if (parts.length !== 3) {
    return {
      success: false,
      error: `Invalid JWT format. Expected 3 parts separated by dots, got ${parts.length}.`,
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    let isExpired = false;
    let expiresAt: Date | undefined;
    let issuedAt: Date | undefined;

    // Check expiration
    if (payload.exp) {
      expiresAt = new Date(payload.exp * 1000);
      isExpired = expiresAt < new Date();
    }

    // Check issued at
    if (payload.iat) {
      issuedAt = new Date(payload.iat * 1000);
    }

    return {
      success: true,
      parts: { header, payload, signature },
      isExpired,
      expiresAt,
      issuedAt,
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to decode JWT: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export const claimDescriptions: Record<string, string> = {
  iss: "Issuer - Who created and signed this token",
  sub: "Subject - Who this token is about",
  aud: "Audience - Who this token is intended for",
  exp: "Expiration Time - When this token expires",
  nbf: "Not Before - Token is not valid before this time",
  iat: "Issued At - When this token was created",
  jti: "JWT ID - Unique identifier for this token",
  name: "Full name of the user",
  email: "Email address of the user",
  role: "Role or permissions of the user",
  scope: "Scopes or permissions granted",
};
