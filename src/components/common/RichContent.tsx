import { cn } from "@/utils/cn";

interface RichContentProps {
  // Sanitised by the API before it is stored; rendered as-is here.
  html: string;
  className?: string;
}

// Readable article typography from design tokens; no typography plugin here.
const PROSE =
  "text-base leading-relaxed text-fg-muted " +
  "[&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-fg " +
  "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-fg " +
  "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg " +
  "[&_p]:my-4 [&_strong]:text-fg [&_a]:font-medium [&_a]:text-accent [&_a]:underline " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 " +
  "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic " +
  "[&_img]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-border " +
  "[&_hr]:my-8 [&_hr]:border-border [&_table]:my-6 [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-2 " +
  "[&_th]:border [&_th]:border-border [&_th]:bg-bg-2 [&_th]:p-2 [&_th]:text-left [&_th]:text-fg " +
  "[&>*:first-child]:mt-0";

/** Dashboard-authored HTML (articles, custom pages) with prose styling. */
export function RichContent({ html, className }: RichContentProps) {
  return <div className={cn(PROSE, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
