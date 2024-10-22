## 資料夾結構

1. **[Data](./Data)**  
   儲存所有受試者資料。

      - **[(Formal)Participants_Records](./Data/%28Formal%29Participants_Records)**   
      儲存 Lab Study 中所有受試者的資料。

      - **[(Pilot)Participants_Records](./Data/%28Pilot%29Participants_Records)**   
      儲存 Pilot Study 中所有受試者的資料。

      - **[JsonToCSV.py](./Data/JsonToCSV.py)**   
      將所有受試者的 `json` 資料轉換成 `csv`，並將這28個 `csv` 合併成一個 Dataframe ([Formal.csv](./Data/%28Formal%29Participants_Records/Formal.csv))。

      - **[Extract_Measurements_Data.py](./Data/Extract_Measurements_Data.py)**   
      將 [JsonToCSV.py](./Data/JsonToCSV.py) 得來的 Dataframe ([Formal.csv](./Data/%28Formal%29Participants_Records/Formal.csv)) 依照不同 Measurements 切成多個 `cvs` 的程式碼。

      - **[MeasurementsRawData](./Data/MeasurementsRawData)**   
        所有分析使用的 `csv` 都存放在此資料夾。
        
        [註] 如果只是需要分析現有的數據，用此資料夾的檔案即可。

   
2. **[Rmd_files](./Rmd_files)**  
   - 分析所有 Measurements (Reaction Time, Accuracy, Raw-TLX, Self-Efficacy, Custom Questionnaire,
Rankings, Participants Demographic) 的 R 程式碼。   
   - 使用的分析方法有：1-way ANOVA, 2-way ANOVA, Descriptive Statics of Ranking (mean rank)。
