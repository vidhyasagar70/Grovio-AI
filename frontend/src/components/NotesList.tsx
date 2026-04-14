import type { Note, PaginationMeta } from "../types/note";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: number | null;
  pagination: PaginationMeta;
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSelectNote: (id: number) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: number) => void;
  onPageChange: (page: number) => void;
}

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const NotesList = ({
  notes,
  selectedNoteId,
  pagination,
  isLoading,
  searchTerm,
  onSearchTermChange,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onPageChange,
}: NotesListProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b border-[var(--border)] p-3">
        <button
          type="button"
          onClick={onCreateNote}
          className="w-full rounded-xl bg-[var(--accent)] px-3 py-2.5 text-sm font-semibold text-[var(--accent-text)] shadow-sm transition hover:-translate-y-0.5 hover:opacity-95"
        >
          + New note
        </button>
        <input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          type="text"
          placeholder="Search title/content"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none ring-[var(--muted-2)] placeholder:text-[var(--muted)] focus:ring-2"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-4 text-sm text-[var(--muted)]">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="p-4 text-sm text-[var(--muted)]">No notes found.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {notes.map((note) => (
              <li
                key={note.id}
                className={
                  selectedNoteId === note.id
                    ? "bg-[var(--surface-2)]"
                    : "hover:bg-[var(--surface-2)]"
                }
              >
                <div className="px-3 py-2.5">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectNote(note.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text)]">{note.title}</h3>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="rounded-lg p-2 text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                      aria-label={`Delete ${note.title}`}
                      title="Delete note"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectNote(note.id)}
                    className="w-full text-left"
                  >
                    <p className="line-clamp-2 text-xs text-[var(--muted)]">{note.content}</p>
                    <p className="mt-1.5 text-[11px] text-[var(--muted-2)]">{formatDate(note.updated_at)}</p>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
          className="rounded-lg border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <span>
          Page {pagination.page} / {pagination.totalPages} ({pagination.total})
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
          disabled={pagination.page >= pagination.totalPages}
          className="rounded-lg border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotesList;
