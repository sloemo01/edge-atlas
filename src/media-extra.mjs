// Bench instruments for the media and browser products. The atlas supplies the
// palette, light, camera and mesh primitives; poses are sampled, not integrated.
const clamp = x => Math.max(0, Math.min(1, x));
const ease = (a,b,v) => { const x=clamp((v-a)/(b-a)); return x*x*(3-2*x); };
const mix = (a,b,v) => a+(b-a)*v;
const TAU = 2*Math.PI;

function deck({g,box,cyl,colors:C},w,d,finish) {
  box(g,w,.22,d,0,.11,0,C.ink,.11);
  box(g,w-.12,.075,d-.12,0,.2475,0,finish,.055);
  for(const x of [-1,1]) for(const z of [-1,1]){
    const px=x*(w/2-.23), pz=z*(d/2-.22);
    cyl(g,.078,.078,.020,px,.292,pz,C.slate,16);
    cyl(g,.051,.051,.020,px,.303,pz,C.steel,16);
    box(g,.064,.005,.012,px,.315,pz,C.ink,.002);
  }
}
function disc({cyl},p,r,d,x,y,z,c,n=32){
  const m=cyl(p,r,r,d,x,y,z,c,n);m.rotation.x=Math.PI/2;return m;
}
function sideDisc({cyl},p,r,d,x,y,z,c,n=16){
  const m=cyl(p,r,r,d,x,y,z,c,n);m.rotation.z=Math.PI/2;return m;
}
// Faceted bored bushing: the staves are solids, but the moving rod has an open bore.
function sleeve(kit,p,inner,outer,h,x,y,z,c){return kit.tube(p,outer,inner,h,x,y,z,c,48);}

function faceScrew(h,p,x,y,z){
  disc(h,p,.046,.024,x,y,z,h.colors.steel,12);
  h.box(p,.056,.011,.005,x,y,z+.013,h.colors.ink,.002);
}

export default [
  {
    id:'stream', name:'Stream', object:'Film Playback Station', category:'Build', docs:'stream',
    description:'Cloudflare Stream encodes and delivers video for playback. Run the film through the projector and watch the test monitor play the picture.',
    verb:'Play video', idle:'VIDEO READY', active:'VIDEO PLAYING',
    build(h){
      const {g,group,box,cyl,ring,rail,badge,glow,colors:C}=h;
      // Base and mount; motor housing, gate, knobs and lens; two spindle/reel
      // assemblies with hubs, rims and spokes; a cabled playback monitor.
      deck(h,4.92,2.92,C.steel);
      const projector=group(g,-.88,0,-.29);
      for(const x of [-.73,.73])for(const z of [-.42,.42])box(projector,.29,.10,.26,x,.335,z,C.dark);
      box(projector,2.08,.81,1.12,0,.76,0,C.cream,.10);
      box(projector,2.10,.17,1.14,0,1.19,0,C.orange,.06);
      box(projector,1.42,1.02,.23,.02,1.62,-.42,C.slate,.10);
      box(projector,1.91,.53,.075,0,.75,.57,C.slate,.05);
      for(const x of [-.84,.84])for(const y of [.55,.95])faceScrew(h,projector,x,y,.617);
      box(projector,.63,.34,.043,-.45,.75,.622,C.ink,.05);
      badge(projector,-.45,.75,.6435,.48);
      for(let i=0;i<5;i++)box(projector,.065,.13,.016,-.70+i*.17,1.109,.575,C.dark,.025);
      disc(h,projector,.315,.14,.38,.78,.657,C.ink);
      disc(h,projector,.259,.24,.38,.78,.82,C.slate);
      disc(h,projector,.273,.09,.38,.78,.948,C.orange);
      disc(h,projector,.196,.064,.38,.78,.974,C.dark);
      disc(h,projector,.127,.037,.38,.78,1.003,glow(C.cyan));
      ring(projector,.175,.021,.38,.78,1.002,C.steel);
      const reels=[];
      for(const [i,x,y,r] of [[0,-.60,1.99,.55],[1,.59,1.92,.47]]){
        disc(h,projector,.14,.442,x,y,-.14,C.steel);
        const reel=group(projector,x,y,.14);
        disc(h,reel,r*.62,.125,0,0,0,i?C.amber:C.orange);
        for(const z of [-.076,.076]){
          ring(reel,r-.045,.044,0,0,z,C.slate);
          for(let j=0;j<6;j++){
            const a=j*TAU/6;
            const arm=box(reel,.076,r-.11,.043,Math.sin(a)*r*.50,Math.cos(a)*r*.50,z,C.steel,.02);
            arm.rotation.z=-a;
          }
        }
        disc(h,reel,.134,.058,0,0,.098,C.cream);
        disc(h,reel,.068,.057,0,0,.136,C.ink,12);
        reels.push(reel);
      }
      // The film enters tangent to each hub, between both reel flanges.
      const filmR=.027;
      const left=(-.60+.55*.62+filmR),right=(.59-.47*.62-filmR);
      rail(projector,[[left,1.99,.14],[left,1.72,.14],[-.27,1.414,.14],[-.18,1.344,.14],
        [.19,1.344,.14],[.27,1.409,.14],[right,1.66,.14],[right,1.92,.14]],filmR,C.dark);
      for(const x of [-.18,.19])disc(h,projector,.088,.17,x,1.46,.14,C.steel);
      box(projector,.57,.046,.14,0,1.297,.14,C.ink,.02);
      const monitor=group(g,1.36,0,.38);
      box(monitor,1.36,.13,1.03,0,.35,0,C.ink,.09);
      box(monitor,.26,.14,.28,0,.475,0,C.slate);
      box(monitor,1.53,1.13,.47,0,1.10,-.045,C.cream,.10);
      box(monitor,1.42,.92,.054,0,1.15,.202,C.ink,.09);
      box(monitor,1.27,.76,.028,0,1.16,.235,C.slate,.04);
      // A tiny travelling moon above the horizon, as on a film test loop.
      box(monitor,1.19,.68,.025,0,1.16,.252,C.cyan,.03);
      const moon=disc(h,monitor,.112,.015,-.40,1.17,.272,C.amber);
      for(let i=0;i<5;i++)box(monitor,.20,.09+i*.028,.023,-.48+i*.24,.86+i*.014,.277,i%2?C.cream:C.steel,.03);
      const needle=box(monitor,.09,.043,.026,-.46,.695,.243,glow(C.orange),.02);
      box(monitor,1.06,.023,.019,0,.695,.229,C.slate,.01);
      sideDisc(h,projector,.073,.087,1.06,.53,-.22,C.steel);
      box(monitor,.18,.158,.30,.09,.407,-.608,C.slate,.028);
      rail(g,[[.22,.53,-.51],[.38,.53,-.51],[.59,.38,-.69],[1.15,.36,-.72],[1.45,.407,-.372]],.037,C.ink);
      return {hits:[projector,monitor],update(t,v){
        reels[0].rotation.z=-v*TAU;
        reels[1].rotation.z=-v*TAU*1.18;
        moon.position.x=mix(-.42,.42,v);
        moon.position.y=1.16+.25*Math.sin(Math.PI*v);
        needle.position.x=mix(-.48,.48,v);
        needle.scale.y=1+.08*Math.sin(2.6*t);
      }};
    }
  },
  {
    id:'calls', name:'Calls (Realtime SFU)', object:'Live Relay Switchboard', category:'Connect', docs:'realtime/sfu',
    description:'Cloudflare’s Realtime SFU forwards selected audio or video tracks to participants without mixing them together. Throw the relay lever to send two distinct tracks to the listening stations.',
    verb:'Forward tracks', idle:'TRACKS AT INPUT', active:'SELECTED TRACKS FORWARDED',
    build(h){
      const {g,group,box,cyl,ball,rail,badge,glow,colors:C}=h;
      // Switchboard cheeks, faceplate, fuse caps, input meters, isolated relay
      // contacts, handle and leads; two receivers with grills and status strips.
      deck(h,4.97,2.90,C.cream);
      const board=group(g,-.89,0,-.38);
      box(board,2.43,.19,1.31,0,.38,0,C.ink,.07);
      box(board,2.24,1.37,.71,0,1.12,-.15,C.orange,.09);
      for(const x of [-1.07,1.07])box(board,.17,1.25,.9,x,1.09,-.07,C.slate,.06);
      box(board,2.03,1.11,.10,0,1.14,.251,C.ink,.08);
      box(board,.65,.25,.044,0,1.55,.326,C.cream,.03);
      badge(board,0,1.55,.348,.51);
      for(const x of [-.9,.9])for(const y of [.68,1.59])faceScrew(h,board,x,y,.31);
      const source=[C.cyan,C.amber,C.lavender], lamps=[];
      for(const [i,c] of source.entries()){
        const x=-.64+i*.64;
        box(board,.48,.31,.046,x,1.18,.322,C.slate,.04);
        box(board,.37,.217,.023,x,1.18,.355,C.dark,.03);
        for(let k=0;k<4;k++){
          const m=box(board,.044,.115,.018,x-.12+k*.08,1.18,.374,glow(c),.014);
          lamps.push([m,i,k]);
        }
        disc(h,board,.113,.066,x,.915,.356,C.steel,16);
        disc(h,board,.062,.052,x,.915,.399,c,16);
      }
      disc(h,board,.093,.112,0,.72,.352,C.ink,16);
      const lever=group(board,0,.72,.45);
      sideDisc(h,board,.085,.22,0,.72,.45,C.ink);
      for(const x of [-.124,.124])sideDisc(h,board,.064,.028,x,.72,.45,C.steel);
      box(lever,.088,.36,.087,0,-.052,.179,C.steel,.035).rotation.x=-Math.PI/3;
      ball(lever,.132,0,-.14,.332,C.orange);
      const output=[];
      for(const [i,x,z,c] of [[0,1.48,.54,C.cyan],[1,1.43,-.76,C.amber]]){
        const receiver=group(g,x,0,z);
        box(receiver,.97,.1165,.98,0,.34325,0,C.dark,.07);
        box(receiver,.88,.76,.74,0,.763,0,C.cream,.085);
        box(receiver,.78,.59,.071,0,.788,.374,C.slate,.04);
        disc(h,receiver,.232,.052,0,.838,.422,C.ink);
        for(let k=-2;k<=2;k++)box(receiver,.355-Math.abs(k)*.050,.021,.017,0,.838+k*.058,.454,C.steel,.009);
        box(receiver,.46,.058,.037,0,.547,.424,C.dark,.017);
        const meter=[];
        for(let k=0;k<4;k++)meter.push(box(receiver,.061,.030,.022,-.15+k*.10,.546,.452,glow(c),.008));
        output.push([receiver,meter]);
        const inletZ=i===0?.10:-.236, originZ=i===0?-.06:-.70;
        sideDisc(h,board,.068,.108,1.179,.58,originZ+.38,C.dark);
        sideDisc(h,receiver,.073,.102,-.455,.60,inletZ,C.dark);
        rail(g,[[.34,.58,originZ],[.46,.58,originZ],[.62,.39,mix(originZ,z+inletZ,.62)],
          [x-.68,.46,z+inletZ],[x-.504,.60,z+inletZ]],.042,c);
      }
      return {hits:[board,...output.map(([p])=>p)],update(t,v){
        lever.rotation.x=mix(-.04,-.42,v);
        for(const [m,i,k] of lamps)m.scale.y=.67+.22*Math.sin(t*2.5+i*1.35+k*.74);
        for(const [i,[,meter]] of output.entries())for(const [k,b] of meter.entries()){
          const pass=ease(.15+i*.11,.55+i*.10,v);
          b.scale.x=.16+.84*pass;
          b.scale.y=.26+pass*(.67+.07*Math.sin(t*2.5+i*1.35+k*.74));
        }
      }};
    }
  },
  {
    id:'pages', name:'Pages', object:'Publish Proofing Press', category:'Build', docs:'pages',
    description:'Cloudflare Pages builds and publishes sites. Pull the proofing press: it lowers onto a composed page and delivers the proof into a tray for readers.',
    verb:'Publish page', idle:'PROOF IN PRESS', active:'PUBLISHED PROOF READY',
    build(h){
      const {g,group,box,cyl,ball,rail,badge,glow,colors:C}=h;
      // Bed, chase rails, mounting shoes, uprights, crown, ram and die;
      // journal, handle, platen fasteners, proof stock bin and delivery tray.
      deck(h,4.96,2.99,C.steel);
      const press=group(g,-.53,0,-.27);
      box(press,2.49,.24,1.87,0,.405,0,C.ink,.08);
      box(press,2.19,.14,1.20,0,.591,.03,C.slate,.042);
      for(const x of [-.98,.98]){
        box(press,.43,.19,1.45,x,.60,-.13,C.steel,.06);
        box(press,.31,1.72,.52,x,1.55,-.44,C.orange,.10);
        box(press,.22,1.46,.07,x,1.53,-.146,C.amber,.037);
        for(const y of [.93,2.13]) faceScrew(h,press,x,y,-.095);
        box(press,.13,.062,1.47,x,.705,.22,C.ink,.02);
      }
      box(press,2.39,.34,.73,0,2.42,-.40,C.orange,.10);
      box(press,1.20,.25,.063,0,2.43,-.008,C.ink,.045);
      badge(press,0,2.43,.0235,.48);
      sleeve(h,press,.125,.225,.583,0,1.9615,-.10,C.ink);
      const ram=group(press,0,0,0);
      cyl(ram,.113,.113,.735,0,1.8725,-.10,C.steel);
      for(const x of [-.70,.70]){
        sleeve(h,press,.069,.10,.583,x,1.9615,-.40,C.ink);
        cyl(ram,.061,.061,.735,x,1.8725,-.40,C.steel,16);
      }
      box(ram,1.71,.24,1.11,0,1.39,-.06,C.ink,.06);
      box(ram,1.63,.099,1.01,0,1.222,-.06,C.amber,.04);
      for(const x of [-.63,.63])for(const z of [-.51,.31])cyl(ram,.056,.056,.043,x,1.528,z,C.steel,12);
      const handle=group(press,1.16,2.04,-.19);
      const pivot=cyl(handle,.188,.188,.21,0,0,0,C.ink);pivot.rotation.z=Math.PI/2;
      rail(handle,[[.13,0,0],[.28,.04,.19],[.31,.23,.68]],.047,C.steel);
      box(handle,.24,.143,.32,.31,.239,.77,C.dark,.07);
      for(let i=0;i<3;i++)box(handle,.25,.024,.024,.31,.311,.687+i*.082,C.slate,.01);
      const tray=group(press,0,.621,1.135);
      box(tray,1.81,.080,1.012,0,0,0,C.steel,.02);
      box(tray,1.79,.060,.098,0,.069,.450,C.orange,.025);
      for(const x of [-.84,.84]){
        box(tray,.085,.070,1.01,x,.072,0,C.slate,.027);
        box(press,.17,.106,.58,x,.529,.686,C.ink,.028);
      }
      const proof=group(press,0,.6825,-.17);
      box(proof,1.42,.043,.81,0,0,0,C.cream,.035);
      const design=group(proof,-.58,.026,0);
      box(design,1.16,.012,.13,.58,0,-.235,C.orange,.016);
      box(design,.46,.012,.35,.23,0,.063,C.amber,.035);
      for(let j=0;j<3;j++)box(design,.56-j*.066,.012,.043,.86-j*.032,0,-.049+j*.123,C.slate,.02);
      const stock=group(g,1.59,0,-.15);
      box(stock,1.02,.1175,1.42,0,.34375,0,C.ink,.06);
      for(const x of [-.47,.47])box(stock,.09,.30,1.36,x,.548,0,C.slate,.03);
      for(let i=0;i<6;i++)box(stock,.83,.038,1.10,Math.sin(i)*.019,.421+i*.041,-.04+i*.023,i%2?C.white:C.cream,.028);
      cyl(stock,.060,.068,.020,.022,.411,.642,C.slate,12);
      const pilot=ball(stock,.048,.022,.458,.642,glow(C.orange));
      return {hits:[press],update(t,v){
        const stroke=ease(0,.38,v)-ease(.43,.69,v);
        const deliver=ease(.69,1,v);
        ram.position.y=-.458*stroke;
        handle.rotation.x=.81*stroke;
        proof.position.z=mix(-.17,1.106,deliver);
        design.scale.x=.0001+.9999*ease(.34,.58,v);
        pilot.scale.setScalar(.78+.05*Math.sin(2.4*t)+.18*deliver);
      }};
    }
  },
  {
    id:'browser-rendering', name:'Browser Rendering', object:'Remote Page Scanner', category:'Build', docs:'browser-run',
    description:'Browser Run (formerly Browser Rendering) runs a headless browser on Cloudflare’s network. Sweep the scanner over a rendered page and watch the capture appear on the remote preview monitor.',
    verb:'Capture page', idle:'BROWSER READY', active:'SCREENSHOT CAPTURED',
    build(h){
      const {g,group,box,cyl,rail,badge,glow,colors:C}=h;
      // Flatbed glass and edge seals, carriage rails, stop blocks, optical
      // window and lens, scale strip, page content, display and cable couplers.
      deck(h,4.96,2.94,C.cream);
      const scanner=group(g,-.66,0,.035);
      box(scanner,2.78,.32,2.45,0,.445,0,C.slate,.10);
      box(scanner,2.70,.092,2.375,0,.645,0,C.ink,.065);
      box(scanner,2.03,.036,1.84,0,.703,0,C.steel,.045);
      box(scanner,1.91,.029,1.71,0,.735,0,C.white,.045);
      box(scanner,1.70,.012,.18,0,.758,-.667,C.slate,.02);
      for(let k=0;k<3;k++)cyl(scanner,.036,.036,.014,-.71+k*.105,.770,-.667,k===0?C.orange:C.steel,12);
      box(scanner,1.67,.012,.29,0,.758,-.383,C.cyan,.035);
      for(let i=0;i<2;i++){
        const z=-.025+i*.455;
        box(scanner,.54,.013,.35,-.565,.759,z,i?C.cream:C.amber,.035);
        for(let k=0;k<3;k++)box(scanner,.96-k*.17,.013,.052,.35-k*.085,.76,z-.109+k*.109,C.steel,.022);
      }
      for(const x of [-1.137,1.137]){
        box(scanner,.155,.094,2.09,x,.737,0,C.slate,.025);
        box(scanner,.069,.046,2.05,x,.806,0,C.steel,.02);
        for(const z of [-1.059,1.059])box(scanner,.29,.139,.158,x,.792,z,C.cream,.045);
      }
      const ruler=group(scanner,1.257,.687,0);
      box(ruler,.107,.018,1.85,0,0,0,C.dark,.02);
      for(let i=0;i<13;i++){
        const len=i%4===0?.078:.049;
        box(ruler,len,.009,.016,-.051+len/2,.012,-.84+i*.14,C.steel,.003);
      }
      const carriage=group(scanner,0,.96,-.843);
      for(const x of [-1.137,1.137]){
        box(carriage,.29,.118,.27,x,-.071,0,C.orange,.025);
        for(const dx of [-.081,.081])box(carriage,.061,.048,.27,x+dx,-.146,0,C.orange,.013);
      }
      box(carriage,2.48,.212,.28,0,.026,0,C.cream,.055);
      box(carriage,1.97,.058,.19,0,-.094,0,C.dark,.03);
      box(carriage,1.87,.021,.085,0,-.127,0,glow(C.cyan),.023);
      box(carriage,.41,.071,.22,0,.145,0,C.slate,.04);
      for(const x of [-.92,.92])cyl(carriage,.047,.047,.025,x,.142,0,C.steel,12);
      box(scanner,1.03,.22,.056,0,.483,1.236,C.ink,.037);
      badge(scanner,0,.483,1.264,.43);
      for(let i=0;i<5;i++)box(scanner,.082,.044,.019,.69+i*.092,.45,1.24,C.dark,.015);
      const preview=group(g,1.55,0,-.28);
      box(preview,1.11,.1155,.89,0,.34275,0,C.ink,.06);
      box(preview,.29,.52,.28,0,.65,0,C.slate,.04);
      box(preview,1.26,1.37,.43,0,1.34,0,C.slate,.09);
      box(preview,1.13,1.20,.051,0,1.38,.233,C.ink,.055);
      box(preview,1.005,1.08,.018,0,1.39,.265,C.dark,.05);
      const rows=[];
      for(let j=0;j<5;j++){
        const y=1.82-j*.196;
        const row=group(preview,-.435,y,.28);
        box(row,.87,.187,.018,.435,0,0,C.white,.013);
        if(j<2)box(row,.80,.13,.016,.435,.002,.017,j?C.cyan:C.slate,.019);
        else{
          box(row,.29,.122,.016,.179,.012,.017,j===2?C.amber:C.cream,.015);
          for(let k=0;k<3;k++)box(row,.444-k*.058,.020,.016,.569-k*.029,.05-k*.048,.018,C.steel,.009);
        }
        rows.push(row);
      }
      const led=box(preview,.112,.039,.024,0,.738,.225,glow(C.orange),.015);
      box(scanner,.16,.13,.18,1.398,.48,-.86,C.ink,.02);
      box(preview,.14,.13,.23,-.20,.48,-.33,C.ink,.02);
      rail(g,[[.815,.48,-.825],[.94,.48,-.89],[1.20,.481,-.86],[1.35,.48,-.723]],.036,C.ink);
      return {hits:[scanner,preview],update(t,v){
        carriage.position.z=mix(-.843,.843,v);
        rows.forEach((row,i)=>{row.scale.x=.0001+.9999*ease(i*.193,.22+i*.193,v);});
        led.scale.y=.79+.09*Math.sin(t*2.4)+.16*v;
      }};
    }
  },
  {
    id:'zaraz', name:'Zaraz', object:'Edge Tag Distributor', category:'Connect', docs:'zaraz',
    description:'Zaraz loads third-party tools through Cloudflare and can route site events to configured tools. Feed in one site event and watch the distributor dispatch separate copies to the tool bins.',
    verb:'Dispatch site event', idle:'EVENT AT INTAKE', active:'EVENT SENT TO TOOL BINS',
    build(h){
      const {g,group,box,cyl,ball,ring,badge,glow,colors:C}=h;
      // Low intake guides, event pallet, distributor housing, rotary drive,
      // pusher comb and three independent dispatch lanes with bin and tag stock.
      deck(h,4.99,2.96,C.steel);
      const sorter=group(g);
      box(sorter,1.30,.219,2.24,-.28,.3945,0,C.ink,.055);
      box(sorter,.98,.820,2.04,-.46,1.255,0,C.cream,.09);
      for(const x of [-.82,-.045])for(const z of [-1.014,1.014])
        box(sorter,.14,.347,.14,x,.674,z,C.slate,.022);
      box(sorter,1.06,.14,2.11,-.46,1.69,0,C.orange,.065);
      box(sorter,.73,.34,.062,-.46,1.26,1.035,C.slate,.055);
      badge(sorter,-.46,1.26,1.066,.53);
      for(const x of [-.83,-.09])for(const y of [.923,1.53])faceScrew(h,sorter,x,y,1.03);
      const cam=group(sorter,-.46,1.82,0);
      cyl(sorter,.50,.50,.081,-.46,1.801,0,C.ink);
      cyl(cam,.39,.39,.138,0,.069,0,C.slate,24);
      const band=ring(cam,.32,.026,0,.146,0,C.amber);band.rotation.x=-Math.PI/2;
      for(let i=0;i<8;i++){
        const a=i*TAU/8;
        const m=box(cam,.105,.034,.197,Math.cos(a)*.31,.145,Math.sin(a)*.31,i%2?C.steel:C.cream,.025);
        m.rotation.y=-a;
      }
      cyl(cam,.094,.094,.06,0,.16,0,C.ink,16);
      box(cam,.34,.086,.104,.179,.204,0,C.orange,.04);
      ball(cam,.098,.36,.28,0,C.dark);
      box(g,1.35,.104,.76,-1.605,.45,.19,C.cream,.035);
      for(const x of [-2.02,-1.19])box(g,.25,.115,.58,x,.3425,.19,C.dark,.026);
      for(const z of [-.13,.51])box(g,1.36,.11,.09,-1.53,.532,z,C.slate,.03);
      box(g,1.264,.018,.49,-1.594,.5065,.19,C.steel,.004);
      box(g,.087,.13,.56,-2.224,.524,.19,C.orange,.035);
      box(g,.082,.115,.54,-.920,.5605,.19,C.ink,.026);
      const siteEvent=group(g,-1.94,.563,.19);
      box(siteEvent,.52,.095,.45,0,0,0,C.orange,.05);
      box(siteEvent,.35,.031,.29,0,.054,0,C.cream,.02);
      box(siteEvent,.20,.019,.035,0,.076,-.046,C.slate,.011);
      box(siteEvent,.14,.019,.035,-.03,.076,.048,C.steel,.011);
      const lanes=[];
      for(const [i,c] of [C.cyan,C.amber,C.lavender].entries()){
        const z=-.71+i*.71;
        box(sorter,.18,.075,.49,.09,.867,z,C.dark,.022);
        box(sorter,.19,.051,.49,.10,.830,z,C.steel,.018);
        for(const dz of [-.220,.220])box(sorter,.18,.171,.055,.09,.743,z+dz,C.dark,.014);
        const pusher=box(g,.144,.060,.25,-.645,.690,z,C.steel,.016);
        // A raised launch cradle continues flush into the dispatch rail and bin.
        box(g,1.17,.156,.46,-.359,.582,z,C.slate,.020);
        box(g,1.279,.14,.46,.8655,.590,z,C.slate,.020);
        box(g,.39,.234,.34,.95,.402,z,C.ink,.026);
        for(const dz of [-.207,.207])box(g,1.279,.074,.052,.8655,.69,z+dz,C.steel,.012);
        const bin=group(g,1.90,0,z);
        box(bin,.87,.26,.63,0,.407,0,C.ink,.065);
        box(bin,.79,.124,.61,0,.598,0,C.cream,.022);
        for(const dz of [-.27,.27])box(bin,.79,.163,.06,0,.738,dz,C.slate,.023);
        box(bin,.12,.18,.58,.378,.749,0,c,.04);
        for(let j=0;j<2;j++)box(bin,.12,.026,.37,.235-j*.008,.673+j*.026,0,C.cream,.013);
        const envelope=group(g,-.387,.693,z);
        box(envelope,.375,.066,.337,0,0,0,c,.032);
        box(envelope,.24,.013,.204,0,.038,0,C.cream,.014);
        box(envelope,.11,.012,.034,-.031,.05,-.022,C.slate,.009);
        const pilot=box(bin,.018,.063,.090,.445,.749,0,glow(c),.008);
        lanes.push({bin,envelope,pusher,pilot});
      }
      return {hits:[sorter,siteEvent,...lanes.map(l=>l.bin)],update(t,v){
        siteEvent.position.x=mix(-1.94,-1.222,ease(0,.27,v));
        cam.rotation.y=-TAU*v*.68;
        lanes.forEach(({envelope,pusher,pilot},i)=>{
          const a=.27+i*.087,b=.64+i*.147;
          const travel=ease(a,b,v), receive=ease(.83,1,travel);
          envelope.position.x=mix(-.387,1.84,travel);
          pusher.position.x=envelope.position.x-.2595;
          pilot.scale.y=.66+.25*receive+.07*Math.sin(t*2.2+i*.58);
        });
      }};
    }
  }
];
