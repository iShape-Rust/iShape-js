use wasm_bindgen::prelude::*;
use i_overlay::f64::graph::F64OverlayGraph as RustOverlayGraph;
use i_overlay::core::overlay_rule::OverlayRule as RustOverlayRule;
use i_overlay::i_shape::f64::shape::F64Shapes;
use crate::data::{JSShapeData, ShapeData};

use crate::overlay_rule::OverlayRule;

#[wasm_bindgen]
pub struct OverlayGraph {
    float_graph: RustOverlayGraph,
}

#[wasm_bindgen]
impl OverlayGraph {
    #[wasm_bindgen]
    pub fn extract_shapes(&self, overlay_rule: OverlayRule) -> JsValue {
        self.extract_shapes_min_area(overlay_rule, 0.0)
    }

    #[wasm_bindgen]
    pub fn extract_shapes_min_area(&self, overlay_rule: OverlayRule, min_area_f64: f64) -> JsValue {
        let rust_overlay_rule = RustOverlayRule::from(overlay_rule);
        let shapes = self.float_graph.extract_shapes_min_area(rust_overlay_rule, min_area_f64);
        let float_shapes = shapes_to_js(&shapes);

        serde_wasm_bindgen::to_value(&float_shapes).unwrap()
    }
}

fn shapes_to_js(shapes: &F64Shapes) -> Vec<ShapeData> {
    shapes.iter().map(|shape| JSShapeData::create(shape)).collect()
}

impl OverlayGraph {
    pub(super) fn new(float_graph: RustOverlayGraph) -> Self {
        Self { float_graph }
    }
}