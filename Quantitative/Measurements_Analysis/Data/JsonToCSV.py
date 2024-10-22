# 最後要分析受試者回答的時候用，將json轉成csv方便分析
import os
import pandas as pd

path = "/Users/Edwina/Desktop/DataDiscrete/(Formal)Participant_Answers/Userjson"
userdata_path = "/Users/Edwina/Desktop/DataDiscrete/(Formal)Participant_Answers/UserCSV/"
destination_path = "/Users/Edwina/Desktop/DataDiscrete/(Formal)Participant_Answers/"
exclude = ".DS_Store"

focus_json = "/Users/Edwina/Desktop/predictions.json"
focus_des = "/Users/Edwina/Desktop/"
f_json_data = pd.read_json(focus_json)
f_json_data.to_csv(focus_des + 'focus' + '.csv', encoding='utf-8-sig',
                         index=False)

# Initialize an empty DataFrame to store merged data
merged_data = pd.DataFrame()

for file in sorted(os.listdir(path)): # sorted : 防止亂序讀取
    if file != exclude:
        full_path = os.path.join(path, file)  # Construct the full file path
        # print(full_path)    # Load JSON data

        json_data = pd.read_json(full_path)
        filename = os.path.splitext(file)[0]
        json_data.to_csv(userdata_path + filename + '.csv', encoding='utf-8-sig',
                         index=False)

        # Concatenate data to the merged DataFrame
        merged_data = pd.concat([merged_data, json_data], ignore_index=True)

# Save to CSV
merged_data.to_csv(destination_path + 'Formal.csv', encoding='utf-8-sig', index=False) # 'utf-8-sig': 讓中文字不要變成亂碼
