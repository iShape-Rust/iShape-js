# API Reference

## `CurveBuilder`

Creates one reusable curve shape. A shape may contain multiple closed contours.

| Method | Description |
|---|---|
| `new CurveBuilder()` | Creates an empty builder. |
| `moveTo(x, y)` | Starts a contour. The preceding contour must be closed. |
| `lineTo(x, y)` | Adds a straight segment. |
| `quadraticCurveTo(cpx, cpy, x, y)` | Adds a quadratic Bézier segment. |
| `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` | Adds a cubic Bézier segment. |
| `ellipticArcTo(x, y, radiusX, radiusY, rotation, startAngle, sweepAngle)` | Adds an elliptic arc. Angles are in radians. |
| `addEllipse(x, y, radiusX, radiusY, rotation, clockwise)` | Adds a complete ellipse as a new closed contour. |
| `closeContour()` | Closes the active contour. |
| `build()` | Returns `CurveGeometry` and resets the builder after success. |

## `CurveGeometry`

Stores one or more curve shapes in WebAssembly memory.

| Member | Description |
|---|---|
| `shapeCount` | Number of shapes. |
| `contourCount` | Total number of contours. |
| `segmentCount` | Total number of curve segments. |
| `toData()` | Converts the geometry to ordinary typed JavaScript data. |

The `toData()` result has the following structure:

```typescript
type CurvePoint = [number, number];

type CurveSegmentData =
    | { type: 'line'; to: CurvePoint }
    | { type: 'quad'; ctrl: CurvePoint; to: CurvePoint }
    | {
          type: 'cubic';
          ctrl0: CurvePoint;
          ctrl1: CurvePoint;
          to: CurvePoint;
      }
    | { type: 'arc'; arc: RationalArcData };

type CurveContourData = {
    start: CurvePoint;
    segments: CurveSegmentData[];
};

type CurveShapeData = CurveContourData[];
type CurveShapesData = CurveShapeData[];
```

Arc data contains its ellipse metadata, angles, rational quadratic control
points, and weights. The control points and weights are the authoritative
geometry.

## `CurveOverlay`

Represents a single Boolean or subject-resolving operation.

| Method | Description |
|---|---|
| `new CurveOverlay(subject, clip)` | Creates an operation with automatic scaling. |
| `CurveOverlay.fromSubject(subject)` | Creates an operation for `resolveSubject()`. |
| `CurveOverlay.withScale(subject, clip, scale)` | Creates an operation with an explicit conversion scale. |
| `setApproximation(options)` | Configures curve approximation before execution. |
| `scale()` | Returns the effective conversion scale. |
| `conversionReport()` | Reports collapsed or linearized input geometry. |
| `overlay(overlayRule, fillRule)` | Runs a Boolean operation and returns `CurveGeometry`. |
| `resolveSubject(fillRule)` | Resolves the subject using the selected fill rule. |

`overlay()` and `resolveSubject()` consume the operation. Calling an operation
method again on the same instance throws an error.

### Approximation options

```typescript
type CurveApproximationOptions = {
    minChordLength?: number;
    angleTolerance?: number; // range: (0, 1], default: 0.125
    maxDepth?: number;       // range: 0...16, default: 16
};
```

Options are optional and may be supplied independently. `minChordLength` must
be a finite positive number when present.

### Conversion report

```typescript
type CurveConversionReport = {
    contourCount: number;
    collapsedContourCount: number;
    collapsedSegmentCount: number;
    linearizedArcCount: number;
    hasDegeneracies: boolean;
};

type CurveOverlayConversionReport = {
    subject: CurveConversionReport;
    clip?: CurveConversionReport;
    hasDegeneracies: boolean;
};
```

## Rules

Use the existing `OverlayRule` values (`Subject`, `Clip`, `Intersect`, `Union`,
`Difference`, `InverseDifference`, or `Xor`) and `FillRule` values (`EvenOdd`,
`NonZero`, `Positive`, or `Negative`).
