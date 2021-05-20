class anomalyDetector {
  constructor() {
    this.threshold = 0.9;
    this.correlatedFeatures = [];
    this.anomalies = [];
  }

  parseCSV(csv) {
    const lines = csv.split("\n");
    const atts = lines[0].split(",");
    let ts = [];
    for (let i = 0; i < atts.length(); i++) {
      ts[i] = [];
    }
    for (let i = 1; i < lines.length(); i++) {
      let line = lines[i].split(",");
      for (let j = 0; j < atts.length(); j++) {
        // i-1 so we won't include the attributes
        ts[j][i - 1] = line[j];
      }
    }
    return ts;
  }

  toPoints(x, y) {
    let ps = [];
    for (let i = 0; i < x.length; i++) {
      ps[i] = new Point(x[i], y[i]);
    }
    return ps;
  }

  findThreshold(ps, len, rl) {
    let max = 0;
    for (let i = 0; i < len; i++) {
      let d = Math.abs(ps[i].y - rl.f(ps[i].x));
      if (d > max) {
        max = d;
      }
    }
    return max;
  }

  learnRegressionHelper(ts, p, f1, f2, ps) {
    if (p > threshold) {
      let len = ts[0].length();
      let l = linear_reg(ps, len);
      let c = {
        feature1: f1,
        feature2: f2,
        correlation: p,
        lin_reg: l,
        threshold: this.findThreshold(ps, len, l) * 1.1,
      };
      this.correlatedFeatures.push(c);
    }
  }

  learnHybridHelper(ts, p, f1, f2, ps) {
    if (p > 0.5 && p < this.threshold) {
      const enclosingCircle = require("smallest-enclosing-circle");
      var cl = enclosingCircle(ps);
      let c = {
        feature1: f1,
        feature2: f2,
        correlation: p,
        threshold: cl.radius * 1.1,
        cx: cl.center.x,
        cy: cl.center.y,
      };
      this.correlatedFeatures.push(c);
    }
  }

  learnNormal(train, alg_type) {
    const lines = train.split("\n");
    const atts = lines[0].split(",");
    let ts = this.parseCSV(train);
    const len = ts[0].length();

    // For each attribute find the most correlative attribute to it:
    for (let i = 0; i < atts.length(); i++) {
      let f1 = atts[i];
      let max = 0;
      let jmax = 0;
      for (let j = i + 1; j < atts.size(); j++) {
        let p = Math.abs(pearson(ts[i], ts[j], len));
        if (p > max) {
          max = p;
          jmax = j;
        }
      }
      let f2 = atts[jmax];
      let ps = this.toPoints(ts[i], ts[jmax]);

      // TODO send "regression" and "hybrid" from contorller.
      if (alg_type.localeCompare("regression") == 0) {
        this.learnRegressionHelper(ts, max, f1, f2, ps);
      }
      if (alg_type.localeCompare("hybrid") == 0) {
        this.learnHybridHelper(ts, max, f1, f2, ps);
      }
    }
  }

  isAnomalous(x, y, cf, alg_type) {
    if (alg_type.localeCompare("regression") == 0) {
      return Math.abs(y - cf.lin_reg.f(x)) > cf.threshold;
    }
    if (alg_type.localeCompare("hybrid") == 0) {
      return (
        (cf.correlation >= this.threshold &&
          Math.abs(y - cf.lin_reg.f(x)) > cf.threshold) ||
        (cf.correlation > 0.5 &&
          cf.correlation < this.threshold &&
          dist(new Point(cf.cx, cf.cy), new Point(x, y) > cf.threshold))
      );
    }
  }

  detect(test, alg_type) {
    const lines = test.split("\n");
    const atts = lines[0].split(",");
    let ts = this.parseCSV(test);
    const len = ts[0].length();

    // for each cf in correalterdFeatures:
    for (let i = 0; i < this.correlatedFeatures.length(); i++) {
      let curCF = this.correlatedFeatures[i];
      let x = atts.indexOf(curCF.feature1);
      let y = atts.indexOf(curCF.feature2);
      for (let j = 0; j < this.correlatedFeatures.length(); j++) {
        if (this.isAnomalous(x[j], y[j], curCF, alg_type)) {
          let s = curCF.feature1 + "-" + curCF.feature2;
          let a = {
            description: s,
            time: j + 1,
          };
          this.anomalies.push(a);
        }
      }
    }
  }

  detectAnomalies(train_csv_path, test_csv_path, alg_type) {
    this.learnNormal(train_csv_path, alg_type);
    this.detect(test_csv_path, alg_type);
    return this.anomalies;
  }
}

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

class Circle {
  consrtuctor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
}

function dist(a, b) {
  let x2 = (a.x - b.x) * (a.x - b.x);
  let y2 = (a.y - b.y) * (a.y - b.y);
  return sqrt(x2 + y2);
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

module.exports = anomalyDetector;
