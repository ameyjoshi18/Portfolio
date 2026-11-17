# ameyjoshi.in — Downstream

Static site. No build step, no dependencies, no image files.

    index.html      the whole site
    css/site.css    all styles
    js/scene.js     draws the landscape and runs the page
    fonts/          self-hosted Fraunces and Figtree (SIL Open Font License)
    favicon.svg
    vercel.json     static deploy

The landscape is drawn in code on a canvas. To change the colours of the day, edit KEYS at the top of js/scene.js.
To preview locally: `python3 -m http.server` in this folder, then open http://localhost:8000
