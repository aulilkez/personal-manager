# Design System — Modern Zinc

**Product:** Personal Manager  
**Platform:** Android / Expo React Native  
**Visual direction:** Modern Zinc, clean, restrained, compact, high-contrast.

## 1. Design principles

1. **Zinc first:** neutral surfaces; use accent colors only for status and categories.
2. **Sharp but approachable:** card corners should not be overly rounded.
3. **Information hierarchy:** important numbers are clear; metadata is subdued.
4. **Consistent density:** the dashboard is informative without looking like an admin panel.
5. **Meaningful color:** colors always have a purpose, not just decoration.
6. **Accessible:** maintain adequate contrast and comfortable touch targets.

## 2. Color tokens

### Dark theme

| Token | Hex | Usage |
|---|---|---|
| background | `#09090B` | App background |
| foreground | `#FAFAFA` | Primary text |
| surface | `#18181B` | Cards and sheets |
| surface-elevated | `#202024` | Elevated surface |
| surface-hover | `#27272A` | Pressed/selected surface |
| border | `#3F3F46` | Borders and dividers |
| muted | `#27272A` | Muted surface |
| muted-foreground | `#A1A1AA` | Secondary text |
| subtle-foreground | `#71717A` | Metadata |
| primary | `#FAFAFA` | Primary action |
| primary-foreground | `#09090B` | Text on primary |
| success | `#34D399` | Income/success |
| danger | `#F87171` | Expense/error |
| warning | `#FBBF24` | Warning |
| info | `#60A5FA` | Information |
| accent-violet | `#A78BFA` | Goals/AI/focus |

### Light theme

| Token | Hex | Usage |
|---|---|---|
| background | `#FAFAFA` | App background |
| foreground | `#18181B` | Primary text |
| surface | `#FFFFFF` | Cards |
| surface-elevated | `#FFFFFF` | Elevated surface |
| surface-hover | `#F4F4F5` | Pressed/selected |
| border | `#E4E4E7` | Borders |
| muted | `#F4F4F5` | Muted surface |
| muted-foreground | `#71717A` | Secondary text |
| subtle-foreground | `#A1A1AA` | Metadata |
| primary | `#18181B` | Primary action |
| primary-foreground | `#FAFAFA` | Text on primary |
| success | `#059669` | Income/success |
| danger | `#DC2626` | Expense/error |
| warning | `#D97706` | Warning |
| info | `#2563EB` | Information |
| accent-violet | `#7C3AED` | Goals/AI/focus |

## 3. Domain semantic colors

- Finance income: success.
- Finance expense: danger.
- Work schedule: info/blue.
- Overtime: success/teal.
- Personal event: violet.
- Learning: amber.
- AI insight: violet.
- Neutral/unknown: zinc.

Do not rely on color alone; pair status colors with labels or icons.

## 4. Radius

Use defined, not overly rounded corners.

| Token | Value | Usage |
|---|---:|---|
| radius-xs | 4 | Small chips |
| radius-sm | 6 | Inputs, compact controls |
| radius-md | 8 | Cards, buttons |
| radius-lg | 10 | Dialogs and large cards |
| radius-xl | 12 | Bottom sheets |
| radius-full | 9999 | Pills only |

Default card radius: **8px**. Avoid 20–28px radii on standard cards.

## 5. Spacing

Use a scale in multiples of 4:

| Token | Value |
|---|---:|
| 1 | 4 |
| 2 | 8 |
| 3 | 12 |
| 4 | 16 |
| 5 | 20 |
| 6 | 24 |
| 8 | 32 |
| 10 | 40 |

Page horizontal padding: 16–20px. Spacing between sections: 24px. Spacing between related elements: 8–12px.

## 6. Typography

Preferred font: Android system sans-serif or Inter, if the font is available and properly licensed.

| Style | Size | Weight |
|---|---:|---|
| display | 30 | 700 |
| heading-1 | 24 | 700 |
| heading-2 | 20 | 600 |
| heading-3 | 16 | 600 |
| body | 14 | 400 |
| body-medium | 14 | 500 |
| label | 12 | 500 |
| caption | 11 | 400 |

Use tabular numbers for balances, amounts, times, and statistics.

## 7. Elevation and borders

- Prefer a `1px` zinc border.
- Use very subtle shadows; do not rely on shadows to separate every component.
- Avoid excessive glassmorphism and gradients.
- Gradients may only be used as small accents in visualizations or AI highlights.

## 8. Component guidelines

### Buttons
- Primary: solid primary.
- Secondary: surface + border.
- Ghost: transparent.
- Destructive: danger.
- Main control height: 44–48px.
- Disabled state must be clear.

### Cards
- Surface background.
- Thin border.
- Padding: 12–16px.
- Radius: 8px.
- Statistic cards may use different accents, but should remain within the zinc color family.

### Inputs
- Surface background.
- Zinc border.
- Labels must always be visible.
- Error text appears below the field.
- Minimum height: 44px.

### Lists
- Row height adapts to content; touch targets should be at least about 44px.
- Separate rows with subtle dividers.
- Do not wrap every row in a separate card when a single list is sufficient.

### Bottom navigation
- Maximum of 5 primary items.
- Short labels.
- Use a surface or indicator for the selected state, rather than a bright color on every icon.

### Charts
- Use subdued axes and gridlines.
- Make numeric labels easy to read.
- Keep category colors consistent.
- Include values/labels; do not show charts alone.

## 9. Dashboard card identity

The four summary cards may have distinct accents:
- Tasks: violet.
- Agenda: blue.
- Finance balance: green.
- Goals: amber.

Use accents on icon tiles, mini charts, thin borders, or progress indicators. Do not fill all four cards with neon backgrounds.

## 10. Tailwind / NativeWind token strategy

Use a single source of semantic tokens and do not scatter literal hex values across components.

Recommendations:
- Use NativeWind for utility styling.
- Use `src/theme/tokens.ts` as the typed token source for logic, charts, and dynamic styles.
- Map semantic utility names to tokens in `tailwind.config.js`.
- Use `global.css` only for NativeWind setup appropriate to the version in use.
- Use the same semantic names for dark and light themes.
- Avoid classes such as `bg-[#09090B]` in product components.

Example class usage:
```tsx
<View className="flex-1 bg-background px-4">
  <View className="rounded-md border border-border bg-surface p-4">
    <Text className="text-foreground">Finance summary</Text>
    <Text className="text-muted-foreground">This month</Text>
  </View>
</View>
```

Example TypeScript tokens:
```ts
export const darkTokens = {
  background: "#09090B",
  foreground: "#FAFAFA",
  surface: "#18181B",
  surfaceElevated: "#202024",
  border: "#3F3F46",
  mutedForeground: "#A1A1AA",
  subtleForeground: "#71717A",
  primary: "#FAFAFA",
  primaryForeground: "#09090B",
  success: "#34D399",
  danger: "#F87171",
  warning: "#FBBF24",
  info: "#60A5FA",
  accentViolet: "#A78BFA",
} as const;
```

**Implementation note:** NativeWind color configuration differs between versions. Ensure the `tailwind.config.js` syntax, CSS variables, `vars()`, and dark mode match the NativeWind version actually installed. Do not mix examples from NativeWind v2/v3/v4/v5.

## 11. Motion

- Fast duration: 120–160ms.
- Standard duration: 180–220ms.
- Use animation for feedback, expand/collapse, and subtle transitions.
- Respect reduced motion where available.
- Avoid repetitive decorative animations that may be distracting.

## 12. Accessibility

- Meet WCAG text contrast where possible.
- Do not use color as the only differentiator.
- Interactive icons must have an accessibilityLabel.
- Dynamic type must not break the layout.
- Touch targets should be around 44×44pt or larger.
