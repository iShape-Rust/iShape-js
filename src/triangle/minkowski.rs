use crate::bool::fill_rule::FillRule;
use crate::data::{NestedData, PathDataJs, ShapesData, ShapesDataJs};
use alloc::vec;
use i_triangle::float::minkowski::{
    minkowski_difference as difference, minkowski_sum as sum, MinkowskiError,
};
use i_triangle::i_overlay::core::fill_rule::FillRule as RustFillRule;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn minkowski_sum(a: PathDataJs, b: PathDataJs, fill_rule: FillRule) -> Result<ShapesDataJs, JsError> {
    calculate(a, b, fill_rule, sum)
}

#[wasm_bindgen]
pub fn minkowski_difference(
    a: PathDataJs,
    b: PathDataJs,
    fill_rule: FillRule,
) -> Result<ShapesDataJs, JsError> {
    calculate(a, b, fill_rule, difference)
}

fn read_shapes(path: PathDataJs) -> Result<ShapesData, JsError> {
    let data = serde_wasm_bindgen::from_value(path.into())
        .map_err(|error| JsError::new(&alloc::format!("invalid PathData: {error}")))?;
    Ok(match data {
        NestedData::Contour(contour) => vec![vec![contour]],
        NestedData::Shape(shape) => vec![shape],
        NestedData::Shapes(shapes) => shapes,
    })
}

fn calculate(
    a: PathDataJs,
    b: PathDataJs,
    fill_rule: FillRule,
    operation: fn(&ShapesData, &ShapesData, RustFillRule) -> Result<ShapesData, MinkowskiError>,
) -> Result<ShapesDataJs, JsError> {
    let a = read_shapes(a)?;
    let b = read_shapes(b)?;
    let result = operation(&a, &b, fill_rule.into())
        .map_err(|error| JsError::new(&alloc::format!("Minkowski operation failed: {error:?}")))?;
    serde_wasm_bindgen::to_value(&result)
        .map(Into::into)
        .map_err(|error| JsError::new(&alloc::format!("{error}")))
}
