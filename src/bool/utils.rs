use crate::data::{NestedData, ShapesDataJs};
use crate::{bool::fill_rule::FillRule, data::PathDataJs};
use i_triangle::i_overlay::core::fill_rule::FillRule as RustFillRule;
use i_triangle::i_overlay::float::simplify::SimplifyShape;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn simplify(contours_js: PathDataJs, fill_rule: FillRule) -> Option<ShapesDataJs> {
    let nested = NestedData::with_json(contours_js)?;

    let fill_rule = RustFillRule::from(fill_rule);
    let shapes = match nested {
        NestedData::Contour(contour) => contour.simplify_shape(fill_rule),
        NestedData::Shape(shape) => shape.simplify_shape(fill_rule),
        NestedData::Shapes(shapes) => shapes.simplify_shape(fill_rule),
    };

    serde_wasm_bindgen::to_value(&shapes).ok().map(Into::into)
}
