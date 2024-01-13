use wasm_bindgen::prelude::*;
use i_overlay::{layout::overlay::Overlay as RustOverlay};
use i_overlay::bool::fill_rule::FillRule as RustFillRule;
use i_overlay::layout::overlay::ShapeType as RustShapeType;
use crate::fill_rule::FillRule;
use crate::shape_type::ShapeType;
use super::{overlay_graph::OverlayGraph, data::{PathData, ShapeData}};

#[wasm_bindgen]
pub struct Overlay {
    overlay: RustOverlay,
}

#[wasm_bindgen]
impl Overlay {
    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        Self { overlay: RustOverlay::new(64) }
    }

    #[wasm_bindgen]
    pub fn add_path(&mut self, js_path: JsValue, shape_type: ShapeType) {
        let rust_shape_type = RustShapeType::from(shape_type);
        let path = PathData::create_from_json(js_path).path();
        self.overlay.add_path(&path, rust_shape_type);
    }

    #[wasm_bindgen]
    pub fn add_shape(&mut self, js_shape: JsValue, shape_type: ShapeType) {
        let rust_shape_type = RustShapeType::from(shape_type);
        let shape = ShapeData::create_from_json(js_shape).shape();
        self.overlay.add_shape(&shape, rust_shape_type);
    }

    #[wasm_bindgen]
    pub fn build_graph(&mut self, fill_rule: FillRule) -> OverlayGraph {
        let rust_fill_rule = RustFillRule::from(fill_rule);
        let graph = self.overlay.build_graph(rust_fill_rule);
        OverlayGraph::new(graph)
    }
}