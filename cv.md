---
layout: base
title: "CV"
permalink: /cv/
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Work+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{{ '/assets/css/home.css' | relative_url }}?v={{ site.time | date: '%s' }}">

{% assign published = site.data.references | where_exp: "p", "p.type != 'preprint'" %}
{% assign papers = published | where: "type", "paper" %}
{% assign chapters = published | where: "type", "book chapter" %}

<div class="vo-home vo-cv">
  <header class="vo-cv-head">
    <h1>Vaitea Opuu</h1>
    <p class="vo-role">CNRS researcher (CR) in computational biology, BIOC, <a href="https://bioc.ip-paris.fr/">École Polytechnique</a></p>
    <p class="vo-links">
      <a href="mailto:{{ site.email }}">{{ site.email }}</a>
      <a href="https://scholar.google.com/citations?user=QjPCEicAAAAJ&hl=en">Google Scholar</a>
      <a href="https://github.com/vaiteaopuu">GitHub</a>
    </p>
  </header>
  <section>
    <h2>Research positions</h2>
    <dl class="vo-cv-list">
      <dt>Current</dt>
      <dd><strong>CNRS researcher (CR)</strong>, Laboratoire de Biologie Structurale de la Cellule (BIOC), UMR 7654, École Polytechnique, Palaiseau, France<br><span class="vo-cv-note">RNA design, generative models, machine learning and physics</span></dd>
      <dt>2022 to 2026</dt>
      <dd><strong>Postdoc: machine learning applied to RNA</strong>, UMR CNRS-ESPCI 8231 Chimie, Biologie, Innovation (LBE), Paris, France. Advisor: Philippe Nghe<br><span class="vo-cv-note">Origin of life, RNA design and structure, generative models</span></dd>
      <dt>2020 to 2022</dt>
      <dd><strong>Postdoc: from self-reproduction to evolution in the RNA world</strong>, Max Planck Institute for Mathematics in the Sciences, Leipzig, Germany. Advisor: Matteo Smerlak<br><span class="vo-cv-note">Origin of life, RNA world hypothesis, RNA design and structure, generative models</span></dd>
    </dl>
  </section>
  <section>
    <h2>Education</h2>
    <dl class="vo-cv-list">
      <dt>2017 to 2020</dt>
      <dd><strong>PhD in computational protein design</strong>, École Polytechnique, France. Advisor: Thomas Simonson<br><span class="vo-cv-note">Thesis: Computational design of proteins and enzymes. Defended 29 October 2020</span></dd>
      <dt>2015 to 2017</dt>
      <dd><strong>Master in bioinformatics</strong>, Université Paris-Saclay, France</dd>
    </dl>
  </section>
  <section>
    <h2>Journal articles</h2>
    <ol class="vo-cv-pubs">
      {%- for p in papers -%}
      <li><span class="vo-cv-year">{{ p.year }}</span><span>{% if p.authors.size > 12 %}{{ p.authors | slice: 0, 3 | join: ", " }}, <strong>V. Opuu</strong>, et al.{% else %}{{ p.authors | join: ", " | replace: "Vaitea Opuu", "<strong>V. Opuu</strong>" }}.{% endif %} <a href="https://doi.org/{{ p.doi }}">{{ p.title }}</a>. <em>{{ p.citation }}</em>.</span></li>
      {%- endfor -%}
    </ol>
  </section>
  <section>
    <h2>Book chapters</h2>
    <ol class="vo-cv-pubs">
      {%- for p in chapters -%}
      <li><span class="vo-cv-year">{{ p.year }}</span><span>{% if p.authors.size > 12 %}{{ p.authors | slice: 0, 3 | join: ", " }}, <strong>V. Opuu</strong>, et al.{% else %}{{ p.authors | join: ", " | replace: "Vaitea Opuu", "<strong>V. Opuu</strong>" }}.{% endif %} <a href="https://doi.org/{{ p.doi }}">{{ p.title }}</a>. <em>{{ p.citation }}</em>.</span></li>
      {%- endfor -%}
    </ol>
  </section>
  <section>
    <h2>PhD co-supervision</h2>
    <dl class="vo-cv-list">
      <dt>Since 2024</dt>
      <dd>Paul Dupuyds, with Philippe Nghe</dd>
      <dt>Since 2023</dt>
      <dd>Shuhui Wang, with Philippe Nghe</dd>
    </dl>
  </section>
  <section>
    <h2>Talks</h2>
    <dl class="vo-cv-list">
      <dt>2025</dt>
      <dd>Statistical Methods for Post Genomic Data (SMPGD): D-LIM</dd>
      <dt>2025</dt>
      <dd>Invited seminar, IBMC, Strasbourg: RNA design for self-reproduction</dd>
      <dt>2025</dt>
      <dd>RNA day, Sorbonne University, Paris: lab presentation</dd>
      <dt>2023</dt>
      <dd>Biological Sequence Variation school, Corsica, France</dd>
      <dt>2022</dt>
      <dd>CBI seminar, ESPCI, Paris; MASIM workshop, Paris; AbSciCon 2022, Atlanta (remote)</dd>
      <dt>2021</dt>
      <dd>MASIM workshop, Lyon</dd>
      <dt>2019</dt>
      <dd>MASIM workshop, Paris; 3rd Junior Conference on Computational Biology, Orsay; AMMIB workshop, Gif-sur-Yvette; seminar, Université Paris-Diderot</dd>
      <dt>2018</dt>
      <dd>17th Advances in Systems and Synthetic Biology, Évry</dd>
    </dl>
  </section>
  <section>
    <h2>Teaching</h2>
    <dl class="vo-cv-list">
      <dt>Master</dt>
      <dd>Bioinformatics master, Sorbonne University: structural biology (4 h) and Meet-UE project course (7 × 2 h)</dd>
    </dl>
  </section>
  <section>
    <h2>Software</h2>
    <dl class="vo-cv-list">
      <dt>Leff</dt>
      <dd>Spectral measure of diversity in sequence alignments. <a href="https://github.com/vaiteaopuu/effective_length">GitHub</a></dd>
      <dt>D-LIM</dt>
      <dd>Interpretable neural network for gene–gene interactions. <a href="https://github.com/LBiophyEvo/D-LIM-model">GitHub</a></dd>
      <dt>RAFFT</dt>
      <dd>RNA folding pathways with the fast Fourier transform. <a href="https://github.com/strevol-mpi-mis/RAFFT">GitHub</a></dd>
      <dt>Proteus</dt>
      <dd>Physics-based protein design. <a href="https://proteus.polytechnique.fr">proteus.polytechnique.fr</a></dd>
    </dl>
  </section>
  <section>
    <h2>Experimental collaborations</h2>
    <dl class="vo-cv-list">
      <dt>RNA design</dt>
      <dd>Philippe Nghe, ESPCI Paris</dd>
      <dt>Enzyme design</dt>
      <dd>Emmanuelle Schmitt and Yves Mechulam, École Polytechnique; Etienne Jourdier and Carlos Nieto, IFP Énergies nouvelles</dd>
      <dt>Protein design</dt>
      <dd>Ernesto Fuentes, University of Iowa; Gilles Travé, University of Strasbourg</dd>
    </dl>
  </section>
</div>
