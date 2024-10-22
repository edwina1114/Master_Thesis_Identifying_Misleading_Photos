# 資料夾結構

## 1. 資料夾

- **[assets](./assets)**  
  存放 Lab Study 使用的70張照片。（以Conditions為分類)

## 2. 檔案說明

- **[ExecutedOrder.xlsx](./ExecutedOrder.xlsx)**  
  實驗採用了 Counterbalancing 設計，總共列出了 28 名受試者的Condition出現順序。

- **[PageOrder.xlsx](./PageOrder.xlsx)**  
  用來控制實驗網頁中每一頁需要執行的 Function 片段順序。

- **[predictions.json](./predictions.json)**  
  每張照片的各項 Visual Features 的數值，用來跟各項 Visual Features 基準做比較，進而顯示該標籤。

- **[lab_study.css](./lab_study.css)**  
  網頁的 CSS 設定，控制頁面的樣式與佈局。

- **[lab_study.html](./lab_study.html)**  
  網頁的 HTML 檔案，負責結構和內容的展示。

- **[lab_study.js](./lab_study.js)**  
  JavaScript 檔案，負責網頁的互動行為與功能。
  會執行到以下檔案：
    - [ExecutedOrder.xlsx](./ExecutedOrder.xlsx)
    - [PageOrder.xlsx](./PageOrder.xlsx)
    - [lab_study.css](./lab_study.css)
    - [lab_study.html](./lab_study.html)
    - [predictions.json](./predictions.json)
