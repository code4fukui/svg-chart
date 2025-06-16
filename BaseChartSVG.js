export class BaseChartSVG extends HTMLElement {
  constructor() {
    super();
  }
  toFixed(v, n) {
    if (typeof v != "number") return v;
    return v.toFixed(n);
  }
  update() {
    this.innerHTML = this.draw();
  }
};
