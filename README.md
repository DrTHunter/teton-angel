# Teton Angel — book site

Landing page and blog for **Teton Angel: The Heart of the West Reborn**, a novel by Roland Hunter.

- Buy: https://www.amazon.com/dp/B0GWW3YM25
- Static HTML/CSS/JS, no build step. Served with GitHub Pages from `main` at https://tetonangel.com (DNS at Porkbun: ALIAS @ and CNAME www -> drthunter.github.io).

## Adding a blog post

1. Copy `blog/one-line-at-a-time.html` to `blog/<slug>.html` and replace the title, meta tags, hero image and article body.
2. Add a card for it in `blog/index.html` (and on the home page's "From the Blog" section if it should be featured).
3. Put images in `assets/img/` (resize to ~1600px wide first).
