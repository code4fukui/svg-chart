import { BaseChartSVG } from "./BaseChartSVG.js";

// StackedBarChartDateSVG.js
// 横軸=日付のスタッカブル棒グラフ
// API
// new StackedBarChartDateSVG({
//   width, height,
//   margin: {top,right,bottom,left},       // 省略可
//   colors: ["#f8b6c2","#fde1a0","#a4d6b1"], // series色
//   barWidth: 12,                           // 1本の棒の幅(px)
//   gap: 2,                                 // 棒と棒の隙間(px)
//   yMax: null,                             // 最大値指定(未指定なら自動: 積み上げ合計の最大)
//   tickCountX: 6,                          // 時間軸の目盛数目安
//   tickCountY: 4,                          // Y目盛数
//   dateFormat: (d)=> `${d.getMonth()+1}/${d.getDate()}`, // Xラベル表示
//   data: [
//     { date: "2025-08-01", values: [10, 20, 5] },
//     { date: "2025-08-03", values: [ 5,  8, 2] },
//     ...
//   ],
//   title: "タイトル(任意)"
// })

const svgNS = "http://www.w3.org/2000/svg";

export class StackedBarChartDateSVG extends BaseChartSVG {
  constructor(opt) {
    super();
    this.o = {
      width: 640, height: 320,
      margin: { top: 32, right: 24, bottom: 36, left: 44 },
      colors: ["#8ecae6", "#ffb703", "#fb8500", "#90be6d", "#f94144"],
      barWidth: 10,
      gap: 2,
      yMax: null,
      tickCountX: 6,
      tickCountY: 4,
      dateFormat: d => `${d.getMonth()+1}/${d.getDate()}`,
      title: "",
      ...opt,
    };
    // 正規化
    this.data = (this.o.data ?? []).map(d => ({
      date: (d.date instanceof Date) ? d.date : new Date(d.date),
      values: d.values ?? []
    })).sort((a,b) => a.date - b.date);
    this.seriesCount = Math.max(...this.data.map(d => d.values.length), 0);

    this.appendChild(this._create());
  }
  _sum(arr){ return arr.reduce((a,b)=>a+b,0); }
  _niceStep(max, ticks){
    const raw = max / Math.max(ticks,1);
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const steps = [1,2,5,10];
    return steps.find(s => s*pow >= raw) * pow;
  }
  _extentDates(){
    const min = this.data[0]?.date ?? new Date();
    const max = this.data[this.data.length-1]?.date ?? new Date();
    // 同日だけのときは幅を持たせる
    if (+min === +max) return [new Date(min-86400000), new Date(max+86400000)];
    return [min, max];
  }
  _scaleX(d){
    const {left,right} = this.o.margin;
    const W = this.o.width - left - right;
    const [d0,d1] = this.ext;
    return left + ( (d - d0) / (d1 - d0) ) * Math.max(W,1);
  }
  _scaleY(v){
    const {top,bottom} = this.o.margin;
    const H = this.o.height - top - bottom;
    return top + (1 - v/this.yMax) * H;
  }
  _create() {
    const {width,height,margin,colors,barWidth,gap,title,dateFormat,tickCountX,tickCountY} = this.o;
    if (this.data.length === 0) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#666">no data</text></svg>`;
    }
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);


    // 尺度準備
    this.ext = this._extentDates();
    const sums = this.data.map(d => this._sum(d.values));
    this.yMax = this.o.yMax ?? Math.max(...sums, 1);
    const yStep = this._niceStep(this.yMax, tickCountY);
    const yMaxNice = Math.ceil(this.yMax / yStep) * yStep;
    this.yMax = yMaxNice;

    // X目盛用に等間隔tick日付を生成
    const [d0, d1] = this.ext;
    const span = d1 - d0;
    const ticksX = [];
    for (let i=0; i<=tickCountX; i++){
      ticksX.push(new Date(d0.getTime() + (span*i/tickCountX)));
    }

    // 背景 & 軸
    let gGrid = "";
    // Yグリッド/ラベル
    for (let v=0; v<=yMaxNice+1e-6; v+=yStep){
      const y = this._scaleY(v);
      gGrid += `<line x1="${margin.left}" y1="${y}" x2="${width-margin.right}" y2="${y}" stroke="#eee"/>`;
      gGrid += `<text x="${margin.left-6}" y="${y}" font-size="12" fill="#666" text-anchor="end" dominant-baseline="middle">${v}</text>`;
    }
    // Xグリッド/ラベル
    for (const t of ticksX){
      const x = this._scaleX(+t);
      gGrid += `<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${height-margin.bottom}" stroke="#f3f3f3"/>`;
      gGrid += `<text x="${x}" y="${height-margin.bottom+14}" font-size="12" fill="#666" text-anchor="middle">${dateFormat(t)}</text>`;
    }

    // データ（積み上げ矩形）
    let gBars = "";
    // 棒の中心Xは日付スケールに合わせ、左右にbarWidth/2
    for (const d of this.data){
      const xCenter = this._scaleX(+d.date);
      const x = Math.round(xCenter - barWidth / 2);
      let yTop = this._scaleY(0); // 底
      let acc = 0;
      // 下から順に積む
      d.values.forEach((v, idx) => {
        const y1 = this._scaleY(acc);
        acc += v;
        const y2 = this._scaleY(acc);
        const h = Math.max(0, y1 - y2);
        const rx = 0;
        const ry = 0;
        gBars += `<rect x="${x}" y="${y1 - h}" width="${barWidth}" height="${h}" fill="${colors[idx % colors.length]}" rx="${rx}" ry="${ry}"><title>${d.date.toISOString().slice(0,10)}\n#${idx+1}: ${v}</title></rect>`;
      });
      // すこしスペース
      gBars += `<rect x="${x+barWidth}" y="${margin.top}" width="${gap}" height="${height-margin.top-margin.bottom}" fill="transparent"></rect>`;
    }

    // タイトル
    const titleEl = title ? `<text x="${width/2}" y="${margin.top-10}" text-anchor="middle" font-weight="bold" fill="#333">${title}</text>` : "";

    // 凡例（上右）
    let legend = "";
    /*
    const legendX = width - margin.right;
    let ly = margin.top - 16;
    for (let i=0; i<this.seriesCount; i++){
      ly += 18;
      legend += `<rect x="${legendX-110}" y="${ly-12}" width="12" height="12" fill="${colors[i % colors.length]}"></rect>`;
      legend += `<text x="${legendX-92}" y="${ly-2}" font-size="12" fill="#333">Series ${i+1}</text>`;
    }
    */

    svg.innerHTML = `
  <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
  ${titleEl}
  <g>${gGrid}</g>
  <g>${gBars}</g>
  <g>${legend}</g>
  <!-- 軸線 -->
  <line x1="${margin.left}" y1="${height-margin.bottom}" x2="${width-margin.right}" y2="${height-margin.bottom}" stroke="#999"/>
  <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height-margin.bottom}" stroke="#999"/>`.trim();
    return svg;
  }
}

customElements.define("stacked-bar-chart-date-svg", StackedBarChartDateSVG);
