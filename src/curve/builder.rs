use crate::curve::geometry::CurveGeometry;
use i_curve::float::arc::{Ellipse, EllipticArc};
use i_curve::{CurveBuildError, CurveBuilder as RustCurveBuilder};
use wasm_bindgen::prelude::*;

/// Canvas-like builder for reusable closed curve geometry.
#[wasm_bindgen]
pub struct CurveBuilder {
    builder: RustCurveBuilder<[f64; 2]>,
}

impl Default for CurveBuilder {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
impl CurveBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            builder: RustCurveBuilder::new(),
        }
    }

    /// Starts a new contour. The preceding contour must already be closed.
    #[wasm_bindgen(js_name = moveTo)]
    pub fn move_to(&mut self, x: f64, y: f64) -> Result<(), JsError> {
        self.builder.move_to([x, y]).map(|_| ()).map_err(js_error)
    }

    #[wasm_bindgen(js_name = lineTo)]
    pub fn line_to(&mut self, x: f64, y: f64) -> Result<(), JsError> {
        self.builder.line_to([x, y]).map(|_| ()).map_err(js_error)
    }

    #[wasm_bindgen(js_name = quadraticCurveTo)]
    #[allow(non_snake_case)]
    pub fn quadratic_curve_to(&mut self, cpx: f64, cpy: f64, x: f64, y: f64) -> Result<(), JsError> {
        self.builder
            .quad_to([cpx, cpy], [x, y])
            .map(|_| ())
            .map_err(js_error)
    }

    #[wasm_bindgen(js_name = bezierCurveTo)]
    #[allow(non_snake_case)]
    pub fn bezier_curve_to(
        &mut self,
        cp1x: f64,
        cp1y: f64,
        cp2x: f64,
        cp2y: f64,
        x: f64,
        y: f64,
    ) -> Result<(), JsError> {
        self.builder
            .cubic_to([cp1x, cp1y], [cp2x, cp2y], [x, y])
            .map(|_| ())
            .map_err(js_error)
    }

    /// Adds an elliptic arc. If no contour is active, its start point is used
    /// automatically. Otherwise, the current point must equal the arc start.
    #[wasm_bindgen(js_name = ellipticArcTo)]
    #[allow(non_snake_case)]
    #[allow(clippy::too_many_arguments)]
    pub fn elliptic_arc_to(
        &mut self,
        x: f64,
        y: f64,
        radiusX: f64,
        radiusY: f64,
        rotation: f64,
        startAngle: f64,
        sweepAngle: f64,
    ) -> Result<(), JsError> {
        let arc = elliptic_arc(x, y, radiusX, radiusY, rotation, startAngle, sweepAngle);

        match self.builder.arc_to(arc) {
            Ok(_) => Ok(()),
            Err(CurveBuildError::MissingMoveTo) => {
                self.builder.move_to(arc.start_point()).map_err(js_error)?;
                self.builder.arc_to(arc).map(|_| ()).map_err(js_error)
            }
            Err(error) => Err(js_error(error)),
        }
    }

    /// Adds a complete ellipse as a closed contour.
    #[wasm_bindgen(js_name = addEllipse)]
    #[allow(non_snake_case)]
    pub fn add_ellipse(
        &mut self,
        x: f64,
        y: f64,
        radiusX: f64,
        radiusY: f64,
        rotation: f64,
        clockwise: bool,
    ) -> Result<(), JsError> {
        let sweep_angle = if clockwise {
            -core::f64::consts::TAU
        } else {
            core::f64::consts::TAU
        };
        let arc = elliptic_arc(x, y, radiusX, radiusY, rotation, 0.0, sweep_angle);
        self.builder.move_to(arc.start_point()).map_err(js_error)?;
        self.builder.arc_to(arc).map_err(js_error)?;
        self.builder.close_contour().map(|_| ()).map_err(js_error)
    }

    #[wasm_bindgen(js_name = closeContour)]
    pub fn close_contour(&mut self) -> Result<(), JsError> {
        self.builder.close_contour().map(|_| ()).map_err(js_error)
    }

    /// Builds one shape and resets the builder for reuse after success.
    pub fn build(&mut self) -> Result<CurveGeometry, JsError> {
        self.builder
            .build()
            .map(CurveGeometry::from_shape)
            .map_err(js_error)
    }
}

fn elliptic_arc(
    center_x: f64,
    center_y: f64,
    radius_x: f64,
    radius_y: f64,
    rotation: f64,
    start_angle: f64,
    sweep_angle: f64,
) -> EllipticArc<[f64; 2]> {
    EllipticArc {
        ellipse: Ellipse {
            center: [center_x, center_y],
            radius_x,
            radius_y,
            rotation,
        },
        start_angle,
        sweep_angle,
    }
}

fn js_error(error: impl core::fmt::Display) -> JsError {
    JsError::new(&alloc::format!("{error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builder_creates_lines_beziers_and_ellipses() {
        let mut builder = CurveBuilder::new();
        builder.move_to(0.0, 0.0).unwrap();
        builder.line_to(10.0, 0.0).unwrap();
        builder.quadratic_curve_to(12.0, 5.0, 10.0, 10.0).unwrap();
        builder.bezier_curve_to(5.0, 12.0, 0.0, 12.0, 0.0, 0.0).unwrap();
        builder.close_contour().unwrap();
        builder.add_ellipse(20.0, 20.0, 4.0, 2.0, 0.2, false).unwrap();

        let geometry = builder.build().unwrap();
        assert_eq!(geometry.shape_count(), 1);
        assert_eq!(geometry.contour_count(), 2);
        assert!(geometry.segment_count() >= 7);
    }
}
