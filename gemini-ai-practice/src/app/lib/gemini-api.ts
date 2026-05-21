import type {
  AiErrorResponse,
  ChatResponse,
  ImageAnalysisResponse,
  MultimodalResponse,
} from "@/src/app/types/ai";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:18082/api";

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as AiErrorResponse;
    if (data.message) return data.message;
  } catch {
    // JSON 에러가 아닐 수 있으므로 상태 코드로 처리한다.
  }

  return `요청 실패: HTTP${response.status}`;
}

export async function requestChat(prompt: string): Promise<ChatResponse> {
  console.log('API_BASE_URL : ', API_BASE_URL)
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ChatResponse>;
}

export async function requestImageAnalysis(
  file: File,
  prompt: string,
): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("prompt", prompt);

  const response = await fetch(`${API_BASE_URL}/ai/analyze-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ImageAnalysisResponse>;
}

export async function requestMultimodal(
  file: File,
  question: string,
): Promise<MultimodalResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("question", question);

  const response = await fetch(`${API_BASE_URL}/ai/multimodal`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<MultimodalResponse>;
}