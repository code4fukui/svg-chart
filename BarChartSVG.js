export class BarChartSVG extends HTMLElement {
  constructor({ width = 600, barHeight = 25, barGap = 10, data = [], colors = [], maxValue = 100, marginLeft = 210, marginBottom = 20, fontSize = 15 }) {
    super();
    this.width = width;
    this.barHeight = barHeight;
    this.barGap = barGap;
    this.data = data; // [{ label: "xxx", value: 10 }, ...]
    this.colors = colors;
    this.maxValue = maxValue;
    this.marginLeft = marginLeft;
    this.marginBottom = marginBottom;
    this.height = data.length * (barHeight + barGap) + this.marginBottom;
    this.fontSize = fontSize;

    this.update();
  }

  drawBarRow(entry, y, idx) {
    let x = this.marginLeft;
    let segments = '';

    const value = entry.value;
    const width = (value / this.maxValue) * this.width;
    segments += `
      <rect x="${x}" y="${y}" width="${width}" height="${this.barHeight}" fill="${this.colors[idx % this.colors.length]}" />
    `;
    if (value > 0) {
      segments += `<text x="${x + width / 2}" y="${y + this.barHeight / 2}" font-size="${this.fontSize}" fill="#000"
                      text-anchor="middle" dominant-baseline="central">${value.toFixed(1)}%</text>`;
    }

    // ラベル（左側）
    segments += `<text x="${this.marginLeft - 10}" y="${y + this.barHeight / 2}" font-size="${this.fontSize}" text-anchor="end" dominant-baseline="middle">
      ${entry.label}
    </text>`;

    return segments;
  }

  drawAxis() {
    const ticks = 10;
    const step = this.maxValue / ticks;
    let lines = '';

    for (let i = 0; i <= ticks; i++) {
      const x = this.marginLeft + (i * this.width) / ticks;
      lines += `
        <line x1="${x}" y1="0" x2="${x}" y2="${this.height - this.marginBottom}" stroke="#ccc" />
        <text x="${x}" y="${this.height - this.marginBottom + 15}" font-size="${this.fontSize}" text-anchor="middle">${(i * step).toFixed(0)}%</text>
      `;
    }

    return lines;
  }

  draw() {
    const content = this.data.map((entry, i) => this.drawBarRow(entry, i * (this.barHeight + this.barGap), i)).join('');
    return `
      <svg
        style="width:100%;height:100%"
        width="${this.width + this.marginLeft + 20}" height="${this.height}" viewBox="0 0 ${this.width + this.marginLeft + 20} ${this.height}"
      >
        <g>
          ${this.drawAxis()}
          ${content}
        </g>
      </svg>
    `;
  }

  update() {
    this.innerHTML = this.draw();
  }
}

customElements.define("bar-chart-svg", BarChartSVG);
