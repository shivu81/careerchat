import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const {
    allSessions,
    currentSessionId,
    loadSession,
    newSession,
    deleteSession,
  } = useChatStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNewChat = () => newSession();
  const handleLoadSession = (id: string) => loadSession(id);
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onToggle();
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full flex flex-col",
          "border-r border-border/60 bg-sidebar",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-[268px]" : "w-0 lg:w-[64px]",
          "lg:relative lg:z-auto",
        )}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.165 0.005 250) 0%, oklch(0.145 0.003 250) 100%)",
        }}
        aria-label="Chat history sidebar"
      >
        {/* Collapsed icon-only view on desktop */}
        <div
          className={cn(
            "flex flex-col h-full overflow-hidden",
            !isOpen && "lg:flex hidden",
          )}
        >
          <div className="flex items-center justify-center p-3 border-b border-border/50">
            <button
              type="button"
              onClick={handleNewChat}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "btn-new-chat text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              )}
              aria-label="New chat"
              data-ocid="sidebar.new_chat_button"
            >
              <PlusIcon size={17} />
            </button>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col items-center gap-1.5 p-2">
              {allSessions.slice(0, 10).map((session) => (
                <button
                  type="button"
                  key={session.id}
                  onClick={() => handleLoadSession(session.id)}
                  className={cn(
                    "relative w-10 h-10 rounded-xl flex items-center justify-center transition-snappy",
                    "hover:bg-sidebar-accent text-muted-foreground hover:text-foreground",
                    currentSessionId === session.id &&
                      "bg-sidebar-accent text-foreground border border-accent/30",
                  )}
                  aria-label={session.title}
                  title={session.title}
                >
                  <MessageSquareIcon size={16} />
                  {currentSessionId === session.id && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-online" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Expanded view */}
        <div
          className={cn(
            "flex flex-col h-full overflow-hidden",
            isOpen ? "flex" : "hidden lg:hidden",
          )}
        >
          {/* Branding header */}
          <div className="px-4 pt-4 pb-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <MessageSquareIcon size={13} className="text-accent" />
                </div>
                <span className="text-sm font-semibold font-display gradient-text-accent">
                  CareerChat
                </span>
              </div>
            </div>

            {/* New Chat button */}
            <button
              type="button"
              onClick={handleNewChat}
              className={cn(
                "w-full h-9 rounded-xl flex items-center justify-center gap-2",
                "btn-new-chat text-accent-foreground text-sm font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              )}
              aria-label="New chat"
              data-ocid="sidebar.new_chat_button"
            >
              <PlusIcon size={15} />
              New Chat
            </button>
          </div>

          {/* Section label */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Recent Chats
            </span>
          </div>

          {/* Sessions list */}
          <div className="relative flex-1 overflow-hidden">
            {/* Top fade */}
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-4 z-10"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.155 0.004 250), transparent)",
              }}
            />
            <ScrollArea className="h-full px-2 py-1">
              {allSessions.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 px-4 text-center"
                  data-ocid="sidebar.empty_state"
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mb-3">
                    <MessageSquareIcon
                      size={20}
                      className="text-muted-foreground/60"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No conversations yet.
                    <br />
                    Start a new chat to begin.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 pb-2">
                  {allSessions.map((session, idx) => {
                    const isActive = currentSessionId === session.id;
                    return (
                      // biome-ignore lint/a11y/useSemanticElements: outer can't be <button> due to nested delete <button>
                      <div
                        role="button"
                        tabIndex={0}
                        key={session.id}
                        onClick={() => handleLoadSession(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleLoadSession(session.id);
                        }}
                        onMouseEnter={() => setHoveredId(session.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={cn(
                          "group relative w-full text-left pl-3 pr-2 py-2.5 rounded-lg transition-snappy cursor-pointer",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive
                            ? "bg-sidebar-accent text-foreground border border-accent/20 shadow-xs"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )}
                        data-ocid={`sidebar.session.item.${idx + 1}`}
                      >
                        {/* Active left border indicator */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 rounded-full bg-accent"
                            aria-hidden
                          />
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold truncate leading-tight text-foreground">
                                {session.title}
                              </p>
                              {isActive && (
                                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-online" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5 leading-tight">
                              {session.preview}
                            </p>
                          </div>
                          {(hoveredId === session.id || isActive) && (
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, session.id)}
                              className="shrink-0 p-1 rounded-md hover:bg-destructive/15 hover:text-destructive text-muted-foreground/60 transition-snappy"
                              aria-label={`Delete ${session.title}`}
                              data-ocid={`sidebar.delete_button.${idx + 1}`}
                            >
                              <Trash2Icon size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
            {/* Bottom fade */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 z-10"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.145 0.003 250), transparent)",
              }}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground/70 text-center">
              © {new Date().getFullYear()} Built with{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent/80 hover:text-accent hover:underline transition-snappy"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Toggle button — floats at sidebar edge */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center justify-center",
          "w-5 h-10 rounded-r-lg border border-border/60 border-l-0",
          "text-muted-foreground hover:text-foreground transition-snappy shadow-sm",
          "hover:bg-sidebar-accent",
          isOpen ? "left-[268px]" : "left-[64px]",
        )}
        style={{
          background: "oklch(0.165 0.005 250)",
        }}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        data-ocid="sidebar.toggle"
      >
        {isOpen ? (
          <ChevronLeftIcon size={12} />
        ) : (
          <ChevronRightIcon size={12} />
        )}
      </button>
    </>
  );
}
