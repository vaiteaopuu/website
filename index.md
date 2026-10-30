---
layout: home
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Work+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{{ '/assets/css/home.css' | relative_url }}">

<div class="vo-home">
  <section class="vo-hero">
    <div class="vo-intro">
      <img class="vo-photo" src="{{ '/assets/images/img/vopuu.png' | relative_url }}" alt="Portrait of Vaitea Opuu">
      <h1>Vaitea Opuu</h1>
      <p class="vo-role">CNRS researcher, BIOC, <a href="https://bioc.ip-paris.fr/">École Polytechnique</a></p>
      <p class="vo-lede">I design RNA molecules. My methods combine machine learning and statistical physics to generate sequences that fold and function, and to measure how much information sequence data really holds.</p>
      <p class="vo-links">
        <a href="https://scholar.google.com/citations?user=QjPCEicAAAAJ&hl=en">Google Scholar</a>
        <a href="https://github.com/vaiteaopuu">GitHub</a>
        <a href="{{ '/assets/cv/cv.pdf' | relative_url }}">CV</a>
        <a href="mailto:{{ site.email }}">Email</a>
      </p>
    </div>
    <figure class="vo-fold" id="rna-fold">
      <button type="button" class="vo-replay" id="rna-replay">Fold again</button>
    </figure>
  </section>
  <section class="vo-work">
    <h2>Recent work</h2>
    <article class="vo-paper">
      <a class="vo-paper-fig" href="https://doi.org/10.1038/s41467-025-63151-5">
        <img src="{{ '/assets/images/projects/self_repro.png' | relative_url }}" alt="Self-reproduction kinetics of natural and generated ribozymes">
      </a>
      <div>
        <p class="vo-venue">Nature Communications, 2025</p>
        <h3><a href="https://doi.org/10.1038/s41467-025-63151-5">Exploring the space of self-reproducing ribozymes using generative models</a></h3>
        <p class="vo-authors">C. N. Lambert, <strong>V. Opuu</strong>, F. Calvanese, P. Pavlinova, F. Zamponi, E. J. Hayden, M. Weigt, M. Smerlak, P. Nghe</p>
        <p class="vo-summary">Generative models designed ribozymes that stay active up to 65 mutations away from the natural sequence and still copy themselves. Scaling up from the experimental success rate, at least 10<sup>39</sup> such self-reproducing ribozymes may exist.</p>
        <p class="vo-links">
          <a href="https://doi.org/10.1038/s41467-025-63151-5">Paper</a>
          <a href="{{ '/_projects/emergence_evo/' | relative_url }}">Project page</a>
        </p>
      </div>
    </article>
    <article class="vo-paper">
      <a class="vo-paper-fig" href="https://doi.org/10.1371/journal.pcbi.1014778">
        <img src="{{ '/assets/images/software/effective_length_intuition.png' | relative_url }}" alt="An input alignment and a shorter alignment with the same diversity; Leff is the length of the shorter one">
      </a>
      <div>
        <p class="vo-venue">PLOS Computational Biology, 2026</p>
        <h3><a href="https://doi.org/10.1371/journal.pcbi.1014778">A spectral framework for measuring diversity in multiple sequence alignments</a></h3>
        <p class="vo-authors"><strong>V. Opuu</strong></p>
        <p class="vo-summary">The effective length L<sub>eff</sub> counts the genuinely independent information in a set of sequences. Natural RNA and protein families turn out far more constrained than their size suggests, and L<sub>eff</sub> anticipates how reliably their structures can be predicted.</p>
        <p class="vo-links">
          <a href="https://doi.org/10.1371/journal.pcbi.1014778">Paper</a>
          <a href="https://github.com/vaiteaopuu/effective_length">Code</a>
          <a href="{{ '/_projects/leff/' | relative_url }}">Project page</a>
        </p>
      </div>
    </article>
  </section>
</div>

<script src="{{ '/assets/js/rna-fold.js' | relative_url }}" defer></script>
