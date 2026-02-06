import { readFileSync } from "fs";
import { createSign } from "crypto";

const BASE_URL =
  "https://androidpublisher.googleapis.com/androidpublisher/v3";

const SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const TOKEN_URI = "https://oauth2.googleapis.com/token";

let cachedToken: { token: string; expires: number } | null = null;

function base64url(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64url");
}

async function getTokenFromCredentials(keyPath: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const creds = JSON.parse(readFileSync(keyPath, "utf-8"));

  let res: Response;

  if (creds.type === "authorized_user") {
    // Application Default Credentials (from gcloud auth application-default login)
    res = await fetch(TOKEN_URI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        refresh_token: creds.refresh_token,
      }),
    });
  } else {
    // Service account key
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = base64url(
      JSON.stringify({
        iss: creds.client_email,
        scope: SCOPE,
        aud: TOKEN_URI,
        iat: now,
        exp: now + 3600,
      })
    );

    const sign = createSign("RSA-SHA256");
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(creds.private_key, "base64url");

    res = await fetch(TOKEN_URI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${header}.${payload}.${signature}`,
    });
  }

  if (!res.ok) {
    console.error("Failed to get access token:", await res.text());
    process.exit(1);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

async function getAccessToken(): Promise<string> {
  const direct = process.env.GOOGLE_PLAY_ACCESS_TOKEN;
  if (direct) return direct;

  // Explicit env var or gcloud application default credentials
  const keyPath =
    process.env.GOOGLE_PLAY_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    `${process.env.HOME}/.config/gcloud/application_default_credentials.json`;

  try {
    readFileSync(keyPath);
    return getTokenFromCredentials(keyPath);
  } catch {}

  console.error(
    "Error: No credentials found. Options:\n" +
      "  1. gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/androidpublisher\n" +
      "  2. GOOGLE_PLAY_CREDENTIALS=/path/to/service-account.json\n" +
      "  3. GOOGLE_PLAY_ACCESS_TOKEN=<token>"
  );
  process.exit(1);
}

export async function get(path: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${await getAccessToken()}` },
  });
}

export async function post(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function put(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function patch(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function del(path: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${await getAccessToken()}` },
  });
}
