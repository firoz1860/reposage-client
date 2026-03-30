import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../context/ThemeContext";

function ChatMessage({ message, onSelectSources }) {
  const isUser = message.role === "user";
  const { isDark } = useTheme();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-3xl px-5 py-4 shadow-lg ${
          isUser
            ? "bg-sky-500 text-white"
            : "border border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-[#0b1120] dark:text-slate-100"
        }`}
      >
        <div className={`max-w-none ${isDark ? "prose prose-invert" : "prose"} prose-p:my-2 prose-pre:my-3 prose-code:font-mono`}>
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (inline) {
                  return (
                    <code className="rounded bg-black/30 px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <SyntaxHighlighter
                    style={isDark ? vscDarkPlus : oneLight}
                    language={match?.[1] || "text"}
                    PreTag="div"
                    customStyle={{ borderRadius: "1rem", margin: 0, padding: "1rem", overflowX: "auto" }}
                    wrapLongLines
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {!isUser && message.sources?.length ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
            {message.sources.map((source) => (
              <button
                key={`${source.filePath}-${source.snippet?.slice(0, 12)}`}
                type="button"
                onClick={() => onSelectSources?.([source])}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
              >
                {source.filePath}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChatMessage;
