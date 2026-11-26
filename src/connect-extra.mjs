export default [
  {
    id:'spectrum', name:'Spectrum', object:'Armoured Signal Gate', category:'Connect', docs:'spectrum',
    description:'Spectrum proxies TCP and UDP traffic through Cloudflare, shielding the origin from direct exposure. Send the two sample signals through an armoured gate to the protected receiver.',
    verb:'Relay signals', idle:'TWO SIGNALS AT INTAKE', active:'SIGNALS RELAYED TO ORIGIN',
    build(h) {
      const {g,group,box,cyl,ring,ball,badge,glow,colors:C}=h;
      const gate=group(g), endcaps=[], signals=[];
      const axle=(p,r,d,x,y,z,c,n)=>{const m=cyl(p,r,r,d,x,y,z,c,n);m.rotation.z=Math.PI/2;return m;};
      const gasket=(p,r,d,x,y,z,c)=>{const m=ring(p,r,d,x,y,z,c);m.rotation.y=Math.PI/2;return m;};
      box(g,4.94,.23,2.82,0,.115,0,C.ink,.10);
      box(g,4.76,.09,2.66,0,.275,0,C.steel,.035);
      for(const x of [-2.21,2.21])for(const z of [-1.14,1.14])cyl(g,.063,.067,.032,x,.333,z,C.ink,6);
      box(gate,1.50,.17,1.82,0,.405,-.13,C.slate);
      // Three armour bands and four cheeks form two real, straight 0.29 × 0.29 bores.
      const portZ=.19, bore=.145, levels=[.94,1.47];
      const armour=(ya,yb,za,zb)=>box(gate,1.25,yb-ya,zb-za,0,(ya+yb)/2,(za+zb)/2,C.ink,0);
      let floor=.49;
      for(const y of levels){
        armour(floor,y-bore,-.87,.63);
        armour(y-bore,y+bore,-.87,portZ-bore);
        armour(y-bore,y+bore,portZ+bore,.63);
        floor=y+bore;
      }
      armour(floor,1.805,-.87,.63);
      box(gate,1.33,.19,1.58,0,1.90,-.12,C.orange,.065);
      box(gate,.84,.54,.075,0,1.31,.6675,C.cream);
      badge(gate,0,1.31,.705,.62);
      for(const x of [-.35,.35])for(const y of [1.105,1.515]){
        const screw=cyl(gate,.029,.029,.026,x,y,.696,C.slate,6);screw.rotation.x=Math.PI/2;
      }
      for(const x of [-.48,.48]){
        box(gate,.085,1.02,.09,x,1.06,.652,C.slate);
        for(let j=0;j<5;j++)box(gate,.07,.025,.04,x,.60+.135*j,-.89,C.steel);
      }
      for(const [i,y] of levels.entries()){
        const z=portZ, color=i?C.cyan:C.amber;
        for(const s of [-1,1]){
          gasket(gate,.195,.048,s*.656,y,z,C.slate);
          gasket(gate,.188,.042,s*.719,y,z,C.steel);
          gasket(gate,.169,.018,s*.771,y,z,color);
          for(const q of [-1,1])axle(gate,.032,.042,s*.682,y,z+q*.207,C.ink,6);
          for(const q of [-1,1]){
            box(g,1.025,.048,.032,s*1.1375,y-.119,z+q*.055,C.steel,0);
            // Below each guide, an insulated post reaches the deck without crossing the other level.
            const postH=levels[0]-.143-.32, px=s*1.23;
            if(i===0)box(g,.072,postH,.032,px,.32+postH/2,z+q*.055,C.slate,0);
            else {
              box(g,.072,.482,.033,px,y-.432,z+q*.183,C.slate,0);
              box(g,.072,.048,.128,px,y-.167,z+q*.119,C.ink,0);
              box(g,.072,postH,.033,px,.32+postH/2,z+q*.183,C.slate,0);
            }
          }
        }
        const packet=group(g,-1.52,y,z);
        axle(packet,.100,.26,0,0,0,C.cream,12);
        axle(packet,.102,.065,-.037,0,0,glow(color),12);
        axle(packet,.071,.045,.145,0,0,C.slate,12);
        signals.push(packet);
      }
      for(const x of [-1.83,1.83]){
        const terminal=group(g,x,0,.19);
        box(terminal,.51,.11,.92,0,.375,0,C.ink);
        box(terminal,.36,1.20,.53,0,1.03,0,C.slate,.06);
        box(terminal,.40,.12,.73,0,1.69,0,C.cream);
        for(const y of levels)gasket(terminal,.157,.028,-Math.sign(x)*.195,y,0,C.ink);
        for(let i=0;i<3;i++)box(terminal,.19,.028,.025,0,.69+i*.09,.2775,C.steel);
        cyl(terminal,.077,.077,.037,0,1.7685,.234,C.ink,12);
        endcaps.push(ball(terminal,.056,0,1.809,.234,glow(x<0?C.amber:C.cyan)));
      }
      return {hits:[gate],update(t,v) {
        signals[0].position.x=-1.52+3.0025*v;
        const w=v*v*(3-2*v);
        signals[1].position.x=-1.52+3.0025*w;
        for(const [i,lamp] of endcaps.entries())lamp.scale.setScalar(1+.055*Math.sin(2*t+i)+.29*(i?v:1-v));
      }};
    }
  },
  {
    id:'smart-placement', name:'Smart Placement', object:'Travelling Workbench', category:'Connect', docs:'workers/configuration/placement',
    description:'Smart Placement uses measured request duration to decide where to run a Worker. Move this workbench from the request intake toward the database it calls repeatedly and watch those trips get shorter.',
    verb:'Move workbench', idle:'WORKER NEAR REQUEST INTAKE', active:'WORKER NEAR BACK END',
    build(h) {
      const {g,group,box,cyl,badge,glow,colors:C}=h;
      box(g,5.02,.19,2.86,0,.095,0,C.ink,.095);
      box(g,4.89,.10,2.70,0,.24,0,C.cream,.04);
      for(const x of [-2.22,2.22])for(const z of [-1.15,1.15])cyl(g,.062,.069,.037,x,.31,z,C.slate,6);
      for(const z of [-.57,.51]) {
        box(g,3.75,.16,.21,-.09,.365,z,C.slate);
        box(g,3.76,.061,.091,-.09,.468,z,C.steel);
        for(let i=0;i<8;i++)cyl(g,.037,.037,.036,-1.80+.48*i,.456,z+.076,C.ink,6);
      }
      for(const x of [-1.89,1.49])box(g,.16,.07,1.30,x,.325,-.03,C.ink);
      box(g,3.34,.028,.24,-.18,.304,.995,C.slate);
      for(let i=0;i<15;i++) {
        const d=i%4===0?.157:.085;
        box(g,.023,.019,d,-1.77+i*.226,.328,1.102-d/2,C.steel);
      }
      const intake=group(g,-1.91,.29,-1.035);
      box(intake,.63,.12,.63,0,.06,0,C.slate);
      box(intake,.50,.59,.51,0,.415,0,C.ink);
      box(intake,.49,.15,.12,0,.48,.315,C.steel);
      box(intake,.35,.065,.04,0,.48,.395,C.dark);
      box(intake,.33,.066,.20,0,.743,0,glow(C.cyan));
      const bench=group(g,-1.33,.468+.061/2+.106,-.03);
      box(bench,.85,.14,1.25,0,.194,0,C.orange);
      const wheels=[];
      for(const x of [-.31,.31])for(const sign of [-1,1]){
        const z=sign*.54, axle=group(bench,x,0,z);
        cyl(axle,.106,.106,.12,0,0,0,C.ink).rotation.x=Math.PI/2;
        cyl(axle,.045,.045,.232,0,0,-sign*.043,C.steel,8).rotation.x=Math.PI/2;
        wheels.push(axle);
        // A journal hangs from the carriage on the inside of each wheel, clear of the track.
        box(bench,.103,.150,.092,x,.049,sign*.430,C.slate,0);
      }
      box(bench,.66,.57,.75,0,.549,0,C.cream,.075);
      box(bench,.60,.28,.04,0,.586,.395,C.ink);
      badge(bench,0,.586,.415,.50);
      for(let i=0;i<5;i++)box(bench,.061,.041,.32,-.22+i*.11,.8545,-.078,C.steel);
      box(bench,.067,.029,.30,0,.180,.775,glow(C.orange));
      box(bench,.055,.409,.052,0,-.039,.72,C.slate,0);
      box(bench,.048,.022,.238,0,-.2325,.839,C.ink,0);
      const database=group(g,1.94,.29,-.16);
      box(database,.73,.20,1.12,0,.10,0,C.ink);
      for(let i=0;i<3;i++){
        cyl(database,.34,.34,.177,0,.2885+i*.22,0,C.steel,32);
        cyl(database,.355,.355,.043,0,.3985+i*.22,0,C.slate,32);
      }
      cyl(database,.32,.32,.066,0,.893,0,C.cream,32);
      box(database,.31,.085,.10,0,.2425,.46,C.slate);
      box(database,.48,.60,.075,0,.5875,.43,C.ink);
      for(let i=0;i<3;i++)box(database,.20,.062,.025,0,.43+i*.16,.48,C.steel);
      const dbLed=box(database,.089,.043,.037,.096,.746,.486,glow(C.amber));
      // Ruler-mounted indicator shows the span of repeated backend calls.
      const span=box(g,1,.020,.066,0,.328,.915,glow(C.orange));
      return {hits:[bench,intake,database],update(t,v){
        const x=-1.33+2.34*v;
        bench.position.x=x;
        for(const wheel of wheels)wheel.rotation.z=-(x+1.33)/.106;
        span.scale.x=1.49-x;
        span.position.x=(1.49+x)/2;
        dbLed.scale.x=1+.11*Math.sin(t*2.8)+.27*v;
      }};
    }
  },
  {
    id:'1-1-1-1', name:'1.1.1.1', object:'Address Embosser', category:'Connect', docs:'1.1.1.1',
    description:'1.1.1.1 is Cloudflare’s public recursive DNS resolver. Feed the press a sample name card to reveal the address a device can use to reach that host.',
    verb:'Resolve name', idle:'SAMPLE NAME CARD LOADED', active:'SAMPLE IP ADDRESS RETURNED',
    build(h) {
      const {g,group,box,cyl,ball,badge,glow,colors:C}=h;
      const press=group(g,-.36,0,-.27);
      const ease=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
      box(g,4.88,.23,2.86,0,.115,0,C.ink,.105);
      box(g,4.71,.08,2.71,0,.27,0,C.steel);
      for(const x of [-2.18,2.18])for(const z of [-1.17,1.17])cyl(g,.067,.070,.035,x,.328,z,C.ink,6);
      box(press,2.03,.23,1.94,0,.425,.20,C.slate,.07);
      box(press,1.90,.095,1.80,0,.587,.25,C.cream);
      for(const x of [-.77,.77]) {
        box(press,.39,.08,.57,x,.6745,-.54,C.steel);
        box(press,.34,1.0705,.42,x,1.24975,-.54,C.ink);
        box(press,.072,1.03,.08,x,1.2295,-.29,C.steel);
        for(let i=0;i<5;i++)box(press,.13,.044,.026,x,.91+.171*i,-.26,C.slate);
      }
      box(press,2.0,.41,.76,0,1.99,-.41,C.orange,.08);
      box(press,1.21,.32,.87,0,1.967,.405,C.ink,.06);
      box(press,.83,.27,.029,0,1.967,.8545,C.cream);
      badge(press,0,1.967,.869,.51);
      cyl(press,.27,.27,.18,0,1.717,.36,C.steel);
      cyl(press,.18,.18,.078,0,1.588,.36,C.ink);
      const stamping=group(press,0,1.152,.36);
      const ram=cyl(stamping,.111,.111,1,0,0,0,C.steel);
      cyl(stamping,.196,.196,.09,0,.032,0,C.slate);
      box(stamping,1.44,.145,.66,0,-.073,0,C.ink);
      box(stamping,1.35,.075,.59,0,-.174,0,C.orange);
      const lever=group(press,.68,1.97,.23);
      const pin=cyl(press,.152,.152,.15,.68,1.97,.23,C.slate);pin.rotation.z=Math.PI/2;
      box(lever,.095,.105,.55,0,0,.416,C.steel);
      ball(lever,.107,0,0,.782,C.orange);
      for(const x of [-.8,.8])box(press,.085,.061,1.41,x,.665,.555,C.slate);
      box(press,1.71,.083,.212,0,.593,1.256,C.steel);
      for(const x of [-.73,.73])cyl(press,.027,.027,.032,x,.6505,1.309,C.ink,6);
      const card=group(press,0,.6525,1.045);
      box(card,1.42,.036,.50,0,0,0,C.white,.025);
      // One face: a name printed as four rule marks; the example reply, 192.0.2.1, is embossed in-place.
      const name=group(card,0,.018,0);
      for(const [i,w] of [.63,.52,.70].entries())box(name,w,.016,.026,-.42+w/2,.008,-.11+i*.102,C.slate);
      const addr=group(card,-.551,.018,-.015);
      const map={0:'abcfed',1:'bc',2:'abged',9:'abfgcd'};
      for(const [i,s] of [...'192.0.2.1'].entries()){
        const x=i*.127;
        if(s==='.')box(addr,.029,.014,.029,x-.024,.007,.083,C.orange);
        else {
          const segments={a:[0,-.091],b:[.043,-.047],c:[.043,.047],d:[0,.091],e:[-.043,.047],f:[-.043,-.047],g:[0,0]};
          for(const k of map[s]){
            const [xx,z]=segments[k],wide='adg'.includes(k);
            box(addr,wide?.071:.020,.014,wide?.020:.075,x+xx,.007,z,C.orange);
          }
        }
      }
      const stock=group(g,1.52,.31,-.14);
      box(stock,.82,.12,1.12,0,.06,0,C.slate);
      for(const x of [-.384,.384])box(stock,.067,.24,1.11,x,.22,0,C.ink);
      box(stock,.79,.31,.072,0,.21,-.525,C.ink);
      for(let i=0;i<4;i++)box(stock,.65,.028,.89,0,.134+i*.028,.04-.015*i,C.cream,.014);
      const ink=cyl(g,.206,.22,.23,1.68,.425,1.00,C.ink);
      cyl(g,.217,.217,.058,1.68,.563,1.00,C.orange);
      for(let i=0;i<10;i++){
        const a=i*Math.PI/5;
        const lug=box(g,.027,.048,.024,1.68+.216*Math.cos(a),.567,1+.216*Math.sin(a),C.amber);
        lug.rotation.y=-a;
      }
      return {hits:[press,ink],update(t,v){
        const feed=ease(0,.34,v), eject=ease(.69,1,v);
        const down=ease(.26,.53,v)-ease(.58,.79,v);
        card.position.z=1.045-.685*feed+.705*eject;
        stamping.position.y=1.152-.256*down;
        const reach=1.549-stamping.position.y;
        ram.scale.y=reach-.077;
        ram.position.y=(reach+.077)/2;
        lever.rotation.x=.46*down;
        const impression=ease(.49,.56,v);
        name.scale.y=Math.max(.001,1-impression);
        name.visible=impression<.999;
        addr.scale.y=Math.max(.001,impression);
        addr.visible=impression>.001;
      }};
    }
  },
  {
    id:'magic-wan', name:'Magic WAN (Cloudflare WAN)', object:'Branch Cableway', category:'Connect', docs:'cloudflare-wan',
    description:'Cloudflare WAN, formerly Magic WAN, links offices, data centers, and cloud networks through Cloudflare’s global network. Send a carrier from a branch office through the cable junction toward another site.',
    verb:'Connect sites', idle:'BRANCH CARRIER DOCKED', active:'CARRIER AT DESTINATION',
    build(h) {
      const {g,group,box,cyl,ring,ball,rail,badge,glow,colors:C}=h;
      const y=1.70, cableR=.040, hubZ=-.29, dock=.10, transferR=.270;
      box(g,5.05,.20,2.94,0,.10,0,C.ink,.105);
      box(g,4.89,.10,2.80,0,.25,0,C.cream,.045);
      for(const x of [-2.31,2.31])for(const z of [-1.23,1.23])cyl(g,.043,.056,.034,x,.317,z,C.slate,6);
      const hub=group(g,0,0,hubZ);
      box(hub,1.12,.15,.99,0,.375,0,C.slate);
      for(const x of [-.31,.31]){
        box(hub,.24,.07,.38,x,.485,0,C.steel);
        box(hub,.17,.465,.28,x,.7525,0,C.ink);
        box(hub,.08,.42,.06,x,.76,.17,C.steel);
      }
      box(hub,.83,.42,.58,0,1.195,0,C.cream);
      box(hub,.68,.28,.033,0,1.195,.3065,C.ink);
      badge(hub,0,1.195,.323,.54);
      cyl(hub,.37,.37,.095,0,1.4525,0,C.slate);
      cyl(hub,.259,.282,.066,0,1.533,0,C.steel);
      ring(hub,.233,.018,0,1.566,0,C.orange).rotation.x=Math.PI/2;
      const wheel=group(hub,0,0,0);
      cyl(wheel,.13,.13,.042,0,1.587,0,C.ink);
      box(wheel,.42,.031,.095,0,1.6235,0,C.ink,0);
      box(wheel,.065,.021,.082,0,1.6495,0,C.steel,0);
      rail(wheel,[[-transferR,y,0],[transferR,y,0]],cableR,C.steel);
      const sites=[[-1.88,.46],[1.79,.62],[1.30,-1.00]];
      const docks=[];
      for(const [i,[x,z]] of sites.entries()){
        const p=group(g,x,0,z);
        const w=i===2?.76:.84, low=i===0?.73:.82, roof=.410+low+.082;
        box(p,w+.14,.11,.68,0,.355,0,C.steel);
        box(p,w,low,.59,0,.410+low/2,0,i===0?C.cream:C.slate,.055);
        box(p,w+.06,.082,.62,0,roof-.041,0,i===1?C.orange:C.ink);
        for(let j=0;j<4;j++){
          box(p,.11,.12,.022,-.27+j*.18,.626,.306,C.ink);
          box(p,.105,.105,.023,-.27+j*.18,.835,.3065,i===0?C.cyan:C.steel);
        }
        box(p,.27,.05,.116,0,.442,.353,C.slate);
        cyl(p,.072,.072,.04,0,roof+.02,.225,C.ink,12);
        ball(p,.052,0,roof+.073,.225,glow(i===0?C.orange:C.cyan));
        const dx=-x,dz=hubZ-z,span=Math.hypot(dx,dz),ux=dx/span,uz=dz/span;
        const a=[x+ux*dock,y,z+uz*dock],b=[-ux*(transferR+.008),y,hubZ-uz*(transferR+.008)];
        const az=Math.atan2(-uz,ux);
        docks.push({a,az});
        rail(g,[a,b],cableR,C.slate);
        // A dock pylon and a deck bracket reach the underside of the same cable axis.
        const pylon=group(g,a[0],0,a[2]);pylon.rotation.y=az;
        box(pylon,.20,.047,.19,0,roof+.0235,0,C.steel);
        box(pylon,.11,1.613-roof,.14,0,(roof+1.707)/2,0,C.ink,0);
        const bracket=group(hub,-ux*.333,0,-uz*.333);bracket.rotation.y=az;
        box(bracket,.11,.160,.097,0,1.58,0,C.steel,0);
      }
      const pod=group(g,docks[0].a[0],0,docks[0].a[2]);
      const skidY=y+cableR;
      box(pod,.27,.045,.109,0,skidY+.0225,0,C.ink,0);
      box(pod,.33,.115,.22,0,skidY+.1025,0,C.orange);
      box(pod,.20,.047,.20,-.011,skidY+.1835,0,C.cream);
      const beacon=ball(pod,.043,-.026,skidY+.236,0,glow(C.amber));
      const ease=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
      return {hits:[hub,pod],update(t,v){
        const approach=ease(0,.46,v), depart=ease(.54,1,v), turn=ease(.46,.54,v);
        const from=docks[0], to=docks[1];
        pod.position.x=from.a[0]*(1-approach)+to.a[0]*depart;
        pod.position.z=hubZ+(from.a[2]-hubZ)*(1-approach)+(to.a[2]-hubZ)*depart;
        // The reversible bridge and the captive carrier swivel together only at the junction.
        pod.rotation.y=wheel.rotation.y=from.az+(-Math.PI+to.az-from.az)*turn;
        beacon.scale.setScalar(.94+.065*Math.sin(t*2.6));
      }};
    }
  },
  {
    id:'health-checks', name:'Health Checks', object:'Origin Test Bench', category:'Connect', docs:'health-checks',
    description:'Health Checks probes an origin and can notify you when its health changes. In this example, the simulated origin fails a probe, the gauge falls, and a warning flag rises.',
    verb:'Simulate a failed check', idle:'ORIGIN RESPONDED', active:'ORIGIN CHECK FAILED · ALERT',
    build(h) {
      const {g,group,box,cyl,ring,ball,rail,badge,glow,colors:C}=h;
      const dial=group(g,-.95,1.51,-.24);
      const disc=(p,r,d,x,y,z,c,n)=>{const m=cyl(p,r,r,d,x,y,z,c,n);m.rotation.x=Math.PI/2;return m;};
      const ease=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
      box(g,4.85,.23,2.86,0,.115,0,C.ink,.095);
      box(g,4.66,.086,2.69,0,.271,0,C.cream);
      for(const x of [-2.16,2.16])for(const z of [-1.16,1.16])cyl(g,.06,.065,.034,x,.331,z,C.slate,6);
      box(g,1.42,.16,1.45,-.95,.394,-.27,C.slate);
      box(g,.61,.08,.39,-.95,.514,-.63,C.steel);
      box(g,.55,.99,.34,-.95,1.049,-.63,C.ink);
      box(g,.46,.30,.06,-.95,1.395,-.43,C.steel);
      disc(dial,.923,.32,0,0,0,C.ink,48);
      disc(dial,.858,.11,0,0,.215,C.steel,48);
      disc(dial,.746,.054,0,0,.297,C.cream,48);
      ring(dial,.786,.026,0,0,.296,C.slate);
      for(let i=0;i<15;i++) {
        const a=-2.12+i*.303,l=i%2===0?.108:.058, r=.69-l/2;
        const tick=box(dial,.035,l,.013,r*Math.sin(a),r*Math.cos(a),.3305,i<4?C.lavender:i>10?C.cyan:C.slate,0);
        tick.rotation.z=-a;
      }
      const needle=group(dial,0,0,.37);
      disc(dial,.113,.027,0,0,.3375,C.slate,24);
      box(needle,.072,.56,.038,0,.239,0,C.orange);
      box(needle,.155,.185,.038,0,-.1335,0,C.ink);
      disc(dial,.059,.035,0,0,.4065,C.steel,12);
      badge(dial,0,-.47,.324,.47);
      const origin=group(g,1.28,.314,.16);
      box(origin,1.32,.12,1.33,0,.06,0,C.slate);
      box(origin,1.15,.64,.95,0,.44,-.02,C.ink,.065);
      box(origin,1.09,.095,.89,0,.8075,-.02,C.steel);
      box(origin,.90,.35,.036,0,.43,.473,C.slate);
      for(let i=0;i<5;i++)box(origin,.079,.092,.018,-.335+i*.144,.424,.500,C.ink);
      const response=box(origin,.223,.075,.033,-.27,.266,.5075,glow(C.cyan));
      for(const x of [-.43,.43])for(const z of [-.305,.265])cyl(origin,.046,.046,.026,x,.868,z,C.ink,6);
      // Four fixed walls form an open ram well instead of a stack of solid discs.
      const ramZ=-.095, recess=.152;
      for(const sign of [-1,1]){
        box(origin,.088,.093,.48,sign*.196,.9015,ramZ,C.ink,0);
        box(origin,2*recess,.093,.088,0,.9015,ramZ+sign*.196,C.ink,0);
      }
      ring(origin,.189,.040,0,.988,ramZ,C.orange).rotation.x=Math.PI/2;
      const plunger=group(origin,0,1.124,ramZ);
      cyl(plunger,.139,.139,.30,0,0,0,C.steel);
      cyl(plunger,.158,.158,.036,0,.168,0,C.steel);
      // Flag mast behind the endpoint; the flag rolls up out of its housing.
      const mast=group(g,1.48,0,-.88);
      box(mast,.51,.14,.49,0,.384,0,C.slate);
      cyl(mast,.085,.085,1.324,0,1.116,0,C.steel);
      box(mast,.37,.448,.20,.29,.678,0,C.ink);
      box(mast,.51,.041,.227,.329,.9225,0,C.slate);
      for(const z of [-.081,.081]){
        box(mast,.51,.26,.065,.329,1.073,z,C.ink,0);
        box(mast,.52,.046,.070,.329,1.226,z,C.slate,0);
      }
      cyl(mast,.111,.111,.089,0,1.8225,0,C.ink);
      ball(mast,.063,0,1.902,0,C.orange);
      const flag=group(mast,0,1.249,0);
      box(flag,.49,.29,.075,.321,.145,0,C.lavender,.026);
      box(flag,.049,.139,.023,.321,.183,.049,C.white);
      box(flag,.05,.05,.023,.321,.070,.049,C.white);
      const cableR=.033;
      const line=[[1.28,.55,.797],[1.28,.55,.91],[1.15,.46,1.045],[.89,.38,1.064],[.58,.38,1.064],[-.46,.38,1.064],[-.72,.39,1.047],[-.94,.51,.91],[-.95,.55,.68],[-.95,.55,.455]];
      rail(g,line,cableR,C.slate);
      for(const x of [-.35,.18,.53])box(g,.079,.033,.14,x,.3305,1.064,C.steel,0);
      box(g,.22,.12,.147,1.28,.55,.7235,C.steel);
      box(g,.24,.137,.12,-.95,.5425,.395,C.steel);
      const button=group(g,-1.74,0,.84);
      box(button,.65,.13,.58,0,.379,0,C.slate);
      ring(button,.211,.042,0,.486,0,C.ink).rotation.x=Math.PI/2;
      const actuator=cyl(button,.167,.167,.164,0,.609,0,C.orange);
      return {hits:[dial,origin,button],update(t,v){
        const probe=ease(.04,.30,v)-ease(.66,.87,v), failed=ease(.33,.77,v);
        actuator.position.y=.609-.058*probe;
        plunger.position.y=1.124-.118*probe;
        needle.rotation.z=-1.66+3.32*failed+.031*Math.sin(t*2.9)*(1-failed);
        flag.scale.y=Math.max(.001,ease(.55,.94,v));
        flag.visible=flag.scale.y>.001;
        response.scale.x=1-.78*failed;
      }};
    }
  }
];
