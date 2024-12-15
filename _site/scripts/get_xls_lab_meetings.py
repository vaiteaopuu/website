"""Use this code to retrieve the dates for lab meetings
"""

import pandas as pd
from datetime import datetime
from numpy import isnan

# Use the modified XLSX export URL
url = 'https://docs.google.com/spreadsheets/d/1xbou7cjth2ip1jNph0AmvJI6hhvSfRWV/export?format=xlsx'

# Read the sheet as an Excel file starting from row 3 (skip the first 2 rows)
df = pd.read_excel(url, engine='openpyxl', skiprows=2)

# Display the data
current_date = datetime.now().date()

out_file = "../_data/lab_meetings.yml"
# cols = ['Meeting Group', 'Date', 'Day', 'Time', 'Speaker(s)', 'Title', 'Unnamed: 6']

with open(out_file, "w") as out:
    for index, row in df.iterrows():
        meeting_type = row["Meeting Group"].strip()
        title = row["Title"]
        if pd.isna(title):
            title = meeting_type + " presentation"
        date = pd.to_datetime(row["Date"], errors="coerce").date()
        try:
            speaker = row["Speaker(s)"]
            if current_date <= date:
                out.write(
f"""- date: {date}
  title: {title}
  speaker: {speaker}
  type: {meeting_type}
"""
                    )
        except:
            print("ERR", date)
