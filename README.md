# svg-chart

- Charts by SVG
- https://code4fukui.github.io/svg-chart/

## supported chart type

- RaderChartSVG
- BarChartSVG
- StackedBarChartSVG
- LineChartSVG
- PieChartSVG

## usage

```js
import { RadarChartSVG } from "./RaderChartSVG.js";
import { BarChartSVG } from "./BarChartSVG.js";

const chart = new RadarChartSVG({
  width: 400,
  height: 400,
  levels: 5,
  maxValue: 5,
  labels: ["活気", "イライラ感のなさ", "疲労感のなさ", "不安感のなさ", "抗うつ感のなさ", "身体愁訴のなさ"],
  values: [3.5, 3.83, 3.5, 2.83, 3.33, 3.67],
  title: "〇〇株式会社",
});

document.getElementById("chart").innerHTML = chart.draw();
//console.log(chart.draw());


const chart2 = new BarChartSVG({
  width: 600,
  barHeight: 25,
  barGap: 8,
  categories: ["強い症状", "少し症状", "なし"],
  colors: ["#f8b6c2", "#fde1a0", "#a4d6b1"],
  data: [
    { label: "めまいがする", values: [0, 0, 100] },
    { label: "体のふしぶしが痛む", values: [0, 0, 100] },
    { label: "頭が重かったり頭痛がする", values: [0, 28.6, 71.4] },
    { label: "首筋や肩がこる", values: [14.3, 42.9, 42.8] },
    { label: "腰が痛い", values: [14.3, 42.9, 42.8] },
    { label: "目が疲れる", values: [14.3, 42.9, 42.8] },
    { label: "動悸や息切れがする", values: [0, 0, 100] },
    { label: "胃腸の具合が悪い", values: [0, 28.6, 71.4] },
    { label: "食欲がない", values: [0, 0, 100] },
    { label: "便秘や下痢をする", values: [0, 0, 100] },
    { label: "よく眠れない", values: [0, 0, 100] },
  ]
});

document.getElementById("chart2").innerHTML = chart2.draw();
```
