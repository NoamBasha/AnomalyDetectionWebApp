function avg(x, size) {
  sum = 0;
  for (i = 0; i < size; sum += x[i], i++) {}
  return sum / size;
}

// returns the variance of X and Y
function vari(x, size) {
  av = avg(x, size);
  sum = 0;
  for (i = 0; i < size; i++) {
    sum += x[i] * x[i];
  }
  return sum / size - av * av;
}

// returns the covariance of X and Y
function cov(x, y, size) {
  sum = 0;
  for (i = 0; i < size; i++) {
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
  x[size], y[size];
  for (i = 0; i < size; i++) {
    x[i] = points[i].x;
    y[i] = points[i].y;
  }
  a = cov(x, y, size) / vari(x, size);
  b = avg(y, size) - a * avg(x, size);
  return Line(a, b);
}

// returns the deviation between point p and the line equation of the points
function dev(p, points, size) {
  l = linear_reg(points, size);
  return dev(p, l);
}

// returns the deviation between point p and the line
function dev(p, l) {
  return abs(p.y - l.f(p.x));
}
