import { mockResources } from "@/lib/mock-data";
import { ok, simulateLatency } from "./api";
import type { ApiResponse, Resource } from "@/types";

export const resourceService = {
  async list(): Promise<ApiResponse<Resource[]>> {
    await simulateLatency(200);
    return ok(mockResources);
  },
  // In production this would request a signed URL from the backend rather
  // than exposing storage credentials to the browser.
  async requestDownloadUrl(id: string): Promise<ApiResponse<{ url: string }>> {
    await simulateLatency(150);
    return ok({ url: `#mock-download/${id}` });
  },
};
