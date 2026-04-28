export type MessageRole = "bot" | "user";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type ChatPhase = "interests" | "skills" | "personality" | "results";

export interface UserAnswers {
  interests: Record<string, number>;
  skills: Record<string, number>;
  personality: Record<string, string>;
}

export interface CareerResult {
  careerName: string;
  score: number;
  explanation: string;
  improvements: string[];
  futureScope: string;
}

export interface Session {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  userAnswers: UserAnswers;
  results: CareerResult[];
  chatPhase: ChatPhase;
  currentQuestionIndex: number;
}
