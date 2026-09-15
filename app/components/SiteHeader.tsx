import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06060a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-black">
            AI
          </span>
          <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
            AI 面試模擬器
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">
            功能特色
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-white">
            使用方式
          </a>
          <a href="#faq" className="transition-colors hover:text-white">
            常見問題
          </a>
        </nav>

        <Link
          href="/interview"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          開始使用
        </Link>
      </div>
    </header>
  );
}
