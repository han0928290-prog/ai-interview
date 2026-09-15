import Link from "next/link";
import {
  FileText,
  SlidersHorizontal,
  Sparkles,
  Languages,
  ArrowRight,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const FEATURES = [
  {
    icon: FileText,
    title: "依職缺客製化出題",
    description:
      "貼上任何職缺描述，AI 面試官會根據內容提出切題的技術、經驗與情境問題，不是罐頭題庫。",
  },
  {
    icon: SlidersHorizontal,
    title: "彈性題數設定",
    description:
      "依需求安排 1 到 10 題，想快速暖身或完整模擬一場正式面試都可以。",
  },
  {
    icon: Sparkles,
    title: "逐題回答建議",
    description:
      "面試結束後不只給總分，還會針對每一題告訴你更好的回答方向與示範重點。",
  },
  {
    icon: Languages,
    title: "全繁體中文介面",
    description:
      "出題、追問、講評全程使用道地繁體中文，貼近本地求職者的真實面試情境。",
  },
];

const STEPS = [
  {
    number: "01",
    title: "貼上職缺描述",
    description: "把你要應徵的職缺 JD 貼進去，並設定想練習的題數。",
  },
  {
    number: "02",
    title: "逐題作答",
    description: "AI 面試官依序提問，你像真實面試一樣打字回答。",
  },
  {
    number: "03",
    title: "獲得評分與建議",
    description: "回答完畢後拿到總體評分、優缺點，以及每一題的更好回答方式。",
  },
];

const FAQS = [
  {
    q: "出題的是真人還是 AI？",
    a: "是 AI 面試官。它會根據你貼上的職缺描述，動態生成問題與追問，並不是固定題庫。",
  },
  {
    q: "題數可以自己調整嗎？",
    a: "可以，開始面試前可自由設定 1 到 10 題，依練習時間彈性調整。",
  },
  {
    q: "需要付費嗎？",
    a: "目前完全免費開放使用。",
  },
  {
    q: "我的回答內容會被儲存嗎？",
    a: "不會存進資料庫。你的職缺描述與回答只會在當次對話中用來即時生成問題與講評。",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#06060a] text-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_70%)]" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
          <div className="pointer-events-none absolute top-40 right-1/2 h-72 w-72 translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                由 AI 驅動的模擬面試教練
              </span>

              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                用 AI 面試官
                <br />
                練到<span className="text-gradient">不怯場</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                貼上任何職缺描述，AI
                面試官會依職缺客製化提問，回答完畢立即獲得評分、優缺點分析，以及每一題更好的回答方式。
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
                <Link
                  href="/interview"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.03]"
                >
                  開始免費模擬面試
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  看看怎麼玩 →
                </a>
              </div>
            </div>

            {/* Mock preview card */}
            <div className="relative mx-auto mt-16 max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-violet-500/10 backdrop-blur">
                <div className="mb-4 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-3 text-xs text-zinc-500">
                    AI 面試模擬器 — 第 2 / 3 題
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-2.5 text-zinc-200">
                    請分享一個你曾經解決效能瓶頸的實際案例。
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-500 to-cyan-400 px-4 py-2.5 text-black">
                    我透過加上複合索引，把查詢時間從 2 秒降到 50 毫秒⋯
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-zinc-200">
                    總體評分：8 分。建議可以再補充當時如何確認索引真的有效⋯
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                不只是出題機，更是你的陪練夥伴
              </h2>
              <p className="mt-4 text-zinc-400">
                每一個環節都是為了讓你在真正的面試前，先把答案練到位。
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-400/20">
                    <Icon className="h-5 w-5 text-violet-300" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                三個步驟，開始練習
              </h2>
              <p className="mt-4 text-zinc-400">
                不用註冊，不用安裝，打開就能開始。
              </p>
            </div>

            <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <div className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:block" />
              {STEPS.map((step) => (
                <div key={step.number} className="relative flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12] text-sm font-semibold text-gradient">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              常見問題
            </h2>

            <div className="mt-12 flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="group p-5 open:bg-white/[0.02]">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-white marker:content-none">
                    {q}
                    <span className="ml-4 text-zinc-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              準備好了嗎？
            </h2>
            <p className="mt-4 text-zinc-400">
              下一場面試前，先來一輪練習，帶著更有底氣的答案上場。
            </p>
            <Link
              href="/interview"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.03]"
            >
              開始免費模擬面試
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
