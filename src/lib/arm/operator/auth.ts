/** Platform operator auth — reuses ADMIN_PASSWORD (same as blog admin). */

export function getOperatorPassword() {
  return (
    process.env.ARM_OPERATOR_PASSWORD?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

export function createOperatorToken(password: string) {
  return Buffer.from(`${password}${Date.now().toString().slice(0, -4)}`).toString("base64");
}

export function verifyOperatorToken(authorization: string | null): boolean {
  const password = getOperatorPassword();
  if (!password || !authorization?.startsWith("Bearer ")) return false;
  try {
    const token = authorization.slice(7);
    const decoded = Buffer.from(token, "base64").toString("utf8");
    return decoded.startsWith(password);
  } catch {
    return false;
  }
}

export function requireOperator(request: Request) {
  if (!verifyOperatorToken(request.headers.get("authorization"))) {
    throw new Error("Unauthorized");
  }
}
