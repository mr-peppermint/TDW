# Theta Division — Landing Page

Premium landing page for **thetadivision.dpdns.org** featuring the `LightPillar` WebGL effect, animated hex grid, and a fully modular component architecture.

---

## Project Structure

```
theta-division/
├── index.html                          # Entry HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx                        # React entry point
    ├── App.tsx                         # Root composition
    ├── styles/
    │   ├── globals.css                 # Design tokens, reset, fonts
    │   └── app.css                     # Page layout layers
    └── components/
        ├── LightPillar/
        │   ├── LightPillar.tsx         # WebGL three.js shader effect
        │   ├── LightPillar.css
        │   └── index.ts
        ├── HexGrid/
        │   ├── HexGrid.tsx             # SVG hex background + hero hex
        │   ├── HexGrid.css
        │   └── index.ts
        ├── Navbar/
        │   ├── Navbar.tsx              # Top bar: brand left, status right
        │   ├── Navbar.css
        │   └── index.ts
        ├── StatusIndicator/
        │   ├── StatusIndicator.tsx     # Green pulsing dot
        │   ├── StatusIndicator.css
        │   └── index.ts
        ├── CenterHero/
        │   ├── CenterHero.tsx          # "Dixit" center lockup
        │   ├── CenterHero.css
        │   └── index.ts
        └── ProceedButton/
            ├── ProceedButton.tsx       # Bottom CTA → /dashboard
            ├── ProceedButton.css
            └── index.ts
```

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--td-obsidian` | `#04040A` | Page background |
| `--td-violet` | `#5227FF` | Primary accent, borders, glow |
| `--td-rose` | `#FF9FFC` | Gradient bottom, hover accent |
| `--td-green` | `#00FF88` | Status indicator (operational) |
| `--td-white` | `#F0EFF8` | Primary text |
| `--font-display` | Syne 800 | Hero name "Dixit" |
| `--font-body` | Space Grotesk | Body, labels |
| `--font-mono` | JetBrains Mono | Eyebrow, button, tags |

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production
```bash
npm run build
npm run preview
```

---

## Layer Stack (z-index)

| z | Layer | Component |
|---|---|---|
| 0 | WebGL light pillar | `LightPillar` |
| 1–2 | Hex grid (BG + hero hex) | `HexGrid` |
| 5 | Vignette radial gradient | `app__vignette` |
| 6 | CRT scan lines | `app__scanline` |
| 10 | Center hero text | `CenterHero` |
| 100 | Navbar + Proceed bar | `Navbar`, `ProceedButton` |

---

## Customisation

- **Colors** — edit `src/styles/globals.css` `:root` block
- **Hero name** — change `"Dixit"` in `CenterHero.tsx`
- **Dashboard URL** — update `href` in `App.tsx` `<ProceedButton>`
- **Pillar appearance** — tune props on `<LightPillar>` in `App.tsx`
- **Status** — pass `status="warning"` or `"offline"` to `<StatusIndicator>`
