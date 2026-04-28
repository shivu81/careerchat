export const INTERESTS = [
  "Technology",
  "Art",
  "Business",
  "Science",
  "Sports",
] as const;

export type Interest = (typeof INTERESTS)[number];

export const SKILLS = [
  { key: "Coding", label: "Coding / Programming" },
  { key: "Communication", label: "Communication" },
  { key: "Design", label: "Design" },
  { key: "Analysis", label: "Analysis" },
  { key: "Writing", label: "Writing" },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

export const SKILL_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const PERSONALITY_QUESTIONS = [
  {
    key: "energy",
    question: "Are you more…",
    optionA: "Introvert",
    optionB: "Extrovert",
  },
  {
    key: "thinking",
    question: "Do you prefer…",
    optionA: "Logical thinking",
    optionB: "Creative thinking",
  },
  {
    key: "role",
    question: "In groups, you tend to be a…",
    optionA: "Leader",
    optionB: "Supporter",
  },
] as const;

export type PersonalityKey = (typeof PERSONALITY_QUESTIONS)[number]["key"];

/** Total question count for progress display */
// 1 (interests) + 5 (skills) + 3 (personality) = 9
export const TOTAL_QUESTIONS = 9;

export function questionLabel(phase: string, index: number): string {
  if (phase === "interests") return "Question 1 of 9";
  if (phase === "skills") return `Question ${2 + index} of 9`;
  if (phase === "personality") return `Question ${7 + index} of 9`;
  return "";
}
