import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const read = (f) => readFileSync(f, 'utf8');
const win = {};
const ctx = vm.createContext({ window: win });
const run = (f) => vm.runInContext(read(f), ctx, { filename: f });

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const RESOURCE_TYPES = ['article', 'video', 'course', 'book', 'tool', 'template', 'podcast'];
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const errors = [];
const fail = (m) => errors.push(m);

run('js/data/tracks.js');
const html = read('index.html');
const seen = new Set();
let topicTotal = 0;

for (const track of win.TRACKS) {
  if (!ID.test(track.id)) fail(`track "${track.id}": id must be lower-case kebab case`);
  if (seen.has(track.id)) fail(`track "${track.id}": duplicate id`);
  seen.add(track.id);
  if (!track.title || !track.description) fail(`track "${track.id}": title and description are required`);
  if (track.status !== 'live') continue;

  const file = `js/data/${track.id}.js`;
  if (!existsSync(file)) { fail(`${track.id}: missing ${file}`); continue; }
  if (!html.includes(`src="${file}"`)) fail(`${track.id}: ${file} is not loaded in index.html`);
  run(file);

  const topics = win.TOPICS && win.TOPICS[track.id];
  if (!Array.isArray(topics) || topics.length < 8) { fail(`${track.id}: needs an array of at least 8 topics`); continue; }
  topicTotal += topics.length;

  const ids = new Set();
  topics.forEach((t) => {
    const at = `${track.id}/${t.id}`;
    if (!ID.test(t.id || '')) fail(`${at}: id must be lower-case kebab case`);
    if (ids.has(t.id)) fail(`${at}: duplicate id`);
    ids.add(t.id);
    if (!t.title) fail(`${at}: title is required`);
    if (!t.stage) fail(`${at}: stage is required`);
    if (!LEVELS.includes(t.level)) fail(`${at}: level must be one of ${LEVELS.join(', ')}`);
    if (!t.summary || t.summary.length > 160) fail(`${at}: summary is required and must be 160 characters or fewer`);
    if (!Array.isArray(t.prereqs)) fail(`${at}: prereqs must be an array`);
    (t.resources || []).forEach((r, i) => {
      if (!r.title) fail(`${at}: resource ${i + 1} needs a title`);
      if (!RESOURCE_TYPES.includes(r.type)) fail(`${at}: resource "${r.title}" has an unknown type`);
      if (!['free', 'paid'].includes(r.cost)) fail(`${at}: resource "${r.title}" must be marked free or paid`);
      if (r.url && !/^https:\/\//.test(r.url)) fail(`${at}: resource "${r.title}" url must start with https://`);
    });
  });

  topics.forEach((t) => (t.prereqs || []).forEach((p) => {
    if (p === t.id) fail(`${track.id}/${t.id}: cannot depend on itself`);
    else if (!ids.has(p)) fail(`${track.id}/${t.id}: unknown prerequisite "${p}"`);
  }));

  const by = new Map(topics.map((t) => [t.id, t]));
  const state = {};
  const visit = (id, trail) => {
    if (state[id] === 2 || !by.has(id)) return;
    if (state[id] === 1) { fail(`${track.id}: prerequisite loop ${[...trail, id].join(' -> ')}`); return; }
    state[id] = 1;
    (by.get(id).prereqs || []).forEach((p) => visit(p, [...trail, id]));
    state[id] = 2;
  };
  topics.forEach((t) => visit(t.id, []));
}

if (errors.length) {
  console.error(`${errors.length} problem(s) found:\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`OK: ${win.TRACKS.filter((t) => t.status === 'live').length} live roadmaps, ${topicTotal} topics`);
