//#region Anomaly Detection Utilities

class Point {
  consrtuctor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  consrtuctor(a, b) {
    this.a = a;
    this.b = b;
  }

  f(x) {
    return this.a * x + this.b;
  }
}

function avg(x, size) {
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i];
  }
  return sum / size;
}

function vari(x, size) {
  let av = avg(x, size);
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * x[i];
  }
  return sum / size - av * av;
}

function cov(x, y, size) {
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * y[i];
  }
  sum /= size;
  return sum - avg(x, size) * avg(y, size);
}

function pearson(x, y, size) {
  return (
    cov(x, y, size) / (Math.sqrt(vari(x, size)) * Math.sqrt(vari(y, size)))
  );
}

function linear_reg(points, size) {
  let x = [];
  let y = [];
  for (let i = 0; i < size; i++) {
    x[i] = points[i].x;
    y[i] = points[i].y;
  }
  let a = cov(x, y, size) / vari(x, size);
  let b = avg(y, size) - a * avg(x, size);
  return new Line(a, b);
}

function dev(p, points, size) {
  let l = linear_reg(points, size);
  return dev(p, l);
}

function dev(p, l) {
  return Math.abs(p.y - l.f(p.x));
}

//#endregion

// Exports:
//module.exports.Point = Point;

// Improting:
// const {Point, Line} = require(./anomaly_.._...js)
// as realtive path
