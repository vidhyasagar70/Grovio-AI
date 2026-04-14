import { useCallback, useEffect, useRef, useState } from "react";
import { notesApi } from "./api/notesApi";
import AuthForm from "./components/AuthForm";
import Layout from "./components/Layout";
import MarkdownPreview from "./components/MarkdownPreview";
import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";
import { useAuth } from "./context/AuthContext";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import type { Note, PaginationMeta } from "./types/note";
import "./App.css";

const DEFAULT_PAGE_SIZE = 8;

const emptyPagination: PaginationMeta = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

const makeSnapshot = (title: string, content: string): string => `${title}__${content}`;

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState("");
  const [lastSavedNoteId, setLastSavedNoteId] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSelectingNote, setIsSelectingNote] = useState(false);
  const selectedNoteIdRef = useRef<number | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const debouncedEditor = useDebouncedValue(
    { noteId: selectedNoteId, title: editorTitle, content: editorContent },
    700,
  );

  useEffect(() => {
    selectedNoteIdRef.current = selectedNoteId;
  }, [selectedNoteId]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    setNotes([]);
    setSelectedNoteId(null);
    setEditorTitle("");
    setEditorContent("");
    setPagination(emptyPagination);
    setPage(1);
    setSearchInput("");
    setIsListLoading(false);
    setIsSaving(false);
    setStatusMessage("Ready");
    setLastSavedSnapshot("");
    setLastSavedNoteId(null);
    setIsFinishing(false);
    setIsSelectingNote(false);
  }, [isAuthenticated]);

  const loadNotes = useCallback(async (targetPage = page) => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    setIsListLoading(true);
    try {
      const data = await notesApi.list({
        page: targetPage,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
      });
      setNotes(data.items);
      setPagination(data.pagination);
      setStatusMessage("Notes loaded");

      if (data.items.length === 0) {
        setSelectedNoteId(null);
        setEditorTitle("");
        setEditorContent("");
        setLastSavedSnapshot("");
        setLastSavedNoteId(null);
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to load notes.");
    } finally {
      setIsListLoading(false);
    }
  }, [debouncedSearch, isAuthenticated, isLoading, page]);

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    void loadNotes();
  }, [isAuthenticated, isLoading, loadNotes]);

  const handleSelectNote = useCallback(
    async (id: number) => {
      if (!isAuthenticated || isLoading || isSelectingNote) {
        return;
      }

      setIsSelectingNote(true);
      try {
        const note = await notesApi.getById(id);
        setSelectedNoteId(note.id);
        setEditorTitle(note.title);
        setEditorContent(note.content);
        setLastSavedSnapshot(makeSnapshot(note.title, note.content));
        setLastSavedNoteId(note.id);
        setStatusMessage("Note selected");
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Failed to load note.");
      } finally {
        setIsSelectingNote(false);
      }
    },
    [isAuthenticated, isLoading, isSelectingNote],
  );

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    if (selectedNoteId !== null) {
      return;
    }

    if (notes.length > 0) {
      void handleSelectNote(notes[0].id);
    }
  }, [handleSelectNote, isAuthenticated, isLoading, notes, selectedNoteId]);

  const handleCreateNote = useCallback(async () => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    try {
      const newNote = await notesApi.create({
        title: "Untitled note",
        content: "# New note\n\nStart writing...",
      });
      const targetPage = 1;
      setPage(targetPage);
      await loadNotes(targetPage);
      await handleSelectNote(newNote.id);
      setStatusMessage("Note created");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to create note.");
    }
  }, [handleSelectNote, isAuthenticated, isLoading, loadNotes]);

  const handleDeleteNote = useCallback(
    async (id: number) => {
      if (!isAuthenticated || isLoading) {
        return;
      }

      try {
        await notesApi.remove(id);
        if (selectedNoteId === id) {
          setSelectedNoteId(null);
          setEditorTitle("");
          setEditorContent("");
          setLastSavedSnapshot("");
          setLastSavedNoteId(null);
        }
        await loadNotes();
        setStatusMessage("Note deleted");
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Failed to delete note.");
      }
    },
    [isAuthenticated, isLoading, loadNotes, selectedNoteId],
  );

  const saveNote = useCallback(
    async (
      noteId: number,
      titleInput: string,
      contentInput: string,
      mode: "auto" | "manual",
    ): Promise<boolean> => {
      if (!isAuthenticated || isLoading || noteId <= 0) {
        return false;
      }

      const normalizedTitle = titleInput.trim() || "Untitled note";
      const snapshot = makeSnapshot(normalizedTitle, contentInput);

      if (lastSavedNoteId === noteId && snapshot === lastSavedSnapshot) {
        if (mode === "manual") {
          setStatusMessage("Already saved");
        }
        return true;
      }

      setIsSaving(true);
      try {
        const updated = await notesApi.update(noteId, {
          title: normalizedTitle,
          content: contentInput,
        });

        if (selectedNoteIdRef.current === updated.id) {
          setEditorTitle(updated.title);
          setEditorContent(updated.content);
        }
        setNotes((previous) =>
          previous.map((note) => (note.id === updated.id ? updated : note)),
        );
        setLastSavedSnapshot(makeSnapshot(updated.title, updated.content));
        setLastSavedNoteId(updated.id);
        setStatusMessage(mode === "manual" ? "Finished and saved" : "Auto-saved");
        return true;
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Failed to save note.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isAuthenticated, isLoading, lastSavedNoteId, lastSavedSnapshot],
  );

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    const runAutosave = async (): Promise<void> => {
      if (selectedNoteId === null) {
        return;
      }

      if (isFinishing) {
        return;
      }

      if (debouncedEditor.noteId !== selectedNoteId) {
        return;
      }

      await saveNote(
        selectedNoteId,
        debouncedEditor.title,
        debouncedEditor.content,
        "auto",
      );
    };

    void runAutosave();
  }, [debouncedEditor, isAuthenticated, isFinishing, isLoading, saveNote, selectedNoteId]);

  const handleFinishNote = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || isLoading || selectedNoteId === null || isFinishing) {
      return;
    }

    setIsFinishing(true);
    try {
      const saveSucceeded = await saveNote(selectedNoteId, editorTitle, editorContent, "manual");
      if (!saveSucceeded) {
        return;
      }

      const newNote = await notesApi.create({
        title: "Untitled note",
        content: "",
      });

      const targetPage = 1;
      setPage(targetPage);
      await loadNotes(targetPage);
      await handleSelectNote(newNote.id);
      setStatusMessage("Previous note finished. New note opened.");
    } finally {
      setIsFinishing(false);
    }
  }, [
    editorContent,
    editorTitle,
    handleSelectNote,
    isAuthenticated,
    isFinishing,
    isLoading,
    loadNotes,
    saveNote,
    selectedNoteId,
  ]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <Layout
      sidebar={
        <NotesList
          notes={notes}
          selectedNoteId={selectedNoteId}
          pagination={pagination}
          isLoading={isListLoading}
          searchTerm={searchInput}
          onSearchTermChange={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
          onSelectNote={(id) => {
            void handleSelectNote(id);
          }}
          onCreateNote={() => {
            void handleCreateNote();
          }}
          onDeleteNote={(id) => {
            void handleDeleteNote(id);
          }}
          onPageChange={setPage}
        />
      }
      editor={
        <NoteEditor
          title={editorTitle}
          content={editorContent}
          saveStateText={isSaving ? "Saving..." : statusMessage}
          isSaving={isSaving}
          canFinish={selectedNoteId !== null}
          onTitleChange={setEditorTitle}
          onContentChange={setEditorContent}
          onFinishNote={() => {
            void handleFinishNote();
          }}
        />
      }
      preview={<MarkdownPreview content={editorContent} />}
    />
  );
}

export default App;
