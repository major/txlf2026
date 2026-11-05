import assert from 'node:assert/strict'
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))

/** Run Make without starting servers or installing packages in contract tests. */
function runMake(args, cwd = root) {
  const result = spawnSync('make', ['--no-print-directory', 'NPM=npm', 'ARGS=', 'BUILD_ARGS=', ...args],
    { cwd, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.error?.message)
  return result.stdout
}

/** Keep a fresh clone's default command informative and free of side effects. */
test('make defaults to help with installation and update instructions', () => {
  // Act
  const output = runMake([])

  // Assert
  assert.match(output, /\binstall\b/)
  assert.match(output, /\bupdate\b/)
})

/** Check command dispatch without running downloads, servers, or browsers. */
test('Make targets wrap the project commands and keep exports under dist', () => {
  // Arrange
  const commands = [
    'npm ci',
    'npm update',
    'npm run dev --',
    'npm run build -- --base /txlf2026/',
    'npm exec -- vite preview --base /txlf2026/',
    'node --test tests/*.test.mjs',
    'npm run export -- --output dist/slides.pdf',
    'npm run export -- --format png --output dist/export-png',
    'npm run export -- --format pptx --output dist/slides.pptx',
    'npm exec -- playwright install chromium',
    'npm exec -- playwright install-deps chromium',
  ]

  // Act
  const output = runMake(['-n', 'install', 'update', 'dev', 'build', 'preview', 'test',
    'export', 'export-png', 'export-pptx', 'browser', 'browser-deps'])

  // Assert
  for (const command of commands) {
    assert.ok(output.includes(command), `Missing command: ${command}`)
  }
})

/** Preview-only flags must not leak into the prerequisite production build. */
test('preview forwards arguments and the npm override without changing build flags', () => {
  // Act
  const output = runMake(['-n', 'preview', 'NPM=custom-npm', 'ARGS=--host 127.0.0.1'])

  // Assert
  const build = output.split('\n').find(line => line.includes('run build'))
  assert.ok(build, 'Preview must build before serving')
  assert.match(build, /custom-npm run build -- --base \/txlf2026\//)
  assert.doesNotMatch(build, /--host/)
  assert.ok(output.includes('custom-npm exec -- vite preview --base /txlf2026/ --host 127.0.0.1'))
})

/** Clean only disposable output, including when the output is already absent. */
test('clean preserves slides and installed dependencies', async (t) => {
  // Arrange
  const fixture = await mkdtemp(join(tmpdir(), 'slidev-makefile-'))
  t.after(() => rm(fixture, { recursive: true, force: true }))
  await writeFile(join(fixture, 'Makefile'), await readFile(join(root, 'Makefile')))
  await mkdir(join(fixture, 'dist'))
  await mkdir(join(fixture, 'node_modules'))
  await writeFile(join(fixture, 'dist', 'index.html'), 'generated')
  await writeFile(join(fixture, 'slides.md'), 'presentation')
  await writeFile(join(fixture, 'node_modules', 'sentinel'), 'installed')

  // Act
  runMake(['clean'], fixture)
  runMake(['clean'], fixture)

  // Assert
  await assert.rejects(access(join(fixture, 'dist')), { code: 'ENOENT' })
  assert.equal(await readFile(join(fixture, 'slides.md'), 'utf8'), 'presentation')
  assert.equal(await readFile(join(fixture, 'node_modules', 'sentinel'), 'utf8'), 'installed')
})
