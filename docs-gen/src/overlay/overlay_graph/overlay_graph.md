# Overlay Graph

<div class="geometry-diagram-frame">
{{#include example.svg}}
</div>

An Overlay Graph is a data structure representing the intersections and overlays of two geometric objects (<span class="geometry-subject">**A**</span> and <span class="geometry-clip">**B**</span>) defined by closed contours in 2D space.

The graph is constructed by dividing all the segments of the object contours into non-intersecting parts, where segments can only touch at their endpoints.
Each segment in the graph contains the following properties:

- For each side of the segment, it stores information about its membership to object <span class="geometry-subject">**A**</span> and object <span class="geometry-clip">**B**</span>
- Segments do not intersect each other, but they may touch at their endpoints.

for more Overlay Graph examples see [Shape Editor](../shapes_editor.md)

## Filter Segments

### Difference, C = A - B
The resulting segments of **C** must not be inside body <span class="geometry-clip">**B**</span> and must belong to body <span class="geometry-subject">**A**</span> on one side.\
The side associated solely with body <span class="geometry-subject">**A**</span> will represent the inner part of the resulting shape.

<div class="geometry-diagram-frame">
{{#include difference_ab.svg}}
</div>

### Difference, C = B - A
The resulting segments of **C** must not be inside body <span class="geometry-subject">**A**</span> and must belong to body <span class="geometry-clip">**B**</span> on one side.\
The side associated solely with body <span class="geometry-clip">**B**</span> will represent the inner part of the resulting shape.

<div class="geometry-diagram-frame">
{{#include difference_ba.svg}}
</div>

### Union, C = A or B
The resulting segments of **C** must belong to either body <span class="geometry-subject">**A**</span> or body <span class="geometry-clip">**B**</span>, or to both. The opposite side of each segment must not belong to anybody.\
The side associated with one of the bodies will represent the inner part of the resulting shape.

<div class="geometry-diagram-frame">
{{#include union.svg}}
</div>

### Intersection, C = A and B
The resulting segments of **C** must belong to both bodies <span class="geometry-subject">**A**</span> and <span class="geometry-clip">**B**</span>. The opposite side of each segment must not belong to both bodies simultaneously.\
The side associated with both bodies <span class="geometry-subject">**A**</span> and <span class="geometry-clip">**B**</span> will represent the inner part of the resulting shape.

<div class="geometry-diagram-frame">
{{#include intersection.svg}}
</div>

### Exclusion, C = A xor B
The resulting segments of **C** must belong to either body <span class="geometry-subject">**A**</span> or body <span class="geometry-clip">**B**</span>, but not to both simultaneously. The opposite side of each segment must either belong to both bodies or to neither.\
The side associated with one of the bodies (<span class="geometry-subject">**A**</span> or <span class="geometry-clip">**B**</span>) will represent the inner part of the resulting shape.

<div class="geometry-diagram-frame">
{{#include exclusion.svg}}
</div>
