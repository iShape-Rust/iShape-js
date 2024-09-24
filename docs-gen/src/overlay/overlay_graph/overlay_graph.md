# Overlay Graph
![Example](example.svg)
An Overlay Graph is a data structure representing the intersections and overlays of two geometric objects (<span style="color:#ff3333ff;">**A**</span> and <span style="color:#1a8effff;">**B**</span>) defined by closed contours in 2D space.

The graph is constructed by dividing all the segments of the object contours into non-intersecting parts, where segments can only touch at their endpoints.
Each segment in the graph contains the following properties:

- For each side of the segment, it stores information about its membership to object <span style="color:#ff3333ff;">**A**</span> and object <span style="color:#1a8effff;">**B**</span>
- Segments do not intersect each other, but they may touch at their endpoints.

for more Overlay Graph examples see [Shape Editor](../shapes_editor.md)

## Filter Segments

### Difference, C = A - B
The resulting segments of **C** must not be inside body <span style="color:#1a8effff;">**B**</span> and must belong to body <span style="color:#ff3333ff;">**A**</span> on one side.  
The side associated solely with body <span style="color:#ff3333ff;">**A**</span> will represent the inner part of the resulting shape.

![Example](difference_ab.svg)

### Difference, C = B - A
The resulting segments of **C** must not be inside body <span style="color:#ff3333ff;">**A**</span> and must belong to body <span style="color:#1a8effff;">**B**</span> on one side.  
The side associated solely with body <span style="color:#1a8effff;">**B**</span> will represent the inner part of the resulting shape.
![Example](difference_ba.svg)

### Union, C = A or B
The resulting segments of **C** must belong to either body <span style="color:#ff3333ff;">**A**</span> or body <span style="color:#1a8effff;">**B**</span>, or to both. The opposite side of each segment must not belong to anybody.  
The side associated with one of the bodies will represent the inner part of the resulting shape.
![Example](union.svg)

### Intersection, C = A and B
The resulting segments of **C** must belong to both bodies <span style="color:#ff3333ff;">**A**</span> and <span style="color:#1a8effff;">**B**</span>. The opposite side of each segment must not belong to both bodies simultaneously.  
The side associated with both bodies <span style="color:#ff3333ff;">**A**</span> and <span style="color:#1a8effff;">**B**</span> will represent the inner part of the resulting shape.
![Example](intersection.svg)

### Exclusion, C = A xor B
The resulting segments of **C** must belong to either body <span style="color:#ff3333ff;">**A**</span> or body <span style="color:#1a8effff;">**B**</span>, but not to both simultaneously. The opposite side of each segment must either belong to both bodies or to neither.    
The side associated with one of the bodies (<span style="color:#ff3333ff;">**A**</span> or <span style="color:#1a8effff;">**B**</span>) will represent the inner part of the resulting shape.
![Example](exclusion.svg)