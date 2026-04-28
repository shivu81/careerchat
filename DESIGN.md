# Design Brief

## Direction
Premium Minimalism — AI-first productivity interface with refined depth and conversational UX. ChatGPT-influenced but distinctly polished.

## Tone
Refined, professional, human-friendly. No decoration; every visual choice serves clarity and premium feel.

## Differentiation
Directional chat bubbles (user right/cyan, bot left/elevated card) with smooth sidebar transitions. Typography hierarchy creates visual flow; refined shadows add premium depth without excess.

## Color Palette

| Token | OKLCH | Role |
|-------|-------|------|
| **Background** | `0.12 0 0` | Deep charcoal base, reduces eye strain |
| **Foreground** | `0.97 0 0` | Near-white text, AA+ contrast |
| **Card** | `0.18 0.005 0` | Message containers, elevated from background |
| **Accent** | `0.68 0.18 58` | User messages, CTAs, active highlights — vibrant cyan |
| **Muted** | `0.24 0.002 0` | Borders, dividers, secondary surfaces |
| **Destructive** | `0.64 0.21 25` | Warnings, delete actions |
| **Sidebar** | `0.17 0 0` | Slightly elevated from background for hierarchy |

## Typography
- **Display**: General Sans — headers, section titles (weights 500–700, tight tracking)
- **Body**: DM Sans — chat text, labels, descriptions (weight 400–600, refined readability)
- **Mono**: Geist Mono — career scores, data snippets (monospace precision)

## Elevation & Depth
Subtle shadow hierarchy using dark-mode-safe values. Cards cast `shadow-md` on hover, input bar `shadow-md` on focus. No glow or neon; shadows respect dark background to prevent fatigue.

## Structural Zones

| Zone | Background | Border | Notes |
|------|------------|--------|-------|
| Header | `bg-card` | `border-b border-muted` | Minimal navigation bar |
| Sidebar | `bg-sidebar` | `border-r border-sidebar-border` | Collapsible, title + preview snippet |
| Main Chat | `bg-background` | — | Full-bleed scroll region |
| Input Bar | `bg-card` with `shadow-md` on focus | `border-t border-muted` | Fixed bottom, rounded container |

## Component Patterns
- **Chat Bubbles**: User (right-aligned, `bg-accent` with `rounded-lg`), Bot (left-aligned, `bg-card` with `rounded-lg`), both scale-in 0.35s
- **Sidebar Items**: Hover state via `bg-secondary/40` with `transition-snappy`
- **Career Cards**: `shadow-md`, `bg-card`, score badge with accent highlight
- **Input Field**: Focus ring uses `ring-accent`, placeholder text in `text-muted-foreground`

## Motion Choreography
1. **Bubble Enter**: `bubble-fade-in` or `bubble-scale-in` (0.35–0.5s, easing cubic-bezier)
2. **Sidebar Expand**: `sidebar-transition` (width + transform, 0.3s)
3. **Hover Lift**: `surface-hover` (background shift + `transition-snappy` 0.2s)
4. **Typing Indicator**: Dots scale 0.85→1.15, opacity pulse at 1.4s interval

## Spacing & Rhythm
Base unit: 0.75rem (12px) via `--radius`. Chat messages: 12–16px internal padding, 24px vertical gaps. Sidebar: 12px item padding, 8px hover highlight. Tight density for productivity focus.

## Responsive
Mobile-first. Sidebar collapses to burger on `sm:`. Chat bubbles scale naturally. Input bar remains fixed bottom. Sidebar preview snippet hidden on mobile (title only).

## Constraints
- No gradients, no blur, no neon/glow shadows
- Accent used strategically: user messages, CTAs, active states only
- Dark mode primary; if light mode added, invert L values while maintaining C and H
- Animations only on entrance, focus, and async indicators (no idle motion)

## Signature Detail
Directional chat flow with color + alignment creates instant visual hierarchy. Premium feel emerges from shadow tuning and refined typography scale, not decoration.
