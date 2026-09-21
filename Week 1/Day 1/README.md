# Week 1, Day 1: HTML5 Foundations

**Intern:** Abdul Samad  
**Track:** Frontend Web Engineering Internship  
**Project:** Personal Portfolio Website (HTML5 Only)

---

## 📌 Project Overview

This project is part of the **Frontend Engineering Internship (Week 1, Day 1)** assignment. The primary goal is to demonstrate a thorough understanding of core **HTML5 foundations**, semantic document structure, accessibility basics, and native form elements **without** using any styling (CSS) or interactivity (JavaScript).

> **Note:** As per the Day 1 curriculum, this project intentionally focuses exclusively on pure HTML structure. Styling (CSS) and interactivity (JavaScript) will be introduced in subsequent days.

---

## 📂 Project Structure

```text
Day 1/
├── README.md
└── Task/
    ├── index.html
    └── images/
        └── profile.jpg
```

---

## 🎯 Syllabus Topics Covered

1. **HTML5 Document Structure**: Valid `<!DOCTYPE html>`, `<html lang="en">`, `<head>` metadata (`charset`, `viewport`), `<title>`, and `<body>`.
2. **Semantic Elements**: Appropriate use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` instead of unsemantic `<div>` containers.
3. **Heading Hierarchy & Typography**: Single `<h1>` for page identity, `<h2>` for major sections, `<h3>` for individual project articles, and `<p>` for descriptive paragraphs.
4. **Navigation & Internal Linking**: Dedicated `<nav>` menu with anchor tags (`<a href="#id">`) routing to corresponding section IDs on the same page.
5. **Media & Accessibility**: Proper embedding of optimized local images (`<img>`) with descriptive, meaningful `alt` text for screen readers.
6. **HTML Lists**: Unordered lists (`<ul>`, `<li>`) used for navigation links, skill sets, and services.
7. **Tabular Data**: Structured HTML `<table>` utilizing semantic `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` tags to present academic records.
8. **HTML5 Forms**: Accessible `<form>` with matched `<label for="...">` and `<input id="...">` pairs, including varied input types (`text`, `email`, `tel`), multi-line `<textarea>`, and a `<button type="submit">`.

---

## 📄 Page Sections

| Section | Element ID | Content Description |
|---|---|---|
| **Header** | N/A | Website branding, name, student title, and `<nav>` menu |
| **Home** | `#home` | Main `<h1>` greeting, summary bio, and profile photo |
| **About** | `#about` | 3 detailed paragraphs covering academic background and learning goals |
| **Skills** | `#skills` | Unordered list of fundamental technologies (HTML5, CSS3, JS, Git, GitHub) |
| **Education** | `#education` | Structured table of degrees, institutions, and completion years |
| **Projects** | `#projects` | Independent `<article>` blocks for portfolio projects with links |
| **Services** | `#services` | List of core development services offered |
| **Contact** | `#contact` | HTML5 form with name, email, phone, subject, and message fields |
| **Footer** | N/A | Copyright information, external links, and "Back to Top" navigation |

---

## 🚫 Technology Constraints Maintained

- ❌ No CSS (No external stylesheet, no `<style>` tags, no inline `style` attributes)
- ❌ No JavaScript (No `<script>` tags, no DOM manipulation, no frameworks)
- ❌ No CSS Frameworks (No Bootstrap, Tailwind, etc.)
- ❌ No Unnecessary `<div>` elements or ad-hoc class names
