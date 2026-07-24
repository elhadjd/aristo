import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiConfig, getApiUrl } from "@/config/api";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const http = axios.create({
  baseURL: apiConfig.publicBaseUrl || undefined,
  timeout: apiConfig.timeoutMs,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined" && !config.skipAuth) {
    const token = window.localStorage.getItem("aristo_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.url && !config.url.startsWith("http")) {
    config.url = getApiUrl(config.url);
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string; sisgescError?: string }>) => {
    const data = error.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.sisgescError ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      message,
      detail: data?.detail || data?.sisgescError,
      status: error.response?.status,
      code: error.code,
      data,
    });
  },
);

const memoryCache = new Map<string, { expires: number; data: unknown }>();

export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = apiConfig.cacheTtlSeconds,
): Promise<T> {
  const hit = memoryCache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }

  const data = await fetcher();
  memoryCache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
  return data;
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
}
