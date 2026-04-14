const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const API_BASE_URL = rawApiBaseUrl.endsWith("/")
	? rawApiBaseUrl.slice(0, -1)
	: rawApiBaseUrl;