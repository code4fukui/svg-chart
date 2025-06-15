export class BarChartSVG extends HTMLElement {
  constructor({ width = 600, barHeight = 25, barGap = 10, data = [], categories = [], colors = [], maxValue = 100 }) {
    super();
    this.width = width;
    this.barHeight = barHeight;
    this.barGap = barGap;
    this.data = data; // [{ label: "xxx", values: [10, 20, 30] }, ...]
    this.categories = categories;
    this.colors = colors;
    this.maxValue = maxValue;
    this.marginLeft = 160;
    this.marginBottom = 40;
    this.height = data.length * (barHeight + barGap) + this.marginBottom;

    this.update();
  }

  drawBarRow(entry, y) {
    let x = this.marginLeft;
    let segments = '';

    entry.values.forEach((value, i) => {
      const width = (value / this.maxValue) * this.width;
      segments += `
        <rect x="${x}" y="${y}" width="${width}" height="${this.barHeight}" fill="${this.colors[i]}" />
      `;
      if (value > 0) {
        segments += `<text x="${x + width / 2}" y="${y + this.barHeight / 2}" font-size="12" fill="#000"
                        text-anchor="middle" dominant-baseline="central">${value.toFixed(1)}%</text>`;
      }
      x += width;
    });

    // ラベル（左側）
    segments += `<text x="${this.marginLeft - 10}" y="${y + this.barHeight / 2}" font-size="12" text-anchor="end" dominant-baseline="middle">
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
        <text x="${x}" y="${this.height - this.marginBottom + 15}" font-size="10" text-anchor="middle">${(i * step).toFixed(0)}%</text>
      `;
    }

    return lines;
  }

  drawLegend() {
    return this.categories.map((cat, i) => {
      const x = this.marginLeft + i * 120;
      return `
        <rect x="${x}" y="${this.height - 30 + 12}" width="15" height="15" fill="${this.colors[i]}" />
        <text x="${x + 20}" y="${this.height - 18 + 12}" font-size="12">${cat}</text>
      `;
    }).join('');
  }

  draw() {
    const content = this.data.map((entry, i) => this.drawBarRow(entry, i * (this.barHeight + this.barGap))).join('');
    return `
      <svg
        style="width:100%;height:100%"
        width="${this.width + this.marginLeft + 20}" height="${this.height}" viewBox="0 0 ${this.width + this.marginLeft + 20} ${this.height}"
      >
        <g>
          ${this.drawAxis()}
          ${content}
          ${this.drawLegend()}
        </g>
      </svg>
    `;
  }

  update() {
    this.innerHTML = this.draw();
  }
}

customElements.define("bar-chart-svg", BarChartSVG);
