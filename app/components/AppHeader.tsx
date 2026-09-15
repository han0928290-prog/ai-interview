import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06060a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-black">
            AI
          </span>
          <span className="font-medium text-white">AI 面試模擬器</span>
        </Link>
      </div>
    </header>
  );
}
