import crypto from "crypto";

const PREFIX = "enc:v1:";

function encryptionKey() {
  const raw = process.env.INTEGRATIONS_ENCRYPTION_KEY?.trim();
  if (!raw) return null;
  return crypto.createHash("sha256").update(raw).digest();
}

export function isIntegrationsEncryptionConfigured() {
  return Boolean(encryptionKey());
}

export function encryptSecret(value: string): string {
  const key = encryptionKey();
  if (!key) {
    throw new Error("INTEGRATIONS_ENCRYPTION_KEY is not configured on the server.");
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("base64url")}:${Buffer.concat([encrypted, tag]).toString("base64url")}`;
}

export function decryptSecret(stored: string): string {
  if (!stored.startsWith(PREFIX)) return stored;
  const key = encryptionKey();
  if (!key) throw new Error("INTEGRATIONS_ENCRYPTION_KEY is required to decrypt workspace secrets.");

  const payload = stored.slice(PREFIX.length);
  const [ivB64, dataB64] = payload.split(":");
  if (!ivB64 || !dataB64) throw new Error("Invalid encrypted secret format.");

  const iv = Buffer.from(ivB64, "base64url");
  const data = Buffer.from(dataB64, "base64url");
  const tag = data.subarray(data.length - 16);
  const ciphertext = data.subarray(0, data.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function maskSecret(value?: string) {
  if (!value) return null;
  const plain = value.startsWith(PREFIX) ? "****" : value;
  if (plain.length <= 4) return "****";
  return `****${plain.slice(-4)}`;
}

export function hasSecretValue(stored?: string) {
  return Boolean(stored?.trim());
}
