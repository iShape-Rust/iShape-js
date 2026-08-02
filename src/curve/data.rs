use alloc::vec::Vec;
use i_curve::float::arc::{Ellipse, RationalArc};
use i_curve::{CurveConversionReport, FloatCurvePath, FloatCurveSegment, FloatCurveShape};
use serde::Serialize;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "CurveShapesData")]
    pub type CurveShapesDataJs;

    #[wasm_bindgen(typescript_type = "CurveOverlayConversionReport")]
    pub type CurveOverlayConversionReportJs;

    #[wasm_bindgen(typescript_type = "CurveApproximationOptions")]
    pub type CurveApproximationOptionsJs;
}

#[wasm_bindgen(typescript_custom_section)]
const CURVE_DATA_TYPES: &'static str = r#"
/** A two-dimensional point. */
export type CurvePoint = [number, number];

export type CurveEllipseData = {
    center: CurvePoint;
    radiusX: number;
    radiusY: number;
    rotation: number;
};

/**
 * A rational quadratic arc. Its control points and weights are the
 * authoritative geometry; the ellipse is retained as semantic metadata.
 */
export type RationalArcData = {
    ellipse: CurveEllipseData;
    controlPoints: [CurvePoint, CurvePoint, CurvePoint];
    weights: [number, number, number];
    startAngle: number;
    sweepAngle: number;
};

export type CurveSegmentData =
    | { type: "line"; to: CurvePoint }
    | { type: "quad"; ctrl: CurvePoint; to: CurvePoint }
    | { type: "cubic"; ctrl0: CurvePoint; ctrl1: CurvePoint; to: CurvePoint }
    | { type: "arc"; arc: RationalArcData };

export type CurveContourData = {
    start: CurvePoint;
    segments: CurveSegmentData[];
};

export type CurveShapeData = CurveContourData[];
export type CurveShapesData = CurveShapeData[];

export type CurveConversionReport = {
    contourCount: number;
    collapsedContourCount: number;
    collapsedSegmentCount: number;
    linearizedArcCount: number;
    hasDegeneracies: boolean;
};

export type CurveOverlayConversionReport = {
    subject: CurveConversionReport;
    clip?: CurveConversionReport;
    hasDegeneracies: boolean;
};

export type CurveApproximationOptions = {
    /** Absolute minimum accepted chord length in input coordinates. */
    minChordLength?: number;
    /** Maximum sine deviation used for near-linear classification. Default: 0.125. */
    angleTolerance?: number;
    /** Maximum local subdivision depth from 0 through 16. Default: 16. */
    maxDepth?: number;
};
"#;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct EllipseData {
    center: [f64; 2],
    radius_x: f64,
    radius_y: f64,
    rotation: f64,
}

impl From<&Ellipse<[f64; 2]>> for EllipseData {
    fn from(ellipse: &Ellipse<[f64; 2]>) -> Self {
        Self {
            center: ellipse.center,
            radius_x: ellipse.radius_x,
            radius_y: ellipse.radius_y,
            rotation: ellipse.rotation,
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RationalArcData {
    ellipse: EllipseData,
    control_points: [[f64; 2]; 3],
    weights: [f64; 3],
    start_angle: f64,
    sweep_angle: f64,
}

impl From<&RationalArc<[f64; 2]>> for RationalArcData {
    fn from(arc: &RationalArc<[f64; 2]>) -> Self {
        Self {
            ellipse: (&arc.ellipse).into(),
            control_points: arc.control_points,
            weights: arc.weights,
            start_angle: arc.start_angle,
            sweep_angle: arc.sweep_angle,
        }
    }
}

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
enum SegmentData {
    Line {
        to: [f64; 2],
    },
    Quad {
        ctrl: [f64; 2],
        to: [f64; 2],
    },
    Cubic {
        ctrl0: [f64; 2],
        ctrl1: [f64; 2],
        to: [f64; 2],
    },
    Arc {
        arc: RationalArcData,
    },
}

impl From<&FloatCurveSegment<[f64; 2]>> for SegmentData {
    fn from(segment: &FloatCurveSegment<[f64; 2]>) -> Self {
        match segment {
            FloatCurveSegment::Line { to } => Self::Line { to: *to },
            FloatCurveSegment::Quad { ctrl, to } => Self::Quad { ctrl: *ctrl, to: *to },
            FloatCurveSegment::Cubic { ctrl0, ctrl1, to } => Self::Cubic {
                ctrl0: *ctrl0,
                ctrl1: *ctrl1,
                to: *to,
            },
            FloatCurveSegment::Arc { arc } => Self::Arc { arc: arc.into() },
        }
    }
}

#[derive(Serialize)]
struct ContourData {
    start: [f64; 2],
    segments: Vec<SegmentData>,
}

impl From<&FloatCurvePath<[f64; 2]>> for ContourData {
    fn from(contour: &FloatCurvePath<[f64; 2]>) -> Self {
        Self {
            start: contour.start(),
            segments: contour.segments().iter().map(Into::into).collect(),
        }
    }
}

pub(super) fn shapes_data(shapes: &[FloatCurveShape<[f64; 2]>]) -> CurveShapesDataJs {
    let data: Vec<Vec<ContourData>> = shapes
        .iter()
        .map(|shape| shape.contours().iter().map(Into::into).collect())
        .collect();
    serde_wasm_bindgen::to_value(&data).unwrap().into()
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ConversionReportData {
    contour_count: usize,
    collapsed_contour_count: usize,
    collapsed_segment_count: usize,
    linearized_arc_count: usize,
    has_degeneracies: bool,
}

impl From<CurveConversionReport> for ConversionReportData {
    fn from(report: CurveConversionReport) -> Self {
        Self {
            contour_count: report.contour_count,
            collapsed_contour_count: report.collapsed_contour_count,
            collapsed_segment_count: report.collapsed_segment_count,
            linearized_arc_count: report.linearized_arc_count,
            has_degeneracies: report.has_degeneracies(),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct OverlayConversionReportData {
    subject: ConversionReportData,
    #[serde(skip_serializing_if = "Option::is_none")]
    clip: Option<ConversionReportData>,
    has_degeneracies: bool,
}

pub(super) fn conversion_report_data(
    report: i_curve::FloatCurveOverlayConversionReport,
) -> CurveOverlayConversionReportJs {
    let data = OverlayConversionReportData {
        subject: report.subject.into(),
        clip: report.clip.map(Into::into),
        has_degeneracies: report.has_degeneracies(),
    };
    serde_wasm_bindgen::to_value(&data).unwrap().into()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn segment_tags_match_typescript_contract() {
        let line = SegmentData::Line { to: [1.0, 2.0] };
        let json = serde_json::to_string(&line).unwrap();
        assert_eq!(json, r#"{"type":"line","to":[1.0,2.0]}"#);
    }
}
