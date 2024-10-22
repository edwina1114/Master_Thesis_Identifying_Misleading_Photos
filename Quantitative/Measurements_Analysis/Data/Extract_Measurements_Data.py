import pandas as pd

file = "/Users/Edwina/Desktop/DataDiscrete/(Formal)Participant_Answers/Formal.csv"
destination_path = "/Users/Edwina/Desktop/DataDiscrete/(Formal)Participant_Answers/Filtered/"

pd.set_option('display.max_columns', None)  # 設置顯示所有列
pd.set_option('display.max_rows', None)     # 設置顯示所有行

df = pd.read_csv(file)
# print(df.columns) # 看各行的標籤

''' Response, Time '''
df_Answer = df.loc[:, 'ParticipantId':'Response']
df_Answer_filtered = df_Answer.dropna()
# print(df_Answer_filtered)

# Save to CSV - 'utf-8-sig': 讓中文字不要變成亂碼
df_Answer_filtered.to_csv(destination_path + 'Response_ReactionTime.csv', encoding='utf-8-sig', index=False)

''' NASA-TLX '''
df_NASA = df.loc[:, 'NASAParticipantId':'FrustrationLevel']

df_NASA_filtered = df_NASA.dropna() # 過濾掉具有NaN值的行

# Save to CSV - 'utf-8-sig': 讓中文字不要變成亂碼
df_NASA_filtered.to_csv(destination_path + 'NASA.csv', encoding='utf-8-sig', index=False)


''' Self Efficacy '''
df_SE = df.loc[:, 'SEParticipantId':'100%']
df_SE_filtered = df_SE.dropna()

# Save to CSV - 'utf-8-sig': 讓中文字不要變成亂碼
df_SE_filtered.to_csv(destination_path + 'SE.csv', encoding='utf-8-sig', index=False)


''' 自製題目 Likert Scale '''
df_SDQ = df.loc[:, 'SDQParticipantId':'Q5Type']
df_SDQ_filtered = df_SDQ.dropna()

# Save to CSV - 'utf-8-sig': 讓中文字不要變成亂碼
df_SDQ_filtered.to_csv(destination_path + 'SDQ.csv', encoding='utf-8-sig', index=False)


''' 自製題目 Ranking '''
df_Ranking1 = df.loc[:, 'Ranking1ParticipantId':'Mix']
df_Ranking1_filtered = df_Ranking1.dropna()

df_Ranking2 = df.loc[:, 'Ranking2ParticipantId':'PostExposure']
df_Ranking2_filtered = df_Ranking2.dropna()

df_Ranking3 = df.loc[:, 'Ranking3ParticipantId':'Control']
df_Ranking3_filtered = df_Ranking3.dropna()

# Save to CSV - 'utf-8-sig': 讓中文字不要變成亂碼
df_Ranking1_filtered.to_csv(destination_path + 'Ranking1.csv', encoding='utf-8-sig', index=False)

df_Ranking2_filtered.to_csv(destination_path + 'Ranking2.csv', encoding='utf-8-sig', index=False)

df_Ranking3_filtered.to_csv(destination_path + 'Ranking3.csv', encoding='utf-8-sig', index=False)


