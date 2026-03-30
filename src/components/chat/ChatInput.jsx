import { SendHorizonal } from "lucide-react";
import { useState } from "react";

function ChatInput({ onSend, isStreaming }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || isStreaming) {
      return;
    }

    onSend(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/92 p-3 shadow-sm sm:flex-row dark:border-white/10 dark:bg-[#09101d]"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about this repo..."
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
      />
      <button
        type="submit"
        disabled={isStreaming}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60 sm:w-auto"
      >
        <SendHorizonal size={16} />
        Send
      </button>
    </form>
  );
}

export default ChatInput;
