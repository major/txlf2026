# Thou Shalt Not Make a Machine in the Likeness of a Senior Engineer

Major Hayden, Texas Linux Fest, November 7, 2026.

[View the slides](https://major.github.io/txlf2026/).

## Local development

Use GNU Make, a POSIX shell, and Node.js 22.22.0 or newer. Node.js 26 LTS is recommended and used in CI. Linux and macOS are supported; on Windows, use WSL.

```sh
git clone git@github.com:major/txlf2026.git
cd txlf2026
make install
make dev
```

Open http://localhost:3030/. Edit `slides.md`, `style.css`, and `public/images` to update the presentation. Installation uses `npm ci`; browser setup for exports is described below.

### Make commands

| Command | Purpose |
| --- | --- |
| `make help` | Show commands and variables (also the default). |
| `make install` | Install locked dependencies. |
| `make update` | Update dependencies according to `package.json`. |
| `make dev` | Start the development server. |
| `make build` | Build for GitHub Pages. |
| `make preview` | Build and preview the production site. |
| `make test` | Build and run all tests. |
| `make export` | Export a PDF to `dist/slides.pdf`. |
| `make export-png` | Export PNG images to `dist/export-png`. |
| `make export-pptx` | Export PowerPoint to `dist/slides.pptx`. |
| `make browser` | Install or repair Chromium for exports. |
| `make browser-deps` | Install missing Linux libraries for Chromium. |
| `make clean` | Remove `dist`. |

`make update` follows the specifications in `package.json`. Theme dependencies use `latest` and can jump major versions. Review the `package.json` and `package-lock.json` diffs, run `make test`, and commit intentional changes.

Before the first export, run `make browser` to install the matching Chromium browser. Some npm configurations skip installation scripts, so `npm ci` may not download it automatically. Run the same command after updating Playwright or if Chromium needs repair. If Linux libraries are missing, run `make browser-deps`; this is optional and may request sudo access. It is not part of normal installation.

Pass extra options with `ARGS` or build-specific options with `BUILD_ARGS`:

```sh
make preview ARGS='--host 127.0.0.1'
make export ARGS='--per-slide --range 1-3'
make build BUILD_ARGS='--without-notes'
```

With the locked Slidev version, use `--per-slide` when exporting a limited PDF range. This mode can break cross-slide links and the table of contents.

All exports are disposable and stored under `dist`. A build, test, preview, or clean can erase previous exports.

## Production validation

```sh
make test
make preview
```

Open http://localhost:4173/txlf2026/ to preview the production build. The tests check entry asset base paths and existence, and the Slidev 404 fallback. They are not full browser tests.

## Deployment

Pushes to `main` deploy automatically. Pull requests targeting `main` build and test without deploying. The workflow can also be run manually on `main`. The repository's Pages settings already use GitHub Actions as the source.

The official artifact workflow builds and uploads only `dist`. It needs no `gh-pages` branch or custom token. See the [Slidev GitHub Pages guide](https://sli.dev/guide/hosting#github-pages). Actions are pinned to commit SHAs, and Dependabot checks them weekly for updates.

## Licenses

The repository's [LICENSE](LICENSE) is Apache-2.0. The slides declare CC-BY-SA. Third-party images are credited in the slides and retain their own licenses. Reference EPUBs stay local and are not published.
