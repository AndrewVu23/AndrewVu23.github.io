---
layout: post
title: "Notes on quiet switching power supplies"
date: 2025-07-30
category: notes
tags: [power, layout, emi]
cover: /assets/img/posts/psu-notes.jpg
excerpt: "Layout, snubbers, and measurement traps when chasing millivolts."
---

A running list of lessons while iterating on a compact buck converter board:

- Minimize loop area around the switch node; keep the hot path tiny.
- RC snubbers are cheap; measure and tune instead of guessing.
- Current loops matter more than copper area alone.
