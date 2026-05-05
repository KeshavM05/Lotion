# Lotion — Design System

---

## Aesthetic: "Calm Ambition"

Inspired by Quillio's atmospheric dark UI — premium, editorial, personal.
Not a corporate SaaS dashboard. This is *your* space.

---

## Color Palette

### Dark Theme (Primary)

```
Background:
  --bg-primary:     #0F1729       -- Deep navy (Quillio)
  --bg-secondary:   #0F1729       -- Same as primary
  --bg-tertiary:    #1F2D47       -- Blue-tinted card backgrounds
  --bg-glass:       rgba(31, 45, 71, 0.4)     -- Glass cards

Borders:
  --border:         rgba(255, 255, 255, 0.08)
  --border-hover:   rgba(255, 255, 255, 0.15)

Text:
  --text-primary:   #f0f0f5       -- Headlines, primary content
  --text-secondary: #9ca3af       -- Body text, descriptions
  --text-muted:     #4b5563       -- Timestamps, meta info
  --text-accent:    #d4a69a       -- Links, emphasis (soft rose)

Accent:
  --accent:         #C17A72       -- Primary actions (warm rose)
  --accent-hover:   #b06a62       -- Hover state
  --accent-glow:    rgba(193, 122, 114, 0.15)  -- Subtle glow behind CTAs
  --accent-soft:    rgba(193, 122, 114, 0.1)   -- Selected states

Status:
  --success:        #34d399       -- Completed, on track
  --warning:        #fbbf24       -- At risk, approaching deadline
  --danger:         #f87171       -- Overdue, critical
  --info:           #60a5fa       -- Informational

Goal Categories:
  --cat-career:     #8b5cf6       -- Violet
  --cat-business:   #f59e0b       -- Amber
  --cat-finance:    #10b981       -- Emerald
  --cat-personal:   #ec4899       -- Pink
  --cat-health:     #34d399       -- Green
  --cat-creative:   #f97316       -- Orange
```

---

## Typography

```
Headlines:     'Playfair Display', Georgia, serif
               - Used for: page titles, goal names, hero text
               - Weight: 700 (bold), sometimes 400 (italic for emphasis)

Body:          'Inter', system-ui, -apple-system, sans-serif
               - Used for: everything else
               - Weights: 400 (body), 500 (medium labels), 600 (semibold nav)

Mono:          'JetBrains Mono', 'Fira Code', monospace
               - Used for: timestamps, stats, code-like content

Scale:
  text-xs:     0.75rem / 12px    -- Timestamps, meta
  text-sm:     0.875rem / 14px   -- Body, descriptions
  text-base:   1rem / 16px       -- Default body
  text-lg:     1.125rem / 18px   -- Section headers
  text-xl:     1.25rem / 20px    -- Card titles
  text-2xl:    1.5rem / 24px     -- Page subtitles
  text-3xl:    1.875rem / 30px   -- Page titles
  text-4xl:    2.25rem / 36px    -- Hero text
  text-5xl:    3rem / 48px       -- Landing hero
```

---

## Glassmorphism

The signature UI pattern. Used for cards, modals, overlays.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-card-hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
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
2. **Consistent 8px grid** — all spacing in multiples of 8
3. **Max content width** — 1200px for main content, centered
4. **Sidebar always visible** on desktop (240px)
5. **Cards don't touch** — minimum 16px gap
6. **Hierarchy through opacity** — not just size
