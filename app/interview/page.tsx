"use client";

import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import AppHeader from "../components/AppHeader";
import ApiKeyModal from "../components/ApiKeyModal";
import {
  API_KEY_HEADER,
  clearStoredApiKey,
  getStoredApiKey,
  setStoredApiKey,
} from "../lib/apiKey";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type InterviewResponse = {
  message?: string;
  done?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  error?: string;
};

// 伺服器在缺少 / 拒絕 API Key 時會回 401，用專屬的錯誤類別方便前端辨識並自動彈出設定視窗
class ApiKeyError extends Error {}

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(
    null
  );

  const [apiKey, setApiKey] = useState("");
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  // 只能在瀏覽器端讀 localStorage，所以放在 useEffect（SSR 階段 window 不存在）
  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  function handleSaveKey(key: string) {
    setStoredApiKey(key);
    setApiKey(key);
    setKeyModalOpen(false);
    setError(null);
  }

  function handleClearKey() {
    clearStoredApiKey();
    setApiKey("");
    setKeyModalOpen(false);
  }

  async function callInterviewApi(history: ChatMessage[]) {
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [API_KEY_HEADER]: apiKey,
      },
      body: JSON.stringify({ jobDescription, history, totalQuestions }),
    });
    const data: InterviewResponse = await res.json();
    if (!res.ok || !data.message) {
      if (res.status === 401) {
        throw new ApiKeyError(data.error ?? "請先設定 OpenAI API Key");
      }
      throw new Error(data.error ?? "發生未知錯誤");
    }
    return data;
  }

  async function handleStart() {
    if (!apiKey.trim()) {
      setError("請先設定你的 OpenAI API Key");
      setKeyModalOpen(true);
      return;
    }
    if (!jobDescription.trim()) {
      setError("請先輸入職缺描述");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await callInterviewApi([]);
      setMessages([{ role: "assistant", content: data.message! }]);
      if (data.questionNumber && data.totalQuestions) {
        setProgress({ current: data.questionNumber, total: data.totalQuestions });
      }
      setStarted(true);
    } catch (e) {
      if (e instanceof ApiKeyError) {
        setError(e.message);
        setKeyModalOpen(true);
      } else {
        setError(e instanceof Error ? e.message : "發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!answer.trim() || loading || done) return;
    setError(null);
    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: answer.trim() },
    ];
    setMessages(nextHistory);
    setAnswer("");
    setLoading(true);
    try {
      const data = await callInterviewApi(nextHistory);
      setMessages([...nextHistory, { role: "assistant", content: data.message! }]);
      if (data.done) {
        setDone(true);
        setProgress(null);
      } else if (data.questionNumber && data.totalQuestions) {
        setProgress({ current: data.questionNumber, total: data.totalQuestions });
      }
    } catch (e) {
      if (e instanceof ApiKeyError) {
        setError(e.message);
        setKeyModalOpen(true);
      } else {
        setError(e instanceof Error ? e.message : "發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setJobDescription("");
    setTotalQuestions(3);
    setStarted(false);
    setMessages([]);
    setAnswer("");
    setLoading(false);
    setDone(false);
    setError(null);
    setProgress(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#06060a] text-white">
      <AppHeader />

      <main className="relative flex-1">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                開始一場模擬面試
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                輸入職缺描述，AI 面試官會依你設定的題數提問，回答完畢後給予評分、建議與每題的更好回答方式。
              </p>
            </div>
            <button
              onClick={() => setKeyModalOpen(true)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                apiKey
                  ? "border-white/10 text-zinc-400 hover:bg-white/5"
                  : "border-violet-400/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              {apiKey ? "API Key 已設定" : "設定 API Key"}
            </button>
          </div>

          {!started && (
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-violet-500/5 backdrop-blur">
              <textarea
                className="min-h-[160px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-400/60"
                placeholder="請貼上或輸入職缺描述，例如：徵求前端工程師，需熟悉 React、TypeScript..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                題數：
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={totalQuestions}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isFinite(n)) {
                      setTotalQuestions(Math.min(10, Math.max(1, Math.round(n))));
                    }
                  }}
                  disabled={loading}
                  className="w-16 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-sm text-white outline-none focus:border-violet-400/60"
                />
                題（1-10 題）
              </label>
              <button
                onClick={handleStart}
                disabled={loading}
                className="self-start rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/20 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "出題中..." : "開始模擬面試"}
              </button>
            </div>
          )}

          {started && (
            <div className="flex flex-col gap-4">
              {progress && !done && (
                <div className="text-xs font-medium text-zinc-500">
                  第 {progress.current} / {progress.total} 題
                </div>
              )}

              <div className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-tr-sm bg-gradient-to-br from-violet-500 to-cyan-400 text-black"
                          : done && i === messages.length - 1
                            ? "rounded-tl-sm border border-violet-400/30 bg-violet-500/10 text-zinc-100"
                            : "rounded-tl-sm bg-white/[0.06] text-zinc-100"
                      }`}
                    >
                      {m.role === "assistant" && done && i === messages.length - 1 && (
                        <div className="mb-1 text-xs font-semibold text-violet-300">
                          面試評估
                        </div>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-2.5 text-sm text-zinc-500">
                      思考中...
                    </div>
                  </div>
                )}
              </div>

              {!done && (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="min-h-[100px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-400/60"
                    placeholder="輸入你的回答..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSubmitAnswer();
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !answer.trim()}
                    className="self-start rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/20 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    送出回答
                  </button>
                </div>
              )}

              {done && (
                <button
                  onClick={handleReset}
                  className="self-start rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  重新開始
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </main>

      <ApiKeyModal
        open={keyModalOpen}
        initialValue={apiKey}
        onClose={() => setKeyModalOpen(false)}
        onSave={handleSaveKey}
        onClear={handleClearKey}
      />
    </div>
  );
}
