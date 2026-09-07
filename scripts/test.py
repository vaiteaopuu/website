import requests
import hashlib

def generate_unique_id(publication):
    title = publication.get('title', 'untitled').lower().replace(' ', '_')
    pub_year = publication.get('year', 'unknown_year')
    unique_string = f"{title}_{pub_year}"
    return hashlib.md5(unique_string.encode('utf-8')).hexdigest()

def get_papers_by_crossref(author_name, start_year, end_year, rows=100):
    all_papers = []
    for year in range(start_year, end_year + 1):
        url = "https://api.crossref.org/works"
        params = {
            "query.author": author_name,
            "filter": f"from-pub-date:{year}-01-01,until-pub-date:{year}-12-31",
            "rows": rows,
            "sort": "published",
            "order": "desc"
        }
        response = requests.get(url, params=params)
        if response.status_code != 200:
            continue
        items = response.json().get("message", {}).get("items", [])
        for item in items:
            title = item.get("title", ["Unknown Title"])[0]
            authors = [f"{a.get('given', '')} {a.get('family', '')}".strip() for a in item.get("author", [])]
            paper_data = {
                'id': generate_unique_id({'title': title, 'year': year}),
                'title': title,
                'authors': authors,
                'year': item.get("issued", {}).get("date-parts", [[year]])[0][0],
                'citation': item.get("container-title", ["Unknown Journal"])[0],
                'doi': item.get("DOI", ""),
                'entrytype': item.get("type", "article"),
                'type': "preprint" if "biorxiv" in item.get("container-title", [""])[0].lower() else "paper",
            }
            all_papers.append(paper_data)
    return all_papers

papers = get_papers_by_crossref("vaitea opuu", 2022, 2030)
for paper in papers:
    print(f"{paper['year']} | {paper['title']} | DOI: {paper['doi']}")
