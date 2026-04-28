import type { CareerResult, UserAnswers } from "../types";
import { CAREERS, type Career, INTEREST_AREAS } from "./career-data";

// ---------------------------------------------------------------------------
// Weights
// ---------------------------------------------------------------------------
const W_INTERESTS = 0.3;
const W_SKILLS = 0.4;
const W_PERSONALITY = 0.3;

// ---------------------------------------------------------------------------
// Interests score (0-100)
// Matching = userAnswer for that interest area is >= 3 (out of 5)
// ---------------------------------------------------------------------------
function scoreInterests(
  career: Career,
  interests: Record<string, number>,
): number {
  const required = career.requiredInterests;
  if (required.length === 0) return 0;
  let matched = 0;
  for (const area of required) {
    const rating = interests[area] ?? 0;
    if (rating >= 3) matched++;
  }
  return (matched / required.length) * 100;
}

// ---------------------------------------------------------------------------
// Skills score (0-100) — weighted average of user skill ratings (1-5 scale)
// Unrated = 0. Normalized: user score / 5 * 100 * weight, then sum.
// ---------------------------------------------------------------------------
function scoreSkills(career: Career, skills: Record<string, number>): number {
  let total = 0;
  for (const req of career.requiredSkills) {
    const userRating = skills[req.name] ?? 0;
    const normalized = (userRating / 5) * 100;
    total += normalized * req.weight;
  }
  return total; // already in 0-100 range since weights sum to 1
}

// ---------------------------------------------------------------------------
// Personality score (0-100)
// Score = matching axes / 3 * 100
// ---------------------------------------------------------------------------
function scorePersonality(
  career: Career,
  personality: Record<string, string>,
): number {
  const total = career.suitablePersonality.length;
  if (total === 0) return 0;
  let matched = 0;
  for (const req of career.suitablePersonality) {
    if (personality[req.axis] === req.value) matched++;
  }
  return (matched / 3) * 100; // always divide by 3 as per spec
}

// ---------------------------------------------------------------------------
// Compute weak areas — skills rated below 3 that are heavily weighted
// ---------------------------------------------------------------------------
function computeWeakAreas(
  career: Career,
  skills: Record<string, number>,
): string[] {
  const weak: { name: string; rating: number; weight: number }[] = [];
  for (const req of career.requiredSkills) {
    const rating = skills[req.name] ?? 0;
    if (rating < 3) {
      weak.push({ name: req.name, rating, weight: req.weight });
    }
  }
  // Sort by weight descending, return top 2
  weak.sort((a, b) => b.weight - a.weight);
  return weak.slice(0, 2).map((w) => {
    const level =
      w.rating === 0 ? "no experience listed" : `rated ${w.rating}/5`;
    return `${w.name} (${level})`;
  });
}

// ---------------------------------------------------------------------------
// Generate personalized explanation (non-negotiable: must cite actual answers)
// ---------------------------------------------------------------------------
export function generateExplanation(
  career: Career,
  userAnswers: UserAnswers,
): string {
  const { interests, skills, personality } = userAnswers;

  // --- Interests paragraph ---
  const matchedInterests = career.requiredInterests.filter(
    (i) => (interests[i] ?? 0) >= 3,
  );
  const interestLines: string[] = [];
  for (const area of career.requiredInterests) {
    const rating = interests[area] ?? 0;
    const label =
      rating >= 4
        ? "strong interest"
        : rating === 3
          ? "moderate interest"
          : "low interest";
    interestLines.push(`${area} (${rating}/5 — ${label})`);
  }
  const interestSentence =
    matchedInterests.length > 0
      ? `Your ${interestLines.join(" and ")} directly align with this career's core focus areas.`
      : `Your interest profile doesn't strongly match this career's key areas (${interestLines.join(", ")}), but other factors contributed to this score.`;

  // --- Skills paragraph ---
  const skillLines: string[] = [];
  for (const req of career.requiredSkills.slice(0, 3)) {
    const rating = skills[req.name] ?? 0;
    const strength =
      rating >= 4
        ? "strong"
        : rating === 3
          ? "solid"
          : rating > 0
            ? "developing"
            : "not rated";
    skillLines.push(`${req.name} (${rating}/5 — ${strength})`);
  }
  const skillSentence = `Key skill alignment: ${skillLines.join(", ")}.`;

  // --- Personality paragraph ---
  const personalityLines: string[] = [];
  for (const req of career.suitablePersonality) {
    const userVal = personality[req.axis];
    const match =
      userVal === req.value
        ? "✓ matches"
        : `✗ your answer was "${userVal ?? "unanswered"}"`;
    personalityLines.push(`${req.axis.replace(/_/g, " ")}: ${match}`);
  }
  const personalityMatches = career.suitablePersonality.filter(
    (p) => personality[p.axis] === p.value,
  ).length;
  const personalityStrength =
    personalityMatches === 3
      ? "perfectly"
      : personalityMatches === 2
        ? "mostly"
        : personalityMatches === 1
          ? "partially"
          : "minimally";
  const personalitySentence = `Your personality ${personalityStrength} aligns with this career's ideal profile — ${personalityLines.join("; ")}.`;

  return `${interestSentence} ${skillSentence} ${personalitySentence}`;
}

// ---------------------------------------------------------------------------
// Main scoring function — returns all CareerResults, sorted by score desc
// ---------------------------------------------------------------------------
export function scoreAllCareers(userAnswers: UserAnswers): CareerResult[] {
  const results: CareerResult[] = [];

  for (const career of CAREERS) {
    const interestScore = scoreInterests(career, userAnswers.interests);
    const skillScore = scoreSkills(career, userAnswers.skills);
    const personalityScore = scorePersonality(career, userAnswers.personality);

    const finalScore =
      interestScore * W_INTERESTS +
      skillScore * W_SKILLS +
      personalityScore * W_PERSONALITY;

    const weakAreas = computeWeakAreas(career, userAnswers.skills);
    const improvements = weakAreas.map((area) => `Improve ${area}`);

    const explanation = generateExplanation(career, userAnswers);

    results.push({
      careerName: career.name,
      score: Math.round(finalScore),
      explanation,
      improvements,
      futureScope: career.futureScope,
    });
  }

  // Sort highest first
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ---------------------------------------------------------------------------
// Helper: get interest labels for display
// ---------------------------------------------------------------------------
export { INTEREST_AREAS };
