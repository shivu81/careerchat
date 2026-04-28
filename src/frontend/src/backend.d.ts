import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SkillRating {
    name: string;
    rating: bigint;
}
export interface CareerResult {
    improvements: Array<string>;
    explanation: string;
    careerName: string;
    score: bigint;
    futureScope: string;
}
export interface SessionSummary {
    id: SessionId;
    title: string;
    preview: string;
    timestamp: bigint;
}
export interface Session {
    id: SessionId;
    personality: Array<PersonalityAnswer>;
    title: string;
    interests: Array<string>;
    preview: string;
    results: Array<CareerResult>;
    timestamp: bigint;
    skills: Array<SkillRating>;
}
export type SessionId = bigint;
export interface SessionData {
    personality: Array<PersonalityAnswer>;
    title: string;
    interests: Array<string>;
    preview: string;
    results: Array<CareerResult>;
    timestamp: bigint;
    skills: Array<SkillRating>;
}
export interface PersonalityAnswer {
    value: string;
    axis: string;
}
export interface backendInterface {
    createSession(): Promise<SessionId>;
    deleteSession(id: SessionId): Promise<boolean>;
    getSession(id: SessionId): Promise<Session | null>;
    listSessions(): Promise<Array<SessionSummary>>;
    saveSession(id: SessionId, data: SessionData): Promise<boolean>;
}
