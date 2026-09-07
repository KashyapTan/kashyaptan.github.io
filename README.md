# Kashyap Tanuku | Portfolio

A static personal portfolio for GitHub Pages with spatial navigation, interactive Three.js selectors, perspective content decks, and a contact form.

## Local preview

Run `python3 -m http.server 8080 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:8080`. No install or build step is required. Serve over HTTP so JavaScript modules load correctly.

## Structure

- `index.html`: all portfolio content, links, and semantic markup. Content stays readable without JavaScript.
- `style.css`: responsive dark, electric-blue, and violet theme.
- `spatial.css`: 3D chapter maps, content decks, and persistent chapter navigation.
- `script.js`: motion controls, scroll reveals, card interactions, and the existing EmailJS contact integration.
- `journey.js`: progressively enhances existing HTML into experience, project, and toolkit decks, with distinct SVG illustrations for each past role. Their working details include service signals, synchronized layers, document scanning and typing, and live dashboard bars. Scene buttons, arrow controls, keyboard navigation, and horizontal swipes select the same content.
- `orbital.js`: one WebGL renderer draws four interactive scene regions. Raycasting maps clicks on 3D objects to real HTML controls. Project selections rotate the constellation and move the matching content card into view. Navigation uses a fine orbital dial, small open-frame 3D markers, and borderless Montserrat annotations. The labels stay upright and crisp while their markers orbit. An illuminated arc and a short underline identify the active stop. Every scene rotates its selected object to a fixed focal position. Each section has a five-layer kinetic centerpiece combining a distinct polyhedral cage, polygon rotors, a smaller faceted frame, and a crystal core. The dial is inset from the navigation markers, leaving a visible gap around the shapes. Nested parts occupy disjoint radial envelopes, and selector paths remain outside the sculpture and orbit rings to prevent intersections during rotation.
- `vendor/`: pinned Three.js 0.170.0 and Lenis 1.3.26, with their MIT licenses. No external CDN is needed for graphics or smooth scrolling.
- `icons/resume.pdf`: supplied V9 résumé. The current Intuit role is reflected on the website; the PDF itself is unchanged from the supplied file.

The motion button pauses ambient movement and animated transitions while keeping navigation functional. The site respects reduced-motion preferences, suspends rendering when scene regions are offscreen or the tab is hidden, and caps rendering resolution. Each scene has keyboard-accessible HTML links or buttons. These become a selector grid if WebGL is unavailable or its context is lost. Typography uses Montserrat from Google Fonts with a local sans-serif fallback. Lenis eases mouse-wheel and anchor scrolling, respects the fixed-header offset, and leaves touch scrolling native. Pausing motion destroys the smooth-scroll instance so ordinary scrolling remains available.

Use the fixed header chapter bar to move between sections. In a content deck, use its arrow buttons, left/right arrow keys, Home/End, or a horizontal swipe. Vertical touch gestures continue scrolling the page. Inactive cards are inert and hidden from assistive technology; the selected card and counter are kept in sync.

To resize the open-frame 3D navigation markers, edit `NAV_SHAPE_SCALE` near the top of `orbital.js`. It is currently `0.75`; `1` is full size and `0.5` is half size. Labels retain their readable CSS font size. Reload the page after saving, using a hard refresh if the browser retains the previous version.

## Contact

The form preserves the existing EmailJS service and template. The public browser key is intentionally client-visible. Delivery depends on that service remaining active and allowing the deployed domain. Failure preserves the visitor's draft and provides a direct email alternative. No real test emails are sent during validation.

## Hosting

Keep the existing GitHub Pages workflow and `CNAME`. Publishing uses the repository's normal deployment process; local edits do not publish the site.

## Xpdite

`Xpdite/` is an independent subsite with its own assets and install scripts. It is outside the portfolio redesign and must remain unchanged. The main portfolio links to the separate Xpdite GitHub project.
