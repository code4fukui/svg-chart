export class BaseChartSVG extends HTMLElement {
  constructor() {
    super();
  }
  toFixed(v, n) {
    if (typeof v != "number") {
      v = parseFloat(v);
    }
    if (isNaN(v)) return "NaN";
    return v.toFixed(n);
  }
  update() {
    this.innerHTML = this.draw();
  }
};
