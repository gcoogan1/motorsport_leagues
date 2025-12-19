# Motorsport Leagues – Styles & Design Tokens

This document defines the **design token system** used across the Motorsport Leagues app.

**Rule of thumb:**  
> If a style exists as a token, **use the token**.

> All styles should use **styled-components**.

---

## 1. Design Token Philosophy

- Tokens are **single sources of truth**
- Tokens are **semantic**, not visual
- Components **consume tokens**, never raw values

❌ Hardcoded values 

Never hardcode values that exist as design tokens
```css
color: #FFD700;
box-shadow: 0px 0px 20px rgba(255, 215, 0, 0.2);
```


✅ Token usage

Import design file and use tokens
```js
import from '@app/design/tokens/index'

const { colors, typography, borders, effects, layout } = designTokens;
```

```css
color: ${colors.base.base1};
${effects.boxShadow.coverBaseDown}
```

---
## 2. Colors & Gradients

All colors live in colors file in the tokens folder under the design folder. 

### **2.1 Colors:**

 - Base: primary background colors
 - Text: primary text colors
 - Role: semantic colors tied to application roles
 - Position: used for ranking or placement indicators
 - Utility: used for interactions and system feedback

**Opacity:**

Opacity is restricted to predefined levels for consistency.

```js
type Opacity = 0 | 10 | 20 | 30 | 100;
```

Use *withOpacity* helper function to apply opacity to a color

```css
withOpacity("#FFFFFF", 10)
```

### **2.2 Gradients:**

- Base: primary gradients
- Position: special gradients used for rank and achievments

Gradient direction types

```js
type Direction = "left" | "right" | "top" | "bottom";
```

Use *fadeGradient* helper function to create gradients - be sure to follow opacity and direction types

```js
fadeGradient(color, opacityLevel, direction, endPercent?)
```
Example:

```css
fadeGradient("#FFFFFF", 10, "right"),
```

---
## 3. Themes

Themes represent *accent colors* a user may choose from.

Theme colors automatically generate common variants using shared utilities:

 - Opacity variants (primary0, primary10, primary20, primary30)

 - Fade gradients (left, right, top, bottom)

### **Theme options:**

```ts
type Theme = 'yellow' | 'blue' | 'red' | 'green';
```

Example:

```css
color: ${theme.blue.primary30};
background: ${theme.blue.primaryGradientFadeTop};
```

---
## 4. Typography

Typography tokens define all **font families, sizes, weights, and text styles** used throughout the app.  

### 4.1 Font Families:

The system uses two primary fonts:

- **Quantico** — body text, subtitles, UI copy  
- **Zen Dots** — titles and display text

### 4.2 Typography Groups

  - **Body:** used for paragraphs, descriptions, and general UI text
  - **Subtitle:** used for labels, metadata, and secondary headings *(most subtitle styles are uppercase and may be italicized)*
  - **Title:** used for page titles and major headings

**Usage**

Typography tokens are applied using the fontCSS helper so that all styles are applied.

```ts
const SubText = styled.p`
  ${typography.subtitle.smallItalic};
  background: transparent;
`;
```

---
## 5. Borders

Border tokens define **border widths** and **border radius** used throughout the application.  

Example:

```css
border-color: ${colors.base.base3}; 
border-width: ${borders.width.medium};
border-style: solid; 
border-radius: ${borders.radius.large};
```

---
## 6. Effects

Effects tokens define **visual enhancements** like opacity and box shadows. 

Effect tokens are applied using the CSS helpers so that all styles are applied.

### 6.1 Opacity:

Defines reusable opacity values for components, backgrounds, and overlays.

Example:

```css
${effects.opacity.opacity50}
```

### 6.2 Box-shadow:

Defines reusable shadows for depth, glow, and focus effects.

Example:

```css
${effects.boxShadow.coverBaseDown}
```

---
## 7. Layouts

Layout tokens define **spacing and responsive breakpoints** for consistent layout structure across the app.

### 7.1 Space:

Reusable spacing values for padding, margin, and gaps.

Example:

```css
padding: ${layout.space.large};
```

### 7.2 Media Queries:

Reusable breakpoints for responsive design.

```ts
mobile  → "@media (max-width: 919px)"
desktop → "@media (min-width: 920px)"
```

Example:

```css
${layout.mediaQueries.mobile} {
  // Mobile Styles
}
```










































