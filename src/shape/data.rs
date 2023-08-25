use i_float::{fix_vec::FixVec, fix_float::FixFloat};
use i_shape::{fix_shape::FixShape, fix_path::FixPath};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ShapeListData {
    pub shapes: ShapeData
}

#[derive(Serialize, Deserialize)]
pub struct ShapeData {
    pub paths: Vec<Vec<Vec<f64>>>
}

impl ShapeData {

    pub (crate) fn shape(&self) -> FixShape {
        let n = self.paths.len();
        let mut paths = Vec::with_capacity(n);

        for sequence in self.paths.iter() {
            let path = PathData::points_to_path(sequence);
            paths.push(path);
        }

        FixShape::new(paths)
    }

    pub (crate) fn create(shape: &FixShape) -> Self {
        let mut paths = Vec::with_capacity(shape.paths_count());
        for path in shape.paths().iter() {
            let path_data = PathData::create(path);
            paths.push(path_data.points);
        }
        Self { paths }
    }

}

#[derive(Serialize, Deserialize)]
pub (super) struct PathData {
    pub points: Vec<Vec<f64>>
}

impl PathData {

    pub (crate) fn path(&self) -> FixPath {
        Self::points_to_path(&self.points)
    }

    pub (crate) fn create(path: &FixPath) -> Self {
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