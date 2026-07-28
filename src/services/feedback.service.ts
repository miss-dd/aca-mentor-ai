import { ok, simulateLatency } from "./api";
import type { ApiResponse } from "@/types";

export const feedbackService = {
  async submit(data: {
    conversationId: string;
    messageId: string;
    rating: "helpful" | "not_helpful";
    comment?: string;
  }): Promise<ApiResponse<null>> {
    await simulateLatency(150);
    // In production this POSTs to /feedback via API Gateway → Lambda → DynamoDB
    console.info("[mock] feedback submitted", data);
    return ok(null, "Feedback recorded");
  },
};
