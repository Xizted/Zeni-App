# Iris Design System

## Overview

Iris is a cross-platform personal-finance application with a **Cyberpunk Otaku** visual
direction. The system combines financial clarity with restrained digital energy: dark ink
surfaces, precise borders, electric cyan interaction, and subtle manga-inspired composition.
The interface must feel trustworthy before it feels theatrical.

This document governs the entire product experience: authentication, account recovery,
onboarding, the authenticated application, and shared system states. It does not govern a future
public marketing website.

### Core characteristics

- Dark-first, with a complete light theme. The initial theme follows the operating system and can
  be overridden with **System**, **Light**, or **Dark** in settings.
- Electric cyan is the brand and interaction color. Lime, magenta, red, and amber have restricted
  semantic or expressive roles.
- Depth comes from surface luminance and defined borders, not general-purpose shadows.
- Typography separates expressive financial display from highly legible operational content.
- Native navigation conventions are preserved and themed rather than replaced.
- Manga influence appears through grids, framing, rhythm, and motion lines—not persistent
  characters, faux-Japanese decoration, or visual clutter.
- Motion is fast and precise. Expressive animation is reserved for meaningful milestones.

## Design Principles

### Trust before spectacle

Balances, transactions, validation, and security decisions must remain calm and unambiguous.
Neon is emphasis, not hierarchy by itself. Never trade legibility for atmosphere.

### One clear action

Each screen or modal has one visually primary action. Secondary actions remain visible but do not
compete through equal color, size, or glow. This is especially strict in authentication and money
movement flows.

### Semantic color, not decorative color

Color communicates interaction, status, or data-series identity. Text labels, icons, or patterns
must accompany status colors so meaning never depends on color alone.

### Native where behavior matters

Navigation, safe areas, keyboard avoidance, focus, biometrics, and platform dialogs follow native
expectations. Iris contributes color, typography, iconography, spacing, and motion without
fighting platform behavior.

### Offline state is a first-class state

Loading, empty, stale, offline, error, retry, and synchronized states belong to the visual system.
An offline interface must communicate what is still available and whether an action is queued.

## Color

Use semantic tokens in components. Primitive values document the palette but must not be used
directly outside the centralized theme definition.

### Dark theme

| Token | Value | Use |
|---|---:|---|
| `{colors.dark.canvas}` | `#070A0D` | Root application canvas |
| `{colors.dark.surface}` | `#0E141A` | Cards, grouped content, input fills |
| `{colors.dark.surface-elevated}` | `#151D24` | Modals, menus, selected containers |
| `{colors.dark.surface-pressed}` | `#1C2730` | Pressed neutral surfaces |
| `{colors.dark.border}` | `#26333D` | Default 1px structural border |
| `{colors.dark.border-strong}` | `#3A4A56` | Focus-adjacent and emphasized boundaries |
| `{colors.dark.text}` | `#F4FAFC` | Primary text |
| `{colors.dark.text-secondary}` | `#A7B4BC` | Supporting text |
| `{colors.dark.text-tertiary}` | `#788791` | Metadata and low-emphasis labels |
| `{colors.dark.text-disabled}` | `#56636C` | Disabled foreground |
| `{colors.dark.scrim}` | `rgba(0,0,0,0.72)` | Modal and drawer scrim |

### Light theme

| Token | Value | Use |
|---|---:|---|
| `{colors.light.canvas}` | `#F5F8FA` | Root application canvas |
| `{colors.light.surface}` | `#FFFFFF` | Cards, grouped content, input fills |
| `{colors.light.surface-elevated}` | `#EAF0F3` | Selected and inset containers |
| `{colors.light.surface-pressed}` | `#DCE6EB` | Pressed neutral surfaces |
| `{colors.light.border}` | `#CED8DE` | Default 1px structural border |
| `{colors.light.border-strong}` | `#9DADB7` | Focus-adjacent and emphasized boundaries |
| `{colors.light.text}` | `#10171C` | Primary text |
| `{colors.light.text-secondary}` | `#53616A` | Supporting text |
| `{colors.light.text-tertiary}` | `#626F78` | Metadata and low-emphasis labels |
| `{colors.light.text-disabled}` | `#94A1A9` | Disabled foreground |
| `{colors.light.scrim}` | `rgba(7,10,13,0.52)` | Modal and drawer scrim |

### Brand and interaction

| Token | Dark | Light | Use |
|---|---:|---:|---|
| `{colors.primary}` | `#00E5FF` | `#007C91` | Primary actions, focus, active navigation, links |
| `{colors.primary-pressed}` | `#00B8CC` | `#005F70` | Pressed primary foreground/surface |
| `{colors.primary-container}` | `#073640` | `#D5F4F8` | Selected rows, informative emphasis |
| `{colors.on-primary}` | `#071014` | `#FFFFFF` | Text and icons on primary buttons |
| `{colors.focus-ring}` | `#00E5FF` | `#007C91` | 2px accessible focus ring |

The bright dark-theme cyan and the deeper light-theme cyan are the same semantic color at
different tones. Do not reuse the bright cyan as body text on light surfaces.

### Semantic and expressive colors

| Token | Dark | Light | Use |
|---|---:|---:|---|
| `{colors.positive}` | `#B7F34A` | `#4D7500` | Success, income, confirmed positive change |
| `{colors.positive-container}` | `#253A10` | `#E8F5CD` | Success banner and badge backgrounds |
| `{colors.warning}` | `#FFB84D` | `#9A5B00` | Pending, caution, delayed synchronization |
| `{colors.warning-container}` | `#402B0A` | `#FFF0D0` | Warning banner and badge backgrounds |
| `{colors.danger}` | `#FF5C6C` | `#C6283D` | Errors, destructive actions, financial loss |
| `{colors.danger-container}` | `#42151C` | `#FCE1E5` | Error banner and field backgrounds |
| `{colors.magenta}` | `#FF3DBB` | `#B00078` | Secondary chart series and expressive highlights |
| `{colors.magenta-container}` | `#3A102E` | `#F8DDED` | Rare expressive containers |

- `{colors.positive}` represents positive values only when the product semantics support it. Do
  not render every incoming transaction as success.
- `{colors.danger}` is reserved for errors, destructive actions, and negative financial change.
- `{colors.magenta}` is not a general action color and never replaces `{colors.primary}`.
- Neutral amounts use the current theme text color. Currency direction must also use a sign,
  label, or icon.

### Contrast requirements

- Normal text must meet WCAG AA contrast of at least `4.5:1`.
- Large text, icons, control boundaries, and meaningful graphics must meet at least `3:1`.
- Primary text and financial values should target `7:1` where practical.
- Placeholder text is never the only label and must remain distinguishable from disabled text.
- Focus, error, success, and selection require a non-color cue such as a border, icon, label, or
  shape change.

## Typography

### Font families

- **Spline Sans** (`{font.family.display}`) is used for display headings, balances, totals, and
  prominent financial figures. Use weights 500 and 600.
- **Inter** (`{font.family.body}`) is used for body copy, forms, navigation, buttons, metadata, and
  dense transaction content. Use weights 400, 500, 600, and 700 only where specified.
- **System monospace** (`{font.family.mono}`) is limited to technical identifiers, recovery codes,
  and development-facing content. It is not the default font for money.

Both Spline Sans and Inter must be loaded consistently on native and web before their tokens are
implemented. Fall back to the platform sans-serif stack while fonts are unavailable.

### Type scale

| Token | Size / line height | Weight | Family | Use |
|---|---:|---:|---|---|
| `{type.display-lg}` | `48 / 52` | 600 | Spline Sans | Rare desktop hero or major balance |
| `{type.display-md}` | `40 / 44` | 600 | Spline Sans | Primary balance and onboarding statement |
| `{type.display-sm}` | `32 / 38` | 600 | Spline Sans | Mobile balance and auth headline |
| `{type.heading-lg}` | `28 / 34` | 600 | Spline Sans | Screen title |
| `{type.heading-md}` | `24 / 30` | 600 | Spline Sans | Section and modal title |
| `{type.heading-sm}` | `20 / 26` | 600 | Spline Sans | Card title |
| `{type.body-lg}` | `18 / 28` | 400 | Inter | Introductory and emphasized body copy |
| `{type.body-md}` | `16 / 24` | 400 | Inter | Default body and input value |
| `{type.body-md-strong}` | `16 / 24` | 600 | Inter | Button and emphasized body text |
| `{type.body-sm}` | `14 / 20` | 400 | Inter | Secondary content and transaction metadata |
| `{type.body-sm-strong}` | `14 / 20` | 600 | Inter | Labels, tabs, and compact actions |
| `{type.caption}` | `12 / 16` | 500 | Inter | Timestamps, badges, legal copy |

### Numeric typography

- Balances and table-like financial values use tabular numerals.
- Currency symbols remain optically attached to the amount; do not reduce them below readable
  body size.
- Preserve locale-specific decimal and grouping separators.
- Never use color, font weight, or alignment alone to communicate debit versus credit.
- Large balances may tighten letter spacing to `-1%`; body text uses normal letter spacing.

## Layout and Spacing

### Spacing scale

The base unit is 4px. Do not introduce intermediate values without a documented platform need.

| Token | Value | Use |
|---|---:|---|
| `{space.0}` | `0px` | Reset |
| `{space.1}` | `4px` | Tight icon and label relationship |
| `{space.2}` | `8px` | Compact internal gap |
| `{space.3}` | `12px` | Control and row gap |
| `{space.4}` | `16px` | Default mobile gap and padding |
| `{space.5}` | `24px` | Card padding and section separation |
| `{space.6}` | `32px` | Major group separation |
| `{space.7}` | `48px` | Auth and onboarding section separation |
| `{space.8}` | `64px` | Large page rhythm |
| `{space.9}` | `96px` | Wide-screen composition only |

### Responsive behavior

- **Compact, below 768px:** one content column, 16px horizontal page padding, native bottom tabs,
  and stacked forms/actions.
- **Medium, 768–1199px:** up to two content columns, 24px page padding, and optional supporting
  panels where content order remains clear.
- **Expanded, 1200px and above:** up to three content columns, 32px page padding, and a centered
  content region with a maximum width of 1440px.
- Auth forms remain a focused single column with a maximum width of 440px at every breakpoint.
- Main content adapts rather than scaling uniformly. Do not stretch transaction rows or forms to
  the full desktop viewport.
- Respect safe areas, text scaling, keyboard insets, and platform navigation dimensions.

### Density and touch

- Interactive controls are at least 48px high and 48px wide.
- Default transaction rows are 64–72px high, growing when accessibility text requires it.
- Default inputs are 52px high; multiline inputs grow with content.
- Avoid fixed text container heights. Layout must survive 200% text scaling without clipping.

## Shape and Depth

### Radius scale

| Token | Value | Use |
|---|---:|---|
| `{radius.none}` | `0px` | Full-bleed regions and separators |
| `{radius.sm}` | `8px` | Badges, compact controls, thumbnails |
| `{radius.md}` | `12px` | Buttons, inputs, menus |
| `{radius.lg}` | `16px` | Cards, sheets, dialogs |
| `{radius.full}` | `9999px` | Status dots and deliberately pill-shaped chips only |

Buttons are not pills by default. Use `{radius.full}` only when the component's compact, optional
nature is part of its meaning, such as a filter chip.

### Borders and elevation

- Cards and grouped surfaces use a 1px `{colors.*.border}` border.
- Selected or keyboard-focused surfaces may use a 2px semantic border without changing layout.
- Modals and floating menus use `{colors.*.surface-elevated}`, a stronger border, and a scrim.
- Avoid routine drop shadows. On web, a minimal shadow may support a floating menu only when a
  border cannot separate it from underlying content.
- Glow is limited to focus, the active point in a chart, or a singular celebratory highlight. It
  must never reduce edge clarity or text contrast.

## Iconography and Imagery

- Use technical line icons with a consistent `1.5–2px` optical stroke.
- Filled icons indicate selected navigation or a state change; they are not the default style.
- Icons inherit semantic foreground tokens and include accessible labels when meaning is not
  duplicated by visible text.
- Do not mix unrelated icon families in one workflow.
- Manga influence uses panel framing, cropped geometry, fine grids, registration marks, and brief
  kinetic lines. Keep these elements outside operational text and touch targets.
- Character illustration, if introduced later, belongs to onboarding, empty states, and milestones;
  it must be an authored product decision rather than generic anime decoration.

## Motion

Use the shared motion tokens as the implementation source of truth.

| Token | Duration | Use |
|---|---:|---|
| `{motion.instant}` | `0ms` | Reduced-motion replacement where animation is unnecessary |
| `{motion.fast}` | `140ms` | Press, focus, toggle, and small feedback |
| `{motion.normal}` | `240ms` | Screen content, modal, and layout transition |
| `{motion.slow}` | `420ms` | Rare milestone or data reveal |

- Prefer responsive springs for touch-driven movement and standard easing for opacity or color.
- Never delay input, authentication, navigation, or transaction confirmation for animation.
- Reduced motion removes parallax, glow travel, kinetic lines, and large transforms. Preserve
  immediate state feedback through opacity, border, or content changes.
- Loading indicators must not imply progress that the application cannot measure.

## Components

### Buttons

**`{component.button-primary}`**

- Primary background, `{colors.on-primary}` content, `{radius.md}`, minimum height 48px.
- One primary button per screen region or modal.
- Pressed state uses `{colors.primary-pressed}`; disabled state uses neutral surfaces and text.

**`{component.button-secondary}`**

- Transparent or neutral surface with a 1px primary-colored border and primary foreground.
- Used for the meaningful alternative to the primary action.

**`{component.button-quiet}`**

- Transparent background and semantic foreground; pressed state gains a neutral surface.
- Used for tertiary actions, inline actions, and dismissals.

**`{component.button-danger}`**

- Danger surface or outlined danger treatment depending on consequence.
- Destructive actions require explicit wording; irreversible financial consequences require a
  confirmation step.

All buttons expose pressed, focused, loading, and disabled states. Loading preserves the button's
width and label context.

### Form controls

**`{component.text-field}`**

- Theme surface, default border, `{radius.md}`, minimum height 52px, and a persistent visible label.
- Focus uses `{colors.focus-ring}`. Error uses danger border, icon, and explanatory text.
- Supporting and error text sits below the field and is associated with it accessibly.
- Password fields provide reveal/hide control without changing the field width.

**`{component.otp-field}`**

- Uses one semantic input value even if visually divided into cells.
- Supports paste, autofill, correction, screen readers, and automatic focus without trapping the
  user.
- Error and expiration are described in text, not by shaking or red color alone.

**`{component.selection-control}`**

- Checkboxes, radios, switches, and segmented controls preserve native interaction semantics.
- Labels are part of the touch target. Selected state uses color plus icon, fill, or thumb position.

### Cards and rows

**`{component.card}`**

- Theme surface, 1px border, `{radius.lg}`, and 24px default padding.
- Cards group related information; they are not wrappers for every section.

**`{component.balance-card}`**

- Prioritizes account name, balance, currency, and availability state.
- Privacy masking preserves layout and does not expose digit count.
- Decorative cyan or magenta treatment may frame the card but never cross the amount.

**`{component.transaction-row}`**

- 64–72px minimum height with merchant/category, date or status, and signed localized amount.
- Status icons and labels supplement semantic color.
- Pending, offline-queued, failed, and reversed transactions remain visually distinct.

**`{component.status-banner}`**

- Uses semantic container, icon, title, concise explanation, and optional action.
- Persistent offline or stale-data banners do not block locally available content.

### Navigation and overlays

**`{component.native-tabs}`**

- Preserve native tab behavior and safe areas.
- Active tabs use primary color and a filled icon where supported; inactive tabs use secondary text.
- Labels remain visible unless the platform convention or available width makes them inaccessible.

**`{component.modal}`** and **`{component.sheet}`**

- Use elevated surface, strong border, `{radius.lg}`, and the theme scrim.
- Focus is trapped on web and restored to the invoking control after dismissal.
- Sheets follow native gesture and dismissal conventions; critical confirmations cannot be
  dismissed accidentally.

### Data visualization

**`{component.chart}`**

- Use subdued grid and axis tokens with cyan as the primary series.
- Magenta distinguishes a comparison series; lime and danger communicate meaningful positive or
  negative thresholds only.
- Glow is restricted to the selected point or active series, never the complete chart.
- Provide visible values, units, time range, legend, and an accessible textual summary.
- Tooltips remain within safe bounds and support touch, keyboard, and pointer interaction.

## Authentication and Onboarding

- Auth screens use a focused single-column composition and one primary action.
- Brand expression may appear as a cropped grid, panel frame, or short kinetic transition around
  the form—not behind labels or fields.
- Sign-in, registration, recovery, OTP, new-password, and biometric prompts share the same form
  anatomy and validation language.
- Security explanations are direct and calm. Avoid celebratory motion for sensitive events such as
  password reset or failed access.
- Biometric controls state the platform capability and always provide a non-biometric fallback.
- Session expiration distinguishes authentication failure from network unavailability and
  preserves safe, non-sensitive user context where possible.
- Onboarding is progressive: one decision per step, visible progress when the total is known, and a
  clear explanation before requesting permissions.

## Application States

### Loading

Use skeletons only when the eventual layout is known. Use a compact progress indicator for commands
and indeterminate work. Existing local data remains visible during background refresh.

### Empty

Explain why the space is empty and provide one relevant next action. Illustration is optional and
must not overpower the message.

### Stale and offline

Show the last known data, its freshness, and available offline actions. Queued mutations state that
they are pending synchronization and must not appear confirmed.

### Error and retry

Describe the recoverable problem in user terms and place retry near the failed content. Preserve
valid user input. Do not use generic full-screen errors for isolated failures.

### Success

Confirm the outcome, amount, destination, and reference where relevant. Milestone animation is
allowed only after the operation is confirmed, never while it is pending.

## Content Guidelines

- Use concise, direct language and sentence case.
- Button labels describe the action: “Continue”, “Save changes”, or “Retry transfer”. Avoid “OK”
  when a specific verb exists.
- Financial confirmation copy includes the amount, currency, destination, and consequence.
- Error messages explain what happened and what the user can do next without blaming them.
- Never expose raw server, Axios, database, or synchronization errors.

## Do and Don't

### Do

- Use full semantic theme tokens and validate both themes together.
- Let typography, spacing, and borders establish hierarchy before adding color.
- Keep cyan for interaction and brand focus; keep status colors semantic.
- Preserve native behavior and accessible focus across native and web.
- Design every data surface for loading, offline, stale, empty, error, and retry states.
- Use restrained manga composition to create identity around—not inside—financial content.

### Don't

- Don't turn every border, icon, and heading neon.
- Don't use magenta as a second primary action color.
- Don't use glow as a default elevation system or place it behind body text.
- Don't make all controls pills or all content cards.
- Don't encode gain, loss, pending, or failure through color alone.
- Don't replace native navigation behavior solely to create a custom visual effect.
- Don't use decorative Japanese text, generic anime characters, or cultural motifs without product
  meaning and deliberate authorship.

## Implementation Boundary

This document defines the target design language. Runtime adoption is a separate, focused change.
Before implementation:

1. Map primitive and semantic tokens into the centralized theme and NativeWind configuration.
2. Install and load Spline Sans and Inter consistently on native and web before referencing them in
   runtime styles.
3. Migrate shared primitives before feature screens; do not scatter raw values through features.
4. Verify representative auth and authenticated screens in dark and light themes, at compact and
   expanded widths, with reduced motion and increased text size.
5. Keep third-party native component styling behind shared adapters where token APIs differ.
