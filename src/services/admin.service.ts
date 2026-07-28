import {
  mockAnalytics,
  mockQueries,
  mockKnowledgeDocs,
  mockAdminUsers,
  mockSystemStatus,
  mockFeedback,
  mockFaqs,
} from "@/lib/mock-data";
import { ok, simulateLatency } from "./api";
import type {
  ApiResponse,
  AnalyticsSummary,
  StudentQuery,
  QueryStatus,
  KnowledgeDoc,
  AdminUser,
  SystemStatus,
  FeedbackEntry,
  FAQ,
} from "@/types";

let queryStore: StudentQuery[] = [...mockQueries];
let docStore: KnowledgeDoc[] = [...mockKnowledgeDocs];
let userStore: AdminUser[] = [...mockAdminUsers];
let faqStore: FAQ[] = [...mockFaqs];

export const adminService = {
  // Analytics
  async getAnalytics(): Promise<ApiResponse<AnalyticsSummary>> {
    await simulateLatency(300);
    return ok(mockAnalytics);
  },

  // Queries
  async listQueries(): Promise<ApiResponse<StudentQuery[]>> {
    await simulateLatency(250);
    return ok([...queryStore].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  },
  async updateQueryStatus(id: string, status: QueryStatus): Promise<ApiResponse<StudentQuery>> {
    await simulateLatency(150);
    const q = queryStore.find((x) => x.id === id);
    if (!q) return { success: false, error: { code: "NOT_FOUND", message: "Query not found" } };
    q.status = status;
    if (status === "resolved") q.resolvedAt = new Date().toISOString();
    return ok(q);
  },

  // Knowledge base
  async listDocs(): Promise<ApiResponse<KnowledgeDoc[]>> {
    await simulateLatency(200);
    return ok([...docStore]);
  },
  async archiveDoc(id: string): Promise<ApiResponse<KnowledgeDoc>> {
    await simulateLatency(150);
    const doc = docStore.find((d) => d.id === id);
    if (!doc) return { success: false, error: { code: "NOT_FOUND", message: "Document not found" } };
    doc.status = "archived";
    return ok(doc);
  },
  async deleteDoc(id: string): Promise<ApiResponse<null>> {
    await simulateLatency(150);
    docStore = docStore.filter((d) => d.id !== id);
    return ok(null);
  },
  // In production this requests a signed S3 upload URL from the backend
  async requestUploadUrl(filename: string): Promise<ApiResponse<{ uploadUrl: string; key: string }>> {
    await simulateLatency(200);
    return ok({ uploadUrl: `#mock-upload/${filename}`, key: `docs/${filename}` });
  },

  // FAQs (admin)
  async listFaqs(): Promise<ApiResponse<FAQ[]>> {
    await simulateLatency(200);
    return ok([...faqStore]);
  },
  async createFaq(data: Omit<FAQ, "id" | "updatedAt">): Promise<ApiResponse<FAQ>> {
    await simulateLatency(200);
    const faq: FAQ = {
      ...data,
      id: "f-" + Date.now().toString(36),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    faqStore = [faq, ...faqStore];
    return ok(faq);
  },
  async updateFaq(id: string, data: Partial<Omit<FAQ, "id">>): Promise<ApiResponse<FAQ>> {
    await simulateLatency(150);
    const faq = faqStore.find((f) => f.id === id);
    if (!faq) return { success: false, error: { code: "NOT_FOUND", message: "FAQ not found" } };
    Object.assign(faq, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    return ok(faq);
  },
  async deleteFaq(id: string): Promise<ApiResponse<null>> {
    await simulateLatency(150);
    faqStore = faqStore.filter((f) => f.id !== id);
    return ok(null);
  },

  // Feedback
  async listFeedback(): Promise<ApiResponse<FeedbackEntry[]>> {
    await simulateLatency(200);
    return ok([...mockFeedback]);
  },

  // Users
  async listUsers(): Promise<ApiResponse<AdminUser[]>> {
    await simulateLatency(200);
    return ok([...userStore]);
  },
  async updateUserStatus(id: string, status: "active" | "suspended"): Promise<ApiResponse<AdminUser>> {
    await simulateLatency(150);
    const u = userStore.find((x) => x.id === id);
    if (!u) return { success: false, error: { code: "NOT_FOUND", message: "User not found" } };
    u.status = status;
    return ok(u);
  },

  // System status
  async getSystemStatus(): Promise<ApiResponse<SystemStatus[]>> {
    await simulateLatency(200);
    return ok(mockSystemStatus);
  },
};
