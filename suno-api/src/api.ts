const BASE_URL = "https://api.sunoapi.org";

function getApiKey(): string {
  const key = process.env.SUNO_API_KEY;
  if (!key) {
    console.error("Error: SUNO_API_KEY environment variable is required");
    process.exit(1);
  }
  return key;
}

export async function get(path: string): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
  });
}

export async function post(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

const SUCCESS_STATUSES = ["SUCCESS", "FIRST_SUCCESS"];
const ERROR_STATUSES = [
  "CREATE_TASK_FAILED",
  "GENERATE_AUDIO_FAILED",
  "CALLBACK_EXCEPTION",
  "SENSITIVE_WORD_ERROR",
];

export async function pollForResult(
  taskId: string,
  maxAttempts = 60
): Promise<unknown> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await get(`/api/v1/generate/record-info?taskId=${taskId}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const data = json?.data;
    if (SUCCESS_STATUSES.includes(data?.status)) return json;
    if (ERROR_STATUSES.includes(data?.status)) {
      throw new Error(data.errorMessage ?? data.status);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Timeout waiting for generation");
}
