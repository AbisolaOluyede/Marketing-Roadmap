(() => {
  const KEY = 'marketing-roadmaps';
  const THEME = 'marketing-roadmaps:theme';
  const app = document.getElementById('app');
  const root = document.documentElement;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const read = (k, fallback) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? fallback : v; } catch (e) { return fallback; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };

  let progress = read(KEY, {});
  let ctx = null;        // current track view: { track, topics, by, layout }
  let selected = null;

  /* ---------- progress ---------- */
  const isDone = (track, id) => !!(progress[track] && progress[track][id]);
  const setDone = (track, id, value) => { (progress[track] = progress[track] || {})[id] = value; write(KEY, progress); };
  const statusOf = (t) => (isDone(ctx.track.id, t.id) ? 'done' : (t.prereqs || []).every((p) => isDone(ctx.track.id, p)) ? 'avail' : 'later');
  const counts = (trackId) => {
    const topics = (window.TOPICS || {})[trackId] || [];
    return { done: topics.filter((t) => isDone(trackId, t.id)).length, total: topics.length };
  };

  /* ---------- theme ---------- */
  const saved = read(THEME, null);
  if (saved) root.dataset.theme = saved;
  document.getElementById('theme').addEventListener('click', () => {
    const now = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = now === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    write(THEME, next);
  });

  /* ---------- views ---------- */
  function renderHome() {
    document.title = 'Marketing Roadmap';
    ctx = null;
    app.innerHTML = `
      <section class="hero" id="roadmaps">
        <div class="hero-copy">
          <h1>Understand the <em>why.</em><br>Master the <em>how.</em></h1>
          <p class="hero-lede">A self-paced, practical guide to the world of marketing. Learn the theories behind the work, see how they apply in Nigerian and international businesses and build skills you can use in your career.</p>
          <div class="hero-actions"><a class="button-primary" href="#roadmap-list">Explore roadmaps</span></a><a class="text-link" href="#about"></a></div>
          <div class="hero-stats"><div><strong>14</strong><span>learning roadmaps</span></div><div><strong>200+</strong><span>topics to explore</span></div><div><strong>Self-paced</strong><span></div></div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
          <div class="art-center"><span>MR</span></small></div>
          <div class="art-node node-a"></span> Insight</div><div class="art-node node-b"></span> Strategy</div>
          <div class="art-node node-c"></span> Creativity</div><div class="art-node node-d"></span> Impact</div>
          <div class="art-spark spark-a">✳</div><div class="art-spark spark-b">✳</div>
        </div>
      </section>

      <section class="search-section" aria-label="Search roadmaps">
        <div><span class="eyebrow"></span><h2>Where would you like to begin?</h2><p>Search a discipline or topic </p></div>
        <label class="searchbox"><span aria-hidden="true">⌕</span><input id="roadmap-search" type="search" placeholder="Try “digital marketing”, “SEO” or “brand strategy”" autocomplete="off" aria-label="Search marketing roadmaps and topics"><kbd></kbd>
        <div id="search-results" class="search-results" aria-live="polite"></div>
      </section>

      <section class="roadmaps-section" id="roadmap-list">
        <div class="section-heading"><div><span class="eyebrow"></span><h2>Explore roadmaps</h2></div></div>
        <div class="cards">${window.TRACKS.map(card).join('')}</div>
      </section>

      <section class="community-grid">
        <article class="community-card newsletter-card" id="newsletter"><span class="eyebrow"></span><h2>The Marketing Roadmap newsletter</h2><p>Occasional letters on marketing thinking, practical tools, new lessons and resources from the community.</p><form id="newsletter-form"><label for="newsletter-email">Your email address</label><div class="email-row"><input id="newsletter-email" type="email" placeholder="you@email.com" required><button type="submit" class="button-primary">Join the list</button></div><small id="newsletter-note"></small></form></article>
        <article class="community-card contribute-card" id="contribute"><span class="eyebrow"></span><h2>Learning is better when we do it together.</h2><p>Suggest a topic, improve a lesson, add a case study or flag a reference that needs updating. Contributions should be accurate, clearly sourced and useful to independent learners.</p><a class="text-link" href="CONTRIBUTING.md" target="_blank">Read the contribution guide</a><p class="muted"></p></article>
      </section>

      <section class="faq-section" id="faqs"><span class="eyebrow"></span><h2>FAQs</h2>
        <details><summary>Is Marketing Roadmap free?</summary><p>Yes. The current learning core is open source and designed to be freely accessible. Optional future services may be developed separately but the core roadmaps and course materials remain open.</p></details>
        <details><summary>Is this an accredited course?</summary><p>No. It is a self-learning resource. It does not award academic credit, professional registration or an accredited qualification.</p></details>
        <details><summary>Do I need marketing experience?</summary><p>No. Start with Marketing Foundations, then follow a specialist roadmap. Some topics assume familiarity with earlier concepts and the roadmap shows suggested prerequisites.</p></details>
        <details><summary>Are there exams or deadlines?</summary><p>No classroom-style exams or deadlines. Use self-check questions and practical briefs to assess your understanding at your own pace.</p></details>
        <details><summary>How do I contribute?</summary><p>Review the contribution guide and propose improvements with clear sources, context and learning outcomes.</p></details>
      </section>

      <section class="legal-callout" id="nigeria-law"><div><span class="eyebrow"></span><h2>Marketing in Nigeria</h2><p>Understand the basics of advertising oversight, consumer rights, data protection and responsible marketing. The guide is educational, not legal advice.</p></div><a class="button-primary" href="#nigeria-law">Open the Nigerian regulations guide</a></section>
    `;
    const form = document.getElementById('newsletter-form');
    form.addEventListener('submit', (e) => { e.preventDefault(); document.getElementById('newsletter-note').textContent = 'Thank you for joining our newsletter waitlist.'; });
    const search = document.getElementById('roadmap-search');
    search.addEventListener('input', () => searchRoadmaps(search.value));
    searchRoadmaps('');
  }

  function searchRoadmaps(query) {
    const box = document.getElementById('search-results');
    if (!box) return;
    const q = query.trim().toLowerCase();
    if (!q) { box.innerHTML = ''; return; }
    const results = [];
    (window.TRACKS || []).forEach(t => {
      const topics = (window.TOPICS || {})[t.id] || [];
      if ((t.title + ' ' + t.description).toLowerCase().includes(q)) results.push({title:t.title, description:t.description, href:'#/'+t.id, type:'ROADMAP'});
      topics.forEach(topic => {
        if ((topic.title + ' ' + (topic.summary || '')).toLowerCase().includes(q)) results.push({title:topic.title, description:t.title + ' · ' + (topic.summary || ''), href:'#/'+t.id+'?topic='+encodeURIComponent(topic.id), type:'TOPIC'});
      });
    });
    const limited = results.slice(0, 8);
    box.innerHTML = limited.length ? `<p class="search-label">${results.length} result${results.length===1?'':'s'}${results.length>8?' · showing first 8':''}</p><div class="search-result-list">${limited.map(r=>`<a href="${esc(r.href)}" class="search-result"><span class="result-type">${esc(r.type)}</span><span><strong>${esc(r.title)}</strong><small>${esc(r.description)}</small></span><b></b></a>`).join('')}</div>` : `<p class="search-empty">No matches yet. Try a broader term such as “content”, “research” or “campaign”.</p>`;
  }

  function card(t) {
    if (t.status !== 'live') {
      return `<div class="card soon"><h2>${esc(t.title)}</h2><p>${esc(t.description)}</p><span class="chip">Hey bestie, the newsletter is coming soon, we just need to get a few more people to subscribe.</span></div>`;
    }
    const c = counts(t.id);
    const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
    return `<a class="card live" href="#/${esc(t.id)}"><h2>${esc(t.title)}</h2><p>${esc(t.description)}</p>
      <span class="muted">${c.done} of ${c.total} done</span>
      <div class="bar"><i style="width:${pct}%"></i></div></a>`;
  }

  function renderTrack(track) {
    const topics = window.TOPICS[track.id];
    ctx = { track, topics, by: new Map(topics.map((t) => [t.id, t])), layout: Layout.compute(topics) };
    selected = null;
    document.title = track.title + ' roadmap';
    app.innerHTML = `
      <a class="back" href="#/">All roadmaps</a>
      <h1>${esc(track.title)}</h1>
      <p class="lede">${esc(track.description)}</p>
      <div class="meta"><span id="prog"></span>
        <span class="key"><i style="border-color:var(--done);background:var(--done)"></i>Done</span>
        <span class="key"><i style="border-color:var(--accent)"></i>Ready to learn</span>
        <span class="key"><i style="border-color:var(--later)"></i>Later</span>
        <span class="key"><i style="border-color:var(--later);border-style:dashed"></i>Optional</span></div>
      <div class="graph" id="graph"></div>
      <div class="panel" id="panel"></div>
      ${renderCourseIntro(track)}
      <button class="reset" id="reset" type="button">Reset progress for this roadmap</button>`;
    refresh();
  }


  function renderCourseIntro(track) {
    const c = (window.COURSES || {})[track.id] || {};
    const h = (window.HANDBOOK || []).find(x => x.id === track.id);
    if (!h && !c) return '';
    const escList = (items) => (items || []).map(x => `<li>${esc(x)}</li>`).join('');
    const references = (h?.refs || []).map(r => `<li><a href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a></li>`).join('');
    const theory = (h?.theories || []).map((t,i) => `<article class="theory-card"><span class="theory-index">${String(i+1).padStart(2,'0')}</span><div><h4>${esc(t[0])}</h4><p>${esc(t[1])}</p></div></article>`).join('');
    const refsBlock = references ? `<section class="references"><span class="eyebrow">FURTHER READING</span><h3>References and recommended reading</h3><ol>${references}</ol><p class="muted">References are starting points, not exhaustive bibliographies. Check editions, access conditions and publication details before citing in formal work.</p></section>` : '';
    const roles = (h?.jobs || c.careerRoles || []).map(x=>`<li>${esc(x)}</li>`).join('');
    const chapterTopics = (window.TOPICS || {})[track.id] || [];
    const topicGroups = [...chapterTopics.reduce((map, topic) => {
      const stage = topic.stage || 'Core topics';
      if (!map.has(stage)) map.set(stage, []);
      map.get(stage).push(topic);
      return map;
    }, new Map()).entries()];
    const topicSyllabus = topicGroups.map(([stage, topics], index) => `<details class="topic-syllabus"><summary><span class="syllabus-index">${String(index+1).padStart(2,'0')}</span><span><strong>Learning stage: ${esc(stage)}</strong><small>${topics.length} topic${topics.length===1?'':'s'} · follow the topic links to open detailed lessons</small></span><span class="syllabus-plus">+</span></summary><ul>${topics.map(topic => `<li><a href="#/${esc(track.id)}?topic=${encodeURIComponent(topic.id)}">${esc(topic.title)}</a><span>${esc(topic.level || '')}</span></li>`).join('')}</ul></details>`).join('');
    return `
      <section class="course-intro handbook" id="chapter">
        <div class="chapter-masthead"><div><span class="eyebrow">CHAPTER ${String((window.TRACKS||[]).findIndex(x=>x.id===track.id)+1).padStart(2,'0')} · SELF-PACED HANDBOOK</span><h2>${esc(h?.title || c.title || track.title)}</h2><p class="chapter-subtitle">${esc(h?.subtitle || track.description)}</p></div><div class="chapter-stamp"><span>LEARN</span><b>&</b><span>APPLY</span></div></div>
        <section class="handbook-section">
          <span class="eyebrow"></span><h3>What is ${esc((h?.title || c.title || track.title).toLowerCase())}?</h3>
          <p class="definition-lead">${esc(h?.definition || c.definition || track.description)}</p>
          <div class="lecturer-note"></strong><p></p></div>
          <h4>What you should be able to do</h4><ul>${escList(c.outcomes || [`Explain the central concepts in ${h?.title || track.title}.`,`Apply the chapter's frameworks to a real business problem.`,`Interpret evidence and communicate a justified recommendation.`])}</ul>
          <h4>Career pathways</h4><p class="muted">These are possible roles you can take up after building the relevant skills and portfolio evidence.</p><ul class="career-roles">${roles}</ul>
        </section>

        <section class="handbook-section">
          <div class="section-title-row"><div><span class="eyebrow"></span><h3>Theories and core concepts</h3></div></div>
          <div class="theory-list">${theory}</div>
        </section>

        <section class="handbook-section topic-syllabus-section">
          <span class="eyebrow"></span><h3>Topics grouped by learning stage</h3>
          <p>Each group below contains the roadmap topics for this chapter. Use the graph above to choose a topic then study its detailed learning material, resources and practical work. Groups reflect the existing learning stages and prerequisite structure.</p>
          <div class="topic-syllabus-list">${topicSyllabus}</div>
        </section>

        <section class="handbook-section case-grid">
          <article class="case-card local-case"><span class="eyebrow"></span><h3>Local case study</h3><p>${esc(h?.ng_case || '')}</p><div class="case-questions"><strong>Analyse the case</strong><ol><li>Which marketing decision or capability is most visible in the evidence?</li><li>What additional evidence would you need before making a claim?</li><li>What would you recommend and how would you measure whether it worked?</li></ol></div>${h?.refs?.length ? `<p class="case-source">Source: <a href="${esc(h.refs[h.refs.length-1][1])}" target="_blank" rel="noopener">${esc(h.refs[h.refs.length-1][0])}</a></p>` : ''}<p class="case-disclaimer">Public company material may reflect the organisation's own perspective. Separate reported facts from analysis and seek independent evidence where possible.</p></article>
          <article class="case-card global-case"><span class="eyebrow"></span><h3>Global case study</h3><p>${esc(h?.intl_case || '')}</p><div class="case-questions"><strong>Compare and critique</strong><ol><li>Which part of the model might transfer to another market?</li><li>Which customer, cultural, regulatory or channel differences could change the result?</li><li>What would you adapt for a Nigerian business with a different budget or scale?</li></ol></div></article>
        </section>

        <section class="handbook-section practical-guide">
          <span class="eyebrow"></span><h3>Your practical guide</h3><p>${esc(h?.practical || '')}</p>
          <ol><li>Define the business decision and audience.</li><li>List the evidence you have, the assumptions you are making and the gaps you need to close.</li><li>Choose a framework and explain why it fits.</li><li>Develop a recommendation with practical steps, costs, risks and measures of success.</li><li>Review your work against the intended outcome; note what you would test or improve next.</li></ol>
          <div class="self-check"><h4>Ask yourself these questions</h4><ul><li>Can I explain the central idea without copying the definition?</li><li>Can I identify when this framework is useful and when it is not?</li><li>Can I support my recommendation with evidence and clearly labelled assumptions?</li><li>Can I explain the customer, commercial and ethical consequences of my choice?</li></ul></div>
        </section>
        ${track.id === 'digital' || track.id === 'pr' || track.id === 'lifecycle' || track.id === 'foundations' ? `<section class="handbook-section regulation-note"><span class="eyebrow">NIGERIAN PRACTICE NOTE</span><h3>Regulation is part of the work</h3><p>Marketing teams should check claim substantiation, consumer transparency, data minimisation, privacy notices, lawful basis, direct-marketing objections, retention and security. Advertising approval requirements can vary by category and format; confirm the current ARCON code and vetting process before exposure.</p><a href="#nigeria-law" class="text-link">Read the Nigerian marketing regulations guide</a></section>` : ''}
        ${refsBlock}
      </section>`;
  }

  function renderNigeriaLaw() {
    document.title = 'Nigerian Marketing Regulations';
    ctx = null;
    app.innerHTML = `
      <a class="back" href="#/">← Back to all roadmaps</a>
      <section class="legal-hero"><span class="eyebrow"></span><h1>Marketing responsibly in Nigeria</h1><p class="hero-lede">A practical orientation to advertising regulations, consumer protection and personal-data responsibilities. Use this as a learning checklist, not as legal advice or a substitute for regulator guidance and qualified counsel.</p><div class="legal-updated">Prepared 14 October 2026 · Always verify the latest regulations before your campaign goes live.</div></section>
      <div class="legal-content">
        <section class="legal-chapter"><span class="eyebrow"></span><h2>ARCON and advertising standards</h2>
          <p>The Advertising Regulatory Council of Nigeria (ARCON), established under the ARCON Act 2022, regulates advertising and marketing communications practice in Nigeria. Its official materials describe a pre-exposure vetting process for adverts and highlight risks including misleading claims, unsupported testimonials, exaggerated claims, misleading offers and comparisons that unfairly disparage competitors.</p>
          <h3>Before an advert is released</h3><ol><li>Identify the product category, audience, media and whether any sector-specific regulator also applies.</li><li>Substantiate objective claims with current, relevant evidence. Keep the evidence file, source date, test method and claim owner.</li><li>Check testimonials, influencer relationships, comparative claims, pricing, terms, exclusions, visual implications and local cultural context.</li><li>Ask the responsible agency/compliance lead whether ARCON/Advertising Standards Panel vetting or additional category clearance is required. Do not assume every format follows the same route.</li><li>Keep approval records, final artwork/version, media orders and evidence consistent. Re-check when claims, creative or product facts change.</li></ol>
          <p><strong>Practical example:</strong> “Nigeria’s No. 1” is an objective comparative claim. Before using it, define the category, geography, period and metric. Get independent substantiation and verify whether the claim and execution meets the current code and vetting requirements.</p>
          <p class="legal-caution">Check the current Nigerian Code of Advertising, vetting guidelines and the ARCON Act, and obtain specialist advice for regulated categories such as health, food, financial services, alcohol or telecoms.</p>
          <p>Official sources: <a href="https://advertcouncil.gov.ng/_who_we_are.php" target="_blank" rel="noopener">ARCON and its legal mandate</a> · <a href="https://advertcouncil.gov.ng/_adverts_vetting.php" target="_blank" rel="noopener">Adverts vetting process</a> · <a href="https://advertcouncil.gov.ng/documents/" target="_blank" rel="noopener">ARCON official documents</a>.</p>
        </section>
        <section class="legal-chapter"><span class="eyebrow"></span><h2>Federal Competition and Consumer Protection Act (FCCPA), 2018</h2>
          <p>The FCCPA is Nigeria's principal general consumer-protection and competition statute. The FCCPC highlights consumer rights to understandable information, full price disclosure, accurate product descriptions, fair dealings and protection against misleading or deceptive representations.</p>
          <h3>Campaign and commerce checklist</h3><ul><li>Show material price information clearly, including unavoidable fees and conditions before payment.</li><li>Make claims accurate and supportable. Do not hide a material limitation in fine print.</li><li>State eligibility, dates, stock limits, delivery terms, renewal terms and promotion conditions prominently.</li><li>Make refund, cancellation, warranty and complaint processes understandable and consistent with applicable law.</li><li>Do not use dark patterns or pressure tactics that undermine informed choice.</li><li>Check product labelling and sector-specific standards where relevant, including NAFDAC or SON requirements.</li></ul>
          <p><strong>Practical example:</strong> An ad promotes a product at ₦19,999 but adds a mandatory service fee only at checkout. Review the total price disclosure and consumer journey.The headline price should not mislead a reasonable buyer about the actual payable amount.</p>
          <p>Official sources: <a href="https://fccpc.gov.ng/resources-library/fccpa/" target="_blank" rel="noopener">FCCPA 2018 and official resources</a> · <a href="https://fccpc.gov.ng/consumers/consumer-rights-responsibilities/rights-responsibilities/" target="_blank" rel="noopener">Consumer rights and responsibilities</a>.</p>
        </section>
        <section class="legal-chapter"><span class="eyebrow"></span><h2>Nigeria Data Protection Act (NDPA), 2023</h2>
          <p>The NDPA governs personal-data processing within its scope. Marketing teams should work with their organisation's privacy lead to establish a lawful basis, explain purposes transparently, collect only necessary data, keep it accurate, limit retention, secure access and respect data-subject rights. Direct marketing requires particular care: people have a right to object to processing for direct-marketing purposes and consent may be required depending on the activity and applicable rules. Do not assume a purchased list or a platform upload is automatically lawful.</p>
          <h3>Before collecting or activating data</h3><ol><li>Document the purpose, data fields, source, lawful basis and responsible controller/processor.</li><li>Provide a clear privacy notice at the point of collection and avoid bundling unrelated purposes.</li><li>For consent-based activity, make the choice specific, informed and easy to withdraw; do not use pre-ticked boxes as a substitute for a genuine choice.</li><li>Record opt-outs and suppress objectors across relevant systems promptly. Do not continue direct marketing after an objection.</li><li>Review vendors, pixels, cookies, CRM integrations, audience uploads, international transfers and retention with the data privacy team.</li><li>Limit access, protect exports and document breach/escalation procedures.</li></ol>
          <p><strong>Practical example:</strong> A brand collects email addresses for a webinar. Before adding attendees to an ongoing promotional newsletter, check what they were told at registration, the lawful basis for the new purpose and whether consent or another permitted basis is required. Offer a clear preference and opt-out route.</p>
          <p class="legal-caution">The correct lawful basis depends on facts and applicable guidance. This guide is not a legal document. Check the current NDPA, NDPC guidance and any applicable sector rules before launching data-driven campaigns.</p>
          <p>Official sources: <a href="https://ndpc.gov.ng/download/nigeria-data-protection-act-2023" target="_blank" rel="noopener">Nigeria Data Protection Act 2023</a> · <a href="https://ndpc.gov.ng/resources/" target="_blank" rel="noopener">NDPC resources and guidance</a> · <a href="https://ndpc.gov.ng/faqs/" target="_blank" rel="noopener">NDPC FAQs</a>.</p>
        </section>
        <section class="legal-chapter"><span class="eyebrow"></span><h2>A practical sign-off workflow</h2>
          <ol><li><strong>Brief:</strong> define audience, objective, offer, channels, claims and data flows.</li><li><strong>Evidence:</strong> maintain claim substantiation, source records, promotion terms and proof for endorsements.</li><li><strong>Privacy:</strong> confirm lawful basis, notices, permissions, minimisation, retention and vendor controls.</li><li><strong>Regulatory review:</strong> check ARCON vetting and sector-specific approvals, where applicable.</li><li><strong>Consumer review:</strong> inspect total price, terms, accessibility, clarity, complaint routes and likely interpretation.</li><li><strong>Release control:</strong> archive the approved creative, evidence, sign-offs and version; re-review material changes.</li><li><strong>Monitor and remedy:</strong> watch complaints, honour opt-outs, correct errors and pause campaigns when a claim or risk is no longer supportable.</li></ol>
          <p>Keep a named owner for every sign-off. The legal and regulatory position can change, record the date you checked the official guidance.</p>
        </section>
        <section class="legal-sources"><h2>Primary references</h2><ul><li><a href="https://advertcouncil.gov.ng/documents/" target="_blank" rel="noopener">ARCON: Act, Code of Advertising and vetting documents</a></li><li><a href="https://fccpc.gov.ng/resources-library/fccpa/" target="_blank" rel="noopener">FCCPC: Federal Competition and Consumer Protection Act 2018</a></li><li><a href="https://ndpc.gov.ng/download/nigeria-data-protection-act-2023" target="_blank" rel="noopener">NDPC: Nigeria Data Protection Act 2023</a></li></ul><p class="legal-caution">Educational resource only. It is not legal advice, does not cover every sector rule and does not guarantee compliance. Obtain advice from qualified Nigerian counsel and the relevant regulator for specific campaigns.</p></section>
      </div>`;
    window.scrollTo(0,0);
  }

  /* ---------- graph ---------- */
  function ancestors(id, set = new Set()) {
    (ctx.by.get(id).prereqs || []).forEach((p) => { if (!set.has(p)) { set.add(p); ancestors(p, set); } });
    return set;
  }

  const wrap = (text, max = 19) => {
    const lines = [''];
    text.split(' ').forEach((w) => {
      const last = lines[lines.length - 1];
      if (last && (last + ' ' + w).length > max) lines.push(w); else lines[lines.length - 1] = (last + ' ' + w).trim();
    });
    return lines;
  };

  function drawGraph() {
    const { topics, layout: L } = ctx;
    const path = selected ? new Set([...ancestors(selected), selected]) : new Set();
    let svg = L.labels.map((l) => `<text class="stage-label" x="${l.x}" y="16">${esc(l.stage)}</text>`).join('');

    topics.forEach((t) => (t.prereqs || []).forEach((pid) => {
      const a = L.nodes[pid], b = L.nodes[t.id];
      const x1 = a.x + L.W, y1 = a.y + L.H / 2, x2 = b.x, y2 = b.y + L.H / 2, m = (x1 + x2) / 2;
      const hl = path.has(pid) && path.has(t.id) ? ' hl' : '';
      svg += `<path class="edge${hl}" d="M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2}"/>`;
    }));

    topics.forEach((t) => {
      const n = L.nodes[t.id], lines = wrap(t.title), st = statusOf(t);
      const cls = ['node', st, t.optional ? 'optional' : '', selected === t.id ? 'sel' : ''].join(' ');
      const text = lines.map((ln, i) => `<text x="${n.x + L.W / 2}" y="${n.y + (lines.length > 1 ? 19 + i * 14 : L.H / 2 + 4)}">${esc(ln)}</text>`).join('');
      svg += `<g class="${cls}" data-id="${esc(t.id)}" tabindex="0" role="button" aria-label="${esc(t.title)}, ${st}"><rect x="${n.x}" y="${n.y}" width="${L.W}" height="${L.H}" rx="9"/>${text}</g>`;
    });

    document.getElementById('graph').innerHTML = `<svg width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" role="group" aria-label="${esc(ctx.track.title)} roadmap">${svg}</svg>`;
  }

  /* ---------- detailed topic learning material ---------- */
  function buildDetailedTopicMaterial(track, topic, lesson) {
    const title = topic.title;
    const summary = topic.summary || '';
    const discipline = track.title;
    const id = (topic.id + ' ' + title).toLowerCase();
    const domains = [
      {match:/website|landing page|conversion rate|cro|user experience|ux|web design/, meaning:'A website or landing page is a digital touchpoint that helps a visitor understand an offer and take an appropriate next step. Its effectiveness depends on message relevance, information hierarchy, trust, accessibility, load performance and the friction between intent and action.', principles:'People arrive with different levels of awareness and different questions. The page should make the offer, audience, value, evidence and next action clear. A landing page usually narrows attention to one primary conversion goal, while a broader website must support several tasks and routes through the customer journey.', workflow:'Begin with audience intent. Match the page headline to the promise made in the advert or search result. Organise content around customer questions, place proof near claims, make the primary action easy to identify, test forms on mobile, and check accessibility, speed and analytics before release.', measures:'Choose a primary conversion measure that reflects the page goal, such as qualified lead submission, completed purchase or appointment booking. Diagnose supporting indicators such as engaged sessions, form abandonment, page speed, error rate and lead quality. A high conversion rate is not useful if it attracts unsuitable leads or creates misleading expectations.', risks:'Avoid dark patterns, hidden fees, inaccessible forms, unsupported claims and collecting information that the business does not need. A page should fulfil the promise that brought the visitor there.'},
      {match:/tracking|tag management|analytics|measurement|attribution|dashboard|kpi|metric|reporting|experiment|a\/b test/, meaning:'Measurement is the process of turning business questions into observable events and indicators. Tracking records interactions, analytics interprets patterns, reporting communicates findings, experimentation helps test whether a change plausibly caused an outcome. These activities are related, but they are not interchangeable.', principles:'Start with a decision, not a dashboard. Define the outcome, operational definition, data source, time window, owner and known limitations for every key metric. An event must be named consistently and collected reliably before it can support a conclusion. Attribution models allocate credit according to rules, not objective truth about cause.', workflow:'Map the customer journey and important actions. Write a measurement plan, define event names and parameters, document campaign tags, test data in a staging or debugging environment, check consent and privacy controls, then compare collected data with a known source. Annotate launches and tracking changes so later analysis has context.', measures:'Use a small hierarchy: business outcomes, conversion outcomes, diagnostic behaviour and delivery quality. Review data completeness, duplicate events, missing parameters, consent-related gaps and differences between platform reports and internal records. State the attribution model and reporting window whenever presenting results.', risks:'Do not infer causation from correlation or treat platform-reported conversions as a complete account of customer behaviour. Protect personal data, set retention limits and document uncertainty.'},
      {match:/search engine|seo|keyword|organic search|technical seo|search intent/, meaning:'Search engine optimisation is making useful, credible content discoverable and understandable through search results. It combines technical accessibility, content relevance, information architecture and authority. SEO is a long-term acquisition effort, not a guarantee of rankings.', principles:'Search engines try to satisfy a searcher’s intent. Research therefore considers the problem behind a query, the language customers use, the type of result they expect and the quality of existing answers. Keyword volume alone does not establish commercial value and rankings are affected by competition, site health, location and changing search systems.', workflow:'Research query intent, group related queries by task, inspect the current search results, build a useful page that answers the real question, ensure it can be crawled and indexed, connect it through clear internal links, and monitor search impressions, qualified visits and meaningful conversions. Refresh content when the facts or user need change.', measures:'Track relevant non-brand and brand visibility separately, organic clicks, qualified sessions, landing-page engagement, leads or sales assisted by organic search and technical health. Interpret ranking changes alongside seasonality, algorithm changes, site releases and demand shifts.', risks:'Avoid keyword stuffing, copied content, doorway pages and unsupported expertise claims. Do not promise a ranking position or confuse traffic growth with business value.'},
      {match:/paid media|paid search|google ads|meta ads|advertising|media buying|programmatic|campaign optimisation|performance marketing/, meaning:'Paid media is the purchase of distribution or attention through advertising platforms and publishers. Performance marketing links this spend to measurable actions, while brand campaigns may focus on reach, memory or future demand. The right objective depends on the business problem and the customer’s readiness to act.', principles:'Campaign performance is shaped by audience, offer, creative, placement, bidding, landing experience, competition and measurement quality. A platform can optimise only toward the objective and signals it receives. Lower cost per click is not automatically better if the traffic is less likely to become a valuable customer.', workflow:'Translate the business goal into a campaign objective and conversion definition. Segment audiences or intent, develop creative variations, set budget and bid controls, verify tracking, launch with a test plan, monitor delivery and quality, then change one or a small number of variables at a time where practical. Record decisions and learning.', measures:'Select metrics that match the objective: reach and frequency for awareness, qualified visits for traffic, cost per qualified lead for lead generation, and contribution margin or incremental sales for commerce. Include spend, conversion rate, lead quality and downstream outcomes where data is available.', risks:'Watch for audience saturation, invalid traffic, platform dependency, weak incrementality, misleading attribution and poor creative fit. Follow advertising rules, platform policies and privacy requirements. Do not scale based on a short period of noisy results.'},
      {match:/email|crm|lifecycle|retention|loyalty|customer journey|marketing automation|lead nurturing/, meaning:'Lifecycle and relationship marketing manage communications across the customer relationship from first contact through onboarding, repeat use, retention and reactivation. The purpose is to make each interaction timely and useful based on the customer’s needs and relationship stage.', principles:'Relevance depends on permission, context, behaviour and value exchange. Segmentation can use lifecycle stage, recency, frequency, preferences or expressed needs, but it should remain explainable and proportionate. Automation improves consistency, it does not remove the need for governance, testing or human judgement.', workflow:'Map the lifecycle and identify moments where customers need information or support. Define entry and exit rules, suppression rules, frequency limits, message purpose and success events. Write messages for a clear customer task, test rendering and links, monitor complaints and unsubscribes, and review whether the journey improves customer outcomes.', measures:'Consider delivery and bounce quality, clicks, completed actions, repeat purchase, time to second purchase, retention, churn, unsubscribe rate, complaint rate and incremental revenue. Compare cohorts over time and use holdout groups where feasible to separate campaign effects from behaviour that would have happened anyway.', risks:'Respect consent and opt-out choices, minimise data, protect sensitive segments, and avoid excessive frequency or manipulative urgency. A high open rate can be unreliable because of privacy features and should not be treated as proof of business impact.'},
      {match:/brand|positioning|identity|equity|reputation|purpose|architecture|naming/, meaning:'Brand management shapes the meanings, expectations and associations people attach to an organisation, product or service. It includes the promise made, the evidence that supports it, the distinctive cues that help people recognise it and the experience that reinforces or weakens it.', principles:'Positioning requires a clear audience, category frame, relevant benefit, credible reason to believe and meaningful difference. Brand identity expresses that strategy through verbal and visual choices. Brand equity accumulates through awareness, associations, perceived quality and loyalty, but these outcomes are affected by product performance, availability, price and culture as well as communications.', workflow:'Research customers and alternatives, define the category and competitive context, identify a relevant customer problem, articulate the promise and supporting evidence, establish identity rules, align touchpoints, and measure both short-term response and long-term brand indicators. Check that internal teams can deliver the promise consistently.', measures:'Use aided and unaided awareness, consideration, preference, associations, distinctiveness, search demand, price sensitivity, repeat behaviour and customer feedback. Interpret survey measures alongside actual behaviour and market conditions rather than assuming one metric captures brand strength.', risks:'Avoid vague positioning, unsupported superiority claims and identity changes made only to follow trends. Consistency does not mean refusing to adapt, it means preserving the core promise while responding to customer and market evidence.'},
      {match:/content|copywriting|storytelling|editorial|seo content|content strategy/, meaning:'Content marketing plans and distributes useful or relevant material to attract, inform, reassure or retain a defined audience. Content can answer questions, demonstrate expertise, reduce perceived risk or help customers use a product. It differs from publishing for its own sake because it is tied to an audience need and a business purpose.', principles:'A content strategy links audience insight, purpose, message, format, channel, distribution and measurement. Each asset should have a job in the customer journey. Useful content needs evidence, clarity, a recognisable point of view and a reason to exist beyond filling a content calendar.', workflow:'Research audience questions and search behaviour, define the intended audience and action, choose a content format, create a brief, verify facts and rights, edit for clarity and accessibility, publish with distribution planned, then review performance and update or retire the asset when necessary.', measures:'Track qualified reach, completion or consumption where meaningful, return visits, saves or shares, assisted conversions, subscriber quality, sales enablement use and content maintenance cost. Vanity measures alone do not establish usefulness.', risks:'Avoid unsupported claims, plagiarism, undisclosed sponsorships, insensitive representation and volume targets that reward low-value output. Obtain consent and rights for customer stories, images and personal information.'},
      {match:/social media|community|influencer|creator|engagement|platform/, meaning:'Social media marketing uses social platforms to communicate, listen, distribute content, support communities and influence customer decisions. Its value depends on the fit between audience behaviour, brand purpose, platform mechanics and the organisation’s ability to participate consistently.', principles:'Reach, engagement and conversion are different outcomes. Platform-native content may earn attention, but repeated exposure should reinforce what the organisation wants to be known for. Community management includes moderation, listening and escalation, not only posting.', workflow:'Set the role of each platform, define audience and content pillars, establish a realistic publishing schedule, plan creative formats, assign moderation and response responsibilities, prepare escalation rules, measure performance by content purpose and adapt based on evidence.', measures:'Track reach, meaningful engagement, video completion, saves, shares, profile actions, response time, sentiment themes and conversions where trackable. Compare like with like and note changes in distribution algorithms or paid support.', risks:'Do not chase engagement that confuses the brand promise, buy fake followers, disclose private customer details or leave harmful comments unmanaged. Influencer partnerships need clear disclosures, appropriate due diligence and substantiated claims.'},
      {match:/research|consumer insight|survey|qualitative|quantitative|segmentation|persona|customer insight/, meaning:'Marketing research is the systematic collection and interpretation of information to reduce uncertainty about customers, competitors and markets. It can describe what people do, understand why they do it, estimate market patterns or test a proposed explanation. Research informs judgement, it does not eliminate uncertainty.', principles:'Method follows the question. Qualitative methods are useful for meaning and exploration, while quantitative methods estimate patterns across a defined sample. Sampling, wording, recruitment, non-response, social desirability and researcher assumptions can all distort findings. A persona or segment is a hypothesis to validate, not a substitute for evidence.', workflow:'Specify the decision and information gap, review existing evidence, choose a suitable method, define the population and sampling approach, pilot the instrument, collect data ethically, analyse patterns and exceptions, communicate limitations, and connect findings to a decision or further test.', measures:'Evaluate sample suitability, response and completion rates, uncertainty, data quality, consistency across methods and the decision value of findings. Use confidence intervals or other appropriate uncertainty descriptions when the design supports them.', risks:'Obtain appropriate consent, minimise personal data, protect participants, avoid leading questions and report inconvenient findings. Never claim that a small convenience sample represents an entire market without qualification.'},
      {match:/public relations|media relations|communications|crisis|reputation|press release|stakeholder/, meaning:'Public relations and corporate communications build and maintain relationships with stakeholders through credible information, listening and consistent organisational behaviour. They include earned media, executive communication, issues management, internal communication and crisis response.', principles:'Credibility depends on accuracy, timing, access to evidence and whether organisational actions support public statements. Media coverage is an outcome of relevance and editorial judgement, not something a brand can fully control. Crisis communication must balance speed with verification and accountability.', workflow:'Map stakeholders and likely concerns, define the communication objective, verify facts with accountable owners, prepare clear messages and evidence, select appropriate channels and spokespeople, monitor questions and misinformation, respond consistently, and document lessons after the issue closes.', measures:'Use message accuracy, quality and relevance of coverage, stakeholder understanding, response time, issue resolution, trust indicators and the proportion of inquiries answered. Raw clip counts or estimated media value do not fully measure reputation impact.', risks:'Avoid speculation, false certainty, hidden sponsorship, misleading statements and defensive language that ignores affected people. Correct errors openly and protect confidential or personal information.'},
      {match:/product marketing|go-to-market|gtm|product launch|value proposition|messaging|sales enablement/, meaning:'Product marketing connects customer understanding, product capabilities, positioning, messaging, launch planning and commercial adoption. It helps the organisation explain who a product serves, which problem it solves, why the solution is credible and how sales and customer-facing teams should communicate its value.', principles:'A strong value proposition describes a relevant customer outcome and the reason the offer can deliver it. Product features matter only when linked to customer jobs, pains or gains. Go-to-market choices coordinate audience, offer, pricing, channels, sales readiness, launch timing and post-launch learning.', workflow:'Research the market and alternatives, identify priority use cases, test the value proposition, create messaging and proof points, align product and sales teams, plan launch channels and enablement, monitor adoption and objections, then feed customer evidence back to product decisions.', measures:'Track qualified pipeline, activation, adoption of key features, win rate, sales cycle, reasons for loss, retention and customer-reported value. Distinguish launch activity from actual adoption and revenue outcomes.', risks:'Do not promise capabilities the product cannot deliver. Keep claims, sales materials and product experience aligned and revisit positioning when customer evidence or competitive conditions change.'},
      {match:/event|experiential|activation|sponsorship|field marketing/, meaning:'Event and experiential marketing create planned interactions between an organisation and an audience through physical, virtual or hybrid experiences. The experience may build awareness, improve relationships, generate qualified leads, support sales or demonstrate a product in a context that advertising alone cannot reproduce.', principles:'The event concept should be designed around audience value and a measurable purpose. Venue, timing, accessibility, logistics, staffing, content, safety and follow-up shape the experience. Attendance is a delivery measure, not proof that the event achieved its commercial or relationship objective.', workflow:'Set the objective and audience, select the event format, define the attendee value, build the budget and risk plan, assign vendors and owners, plan registration and data collection, rehearse the experience, deliver and monitor, then follow up with attendees and evaluate against the brief.', measures:'Track registrations, attendance rate, qualified conversations, meetings held, pipeline progression, participation, satisfaction, cost per qualified outcome and post-event follow-up completion. Include direct costs and realistic staff time in the evaluation.', risks:'Plan accessibility, safety, permissions, data notices, photography/videography consent, supplier controls and contingencies. Do not collect attendee data without a clear purpose or make sponsorship claims that overstate the relationship.'},
      {match:/trade marketing|retail|merchandising|category management|point of sale|distribution/, meaning:'Trade marketing aligns brand and channel activities to improve product availability, visibility and sales through distributors, wholesalers, retailers and other go-to-market partners. It connects consumer demand with the realities of shelf space, stock, incentives, retailer priorities and execution.', principles:'A promotion cannot sell products that are unavailable. Channel economics, retailer margins, assortment, distribution coverage and execution quality influence whether consumer demand converts to sales. Sell-in to a retailer and sell-through to an end customer are different outcomes.', workflow:'Understand channel structure and shopper behaviour, review distribution and stock data, agree objectives with channel partners, plan assortment and merchandising, define trade terms and promotional mechanics, equip field teams, audit execution, and compare sell-through and profitability with the baseline.', measures:'Use numeric and weighted distribution, availability, share of shelf, stock-out rate, sell-through, promotion uplift, trade spend efficiency, retailer compliance and contribution after discounts. Check for forward buying and post-promotion dips.', risks:'Avoid incentives that create channel conflict, unclear promotion terms, inaccurate retail claims or activity that increases volume while destroying margin. Ensure field audits are reliable and representative.'},
      {match:/b2b|account-based|demand generation|lead generation|pipeline|sales funnel|enterprise/, meaning:'B2B marketing helps organisations identify, educate and engage buying groups whose decisions often involve multiple stakeholders, higher perceived risk and longer evaluation cycles. The objective may be to create demand, make existing demand easier to capture, support sales progression or grow strategic accounts.', principles:'The person who uses a product may not control the budget or approve the purchase. Buying committees have different concerns and progress may depend on evidence, implementation risk, procurement and internal consensus. Lead volume is only useful when leads fit the target market and can progress.', workflow:'Define the ideal customer profile and buying roles, research account needs, align marketing and sales on qualification, develop useful proof and messaging, select channels, coordinate follow-up, document funnel stages and reasons for loss, and review pipeline quality with sales.', measures:'Track target-account engagement, marketing-qualified and sales-accepted leads where definitions are agreed, opportunity creation, stage conversion, pipeline velocity, win rate, acquisition cost, deal quality and expansion. Keep definitions consistent across teams.', risks:'Avoid overcounting low-intent leads, sending generic outreach at scale, mishandling personal data or claiming marketing sourced revenue without a clear attribution method.'},
      {match:/pricing|promotion|discount|revenue management|commercial/, meaning:'Pricing and promotion decisions shape perceived value, demand, customer mix and the economics of an offer. Price communicates quality and positioning as well as determining revenue. A discount can accelerate a purchase, but it can also train customers to wait, reduce margin or attract customers who do not return.', principles:'Assess customer willingness to pay, alternatives, costs, price structure, elasticity, fairness and competitive response. The right price is not always the lowest price. Promotional evaluation should consider what would have happened without the offer and whether extra sales compensate for reduced margin.', workflow:'Clarify the business objective, segment and use case, analyse cost and customer evidence, model possible price or offer structures, check legal transparency and channel effects, test where feasible, and review net outcomes including repeat behaviour and margin.', measures:'Use realised price, gross margin, conversion, average order value, discount depth, incremental volume, contribution, redemption and post-promotion retention. Revenue growth without contribution growth may be a poor result.', risks:'Avoid hidden charges, false reference prices, unclear eligibility and discriminatory or exploitative practices. Explain the total price and material conditions before customers commit.'},
      {match:/leadership|strategy|planning|budget|agency management|team|organisation|governance/, meaning:'Marketing management turns market evidence and organisational priorities into choices, resources, coordinated delivery and learning. Strategy establishes where to compete and how to create value. Management builds the people, processes, budgets and governance needed to deliver that strategy over time.', principles:'A plan is a set of explicit choices and assumptions not a list of channels. Effective management aligns goals, owners, capabilities, resources, dependencies and measures. Trade-offs are unavoidable, so leaders must state what will not be prioritised and how performance will be reviewed.', workflow:'Translate organisational objectives into marketing outcomes, diagnose the market and current performance, choose target audiences and priorities, allocate resources, define accountability, align stakeholders, manage delivery risks, review results and revise assumptions when evidence changes.', measures:'Track outcome measures alongside delivery quality, budget variance, forecast accuracy, team capacity, campaign learning, customer outcomes and risk controls. A large activity volume does not prove strategy effectiveness.', risks:'Avoid unowned priorities, budgets disconnected from objectives, metrics that reward the wrong behaviour and agency relationships without clear briefs or evaluation. Governance should enable responsible decisions rather than become a last-minute checkbox.'}
    ];
    const matched = domains.find(x => x.match.test(id));
    const domain = matched || {
      meaning:`${title} is a specialised capability within ${discipline}. It concerns ${summary ? summary.charAt(0).toLowerCase()+summary.slice(1) : 'a defined marketing decision or activity'} and should be understood in relation to the audience, business objective and customer experience it is intended to support. The boundaries of the topic matter: define what it includes, what it does not include, and which adjacent functions must contribute.`,
      principles:`The central principle is fit between the problem, the audience, the proposed activity and the evidence used to judge success. Begin with the customer or business question rather than a preferred tactic. Distinguish outputs (what the team produces), outtakes (what people notice or understand) and outcomes (what changes for the customer or organisation).`,
      workflow:`Define the decision and intended outcome; describe the priority audience and context; review existing research and performance; state assumptions and evidence gaps; select an approach and compare alternatives; assign owners, resources and timelines; define measurement before execution; review results and document what should change.`,
      measures:`Choose a small set of indicators tied to the intended outcome. Establish definitions, baselines, data sources, reporting windows and ownership. Combine quantitative evidence with customer feedback where possible, and investigate segments or exceptions rather than relying only on an overall average.`,
      risks:`Common risks include unclear objectives, copying another organisation without testing context, overclaiming from weak data, overlooking operational dependencies, excluding customer perspectives and ignoring legal or ethical obligations. Make uncertainty explicit and design a proportionate way to learn more.`
    };
    return [
      {heading:`Meaning, scope and purpose of ${title}`,body:[domain.meaning, `In the context of ${discipline}, this topic connects to the wider system of decisions that determines how value is created, communicated, delivered and evaluated. Its practical value depends on the specific situation, not on using a technique simply because it is popular.`, `The roadmap summary for this topic is: ${summary || 'understand the core concept, identify when it is useful and apply it with evidence.'}`]},
      {heading:'Core principles and concepts',body:[domain.principles, `Separate the strategic question from the execution choice. The strategic question asks what problem deserves attention and why; the execution choice asks which method, message, channel or process is most appropriate. Confusing the two can lead teams to optimise activity that does not address the underlying problem.`, `Consider both the immediate result and second-order effects. A short-term gain can create future costs through lower trust, poor-quality leads, customer fatigue, weak margins or operational pressure.`]},
      {heading:'Application',body:[domain.workflow, `Before starting, write a concise brief containing the situation, objective, audience, constraints, deliverables, owner, timing and success criteria. A brief should be specific enough that another competent person can understand what must be done and how the result will be judged.`, `During delivery, keep a decision log. Record the evidence available, options considered, assumptions made, approval required and reason for material changes. This makes the work easier to review and helps future learners distinguish a deliberate choice from an undocumented guess.`]},
      {heading:'Evidence, measurement and interpretation',body:[domain.measures, `A metric becomes useful when its definition and decision role are clear. Document the numerator and denominator where relevant, the reporting period, source system, segment, exclusions and known data-quality issues. Compare results with an appropriate baseline or target, not an arbitrary benchmark.`, `When performance changes, consider competing explanations such as seasonality, pricing, stock availability, competitor activity, distribution changes, audience mix, creative fatigue or tracking changes. State what the data supports and what remains uncertain.`]},
      {heading:'Limitations and ethics',body:[domain.risks, `Apply the topic with attention to customer welfare, truthful communication, accessibility, privacy, cultural context and relevant regulation. In Nigeria, check the current advertising, consumer-protection and data-protection requirements that apply to the activity. Escalate specialist legal, privacy, security or sector questions instead of treating a general learning resource as formal advice.`, `A sound professional recommendation explains the expected benefit, costs, risks, alternatives and evidence that would cause the recommendation to change. Good practice includes knowing when the available information is not enough to justify a confident claim.`]},
      {heading:'Self assessment',body:[`Explain ${title} in your own words, then identify one business situation where it would matter and one where it would be a poor fit.`, `What evidence would you request before recommending an approach? Which assumptions could most easily prove wrong, and how would you test them?`, `How would you explain success to a business owner who cares about commercial outcomes rather than marketing activity? What customer or ethical consequences would you monitor alongside performance?`]}
    ];
  }

  /* ---------- panel ---------- */
  function drawPanel() {
    const el = document.getElementById('panel');
    if (!selected) { el.innerHTML = '<p class="hint">Select a topic to see its description, prerequisites and resources.</p>'; return; }
    const t = ctx.by.get(selected);
    const needs = (t.prereqs || []).map((id) => ctx.by.get(id));
    const unlocks = ctx.topics.filter((x) => (x.prereqs || []).includes(t.id));
    const chips = (list) => list.map((x) => `<button type="button" data-go="${esc(x.id)}">${esc(x.title)}</button>`).join('');
    const resources = (t.resources || []).length
      ? `<ul>${t.resources.map((r) => `<li>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>` : esc(r.title)}${r.author ? ' by ' + esc(r.author) : ''} <span class="muted">(${esc(r.type)}, ${esc(r.cost)})</span></li>`).join('')}</ul>`
      : '<p class="muted">Resources coming soon. Make a contribution to make it faster and better.</p>';
    const done = isDone(ctx.track.id, t.id);
    const lesson = t.lesson || {};
    const assignment = t.assignment || {};
    const objectives = (lesson.objectives || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const sections = buildDetailedTopicMaterial(ctx.track, t, lesson).map((x) => `<section class="lesson-section"><h4>${esc(x.heading)}</h4>${x.body.map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('');
    const tasks = (assignment.tasks || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const deliverables = (assignment.deliverables || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const rubric = (assignment.assessment || []).map((x) => `<tr><td>${esc(x.criterion)}</td><td>${x.weight}%</td><td>${esc(x.standard)}</td></tr>`).join('');
    el.innerHTML = `
      <h2>${esc(t.title)}</h2>
      <p>${esc(t.summary)}</p>
      <div class="links">${needs.length ? 'Needs: ' + chips(needs) : 'No prerequisites'}</div>
      ${unlocks.length ? `<div class="links">Unlocks: ${chips(unlocks)}</div>` : ''}
      <details open class="learning-block"><summary>Learning material</summary>
        <h3>By the end, you should be able to</h3><ul>${objectives}</ul>${sections}
        <h3>Key terms</h3><p>${(lesson.keyTerms || []).map(esc).join(' · ')}</p>
      </details>
      <details class="learning-block"><summary>${esc(assignment.title || 'Practical assignment')}</summary>
        <p>${esc(assignment.scenario || '')}</p><h3>Your tasks</h3><ol>${tasks}</ol>
        <h3>Submission checklist</h3><ul>${deliverables}</ul><p><strong>Stretch task:</strong> ${esc(assignment.extension || '')}</p>
        <h3>Assessment rubric</h3><div class="rubric-wrap"><table class="rubric"><thead><tr><th>Criterion</th><th>Weight</th><th>What good work is</th></tr></thead><tbody>${rubric}</tbody></table></div>
      </details>
      <details class="learning-block case-study" open><summary>Applied case study: ${esc((t.caseStudy || {}).title || 'Case study')}</summary>
        <p>${esc((t.caseStudy || {}).context || '')}</p><h3>Evidence available</h3><ul>${((t.caseStudy || {}).evidence || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h3>Your challenge</h3><p>${esc((t.caseStudy || {}).challenge || '')}</p><ol>${((t.caseStudy || {}).prompts || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <details><summary>Marketing Butterfly's guidance</summary><p>${esc((t.caseStudy || {}).facilitatorNote || '')}</p></details>
      </details>
      <details class="learning-block quiz-block"><summary>Knowledge check: ${((t.quiz || []).length)} questions</summary>
        <p class="muted">Choose one answer per question. Feedback explains the reasoning. Your score is for practice not for formal grading.</p>
        ${((t.quiz || []).map((q, qi) => `<fieldset class="quiz-question" data-quiz="${qi}"><legend>${qi+1}. ${esc(q.question)}</legend>${q.options.map((o, oi) => `<label class="quiz-option"><input type="radio" name="quiz-${esc(t.id)}-${qi}" value="${oi}"> ${esc(o)}</label>`).join('')}<div class="quiz-feedback" id="feedback-${esc(t.id)}-${qi}" aria-live="polite"></div><button type="button" class="secondary check-answer" data-check="${qi}">Check answer</button></fieldset>`).join(''))}
        <p id="quiz-score-${esc(t.id)}" class="quiz-score" aria-live="polite"></p><button type="button" class="secondary" data-reset-quiz="${esc(t.id)}">Reset quiz</button>
      </details>
      <details class="learning-block project-block"><summary>${esc((t.project || {}).title || 'Portfolio project')}</summary>
        <p>${esc((t.project || {}).brief || '')}</p><h3>Project tasks</h3><ol>${((t.project || {}).tasks || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <h3>Submission checklist</h3><ul>${((t.project || {}).deliverables || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul><p><strong>Stretch task:</strong> ${esc((t.project || {}).extension || '')}</p>
        <h3>Project assessment rubric</h3><div class="rubric-wrap"><table class="rubric"><thead><tr><th>Criterion</th><th>Weight</th><th>Professional standard</th></tr></thead><tbody>${((t.project || {}).rubric || []).map(x => `<tr><td>${esc(x.criterion)}</td><td>${x.weight}%</td><td>${esc(x.standard)}</td></tr>`).join('')}</tbody></table></div>
      </details>
      <details class="learning-block"><summary>Free learning resources</summary>${resources}<p class="muted">External resources belong to their respective publishers. Check each publisher for current availability and terms.</p></details>
      <button class="primary ${done ? 'alt' : ''}" type="button" data-toggle="${esc(t.id)}">${done ? 'Mark as not done' : 'Mark as done'}</button>`;
  }

  function refresh() {
    drawGraph();
    drawPanel();
    const chapter = document.getElementById('chapter');
    if (chapter) {
      chapter.hidden = Boolean(selected);
      chapter.setAttribute('aria-hidden', String(Boolean(selected)));
    }
    const c = counts(ctx.track.id);
    document.getElementById('prog').textContent = `${c.done} of ${c.total} topics done`;
  }

  function elSafeQuery(selector) { try { return app.querySelector(selector); } catch (_) { return null; } }
  function updateQuizScore(t) {
    const qs = t.quiz || [];
    let checked = 0, correct = 0;
    qs.forEach((q, i) => {
      const feedback = document.getElementById(`feedback-${t.id}-${i}`);
      if (!feedback || !feedback.textContent || feedback.textContent.startsWith('Choose an answer')) return;
      checked++;
      const input = elSafeQuery(`input[name="quiz-${t.id}-${i}"]:checked`);
      if (input && Number(input.value) === q.answer) correct++;
    });
    const el = document.getElementById(`quiz-score-${t.id}`);
    if (el) el.textContent = checked ? `Practice score: ${correct} of ${checked} checked answers correct.` : '';
  }

  /* ---------- events ---------- */
  app.addEventListener('click', (e) => {
    if (!ctx) return;
    const node = e.target.closest('.node');
    const go = e.target.closest('[data-go]');
    const toggle = e.target.closest('[data-toggle]');
    const check = e.target.closest('[data-check]');
    const resetQuiz = e.target.closest('[data-reset-quiz]');
    if (check && selected) {
      const t = ctx.by.get(selected), qi = Number(check.dataset.check), q = (t.quiz || [])[qi];
      const chosen = elSafeQuery(`input[name="quiz-${t.id}-${qi}"]:checked`);
      const feedback = document.getElementById(`feedback-${t.id}-${qi}`);
      if (!chosen) { feedback.className = 'quiz-feedback needs-answer'; feedback.textContent = 'Choose an answer before checking.'; return; }
      const correct = Number(chosen.value) === q.answer;
      feedback.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
      feedback.textContent = `${correct ? 'Correct. ' : 'Not quite. '} ${q.explanation}`;
      updateQuizScore(t);
    }
    else if (resetQuiz && selected) {
      const t = ctx.by.get(selected);
      app.querySelectorAll('.quiz-question input').forEach(x => { x.checked = false; });
      app.querySelectorAll('.quiz-feedback').forEach(x => { x.textContent = ''; x.className = 'quiz-feedback'; });
      const score = document.getElementById(`quiz-score-${t.id}`); if (score) score.textContent = '';
    }
    else if (node) { selected = node.dataset.id; refresh(); }
    else if (go) { selected = go.dataset.go; refresh(); }
    else if (toggle) { setDone(ctx.track.id, toggle.dataset.toggle, !isDone(ctx.track.id, toggle.dataset.toggle)); refresh(); }
    else if (e.target.id === 'reset' && confirm('Reset progress for this roadmap?')) { progress[ctx.track.id] = {}; write(KEY, progress); refresh(); }
  });

  app.addEventListener('keydown', (e) => {
    const node = e.target.closest && e.target.closest('.node');
    if (node && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      selected = node.dataset.id;
      refresh();
      const again = document.querySelector(`.node[data-id="${selected}"]`);
      if (again) again.focus();
    }
  });

  /* ---------- routing ---------- */
  function route() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [id, queryString] = raw.split('?');
    const params = new URLSearchParams(queryString || '');
    const topicId = params.get('topic');
    if (id === 'nigeria-law') { renderNigeriaLaw(); return; }
    if (['roadmaps','roadmap-list','about','newsletter','contribute','faqs'].includes(id)) { renderHome(); setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0); return; }
    const track = window.TRACKS.find((t) => t.id === id && t.status === 'live' && (window.TOPICS || {})[t.id]);
    if (track) {
      renderTrack(track);
      if (topicId && ctx.by.has(topicId)) { selected = topicId; refresh(); setTimeout(() => document.getElementById('panel')?.scrollIntoView({behavior:'smooth',block:'start'}), 0); }
    } else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
