use i_float::fix_float::FixMath;
use i_float::fix_vec::FixVec;
use i_overlay::layout::overlay_link::OverlayLink;
use i_shape::{fix_path::FixPath, fix_shape::FixShape};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

#[derive(Serialize, Deserialize)]
pub struct ShapeListData {
    pub shapes: Vec<ShapeData>,
}

impl ShapeListData {
    pub(crate) fn create(shapes: &Vec<FixShape>) -> Self {
        let mut list = Vec::with_capacity(shapes.len());
        for shape in shapes.iter() {
            let shape_data = ShapeData::create(shape);
            list.push(shape_data);
        }

        Self { shapes: list }
    }
}

#[derive(Serialize, Deserialize)]
pub struct ShapeData {
    pub paths: Vec<PathData>,
}

impl ShapeData {
    pub(super) fn shape(&self) -> FixShape {
        let n = self.paths.len();
        let mut paths = Vec::with_capacity(n);

        for path_data in self.paths.iter() {
            paths.push(path_data.path());
        }

        FixShape::new(paths)
    }

    pub(super) fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    pub(super) fn create(shape: &FixShape) -> Self {
        let mut paths = Vec::with_capacity(shape.paths.len());
        for path in shape.paths.iter() {
            let path_data = PathData::create(path);
            paths.push(path_data);
        }
        Self { paths }
    }
}

#[derive(Serialize, Deserialize)]
pub struct PathData {
    pub points: Vec<[f64; 2]>,
}

impl PathData {
    pub(super) fn path(&self) -> FixPath {
        Self::points_to_path(&self.points)
    }

    pub(super) fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    pub(super) fn create(path: &FixPath) -> Self {
        let points = path.iter().map(|v| [v.x.f64(), v.y.f64()]).collect();
        Self { points }
    }

    pub(super) fn points_to_path(points: &Vec<[f64; 2]>) -> FixPath {
        if points.is_empty() {
            Vec::new()
        } else {
            points.iter().map(|p| FixVec::new_f64(p[0], p[1])).collect()
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct LinkData {
    pub ax: f64,
    pub ay: f64,
    pub bx: f64,
    pub by: f64,
    pub fill: u8,
}

#[derive(Serialize, Deserialize)]
pub struct LinkListData {
    pub links: Vec<LinkData>,
}

impl LinkListData {
    pub(super) fn create(links: &Vec<OverlayLink>) -> Self {
        let mut list = Vec::with_capacity(links.len());
        for link in links.iter() {
            let ab = link.ab();
            let ax = ab.0.x.f64();
            let ay = ab.0.y.f64();
            let bx = ab.1.x.f64();
            let by = ab.1.y.f64();
            let fill = link.fill();

            list.push(LinkData { ax, ay, bx, by, fill });
        }
        Self { links: list }
    }
}