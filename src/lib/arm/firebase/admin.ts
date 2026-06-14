import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

function parseServiceAccountJson(raw: string) {
  let value = raw.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      value = JSON.parse(value) as string;
    } catch {
      value = value.slice(1, -1);
    }
  }
  return JSON.parse(value) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };
}

function env(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function normalizePrivateKey(raw: string) {
  let value = raw.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  return value.replace(/\\n/g, "\n");
}

function getAdminCredential() {
  const projectId = env("FIREBASE_ADMIN_PROJECT_ID");
  const clientEmail = env("FIREBASE_ADMIN_CLIENT_EMAIL");
  const privateKeyRaw = env("FIREBASE_ADMIN_PRIVATE_KEY");

  if (projectId && clientEmail && privateKeyRaw) {
    return cert({
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKeyRaw),
    });
  }

  const json =
    env("FIREBASE_SERVICE_ACCOUNT_JSON") ?? env("FIREBASE_SERVICE_ACCOUNT_KEY");
  if (json) {
    const parsed = parseServiceAccountJson(json);
    return cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: normalizePrivateKey(parsed.private_key),
    });
  }

  throw new Error(
    "Firebase Admin credentials missing. Set FIREBASE_ADMIN_* or FIREBASE_SERVICE_ACCOUNT_JSON."
  );
}

function initAdmin() {
  if (getApps().length) {
    adminApp = getApps()[0]!;
  } else {
    adminApp = initializeApp({ credential: getAdminCredential() });
  }
  return adminApp;
}

export function getAdminAuth() {
  if (!adminAuth) {
    initAdmin();
    adminAuth = getAuth(adminApp);
  }
  return adminAuth;
}

export function getAdminDb() {
  if (!adminDb) {
    initAdmin();
    adminDb = getFirestore(adminApp);
  }
  return adminDb;
}

export async function verifyAuthToken(authorization: string | null) {
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authorization.slice(7);
  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    throw new Error("Unauthorized");
  }
}
