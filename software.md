---
layout: default
title: "Software"
---

<div class="gallery">
  {% for item in site.softwares %}
  <div class="software-card">
    <a href="{{ item.site }}">
    <h3>{{ item.name }}</h3>
    </a>
    <div class="research-card-body">
        <img src="{{ item.image }}" alt="{{ item.title }}" class="software-thumbnail">
      <p>{{ item.content }}</p>
    </div>
  </div>
  {% endfor %}
</div>
