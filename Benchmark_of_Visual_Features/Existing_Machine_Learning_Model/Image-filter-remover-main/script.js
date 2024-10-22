(async () => {
  //使用 TensorFlow.js 的 loadLayersModel 方法，從指定的 URL 加載神經網路模型。
  const model = await tf.loadLayersModel('http://localhost:9000/Filter/model.json');
  const processedImages = []; // Array to store processed images
  const allPredictionObjects = [];
  document.getElementById('downloadAllButton').style.display = 'none';
  document.getElementById(`loading`).hidden = true;
  document.getElementById(`upload`).hidden = false;
  var num = 0;

  //當 input 檔案選擇框的內容發生變化時，觸發此事件處理程序。程式碼會檢查所選擇的檔案數，然後對每個檔案進行處理。
  document.getElementById('input').addEventListener('change', async function(evt) {
    let tgt = evt.target || window.event.srcElement,
      files = tgt.files;

    console.log(files);

    // Check if any files are selected
    if (files.length === 0) return;
    document.getElementById(`loadingText`).innerText = `Getting images`;
    num = files.length;
    // Process each selected file
    for (let i = 0; i < files.length; i++) {
      document.getElementById(`loadingText`).innerText = `Getting image ${i + 1}/${files.length}`;

      // Use FileReader to read the current file
      let fr = new FileReader();
      fr.onload = async function() {
        // Process the image
        await processImage(fr.result, model,files[i],i);
      };
      fr.readAsDataURL(files[i]);
    }
  });

  //這個函數處理從檔案選擇框中選擇的圖像。它將圖像轉換為 TensorFlow.js 張量，然後使用模型進行預測，並將預測應用於圖像。
  async function processImage(imageDataUrl, model,file,index) {
    document.getElementById(`loading`).hidden = false;
    //document.getElementById(`upload`).hidden = true;

    document.getElementById(`loadingText`).innerText = `Turning into Tensor`;

    let Tensor = tf.browser.fromPixels(await loadImage(imageDataUrl), 4);
    Tensor = Tensor.resizeBilinear([64, 64]);

    document.getElementById(`loadingText`).innerText = `Predicting`;


    //這裡，它顯示了模型的預測結果，並將預測應用於 HTML 元素以顯示濾鏡效果的調整。
    let prediction = await model.predict(tf.stack([Tensor])).data();

    console.log(prediction);

    document.getElementById(`loadingText`).innerText = `Reversing`;

    document.getElementById(`filters`).innerHTML = `<h3>Filters detected</h3>
      <p>
        amberBrightness: ${Math.round(prediction[0] * 100)}%<br>
        Contrast: ${Math.round(prediction[1] * 100)}%<br>
        Saturation: ${Math.round(prediction[2])}%<br>
        Tint: ${Math.round(prediction[6] * 100)}%<br>
        Shade: ${Math.round(prediction[7] * 100)}%<br>
        Extra red: ${Math.round(prediction[3])}<br>
        Extra green: ${Math.round(prediction[4])}<br>
        Extra blue: ${Math.round(prediction[5])}<br>
      </p>`;

    const predictionObject = {
      PictureName: file.name,
      Brightness: prediction[0] * 100,
      Contrast: prediction[1] * 100,
      Saturation: prediction[2],
      Tint: prediction[6] * 100,
      Shade: prediction[7] * 100,
      ExtraRed: prediction[3],
      ExtraGreen: prediction[4],
      ExtraBlue: prediction[5]
    };
    allPredictionObjects.push(predictionObject);

    await applyImageProcessing(imageDataUrl, prediction,file,index);
  }

  //這個函數使用 Promise 包裝了圖像的載入過程，以確保在圖像完全加載後繼續進行處理。
  async function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  //這個函數使用 Jimp 來應用預測結果到圖像，然後將處理後的圖像顯示在 HTML 中
  async function applyImageProcessing(imageDataUrl, prediction,file, index) {
    Jimp.read({
      url: imageDataUrl,
    }).then((image) => {
      // if (prediction[0] > 1) prediction[0] = 1;
      // if (prediction[0] < -1) prediction[0] = -1;
      // if (prediction[1] > 1) prediction[1] = 1;
      // if (prediction[1] < -1) prediction[1] = -1;

      // image.brightness(-prediction[0]);
      // image.contrast(-prediction[1]);

      // image.color([
      //   { apply: "saturate", params: [-prediction[2]] },
      //   { apply: "red", params: [-prediction[3]] },
      //   { apply: "green", params: [-prediction[4]] },
      //   { apply: "blue", params: [-prediction[5]] },
      //   { apply: "tint", params: [-prediction[6]] },
      //   { apply: "shade", params: [-prediction[7]] },
      // ]);

      // Save the processed image and resolve the promise
      saveProcessedImage(image, file,index);

      image.getBase64('image/png', (err, res) => {
        if (err) throw err;

        document.getElementById("output").style.backgroundImage = `url(${res})`;

        if (processedImages.length === num) {
          document.getElementById(`loading`).hidden = true;
          document.getElementById(`upload`).hidden = false;
          document.getElementById(`downloadAllButton`).style.display = '';
        }
      });
    });
  }

  // This function saves the processed image and adds it to the processedImages array
  async function saveProcessedImage(image, file,index) {
    return new Promise((resolve) => {
      image.getBase64('image/png', (err, res) => {
        if (err) throw err;
        // Save the processed image
        processedImages[index] = res;
        // Resolve the promise
        resolve();
      });
    });
  }

  document.getElementById('downloadAllButton').addEventListener('click', () => {
    downloadAllProcessedImages();
  });
  
  function downloadAllProcessedImages() {
    // 創建一個 zip 檔案，這樣可以將所有圖片打包到一個檔案中
    const zip = new JSZip();
  
    // 對每個處理過的圖片執行下載操作
    // processedImages.forEach((imageDataUrl, index) => {
    //   const fileName = `processed_image_${index + 1}.png`;
    //   downloadImage(zip, fileName, imageDataUrl);
    // });

    // 將 allPredictionObjects 轉換為 JSON 字串
    const predictionJson = JSON.stringify(allPredictionObjects);

    // 添加 prediction JSON 檔案到 zip 中
    zip.file('predictions.json', predictionJson);
  
    // 將 zip 檔案生成為 Blob
    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        // 使用 FileSaver.js 下載 Blob
        saveAs(blob, 'processed_images.zip');
      });
  }
  
  function downloadImage(zip, fileName, imageDataUrl) {
    // 在 zip 檔案中添加圖片
    zip.file(fileName, imageDataUrl.split('base64,')[1], { base64: true });
  }
})();
