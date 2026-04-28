export interface CareerRequiredSkill {
  name: string;
  weight: number; // 0-1, weights should sum to 1 per career
}

export interface PersonalityMatch {
  axis: string;
  value: string;
}

export interface Career {
  id: string;
  name: string;
  requiredInterests: string[];
  requiredSkills: CareerRequiredSkill[];
  suitablePersonality: PersonalityMatch[];
  futureScope: string;
}

export const INTEREST_AREAS = [
  "Technology",
  "Design & Creativity",
  "Science & Research",
  "People & Helping",
  "Business & Management",
  "Teaching & Education",
  "Writing & Communication",
  "Art & Media",
];

export const SKILL_AREAS = [
  "Coding / Programming",
  "Data Analysis",
  "Graphic Design",
  "Communication",
  "Problem Solving",
  "Leadership",
  "Writing",
  "Empathy & Listening",
  "Math & Statistics",
  "Research",
  "Creativity",
  "Organization",
];

export const PERSONALITY_QUESTIONS: {
  axis: string;
  question: string;
  options: { label: string; value: string }[];
}[] = [
  {
    axis: "thinking_style",
    question: "When solving problems, you prefer to:",
    options: [
      { label: "Analyze data and think logically", value: "logical" },
      { label: "Trust your gut and be intuitive", value: "intuitive" },
      { label: "Collaborate and discuss with others", value: "collaborative" },
      { label: "Experiment and try things hands-on", value: "practical" },
    ],
  },
  {
    axis: "work_style",
    question: "Your ideal work environment is:",
    options: [
      { label: "Independent, deep-focus work", value: "independent" },
      { label: "Team-based, social collaboration", value: "social" },
      { label: "Structured with clear processes", value: "structured" },
      { label: "Flexible, creative, and dynamic", value: "creative" },
    ],
  },
  {
    axis: "motivation",
    question: "What drives you most at work?",
    options: [
      { label: "Building and creating things", value: "building" },
      { label: "Helping and impacting people", value: "helping" },
      { label: "Learning and discovering new ideas", value: "learning" },
      { label: "Leading and influencing decisions", value: "leading" },
    ],
  },
];

export const CAREERS: Career[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    requiredInterests: ["Technology", "Problem Solving"],
    requiredSkills: [
      { name: "Coding / Programming", weight: 0.45 },
      { name: "Problem Solving", weight: 0.3 },
      { name: "Math & Statistics", weight: 0.15 },
      { name: "Research", weight: 0.1 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "logical" },
      { axis: "work_style", value: "independent" },
      { axis: "motivation", value: "building" },
    ],
    futureScope:
      "Software Engineering remains one of the fastest-growing fields globally. AI, cloud computing, and full-stack development are expanding career paths, with demand projected to grow 25% over the next decade.",
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    requiredInterests: ["Technology", "Science & Research"],
    requiredSkills: [
      { name: "Data Analysis", weight: 0.35 },
      { name: "Math & Statistics", weight: 0.3 },
      { name: "Coding / Programming", weight: 0.2 },
      { name: "Research", weight: 0.15 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "logical" },
      { axis: "work_style", value: "independent" },
      { axis: "motivation", value: "learning" },
    ],
    futureScope:
      "Data Science is among the top in-demand careers. With AI and machine learning reshaping every industry, data scientists who can translate data into strategy are commanding top salaries globally.",
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    requiredInterests: ["Design & Creativity", "Art & Media"],
    requiredSkills: [
      { name: "Graphic Design", weight: 0.4 },
      { name: "Creativity", weight: 0.35 },
      { name: "Communication", weight: 0.15 },
      { name: "Organization", weight: 0.1 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "intuitive" },
      { axis: "work_style", value: "creative" },
      { axis: "motivation", value: "building" },
    ],
    futureScope:
      "Graphic design is evolving with UI/UX, motion graphics, and brand identity demands. Designers who combine creative skills with digital tools are thriving across tech, media, and marketing industries.",
  },
  {
    id: "psychologist",
    name: "Psychologist",
    requiredInterests: ["People & Helping", "Science & Research"],
    requiredSkills: [
      { name: "Empathy & Listening", weight: 0.4 },
      { name: "Communication", weight: 0.25 },
      { name: "Research", weight: 0.2 },
      { name: "Writing", weight: 0.15 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "intuitive" },
      { axis: "work_style", value: "social" },
      { axis: "motivation", value: "helping" },
    ],
    futureScope:
      "Mental health awareness is at an all-time high. Psychologists are in growing demand across clinical, corporate, and educational settings, with telehealth expanding access and career opportunities globally.",
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    requiredInterests: ["Business & Management", "Technology"],
    requiredSkills: [
      { name: "Data Analysis", weight: 0.3 },
      { name: "Communication", weight: 0.25 },
      { name: "Problem Solving", weight: 0.25 },
      { name: "Organization", weight: 0.2 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "logical" },
      { axis: "work_style", value: "structured" },
      { axis: "motivation", value: "leading" },
    ],
    futureScope:
      "Business Analysts bridge strategy and execution across every industry. With digital transformation accelerating, analysts who understand both data and business context are highly sought after.",
  },
  {
    id: "teacher",
    name: "Teacher / Educator",
    requiredInterests: ["Teaching & Education", "People & Helping"],
    requiredSkills: [
      { name: "Communication", weight: 0.35 },
      { name: "Empathy & Listening", weight: 0.3 },
      { name: "Organization", weight: 0.2 },
      { name: "Creativity", weight: 0.15 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "collaborative" },
      { axis: "work_style", value: "social" },
      { axis: "motivation", value: "helping" },
    ],
    futureScope:
      "Education is transforming with e-learning, EdTech, and personalized learning. Educators who blend traditional skills with digital tools can reach global audiences and command premium positions.",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    requiredInterests: ["Writing & Communication", "Art & Media"],
    requiredSkills: [
      { name: "Writing", weight: 0.35 },
      { name: "Creativity", weight: 0.3 },
      { name: "Communication", weight: 0.2 },
      { name: "Organization", weight: 0.15 },
    ],
    suitablePersonality: [
      { axis: "thinking_style", value: "intuitive" },
      { axis: "work_style", value: "creative" },
      { axis: "motivation", value: "building" },
    ],
    futureScope:
      "Content creation is a booming industry with social media, streaming, and brand storytelling at its peak. Creators who build authentic audiences and master multiple formats can achieve significant impact and income.",
  },
];
