# Documentation

---

## Filling Rules

Filling rules determine how the interior of a shape is defined. iOverlay supports 4 filling rules:

- **Even-Odd**: A point is inside the shape if a ray drawn from the point crosses the shape's edges an odd number of times.
- **Non-Zero**: A point is inside the shape if the total winding number around the point is non-zero.
- **Positive**: Only regions with a positive winding number are considered inside.
- **Negative**: Only regions with a negative winding number are considered inside.

---

## Overlay Rules

Overlay rules define how two shapes interact during Boolean operations:

- **Union (A ∪ B)**: Combines the areas of both shapes.
- **Intersection (A ∩ B)**: Retains only the overlapping area of both shapes.
- **Difference (A - B)**: Subtracts the area of shape B from shape A.
- **Exclusion (A ⊕ B)**: Combines the areas of both shapes but excludes the overlapping region.

---

## Contours

Contours represent the boundaries of shapes and are categorized as:

- **Outer Contours**: Define the external boundary of a shape, ordered in a counterclockwise direction.
- **Inner Contours (Holes)**: Define holes within a shape, ordered in a clockwise direction.

---

## Overlay Graph

The overlay graph is a data structure that represents the intersections and overlays of two geometric objects. It is constructed by dividing all segments of the object contours into non-intersecting parts, where segments can only touch at their endpoints. Each segment in the graph contains information about its association with the original shapes, facilitating efficient Boolean operations.

---

## Extract Shapes

After applying Boolean operations, the resulting shapes are extracted through a series of steps:

1. **Build Contour**: Starting from the leftmost node, the algorithm traverses connected segments to form contours, marking each segment as visited to prevent duplication.
2. **Define Contour**: Determines whether a contour is outer or inner based on its orientation and position.
3. **Matching Contours**: Associates inner contours with their corresponding outer contours by analyzing spatial relationships.

---