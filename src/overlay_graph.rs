use i_float::fix_float::FixFloat;
use wasm_bindgen::prelude::*;
use i_overlay::{layout::overlay_graph::OverlayGraph, bool::fill_rule::FillRule};

use crate::{fill_rule::JsFillRule, data::{ShapeListData, LinkListData}};

#[wasm_bindgen]
pub struct JsOverlayGraph {
    graph: OverlayGraph
}


#[wasm_bindgen]
impl JsOverlayGraph {

    #[wasm_bindgen]
    pub fn extract_shapes(&self, js_fill_rule: JsFillRule) -> JsValue {
        let min_area = FixFloat::new_i64(16).double();

        self.extract_shapes_min_area(js_fill_rule, min_area)
    }

    #[wasm_bindgen]
    pub fn extract_shapes_min_area(&self, js_fill_rule: JsFillRule, min_area_f64: f64) -> JsValue {
        let min_area = FixFloat::new_f64(min_area_f64);
        let fill_rule = FillRule::from(js_fill_rule);
        let shapes = self.graph.extract_shapes_min_area(fill_rule, min_area);
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

impl JsOverlayGraph {

    pub(super) fn new(graph: OverlayGraph) -> Self {
        Self { graph }
    }
}