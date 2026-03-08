# svg-chart

- Charts by SVG
- https://code4fukui.github.io/svg-chart/

## supported chart type

- RaderChartSVG
- BarChartSVG
- StackedBarChartSVG
- LineChartSVG
- PieChartSVG
- StackedBarChartDateSVG

## usage

```html
<div id=chart></div>
<div id=chart2></div>
<script type="module">
import { RadarChartSVG } from "https://code4fukui.github.io/svg-chart/RadarChartSVG.js";
import { BarChartSVG } from "https://code4fukui.github.io/svg-chart/BarChartSVG.js";

const chart = new RadarChartSVG({
  width: 400,
  height: 400,
  levels: 5,
  maxValue: 5,
  data: [
    { label: "活気", value: 3 },
    { label: "イライラ感のなさ", value: 3 },
    { label: "疲労感のなさ", value: "3" },
    { label: "不安感のなさ", value: "2" },
    { label: "抗うつ感のなさ", value: 5 },
    { label: "身体愁訴のなさ", value: 0 },
  ],
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
    { label: "項目A", value: 10 },
    { label: "項目B", value: 20 },
    { label: "項目C (長さ補正)", value: 30 },
    { label: "項目D", value: 1 },
    { label: "項目E", value: 2 },
    { label: "項目F", value: 3 },
    { label: "項目G", value: 4 },
    { label: "項目H", value: 5 },
    { label: "項目I", value: 6 },
  ]
});

document.getElementById("chart2").innerHTML = chart2.draw();
</script>
```
