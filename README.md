# iShape-js

<p align="center">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/balloons.svg" width="250"/>
</p>
The iShape-js is a WebAssembly library compiled from a Rust library for handling various 2D geometry operations. A poly-bool library supports main operations such as union, intersection, difference, xor, and self-intersection by the even-odd rule. This algorithm is based on Vatti clipping ideas but is an original implementation.

## [Demo](https://ishape-rust.github.io/iShape-js/demo/stars_demo.html)
Try out iShape with an interactive demo. The demo covers operations like union, intersection, difference and exclusion

- [Stars Rotation](https://ishape-rust.github.io/iShape-js/demo/stars_demo.html)
- [Shapes Editor](https://ishape-rust.github.io/iShape-js/demo/editor_demo.html)



## Features

- Supports all basic set operations such as union, intersection, difference, exclusion and self-intersection.
- Capable of handling various types of polygons, including self-intersecting polygons, multiple paths and polygons with holes.
- Optimizes by removing unnecessary vertices and merging parallel edges.
- Effectively handles an arbitrary number of overlaps, resolving them using the even-odd rule.
- Employs integer arithmetic for computations.



## Working Range and Precision
The i_overlay library operates within the following ranges and precision levels:

Extended Range: From -1,000,000 to 1,000,000 with a precision of 0.001.
Recommended Range: From -100,000 to 100,000 with a precision of 0.01 for more accurate results.
Utilizing the library within the recommended range ensures optimal accuracy in computations and is advised for most use cases.



## Getting Started

### Basic Usage (Direct include)

#### Download Library Files:
- i_shape_js.js
- i_shape_js_bg.wasm

You can find it at: [pkg](https://github.com/iShape-Rust/iShape-js/tree/main/pkg)
  
#### Place Files:
Put these files in a folder accessible by your HTML. In this example, we put them under the ishape/ directory.

Example HTML Usage
Here is a simple HTML example that demonstrates how to use the iShape library for geometric union operations.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iShape</title>
    <style>
        #result {
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            padding: 10px;
            white-space: pre-wrap;
            font-family: monospace;
        }
    </style>
    <script type="module">
        import init, { JsOverlay, JsOverlayGraph, JsShapeType, JsFillRule} from './ishape/i_shape_js.js';
        init();
        document.getElementById('union').addEventListener('click', () => {
            const subj = {
                paths: [
                    {
                        points: [[200, 300], [200, 100], [400, 100], [400, 300]]
                    }
                ]
            }

            const clip = {
                paths: [
                    {
                        points: [[300, 400], [300, 200], [500, 200], [500, 400]]
                    }
                ]
            }

            const overlay = new JsOverlay();

            overlay.add_shape(subj, JsShapeType.Subject);
            overlay.add_shape(clip, JsShapeType.Clip);

            const graph = overlay.build_graph();
            const result = graph.extract_shapes(JsFillRule.Union);

            const resultText = JSON.stringify(result, null, 2);
            document.getElementById('result').innerText = `Result:\n${resultText}`;
        });
    </script>
</head>
<body>
    <button id="union">Union</button>
    <pre id="result"></pre>
</body>
</html>
```

#### Explanation:

Import classes and initialize the WebAssembly module using init().
Use the imported classes to perform geometric operations.

#### Output:

The result of the union operation will be displayed in a <pre> tag with the ID result.

### Note

This is a basic example. You can extend it further to suit your application's specific needs.


### Union
<p align="left">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/union.svg" width="250"/>
</p>

### Difference
<p align="left">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/difference.svg" width="250"/>
</p>

### Intersection
<p align="left">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/intersection.svg" width="250"/>
</p>

### Exclusion (xor)
<p align="left">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/exclusion.svg" width="250"/>
</p>

### Self-intersection
<p align="left">
<img src="https://github.com/iShape-Rust/iShape-js/blob/main/Readme/self-intersecting.svg" width="250"/>
