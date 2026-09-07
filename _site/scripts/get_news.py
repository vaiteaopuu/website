"""Use this code to retrieve the dates for lab meetings
"""

import pandas as pd
from datetime import datetime
from numpy import isnan
import yaml

# Use the modified XLSX export URL
url = 'https://docs.google.com/spreadsheets/d/103lWeVOCL8j6JSguo9_HKDBvoO1xjMI36nYlIdhoSwM/export?format=xlsx'

# Read the sheet as an Excel file starting from row 3 (skip the first 2 rows)
df = pd.read_excel(url, engine='openpyxl')

# Display the data
current_date = datetime.now().date()

out_file = "../_data/feed_news.yml"

all_news = []
for index, row in df.iterrows():
    date = row["Date"].date()
    title = row["Title"].strip()
    content = row["Content"].strip()
    news_data = {
        'title': title,
        'content': content,
        'date': date,
    }
    all_news += [news_data]
    print(news_data)

with open(out_file, "w") as out:
    yaml.dump(all_news, out, default_flow_style=False)
