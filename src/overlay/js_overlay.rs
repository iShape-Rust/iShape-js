use wasm_bindgen::prelude::*;
use i_overlay::{layout::overlay::Overlay, fill::shape_type::ShapeType};

use crate::{shape::js_path::JsPath, overlay::js_overlay_graph::JsOverlayGraph};

use super::js_shape_type::JsShapeType;

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
    pub fn add_path(&mut self, js_path: JsPath, js_shape_type: JsShapeType) {
        let shape_type = ShapeType::from(js_shape_type);
        let path = js_path.path();
        self.overlay.add_path(path.clone(), shape_type);
    }

    #[wasm_bindgen]
    pub fn build_graph(&mut self) -> JsOverlayGraph {
        let graph = self.overlay.build_graph();
        JsOverlayGraph::new(graph)
    }

}