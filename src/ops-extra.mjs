// Operations figures: network scrubbing, isolation, AI gateway, durable steps and log delivery.
const clamp = x => Math.max(0, Math.min(1, x));
const stage = (a, b, v) => { const s = clamp((v - a) / (b - a)); return s * s * (3 - 2 * s); };
const mix = (a, b, v) => a + (b - a) * v;
const axleZ = (h, p, r, d, x, y, z, c, n = 24) => { const m = h.cyl(p, r, r, d, x, y, z, c, n); m.rotation.x = Math.PI / 2; return m; };
const axleX = (h, p, r, d, x, y, z, c, n = 24) => { const m = h.cyl(p, r, r, d, x, y, z, c, n); m.rotation.z = Math.PI / 2; return m; };
const bolt = (h, p, x, y, z) => h.cyl(p, .05, .05, .03, x, y, z, h.colors.steel, 6);
const deck = (h, w, d, c) => {
  const { g, box, colors: C } = h;
  box(g, w, .22, d, 0, .11, 0, c || C.ink, .1);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) bolt(h, g, sx * (w / 2 - .22), .235, sz * (d / 2 - .2));
};

export default [
  {
    id: 'magic-transit', name: 'Magic Transit', object: 'Scrubbing Shuttle', category: 'Protect', docs: 'magic-transit',
    description: 'Magic Transit advertises your IP prefixes from Cloudflare, scrubs attack traffic at the edge and forwards clean packets to your network. Send the shuttle through the scrubbing arch; the brushes strip the attack debris before it reaches the data centre.',
    verb: 'Run shuttle', idle: 'SHUTTLE AT EDGE', active: 'CLEAN TRAFFIC DELIVERED',
    build(h) {
      const { g, group, box, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      // Track on sleepers with buffer stops at both ends.
      for (let x = -1.8; x <= 1.81; x += .3) box(g, .12, .06, .86, x, .25, 0, C.dark, .01);
      for (const z of [-.33, .33]) box(g, 3.9, .06, .06, 0, .31, z, C.steel, .01);
      for (const s of [-1, 1]) box(g, .1, .2, .86, s * 2.0, .38, 0, C.orange, .02);
      // Shuttle: wheels on the rails, axles under the chassis.
      const car = group(g, -1.35, 0, 0), debris = [];
      for (const x of [-.28, .28]) {
        axleZ(h, car, .03, .72, x, .43, 0, C.ink, 10);
        for (const z of [-.33, .33]) axleZ(h, car, .09, .05, x, .43, z, C.slate, 20);
      }
      box(car, .9, .12, .54, 0, .50, 0, C.ink, .03);
      box(car, .6, .36, .44, 0, .74, 0, C.cream, .04);
      box(car, .62, .05, .46, 0, .60, 0, C.orange, .01);
      for (const [x, z] of [[-.16, -.1], [.04, .12], [.18, -.06]]) debris.push(box(car, .1, .1, .1, x, .97, z, C.lavender, .02));
      // Scrubbing arch: walls stand on the deck outside the sleepers; brush axles seat in the walls.
      for (const z of [-.55, .55]) box(g, .5, 1.1, .12, 0, .77, z, C.slate, .03);
      box(g, .62, .14, 1.26, 0, 1.39, 0, C.orange, .04);
      const brushes = [-.13, .13].map(x => { const b = group(g, x, 1.07, 0); axleZ(h, b, .1, .96, 0, 0, 0, C.amber, 10); axleZ(h, b, .03, .98, 0, 0, 0, C.ink, 8); return b; });
      const scrub = box(g, .4, .02, .9, 0, 1.31, 0, glow(C.cyan), .005);
      // Data centre at the far end of the line.
      box(g, 1.1, 1.2, .7, 1.6, .82, -1.0, C.slate, .05);
      box(g, 1.12, .08, .72, 1.6, 1.46, -1.0, C.orange, .02);
      box(g, .8, .42, .04, 1.6, .98, -.63, C.cream, .015);
      badge(g, 1.6, .98, -.61, .36);
      for (let k = 0; k < 3; k++) box(g, .7, .04, .02, 1.6, .5 + k * .09, -.64, C.ink, .005);
      return { hits: [car, ...brushes], update(t, v) {
        const run = stage(0, .9, v), x = mix(-1.35, 1.35, run);
        car.position.x = x;
        for (const [i, d] of debris.entries()) {
          const s = 1 - stage(-.3, .05, x + d.position.x - .1 * i);
          d.scale.setScalar(Math.max(.001, s)); d.position.y = .92 + .05 * s; d.visible = s > .002;
        }
        for (const b of brushes) b.rotation.z = -run * 18;
        scrub.scale.x = .6 + .4 * (1 - Math.min(1, Math.abs(x) / .8));
      } };
    }
  },
  {
    id: 'browser-isolation', name: 'Browser Isolation', object: 'Rendering Cage', category: 'Protect', docs: 'cloudflare-one/remote-browser-isolation',
    description: 'Browser Isolation runs web code in a remote browser and sends only safe draw commands to the user. The risky page stays locked in the cage while its rendered pixels ride out through the slot to the viewer.',
    verb: 'Render safely', idle: 'PAGE LOCKED IN CAGE', active: 'SAFE PIXELS DELIVERED',
    build(h) {
      const { g, group, box, cyl, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      const cx = -.9, top = .32;
      box(g, 1.8, .10, 1.4, cx, .27, 0, C.slate, .03);
      box(g, 1.3, .10, .7, .65, .27, 0, C.slate, .03);
      // Cage frame: posts, top ring and bars; the right wall is solid except for the output slot.
      for (const x of [cx - .86, cx + .86]) for (const z of [-.66, .66]) box(g, .08, 1.2, .08, x, top + .6, z, C.ink, .015);
      for (const z of [-.66, .66]) box(g, 1.72, .08, .08, cx + .04, top + 1.2, z, C.ink, .015);
      box(g, .08, .08, 1.4, cx - .86, top + 1.2, 0, C.ink, .015);
      for (const z of [-.66, .66]) for (let k = 1; k < 9; k++) cyl(g, .014, .014, 1.2, cx - .86 + k * .19, top + .6, z, C.steel, 6);
      for (let k = 1; k < 7; k++) cyl(g, .014, .014, 1.2, cx - .86, top + .6, -.66 + k * .19, C.steel, 6);
      const wx = cx + .86, slotTop = top + .2;
      box(g, .06, top + 1.16 - slotTop, 1.32, wx, (slotTop + top + 1.16) / 2, 0, C.ink, .01);
      for (const s of [-1, 1]) box(g, .06, slotTop - top, .4, wx, (top + slotTop) / 2, s * .46, C.ink, .01);
      box(g, 1.8, .1, 1.4, cx, top + 1.29, 0, C.orange, .03);
      box(g, .8, .22, .03, cx, top + 1.0, .695, C.cream, .01);
      badge(g, cx, top + 1.0, .712, .3);
      // Risky page on a pedestal, watched by a camera.
      box(g, .44, .42, .44, -1.3, top + .21, -.25, C.dark, .03);
      const page = box(g, .3, .3, .3, -1.3, top + .57, -.25, C.lavender, .04);
      box(g, .06, .7, .06, -.65, top + .35, -.5, C.ink, .01);
      const cam = group(g, -.65, top + .75, -.5);
      box(cam, .2, .14, .16, 0, 0, 0, C.ink, .03);
      axleX(h, cam, .045, .1, -.14, 0, 0, C.cyan, 16);
      // Belt through the slot to the outside tray, with end rollers.
      box(g, 2.0, .02, .3, .1, top + .01, 0, C.dark, .005);
      for (const x of [-.9, 1.1]) axleZ(h, g, .03, .32, x, top + .03, 0, C.steel, 10);
      const tile = group(g, -.55, top + .04, 0);
      box(tile, .3, .04, .24, 0, 0, 0, C.cream, .01);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) box(tile, .06, .006, .06, -.08 + i * .08, .022, -.04 + j * .08, (i + j) % 2 ? C.cyan : C.orange, .002);
      // Viewer screen.
      box(g, .1, .7, .1, 1.6, .57, -.55, C.ink, .02);
      box(g, .3, .04, .3, 1.6, .24, -.55, C.dark, .01);
      box(g, .9, .58, .08, 1.6, 1.15, -.55, C.ink, .03);
      const screen = box(g, .78, .46, .02, 1.6, 1.15, -.50, glow(C.cyan), .005);
      return { hits: [tile, page, screen], update(t, v) {
        const out = stage(.15, .85, v);
        tile.position.x = mix(-.55, .75, out);
        cam.rotation.y = .25 * Math.sin(t * 1.4);
        page.rotation.y = t * .6;
        const s = .2 + .8 * stage(.7, .9, v); screen.scale.set(s, s, 1);
      } };
    }
  },
  {
    id: 'ai-gateway', name: 'AI Gateway', object: 'Prompt Manifold', category: 'Build', docs: 'ai-gateway',
    description: 'AI Gateway sits between your app and AI providers to cache, rate limit, log and route requests. Turn the selector: the prompt flows through the metered manifold into the chosen model tank.',
    verb: 'Route prompt', idle: 'SELECTOR CLOSED', active: 'PROMPT ROUTED TO MODEL',
    build(h) {
      const { g, group, box, cyl, ball, ring, rail, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      // Client cabinet and manifold block.
      box(g, .5, .7, .6, -2.05, .57, .3, C.slate, .04);
      box(g, 1.2, .2, .9, 0, .32, .3, C.dark, .03);
      box(g, 1.0, .6, .7, 0, .72, .3, C.slate, .05);
      box(g, 1.02, .06, .72, 0, 1.0, .3, C.orange, .02);
      box(g, .5, .26, .03, -.18, .78, .665, C.cream, .01);
      badge(g, -.18, .78, .682, .26);
      axleZ(h, g, .13, .03, .3, .78, .665, C.cream, 32);
      const needle = group(g, .3, .78, .685);
      box(needle, .02, .1, .01, 0, .045, 0, C.lavender, .003);
      // Inlet pipe with seated flanges and sight glasses.
      rail(g, [[-1.85, .72, .3], [-.45, .72, .3]], .08, C.steel);
      for (const x of [-1.785, -.515]) ring(g, .11, .03, x, .72, .3, C.ink).rotation.y = Math.PI / 2;
      const beads = [];
      for (let k = 0; k < 4; k++) beads.push(box(g, .14, .02, .08, -1.55 + k * .3, .805, .3, glow(C.amber), .005));
      // Selector handwheel on the manifold.
      const wheel = group(g, 0, 1.03, .3);
      cyl(wheel, .06, .06, .16, 0, .08, 0, C.ink, 16);
      ring(wheel, .26, .03, 0, .16, 0, C.orange).rotation.x = Math.PI / 2;
      for (let k = 0; k < 3; k++) { const s = box(wheel, .52, .03, .03, 0, .16, 0, C.ink, .008); s.rotation.y = k * Math.PI / 3; }
      // Three model tanks, each fed from the manifold's back face.
      const tanks = [-.9, 0, .9], levels = [];
      for (const [i, x] of tanks.entries()) {
        box(g, .76, .06, .76, x, .25, -.8, C.ink, .02);
        cyl(g, .32, .32, 1.1, x, .83, -.8, i === 1 ? C.cream : C.steel, 36);
        const dome = ball(g, .32, x, 1.38, -.8, i === 1 ? C.orange : C.slate); dome.scale.y = .45;
        box(g, .08, .55, .02, x, 1.025, -.476, C.dark, .004);
        const lv = box(g, .05, .53, .02, x, 1.025, -.466, glow(C.cyan), .004);
        levels.push(lv);
        const pts = x === 0 ? [[0, .55, 0], [0, .55, -.52]] : [[x * .33, .55, 0], [x * .33, .55, -.2], [x, .55, -.36], [x, .55, -.52]];
        rail(g, pts, .06, C.steel);
        ring(g, .085, .025, pts[0][0], .55, -.07, C.ink);
        ring(g, .085, .025, x, .55, -.465 - .012, C.ink);
      }
      const outs = [0, 1, 2].map(k => box(g, .1, .02, .07, 0, .615, -.15 - k * .11, glow(C.amber), .004));
      return { hits: [wheel, ...levels], update(t, v) {
        const turn = stage(0, .3, v), flow = stage(.3, .7, v), fill = stage(.55, 1, v);
        wheel.rotation.y = -turn * Math.PI * 2 / 3;
        needle.rotation.z = mix(1.2, -1.2, flow);
        for (const [k, b] of beads.entries()) { const on = flow > 0 && flow < 1 ? .5 + .5 * Math.sin(t * 8 - k) : .25; b.scale.set(.4 + .6 * on, 1, 1); }
        for (const [k, b] of outs.entries()) { const on = flow > .5 ? .5 + .5 * Math.sin(t * 8 - k) : .2; b.scale.set(1, 1, .4 + .6 * on); }
        for (const [i, lv] of levels.entries()) {
          const f = i === 1 ? mix(.2, .95, fill) : .2 + .05 * i;
          lv.scale.y = f; lv.position.y = .76 + .265 * f;
        }
      } };
    }
  },
  {
    id: 'workflows', name: 'Workflows', object: 'Step Camshaft', category: 'Build', docs: 'workflows',
    description: 'Workflows runs durable multi-step programs that retry, sleep and resume where they left off. Turn the camshaft and each step follower rises in order, lighting its lamp as the run progresses.',
    verb: 'Run workflow', idle: 'WORKFLOW QUEUED', active: 'ALL STEPS COMPLETE',
    build(h) {
      const { g, group, box, cyl, ball, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      const sy = .8, rc = .28, e = .12;
      for (const x of [-1.6, 1.6]) { box(g, .25, 1.45, .4, x, .945, 0, C.slate, .03); box(g, .45, .06, .55, x, .25, 0, C.dark, .01); }
      box(g, 3.45, .1, .22, 0, 1.72, 0, C.ink, .02);
      const shaft = group(g, 0, sy, 0);
      axleX(h, shaft, .06, 3.4, 0, 0, 0, C.steel, 16);
      const xs = [-.9, -.3, .3, .9], phases = xs.map((_, i) => Math.PI / 2 + 2 * Math.PI * (.08 + .22 * i));
      for (const [i, x] of xs.entries()) {
        axleX(h, shaft, rc, .16, x, e * Math.sin(phases[i]), e * Math.cos(phases[i]), i % 2 ? C.amber : C.orange, 36);
        axleX(h, shaft, .1, .2, x, 0, 0, C.ink, 16);
      }
      box(g, .3, .36, .4, 1.88, sy, 0, C.orange, .04);
      const followers = xs.map(x => { const f = group(g, x, 0, 0); box(f, .3, .04, .3, 0, .02, 0, C.ink, .01); cyl(f, .04, .04, 1.1, 0, .59, 0, C.steel, 12); ball(f, .07, 0, 1.17, 0, C.cream); return f; });
      const lamps = xs.map(x => box(g, .2, .06, .02, x, 1.72, .12, glow(C.mint), .005));
      box(g, 1.2, .6, .4, 0, .52, 1.0, C.orange, .05);
      box(g, .9, .34, .03, 0, .54, 1.215, C.cream, .01);
      badge(g, 0, .54, 1.232, .32);
      return { hits: [shaft, ...followers], update(t, v) {
        const th = 2 * Math.PI * v;
        shaft.rotation.x = th;
        for (const [i, f] of followers.entries()) {
          f.position.y = sy + e * Math.sin(phases[i] - th) + rc;
          const done = clamp((v - (.08 + .22 * i)) / .05); const s = .3 + .7 * done; lamps[i].scale.set(s, s, 1);
        }
      } };
    }
  },
  {
    id: 'logpush', name: 'Logpush', object: 'Log Bucket Elevator', category: 'Build', docs: 'logs/logpush',
    description: 'Logpush batches request and event logs and delivers them to the storage or analytics destination you choose. Start the elevator: buckets carry log batches up from the rack and tip them down the chute into the destination bin.',
    verb: 'Push logs', idle: 'LOGS BATCHED AT RACK', active: 'LOGS DELIVERED',
    build(h) {
      const { g, group, box, cyl, rail, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      const yb = .8, yt = 2.1, r = .28, side = yt - yb, L = 2 * side + 2 * Math.PI * r;
      // Loop runs up the right side, over the top sprocket, down the left and under the bottom one.
      const loop = (s, off = 0) => {
        s = ((s % L) + L) % L; const R = r + off;
        if (s < side) return [R, yb + s, 1];
        s -= side; if (s < Math.PI * r) { const a = s / r; return [R * Math.cos(a), yt + R * Math.sin(a), 2]; }
        s -= Math.PI * r; if (s < side) return [-R, yt - s, 3];
        s -= side; const a = Math.PI + s / r; return [R * Math.cos(a), yb + R * Math.sin(a), 4];
      };
      box(g, .3, 2.13, .12, 0, 1.285, -.2, C.ink, .03);
      box(g, .6, .06, .4, 0, .25, -.2, C.dark, .01);
      for (const y of [yb, yt]) { axleZ(h, g, r - .02, .08, 0, y, 0, C.slate, 24); axleZ(h, g, .04, .24, 0, y, -.08, C.steel, 10); axleZ(h, g, .09, .1, 0, y, .02, C.orange, 16); }
      const pts = []; for (let k = 0; k <= 64; k++) { const [x, y] = loop(L * k / 64); pts.push([x, y, 0]); }
      rail(g, pts, .02, C.ink);
      const buckets = [], N = 8;
      for (let i = 0; i < N; i++) {
        // Open pail hung from a pivot pin at the end of a chain arm; it stays level until it tips at the top.
        const b = group(g), arm = group(b), pail = group(b);
        box(arm, .2, .03, .03, .1, 0, 0, C.ink, .006);
        axleZ(h, pail, .018, .25, 0, 0, 0, C.steel, 8);
        for (const z of [-.11, .11]) box(pail, .05, .1, .012, 0, -.04, z, C.ink, .004);
        box(pail, .22, .025, .2, 0, -.1125, 0, C.cream, .008);
        for (const z of [-.0925, .0925]) box(pail, .22, .12, .015, 0, -.06, z, C.cream, .005);
        for (const x of [-.1025, .1025]) box(pail, .015, .12, .17, x, -.06, 0, C.cream, .005);
        b.userData = { arm, pail, log: box(pail, .15, .06, .13, 0, -.07, 0, C.orange, .015) }; buckets.push(b);
      }
      // Rack feeds a short chute at the foot of the lift.
      box(g, .6, 1.0, .6, 1.3, .72, 0, C.slate, .04);
      for (let k = 0; k < 4; k++) box(g, .5, .04, .02, 1.3, .45 + k * .18, .31, glow(k % 2 ? C.amber : C.mint), .004);
      const feed = group(g, .85, .62, 0); feed.rotation.z = .35;
      box(feed, .5, .04, .24, 0, 0, 0, C.steel, .01);
      box(g, .06, .31, .06, .64, .375, 0, C.ink, .01);
      // Discharge trough, carried by a spine bracket and a post on the bin.
      const trough = group(g, -1.175, 1.8, 0); trough.rotation.z = Math.atan2(.9, .85);
      const TL = Math.hypot(.85, .9);
      box(trough, TL, .04, .3, 0, 0, 0, C.steel, .01);
      for (const z of [-.15, .15]) box(trough, TL, .08, .03, 0, .04, z, C.slate, .01);
      box(g, .62, .06, .1, -.44, 2.2, -.17, C.ink, .01);
      box(g, .08, .54, .08, -1.33, 1.345, 0, C.ink, .01);
      const slide = box(trough, .14, .06, .12, .5, .055, 0, C.orange, .015);
      // Destination bin: open-topped, with the delivered batches stacking up inside it.
      box(g, 1.0, .08, .8, -1.8, .26, 0, C.orange, .02);
      for (const z of [-.37, .37]) box(g, 1.0, .82, .06, -1.8, .71, z, C.orange, .02);
      for (const x of [-2.27, -1.33]) box(g, .06, .82, .68, x, .71, 0, C.orange, .02);
      box(g, .88, .02, .68, -1.8, .31, 0, C.dark, .005);
      const pile = [];
      for (let k = 0; k < 9; k++) pile.push(box(g, .22, .11, .18, -1.8 + (k % 3 - 1) * .26, .37 + Math.floor(k / 3) * .11, ((k * 7) % 3 - 1) * .2, k % 2 ? C.amber : C.orange, .02));
      box(g, .7, .36, .03, -1.8, .62, .415, C.cream, .01);
      badge(g, -1.8, .62, .432, .32);
      return { hits: [trough, ...buckets], update(t, v) {
        const run = stage(0, .9, v), shift = run * L * .5;
        for (const [i, b] of buckets.entries()) {
          const s = i * L / N + shift, [x, y, seg] = loop(s), [ox, oy] = loop(s, .2);
          b.position.set(x, y, 0);
          b.userData.pail.position.set(ox - x, oy - y, 0);
          b.userData.arm.rotation.z = Math.atan2(oy - y, ox - x);
          // Tip over the head sprocket toward the chute, then swing back level on the way down.
          const top = seg === 2 ? Math.atan2(y - yt, x) : 0;
          const down = seg === 3 ? clamp((yt - y) / .35) : 1;
          const tip = seg === 2 ? 1.9 * stage(Math.PI * .45, Math.PI * .95, top) : seg === 3 ? 1.9 * (1 - stage(0, 1, down)) : 0;
          b.userData.pail.rotation.z = tip;
          b.userData.log.visible = seg === 1 || seg === 4 && x > 0 || seg === 2 && tip < .9;
        }
        const sl = stage(.45, .8, v);
        slide.position.x = mix(.5, -.55, sl); slide.visible = sl > 0 && sl < 1;
        const fill = stage(.5, .95, v) * 9;
        pile.forEach((p, k) => { const u = clamp(fill - k + 1 - 3); p.visible = k < 3 || u > 0; p.scale.setScalar(k < 3 ? 1 : .4 + .6 * u); });
      } };
    }
  }
];
