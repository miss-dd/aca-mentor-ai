import { mockConversations, generateAiResponse } from "@/lib/mock-data";
import { ok, simulateLatency } from "./api";
import type { ApiResponse, Conversation, Message } from "@/types";

let store: Conversation[] = [...mockConversations];

export const conversationService = {
  async list(): Promise<ApiResponse<Conversation[]>> {
    await simulateLatency(300);
    return ok([...store].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)));
  },
  async get(id: string): Promise<ApiResponse<Conversation | null>> {
    await simulateLatency(200);
    return ok(store.find((c) => c.id === id) ?? null);
  },
  async create(firstMessage: string): Promise<ApiResponse<Conversation>> {
    await simulateLatency(200);
    const c: Conversation = {
      id: "c-" + Date.now().toString(36),
      title: firstMessage.slice(0, 60),
      category: "support",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    store = [c, ...store];
    return ok(c);
  },
  async sendMessage(
    conversationId: string,
    text: string,
  ): Promise<ApiResponse<{ userMessage: Message; aiMessage: Message }>> {
    await simulateLatency(300);
    const conv = store.find((c) => c.id === conversationId);
    if (!conv)
      return { success: false, error: { code: "NOT_FOUND", message: "Conversation not found" } };
    const userMessage: Message = {
      id: "m-" + Date.now().toString(36) + "-u",
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const ai = generateAiResponse(text);
    const aiMessage: Message = {
      id: "m-" + Date.now().toString(36) + "-a",
      role: "assistant",
      content: ai.content,
      createdAt: new Date().toISOString(),
      sources: ai.sources,
      suggestions: ai.suggestions,
      feedback: null,
    };
    conv.messages.push(userMessage, aiMessage);
    conv.updatedAt = new Date().toISOString();
    if (conv.messages.length === 2) conv.title = text.slice(0, 60);
    return ok({ userMessage, aiMessage });
  },
  async rename(id: string, title: string): Promise<ApiResponse<Conversation>> {
    await simulateLatency(150);
    const conv = store.find((c) => c.id === id);
    if (!conv) return { success: false, error: { code: "NOT_FOUND", message: "Not found" } };
    conv.title = title;
    return ok(conv);
  },
  async remove(id: string): Promise<ApiResponse<null>> {
    await simulateLatency(150);
    store = store.filter((c) => c.id !== id);
    return ok(null);
  },
  async toggleSave(id: string): Promise<ApiResponse<Conversation>> {
    const conv = store.find((c) => c.id === id);
    if (!conv) return { success: false, error: { code: "NOT_FOUND", message: "Not found" } };
    conv.saved = !conv.saved;
    return ok(conv);
  },
  async setFeedback(
    conversationId: string,
    messageId: string,
    feedback: "helpful" | "not_helpful",
  ): Promise<ApiResponse<null>> {
    const conv = store.find((c) => c.id === conversationId);
    const msg = conv?.messages.find((m) => m.id === messageId);
    if (msg) msg.feedback = feedback;
    return ok(null);
  },
};
