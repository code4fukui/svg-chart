# svg-chart

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A lightweight, dependency-free library for creating SVG charts using ES Modules and Web Components.

[**View the Live Demo**](https://code4fukui.github.io/svg-chart/)


![Demo screenshot showing a radar chart, a stacked bar chart, a simple bar chart, a line chart, and a pie chart.](https://github.com/code4fukui/svg-chart)


## Features

-   **Six Chart Types**: Radar, Bar, Stacked Bar, Line, Pie, and a date-based Stacked Bar.
-   **Zero Dependencies**: Written in pure JavaScript and works directly in the browser.
-   **ES Module Native**: Import chart classes directly from a URL.
-   **Web Components**: Use charts as custom HTML elements for easy integration.
-   **Customizable**: Control dimensions, colors, labels, and other visual aspects.

## Usage

This library provides chart classes that can be used as Web Components.

1.  **Add a container** to your HTML file:

    ```html
    <div id="my-chart"></div>
    ```

2.  **Import and instantiate** the desired chart in a module script:

    ```html
    <script type="module">
      // Import the chart class
      import { RadarChartSVG } from "https://code4fukui.github.io/svg-chart/RadarChartSVG.js";

      // Create a new chart instance with your data and options
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
      });

      // Append the chart element to your container
      document.getElementById("my-chart").appendChild(chart);
    </script>
    ```

Alternatively, you can manually get the SVG string and set it as `innerHTML`:
`document.getElementById("my-chart").innerHTML = chart.draw();`

## Chart Types & API

### RadarChartSVG

A circular chart for comparing multiple quantitative variables.

-   **Custom Element**: `<rader-chart-svg>`
-   **Key Options**: `width`, `height`, `levels`, `maxValue`, `data`, `dataPrev` (to show a comparison), `fillColor`, `strokeColor`.
-   **Data Format**: `[{ label: string, value: number }]`

```javascript
import { RadarChartSVG } from "https://code4fukui.github.io/svg-chart/RadarChartSVG.js";
const chart = new RadarChartSVG({
  width: 400,
  height: 220,
  maxValue: 5,
  data: [
    { label: "Energy", value: 3.5 },
    { label: "Calmness", value: 3.8 },
    { label: "Focus", value: 2.4 },
  ],
  dataPrev: [ // Optional previous dataset for comparison
    { label: "Energy", value: 2 },
    { label: "Calmness", value: 2.5 },
    { label: "Focus", value: 3.1 },
  ],
});
```

### BarChartSVG

A standard horizontal bar chart.

-   **Custom Element**: `<bar-chart-svg>`
-   **Key Options**: `width`, `barHeight`, `barGap`, `data`, `colors`, `maxValue`, `marginLeft`.
-   **Data Format**: `[{ label: string, value: number }]`

```javascript
import { BarChartSVG } from "https://code4fukui.github.io/svg-chart/BarChartSVG.js";
const chart = new BarChartSVG({
  width: 600,
  barHeight: 25,
  colors: ["#f8b6c2", "#fde1a0", "#a4d6b1"],
  data: [
    { label: "項目A", value: 10 },
    { label: "項目B", value: 20 },
    { label: "項目C", value: 30 },
  ]
});
```

### StackedBarChartSVG

A horizontal bar chart where each bar is segmented to show proportions.

-   **Custom Element**: `<stacked-bar-chart-svg>`
-   **Key Options**: `width`, `barHeight`, `barGap`, `data`, `categories`, `colors`, `maxValue`.
-   **Data Format**: `[{ label: string, values: [number, ...] }]`

```javascript
import { StackedBarChartSVG } from "https://code4fukui.github.io/svg-chart/StackedBarChartSVG.js";
const chart = new StackedBarChartSVG({
  width: 600,
  categories: ["Category 1", "Category 2", "Category 3"],
  colors: ["#