import { useEffect, useState } from 'react'
import './App.css'

const mdFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true })
const sectionIds = ['about', 'expertise', 'community', 'experience', 'credentials', 'contact']

function readMarkdown(language, name) {
  const source = mdFiles[`../content/${language}/${name}.md`]
  const [, frontmatter = '', body = ''] = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/) || []
  const meta = Object.fromEntries(frontmatter.split('\n').filter(Boolean).map((line) => {
    const split = line.indexOf(':')
    return [line.slice(0, split), line.slice(split + 1).trim()]
  }))
  return { meta, body }
}

function sections(body) {
  return body.split(/^##\s+/m).slice(1).map((section) => {
    const [title, ...lines] = section.split('\n')
    return { title: title.trim(), lines: lines.join('\n').trim() }
  })
}

function parseProjectGroups(body) {
  return body.split(/^##\s+/m).slice(1).map((group) => {
    const [heading, ...projectSections] = group.split(/^###\s+/m)
    const title = heading.split('\n')[0].trim()
    const projects = projectSections.map((project) => {
      const [projectTitle, ...rest] = project.split('\n')
      const lines = rest.map((line) => line.trim()).filter(Boolean)
      const role = (lines.shift() || '').replace(/^(Role|Rôle):\s*/, '')
      return { title: projectTitle.trim(), role, description: lines.join(' ') }
    })
    return { title, projects }
  })
}

function ProjectDetails({ groups, toggleLabel, roleLabel }) {
  if (!groups?.length) return null
  return <details className="job-projects"><summary>{toggleLabel}</summary><div className="project-groups">{groups.map((group) => <section className="project-group" key={group.title}><h4>{group.title}</h4>{group.projects.map((project) => <details className="project-entry" key={project.title}><summary>{project.title}</summary><div className="project-entry-body"><p><strong>{roleLabel} :</strong> {project.role}</p><p>{project.description}</p></div></details>)}</section>)}</div></details>
}

const employerBrands = [
  { match: 'Fujitsu', slug: 'fujitsu', initials: 'F' },
  { match: 'Desjardins', initials: 'D' },
  { match: 'Cortex', initials: 'CGH' },
  { match: 'Lumenpulse', initials: 'LP' },
  { match: 'CA Technologies', initials: 'CA' },
  { match: 'Sopra HR Software', initials: 'S' },
  { match: 'Orange Business Services', slug: 'orange', initials: 'O' },
  { match: 'Dell Technologies', slug: 'dell', initials: 'D' },
  { match: 'Printing & Packaging Solutions', initials: 'P&P' },
  { match: 'Groupe Beneteau', initials: 'B' },
]

function BrandLogo({ slug, initials, label, className = '' }) {
  const [failed, setFailed] = useState(!slug)
  return <span className={`brand-logo ${className} ${failed ? 'brand-logo-fallback' : ''}`} aria-hidden="true" title={label}>
    {slug && !failed && <img src={`${import.meta.env.BASE_URL}logos/${slug}.svg`} alt="" loading="lazy" onError={() => setFailed(true)} />}
    {failed && <span aria-hidden="true">{initials}</span>}
  </span>
}

function employerBrand(company) {
  return employerBrands.find((brand) => company.startsWith(brand.match)) || { initials: company.slice(0, 2).toUpperCase() }
}

function certificationBrand(cert) {
  if (/anthropic|claude/i.test(cert)) return { slug: 'anthropic', initials: 'A', label: 'Anthropic' }
  if (/microsoft|azure/i.test(cert)) return { slug: 'microsoft', initials: 'MS', label: 'Microsoft' }
  if (/dell/i.test(cert)) return { slug: 'dell', initials: 'D', label: 'Dell Technologies' }
  if (/linux foundation|finops/i.test(cert)) return { slug: 'linuxfoundation', initials: 'LF', label: 'The Linux Foundation' }
  if (/amazon web services|\baws\b/i.test(cert)) return { slug: 'amazonaws', initials: 'AWS', label: 'Amazon Web Services' }
  if (/citrix/i.test(cert)) return { slug: 'citrix', initials: 'C', label: 'Citrix' }
  if (/cisco|\bccna\b/i.test(cert)) return { slug: 'cisco', initials: 'C', label: 'Cisco' }
  if (/xm cyber/i.test(cert)) return { initials: 'XM', label: 'XM Cyber' }
  if (/open group|togaf/i.test(cert)) return { initials: 'OG', label: 'The Open Group' }
  if (/exin|\bitil\b/i.test(cert)) return { initials: 'EX', label: 'EXIN' }
  return { initials: cert.slice(0, 2).toUpperCase(), label: cert }
}

function loadContent(language) {
  const profile = readMarkdown(language, 'profile').meta
  const impact = readMarkdown(language, 'impact')
  const expertise = readMarkdown(language, 'expertise')
  const experience = readMarkdown(language, 'experience')
  const credentials = readMarkdown(language, 'credentials')
  const community = readMarkdown(language, 'community').meta
  const fujitsuProjects = readMarkdown(language, 'fujitsu-projects')
  const careerProjects = readMarkdown(language, 'career-projects')
  const contact = readMarkdown(language, 'contact').meta
  const clean = (value) => value.replaceAll('**', '')
  const impactItems = sections(impact.body).map(({ title, lines }) => [title, lines])
  const expertiseItems = sections(expertise.body).map(({ title, lines }, index) => [String(index + 1).padStart(2, '0'), title, lines])
  const jobs = sections(experience.body).map(({ title: company, lines }) => {
    const [date = '', roles = '', ...description] = lines.split('\n').filter(Boolean)
    return { company, date, title: clean(roles), text: description.join(' ') }
  })
  const projectGroups = parseProjectGroups(fujitsuProjects.body)
  const careerProjectGroups = parseProjectGroups(careerProjects.body)
  const credentialSections = sections(credentials.body)
  const getCredential = (name) => credentialSections.find((section) => section.title === name)
  const certs = getCredential('Certifications').lines.split('\n').filter(Boolean).map((line) => line.replace(/^- /, ''))
  const credentialHeadings = {
    en: ['Education', 'Languages', 'Recognition'],
    fr: ['Formation', 'Langues', 'Distinction'],
    es: ['Formación', 'Idiomas', 'Reconocimientos'],
    ar: ['التعليم', 'اللغات', 'التقدير'],
  }
  const [educationHeading, languagesHeading, recognitionHeading] = credentialHeadings[language]
  const education = getCredential(educationHeading)
  const languages = getCredential(languagesHeading)
  const recognition = getCredential(recognitionHeading)
  return {
    ...profile, available: profile.badge, based: profile.location, heroLead: profile.lead, heroAccent: profile.accent,
    impactLabel: impact.meta.eyebrow, impactTitle: impact.meta.title, impacts: impactItems,
    expertiseEyebrow: expertise.meta.eyebrow, expertiseTitle: expertise.meta.title,
    expertiseIntro: expertise.meta.intro, expertise: expertiseItems,
    experienceEyebrow: experience.meta.eyebrow, experienceTitle: experience.meta.title,
    experienceIntro: experience.meta.intro, experienceDetailsLabel: experience.meta.detailsLabel, jobs,
    projectsToggleLabel: fujitsuProjects.meta.toggleLabel, projectRoleLabel: fujitsuProjects.meta.roleLabel, projectGroups,
    careerProjectsToggleLabel: careerProjects.meta.toggleLabel, careerProjectRoleLabel: careerProjects.meta.roleLabel, careerProjectGroups,
    credentialsEyebrow: credentials.meta.eyebrow, credentialsTitle: credentials.meta.title,
    certs, education: credentials.meta.educationLabel, educationText: education.lines.split('\n').map((line) => line.replace(/^- /, '')).join('\n'),
    credentialsIntro: credentials.meta.intro,
    languages: credentials.meta.languagesLabel, languageText: languages.lines.split('\n').map((line) => line.replace(/^- /, '')).join('\n'),
    recognition: credentials.meta.recognitionLabel, recognitionText: recognition.lines.replace(/^- /, ''),
    closingEyebrow: contact.eyebrow, closingTitle: contact.title, closingText: contact.text,
    email: contact.emailLabel, emailCta: contact.emailCta, emailAddress: contact.email, linkedin: contact.linkedinLabel, footer: contact.footer,
    telegramUrl: `https://t.me/${contact.telegramUsername}`, telegramLabel: contact.telegramLabel,
    shareLabel: contact.shareLabel, copyLinkLabel: contact.copyLinkLabel, copiedLabel: contact.copiedLabel,
    shareEyebrow: contact.shareEyebrow, shareTitle: contact.shareTitle, shareHelper: contact.shareHelper,
    communityEyebrow: community.eyebrow, communityTitle: community.title, communityIntro: community.intro,
    articleTitle: community.articleTitle, articleDate: community.articleDate, articleSource: community.articleSource,
    articleDescription: community.articleDescription, articleUrl: community.articleUrl,
    videosTitle: community.videosTitle, videoOneTitle: community.videoOneTitle, videoOneId: community.videoOneId,
    videoOneDuration: community.videoOneDuration, videoTwoTitle: community.videoTwoTitle, videoTwoId: community.videoTwoId,
    videoTwoDuration: community.videoTwoDuration, videoLinkLabel: community.videoLinkLabel, articleLinkLabel: community.articleLinkLabel,
  }
}

const content = {
  en: loadContent('en'),
  fr: loadContent('fr'),
  es: loadContent('es'),
  ar: loadContent('ar'),
}

async function downloadCv(language, data) {
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib || {}
  if (!PDFDocument) throw new Error('PDF generator is unavailable')
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.035, 0.12, 0.27)
  const blue = rgb(0.08, 0.35, 0.70)
  const ink = rgb(0.12, 0.17, 0.24)
  const muted = rgb(0.38, 0.43, 0.49)
  const W = 595.28; const H = 841.89; const margin = 48
  let page; let y
  const addPage = (first = false) => {
    page = pdf.addPage([W, H]); y = H - margin
    if (first) {
      page.drawRectangle({ x: 0, y: H - 155, width: W, height: 155, color: navy })
      page.drawText('ALAEDDINE NAJJAR', { x: margin, y: H - 57, size: 25, font: bold, color: rgb(1, 1, 1) })
      page.drawText(data.role, { x: margin, y: H - 84, size: 10, font: regular, color: rgb(0.78, 0.87, 0.98), maxWidth: W - margin * 2 })
      page.drawText(`${data.emailAddress}  ·  ${data.location}  ·  LinkedIn: linkedin.com/in/alaeddinenajjar`, { x: margin, y: H - 111, size: 8, font: regular, color: rgb(1, 1, 1), maxWidth: W - margin * 2 })
      y = H - 180
    } else y = H - margin
  }
  const normalize = (value) => String(value).replace(/[–—]/g, '-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/·/g, ' | ')
  const linesFor = (value, font, size, maxWidth) => {
    const words = normalize(value).split(/\s+/); const lines = []; let line = ''
    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (line && font.widthOfTextAtSize(next, size) > maxWidth) { lines.push(line); line = word } else line = next
    }
    if (line) lines.push(line)
    return lines
  }
  const text = (value, size = 9, font = regular, color = ink, indent = 0) => {
    const maxWidth = W - margin * 2 - indent
    const lines = linesFor(value, font, size, maxWidth)
    if (y - lines.length * (size + 3) < 45) addPage()
    for (const line of lines) { page.drawText(line, { x: margin + indent, y, size, font, color }); y -= size + 3 }
    y -= 3
  }
  const heading = (label) => {
    if (y < 80) addPage()
    y -= 6; page.drawText(normalize(label).toUpperCase(), { x: margin, y, size: 10, font: bold, color: blue }); y -= 17
  }
  addPage(true)
  text(data.intro, 9, regular, ink)
  heading(({ fr: 'Résultats mesurables', es: 'Resultados destacados', ar: 'أبرز النتائج' })[language] || 'Selected impact')
  for (const [metric, description] of data.impacts) text(`${metric}  ${description}`, 9, regular, ink, 8)
  heading(({ fr: 'Expertise', es: 'Áreas de especialidad', ar: 'مجالات الخبرة' })[language] || 'Expertise')
  for (const [, title, description] of data.expertise) text(`${title}: ${description}`, 9, regular, ink, 8)
  heading(({ fr: 'Expérience professionnelle', es: 'Experiencia profesional', ar: 'الخبرة المهنية' })[language] || 'Professional experience')
  for (const job of data.jobs) {
    text(`${job.company}  |  ${job.date}`, 10, bold, navy)
    text(job.title, 9, bold, ink, 8)
    text(job.text, 8.5, regular, muted, 8)
  }
  heading(({ fr: 'Projets et réalisations sélectionnés', es: 'Proyectos y contribuciones destacados', ar: 'أبرز المشاريع والمساهمات' })[language] || 'Selected projects and contributions')
  for (const group of [...data.projectGroups, ...data.careerProjectGroups]) {
    text(group.title, 10, bold, navy)
    for (const project of group.projects) {
      text(project.title, 9, bold, ink, 8)
      text(`${({ fr: 'Rôle', es: 'Función', ar: 'الدور' })[language] || 'Role'}: ${project.role}`, 8.5, bold, muted, 14)
      text(project.description, 8.5, regular, ink, 14)
    }
  }
  heading(({ fr: 'Prises de parole et contributions', es: 'Charlas y contribuciones a la comunidad', ar: 'المشاركات والمساهمات المجتمعية' })[language] || 'Speaking and community contributions')
  text(`${data.articleTitle} · ${data.articleSource} · ${data.articleDate}`, 9, bold, navy)
  text(data.articleDescription, 8.5, regular, ink)
  text(data.articleUrl, 8, regular, blue)
  text(data.videosTitle, 9, bold, navy)
  text(`${data.videoOneTitle} (${data.videoOneDuration})`, 8.5, regular, ink, 8)
  text(`https://www.youtube.com/watch?v=${data.videoOneId}`, 8, regular, blue, 8)
  text(`${data.videoTwoTitle} (${data.videoTwoDuration})`, 8.5, regular, ink, 8)
  text(`https://www.youtube.com/watch?v=${data.videoTwoId}`, 8, regular, blue, 8)
  heading(data.education)
  for (const item of data.educationText.split('\n')) text(item, 8.5, regular, ink, 8)
  heading(({ fr: 'Certifications', es: 'Certificaciones' })[language] || 'Certifications')
  text(data.credentialsIntro, 9, regular, ink)
  for (const cert of data.certs) text(cert, 8.5, regular, ink, 8)
  heading(data.languages)
  for (const item of data.languageText.split('\n')) text(item, 8.5, regular, ink, 8)
  heading(data.recognition)
  text(data.recognitionText, 8.5, regular, ink)
  const bytes = await pdf.save()
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  const link = document.createElement('a'); link.href = url; link.download = `Alaeddine-Najjar-CV-${language.toUpperCase()}.pdf`; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function printArabicCv(data) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
  const projects = [...data.projectGroups, ...data.careerProjectGroups].map((group) => `<h3>${escapeHtml(group.title)}</h3>${group.projects.map((project) => `<article class="project"><h4>${escapeHtml(project.title)}</h4><p class="role">${escapeHtml(project.role)}</p><p>${escapeHtml(project.description)}</p></article>`).join('')}`).join('')
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>السيرة الذاتية - علاء الدين النّجار</title><style>
    @page{size:A4;margin:17mm 18mm 20mm;@bottom-left{content:"علاء الدين النّجار · السيرة الذاتية";color:#64748b;font:9pt Arial} @bottom-right{content:counter(page);color:#64748b;font:9pt Arial}}
    *{box-sizing:border-box}body{margin:0;color:#17263b;font:10pt/1.65 Arial,Tahoma,sans-serif;direction:rtl;text-align:right}header{background:#162840;color:white;padding:22px 26px;margin-bottom:20px}h1{font-size:23pt;margin:0 0 7px}header p{margin:4px 0;color:#dbeafe}section{margin:0 0 17px;break-inside:auto}h2{font-size:13pt;color:#2468a8;border-bottom:1px solid #cbd5e1;padding-bottom:5px;margin:18px 0 8px;break-after:avoid}h3{font-size:10.5pt;color:#162840;margin:12px 0 5px;break-after:avoid}h4{font-size:9.5pt;margin:0 0 2px}.role{color:#47627d;font-weight:bold;margin:0 0 3px}.project{break-inside:avoid;margin:0 0 8px}.job{break-inside:avoid;border-bottom:1px solid #dce4ed;padding:7px 0}.meta{color:#426c98;font-weight:bold}.intro{font-size:11pt}ul{padding-right:19px;margin:6px 0}li{margin:3px 0}.url{direction:ltr;text-align:left;overflow-wrap:anywhere;color:#2468a8;font-size:8pt}a{color:#2468a8}
  </style></head><body><header><h1>علاء الدين النّجار</h1><p>${escapeHtml(data.role)}</p><p>${escapeHtml(data.emailAddress)} · ${escapeHtml(data.location)} · LinkedIn: linkedin.com/in/alaeddinenajjar</p></header><p class="intro">${escapeHtml(data.intro)}</p><section><h2>أبرز النتائج</h2>${data.impacts.map(([metric, description]) => `<article class="job"><strong class="meta">${escapeHtml(metric)}</strong><p>${escapeHtml(description)}</p></article>`).join('')}</section><section><h2>مجالات الخبرة</h2>${data.expertise.map(([, title, description]) => `<article class="job"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></article>`).join('')}</section><section><h2>الخبرة المهنية</h2>${data.jobs.map((job) => `<article class="job"><h3>${escapeHtml(job.company)}</h3><p class="meta">${escapeHtml(job.date)}</p><p class="role">${escapeHtml(job.title).replace(/\n/g, '<br>')}</p><p>${escapeHtml(job.text)}</p></article>`).join('')}</section><section><h2>المشاريع والمساهمات المختارة</h2>${projects}</section><section><h2>المشاركات والمجتمع المهني</h2><h3>${escapeHtml(data.articleTitle)}</h3><p>${escapeHtml(data.articleSource)} · ${escapeHtml(data.articleDate)}</p><p>${escapeHtml(data.articleDescription)}</p><p class="url">${escapeHtml(data.articleUrl)}</p><h3>${escapeHtml(data.videosTitle)}</h3><ul><li>${escapeHtml(data.videoOneTitle)} (${escapeHtml(data.videoOneDuration)})<br><span class="url">https://www.youtube.com/watch?v=${escapeHtml(data.videoOneId)}</span></li><li>${escapeHtml(data.videoTwoTitle)} (${escapeHtml(data.videoTwoDuration)})<br><span class="url">https://www.youtube.com/watch?v=${escapeHtml(data.videoTwoId)}</span></li></ul></section><section><h2>${escapeHtml(data.education)}</h2>${list(data.educationText.split('\n'))}</section><section><h2>الشهادات المهنية</h2><p>${escapeHtml(data.credentialsIntro)}</p>${list(data.certs)}</section><section><h2>${escapeHtml(data.languages)}</h2>${list(data.languageText.split('\n'))}</section><section><h2>${escapeHtml(data.recognition)}</h2><p>${escapeHtml(data.recognitionText)}</p></section></body></html>`
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.addEventListener('load', () => window.setTimeout(() => { printWindow.focus(); printWindow.print() }, 500), { once: true })
}

const copy = {
  en: {
    nav: ['About', 'Expertise', 'Community', 'Experience', 'Credentials', 'Contact'],
    mainNav: 'Main navigation',
    languageSelection: 'Language selection',
    assistantTitle: 'Recruiter assistant', assistantClose: 'Close', assistantPrompt: 'Ask about my experience, skills or certifications.',
    assistantPlaceholder: 'Your question…', assistantSend: 'Ask', assistantReady: 'The assistant interface is ready. It needs a secure service connection before it can answer.',
    assistantUnavailable: 'I cannot answer right now. Please try again shortly.', assistantLauncher: '✳ AI assistant',
    available: 'TECHNOLOGY EXECUTIVE · 20+ YEARS OF EXPERIENCE',
    role: 'ACCOUNTS CTO · FINOPS · CLOUD & ENTERPRISE ARCHITECTURE',
    heroLead: 'Technology at the crossroads of',
    heroAccent: 'innovation and strategy.',
    intro: 'I lead teams, shape resilient IT platforms and guide digital transformation so technology advances business objectives. My experience spans cloud computing, cybersecurity, software and enterprise architecture.',
    cta: 'Explore my experience',
    cv: 'Download CV',
    based: 'Based in France · International experience',
    years: '20+ years',
    yearsLabel: 'in technology leadership',
    focus: 'LEADERSHIP PROFILE',
    focusText: 'Consulting, business advisory and customer engagement.',
    impactLabel: 'MEASURABLE IMPACT',
    impactTitle: 'Architecture that moves the numbers.',
    impacts: [
      ['950 k€', 'annual savings through SQL licensing optimization'],
      ['€120K', 'annual Azure savings for a strategic account'],
      ['−80%', 'time spent preparing compliance reports'],
      ['−30%', 'security incidents after full resource coverage'],
    ],
    expertiseEyebrow: 'WHAT I BRING',
    expertiseTitle: 'Business goals, translated into technology.',
    expertiseIntro: 'A leadership profile shaped by consulting, business advisory and customer engagement.',
    expertise: [
      ['01', 'Consulting', 'Technology strategy, architecture and transformation across complex environments'],
      ['02', 'Business advisory', 'Connect technology choices to business priorities, growth and value'],
      ['03', 'Customer engagement', 'Build trusted relationships with clients, teams and executive stakeholders'],
      ['04', 'Technology domains', 'Cloud computing · cybersecurity · software · enterprise architecture · FinOps'],
    ],
    experienceEyebrow: 'CAREER HISTORY',
    experienceTitle: 'A career spanning more than two decades.',
    experienceIntro: 'From IT operations and infrastructure to technology leadership and executive advisory.',
    jobs: [
      { date: '2023 — PRESENT', company: 'Fujitsu · France', title: 'Accounts CTO (Sep 2024 — present)\nTechnical Team Lead, Cloud Architect AMCS (Sep 2023 — Aug 2024)', text: 'Current focus: FinOps, TOGAF, ITIL, Azure, AWS and Citrix.' },
      { date: '2016 · 2021 — 2023', company: 'Desjardins · Montréal', title: 'Principal Solutions Architect (Oct 2021 — Sep 2023)\nConsultant, IAM Specialist (Jan — May 2016)', text: 'Financial services and identity and access management.' },
      { date: '2017 — 2021', company: 'Cortex génie humain · Montréal', title: 'Advisory Information Technology Architect (Sep 2020 — Oct 2021)\nTechnical Team Lead (Jan 2019 — Aug 2020)\nVirtualization Specialist, Citrix / VMware / Azure / AWS (Jan 2017 — Jan 2019)', text: 'Progressive roles across IT architecture, team leadership and virtualization.' },
      { date: '2016 — 2017', company: 'Lumenpulse', title: 'Consultant, Solutions Integrator (MDT / O365)', text: 'June 2016 — January 2017.' },
      { date: '2014 — 2015', company: 'CA Technologies', title: 'Consultant, Senior Solutions Integrator (ITPAM)', text: 'November 2014 — October 2015 · Paris, France.' },
      { date: '2011 — 2014', company: 'Sopra HR Software · Paris', title: 'Corporate Senior TI System Administrator (Aug 2012 — Nov 2014)\nIT System Administrator (Sep 2011 — Aug 2012)', text: 'Progression from IT system administration to corporate senior administration.' },
      { date: '2010 — 2011', company: 'Orange Business Services · Rennes', title: 'Technical Operations Lead, BI / Billing (Aug 2010 — Aug 2011)\nInformation Technology Operations Specialist (Mar — Aug 2010)', text: 'Operations roles in business intelligence, billing and IT.' },
      { date: '2009', company: 'Dell Technologies · Tunisia', title: 'Technical Specialist', text: 'April — November 2009.' },
      { date: '2008 — 2009', company: 'Printing & Packaging Solutions · Tunisia', title: 'Technical Systems Analyst', text: 'March 2008 — March 2009.' },
      { date: '2004 — 2008', company: 'Groupe Beneteau · Tunisia', title: 'Information Technology Specialist', text: 'September 2004 — February 2008.' },
    ],
    credentialsEyebrow: 'CREDENTIALS',
    credentialsTitle: 'Grounded in practice. Backed by certification.',
    certs: ['FinOps Certified Practitioner · 2025', 'Claude Certified Architect - Professional', 'Microsoft Certified: Azure Administrator Associate', 'Azure Solutions Architect Expert · 2023', 'TOGAF 9 Foundation & Certified · 2022', 'AWS Solutions Architect - Associate · 2021', 'AWS Certified Cloud Practitioner · 2020', 'Citrix Certified Sales Professional · 2019', 'Citrix CCP-V · ITIL Foundation'],
    education: 'EDUCATION',
    educationText: 'DEP, Entrepreneurship & Business Development, Professional Consulting · Centre de services scolaire des Samares (2016 — 2017)\nBachelor’s degree, Computer Systems Technology · Université Tunis Carthage (2004 — 2008)\nContinuing education · Collège de Maisonneuve (June 2019)\nEnglish Functional & Communication Program · McGill University (January 2017)',
    languages: 'LANGUAGES',
    languageText: 'Arabic · Native / bilingual\nEnglish · Native / bilingual\nFrench · Native / bilingual\nSpanish · Limited working proficiency',
    recognition: 'RECOGNITION',
    recognitionText: 'Regional Fujitsu Distinguished Engineer (RFDE)',
    closingEyebrow: 'LET’S BUILD WHAT’S NEXT',
    closingTitle: 'Bringing technology strategy and business growth together.',
    closingText: 'For technology leadership, cloud strategy and business advisory.',
    email: 'Email Alaeddine',
    emailAddress: 'alaeddine.najjar@gmail.com',
    linkedin: 'View my LinkedIn profile',
    footer: 'Alaeddine Najjar · Technology leadership · Cloud · FinOps',
    backTop: 'Back to top ↑',
    pdfLang: 'EN',
  },
  fr: {
    nav: ['Profil', 'Expertise', 'Communauté', 'Expérience', 'Certifications', 'Contact'],
    mainNav: 'Navigation principale',
    languageSelection: 'Choix de la langue',
    assistantTitle: 'Assistant recruteur', assistantClose: 'Fermer', assistantPrompt: 'Posez une question sur mon parcours, mes compétences ou mes certifications.',
    assistantPlaceholder: 'Votre question…', assistantSend: 'Envoyer', assistantReady: 'L’assistant est prêt côté interface. Il doit être relié à un service sécurisé avant de pouvoir répondre.',
    assistantUnavailable: 'Je ne peux pas répondre pour le moment. Réessayez un peu plus tard.', assistantLauncher: '✳ Assistant IA',
    available: 'DIRIGEANT TECHNOLOGIQUE · PLUS DE 20 ANS D’EXPÉRIENCE',
    role: 'CTO DE COMPTES · FINOPS · CLOUD ET ARCHITECTURE D’ENTREPRISE',
    heroLead: 'La technologie au croisement de',
    heroAccent: 'l’innovation et de la stratégie.',
    intro: 'Je dirige des équipes, conçois des plateformes informatiques résilientes et pilote des transformations numériques au service des objectifs d’affaires. Mon expérience couvre le cloud, la cybersécurité, les logiciels et l’architecture d’entreprise.',
    cta: 'Découvrir mon parcours',
    cv: 'Télécharger le CV',
    based: 'Basé en France · Expérience internationale',
    years: '20+ ans',
    yearsLabel: 'en leadership technologique',
    focus: 'PROFIL DE LEADERSHIP',
    focusText: 'Conseil, accompagnement stratégique et engagement client.',
    impactLabel: 'RÉSULTATS MESURABLES',
    impactTitle: 'Une architecture au service des résultats.',
    impacts: [
      ['950 k€', 'd’économies annuelles grâce à l’optimisation des licences SQL'],
      ['120 K€', 'd’économies Azure annuelles pour un compte stratégique'],
      ['−80 %', 'de temps consacré aux rapports de conformité'],
      ['−30 %', 'd’incidents de sécurité après couverture complète des ressources'],
    ],
    expertiseEyebrow: 'MES CONTRIBUTIONS',
    expertiseTitle: 'Relier les objectifs d’affaires à la technologie.',
    expertiseIntro: 'Un parcours de leadership ancré dans le conseil, l’accompagnement d’affaires et la relation client.',
    expertise: [
      ['01', 'Conseil', 'Stratégie technologique, architecture et transformation dans des environnements complexes'],
      ['02', 'Accompagnement d’affaires', 'Relier les choix technologiques aux priorités, à la croissance et à la valeur métier'],
      ['03', 'Engagement client', 'Créer des relations de confiance avec les clients, les équipes et les décideurs'],
      ['04', 'Domaines technologiques', 'Cloud · cybersécurité · logiciels · architecture d’entreprise · FinOps'],
    ],
    experienceEyebrow: 'PARCOURS PROFESSIONNEL',
    experienceTitle: 'Plus de deux décennies au service de la technologie.',
    experienceIntro: 'Des opérations informatiques et des infrastructures à la direction technologique et au conseil stratégique.',
    jobs: [
      { date: '2023 — AUJOURD’HUI', company: 'Fujitsu · France', title: 'CTO de comptes (sept. 2024 — aujourd’hui)\nChef d’équipe technique, architecte cloud AMCS (sept. 2023 — août 2024)', text: 'Axes actuels : FinOps, TOGAF, ITIL, Azure, AWS et Citrix.' },
      { date: '2016 · 2021 — 2023', company: 'Desjardins · Montréal', title: 'Architecte principal de solutions (oct. 2021 — sept. 2023)\nConsultant, spécialiste IAM (janv. — mai 2016)', text: 'Services financiers, identité et gestion des accès.' },
      { date: '2017 — 2021', company: 'Cortex génie humain · Montréal', title: 'Architecte-conseil en technologies de l’information (sept. 2020 — oct. 2021)\nChef d’équipe technique (janv. 2019 — août 2020)\nSpécialiste virtualisation, Citrix / VMware / Azure / AWS (janv. 2017 — janv. 2019)', text: 'Évolution vers l’architecture, le leadership d’équipe et la virtualisation.' },
      { date: '2016 — 2017', company: 'Lumenpulse', title: 'Consultant, intégrateur de solutions (MDT / O365)', text: 'Juin 2016 — janvier 2017.' },
      { date: '2014 — 2015', company: 'CA Technologies', title: 'Consultant principal, intégrateur de solutions (ITPAM)', text: 'Novembre 2014 — octobre 2015 · Paris, France.' },
      { date: '2011 — 2014', company: 'Sopra HR Software · Paris', title: 'Administrateur principal TI (août 2012 — nov. 2014)\nAdministrateur de systèmes TI (sept. 2011 — août 2012)', text: 'Progression vers un rôle d’administration système principal.' },
      { date: '2010 — 2011', company: 'Orange Business Services · Rennes', title: 'Chef des opérations techniques, BI / facturation (août 2010 — août 2011)\nSpécialiste des opérations informatiques (mars — août 2010)', text: 'Opérations en intelligence d’affaires, facturation et informatique.' },
      { date: '2009', company: 'Dell Technologies · Tunisie', title: 'Spécialiste technique', text: 'Avril — novembre 2009.' },
      { date: '2008 — 2009', company: 'Printing & Packaging Solutions · Tunisie', title: 'Analyste des systèmes techniques', text: 'Mars 2008 — mars 2009.' },
      { date: '2004 — 2008', company: 'Groupe Beneteau · Tunisie', title: 'Spécialiste en technologies de l’information', text: 'Septembre 2004 — février 2008.' },
    ],
    credentialsEyebrow: 'CERTIFICATIONS',
    credentialsTitle: 'L’expérience du terrain, soutenue par des certifications.',
    certs: ['FinOps Certified Practitioner · 2025', 'Claude Certified Architect - Professional', 'Microsoft Certified: Azure Administrator Associate', 'Azure Solutions Architect Expert · 2023', 'TOGAF 9 Foundation & Certified · 2022', 'AWS Solutions Architect - Associate · 2021', 'AWS Certified Cloud Practitioner · 2020', 'Citrix Certified Sales Professional · 2019', 'Citrix CCP-V · ITIL Foundation'],
    education: 'FORMATION',
    educationText: 'DEP, Entrepreneuriat et développement des affaires, conseil professionnel · Centre de services scolaire des Samares (2016 — 2017)\nBaccalauréat, technologie des systèmes informatiques · Université Tunis Carthage (2004 — 2008)\nFormation continue · Collège de Maisonneuve (juin 2019)\nProgramme d’anglais fonctionnel et de communication · Université McGill (janvier 2017)',
    languages: 'LANGUES',
    languageText: 'Arabe · Langue maternelle / bilingue\nAnglais · Langue maternelle / bilingue\nFrançais · Langue maternelle / bilingue\nEspagnol · Notions professionnelles',
    recognition: 'DISTINCTION',
    recognitionText: 'Regional Fujitsu Distinguished Engineer (RFDE)',
    closingEyebrow: 'CONSTRUISONS LA SUITE',
    closingTitle: 'Faire converger stratégie technologique et croissance des affaires.',
    closingText: 'Pour des mandats de direction technologique, stratégie cloud et conseil d’affaires.',
    email: 'Écrire à Alaeddine',
    emailAddress: 'alaeddine.najjar@gmail.com',
    linkedin: 'Voir mon profil LinkedIn',
    footer: 'Alaeddine Najjar · Leadership technologique · Cloud · FinOps',
    backTop: 'Retour en haut ↑',
    pdfLang: 'FR',
  },
  es: {
    nav: ['Perfil', 'Especialidad', 'Comunidad', 'Experiencia', 'Certificaciones', 'Contacto'],
    mainNav: 'Navegación principal', languageSelection: 'Selección de idioma', cv: 'Descargar CV',
    assistantTitle: 'Asistente para selección', assistantClose: 'Cerrar', assistantPrompt: 'Pregunta sobre mi trayectoria, experiencia o certificaciones.',
    assistantPlaceholder: 'Tu pregunta…', assistantSend: 'Enviar', assistantAsk: 'Preguntar',
    assistantReady: 'La interfaz del asistente está lista. Necesita conectarse a un servicio seguro para responder.',
    assistantUnavailable: 'No puedo responder ahora. Inténtalo de nuevo más tarde.', assistantLauncher: '✳ Asistente IA',
    pdfLang: 'ES',
  },
  ar: {
    nav: ['نبذة', 'الخبرة', 'المجتمع', 'المسيرة المهنية', 'الشهادات', 'التواصل'],
    mainNav: 'التنقل الرئيسي', languageSelection: 'اختيار اللغة', cv: 'تنزيل السيرة الذاتية PDF',
    assistantTitle: 'مساعد التوظيف', assistantClose: 'إغلاق', assistantPrompt: 'اسأل عن مسيرتي أو خبرتي أو شهاداتي.',
    assistantPlaceholder: 'اكتب سؤالك…', assistantSend: 'إرسال', assistantAsk: 'اسأل',
    assistantReady: 'واجهة المساعد جاهزة، لكنها تحتاج إلى ربطها بخدمة آمنة قبل أن تتمكن من الإجابة.',
    assistantUnavailable: 'لا أستطيع الإجابة الآن. حاول مرة أخرى لاحقاً.', assistantLauncher: '✳ مساعد ذكي',
    pdfLang: 'AR',
  },
}

export default function App() {
  const [language, setLanguage] = useState('en')
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [assistantAnswer, setAssistantAnswer] = useState('')
  const [assistantBusy, setAssistantBusy] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const t = { ...copy[language], ...content[language] }
  const makeCv = () => language === 'ar' ? printArabicCv(t) : downloadCv(language, t).catch((error) => console.error('Unable to generate CV', error))
  const copyPortfolioLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2200)
    } catch (error) { console.error('Unable to copy portfolio link', error) }
  }
  const askAssistant = async (event) => {
    event.preventDefault()
    const endpoint = import.meta.env.VITE_RECRUITER_ASSISTANT_ENDPOINT
    if (!endpoint) {
      setAssistantAnswer(t.assistantReady)
      return
    }
    setAssistantBusy(true); setAssistantAnswer('')
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language, question, profile: t }) })
      if (!response.ok) throw new Error('Assistant request failed')
      const result = await response.json()
      setAssistantAnswer(result.answer || '')
    } catch {
      setAssistantAnswer(t.assistantUnavailable)
    } finally { setAssistantBusy(false) }
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = ({ fr: 'Alaeddine Najjar — CTO de comptes et dirigeant technologique', es: 'Alaeddine Najjar — CTO de cuentas y líder tecnológico', ar: 'علاء الدين النّجار — مدير تقني وقيادي تكنولوجي' })[language] || 'Alaeddine Najjar — Accounts CTO & Technology Executive'
  }, [language])

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.34
        let current = 'about'
        for (const id of sectionIds) {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top + window.scrollY <= marker) current = id
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = 'contact'
        setActiveSection((previous) => previous === current ? previous : current)
      })
    }
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return (
    <main className="site-shell" id="top">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Alaeddine Najjar, home">AN<span>.</span></a>
        <nav className="nav-links" aria-label={t.mainNav}>
          {t.nav.map((label, index) => <a key={label} className={activeSection === sectionIds[index] ? 'active' : ''} aria-current={activeSection === sectionIds[index] ? 'location' : undefined} href={`#${sectionIds[index]}`}>{label}</a>)}
        </nav>
        <div className="top-actions">
          <div className="language-switch" role="group" aria-label={t.languageSelection}>
            {['fr', 'en', 'es', 'ar'].map((code, index) => <span className="language-option" key={code}><button type="button" className={language === code ? 'active' : ''} aria-pressed={language === code} onClick={() => setLanguage(code)}>{code.toUpperCase()}</button>{index < 3 && <i>/</i>}</span>)}
          </div>
          <button className="header-download" onClick={makeCv}>{t.cv} <span>↗</span></button>
        </div>
      </header>

      <section className="hero section-wrap" id="about">
        <div className="hero-copy">
          <h1 className="hero-name">{language === 'ar' ? <>علاء الدين <span>النّجار</span></> : <>Alaeddine <span>NAJJAR</span></>}</h1>
          <div className="availability">{t.available}</div>
          <p className="role-label">{t.role}</p>
          <h2>{t.heroLead} <em>{t.heroAccent}</em></h2>
          <p className="hero-intro">{t.intro}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#experience">{t.cta}<span>↗</span></a>
            <button className="text-link" onClick={makeCv}>{t.cv}<span>↓</span></button>
          </div>
          <p className="location"><span>⌖</span>{t.based}</p>
        </div>
        <aside className="hero-card" aria-label={t.focus}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="card-monogram">AN</div>
          <div className="profile-card-heading"><small>{t.focus}</small><h3>{t.cardTitle}</h3><p>{t.cardTagline}</p></div>
          <div className="hero-card-bottom">
            <div className="profile-card-years"><span>{t.years}</span><p>{t.yearsLabel}</p></div>
            <div className="profile-card-stats">{[[t.cardMetricOneLabel, ...t.impacts[0]], [t.cardMetricTwoLabel, ...t.impacts[1]]].map(([label, metric, text]) => <div className="profile-card-stat" key={label}><strong>{label}</strong><span><b>{metric}</b>{text}</span></div>)}</div>
          </div>
          <span className="card-star">✳</span>
        </aside>
      </section>

      <section className="impact-section section-wrap" aria-labelledby="impact-title">
        <div className="section-heading impact-heading"><p className="eyebrow">{t.impactLabel}</p><h2 id="impact-title">{t.impactTitle}</h2></div>
        <div className="impact-grid">{t.impacts.map(([metric, text]) => <article className="impact-item" key={metric}><strong>{metric === '950 k€' ? <bdi dir="ltr">{metric}</bdi> : metric}</strong><p>{text}</p></article>)}</div>
      </section>

      <section className="expertise-section section-wrap" id="expertise">
        <div className="section-heading"><p className="eyebrow">{t.expertiseEyebrow}</p><h2>{t.expertiseTitle}</h2><p className="section-intro">{t.expertiseIntro}</p></div>
        <div className="expertise-list">{t.expertise.map(([number, title, text]) => <article className="expertise-row" key={number}><span className="row-number">{number}</span><h3>{title}</h3><p>{text}</p><span className="row-arrow">↗</span></article>)}</div>
      </section>

      <section className="community-section section-wrap" id="community">
        <div className="section-heading"><p className="eyebrow">{t.communityEyebrow}</p><h2>{t.communityTitle}</h2><p className="section-intro">{t.communityIntro}</p></div>
        <a className="community-article" href={t.articleUrl} target="_blank" rel="noreferrer">
          <div><span className="community-source">{t.articleSource} · {t.articleDate}</span><h3>{t.articleTitle}</h3><p>{t.articleDescription}</p><span className="community-link">{t.articleLinkLabel} ↗</span></div>
        </a>
        <h3 className="community-videos-title">{t.videosTitle}</h3>
        <div className="community-video-grid">{[
          { title: t.videoOneTitle, id: t.videoOneId, duration: t.videoOneDuration },
          { title: t.videoTwoTitle, id: t.videoTwoId, duration: t.videoTwoDuration },
        ].map((video) => <article className="community-video" key={video.id}><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><div className="video-caption"><h4>{video.title}</h4><span>{video.duration}</span><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">{t.videoLinkLabel} ↗</a></div></article>)}</div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-wrap experience-inner">
          <div className="section-heading"><p className="eyebrow">{t.experienceEyebrow}</p><h2>{t.experienceTitle}</h2><p className="section-intro">{t.experienceIntro}</p></div>
          <div className="timeline">{t.jobs.map((job) => {
            const careerProjects = t.careerProjectGroups.find((group) => job.company.startsWith(group.title))
            return <article className="job" key={job.company}>
              <div className="job-date">{job.date}</div>
              <div className="job-content"><span className="timeline-dot" /><h3 className="employer-heading"><BrandLogo {...employerBrand(job.company)} label={job.company} className="employer-brand-logo" />{job.company}</h3><p className="job-title">{job.title}</p>
                <details className="job-overview"><summary>{t.experienceDetailsLabel}</summary><p className="job-description">{job.text}</p></details>
                {job.company.startsWith('Fujitsu') && <ProjectDetails groups={t.projectGroups} toggleLabel={t.projectsToggleLabel} roleLabel={t.projectRoleLabel} />}
                {careerProjects && <ProjectDetails groups={[careerProjects]} toggleLabel={t.careerProjectsToggleLabel} roleLabel={t.careerProjectRoleLabel} />}
              </div>
            </article>
          })}</div>
        </div>
      </section>

      <section className="credentials-section section-wrap" id="credentials">
        <div className="section-heading"><p className="eyebrow">{t.credentialsEyebrow}</p><h2>{t.credentialsTitle}</h2><p className="section-intro">{t.credentialsIntro}</p></div>
        <div className="credentials-grid"><div className="cert-list">{t.certs.map((cert) => <div className="cert-item" key={cert}><BrandLogo {...certificationBrand(cert)} className="cert-brand-logo" />{cert}</div>)}</div><div className="detail-cards"><article><p className="eyebrow">{t.education}</p><p className="detail-copy">{t.educationText.split('\n').map((line) => <span key={line}>{line}</span>)}</p></article><article><p className="eyebrow">{t.languages}</p><p className="detail-copy">{t.languageText.split('\n').map((line) => <span key={line}>{line}</span>)}</p></article><article><p className="eyebrow">{t.recognition}</p><p className="detail-copy">{t.recognitionText}</p></article></div></div>
      </section>

      <section className="closing-section section-wrap" id="contact">
        <div className="closing-copy">
          <p className="eyebrow">{t.closingEyebrow}</p><h2>{t.closingTitle}</h2><p>{t.closingText}</p>
          <div className="closing-primary-actions"><a className="telegram-cta" href={t.telegramUrl} target="_blank" rel="noreferrer">{t.telegramLabel}<span>↗</span></a><a className="telegram-cta email-cta" href={`mailto:${t.emailAddress}`}>{t.emailCta}<span>↗</span></a></div>
        </div>
        <aside className="sharing-card" aria-label={t.shareTitle}>
          <p className="sharing-eyebrow">{t.shareEyebrow}</p><h3>{t.shareTitle}</h3>
          <a className="share-primary" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}${window.location.pathname}`)}`} target="_blank" rel="noreferrer"><span className="linkedin-mark">in</span>{t.shareLabel}<span className="share-arrow">↗</span></a>
          <button className="copy-link" type="button" onClick={copyPortfolioLink}>{linkCopied ? t.copiedLabel : t.copyLinkLabel}<span>{linkCopied ? '✓' : '⧉'}</span></button>
          <p className="share-helper">{t.shareHelper}</p>
        </aside>
        <div className="closing-decoration" aria-hidden="true">✳</div>
      </section>
      <footer className="footer section-wrap"><span>{t.footer}</span><a href="#top">{t.backTop}</a></footer>
      <aside className="recruiter-assistant">
        {assistantOpen && <div className="assistant-panel"><div className="assistant-heading"><strong>{t.assistantTitle}</strong><button onClick={() => setAssistantOpen(false)} aria-label={t.assistantClose}>×</button></div><p>{t.assistantPrompt}</p><form onSubmit={askAssistant}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.assistantPlaceholder} required /><button disabled={assistantBusy}>{assistantBusy ? '…' : t.assistantSend}</button></form>{assistantAnswer && <p className="assistant-answer" role="status">{assistantAnswer}</p>}</div>}
        <button className="assistant-launcher" onClick={() => setAssistantOpen(!assistantOpen)}>{t.assistantLauncher}</button>
      </aside>
    </main>
  )
}
