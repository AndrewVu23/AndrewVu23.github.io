---
layout: default
title: Projects
permalink: /projects/
---

<h1>Projects</h1>
<p>Hands-on builds and longer write-ups.</p>

<section class="post-feed">
  {%- assign projects = site.categories.projects | default: site.posts -%}
  {%- for post in projects -%}
  <article class="post-card">
    <a class="media" href="{{ post.url }}">
      {%- if post.cover -%}
        <img src="{{ post.cover }}" alt="" loading="lazy">
      {%- else -%}
        <div class="placeholder" aria-hidden="true"></div>
      {%- endif -%}
    </a>
    <div class="details">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p class="excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
      <div class="byline">
        <span>{{ post.date | date: "%b %d, %Y" }}</span>
        {%- if post.tags -%}
          <span class="tags"> · {{ post.tags | join: ', ' }}</span>
        {%- endif -%}
      </div>
    </div>
  </article>
  {%- endfor -%}
</section>
