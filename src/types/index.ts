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
