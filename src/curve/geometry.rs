use crate::curve::data::{shapes_data, CurveShapesDataJs};
use alloc::{vec, vec::Vec};
use i_curve::FloatCurveShape;
use wasm_bindgen::prelude::*;

/// Reusable curve geometry that can contain one or more shapes.
#[wasm_bindgen]
pub struct CurveGeometry {
    pub(super) shapes: Vec<FloatCurveShape<[f64; 2]>>,
}

impl CurveGeometry {
    pub(super) fn from_shape(shape: FloatCurveShape<[f64; 2]>) -> Self {
        Self { shapes: vec![shape] }
    }

    pub(super) fn from_shapes(shapes: Vec<FloatCurveShape<[f64; 2]>>) -> Self {
        Self { shapes }
    }
}

#[wasm_bindgen]
impl CurveGeometry {
    /// Converts this reusable geometry into ordinary JavaScript data.
    #[wasm_bindgen(js_name = toData)]
    pub fn to_data(&self) -> CurveShapesDataJs {
        shapes_data(&self.shapes)
    }

    #[wasm_bindgen(getter, js_name = shapeCount)]
    pub fn shape_count(&self) -> usize {
        self.shapes.len()
    }

    #[wasm_bindgen(getter, js_name = contourCount)]
    pub fn contour_count(&self) -> usize {
        self.shapes.iter().map(|shape| shape.contours().len()).sum()
    }

    #[wasm_bindgen(getter, js_name = segmentCount)]
    pub fn segment_count(&self) -> usize {
        self.shapes.iter().map(FloatCurveShape::segment_count).sum()
    }
}
