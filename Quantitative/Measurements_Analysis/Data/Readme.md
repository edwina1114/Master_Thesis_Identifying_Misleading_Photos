## 檔案說明

- **[Accuracy.csv](./Accuracy.csv)**  
  記錄每張照片的正確答案。

- **[Cohen_Total.csv](./Cohen_Total.csv)**  
  兩位 Coders 對所有 Themes 進行 0,1 編碼的結果，用來取得 Lab study 的質化分析結果（Cohen's kappa 計算）。

- **[Demorgraphic.csv](./Demorgraphic.csv)**  
  記錄所有受試者的各項回應（年齡及其他 Criteria），用於分析年齡及 Criteria 的平均值（Mean）和標準差（Standard Deviation）。

- **[NASA.csv](./NASA.csv)**  
  記錄受試者在每個 Conditions 的 Raw-TLX 回應，用來分析 Cognitive Load 的 Mean、Standard Deviation，以及進行 1-way ANOVA 分析。

- **[Ranking1.csv](./Ranking1.csv)**  
  記錄受試者對三種 Label Types 的排序，用來分析不同 Label Types 的偏好。

- **[Ranking2.csv](./Ranking2.csv)**  
  記錄受試者對兩種 Placements 的排序，用來分析 Placements 的偏好。

- **[Ranking3.csv](./Ranking3.csv)**  
  記錄受試者對七種 Conditions 的排序，用來分析不同 Conditions 的偏好。

- **[Response_ReactionTime.csv](./Response_ReactionTime.csv)**  
  記錄受試者在每個試次（trials）的反應（Response）和反應時間（Reaction Time）。這個檔案用來分析 Reaction Time 和 Accuracy 的 Mean、Standard Deviation，並進行 2-way ANOVA 和 1-way ANOVA。

  欄位包括：
  
  | ParticipantId | PictureName | Status  | Condition | Placement | LabelType | ReactionTime | Response |
  |---------------|-------------|---------|-----------|-----------|-----------|--------------|----------|

- **[SDQ.csv](./SDQ.csv)**  
  記錄受試者對 Custom Questionnaire of Participants' Perceptions of the Effectiveness of Label Types,
  Placements, and Conditions 的回應，用來分析 Label Types, Placements, and Conditions
  的 Mean、Standard Deviation，以及進行 1-way ANOVA。

- **[SE.csv](./SE.csv)**  
  記錄受試者在每個 Conditions 中的 Self-Efficacy 回應，用來分析 Self-Efficacy 的 Mean、Standard Deviation，
  以及進行 1-way ANOVA。
