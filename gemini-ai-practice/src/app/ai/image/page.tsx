"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { requestImageAnalysis } from "@/src/app/lib/gemini-api";
import type { ImageAnalysisResponse } from "@/src/app/types/ai";

export default function ImageAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("이 이미지를 한국어로 자세히 설명해주세요.");
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => !!file && !loading, [file, loading]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    setFile(nextFile);
    setResult(null);
    setError(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await requestImageAnalysis(
        file,
        prompt.trim() || "이 이미지를 한국어로 설명해주세요.",
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <h1 className="text-xl font-bold text-slate-900">이미지 분석</h1>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              이미지 파일
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              분석 프롬프트
            </span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:bg-slate-300"
          >
            {loading ? "분석 중..." : "이미지 분석 요청"}
          </button>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">미리보기와 결과</h2>
          <div className="mt-4 flex h-72 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="업로드 이미지 미리보기"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-slate-400">
                선택한 이미지가 여기에 표시됩니다.
              </span>
            )}
          </div>

          {result && (
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                  {result.model}
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                  {result.mimeType}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {result.description}
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}