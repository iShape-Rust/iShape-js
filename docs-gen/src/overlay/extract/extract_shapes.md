# Extract Shapes

## Build Contour
![Example](extract_contour.svg)

Once we apply boolean filter to [Overlay Graph](../overlay_graph/overlay_graph.md), we can begin extract contours. The current algorithm starts the traversal from the leftmost node. From there, the algorithm selects the topmost segment connected to that node and proceeds along it to the next node.

At each node, the algorithm selects the next segment by rotating around the current node to find the next suitable segment while ensuring that the traversal stays inside the boundary of the shape.

To ensure that segments are not visited twice, each segment is marked as visited once it has been traversed. This allows the algorithm to prevent revisiting already extracted segments.

This process continues until the contour is complete, forming either an outer or inner contour.
