import requests
import hashlib
import yaml

EMAIL = "your@email.com"          # polite pool, faster + no throttling
AUTHOR = "Vaitea Opuu"
START_YEAR = 2017
bib_output = '../_data/references.yml'

PREPRINT_VENUES = {"biorxiv", "arxiv", "chemrxiv", "medrxiv", "hal"}


def unique_id(title, year):
    return hashlib.md5(f"{title.lower().replace(' ', '_')}_{year}".encode()).hexdigest()


def fetch_works(author, start_year):
    works, cursor = [], "*"
    while cursor:
        r = requests.get("https://api.openalex.org/works", params={
            "filter": f"raw_author_name.search:{author},from_publication_date:{start_year}-01-01",
            "per-page": 200,
            "cursor": cursor,
            "mailto": EMAIL,
        })
        r.raise_for_status()
        data = r.json()
        works += data["results"]
        cursor = data["meta"].get("next_cursor")
    return works


papers, seen = [], set()

for w in fetch_works(AUTHOR, START_YEAR):
    title = (w.get("title") or "Unknown Title").strip()
    if title.lower() in seen:
        continue
    seen.add(title.lower())

    year = w.get("publication_year", "Unknown Year")
    venue = ((w.get("primary_location") or {}).get("source") or {}).get("display_name", "")
    doi = (w.get("doi") or "").replace("https://doi.org/", "")

    papers.append({
        'id': unique_id(title, year),
        'title': title,
        'authors': [a["author"]["display_name"] for a in w.get("authorships", [])],
        'year': year,
        'citation': venue or "Unknown Journal",
        'doi': doi,
        'entrytype': 'article',
        'type': "preprint" if venue.lower() in PREPRINT_VENUES else "paper",
    })

papers.sort(key=lambda p: p['year'], reverse=True)

with open(bib_output, 'w') as f:
    yaml.dump(papers, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

print(f"Saved {len(papers)} papers to {bib_output}")
