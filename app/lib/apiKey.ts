// BYOK（Bring Your Own Key）：使用者的 OpenAI API Key 只存在瀏覽器的 localStorage，
// 不會存在我們的伺服器上。每次呼叫 /api/interview 時才透過 header 帶上去用。
const STORAGE_KEY = "ai-interview:openai-api-key";

// HTTP header 名稱，前端呼叫 /api/interview 時用這個 header 帶 API Key
export const API_KEY_HEADER = "x-openai-api-key";

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // 無痕模式或瀏覽器封鎖 localStorage 時，安靜地當作沒有存過
    return "";
  }
}

export function setStoredApiKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore：儲存失敗就當下次還是要使用者重新輸入
  }
}

export function clearStoredApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
