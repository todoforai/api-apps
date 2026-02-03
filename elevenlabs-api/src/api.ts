const BASE_URL = "https://api.elevenlabs.io/v1";

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error("Error: ELEVENLABS_API_KEY environment variable is required");
    process.exit(1);
  }
  return key;
}

export async function get(path: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: { "xi-api-key": getApiKey() },
  });
}

export async function post(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
