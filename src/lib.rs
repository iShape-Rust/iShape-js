pub mod overlay;
pub mod shape;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct JsSummator {
    summator: Summator,
}

impl JsSummator {
    // This function is private and helps us create a new Summator from Rust
    fn new() -> Self {
        JsSummator {
            summator: Summator { value: 0.0 },
        }
    }
}

#[wasm_bindgen]
impl JsSummator {

    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        JsSummator::new()
    }

    // Your add function is correct
    pub fn add(&mut self, value: f64) -> f64 {
        self.summator.add(value)
    }
}

pub struct Summator {
    value: f64
}

impl Summator {
    
    pub fn add(&mut self, value: f64) -> f64 {
        self.value += value;
        self.value
    }

}