import { BaseChartSVG } from "./BaseChartSVG.js";

export function renderPieChart({
  width = 300,
  height = 300,
  data, // [{ label: "福井市", value: 121000 }, ...]
}) {
  const svgNS = "http://www.w3.org/2000/svg";
  const radius = Math.min(width, height) / 2 - 10;
  const centerX = width / 2;
  const centerY = height / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const itemCount = data.length;

  // 色を自動生成（HSL → RGB）
  const coloredData = data.map((item, i) => ({
    ...item,
    color: `hsl(${(i * 360) / itemCount}, 80%, 75%)`,
  }));

  let angleStart = 0;

  const svg = document.createElementNS(svgNS, "svg");
  svg.style.width = "100%";
  svg.style.height = "100%";

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  svg.style.fontFamily = "sans-serif";

  coloredData.forEach((item) => {
    const angle = (item.value / total) * Math.PI * 2;
    const angleEnd = angleStart + angle;

    const x1 = centerX + radius * Math.cos(angleStart);
    const y1 = centerY + radius * Math.sin(angleStart);
    const x2 = centerX + radius * Math.cos(angleEnd);
    const y2 = centerY + radius * Math.sin(angleEnd);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z"
    ].join(" ");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", item.color);
    svg.appendChild(path);

    // ラベル（中央角方向）
    const angleMiddle = angleStart + angle / 2;
    const p = 0.6;
    const labelX = centerX + (radius * p) * Math.cos(angleMiddle);
    const labelY = centerY + (radius * p) * Math.sin(angleMiddle);

    const percent = ((item.value / total) * 100).toFixed(1);
    const population = (item.value / 10000).toFixed(1) + "万人";

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("fill", "black");
    text.setAttribute("font-size", "12");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");

    const lines = [`${item.label}`, `${population}`, `${percent}%`];
    lines.forEach((line, idx) => {
      const tspan = document.createElementNS(svgNS, "tspan");
      tspan.setAttribute("x", labelX);
      tspan.setAttribute("dy", idx === 0 ? "0" : "1.2em");
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    svg.appendChild(text);
    angleStart = angleEnd;
  });
  return svg;
}

export class PieChartSVG extends BaseChartSVG {
  constructor(opt) {
    super();
    Object.assign(this, opt);
    this.update();
  }
  update() {
    const svg = renderPieChart(this);
    this.innerHTML = "";
    this.appendChild(svg);
  }
};

customElements.define("pie-chart-svg", PieChartSVG);
