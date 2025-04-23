// use std::panic;
// use std::sync::Once;
// use log::info;
use crate::data::{NestedData, VectorsData};
use crate::fill_rule::FillRule;
use crate::overlay_rule::OverlayRule;
use i_triangle::i_overlay::core::fill_rule::FillRule as RustFillRule;
use i_triangle::i_overlay::core::overlay_rule::OverlayRule as RustOverlayRule;
use i_triangle::i_overlay::float::overlay::FloatOverlay;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Overlay {
    overlay: FloatOverlay<[f64; 2], f64>,
}

// static INIT_LOGGER: Once = Once::new();

#[wasm_bindgen]
impl Overlay {
    #[wasm_bindgen]
    pub fn new_with_subj_and_clip(subj_js: JsValue, clip_js: JsValue) -> Option<Overlay> {
        // panic::set_hook(Box::new(console_error_panic_hook::hook));
        // INIT_LOGGER.call_once(|| {
        //     console_log::init_with_level(log::Level::Debug).expect("error initializing log");
        // });
        // info!("Overlay init...");

        let subj = NestedData::with_json(subj_js)?;
        let clip = NestedData::with_json(clip_js)?;

        Some(Overlay::new_with_native_subj_and_clip(subj, clip))
    }

    fn new_with_native_subj_and_clip(subj: NestedData, clip: NestedData) -> Overlay {
        let overlay = match (subj, clip) {
            (NestedData::Contour(subj), NestedData::Contour(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Contour(subj), NestedData::Shape(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Contour(subj), NestedData::Shapes(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shape(subj), NestedData::Contour(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shape(subj), NestedData::Shape(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shape(subj), NestedData::Shapes(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shapes(subj), NestedData::Contour(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shapes(subj), NestedData::Shape(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
            (NestedData::Shapes(subj), NestedData::Shapes(clip)) => {
                FloatOverlay::with_subj_and_clip(&subj, &clip)
            }
        };
        Overlay { overlay }
    }

    #[wasm_bindgen]
    pub fn overlay(self, overlay_rule: OverlayRule, fill_rule: FillRule) -> JsValue {
        let overlay_rule = RustOverlayRule::from(overlay_rule);
        let fill_rule = RustFillRule::from(fill_rule);

        let shapes = self.overlay.overlay(overlay_rule, fill_rule);

        serde_wasm_bindgen::to_value(&shapes).unwrap()
    }

    #[wasm_bindgen]
    pub fn separate_vectors(self, fill_rule: FillRule) -> JsValue {
        let fill_rule = RustFillRule::from(fill_rule);
        let float_graph = self.overlay.into_graph(fill_rule);
        let vectors = float_graph.graph.extract_separate_vectors();
        let data = VectorsData::create(vectors, &float_graph.adapter);
        serde_wasm_bindgen::to_value(&data).unwrap()
    }
}
