/**
 * Centralized API service layer.
 *
 * All frontend data access goes through service modules that eventually call
 * `api()`. Today they resolve against typed mock data; swap `MOCK_MODE` to
 * false and set `PUBLIC_API_BASE_URL` in the environment to route to a real
 * REST API (Amazon API Gateway) without changing component code.
 */
import type { ApiResponse } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env ?? {};
export const API_BASE_URL: string = env.VITE_PUBLIC_API_BASE_URL ?? "";
export const MOCK_MODE = !API_BASE_URL;

export async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    const body = (await res.json()) as ApiResponse<T>;
    return body;
  } catch (err) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Unknown error",
      },
    };
  }
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}
export function err(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}

export async function simulateLatency(ms = 400) {
  await new Promise((r) => setTimeout(r, ms));
}
