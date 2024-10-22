/* Page Order 相關 */
let currentPage = 1;
let pageOrderJSON;
let isPageOrderJSONLoaded = false;

let CountD = 0;
let CountPC = 0;

/* 計時相關 */
let pageEntrytime;
let pageExitTime;
let timeSpentInSeconds;

/* scale選項相關 */
let radioValueToSelect; // Formal Page

/* 紀錄第幾位受試者的回答 */
let ParticipantId;
let jsonData = '';

/* Write to JSON */
const existingDataKey = `Data${ParticipantId}`;
const existingData = localStorage.getItem(existingDataKey);
const history = existingData ? JSON.parse(existingData) : [];

let predictionsJSON;    // 機器學習model判斷圖片有修改的數值，讀資料夾下predictions.json的資料
let itemOrder = [];    // 當前類別的圖片顯示次序，1到10之間

const imageFolders = [];    // 從excutedOrder.xlsx讀，這個當前受測者的7種組合存成陣列，ex：[PTF PE PM DTF DE DM C]
const imagePaths = [];    // 將imageFolders的內的元素改成完整的圖片路徑，ex：./assets/PTF/{0}.jpg
const translation = {
    "Brightness": "亮度",
    "Contrast": "對比度",
    "Saturation": "飽和度",
    "Tint": "色調",
    "Shade": "陰影",
    "ExtraRed": "顏色",
    "ExtraGreen": "顏色",
    "ExtraBlue": "顏色",
    "Blur": "模糊",
    "Angle": "角度",
    "Composition": "構圖"
};


$(function () {
    localStorage.clear();
    readJSON(); // 讀predictions.json 資料
    readExcel();    // 讀executedOrder.xlsx 資料
    readPageOrderxlsx();

    /* Control JSON file name */
    if (ParticipantId === null) {
        ParticipantId = 1; // Start with 1 if not set
    } else {
        ParticipantId = parseInt(ParticipantId); // Parse as an integer
    }
    console.log(`Subject${ParticipantId}`);

});


/* 讀executedOrder.xlsx 資料 */
function readExcel() {
    let order;
    fetch('ExecutedOrder.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            // 使用 SheetJS（例如 xlsx）庫來解析 Excel 資料
            var workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            var sheetName = workbook.SheetNames[0]; // 假設檔案中只有一個工作表
            var sheet = workbook.Sheets[sheetName];
            var executedOrderjsonData = XLSX.utils.sheet_to_json(sheet); // 將工作表轉換為 JSON 資料

            // 取得executedOrder.xlst內，依序讀下來，第一個欄位isExecuted=0的排列組合的序號，作為當前受測者要執行的condtion順序
            order = executedOrderjsonData.findIndex(item => item.isExecuted === 0);
            console.log("Order: ", order);

            // Access the participant value for the current order
            ParticipantId = executedOrderjsonData[order].Participant;
            console.log("ParticipantId:", ParticipantId);

            // 將該組合放入imagePaths 陣列中
            for (const key in executedOrderjsonData[order]) {
                // 排除Participant、isExecuted這兩個欄位，只放7個condition
                if (executedOrderjsonData[order].hasOwnProperty(key) && key !== 'isExecuted' && key !== 'Participant') {
                    const imagePath = `./assets/${executedOrderjsonData[order][key]}/{0}`;
                    imagePaths.push(imagePath);
                    imageFolders.push(executedOrderjsonData[order][key]);
                }
            }
            console.log("imageFolders", imageFolders);
            console.log("imagePaths", imagePaths);
            console.log("executedOrderjsonData", executedOrderjsonData);
        })
        .catch(error => console.error('發生錯誤：', error));
}


/* 讀predictions.json 資料 */
function readJSON() {
    fetch('predictions.json') // 取出存放圖片去濾鏡後的JSON檔
        .then(response => response.json())
        .then(data => {
            console.log("predictions.json", data);
            predictionsJSON = data;
        })
        .catch(error => console.error('讀json發生錯誤:', error));
}


function Transaction() {
    $(".page").hide();

    if (pageOrderJSON || Array.isArray(pageOrderJSON) || pageOrderJSON.length > 0) {
        const currentPageData = pageOrderJSON.find(page => page.CurrentPage === currentPage);
        console.log("Page", currentPageData);
        // Find the corresponding page function from JSON based on 'currentpage'
        if (currentPageData) {
            // Execute the function associated with the current page
            const functionName = currentPageData.Page;
            eval(functionName); // Use eval to execute the function string retrieved from JSON
        }
    }
}


/* 讀取PageOrder.xlsx來控制哪一頁要展示 */
function readPageOrderxlsx() {
    if (!isPageOrderJSONLoaded) {
        fetch('PageOrder.xlsx')
            // fetch('PageOrder.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                // 使用 SheetJS（例如 xlsx）庫來解析 Excel 資料
                var workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                var sheetName = workbook.SheetNames[0]; // 假設檔案中只有一個工作表
                var sheet = workbook.Sheets[sheetName];
                pageOrderJSON = XLSX.utils.sheet_to_json(sheet); // 將工作表轉換為 JSON 資料

                const formalPageData = { CurrentPage: 0, Page: 'FormalPage()', __rowNum__: 0 }; // 你可以根据实际需求修改页面数据
                for (let i = 0; i < imageFolders.length; i++) {
                    if (imageFolders[i][0] === 'D') {
                        for (let j = 0; j < 10; j++) {
                            var index = pageOrderJSON.findIndex(item => item.CurrentPage === 15 + (i * 15));
                            var newIndex = index + j;
                            var newCurrentPage = 0;
                            pageOrderJSON.splice(newIndex, 0, { ...formalPageData, CurrentPage: newCurrentPage });
                        }
                    }
                }

                let countPage = 1;
                for (let i = 0; i < pageOrderJSON.length; i++) {
                    pageOrderJSON[i].CurrentPage = countPage;
                    countPage++;
                }
                Transaction();
                isPageOrderJSONLoaded = true;
            })
            .catch(error => console.error('Error reading JSON:', error));
    }
    else {
        Transaction();  // Once the JSON data is loaded, call JsonTransaction
    }
}


/* 生成同個condition內，隨機生成的次序 */
function randomImageOrder(size) {
    // 生成 1 到 size 的數字陣列
    var numbersArray = [];
    for (var i = 1; i <= size; i++) {
        numbersArray.push(i);
    }

    // 使用 Fisher-Yates 洗牌算法重新排序陣列
    for (var i = numbersArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)); // 隨機選擇一個索引
        var temp = numbersArray[i]; // 交換元素
        numbersArray[i] = numbersArray[j];
        numbersArray[j] = temp;
    }

    return numbersArray; // 返回洗牌後的數字陣列
}


/* 顯示圖片與相關資料規則 */
function changeImage() {
    // 將 Likert-scale 取消點選
    $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', false);
    // 將畫面上的tag清空
    document.getElementById('showImageIDTag').textContent = "";
    // 取得圖片路徑
    const imageElement = document.getElementById('showImageID');
    let filteredData;   // 從json檔裡，透過比對類別跟序號，找出完整的檔名
    let propertiesSatisfied = {};
    let uniqueProperties = {};  // 需要顯示的tags
    let currentCondition = imageFolders[CountD + CountPC];   // 取得當前類別    

    /*
    label 顯示規則：
    Brightness < -3.908130076
    Contrast < -1.353178609
    Saturation > 10.54550711
    Tint > 4.948730154
    Shade > 4.454866872
    ExtraRed > 22.03271451
    ExtraGreen > 24.54739286
    ExtraBlue > 13.63719686
    Blur < 180.16476979238846
    Angle < 3.11622276
    Composition < 3.126190476
    */

    /* 練習題 */
    if (currentPage < 14) {
        if (currentPage === 4) {
            imageElement.src = imageElement.alt = `./assets/test_1.jpg`;
            document.getElementById('showImageIDTag').textContent = "#具誤導性照片";
        }
        else if (currentPage === 6) {
            imageElement.src = imageElement.alt = `./assets/test_2.jpg`;
            document.getElementById('showImageIDTag').textContent = "#對比度 #色調 #陰影";
        }
        else if (currentPage === 8) {
            imageElement.src = imageElement.alt = `./assets/test_3.jpg`;
            document.getElementById('showImageIDTag').textContent = "#具誤導性照片 #對比度 #色調 #陰影";
        }
        else if (currentPage === 10) {
            imageElement.src = imageElement.alt = `./assets/test_4.jpg`;
            document.getElementById('showImageIDTag').textContent = "";
        }
        else if (currentPage === 12) {
            imageElement.src = imageElement.alt = `./assets/test_5.jpg`;
            document.getElementById('showImageIDTag').textContent = "";
        }
        else if (currentPage === 13) {
            filteredData = predictionsJSON.find(item => item.PictureName === `test_6.jpg`);
            imageElement.src = imageElement.alt = `./assets/test_6.jpg`;
            document.getElementById('showImageIDTag').textContent = "#具誤導性照片";
        }
    }

    /* 正式 Condition */
    else {
        /* 當換到新的condition，做亂數處理
           如果當前頁數是一個condition的開始，需要重新抽順序 
           ex. [9,18],[19,28],[29,38],[39,48],[49,58],[59,68],[69,78]
        */

        if ((currentPage - 15 - (CountD * 25) - (CountPC * 15)) === 0) {
            // [9]是代表imagePaths中的第十個字母 ex. ./assets/P 此處的[9] = 'P' 
            itemOrder = randomImageOrder(10);
            if (imagePaths[CountD + CountPC][9] === 'D') {
                itemOrder = itemOrder.concat(itemOrder);
            }

            console.log("新Condition");
            console.log(imageFolders[CountD + CountPC], itemOrder);
        }
        index = currentPage - 15 - (CountD * 25) - (CountPC * 15);
        /* 從predictions.json檔裡，透過圖片檔名(檔名規則為：{condtion}_{order}，ex：PTF_0)，找出圖片被model判定有修改的數值 */
        filteredData = predictionsJSON.filter(item => item.PictureName.includes(imageFolders[CountD + CountPC] + '_' + itemOrder[index] + '.'))[0];
        imageElement.src = imageElement.alt = imagePaths[CountD + CountPC].replace('{0}', filteredData.PictureName);
        console.log("照片檔名: ", imageElement.src);
        console.log(imageFolders[CountD + CountPC], itemOrder[index]);


        /* 篩選Tags: 如果是 "Debunk" 且小於 10，則不需進入 */
        if (filteredData && (!currentCondition.includes("D") || index >= 10)) {
            if (currentCondition.includes("E") || currentCondition.includes("M")) {
                if (filteredData['Brightness'] < -3.908130076) propertiesSatisfied[translation['Brightness'] || 'Brightness'] = filteredData['Brightness'];
                if (filteredData['Contrast'] < -1.353178609) propertiesSatisfied[translation['Contrast'] || 'Contrast'] = filteredData['Contrast'];
                if (filteredData['Saturation'] > 10.54550711) propertiesSatisfied[translation['Saturation'] || 'Saturation'] = filteredData['Saturation'];
                if (filteredData['Tint'] > 4.948730154) propertiesSatisfied[translation['Tint'] || 'Tint'] = filteredData['Tint'];
                if (filteredData['Shade'] > 4.454866872) propertiesSatisfied[translation['Shade'] || 'Shade'] = filteredData['Shade'];
                if (filteredData['ExtraRed'] > 22.03271451) propertiesSatisfied[translation['ExtraRed'] || 'ExtraRed'] = filteredData['ExtraRed'];
                if (filteredData['ExtraGreen'] > 24.54739286) propertiesSatisfied[translation['ExtraGreen'] || 'ExtraGreen'] = filteredData['ExtraGreen'];
                if (filteredData['ExtraBlue'] > 13.63719686) propertiesSatisfied[translation['ExtraBlue'] || 'ExtraBlue'] = filteredData['ExtraBlue'];
                if (filteredData['Blur'] < 180.16476979238846) propertiesSatisfied[translation['Blur'] || 'Blur'] = filteredData['Blur'];
                if (filteredData['Angle'] < 3.11622276) propertiesSatisfied[translation['Angle'] || 'Angle'] = filteredData['Angle'];
                if (filteredData['Composition'] < 3.126190476) propertiesSatisfied[translation['Composition'] || 'Composition'] = filteredData['Composition'];
            }
            /* currentCondition 的名字內有 "TF" 或 "M"，要加入關於照片是否真實的tag */
            if (currentCondition.includes("TF") || currentCondition.includes("M")) {
                // 根据 Unaltered 的值添加对应的标签
                if (filteredData.Unaltered === true) {
                    uniqueProperties['正常照片'] = 'true';
                } else if (filteredData.Unaltered === false) {
                    uniqueProperties['具誤導性照片'] = 'false';
                }
            }
        }

        // 檢查重複的鍵並進行移除 (主要是把ExtraRed/Green/Blue相同的移除)
        Object.keys(propertiesSatisfied).forEach((key) => {
            if (!uniqueProperties[key]) {
                uniqueProperties[key] = propertiesSatisfied[key];
            }
        });

        // console.log('uniqueProperties: ', uniqueProperties);
        const propertyNames = Object.keys(uniqueProperties).join(' # ');
        document.getElementById('showImageIDTag').textContent = (propertyNames.length > 0) ? '#' + propertyNames : '';
    }
}


function writeToJSON(dataKey, data) {
    // Push the new data to the array
    history.push(data);

    // Stringify the updated array and store it in localStorage
    jsonData = JSON.stringify(history);
    localStorage.setItem(dataKey, jsonData);
    console.log(jsonData);
}


/* Download JSON file */
function saveJSONToFile(jsonData, ParticipantId) {
    const blob = new Blob([jsonData], { type: 'application/json' });    // Create a Blob with the JSON data
    const url = window.URL.createObjectURL(blob);   // Create a temporary URL for the Blob

    /* Create a link element to trigger the download */
    const a = document.createElement('a');
    a.href = url;
    a.download = `User${ParticipantId}.json`; // Set the file name with the current file number
    a.click();

    ParticipantId++;
    localStorage.setItem('ParticipantId', ParticipantId); // Store the updated file number in localStorage
    window.URL.revokeObjectURL(url);    // Clean up by revoking the temporary URL
}


function HomePage() {
    $("#HomePage").show();

    $("#btn-Home").on("click", function () {
        currentPage++;  // Update currentPage
        readPageOrderxlsx();
    });
}


function PracticeIntroPage() {
    $(`#PracticeIntroPage`).show();

    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function ConditionIntroPage() {
    $(`#ConditionIntroPage`).show();

    if (currentPage === 3) {
        document.getElementById('CP_h3').textContent = "情境一練習";
        document.getElementById('CP_content').textContent = "此實驗情境即 「照片與標籤同時出現」，且標籤可能為 #正常照片 或是 #具誤導性照片。 ";
    }
    else if (currentPage === 5) {
        document.getElementById('CP_h3').textContent = " 情境二練習 ";
        document.getElementById('CP_content').textContent = "此實驗情境即 「照片與標籤同時出現」，且標籤可能為 #亮度 #對比度 #飽和度... 等等的照片參數。 ";
    }
    else if (currentPage === 7) {
        document.getElementById('CP_h3').textContent = " 情境三練習 ";
        document.getElementById('CP_content').textContent = "此實驗情境即 「照片與標籤同時出現」，且標籤可能為 #正常照片 或是 #具誤導性照片 配上 #亮度 #對比度 #飽和度... 等等的照片參數。 ";
    }
    else if (currentPage === 9) {
        document.getElementById('CP_h3').textContent = " 情境四練習 ";
        document.getElementById('CP_content').textContent = "此實驗情境即 「只有照片出現，沒有標籤」。 ";
    }
    else if (currentPage === 11) {
        document.getElementById('CP_h3').textContent = " 情境五練習 ";
        document.getElementById('CP_content').textContent = "此實驗情境會出現兩次一樣的照片，但是第一次「只出現照片」，第二次「照片與標籤同時出現」，且標籤可能為 #正常照片 或是 #具誤導性照片。 ";
    }

    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function FormalIntroPage() {
    $(`#FormalIntroPage`).show();

    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function FormalDataAppend() {
    function determineGroup(pictureName) {
        if (pictureName.includes("C_")) {
            return "Control";
        } else if (pictureName.includes("DE_")) {
            return "PEIm";
        } else if (pictureName.includes("DM_")) {
            return "PEM";
        } else if (pictureName.includes("DTF_")) {
            return "PEEx";
        } else if (pictureName.includes("PE_")) {
            return "CCTIm";
        } else if (pictureName.includes("PM_")) {
            return "CCTM";
        } else if (pictureName.includes("PTF_")) {
            return "CCTEx";
        }
    }

    function determineLabelType(group) {
        if (group.includes("Im")) {
            return "Implicit";
        }
        else if (group.includes("M")) {
            return "Mix";
        }
        else if (group.includes("Ex")) {
            return "Explicit";
        }
        else {
            return "Control";
        }
    }

    function determinePlacement(group) {
        if (group.includes("PE")) {
            return "PostExposure";
        }
        else if (group.includes("CCT")) {
            return "Concurrent";
        }
        else {
            return "Control";
        }
    }

    let currentCondition = imageFolders[CountD + CountPC];   // 取得當前類別  
    const PictureName = imageFolders[CountD + CountPC] + '_' + itemOrder[currentPage - 15 - (CountD * 25) - (CountPC * 15)];
    const Group = determineGroup(PictureName);

    const FormalData = {
        ParticipantId: ParticipantId,
        PictureName: PictureName,
        Status: determineGroup(PictureName),
        Condition: Group,
        Placement: determinePlacement(Group),
        LabelType: determineLabelType(Group),
        ReactionTime: timeSpentInSeconds,
        Response: radioValueToSelect,
    };
    const PostFormalData = {
        ParticipantId: ParticipantId,
        PictureName: PictureName,
        Status: determineGroup(PictureName) + "_PostExposure",
        Condition: Group,
        Placement: determinePlacement(Group),
        LabelType: determineLabelType(Group),
        Response: radioValueToSelect,
        ReactionTime: timeSpentInSeconds,
    };

    // Conditionally write to localStorage based on currentCondition
    if (currentCondition && (!currentCondition.includes("D") || (currentPage - 15 - (CountD * 25) - (CountPC * 15) < 10))) {
        writeToJSON(existingDataKey + "_Formal", FormalData);
    }
    else if (currentCondition && (currentCondition.includes("D") && (currentPage - 15 - (CountD * 25) - (CountPC * 15) >= 10))) {
        writeToJSON(existingDataKey + "_Formal_Post", PostFormalData);
    }

    // Fetch the updated dataHistory arrays after the recent appends
    const updatedDataHistoryFormal = JSON.parse(localStorage.getItem(existingDataKey + "_Formal") || "[]");
    const updatedDataHistoryFormalPost = JSON.parse(localStorage.getItem(existingDataKey + "_Formal_Post") || "[]");

    // Write the updated arrays to localStorage
    localStorage.setItem(existingDataKey + "_Formal", JSON.stringify(updatedDataHistoryFormal));
    localStorage.setItem(existingDataKey + "_Formal_Post", JSON.stringify(updatedDataHistoryFormalPost));
}


/* Function to start the countdown */
function FormalCountdown() {
    let FormalTimer = 5;
    let countdownInterval;
    const FormalButton = $('#btn-nextTest');

    FormalButton.prop("disabled", true); // Disable the button initially

    pageEntrytime = new Date().getTime();    // Record the page exit time and calculate time spent

    countdownInterval = setInterval(function () {
        FormalTimer--;
        // Function to enable the button and stop the countdown
        if (FormalTimer < 1) {
            clearInterval(countdownInterval); // Stop the countdown
            FormalButton.prop("disabled", false); // Enable the button
        }
    }, 1000); // Update the countdown every second
}


function FormalPage() {
    $(`#FormalPage`).show();
    changeImage();  //顯示圖片邏輯
    FormalCountdown();

    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 49 || event.which === 97) {
            radioValueToSelect = 1
            $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', true);
        }
        else if (event.which === 50 || event.which === 98) {
            radioValueToSelect = 2
            $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', true);
        }
        else if (event.which === 51 || event.which === 99) {
            radioValueToSelect = 3
            $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', true);
        }
        else if (event.which === 52 || event.which === 100) {
            radioValueToSelect = 4
            $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', true);
        }
        else if (event.which === 53 || event.which === 101) {
            radioValueToSelect = 5
            $(`input[name=inlineRadioOptions][value="${radioValueToSelect}"]`).prop('checked', true);
        }
        else if (event.which === 32) {  // Spacebar = 32
            event.preventDefault(); // Prevent spacebar from scrolling the page when no radio button is checked

            if ($(`#btn-nextTest`).prop("disabled")) {
                alert("倒計時尚未完成，無法提交！\n 按一下「空白鍵」即可關閉此窗格！");
            }
            else if ($(`input[name=inlineRadioOptions]:checked`).length === 0) {
                alert("你尚未選擇答案，按一下「空白鍵」即可關閉此窗格！");
            }
            else {
                /* 練習階段不紀錄 */
                if (currentPage < 14) {
                    currentPage++;
                    readPageOrderxlsx();
                }
                else {
                    /* User time calculate */
                    pageExitTime = new Date().getTime();
                    timeSpentInSeconds = Math.floor((pageExitTime - pageEntrytime) / 1000);
                    FormalDataAppend();

                    currentPage++;
                    readPageOrderxlsx();
                }
            }
        }
    });
}


function NASAIntroPage() {
    imageFolders[CountD + CountPC][0] === 'D' ? CountD++ : CountPC++;

    $(`#NASAIntroPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    $("#btn-NasaIntro").off("click");
    $("#btn-NasaIntro").click(function () {
        currentPage++;
        readPageOrderxlsx();
    });
}


function NASATLX() {
    $(`#NASATLXPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    /* Slider */
    const sliders = [NASAslider1, NASAslider2, NASAslider3, NASAslider4, NASAslider5, NASAslider6];
    const valueElements = [NASAvalue1, NASAvalue2, NASAvalue3, NASAvalue4, NASAvalue5, NASAvalue6];

    // Function to set up a slider
    function setupSlider(slider, valueElement) {
        valueElement.textContent = slider.value;
        slider.addEventListener("input", (event) => {
            valueElement.textContent = event.target.value;
        });
    }

    // Set up sliders using the function and a loop
    sliders.forEach((slider, index) => {
        /* Reset sliders */
        slider.value = 10;
        slider.textContent = slider.value;
        slider.addEventListener("input", (event) => {
            slider.textContent = event.target.value;
        });

        setupSlider(slider, valueElements[index]);
    });

    // Function to determine the Group based on PictureName
    function determineGroup(group) {
        if (group.includes("C")) {
            return "Control";
        } else if (group.includes("DE")) {
            return "PEIm";
        } else if (group.includes("DM")) {
            return "PEM";
        } else if (group.includes("DTF")) {
            return "PEEx";
        } else if (group.includes("PE")) {
            return "CCTIm";
        } else if (group.includes("PM")) {
            return "CCTM";
        } else if (group.includes("PTF")) {
            return "CCTEx";
        }
    }

    function determineLabelType(group) {
        if (group.includes("Im")) {
            return "Implicit";
        }
        else if (group.includes("M")) {
            return "Mix";
        }
        else if (group.includes("Ex")) {
            return "Explicit";
        }
        else {
            return "Control";
        }
    }

    function determinePlacement(group) {
        if (group.includes("PE")) {
            return "PostExposure";
        }
        else if (group.includes("CCT")) {
            return "Concurrent";
        }
        else {
            return "Control";
        }
    }

    let NASAcheck = false;
    const NASA_imageFolders = imageFolders[CountD + CountPC - 1];
    const NASA_Group = determineGroup(NASA_imageFolders);

    $("#btn-NASA").off("click");
    $("#btn-NASA").click(function (event) {
        if (!NASAcheck) {
            alert("請再次確認六題皆作答完畢。");
            NASAcheck = true;
        }
        else {
            /* Write to Json */
            const NASAData = {
                "NASAParticipantId": ParticipantId,
                "NASA_Condition": NASA_Group,
                "NASA_Placement": determinePlacement(NASA_Group),
                "NASA_LabelType": determineLabelType(NASA_Group),
                "MentalDemand": NASAslider1.value,
                "TemporalDemand": NASAslider2.value,
                "PhysicalDemand": NASAslider3.value,
                "Performance": NASAslider4.value,
                "Effort": NASAslider5.value,
                "FrustrationLevel": NASAslider6.value
            };
            writeToJSON(existingDataKey + "_NASA", NASAData);

            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function SEIntroPage() {
    $(`#SEIntroPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    $("#btn-SEIntro").off("click");
    $("#btn-SEIntro").click(function () {
        currentPage++;
        readPageOrderxlsx();
    });
}


function SEPage() {
    $(`#SEPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    /* Reset radio button */
    $(`input[name=SEinlineRadioOptions10]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions20]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions30]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions40]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions50]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions60]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions70]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions80]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions90]`).prop('checked', false);
    $(`input[name=SEinlineRadioOptions100]`).prop('checked', false);

    const SE_imageFolders = imageFolders[CountD + CountPC - 1];
    const SE_Group = determineGroup(SE_imageFolders);

    // Function to determine the Group based on PictureName
    function determineGroup(group) {
        if (group.includes("C")) {
            return "Control";
        } else if (group.includes("DE")) {
            return "PEIm";
        } else if (group.includes("DM")) {
            return "PEM";
        } else if (group.includes("DTF")) {
            return "PEEx";
        } else if (group.includes("PE")) {
            return "CCTIm";
        } else if (group.includes("PM")) {
            return "CCTM";
        } else if (group.includes("PTF")) {
            return "CCTEx";
        }
    }

    function determineLabelType(group) {
        if (group.includes("Im")) {
            return "Implicit";
        }
        else if (group.includes("M")) {
            return "Mix";
        }
        else if (group.includes("Ex")) {
            return "Explicit";
        }
        else {
            return "Control";
        }
    }

    function determinePlacement(group) {
        if (group.includes("PE")) {
            return "PostExposure";
        }
        else if (group.includes("CCT")) {
            return "Concurrent";
        }
        else {
            return "Control";
        }
    }

    $("#btn-SE").off("click");
    $("#btn-SE").click(function () {
        /* Radio Group Validation */
        let isValid = true;

        $('#SEForm fieldset').each(function () {
            const radioButtons = $(this).find('input[type="radio"]');
            const invalidFeedback = $(this).find('.invalid-feedback');
            const isAnyRadioButtonChecked = radioButtons.is(':checked');
            // console.log(`Fieldset ${$(this).index()}:`, isAnyRadioButtonChecked); // Add this line

            if (!isAnyRadioButtonChecked) {
                isValid = false;
                invalidFeedback.css('display', 'block');
            } else {
                invalidFeedback.css('display', 'none');
            }
        });

        if (!isValid) {
            alert('尚有答案未填寫！');
        }
        else {
            /* Write to Json */
            const SEData = {
                "SEParticipantId": ParticipantId,
                "SE_Condition": SE_Group,
                "SE_Placement": determinePlacement(SE_Group),
                "SE_LabelType": determineLabelType(SE_Group),
                "10%": $(`input[name=SEinlineRadioOptions10]:checked`).val(),
                "20%": $(`input[name=SEinlineRadioOptions20]:checked`).val(),
                "30%": $(`input[name=SEinlineRadioOptions30]:checked`).val(),
                "40%": $(`input[name=SEinlineRadioOptions40]:checked`).val(),
                "50%": $(`input[name=SEinlineRadioOptions50]:checked`).val(),
                "60%": $(`input[name=SEinlineRadioOptions60]:checked`).val(),
                "70%": $(`input[name=SEinlineRadioOptions70]:checked`).val(),
                "80%": $(`input[name=SEinlineRadioOptions80]:checked`).val(),
                "90%": $(`input[name=SEinlineRadioOptions90]:checked`).val(),
                "100%": $(`input[name=SEinlineRadioOptions100]:checked`).val(),
            };
            writeToJSON(existingDataKey + "_SE", SEData);
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function IntoConditionPage() {
    $(`#IntoConditionPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function BreakPage() {
    $(`#BreakPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    /* Set up the timer (5 mins) */
    var BreakTimer = 300;
    let countdownInterval;
    countdownInterval = setInterval(function () {

        BreakTimer--;
        var minutes = Math.floor(BreakTimer / 60);
        var seconds = BreakTimer % 60;

        if (BreakTimer > 60) {
            $('#BreakPageTimer').text('剩餘 ' + minutes + ' 分 ' + seconds + ' 秒');
        } else {
            $('#BreakPageTimer').text('剩餘 ' + seconds + ' 秒');
        }


        // Function to enable the button and stop the countdown
        if (BreakTimer < 1) {
            clearInterval(countdownInterval); // Stop the countdown
            $('#BreakPageTimer').text('休息時間結束。');
        }
    }, 1000); // Update the countdown every second

    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            clearInterval(countdownInterval);
            $('#BreakPageTimer').text('');
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function IntoSelfDesignQAPage() {
    $(`#IntoSelfDesignQAPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener

    $("#btn-IntoSDQA").off("click");
    $("#btn-IntoSDQA").click(function () {
        currentPage++;
        readPageOrderxlsx();
    });
}


function SelfDesignRadioPage() {
    $('#SelfDesignRadioPage').show();
    $(this).off("keydown"); // Remove the keydown event listener


    $("#btn-SDQA").off("click");
    $("#btn-SDQA").click(function () {
        let isValid = true; /* Radio Group Validation */

        $('#SDQAForm fieldset').each(function () {
            const radioButtons = $(this).find('input[type="radio"]');
            const invalidFeedback = $(this).find('.invalid-feedback');
            const isAnyRadioButtonChecked = radioButtons.filter(':checked').length > 0;

            if (!isAnyRadioButtonChecked) {
                isValid = false;
                invalidFeedback.css('display', 'block');
            }
            else {
                invalidFeedback.css('display', 'none');
            }

            // let questionExists = false;
            // for (let i = 0; i < SDQ.length; i++) {
            //     if (SDQ[i].SDQQuestionId === questionId) {
            //         // Update existing questionData
            //         SDQ[i] = questionData;
            //         questionExists = true;
            //         break;
            //     }
            // }
            // if (!questionExists) {
            //     SDQ.push(questionData);
            // }

        });

        if (!isValid) {
            alert('尚有答案未填寫！');
            return; // Exit the click handler if any question is unanswered
        }
        else {
            const SDQ = {
                "SDQParticipantId": ParticipantId,
                "Q1": $(`input[name=SDinlineRadioOptions1]:checked`).val(),
                "Q1Type": "Implicit",
                "Q2": $(`input[name=SDinlineRadioOptions2]:checked`).val(),
                "Q2Type": "Explicit",
                "Q3": $(`input[name=SDinlineRadioOptions3]:checked`).val(),
                "Q3Type": "Mix",
                "Q4": $(`input[name=SDinlineRadioOptions4]:checked`).val(),
                "Q4Type": "Concurrent",
                "Q5": $(`input[name=SDinlineRadioOptions5]:checked`).val(),
                "Q5Type": "PostExposure"
            };

            writeToJSON(existingDataKey + "_SDQ", SDQ);

            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function SelfDesignRankingPage() {
    $(window).scrollTop(0);

    $(`#SelfDesignRankingPage`).show();
    $(this).off("keydown"); // Remove the keydown event listener  

    const Q1 = {
        "Ranking1ParticipantId": ParticipantId,
        "Explicit": null,
        "Implicit": null,
        "Mix": null
    }
    const Q2 = {
        "Ranking2ParticipantId": ParticipantId,
        "Concurrent": null,
        "PostExposure": null
    }
    const Q3 = {
        "Ranking3ParticipantId": ParticipantId,
        "CCTEx": null,
        "CCTIm": null,
        "CCTM": null,
        "PEEx": null,
        "PEIm": null,
        "PEM": null,
        "Control": null
    }

    function updateSelectedValues(ItemContainer) {
        // Determine which question group this select belongs to
        if (ItemContainer.find('#Implicit').length > 0) {
            Q1["Implicit"] = $('#Implicit').val();
        }
        else if (ItemContainer.find('#Mix').length > 0) {
            Q1["Mix"] = $('#Mix').val();
        }
        else if (ItemContainer.find('#Explicit').length > 0) {
            Q1["Explicit"] = $('#Explicit').val();
        }
        else if (ItemContainer.find('#Concurrent').length > 0) {
            Q2["Concurrent"] = $('#Concurrent').val();
        }
        else if (ItemContainer.find('#Post-Exposure').length > 0) {
            Q2["PostExposure"] = $('#Post-Exposure').val();
        }
        else if (ItemContainer.find('#CCTEx').length > 0) {
            Q3["CCTEx"] = $('#CCTEx').val();
        }
        else if (ItemContainer.find('#CCTIm').length > 0) {
            Q3["CCTIm"] = $('#CCTIm').val();
        }
        else if (ItemContainer.find('#CCTM').length > 0) {
            Q3["CCTM"] = $('#CCTM').val();
        }
        else if (ItemContainer.find('#PEEx').length > 0) {
            Q3["PEEx"] = $('#PEEx').val();
        }
        else if (ItemContainer.find('#PEIm').length > 0) {
            Q3["PEIm"] = $('#PEIm').val();
        }
        else if (ItemContainer.find('#PEM').length > 0) {
            Q3["PEM"] = $('#PEM').val();
        }
        else if (ItemContainer.find('#Control').length > 0) {
            Q3["Control"] = $('#Control').val();
        }
    }

    $('.RankingSelect').on('change', function () {
        // Get the parent question container
        var Container = $(this).closest('.ItemContainer');
        updateSelectedValues(Container);
        console.log(Q1, Q2, Q3);
    });

    // Button click event to display selected values
    $("#btn-SDRanking").off("click");
    $("#btn-SDRanking").click(function () {

        var questionContainers = document.getElementById("SelfDesignRankingPage").getElementsByClassName("question-container");
        var errorMessage = "";

        for (var container of questionContainers) {
            var selects = container.getElementsByClassName("RankingSelect");
            var seenValues = {};
            for (var select of selects) {
                var value = select.value;

                if (value !== "none" && !seenValues[value]) {
                    seenValues[value] = true;
                } else {
                    var questionId = select.closest(".question-container").getAttribute("id");
                    console.log(select);
                    console.log(select.parentElement.querySelector(".fw-bold"));
                    var subtitleElement = select.parentElement.querySelector(".fw-bold");
                    var subtitle = subtitleElement ? subtitleElement.textContent : "Unknown subtitle";

                    errorMessage += questionId + ":" + subtitle + "\n";
                }
            }
        }

        if (errorMessage !== "") {
            alert(errorMessage + "以上選擇有重複或未選擇的部分，請再確認。");
        }
        else {
            writeToJSON(existingDataKey + "_Ranking1", Q1);
            writeToJSON(existingDataKey + "_Ranking2", Q2);
            writeToJSON(existingDataKey + "_Ranking3", Q3);
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function DownloadPage() {
    $("#DownloadPage").show();

    $(this).off("keydown"); // Remove the keydown event listener
    $(this).on("keydown", function (event) {
        if (event.which === 32) {
            saveJSONToFile(jsonData, ParticipantId);
            currentPage++;
            readPageOrderxlsx();
        }
    });
}


function LastPage() {
    $("#LastPage").show();
}
