---
layout: default
title: "Publications"
---

# Publications

{% assign papers_by_year = site.data.references | group_by: "year" %}
{% assign papers_by_year_sorted = papers_by_year | sort: "name" | reverse %}
{% for year_group in papers_by_year_sorted %}
  <h2>{{ year_group.name }}</h2> <!-- Display the year as a heading -->
  <hr>
  {% for paper in year_group.items %}
  <div class="paper">
    <!-- Title on the first line, italicized and with custom gray color -->
    <em style="color: #555;">{{ paper.title }}</em><br>

    <p>
    <!-- Authors on the second line, bolded and with a lighter gray color -->
    {% if paper.authors %}
      <strong style="color: #888;">{{ paper.authors | join: ", " }}</strong><br>
    {% endif %}

    <!-- Journal and year on the third line, with a DOI link if available -->
    <a href="{{ paper.link }}"> {{ paper.citation }} </a>
  {% if paper.type %}
    <span class="paper-type-{{ paper.type | downcase }}">
      {{ paper.type }}
    </span>
 {% endif %}
    </p>
  </div>
  {% endfor %}
{% endfor %}
