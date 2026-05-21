export interface ChatResponse {
  reply: string;
  model: string;
  implemented: boolean;
}

export interface ImageAnalysisResponse {
  description: string;
  filename: string;
  mimeType: string;
  model: string;
  implemented: boolean;
}

export interface MultimodalResponse {
  question: string;
  answer: string;
  model: string;
  implemented: boolean;
}

export interface AiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  path?: string;
}