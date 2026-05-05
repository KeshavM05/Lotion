# Lotion — Design System

---

## Aesthetic: "Calm Ambition"

Inspired by Quillio's atmospheric dark UI — premium, editorial, personal.
Not a corporate SaaS dashboard. This is *your* space.

---

## Color Palette

### Dark Theme (Primary) — Material Design 3 + Google Stitch

```
Background:
  --background:     #0b1325       -- Deep navy base
  --surface:        #0b1325       -- Same as background
  --bg-gradient:    radial-gradient(circle at 50% -20%, #1a2744 0%, #0b1325 100%)

Glass Cards (Material Design 3):
  --glass-card:     rgba(26, 39, 68, 0.6)  -- Blue-tinted glass
  backdrop-filter:  blur(24px)
  border:           1px solid rgba(255, 255, 255, 0.1)

Borders:
  --border:         rgba(255, 255, 255, 0.10)
  --border-hover:   rgba(255, 255, 255, 0.18)

Text (Material Design 3):
  --on-surface:           #dbe2fb       -- Primary text
  --on-secondary-container: #a8b5d9    -- Body text
  --on-surface-variant:   #c6c6cd       -- Secondary text
  --text-muted:           #9CA3AF       -- Timestamps, meta info

Accent (Warm Rose):
  --accent:         #C17A72       -- Primary actions
  --accent-hover:   #b06a62       -- Hover state
  --accent-glow:    rgba(193, 122, 114, 0.15)
  --accent-soft:    rgba(193, 122, 114, 0.10)
  --tertiary:       #ffb4ab       -- MD3 tertiary

Status:
  --success:        #34d399       -- Completed, on track
  --warning:        #fbbf24       -- At risk
  --danger:         #f87171       -- Overdue, critical
  --info:           #60a5fa       -- Informational

Goal Categories:
  --cat-career:     #C17A72       -- Warm rose (updated from violet)
  --cat-business:   #f59e0b       -- Amber
  --cat-finance:    #10b981       -- Emerald
  --cat-personal:   #ec4899       -- Pink
  --cat-health:     #34d399       -- Green
  --cat-creative:   #f97316       -- Orange
```

---

## Typography — Google Stitch Implementation

**Explicit Font Families (pixel-perfect matching):**

```
Display/Headlines: font-['Playfair_Display']
                   - Used for: page titles (text-5xl), goal names, hero text
                   - Weights: 400-900 (italic for emphasis)

Body/Labels:       font-['Space_Grotesk']
                   - Used for: body text, labels, descriptions, navigation
                   - Weights: 300-700

Mono/Stats:        font-['JetBrains_Mono']
                   - Used for: timestamps, stats, numbers, dates
                   - Weights: 400, 700

Additional:        font-['Newsreader']
                   - Used for: alternative headline style
                   - Weights: 200-800 (variable)

Material Symbols:  Material Symbols Outlined
                   - Settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24

Scale (Tailwind):
  text-xs:     0.75rem / 12px    -- Labels, meta, tracking-widest
  text-sm:     0.875rem / 14px   -- Navigation, descriptions
  text-base:   1rem / 16px       -- Default body
  text-lg:     1.125rem / 18px   -- Section subheads
  text-xl:     1.25rem / 20px    -- Card headers
  text-2xl:    1.5rem / 24px     -- Section titles
  text-3xl:    1.875rem / 30px   -- Featured quotes
  text-4xl:    2.25rem / 36px    -- Stats, hero numbers
  text-5xl:    3rem / 48px       -- Page titles (standard)
```

---

## Glassmorphism — Actual Implementation

The signature UI pattern from Google Stitch. Used for cards, modals, overlays.

```css
/* Exact Google Stitch values */
.glass-card {
  background: rgba(26, 39, 68, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Sidebar specific */
aside {
  background: rgba(6, 14, 31, 0.8);
  backdrop-filter: blur(48px);
  box-shadow: 0px 20px 40px rgba(15, 23, 41, 0.4);
}

/* Hover states */
.glass-card:hover {
  border-color: rgba(193, 122, 114, 0.3);
  transform: translateY(-1px);
  transition: all 500ms ease;
}
```

---

## Components

### Glass Card
- Used for: goal cards, journal entries, chat bubbles, stats
- Rounded: 16px
- Padding: 20-24px
- Subtle inner border glow at top edge

### Progress Ring
- Circular SVG progress indicator
- Used on vision board goal cards
- Animated fill on load
- Color matches goal category

### Sidebar
- Fixed left, dark bg
- Logo at top
- Nav items with active state (soft violet bg)
- Auto-schedule button at bottom
- Subtle border-right

### Modal
- Centered overlay with glass card
- Backdrop blur + dark overlay
- Smooth scale-in animation
- Escape to close

### Chat Bubble
- User messages: right-aligned, violet bg
- AI messages: left-aligned, glass card bg
- AI actions (created task, etc.): subtle inline card
- Timestamp below each message

### Button Variants
```
Primary:    bg-violet-600, white text, hover:bg-violet-700
Secondary:  glass card style, text-secondary, hover:border-hover
Ghost:      transparent, text-muted, hover:bg-white/5
Danger:     text-red-400, hover:bg-red-500/10
```

### Input Fields
```
Background: rgba(255, 255, 255, 0.03)
Border:     1px solid rgba(255, 255, 255, 0.08)
Focus:      ring-2 ring-violet-500/30, border-violet-500/50
Text:       text-primary
Placeholder: text-muted
Radius:     12px
Padding:    12px 16px
```

---

## Animations

```
Micro-interactions:
  - Button hover: scale(1.02), 150ms ease
  - Card hover: border lightens, shadow deepens, 200ms ease
  - Modal open: opacity 0->1 + scale(0.95->1), 200ms ease-out
  - Progress ring: stroke-dashoffset animation, 800ms ease-out
  - Tab switch: opacity crossfade, 150ms

Page transitions:
  - Content fade-in on route change, 200ms
  - Sidebar active indicator slides, 200ms

Loading states:
  - Skeleton with subtle shimmer gradient
  - AI thinking: animated dots or gentle pulse
```

---

## Layout Principles

1. **Generous whitespace** — let content breathe
2. **Consistent spacing** — gap-6 (24px), gap-8 (32px), gap-12 (48px)
3. **Fixed sidebar** — 256px (w-64), always visible on desktop
4. **Main content margin** — ml-64 to account for fixed sidebar
5. **Cards don't touch** — minimum gap-6 (24px) between cards
6. **Hierarchy through opacity** — not just size
7. **Background blooms** — atmospheric colored blur effects for depth
8. **Noise texture overlay** — subtle 3% opacity texture for polish
