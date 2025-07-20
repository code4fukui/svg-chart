export class BaseChartSVG extends HTMLElement {
  constructor() {
    super();
    this.style.display = "inline-block;"
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
