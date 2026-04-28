import type { Message } from "@/types";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  /** Map of messageId → interactive content node (for last bot message only) */
  interactiveMap: Record<string, ReactNode>;
}

export function MessageList({
  messages,
  isTyping,
  interactiveMap,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any message/typing change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4"
      data-ocid="chat.message_list"
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          interactiveContent={interactiveMap[msg.id]}
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
