---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<!-- <div class="bandeau-croc-bottom" style="background-image: url('./assets/images/banner/glob.png');"></div> -->
<img src="./assets/images/banner/glob.png">

<div class="content-wrapper">
  <div class="main-content">
    <div class="lab-description-box">
    <h1>Vaitea OPUU</h1>
    <img src="assets/images/vopuu.png" alt="Greetings" class="lab-thumbnail">
    <p>
    I'm a CNRS researcher (CR) in computational biology working at <a href="https://www.lbe.espci.fr/home/">ESPCI</a>.
    I develop computational methods to engineer proteins and RNAs that are at the interface between machine learning and physics.
    </p>
    <strong><a href="https://scholar.google.com/citations?user=QjPCEicAAAAJ&hl=en&oi=ao"><img src="assets/images/google-scholar-svgrepo-com.svg" style="max-width: 40px" alt=""/></a></strong>
    <strong><a href="./assets/cv/cv.pdf"><img src="assets/images/cv-file-interface-symbol-svgrepo-com.svg" alt=""/></a></strong>
  </div>
</div>

<div class="news-feed">
    <h2 class="feed-title">News</h2>
    <div class="feed">
      {% for post in site.data.feed_news %}
      <div class="feed-item">
        <span class="feed-title">{{ post.title }}</span>
        <p class="feed-text">{{ post.content }}<br><span class="feed-date">{{ post.date }}</span></p>
      </div>
      {% endfor %}
    </div>
  </div>
</div>

<hr class="custom-hr">
<br>

# Research topics
<div class="gallery">
  {% for project in site.projects %}
    <div class="research-card">
      <div class="gallery-info">
        <a class="research-link" href="{{ project.url | relative_url }}">
        <img src="{{ project.image }}" alt="{{ project.name }}" class="research-thumbnail">
        <br>
          {{ project.name | escape }}
        </a>
        <p>{{ project.description }}</p>
      </div>
    </div>
  {% endfor %}
</div>
