import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#06060a]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-black">
              AI
            </span>
            <span className="text-sm font-semibold text-white">
              AI 面試模擬器
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            貼上職缺描述，AI 面試官依職缺客製化提問，作答完畢立即獲得評分與逐題建議，讓你上場前先練到有底氣。
          </p>
        </div>

        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-zinc-300">產品</span>
            <a href="#features" className="text-zinc-500 transition-colors hover:text-white">
              功能特色
            </a>
            <a href="#how-it-works" className="text-zinc-500 transition-colors hover:text-white">
              使用方式
            </a>
            <Link href="/interview" className="text-zinc-500 transition-colors hover:text-white">
              開始使用
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-600">
        © 2026 AI 面試模擬器．All rights reserved.
      </div>
    </footer>
  );
}
