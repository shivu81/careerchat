import { MessageList } from "@/components/chat/MessageList";
import { InterestSelector } from "@/components/inputs/InterestSelector";
import { PersonalityChoice } from "@/components/inputs/PersonalityChoice";
import { SkillRater } from "@/components/inputs/SkillRater";
import { InputBar } from "@/components/layout/InputBar";
import {
  PERSONALITY_QUESTIONS,
  SKILLS,
  questionLabel,
} from "@/lib/question-flow";
import { useChatStore } from "@/store/chat-store";
import type { ChatPhase } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const TYPING_DELAY = 300;
const ANALYZE_DELAY = 1500;

// ── Scoring engine ────────────────────────────────────────────────────────────

interface ScoredCareer {
  careerName: string;
  score: number;
  explanation: string;
  improvements: string[];
  futureScope: string;
}

const CAREER_PROFILES = [
  {
    name: "Software Engineer",
    interests: ["Technology"],
    skills: { Coding: 5, Analysis: 4, Communication: 3 },
    personality: { thinking: "Logical thinking" },
    futureScope:
      "High demand in AI, cloud, and fintech. Median salary grows 15% annually.",
  },
  {
    name: "Data Scientist",
    interests: ["Technology", "Science"],
    skills: { Coding: 4, Analysis: 5, Writing: 3 },
    personality: { thinking: "Logical thinking" },
    futureScope:
      "One of the fastest-growing roles. Strong in healthcare, finance, and research.",
  },
  {
    name: "Graphic Designer",
    interests: ["Art", "Technology"],
    skills: { Design: 5, Communication: 3, Writing: 3 },
    personality: { thinking: "Creative thinking" },
    futureScope:
      "Expanding into UX, motion graphics, and brand strategy roles.",
  },
  {
    name: "Psychologist",
    interests: ["Science"],
    skills: { Communication: 5, Writing: 4, Analysis: 3 },
    personality: { energy: "Introvert", role: "Supporter" },
    futureScope: "Growing need in mental health, corporate wellness, and HR.",
  },
  {
    name: "Business Analyst",
    interests: ["Business", "Technology"],
    skills: { Analysis: 5, Communication: 4, Writing: 3 },
    personality: { thinking: "Logical thinking" },
    futureScope:
      "Strong demand across industries, especially in digital transformation.",
  },
  {
    name: "Teacher / Educator",
    interests: ["Science", "Art", "Business"],
    skills: { Communication: 5, Writing: 4 },
    personality: { energy: "Extrovert", role: "Leader" },
    futureScope:
      "EdTech and online education are massively expanding this role.",
  },
  {
    name: "Content Creator",
    interests: ["Art", "Business"],
    skills: { Writing: 5, Communication: 4, Design: 3 },
    personality: { thinking: "Creative thinking" },
    futureScope: "Creator economy is booming — platforms reward niche experts.",
  },
  {
    name: "Sports Coach / Trainer",
    interests: ["Sports"],
    skills: { Communication: 4, Analysis: 3 },
    personality: { energy: "Extrovert", role: "Leader" },
    futureScope:
      "Growing with fitness trends; specializations in e-sports and analytics.",
  },
] as const;

function computeResults(
  interests: Record<string, number>,
  skills: Record<string, number>,
  personality: Record<string, string>,
): ScoredCareer[] {
  const userInterests = Object.keys(interests);

  return CAREER_PROFILES.map((career) => {
    let raw = 0;

    // Interests (30 pts max)
    const matchedInterests = career.interests.filter((i) =>
      userInterests.includes(i),
    );
    raw += (matchedInterests.length / career.interests.length) * 30;

    // Skills (40 pts max)
    const skillEntries = Object.entries(career.skills) as [string, number][];
    const totalSkillWeight = skillEntries.reduce((s, [, w]) => s + w, 0);
    let skillScore = 0;
    for (const [sk, weight] of skillEntries) {
      const userVal = skills[sk] ?? 0;
      skillScore += (userVal / 5) * weight;
    }
    raw += (skillScore / totalSkillWeight) * 40;

    // Personality (30 pts max)
    const persEntries = Object.entries(career.personality);
    let persScore = 0;
    for (const [key, expected] of persEntries) {
      if (personality[key] === expected) persScore++;
    }
    const persWeight =
      persEntries.length > 0 ? persScore / persEntries.length : 0.5;
    raw += persWeight * 30;

    const score = Math.round(raw);

    // Build personalized explanation
    const intLine =
      matchedInterests.length > 0
        ? `Your interest in ${matchedInterests.join(" & ")} aligns well with this field.`
        : "This career may expand your current interests into new areas.";

    const topSkillLines = skillEntries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([sk]) => {
        const val = skills[sk] ?? 0;
        return `${sk}: ${val}/5`;
      })
      .join(", ");

    const persLine =
      persEntries.length > 0
        ? `Your ${persEntries.map(([k]) => k).join("/")} preference (${persEntries.map(([k]) => personality[k] ?? "N/A").join(", ")}) matches this career profile.`
        : "";

    const explanation = [
      intLine,
      topSkillLines ? `Key skill match — ${topSkillLines}.` : "",
      persLine,
    ]
      .filter(Boolean)
      .join(" ");

    // Improvements: skills below 3 that matter for this career
    const improvements = skillEntries
      .filter(([sk]) => (skills[sk] ?? 0) < 3)
      .map(
        ([sk]) => `Improve your ${sk} skill (currently ${skills[sk] ?? 0}/5)`,
      );

    return {
      careerName: career.name,
      score,
      explanation,
      improvements,
      futureScope: career.futureScope,
    } satisfies ScoredCareer;
  }).sort((a, b) => b.score - a.score);
}

// ── Bot script helpers ────────────────────────────────────────────────────────

function welcomeText(): string {
  return "👋 Hi! I'm your Career Advisor. I'll ask you a few quick questions to suggest the best careers for you.\n\nFirst — which of these topics interest you most? You can pick multiple or type your own.";
}

function skillQuestionText(skillLabel: string, index: number): string {
  return `Great! Now let's talk skills.\n\n**Question ${index + 2} of 9** — How would you rate your **${skillLabel}** skill?`;
}

function personalityQuestionText(question: string, index: number): string {
  return `Almost done! Personality matters too.\n\n**Question ${7 + index} of 9** — ${question}`;
}

// ── ChatPage ──────────────────────────────────────────────────────────────────

type StepKey = "interests" | `skill_${number}` | `personality_${number}`;

export default function ChatPage() {
  const {
    messages,
    chatPhase,
    currentQuestionIndex,
    userAnswers,
    currentSessionId,
    setPhase,
    addMessage,
    setAnswers,
    setResults,
    newSession,
  } = useChatStore();

  const [isTyping, setIsTyping] = useState(false);
  // Tracks which step's interactive component is locked
  const [lockedSteps, setLockedSteps] = useState<Set<StepKey>>(new Set());
  // Map: message id → ReactNode (interactive component)
  const [interactiveMap, setInteractiveMap] = useState<
    Record<string, ReactNode>
  >({});

  const initialized = useRef(false);
  const lastBotMsgId = useRef<string | null>(null);

  // ── Session init ──
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (messages.length === 0) {
      if (!currentSessionId) newSession();
      botSay(welcomeText(), "interests", 0);
    }
  }, []);

  // ── Helpers ──

  function lockStep(step: StepKey) {
    setLockedSteps((prev) => new Set([...prev, step]));
  }

  function botSay(
    text: string,
    phase: ChatPhase,
    qIndex: number,
    delay = TYPING_DELAY,
  ) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ role: "bot", content: text });
      // After addMessage, the id is generated inside the store — we'll attach interactive via next render pass
      // We use a small trick: store the phase+qIndex so the render effect can attach interactive
      setCurrentInteractiveTarget({ phase, qIndex });
    }, delay);
  }

  const [currentInteractiveTarget, setCurrentInteractiveTarget] = useState<{
    phase: ChatPhase;
    qIndex: number;
  } | null>(null);

  // After messages update, attach interactive component to latest bot message
  // biome-ignore lint/correctness/useExhaustiveDependencies: lockedSteps.has is stable
  useEffect(() => {
    if (!currentInteractiveTarget) return;
    const { phase, qIndex } = currentInteractiveTarget;
    const lastBot = [...messages].reverse().find((m) => m.role === "bot");
    if (!lastBot) return;
    if (lastBotMsgId.current === lastBot.id) return;
    lastBotMsgId.current = lastBot.id;

    const stepKey = stepKeyFor(phase, qIndex);
    const isLocked = lockedSteps.has(stepKey);

    const node = buildInteractiveNode(phase, qIndex, lastBot.id, isLocked);
    if (node) {
      setInteractiveMap((prev) => ({ ...prev, [lastBot.id]: node }));
    }
    setCurrentInteractiveTarget(null);
  }, [messages, currentInteractiveTarget]); // eslint-disable-line react-hooks/exhaustive-deps

  function stepKeyFor(phase: ChatPhase, qIndex: number): StepKey {
    if (phase === "interests") return "interests";
    if (phase === "skills") return `skill_${qIndex}`;
    return `personality_${qIndex}`;
  }

  function buildInteractiveNode(
    phase: ChatPhase,
    qIndex: number,
    msgId: string,
    locked: boolean,
  ): ReactNode | null {
    if (phase === "interests") {
      return (
        <InterestSelector
          key={msgId}
          disabled={locked}
          onSubmit={(interests) => handleInterestsSubmit(interests, msgId)}
        />
      );
    }
    if (phase === "skills") {
      const skill = SKILLS[qIndex];
      if (!skill) return null;
      return (
        <SkillRater
          key={msgId}
          skillLabel={skill.label}
          disabled={locked}
          onRate={(rating) => handleSkillRate(qIndex, rating, msgId)}
        />
      );
    }
    if (phase === "personality") {
      const pq = PERSONALITY_QUESTIONS[qIndex];
      if (!pq) return null;
      return (
        <PersonalityChoice
          key={msgId}
          optionA={pq.optionA}
          optionB={pq.optionB}
          disabled={locked}
          onChoose={(choice) =>
            handlePersonalityChoose(qIndex, pq.key, choice, msgId)
          }
        />
      );
    }
    return null;
  }

  // ── Handlers ──

  function handleInterestsSubmit(interests: string[], msgId: string) {
    lockStep("interests");
    const interestMap: Record<string, number> = {};
    for (const i of interests) interestMap[i] = 1;
    setAnswers({ interests: interestMap });
    addMessage({
      role: "user",
      content: `My interests: ${interests.join(", ")}`,
    });
    // Start skills
    const skillPhase: ChatPhase = "skills";
    setPhase(skillPhase);
    const skill = SKILLS[0];
    botSay(skillQuestionText(skill.label, 0), skillPhase, 0);
    // Update the locked node for this message
    setInteractiveMap((prev) => ({
      ...prev,
      [msgId]: (
        <InterestSelector
          key={`${msgId}-locked`}
          disabled
          onSubmit={() => {}}
        />
      ),
    }));
  }

  function handleSkillRate(skillIndex: number, rating: number, msgId: string) {
    const stepKey: StepKey = `skill_${skillIndex}`;
    lockStep(stepKey);
    const skill = SKILLS[skillIndex];
    addMessage({
      role: "user",
      content: `${skill.label}: ${rating}/5`,
    });
    setAnswers({
      skills: { ...userAnswers.skills, [skill.key]: rating },
    });

    // Lock this step's interactive
    setInteractiveMap((prev) => ({
      ...prev,
      [msgId]: (
        <SkillRater
          key={`${msgId}-locked`}
          skillLabel={skill.label}
          disabled
          onRate={() => {}}
        />
      ),
    }));

    const nextSkillIndex = skillIndex + 1;
    if (nextSkillIndex < SKILLS.length) {
      const nextSkill = SKILLS[nextSkillIndex];
      botSay(
        skillQuestionText(nextSkill.label, nextSkillIndex),
        "skills",
        nextSkillIndex,
      );
    } else {
      // Move to personality
      setPhase("personality");
      const pq = PERSONALITY_QUESTIONS[0];
      botSay(personalityQuestionText(pq.question, 0), "personality", 0);
    }
  }

  function handlePersonalityChoose(
    pIndex: number,
    key: string,
    choice: string,
    msgId: string,
  ) {
    const stepKey: StepKey = `personality_${pIndex}`;
    lockStep(stepKey);
    const pq = PERSONALITY_QUESTIONS[pIndex];
    addMessage({ role: "user", content: choice });
    setAnswers({
      personality: { ...userAnswers.personality, [key]: choice },
    });

    // Lock this step's interactive
    setInteractiveMap((prev) => ({
      ...prev,
      [msgId]: (
        <PersonalityChoice
          key={`${msgId}-locked`}
          optionA={pq.optionA}
          optionB={pq.optionB}
          disabled
          onChoose={() => {}}
        />
      ),
    }));

    const nextPIndex = pIndex + 1;
    if (nextPIndex < PERSONALITY_QUESTIONS.length) {
      const nextPq = PERSONALITY_QUESTIONS[nextPIndex];
      botSay(
        personalityQuestionText(nextPq.question, nextPIndex),
        "personality",
        nextPIndex,
      );
    } else {
      // Analyze
      setIsTyping(true);
      addMessage({
        role: "bot",
        content: "✨ Analyzing your profile…",
      });
      const updatedPersonality = {
        ...userAnswers.personality,
        [key]: choice,
      };
      setTimeout(() => {
        setIsTyping(false);
        const results = computeResults(
          userAnswers.interests,
          userAnswers.skills,
          updatedPersonality,
        );
        setResults(results);
      }, ANALYZE_DELAY);
    }
  }

  // ── Text input handler (free-form fallback) ──
  // biome-ignore lint/correctness/useExhaustiveDependencies: chatPhase captures all needed state
  const handleTextSend = useCallback(
    (text: string) => {
      // If in interests phase, treat typed text as a custom interest submission
      if (chatPhase === "interests") {
        lockStep("interests");
        const interestMap: Record<string, number> = { [text]: 1 };
        setAnswers({ interests: interestMap });
        addMessage({ role: "user", content: `My interests: ${text}` });
        setPhase("skills");
        const skill = SKILLS[0];
        botSay(skillQuestionText(skill.label, 0), "skills", 0);
      }
    },
    [chatPhase],
  );

  const handleEditAnswers = useCallback(() => {
    // Reset local refs/state so the init useEffect re-runs and fires botSay
    initialized.current = false;
    lastBotMsgId.current = null;
    setLockedSteps(new Set());
    setInteractiveMap({});
    newSession();
  }, [newSession]);

  const handleStartNew = useCallback(() => {
    newSession();
  }, [newSession]);

  // Progress label for TopBar
  const progressLabel = questionLabel(chatPhase, currentQuestionIndex);

  const inputDisabled =
    chatPhase === "skills" ||
    chatPhase === "personality" ||
    chatPhase === "results" ||
    isTyping;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 overflow-hidden"
      data-ocid="chat.page"
    >
      {/* Progress indicator */}
      {progressLabel && chatPhase !== "results" && (
        <div className="shrink-0 px-4 py-1.5 bg-muted/40 border-b border-border">
          <p
            className="text-xs text-muted-foreground text-center"
            data-ocid="chat.progress_label"
          >
            {progressLabel}
          </p>
        </div>
      )}

      <MessageList
        messages={messages}
        isTyping={isTyping}
        interactiveMap={interactiveMap}
      />

      {chatPhase === "results" ? (
        <ResultsView
          onEditAnswers={handleEditAnswers}
          onStartNew={handleStartNew}
        />
      ) : (
        <InputBar
          onSend={handleTextSend}
          disabled={inputDisabled}
          placeholder={
            chatPhase === "interests"
              ? "Type an interest or use chips above…"
              : "Use the buttons above to answer…"
          }
        />
      )}
    </div>
  );
}

// ── Results View ──────────────────────────────────────────────────────────────

interface ResultsViewProps {
  onEditAnswers: () => void;
  onStartNew: () => void;
}

function ResultsView({ onEditAnswers, onStartNew }: ResultsViewProps) {
  const { results, userAnswers } = useChatStore();

  if (!results || results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-8 text-center">
        No results yet.
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4"
      data-ocid="results.panel"
    >
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold font-display text-foreground">
          Your Career Matches
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your interests, skills, and personality
        </p>
      </div>

      {results.slice(0, 5).map((career, i) => (
        <div
          key={career.careerName}
          className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 bubble-fade-in"
          data-ocid={`results.item.${i + 1}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-accent uppercase tracking-wide">
                #{i + 1} Match
              </span>
              <h3 className="text-base font-semibold font-display text-foreground mt-0.5">
                {career.careerName}
              </h3>
            </div>
            <div className="shrink-0 flex flex-col items-center bg-accent/10 border border-accent/30 rounded-xl px-3 py-2">
              <span className="text-xl font-bold text-accent leading-none">
                {career.score}
              </span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Personalized explanation */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {career.explanation}
          </p>

          {/* User's key answers */}
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(userAnswers.interests)
              .slice(0, 3)
              .map((int) => (
                <span
                  key={int}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  {int}
                </span>
              ))}
            {Object.entries(userAnswers.skills)
              .filter(([, v]) => v >= 4)
              .slice(0, 2)
              .map(([sk, v]) => (
                <span
                  key={sk}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                >
                  {sk} {v}/5
                </span>
              ))}
          </div>

          {/* Improvements */}
          {career.improvements.length > 0 && (
            <div className="bg-muted/40 rounded-xl px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Areas to improve
              </p>
              <ul className="space-y-0.5">
                {career.improvements.map((imp) => (
                  <li key={imp} className="text-xs text-foreground/80">
                    • {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Future scope */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
            🔭 {career.futureScope}
          </p>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center mt-2 pb-4">
        <button
          type="button"
          onClick={onEditAnswers}
          className="px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-accent hover:bg-accent/10 transition-smooth"
          data-ocid="results.edit_answers_button"
        >
          ✏️ Edit Answers
        </button>
        <button
          type="button"
          onClick={onStartNew}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-smooth"
          data-ocid="results.new_chat_button"
        >
          🔄 Start New Chat
        </button>
      </div>
    </div>
  );
}
