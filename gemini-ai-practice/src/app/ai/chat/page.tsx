"use client";

import { FormEvent, useMemo, useState } from "react";
import { requestChat } from "@/src/app/lib/gemini-api";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "안녕하세요. 무엇을 도와드릴까요?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => prompt.trim().length > 0 && !loading,
    [prompt, loading],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextPrompt = prompt.trim();
    if (!nextPrompt) {
      setError("질문을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: nextPrompt }]);
    setPrompt("");

    try {
      const data = await requestChat(nextPrompt);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
      setModel(data.model);
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `오류: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col rounded-xl border border-slate-200 bg-white">
        <header className="border-b border-slate-200 p-4">
          <h1 className="text-xl font-bold text-slate-900">텍스트 챗봇</h1>
          <p className="mt-1 text-sm text-slate-500">
            {model ? `연결 모델: ${model}` : "첫 요청 전"}
          </p>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            );
          })}
          {loading && (
            <p className="text-sm text-slate-500">
              Gemini가 답변을 작성하고 있습니다...
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
          {error && (
            <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="예: Next.js App Router를 초보자에게 설명해줘"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white disabled:bg-slate-300"
            >
              {loading ? "전송 중" : "전송"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}