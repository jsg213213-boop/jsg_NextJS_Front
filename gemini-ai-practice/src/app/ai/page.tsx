import Link from "next/link";

const menus = [
  {
    href: "/ai/chat",
    title: "텍스트 챗봇",
    description: "질문을 보내고 Gemini 답변을 확인합니다.",
  },
  {
    href: "/ai/image",
    title: "이미지 분석",
    description: "이미지를 업로드하고 한국어 설명을 받습니다.",
  },
  // {
  //   href: "/ai/multimodal",
  //   title: "이미지 Q&A",
  //   description: "이미지와 질문을 함께 보내 답변을 받습니다.",
  // },
];

export default function AiHomePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">AI 기능 선택</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <h2 className="font-semibold text-slate-900">{menu.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {menu.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}