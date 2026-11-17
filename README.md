# ameyjoshi.in — X-Ray

Static site. No build step, no dependencies.

    index.html      the whole site
    css/site.css    all styles
    js/site.js      the WebGL stage (lens, dive, cutover wipe) and interactions
    img/            working copies of the four pictures; sharper copies load from Cloudinary (folder xray/)
    fonts/          self-hosted Syne and Figtree (SIL Open Font License)
    favicon.svg
    vercel.json     static deploy

The pictures were generated for this site. No real brand, person or card appears in them.
To preview locally: `python3 -m http.server` in this folder, then open http://localhost:8000
