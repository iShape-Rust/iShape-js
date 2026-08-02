use crate::bool::fill_rule::FillRule;
use crate::bool::overlay_rule::OverlayRule;
use crate::curve::data::{
    conversion_report_data, CurveApproximationOptionsJs, CurveOverlayConversionReportJs,
};
use crate::curve::geometry::CurveGeometry;
use i_curve::{
    FillRule as RustFillRule, FloatCurveOverlay, FloatCurveOverlayOptions, OverlayRule as RustOverlayRule,
};
use serde::Deserialize;
use wasm_bindgen::prelude::*;

/// Boolean overlay for reusable curve geometry.
#[wasm_bindgen]
pub struct CurveOverlay {
    overlay: Option<FloatCurveOverlay<[f64; 2], i32>>,
}

#[wasm_bindgen]
impl CurveOverlay {
    /// Creates an overlay with an automatically selected conversion scale.
    #[wasm_bindgen(constructor)]
    pub fn new(subject: &CurveGeometry, clip: &CurveGeometry) -> Self {
        Self {
            overlay: Some(FloatCurveOverlay::new(&subject.shapes, &clip.shapes)),
        }
    }

    /// Creates a subject-only overlay for resolving its fill rule.
    #[wasm_bindgen(js_name = fromSubject)]
    pub fn from_subject(subject: &CurveGeometry) -> Self {
        Self {
            overlay: Some(FloatCurveOverlay::from_subject(&subject.shapes)),
        }
    }

    /// Creates an overlay with an explicit float-to-integer scale.
    #[wasm_bindgen(js_name = withScale)]
    pub fn with_scale(
        subject: &CurveGeometry,
        clip: &CurveGeometry,
        scale: f64,
    ) -> Result<CurveOverlay, JsError> {
        let overlay =
            FloatCurveOverlay::try_with_scale(&subject.shapes, &clip.shapes, scale).map_err(js_error)?;
        Ok(Self {
            overlay: Some(overlay),
        })
    }

    /// Configures curve approximation before running the operation.
    #[wasm_bindgen(js_name = setApproximation)]
    pub fn set_approximation(&mut self, options: CurveApproximationOptionsJs) -> Result<(), JsError> {
        let data: ApproximationOptionsData =
            serde_wasm_bindgen::from_value(options.into()).map_err(js_error)?;
        let angle_tolerance = data.angle_tolerance.unwrap_or(0.125);
        let max_depth = data.max_depth.unwrap_or(16);
        validate_approximation(data.min_chord_length, angle_tolerance, max_depth)?;
        let overlay = self.take_overlay()?;
        let mut options = FloatCurveOverlayOptions::default()
            .with_angle_tolerance(angle_tolerance)
            .with_max_approximation_depth(max_depth);
        if let Some(length) = data.min_chord_length {
            options = options.with_min_chord_length(length);
        }

        match overlay.try_with_options(options) {
            Ok(overlay) => {
                self.overlay = Some(overlay);
                Ok(())
            }
            Err(error) => Err(js_error(error)),
        }
    }

    /// Returns the effective float-to-integer conversion scale.
    pub fn scale(&self) -> Result<f64, JsError> {
        self.overlay
            .as_ref()
            .map(FloatCurveOverlay::scale)
            .ok_or_else(consumed_error)
    }

    /// Reports geometry collapsed or linearized during conversion.
    #[wasm_bindgen(js_name = conversionReport)]
    pub fn conversion_report(&self) -> Result<CurveOverlayConversionReportJs, JsError> {
        self.overlay
            .as_ref()
            .map(|overlay| conversion_report_data(overlay.conversion_report()))
            .ok_or_else(consumed_error)
    }

    /// Performs the operation. A CurveOverlay is consumed once; the returned
    /// CurveGeometry can be used directly in another operation.
    #[allow(non_snake_case)]
    pub fn overlay(
        &mut self,
        overlayRule: OverlayRule,
        fillRule: FillRule,
    ) -> Result<CurveGeometry, JsError> {
        let overlay = self.take_overlay()?;
        let overlay_rule = RustOverlayRule::from(overlayRule);
        let fill_rule = RustFillRule::from(fillRule);
        Ok(CurveGeometry::from_shapes(
            overlay.overlay(overlay_rule, fill_rule),
        ))
    }

    /// Resolves subject contours using a fill rule. Create this operation with
    /// `CurveOverlay.fromSubject()` when no clip geometry is needed.
    #[wasm_bindgen(js_name = resolveSubject)]
    #[allow(non_snake_case)]
    pub fn resolve_subject(&mut self, fillRule: FillRule) -> Result<CurveGeometry, JsError> {
        let overlay = self.take_overlay()?;
        let fill_rule = RustFillRule::from(fillRule);
        Ok(CurveGeometry::from_shapes(overlay.resolve_subject(fill_rule)))
    }

    fn take_overlay(&mut self) -> Result<FloatCurveOverlay<[f64; 2], i32>, JsError> {
        self.overlay.take().ok_or_else(consumed_error)
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct ApproximationOptionsData {
    min_chord_length: Option<f64>,
    angle_tolerance: Option<f64>,
    max_depth: Option<u32>,
}

fn js_error(error: impl core::fmt::Display) -> JsError {
    JsError::new(&alloc::format!("{error}"))
}

fn consumed_error() -> JsError {
    JsError::new("CurveOverlay has already been consumed")
}

fn validate_approximation(
    min_chord_length: Option<f64>,
    angle_tolerance: f64,
    max_depth: u32,
) -> Result<(), JsError> {
    if let Some(length) = min_chord_length {
        if !length.is_finite() {
            return Err(JsError::new("minimum chord length must be finite"));
        }
        if length <= 0.0 {
            return Err(JsError::new("minimum chord length must be positive"));
        }
    }
    if !angle_tolerance.is_finite() {
        return Err(JsError::new("angle tolerance must be finite"));
    }
    if !(0.0..=1.0).contains(&angle_tolerance) || angle_tolerance == 0.0 {
        return Err(JsError::new("angle tolerance must be in the range (0, 1]"));
    }
    if max_depth > 16 {
        return Err(JsError::new("maximum approximation depth must not exceed 16"));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::curve::CurveBuilder;

    fn rectangle(x0: f64, y0: f64, x1: f64, y1: f64) -> CurveGeometry {
        let mut builder = CurveBuilder::new();
        builder.move_to(x0, y0).unwrap();
        builder.line_to(x1, y0).unwrap();
        builder.line_to(x1, y1).unwrap();
        builder.line_to(x0, y1).unwrap();
        builder.close_contour().unwrap();
        builder.build().unwrap()
    }

    #[test]
    fn result_is_reusable_geometry() {
        let subject = rectangle(0.0, 0.0, 10.0, 10.0);
        let clip = rectangle(5.0, 2.0, 12.0, 8.0);
        let mut overlay = CurveOverlay::new(&subject, &clip);

        assert!(overlay.scale().unwrap() > 0.0);
        let result = overlay
            .overlay(OverlayRule::Intersect, FillRule::NonZero)
            .unwrap();

        assert_eq!(result.shape_count(), 1);
        assert_eq!(result.contour_count(), 1);
    }
}
