// Five independent bench instruments. Everything moving is a child of its own
// mechanism pivot; no per-frame geometry creation or shared mutable materials.
const TAU = 2 * Math.PI;
const clamp = x => Math.max(0, Math.min(1, x));
const phase = (v, a, b) => {const u=clamp((v-a)/(b-a));return u*u*(3-2*u);};
const mix = (a, b, t) => a + (b - a) * t;
const wave = (t, rate = 1) => .5 + .5 * Math.sin(t * rate);

function kit(h) {
  const { THREE, box, cyl, group, badge, colors: c } = h;
  const disc = (p, r, d, x, y, z, color, segments = 32) => {
    const m = cyl(p, r, r, d, x, y, z, color, segments);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  const stud = (p, x, y, z, r = .05) => cyl(p, r, r, .045, x, y, z, c.steel, 6);
  const bolt = (p, x, y, z, r = .058) => disc(p, r, .032, x, y, z, c.steel, 6);
  const rod = (p, a, b, r, color, segments = 16) => {
    const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const m = cyl(p, r, r, d.length(), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, color, segments);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    return m;
  };
  // An actual bore, rather than a second solid cylinder drawn over the shaft.
  const sleeve = (p, ri, ro, d, x, y, z, color) => {
    const m = cyl(p, ro, ro, d, x, y, z, color);
    const profile = [[ri,-d/2], [ro,-d/2], [ro,d/2], [ri,d/2], [ri,-d/2]];
    const segments = 32;
    m.geometry = new THREE.LatheGeometry(profile.map(([r,h]) => new THREE.Vector2(r,h)), segments);
    return m;
  };
  const discBadge = (face, thickness, width) => {
    // Cylinder +Y is the exposed cap; align badge-local +Z to that normal.
    const mount = group(face, 0, thickness / 2, 0);
    mount.rotation.x = -Math.PI / 2;
    return badge(mount, 0, 0, 0, width);
  };
  const bed = (p, w, d, color, z = 0) => {
    for (const x of [-w / 2 + .30, w / 2 - .30]) for (const q of [-d / 2 + .30, d / 2 - .30]) {
      cyl(p, .18, .22, .12, x, .06, z + q, c.ink, 16);
    }
    return box(p, w, .22, d, 0, .22, z, color, .095);
  };
  return { disc, discBadge, stud, bolt, rod, sleeve, bed };
}

export default [
  {
    id: 'dns', name: 'DNS', object: 'Rotary record index', category: 'Connect',
    description: 'Cloudflare’s authoritative DNS looks up records for a domain and returns answers, such as the IP address for a hostname.',
    verb: 'Resolve name', idle: 'Awaiting query', active: 'Address returned',
    build(h) {
      const { THREE, g, group, box, cyl, ball, rail, ring, glow, colors: c } = h;
      const { disc, discBadge, bolt, stud, rod, sleeve, bed } = kit(h);
      bed(g, 4.65, 2.95, c.slate, .06);
      // Fork, bearing and index drum. The ribs carry the record tabs.
      const x = -.54, y = 1.82, z = .34;
      const pedestal=box(g, 2.80, .20, 1.43, x, .43, .04, c.ink);
      for (const s of [-1, 1]) {
        const u = x + s * 1.06;
        box(g, .27, 1.55, .37, u, 1.22, -.33, c.steel);
        box(g, .49, .18, .69, u, .54, -.31, c.slate);
        for (const q of [-.52, -.10]) stud(g, u, .65, q);
      }
      box(g, 2.37, .36, .41, x, y, -.32, c.slate);
      disc(g, .46, .288, x, y, -.056, c.steel);  // .012 running space behind drum
      const bearing = sleeve(g, .173, .21, .56, x, y, .38, c.steel);
      bearing.rotation.x = Math.PI / 2;
      disc(g, .169, .60, x, y, .36, c.slate);
      const drum = group(g, x, y, z); const records=[];
      for (const [r,d,q,color] of [[1.12,.39,-.045,c.ink],[1.19,.07,.185,c.steel],[1.12,.10,.27,c.cream]]) {
        sleeve(drum, .216, r, d, 0, 0, q, color).rotation.x = Math.PI / 2;
      }
      ring(drum, .81, .018, 0, 0, .323, c.steel);
      for (let i = 0; i < 12; i++) {
        const tab = group(drum);
        tab.rotation.z = i * TAU / 12;
        records.push(box(tab, .42, .19, .088, .93, 0, .35, i === 9 ? c.orange : c.slate, .035));
        box(tab, i % 3 === 0 ? .18 : .10, .029, .015, .94, 0, .401, i === 9 ? c.cream : c.steel, .005);
        box(tab, .032, .14, .38, 1.119, 0, -.015, c.steel, .010);
      }
      disc(g, .201, .05, x, y, .685, c.slate);
      const hubFascia = disc(g, .208, .045, x, y, .7325, c.white);
      discBadge(hubFascia, .045, .30);
      // A lead screw advances the reader onto the selected record and lights the response lamp.
      const headMount = 1.53;
      box(g, .88, .20, .84, headMount, .43, .25, c.ink);
      box(g, .31, 1.64, .35, headMount, 1.33, -.04, c.steel);
      box(g, .30, .50, .50, 1.78, y, .66, c.slate);
      box(g, .30, .32, .275, 1.78, y, .2725, c.steel);
      box(g, .20, .32, .24, 1.53, y, .015, c.steel);
      const probe = group(g, headMount, y, .71);
      box(probe, .45, .23, .43, -.187, 0, .01, c.ink);
      for (const q of [-.178, .178]) {
        rod(g, [.92, y + q, .739], [1.63, y + q, .739], .039, c.steel, 16);
        sleeve(probe, .043, .075, .39, -.185, q, .029, c.slate).rotation.z = Math.PI / 2;
      }
      box(probe, .23, .147, .25, -.527, 0, -.01, c.orange);
      const tip=box(probe, .118, .118, .15, -.701, 0, -.02, c.steel, .026);
      bolt(probe, -.007, .01, .238);
      disc(probe, .076, .025, -.20, .01, .2375, c.slate);
      const reply = ball(probe, .073, -.20, .01, .250, glow(c.amber));
      const crank = group(g, 1.995, y, .70);
      cyl(crank, .17, .17, .13, 0, 0, 0, c.ink, 12).rotation.z = Math.PI / 2;
      box(crank, .067, .28, .063, .083, .069, 0, c.steel, .020);
      cyl(crank, .047, .047, .16, .141, .153, 0, c.orange, 12).rotation.z = Math.PI / 2;
      for (const dx of [-.25, .25]) for (const dz of [-.04, .54]) stud(g, headMount + dx, .55, dz);
      rail(g, [[headMount, .53, .22], [1.63, .37, -.12], [1.36, .37, -.79], [.45, .37, -.85], [.12, .48, -.675]], .045, c.ink);
      return { hits: [drum, probe, crank], update(t, v) {
        // Tab 9 lands on the positive-X reader after the index turn.
        drum.rotation.z = .5 * Math.PI * phase(v, .03, .62) + .016 * Math.sin(t * 1.7) * (1 - phase(v, 0, .7));
        probe.position.x = headMount - .102 * phase(v, .67, 1);
        crank.rotation.x = .08 * Math.sin(t * 1.65) * (1 - v) - 1.8 * Math.PI * phase(v, .67, 1);
        reply.scale.setScalar(.33 + .62 * phase(v, .87, 1) + .05 * wave(t, 2));
      }, measure(){
        const span=new THREE.Box3().setFromObject(drum,true), base=new THREE.Box3().setFromObject(pedestal,true);
        const tab=new THREE.Box3().setFromObject(records[9],true), readHead=new THREE.Box3().setFromObject(tip,true);
        const tests=[{name:'wheel-to-pedestal air gap',value:span.min.y-base.max.y,min:.085,max:.13},
          {name:'reader-to-wheel lateral clearance',value:readHead.min.x-span.max.x,min:.017}];
        if(probe.position.x<headMount-.10)tests.push({name:'selected record and reader axis registration',value:Math.abs((tab.min.y+tab.max.y-readHead.min.y-readHead.max.y)/2),max:.002});
        return tests;
      } };
    }
  },
  {
    id: 'cdn', name: 'CDN', object: 'Edge cache cabinet', category: 'Connect',
    description: 'When a requested file is already cached at the edge, Cloudflare can serve that copy without fetching it again from the origin.',
    verb: 'Request asset', idle: 'Cached copy ready', active: 'Served from edge',
    build(h) {
      const { g, group, box, ball, rail, badge, glow, colors: c } = h;
      const { bolt, stud, disc, bed } = kit(h);
      bed(g, 4.77, 3.83, c.slate, -.04);
      const x = -.72, z = -.63;
      const shell = group(g, x, .33, z);
      box(shell, 2.72, .20, 1.89, 0, .10, 0, c.ink);
      const fascia = box(shell, 2.73, .22, 1.90, 0, 2.31, 0, c.cream, .075);
      box(shell, 2.68, 2.23, .19, 0, 1.24, -.84, c.slate);
      for (const u of [-1.26, 1.26]) {
        box(shell, .22, 2.17, 1.89, u, 1.22, 0, c.steel);
        for (const k of [.31, 1.02, 1.73, 2.17]) bolt(shell, u, k, .958, .045);
      }
      for (const k of [.78, 1.47, 2.16]) box(shell, 2.33, .075, 1.67, 0, k, -.04, c.ink);
      // Fixed bays above and below, with matching rack ears and captive pull handles.
      for (const k of [.50, 1.85]) {
        box(shell, 2.26, .53, 1.55, 0, k, .02, c.slate);
        box(shell, 2.30, .45, .15, 0, k, .85, c.steel);
        box(shell, 1.40, .26, .033, .04, k, .943, c.ink);
        for (const u of [-.92, .90]) bolt(shell, u, k, .94, .048);
        for (const u of [-.28, .36]) box(shell, .088, .12, .12, u, k, .985, c.slate);
        box(shell, .73, .08, .082, .04, k, 1.04, c.cream);
      }
      const drawer = group(shell, 0, 1.12, 0);
      box(drawer, 2.16, .12, 1.55, 0, -.19, .02, c.steel);
      box(drawer, 2.27, .49, .16, 0, 0, .87, c.orange);
      box(drawer, 1.11, .26, .031, .13, 0, .963, c.ink);
      for (const u of [-.19, .45]) box(drawer, .085, .10, .14, u, 0, 1.00, c.slate);
      box(drawer, .72, .075, .085, .13, 0, 1.08, c.white);
      // A fixed lower ledge carries each moving runner, with an upper keeper.
      for (const side of [-1, 1]) {
        box(drawer, .117, .25, 1.48, side * 1.0085, -.03, .05, c.slate);
        box(drawer, .079, .066, 1.51, side * 1.1065, -.106, .045, c.steel, 0);
        for (const [y, k] of [[.963,.036],[1.077,.044]]) {
          box(shell, .084, k, 1.59, side * 1.112, y, .07, c.ink, 0);
        }
      }
      // Fixed standoffs carry the asset above the moving tray; only the tray slides.
      const copy = group(drawer, 0, .06, .13);
      for (const x of [-.49, .49]) box(copy, .14, .08, .17, x, -.15, .04, c.steel, .018);
      box(copy, 1.51, .22, .78, 0, 0, 0, c.cream);
      box(copy, 1.36, .043, .60, 0, .13, 0, c.white);
      for (const u of [-.43, -.12, .19, .50]) box(copy, .19, .014, .30, u, .158, 0, c.orange, .006);
      badge(fascia, 0, 0, .95, .29);
      for (const u of [-.84, .84]) stud(shell, u, 2.433, .45);
      // The adjoining origin cabinet stays dark; it is bypassed on this cache hit.
      const origin = group(g, 1.55, .33, -.54);
      box(origin, .98, .18, 1.26, 0, .09, 0, c.ink);
      box(origin, .87, 1.25, 1.06, 0, .77, 0, c.slate);
      box(origin, .93, .11, 1.12, 0, 1.41, 0, c.steel);
      box(origin, .63, .31, .04, 0, .98, .54, c.ink);
      for (let i = 0; i < 4; i++) box(origin, .57, .051, .036, 0, .42 + i * .082, .54, c.steel, .009);
      disc(origin, .059, .048, .19, .98, .579, c.ink, 12);
      rail(g, [[.65, .54, -.9], [.86, .45, -.91], [1.10, .56, -.88]], .06, c.ink);
      disc(drawer, .081, .022, -.80, .02, .961, c.ink);
      const lamp = ball(drawer, .063, -.80, .02, .972, glow(c.mint));
      return { hits: [shell, origin], update(t, v) {
        drawer.position.z = .69 * phase(v, 0, .8);
        lamp.scale.setScalar(.52 + .34 * phase(v, .52, 1) + .14 * wave(t, 2.2));
      } };
    }
  },
  {
    id: 'argo', name: 'Argo Smart Routing', object: 'Railway turnout', category: 'Connect',
    description: 'Argo uses network performance data to choose a faster path, even when that path is less direct.',
    verb: 'Find faster route', idle: 'Direct path congested', active: 'Faster path selected',
    build(h) {
      const { g, group, box, ball, badge, glow, THREE, colors: c } = h;
      const { bed, stud, rod, bolt, disc } = kit(h);
      bed(g, 5.14, 3.39, c.cream);
      const end = 2.25, gauge = .24, trackRadius = .035, wheelRadius = .064;
      // Both routes share level tangents at the ends. The bypass gains height
      // before its inner rail crosses the inner rail of the direct route.
      const route = (x, upper) => {
        const f = Math.sin(Math.PI * clamp((x + 1.91) / 3.82)) ** 2;
        return new THREE.Vector3(x, .73 + (upper ? .54 * f * (1.6 - .6 * f) : 0), .18 + (upper ? .98 : -.98) * f);
      };
      const drawTrack = (a, b, upper, lateral, color) => {
        const curve = new THREE.Curve();
        curve.getPoint = (t, target = new THREE.Vector3()) => {
          target.copy(route(mix(a, b, t), upper));
          target.z += lateral;
          return target;
        };
        const m = box(g, .28, .07, .07, 0, 0, 0, color);
        m.geometry = new THREE.TubeGeometry(curve, Math.ceil(34 * (b - a)), trackRadius, 12, false);
      };
      for (const q of [-gauge / 2, gauge / 2]) {
        drawTrack(-end, -1.91, false, q, c.steel);
        drawTrack(1.91, end, false, q, c.steel);
        drawTrack(-1.91, 1.91, false, q, c.slate);
        drawTrack(-1.91, 1.91, true, q, c.orange);
      }
      // Buffer stops close both open ends of the lower siding.
      for (const s of [-1, 1]) {
        const p = route(s * (end - .02), false);
        box(g, .12, .15, gauge + .17, s * (end + .01), p.y - trackRadius + .04, p.z, c.ink, .025);
        box(g, .035, .07, gauge + .05, s * (end - .065), p.y + .005, p.z, c.orange, .012);
      }
      for (const upper of [false, true]) for (const x of [-1.32, -.73, 0, .73, 1.32]) {
        const p = route(x, upper);
        const n = route(x + .001, upper).sub(route(x - .001, upper)).normalize();
        const y = p.y - trackRadius;
        const tie = box(g, .13, .086, .40, x, y - .043, p.z, upper ? c.amber : c.ink, .016);
        tie.rotation.z = Math.atan2(n.y, n.x);
        const footTop = .415, top = y - .086;
        box(g, .15, top - footTop, .19, x, (top + footTop) / 2, p.z, c.slate, .02);
        box(g, .26, .085, .31, x, .3725, p.z, c.steel);
        for (const q of [-.087, .087]) stud(g, x + q, .426, p.z + .096, .027);
      }
      for (const s of [-1, 1]) {
        const x = 2.11 * s;
        box(g, .55, .31, .56, x, .485, .18, c.ink);
        box(g, .49, .055, .50, x, .6675, .18, c.steel);
        box(g, .39, .24, .15, x, .487, .535, c.slate);
        for (const q of [-.139, .139]) bolt(g, x + q, .49, .622, .040);
      }
      // A signal bridge holds the queued packets on the direct line.
      for (const z of [-1.16, -.44]) {
        box(g, .15, 1.24, .14, .23, .95, z, c.slate);
        box(g, .26, .085, .27, .23, .38, z, c.steel);
      }
      box(g, .24, .25, .87, .23, 1.63, -.80, c.ink);
      box(g, .27, .50, .23, .23, 1.96, -.41, c.slate);
      box(g, .28, .08, .29, .23, 2.23, -.38, c.ink);
      const warning = ball(g, .073, .23, 2.055, -.27, glow(c.amber));
      ball(g, .055, .23, 1.895, -.276, c.ink);
      // Queued packets sit across both rails of the congested direct line, square to the track.
      for (const x of [-.91, -.54, -.18]) {
        const p = route(x, false), d = route(x + .001, false).sub(route(x - .001, false));
        const q = group(g, x, p.y + trackRadius, p.z);
        q.rotation.y = -Math.atan2(d.z, d.x);
        box(q, .29, .135, .32, 0, .0675, 0, c.slate);
        box(q, .16, .034, .16, .025, .152, 0, c.amber, .009);
      }
      const stand = group(g, -1.70, .33, -.79);
      box(stand, .33, .20, .27, 0, .10, 0, c.slate);
      const lever = group(stand, 0, .20, 0);
      rod(lever, [0, 0, 0], [0, .45, 0], .036, c.steel);
      box(lever, .13, .16, .15, 0, .44, 0, c.orange, .038);
      // A throw crank sits under the common tracks, not in the cart's envelope.
      const tongue = group(g, -1.91, .644, .18);
      disc(g, .064, .052, -1.91, .626, .18, c.steel).rotation.x = 0;
      box(g, .12, .27, .12, -1.91, .465, .18, c.slate, .02);
      rod(tongue, [0, 0, 0], [.39, 0, 0], .025, c.orange);
      const packet = group(g);
      box(packet, .39, .097, .305, 0, .174, 0, c.ink);
      box(packet, .29, .141, .21, 0, .293, 0, c.orange);
      box(packet, .21, .030, .13, 0, .3785, 0, c.cream, .012);
      const trucks = [-.135, .135].map(() => {
        const t = group(g);
        rod(t, [0, 0, -.146], [0, 0, .146], .023, c.steel);
        for (const q of [-gauge / 2, gauge / 2]) disc(t, wheelRadius, .060, 0, 0, q, c.ink);
        box(t, .117, .073, .12, 0, .034, 0, c.steel);
        return t;
      });
      const plate = box(g, 1.16, .26, .09, 0, .31, 1.69, c.slate);
      badge(plate, 0, 0, .045, .37);
      disc(g, .065, .020, .414, .324, 1.745, c.ink);
      const lamp = ball(g, .054, .414, .324, 1.751, glow(c.mint));
      return { hits: [packet, plate, lever, tongue], update(t, v) {
        const switchTo = phase(v, .01, .28);
        const p = phase(v, .22, 1);
        const x = mix(-2.103, 2.103, p);
        tongue.rotation.y = mix(.29, -.32, switchTo);
        lever.rotation.x = mix(-.56, .55, switchTo);
        const wheels = [-.135, .135].map((dx, i) => {
          const u = x + dx;
          const at = route(u, true);
          const pitch = route(u + .001, true).sub(route(u - .001, true));
          const angle = Math.atan2(pitch.y, pitch.x);
          at.x -= (trackRadius + wheelRadius) * Math.sin(angle);
          at.y += (trackRadius + wheelRadius) * Math.cos(angle);
          trucks[i].position.copy(at);
          return at;
        });
        const heading = wheels[1].clone().sub(wheels[0]);
        packet.position.copy(wheels[0]).lerp(wheels[1], .5);
        packet.position.y -= trackRadius + wheelRadius;
        packet.rotation.y = -Math.atan2(heading.z, heading.x);
        packet.rotation.z = Math.atan2(heading.y, Math.hypot(heading.x, heading.z));
        warning.scale.setScalar(.70 + .26 * wave(t, 2.8));
        lamp.scale.setScalar(.45 + .54 * switchTo);
      } };
    }
  },
  {
    id: 'load-balancing', name: 'Load Balancing', object: 'Twin-outlet flow manifold', category: 'Connect',
    description: 'Cloudflare can route requests across available origins and steer traffic away from an origin when health checks mark it unhealthy.',
    verb: 'Simulate outage', idle: 'Both origins healthy', active: 'Healthy origin selected',
    build(h) {
      const { THREE, g, group, box, ball, cyl, glow, colors: c } = h;
      const { disc, discBadge, rod, stud, bolt, sleeve } = kit(h);
      // Open frame (rather than another solid plinth) exposes the two outlet chambers.
      for (const s of [-1, 1]) {
        const x = s * 1.56;
        box(g, .65, .17, 2.91, x, .085, .02, c.slate, .07);
        for (const z of [-1.15, 1.18]) stud(g, x, .18, z);
        box(g, .48, .77, .40, x, .555, -.23, c.steel, .05);
        box(g, .75, .14, .64, x, 1.01, -.23, c.ink);
      }
      box(g, 3.71, .19, .48, 0, .31, -.23, c.ink);
      const y = 1.46, z = -.24;
      const center = group(g, 0, y, z);
      disc(center, .58, .55, 0, 0, 0, c.slate);
      disc(center, .53, .085, 0, 0, .3175, c.orange);
      const fascia = disc(center, .41, .074, 0, 0, .397, c.cream);
      for (let i = 0; i < 8; i++) {
        const a = i * TAU / 8;
        bolt(center, .473 * Math.cos(a), .473 * Math.sin(a), .376, .045);
      }
      discBadge(fascia, .074, .57);
      cyl(g, .165, .22, .435, 0, 2.2125, z, c.steel);
      cyl(g, .31, .31, .12, 0, 2.49, z, c.ink);
      cyl(g, .19, .19, .09, 0, 2.595, z, c.orange);
      box(g, 1.21, .44, .40, 0, .625, -.23, c.slate, .06);
      box(g, .90, .06, .46, 0, .875, -.23, c.ink);
      for (const s of [-1, 1]) {
        const tx = s * 1.72;
        // Both collars are face-joined with straight pipe; the elbow begins
        // beyond the second collar. Its last tangent is the outlet axis.
        for (const [a, b] of [[.553,.599],[.721,1.099]]) rod(g, [s*a,y,z], [s*b,y,z], .165, c.steel);
        for (const x of [.66, 1.16]) rod(g, [s * (x - .061), y, z], [s * (x + .061), y, z], .218, c.slate);
        const bend = new THREE.Curve();
        const bendRadius = 1.72 - 1.221;
        bend.getPoint = (t, out = new THREE.Vector3()) => {
          const theta = t * Math.PI / 2;
          return out.set(s * (1.221 + bendRadius * Math.sin(theta)),
            mix(y, 1.18, phase(t, 0, 1)), z + bendRadius * (1 - Math.cos(theta)));
        };
        const sweep = cyl(g, .165, .165, .4, 0, 0, 0, c.steel);
        sweep.geometry = new THREE.TubeGeometry(bend, 40, .165, 32, false);
        rod(g, [tx,1.18,z+bendRadius], [tx,1.18,.65], .165, c.steel, 32);
        disc(g, .228, .12, tx, 1.18, .71, c.ink);
        disc(g, .213, .10, tx, 1.18, .82, c.steel);
        box(g, .87, .60, .77, tx, 1.18, 1.255, c.slate, .075);
        box(g, .68, .39, .06, tx, 1.18, 1.67, c.ink);
        box(g, .89, .10, .81, tx, 1.53, 1.255, c.amber);
        for (const q of [-.261, .261]) bolt(g, tx + q, 1.18, 1.716, .04);
        box(g, .41, .64, .43, tx, .49, 1.24, c.slate);
        box(g, .34, .07, .35, tx, .845, 1.24, c.steel);
        box(g, .34, .13, .23, s * .91, 1.655, z, c.slate);
        sleeve(g, .063, .089, .078, s * .91, 1.759, z, c.steel);
      }
      // Two status apertures and valve handwheels. The right branch shuts on fault.
      const rightValve = group(g, .91, 2.06, z), leftValve = group(g, -.91, 2.06, z);
      for (const [i, handle] of [leftValve, rightValve].entries()) {
        cyl(handle, .060, .060, .231, 0, -.1855, 0, c.steel, 12);
        cyl(handle, .12, .12, .14, 0, 0, 0, c.slate, 12);
        box(handle, .62, .095, .118, 0, .049, 0, i ? c.orange : c.steel);
        for (const x of [-.28, .28]) ball(handle, .073, x, .048, 0, i ? c.orange : c.steel);
      }
      for (const x of [-1.72, 1.72]) disc(g, .128, .032, x, 1.18, 1.716, c.slate);
      disc(g, .083, .032, 1.93, 1.26, 1.716, c.slate);
      const left = ball(g, .114, -1.72, 1.18, 1.732, glow(c.mint));
      const right = ball(g, .114, 1.72, 1.18, 1.732, glow(c.mint));
      const fail = ball(g, .078, 1.93, 1.26, 1.732, glow(c.orange));
      // Observation slots on the output chambers indicate branch traffic.
      const bars = [-1, 1].map(s => Array.from({ length: 4 }, (_, i) =>
        box(g, .125, .04, .071, 1.72 * s + (i - 1.5) * .145, 1.074, 1.7355, glow(c.cyan), .01)));
      return { hits: [center, rightValve, leftValve], update(t, v) {
        const close = phase(v, .06, .72);
        rightValve.rotation.y = -.5 * Math.PI * close;
        leftValve.rotation.y = .11 * v;
        left.scale.setScalar(.78 + .15 * wave(t, 2.8) + .12 * v);
        right.scale.setScalar(.04 + (.87 + .09 * wave(t + .91, 2.8)) * (1 - close));
        fail.scale.setScalar(.04 + .95 * phase(v, .33, .78));
        for (const [j, branch] of bars.entries()) branch.forEach((m, i) => {
          const energy = j === 0 ? .55 + .45 * v : 1 - close;
          m.scale.y = .04 + energy * (.34 + .75 * wave(t - .65 * i + (j === 0 ? v * .45 : 0), 3.2));
        });
      } };
    }
  },
  {
    id: 'images', name: 'Cloudflare Images', object: 'Image repro press', category: 'Connect',
    description: 'Cloudflare Images can deliver cropped and resized variants from one source image, so each layout can request the dimensions it needs.',
    verb: 'Make variants', idle: 'Original loaded', active: 'Two sizes ready',
    build(h) {
      const { g, group, box, cyl, ball, rail, badge, glow, colors: c } = h;
      const { bed, disc, bolt, rod, stud, sleeve } = kit(h);
      bed(g, 5.48, 3.55, c.cream, .06);
      // A mounted print: mount, bezel, sky, sun with halo, extruded peaks with snow, a cloud and a foreground terrace.
      const artwork = (p, w, k) => {
        const T = h.THREE, iw = w * .86, ik = k * .8, s = Math.min(iw, ik) * .12;
        box(p, w, k, .09, 0, 0, 0, c.white, .035);
        box(p, iw, ik, .02, 0, 0, .05, c.cyan, .004);
        for (const sy of [-1, 1]) box(p, iw + .04, .02, .03, 0, sy * (ik / 2 + .01), .06, c.slate, .006);
        for (const sx of [-1, 1]) box(p, .02, ik, .03, sx * (iw / 2 + .01), 0, .06, c.slate, .006);
        disc(p, s * 1.45, .006, iw * .24, ik * .2, .063, c.mint, 28);
        disc(p, s, .012, iw * .24, ik * .2, .066, c.amber, 28);
        const peak = (cx, hw, ht, z, d, color) => {
          const base = -ik / 2 + ik * .16, sh = new T.Shape();
          sh.moveTo(cx - hw, base); sh.lineTo(cx + hw, base); sh.lineTo(cx, base + ht); sh.closePath();
          const m = box(p, .1, .1, .1, 0, 0, z, color);
          m.geometry = new T.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }).translate(0, 0, -d / 2);
          return base + ht;
        };
        const tip = peak(-iw * .13, iw * .3, ik * .58, .07, .012, c.orange);
        peak(iw * .2, iw * .25, ik * .42, .074, .012, c.amber);
        const cap = new T.Shape(), ch = ik * .17, cw = iw * .3 * (ch / (ik * .58));
        cap.moveTo(-iw * .13 - cw, tip - ch); cap.lineTo(-iw * .13 + cw, tip - ch); cap.lineTo(-iw * .13, tip); cap.closePath();
        const snow = box(p, .1, .1, .1, 0, 0, .079, c.white);
        snow.geometry = new T.ExtrudeGeometry(cap, { depth: .008, bevelEnabled: false }).translate(0, 0, -.004);
        for (const [dx, dy, r] of [[-.9, 0, .5], [-.35, .18, .62], [.2, .02, .46]]) {
          const puff = ball(p, s * r, iw * .02 + dx * s, ik * .27 + dy * s, .07, c.white);
          puff.scale.z = .25;
        }
        box(p, iw, ik * .17, .016, 0, -ik / 2 + ik * .085, .084, c.lavender, .006);
      };
      for (const x of [-1.17, 1.17]) {
        box(g, .61, .16, .88, x, .41, -.79, c.ink);
        box(g, .31, 2.125, .38, x, 1.5525, -.79, c.slate, .065);
        box(g, .42, .28, .52, x, 2.56, -.79, c.steel);
        for (const z of [-1.08, -.48]) stud(g, x, .50, z);
        cyl(g, .056, .056, .62, x, 2.19, -.51, c.amber, 16);
      }
      box(g, 2.77, .30, .61, 0, 2.61, -.79, c.ink);
      box(g, 2.63, .18, .59, 0, 2.81, -.79, c.orange);
      // The yoke ends at the cylinder face; two side ears leave a true bore.
      const drive = group(g, 0, 2.53, -.27);
      for (const x of [-.431, .431]) box(drive, .278, .36, .47, x, 0, 0, c.slate);
      box(drive, 1.14, .36, .065, 0, 0, -.244, c.slate);
      box(drive, 1.14, .36, .069, 0, 0, .2005, c.slate);
      sleeve(g, .143, .182, .873, 0, 2.6365, -.287, c.steel);
      for (const x of [-.242, .242]) box(g, .126, .18, .22, x, 2.53, -.287, c.ink);
      box(g, .51, .075, .12, 0, 2.2865, -.23 - .20, c.ink);
      const fascia = box(g, .85, .25, .045, 0, 2.55, -.015, c.white, .033);
      badge(fascia, 0, 0, .0225, .41);
      for (const x of [-.47, .47]) bolt(g, x, 2.55, .007);
      const piston = group(g, 0, 2.01, -.287);
      cyl(piston, .133, .133, .875, 0, .5425, 0, c.steel);
      cyl(piston, .34, .34, .25, 0, -.02, 0, c.ink, 24);
      cyl(piston, .289, .34, .14, 0, -.215, 0, c.steel, 24);
      cyl(piston, .24, .24, .088, 0, -.329, 0, c.orange, 24);
      cyl(piston, .17, .17, .032, 0, -.389, 0, c.slate, 24);
      const exposure = cyl(piston, .137, .137, .023, 0, -.414, 0, glow(c.amber), 24);
      box(g, 2.10, .32, 1.86, 0, .49, .14, c.ink, .076);
      box(g, 1.99, .12, 1.65, 0, .70, .12, c.slate);
      const original = group(g, 0, .805, -.10);
      original.rotation.x = -Math.PI / 2;
      artwork(original, 1.58, 1.07);
      for (const x of [-.89, .89]) for (const z of [-.59, .76]) stud(g, x, .7825, z);
      // The card outputs remain in their guide trays throughout the stroke.
      const cards = [];
      for (const [x, w, k] of [[-1.87, 1.25, .72], [1.64, .75, 1.04]]) {
        const tray = group(g, x, .46, .61);
        for (const z of [-.16, .74]) box(tray, w * .62, .065, .25, 0, -.0975, z, c.ink, .02);
        box(tray, w + .28, .13, 1.48, 0, 0, .329, c.steel);
        for (const side of [-1, 1]) {
          const cheek = side * (w / 2 + .082);
          box(tray, .10, .14, 1.378, cheek, .135, .278, c.slate);
          box(tray, .10, .204, .54, cheek, .237, -.14, c.ink);
        }
        box(tray, w + .25, .13, .54, 0, .404, -.14, c.slate);
        rod(tray, [-w / 2 - .032, .291, .105], [w / 2 + .032, .291, .105], .048, c.steel);
        box(tray, w + .22, .106, .10, 0, .118, 1.036, c.slate);
        for (const q of [-.37, .37]) if (Math.abs(q) < w / 2 + .13) stud(tray, q, .14, .95, .036);
        const card = group(tray, 0, .110, .10);
        card.rotation.x = -Math.PI / 2;
        artwork(card, w, k);
        cards.push(card);
      }
      rail(g, [[1.17, 2.70, -.99], [1.54, 2.41, -1.03], [1.55, 1.11, -1.03], [1.19, .51, -.98]], .045, c.ink);
      disc(g, .066, .020, .33, 2.55, .0175, c.slate);
      const status = ball(g, .057, .33, 2.55, .0275, glow(c.mint));
      return { hits: [drive, piston, original, ...cards], update(t, v) {
        const press = phase(v, .04, .44) * (1 - phase(v, .55, .87));
        piston.position.y = 2.01 - .64 * press;
        exposure.scale.setScalar(.46 + .54 * press);
        cards[0].position.z = .10 + .47 * phase(v, .56, .92);
        cards[1].position.z = .10 + .35 * phase(v, .65, 1);
        status.scale.setScalar(.56 + .30 * v + .14 * wave(t, 2.2));
      } };
    }
  }
];
