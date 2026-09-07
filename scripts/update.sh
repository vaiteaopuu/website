#!/usr/bin/env bash

cd /home/vopuu/project/LBiophyEvo.github.io/scripts/

# Pull latest changes from the remote to avoid conflicts
git pull origin main


python get_news.py 2> log/log_news
python get_bib.py 2> log/log_bib
python get_xls_people.py 2> log/log_people
python get_xls_lab_meetings.py 2> log/log_meetings

cd ../

# Add all changed files to Git
git add .

# Commit the changes with a message
git commit -m "Automatic update from cron"

# Push the changes to GitHub
git push origin main

# Print a message indicating the script ran
echo "GitHub repository updated on $(date)"
