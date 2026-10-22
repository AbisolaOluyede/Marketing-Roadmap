/*
 * Row is arranged by the average row of connected topics, to cut down line crossings.
 */
window.Layout = {
  compute(topics, o = {}) {
    const W = o.W || 150, H = o.H || 46, CX = o.CX || 190, RY = o.RY || 68, PX = 16, PY = 36;
    const by = new Map(topics.map((t) => [t.id, t]));
    const prereqs = (id) => by.get(id).prereqs || [];

    const depth = {};
    const depthOf = (id) => {
      if (depth[id] === undefined) {
        const p = prereqs(id);
        depth[id] = p.length ? 1 + Math.max(...p.map(depthOf)) : 0;
      }
      return depth[id];
    };
    topics.forEach((t) => depthOf(t.id));

    const maxDepth = Math.max(...Object.values(depth));
    const cols = Array.from({ length: maxDepth + 1 }, () => []);
    topics.forEach((t) => cols[depth[t.id]].push(t.id));

    const children = {};
    topics.forEach((t) => prereqs(t.id).forEach((p) => (children[p] = children[p] || []).push(t.id)));

    const row = {};
    const reindex = () => cols.forEach((c) => c.forEach((id, i) => (row[id] = i)));
    const average = (ids, fallback) => (ids.length ? ids.reduce((s, i) => s + row[i], 0) / ids.length : fallback);
    reindex();

    for (let pass = 0; pass < 6; pass++) {
      const down = pass % 2 === 0;
      const order = down ? cols.slice(1) : cols.slice(0, -1).reverse();
      order.forEach((c) => {
        const key = {};
        c.forEach((id) => (key[id] = average(down ? prereqs(id) : children[id] || [], row[id])));
        c.sort((a, b) => key[a] - key[b] || row[a] - row[b]);
        c.forEach((id, i) => (row[id] = i));
      });
    }

    const rows = Math.max(...cols.map((c) => c.length));
    const nodes = {};
    cols.forEach((c, ci) =>
      c.forEach((id, i) => {
        nodes[id] = { x: PX + ci * CX, y: PY + (i + (rows - c.length) / 2) * RY, col: ci };
      })
    );

    const stageOf = (c) => {
      const n = {};
      c.forEach((id) => (n[by.get(id).stage] = (n[by.get(id).stage] || 0) + 1));
      return Object.keys(n).sort((a, b) => n[b] - n[a])[0];
    };
    const labels = [];
    cols.forEach((c, ci) => {
      const stage = stageOf(c);
      if (ci === 0 || stage !== stageOf(cols[ci - 1])) labels.push({ stage, x: PX + ci * CX });
    });

    return { nodes, labels, W, H, width: PX * 2 + maxDepth * CX + W, height: PY + (rows - 1) * RY + H + PY / 2 };
  },
};
