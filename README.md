# Helix – The Future of Website Building   

Create jaw-dropping **3D websites** with AI-powered design guidance and simplicity. Helix lets anyone from solo makers to large teams ship immersive, performant and smoother web experiences in minutes.
  
![Helix Logo](public/logo.png)

---  

## Table of Contents

1. [About Helix](#about-helix)

2. [Live Preview](#live-preview)

3. [Key Features](#key-features)

4. [Tech Stack](#tech-stack)

5. [Getting Started](#getting-started)

6. [Project Structure](#project-structure)

7. [Available Scripts](#available-scripts)

8. [Contributing](#contributing)

9. [License](#license)

10. [Support](#support)

---  

## Live Preview

Experience the landing page live at **https://helix.akashgupta.tech**.

---  

## Key Features

- ⚡️ **AI-Assisted Design** – Receive layout, colour and more suggestions in real-time.
- 📱 **Responsive by Default** – Tailwind-driven utility classes ensure a perfect fit on every device.
- 🚀 **Performance First** – Built on Next.js App Router with Server Components for lightning-fast loads.
- 🛠️ **Export Anywhere** – Deploy to Vercel with one click or generate build files to deploy anywhere.

---  

## About Helix

Helix is an open-source landing page for an upcoming SaaS platform that aims to **democratise 3D website creation**. Powered by AI design recommendations and modern component libraries, Helix removes the barriers between your imagination and the final production site.  

> "Design cosmic grade sites without touching a single line of code." – *The Helix Team*


### Why Helix?

* **AI-Assisted Design** – Receive layout, colour, and copy suggestions generated on-the-fly.

* **Performance First** – Built on top of Next.js App Router & React Server Components for blazing-fast loads.

* **Export Anywhere** – Deploy to Vercel with one click or export fully-typed code bundles.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS, PostCSS |
| Animation | motion/react, GSAP |
| Tooling | PNPM / NPM scripts, Vercel for deployment |

---

## Getting Started

These instructions will set up the project on your local machine for development and testing.


### Prerequisites

- Node.js ^18 (or later)

- pnpm, npm or yarn package manager
  

### Installation

```bash

git  clone  https://github.com/akashwarrior/helix.git

cd  helix

npm  install  # or pnpm install / yarn install

```

### Running the Dev Server

```bash

npm  run  dev  # starts on http://localhost:3000

```

The page hot-reloads as you edit files under `src/`.

  

### Building for Production

```bash

npm  run  build:production

npm  start  # Runs the built app

```

---  

## Project Structure

```
helix/

├─ public/ # assets (logo, icons, favicons)

├─ src/

│ ├─ app/ # Next.js app-router entrypoints

│ │ ├─ layout.tsx # Root layout

│ │ ├─ page.tsx # Landing page

│ │ └─ ... # Loading, error boundaries

│ ├─ components/ # Reusable React components

│ ├─ utils/ # Helper utilities & animation configs

│ ├─ global.css # (Tailwind CSS)

├─ eslint.config.mjs # Lint rules

└─ next.config.ts # Framework config

```

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Start the development server |
| `build` | Create an optimised production build |
| `start` | Serve the production build |
| `lint` | Run ESLint & TypeScript checks |

---    

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository

2. Create your feature branch (`git checkout -b feat/some-feature`)

3. Commit your changes (`git commit -m 'feat: add some feature'`)

4. Push to the branch (`git push origin feat/some-feature`)

5. Open a Pull Request

See the [open issues](https://github.com/akashwarrior/helix/issues) for a full list of proposed features (and known issues).

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---  

## Support

If you enjoy this project and would like to support its development, please ⭐ star the repo and share it with others.


For inquiries, ping `@skyGuptaCS` on X.