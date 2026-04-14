export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedNotes {
  items: Note[];
  pagination: PaginationMeta;
}
