import { BaseChartSVG } from "./BaseChartSVG.js";
//import { BaseChartSVG } from "https://code4fukui.github.io/svg-chart/BaseChartSVG.js";

function createLineChart({
  width = 800,
  height = 400,
  data,     // { 地域名: { 月: 値 } }
  colors,
  yTicks = 5,
  marginTop = 50,
  marginRight = 50,
  marginLeft = 80,
  marginBottom = 50,
  fontSize = 14,
}) {
  const chartWidth = width - (marginLeft + marginRight);
  const chartHeight = height - (marginTop + marginBottom);
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.style.width = "100%";
  svg.style.height = "100%";

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  svg.style.fontFamily = "sans-serif";

  const labels = Object.keys(data);
  const xLabels = Object.keys(data[labels[0]]);
  const xCount = xLabels.length;

  const allValues = labels.flatMap(label => Object.values(data[label]));
  const max = Math.max(...allValues);
  const unit = Math.pow(10, Math.ceil(Math.log(max) / Math.log(10)));
  //const yMax = Math.ceil(max / 100000) * 100000;
  const yMax = Math.ceil(max / unit) * unit;

  const scaleX = (i) => marginLeft + (i / (xCount - 1)) * chartWidth;
  const scaleY = (v) => marginTop + chartHeight - (v / yMax) * chartHeight;

  // Y軸グリッドとラベル
  for (let i = 0; i <= yTicks; i++) {
    const yValue = (yMax / yTicks) * i;
    const y = scaleY(yValue);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", marginLeft);
    line.setAttribute("x2", width - marginRight);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#ccc");
    //line.setAttribute("stroke-dasharray", "2,2");
    svg.appendChild(line);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", marginLeft - 10);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", fontSize);
    label.textContent = yValue.toLocaleString();
    svg.appendChild(label);
  }

  const omit = xLabels.length > 100 ? 30 : 1;

  // X軸グリッドとラベル
  xLabels.forEach((xlabel, i) => {
    const x = scaleX(i);

    const vline = document.createElementNS(svgNS, "line");
    vline.setAttribute("x1", x);
    vline.setAttribute("x2", x);
    vline.setAttribute("y1", marginTop);
    vline.setAttribute("y2", height - marginBottom);
    vline.setAttribute("stroke", "#eee");
    svg.appendChild(vline);

    if (i % omit == 0) {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", height - marginTop + 15);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", fontSize);
      text.textContent = xlabel;
      svg.appendChild(text);
    }
  });

  // 軸線
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", marginLeft);
  xAxis.setAttribute("x2", width - marginRight);
  xAxis.setAttribute("y1", height - marginTop);
  xAxis.setAttribute("y2", height - marginTop);
  xAxis.setAttribute("stroke", "#000");
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", marginLeft);
  yAxis.setAttribute("x2", marginLeft);
  yAxis.setAttribute("y1", marginTop);
  yAxis.setAttribute("y2", height - marginBottom);
  yAxis.setAttribute("stroke", "#000");
  svg.appendChild(yAxis);

  // 折れ線の描画
  labels.forEach((label, i) => {
    const series = data[label];
    const path = document.createElementNS(svgNS, "path");
    let flg = false;
    const d = xLabels.map((xl, j) => {
      const v = series[xl];
      if (!flg) {
        if (v === undefined) {
          return ``;
        } else {
          flg = true;
          return `M${scaleX(j)},${scaleY(v)}`;
        }
      } else {
        if (v === undefined) {
          flg = false;
          return ``;
        } else {
          return `L${scaleX(j)},${scaleY(v)}`;
        }
      }
    }).join(" ");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", colors[i % colors.length]);
    path.setAttribute("stroke-width", 2);
    svg.appendChild(path);
  });

  // 凡例（色の棒 + 黒文字）
  labels.forEach((label, i) => {
    const x = marginLeft + i * 100;
    const y = 20;

    // 色付きの棒（線）
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x);
    line.setAttribute("x2", x + 20);
    line.setAttribute("y1", y - 5);
    line.setAttribute("y2", y - 5);
    line.setAttribute("stroke", colors[i % colors.length]);
    line.setAttribute("stroke-width", 4);
    svg.appendChild(line);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x + 25);
    text.setAttribute("y", y);
    text.setAttribute("fill", "black");
    text.setAttribute("font-size", fontSize);
    text.textContent = label;
    svg.appendChild(text);
  });

  return svg;
}

export class LineChartSVG extends BaseChartSVG {
  constructor(opt) {
    super();
    Object.assign(this, opt);
    this.update();
  }
  update() {
    const svg = createLineChart(this);
    this.innerHTML = "";
    this.appendChild(svg);
  }
};

customElements.define("line-chart-svg", LineChartSVG);