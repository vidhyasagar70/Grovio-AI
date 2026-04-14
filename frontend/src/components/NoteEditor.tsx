import { useRef } from "react";

interface NoteEditorProps {
  title: string;
  content: string;
  saveStateText: string;
  isSaving: boolean;
  canFinish: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFinishNote: () => void;
}

const NoteEditor = ({
  title,
  content,
  saveStateText,
  isSaving,
  canFinish,
  onTitleChange,
  onContentChange,
  onFinishNote,
}: NoteEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertMarkdown = (prefix: string, suffix = "", placeholder = "text"): void => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    const body = selectedText || placeholder;
    const next = `${content.slice(0, start)}${prefix}${body}${suffix}${content.slice(end)}`;

    onContentChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectedText ? end + prefix.length + suffix.length : start + prefix.length + body.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const insertLinePrefix = (linePrefix: string, fallbackLine: string): void => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);

    const body = selectedText
      ? selectedText
          .split("\n")
          .map((line) => `${linePrefix}${line}`)
          .join("\n")
      : `${linePrefix}${fallbackLine}`;

    const next = `${content.slice(0, start)}${body}${content.slice(end)}`;
    onContentChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + body.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface)] text-[var(--text)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5">
        <h2 className="text-sm font-semibold tracking-tight">Editor</h2>
        <span className="text-xs text-[var(--muted)]">{saveStateText}</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3">
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Note title"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-medium text-[var(--text)] outline-none ring-[var(--muted-2)] placeholder:text-[var(--muted)] focus:ring-2"
        />

        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1.5 text-xs">
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertLinePrefix("# ", "Heading 1")}>H1</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertLinePrefix("## ", "Heading 2")}>H2</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertLinePrefix("### ", "Heading 3")}>H3</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertMarkdown("**", "**", "bold")}>Bold</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertMarkdown("*", "*", "italic")}>Italic</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertLinePrefix("- ", "list item")}>UL</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertLinePrefix("1. ", "list item")}>OL</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertMarkdown("`", "`", "code")}>Inline Code</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertMarkdown("``\n", "\n```", "code block")}>Code Block</button>
          <button type="button" className="rounded-xl border border-[var(--border)] px-2 py-1.5 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={() => insertMarkdown("[", "](https://example.com)", "link text")}>Link</button>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="Write markdown here..."
          className="min-h-0 w-full flex-1 resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-sm text-[var(--text)] outline-none ring-[var(--muted-2)] placeholder:text-[var(--muted)] focus:ring-2"
        />

        <div className="flex items-center justify-end border-t border-[var(--border)] pt-2">
          <button
            type="button"
            onClick={onFinishNote}
            disabled={!canFinish || isSaving}
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-text)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Finish Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
