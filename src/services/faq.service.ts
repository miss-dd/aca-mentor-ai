import { mockFaqs } from "@/lib/mock-data";
import { ok, simulateLatency } from "./api";
import type { ApiResponse, FAQ } from "@/types";

export const faqService = {
  async list(): Promise<ApiResponse<FAQ[]>> {
    await simulateLatency(200);
    return ok(mockFaqs);
  },
};
