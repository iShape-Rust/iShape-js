<style>
.MathJax_Display {
  text-align: left !important;
  margin: 40px;
  font-weight: 800;
  font-size: 1.1em;
  opacity: 0.8;
}

.cursive-stars {
    font-style: italic;
    text-align: center; /* Optional: to center-align the text */
    font-size: 1.2em;   /* Optional: to slightly increase the font size */
    margin: 10px 0;     /* Optional: to add some spacing */
}

#delaunayCanvas {
    display: block;
    border: 2px dotted #80808080;
}
</style>

<script type="text/javascript">
window.addEventListener('DOMContentLoaded', function() {
  const paths = [
    '../js/triangle/delaunay.js',
    './js/triangle/delaunay.js',
    '/js/triangle/delaunay.js'
  ];
  async function fileExists(path) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  (async () => {
    for (const path of paths) {
      if (await fileExists(path)) {
        const script = document.createElement('script');
        script.src = path;
        document.head.appendChild(script);
        break;
      }
    }
  })();
});
</script>

## Delaunay
<p style="font-style: italic;">Click on the canvas to drag the points</p>
<canvas id="delaunayCanvas" width="500" height="500"></canvas>

### What is the Delaunay Condition?


When creating a triangulation network, the Delaunay condition aims to form triangles such that their circumscribed circles do not contain any other points from the dataset. In simpler terms, it ensures that triangles are "well-shaped" rather than "skinny," making the network more balanced and useful for various applications.

<br>

![Delaunay condition](delaunay_condition.svg)

<br>

If the condition \\(\alpha + \beta < \pi\\) holds, it implies that the point \\(P\\) will lie outside the circumscribed circle. This confirms that a pair of triangles satisfies the Delaunay condition.

$$
\alpha + \beta < \pi \Rightarrow \sin(\alpha + \beta) > 0
$$

$$
\sin(\alpha + \beta) = \sin(\alpha)\cos(\beta) + \cos(\alpha)\sin(\beta)
$$

Calculating \\(\cos(\alpha)\\) and \\(\sin(\alpha)\\): 

$$
\cos(\alpha) = \frac{\vec{a} \cdot \vec{b}}{|a||b|} = \frac{a_{x}b_{x} + a_{y}b_{y}}{|a||b|}
$$

$$
\sin(\alpha) = \sqrt{1- \cos^2(\alpha)} = ... = \frac{|a_{x}b_{y} - b_{x}a_{y}|}{|a||b|} = \frac{|\vec{a} \times \vec{b}|}{|a||b|}
$$


Calculating \\(\cos(\beta)\\) and \\(\sin(\beta)\\): 


$$
\cos(\beta) = \frac{\vec{c} \cdot \vec{d}}{|c||d|} = \frac{c_{x}d_{x} + c_{y}d_{y}}{|c||d|}
$$

$$
\sin(\beta) = \frac{|\vec{c} \times \vec{d}|}{|c||d|} = \frac{|c_{x}d_{y} - d_{x}c_{y}|}{|c||d|}
$$

Final Equation:

$$
\sin(\alpha + \beta) = \frac{|a_{x}b_{y} - b_{x}a_{y}|\cdot(c_{x}d_{x} + c_{y}d_{y}) + (a_{x}b_{x} + a_{y}b_{y})\cdot|c_{x}d_{y} - c_{x}d_{y}|}{|a||b||c||d|} > 0
$$

$$
|a_{x}b_{y} - b_{x}a_{y}|\cdot(c_{x}d_{x} + c_{y}d_{y}) + (a_{x}b_{x} + a_{y}b_{y})\cdot|c_{x}d_{y} - d_{x}c_{y}| > 0
$$

Or in vector form:

$$
|\vec{a} \times \vec{b}|(\vec{c} \cdot \vec{d}) + (\vec{a} \cdot \vec{b})|\vec{c} \times \vec{d}| > 0
$$
