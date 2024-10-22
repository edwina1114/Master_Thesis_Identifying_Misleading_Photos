## 檔案說明

### 1. **[Demorgraphic.Rmd](./Demorgraphic.Rmd)**  
  分析男女比例、年齡、各項 Criteria 的 Mean 和 Standard Deviation。
  
### 2. **[ReactionTime.Rmd](./ReactionTime.Rmd)**  
記錄受試者在每個 trial 的回答（Response）和反應時間（Reaction Time）。用來分析 Reaction Time 的 Mean、Standard Deviation，並進行 2-way ANOVA 和 1-way ANOVA。

### 3. **[Accuracy.Rmd](./Accuracy.Rmd)**  
  - **計算正確率**: 分別計算所有受試者每一個 trials 的答案是否正確。
  - **分兩種計算方式進行**：
     (每個 Trial 使用 5-point Likert scale，1表示正常照片，5表示具誤導性照片)
      - **Strict**：受試者的回答需要與正確答案完全一致，也就是只接受1或5的回答，正確答案請參照[Accuracy.csv](../Data/Accuracy.csv)。
      - **Tolerant**：接受1,2或4,5的回答，正確答案請參照 [Accuracy.csv](../Data/Accuracy.csv)。
  - **統計分析**：進行Accuracy 的 1-way ANOVA, 2-way ANOVA 分析。

### 4. **[Raw-TLX.Rmd](./Raw-TLX.Rmd)**  
  記錄受試者在每個 Conditions 的 Raw-TLX 回應，用來分析 Cognitive Load 的 Mean、Standard Deviation，以及進行 1-way ANOVA 分析。

### 5. **[Self_Efficacy.Rmd](./Self_Efficacy.Rmd)**  
  記錄受試者在每個 Conditions 中的 Self-Efficacy 回應，用來分析 Self-Efficacy 的 Mean、Standard Deviation，
  以及進行 1-way ANOVA。


### 6. **[SDQA.Rmd](./SDQ.Rmd)**  
  記錄受試者對 Custom Questionnaire of Participants' Perceptions of the Effectiveness of Label Types,
  Placements, and Conditions 的回應，用來分析 Label Types, Placements, and Conditions
  的 Mean、Standard Deviation，以及進行 1-way ANOVA。

### 7. **[Ranking.Rmd](./Ranking.Rmd)**  
  記錄受試者對 Label Types, Placements, Conditions 的排序，用來分析受試者的偏好。
