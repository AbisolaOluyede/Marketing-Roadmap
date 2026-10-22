# Marketing Roadmap

Marketing Roadmap is an open, self-paced learning tool for people who want to learn marketing and practise it. It combines interactive topic roadmaps with long-form self-study chapters, Nigerian and international business cases, detailed topic explanations, practical briefs and career pathways.

The project is built with plain HTML, CSS and JavaScript.

## Key files

```text
index.html              Site shell, navigation and footer
css/styles.css          Visual design, responsive layout and themes
js/app.js               Homepage, search, routing, handbook rendering and progress
js/layout.js            Roadmap graph layout
js/data/tracks.js       The 14 roadmap definitions
js/data/handbook.js     Chapter topic learning materials, theories, cases, detailed topic explanations, jobs and references
js/data/<track>.js      Individual roadmap topics, lessons and resources
js/data/practice.js     Topic-level case studies, self-check questions and projects
scripts/validate.mjs    Data validation
OPEN_CORE.md            Open-core model proposal
CONTRIBUTING.md         Contribution guidance
```

## Curriculum design

Each roadmap is treated as a chapter. A chapter includes:

- Definition, scope and lecturer-style orientation
- Learning outcomes and possible job roles
- Theories and frameworks with explanations
- Self-study sections
- A Nigerian public-business case lens and an international case lens
- A practical guide and self-checks
- References and recommended reading at the bottom of the chapter

The topic graph follows the chapters. Select a topic node to read its more focused lesson, prerequisites, resources, case study, self-check questions and practical assignment. There are no classroom examinations or deadlines. Assignments are for personal learning.

## Nigerian marketing regulations

The Nigerian marketing regulations guide is an educational overview of ARCON advertising practice and vetting, the Federal Competition and Consumer Protection Act 2018, and the Nigeria Data Protection Act 2023. It links to official sources and includes a practical campaign sign-off checklist.

Regulatory material is time-sensitive and the guide is not legal advice. Before using it for a live campaign, verify the latest regulatory code, regulator guidance and sector rules, and consult qualified counsel where appropriate. This platform cannot be described as guaranteeing compliance.


## Progress and privacy

Topic completion and theme preferences are stored locally in the browser using `localStorage`. There are no accounts, server-side progress sync, tracking pixels, or newsletter storage yet.


## Open-source status

The existing MIT licence applies to the code. External references and third-party material retain their own terms. This is a self-learning resource, not an accredited degree, professional registration or legal qualification.
