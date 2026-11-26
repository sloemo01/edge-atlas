// Each bench instrument owns its moving assemblies. v is the engine's eased switch.
const mix = (a, b, v) => a + (b - a) * v;
const clamp = x => Math.min(1, Math.max(0, x));
const stage = (a, b, v) => {
  const s = clamp((v - a) / (b - a));
  return s * s * (3 - 2 * s);
};
const fraction = x => ((x % 1) + 1) % 1;
const roundZ = (h, p, r, d, x, y, z, c, n = 32) => {
  const m = h.cyl(p, r, r, d, x, y, z, c, n);
  m.rotation.x = Math.PI / 2;
  return m;
};
const bolt = (h, p, x, y, z, r = .055) => h.cyl(p, r, r, .033, x, y, z, h.colors.steel, 6);
const stud = (h, p, x, y, z, r = .045) => roundZ(h, p, r, .035, x, y, z, h.colors.steel, 6);
// Open guide with real clearance for a vertical shaft (not a solid cylinder).
function bushingY(h, parent, outer, inner, length, x, y, z, color) {
  return h.tube(parent, outer, inner, length, x, y, z, color, 48);
}
const breathe = (t, rate = 2) => .95 + .05 * Math.sin(t * rate);
const instrument = (hits, update) => {
  update(0, 0); // The viewer measures the instrument as soon as build returns.
  return { hits, update };
};

function waf(h) {
  const { g, colors: c, group, box, rail, badge, glow } = h;
  // Conveyor deck, roller bearings, a bridge-mounted optical head, and a swing-out reject vane.
  box(g, 4.92, .24, 3.26, 0, .25, .08, c.ink, .12);
  for (const x of [-1.89, 1.89]) for (const z of [-1.10, 1.27]) {
    box(g, .42, .16, .43, x, .08, z, c.dark);
    bolt(h, g, x, .389, z);
  }
  box(g, 4.72, .23, 1.54, 0, .49, -.29, c.slate, .08);
  box(g, 4.38, .12, 1.05, 0, .65, -.29, c.dark);
  box(g, 4.70, .16, .17, 0, .64, -.96, c.steel);
  box(g, 2.55, .16, .17, -1.075, .64, .39, c.steel);
  box(g, .86, .16, .17, 1.92, .64, .39, c.steel);
  const rollers = [];
  for (let i = 0; i < 11; i++) {
    const x = (i - 5) * .409;
    const drum = group(g, x, .69, -.29);
    roundZ(h, drum, .092, 1.18, 0, 0, 0, i % 3 === 1 ? c.steel : c.slate, 16);
    roundZ(h, g, .037, i >= 6 && i <= 8 ? 1.22 : 1.40, x, .69, -.29, c.steel, 12);
    box(drum, .025, .023, 1.08, 0, .089, 0, c.ink, .008);
    if (!(i % 2)) stud(h, g, x, .642, .482);
    rollers.push(drum);
  }
  // One rear-mounted column cantilevers over the flow; all guide travel is visible.
  box(g, 1.00, .15, .66, -.38, .44, -1.17, c.steel);
  const tower = box(g, .79, 2.12, .51, -.38, 1.55, -1.22, c.slate, .09);
  for (const x of [-.64, -.12]) {
    rail(g, [[x, .83, -.925], [x, 2.56, -.925]], .054, c.steel);
    for (const y of [.87, 2.46]) box(g, .15, .17, .19, x, y, -.948, c.ink);
  }
  box(g, 1.01, .26, 1.16, -.38, 2.67, -.86, c.orange, .078);
  box(g, .76, .11, .76, -.38, 2.85, -.86, c.cream, .04);
  for (const x of [-.73, -.03]) bolt(h, g, x, 2.923, -.67);
  for (let i = 0; i < 5; i++) box(g, .027, .13, .27, .021, 1.10 + i * .16, -1.22, c.ink, .009);
  const head = group(g, -.38, 2.21, -.29);
  for (const x of [-.26, .26]) {
    bushingY(h, head, .093, .059, .27, x, 0, -.635, c.ink);
    box(head, .15, .17, .076, x, 0, -.52, c.ink);
  }
  box(head, .86, .29, 1.07, 0, -.025, -.011, c.slate, .075);
  const optics = box(head, .65, .09, .95, 0, -.208, .015, c.dark);
  const scan = box(head, .09, .029, .795, 0, -.263, .015, glow(c.cyan), .013);
  box(head, .68, .24, .075, 0, -.01, .542, c.cream, .043);
  badge(head, 0, -.01, .542 + .075 / 2, .39);
  for (const x of [-.366, .366]) stud(h, head, x, -.01, .547, .033);

  // Reject tray runs from the belt to the front of the chassis.
  box(g, 1.34, .13, 1.12, .87, .48, .98, c.slate, .065);
  box(g, 1.14, .048, 1.02, .87, .569, .96, c.ink);
  for (const x of [.26, 1.48]) box(g, .105, .14, 1.02, x, .585, .97, c.steel, .033);
  box(g, 1.34, .16, .13, .87, .575, 1.49, c.steel);
  box(g, .69, .065, .038, .87, .575, 1.559, c.amber, .018);
  // Overhead selector: its sweep stays above the moving pucks, on a rear-rail post.
  const diverter = group(g, 1.04, 1.00, -.96);
  h.cyl(g, .137, .137, .31, 1.04, .869, -.96, c.ink);
  box(diverter, .93, .15, .12, -.42, .07, 0, c.orange);
  box(diverter, .62, .029, .132, -.46, .135, 0, c.cream, .012);
  bolt(h, diverter, 0, .166, 0, .078);
  const ok = box(g, .42, .060, .041, 1.98, .31, 1.72, glow(c.mint), .017);
  box(g, .50, .119, .052, 1.98, .31, 1.685, c.slate, .023);

  const packets = Array.from({ length: 5 }, (_, i) => {
    const p = group(g);
    box(p, .30, .155, .435, 0, 0, 0, i === 2 ? c.amber : c.cream, .045);
    box(p, .10, .022, .314, 0, .084, 0, i === 2 ? c.orange : c.cyan, .009);
    return p;
  });
  return instrument([tower, optics, head, diverter, ...packets], (t, v) => {
    const scanOn = stage(.04, .65, v);
    const sort = stage(.38, .98, v);
    head.position.y = 2.21 - scanOn * .79 + Math.sin(t * 1.45) * .018;
    scan.scale.x = mix(.44, 1, scanOn) * breathe(t, 3.1);
    diverter.rotation.y = sort * .94;
    ok.scale.x = breathe(t, 2.4);
    rollers.forEach(drum => { drum.rotation.z = -t * .62 - v * .76; });
    packets.forEach((p, i) => {
      const u = fraction(t * .175 + i / packets.length);
      const x = mix(-2.24, 2.21, u);
      const bend = i === 2 ? sort * stage(.62, .91, u) : 0;
      const z = mix(-.29, 1.27, bend);
      // The packet leaves the transport level only after its full body clears the rollers.
      const inBranch = stage(-.11, .18, z);
      p.position.set(mix(x, .87, inBranch), mix(.858, .671, stage(.49, 1.1, z)), z);
      p.rotation.y = bend * Math.PI * .5;
      p.scale.setScalar(Math.max(.001, Math.min(stage(0, .10, u), 1 - stage(.89, 1, u))));
    });
  });
}

function ddos(h) {
  const { g, colors: c, group, box, rail, ring, ball, badge, glow } = h;
  // Flood-control bench: a deep bypass catch basin and a high, narrow delivery flume.
  const pan = box(g, 4.84, .22, 3.56, 0, .27, 0, c.slate, .13);
  for (const x of [-1.93, 1.93]) for (const z of [-1.29, 1.29]) {
    h.cyl(g, .20, .23, .16, x, .08, z, c.ink, 16);
    bolt(h, g, x, .396, z);
  }
  box(g, 4.20, .095, 1.92, -.10, .423, .61, c.dark, .095);
  for (const z of [-.33, 1.60]) box(g, 4.21, .26, .12, -.10, .50, z, c.ink);
  for (const x of [-2.18, 1.98]) box(g, .12, .28, 1.97, x, .50, .63, c.steel);
  for (let i = 0; i < 7; i++) box(g, .074, .083, .87, -.57 + .127 * i, .486, .96, c.slate, .018);
  box(g, 1.06, .077, .14, -.19, .48, .49, c.steel);
  box(g, 1.06, .077, .14, -.19, .48, 1.41, c.steel);

  for (const x of [-1.70, 1.54]) {
    box(g, .73, .14, .93, x, .44, -.86, c.steel);
    box(g, .53, .78, .69, x, .88, -.86, c.ink, .09);
    for (const z of [-1.24, -.49]) bolt(h, g, x, .53, z);
  }
  box(g, 4.67, .17, 1.24, 0, 1.24, -.84, c.cream);
  box(g, 4.45, .081, .93, 0, 1.361, -.84, c.slate);
  box(g, 4.64, .22, .12, 0, 1.42, -1.48, c.ink);
  box(g, 1.22, .22, .12, -1.71, 1.42, -.21, c.ink);
  box(g, 2.01, .22, .12, 1.31, 1.42, -.21, c.ink);
  // Intake beak, and a protected single-file lane at the outlet.
  for (const z of [-1.25, -.43]) box(g, .57, .35, .16, -2.02, 1.58, z, c.orange, .053);
  box(g, .71, .17, 1.24, -2.01, 1.84, -.84, c.orange, .066);
  // Split portal legs and a high crossbar leave the entire delivery lane open.
  for (const x of [.64, 1.10, 1.56, 2.02]) {
    for (const z of [-1.43, -.25]) box(g, .108, .29, .105, x, 1.53, z, c.slate, .026);
    box(g, .108, .079, 1.24, x, 1.667, -.84, c.slate, .023);
    bolt(h, g, x, 1.72, -.36, .043);
  }
  box(g, 2.06, .11, .52, 1.24, 1.704, -.91, c.ink);
  box(g, 2.11, .047, .29, 1.22, 1.78, -.91, c.steel);

  // The front-mounted pressure dial tracks the flood. The sluice dips to open the overflow.
  const frame = group(g, -.59, 2.13, -.34);
  box(g, .44, .12, .29, -.59, .435, -1.60, c.steel);
  box(g, .28, 1.87, .23, -.59, 1.42, -1.60, c.ink, .052);
  box(g, .72, .22, 1.35, -.59, 2.26, -.982, c.ink);
  roundZ(h, frame, .752, .18, 0, 0, -.105, c.slate);
  roundZ(h, frame, .658, .084, 0, 0, .012, c.ink);
  ring(frame, .694, .046, 0, 0, .028, c.steel);
  for (let i = 0; i < 12; i++) {
    const a = -.64 + i * .403;
    const tick = box(frame, .028, i % 3 ? .066 : .10, .023, .55 * Math.sin(a), .55 * Math.cos(a), .063, i > 8 ? c.orange : c.cream, .008);
    tick.rotation.z = -a;
  }
  const pointer = group(frame, 0, 0, .078);
  box(pointer, .058, .574, .063, 0, .186, 0, c.orange, .016);
  roundZ(h, frame, .13, .13, 0, 0, .073, c.steel);
  roundZ(h, frame, .064, .149, 0, 0, .102, c.ink, 12);
  const slideX = -.39, hingeY = 1.382, hingeZ = -.318;
  const sluice = group(g, slideX, hingeY, hingeZ);
  const axle = h.cyl(g, .060, .060, 1.47, slideX, hingeY, hingeZ, c.steel, 16);
  axle.rotation.z = Math.PI / 2;
  // Both end brackets are on the fixed wall jambs; the slats rotate around the axle.
  for (const x of [-1.11, .32]) box(g, .104, .16, .19, x, hingeY, hingeZ, c.ink);
  for (let i = 0; i < 5; i++) box(sluice, .248, .099, 1.04, (i - 2) * .25, 0, .49, i === 2 ? c.orange : c.slate, .035);
  box(g, 1.06, .33, .094, 1.21, .43, 1.796, c.cream, .055);
  badge(g, 1.21, .43, 1.796 + .094 / 2, .45);
  box(g, .37, .133, .075, .29, .355, 1.787, c.slate, .025);
  const lens = box(g, .29, .052, .038, .29, .373, 1.83, glow(c.cyan), .014);
  const flow = Array.from({ length: 12 }, (_, i) => ball(g, i < 3 ? .080 : .091, 0, 0, 0, glow(i < 3 ? c.mint : c.cyan)));
  return instrument([pan, frame, sluice, ...flow], (t, v) => {
    const release = stage(.08, .79, v);
    pointer.rotation.z = mix(.95, -1.37, release) + (.012 + .035 * release) * Math.sin(t * 7);
    const slope = .10 + release * .61;
    sluice.rotation.x = slope;
    lens.scale.x = breathe(t, 2.55);
    flow.forEach((p, i) => {
      const regular = i < 3;
      const u = fraction(t * (regular ? .33 : .49) + (regular ? i / 3 : (i - 3) / 9));
      let x = mix(-2.25, 2.26, u), y = 1.483, z = regular ? -.72 : -.79 - (i % 4) * .12;
      if (!regular) {
        const laneX = slideX + ((i % 3) - 1) * .21;
        const top = .050 + .091;
        if (u < .40) {
          const align = stage(.14, .36, u);
          x = mix(-2.25, laneX, Math.min(1, u / .28));
          y = mix(1.494, hingeY + top * Math.cos(slope), align);
          z = mix(z, hingeZ + top * Math.sin(slope), align);
        } else {
          const d = Math.min(1, (u - .40) / .34);
          const land = stage(.74, .98, u);
          x = laneX;
          y = mix(hingeY + top * Math.cos(slope) - d * Math.sin(slope), .560, land);
          z = mix(hingeZ + top * Math.sin(slope) + d * Math.cos(slope), 1.31, land);
        }
      }
      p.position.set(x, y, z);
      const fade = Math.min(stage(0, .10, u), 1 - stage(.82, 1, u));
      p.scale.setScalar(Math.max(.001, fade * (regular ? 1 : release)));
    });
  });
}

function turnstile(h) {
  const { g, colors: c, group, box, rail, badge, glow, ball } = h;
  // Pedestrian gate: split threshold, reader pedestal, synchronized leaf hinges and overhead counter.
  box(g, 4.80, .20, 3.73, 0, .20, 0, c.ink, .11);
  const threshold = .405;
  box(g, 3.02, .11, 3.53, 0, threshold - .055, 0, c.slate, .08);
  for (const x of [-1.82, 1.82]) {
    box(g, .75, .13, 3.54, x, .335, 0, c.steel, .068);
    for (const z of [-1.45, 1.45]) {
      box(g, .38, .10, .39, x, .05, z, c.dark);
      bolt(h, g, x, .415, z);
    }
  }
  for (const x of [-.82, .82]) box(g, .047, .027, 3.22, x, .418, 0, c.cream, .01);
  for (const x of [-.69, -.48, -.27, .27, .48, .69]) box(g, .093, .025, 1.40, x, .414, .90, c.steel, .01);

  for (const x of [-1.54, 1.54]) {
    box(g, .62, .15, .80, x, .48, -.46, c.slate);
    box(g, .45, 2.02, .52, x, 1.55, -.46, c.cream, .085);
    box(g, .26, 1.07, .13, x, 1.28, -.17, c.slate);
    for (const z of [-.77, -.15]) bolt(h, g, x, .572, z, .047);
    for (let i = 0; i < 5; i++) box(g, .15, .035, .036, x, .88 + i * .114, -.091, c.ink, .011);
    for (const z of [-.98, .11]) box(g, .35, .12, .80, x, 2.47, z, c.cream, .048);
  }
  box(g, 3.58, .38, .68, 0, 2.71, -.49, c.slate, .09);
  box(g, 3.40, .13, .76, 0, 2.955, -.49, c.orange, .065);
  box(g, 1.00, .31, .12, 0, 2.72, -.105, c.cream, .049);
  badge(g, 0, 2.72, -.105 + .12 / 2, .48);
  for (const x of [-1.46, 1.46]) stud(h, g, x, 2.71, -.135);
  box(g, 2.50, .075, .24, 0, 2.498, -.46, c.ink, .030);
  const curtain = Array.from({ length: 7 }, (_, i) => box(g, .186, .029, .084, (i - 3) * .332, 2.445, -.45, glow(c.cyan), .012));
  const leaves = [-1, 1].map(side => {
    const x = 1.19 * side;
    const axisZ = -.46;
    h.cyl(g, .124, .124, 1.23, x, 1.055, axisZ, c.slate);
    h.cyl(g, .16, .16, .085, x, threshold + .041, axisZ, c.steel);
    for (const y of [.474, 1.65]) box(g, .42, .12, .23, 1.37 * side, y, axisZ, c.slate);
    h.cyl(g, .145, .145, .12, x, 1.65, axisZ, c.orange);
    const swing = group(g, x, 1.19, axisZ);
    for (const y of [-.244, .186]) {
      bushingY(h, swing, .163, .129, .105, 0, y, 0, c.ink);
      box(swing, .91, .075, .18, -.59 * side, y, 0, c.steel, .033);
    }
    box(swing, .88, .37, .105, -.58 * side, -.03, 0, c.orange, .073);
    box(swing, .65, .068, .039, -.57 * side, -.03, .064, c.cream, .023);
    return swing;
  });
  const reader = group(g, 1.56, 1.49, .67);
  box(g, .51, .14, .67, 1.56, .48, .69, c.slate);
  box(g, .26, .92, .32, 1.56, 1.00, .69, c.ink);
  rail(g, [[1.53, 1.59, .48], [1.53, 1.43, .28], [1.53, 1.43, -.20]], .035, c.ink);
  const face = group(reader);
  face.rotation.x = -.27;
  box(face, .58, .39, .34, 0, 0, 0, c.slate, .068);
  box(face, .45, .24, .036, 0, 0, .174, c.ink, .04);
  const signal = box(face, .21, .053, .026, 0, .020, .20, glow(c.mint), .016);
  for (const x of [-.178, .178]) stud(h, face, x, -.119, .179, .029);

  // A brass pass token on the threshold illustrates admission without depicting a person.
  const pass = group(g, 0, threshold + .035, 1.23);
  h.cyl(pass, .197, .197, .070, 0, 0, 0, c.amber, 24);
  h.cyl(pass, .145, .145, .029, 0, .046, 0, c.cream, 24);
  box(pass, .11, .023, .07, -.03, .067, 0, c.orange, .011);
  ball(pass, .034, .059, .070, 0, c.orange);

  return instrument([face, ...leaves, pass], (t, v) => {
    const checked = stage(.02, .40, v);
    const opened = stage(.23, .73, v);
    const across = stage(.72, 1, v);
    leaves.forEach((leaf, i) => { leaf.rotation.y = (i ? -1 : 1) * opened * 1.49; });
    signal.scale.x = mix(.29, 1, checked) * breathe(t, 3.0);
    curtain.forEach((light, i) => { light.scale.x = .45 + .54 * checked * (.75 + .25 * Math.cos(t * 3 - i * .72)); });
    pass.position.z = mix(1.23, -1.43, across);
    pass.rotation.y = across * 3.4 + Math.sin(t * 1.8) * .07;
  });
}

function access(h) {
  const { g, colors: c, group, box, cyl, rail, ring, ball, badge, glow } = h;
  // A cutaway padlock with an identity card, five requirements, a shear bar and a captive shackle.
  box(g, 4.79, .21, 2.78, 0, .23, 0, c.ink, .12);
  for (const x of [-1.87, 1.87]) for (const z of [-.99, 1.02]) {
    box(g, .38, .13, .36, x, .065, z, c.dark);
    bolt(h, g, x, .355, z);
  }
  box(g, 3.14, .14, 1.49, .39, .402, -.19, c.steel, .087);
  box(g, 2.81, 1.38, .74, .39, 1.16, -.36, c.slate, .112);
  box(g, 2.83, .21, .75, .39, 1.785, -.31, c.orange, .072);
  box(g, 2.83, .25, 1.08, .39, .67, -.10, c.orange, .069);
  box(g, 2.74, .98, .069, .39, 1.195, .035, c.ink);
  for (const x of [-.925, 1.753]) {
    box(g, x < 0 ? .21 : .15, 1.13, .69, x, 1.21, .090, c.cream, .066);
    stud(h, g, x, .86, .452);
    stud(h, g, x, 1.57, .452);
  }
  const shortX = -.27, captiveX = 1.51, socketZ = .237, seatTop = 2.04;
  for (const x of [shortX, captiveX]) {
    const length = x === captiveX ? .64 : .28;
    // Black boss with a recessed hardened insert; the shackle runs in the insert's bore.
    bushingY(h, g, .243, .19, length, x, seatTop - length / 2, socketZ, c.ink);
    bushingY(h, g, .187, .153, length - .012, x, seatTop - .012 - (length - .012) / 2, socketZ, c.steel);
    bolt(h, g, x + .21, 1.905, -.048, .043);
  }
  const pins = [];
  const heights = [-.117, .057, -.086, .125, -.041];
  for (let i = 0; i < heights.length; i++) {
    const x = -.49 + i * .40;
    box(g, .31, .86, .12, x, 1.237, .117, c.slate, .035);
    box(g, .195, .70, .055, x, 1.237, .191, c.dark, .027);
    for (const y of [.84, 1.63]) box(g, .24, .057, .11, x, y, .225, c.steel, .021);
    const slide = group(g, x, 1.263 + heights[i], .265);
    box(slide, .133, .407, .092, 0, 0, 0, c.cream, .029);
    box(slide, .183, .105, .114, 0, -.09, .01, c.lavender, .027);
    box(slide, .14, .048, .027, 0, -.09, .079, glow(c.mint), .014);
    pins.push(slide);
  }
  const shear = group(g, .39, 1.17, .416);
  // The face bar rides between open guide shoes, outside the individual pin tracks.
  for (const x of [-.603, 1.578]) {
    box(g, .08, .47, .07, x, 1.03, .335, c.ink);
    for (const y of [1.125, 1.215]) box(g, .106, .04, .135, x, y, .384, c.ink);
  }
  box(shear, 2.03, .045, .062, 0, 0, 0, c.steel, .017);
  box(shear, .19, .133, .109, 1.06, 0, 0, c.orange, .027);
  const shackleHome = seatTop - .055;
  const shackle = group(g, captiveX, shackleHome, socketZ);
  // Local pivot is the long end: it always remains captive in its seat.
  rail(shackle, [[-1.78, -.155, 0], [-1.78, .47, 0], [-1.66, .79, 0], [-1.25, 1.02, 0], [-.89, 1.05, 0], [-.53, 1.02, 0], [-.12, .79, 0], [0, .47, 0], [0, -.57, 0]], .142, c.steel);
  // Rounded hardened tips; the toe notch on the free leg locks against the shear bar.
  ball(shackle, .142, -1.78, -.155, 0, c.steel);
  ball(shackle, .142, 0, -.57, 0, c.steel);
  cyl(shackle, .118, .118, .05, -1.78, -.02, 0, c.dark);

  box(g, 1.07, .58, .96, -1.63, .64, -.03, c.slate, .072);
  box(g, 1.02, .095, .78, -1.62, .90, .11, c.ink);
  for (const z of [-.26, .48]) box(g, 1.00, .12, .092, -1.63, .961, z, c.steel, .027);
  const card = group(g, -1.75, .990, .11);
  box(card, .90, .086, .65, 0, 0, 0, c.lavender, .048);
  box(card, .53, .020, .28, .053, .050, .112, c.cream, .023);
  box(card, .108, .022, .21, -.30, .052, -.092, c.amber, .019);
  for (let i = 0; i < 4; i++) box(card, .032, .020, .101, -.009 + i * .089, .049, -.17, c.ink, .008);
  for (const x of [-2.02, -1.30]) stud(h, g, x, .71, .471);
  box(g, 1.0, .274, .088, .60, .680, .485, c.cream, .051);
  badge(g, .60, .680, .485 + .088 / 2, .42);
  const led = ring(g, .072, .021, 1.38, .680, .455, glow(c.mint));

  return instrument([card, shear, shackle, ...pins], (t, v) => {
    card.position.x = -1.75 + .21 * stage(.02, .40, v);
    pins.forEach((slide, i) => {
      const aligned = stage(.18 + i * .045, .57 + i * .045, v);
      slide.position.y = 1.263 + (1 - aligned) * (heights[i] + .009 * Math.sin(t * 2.1 + i * .85));
    });
    shear.position.x = .39 + .26 * stage(.64, .79, v);
    shackle.position.y = shackleHome + .27 * stage(.76, .91, v);
    shackle.rotation.y = .62 * stage(.92, 1, v);
    const pulse = mix(.58, 1, stage(.63, .83, v)) * breathe(t, 2.15);
    led.scale.setScalar(pulse);
  });
}

function tunnel(h) {
  const { THREE, g, colors: c, group, box, rail, ring, ball, badge, glow } = h;
  // A guarded, arched conduit between the large edge terminal and the small origin terminal.
  // The cutaway gap faces the camera, so the packets stay behind ribs but in plain view.
  for (const [x, w] of [[-1.66, 1.57], [1.65, 1.43]]) {
    box(g, w, .215, 2.49, x, .208, .10, c.ink, .105);
    for (const z of [-.82, 1.03]) {
      box(g, .40, .10, .32, x, .05, z, c.dark);
      bolt(h, g, x, .331, z);
    }
  }
  box(g, 3.46, .19, .50, 0, .215, -.58, c.slate, .057);
  const edge = box(g, 1.25, .94, 1.46, -1.69, .79, -.015, c.slate, .105);
  box(g, 1.30, .14, 1.55, -1.69, 1.29, -.015, c.orange, .060);
  box(g, 1.11, .45, .12, -1.69, .78, .765, c.cream, .064);
  badge(g, -1.69, .78, .765 + .12 / 2, .57);
  for (const x of [-2.145, -1.234]) stud(h, g, x, .794, .839, .037);
  const origin = box(g, 1.14, .69, 1.47, 1.68, .66, -.014, c.cream, .087);
  box(g, 1.17, .135, 1.47, 1.68, 1.055, -.014, c.slate, .055);
  box(g, .93, .31, .097, 1.68, .717, .751, c.ink, .046);
  for (let i = 0; i < 6; i++) box(g, .063, .130, .035, 1.37 + .122 * i, .70, .810, c.steel, .017);
  for (const x of [-1.69, 1.68]) {
    box(g, .64, .13, .54, x, .383, .935, c.slate);
    box(g, .50, .052, .135, x, .470, 1.055, c.dark, .021);
  }
  const path = new THREE.CatmullRomCurve3([
    [-1.69, 1.38, -.02], [-1.53, 1.97, -.02], [-.97, 2.53, -.02],
    [0, 2.77, -.02], [.98, 2.51, -.02], [1.51, 1.90, -.02], [1.68, 1.13, -.02]
  ].map(p => new THREE.Vector3(...p)));
  const sample = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const ptsAt = (angle, r) => Array.from({ length: 19 }, (_, i) => {
    const u = i / 18;
    path.getPointAt(u, sample);
    path.getTangentAt(u, tangent);
    return [sample.x - tangent.y * Math.cos(angle) * r,
      sample.y + tangent.x * Math.cos(angle) * r, sample.z + Math.sin(angle) * r];
  });
  for (const angle of [-.12, -.64, -1.23, -1.80, -2.44, -3.05]) {
    rail(g, ptsAt(angle, .313), .055, angle < -1 ? c.slate : c.steel);
  }
  for (const angle of [.19, Math.PI - .19]) rail(g, ptsAt(angle, .327), .052, c.orange);
  rail(g, ptsAt(-Math.PI / 2, .125), .045, c.ink);
  const bands = Array.from({ length: 13 }, (_, i) => {
    const u = i / 12;
    path.getPointAt(u, sample);
    path.getTangentAt(u, tangent);
    const pivot = group(g, sample.x, sample.y, sample.z);
    // Frame columns orient the ring plane perpendicular to the conduit tangent.
    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0);
    pivot.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(normal, new THREE.Vector3(0, 0, 1), tangent));
    const r = i === 0 || i === 12 ? .363 : .31;
    const band = ring(pivot, r, i === 0 || i === 12 ? .091 : .035, 0, 0, 0, i % 4 === 0 ? c.steel : c.slate);
    if (i % 2 === 0) {
      box(pivot, .099, .113, .145, r * .96, .063, 0, c.cream, .024);
      box(pivot, .099, .113, .145, -r * .96, .063, 0, c.cream, .024);
    }
    return band;
  });
  path.getPointAt(.5, sample);
  path.getTangentAt(.5, tangent);
  const normal = new THREE.Vector3(-tangent.y, tangent.x, 0);
  const sleeve = group(g, sample.x, sample.y, sample.z);
  sleeve.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(normal, new THREE.Vector3(0, 0, 1), tangent));
  ring(sleeve, .358, .076, 0, 0, -.135, c.ink);
  ring(sleeve, .358, .076, 0, 0, .135, c.ink);
  const jaws = [-1, 1].map(side => {
    // Rails run radially on both sides of each jaw; the jaws never ride free of the collar.
    for (const z of [-.119, .119]) box(sleeve, .26, .087, .062, side * .418, .10, z, c.steel, .018);
    const jaw = group(sleeve, side * .32, .10, 0);
    box(jaw, .13, .29, .199, 0, 0, 0, c.orange, .043);
    box(jaw, .09, .083, .14, 0, .15, 0, c.cream, .022);
    return jaw;
  });
  const lamp = box(g, .32, .057, .087, 1.68, .480, 1.055, glow(c.mint), .016);
  const data = Array.from({ length: 8 }, (_, i) => ball(g, i % 3 === 0 ? .102 : .071, 0, 0, 0, glow(i % 3 === 0 ? c.mint : c.cyan)));
  return instrument([edge, origin, ...bands, ...jaws], (t, v) => {
    const connected = stage(.11, .80, v);
    jaws.forEach((jaw, i) => {
      jaw.position.x = (i ? 1 : -1) * mix(.495, .337, connected);
    });
    lamp.scale.x = mix(.21, 1, connected) * breathe(t, 2.65);
    data.forEach((packet, i) => {
      const u = 1 - fraction(t * .29 + i / data.length);
      path.getPointAt(u, sample);
      packet.position.set(sample.x, sample.y, sample.z + .095);
      const fade = Math.min(stage(0, .10, u), 1 - stage(.90, 1, u));
      packet.scale.setScalar(Math.max(.001, connected * fade));
    });
  });
}

export default [
  { id: 'waf', name: 'WAF', object: 'Request inspection sorter', category: 'Protect',
    description: 'The web application firewall inspects HTTP requests against rules, blocking matches while letting other requests continue.',
    verb: 'Inspect requests', idle: 'Inspection on standby', active: 'Rule match diverted', build: waf },
  { id: 'ddos', name: 'DDoS', object: 'Flood-control spillway', category: 'Protect',
    description: 'DDoS protection detects attack floods and filters that traffic while keeping legitimate requests moving.',
    verb: 'Simulate a flood', idle: 'Normal traffic', active: 'Flood filtered', build: ddos },
  { id: 'turnstile', name: 'Turnstile', object: 'Visitor verification gate', category: 'Protect',
    description: 'Turnstile checks that a visitor is human, often without showing a puzzle. Your site verifies the resulting token before accepting the action.',
    verb: 'Check visitor', idle: 'Awaiting visitor', active: 'Visitor verified', build: turnstile },
  { id: 'access', name: 'Access', object: 'Identity policy lock', category: 'Protect',
    description: 'Access evaluates identity and context against policies before granting entry to a protected application.',
    verb: 'Evaluate access', idle: 'Application locked', active: 'Policy satisfied', build: access },
  { id: 'tunnel', name: 'Tunnel', object: 'Armored outbound conduit', category: 'Protect',
    description: 'A connector at your origin makes an outbound-only connection to Cloudflare, so the origin needs no public inbound port.',
    verb: 'Connect tunnel', idle: 'Connector offline', active: 'Outbound tunnel connected', build: tunnel }
];
