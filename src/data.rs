use i_float::{fix_vec::FixVec, fix_float::FixFloat};
use i_shape::{fix_shape::FixShape, fix_path::FixPath};
use i_overlay::layout::overlay_link::OverlayLink;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

#[derive(Serialize, Deserialize)]
pub struct ShapeListData {
    pub shapes: Vec<ShapeData>
}

impl ShapeListData {
    pub (crate) fn create(shapes: &Vec<FixShape>) -> Self {
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
    pub paths: Vec<PathData>
}

impl ShapeData {

    pub (super) fn shape(&self) -> FixShape {
        let n = self.paths.len();
        let mut paths = Vec::with_capacity(n);

        for path_data in self.paths.iter() {
            paths.push(path_data.path());
        }

        FixShape::new(paths)
    }

    pub (super) fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    pub (super) fn create(shape: &FixShape) -> Self {
        let mut paths = Vec::with_capacity(shape.paths_count());
        for path in shape.paths().iter() {
            let path_data = PathData::create(path);
            paths.push(path_data);
        }
        Self { paths }
    }

}

#[derive(Serialize, Deserialize)]
pub struct PathData {
    pub points: Vec<Vec<f64>>
}

impl PathData {

    pub (super) fn path(&self) -> FixPath {
        Self::points_to_path(&self.points)
    }

    pub (super) fn create_from_json(js_value: JsValue) -> Self {
        serde_wasm_bindgen::from_value(js_value).unwrap()
    }

    pub (super) fn create(path: &FixPath) -> Self {
        let mut points = Vec::with_capacity(path.len());
        for fix_vec in path.iter() {
            let x = fix_vec.x.double();
            let y = fix_vec.y.double();
            points.push(vec![x, y]);
        }
        Self { points }
    }

    pub (super) fn points_to_path(points: &Vec<Vec<f64>>) -> FixPath {
        let n = points.len();
        if n == 0 {
            return vec![FixVec::ZERO; 0]
        }

        let mut path = vec![FixVec::ZERO; n];
    
        // Now you can work with points as a Vec of tuples
        for (i, p) in points.iter().enumerate() {
            let x = FixFloat::new_f64(p[0]);
            let y = FixFloat::new_f64(p[1]);
            path[i] = FixVec::new_fix(x, y);
        }
    
        path
    }
}

#[derive(Serialize, Deserialize)]
pub struct LinkData {
    pub ax: f64,
    pub ay: f64,
    pub bx: f64,
    pub by: f64,
    pub fill: u8
}

#[derive(Serialize, Deserialize)]
pub struct LinkListData {
    pub links: Vec<LinkData>
}

impl LinkListData {
    pub (super) fn create(links: &Vec<OverlayLink>) -> Self {
        let mut list = Vec::with_capacity(links.len());
        for link in links.iter() {
            let ab = link.ab();
            let ax = ab.0.x.double();
            let ay = ab.0.y.double();
            let bx = ab.1.x.double();
            let by = ab.1.y.double();
            let fill = link.fill().value();

            list.push(LinkData { ax, ay, bx, by, fill } );
        }
        Self { links: list }
    }
}