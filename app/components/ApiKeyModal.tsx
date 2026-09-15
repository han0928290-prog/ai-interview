"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

type ApiKeyModalProps = {
  open: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (key: string) => void;
  onClear: () => void;
};

export default function ApiKeyModal({
  open,
  initialValue,
  onClose,
  onSave,
  onClear,
}: ApiKeyModalProps) {
  const [value, setValue] = useState(initialValue);
  const [showKey, setShowKey] = useState(false);

  // 每次打開 modal 時，把輸入框內容同步成目前實際儲存的值
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setShowKey(false);
    }
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a12] p-6 shadow-2xl shadow-violet-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-white">
            設定 OpenAI API Key
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="關閉"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          本站不提供共用金鑰，需要使用你自己的 OpenAI API
          Key。金鑰只會存在你瀏覽器的 localStorage，僅在你使用面試功能時隨請求送出，我們的伺服器不會儲存它。
        </p>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-400/60"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
              aria-label={showKey ? "隱藏金鑰" : "顯示金鑰"}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs font-medium text-violet-300 transition-colors hover:text-violet-200"
        >
          還沒有 API Key？前往 OpenAI 申請 →
        </a>

        <div className="mt-6 flex items-center justify-between gap-3">
          {initialValue ? (
            <button
              onClick={onClear}
              className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
            >
              清除已儲存的 Key
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              取消
            </button>
            <button
              onClick={() => onSave(value.trim())}
              disabled={!value.trim()}
              className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
