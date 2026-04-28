import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CareerResult,
  ChatPhase,
  Message,
  Session,
  UserAnswers,
} from "../types";

function generateId(): string {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function getPreview(messages: Message[]): string {
  const botMsg = messages.find((m) => m.role === "bot");
  if (!botMsg) return "New conversation";
  return botMsg.content.slice(0, 80) + (botMsg.content.length > 80 ? "…" : "");
}

function getTitle(messages: Message[]): string {
  const userMsg = messages.find((m) => m.role === "user");
  if (!userMsg) return "Career Advice Session";
  const snippet = userMsg.content.slice(0, 40);
  return snippet.length < userMsg.content.length ? `${snippet}…` : snippet;
}

interface ChatState {
  currentSessionId: string | null;
  messages: Message[];
  userAnswers: UserAnswers;
  results: CareerResult[];
  chatPhase: ChatPhase;
  currentQuestionIndex: number;
  allSessions: Session[];
  // Actions
  setPhase: (phase: ChatPhase) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setAnswers: (answers: Partial<UserAnswers>) => void;
  setResults: (results: CareerResult[]) => void;
  loadSession: (sessionId: string) => void;
  resetSession: () => void;
  newSession: () => void;
  deleteSession: (sessionId: string) => void;
  syncCurrentToSessions: () => void;
}

const defaultAnswers: UserAnswers = {
  interests: {},
  skills: {},
  personality: {},
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentSessionId: null,
      messages: [],
      userAnswers: defaultAnswers,
      results: [],
      chatPhase: "interests",
      currentQuestionIndex: 0,
      allSessions: [],

      setPhase: (phase) => {
        set({ chatPhase: phase });
        get().syncCurrentToSessions();
      },

      addMessage: (msg) => {
        const newMsg: Message = {
          ...msg,
          id: generateId(),
          timestamp: Date.now(),
        };
        set((state) => ({ messages: [...state.messages, newMsg] }));
        // Sync after message added
        setTimeout(() => get().syncCurrentToSessions(), 0);
      },

      setAnswers: (answers) => {
        set((state) => ({
          userAnswers: { ...state.userAnswers, ...answers },
        }));
        get().syncCurrentToSessions();
      },

      setResults: (results) => {
        set({ results, chatPhase: "results" });
        get().syncCurrentToSessions();
      },

      loadSession: (sessionId) => {
        const session = get().allSessions.find((s) => s.id === sessionId);
        if (!session) return;
        set({
          currentSessionId: sessionId,
          messages: session.messages,
          userAnswers: session.userAnswers,
          results: session.results,
          chatPhase: session.chatPhase,
          currentQuestionIndex: session.currentQuestionIndex,
        });
      },

      resetSession: () => {
        const { currentSessionId, allSessions } = get();
        const filtered = allSessions.filter((s) => s.id !== currentSessionId);
        set({
          currentSessionId: null,
          messages: [],
          userAnswers: defaultAnswers,
          results: [],
          chatPhase: "interests",
          currentQuestionIndex: 0,
          allSessions: filtered,
        });
      },

      newSession: () => {
        get().syncCurrentToSessions();
        set({
          currentSessionId: generateId(),
          messages: [],
          userAnswers: defaultAnswers,
          results: [],
          chatPhase: "interests",
          currentQuestionIndex: 0,
        });
      },

      deleteSession: (sessionId) => {
        const { currentSessionId, allSessions } = get();
        const filtered = allSessions.filter((s) => s.id !== sessionId);
        set({ allSessions: filtered });
        if (currentSessionId === sessionId) {
          set({
            currentSessionId: null,
            messages: [],
            userAnswers: defaultAnswers,
            results: [],
            chatPhase: "interests",
            currentQuestionIndex: 0,
          });
        }
      },

      syncCurrentToSessions: () => {
        const {
          currentSessionId,
          messages,
          userAnswers,
          results,
          chatPhase,
          currentQuestionIndex,
          allSessions,
        } = get();
        if (!currentSessionId || messages.length === 0) return;

        const now = Date.now();
        const existing = allSessions.find((s) => s.id === currentSessionId);
        const session: Session = {
          id: currentSessionId,
          title: getTitle(messages),
          preview: getPreview(messages),
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
          messages,
          userAnswers,
          results,
          chatPhase,
          currentQuestionIndex,
        };

        const updated = allSessions.some((s) => s.id === currentSessionId)
          ? allSessions.map((s) => (s.id === currentSessionId ? session : s))
          : [session, ...allSessions];

        set({ allSessions: updated });
      },
    }),
    {
      name: "career-chat-store",
      partialize: (state) => ({ allSessions: state.allSessions }),
    },
  ),
);
