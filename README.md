# wasm-demo — PNA × WebAssembly (Next.js) sample

Run [Portable Network Archive (PNA)](https://portable-network-archive.github.io/Portable-Network-Archive-Specification/) entirely in the browser via WebAssembly. No files are uploaded to any server.

**Live demo:** https://portable-network-archive.github.io/wasm-demo/

This repository is a sample of wiring Rust (`libpna`) → `wasm-pack` → Next.js (static export), as well as an introduction to the PNA format itself.

## What you can do

- Create a `.pna` archive in the browser (`/create/`): Zstandard compression, optional solid mode, optional password encryption (`aes` / `camellia`, CTR mode)
- Extract a `.pna` archive in the browser (`/extract/`): runs in a Web Worker, prompts for a password only when the archive is encrypted

## Prerequisites

- Node.js 24 (see `engines` in `package.json`)
- Rust 1.90
- wasm-pack (install via `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`)
- Chromium dependencies for Playwright e2e (`npx playwright install chromium --with-deps`)

## Quick start

The `pna` npm dependency is `file:./pna_wasm/pkg`, which is generated and gitignored. Always build WASM first — on a clean checkout `npm install` fails without `pkg/`:

```bash
npm run build:wasm   # cd pna_wasm && wasm-pack build --target web --release
npm install
npm run build        # static export to out/
npx serve out -l 3000
```

Then open http://localhost:3000/ (create: `/create/`, extract: `/extract/`).

For development (needs `pkg/` built first):

```bash
npm run dev
```

## Usage

- **Create:** open `/create/`, drop files (or pick them), optionally enable solid mode and/or password + algorithm (`aes` or `camellia`), create the archive, then download the resulting `.pna`.
- **Extract:** open `/extract/`, drop a `.pna` file. If it is encrypted you are asked for the password, then each entry is extracted in the Worker and offered as a download. Nothing leaves your browser.

## Gotchas

- **Build order:** `build:wasm` → `npm install` → `build`. If `node_modules` was installed before `pkg/` existed, rerun `npm install` after `build:wasm`.
- **`BASE_PATH`:** `next.config.js` sets `basePath` from `BASE_PATH`. Only CI sets it for GitHub Pages. Never set it locally or for e2e.
- **Preview prod builds** with `npx serve out -l 3000`, never `npm start` (`output: export` has no server).
- **e2e:** always `npm run build` immediately before `npm run test:e2e` — Playwright reuses an existing server and will otherwise test a stale `out/`. Stop anything on `:3000` first.
- **Generated dirs:** never hand-edit `docs/`, `out/`, `.next/`, or `pna_wasm/pkg/`.

## Contributing

Your feedback and contributions are welcome!

## License

The WASM binding in `pna_wasm/` is MIT (see `pna_wasm/LICENSE_MIT`).

## Related links

- [PNA Specification](https://portable-network-archive.github.io/Portable-Network-Archive-Specification/)
- [libpna API docs (docs.rs)](https://docs.rs/libpna/)
- [PNA CLI](https://github.com/ChanTsune/Portable-Network-Archive)
- [PNA organization](https://github.com/Portable-Network-Archive/)
- [Demo source](https://github.com/Portable-Network-Archive/wasm-demo)
