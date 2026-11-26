export default [
 {id:'workers',name:'Workers',object:'Edge Workshop',category:'Build',description:'Workers run application code on Cloudflare’s network. Here, a little compute head drops onto the board to run a request beside the point where it arrived.',verb:'Run request',idle:'COMPUTE HEAD READY',active:'REQUEST EXECUTED AT EDGE',build(h){
  const {THREE,g,group,box,cyl,rail,badge,glow,colors:C}=h;
  box(g,4.65,.25,2.86,0,.13,0,C.ink,.10);box(g,4.51,.09,2.73,0,.30,0,0x225950);box(g,1.82,.13,1.57,0,.39,.04,C.slate);
  for(let i=0;i<8;i++){const z=-.58+i*.17;for(const s of [-1,1]){box(g,.38,.045,.064,s*.94,.36,z,C.amber);rail(g,[[s*1.1,.35,z],[s*1.56,.35,z],[s*1.73,.35,z*.79]],.012,0x78a48b);}}
  box(g,1.35,.11,1.13,0,.49,.04,C.ink);const die=box(g,.60,.035,.56,0,.56,.04,glow(C.mint));
  const guideZ=-.73, guideTop=2.09, guideBottom=.45, dieZ=.04, headZ=dieZ-guideZ;
  const posts=[-.93,.93];for(const x of posts){box(g,.59,.19,.61,x,.39,-.89,C.steel);cyl(g,.14,.17,1.69,x,1.33,-1.01,C.slate);cyl(g,.070,.070,guideTop-guideBottom,x,(guideTop+guideBottom)/2,guideZ,C.steel);cyl(g,.108,.108,.10,x,.49,guideZ,C.dark);cyl(g,.108,.108,.10,x,2.05,guideZ,C.dark);}
  box(g,2.38,.28,.71,0,2.19,-.95,C.ink);box(g,1.92,.12,.58,0,2.39,-.95,C.orange);
  const head=group(g,0,1.77,guideZ);const bridge=box(head,1.65,.29,.28,0,.008,0,C.slate);
  // A closed annular profile leaves a real, 0.008-unit radial running clearance.
  const sleeve=(x,y,outer,height)=>{const r=.078,d=height/2;const profile=[[r,-d],[outer,-d],[outer,d],[r,d],[r,-d]].map(([a,b])=>new THREE.Vector2(a,b));const m=new THREE.Mesh(new THREE.LatheGeometry(profile,40),bridge.material);m.position.set(x,y,0);m.castShadow=m.receiveShadow=true;head.add(m);};
  for(const x of posts){sleeve(x,0,.136,.29);sleeve(x,.142,.138,.044);}
  box(head,.56,.23,.45,0,-.04,.18,C.slate);
  box(head,1.20,.44,1.10,0,-.04,headZ,C.cream,.080);const punch=box(head,.72,.13,.62,0,-.3125,headZ,C.ink);badge(head,0,-.04,headZ+.55,.70);
  for(let i=0;i<6;i++)box(head,.085,.10,.64,-.37+i*.145,.20,headZ,i===2?C.orange:C.steel);
  for(const x of [-1.83,1.83]){box(g,.49,.32,1.45,x,.49,.08,C.ink);for(let i=0;i<5;i++){box(g,.33,.05,.11,x,.67,-.44+i*.24,i===3?glow(C.orange):C.steel);}}
  for(const x of [-1.91,1.91])box(g,.51,.16,.32,x,.42,1.05,C.cream);
  rail(g,[[-1.56,.36,.70],[1.56,.36,.70]],.030,C.steel);
  for(const x of [-1.56,1.56])box(g,.16,.12,.25,x,.381,.70,C.slate);
  const signal=box(g,.16,.11,.16,-1.52,.437,.70,glow(C.cyan));
  return {hits:[head],update(t,v){head.position.y=1.77-v*.815;signal.position.x=-1.50+3*v;signal.scale.y=.9+.09*Math.sin(t*2)+v*.13;},measure(){const a=new THREE.Box3().setFromObject(punch),b=new THREE.Box3().setFromObject(die);return [{name:'press clearance',value:a.min.y-b.max.y,min:.000,max:.82},{name:'press/die centerline Z',value:Math.abs((a.min.z+a.max.z-b.min.z-b.max.z)/2),max:.0001}];}};
 }},
 {id:'durable-objects',name:'Durable Objects',object:'State Flywheel',category:'Build',description:'A Durable Object gives clients a shared point of coordination with its own persistent state. The two terminals here both point to the same indexed flywheel.',verb:'Commit state',idle:'SHARED STATE • 01',active:'SHARED STATE • 02',build(h){
  const {g,group,box,cyl,ring,rail,ball,badge,glow,colors:C}=h;
  box(g,4.8,.22,2.66,0,.12,0,C.ink,.11);box(g,4.65,.10,2.50,0,.28,0,C.cream);
  box(g,1.8,.24,1.38,0,.45,-.24,C.slate);box(g,.40,1.20,.57,0,1.06,-.75,C.slate);const support=cyl(g,.23,.23,.46,0,1.62,-.63,C.steel);support.rotation.x=Math.PI/2;
  const hub=group(g,0,1.62,-.31);const disc=(p,r,d,z,c)=>{const m=cyl(p,r,r,d,0,0,z,c);m.rotation.x=Math.PI/2;return m;};
  disc(hub,1.035,.30,0,C.ink);disc(hub,.94,.14,.16,C.orange);disc(hub,.80,.08,.27,C.slate);ring(hub,.72,.038,0,0,.32,C.amber);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const b=box(hub,.14,.16,.073,Math.sin(a)*.87,Math.cos(a)*.87,.24,i%3?C.cream:glow(C.amber));b.rotation.z=-a;box(hub,.15,.14,.082,Math.sin(a)*.57,Math.cos(a)*.57,.35,i===0?glow(C.cyan):C.steel);}
  disc(hub,.38,.11,.35,C.ink);badge(hub,0,0,.405,.57);box(g,.16,.17,.118,0,2.75,-.12,glow(C.cyan));rail(g,[[0,.45,-.92],[0,2.77,-.92],[0,2.75,-.14]],.049,C.slate);
  const lights=[];for(const x of [-1.62,1.62]){box(g,1,.20,1.03,x,.42,.58,C.steel);box(g,.83,.40,.82,x,.69,.49,C.ink);box(g,.69,.12,.58,x,.94,.48,C.cyan);for(let j=0;j<4;j++)box(g,.07,.028,.29,x-.23+j*.15,1.01,.49,C.slate);lights.push(ball(g,.071,x,.72,.922,glow(C.mint)));rail(g,[[x,.46,.09],[x,.43,-.53],[x*.52,.43,-.55]],.064,C.orange);const boot=cyl(g,.098,.098,.06,Math.sign(x)*.915,.43,-.55,C.ink,16);boot.rotation.z=Math.PI/2;}
  return {hits:[hub],update(t,v){hub.rotation.z=-v*Math.PI/6;for(const [i,m] of lights.entries())m.scale.setScalar(.87+.12*Math.sin(t*3+i)+.24*v);}};
 }},
 {id:'queues',name:'Queues',object:'Dispatch Conveyor',category:'Build',description:'Queues buffer messages until a consumer is ready to process them. Start the belt to carry the waiting parcels toward a separate processing chute.',verb:'Start dispatch',idle:'MESSAGES BUFFERED',active:'CONSUMER DRAINING QUEUE',build(h){
  const {THREE,g,group,box,cyl,rail,badge,glow,colors:C}=h;
  box(g,5.05,.22,2.62,0,.12,0,C.ink,.09);box(g,4.93,.07,2.49,0,.265,0,0xa8aeae);box(g,3.94,.22,1.16,-.22,.62,0,C.slate);
  for(const x of [-1.88,-.77,.41,1.38])for(const z of [-.48,.48]){box(g,.28,.31,.22,x,.46,z,C.ink);box(g,.35,.075,.32,x,.34,z,C.steel);}
  const belt=group(g);const travelSurface=box(belt,3.80,.085,.94,-.26,.802,0,C.ink);const slats=[];
  for(let i=0;i<19;i++)slats.push(box(belt,.072,.018,.86,-2.07+i*.20,.84,0,0x596774));
  const rollers=[];for(const x of [-2.06,1.52]){const a=group(g,x,.697,0);a.rotation.x=Math.PI/2;rollers.push(a);cyl(a,.147,.147,1.13,0,0,0,C.steel);for(let i=0;i<6;i++){const k=i*Math.PI/3;box(a,.088,.35,.028,.11*Math.cos(k),0,.11*Math.sin(k),C.slate).rotation.y=-k;}}
  for(const z of [-.57,.57]){box(g,3.96,.13,.14,-.22,.92,z,C.orange);for(let i=0;i<7;i++)box(g,.07,.032,.08,-1.96+i*.55,.995,z,C.amber);}
  const parcels=[];for(let i=0;i<4;i++){const p=group(belt);const col=[C.cream,C.orange,C.cyan,C.cream][i];box(p,.39,.28,.46,0,.14,0,col);box(p,.08,.025,.47,0,.288,0,C.steel);box(p,.15,.09,.018,.08,.12,.235,C.ink);parcels.push(p);}
  const receiver=group(g,1.92,0,0);box(receiver,.16,1.47,1.56,.33,.985,-.03,C.cream,.06);for(const z of [-.68,.62])box(receiver,.79,1.47,.23,0,.985,z,C.cream,.06);const receivingDeck=box(receiver,.84,.15,.98,-.045,.769,0,C.ink);box(receiver,.87,.16,1.61,0,1.79,-.03,C.orange);box(receiver,.74,.30,.055,0,1.34,.754,C.cream);badge(receiver,0,1.34,.7815,.51);
  box(g,.95,.18,.58,-1.55,.36,.89,C.cream);for(let i=0;i<3;i++)box(g,.12,.05,.14,-1.77+i*.21,.475,.89,glow(i===2?C.orange:C.mint));// Control cable: gland on the panel's side, slack run along the deck, rising into a junction box on the frame.
  {const gl=cyl(g,.058,.058,.05,-1.05,.36,.89,C.ink);gl.rotation.z=Math.PI/2;
  rail(g,[[-1.09,.36,.89],[-.99,.36,.89],[-.86,.338,.865],[-.64,.336,.80],[-.49,.355,.73],[-.45,.44,.665],[-.45,.53,.635]],.036,C.ink);
  box(g,.26,.19,.09,-.45,.625,.625,C.steel,.02);cyl(g,.056,.056,.045,-.45,.515,.635,C.ink);box(g,.12,.04,.012,-.45,.66,.676,glow(C.cyan),.006);}
  const drive=box(g,.23,.04,.12,-1.55,.47,.66,glow(C.cyan));
  return {hits:[belt,receiver],update(t,v){const offset=.61*v;for(const [i,p] of parcels.entries())p.position.set(-1.87+i*.83+offset,.849,0);
   rollers.forEach(r=>r.rotation.set(Math.PI/2,-offset/.147,0));
   for(const [i,s] of slats.entries()){const x=-2.07+i*.20+(offset%.20);s.position.x=x;s.scale.x=Math.max(.001,Math.min(1,(x+2.13)/.074,(1.64-x)/.074));}
   drive.scale.x=.57+.26*v+.10*Math.sin(t*3);},measure(){const a=new THREE.Box3().setFromObject(travelSurface),b=new THREE.Box3().setFromObject(receivingDeck);return [{name:'belt/receiver height mismatch',value:Math.abs(a.max.y-b.max.y),max:.002},{name:'handoff longitudinal engagement',value:a.max.x-b.min.x,min:.16}];}};
 }},
 {id:'r2',name:'R2',object:'Object Vault',category:'Build',description:'R2 stores objects such as backups, media, and application data. Pull the vault drawer out to inspect an individual object cartridge.',verb:'Retrieve object',idle:'OBJECTS IN STORAGE',active:'CARTRIDGE READY TO COLLECT',build(h){
  const {g,group,box,badge,rail,glow,colors:C}=h;
  box(g,4.55,.20,2.71,0,.12,0,C.ink,.10);box(g,4.44,.08,2.55,0,.25,0,0xa9a5a0);
  const x=-.38;box(g,2.68,.26,1.83,x,.40,-.28,C.slate);box(g,2.69,.36,1.85,x,2.40,-.28,C.orange);
  for(const s of [-1,1]){box(g,.25,1.76,1.81,x+s*1.17,1.43,-.28,C.cream);for(let i=0;i<7;i++)box(g,.034,.09,.94,x+s*1.31,.85+i*.17,-.37,C.slate);}
  box(g,2.65,1.84,.16,x,1.39,-1.18,C.ink);box(g,1.20,.25,.055,x,2.40,.666,C.cream);badge(g,x,2.40,.6935,.42);
  for(const s of [-1,1]){box(g,.060,.047,1.47,x+s*1.02,1.112,-.20,C.steel);for(const z of [-.7,-.05])box(g,.30,.09,.06,x+s*1.165,1.105,z,C.ink,.01);}
  const tray=group(g,x,1.48,0);for(let i=0;i<3;i++){const p=i===1?tray:group(g,x,.81+.67*i,0);box(p,2.10,.12,1.63,0,-.25,-.25,C.slate);box(p,2.07,.36,.13,0,-.07,.57,i===1?C.orange:C.cream);box(p,.42,.10,.15,0,-.04,.66,C.ink);for(const s of [-1,1])box(p,.062,.061,1.58,s*.999,-.32,-.23,C.steel);for(let j=0;j<4;j++){box(p,.36,.22,.91,-.70+j*.46,-.08,-.20,[C.slate,C.amber,C.cyan,C.cream][j]);box(p,.25,.026,.50,-.70+j*.46,.043,-.23,C.ink);box(p,.07,.034,.13,-.82+j*.46,.049,.04,glow(C.mint));}}
  box(g,.92,.27,.96,1.55,.43,.15,C.cream);box(g,.73,.26,.70,1.55,.68,.15,C.slate);box(g,.52,.055,.45,1.55,.84,.15,C.ink);const led=box(g,.22,.025,.15,1.55,.88,.15,glow(C.mint));rail(g,[[1.52,.45,-.30],[1.52,.40,-.75],[1.40,.40,-.98],[1.22,.48,-1.03],[1.18,.62,-1.06],[1.18,.68,-1.13]],.05,C.orange);for(const [gx,gy,gz] of [[1.52,.43,-.35],[1.18,.66,-1.09]])h.cyl(g,.072,.072,.04,gx,gy,gz,C.ink).rotation.x=Math.PI/2;
  return {hits:[tray],update(t,v){tray.position.z=v*.83;led.scale.x=.80+v*.36+.10*Math.sin(t*3.3);}};
 }},
 {id:'analytics',name:'Web Analytics',object:'Traffic Plotter',category:'Build',description:'Web Analytics reports measurements such as page views and performance. Start this plotter to trace a small illustrative sample, not live traffic.',verb:'Plot sample',idle:'PLOTTER STANDBY',active:'TRACING SAMPLE TRAFFIC',build(h){
  const {THREE,g,group,box,cyl,rail,badge,glow,colors:C}=h;
  box(g,4.68,.24,2.67,0,.13,0,C.ink,.11);box(g,4.55,.12,2.51,0,.31,0,C.cream);box(g,3.08,.095,1.64,-.35,.43,.04,0xfff0cd);box(g,3.22,.15,.38,-.35,.54,-.81,C.slate);
  for(let i=0;i<9;i++)box(g,.018,.010,1.43,-1.71+i*.34,.485,.05,0xcbbca1);for(let i=0;i<6;i++)box(g,2.79,.010,.019,-.35,.486,-.65+i*.28,0xcbbca1);
  for(const x of [-1.98,1.24]){box(g,.31,.47,2.07,x,.59,-.03,C.slate);box(g,.17,.08,1.84,x,.86,-.03,C.steel);}
  const gantry=group(g,0,0,.52);box(gantry,3.55,.23,.27,-.37,.98,0,C.orange);box(gantry,3.34,.07,.31,-.37,1.13,0,C.cream);for(const x of [-1.98,1.24])box(gantry,.24,.126,.36,x,.922,0,C.dark);const pen=group(gantry,-1.70,0,0);box(pen,.38,.35,.46,0,.91,0,C.ink);const nib=cyl(pen,.071,.018,.233,0,.612,0,C.orange);box(pen,.21,.07,.13,0,1.10,.22,glow(C.cyan));
  const bureau=group(g,1.78,.375,-.25);box(bureau,.74,.85,.90,0,.42,0,C.ink);box(bureau,.64,.50,.04,0,.52,.47,C.slate);badge(bureau,0,.52,.49,.52);for(let i=0;i<4;i++)box(bureau,.07,.07,.04,-.20+i*.13,.22,.47,glow(i===2?C.orange:C.mint));
  const curve=new THREE.CatmullRomCurve3([[-1.70,.50],[-1.34,.32],[-1.06,.46],[-.70,-.02],[-.39,.16],[-.04,-.38],[.24,-.23],[.56,-.54],[1,-.45]].map(([x,z])=>new THREE.Vector3(x,.511,z)));
  const trace=[],Y=new THREE.Vector3(0,1,0),at=new THREE.Vector3();
  for(let k=0;k<48;k++){const a=curve.getPointAt(k/48),b=curve.getPointAt((k+1)/48),d=b.clone().sub(a);const item=cyl(g,.018,.018,d.length()+.009,a.x,a.y,a.z,glow(C.orange),10);item.quaternion.setFromUnitVectors(Y,d.clone().normalize());trace.push({item,a,d});}
  return {hits:[gantry,bureau],update(t,v){curve.getPointAt(v,at);pen.position.x=at.x;gantry.position.z=at.z;
   trace.forEach(({item,a,d},k)=>{const f=Math.max(0,Math.min(1,48*v-k));item.position.copy(a).addScaledVector(d,.5*f);item.scale.set(Math.min(1,Math.max(.0001,4*f)),Math.max(.0001,f),Math.min(1,Math.max(.0001,4*f)));item.visible=f>0;});},measure(){const foot=new THREE.Box3().setFromObject(nib).min;return [{name:'nib/paper clearance',value:foot.y-.4775,min:.015,max:.020},{name:'carriage/nib centerline',value:Math.abs(foot.z+.071-gantry.position.z),max:.0001}];}};
 }}
];
