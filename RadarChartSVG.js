import { BaseChartSVG } from "./BaseChartSVG.js";

export class RadarChartSVG extends BaseChartSVG {
  constructor({ width = 300, height = 300, levels = 5, maxValue = 5, data = [], title = '', fillColor = "rgba(0,200,0,0.3)", strokeColor = "green", fontSize = 8 }) {
    super();
    this.width = width;
    this.height = height;
    this.levels = levels;
    this.maxValue = maxValue;
    this.data = data; // [{ label, value }, ... ]
    //this.title = title;
    this.radius = Math.min(width, height) / 2 - 18;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.fontSize = fontSize;

    this.update();
  }

  toRadians(deg) {
    return (deg * Math.PI) / 180;
  }

  getPoint(angle, value) {
    const r = (value / this.maxValue) * this.radius;
    const x = this.centerX + r * Math.cos(angle);
    const y = this.centerY + r * Math.sin(angle);
    return { x, y };
  }

  drawPolygon(points, attrs = '') {
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    return `<path d="${d}" ${attrs}/>`;
  }

  drawCircle() {
    let polygons = '';
    for (let level = 1; level <= this.levels; level++) {
      const r = (level / this.levels) * this.radius;
      const points = this.data.map((_, i) => {
        const angle = this.toRadians((360 / this.data.length) * i - 90);
        return this.getPoint(angle, (level / this.levels) * this.maxValue);
      });
      polygons += this.drawPolygon(points, 'fill="none" stroke="#ccc" stroke-width="0.5"');
    }
    return polygons;
  }

  drawAxes() {
    return this.data.map((item, i) => {
      const deg = (360 / this.data.length) * i - 90;
      const angle = this.toRadians(deg);
      const { x, y } = this.getPoint(angle, this.maxValue);
      const lx = this.getPoint(angle, this.maxValue + 0.5).x;
      const ly = this.getPoint(angle, this.maxValue + 0.5).y;
      const deg2 = deg + 90;
      const anchor = deg2 == 0 || deg2 == 180 ? "middle" : (deg2 < 180 ? "start" : "end");
      return `
        <line x1="${this.centerX}" y1="${this.centerY}" x2="${x}" y2="${y}" stroke="#999" stroke-width="0.5"/>
        <text x="${lx}" y="${ly}" font-size="${this.fontSize}" text-anchor="${anchor}" dominant-baseline="middle">${item.label}</text>
      `;
    }).join('');
  }

  drawDataPolygon() {
    const points = this.data.map((item, i) => {
      const value = item.value;
      const angle = this.toRadians((360 / this.data.length) * i - 90);
      return this.getPoint(angle, value);
    });
    return this.drawPolygon(points, `fill="${this.fillColor}" stroke="${this.strokeColor}" stroke-width="2"`);
  }
  drawDataText() {
    const points = this.data.map((item, i) => {
      const value = item.value;
      const angle = this.toRadians((360 / this.data.length) * i - 90);
      const gap = 0.7;
      return this.getPoint(angle, value < this.maxValue / 2 ? gap + value : -gap + value);
    });
    const text = points.map((p, i) => `<text x="${p.x}" y="${p.y}" font-size="${this.fontSize}" text-anchor="middle" dominant-baseline="middle">${this.toFixed(this.data[i].value, 1)}</text>`);
    return text;
  }

  draw() {
    return `
      <svg
        style="width:100%;height:100%"
        width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
      >
        ${this.drawCircle()}
        ${this.drawAxes()}
        ${this.drawDataPolygon()}
        ${this.drawDataText()}
      </svg>
    `;
  }

  update() {
    this.innerHTML = this.draw();
  }
}
customElements.define("rader-chart-svg", RadarChartSVG);
