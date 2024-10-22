## 實驗說明    
總共使用了以下三種方式來取得所有 Common Visual Features 的基準值。    
[註] 這些基準值都是使用 [PhotoSets](./PhotoSets) 中的635張照片得來的。


以下是各個 **Common Visual Features** 及其 **Benchmarks**:

| **Visual Feature**        | **Benchmark** |
|---------------------------|---------------|
| **Brightness**             | < -3.91       |
| **Contrast**               | < -1.35       |
| **Saturation**             | > 10.54       |
| **Tint**                   | > 4.95        |
| **Shadow**                 | > 4.45        |
| **Extra Red (Color)**      | > 22.03       |
| **Extra Green (Color)**    | > 24.55       |
| **Extra Blue (Color)**     | > 13.64       |
| **Blur**                   | < 180.16      |
| **Angle**                  | < 3.12        |
| **Composition**            | < 3.13        |


### 1. **[Blur](./Blur)**  
使用 OpenCv 的 Fast Fourier Transform 來進行模糊檢測，進而取得 Blur 的基準值。
    
**資料夾結構：**
    
  - **[FormalPics](./Blur/FormalPics)**  
    存放70張實驗會使用到的照片，照片檔名對照的Conditions名稱請參考 [照片檔名對照Conditions名稱表格](../LabStudy_Website/assets)。

  - **[FindThreshold.py](./Blur/FindThreshold.py)**  
    使用 [PhotoSets](./PhotoSets) 中的635張照片來得到 Blur 的 Threshold。

  - **[addTojson.py](./Blur/addTojson.py)**  
    從 [FindThreshold.py](./Blur/FindThreshold.py) 中得到的 Threshold 當作 Blur 的基準值，對實驗中使用到的70張照片進行模糊檢測，並將每張照片得到的 Blur value 寫進 [predictions.json](./Blur/predictions.json)。

  - **[predictions.json](./Blur/predictions.json)**  
      存放 70 張實驗照片的各項 Visual Features 編輯值。

  [文獻參考] _Kundur, D., & Hatzinakos, D. (1996). Blind image deconvolution. IEEE signal processing magazine, 13(3), 43-64._
    
### 2. **[Existing Machine Learning Model](./Existing_Machine_Learning_Model)** 
用來取得 Brightness, Contrast, Saturation, Tint, Shadow, Extra Red(Color), Extra Green(Color), Extra Blue(Color) 的基準值。  

[註] 因為我們從 Focus Group 得到的 Common Visual Features 沒有 extra red, extra green, and extra blue，所以我們將這三者合併成 **"color"**，來符合 Focus Group 得到的 Common Visual Features，這個合併是根據RGB模型將紅、藍、綠三個主要顏色構成一個基本的色彩空間。    

[論文參考]Ibraheem, N. A., Hasan, M. M., Khan, R. Z., & Mishra, P. K. (2012). Understanding color models: a review. ARPN Journal of science and technology, 2(3), 265-275.

**資料夾結構：**

- **[Image-filter-remover-main](./Existing_Machine_Learning_Model/Image-filter-remover-main)**    
此機器學習模型作者提供的 Source Code。

- **[使用此機器學習模型批次處理圖片方式](./Existing_Machine_Learning_Model/批次處理圖片方式.docx.pdf)**
原本作者提供的網頁模型一次只能讀取一張照片，所以我們修改了一些程式碼架構，讓這個網頁可以批次處利多張照片，請參照此 `pdf`。
      
- **[PhotoSet.json](./Existing_Machine_Learning_Model/PhotoSet.json)**  
將 [PhotoSets](./PhotoSets) 中的635張照片丟進模型中得到的 Visual Features (brightness, contrast, saturation, tint, shadow, extra red, extra green, and extra blue) 編輯值存入此 `json`。    

- **[PhotoSetJsontoCSV.py](./Existing_Machine_Learning_Model/PhotoSetJsontoCSV.py)**  
將 [PhotoSet.json](./Existing_Machine_Learning_Model/PhotoSet.json) 轉換成 [PhotoSet.csv](./Existing_Machine_Learning_Model/PhotoSet.csv)，方便分析每個 Visual Features 的基準值。

- **[PhotoSet.csv](./Existing_Machine_Learning_Model/PhotoSet.csv)**  
此 `csv` 中第一行是從此機器學習模型中得到的各項 **Visual Features**，第二行 **(Ave.)** 是使用 Excel 內建的 `=Average()` function，從這 635 張照片算出平均，也就是基準值。
      
[模型參考] _https://wandb.ai/coding398/Image%20Classifier/reports/Machine-Learning-Hackathon-Detecting-Filters-in-Images--VmlldzozNTM1OTQ3_

### 3. **[角度、構圖評分](./角度、構圖評分)**  
請第二階段 Focus Group 受試者評估70張照片的角度和構圖誤導性，並計算其平均值和標準差。

### 4. **[PhotoSets](./PhotoSets)**  
使用網路爬蟲得到的635張照片，專門用來取得各項 Visual Features 的基準值，這些照片都不會出現在 Lab Study中。   
- 資料來源：Google Maps(正常照片), IG(誤導性照片), UberEats(誤導性照片)。
- 雖然在 Lab Study只有70張照片被使用，但是使用這麼大的照片張片讓我們可以為每個 Visual Features 建立更全面的基準。這些照片的來源和我們的研究方向一致，確保了得出來的基準值比隨機從網路上抓取的資料更具代表性。
