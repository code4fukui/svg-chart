# svg-chart

ES ModulesとWeb Componentsを使用した、軽量で依存関係のないSVGチャート作成ライブラリです。

[**ライブデモを見る**](https://code4fukui.github.io/svg-chart/)

![レーダーチャート、積み上げ棒グラフ、シンプルな棒グラフ、折れ線グラフ、円グラフを示すデモのスクリーンショット。](https://code4fukui.github.io/svg-chart/ss.png)

## 特徴

-   **6つのチャートタイプ**: レーダーチャート、棒グラフ、積み上げ棒グラフ、折れ線グラフ、円グラフ、日付ベースの積み上げ棒グラフ。
-   **依存関係なし**: ピュアJavaScriptで記述されており、ブラウザ上で直接動作します。
-   **ES Modulesネイティブ**: URLから直接チャートクラスをインポートできます。
-   **Web Components**: チャートをカスタムHTML要素として使用でき、簡単に組み込めます。
-   **カスタマイズ可能**: サイズ、色、ラベル、その他の視覚要素を制御できます。

## 使い方

このライブラリは、Web Componentsとして使用できるチャートクラスを提供します。

1.  **HTMLファイルにコンテナを追加します**:

    ```html
    <div id="my-chart"></div>
    ```

2.  **モジュールスクリプト内で目的のチャートをインポートし、インスタンス化します**:

    ```html
    <script type="module">
      // チャートクラスをインポート
      import { RadarChartSVG } from "https://code4fukui.github.io/svg-chart/RadarChartSVG.js";

      // データとオプションを指定して新しいチャートインスタンスを作成
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

      // チャート要素をコンテナに追加
      document.getElementById("my-chart").appendChild(chart);
    </script>
    ```

あるいは、手動でSVG文字列を取得し、`innerHTML`として設定することも可能です:
`document.getElementById("my-chart").innerHTML = chart.draw();`

## チャートタイプとAPI

### RadarChartSVG

複数の定量変数を比較するための円形チャート（レーダーチャート）。

-   **カスタム要素**: `<rader-chart-svg>`
-   **主なオプション**: `width`, `height`, `levels`, `maxValue`, `data`, `dataPrev`（比較表示用）, `fillColor`, `strokeColor`。
-   **データ形式**: `[{ label: string, value: number }]`

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
  dataPrev: [ // 比較用の過去データセット（任意）
    { label: "Energy", value: 2 },
    { label: "Calmness", value: 2.5 },
    { label: "Focus", value: 3.1 },
  ],
});
```

### BarChartSVG

標準的な横棒グラフ。

-   **カスタム要素**: `<bar-chart-svg>`
-   **主なオプション**: `width`, `barHeight`, `barGap`, `data`, `colors`, `maxValue`, `marginLeft`。
-   **データ形式**: `[{ label: string, value: number }]`

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

各棒がセグメント化され、内訳の割合を示す横向きの積み上げ棒グラフ。

-   **カスタム要素**: `<stacked-bar-chart-svg>`
-   **主なオプション**: `width`, `barHeight`, `barGap`, `data`, `categories`, `colors`, `maxValue`。
-   **データ形式**: `[{ label: string, values: [number, ...] }]`

```javascript
import { StackedBarChartSVG } from "https://code4fukui.github.io/svg-chart/StackedBarChartSVG.js";
const chart = new StackedBarChartSVG({
  width: 600,
  categories: ["Category 1", "Category 2", "Category 3"],
  colors: ["#
