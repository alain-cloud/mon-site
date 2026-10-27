import { useEffect, useState } from 'react'
import './App.css'

const copy = {
  en: {
    nav: ['About', 'Expertise', 'Experience', 'Credentials', 'Contact'],
    available: 'TECHNOLOGY EXECUTIVE · 20+ YEARS OF EXPERIENCE',
    role: 'ACCOUNTS CTO · FINOPS · CLOUD & ENTERPRISE ARCHITECTURE',
    heroLead: 'Technology at the crossroads of',
    heroAccent: 'innovation and strategy.',
    intro: 'I lead teams, shape resilient IT platforms and guide digital transformation so technology advances business objectives. My experience spans cloud computing, cybersecurity, software and enterprise architecture.',
    cta: 'Explore my experience',
    cv: 'Download résumé',
    based: 'Based in France · International experience',
    years: '20+ years',
    yearsLabel: 'in technology leadership',
    focus: 'LEADERSHIP PROFILE',
    focusText: 'Consulting, business advisory and customer engagement.',
    impactLabel: 'MEASURABLE IMPACT',
    impactTitle: 'Architecture that moves the numbers.',
    impacts: [
      ['€950K', 'annual savings through SQL licensing optimization'],
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
    nav: ['Profil', 'Expertise', 'Expérience', 'Certifications', 'Contact'],
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
      ['120 k€', 'd’économies Azure annuelles pour un compte stratégique'],
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
}

export default function App() {
  const [language, setLanguage] = useState('en')
  const t = copy[language]
  const cvHref = `${import.meta.env.BASE_URL}cv/Alaeddine-Najjar-CV-${t.pdfLang}.pdf`

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === 'fr'
      ? 'Alaeddine Najjar — CTO de comptes et dirigeant technologique'
      : 'Alaeddine Najjar — Accounts CTO & Technology Executive'
  }, [language])

  return (
    <main className="site-shell" id="top">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Alaeddine Najjar, home">AN<span>.</span></a>
        <nav className="nav-links" aria-label={language === 'fr' ? 'Navigation principale' : 'Main navigation'}>
          {t.nav.map((label, index) => <a key={label} href={['#about', '#expertise', '#experience', '#credentials', '#contact'][index]}>{label}</a>)}
        </nav>
        <div className="top-actions">
          <button className="language-switch" onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')} aria-label={language === 'en' ? 'Passer en français' : 'Switch to English'}>
            <span className={language === 'fr' ? 'active' : ''}>FR</span><i>/</i><span className={language === 'en' ? 'active' : ''}>EN</span>
          </button>
          <a className="header-download" href={cvHref} download>{t.cv} <span>↗</span></a>
        </div>
      </header>

      <section className="hero section-wrap" id="about">
        <div className="hero-copy">
          <div className="availability">{t.available}</div>
          <p className="role-label">{t.role}</p>
          <h1>{t.heroLead} <em>{t.heroAccent}</em></h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#experience">{t.cta}<span>↗</span></a>
            <a className="text-link" href={cvHref} download>{t.cv}<span>↓</span></a>
          </div>
          <p className="location"><span>⌖</span>{t.based}</p>
        </div>
        <aside className="hero-card" aria-label={t.focus}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="card-monogram">AN</div>
          <div className="hero-card-bottom"><span>{t.years}</span><p>{t.yearsLabel}</p><div className="card-rule" /><small>{t.focus}</small><p className="focus-copy">{t.focusText}</p></div>
          <span className="card-star">✳</span>
        </aside>
      </section>

      <section className="impact-section section-wrap" aria-labelledby="impact-title">
        <div className="section-heading impact-heading"><p className="eyebrow">{t.impactLabel}</p><h2 id="impact-title">{t.impactTitle}</h2></div>
        <div className="impact-grid">{t.impacts.map(([metric, text]) => <article className="impact-item" key={metric}><strong>{metric}</strong><p>{text}</p></article>)}</div>
      </section>

      <section className="expertise-section section-wrap" id="expertise">
        <div className="section-heading"><p className="eyebrow">{t.expertiseEyebrow}</p><h2>{t.expertiseTitle}</h2><p className="section-intro">{t.expertiseIntro}</p></div>
        <div className="expertise-list">{t.expertise.map(([number, title, text]) => <article className="expertise-row" key={number}><span className="row-number">{number}</span><h3>{title}</h3><p>{text}</p><span className="row-arrow">↗</span></article>)}</div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-wrap experience-inner">
          <div className="section-heading"><p className="eyebrow">{t.experienceEyebrow}</p><h2>{t.experienceTitle}</h2><p className="section-intro">{t.experienceIntro}</p></div>
          <div className="timeline">{t.jobs.map((job) => <article className="job" key={job.company}><div className="job-date">{job.date}</div><div className="job-content"><span className="timeline-dot" /><h3>{job.company}</h3><p className="job-title">{job.title}</p><p className="job-description">{job.text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="credentials-section section-wrap" id="credentials">
        <div className="section-heading"><p className="eyebrow">{t.credentialsEyebrow}</p><h2>{t.credentialsTitle}</h2></div>
        <div className="credentials-grid"><div className="cert-list">{t.certs.map((cert) => <div className="cert-item" key={cert}><span>✳</span>{cert}</div>)}</div><div className="detail-cards"><article><p className="eyebrow">{t.education}</p><p className="detail-copy">{t.educationText.split('\n').map((line) => <span key={line}>{line}</span>)}</p></article><article><p className="eyebrow">{t.languages}</p><p className="detail-copy">{t.languageText.split('\n').map((line) => <span key={line}>{line}</span>)}</p></article><article><p className="eyebrow">{t.recognition}</p><p className="detail-copy">{t.recognitionText}</p></article></div></div>
      </section>

      <section className="closing-section section-wrap" id="contact"><p className="eyebrow">{t.closingEyebrow}</p><h2>{t.closingTitle}</h2><p>{t.closingText}</p><div className="closing-actions"><a className="button button-light" href={cvHref} download>{t.cv}<span>↓</span></a><a className="closing-link" href={`mailto:${t.emailAddress}`}>{t.email}<span>↗</span></a><a className="closing-link" href="https://www.linkedin.com/in/alaeddinenajjar/" target="_blank" rel="noreferrer">{t.linkedin}<span>↗</span></a></div><div className="closing-decoration">✳</div></section>
      <footer className="footer section-wrap"><span>{t.footer}</span><a href="#top">{t.backTop}</a></footer>
    </main>
  )
}
