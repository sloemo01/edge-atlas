const TAU = Math.PI * 2;
const lerp = (a, b, u) => a + (b - a) * u;
const phase = (v, start, end) => {
  const u = Math.max(0, Math.min(1, (v - start) / (end - start)));
  return u * u * (3 - 2 * u);
};

// Shared workshop hardware; each figure owns all of its scene nodes.
function bench({g, box, cyl, colors: C}, w, d, deck = C.cream) {
  for (const x of [-w / 2 + .29, w / 2 - .29]) for (const z of [-d / 2 + .25, d / 2 - .25]) {
    cyl(g, .142, .165, .09, x, .045, z, C.dark, 16);
    cyl(g, .045, .045, .024, x, .336, z, C.slate, 6);
    box(g, .042, .008, .012, x, .349, z, C.steel);
  }
  box(g, w, .17, d, 0, .171, 0, C.ink, .07);
  box(g, w - .10, .075, d - .10, 0, .291, 0, deck, .055);
  box(g, w - .48, .043, .026, 0, .174, d / 2, C.slate);
}

function faceDisc(cyl, p, r, d, x, y, z, col, sides) {
  const node = cyl(p, r, r, d, x, y, z, col, sides);
  node.rotation.x = Math.PI / 2;
  return node;
}

export default [
  {id:'d1',name:'D1',object:'Punched-card Sorter',category:'Build',
    description:'D1 is Cloudflare’s managed SQL database. Pull the sorter’s lever to lift the cards whose marked field matches the illustrated query. The rest of the table stays put.',
    verb:'Run query',idle:'TABLE LOADED',active:'MATCHING ROWS LIFTED',docs:'/d1/',build(h){
      const {g, group, box, cyl, rail, badge, colors:C} = h;
      bench(h, 4.94, 2.76);
      const sorter = group(g, -.36, 0, -.27);
      box(sorter, 3.52, .1815, 1.46, 0, .41925, 0, C.slate);
      box(sorter, 3.60, .23, .30, 0, .54, .56, C.ink);
      box(sorter, 3.57, .055, .29, 0, .678, .56, C.steel);
      box(sorter, 3.40, .20, .25, 0, .60, -.58, C.orange);
      box(sorter, 3.47, .55, .16, 0, .91, -.65, C.slate);
      box(sorter, 3.51, .11, .23, 0, 1.24, -.65, C.ink);
      for (const x of [-1.70, 1.70]) {
        box(sorter, .16, .58, 1.35, x, .79, 0, C.cream);
        for (const z of [-.43, .38]) cyl(sorter,.044,.044,.025,x,1.09,z,C.slate,6);
      }
      const cards = [];
      for (let i = 0; i < 7; i++) {
        const x = (i - 3) * .438, matched = i === 1 || i === 4 || i === 6;
        box(sorter,.039,.10,.80,x-.209,.69,-.08,C.steel);
        box(sorter,.12,.17,.036,x,.536,.721,matched ? C.amber : C.steel);
        const card = group(sorter, x, .73, -.04);
        cards.push({card, matched});
        if (matched) {
          // Open U-guide: the .070 × .063 slide runs between cheeks, not inside a solid block.
          box(sorter,.153,.92,.055,x,.97,-.252,C.ink);
          for (const dx of [-.058,.058]) box(sorter,.035,.92,.105,x+dx,.97,-.189,C.ink);
          box(card,.070,.42,.063,0,0,-.147,C.steel);
          box(card,.065,.079,.102,0,.203,-.112,C.steel);
          box(card,.193,.079,.083,0,.203,-.053,C.amber);
        }
        box(card, .368, .73, .093, 0, .25, 0, C.cream, .035);
        box(card, .323, .124, .025, 0, .564, .051, matched ? C.amber : C.steel);
        for (let k=0;k<3;k++) {
          box(card, .084, .043, .014, -.096, .402-k*.134, .051, k===1 && matched ? C.orange : C.slate);
          box(card, k===2 ? .106 : .143, .024, .014, .071, .402-k*.134, .051, C.ink);
        }
      }
      const tower = group(g, 1.82, 0, -.30);
      box(tower, .74, .1935, .84, 0, .42525, 0, C.ink);
      box(tower, .66, .75, .63, 0, .864, 0, C.cream, .10);
      box(tower, .58, .28, .044, 0, .74, .329, C.ink);
      badge(tower, 0, .74, .351, .42);
      for (const x of [-.246, .246]) faceDisc(cyl,tower,.037,.025,x,1.10,.321,C.slate,6);
      faceDisc(cyl,tower,.187,.07,0,1.08,.334,C.slate);
      const lever = group(tower, 0, 1.08, .384);
      box(lever,.073,.93,.082,0,.385,0,C.steel);
      faceDisc(cyl,lever,.085,.13,0,0,0,C.ink,12);
      box(lever,.24,.20,.23,0,.89,.024,C.orange,.075);
      faceDisc(cyl,tower,.071,.071,-.24,.51,-.320,C.steel,12);
      faceDisc(cyl,sorter,.077,.075,1.30,.60,-.728,C.steel,12);
      rail(g,[[1.58,.51,-.655],[1.58,.51,-.83],[1.44,.48,-1.08],[1.09,.55,-1.16],[.94,.60,-1.036]],.042,C.dark);
      // A short front tray holds the spare cards, below the row being queried.
      box(g,1.02,.095,.55,-1.34,.378,.88,C.slate);
      for(let i=0;i<3;i++) box(g,.73,.024,.40,-1.35+i*.023,.4375+i*.024,.90-i*.028,C.cream);
      box(g,.74,.027,.083,-1.306,.5105,.736,C.amber);
      lever.rotation.z = .30;
      return {hits:[sorter,tower],update(_t,v){
        lever.rotation.z = lerp(.30,-.59,phase(v,0,.49));
        for(const [i,{card,matched}] of cards.entries()) {
          const lift = phase(v,.30+i*.019,.77+i*.022);
          card.position.y = .73 + (matched ? .70 : 0) * lift;
        }
      }};
    }},
  {id:'workers-kv',name:'Workers KV',object:'Keyed Mail Cabinet',category:'Build',
    description:'Workers KV reads a stored value by key. Turn this key to open one compartment in the cabinet; the other key–value pairs stay untouched.',
    verb:'Look up key',idle:'KEY READY',active:'VALUE FOUND',docs:'/kv/',build(h){
      const {g, group, box, cyl, ring, badge, colors:C} = h;
      bench(h,4.91,2.88,C.steel);
      const cabinet = group(g,-.44,0,-.43);
      box(cabinet,3.52,.1865,1.46,0,.42175,0,C.ink);
      box(cabinet,3.50,1.91,.16,0,1.46,-.63,C.slate);
      box(cabinet,3.59,.22,1.49,0,2.45,0,C.orange,.10);
      box(cabinet,3.42,.045,1.34,0,2.581,0,C.amber);
      for(const x of [-1.68,-.57,.55,1.68]) {
        box(cabinet,.14,1.86,1.41,x,1.43,.005,C.cream);
        for(const y of [.62,2.16]) faceDisc(cyl,cabinet,.036,.022,x,y,.723,C.slate,6);
      }
      for(const y of [.545,1.41,2.32]) box(cabinet,3.40,.105,1.39,0,y,.01,C.ink);
      let hatch;
      for(let row=0;row<2;row++) for(let col=0;col<3;col++) {
        const x=-1.125+col*1.12,y=.99+row*.86, selected=row===1&&col===2;
        const hinge=group(cabinet,x-.45,y,.776);
        if(selected) hatch=hinge;
        box(hinge,.90,.73,.104,.45,0,0,selected ? C.amber:C.slate,.07);
        box(hinge,.72,.43,.043,.47,.061,.0715,selected ? C.cream:C.steel);
        box(hinge,.288,.084,.057,.667,-.196,.086,C.ink);
        const markings=col+1+row;
        for(let k=0;k<markings;k++) box(hinge,.048,.113,.009,.29+k*.09,.067,.091,C.ink);
        for(const dy of [-.24,.24]) {
          box(cabinet,.145,.066,.080,x-.515,y+dy,.727,C.slate);
          cyl(cabinet,.048,.048,.053,x-.45,y+dy-.041,.776,C.slate,16);
          cyl(cabinet,.028,.028,.155,x-.45,y+dy,.776,C.steel,16);
          cyl(cabinet,.048,.048,.053,x-.45,y+dy+.041,.776,C.slate,16);
          cyl(hinge,.047,.047,.029,0,dy,0,C.steel,16);
        }
      }
      const packet=group(cabinet,1.105,1.535,.48);
      box(packet,.67,.17,.39,0,0,0,C.orange);
      box(packet,.42,.028,.33,0,.095,0,C.cream);
      box(packet,.16,.076,.017,.132,.011,.203,C.ink);
      // The key operates a frame-mounted latch, not a lock that rotates with the door.
      const post=group(g,1.76,0,-.06);
      box(post,.84,.1465,.93,0,.40175,0,C.ink);
      // Post column: the front slab carries a real keyway bore for the blade.
      const slab=new h.THREE.Shape();slab.moveTo(-.335,-.79);slab.lineTo(.335,-.79);slab.lineTo(.335,.79);slab.lineTo(-.335,.79);slab.closePath();
      const keyway=new h.THREE.Path();keyway.absarc(0,.54,.111,0,Math.PI*2,true);slab.holes.push(keyway);
      const front=box(post,.1,.1,.1,0,1.26,0,C.slate);
      front.geometry=new h.THREE.ExtrudeGeometry(slab,{depth:.25,bevelEnabled:false,curveSegments:28}).translate(0,0,.06);
      box(post,.67,1.58,.37,0,1.26,-.125,C.slate,.10);
      const liner=h.tube(post,.109,.098,.25,0,1.80,.185,C.dark,32);liner.rotation.x=Math.PI/2;
      faceDisc(cyl,post,.098,.01,0,1.80,.065,C.ink);
      box(post,.60,.24,.65,0,2.15,0,C.cream);
      box(post,.61,.24,.047,0,1.10,.328,C.cream);
      badge(post,0,1.10,.3515,.40);
      // Recessed keyway: the bow turns outside, while the bit stays in this open bore.
      ring(post,.137,.033,0,1.80,.354,C.steel);
      ring(post,.137,.033,0,1.80,.398,C.steel);
      // Key: an upright bow, shoulder collar and a bitted blade that slides into the keyway.
      const cut=[.035,.022,.045,.028,.04];
      const makeKey=(p,s)=>{
        const bow=ring(p,.15*s,.045*s,0,0,.215*s,C.orange);bow.rotation.y=Math.PI/2;
        box(p,.07*s,.15*s,.09*s,0,0,.035*s,C.orange,.02*s);
        box(p,.04*s,.08*s,.56*s,0,0,-.27*s,C.steel,.012*s);
        cut.forEach((d,i)=>box(p,.04*s,d*s,.075*s,0,(-.04-d/2+.004)*s,(-.17-i*.085)*s,C.steel,.006*s));
        box(p,.04*s,.05*s,.05*s,0,.012*s,-.57*s,C.steel,.01*s);
      };
      const key=group(post,0,1.80,1.02);
      makeKey(key,1);
      // Spare keys on a shallow, grooved bench rest.
      box(g,.94,.1285,.45,-1.22,.39275,.94,C.ink);
      for(const x of [-1.47,-.98]) {
        const spare=group(g,x,.457+.045*.45,.983);
        spare.rotation.z=Math.PI/2;
        makeKey(spare,.45);
      }
      return {hits:[cabinet,post],update(_t,v){
        key.position.z=lerp(1.02,.72,phase(v,0,.30));
        key.rotation.z=-Math.PI*.50*phase(v,.30,.56);
        hatch.rotation.y=-1.23*phase(v,.46,.94);
      }};
    }},
  {id:'workers-ai',name:'Workers AI',object:'Inference Print Bench',category:'Build',
    description:'Workers AI runs model inference on Cloudflare’s network. Feed the print bench one input to see a sample output develop. The picture is illustrative, not a live model response.',
    verb:'Run inference',idle:'INPUT READY',active:'SAMPLE OUTPUT DEVELOPED',docs:'/workers-ai/',build(h){
      const {g, group, box, cyl, rail, badge, colors:C} = h;
      bench(h,5.08,2.86);
      const press=group(g,-.43,0,-.24);
      box(press,1.69,.255,1.36,0,.456,-.59,C.ink);
      box(press,1.57,1.26,.38,0,1.05,-.91,C.slate,.08);
      for(const x of [-.62,.62]) {
        box(press,.17,.99,.20,x,1.05,-.68,C.cream);
        for(let i=0;i<4;i++) box(press,.084,.052,.032,x,.69+i*.16,-.569,C.ink);
      }
      box(press,.68,.29,.128,0,.91,-.65,C.dark);
      for(let i=0;i<4;i++) box(press,.055,.088,.022,-.205+i*.136,.91,-.574,C.amber);
      box(press,1.81,.16,1.80,0,1.67,-.14,C.ink);
      box(press,1.69,.43,1.65,0,1.91,-.14,C.cream,.11);
      box(press,1.56,.103,1.54,0,2.165,-.16,C.orange);
      box(press,.95,.218,.049,0,1.93,.699,C.ink);
      badge(press,0,1.93,.7235,.52);
      for(let i=0;i<5;i++) box(press,.13,.025,.30,-.48+i*.24,2.222,-.55,C.slate);
      const throat=cyl(press,.29,.27,.638,0,1.272,.66,C.slate);
      cyl(press,.269,.247,.107,0,.901,.66,C.ink);
      cyl(press,.198,.198,.020,0,.841,.66,C.amber);
      const bed=group(g,0,0,.42);
      box(bed,4.39,.13,1.07,-.02,.46,0,C.slate);
      for(const x of [-1.83,1.83]) box(bed,.29,.068,.80,x,.362,0,C.ink);
      for(const z of [-.46,.46]) {
        box(bed,4.22,.08,.089,-.02,.56,z,C.steel);
        for(const x of [-2.05,2.03]) box(bed,.15,.18,.19,x,.61,z,C.ink);
      }
      const shuttle=group(bed,-1.48,.669,0);
      box(shuttle,.97,.141,.94,0,0,0,C.ink);
      box(shuttle,.84,.035,.71,0,.087,-.035,C.steel);
      box(shuttle,.69,.039,.58,.011,.112,-.027,C.cream);
      const dots=[];
      const image=['0010100','0111110','1111111','1011101','1111111','0111110'];
      for(let z=0;z<image.length;z++) for(let x=0;x<image[z].length;x++) if(image[z][x]==='1') {
        const tile=box(shuttle,.079,.018,.069,(x-3)*.084+.011,.134,(z-2.5)*.074-.027,C.cream,0);
        // Clone before interpolating its diffuse colour; h's materials are shared.
        tile.material=tile.material.clone();
        dots.push({tile,row:z});
      }
      const developed=throat.material.color.clone().setHex(C.cyan);
      const blank=throat.material.color.clone().setHex(C.cream);
      box(shuttle,.30,.115,.20,0,.039,.479,C.orange,.043);
      const console=group(g,1.47,0,-.73);
      box(console,1.07,.1485,.81,0,.40275,0,C.ink);
      box(console,.92,.40,.65,0,.67,0,C.slate,.08);
      box(console,.67,.025,.25,-.035,.888,-.087,C.ink);
      for(let i=0;i<4;i++) box(console,.072,.041,.084,-.263+i*.147,.91,-.090,C.steel);
      const indicator=box(console,.072,.040,.084,.031,.933,-.090,C.amber);
      faceDisc(cyl,console,.108,.14,.27,.676,.379,C.orange,16);
      box(console,.15,.143,.18,-.482,.52,-.29,C.ink);
      const socket=cyl(press,.072,.072,.072,.849,.49,-.90,C.steel,12);
      socket.rotation.z=Math.PI/2;
      rail(g,[[.913,.52,-1.02],[.82,.52,-1.02],[.65,.49,-1.12],[.44,.49,-1.14],[.453,.49,-1.14]],.044,C.ink);
      return {hits:[press,shuttle,console],update(t,v){
        const enter=phase(v,.02,.39), leave=phase(v,.59,.99);
        shuttle.position.x=lerp(-1.48,-.43,enter)+1.83*leave;
        for(const {tile,row} of dots) {
          const develop=phase(v,.42+row*.038,.65+row*.039);
          tile.material.color.copy(blank).lerp(developed,develop);
        }
        indicator.scale.y=.96+.04*Math.sin(t*2.25);
      }};
    }},
  {id:'vectorize',name:'Vectorize',object:'Similarity Compass',category:'Build',
    description:'Vectorize searches indexed embeddings for nearby matches. Swing this compass toward a sample query bearing to see which indexed point best aligns. The dial illustrates similarity, not a specific index algorithm.',
    verb:'Find nearest match',idle:'INDEX POINTS READY',active:'NEAREST POINT ALIGNED',docs:'/vectorize/',build(h){
      const {g, group, box, cyl, ring, rail, ball, badge, colors:C} = h;
      bench(h,4.92,2.94,C.steel);
      const compass=group(g,-.59,0,-.04);
      cyl(compass,1.27,1.32,.1515,0,.40425,0,C.ink,64);
      cyl(compass,1.23,1.26,.13,0,.544,0,C.orange,64);
      cyl(compass,1.18,1.21,.09,0,.645,0,C.cream,64);
      const edge=ring(compass,1.114,.023,0,.696,0,C.slate);
      edge.rotation.x=Math.PI/2;
      for(let i=0;i<32;i++) {
        const a=TAU*i/32, major=i%4===0;
        const tick=box(compass,.021,.012,major?.14:.079,Math.sin(a)*1.084,.695,Math.cos(a)*1.084,major?C.ink:C.slate);
        tick.rotation.y=a;
      }
      for(const r of [.48,.78]) {
        const groove=ring(compass,r,.008,0,.691,0,C.steel);
        groove.rotation.x=Math.PI/2;
      }
      const bearings=[-1.04,-.50,.08,.65,1.18,2.48,-2.56];
      const stations=bearings.map((a,i)=>{
        // Candidates at a common radius keep the angular analogy unambiguous.
        const x=Math.sin(a)*.913,z=Math.cos(a)*.913;
        cyl(compass,.071,.085,.035,x,.708,z,C.slate,12);
        return ball(compass,.043,x,.752,z,i===3?C.orange:C.steel);
      });
      cyl(compass,.18,.22,.102,0,.741,0,C.ink);
      cyl(compass,.116,.14,.049,0,.807,0,C.steel);
      const needle=group(compass,0,.866,0);
      box(needle,.117,.069,.95,0,0,.30,C.cyan,.034);
      box(needle,.09,.048,.41,0,.044,-.29,C.slate);
      const point=cyl(needle,.008,.112,.226,0,0,.78,C.cyan,4);
      point.rotation.x=Math.PI/2; point.rotation.y=Math.PI/4;
      cyl(needle,.119,.113,.084,0,.052,0,C.orange);
      const selector=group(g,1.61,0,.36);
      box(selector,1.04,.1465,1.22,0,.40175,0,C.ink);
      box(selector,.94,.43,1.08,0,.665,0,C.cream,.09);
      box(selector,.82,.25,.039,0,.67,.553,C.ink);
      badge(selector,0,.67,.5725,.55);
      const dial=group(selector,0,0,-.05);
      cyl(dial,.24,.265,.064,0,.902,0,C.slate);
      const knob=group(dial,0,.964,0);
      cyl(knob,.188,.205,.11,0,0,0,C.orange,16);
      box(knob,.031,.023,.112,0,.058,.088,C.cream);
      for(let i=0;i<12;i++) {
        const a=TAU*i/12;
        cyl(dial,.016,.016,.014,Math.sin(a)*.235,.939,Math.cos(a)*.235,C.steel,8);
      }
      faceDisc(cyl,selector,.086,.11,-.14,.54,-.55,C.slate,12);
      const lug=box(g,.17,.121,.21,.367,.395,-.79,C.slate);
      lug.rotation.y=-.61;
      rail(g,[[1.47,.54,-.247],[1.47,.415,-.57],[1.30,.394,-.88],[.75,.395,-.99],[.44,.395,-.84]],.045,C.ink);
      needle.rotation.y=-1.66;
      return {hits:[compass,selector],update(_t,v){
        const aim=phase(v,.065,.9);
        needle.rotation.y=lerp(-1.66,bearings[3],aim);
        knob.rotation.y=needle.rotation.y;
        const mark=phase(v,.76,.96);
        stations[3].scale.setScalar(1+.30*mark);
        stations[3].position.y=.752+.011*mark;
      }};
    }},
  {id:'hyperdrive',name:'Hyperdrive',object:'Connection Manifold',category:'Build',
    description:'Hyperdrive pools connections to an existing database so Workers can reuse them. Open the three request ports to see them share a bank of already-open connections.',
    verb:'Route requests',idle:'POOL READY',active:'REQUESTS REUSING CONNECTIONS',docs:'/hyperdrive/',build(h){
      const {g, group, box, cyl, rail, ring, ball, badge, colors:C} = h;
      bench(h,5.10,2.88);
      const bank=group(g,-1.43,0,-.39);
      box(bank,1.46,.1435,1.37,0,.40025,0,C.ink);
      // Two fixed barrels make it a pool rather than one shared connection.
      for(const x of [-.38,.38]) {
        cyl(bank,.31,.33,.16,x,.54,0,C.slate);
        cyl(bank,.273,.273,.96,x,1.10,0,C.cream,36);
        for(const y of [.70,1.43]) cyl(bank,.299,.299,.092,x,y,0,C.ink,36);
        cyl(bank,.232,.273,.114,x,1.633,0,C.orange);
        cyl(bank,.11,.118,.097,x,1.734,0,C.steel,12);
        cyl(bank,.072,.072,.051,x,1.803,0,C.amber,12);
      }
      const plate=group(bank,0,1.05,.273);
      box(plate,1.13,.45,.092,0,0,0,C.ink);
      badge(plate,0,0,.046,.74);
      for(const x of [-.485,.485]) for(const y of [-.144,.144]) faceDisc(cyl,plate,.031,.025,x,y,.051,C.steel,6);
      const manifold=group(g,.73,0,-.36);
      box(manifold,2.82,.1575,1.10,0,.40725,0,C.ink);
      box(manifold,2.62,.65,.61,0,.824,0,C.slate,.09);
      box(manifold,2.52,.123,.56,0,1.211,0,C.orange);
      for(const x of [-1.15,1.15]) for(const z of [-.206,.206]) cyl(manifold,.047,.047,.027,x,1.284,z,C.ink,6);
      // Rear branches join the long bar at separate sockets; their bends are spaced apart.
      for(const [i,x] of [-1.81,-1.05].entries()) {
        const outlet=.12+i*.63, z=-.82-i*.25, y=1.30+i*.28;
        const socketZ=-.290;
        faceDisc(cyl,bank,.091,.080,x+1.43,y,socketZ,C.slate,12);
        faceDisc(cyl,g,.095,.080,outlet,.92,-.696,C.ink,12);
        rail(g,[[x,y,-.718],[x,y,z-.08],[x+.20,y,z-.14],[outlet-.20,y,z-.14],[outlet,y-.14,z-.12],[outlet,.92,z-.04],[outlet,.92,-.734]],.051,C.steel);
      }
      const valves=[];
      for(let i=0;i<3;i++) {
        const x=(i-1)*.80;
        faceDisc(cyl,manifold,.223,.078,x,.90,.330,C.cream,24);
        ring(manifold,.126,.050,x,.90,.390,C.ink);
        ring(manifold,.109,.031,x,.90,.439,C.ink);
        const stem=group(manifold,x,.90,.558);
        faceDisc(cyl,stem,.059,.240,0,0,-.014,C.steel,12);
        faceDisc(cyl,stem,.124,.09,0,0,.105,C.amber,16);
        faceDisc(cyl,stem,.072,.088,0,0,.117,C.orange,12);
        const tab=box(stem,.14,.036,.082,0,0,.17,C.ink);
        const gauge=cyl(manifold,.108,.108,.053,x,1.30,0,C.ink,16);
        const lens=ball(manifold,.069,x,1.342,0,C.mint);
        valves.push({stem,lens});
      }
      // A small front connector block offers the three request-side inputs.
      const block=group(g,.84,0,.95);
      box(block,2.50,.1355,.57,0,.39625,0,C.ink);
      box(block,2.36,.22,.47,0,.567,0,C.cream);
      for(let i=0;i<3;i++) {
        const x=(i-1)*.80-.11;
        faceDisc(cyl,block,.096,.035,x,.56,.241,C.slate,12);
        faceDisc(cyl,block,.056,.034,x,.56,.260,C.ink,12);
        faceDisc(cyl,block,.076,.089,x,.561,-.257,C.slate,12);
        faceDisc(cyl,manifold,.070,.083,x+.11,.623,.329,C.ink,12);
        rail(g,[[x+.84,.561,.651],[x+.84,.561,.49],[x+.84,.596,.26],[x+.84,.623,.007]],.049,C.ink);
      }
      return {hits:[manifold,bank,block],update(t,v){
        for(const [i,{stem,lens}] of valves.entries()) {
          const open=phase(v,i*.13,.63+i*.13);
          stem.position.z=.558-.047*open;
          stem.rotation.z=-1.19*open;
          lens.scale.setScalar(.89+.15*open+.025*Math.sin(t*2.4+i));
        }
      }};
    }},
];
