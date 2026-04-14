import type { ApiResponse } from "../types/api";
import type { Note, PaginatedNotes } from "../types/note";
import { API_BASE_URL } from "./apiBaseUrl";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("authToken");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" };
};

const assertOk = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Request failed.");
  }
  return payload;
};

export interface ListParams {
  page: number;
  limit: number;
  search?: string;
}

export const notesApi = {
  async list(params: ListParams): Promise<PaginatedNotes> {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      ...(params.search ? { search: params.search } : {}),
    });

    const response = await fetch(`${API_BASE_URL}/notes?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const payload = await assertOk<PaginatedNotes>(response);
    return payload.data;
  },

  async getById(id: number): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      headers: getAuthHeaders(),
    });
    const payload = await assertOk<Note>(response);
    return payload.data;
  },

  async create(input: { title: string; content: string }): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    const payload = await assertOk<Note>(response);
    return payload.data;
  },

  async update(id: number, input: { title?: string; content?: string }): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    const payload = await assertOk<Note>(response);
    return payload.data;
  },

  async remove(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    await assertOk<null>(response);
  },
};
