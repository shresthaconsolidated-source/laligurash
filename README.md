# Laligurash - the candle room

A static site: no build step. Open `index.html` through any local web server
(for example `python -m http.server 8811`) and visit http://127.0.0.1:8811/.

- The room starts dark and the cursor is a lit match; touching a wick lights it.
  A parked candle lights itself after a moment, so nobody is made to find the match.
- Sound (off by default): the match strike and a candle catching, nothing in between.
- Scent picker: Rose, Lemongrass, Sandalwood, Lavender tint the light and fill the air.

URL options: `?lit` starts with every candle burning, `?scent=rose` preselects a scent,
`?still&p=0.5` freezes one frame for screenshots.

This branch does not touch `main` or the live site.
