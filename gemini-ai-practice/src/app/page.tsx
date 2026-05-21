import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Gemini Practice
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          Next.js Gemini AI 연습
        </h1>
        <p className="mt-4 text-slate-600">
          Spring Boot 테스트 서버를 호출해서 텍스트 챗봇, 이미지 분석,
          이미지 Q&A를 하나씩 확인합니다.
        </p>
        <Link
          href="/ai"
          className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          AI 기능 시작하기
        </Link>
      </section>
    </main>
  );
}