"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-paper prose-headings:tracking-[-0.02em] prose-p:text-paper/80 prose-p:font-light prose-a:text-accent-300 prose-a:underline-offset-4 hover:prose-a:text-accent-200 prose-strong:text-paper prose-code:text-accent-200 prose-code:bg-ink-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-body-sm prose-pre:bg-ink-900 prose-pre:border prose-pre:border-ink-700/40 prose-blockquote:border-accent-500/40 prose-blockquote:text-paper/70 prose-hr:border-ink-700/40 prose-img:rounded-xl prose-table:text-paper/80 prose-th:text-paper prose-td:border-ink-700/40 prose-th:border-ink-700/40">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
