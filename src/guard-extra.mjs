// Guard figures: data loss prevention, containers, page scripts, radar and private interconnects.
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
    id: 'dlp', name: 'Data Loss Prevention', object: 'Redaction Press', category: 'Protect', docs: 'cloudflare-one/data-loss-prevention',
    description: 'Data Loss Prevention inspects traffic and files for sensitive data such as card numbers and blocks or redacts it before it leaves. Feed the document under the inking roller and every sensitive line is blacked out as it passes.',
    verb: 'Redact document', idle: 'DOCUMENT UNSCANNED', active: 'SENSITIVE DATA REDACTED',
    build(h) {
      const { g, group, box, cyl, badge, colors: C } = h;
      deck(h, 4.9, 2.8);
      for (const x of [-1.9, 1.9]) box(g, .3, .6, .9, x, .52, 0, C.slate, .04);
      for (const z of [-.3, .3]) axleX(h, g, .045, 3.5, 0, .62, z, C.steel, 12);
      const car = group(g, -1.1, 0, 0);
      box(car, 1.0, .16, .8, 0, .62, 0, C.orange, .03);
      for (const z of [-.3, .3]) axleX(h, car, .075, 1.04, 0, .62, z, C.ink, 16);
      box(car, .8, .02, .6, 0, .71, 0, C.cream, .005);
      const lines = [[-.2, .5, false], [-.08, .42, true], [.04, .5, false], [.16, .3, true]], bars = [];
      for (const [z, l, secret] of lines) {
        const bx = -.36 + l / 2;
        box(car, l, .004, .05, bx, .722, z, secret ? C.orange : C.slate, .001);
        if (secret) { const b = box(car, l + .04, .006, .07, bx, .725, z, C.ink, .002); b.userData.span = [bx, l + .04]; bars.push(b); }
      }
      // Roller frame stands outside the carriage; the roller rolls on the sheet.
      for (const z of [-.55, .55]) box(g, .3, 1.0, .06, 0, .72, z, C.ink, .02);
      box(g, .3, .1, 1.16, 0, 1.27, 0, C.orange, .03);
      box(g, .24, .14, .3, 0, 1.39, 0, C.dark, .03);
      axleZ(h, g, .04, 1.2, 0, .87, 0, C.steel, 10);
      const roller = group(g, 0, .87, 0);
      axleZ(h, roller, .15, 1.0, 0, 0, 0, C.ink, 24);
      for (const z of [-.3, .3]) axleZ(h, roller, .152, .04, 0, 0, z, C.slate, 24);
      box(g, 1.2, .8, .4, -1.0, .62, -1.0, C.slate, .05);
      box(g, .9, .4, .03, -1.0, .7, -.785, C.cream, .01);
      badge(g, -1.0, .7, -.768, .34);
      return { hits: [car, roller], update(t, v) {
        const x = mix(-1.1, 1.1, stage(.05, .9, v));
        car.position.x = x;
        roller.rotation.z = -(x + 1.1) / .15;
        for (const b of bars) {
          const [bx, l] = b.userData.span, cov = clamp((bx + l / 2 + x) / l) * l;
          b.scale.x = Math.max(.001, cov / l); b.position.x = bx + l / 2 - cov / 2; b.visible = cov > .001;
        }
      } };
    }
  },
  {
    id: 'containers', name: 'Containers', object: 'Container Gantry', category: 'Build', docs: 'containers',
    description: 'Cloudflare Containers run container images on demand next to your Workers, started and placed by the platform. Hoist the container from the yard and the gantry sets it down on the edge node.',
    verb: 'Deploy container', idle: 'IMAGE IN THE YARD', active: 'CONTAINER RUNNING',
    build(h) {
      const { g, group, box, cyl, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      for (const x of [-1.7, 1.7]) {
        for (const z of [-.7, .7]) { box(g, .14, 2.2, .14, x, 1.32, z, C.ink, .02); box(g, .3, .04, .3, x, .24, z, C.dark, .01); }
        box(g, .14, .16, 1.54, x, 2.5, 0, C.ink, .02);
      }
      for (const z of [-.7, .7]) box(g, 3.68, .16, .14, 0, 2.5, z, C.orange, .03);
      const trolley = group(g, -1.0, 0, 0);
      for (const x of [-.18, .18]) for (const z of [-.7, .7]) axleZ(h, trolley, .06, .06, x, 2.64, z, C.slate, 16);
      box(trolley, .5, .14, 1.46, 0, 2.75, 0, C.slate, .03);
      axleZ(h, trolley, .1, .8, 0, 2.89, 0, C.amber, 16);
      const cables = [];
      for (const x of [-.18, .18]) for (const z of [-.2, .2]) cables.push(cyl(trolley, .012, .012, 1, x, 2, z, C.ink, 6));
      const spreader = group(trolley, 0, .81, 0);
      box(spreader, 1.0, .08, .5, 0, 0, 0, C.ink, .02);
      const box3 = group(spreader, 0, -.265, 0);
      box(box3, .9, .45, .45, 0, 0, 0, C.orange, .03);
      for (let k = -3; k <= 3; k++) for (const z of [-.226, .226]) { if (z > 0 && Math.abs(k) < 3) continue; box(box3, .03, .38, .006, k * .12, 0, z, C.amber, .002); }
      box(box3, .5, .2, .006, 0, 0, .228, C.cream, .003);
      badge(box3, 0, 0, .232, .2);
      box(g, 1.1, .1, .6, -1.0, .27, 0, C.slate, .02);
      box(g, 1.1, .3, .6, 1.0, .37, 0, C.ink, .03);
      const led = box(g, .8, .02, .04, 1.0, .40, .305, glow(C.mint), .004);
      return { hits: [trolley, box3], update(t, v) {
        const up = stage(0, .3, v) - stage(.68, .95, v), move = stage(.3, .66, v);
        trolley.position.x = mix(-1.0, 1.0, move);
        const low = mix(.81, 1.01, move), y = mix(low, 1.9, up);
        spreader.position.y = y;
        const len = 2.68 - (y + .04);
        for (const c of cables) { c.scale.y = len; c.position.y = y + .04 + len / 2; }
        led.scale.x = Math.max(.05, stage(.9, 1, v));
      } };
    }
  },
  {
    id: 'page-shield', name: 'Page Shield', object: 'Script Inspection Arm', category: 'Protect', docs: 'page-shield',
    description: 'Page Shield monitors the third-party scripts and connections loaded by your pages and flags new or malicious ones. Sweep the inspection lens over the script modules; the compromised one pops from its socket for review.',
    verb: 'Inspect scripts', idle: 'SCRIPTS UNCHECKED', active: 'MALICIOUS SCRIPT FLAGGED',
    build(h) {
      const { g, group, box, cyl, ring, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      box(g, 3.0, .12, 2.0, 0, .28, 0, C.slate, .04);
      const top = .34, pz = -.7, R = 1.2, bad = 4;
      const tiles = [], angles = [-1, -.6, -.2, .2, .6, 1];
      for (const [k, a] of angles.entries()) {
        const x = R * Math.sin(a), z = pz + R * Math.cos(a);
        box(g, .38, .04, .38, x, top + .02, z, C.ink, .01);
        const t = group(g, x, top + .04, z); t.rotation.y = a;
        box(t, .3, .12, .3, 0, .06, 0, k === bad ? C.lavender : C.cream, .025);
        for (let j = 0; j < 3; j++) box(t, .2 - j * .04, .004, .03, -.03 + j * .02, .122, -.08 + j * .08, k === bad ? C.ink : C.orange, .001);
        tiles.push(t);
      }
      box(g, 1.6, .9, .1, 0, top + .45, -.95, C.ink, .03);
      box(g, 1.0, .4, .02, 0, top + .55, -.89, C.cream, .008);
      badge(g, 0, top + .55, -.879, .34);
      const ok = box(g, .16, .08, .02, -.6, top + .2, -.89, glow(C.mint), .005), alarm = box(g, .16, .08, .02, .6, top + .2, -.89, glow(C.lavender), .005);
      cyl(g, .08, .08, .76, 0, top + .38, pz, C.steel, 16);
      cyl(g, .16, .18, .06, 0, top + .03, pz, C.dark, 24);
      const arm = group(g, 0, top + .8, pz);
      cyl(arm, .12, .12, .12, 0, 0, 0, C.orange, 24);
      box(arm, .08, .06, 1.1, 0, 0, .6, C.steel, .02);
      ring(arm, .17, .03, 0, 0, R, C.ink).rotation.x = Math.PI / 2;
      cyl(arm, .15, .15, .012, 0, 0, R, glow(C.cyan), 32);
      return { hits: [arm, tiles[bad]], update(t, v) {
        const sweep = stage(0, .8, v), a = mix(-1.15, 1.15, sweep);
        arm.rotation.y = a;
        const pop = stage(.1, .2, a - angles[bad]);
        tiles[bad].position.y = top + .04 + .14 * pop;
        tiles[bad].rotation.z = .25 * pop;
        const s = .3 + .7 * pop; alarm.scale.set(s, s, 1); ok.scale.set(1.3 - s, 1.3 - s, 1);
      } };
    }
  },
  {
    id: 'radar', name: 'Cloudflare Radar', object: 'Traffic Observatory', category: 'Connect', docs: 'radar',
    description: 'Cloudflare Radar publishes Internet traffic, attack and routing trends observed across Cloudflare’s network. Slew the dish across the sky and the observatory console charts what it sees.',
    verb: 'Scan the Internet', idle: 'DISH PARKED', active: 'TRENDS CHARTED',
    build(h) {
      const { g, group, box, cyl, rail, badge, glow, THREE, colors: C } = h;
      deck(h, 4.9, 2.8);
      cyl(g, .45, .55, .5, -.5, .47, 0, C.slate, 32);
      const yaw = group(g, -.5, .72, 0);
      cyl(yaw, .42, .42, .1, 0, .05, 0, C.ink, 32);
      box(yaw, 1.9, .1, .5, 0, .15, 0, C.orange, .03);
      for (const x of [-.85, .85]) box(yaw, .12, .8, .2, x, .6, 0, C.ink, .03);
      // Trunnion axle runs through both uprights and is clamped by a washer and hex-head screw on each outer face.
      axleX(h, yaw, .05, 1.86, 0, .8, 0, C.steel, 24);
      for (const sx of [-1, 1]) {
        axleX(h, yaw, .1, .018, sx * .919, .8, 0, C.slate, 32);
        const head = axleX(h, yaw, .078, .055, sx * .9555, .8, 0, C.steel, 6);
        head.rotation.x = Math.PI / 6;
        axleX(h, yaw, .062, .012, sx * .989, .8, 0, C.steel, 24);
        box(yaw, .006, .018, .1, sx * .995, .8, 0, C.ink, .002);
      }
      const tilt = group(yaw, 0, .8, 0);
      box(tilt, .3, .3, .3, 0, 0, 0, C.slate, .04);
      const P = [[0, 0], [.3, .04], [.55, .15], [.65, .25], [.63, .27], [.53, .18], [.3, .08], [0, .04]].map(([x, y]) => new THREE.Vector2(x, y));
      const dish = cyl(tilt, .1, .1, .1, 0, .14, 0, C.cream, 8);
      dish.geometry = new THREE.LatheGeometry(P, 48);
      for (let k = 0; k < 3; k++) {
        const a = k * 2 * Math.PI / 3, c = Math.cos(a), s = Math.sin(a);
        rail(tilt, [[.56 * c, .375, .56 * s], [.05 * c, .74, .05 * s]], .015, C.ink);
        cyl(tilt, .03, .034, .022, .56 * c, .365, .56 * s, C.ink, 16);
      }
      box(tilt, .12, .12, .12, 0, .78, 0, C.orange, .03);
      box(g, 1.4, .8, .45, 1.45, .62, .9, C.ink, .05);
      box(g, 1.2, .5, .02, 1.45, .66, 1.13, C.dark, .01);
      const bars = [0, 1, 2, 3, 4].map(k => box(g, .14, .4, .02, 1.05 + k * .2, .62, 1.145, glow(k === 2 ? C.orange : C.cyan), .004));
      box(g, 1.2, .5, .4, 1.6, .47, -.9, C.slate, .04);
      box(g, .8, .3, .02, 1.6, .5, -.69, C.cream, .008);
      badge(g, 1.6, .5, -.679, .3);
      return { hits: [tilt, yaw, ...bars], update(t, v) {
        const slew = stage(0, .7, v), chart = stage(.35, 1, v);
        yaw.rotation.y = mix(0, 1.6, slew);
        tilt.rotation.x = mix(-.25, -.85, stage(.1, .8, v));
        for (const [k, b] of bars.entries()) {
          const f = .15 + .8 * chart * (.5 + .5 * Math.sin(k * 1.7 + 1)) ; b.scale.y = f; b.position.y = .43 + .2 * f;
        }
      } };
    }
  },
  {
    id: 'network-interconnect', name: 'Network Interconnect', object: 'Cross-Connect Patch', category: 'Connect', docs: 'network-interconnect',
    description: 'Network Interconnect links your network to Cloudflare over a private physical or virtual connection instead of the public Internet. Seat the patch plug in the customer rack and both link lights come up.',
    verb: 'Patch link', idle: 'PLUG UNSEATED', active: 'PRIVATE LINK UP',
    build(h) {
      const { g, group, box, rail, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      box(g, .8, 1.8, .8, -1.5, 1.12, 0, C.orange, .05);
      box(g, .6, .3, .02, -1.5, 1.6, .41, C.cream, .008);
      badge(g, -1.5, 1.6, .421, .3);
      box(g, .8, 1.8, .8, 1.5, 1.12, 0, C.slate, .05);
      for (let k = 0; k < 5; k++) for (const x of [-1.5, 1.5]) box(g, .6, .06, .02, x, .5 + k * .16, .41, C.ink, .005);
      for (const s of [-1, 1]) { box(g, .04, .06, .2, 1.08, .95 + s * .07, 0, C.dark, .005); box(g, .04, .08, .06, 1.08, .95, s * .07, C.dark, .005); }
      box(g, .01, .08, .08, 1.095, .95, 0, C.ink, .002);
      const leds = [-1.5, 1.5].map(x => box(g, .1, .05, .02, x + .2, 1.3, .415, glow(C.mint), .005));
      box(g, .2, .66, .2, .4, .55, 0, C.ink, .02);
      box(g, .3, .14, .14, .4, .95, 0, C.steel, .02);
      box(g, .06, 1.14, .06, -.45, .79, 0, C.slate, .01);
      box(g, .14, .04, .14, -.45, 1.38, 0, C.ink, .01);
      // Cable gland seats the patch lead in the cabinet's side wall.
      axleX(h, g, .068, .05, -1.08, 1.5, 0, C.ink, 20);
      rail(g, [[-1.2, 1.5, 0], [-.9, 1.5, 0], [-.45, 1.44, 0], [0, 1.15, 0], [.2, .96, 0], [.32, .95, 0]], .04, C.amber);
      const plug = group(g, 0, .95, 0);
      axleX(h, plug, .03, .5, .44, 0, 0, C.amber, 10);
      box(plug, .16, .1, .1, .77, 0, 0, C.cream, .02);
      box(plug, .04, .06, .06, .87, 0, 0, C.orange, .01);
      return { hits: [plug, ...leds], update(t, v) {
        const seat = stage(.1, .75, v);
        plug.position.x = .21 * seat;
        const on = stage(.75, .85, v), s = .2 + .8 * on;
        for (const l of leds) l.scale.set(s, s, 1);
      } };
    }
  }
];
