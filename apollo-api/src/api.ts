const BASE_URL = "https://api.apollo.io";

function getApiKey(): string {
  const key = process.env.APOLLO_IO_API_KEY;
  if (!key) {
    console.error("Error: APOLLO_IO_API_KEY environment variable is required");
    process.exit(1);
  }
  return key;
}

export async function get(path: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: { "x-api-key": getApiKey() },
  });
}

export async function post(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
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
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
