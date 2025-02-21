use wasm_bindgen::prelude::wasm_bindgen;
use i_overlay::mesh::style::StrokeStyle as RustStrokeStyle;
use i_overlay::mesh::style::OutlineStyle as RustOutlineStyle;
use i_overlay::mesh::style::LineCap as RustLineCap;
use i_overlay::mesh::style::LineJoin as RustLineJoin;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct StrokeStyle {
    pub start_cap: LineCap,
    pub end_cap: LineCap,
    pub join: LineJoin,
    pub width: f64,
    pub round_angle: f64,
    pub miter_limit: f64,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct OutlineStyle {
    pub join: LineJoin,
    pub outer_offset: f64,
    pub inner_offset: f64,
    pub round_angle: f64,
    pub miter_limit: f64,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LineCap {
    Butt,
    Round,
    Square
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LineJoin {
    Bevel,
    Miter,
    Round,
}

#[wasm_bindgen]
impl StrokeStyle {

    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        StrokeStyle {
            start_cap: LineCap::Butt,
            end_cap: LineCap::Butt,
            join: LineJoin::Bevel,
            width: 1.0,
            round_angle: 0.1,
            miter_limit: 0.1,
        }
    }

    #[wasm_bindgen]
    pub fn set_width(&mut self, width: f64) {
        self.width = width;
    }

    #[wasm_bindgen]
    pub fn get_width(&self) -> f64 {
        self.width
    }

    #[wasm_bindgen]
    pub fn get_line_join(&self) -> LineJoin {
        self.join.clone()
    }

    #[wasm_bindgen]
    pub fn set_line_join(&mut self, join: LineJoin) {
        self.join = join;
    }

    #[wasm_bindgen]
    pub fn set_round_angle(&mut self, angle: f64) {
        self.round_angle = angle;
    }

    #[wasm_bindgen]
    pub fn set_miter_limit(&mut self, limit: f64) {
        self.miter_limit = limit;
    }

    #[wasm_bindgen]
    pub fn get_start_cap(&self) -> LineCap {
        self.start_cap.clone()
    }

    #[wasm_bindgen]
    pub fn set_start_cap(&mut self, cap: LineCap) {
        self.start_cap = cap;
    }

    #[wasm_bindgen]
    pub fn get_end_cap(&self) -> LineCap {
        self.end_cap.clone()
    }

    #[wasm_bindgen]
    pub fn set_end_cap(&mut self, cap: LineCap) {
        self.end_cap = cap;
    }

    pub(super) fn rust_style(&self) -> RustStrokeStyle<[f64; 2], f64> {
        let start_cap = match self.start_cap {
            LineCap::Butt => RustLineCap::Butt,
            LineCap::Round => RustLineCap::Round(self.round_angle),
            LineCap::Square => RustLineCap::Square,
        };
        let end_cap = match self.end_cap {
            LineCap::Butt => RustLineCap::Butt,
            LineCap::Round => RustLineCap::Round(self.round_angle),
            LineCap::Square => RustLineCap::Square,
        };

        let join = match self.join {
            LineJoin::Bevel => RustLineJoin::Bevel,
            LineJoin::Miter => RustLineJoin::Miter(self.miter_limit),
            LineJoin::Round => RustLineJoin::Round(self.round_angle),
        };

        RustStrokeStyle {
            width: self.width,
            start_cap,
            end_cap,
            join,
        }
    }
}

#[wasm_bindgen]
impl OutlineStyle {
    #[wasm_bindgen(constructor)]
    pub fn create() -> Self {
        OutlineStyle {
            join: LineJoin::Bevel,
            outer_offset: 1.0,
            inner_offset: 1.0,
            round_angle: 0.1,
            miter_limit: 0.1,
        }
    }

    pub(super) fn rust_style(&self) -> RustOutlineStyle<f64> {
        let join = match self.join {
            LineJoin::Bevel => RustLineJoin::Bevel,
            LineJoin::Miter => RustLineJoin::Miter(self.miter_limit),
            LineJoin::Round => RustLineJoin::Round(self.round_angle),
        };

        RustOutlineStyle {
            outer_offset: self.outer_offset,
            inner_offset: self.inner_offset,
            join,
        }
    }
}