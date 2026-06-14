import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { encryptSecret, decryptSecret, maskSecret, isIntegrationsEncryptionConfigured } from "./crypto";

describe("integrations crypto", () => {
  const prev = process.env.INTEGRATIONS_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.INTEGRATIONS_ENCRYPTION_KEY = "test-key-at-least-32-characters-long!!";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.INTEGRATIONS_ENCRYPTION_KEY;
    else process.env.INTEGRATIONS_ENCRYPTION_KEY = prev;
  });

  it("detects encryption config", () => {
    expect(isIntegrationsEncryptionConfigured()).toBe(true);
  });

  it("round-trips encrypt and decrypt", () => {
    const plain = "sk-test-openai-secret-key-12345";
    const encrypted = encryptSecret(plain);
    expect(encrypted).toMatch(/^enc:v1:/);
    expect(decryptSecret(encrypted)).toBe(plain);
  });

  it("masks secrets for display", () => {
    expect(maskSecret("abcdefgh")).toMatch(/\*\*\*\*/);
  });
});
