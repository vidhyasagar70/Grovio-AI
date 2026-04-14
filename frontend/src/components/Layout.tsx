import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}

const Layout = ({ sidebar, editor, preview }: LayoutProps) => {
  const { logout, user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Markdown Notes</h1>
            <p className="text-xs text-[var(--muted)]">
              {user ? `Logged in as ${user.email}` : "Production-ready CRUD app with live Markdown preview"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-[var(--border)] bg-[var(--danger-soft)] px-4 py-2 text-sm font-semibold text-[var(--danger)] transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid h-[calc(100vh-73px)] w-full max-w-[1400px] grid-cols-1 gap-3 p-3 lg:grid-cols-[300px_1fr]">
        <aside className="min-h-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          {sidebar}
        </aside>

        <section className="grid min-h-0 grid-cols-1 gap-3 xl:grid-cols-2">
          <div className="min-h-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            {editor}
          </div>
          <div className="min-h-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            {preview}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
