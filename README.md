# iShape-js

<p align="center">
  <img src="readme/balloons.svg" width="250"/>
</p>
2D geometry library for triangulation and poly-bool operations such as union, intersection, difference and xor.

## [Demo](https://ishape-rust.github.io/iShape-js/overlay/stars_demo.html)
Try out iShape with an interactive demo.

- [Stars Rotation](https://ishape-rust.github.io/iShape-js/overlay/stars_demo.html)
- [Shapes Editor](https://ishape-rust.github.io/iShape-js/overlay/shapes_editor.html)
- [Path Offset](https://ishape-rust.github.io/iShape-js/overlay/stroke.html)
- [Polygon Offset](https://ishape-rust.github.io/iShape-js/overlay/outline.html)
- [Triangulation](https://ishape-rust.github.io/iShape-js/triangle/triangulation.html)

## Features

- **Boolean Operations**: union, intersection, difference, and exclusion.
- **Polygons**: with holes, self-intersections, and multiple paths.
- **Simplification**: removes degenerate vertices and merges collinear edges.
- **Fill Rules**: even-odd, non-zero, positive and negative.

## Getting Started


### Direct include

#### Download Library Files:

- *ishape_wasm.js*
- *ishape_bg_wasm.wasm*

You can find it at: [pkg](pkg)
  
#### Place Files:
Place these files in a directory that your HTML file can access; in this example, the directory is named *./ishape*


### NPM

#### Installation
You can install the iShape library from NPM:

```bash
npm install ishape_wasm
```

The NPM package is available [here](https://www.npmjs.com/package/ishape_wasm)


#### Import and Usage

After installing the NPM package, you can import it in your JavaScript or TypeScript file as follows:

```javascript
import init, { Overlay, OverlayRule, FillRule } from './ishape/ishape_wasm.js';

// Your code here

```


### Example
Here is a simple HTML example that demonstrates how to use the iShape library for union operation.
Full example is available [here](https://github.com/iShape-Rust/iShape-js/tree/main/examples/html)
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
        import init, { Overlay, OverlayRule, FillRule} from './ishape/ishape_wasm.js';

        init();

        document.getElementById('union').addEventListener('click', () => {
            const subjInput = document.getElementById('subjInput').value;
            const clipInput = document.getElementById('clipInput').value;

            const subj = JSON.parse(subjInput);
            const clip = JSON.parse(clipInput);

            const overlay = Overlay.new_with_subj_and_clip(subj, clip);

            // apply union operation
            const union = overlay.overlay(OverlayRule.Union, FillRule.EvenOdd);

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
| A,B | A ∪ B | A ∩ B | A - B | B - A | A ⊕ B |
|---------|---------------|----------------------|----------------|--------------------|----------------|
| <img src="readme/ab.svg" alt="AB" style="width:100px;"> | <img src="readme/union.svg" alt="Union" style="width:100px;"> | <img src="readme/intersection.svg" alt="Intersection" style="width:100px;"> | <img src="readme/difference_ab.svg" alt="Difference" style="width:100px;"> | <img src="readme/difference_ba.svg" alt="Inverse Difference" style="width:100px;"> | <img src="readme/exclusion.svg" alt="Exclusion" style="width:100px;"> |
