class Point {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  consrtuctor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  /**
   *
   * @param {number} a
   * @param {number} b
   */
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
  for (let i = 0; i < size; sum += x[i], i++) {}
  return sum / size;
}

// returns the variance of X and Y
function vari(x, size) {
  let av = avg(x, size);
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * x[i];
  }
  return sum / size - av * av;
}

// returns the covariance of X and Y
function cov(x, y, size) {
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * y[i];
  }
  sum /= size;
  return sum - avg(x, size) * avg(y, size);
}

// returns the Pearson correlation coefficient of X and Y
function pearson(x, y, size) {
  return cov(x, y, size) / (sqrt(vari(x, size)) * sqrt(vari(y, size)));
}

// performs a linear regression and returns the line equation
function linear_reg(points, size) {
  let x = [];
  let y = [];
  for (i = 0; i < size; i++) {
    x[i] = points[i].x;
    y[i] = points[i].y;
  }
  let a = cov(x, y, size) / vari(x, size);
  let b = avg(y, size) - a * avg(x, size);
  return new Line(a, b);
}

// returns the deviation between point p and the line equation of the points
function dev(p, points, size) {
  let l = linear_reg(points, size);
  return dev(p, l);
}

// returns the deviation between point p and the line
function dev(p, l) {
  return abs(p.y - l.f(p.x));
}

// Exports:
exports.Point = Point;
exports.Line = Line;

// Improting:
// const {Point, Line} = require(./anomaly_.._...js)
// as realtive path
