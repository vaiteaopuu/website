from scholarly import scholarly
import bibtexparser
import yaml
import hashlib


def generate_unique_id(publication):
    """Generates a unique ID for each publication using its title and year."""
    title = publication['bib'].get('title', 'untitled').lower().replace(' ', '_')
    pub_year = publication['bib'].get('pub_year', 'unknown_year')

    # Use a combination of the title and year to generate a unique ID
    unique_string = f"{title}_{pub_year}"

    # Create a hash to ensure the ID is unique and doesn't break with special characters
    unique_id = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    return unique_id

# Helper function to extract authors using bibtexparser
def extract_authors_from_bibtex(bibtex_entry):
    bib_database = bibtexparser.loads(bibtex_entry)
    entry = bib_database.entries[0]  # Assuming one entry in BibTeX
    authors = entry.get('author', 'Unknown Author').split(' and ')
    return [author.strip() for author in authors]

# Helper function to extract DOI from BibTeX string
def extract_doi_from_bibtex(bibtex_entry):
    bib_database = bibtexparser.loads(bibtex_entry)
    print(bibtex_entry)
    entry = bib_database.entries[0]  # Assuming one entry in BibTeX
    return entry.get('doi', '')

def get_papers_by_authors_and_dates(author_name, start_year, end_year, output_file='papers.yml'):
    all_papers = []

    search_query = scholarly.search_author(author_name)
    author = next(search_query)  # Retrieve the first result for simplicity
    scholarly.fill(author, sections=['publications'])  # Get all publications

    for pub in author['publications']:
        pub_year = pub.get('bib', {}).get('pub_year')
        if pub_year and start_year <= int(pub_year) <= end_year:
            # Ensure 'ENTRYTYPE' and 'ID' are present, and assign defaults if missing
            if 'ENTRYTYPE' not in pub['bib']:
                pub['bib']['ENTRYTYPE'] = 'article'  # Default to 'article' if missing
            pub['bib']['ID'] = generate_unique_id(pub)
            pub['bib']['year'] = pub_year

            # Remove the "pub_year" key if it exists
            if 'pub_year' in pub['bib']:
                del pub['bib']['pub_year']

            # Retrieve BibTeX entry to extract author list
            try:
                bibtex_entry = scholarly.bibtex(pub)  # Retrieve BibTeX entry
                authors = extract_authors_from_bibtex(bibtex_entry)
                doi = extract_doi_from_bibtex(bibtex_entry)
            except Exception as e:
                print(f"Error retrieving BibTeX or authors for {pub['bib'].get('title', 'Unknown Title')}: {e}")
                authors = ["Unknown Author"]
                doi = ""

            # Build a YAML-friendly dictionary for each publication
            paper_data = {
                'id': pub['bib']['ID'],
                'title': pub['bib'].get('title', 'Unknown Title').strip('{}'),
                'authors': authors,
                'year': pub['bib'].get('year', 'Unknown Year'),
                'citation': pub['bib'].get('journal', 'Unknown Journal'),
                'doi': doi,
                'entrytype': pub['bib'].get('ENTRYTYPE', 'article'),
                'type': "preprint" if pub['bib'].get('journal', 'Unknown Journal') in ["BioRxiv"] else "paper",
            }
            all_papers.append(paper_data)

    return all_papers

# Example usage:
authors = [('vaitea opuu', 2000, 2030)]
bib_output = '../_data/references.yml'

all_papers = []
seen_title = set()
tmp = get_papers_by_authors_and_dates("vaitea opuu", 2000, 2030)
for el in tmp:
    if el["title"] not in seen_title:
        all_papers += [el]
        seen_title.add(el["title"])

# Write the collected papers to a YAML file
with open(bib_output, 'w') as yaml_file:
    yaml.dump(all_papers, yaml_file, default_flow_style=False)

print(f"Saved {len(all_papers)} papers to {bib_output}")
