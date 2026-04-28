import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBar({
  onSend,
  disabled = false,
  placeholder = "Type your message…",
}: InputBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const canSend = !disabled && !!value.trim();

  return (
    <div
      className="shrink-0 px-4 pb-4 pt-2"
      style={{
        background:
          "linear-gradient(to top, oklch(var(--background)) 70%, transparent)",
      }}
    >
      {/* Top separator */}
      <div
        className="h-px mb-3"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(var(--border) / 0.6) 30%, oklch(var(--border) / 0.6) 70%, transparent 100%)",
        }}
        aria-hidden
      />

      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all duration-200",
          "bg-card/80 backdrop-blur-sm",
          focused
            ? "border-accent/60 shadow-accent-glow"
            : "border-border/60 shadow-md",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
            "focus:outline-none min-h-[24px] max-h-[160px] leading-6",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          aria-label="Message input"
          data-ocid="chat.input"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
            "transition-all duration-200",
            canSend
              ? "btn-new-chat text-accent-foreground hover:scale-105 active:scale-95"
              : "bg-muted/60 text-muted-foreground/40 cursor-not-allowed",
          )}
          aria-label="Send message"
          data-ocid="chat.submit_button"
        >
          <SendIcon size={15} />
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
        AI can make mistakes. Verify important career decisions.
      </p>
    </div>
  );
}
