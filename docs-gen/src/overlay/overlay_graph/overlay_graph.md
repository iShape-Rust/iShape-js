# Overlay Graph
![Example](example.svg)
An Overlay Graph is a data structure representing the intersections and overlays of two geometric objects (<span style="color:#ff3333ff;">**A**</span> and <span style="color:#1a8effff;">**B**</span>) defined by closed contours in 2D space.

The graph is constructed by dividing all the segments of the object contours into non-intersecting parts, where segments can only touch at their endpoints.
Each segment in the graph contains the following properties:

- For each side of the segment, it stores information about its membership to object <span style="color:#ff3333ff;">**A**</span> and object <span style="color:#1a8effff;">**B**</span>
- Segments do not intersect each other, but they may touch at their endpoints.

for more Overlay Graph examples see [Shape Editor](../shapes_editor.md)

## Filter Segments

### Difference A - B
![Example](difference_ab.svg)

### Difference B - A
![Example](difference_ba.svg)

### Union A or B
![Example](union.svg)

### Intersection A and B
![Example](intersection.svg)

### Exclusion A xor B
![Example](exclusion.svg)

