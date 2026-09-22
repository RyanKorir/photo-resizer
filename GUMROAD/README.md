# PixelForge — Photo Editor Source Code

Thank you for purchasing PixelForge! Here is everything you need to know to get started.

---

## What You Got

The complete source code for PixelForge — a professional, fully browser-based photo editor built with modern web technologies. No bloat, no third-party image SDKs, no vendor lock-in.

**Live demo:** https://photo-resizer-b3sxuev95-ryankorir00-4850s-projects.vercel.app

---

## Features

- **11 Adjustment sliders** — brightness, contrast, highlights, shadows, saturation, temperature, hue, blur, vignette, grayscale, sepia
- **12 Filter presets** — Vivid, Warm, Cool, B&W, Sepia, Fade, Dramatic, Matte, Vintage, Lush, Cinematic, Original
- **Interactive crop** — drag handles, rule-of-thirds grid, 7 aspect ratio presets
- **Resize** — aspect lock, % scale presets, 10 social media size presets (Instagram, Twitter, LinkedIn, YouTube, etc.)
- **Transform** — rotate 90°/180°/270°, flip horizontal and vertical
- **Export** — PNG, JPEG, WebP with quality slider
- **30-step undo/redo** — Ctrl+Z / Ctrl+Y
- **Right panel** — live preview + active adjustments list
- **Drag & drop** image loading
- **Keyboard shortcuts** — +/- zoom, 0 reset view, Ctrl+S export
- **Landing page** — SEO-optimised homepage with features, stats, CTAs
- **Privacy Policy + Terms of Service** — ready to publish

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Image processing | HTML5 Canvas API (no third-party SDK) |
| Icons | Lucide React |
| Hosting | Vercel (one-command deploy) |

**Zero external dependencies for image editing.** Everything uses the browser's built-in Canvas API.

---

## Quick Start

```bash
# 1. Extract the zip
cd photo-resizer

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev

# Open http://localhost:3000
```

---

## Deploy to Vercel (2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel deploy --prod
```

Or connect the GitHub repo to Vercel at vercel.com and it deploys automatically on every push.

---

## Project Structure

```
app/
├── page.tsx              # Landing page (homepage)
├── editor/
│   └── page.tsx          # The full photo editor
├── privacy/
│   └── page.tsx          # Privacy Policy
├── terms/
│   └── page.tsx          # Terms of Service
├── layout.tsx            # Root layout + SEO metadata
├── globals.css           # Design system (CSS variables, components)
├── components/
│   ├── AdjustmentSlider.tsx
│   └── Toast.tsx
├── hooks/
│   └── useHistory.ts     # 30-step undo/redo
└── lib/
    └── imageUtils.ts     # All Canvas API image processing
```

---

## Customising

### Change brand name / colours

Edit `app/globals.css` — the entire design uses CSS custom properties:

```css
:root {
  --bg: #0f0f11;
  --accent: #6c63ff;       /* ← change this to your brand colour */
  --surface: #18181c;
  /* ... */
}
```

### Update legal pages

Edit `app/privacy/page.tsx` and `app/terms/page.tsx` — change the `CONTACT_EMAIL` and `EFFECTIVE_DATE` constants at the top of each file.

### Add your Gumroad link

In `app/page.tsx`, update the `GUMROAD_URL` constant:

```ts
const GUMROAD_URL = 'https://yourusername.gumroad.com/l/yourproduct'
```

### Add a real domain

In Vercel dashboard → Project Settings → Domains, add your custom domain. Update the `CONTACT_EMAIL` and any hardcoded URLs in the legal pages.

---

## Licence

This source code is licensed for use in **one** deployed product per purchase.

✅ You **may**:
- Use this code to build and deploy your own product
- Modify the code however you like
- Use it for commercial projects

❌ You **may not**:
- Resell or redistribute the source code itself
- Use it in more than one deployed product without purchasing additional licences
- Remove author attribution from legal pages without adding your own

---

## Support

Questions? Email: ryankorir00@gmail.com

Response time: within 48 hours on weekdays.

---

Built by **Ryan Korir** — Kenya 🇰🇪
