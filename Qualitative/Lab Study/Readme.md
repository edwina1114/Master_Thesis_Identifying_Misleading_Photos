## 檔案說明
### 1. **[Thematic Analysis](./Thematic%20Analysis)**  
對 Lab Study 的 Semi-Structured Interview 逐字稿進行 Thematic Analysis。

### 2. **[Cohen_Total.csv](./Cohen_Total.csv)**  
兩位 Coders 對所有 Semi-Structured Interview 的 Codes 進行 0,1 編碼。
將 [2nd Coding.xlsx](./Thematic%20Analysis/2nd%20Coding.xlsx) 中的 0,1 編碼結果變成英文版的，專門用來放到 R 分析 Cohen's kappa。
 
  [註] 此 `csv` 的第一行將所有 Codes 變成英文編碼的形式，請參照 [2nd Coding.xlsx](./Thematic%20Analysis/2nd%20Coding.xlsx) 可以看到每個 Codes 的中文。


### 3. **[Lab_Cohen.Rmd](./Lab_Cohen.Rmd)**  
使用 [Cohen_Total.csv](./Cohen_Total.csv) 來取得在 Semi-Structured Interview 提到的 Codes 的 Cohen's kappa value。

### 4. **[Calculate_N.py](./Calculate_N.py)**  
使用 [Cohen_Total.csv](./Cohen_Total.csv) 來取得在 Semi-Structured Interview 中每個 Codes 提到的人數。


