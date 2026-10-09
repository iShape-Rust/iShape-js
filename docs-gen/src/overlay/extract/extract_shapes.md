# Extract Shapes

Once we apply boolean filter to [Overlay Graph](../overlay_graph/overlay_graph.md), we can begin extract contours.

## Build Contour

### Outer Contour

<div class="geometry-diagram-frame">
{{#include extract_outer_contour_clockwise.svg}}
</div>

### Inner Contour

<div class="geometry-diagram-frame">
{{#include extract_inner_clockwise.svg}}
</div>

The algorithm starts by selecting the leftmost node and proceeds by choosing the topmost segment connected to that node. The process continues by traversing to the next node along the selected segment.

At each node, the algorithm selects the next segment by rotating around the current node in a clockwise/counterclockwise direction for outer/inner contours and taking the first nearest segment.

To prevent segments from being visited twice, each segment is marked as visited upon traversal.

This process continues until the contour is complete, forming either an <span class="geometry-subject">**outer**</span> or <span class="geometry-clip">**inner**</span> contour.

By following this approach, <span class="geometry-subject">**outer**</span> contours are extracted in a counter-clockwise direction, while <span class="geometry-clip">**inner**</span> contours are extracted in a clockwise direction.

## Define Contour

<div class="geometry-diagram-frame">
{{#include define_contour.svg}}
</div>

To define a contour, the algorithm begins by identifying the leftmost and topmost segment in the contour. The classification of the contour is determined as follows:

- If the left-top side of the segment is classified as the <span class="geometry-subject">**outer**</span> side, then the contour is an <span class="geometry-subject">**outer**</span> contour.
- If the left-top side of the segment is classified as the <span class="geometry-clip">**inner**</span> side, then the contour is an <span class="geometry-clip">**inner**</span> contour.

This method ensures each contour is correctly classified based on its orientation in 2D space.

## Define Shape

<div class="geometry-diagram-frame">
{{#include define_shape.svg}}
</div>

A shape is defined as a group of contours, where the first contour is always an <span class="geometry-subject">**outer**</span> contour, and the subsequent contours (if any) are <span class="geometry-clip">**inner**</span> contours.

## Matching Contours

<div class="geometry-diagram-frame">
{{#include matching_contours.svg}}
</div>

To match <span class="geometry-clip">**inner**</span> contours to their corresponding <span class="geometry-subject">**outer**</span> contours:
1. Draw a line **downward** from any point on the <span class="geometry-clip">**inner**</span> (**target**) contour.
2. Identify the first segment encountered along the line that does not belong to the **target** contour.
- If the segment belongs to an <span class="geometry-subject">**outer**</span> contour, that contour is the container for the **target** contour.
- If the segment belongs to another <span class="geometry-clip">**inner**</span> contour, the container of that <span class="geometry-clip">**inner**</span> contour is also the container for the **target** contour.
## Define Segment under Point

## Segment under Point

<div class="geometry-diagram-frame">
{{#include segment_under_point.svg}}
</div>

To determine whether a segment **AB** is below a point **P**, one may be tempted to compute the value of y<sub>m</sub> at the point of intersection **M**, where a vertical line is dropped from **P** onto **AB** (i.e., x<sub>p</sub> = x<sub>m</sub>):

$$
y_{m} = \frac{y_{a} - y_{b}}{x_{a} - x_{b}}\cdot(x_{m} - x_{a}) + y_{a}
$$

However, this approach can introduce precision issues due to the division involved.

A more reliable method involves using the order of traversal around the vertices of the triangle **APB**. If segment **AB** is below point **P**, the vertices **A**, **P**, and **B** will appear in a clockwise order.

This method uses the cross product of vectors **PA** and **PB**:

$$
a \times b = a_x b_y - a_y b_x
$$

Since this method avoids division, it eliminates precision issues, making it stable for determining whether a segment is below a point.

## Selecting the Closest Segment under Point

When multiple segments are positioned below point **P**, we need to determine which segment is the closest to **P**. This scenario can be divided into three distinct cases based on the configuration of the segments relative to **P**.

### Left Case

<div class="geometry-diagram-frame">
{{#include segment_under_segment_a.svg}}
</div>

When both segments share a common left vertex **A**, we check the positions of their right endpoints. If the vertices **B<sub>0</sub>**, **B<sub>1</sub>**, and **A** form a clockwise pattern, then **AB<sub>0</sub>** is closer to **P** than **AB<sub>1</sub>**.

### Right Case

<div class="geometry-diagram-frame">
{{#include segment_under_segment_b.svg}}
</div>

When both segments share a common right vertex **B**, we check the positions of their left endpoints. If the vertices **A<sub>0</sub>**, **A<sub>1</sub>**, and **B** form a clockwise pattern, then **A<sub>1</sub>B** is closer to **P** than **A<sub>0</sub>B**.

### Middle Case

<div class="geometry-diagram-frame">
{{#include segment_under_segment_ab.svg}}
</div>

In this case, one of the vertices (e.g., **A<sub>1</sub>** or **B<sub>0</sub>**) lies inside the opposite segment. We use the point-segment comparison method to determine which of the segments is closer to **P**.
