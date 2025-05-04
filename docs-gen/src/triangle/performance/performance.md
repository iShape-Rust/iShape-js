# Performance Comparison

Benchmark project is [here](https://github.com/iShape-Rust/iTriangle/tree/main/performance).

All tests were run on a machine with the following specifications:  
**3 GHz 6-Core Intel Core i5, 40GB 2667 MHz DDR4**  

All results are presented in seconds.

## Solvers:

- **iTriangle(Unchecked-Raw)** v0.31.0 _– only raw triangulation, no validation check_
- **iTriangle(Unchecked-Delaunay)** v0.31.0 _– raw triangulation and refinement Delaunay_
- **iTriangle(Raw)** v0.31.0 _– validation and raw triangulation_
- **iTriangle(Delaunay)** v0.31.0 _– validation, raw triangulation and refinement Delaunay_
- **earcutr(MapBox)** v0.4.3 – Rust [port](https://crates.io/crates/earcutr)_– only raw triangulation, no validation check_
- **earcut(MapBox)** v2.2.4 – C++ [official](https://github.com/mapbox/earcut.hpp)_– only raw triangulation, no validation check_
- **triangle** v1.6 – C [official](https://www.cs.cmu.edu/~quake/triangle.html)_– constraint Delaunay triangulation, no validation check_


## Simple Star Test

This test generates and triangulate 10,000 unique star-shaped polygons, one at a time.
Each shape is defined by:

- A unique radius scale (100 variations)
- A unique rotation (100 steps across a full circle)
- A given number of corners (count), each with 10 points

_All shapes are clean (non-intersecting), and no mesh is reused — each one is processed independently._

<p align="center">
  <img src="test_0.svg" width="200"/>
</p>

| Count | Un-Raw       | Un-Delaunay  | Raw          | Delaunay     | Earcutr(Rust)|  Earcut(C++) |  Triangle(C) |
|-------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 4     | 0.047844     | 0.115777     | 0.074298     | 0.139643     | 0.057268     | 0.025066     | 0.460071     |
| 8     | 0.098785     | 0.228447     | 0.165002     | 0.284868     | 0.127877     | 0.0668991    | 0.884584     |
| 16    | 0.210214     | 0.448489     | 0.369625     | 0.591876     | 0.290149     | 0.219485     | 1.52763      |
| 32    | 0.455352     | 0.882377     | 0.875200     | 1.256099     | 0.693053     | 0.494215     | 3.07119      |
| 64    | 0.987139     | 1.760142     | 2.241044     | 2.873866     | 1.699206     | 1.2837       | 6.14373      |
| 128   | 2.107867     | 3.493123     | 5.867757     | 7.073528     | 4.253521     | 3.15526      | 11.7701      |
| 256   | 4.481360     | 6.983705     | 16.652639    | 18.894593    | 11.460828    | 8.58501      | 23.1163      |
| 512   | 9.372721     | 13.960055    | 46.585559    | 50.478053    | 40.623172    | 32.9052      | 45.0489      |

## Star with Hole Test

This test generates and triangulates 10,000 unique star-shaped polygons with a central hole, one at a time.
Each shape is defined by:

- A unique radius scale (100 variations)
- A unique rotation (100 steps across a full circle)
- A central hole generated as a smaller star
- A given number of corners (count), each with 10 points

_All shapes are clean (non-intersecting), and no mesh is reused — each one is processed independently._

<p align="center">
  <img src="test_1.svg" width="200"/>
</p>

| Count | Un-Raw       | Un-Delaunay  | Raw          | Delaunay     | Earcutr(Rust)|  Earcut(C++) |  Triangle(C) |
|-------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 4     | 0.110370     | 0.212785     | 0.268433     | 0.369640     | 0.187054     | 0.136161     | 0.801385     |
| 8     | 0.229584     | 0.423034     | 0.593994     | 0.781789     | 0.492114     | 0.454629     | 1.59074      |
| 16    | 0.480577     | 0.830413     | 1.344304     | 1.689566     | 1.537897     | 1.52663      | 3.12989      |
| 32    | 1.031568     | 1.754029     | 3.294683     | 3.976463     | 6.108676     | 5.16188      | 6.21763      |
| 64    | 2.223870     | 3.289262     | 8.547062     | 9.689934     | 29.415327    | 25.1207      | 12.29        |
| 128   | 4.708570     | 6.567074     | 24.225092    | 26.156747    | 201.363290   | 161.923      | 24.6715      |
| 256   | 9.891213     | 13.818567    | 64.140800    | 71.023947    | ---          | ---          | 50.5745      |


## Rect with Star Holes Test

This test generates and triangulates 25 unique rectangles filled with many 5 corners star-shaped holes.

Each shape is defined by:

- A large outer rectangle
- A grid of count × count small stars as holes, each with:
- A varying radius scale (5 variations)
- A unique rotation (5 variations)
- 5 corners per star, with 10 points per corner.

_All shapes are clean (non-intersecting), and no mesh is reused — each one is processed independently._

<p align="center">
  <img src="test_2.svg" width="200"/>
</p>

| Count | Un-Raw       | Un-Delaunay  | Raw          | Delaunay     | Earcutr(Rust)|  Earcut(C++) |  Triangle(C) |
|-------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 4     | 0.003435     | 0.009057     | 0.009029     | 0.037794     | 0.037897     | 0.00531192   | 0.0281862    |
| 8     | 0.013662     | 0.030481     | 0.035041     | 0.112566     | 0.076405     | 0.0431032    | 0.094576     |
| 16    | 0.062749     | 0.130746     | 0.152936     | 0.313631     | 0.605979     | 0.571262     | 0.329305     |
| 32    | 0.268670     | 0.586956     | 0.534618     | 0.927747     | 7.496754     | 0.54836      | 1.34492      |
| 64    | 1.343702     | 3.520728     | 2.542741     | 4.774121     | 210.383871   | 201.28       | 5.86257      |
| 128   | 5.680361     | 19.395140    | 10.131110    | 23.526240    | ---          | ---          | 28.4693      |
| 256   | 25.201445    | 182.099675   | 45.647115    | 196.863314   | ---          | ---          | 175.662      |

