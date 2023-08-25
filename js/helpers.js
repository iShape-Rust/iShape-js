export function flattenPointsInPath(path) {
  return path.reduce((flatArray, point) => {
      return flatArray.concat(point[0], point[1]);
  }, []);
}

export function flattenPointsInShape(paths) {
  return paths.map(path => {
    return flattenPointsInPath(path);
  });
}

export function flattenPointsInShapeList(shapes) {
  return shapes.map(shape => {
    return flattenPointsInShape(shape);
  });
}