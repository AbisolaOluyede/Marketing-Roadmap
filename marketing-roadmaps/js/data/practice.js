/* Topic-specific case studies, knowledge checks and applied projects for every roadmap topic. */
(() => {
  const contexts = {
    foundations: ['a Nigerian personal-care startup selling through Instagram and local retailers', 'a neighbourhood supermarket competing with larger chains', 'a mobile service with strong trial but weak repeat use'],
    brand: ['a Nigerian skincare brand whose packaging and social voice feel inconsistent', 'a regional bank with low brand recall among young professionals', 'a growing food brand considering a cheaper product line'],
    product: ['a fintech team launching a savings feature for first-jobbers', 'a B2B software firm struggling to explain its value to procurement teams', 'a consumer app with many downloads but low activation'],
    digital: ['an online retailer paying for clicks but recording few completed purchases', 'a service business whose landing page attracts traffic but few enquiries', 'a subscription brand with rising acquisition costs and weak tracking'],
    content: ['a specialist service firm publishing often but attracting few qualified leads', 'a consumer brand with useful expertise but no repeatable editorial process', 'a media team repurposing content without adapting it to each channel'],
    social: ['a Nigerian consumer brand with high reach but low product recall', 'a service brand receiving public complaints across social channels', 'a small business deciding which two platforms deserve its limited resources'],
    events: ['a professional association planning a half-day industry conference', 'a consumer brand sponsoring a Lagos community event', 'a software company hosting a webinar for prospective customers'],
    trade: ['a packaged-goods brand with uneven shelf visibility across retailers', 'a supermarket evaluating a price promotion with thin margins', 'a distributor network reporting inconsistent execution at point of sale'],
    pr: ['a service company facing a public complaint that is spreading online', 'a growing organisation announcing a leadership change', 'a corporate team seeking credible media coverage for a new initiative'],
    research: ['a subscription service trying to understand why customers leave', 'a retail brand choosing between two package concepts', 'a marketing team asked to explain a sales decline with limited data'],
    lifecycle: ['a digital service with high sign-ups but low first-month activation', 'an online retailer whose repeat-purchase rate is falling', 'a financial service with consented customer data across disconnected systems'],
    analytics: ['a campaign report with conflicting platform and website numbers', 'a marketing director allocating next quarter’s budget across channels', 'a digital team testing a new landing page with low conversion volume'],
    b2b: ['a B2B software company selling to mid-sized Nigerian businesses', 'a professional-services firm with a long sales cycle and several decision-makers', 'a technology vendor whose marketing leads rarely become sales opportunities'],
    leadership: ['a marketing team with more requests than available budget and capacity', 'an organisation reviewing agency performance before renewal', 'a marketing lead presenting investment choices to an executive committee']
  };
  const concepts = {
    'Positioning': ['target audience, category, difference and reason to believe', 'choose a distinct position that matters to the intended audience and can be credibly delivered', 'a positioning statement and evidence-backed competitive frame'],
    'Segmentation and targeting': ['meaningful audience groups and the choice of which to serve', 'prioritise segments by need, value, reachability and strategic fit rather than size alone', 'a segment scorecard and target-segment recommendation'],
    'Pricing strategy': ['customer value, willingness to pay, costs, alternatives and price architecture', 'test willingness to pay and commercial constraints before selecting a price', 'a pricing recommendation with assumptions and sensitivity checks'],
    'Experiment design': ['a hypothesis, primary metric, guardrails, sample needs and decision rule', 'change one interpretable variable where possible and decide in advance what result changes the decision', 'an experiment brief with hypothesis, metric, duration and decision criteria'],
    'Privacy and consent': ['purpose limitation, lawful basis or consent where required, data minimisation and retention', 'collect only what is necessary, document permissions and make opt-outs effective', 'a data-flow map and privacy review checklist'],
    'Crisis communications': ['verified facts, affected stakeholders, response ownership, timing and updates', 'acknowledge verified impact, avoid speculation, assign a spokesperson and commit to a clear next update', 'a holding statement, stakeholder matrix and update cadence'],
    'Content strategy': ['audience needs, business goals, distinctive expertise, formats and distribution', 'connect each content pillar to an audience need and a measurable role in the journey', 'a content strategy with pillars, channel roles and measurement'],
    'Brand tracking': ['awareness, consideration, preference, usage and consistent sampling over time', 'keep measures and sample definitions comparable before interpreting a trend', 'a tracking plan with metrics, sampling and reporting cadence'],
    'Attribution models': ['how credit is assigned across touchpoints and what each model can and cannot explain', 'treat attribution as a decision aid, not proof of incrementality', 'a model comparison and budget decision with caveats'],
    'Customer lifetime value': ['expected contribution over the customer relationship, acquisition cost and retention assumptions', 'use contribution margin and explicit time horizon rather than revenue alone', 'a transparent CLV model with sensitivity analysis'],
    'Account-based marketing': ['named accounts, buying committees, account insight, tailored engagement and sales alignment', 'select accounts using fit and intent signals, then coordinate useful interactions across the buying group', 'an account plan with tiering, messages, plays and measures'],
    'Trade promotions': ['incremental volume, baseline sales, discount depth, retailer execution and margin', 'compare incremental contribution with the full cost of discounting and execution', 'a promotion post-analysis with a go, revise or stop recommendation'],
    'Survey design': ['one construct per question, neutral wording, response options and respondent burden', 'remove leading wording, test comprehension and match response scales to the decision', 'a short survey with rationale and a pilot plan'],
    'Conversion optimisation': ['user intent, friction, evidence, a prioritised hypothesis and a measurable outcome', 'diagnose the journey before changing design, and measure completed outcomes rather than clicks alone', 'a conversion audit and prioritised test backlog'],
    'Marketing mix modelling': ['historical outcome data, channel investment, seasonality, external factors and uncertainty', 'avoid reading correlation as causation and communicate model limitations', 'a model brief specifying data, controls, outputs and decision use'],
    'Go-to-market planning': ['target segment, value proposition, route to market, launch readiness and success metrics', 'align product, sales, support, channels and measurement around a specific launch objective', 'a launch plan with owners, dependencies, risks and metrics']
  };
  const generic = (title, track) => {
    const t = title.toLowerCase();
    if (t.includes('research') || t.includes('interview') || t.includes('survey') || t.includes('statistics') || t.includes('insight')) return ['a clear decision question, suitable method, representative evidence and limitations', 'select a method that answers the decision question and state what the evidence cannot establish', 'a research brief, instrument or analysis plan, findings and limitations'];
    if (t.includes('budget') || t.includes('roi') || t.includes('margin') || t.includes('valuation') || t.includes('forecast') || t.includes('pipeline') || t.includes('reporting') || t.includes('metrics')) return ['the business outcome, baseline, cost definitions, time horizon and uncertainty', 'show the calculation, define the denominator and distinguish observed results from estimates', 'a calculation sheet or dashboard specification with a decision recommendation'];
    if (t.includes('email') || t.includes('newsletter') || t.includes('nurtur') || t.includes('onboarding') || t.includes('lifecycle') || t.includes('retention') || t.includes('win-back')) return ['audience eligibility, trigger, message relevance, timing, suppression rules and outcome', 'design around customer context and consent, include holdout or comparison where feasible, and monitor unsubscribes', 'a journey map, sample messages, entry and exit rules, and measurement plan'];
    if (t.includes('seo') || t.includes('search') || t.includes('keyword') || t.includes('landing page') || t.includes('paid') || t.includes('advertising') || t.includes('retarget')) return ['intent, query or audience fit, destination relevance, tracking and qualified outcomes', 'align the promise in the ad or result with the landing page and optimise for qualified outcomes', 'a campaign or optimisation brief with targeting, copy, landing page and tracking'];
    if (t.includes('social') || t.includes('video') || t.includes('creator') || t.includes('community') || t.includes('publishing') || t.includes('copywriting') || t.includes('visual')) return ['audience context, platform-native execution, brand voice, accessibility and a clear communication goal', 'choose the format and call to action for the audience and platform, then define a meaningful success measure', 'a small content package with rationale, production notes and measurement'];
    if (t.includes('event') || t.includes('venue') || t.includes('speaker') || t.includes('sponsorship') || t.includes('exhibition') || t.includes('activation')) return ['audience experience, operational dependencies, budget, risk and measurable outcomes', 'design the attendee journey first, then connect each activity to an objective and owner', 'an event plan with run-of-show, budget, risk register and follow-up'];
    if (t.includes('sales') || t.includes('account') || t.includes('lead') || t.includes('partner') || t.includes('b2b') || t.includes('enablement') || t.includes('analyst')) return ['buyer role, stage, evidence of fit, next action and shared sales-marketing definition', 'optimise for qualified progression and feedback quality, not raw lead volume', 'a buyer or account playbook with qualification criteria and follow-up'];
    if (t.includes('crisis') || t.includes('reputation') || t.includes('media') || t.includes('press') || t.includes('spokesperson') || t.includes('stakeholder') || t.includes('communications')) return ['audience impact, verified facts, message consistency, spokesperson and response timing', 'separate confirmed facts from unknowns and tailor the response to stakeholder needs', 'a message map, response draft and stakeholder communication plan'];
    if (t.includes('brand') || t.includes('identity') || t.includes('awareness') || t.includes('purpose') || t.includes('architecture') || t.includes('guideline') || t.includes('rebrand')) return ['audience meaning, competitive context, consistency, distinctiveness and proof', 'connect the brand decision to a specific audience perception and define how it will be checked', 'A brand recommendation with audience evidence, examples and governance rules'];
    return ['the objective, audience, process, constraints, evidence and measure of success', 'start with the decision to be made, compare options against explicit criteria and document assumptions', 'a decision brief with evidence, recommendation, implementation steps and success measures'];
  };
  const make = (track, topic, idx) => {
    const title = topic.title;
    const matched = concepts[title] || generic(title, track.id);
    const [what, best, deliverable] = matched;
    const places = contexts[track.id] || contexts.foundations;
    const business = places[idx % places.length];
    const decision = `The team has asked you to improve ${title.toLowerCase()}, but has supplied incomplete evidence and wants a recommendation this month.`;
    const caseStudy = {
      title: `${title}: the ${['growth', 'trust', 'efficiency'][idx % 3]} decision`,
      context: `${business[0].toUpperCase()}${business.slice(1)}. ${decision}`,
      evidence: [
        'The team reports activity metrics but has not agreed a single business outcome or baseline.',
        'Customer feedback points to more than one possible cause, and the sample may not represent all customers.',
        'The budget and team capacity are fixed for the next 90 days.'
      ],
      challenge: `Recommend how the organisation should approach ${title.toLowerCase()}. State which evidence you would trust, what you would verify, and what decision you would make if the missing data cannot be collected in time.`,
      prompts: ['What is the actual business or customer problem, rather than the requested tactic?', 'Which additional evidence would most change your recommendation?', 'What is the smallest responsible action the team can take, and how will it judge the result?'],
      facilitatorNote: `Strong answers apply ${what}. Makes assumptions clear, considers at least one credible alternative, and explains the risks and measurement limits.`
    };
    const quiz = [
      { question: `For ${title.toLowerCase()}, what should the team establish first?`, options: ['The tactic competitors use most often', 'The decision to make, audience or stakeholder, and intended outcome', 'The most impressive metric available', 'A channel calendar before reviewing evidence'], answer: 1, explanation: 'A clear decision and outcome make the evidence, method and tactics relevant.' },
      { question: `Which approach best applies ${title.toLowerCase()} to this case?`, options: ['Copy a successful competitor without checking context', `Apply ${what} and document assumptions and limitations`, 'Treat correlation as proof of cause', 'Choose the option with the most activity, regardless of outcome'], answer: 1, explanation: `The answer applies the topic's core practice: ${best}.` },
      { question: 'How should the team evaluate its recommendation?', options: ['Use one pre-defined outcome measure, supporting indicators and a review date', 'Count every activity as a success', 'Change several major variables at once and infer the cause', 'Report only the strongest result and omit limitations'], answer: 0, explanation: 'A pre-defined measure and review point support a more credible decision. Supporting indicators help explain the outcome.' }
    ];
    const project = {
      title: `Portfolio project: ${title} decision brief`,
      level: topic.level,
      brief: `Act as the ${track.title.toLowerCase()} manager for ${business}. Produce a usable deliverable that applies ${title.toLowerCase()} to a real or clearly labelled fictional situation. The work must support a decision, not simply describe the concept.`,
      tasks: [
        `Define the objective, target audience or stakeholders, context and constraints. Separate known facts from assumptions.`,
        `Audit the available evidence and identify its gaps. Use at least two credible sources or explain why primary research is needed.`,
        `Develop your recommendation using ${what}. Compare it with one plausible alternative and state the trade-off.`,
        `Create the practical artefact, workflow or plan needed to implement the recommendation.`,
        'Set a baseline, one primary success metric, supporting indicators, a review date and a decision rule for what happens next.'
      ],
      deliverables: [deliverable, 'A one-page rationale with evidence links and assumptions', 'A measurement plan with definitions and review cadence', 'A short reflection on limitations, risks and what you would test next'],
      rubric: [
        { criterion: 'Problem framing and audience', weight: 20, standard: 'Specific, decision-led, and grounded in the customer or business context.' },
        { criterion: 'Evidence and critical judgement', weight: 25, standard: 'Uses credible evidence, flags uncertainty and avoids unsupported claims.' },
        { criterion: 'Topic application and quality', weight: 25, standard: 'Applies the concept correctly and produces a practical, coherent artefact.' },
        { criterion: 'Measurement and feasibility', weight: 20, standard: 'Defines outcomes, realistic indicators, ownership and next steps.' },
        { criterion: 'Clarity and ethics', weight: 10, standard: 'Communicates clearly and addresses privacy, accessibility or stakeholder risk where relevant.' }
      ],
      extension: 'Repeat the recommendation for a different audience segment, budget constraint or market. Explain what changes and what should remain consistent.'
    };
    return { caseStudy, quiz, project };
  };
  window.TOPICS = window.TOPICS || {};
  for (const track of (window.TRACKS || [])) {
    for (const [idx, topic] of ((window.TOPICS[track.id] || []).entries())) {
      Object.assign(topic, make(track, topic, idx));
    }
  }
})();
