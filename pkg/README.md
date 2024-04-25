# iShape-js

<p align="center">
  <img src="readme/balloons.svg" width="250"/>
</p>
2D geometry library for poly-bool operations such as union, intersection, difference and xor.

## [Demo](https://ishape-rust.github.io/iShape-js/overlay/stars_demo.html)
Try out iShape with an interactive demo. The demo covers operations like union, intersection, difference and exclusion

- [Stars Rotation](https://ishape-rust.github.io/iShape-js/overlay/stars_demo.html)
- [Shapes Editor](https://ishape-rust.github.io/iShape-js/overlay/shapes_editor.html)


## Features

- **Operations**: union, intersection, difference, and exclusion.
- **Polygons**: with holes, self-intersections, and multiple paths.
- **Simplification**: removes degenerate vertices and merges collinear edges.
- **Fill Rules**: even-odd and non-zero.

## Getting Started


### Direct include

#### Download Library Files:

- *i_shape.js*
- *i_shape_bg.wasm*

You can find it at: [pkg](https://github.com/iShape-Rust/iShape-js/tree/main/pkg)
  
#### Place Files:
Place these files in a directory that your HTML file can access; in this example, the directory is named *./ishape*


### NPM

#### Installation
You can install the iShape library from NPM:

```bash
npm install i_shape
```

The NPM package is available [here](https://www.npmjs.com/package/i_shape_js)


#### Import and Usage

After installing the NPM package, you can import it in your JavaScript or TypeScript file as follows:

```javascript
import init, { Overlay, OverlayGraph, OverlayRule, ShapeType, FillRule } from './ishape/i_shape.js';

// Your code here

```


### Example

Here is a simple HTML example that demonstrates how to use the iShape library for union operation.
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
        textarea {
            width: 100%;
            height: 150px;
            padding: 10px;
            font-family: monospace;
            margin-bottom: 10px;
        }
    </style>
    <script type="module">
        import init, { Overlay, OverlayGraph, OverlayRule, ShapeType, FillRule} from './ishape/i_shape.js';

        init();

        document.getElementById('union').addEventListener('click', () => {
            const subjInput = document.getElementById('subjInput').value;
            const clipInput = document.getElementById('clipInput').value;

            const subj = JSON.parse(subjInput);
            const clip = JSON.parse(clipInput);

            const overlay = new Overlay();
            overlay.add_paths(subj, ShapeType.Subject);
            overlay.add_paths(clip, ShapeType.Clip);

            // build segments geometry
            const graph = overlay.build_graph(FillRule.EvenOdd);

            // apply union operation
            const union = graph.extract_shapes(OverlayRule.Union);

            // add more operations if required
            // ...

            const resultText = JSON.stringify(union, null, 2);
            document.getElementById('result').innerText = `Result:\n${resultText}`;
        });
    </script>
</head>
<body>
    <textarea id="subjInput" placeholder='Enter "subj" polygon here...'>[[[200, 300], [200, 100], [400, 100], [400, 300]]]</textarea>
    <textarea id="clipInput" placeholder='Enter "clip" polygon here...'>[[[300, 400], [300, 200], [500, 200], [500, 400]]]</textarea>
    <button id="union">Union</button>
    <pre id="result"></pre>
</body>
</html>
```

#### Explanation:

Import classes and initialize the WebAssembly module using init().
Use the imported classes to perform geometric operations.

# Overlay Rules

## Union, A or B
![Union](readme/union.svg)

## Intersection, A and B
![Intersection](readme/intersection.svg)

## Difference, B - A
![Difference](readme/difference.svg)

## Exclusion, A xor B
![Exclusion](readme/exclusion.svg)
