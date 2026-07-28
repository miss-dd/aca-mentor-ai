export type Role = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  program?: string;
  department?: string;
  level?: string;
  role: Role;
  avatarUrl?: string;
}

export type Category =
  | "admissions"
  | "registration"
  | "fees"
  | "examinations"
  | "graduation"
  | "calendar"
  | "policies"
  | "campus"
  | "support";

export interface Source {
  title: string;
  reference: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: Source[];
  suggestions?: string[];
  feedback?: "helpful" | "not_helpful" | null;
}

export interface Conversation {
  id: string;
  title: string;
  category: Category;
  updatedAt: string;
  saved?: boolean;
  messages: Message[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: Category;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: Category;
  updatedAt: string;
  fileType: string;
}

export interface ApiOk<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErr {
  success: false;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiOk<T> | ApiErr;

// ── Admin / Analytics ────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalQuestions: number;
  questionsToday: number;
  aiResponseRate: number; // 0-100
  avgResponseTimeMs: number;
  avgFeedbackRating: number; // 0-5
  questionsOverTime: { date: string; count: number }[];
  byCategory: { category: Category; count: number }[];
  topTopics: { topic: string; count: number }[];
  satisfactionTrend: { date: string; rating: number }[];
}

export type QueryStatus = "open" | "resolved" | "escalated" | "pending";

export interface StudentQuery {
  id: string;
  studentId: string;
  studentName: string;
  question: string;
  category: Category;
  status: QueryStatus;
  feedback?: "helpful" | "not_helpful" | null;
  createdAt: string;
  resolvedAt?: string;
  aiResponse?: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  description: string;
  category: Category;
  fileType: string;
  uploadedAt: string;
  updatedAt: string;
  status: "active" | "archived";
  size: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export interface SystemStatus {
  service: string;
  status: "operational" | "degraded" | "outage";
  latencyMs?: number;
  note?: string;
}

export interface FeedbackEntry {
  id: string;
  conversationId: string;
  messageId: string;
  studentId: string;
  rating: "helpful" | "not_helpful";
  category: Category;
  createdAt: string;
  question: string;
}
