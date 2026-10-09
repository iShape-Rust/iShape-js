use alloc::{collections::BTreeMap, string::String};
use i_triangle::float::relax::{RelaxationOptions, RelaxationResult};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "RelaxationOptions")]
    pub type RelaxationOptionsJs;
    #[wasm_bindgen(typescript_type = "RelaxationResult")]
    pub type RelaxationResultJs;
}

#[wasm_bindgen(typescript_custom_section)]
const RELAXATION_TYPES: &str = r#"
export type RelaxationOptions = {
    /** Maximum movement iterations, a non-negative integer. Default: 8. */
    maxIterations?: number;
    /** Absolute convergence tolerance in input coordinates, finite and non-negative. Default: 0. */
    tolerance?: number;
};

export type RelaxationResult = {
    /** Number of completed vertex-movement iterations. */
    iterations: number;
    /** True if tolerance or integer rounding stopped movement before the iteration limit. */
    converged: boolean;
};
"#;

#[derive(Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct OptionsData {
    max_iterations: usize,
    tolerance: f64,
    // Flatten forces serde-wasm-bindgen to inspect all keys, including typos.
    #[serde(flatten)]
    unknown: BTreeMap<String, serde::de::IgnoredAny>,
}

impl Default for OptionsData {
    fn default() -> Self {
        let options = RelaxationOptions::<f64>::default();
        Self {
            max_iterations: options.max_iterations,
            tolerance: options.tolerance,
            unknown: BTreeMap::new(),
        }
    }
}

pub(super) fn relaxation_options(
    options: Option<RelaxationOptionsJs>,
) -> Result<RelaxationOptions<f64>, JsError> {
    let data: OptionsData = match options {
        Some(options) => serde_wasm_bindgen::from_value(options.into())
            .map_err(|error| JsError::new(&alloc::format!("{error}")))?,
        None => OptionsData::default(),
    };
    if let Some(key) = data.unknown.keys().next() {
        return Err(JsError::new(&alloc::format!("unknown relaxation option: {key}")));
    }
    if !data.tolerance.is_finite() || data.tolerance < 0.0 {
        return Err(JsError::new("tolerance must be finite and non-negative"));
    }
    Ok(RelaxationOptions::new(data.max_iterations).with_tolerance(data.tolerance))
}

#[derive(Serialize)]
struct ResultData {
    iterations: usize,
    converged: bool,
}

pub(super) fn relaxation_result(result: RelaxationResult) -> Result<RelaxationResultJs, JsError> {
    let data = ResultData {
        iterations: result.iterations,
        converged: result.converged,
    };
    serde_wasm_bindgen::to_value(&data)
        .map(Into::into)
        .map_err(|error| JsError::new(&alloc::format!("{error}")))
}
