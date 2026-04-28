import { SKILL_LABELS } from "@/lib/question-flow";
import { cn } from "@/lib/utils";

interface SkillRaterProps {
  skillLabel: string;
  onRate: (rating: number) => void;
  disabled?: boolean;
}

const RATING_COLORS = [
  "oklch(0.55 0.14 25)", // 1 — red-ish
  "oklch(0.62 0.16 50)", // 2 — orange
  "oklch(0.68 0.18 80)", // 3 — yellow
  "oklch(0.65 0.18 150)", // 4 — green
  "oklch(0.62 0.22 200)", // 5 — cyan
] as const;

export function SkillRater({ skillLabel, onRate, disabled }: SkillRaterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 transition-smooth",
        disabled && "opacity-50 pointer-events-none",
      )}
      data-ocid="skills.panel"
      aria-label={`Rate your ${skillLabel} skill`}
    >
      <div className="flex flex-wrap gap-2">
        {([1, 2, 3, 4, 5] as const).map((rating) => {
          const color = RATING_COLORS[rating - 1];
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onRate(rating)}
              disabled={disabled}
              data-ocid={`skills.rating.${rating}`}
              className={cn(
                "flex flex-col items-center gap-1 px-5 py-3 rounded-xl border text-sm",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "bg-card/80 border-border/60 text-card-foreground",
                "hover:scale-105 hover:shadow-md active:scale-95",
              )}
              style={
                {
                  "--rating-color": color,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = `${color}`;
                el.style.color = color;
                el.style.boxShadow = `0 0 12px 0 ${color}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "";
                el.style.color = "";
                el.style.boxShadow = "";
              }}
            >
              <span className="font-bold text-lg leading-none">{rating}</span>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                {SKILL_LABELS[rating]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
