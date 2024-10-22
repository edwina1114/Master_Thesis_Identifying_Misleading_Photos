import csv
import pandas as pd
file = "./Qualitative_N.csv"
# Read the CSV file into a DataFrame
df = pd.read_csv(file)

participant_ids = df[df['Participant'].str.contains("Participant", na=False)]
# print(participant_ids)

N_counts = {}

for column in df.columns[1:]:
    N = 0

    for participant_index in range(len(participant_ids)):
        participant_name = participant_ids.iloc[participant_index]['Participant']
        # print(participant_name)

        # Find the indices range for the current participant
        if participant_index == len(participant_ids) - 1:
            # Last participant
            start_index = participant_ids.index[participant_index]
            end_index = df.index.max() + 1  # Last row index + 1
            # print(participant_index, start_index, end_index)
        else:
            start_index = participant_ids.index[participant_index]
            end_index = participant_ids.index[participant_index + 1]
            # print(participant_index, start_index, end_index)

        participant_count = 0
        found_first_one = False

        # Iterate over the rows for the current participant
        for i in range(start_index, end_index):
            if df.at[i, column] == 1 and not found_first_one:
                participant_count += 1
                found_first_one = True
        N += participant_count
    N_counts[column] = N

print(N_counts)