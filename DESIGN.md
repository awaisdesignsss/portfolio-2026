# Design System

## Brand
- **Register:** Brand (portfolio IS the product)
- **Personality:** Cinematic, confident, precise
- **Principles:** Show don't tell. Cinematic presence. Quiet confidence. Precision over decoration.

## Typography
| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Body | Urbanist | 400, 500, 600, 700 | All text, navigation, buttons |
| Display | Kolker Brush | 400 | Hero name only (script accent) |

### Scale
`--text-xs` (12) / `--text-sm` (14) / `--text-base` (16) / `--text-lg` (18) / `--text-xl` (20) / `--text-2xl` (24) / `--text-3xl` (32) / `--text-4xl` (40) / `--text-5xl` (48) / `--text-6xl` (60)

## Color

### Dark sections (hero, feature showcases)
| Token | Value | Usage |
|-------|-------|-------|
| `--dark-bg` | `#0a0a0a` | Section background |
| `--dark-surface` | `#141414` | Elevated cards |
| `--dark-ink` | `#ffffff` | Primary text |
| `--dark-ink-secondary` | `rgba(255,255,255,0.7)` | Secondary text |
| `--dark-ink-muted` | `rgba(255,255,255,0.6)` | Muted labels |
| `--dark-glass-bg` | `rgba(255,255,255,0.85)` | Nav frosted glass |

### Light sections (about, process, contact)
| Token | Value | Usage |
|-------|-------|-------|
| `--light-bg` | `#f5f2ee` | Section background |
| `--light-surface` | `#ffffff` | Elevated cards |
| `--light-ink` | `#1e1e1e` | Primary text |
| `--light-ink-secondary` | `rgba(30,30,30,0.7)` | Secondary text |
| `--light-ink-muted` | `rgba(30,30,30,0.55)` | Muted labels |

### Brand accents
| Token | Value | Usage |
|-------|-------|-------|
| `--brand-ink` | `#1e1e1e` | CTA backgrounds, primary ink |
| `--brand-brown` | `#290802` | Button text on light buttons |
| `--brand-amber` | `#c4722a` | Warm accent (from hero spotlight) |
| `--brand-off-white` | `#f5f2ee` | Light section backgrounds |

## Section Theming
Sections alternate between `.section--dark` and `.section--light`. Each class swaps contextual tokens (`--bg`, `--ink`, `--surface`, `--border`, `--btn-bg`, etc.) so components adapt automatically.

```html
<section class="section section--dark">...</section>
<section class="section section--light">...</section>
```

## Spacing
8px base grid. Tokens: `--space-1` (4) through `--space-32` (128).

### Section Padding
- **Horizontal:** `--section-pad-x: clamp(1.25rem, 5vw, 4rem)` — 64px on desktop (≥1280px), fluid below
- **Vertical:** `--section-pad-y: clamp(4rem, 8vw, 8rem)` — 128px on desktop, fluid below
- **Global rule:** Every section below the hero uses 64px left/right padding on desktop. The header/nav is exempt (fixed, centered, auto-width). **No additional white space beyond the 64px padding.** Content fills 100% of the available width within the padding — `.container` has no `max-width`. The section padding is the only horizontal constraint.
- Applied via `padding: var(--section-pad-y) var(--section-pad-x)` on each section. Hero uses absolute positioning with `left: var(--section-pad-x)` for content alignment.

## Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small cards |
| `--radius-md` | 12px | Medium cards |
| `--radius-lg` | 16px | Large cards |
| `--radius-xl` | 24px | Feature cards |
| `--radius-pill` | 40px | Buttons |
| `--radius-nav` | 72px | Navigation bar |

## Effects
- **Glass:** `backdrop-filter: blur(16px)` + `rgba(255,255,255,0.85)` background
- **Transitions:** Exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`)

## Responsive Breakpoints
| Breakpoint | Width | Layout changes |
|------------|-------|----------------|
| Desktop | > 1024px | Full hero layout, all nav links visible |
| Tablet | 769px - 1024px | Compact hero, tighter nav gaps, vertical text hidden |
| Mobile | 481px - 768px | Stacked hero content, hamburger nav, intro hidden |
| Small mobile | <= 480px | Reduced display type, tighter content spacing |

### Strategy
- `clamp()` for fluid typography and spacing (no jumps)
- `min()` for constrained widths
- Content reflows at breakpoints, type scales fluidly between them
- `100svh` for full-viewport hero on mobile (respects iOS address bar)
