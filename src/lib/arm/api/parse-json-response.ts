export async function parseJsonResponse<T = Record<string, unknown>>(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
      throw new Error(
        res.ok
          ? "Server returned an unexpected HTML page instead of JSON."
          : `Server error (${res.status}). Try again in a moment.`
      );
    }
    throw new Error(text.slice(0, 200) || `Request failed (${res.status})`);
  }
}
