import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface)] text-[var(--text)]">
      <div className="border-b border-[var(--border)] px-3 py-2.5">
        <h2 className="text-sm font-semibold tracking-tight">Preview</h2>
      </div>

      <article className="markdown-content min-h-0 overflow-y-auto p-4 text-sm leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.length > 0 ? content : "Start typing markdown on the left..."}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default MarkdownPreview;
