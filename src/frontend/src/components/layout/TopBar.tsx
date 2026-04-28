import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";
import { BotIcon, MenuIcon } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { currentSessionId, allSessions } = useChatStore();

  const currentSession = allSessions.find((s) => s.id === currentSessionId);
  const title = currentSession?.title ?? "Career Advisor";

  return (
    <header className="relative shrink-0 h-14 flex items-center gap-3 px-4 bg-card/70 backdrop-blur-md">
      {/* Gradient bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(var(--accent) / 0.4) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-muted-foreground hover:text-foreground shrink-0"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        data-ocid="topbar.menu_toggle"
      >
        <MenuIcon size={20} />
      </Button>

      {/* Bot avatar + title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0 w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shadow-xs">
          <BotIcon size={15} className="text-accent" />
          {/* Online dot */}
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse-online"
            aria-label="Online"
          />
        </div>

        <div className="min-w-0">
          <h1
            className="text-sm font-semibold font-display truncate gradient-text-accent leading-tight"
            title={title}
          >
            CareerChat
          </h1>
          <p className="text-[11px] text-muted-foreground truncate leading-tight">
            {title}
          </p>
        </div>
      </div>
    </header>
  );
}
