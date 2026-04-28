import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

interface PersonalityChoiceProps {
  optionA: string;
  optionB: string;
  onChoose: (choice: string) => void;
  disabled?: boolean;
}

export function PersonalityChoice({
  optionA,
  optionB,
  onChoose,
  disabled,
}: PersonalityChoiceProps) {
  const options = [optionA, optionB] as const;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 transition-smooth",
        disabled && "opacity-50 pointer-events-none",
      )}
      data-ocid="personality.panel"
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onChoose(option)}
          disabled={disabled}
          data-ocid={`personality.choice.${i === 0 ? "a" : "b"}`}
          className={cn(
            "group flex items-center gap-3 w-full text-left",
            "px-4 py-3.5 rounded-xl border text-sm font-medium",
            "transition-all duration-200 cursor-pointer",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "bg-card/80 text-card-foreground border-border/60",
            "hover:border-accent/50 hover:shadow-md active:scale-[0.98]",
          )}
          style={{}}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background =
              "linear-gradient(135deg, oklch(var(--accent) / 0.08) 0%, oklch(0.62 0.22 200 / 0.08) 100%)";
            el.style.color = "oklch(var(--accent))";
            el.style.borderColor = "oklch(var(--accent) / 0.45)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "";
            el.style.color = "";
            el.style.borderColor = "";
          }}
        >
          <span className="shrink-0 w-6 h-6 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:bg-accent/15 group-hover:border-accent/30 group-hover:text-accent transition-all duration-200">
            <SparklesIcon size={12} />
          </span>
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}
