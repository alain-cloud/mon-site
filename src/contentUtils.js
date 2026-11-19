export function readMarkdown(source, language, name) {
  if (!source) {
    throw new Error(`Missing ${language}/${name}.md content`)
  }

  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) {
    throw new Error(`Invalid frontmatter in ${language}/${name}.md`)
  }

  const [, frontmatter = '', body = ''] = match
  const meta = Object.fromEntries(frontmatter.split('\n').filter(Boolean).map((line) => {
    const separator = line.indexOf(':')
    if (separator < 1) {
      throw new Error(`Invalid frontmatter line in ${language}/${name}.md`)
    }
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
  }))

  return { meta, body }
}

export function sections(body) {
  return body.split(/^##\s+/m).slice(1).map((section) => {
    const [title, ...lines] = section.split('\n')
    return { title: title.trim(), lines: lines.join('\n').trim() }
  })
}

export function parseProjectGroups(body) {
  return body.split(/^##\s+/m).slice(1).map((group) => {
    const [heading, ...projectSections] = group.split(/^###\s+/m)
    const title = heading.split('\n')[0].trim()
    const projects = projectSections.map((project) => {
      const [projectTitle, ...rest] = project.split('\n')
      const lines = rest.map((line) => line.trim()).filter(Boolean)
      const role = (lines.shift() || '').replace(/^(Role|Rôle)\s*:\s*/, '')
      return { title: projectTitle.trim(), role, description: lines.join(' ') }
    })
    return { title, projects }
  })
}
