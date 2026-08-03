# iCurve

iCurve brings Boolean operations to paths made from straight lines, quadratic
and cubic Bézier curves, and elliptic arcs.

Unlike a polygon-only workflow, the result retains curve segments. A result can
be rendered or serialized as JavaScript data, or passed directly to another
operation as reusable `CurveGeometry`.

## Features

- **Curve segments**: lines, quadratic and cubic Bézier curves, and elliptic arcs.
- **Boolean operations**: union, intersection, difference, inverse difference,
  and exclusion.
- **Self-intersection resolving**: apply a fill rule to a subject without a clip.
- **Reusable geometry**: chain operations without converting the result through
  JavaScript objects.
- **Controlled approximation**: tune curve subdivision when the default settings
  are not suitable for the input scale.
- **Conversion diagnostics**: detect contours or segments that collapse in the
  discrete precision model.

## Workflow

1. Build each closed shape with `CurveBuilder`.
2. Create a `CurveOverlay` from the subject and clip geometry.
3. Apply an `OverlayRule` and `FillRule`.
4. Keep the returned `CurveGeometry` for another operation, or call `toData()`
   for rendering and serialization.

See [Getting Started](./getting_started.md) for a complete example and
[API Reference](./api.md) for the available methods and output types.

## Interactive Demos

- [Boolean Playground](./boolean_playground.md) — edit curve shapes and their
  control points by hand.
- [Curve Motion Lab](./motion_lab.md) — animate many cubic contours while
  measuring Boolean solve time and frame rate.
- [TypeCurve](./type_curve.md) — run operations on editable font outlines.

## Source Code

- Rust Version: [iShape-Rust/iCurve](https://github.com/iShape-Rust/iCurve)
- JavaScript and WebAssembly bindings:
  [iShape-Rust/iShape-js](https://github.com/iShape-Rust/iShape-js)
