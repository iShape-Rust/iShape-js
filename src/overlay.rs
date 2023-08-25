use wasm_bindgen::prelude::*;
use i_overlay::{layout::overlay::Overlay, fill::shape_type::ShapeType};
use super::{overlay_graph::JsOverlayGraph, data::{PathData, ShapeData}, shape_type::JsShapeType};

#[wasm_bindgen]
pub struct JsOverlay {
    overlay: Overlay
}

#[wasm_bindgen]
impl JsOverlay {

    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        JsOverlay { overlay: Overlay::new(64) }
    }

    #[wasm_bindgen]
    pub fn add_path(&mut self, js_path: JsValue, js_shape_type: JsShapeType) {
        let shape_type = ShapeType::from(js_shape_type);
        let path = PathData::create_from_json(js_path).path();
        self.overlay.add_path(path, shape_type);
    }

    #[wasm_bindgen]
    pub fn add_shape(&mut self, js_shape: JsValue, js_shape_type: JsShapeType) {
        let shape_type = ShapeType::from(js_shape_type);
        let shape = ShapeData::create_from_json(js_shape).shape();
        let paths = shape.paths().clone();
        self.overlay.add_paths(paths, shape_type);
    }

    #[wasm_bindgen]
    pub fn build_graph(&mut self) -> JsOverlayGraph {
        let graph = self.overlay.build_graph();
        JsOverlayGraph::new(graph)
    }

}