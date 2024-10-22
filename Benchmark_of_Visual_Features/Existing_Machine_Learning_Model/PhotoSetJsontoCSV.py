# 將json轉成csv方便分析
import os
import pandas as pd

file = "/Users/edwina/Desktop/ResearchOfEdwina/Lab Study/Code/DataProcess/PhotoSet/PhotoSet.json"
exclude = ".DS_Store"

json_data = pd.read_json(file)
filename = os.path.splitext(file)[0]
json_data.to_csv(filename + '.csv', encoding='utf-8-sig', index=False)
