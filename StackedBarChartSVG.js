import { BaseChartSVG } from "./BaseChartSVG.js";
//import { BaseChartSVG } from "https://code4fukui.github.io/svg-chart/BaseChartSVG.js";

const nlegend = 3;

export class StackedBarChartSVG extends BaseChartSVG {
  constructor({ width = 600, barHeight = 25, barGap = 10, data = [], categories = [], colors = [], maxValue = 100, marginLeft = 210, marginRight = 35, marginBottom = null, fontSize = 15, fontSizeLegend = 15 }) {
    super();
    this.width = width;
    this.barHeight = barHeight;
    this.barGap = barGap;
    this.data = data; // [{ label: "xxx", values: [10, 20, 30] }, ...]
    this.categories = categories;
    this.colors = colors;
    this.maxValue = maxValue;
    this.marginRight = marginRight;
    this.marginLeft = marginLeft;
    this.marginBottom = marginBottom || (30 + Math.ceil(categories.length / nlegend) * (fontSizeLegend * 1.7));
    this.height = data.length * (barHeight + barGap) + this.marginBottom;
    this.fontSize = fontSize;
    this.fontSizeLegend = fontSizeLegend;

    this.update();
  }

  drawBarRow(entry, y) {
    let segments = '';

    let x = this.marginLeft;
    entry.values.forEach((value, i) => {
      const width = (value / this.maxValue) * this.width;
      segments += `
        <rect x="${x}" y="${y}" width="${width}" height="${this.barHeight}" fill="${this.colors[i]}" />
      `;
      x += width;
    });
    x = this.marginLeft;
    entry.values.forEach((value, i) => {
      const width = (value / this.maxValue) * this.width;
      if (value > 1) {
        const v = value < 4 ? this.toFixed(value, 0) : this.toFixed(value, 0) + "%";
        segments += `<text x="${x + width / 2}" y="${y + this.barHeight / 2}" font-size="${this.fontSize}" fill="#000"
                        text-anchor="middle" dominant-baseline="central">${v}</text>`;
      }
      x += width;
    });

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

  drawLegend() {
    return this.categories.map((cat, i) => {
      const x = this.marginLeft + (i % nlegend) * 190;
      const y = this.data.length * (this.barHeight + this.barGap) + 32 + Math.floor(i / nlegend) * (this.fontSizeLegend * 1.7);
      return `
        <rect x="${x}" y="${y}" width="15" height="15" fill="${this.colors[i]}" />
        <text x="${x + 20}" y="${y + 12}" font-size="${this.fontSizeLegend}">${cat}</text>
      `;
    }).join('');
  }

  draw() {
    const content = this.data.map((entry, i) => this.drawBarRow(entry, i * (this.barHeight + this.barGap))).join('');
    return `
      <svg
        style="width:100%;height:100%"
        width="${this.width + this.marginLeft + this.marginRight}" height="${this.height}" viewBox="0 0 ${this.width + this.marginLeft + 20} ${this.height}"
      >
        <g>
          ${this.drawAxis()}
          ${content}
          ${this.drawLegend()}
        </g>
      </svg>
    `;
  }
}

customElements.define("stacked-bar-chart-svg", StackedBarChartSVG);
