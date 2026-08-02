# Getting Started

Install and initialize the WebAssembly package:

```bash
npm install ishape_wasm
```

## Boolean operation

The builder uses familiar Canvas-style path methods. Every contour must be
closed before `build()` is called.

```javascript
import init, {
    CurveBuilder,
    CurveOverlay,
    FillRule,
    OverlayRule,
} from 'ishape_wasm';

await init();

const subjectBuilder = new CurveBuilder();
subjectBuilder.moveTo(0, 0);
subjectBuilder.bezierCurveTo(25, -30, 75, -30, 100, 0);
subjectBuilder.lineTo(100, 80);
subjectBuilder.lineTo(0, 80);
subjectBuilder.closeContour();
const subject = subjectBuilder.build();

const clipBuilder = new CurveBuilder();
clipBuilder.addEllipse(65, 35, 45, 30, 0, false);
const clip = clipBuilder.build();

const operation = new CurveOverlay(subject, clip);
const result = operation.overlay(
    OverlayRule.Intersect,
    FillRule.NonZero,
);

console.log(result.shapeCount);
console.log(result.contourCount);
console.log(result.segmentCount);
console.log(result.toData());
```

`CurveOverlay` is a single-use operation object: `overlay()` consumes it. The
input and result `CurveGeometry` objects remain reusable.

## Building contours

Available segment methods are:

```javascript
const builder = new CurveBuilder();

builder.moveTo(10, 10);
builder.lineTo(60, 10);
builder.quadraticCurveTo(90, 40, 60, 70);
builder.bezierCurveTo(40, 90, 20, 90, 10, 70);
builder.lineTo(10, 10);
builder.closeContour();

// Angles and ellipse rotation are expressed in radians.
builder.ellipticArcTo(
    120, 60, // center
    30, 20,  // radii
    0,       // rotation
    0,       // start angle
    Math.PI, // sweep angle
);
builder.closeContour();

// A complete ellipse is added as a new closed contour.
builder.addEllipse(200, 60, 30, 20, 0, false);

const geometry = builder.build();
```

Call `moveTo()` only after the previous contour has been closed. After a
successful `build()`, the builder is reset and can be used for another shape.

## Resolving self-intersections

When there is no clip geometry, create a subject-only operation:

```javascript
const operation = CurveOverlay.fromSubject(subject);
const resolved = operation.resolveSubject(FillRule.EvenOdd);
```

The fill rule determines which regions of overlapping or self-intersecting
contours belong to the result.

## Precision controls

For most inputs, automatic scaling and the default approximation are sufficient.
Advanced callers can inspect or override them before running the operation:

```javascript
const operation = new CurveOverlay(subject, clip);

operation.setApproximation({
    minChordLength: 0.001,
    angleTolerance: 0.125,
    maxDepth: 16,
});

console.log(operation.scale());
console.log(operation.conversionReport());

const result = operation.overlay(
    OverlayRule.Union,
    FillRule.NonZero,
);
```

Use `CurveOverlay.withScale(subject, clip, scale)` only when the application
needs an explicit float-to-integer conversion scale. A conversion report with
`hasDegeneracies: true` indicates that some input geometry collapsed or an arc
had to be linearized during conversion.
