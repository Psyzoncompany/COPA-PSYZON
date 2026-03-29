# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Arena"
This design system is built to capture the high-stakes adrenaline of elite gaming and sports competitions through a lens of sophisticated, high-end editorial design. Moving away from the "template" look of standard tournament brackets, we embrace a **Kinetic Arena** philosophy. This means the UI should feel like a living, breathing stadium—deep, layered, and illuminated by the glow of the competition.

We break the rigid grid by prioritizing **Intentional Asymmetry**. Large, display-scale typography should overlap container boundaries, and central action cards should feel suspended in a three-dimensional space using tonal layering rather than flat lines. The goal is a premium, "dark-mode-first" experience where every interaction feels like a spotlight moment.

---

## 2. Colors: Depth and Illumination
Our palette moves beyond simple hex codes into a functional hierarchy of "Surface" and "On-Surface" tokens. We prioritize depth over decoration.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be created strictly through background color shifts. A section on `surface` ( #0b1323) transitions into a container using `surface_container_low` (#141b2c). This creates a seamless, high-end flow that feels architectural rather than boxed-in.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base Layer:** `surface` (#0b1323)
*   **Secondary Context:** `surface_container` (#182030)
*   **Interactive Cards:** `surface_container_high` (#222a3b)
*   **Elevated Floating Elements:** `surface_container_highest` (#2d3546)

### The Glass & Gradient Rule
To achieve a "signature" look, use **Glassmorphism** for navigation bars and floating overlays. Apply `surface_variant` (#2d3546) at 60% opacity with a `20px` backdrop-blur. 
*   **Signature Gradients:** For primary CTAs, use a linear gradient (135°) transitioning from `primary` (#adc7ff) to `primary_container` (#4a8eff). This adds a "soul" to the action that flat hex codes lack.

---

## 3. Typography: Editorial Power
We use a high-contrast scale to separate "Action" from "Information."

*   **Display & Headlines (Space Grotesk):** This is our "Impact" font. Use `display-lg` (3.5rem) for hero tournament titles. It should feel massive, bold, and slightly aggressive. 
*   **Body & Labels (Inter):** Our "Utility" font. `body-md` (0.875rem) handles the heavy lifting of tournament rules and player stats. The clean sans-serif nature of Inter balances the brutalism of Space Grotesk.
*   **Identity through Scale:** By pairing a `display-sm` header with a `label-sm` metadata tag, we create an editorial hierarchy that feels like a premium sports magazine.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0." We use **Ambient Shadows** and **Tonal Lift**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural recession.
*   **Ambient Shadows:** For floating modal elements, use a highly diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should never be pure black; it should feel like the absence of light within the deep navy environment.
*   **The Ghost Border Fallback:** If accessibility requires a stroke (e.g., input focus), use `outline_variant` (#414754) at **20% opacity**. Never use a 100% opaque border.

---

## 5. Components: The Building Blocks

### Buttons (The "Pulse" of the Platform)
*   **Primary:** High-energy. Uses the `primary` gradient. Roundedness: `DEFAULT` (1rem). 
*   **Secondary:** The "Emerald" action. Use `secondary` (#66df75) with `on_secondary` (#00390f) text. Reserved for success states or "Join Tournament" actions.
*   **Tertiary:** `surface_variant` background with `on_surface` text. Ghost borders only on hover.

### The Central Action Card (The "Main Stage")
This is the heart of the platform. It must use `surface_container_highest` (#2d3546) with a `xl` (3rem) corner radius. It should feature a subtle `primary` outer glow (4% opacity) to signify its importance.

### Inputs & Fields
*   **Style:** No borders. Use `surface_container_low` as the field background.
*   **Focus:** Transition background to `surface_container_high` and add a "Ghost Border" of `primary` at 20% opacity.

### Lists & Tournament Brackets
*   **Rule:** Forbid divider lines. Separate player rows using the **Spacing Scale** `spacing-4` (1rem) or subtle background alternates between `surface_container` and `surface_container_high`.

### Specialized Gaming Components:
*   **Status Chips:** Use `secondary_container` for "Live" matches with a pulsing animation. Use `error_container` for "Full" or "Closed" tournaments.
*   **Stat Glass Overlays:** Small, transparent cards using backdrop-blur to show player K/D ratios or scores without obscuring the background art.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use asymmetrical spacing. Allow some elements to bleed off the edge of the grid for a "dynamic" feel.
*   **Do** use the `primary_fixed_dim` (#adc7ff) for subtle iconography to maintain brand color without over-powering the text.
*   **Do** prioritize "negative space." High-end design is defined by what you *don't* put on the screen.

### Don’t:
*   **Don't** use 1px solid borders. It shatters the "glass and shadow" immersion.
*   **Don't** use standard "Material" blue or green. Stick strictly to the electric blue and emerald tokens provided.
*   **Don't** use shadows on flat, surface-level cards. Shadows are only for elements that "float" (Modals, Tooltips, Hero Cards).
*   **Don't** use a font-weight higher than 500 for body text; let the headers do the heavy lifting.