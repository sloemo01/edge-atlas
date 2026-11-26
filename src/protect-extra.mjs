// These benches are stand-alone metaphors. A pose depends only on the current
// ambient time and eased travel, so any frame can be replayed or sampled in reverse.
const mix = (a, b, u) => a + (b - a) * u;
const ease = (a, b, v) => {
  const u = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const simmer = (t, f = 2) => 1 + .045 * Math.sin(t * f);
const buildPose = (hits, update) => {
  update(0, 0);
  return { hits, update };
};
const floor = (h, w, d, accent) => {
  const { g, box, cyl, colors: C } = h;
  for (const x of [-w / 2 + .38, w / 2 - .38]) {
    for (const z of [-d / 2 + .33, d / 2 - .33]) {
      box(g, .43, .12, .39, x, .06, z, C.dark, .055);
      cyl(g, .048, .048, .034, x, .354, z, C.steel, 6);
    }
  }
  box(g, w, .18, d, 0, .21, 0, C.ink, .085);
  box(g, w - .10, .04, d - .13, 0, .32, 0, C.slate, .022);
  box(g, .66, .061, .031, 0, .235, d / 2 + .008, accent, .01);
};
const diskZ = (h, p, rt, rb, d, x, y, z, c, n) => {
  const m = h.cyl(p, rt, rb, d, x, y, z, c, n);
  m.rotation.x = Math.PI / 2;
  return m;
};
// Extruded guide profile with real holes. The profile is in the XZ plane;
// the origin is at its mid-height so mating datums stay explicit.
function profileY(h, parent, shape, length, x, y, z, color) {
  const m = h.cyl(parent, .25, .25, length, x, y, z, color);
  m.geometry = new h.THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false, curveSegments: 20 });
  m.geometry.translate(0, 0, -length / 2).rotateX(-Math.PI / 2);
  return m;
}
function cutHole(h, shape, x, y, r) {
  const bore = new h.THREE.Path();
  bore.absarc(x, y, r, 0, Math.PI * 2, true);
  shape.holes.push(bore);
}
function sleeveY(h, parent, outer, inner, length, x, y, z, color) {
  return h.tube(parent, outer, inner, length, x, y, z, color, 48);
}
const bolt = (h, p, x, y, z, r = .043) => h.cyl(p, r, r, .031, x, y, z, h.colors.steel, 6);

function apiShield(h) {
  const { g, group, box, cyl, ring, badge, glow, colors: C } = h;
  // Profile comparator: a keyed coupon rides between twin ways. Three feelers
  // descend into matching reliefs; the three collars and witness lamps show the fit.
  floor(h, 4.92, 2.94, C.orange);
  const frame = group(g);
  box(frame, 2.90, .15, 1.24, -.31, .415, .39, C.ink, .055);
  for (const z of [-.06, .85]) {
    box(frame, 2.81, .104, .22, -.32, .53, z, C.steel);
    for (const x of [-1.59, .91]) bolt(h, frame, x, .591, z + Math.sign(z - .39) * .097, .022);
  }
  for (const x of [-1.77, 1.04]) box(frame, .12, .19, .95, x, .55, .40, C.orange);
  for (const x of [-.86, .86]) {
    box(frame, .43, .16, .52, x, .42, -.62, C.steel);
    box(frame, .26, 1.46, .33, x, 1.215, -.62, C.slate, .055);
    box(frame, .30, .13, .94, x, 1.92, -.32, C.ink);
    for (const z of [-.815, -.425]) bolt(h, frame, x, .513, z);
  }
  box(frame, 2.04, .31, .74, 0, 2.05, .07, C.orange, .080);
  box(frame, 1.72, .19, .049, 0, 2.048, .449, C.cream, .020);
  badge(frame, 0, 2.048, .449 + .049 / 2, .37);
  for (const x of [-.73, .73]) diskZ(h, frame, .038, .038, .02, x, 2.05, .478, C.steel, 6);

  const axisZ = .39, wayTop = .582, couponY = wayTop - (.052 - .067 / 2);
  const coupon = group(g, -.97, couponY, axisZ);
  box(coupon, 1.44, .108, .78, 0, .03, 0, C.slate, .046);
  // Wear strips straddle the way bolts, which live on their outer edges.
  for (const s of [-1, 1]) box(coupon, .91, .067, .14, 0, .052, s * .448, C.ink, .018);
  const plate = new h.THREE.Shape();
  plate.moveTo(-.61, -.31).lineTo(.61, -.31).lineTo(.61, .31).lineTo(-.61, .31).closePath();
  const probes = [[-.45, .102, .076], [0, .132, .101], [.45, .107, .081]];
  for (const [x, , r] of probes) cutHole(h, plate, x, 0, r);
  profileY(h, coupon, plate, .090, 0, .128, 0, C.cream);
  box(coupon, .34, .081, .21, 0, .06, .47, C.orange, .025);
  box(coupon, .24, .027, .14, 0, .109, .48, C.amber, .014);
  const feelers = [];
  const tipRest = .902, socketFloor = couponY + .101;
  const collarTop = 1.50, springs = [];
  const helix = new h.THREE.Curve();
  helix.getPoint = (u, out = new h.THREE.Vector3()) => out.set(.086 * Math.cos(u * Math.PI * 14), -u, .086 * Math.sin(u * Math.PI * 14));
  const springShape = new h.THREE.TubeGeometry(helix, 168, .013, 6, false);
  for (const [x, r, bore] of probes) {
    sleeveY(h, coupon, r + .018, bore, .039, x, .184, 0, C.orange);
    cyl(coupon, bore, bore, .035, x, .0835, 0, C.ink);
    sleeveY(h, frame, .147, .067, .158, x, 1.824, axisZ, C.ink);
    sleeveY(h, frame, .138, .066, .078, x, 1.711, axisZ, C.steel);
    const rod = group(g, x, 0, axisZ);
    const tipLength = .078;
    // The rod continues up into the head so it stays captive in both guides at full drop.
    const rodBottom = tipRest + tipLength - .007, rodTop = 2.10;
    cyl(rod, .061, .061, rodTop - rodBottom, 0, (rodTop + rodBottom) / 2, 0, C.steel);
    // Spring seat collar; a return spring hangs from the guide and stretches as the feeler drops.
    cyl(rod, .114, .114, .070, 0, collarTop - .035, 0, C.amber);
    const spring = cyl(frame, .1, .1, .1, x, 1.672, axisZ, C.steel);
    spring.geometry = springShape;
    springs.push(spring);
    cyl(rod, .061, .041, tipLength, 0, tipRest + tipLength / 2, 0, C.cream);
    feelers.push(rod);
  }
  const panel = group(g, 1.78, .34, .29);
  box(panel, .72, .16, .87, 0, .08, 0, C.ink);
  box(panel, .61, .50, .68, 0, .37, -.04, C.cream, .09);
  box(panel, .50, .103, .046, 0, .44, .315, C.slate);
  const lamps = [-.15, 0, .15].map(x => diskZ(h, panel, .044, .044, .031, x, .44, .346, glow(C.mint)));
  cyl(panel, .123, .123, .079, 0, .66, -.07, C.orange, 12);
  return buildPose([frame, coupon, panel], (t, v) => {
    coupon.position.x = mix(-.97, 0, ease(0, .46, v));
    feelers.forEach((rod, i) => {
      const q = ease(.48 + .045 * i, .73 + .07 * i, v);
      rod.position.y = (socketFloor - tipRest) * q;
      springs[i].scale.y = 1.672 - (collarTop + rod.position.y);
      lamps[i].scale.setScalar(mix(.56, simmer(t + i * .48), q));
    });
  });
}

function rateLimiting(h) {
  const { g, group, box, cyl, ring, badge, glow, colors: C } = h;
  // Ticket meter: a mechanical counter and fixed stop share a shaft. Two
  // sample tickets advance in this window; the third meets the stop at its slot.
  floor(h, 4.86, 2.99, C.amber);
  const meter = group(g, -.14, 0, -.36);
  box(meter, 2.93, .17, 1.26, 0, .425, 0, C.dark);
  // The three horizontal mouths are voids through the cabinet, not painted slots.
  const ticketY = .837, ticketBottom = ticketY - .049 / 2;
  box(meter, 2.67, ticketBottom - .50, 1.09, 0, (ticketBottom + .50) / 2, 0, C.cream, .08);
  box(meter, 2.67, .424, 1.09, 0, 1.112, 0, C.cream, .067);
  for (const [x, w] of [[-1.11, .45], [-.325, .18], [.325, .18], [1.11, .45]]) {
    box(meter, w, .102, 1.09, x, .857, 0, C.slate, .02);
    box(meter, w, .231, .081, x, .837, .546, C.ink, .019);
  }
  box(meter, 2.74, .13, 1.15, 0, 1.38, 0, C.orange, .06);
  for (const x of [-1.17, 1.17]) for (const z of [-.38, .37]) bolt(h, meter, x, 1.462, z);
  for (let i = 0; i < 6; i++) box(meter, .029, .105, .055, -.235 + i * .094, .66, -.558, C.slate, .007);
  box(meter, 1.87, .094, .054, 0, .949, .561, C.ink);
  const tickets = [];
  for (const [i, x] of [-.65, 0, .65].entries()) {
    box(meter, .49, .044, .159, x, ticketBottom - .022, .622, C.steel, .02);
    box(meter, .49, .055, .113, x, .927, .578, C.dark, .018);
    const ticket = group(meter, x, ticketY, .485);
    box(ticket, .39, .049, .65, 0, 0, -.20, i === 2 ? C.amber : C.cream, .022);
    box(ticket, .063, .014, .46, -.135, .029, -.20, i === 2 ? C.orange : C.cyan, .006);
    for (let j = 0; j < 3; j++) box(ticket, .145 - .02 * j, .014, .019, .038, .029, -.16 - j * .058, C.slate, .006);
    tickets.push(ticket);
  }
  box(g, 2.08, .12, 1.12, -.14, .40, .85, C.ink);
  box(g, 1.95, .33, 1.05, -.14, .60, .85, C.slate);
  box(g, 1.86, .050, .90, -.14, ticketBottom - .025, .82, C.dark, .028);
  box(meter, 1.84, .032, .147, 0, ticketBottom - .02, .726, C.steel, .012);
  for (const x of [-1.12, .84]) box(g, .09, .14, .94, x, .826, .85, C.steel);
  const stop = group(meter, .65, 1.13, .588);
  box(meter, .24, .22, .14, .65, 1.13, .560, C.slate, .037);
  box(stop, .12, .33, .11, 0, -.128, .083, C.orange);
  box(stop, .25, .079, .096, 0, -.29, .12, C.orange, .020);
  diskZ(h, meter, .090, .090, .12, .65, 1.13, .674, C.steel, 8);
  box(meter, .61, .22, .053, -.69, 1.15, .566, C.cream, .027);
  badge(meter, -.69, 1.15, .566 + .053 / 2, .36);

  // The gauge stands on its own pedestal beside the cabinet, clear of the top plate.
  const dial = group(g, 1.93, 1.62, -.22);
  dial.scale.setScalar(.86);
  box(g, .39, 1.02, .35, 1.93, .85, -.34, C.slate);
  box(g, .74, .13, .60, 1.93, .405, -.34, C.ink);
  diskZ(h, dial, .72, .70, .25, 0, 0, 0, C.ink);
  diskZ(h, dial, .64, .64, .056, 0, 0, .14, C.cream);
  ring(dial, .657, .035, 0, 0, .165, C.steel);
  for (let i = 0; i < 13; i++) {
    const a = mix(-1.35, 1.35, i / 12);
    const tick = box(dial, i % 3 ? .025 : .049, i % 3 ? .078 : .143, .018,
      Math.sin(a) * .514, Math.cos(a) * .514, .176, i === 9 ? C.orange : C.slate, .008);
    tick.rotation.z = -a;
  }
  const needle = group(dial, 0, 0, .19);
  box(needle, .050, .52, .028, 0, .159, 0, C.orange, .013);
  diskZ(h, needle, .108, .108, .049, 0, 0, .028, C.ink);
  const lamp = diskZ(h, dial, .055, .055, .028, 0, -.34, .18, glow(C.amber));

  return buildPose([meter, dial, stop], (t, v) => {
    const one = ease(.05, .33, v);
    const two = ease(.33, .65, v);
    const over = ease(.69, .92, v);
    tickets[0].position.z = .485 + one * .97;
    tickets[1].position.z = .485 + two * .97;
    const stopFace = .588 + .12 - .096 / 2;
    tickets[2].position.z = mix(.485, stopFace - (.65 / 2 - .20), over);
    stop.rotation.z = mix(1.08, 0, ease(.56, .68, v));
    needle.rotation.z = 1.35 - 1.02 * (one + two);
    lamp.scale.setScalar(mix(.66, simmer(t), over));
  });
}

function emailSecurity(h) {
  const { g, group, box, rail, badge, glow, colors: C } = h;
  // A trunnion-mounted mail chute tips toward a quarantine bin. Clean mail
  // is already stacked in the other bin; the marked letter remains visible end to end.
  floor(h, 5.02, 3.02, C.lavender);
  function envelope(p, x, y, z, accent) {
    const letter = group(p, x, y, z);
    box(letter, .82, .069, .51, 0, 0, 0, C.cream, .024);
    const ends = [[-.40,.037,-.24],[0,.037,.065],[.40,.037,-.24]];
    for (let i = 0; i < 2; i++) rail(letter, [ends[i], ends[i + 1]], .013, C.slate);
    box(letter, .118, .023, .102, 0, .042, .065, accent, .015);
    box(letter, .096, .012, .078, .278, .039, .143, accent, .010);
    return letter;
  }
  function bin(x, accent) {
    const tray = group(g, x, .34, .32);
    box(tray, 1.26, .19, 1.46, 0, .095, 0, C.slate, .075);
    box(tray, 1.15, .047, 1.32, 0, .209, 0, C.ink, .028);
    for (const s of [-1, 1]) {
      box(tray, .096, .35, 1.42, s * .58, .274, 0, accent, .033);
      box(tray, .12, .052, 1.39, s * .58, .473, 0, C.steel);
    }
    box(tray, 1.20, .165, .084, 0, .214, .682, accent);
    box(tray, .56, .087, .031, 0, .228, .735, C.dark, .016);
    box(tray, .28, .025, .025, 0, .231, .754, C.steel, .009);
    return tray;
  }
  const inbox = bin(-1.73, C.cyan);
  const quarantine = bin(1.73, C.lavender);
  const first = envelope(inbox, -.04, .272, .11, C.cyan);
  first.rotation.y = -.12;
  const second = envelope(inbox, .04, .34, .00, C.cyan);
  second.rotation.y = .14;

  const stand = group(g);
  box(stand, .98, .15, .61, 0, .415, -.90, C.ink);
  box(stand, .58, 1.29, .43, 0, 1.127, -.90, C.slate, .065);
  box(stand, .46, .31, .050, 0, 1.15, -.662, C.cream, .030);
  badge(stand, 0, 1.15, -.662 + .050 / 2, .31);
  const pivotY = 1.45, pivotZ = .36, deck = .09;
  box(stand, .46, .26, .65, 0, pivotY, -.494, C.orange, .065);
  diskZ(h, stand, .143, .143, .14, 0, pivotY, -.164, C.ink);
  diskZ(h, stand, .078, .078, .32, 0, pivotY, -.02, C.steel, 12);
  const chute = group(g, 0, pivotY, pivotZ);
  diskZ(h, chute, .132, .132, .114, 0, 0, -.401, C.ink);
  box(chute, 2.10, .105, .82, 0, deck, 0, C.steel, .047);
  box(chute, 2.02, .037, .68, 0, deck + .072, 0, C.slate, .024);
  for (const z of [-.383, .383]) {
    box(chute, 2.10, .142, .080, 0, deck + .096, z, C.orange, .024);
    for (const x of [-.91, .91]) bolt(h, chute, x, deck + .18, z, .034);
  }
  for (const x of [-.72, -.48, -.24, 0, .24, .48, .72]) {
    box(chute, .028, .015, .072, x, deck + .095, -.303, C.steel, .006);
  }
  const rideHeight = deck + .072 + .037 / 2 + .069 / 2;
  const suspect = envelope(g, 0, pivotY + rideHeight, pivotZ, C.lavender);
  const lamp = diskZ(h, stand, .071, .071, .047, 0, 1.648, -.095, glow(C.amber));
  box(stand, .29, .22, .28, 0, 1.616, -.25, C.ink);

  return buildPose([chute, quarantine, inbox, suspect], (t, v) => {
    const tip = ease(.09, .48, v);
    const slide = ease(.30, .69, v);
    const overRim = ease(.69, .82, v), drop = ease(.82, 1, v);
    const a = -.358 * tip;
    const x = 1.48 * slide;
    chute.rotation.z = a;
    const edgeY = pivotY + x * Math.sin(a) + rideHeight * Math.cos(a);
    // Clear the inboard wall horizontally before dropping. The landing y is the liner surface.
    suspect.position.set(mix(x * Math.cos(a) - rideHeight * Math.sin(a), quarantine.position.x, overRim),
      mix(edgeY, .34 + .209 + .047 / 2 + .069 / 2, drop), pivotZ);
    suspect.rotation.z = a * (1 - overRim);
    lamp.scale.setScalar(mix(.63, simmer(t), tip));
  });
}

function gateway(h) {
  const { g, group, box, cyl, badge, glow, colors: C } = h;
  // A dock crane lifts one permitted load over the boundary. The held
  // load never leaves its inspection pad. A geared turntable guides the transfer.
  floor(h, 5.01, 3.02, C.cyan);
  const mast = group(g, -.56, 0, -.67);
  cyl(mast, .49, .55, .14, 0, .41, 0, C.ink);
  cyl(mast, .37, .46, .18, 0, .57, 0, C.steel);
  cyl(mast, .249, .29, 1.56, 0, 1.38, 0, C.slate, 12);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    bolt(h, mast, .44 * Math.cos(a), .492, .44 * Math.sin(a));
  }
  box(mast, .31, .73, .15, 0, 1.07, .25, C.ink, .04);
  box(mast, .51, .32, .17, 0, 1.69, .179, C.ink, .048);
  box(mast, .48, .28, .073, 0, 1.69, .285, C.cream, .032);
  badge(mast, 0, 1.69, .285 + .073 / 2, .32);
  const indicator = box(mast, .15, .14, .047, 0, 1.16, .343, glow(C.cyan), .023);
  for (let i = 0; i < 4; i++) box(mast, .15, .034, .027, 0, .83 + .065 * i, .336, C.steel, .009);
  cyl(mast, .32, .32, .14, 0, 2.13, 0, C.ink);
  const turn = group(mast, 0, 2.23, 0);
  cyl(turn, .323, .323, .086, 0, 0, 0, C.orange, 14);
  box(turn, 2.12, .23, .35, .56, .126, 0, C.orange, .059);
  box(turn, 1.23, .109, .21, .82, .288, 0, C.steel, .032);
  box(turn, .39, .29, .47, -.44, .13, 0, C.ink, .041);
  box(turn, .38, .087, .034, .17, .128, .186, C.amber, .015);
  for (let i = 0; i < 5; i++) box(turn, .026, .097, .027, .59 + i * .135, .128, .18, C.amber, .008);
  const reach = 1.44;
  box(turn, .31, .24, .40, reach, .055, 0, C.ink);
  for (const z of [-.21, .21]) diskZ(h, turn, .122, .122, .05, reach, .06, z, C.steel, 8);
  const cable = cyl(turn, .025, .025, 1, reach, -1, 0, C.steel, 12);
  const hoist = group(turn, reach, -.86, 0);
  cyl(hoist, .091, .091, .099, 0, .075, 0, C.steel, 8);
  box(hoist, .44, .103, .42, 0, -.017, 0, C.orange, .046);
  box(hoist, .31, .048, .30, 0, -.093, 0, C.dark, .034);

  function stepPad(x, z, color, w = .76) {
    const pad = group(g, x, .34, z);
    box(pad, w, .17, .74, 0, .085, 0, C.slate);
    box(pad, w - .069, .036, .67, 0, .179, 0, color, .028);
    for (const x of [-w / 2 + .076, w / 2 - .076]) for (const z of [-.25, .25]) bolt(h, pad, x, .205, z, .032);
    return pad;
  }
  const initial = -2.31, final = -.33;
  const point = a => [-.56 + reach * Math.cos(a), -.67 - reach * Math.sin(a)];
  const [xa, za] = point(initial), [xb, zb] = point(final);
  const entry = stepPad(xa, za, C.steel);
  const exit = stepPad(xb, zb, C.cyan);
  const hold = stepPad(1.71, .82, C.amber, .92);
  const boundaryX = .328;
  box(g, .07, .025, 2.40, boundaryX, .352, .02, C.ink, .008);
  for (let i = 0; i < 7; i++) box(g, .052, .010, .19, boundaryX, .369, -.99 + i * .334, C.amber, .004);
  function load(p, x, y, z, accent) {
    const cargo = group(p, x, y, z);
    box(cargo, .45, .27, .43, 0, .135, 0, C.cream, .04);
    box(cargo, .33, .027, .30, 0, .278, 0, C.steel, .022);
    box(cargo, .14, .087, .022, 0, .12, .224, accent, .012);
    return cargo;
  }
  load(hold, 0, .197, 0, C.lavender);
  for (const x of [1.349, 2.071]) {
    box(hold, .060, .24, .075, x - 1.71, .277, -.25, C.lavender);
    box(hold, .060, .24, .075, x - 1.71, .277, .25, C.lavender);
    box(hold, .060, .065, .57, x - 1.71, .39, 0, C.lavender);
  }
  const padTop = .34 + .179 + .036 / 2;
  const parcelTop = .278 + .027 / 2, magnetSole = -.093 - .048 / 2;
  const cableHead = .075 + .099 / 2 - .007, drumExit = .055 - .24 / 2 + .012;
  const parcel = load(g, xa, padTop, za, C.cyan);
  return buildPose([mast, turn, parcel, entry, exit, hold], (t, v) => {
    const lift = ease(.15, .36, v) * (1 - ease(.74, .91, v));
    const a = mix(initial, final, ease(.35, .74, v));
    turn.rotation.y = a;
    const [x, z] = point(a);
    parcel.position.set(x, padTop + lift * .65, z);
    const magnetBottom = parcel.position.y + parcelTop + .20 * (1 - ease(0, .15, v) + ease(.91, 1, v));
    hoist.position.y = magnetBottom - magnetSole - turn.position.y;
    const end = hoist.position.y + cableHead;
    cable.position.y = (end + drumExit) / 2;
    cable.scale.y = drumExit - end;
    indicator.scale.x = mix(.66, simmer(t), ease(.16, .56, v));
  });
}

function sslTls(h) {
  const { g, group, box, cyl, ring, rail, badge, glow, colors: C } = h;
  // A bayonet coupler mates two terminals and twists a protective collar shut.
  // The signal witness ring grows in the seam once the sleeve is seated.
  floor(h, 5.07, 2.98, C.orange);
  function axial(p, r, d, x, color, n) {
    const m = cyl(p, r, r, d, x, 0, 0, color, n);
    m.rotation.z = Math.PI / 2;
    return m;
  }
  function seal(p, r, d, x, color) {
    const m = ring(p, r, d, x, 0, 0, color);
    m.rotation.y = Math.PI / 2;
    return m;
  }
  const y = 1.23, z = -.20;
  const sleeve = (parent, outer, inner, length, x, color) => {
    const m = sleeveY(h, parent, outer, inner, length, x, 0, 0, color);
    m.rotation.z = Math.PI / 2;
    return m;
  };
  const pedestal = -1.53;
  box(g, .86, .16, .87, pedestal, .42, z, C.ink, .060);
  box(g, .51, .42, .42, pedestal, .702, z, C.slate, .065);
  box(g, .57, .108, .62, pedestal, .897, z, C.steel, .030);
  for (const dz of [-.20, .20]) box(g, .49, .102, .16, pedestal, .975, z + dz, C.steel, .027);
  for (const dz of [-.34, .34]) bolt(h, g, pedestal, .513, z + dz);
  const socket = group(g, 0, y, z);
  const plug = group(g, .66, y, z);
  axial(socket, .31, .60, -1.44, C.slate, 12);
  axial(socket, .404, .61, -.98, C.cream);
  axial(socket, .455, .20, -.68, C.ink, 12);
  axial(socket, .474, .20, -.495, C.orange);
  const mouth = -.17;
  sleeve(socket, .416, .303, .192, mouth - .047 - .192 / 2, C.ink);
  sleeve(socket, .423, .307, .047, mouth - .047 / 2, C.steel);
  axial(socket, .31, .025, -.278, C.dark);
  for (let i = 0; i < 3; i++) {
    const a = 2 * Math.PI * i / 3;
    const p = group(socket, -.256, Math.cos(a) * .145, Math.sin(a) * .145);
    axial(p, .045, .023, 0, C.steel, 8);
  }
  axial(plug, .31, .60, 1.20, C.slate, 12);
  axial(plug, .395, .73, .72, C.cream);
  axial(plug, .286, .30, .181, C.steel);
  seal(plug, .282, .035, .045, C.ink);
  for (let i = 0; i < 3; i++) {
    const a = 2 * Math.PI * i / 3;
    const p = group(plug, 0, Math.cos(a) * .145, Math.sin(a) * .145);
    axial(p, .041, .169, -.042, C.amber, 12);
  }
  const collar = group(plug);
  sleeve(plug, .426, .391, .72, .48, C.steel);
  sleeve(collar, .497, .432, .32, .43, C.orange);
  seal(collar, .48, .035, .264, C.amber);
  seal(collar, .47, .029, .596, C.ink);
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    const m = box(collar, .212, .059, .079, .43, Math.cos(a) * .495, Math.sin(a) * .495,
      i === 0 || i === 4 ? C.cream : C.amber, .015);
    m.rotation.x = a;
  }
  const witness = seal(socket, .405, .017, -.238, glow(C.cyan));
  // The slide is supported on twin ways; both outer cable tails are strain relieved.
  const guideTop = .66;
  for (const dz of [-.34, .34]) {
    for (const x of [.22, 1.92]) box(g, .23, .251, .23, x, .465, z + dz, C.ink, .032);
    box(g, 2.04, .09, .097, 1.09, guideTop - .045, z + dz, C.steel);
    box(plug, .29, .47, .119, .55, guideTop - y + .235, dz, C.slate);
    box(plug, .30, .155, .48, .55, -.203, dz / 2, C.slate, .036);
  }
  for (const x of [-1.86, 1.89]) {
    box(g, .29, .22, .65, x, .45, .99, C.slate);
    for (const dz of [.79, 1.19]) bolt(h, g, x, .574, dz);
  }
  rail(g, [[-1.74,y,z],[-2.10,1.14,-.11],[-2.23,.81,.34],[-2.13,.55,.94],[-1.86,.57,.99]], .076, C.ink);
  const up = new h.THREE.Vector3(0, 1, 0);
  const direction = new h.THREE.Vector3();
  const tail = Array.from({ length: 3 }, () => cyl(g, .073, .073, 1, 0, 0, 0, C.ink, 16));
  const boots = Array.from({ length: 2 }, () => h.ball(g, .074, 0, 0, 0, C.ink));
  const badgePlate = group(g, 0, .34, .81);
  box(badgePlate, .91, .36, .59, 0, .18, 0, C.slate, .070);
  box(badgePlate, .76, .25, .055, 0, .19, .312, C.cream, .036);
  badge(badgePlate, 0, .19, .312 + .055 / 2, .43);
  for (const x of [-.32, .32]) bolt(h, badgePlate, x, .38, .07);
  return buildPose([socket, plug, badgePlate], (t, v) => {
    const mate = ease(.05, .66, v);
    const lock = ease(.67, .97, v);
    const contactFace = -.256 + .023 / 2;
    const pinTip = -.042 - .169 / 2;
    plug.position.x = mix(.66, contactFace - pinTip, mate);
    collar.rotation.x = -lock * Math.PI * .57;
    collar.position.x = -.338 * lock;
    // Short articulated strain relief: the plug and fixed mount both remain connected.
    const p = plug.position.x + 1.50 - .013;
    const route = [[p, y, z], [p + .11, .96, .12], [mix(p, 1.89, .38), .63, .57], [1.89, .57, .99]];
    tail.forEach((segment, i) => {
      const [x1, y1, z1] = route[i], [x2, y2, z2] = route[i + 1];
      direction.set(x2 - x1, y2 - y1, z2 - z1);
      segment.scale.y = direction.length();
      segment.quaternion.setFromUnitVectors(up, direction.normalize());
      segment.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
    });
    boots.forEach((boot, i) => boot.position.set(...route[i + 1]));
    witness.scale.set(1, mix(.916, 1.047 + (simmer(t) - 1) * .29, lock),
      mix(.916, 1.047 + (simmer(t) - 1) * .29, lock));
  });
}

export default [
  { id: 'api-shield', name: 'API Shield', object: 'Schema pin gauge', category: 'Protect',
    description: 'API Shield can check requests against a defined schema. Slide the request coupon under the gauge: the three feelers seat only where their features match.',
    verb: 'Check request shape', idle: 'GAUGE CLEAR', active: 'SAMPLE MATCHES SCHEMA', docs: '/api-shield/', build: apiShield },
  { id: 'rate-limiting', name: 'Rate Limiting', object: 'Ticket meter', category: 'Protect',
    description: 'A rate limiting rule can act when matching requests exceed a threshold within a time window. In this miniature example, the meter allows two tickets and holds the third.',
    verb: 'Try three requests', idle: 'SAMPLE WINDOW READY', active: 'TWO ALLOWED · ONE HELD', docs: '/waf/rate-limiting-rules/', build: rateLimiting },
  { id: 'email-security', name: 'Email Security', object: 'Mail quarantine chute', category: 'Protect',
    description: 'Email Security identifies suspicious messages so they can be kept away from inboxes. Tip the chute to send the flagged letter into the quarantine tray.',
    verb: 'Sort flagged mail', idle: 'LETTER FLAGGED FOR REVIEW', active: 'LETTER IN QUARANTINE', docs: '/cloudflare-one/email-security/', build: emailSecurity },
  { id: 'gateway', name: 'Gateway', object: 'Policy swing-jib', category: 'Protect',
    description: 'Gateway applies policy to outbound traffic. This dock crane transfers the permitted parcel to the outgoing pad and leaves the blocked parcel behind.',
    verb: 'Apply outbound policy', idle: 'LOADS AWAIT TRANSFER', active: 'PERMITTED LOAD DISPATCHED', docs: '/cloudflare-one/traffic-policies/', build: gateway },
  { id: 'ssl-tls', name: 'SSL/TLS', object: 'Bayonet coupling', category: 'Protect',
    description: 'TLS establishes a protected connection between two endpoints. The terminals first meet, then the sleeve turns to seal the link.',
    verb: 'Secure the link', idle: 'TERMINALS SEPARATE', active: 'PROTECTED LINK ESTABLISHED', docs: '/ssl/', build: sslTls },
];
