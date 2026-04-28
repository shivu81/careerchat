import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CareerResult } from "@/types";
import { AlertTriangle, ChevronDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface CareerCardProps {
  result: CareerResult;
  rank: number;
  defaultExpanded?: boolean;
  animationDelay?: number;
}

type ScoreTheme = {
  gradient: string;
  badgeStyle: React.CSSProperties;
  circleStyle: React.CSSProperties;
  barClass: string;
  glowClass: string;
  borderColor: string;
};

function getScoreTheme(score: number): ScoreTheme {
  if (score >= 80) {
    return {
      gradient: "from-emerald-500/20 to-emerald-500/5",
      badgeStyle: {
        background: "rgb(52 211 153 / 0.12)",
        color: "rgb(52 211 153)",
        borderColor: "rgb(52 211 153 / 0.3)",
      },
      circleStyle: {
        borderColor: "rgb(52 211 153 / 0.5)",
        color: "rgb(52 211 153)",
        boxShadow:
          "0 0 0 3px rgb(52 211 153 / 0.12), 0 0 20px 0 rgb(52 211 153 / 0.18)",
      },
      barClass: "from-emerald-500 to-emerald-400",
      glowClass: "hover:shadow-emerald-glow",
      borderColor: "rgb(52 211 153 / 0.2)",
    };
  }
  if (score >= 60) {
    return {
      gradient: "from-amber-500/15 to-amber-500/5",
      badgeStyle: {
        background: "rgb(251 191 36 / 0.12)",
        color: "rgb(251 191 36)",
        borderColor: "rgb(251 191 36 / 0.3)",
      },
      circleStyle: {
        borderColor: "rgb(251 191 36 / 0.5)",
        color: "rgb(251 191 36)",
        boxShadow:
          "0 0 0 3px rgb(251 191 36 / 0.1), 0 0 20px 0 rgb(251 191 36 / 0.14)",
      },
      barClass: "from-amber-500 to-amber-400",
      glowClass: "hover:shadow-amber-glow",
      borderColor: "rgb(251 191 36 / 0.15)",
    };
  }
  return {
    gradient: "from-muted/20 to-muted/5",
    badgeStyle: {},
    circleStyle: {
      borderColor: "oklch(var(--border))",
      color: "oklch(var(--muted-foreground))",
    },
    barClass: "from-muted-foreground/60 to-muted-foreground/40",
    glowClass: "",
    borderColor: "oklch(var(--border))",
  };
}

function getRankLabel(rank: number): string {
  if (rank === 1) return "🥇 Best Match";
  if (rank === 2) return "🥈 2nd Match";
  if (rank === 3) return "🥉 3rd Match";
  return `#${rank}`;
}

export function CareerCard({
  result,
  rank,
  defaultExpanded = false,
  animationDelay = 0,
}: CareerCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [barAnimated, setBarAnimated] = useState(false);
  const theme = getScoreTheme(result.score);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger bar shimmer on mount
  useEffect(() => {
    const timer = setTimeout(() => setBarAnimated(true), animationDelay + 100);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div
      ref={cardRef}
      className="animate-fade-in-down"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "both",
      }}
      data-ocid={`career_card.item.${rank}`}
    >
      <Card
        className={cn(
          "border overflow-hidden transition-all duration-300",
          "hover:shadow-card-hover hover:-translate-y-0.5",
          theme.glowClass,
        )}
        style={{
          borderColor: theme.borderColor,
          background:
            "linear-gradient(145deg, oklch(var(--card)) 0%, oklch(0.195 0.006 250) 100%)",
        }}
      >
        {/* Gradient rank strip at left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{
            background:
              result.score >= 80
                ? "linear-gradient(180deg, rgb(52 211 153), rgb(52 211 153 / 0.3))"
                : result.score >= 60
                  ? "linear-gradient(180deg, rgb(251 191 36), rgb(251 191 36 / 0.3))"
                  : "linear-gradient(180deg, oklch(var(--border)), transparent)",
          }}
          aria-hidden
        />

        {/* Header — always visible */}
        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">
                  {getRankLabel(rank)}
                </span>
                {rank <= 3 && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                    style={theme.badgeStyle}
                    data-ocid={`career_card.score_badge.${rank}`}
                  >
                    {result.score}% match
                  </span>
                )}
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground leading-tight truncate">
                {result.careerName}
              </h3>
            </div>

            {/* Score circle */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 font-display font-bold text-sm"
              style={theme.circleStyle}
            >
              {result.score}%
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out relative overflow-hidden",
                  theme.barClass,
                )}
                style={{ width: `${result.score}%` }}
                data-ocid={`career_card.score_bar.${rank}`}
              >
                {barAnimated && (
                  <div className="absolute inset-0 shimmer" aria-hidden />
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Expandable content */}
        {expanded && (
          <CardContent className="pt-0 space-y-3 border-t border-border/40 mt-1 pl-5">
            {/* Personalized explanation */}
            <div className="pt-4">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Weak areas / improvements */}
            {result.improvements.length > 0 && (
              <div
                className="border rounded-xl p-3.5 space-y-2"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(251 191 36 / 0.07) 0%, rgb(251 191 36 / 0.03) 100%)",
                  borderColor: "rgb(251 191 36 / 0.25)",
                }}
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Areas to strengthen
                </div>
                <ul className="space-y-1.5">
                  {result.improvements.map((item, i) => (
                    <li
                      key={item}
                      className="text-sm text-foreground/80 flex items-start gap-2"
                      data-ocid={`career_card.improvement.${rank}.${i + 1}`}
                    >
                      <span className="text-amber-400/80 mt-1 text-[10px]">
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Future scope */}
            <div
              className="border rounded-xl p-3.5 space-y-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--accent) / 0.08) 0%, oklch(0.62 0.22 200 / 0.06) 100%)",
                borderColor: "oklch(var(--accent) / 0.25)",
              }}
            >
              <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wide">
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                Future scope
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {result.futureScope}
              </p>
            </div>
          </CardContent>
        )}

        {/* Toggle button */}
        <div className="px-5 py-2.5 border-t border-border/30 bg-muted/10">
          <button
            type="button"
            className="w-full h-7 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-snappy rounded-lg hover:bg-muted/30"
            onClick={() => setExpanded((prev) => !prev)}
            data-ocid={`career_card.expand_toggle.${rank}`}
            aria-expanded={expanded}
          >
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
                expanded && "rotate-180",
              )}
            />
            {expanded ? "Hide details" : "See full analysis"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
