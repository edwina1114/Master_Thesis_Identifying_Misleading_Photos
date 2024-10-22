# 資料夾結構

## 1. 資料夾

- **[assets](./assets)**  
  存放 Lab Study 使用的70張照片。（以Conditions為分類)
  
  [註] 資料夾內有一個 Readme 提供照片檔名與 Conditions 名稱對照表。

## 2. 檔案說明

- **[ExecutedOrder.xlsx](./ExecutedOrder.xlsx)**  
  實驗採用了 Counterbalancing 設計，總共列出了 28 名受試者的Condition出現順序。

- **[PageOrder.xlsx](./PageOrder.xlsx)**  
  用來控制實驗網頁中每一頁需要執行的 Funcition。

- **[lab_study.css](./lab_study.css)**  
  網頁的 CSS 設定，控制頁面的樣式與佈局。

- **[lab_study.html](./lab_study.html)**  
  網頁的 HTML 檔案，負責結構和內容的展示。

- **[predictions.json](./predictions.json)**  
  Lab Study中70張照片的各項 Visual Features 的數值，用來跟對應的 Visual Features 基準值做比較，進而顯示該標籤。
  
  [註] 這些對應的 Visual Features 基準值 請參考 [Visual Features 基準值生成](../Benchmark_of_Visual_Features)。

- **[lab_study.js](./lab_study.js)**  
  JavaScript 檔案，負責網頁的互動行為與功能。
  
  分別會讀取以下檔案:
  - [lab_study.html](./lab_study.html)
  - [lab_study.css](./lab_study.css)
  - [ExecutedOrder.xlsx](./ExecutedOrder.xlsx)
  - [PageOrder.xlsx](./PageOrder.xlsx)
  - [predictions.json](./predictions.json)
  - [assets](./assets) 



