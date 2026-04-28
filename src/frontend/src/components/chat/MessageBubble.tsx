import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { BotIcon } from "lucide-react";
import type { ReactNode } from "react";

interface MessageBubbleProps {
  message: Message;
  /** Interactive component rendered beneath bot message text (chips, raters, etc.) */
  interactiveContent?: ReactNode;
}

export function MessageBubble({
  message,
  interactiveContent,
}: MessageBubbleProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex items-end gap-3 bubble-fade-in w-full",
        isBot ? "justify-start" : "justify-end",
      )}
      data-ocid={isBot ? "chat.bot_message" : "chat.user_message"}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/35 flex items-center justify-center mb-0.5 shadow-xs ring-2 ring-accent/10">
          <BotIcon size={14} className="text-accent" />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-2",
          isBot ? "items-start max-w-[80%]" : "items-end max-w-[72%]",
        )}
      >
        {/* Bubble */}
        {isBot ? (
          /* Bot bubble — elevated card with left accent border */
          <div
            className={cn(
              "relative px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
              "bg-card text-card-foreground border border-border/60",
              "rounded-2xl rounded-bl-sm shadow-md",
              "overflow-hidden",
            )}
          >
            {/* Left accent stripe */}
            <span
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-accent/60"
              aria-hidden
            />
            <span className="pl-1">{message.content}</span>
          </div>
        ) : (
          /* User bubble — gradient with subtle glow */
          <div
            className={cn(
              "px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
              "text-accent-foreground font-medium",
              "rounded-2xl rounded-br-sm",
            )}
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--accent)) 0%, oklch(0.62 0.22 200) 100%)",
              boxShadow:
                "0 2px 16px 0 oklch(var(--accent) / 0.35), 0 1px 4px 0 oklch(0 0 0 / 0.2)",
            }}
          >
            {message.content}
          </div>
        )}

        {/* Interactive choices below bot bubble */}
        {isBot && interactiveContent && (
          <div className="w-full">{interactiveContent}</div>
        )}

        {/* Timestamp — fades in on hover */}
        {message.timestamp && (
          <time className="text-[10px] text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-smooth select-none px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}
      </div>

      {/* User avatar */}
      {!isBot && (
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-0.5 border border-accent/25 shadow-xs"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--secondary)) 0%, oklch(0.28 0.004 250) 100%)",
          }}
        >
          <span className="text-[9px] font-bold text-foreground tracking-wide">
            YOU
          </span>
        </div>
      )}
    </div>
  );
}
