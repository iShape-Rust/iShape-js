use i_float::fix_float::FixConvert;
use wasm_bindgen::prelude::*;
use i_overlay::layout::overlay_graph::OverlayGraph as RustOverlayGraph;
use i_overlay::bool::overlay_rule::OverlayRule as RustOverlayRule;

use crate::{data::{ShapeListData, LinkListData}};
use crate::overlay_rule::OverlayRule;

#[wasm_bindgen]
pub struct OverlayGraph {
    graph: RustOverlayGraph,
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
        let shapes = self.graph.extract_shapes_min_area(rust_overlay_rule, min_area_f64.fix());
        let data = ShapeListData::create(&shapes);
        serde_wasm_bindgen::to_value(&data).unwrap()
    }

    #[wasm_bindgen]
    pub fn links(&self) -> JsValue {
        let links = self.graph.links();
        let data = LinkListData::create(links);
        serde_wasm_bindgen::to_value(&data).unwrap()
    }
}

impl OverlayGraph {
    pub(super) fn new(graph: RustOverlayGraph) -> Self {
        Self { graph }
    }
}