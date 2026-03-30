import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatWindow({ messages, isStreaming, onSelectSources }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-[#050816]">
      <div className="space-y-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={`${message.role}-${index}-${message.timestamp || ""}`}
          message={message}
          onSelectSources={onSelectSources}
        />
      ))}

      {isStreaming ? (
        <div className="flex justify-start">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#0b1120]">
            <div className="flex gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300" />
            </div>
          </div>
        </div>
      ) : null}

      <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
