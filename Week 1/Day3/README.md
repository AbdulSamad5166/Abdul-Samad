# Day 3 — Modern CSS Layout

**Frontend Engineering Internship — Week 1, Day 3**
**Student:** Abdul Samad

---

## Overview

Day 3 builds directly on the Day 2 portfolio. The same personal portfolio website is enhanced with modern CSS layout techniques. No content was changed in Day 1 or Day 2 — all changes exist exclusively inside this `Day3/` folder.

The Day 3 progression:

```
Day 1 → HTML5 Semantic Structure
Day 2 → CSS Fundamentals (selectors, box model, colors, typography)
Day 3 → Modern CSS Layout (Flexbox, Grid, Positioning, Transitions)
```

---

## CSS Concepts Covered

### 1. Flexbox

| Property | Where Used |
|---|---|
| `display: flex` | Nav bar, header, skill cards, service cards, project card header, contact form rows |
| `flex-direction` | Horizontal layouts (row) and vertical stacking (column) on mobile |
| `flex-wrap` | Cards wrap to next line on smaller screens |
| `justify-content` | `space-between` in nav, `flex-start` in card grids |
| `align-items` | `center` in nav and header, `stretch` for equal-height cards |
| `gap` | Spacing between flex items in all flex containers |

### 2. CSS Grid

| Property | Where Used |
|---|---|
| `display: grid` | Projects section — multi-column layout |
| `grid-template-columns` | `2fr 1fr 1fr` — featured project wider, others equal |
| `grid-template-rows` | Auto-sized rows based on content height |
| `grid-template-areas` | Named areas: `featured`, `card1`, `card2` |
| `grid-area` | Each project card assigned to its named area |
| `gap` | Spacing between grid cells |

### 3. Positioning

| Value | Where Used |
|---|---|
| `position: sticky` | Navigation bar — sticks to top of viewport when scrolling |
| `position: fixed` | Back-to-top button — stays in bottom-right corner at all times |
| `position: relative` | Profile wrapper, skill cards, project cards — establishes positioning context |
| `position: absolute` | Profile "Available" badge, skill icon badges — placed within their relative parents |

### 4. Z-Index

| Element | z-index | Purpose |
|---|---|---|
| Back-to-top button | 999 | Above all page content |
| Sticky navigation | 100 | Above scrolling content |
| Skill icon badges | 5 | Above card background |
| Profile badge | 10 | Above profile image |

### 5. CSS Transitions

Smooth animated changes applied using the `transition` property on:

- Navigation links (background color, transform)
- Back-to-top button (background color, transform)
- Skill cards (box-shadow, transform, background)
- Project cards (box-shadow, transform, border-color)
- Service cards (box-shadow, transform, background)
- Submit button (background, transform, box-shadow)
- Form inputs and textarea (border-color, box-shadow)
- Footer links (color)

### 6. Hover Effects

`:hover` pseudo-class applied to:

- Navigation links — highlight + upward lift
- Profile image — scale + border glow
- Skill cards — lift + shadow + white background
- Project cards — lift + shadow + accent border
- Project links — slight horizontal slide
- Service cards — lift + shadow
- Submit button — dark background + lift + shadow
- Table rows — subtle blue tint
- Footer links — lighter color
- Back-to-top button — darker background + lift

---

## Hands-On Tasks

### Task 1: Responsive Navigation Bar

The navigation bar (`<nav id="main-nav">`) is built entirely with Flexbox:

- The nav itself is a **flex container** with `display: flex`
- `flex-direction: row` places brand and links side by side
- `justify-content: space-between` pushes brand to the left and links to the right
- `align-items: center` vertically centres all items
- `flex-wrap: wrap` allows links to wrap on narrow screens
- The links list (`.nav-links`) is also a **nested flex container**
- `position: sticky; top: 0` makes it stick as the user scrolls
- No JavaScript. No CSS framework.

### Task 2: Cards Using Flexbox

Two sections use Flexbox card layouts:

**Skills Section (`.skills-flex-container`):**
- `display: flex`, `flex-wrap: wrap`, `gap: 20px`
- Each `.skill-card` is a flex item with `flex: 1 1 160px`
- Cards stretch to equal height via `align-items: stretch`
- Each card uses `position: relative` with an absolutely-positioned icon badge

**Services Section (`.services-flex-container`):**
- `display: flex`, `flex-wrap: wrap`, `gap: 20px`
- Each `.service-card` is a flex item with `flex: 1 1 200px`
- All cards are the same height via `align-items: stretch`

### Task 3: Multi-Column CSS Grid Layout

The Projects section (`.projects-grid`) uses a full CSS Grid layout:

```css
.projects-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-areas: "featured card1 card2";
    gap: 20px;
}
```

- The **featured project** is placed in the wider `2fr` column using `grid-area: featured`
- The two smaller cards occupy equal `1fr` columns via `grid-area: card1` and `grid-area: card2`
- On mobile (`max-width: 768px`), the grid switches to a single column with stacked areas

---

## File Structure

```
Week1/
│
├── Day1/           ← Untouched
│   ├── index.html
│   └── README.md
│
├── Day2/           ← Untouched
│   ├── index.html
│   ├── style.css
│   └── README.md
│
└── Day3/           ← This folder
    ├── index.html  ← Enhanced portfolio (Day 3)
    ├── style.css   ← Modern CSS layout styles (Day 3)
    └── README.md   ← This file
```

---

## Technologies Used

- HTML5 (semantic elements)
- CSS3 (Flexbox, Grid, Positioning, Transitions)
- No JavaScript
- No CSS frameworks
- No external UI libraries

---

## How to View

Open `Day3/index.html` directly in any modern web browser.
