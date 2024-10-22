## 實驗說明    
總共使用了以下三種方式來取得所有 Common Visual Features 的基準值。

### Common Visual Features: 
- Brightness
- Contrast
- Saturation
- Tint
- Shadow
- Color
- Blur
- Angle
- Composition

### 1. **[Blur](./Blur)**  
使用 OpenCv 的 Fast Fourier Transform 來進行模糊檢測，進而取得 Blur 的基準值。
    
**資料夾結構：**
    
  - **[FormalPics](./Blur/FormalPics)**  
    存放70張實驗會使用到的照片。

  - **[FindThreshold.py](./Blur/FindThreshold.py)**  
    使用 [PhotoSets](./PhotoSets) 中的635張照片來得到 Blur 的 Threshold。

  - **[addTojson.py](./Blur/addTojson.py)**  
    從 [FindThreshold.py](./Blur/FindThreshold.py) 中得到的 Threshold 當作 Blur的基準，對實驗中使用到的70張照片進行模糊檢測，並將每張照片得到的 Blur value 寫進 [predictions.json](./Blur/predictions.json)。

  - **[predictions.json](./Blur/predictions.json)**  
      存放 70 張實驗照片的 Visual Features 編輯值。

  [文獻參考] _Kundur, D., & Hatzinakos, D. (1996). Blind image deconvolution. IEEE signal processing magazine, 13(3), 43-64._
    
### 2. **[Existing Machine Learning Model](./Existing_Machine_Learning_Model)** 
用來取得 Brightness, Contrast, Saturation, Tint, Shadow, Color 的基準值。

**資料夾結構：**
- **[Existing_machine-learning model_DEMO.docx](./Existing_Machine_Learning_Model/Existing_machine-learning％20model_DEMO.docx)**  
我們所使用的機器學習模型的網頁 Demo。
  
- **[Image-filter-remover-main](./Existing_Machine_Learning_Model/Image-filter-remover-main)**    
此機器學習模型作者提供的 Source Code。
      
- **[PhotoSet.json](./Existing_Machine_Learning_Model/PhotoSet.json)**  
將 [PhotoSets](./PhotoSets) 中的635張照片丟進模型中得到的 Visual Features (brightness, contrast, saturation, tint, shadow, extra red, extra green, and extra blue) 編輯值存入此 `json`。    

[註]因為我們從 Focus Group 得到的 Common Visual Features 沒有 extra red, extra green, and extra blue，所以我們將這三者合併成 **"color"**，來符合 Focus Group 得到的 Common Visual Features，這個合併是根據RGB模型將紅、藍、綠三個主要顏色構成一個基本的色彩空間。    

[論文參考]Ibraheem, N. A., Hasan, M. M., Khan, R. Z., & Mishra, P. K. (2012). Understanding color models: a review. ARPN Journal of science and technology, 2(3), 265-275.


- **[PhotoSetJsontoCSV.py](./Existing_Machine_Learning_Model/PhotoSetJsontoCSV.py)**  
將 [PhotoSet.json](./Existing_Machine_Learning_Model/PhotoSet.json) 轉換成 [PhotoSet.csv](./Existing_Machine_Learning_Model/PhotoSet.csv)，方便分析每個 Visual Features 的基準值。
      
[模型參考] _https://wandb.ai/coding398/Image%20Classifier/reports/Machine-Learning-Hackathon-Detecting-Filters-in-Images--VmlldzozNTM1OTQ3_

### 3. **[角度、構圖評分](./角度、構圖評分)**  
請第二階段 Focus Group 受試者評估70張照片的角度和構圖誤導性，並計算其平均值和標準差。

### 4. **[PhotoSets](./PhotoSets)**  
使用網路爬蟲得到的635張照片，用來取得各項 Visual Features 的基準值。    
- 資料來源：Google Maps(正常照片), IG(誤導性照片), UberEats(誤導性照片)。
- 雖然在 Lab Study只有70張照片被使用，但是使用這麼大的照片張片讓我們可以為每個 Visual Features 建立更全面的基準。這些照片的來源和我們的研究方向一致，確保了得出來的基準值比隨機從網路上抓取的資料更具代表性。
