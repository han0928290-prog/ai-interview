import OpenAI from "openai";
import { API_KEY_HEADER } from "../../lib/apiKey";

// 沒有指定題數時的預設題數
const DEFAULT_TOTAL_QUESTIONS = 3;
// 題數下限，避免前端傳入 0 或負數
const MIN_QUESTIONS = 1;
// 題數上限，避免使用者設定過多題數導致 OpenAI 費用暴增
const MAX_QUESTIONS = 10;
// 使用的 OpenAI 模型
const MODEL = "gpt-4o-mini";

// 對話紀錄中單一則訊息的型別：
// assistant = 面試官（AI）說的話，user = 使用者（求職者）的回答
type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

// 將前端傳來的 totalQuestions（型別是 unknown，因為可能是任何 JSON 值）
// 轉成一個安全、合法範圍內的整數
function parseTotalQuestions(value: unknown): number {
  const n = Number(value); // 嘗試轉成數字，若轉不成會是 NaN
  if (!Number.isFinite(n)) return DEFAULT_TOTAL_QUESTIONS; // 不是有限數字（NaN、undefined 轉出來的 NaN 等）就用預設值
  // 四捨五入成整數後，夾在 [MIN_QUESTIONS, MAX_QUESTIONS] 範圍內
  return Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Math.round(n)));
}

// 組出要送給 OpenAI 的「系統提示詞」(system prompt)
// 這是整個面試官人設與行為規則的核心，依照目前的 phase（出題 or 總評）給不同指令
function buildSystemPrompt(
  jobDescription: string,
  phase: "question" | "evaluation",
  questionNumber: number,
  totalQuestions: number
) {
  // 不論哪個 phase 都共用的基底提示詞：設定角色 + 帶入職缺描述 + 要求用繁體中文回覆
  const base = `你是一位資深的技術面試官，正在針對以下職缺對求職者進行模擬面試：

職缺描述：
"""
${jobDescription}
"""

請全程使用繁體中文。`;

  // 情境一：還在出題階段 -> 請 AI 只問「這一題」，並附上規則避免它重複發問、洩漏評語
  if (phase === "question") {
    return `${base}

這是第 ${questionNumber} 題，總共 ${totalQuestions} 題。請根據職缺描述與先前的問答內容，提出一個切題且有深度的面試問題（可以是技術、經驗或情境題），幫助評估求職者是否適合這個職缺。

規則：
- 只能問一題，不要一次問多題。
- 不要重複先前已經問過的問題。
- 不要對求職者先前的回答給予評分或評論，直接問下一題即可。
- 直接輸出問題本身，不要加上「第X題：」之類的前綴，也不要有多餘的寒暄。`;
  }

  // 情境二：所有題目都回答完了 -> 請 AI 根據整個對話歷史給總評
  // 包含總分、優點、待加強、整體建議，以及逐題的回答建議
  return `${base}

求職者已經回答完全部 ${totalQuestions} 題。請根據整個面試對話內容，給出總結評估，包含：

1. 總體評分（滿分 10 分，給出整數或一位小數）
2. 優點（2-4 點）
3. 待加強之處（2-4 點）
4. 整體建議（2-4 點，幫助求職者下次表現更好）
5. 逐題回顧：依照第 1 題到第 ${totalQuestions} 題的順序，針對每一題簡短說明一個更好的回答方向或示範重點（每題 2-3 句話，先簡短點出題目主題再給建議，不需要逐字覆誦原題）

請輸出純文字，使用「、」「-」等符號分行條列即可，不要使用 Markdown 語法（不要出現 #、*、**、\`\` 等符號），語氣專業且具建設性。`;
}

// Next.js Route Handler：處理 POST /api/interview
// 前端每次「開始面試」或「送出回答」都會呼叫這支 API 一次
export async function POST(request: Request) {
  // BYOK（Bring Your Own Key）：我們不使用伺服器自己的 OpenAI API Key，
  // 而是要求前端在 header 帶上使用者自己輸入、存在瀏覽器 localStorage 的 Key。
  // 這支 API 完全不持久化這把 Key，只在這次請求中用來呼叫 OpenAI。
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "請先在設定中輸入你的 OpenAI API Key" },
      { status: 401 }
    );
  }

  // 宣告預期的請求內容格式（都是可選欄位，因為要自己驗證）
  let body: {
    jobDescription?: string;
    history?: ChatMessage[];
    totalQuestions?: number;
  };
  try {
    body = await request.json(); // 解析前端送來的 JSON body
  } catch {
    // JSON 格式錯誤（例如不是合法 JSON）就直接回 400
    return Response.json({ error: "無效的請求內容" }, { status: 400 });
  }

  // 去除職缺描述前後空白；若前端沒傳這個欄位，trim() 前用 optional chaining 避免噴錯
  const jobDescription = body.jobDescription?.trim();
  // history 不是陣列（例如沒傳、或格式錯誤）就當作空陣列，代表「第一次呼叫、還沒問過任何題目」
  const history = Array.isArray(body.history) ? body.history : [];
  // 把前端傳來的題數轉成安全的整數（見上面 parseTotalQuestions）
  const totalQuestions = parseTotalQuestions(body.totalQuestions);

  // 沒有職缺描述就無法出題，回傳 400
  if (!jobDescription) {
    return Response.json({ error: "請提供職缺描述" }, { status: 400 });
  }

  // ===== 核心邏輯：這支 API 是「無狀態」的，每次都要從 history 重新推算目前進度 =====
  // 算出 history 裡使用者已經回答了幾題（role 是 "user" 的訊息數量）
  const userAnswerCount = history.filter((m) => m.role === "user").length;
  // 如果已回答數 >= 設定的總題數，代表題目問完了，進入「總評」階段；否則還在「出題」階段
  const phase: "question" | "evaluation" =
    userAnswerCount >= totalQuestions ? "evaluation" : "question";
  // 目前是第幾題（只有在 question 階段有意義）：已回答數 + 1
  // 例如：還沒回答過（userAnswerCount=0）-> 這是第 1 題
  const questionNumber = userAnswerCount + 1;

  // 依照目前階段組出對應的 system prompt
  const systemPrompt = buildSystemPrompt(
    jobDescription,
    phase,
    questionNumber,
    totalQuestions
  );

  // 建立 OpenAI SDK client
  const client = new OpenAI({ apiKey });

  try {
    // 呼叫 OpenAI Chat Completions API
    // messages 陣列 = [系統提示詞, ...過去所有的問答紀錄]
    // 把完整對話歷史都送進去，是為了讓 AI：
    //   1. 出題階段：知道前面問過什麼，不要重複發問
    //   2. 總評階段：能根據每一題的實際內容給評分與逐題建議
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    // 取出 AI 回覆的文字內容（可能是 undefined，所以要檢查）
    const message = completion.choices[0]?.message?.content?.trim();
    if (!message) {
      // OpenAI 回傳了，但內容是空的，視為上游服務異常（502 Bad Gateway）
      return Response.json({ error: "OpenAI 未回傳內容" }, { status: 502 });
    }

    // 回傳結果給前端：
    // - message：AI 這次的回覆（下一題問題，或最終總評）
    // - done：是否已經是總評（true 代表面試結束，前端要停止讓使用者繼續作答）
    // - questionNumber：目前是第幾題，只有在「出題」階段才有值，總評階段是 undefined
    // - totalQuestions：這場面試總共幾題，讓前端可以顯示「第 X / N 題」
    return Response.json({
      message,
      done: phase === "evaluation",
      questionNumber: phase === "question" ? questionNumber : undefined,
      totalQuestions,
    });
  } catch (error) {
    // 記錄錯誤方便除錯（error 物件本身不含使用者輸入的 API Key，所以印出來是安全的）
    console.error("OpenAI request failed:", error);

    // OpenAI SDK 的錯誤會帶 status，401/403 通常代表使用者輸入的 Key 無效或過期
    if (error instanceof OpenAI.APIError && (error.status === 401 || error.status === 403)) {
      return Response.json(
        { error: "OpenAI API Key 無效或已過期，請重新確認後在設定中更新" },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "呼叫 OpenAI API 失敗，請稍後再試" },
      { status: 502 }
    );
  }
}
