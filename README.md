# Aiman — Personal Portfolio

A modern, high-performance personal portfolio built with Next.js 14, Framer Motion, and Tailwind CSS. Designed mobile-first with fluid animations, an interactive workflow canvas, and a custom cursor experience.

**Live:** [oldarkk.github.io/Portfolio](https://oldarkk.github.io/Portfolio) &nbsp;·&nbsp; **By:** [Mohamad Aiman](https://github.com/Oldarkk)

---

## Preview

> Full-stack developer and founder based in Miri, Sarawak. Currently building [SERVIS.MY](https://servis.my) and leading [Scribear](https://scribear.my).

---

## Features

- **Scramble hero text** — letter-scramble animation on the name, repels on mouse hover (desktop)
- **Interactive Rubik's Cube** — 3D CSS cube you can scramble and solve in the browser
- **Workflow career canvas** — N8n-style draggable node canvas for experience, with a detail modal
- **Scroll-driven skill rows** — two rows of tech stack cards that drift opposite directions on scroll
- **Projects table** — expandable rows with a full-section background image transition
- **Mobile dock** — iOS-style bottom navigation bar with active section tracking
- **Custom cursor** — difference blend-mode cursor on desktop, hidden on mobile
- **Smooth scroll** — Lenis for buttery-smooth native-feeling scroll
- **Zero layout shift** — `overflow-x: hidden` on both `html` and `body`, mobile-first breakpoints

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Fonts | Space Grotesk · Inter (Google Fonts) |
| Deployment | GitHub Pages / Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/Oldarkk/Portfolio.git
cd Portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
Portfolio/
├── app/
│   ├── globals.css       # Base styles, fonts, Lenis config
│   ├── layout.tsx        # Root layout with custom cursor + scroll
│   └── page.tsx          # Page composition
├── components/
│   ├── Hero.tsx          # Scramble text + Rubik's Cube
│   ├── About.tsx         # Bio, stats, profile image
│   ├── Skills.tsx        # Scroll-driven draggable tech rows
│   ├── Projects.tsx      # Expandable project table
│   ├── Experience.tsx    # Draggable workflow canvas + modal
│   ├── Contact.tsx       # Email copy + social links
│   ├── Navbar.tsx        # Hamburger overlay menu (desktop)
│   ├── MobileDock.tsx    # Fixed bottom dock (mobile)
│   └── ui/               # Reusable primitives
├── hooks/                # useMediaQuery, useMousePosition
├── lib/                  # Utilities
└── public/               # Static assets
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — zero config needed for Next.js

### GitHub Pages

1. Add `output: 'export'` to `next.config.ts`
2. Run `npm run build` — output goes to `/out`
3. Enable Pages in repo Settings → Pages → deploy from `/out`

---

## Contact

| | |
|---|---|
| Email | [mohdaimnn@gmail.com](mailto:mohdaimnn@gmail.com) |
| GitHub | [@Oldarkk](https://github.com/Oldarkk) |
| LinkedIn | [mohdaimnn](https://linkedin.com/in/mohdaimnn) |
| WhatsApp | [+60 17-808 6586](https://wa.me/601780865862) |

---

## License

MIT — feel free to use this as a reference or starting point. Credit appreciated but not required.
