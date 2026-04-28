import { INTERESTS } from "@/lib/question-flow";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

interface InterestSelectorProps {
  onSubmit: (interests: string[]) => void;
  disabled?: boolean;
}

export function InterestSelector({
  onSubmit,
  disabled,
}: InterestSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");

  const toggle = (interest: string) => {
    if (disabled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const all = [...selected];
    if (custom.trim()) all.push(custom.trim());
    if (all.length === 0) return;
    onSubmit(all);
  };

  const canSubmit = selected.size > 0 || !!custom.trim();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-smooth",
        disabled && "opacity-50 pointer-events-none",
      )}
      data-ocid="interests.panel"
    >
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => {
          const isSelected = selected.has(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              disabled={disabled}
              data-ocid={`interests.chip.${interest.toLowerCase()}`}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "active:scale-95",
                isSelected
                  ? "border-accent/60 text-accent-foreground font-semibold"
                  : "bg-card/80 text-card-foreground border-border/60 hover:border-accent/50 hover:bg-accent/8 hover:text-accent",
              )}
              style={
                isSelected
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(var(--accent) / 0.85) 0%, oklch(0.62 0.22 200 / 0.85) 100%)",
                      boxShadow:
                        "0 0 0 2px oklch(var(--accent) / 0.25), 0 2px 8px oklch(var(--accent) / 0.2)",
                    }
                  : {}
              }
            >
              {isSelected && <CheckIcon size={12} strokeWidth={2.5} />}
              {interest}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Or type your own interest…"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canSubmit) handleSubmit();
        }}
        className={cn(
          "w-full bg-card/80 border border-border/60 rounded-xl px-4 py-2.5 text-sm",
          "placeholder:text-muted-foreground/60 text-foreground focus:outline-none",
          "focus:border-accent/60 focus:shadow-accent-glow transition-all duration-200",
        )}
        data-ocid="interests.custom_input"
        aria-label="Custom interest"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !canSubmit}
        className={cn(
          "self-start px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "active:scale-95",
          canSubmit && !disabled
            ? "btn-new-chat text-accent-foreground"
            : "bg-muted/60 text-muted-foreground/50 cursor-not-allowed",
        )}
        data-ocid="interests.submit_button"
      >
        Confirm Interests
      </button>
    </div>
  );
}
