# Thou Shalt Not Make a Machine in the Likeness of a Senior Engineer

Major Hayden, Texas Linux Fest, November 7, 2026.

[View the slides](https://major.github.io/txlf2026/).

## Local development

Use Node.js 22.12.0 or newer. CI uses Node.js 26 LTS.

```sh
npm ci
npm run dev
```

Open http://localhost:3030/. Edit `slides.md`, `style.css`, and `public/images` to update the presentation.

## Production validation

```sh
npm run build -- --base /txlf2026/
node --test tests/pages.test.mjs
npx vite preview --base /txlf2026/
```

Open http://localhost:4173/txlf2026/ to preview the production build. The tests check entry asset base paths and existence, and the Slidev 404 fallback. They are not full browser tests.

## Deployment

Pushes to `main` deploy automatically. Pull requests targeting `main` build and test without deploying. The workflow can also be run manually on `main`. The repository's Pages settings already use GitHub Actions as the source.

The official artifact workflow builds and uploads only `dist`. It needs no `gh-pages` branch or custom token. See the [Slidev GitHub Pages guide](https://sli.dev/guide/hosting#github-pages). Actions are pinned to commit SHAs, and Dependabot checks them weekly for updates.

## Licenses

The repository's [LICENSE](LICENSE) is Apache-2.0. The slides declare CC-BY-SA. Third-party images are credited in the slides and retain their own licenses. Reference EPUBs stay local and are not published.
