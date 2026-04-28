import { cn } from "@/lib/utils";
import { BotIcon } from "lucide-react";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-end gap-3 bubble-fade-in", className)}
      aria-label="Bot is typing"
      data-ocid="chat.typing_indicator"
    >
      {/* Avatar — matches bot message avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/35 flex items-center justify-center mb-0.5 shadow-xs ring-2 ring-accent/10">
        <BotIcon size={14} className="text-accent" />
      </div>

      {/* Dots bubble with shimmer bg */}
      <div
        className="relative flex items-center gap-1.5 border border-border/60 rounded-2xl rounded-bl-sm px-5 py-4 overflow-hidden shadow-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(0.20 0.006 250) 100%)",
        }}
      >
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(var(--accent) / 0.06) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.4s ease-in-out infinite",
          }}
          aria-hidden
        />
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
