// Edge figures: bot sorting, queueing, cold cache, mail routing and the registrar ledger.
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
    id: 'bot-management', name: 'Bot Management', object: 'Parcel Sorting Gate', category: 'Protect', docs: 'bots',
    description: 'Bot Management scores every request and steers automated traffic away from your application. Run a parcel under the scanner arch: a flagged bot crate is pushed off the line into the holding bin.',
    verb: 'Scan parcel', idle: 'PARCEL AT INTAKE', active: 'BOT PARCEL DIVERTED',
    build(h) {
      const { g, group, box, cyl, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      // Conveyor bed with rollers seated between two side rails; the front rail is open at the push-off.
      box(g, 3.2, .30, .80, -.6, .37, 0, C.slate, .05);
      box(g, 3.2, .14, .06, -.6, .59, -.43, C.steel, .02);
      box(g, 2.15, .14, .06, -1.125, .59, .43, C.steel, .02);
      box(g, .35, .14, .06, .825, .59, .43, C.steel, .02);
      for (let x = -2.1; x <= .91; x += .2) axleZ(h, g, .05, .80, x, .55, 0, C.steel, 12);
      // Scanner arch straddles the bed and stands on the deck.
      for (const z of [-.62, .62]) { box(g, .14, 1.32, .14, -1.1, .88, z, C.ink); box(g, .26, .06, .26, -1.1, .25, z, C.dark); }
      box(g, .2, .16, 1.42, -1.1, 1.6, 0, C.orange, .04);
      box(g, .32, .12, .6, -1.1, 1.46, 0, C.ink, .03);
      const beam = box(g, .22, .02, .5, -1.1, 1.39, 0, glow(C.cyan), .008);
      // Telescoping pusher: housing on a pedestal behind the line, sleeve and rod nested inside.
      box(g, .44, .38, .5, .3, .41, -.95, C.dark);
      box(g, .5, .3, .7, .3, .75, -.95, C.ink, .05);
      const lampOk = box(g, .16, .05, .16, .2, .925, -1.12, glow(C.mint), .02);
      const lampBot = box(g, .16, .05, .16, .42, .925, -1.12, glow(C.lavender), .02);
      const sleeve = group(g, .3, .75, 0), pusher = group(g, .3, .75, 0);
      axleZ(h, sleeve, .055, .70, 0, 0, -.95, C.steel);
      axleZ(h, pusher, .035, .70, 0, 0, -.38, C.steel);
      box(pusher, .46, .14, .05, 0, 0, -.005, C.orange, .02);
      // Holding bin: the bed face is its back wall.
      const bin = group(g, .3, 0, .68);
      box(bin, .70, .06, .56, 0, .25, 0, C.cream, .02);
      box(bin, .70, .24, .05, 0, .40, .255, C.cream, .02);
      for (const s of [-1, 1]) box(bin, .05, .24, .51, s * .325, .40, -.025, C.cream, .015);
      // Crate with sensor eyes.
      const crate = group(g, -1.9, .72, 0);
      box(crate, .30, .24, .30, 0, 0, 0, C.lavender, .04);
      for (const x of [-.06, .06]) box(crate, .045, .045, .02, x, .03, .155, C.white, .01);
      box(crate, .12, .02, .02, 0, -.05, .155, C.ink, .005);
      // Control cabinet carries the badge.
      box(g, 1.1, .70, .5, -1.6, .57, .95, C.orange, .06);
      box(g, .9, .42, .05, -1.6, .60, 1.225, C.cream, .02);
      badge(g, -1.6, .60, 1.25, .42);
      return { hits: [crate, pusher, bin], update(t, v) {
        const a = stage(0, .42, v), p = stage(.46, .82, v);
        const pz = mix(-.5, .445, p);
        pusher.position.z = pz;
        sleeve.position.z = mix(0, .47, p);
        const cz = Math.max(0, pz + .175), drop = stage(.52, .62, cz);
        crate.position.set(mix(-1.9, .3, a), mix(.72, .40, drop), cz);
        crate.rotation.x = .35 * drop * (1 - drop);
        beam.scale.x = .6 + .4 * Math.abs(Math.sin(t * 3)) * (a > .2 && a < .8 ? 1 : .3);
        { const s = mix(1, .35, stage(.4, .5, v)); lampOk.scale.set(s, 1, s); }
        { const s = mix(.35, 1, stage(.4, .5, v)); lampBot.scale.set(s, 1, s); }
      } };
    }
  },
  {
    id: 'waiting-room', name: 'Waiting Room', object: 'Visitor Escapement', category: 'Protect', docs: 'waiting-room',
    description: 'Waiting Room holds surges of visitors in a fair queue and admits them as your origin has capacity. Lift the escapement pawl: the front visitor rolls into the origin cup and the rest of the queue advances one place.',
    verb: 'Admit visitor', idle: 'QUEUE HELD AT GATE', active: 'ONE VISITOR ADMITTED',
    build(h) {
      const { g, group, box, cyl, ball, ring, rail, badge, colors: C } = h;
      deck(h, 4.9, 2.8);
      const x0 = -2.0, x1 = 1.1, y0 = 1.30, y1 = .86, R = .12, gap = .09;
      const ry = x => y0 + (y1 - y0) * (x - x0) / (x1 - x0), cy = x => ry(x) + .12;
      for (const z of [-gap, gap]) rail(g, [[x0, ry(x0), z], [x1, ry(x1), z]], .03, C.steel);
      // Cradles carry both rails; posts stand on the deck.
      for (const x of [-1.95, -.5, .62]) {
        const top = ry(x) - .03;
        box(g, .16, .06, .30, x, top - .03, 0, C.ink, .015);
        box(g, .10, top - .06 - .22, .10, x, (.22 + top - .06) / 2, 0, C.slate, .02);
        box(g, .24, .04, .24, x, .24, 0, C.dark, .01);
      }
      box(g, .05, .34, .30, -2.035, ry(-2.0) + .08, 0, C.orange, .015);
      const colors = [C.cream, C.amber, C.cyan, C.cream, C.amber, C.cyan, C.cream];
      const front = .8, pitch = .24, balls = colors.map((c, i) => ball(g, R, front - i * pitch, cy(front - i * pitch), 0, c));
      // Escapement pawl hangs from a pin carried by a side post.
      const px = .955, py = ry(px) + .38;
      box(g, .08, py + .04 - .22, .08, px, (py + .04 + .22) / 2, -.3, C.ink, .02);
      axleZ(h, g, .03, .38, px, py, -.15, C.steel, 12);
      const pawl = group(g, px, py, 0);
      axleZ(h, pawl, .06, .2, 0, 0, 0, C.ink);
      box(pawl, .05, .30, .2, 0, -.17, 0, C.orange, .015);
      // Origin cup on a pedestal below the rail ends.
      const cup = group(g, 1.6, 0, 0);
      cyl(cup, .16, .2, .18, 0, .31, 0, C.slate);
      cyl(cup, .30, .22, .10, 0, .45, 0, C.ink);
      ring(cup, .27, .03, 0, .50, 0, C.orange).rotation.x = Math.PI / 2;
      // Queue board at the rear.
      box(g, 1.6, 1.0, .4, -.6, .72, -1.0, C.slate, .05);
      box(g, 1.62, .08, .42, -.6, 1.26, -1.0, C.orange, .02);
      box(g, 1.3, .55, .05, -.6, .80, -.775, C.cream, .02);
      badge(g, -.6, .80, -.75, .45);
      return { hits: [pawl, balls[0], cup], update(t, v) {
        const open = stage(0, .25, v), roll = stage(.2, .55, v), fall = stage(.55, .8, v), adv = stage(.45, .9, v);
        pawl.rotation.z = 1.4 * open;
        const b = balls[0];
        if (fall <= 0) { const x = mix(front, x1, roll); b.position.set(x, cy(x), 0); }
        else b.position.set(mix(x1, 1.6, fall), mix(cy(x1), .62, fall * fall), 0);
        b.rotation.z = -(mix(front, x1, roll) - front + .5 * fall) / R;
        for (let i = 1; i < balls.length; i++) {
          const x = front - i * pitch + pitch * adv;
          balls[i].position.set(x, cy(x), 0); balls[i].rotation.z = -pitch * adv / R;
        }
      } };
    }
  },
  {
    id: 'cache-reserve', name: 'Cache Reserve', object: 'Cold Storage Lift', category: 'Connect', docs: 'cache/advanced-configuration/cache-reserve',
    description: 'Cache Reserve keeps long-tail content in persistent storage built on R2, so it can be served without returning to the origin. Open the cold vault and the lead-screw lift raises the reserved objects back to the edge.',
    verb: 'Raise reserve', idle: 'OBJECTS IN COLD STORAGE', active: 'OBJECTS LIFTED TO EDGE',
    build(h) {
      const { g, group, box, cyl, ring, badge, glow, colors: C } = h;
      deck(h, 4.9, 2.8);
      // Vault body: the front block is extruded with a true round mouth into a lined cavity.
      const { THREE } = h;
      const vx = -1.1, vy = .9, mouthR = .42;
      const face = new THREE.Shape();
      face.moveTo(-.84, -.8); face.lineTo(.84, -.8); face.quadraticCurveTo(.9, -.8, .9, -.74);
      face.lineTo(.9, .74); face.quadraticCurveTo(.9, .8, .84, .8); face.lineTo(-.84, .8);
      face.quadraticCurveTo(-.9, .8, -.9, .74); face.lineTo(-.9, -.74); face.quadraticCurveTo(-.9, -.8, -.84, -.8);
      const mouth = new THREE.Path(); mouth.absarc(0, vy - 1.02, mouthR, 0, Math.PI * 2, true); face.holes.push(mouth);
      const shell = box(g, .1, .1, .1, vx, 1.02, 0, C.slate);
      shell.geometry = new THREE.ExtrudeGeometry(face, { depth: 1.0, bevelEnabled: false, curveSegments: 32 }).translate(0, 0, -.4);
      box(g, 1.8, 1.6, .4, vx, 1.02, -.6, C.slate, .06);
      box(g, 1.9, .10, 1.5, vx, 1.87, -.1, C.orange, .03);
      box(g, .04, 1.1, .5, -.18, .95, -.1, glow(C.cyan), .01);
      const throat = h.tube(g, .415, .37, 1.01, vx, vy, .125, C.steel, 56); throat.rotation.x = Math.PI / 2;
      axleZ(h, g, .37, .02, vx, vy, -.39, C.dark, 56);
      // Cold shelf inside the cavity with two stored objects.
      box(g, .62, .03, .9, vx, vy - .2, .06, C.ink, .008);
      for (const [x, z, c] of [[-.13, -.12, C.cyan], [.12, .2, C.amber]]) box(g, .18, .16, .18, vx + x, vy - .105, z, c, .03);
      box(g, 1.2, .30, .05, vx, 1.6, .625, C.cream, .02);
      badge(g, vx, 1.6, .65, .38);
      // Door on a pinned hinge: two fixed knuckles with leaves, one door knuckle between them.
      for (const dy of [-.3, .3]) { cyl(g, .05, .05, .14, -1.6, .9 + dy, .65, C.ink, 12); box(g, .1, .14, .05, -1.64, .9 + dy, .625, C.ink, .01); }
      cyl(g, .022, .022, .78, -1.6, .9, .65, C.steel, 8);
      const door = group(g, -1.6, .9, .65);
      axleZ(h, door, .45, .10, .5, 0, .05, C.steel, 56);
      ring(door, .36, .035, .5, 0, .10, C.orange);
      axleZ(h, door, .09, .08, .5, 0, .14, C.ink);
      for (let k = 0; k < 3; k++) {
        const s = box(door, .56, .04, .04, .5, 0, .19, C.ink, .01); s.rotation.z = k * Math.PI / 3;
      }
      cyl(door, .05, .05, .3, 0, 0, 0, C.ink, 12);
      box(door, .12, .2, .04, .08, 0, .07, C.ink, .01);
      // Lead-screw lift: guide rods and a threaded screw between base block and top cap.
      const lx = 1.2;
      box(g, 1.3, .16, .4, lx, .30, 0, C.dark, .03);
      box(g, 1.3, .14, .4, lx, 2.27, 0, C.ink, .03);
      for (const x of [-.45, .45]) cyl(g, .04, .04, 1.86, lx + x, 1.27, 0, C.steel, 12);
      const screw = group(g, lx, 1.27, 0);
      cyl(screw, .036, .036, 1.86, 0, 0, 0, C.amber, 12);
      class Helix extends THREE.Curve {
        getPoint(u, o = new THREE.Vector3()) { const a = u * Math.PI * 2 * 19; return o.set(.036 * Math.cos(a), -.88 + 1.76 * u, .036 * Math.sin(a)); }
      }
      const thread = cyl(screw, .01, .01, .01, 0, 0, 0, C.orange);
      thread.geometry = new THREE.TubeGeometry(new Helix(), 760, .011, 6, false);
      box(g, .3, .25, .3, lx, 2.465, 0, C.orange, .04);
      const car = group(g, lx, .55, 0);
      box(car, 1.2, .16, .36, 0, 0, 0, C.orange, .03);
      for (const x of [-.45, .45]) h.tube(car, .075, .046, .22, x, 0, 0, C.ink, 24);
      h.tube(car, .09, .054, .22, 0, 0, 0, C.ink, 24);
      box(car, .9, .05, .5, 0, .105, .35, C.cream, .015);
      for (const [x, z, c] of [[-.25, .4, C.cyan], [0, .4, C.amber], [.25, .4, C.cream]]) box(car, .2, .18, .2, x, .22, z, c, .03);
      return { hits: [door, car, screw], update(t, v) {
        const d = stage(0, .35, v), lift = stage(.3, .9, v);
        door.rotation.y = -1.35 * d;
        car.position.y = mix(.55, 1.85, lift);
        screw.rotation.y = lift * 14;
      } };
    }
  },
  {
    id: 'email-routing', name: 'Email Routing', object: 'Envelope Turntable', category: 'Connect', docs: 'email-routing',
    description: 'Email Routing receives mail for your domain and forwards each message to the right destination address. Feed the envelope onto the turntable; it turns to the matching mailbox and slides into the slot.',
    verb: 'Route envelope', idle: 'ENVELOPE AT INTAKE', active: 'DELIVERED TO MAILBOX',
    build(h) {
      const { g, group, box, cyl, badge, colors: C } = h;
      deck(h, 4.9, 2.8);
      const top = .72;
      // Intake bench with side guides.
      box(g, 1.4, .50, .6, -1.5, .47, 0, C.slate, .04);
      for (const z of [-.2, .2]) box(g, 1.4, .05, .04, -1.5, top + .025, z, C.steel, .01);
      // Turntable: fixed pedestal and rotating disc with its own guides.
      cyl(g, .5, .6, .40, 0, .42, 0, C.ink, 40);
      const disc = group(g, 0, .67, 0);
      cyl(disc, .75, .75, .10, 0, 0, 0, C.steel, 48);
      for (const z of [-.2, .2]) box(disc, 1.4, .05, .04, 0, .075, z, C.ink, .01);
      box(disc, .18, .012, .1, .55, .056, 0, C.orange, .004);
      // Three mailboxes, each opening toward the turntable.
      const dock = (x, z, ry, c) => {
        const d = group(g, x, 0, z); d.rotation.y = ry;
        box(d, .7, .50, .5, 0, .47, 0, C.slate, .03);
        box(d, .7, .06, .5, 0, 1.0, 0, c, .02);
        for (const s of [-1, 1]) box(d, .06, .25, .44, s * .32, .845, -.03, c, .015);
        box(d, .7, .25, .06, 0, .845, .22, c, .015);
        box(d, .58, .19, .02, 0, .845, .18, C.dark, .005);
        return d;
      };
      const target = dock(0, 1.1, 0, C.orange);
      dock(1.1, 0, Math.PI / 2, C.cream);
      dock(0, -1.1, Math.PI, C.cream);
      // Sign tower.
      box(g, 1.0, 1.2, .3, -1.6, .82, -1.0, C.slate, .04);
      box(g, .8, .5, .04, -1.6, 1.0, -.83, C.cream, .015);
      badge(g, -1.6, 1.0, -.81, .4);
      const env = group(g, -1.6, top + .02, 0);
      box(env, .5, .04, .32, 0, 0, 0, C.cream, .01);
      const flap = box(env, .16, .006, .16, 0, .023, 0, C.orange, .002);
      flap.rotation.y = Math.PI / 4; flap.scale.x = 1.4;
      return { hits: [env, disc, target], update(t, v) {
        const feed = stage(0, .3, v), turn = stage(.32, .6, v), out = stage(.62, .92, v);
        const a = -Math.PI / 2 * turn;
        disc.rotation.y = a;
        const r = mix(-1.6, 0, feed) + 1.05 * out;
        env.position.set(r * Math.cos(a), top + .02, -r * Math.sin(a));
        env.rotation.y = a;
      } };
    }
  },
  {
    id: 'registrar', name: 'Registrar', object: 'Domain Ledger & Seal', category: 'Connect', docs: 'registrar',
    description: 'Cloudflare Registrar registers and renews domains at cost, with the record kept alongside your DNS. Open the ledger and the seal arm presses the registration stamp onto the page.',
    verb: 'Register domain', idle: 'LEDGER CLOSED', active: 'DOMAIN SEALED',
    build(h) {
      const { g, group, box, cyl, badge, colors: C } = h;
      deck(h, 4.9, 2.8);
      // Lectern, a pad for the open cover, and the book.
      box(g, 2.0, .40, 1.4, -.3, .42, .1, C.slate, .05);
      box(g, 1.0, .26, .03, -.3, .42, .815, C.cream, .01);
      badge(g, -.3, .42, .832, .36);
      box(g, 1.0, .17, 1.2, -.8, .705, .1, C.dark, .03);
      box(g, 1.0, .05, 1.2, .2, .645, .1, C.ink, .015);
      box(g, .94, .12, 1.12, .2, .73, .1, C.cream, .02);
      for (let k = 0; k < 6; k++) box(g, .6, .004, .035, .2, .792, -.3 + k * .12, k === 2 ? C.orange : C.slate, .001);
      axleZ(h, g, .06, 1.2, -.3, .73, .1, C.ink, 16);
      const cover = group(g, -.3, .815, .1);
      box(cover, 1.0, .05, 1.2, .5, 0, 0, C.orange, .015);
      box(cover, .5, .006, .5, .5, .028, 0, C.amber, .003);
      const mark = cyl(g, .15, .15, .004, .25, .794, .1, C.lavender, 32);
      // Seal arm on a column; the stamp hangs on a pin and stays vertical.
      box(g, .30, .06, .30, 1.2, .25, .1, C.dark, .01);
      box(g, .18, 1.6, .18, 1.2, 1.02, .1, C.ink, .03);
      axleZ(h, g, .035, .34, 1.2, 1.7, .1, C.steel, 12);
      const arm = group(g, 1.2, 1.7, .1);
      box(arm, 1.35, .1, .1, -.375, 0, 0, C.steel, .03);
      box(arm, .26, .2, .14, .3, 0, 0, C.orange, .03);
      axleZ(h, arm, .05, .14, 0, 0, 0, C.ink);
      const stamp = group(arm, -1.0, 0, 0);
      axleZ(h, stamp, .03, .16, 0, 0, 0, C.steel, 12);
      cyl(stamp, .07, .07, .50, 0, -.30, 0, C.amber, 20);
      cyl(stamp, .16, .16, .06, 0, -.58, 0, C.ink, 32);
      return { hits: [cover, arm, stamp], update(t, v) {
        const open = stage(0, .35, v), press = stage(.4, .62, v) - stage(.72, .92, v), seal = stage(.6, .64, v);
        cover.rotation.z = Math.PI * open;
        const th = mix(-.25, Math.asin(.30), press);
        arm.rotation.z = th; stamp.rotation.z = -th;
        mark.scale.set(Math.max(.001, seal), 1, Math.max(.001, seal)); mark.visible = seal > 0;
      } };
    }
  }
];
