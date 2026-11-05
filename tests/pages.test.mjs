import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const base = '/txlf2026/'
const output = new URL('../dist/', import.meta.url)

/** Check that the generated entry point loads assets from the project site. */
test('Pages entry assets use the repository base and exist in dist', async () => {
  // Arrange
  const html = await readFile(new URL('index.html', output), 'utf8')

  // Act
  const assets = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)]
    .map(match => match[1])
    .filter(asset => !/^(?:[a-z]+:|\/\/)/i.test(asset))

  // Assert
  assert.ok(assets.some(asset => asset.endsWith('.js')), 'Expected a JavaScript entry point')
  assert.ok(assets.some(asset => asset.endsWith('.css')), 'Expected a stylesheet')
  for (const asset of assets) {
    assert.ok(asset.startsWith(base), `Asset is outside ${base}: ${asset}`)
    await access(new URL(asset.slice(base.length), output))
  }
})

/** Preserve Slidev's fallback for direct links to individual slides on Pages. */
test('Pages 404 fallback matches the Slidev entry point', async () => {
  // Arrange
  const html = await readFile(new URL('index.html', output), 'utf8')

  // Act
  const fallback = await readFile(new URL('404.html', output), 'utf8')

  // Assert
  assert.equal(fallback, html)
})
