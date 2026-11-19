import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProjectGroups, readMarkdown, sections } from '../src/contentUtils.js'

test('readMarkdown parses frontmatter and body', () => {
  const result = readMarkdown('---\ntitle: Profile\nrole: CTO\n---\n\n# Intro', 'en', 'profile')
  assert.deepEqual(result.meta, { title: 'Profile', role: 'CTO' })
  assert.equal(result.body, '# Intro')
})

test('readMarkdown rejects invalid frontmatter', () => {
  assert.throws(() => readMarkdown('title: Missing', 'fr', 'profile'), /Invalid frontmatter/)
})

test('sections parses Markdown section headings', () => {
  const result = sections('## One\nFirst\n## Two\nSecond')
  assert.deepEqual(result, [
    { title: 'One', lines: 'First' },
    { title: 'Two', lines: 'Second' },
  ])
})

test('parseProjectGroups parses project roles', () => {
  const result = parseProjectGroups('## Cloud\n### Migration\nRôle : Architecte\nMigrated workloads.')
  assert.equal(result[0].title, 'Cloud')
  assert.equal(result[0].projects[0].title, 'Migration')
  assert.equal(result[0].projects[0].role, 'Architecte')
  assert.equal(result[0].projects[0].description, 'Migrated workloads.')
})
