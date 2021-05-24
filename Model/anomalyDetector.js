const enclosingCircle = require("smallest-enclosing-circle");

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
    for (let i = 0; i < atts.length; i++) {
      ts[i] = [];
    }

    for (let i = 1; i < lines.length - 1; i++) {
      let line = lines[i].split(",");
      for (let j = 0; j < atts.length; j++) {
        // i-1 so we won't include the attributes
        ts[j][i - 1] = line[j].replace(/\r/g, ""); // replacing \r with "".
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
    if (p > this.threshold) {
      let len = ts[0].length;
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
    if (p > this.threshold) {
      this.learnRegressionHelper(ts, p, f1, f2, ps);
    } else if (p > 0.5) {
      let psCircle = [];
      for (let i = 0; i < ps.length; i++) {
        psCircle[i] = {
          x: Number(ps[i].x),
          y: Number(ps[i].y),
        };
      }
      let cl = enclosingCircle(psCircle);
      let c = {
        feature1: f1,
        feature2: f2,
        correlation: p,
        threshold: cl.r * 1.1,
        cx: cl.x,
        cy: cl.y,
      };
      this.correlatedFeatures.push(c);
    }
  }

  learnNormal(train, alg_type) {
    let lines = train.split("\n");
    let atts = lines[0].split(",");
    let ts = this.parseCSV(train);
    let len = ts[0].length;

    // For each attribute find the most correlative attribute to it:
    for (let i = 0; i < atts.length; i++) {
      let f1 = atts[i];
      let max = 0;
      let jmax = 0;
      for (let j = i + 1; j < atts.length; j++) {
        let p = Math.abs(pearson(ts[i], ts[j], len));
        if (p > max) {
          max = p;
          jmax = j;
        }
      }
      let f2 = atts[jmax];
      let ps = this.toPoints(ts[i], ts[jmax]);

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
        (cf.correlation >= 0.5 &&
          cf.correlation < this.threshold &&
          dist(new Point(cf.cx, cf.cy), new Point(x, y)) > cf.threshold)
      );
    }
  }

  detect(test, alg_type) {
    let lines = test.split("\n");
    let atts = lines[0].split(",");
    let ts = this.parseCSV(test);
    let len = ts[0].length;

    // for each cf in correalterdFeatures:
    for (let i = 0; i < this.correlatedFeatures.length; i++) {
      let curCF = this.correlatedFeatures[i];
      let f1i = atts.indexOf(curCF.feature1);
      let f2i = atts.indexOf(curCF.feature2);
      for (let j = 0; j < ts[f1i].length; j++) {
        if (this.isAnomalous(ts[f1i][j], ts[f2i][j], curCF, alg_type)) {
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

  detectAnomalies(train, test, alg_type) {
    this.learnNormal(train, alg_type);
    this.detect(test, alg_type);
    this.anomalies.sort((a, b) => a.time - b.time);
    return this.anomalies;
  }
}

//#region Anomaly Detection Utilities

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  f(x) {
    return this.a * x + this.b;
  }
}

function dist(a, b) {
  let x2 = (a.x - b.x) * (a.x - b.x);
  let y2 = (a.y - b.y) * (a.y - b.y);
  return Math.sqrt(x2 + y2);
}

function avg(x, size) {
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += Number(x[i]);
  }
  let toRet = sum / size;
  return toRet;
}

function vari(x, size) {
  let av = avg(x, size);
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * x[i];
  }
  let toRet = sum / size - av * av;
  return toRet;
}

function cov(x, y, size) {
  let sum = 0;
  for (let i = 0; i < size; i++) {
    sum += x[i] * y[i];
  }
  sum /= size;
  let toRet = sum - avg(x, size) * avg(y, size);
  return toRet;
}

function pearson(x, y, size) {
  let a = cov(x, y, size);
  let b = Math.sqrt(vari(x, size)) * Math.sqrt(vari(y, size));
  let toRet = a / b;
  return toRet;
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
