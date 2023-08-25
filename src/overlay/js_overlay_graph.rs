use i_float::fix_float::FixFloat;
use wasm_bindgen::prelude::*;
use i_overlay::{layout::overlay_graph::OverlayGraph, bool::fill_rule::FillRule};
use crate::shape::js_shape::JsShape;

use super::js_fill_rule::JsFillRule;

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

        // // I wish return [JsShape]
        // let mut js_value = JsValue::null();

        // for shape in shapes {
        //     let js_shape = JsShape::new(shape);

        //     // update js_value

        // }

        // js_value

        // Create a JsShape from each shape and collect into a Vec
        let js_shapes: Vec<JsShape> = shapes.into_iter().map(|shape| JsShape::new(shape)).collect();

        // Convert the Vec<JsShape> into a JsValue representing a JavaScript array
        let js_value = JsValue::from_str(&js_shapes).unwrap();

        js_value
    }


}

impl JsOverlayGraph {

    pub(super) fn new(graph: OverlayGraph) -> Self {
        Self { graph }
    }
}