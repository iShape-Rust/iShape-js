<style>
table {
    width: 100% !important;
    table-layout: auto;
    font-size: 0.8em;
    padding: 2px 2px;
}

td, th {
    white-space: normal;
}
</style>

# Performance Comparison

Benchmark projects are:
- [rust](https://github.com/iShape-Rust/iTriangle/tree/main/performance)
- [cpp](https://github.com/iShape-Rust/cpp_triangle_performance_app)

All tests were run on a machine with the following specifications:  
**3 GHz 6-Core Intel Core i5, 40GB 2667 MHz DDR4**  

All results are presented in seconds.

## Solvers:

- **iTriangle(Unchecked-Raw)** v0.32.0 _– only raw triangulation, no validation check_
- **iTriangle(Unchecked-Delaunay)** v0.32.0 _– raw triangulation and refinement Delaunay_
- **iTriangle(Raw)** v0.32.0 _– validation and raw triangulation_
- **iTriangle(Delaunay)** v0.32.0 _– validation, raw triangulation and refinement Delaunay_
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

|Count|Un-Raw      |Un-Delaunay |Raw         |Delaunay    |Earcutr (Rust)|Earcut (C++)|Triangle (C)|
|-----|------------|------------|------------|------------|--------------|------------|------------|
|4    |0.042724    |0.111433    |0.079023    |0.149286    |0.057268      |0.02506     |0.46007     |
|8    |0.083704    |0.217058    |0.169321    |0.303273    |0.127877      |0.06689     |0.88458     |
|16   |0.174608    |0.403747    |0.373843    |0.616759    |0.290149      |0.21948     |1.52763     |
|32   |0.363115    |0.773319    |0.832105    |1.253739    |0.693053      |0.49421     |3.07119     |
|64   |0.769955    |1.490260    |2.077839    |2.849603    |1.699206      |1.2837      |6.14373     |
|128  |1.688746    |2.911652    |5.533498    |6.883017    |4.253521      |3.15526     |11.7701     |
|256  |3.465031    |5.761777    |16.05451    |18.57409    |11.46082      |8.58501     |23.1163     |
|512  |7.063979    |11.47869    |45.20263    |49.50912    |40.62317      |32.9052     |45.0489     |

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

| Count | Un-Raw       | Un-Delaunay  | Raw          | Delaunay     |Earcutr (Rust)|  Earcut (C++)|  Triangle (C)|
|-------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|
| 4     | 0.094518     | 0.201821     | 0.250895     | 0.361006     | 0.187054     | 0.136161     | 0.80138      |
| 8     | 0.187340     | 0.380116     | 0.533652     | 0.743455     | 0.492114     | 0.454629     | 1.59074      |
| 16    | 0.388725     | 0.728224     | 1.200238     | 1.579734     | 1.537897     | 1.52663      | 3.12989      |
| 32    | 0.796857     | 1.477642     | 3.011562     | 3.662901     | 6.108676     | 5.16188      | 6.21763      |
| 64    | 1.686455     | 2.747037     | 7.879640     | 9.071579     | 29.41532     | 25.1207      | 12.29        |
| 128   | 3.601513     | 5.478580     | 22.38637     | 24.40913     | 201.3632     | 161.923      | 24.6715      |
| 256   | 7.615879     | 11.41139     | 63.66546     | 67.22043     | ---          | ---          | 50.5745      |


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

|Count| Un-Raw      | Un-Delaunay  | Raw         | Delaunay     |Earcutr (Rust)| Earcut (C++)| Triangle (C)|
|-----|-------------|--------------|-------------|--------------|--------------|-------------|-------------|
|4    | 0.002339    | 0.008275     | 0.009139    | 0.042705     | 0.037897     | 0.005311    | 0.02818     |
|8    | 0.008906    | 0.024921     | 0.036900    | 0.104350     | 0.076405     | 0.043103    | 0.09457     |
|16   | 0.044372    | 0.116687     | 0.142827    | 0.323554     | 0.605979     | 0.571262    | 0.32930     |
|32   | 0.186836    | 0.510489     | 0.460254    | 0.936904     | 7.496754     | 8.54836     | 1.34492     |
|64   | 0.786142    | 2.617753     | 1.985195    | 4.231544     | 210.3838     | 201.28      | 5.86257     |
|128  | 4.351395    | 18.80902     | 9.719830    | 24.87851     | ---          | ---         | 28.4693     |
|256  | 18.93581    | 149.7484     | 37.08732    | 179.9286     | ---          | ---         | 175.662     |

