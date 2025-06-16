export class RadarChartSVG extends HTMLElement {
  constructor({ width = 300, height = 300, levels = 5, maxValue = 5, data = [], title = '', fillColor = "rgba(0,200,0,0.3)", strokeColor = "green" }) {
    super();
    this.width = width;
    this.height = height;
    this.levels = levels;
    this.maxValue = maxValue;
    this.data = data; // [{ label, value }, ... ]
    //this.title = title;
    this.radius = Math.min(width, height) / 2 - 40;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;

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
      const angle = this.toRadians((360 / this.data.length) * i - 90);
      const { x, y } = this.getPoint(angle, this.maxValue);
      const lx = this.getPoint(angle, this.maxValue + 0.5).x;
      const ly = this.getPoint(angle, this.maxValue + 0.5).y;
      return `
        <line x1="${this.centerX}" y1="${this.centerY}" x2="${x}" y2="${y}" stroke="#999"/>
        <text x="${lx}" y="${ly}" font-size="10" text-anchor="middle" dominant-baseline="middle">${item.label}</text>
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

  draw() {
    return `
      <svg
        style="width:100%;height:100%"
        width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
      >
        ${this.drawCircle()}
        ${this.drawAxes()}
        ${this.drawDataPolygon()}
      </svg>
    `;
  }

  update() {
    this.innerHTML = this.draw();
  }
}
customElements.define("rader-chart-svg", RadarChartSVG);
