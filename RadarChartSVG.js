import { BaseChartSVG } from "./BaseChartSVG.js";
import { RadarChartSVGCore } from "./RadarChartSVGCore.js";

export class RadarChartSVG extends BaseChartSVG {
  constructor(opt) {
    super();
    this.core = new RadarChartSVGCore(opt);
    this.update();
  }
  update() {
    this.innerHTML = this.core.draw();
  }
}
customElements.define("rader-chart-svg", RadarChartSVG);
