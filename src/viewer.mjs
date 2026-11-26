import * as T from 'three';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/geometries/RoundedBoxGeometry.js';

const P={tangerine:0xf6821f,mango:0xfbad41,ruby:0xff6633,white:0xffffff,black:0x000000,blackberry:0x0f006b,blueberry:0x3e74ff,lemon:0xffd43c,raspberry:0xce2f55,cherry:0x960c3e};
const colors={ink:0x333333,slate:0x666666,white:P.white,cream:0xfff3e6,orange:P.tangerine,amber:P.mango,cyan:P.blueberry,mint:P.lemon,lavender:P.raspberry,steel:0xc5c5c5,dark:0x292929};
const exact=new Set([...Object.values(P),...Object.values(colors)]);
function brandColor(c){if(typeof c!=='number'||exact.has(c))return c;const r=(c>>16)&255,g=(c>>8)&255,b=c&255,hi=Math.max(r,g,b),lo=Math.min(r,g,b);if(hi<54||hi-lo<25){return hi<68?0x292929:hi<145?0x666666:hi<207?0xc5c5c5:P.white;}if(hi>210&&lo>169)return 0xfff3e6;if(r>g&&r>b){if(b>g*1.16)return r>162?P.raspberry:P.cherry;return hi>172?(g>r*.73?P.mango:g>r*.48?P.tangerine:P.ruby):P.cherry;}if(hi<125)return 0x333333;return b>=g*.90?P.blueberry:P.lemon;}

const canvas=document.querySelector('#instrument'), stage=canvas.parentElement;
const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene(); const camera=new T.OrthographicCamera(-3,3,3,-3,.1,44);
const orbit=new OrbitControls(camera,canvas); orbit.enablePan=false;orbit.enableDamping=false;orbit.minZoom=.7;orbit.maxZoom=2.6;orbit.minPolarAngle=.12;orbit.maxPolarAngle=Math.PI*.487;
scene.add(new T.HemisphereLight(0xffffff,0xe4e3ed,1.45));
const sun=new T.DirectionalLight(0xfff4e9,2.15);sun.position.set(-3.8,8,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:20});sun.shadow.normalBias=.014;sun.shadow.bias=-.00008;scene.add(sun);
const rim=new T.DirectionalLight(0xf4f4fa,.68);rim.position.set(3,3,-5);scene.add(rim);
const ramp=new T.DataTexture(new Uint8Array([92,148,202,252]),4,1,T.RedFormat);ramp.minFilter=ramp.magFilter=T.NearestFilter;ramp.needsUpdate=true;
const materials=new Map(), geometries=new Map();
const mat=c=>{c=brandColor(c);if(c?.isMaterial)return c;if(!materials.has(c))materials.set(c,new T.MeshToonMaterial({color:c,gradientMap:ramp}));return materials.get(c);};
const glow=c=>{c=brandColor(c);const k=`g${c}`;if(!materials.has(k)){const m=new T.MeshToonMaterial({color:c,gradientMap:ramp,emissive:c,emissiveIntensity:.36});m.userData.softInk=true;materials.set(k,m);}return materials.get(k);};
function geom(key,make){if(!geometries.has(key))geometries.set(key,make());return geometries.get(key);}
const QA_STACK=new URLSearchParams(location.search).has('stack');
function mesh(p,shape,x,y,z,c,shadow=true){const m=new T.Mesh(shape,mat(c));if(QA_STACK)m.userData.at=(new Error().stack||'').split('\n').slice(2,7).map(l=>(l.match(/:(\d+):(\d+)\)?$/)||[]).slice(1).join(':')).join(' ');m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;p.add(m);return m;}
function group(p,x=0,y=0,z=0){const a=new T.Group();a.position.set(x,y,z);p.add(a);return a;}
function box(p,w,a,d,x,y,z,c,r=.045){const k=`b/${w}/${a}/${d}/${r}`;return mesh(p,geom(k,()=>r<=0?new T.BoxGeometry(w,a,d):new RoundedBoxGeometry(w,a,d,Math.max(w,a,d)>.65?3:2,Math.min(w/4,a/4,d/4,r))),x,y,z,c,Math.max(w,a,d)>.24&&Math.min(w,a,d)>.045);}
function cyl(p,rt,rb,a,x,y,z,c,n=32){if(n>=32&&Math.max(rt,rb)>.38)n=Math.max(n,72);return mesh(p,geom(`c/${rt}/${rb}/${a}/${n}`,()=>new T.CylinderGeometry(rt,rb,a,n)),x,y,z,c,Math.max(rt,rb)>.11&&a>.09);}
function ball(p,r,x,y,z,c){return mesh(p,geom(`s/${r}`,()=>new T.SphereGeometry(r,20,12)),x,y,z,c,r>.14);}
// Open sleeve along Y with true inner bore; flat-shaded caps and walls with outward/inward normals.
// Open sleeve along Y with a true bore. The bore wall is a separate non-receiving mesh:
// shadow-map texels at grazing angles inside a narrow bore otherwise render as spikes.
function tubeGeometry(ro,ri,a,n,bore){const P=[],N=[],I=[];const h=a/2;const add=(x,y,z,nx,ny,nz)=>{P.push(x,y,z);N.push(nx,ny,nz);return P.length/3-1;};
 for(const [r,sg] of bore?[[ri,-1]]:[[ro,1]]){const base=P.length/3;for(let i=0;i<=n;i++){const t=i/n*Math.PI*2,c=Math.cos(t),s=Math.sin(t);add(r*c,-h,r*s,sg*c,0,sg*s);add(r*c,h,r*s,sg*c,0,sg*s);}
  for(let i=0;i<n;i++){const a0=base+2*i,b0=a0+1,a1=a0+2,b1=a0+3;if(sg>0)I.push(a0,b0,a1,b0,b1,a1);else I.push(a0,a1,b0,b0,a1,b1);}}
 if(!bore)for(const sy of [-1,1]){const base=P.length/3;for(let i=0;i<=n;i++){const t=i/n*Math.PI*2,c=Math.cos(t),s=Math.sin(t);add(ro*c,sy*h,ro*s,0,sy,0);add(ri*c,sy*h,ri*s,0,sy,0);}
  for(let i=0;i<n;i++){const o0=base+2*i,i0=o0+1,o1=o0+2,i1=o0+3;if(sy>0)I.push(o0,i0,o1,i0,i1,o1);else I.push(o0,o1,i0,i0,o1,i1);}}
 const G=new T.BufferGeometry();G.setAttribute('position',new T.Float32BufferAttribute(P,3));G.setAttribute('normal',new T.Float32BufferAttribute(N,3));G.setIndex(I);G.computeBoundingSphere();G.computeBoundingBox();return G;}
function tube(p,ro,ri,a,x,y,z,c,n=48){const m=mesh(p,geom(`t/${ro}/${ri}/${a}/${n}`,()=>tubeGeometry(ro,ri,a,n,false)),x,y,z,c,ro>.11&&a>.09);
 const b=new T.Mesh(geom(`tb/${ri}/${a}/${n}`,()=>tubeGeometry(ro,ri,a,n,true)),m.material);b.userData.cap=true;b.castShadow=b.receiveShadow=false;m.add(b);return m;}
function ring(p,r,t,x,y,z,c){return mesh(p,geom(`r/${r}/${t}`,()=>new T.TorusGeometry(r,t,12,r>.42?80:48)),x,y,z,c,t>.04);}
function rail(p,pts,r,c){const v=pts.map(a=>new T.Vector3(...a));const path=v.length===2?new T.LineCurve3(...v):new T.CatmullRomCurve3(v,false,'centripetal');const m=mesh(p,new T.TubeGeometry(path,v.length===2?1:Math.min(48,8*v.length),r,8,false),0,0,0,c,r>.05);const cap=geom(`cap/${r}`,()=>new T.CircleGeometry(r,8));for(const u of [0,1]){const q=new T.Mesh(cap,m.material);path.getPoint(u,q.position);q.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),path.getTangent(u).multiplyScalar(u?1:-1));q.userData.cap=true;q.receiveShadow=true;m.add(q);}return m;}
// A two-part Edge Atlas mark, drawn directly as flat geometry.
const brandShapes=[
  [[-.5,.04],[0,.24],[.5,.04],[0,-.12]],
  [[-.4,-.06],[0,-.19],[.4,-.06],[.4,-.135],[0,-.265],[-.4,-.135]],
].map(points=>new T.ShapeGeometry(new T.Shape(points.map(([x,y])=>new T.Vector2(x,y)))).toNonIndexed());
const brandPaint=[P.tangerine,colors.ink].map(color=>new T.MeshBasicMaterial({color}));
const mounts=[];
function badge(p,x,y,z,scale=.5){
  // z is the actual front face in the support's coordinate frame. A 0.0015
  // depth separation is just enough to avoid z-fighting, not a raised badge.
  const mark=group(p,x,y,z+.0015);mark.name='Edge Atlas surface decal';mark.scale.setScalar(scale);
  brandShapes.forEach((s,i)=>{const m=mesh(mark,s,0,0,0,brandPaint[i],false);m.receiveShadow=false;m.userData.brandDecal=true;});
  mounts.push(mark);return mark;
}

// A lathe normally averages normals across a shared profile corner. That is
// appropriate on the curved wall, but not on a machined plane. Keep the wall
// normals while splitting every flat cap into constant-normal triangles.
function trueLatheFaces(source){
 const {points,segments,phiStart,phiLength}=source.parameters;
 const radius=Math.max(...points.map(p=>p.x));
 const refined=radius>.42&&segments<72?new T.LatheGeometry(points,72,phiStart,phiLength):source;
 const flat=refined.toNonIndexed(),p=flat.attributes.position,n=flat.attributes.normal;
 for(let i=0;i<p.count;i+=3){const y=p.getY(i);
  if(Math.abs(p.getY(i+1)-y)>1e-6||Math.abs(p.getY(i+2)-y)>1e-6)continue;
  const ax=p.getX(i+1)-p.getX(i),az=p.getZ(i+1)-p.getZ(i),bx=p.getX(i+2)-p.getX(i),bz=p.getZ(i+2)-p.getZ(i);
  const area=az*bx-ax*bz;if(Math.abs(area)<1e-12)continue;
  for(let k=0;k<3;k++)n.setXYZ(i+k,0,Math.sign(area),0);
 }
 flat.userData.machinedLathe=true;
 return flat;
}
const g=group(scene);const mechanism=figure.build({THREE:T,g,group,box,cyl,ball,ring,rail,tube,badge,glow,colors});
const refaced=new Map();g.traverse(m=>{if(!m.isMesh||m.geometry.type!=='LatheGeometry')return;const src=m.geometry;if(!refaced.has(src))refaced.set(src,trueLatheFaces(src));m.geometry=refaced.get(src);});
mechanism.update(0,0);g.updateMatrixWorld(true);
const restBounds=new T.Box3().setFromObject(g), bounds=restBounds.clone();
for(const [t,v] of [[.2,.25],[.9,.5],[1.6,.75],[2.2,1],[3.7,1],[4,0]]){mechanism.update(t,v);bounds.union(new T.Box3().setFromObject(g));}
mechanism.update(0,0);g.updateMatrixWorld(true);
const center=bounds.getCenter(new T.Vector3());
const floor=new T.Mesh(new T.PlaneGeometry(42,42),new T.ShadowMaterial({color:0x3c322b,opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=restBounds.min.y-.012;floor.receiveShadow=true;scene.add(floor);
const target=center.clone(); target.y+=.015;
const direct=new T.Vector3(.81,.61,1).normalize();
function fit(reset=false){const w=stage.clientWidth,h=stage.clientHeight,aspect=w/h;if(reset){camera.position.copy(target).addScaledVector(direct,10);orbit.target.copy(target);camera.zoom=1; camera.lookAt(target);orbit.update();}const width=bounds.getSize(new T.Vector3());const dir=camera.position.clone().sub(target).normalize(), right=new T.Vector3().crossVectors(camera.up,dir).normalize(), up=new T.Vector3().crossVectors(dir,right).normalize();let ax=0,ay=0;for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){const p=new T.Vector3(x*width.x/2,y*width.y/2,z*width.z/2);ax=Math.max(ax,Math.abs(p.dot(right)));ay=Math.max(ay,Math.abs(p.dot(up)));} const f=Math.max(ax/aspect/.92,ay/.91);Object.assign(camera,{left:-f*aspect,right:f*aspect,top:f,bottom:-f});camera.updateProjectionMatrix();renderer.setSize(w,h,false);post.resize();dirty=true;}

// One-physical-pixel selective contour pass, using only view normals and depth.
const colorRT=new T.WebGLRenderTarget(1,1,{samples:4});
const normalRT=new T.WebGLRenderTarget(1,1,{minFilter:T.NearestFilter,magFilter:T.NearestFilter});normalRT.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
const surfaceNormal=(opacity)=>new T.MeshNormalMaterial({opacity,transparent:true,blending:T.NoBlending,depthWrite:true});
const inkSolid=surfaceNormal(1),inkFine=surfaceNormal(.60),inkFlat=surfaceNormal(.17);
const inkMeshes=[];
g.traverse(m=>{if(!m.isMesh)return;m.geometry.computeBoundingBox();const b=m.geometry.boundingBox.getSize(new T.Vector3());const mask=m.material.isMeshBasicMaterial?inkFlat:m.material.userData.softInk||Math.min(b.x,b.y,b.z)<.068?inkFine:inkSolid;inkMeshes.push({m,mask,paint:m.material});});
const image=new T.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,uniforms:{paint:{value:colorRT.texture},normals:{value:normalRT.texture},depths:{value:normalRT.depthTexture},pixel:{value:new T.Vector2()}},vertexShader:`varying vec2 st;void main(){st=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`
 varying vec2 st;uniform sampler2D paint,normals,depths;uniform vec2 pixel;
 void main(){vec4 src=texture2D(paint,st);vec4 b=texture2D(normals,st);float d=texture2D(depths,st).r;float e=0.;
 if(b.a>.08){for(int i=0;i<4;i++){vec2 a=i==0?vec2(1.,0.):i==1?vec2(-1.,0.):i==2?vec2(0.,1.):vec2(0.,-1.); vec4 r=texture2D(normals,st+a*pixel);float n=texture2D(depths,st+a*pixel).r;
 float covered=step(.08,r.a);float weight=min(b.a,r.a);
 float shape=(1.-smoothstep(.43,.79,dot(normalize(b.rgb*2.-1.),normalize(r.rgb*2.-1.))))*.57*weight;
 e=max(e,max((1.-covered)*.84*b.a,max(shape,smoothstep(.0013,.004,d-n)*weight*.70)));}}
 vec3 ink=vec3(.045,.031,.026);vec3 color=src.rgb/max(.001,src.a);gl_FragColor=vec4(mix(color,ink,e*.81),src.a);
 #include <colorspace_fragment>
 }`});
const screen=new T.Scene(); screen.add(new T.Mesh(new T.PlaneGeometry(2,2),image));const screenCamera=new T.Camera();
const sizes=new T.Vector2();
const post={resize(){renderer.getDrawingBufferSize(sizes);colorRT.setSize(sizes.x,sizes.y);normalRT.setSize(sizes.x,sizes.y);image.uniforms.pixel.value.set(1/sizes.x,1/sizes.y);},draw(){renderer.setClearColor(0,0);renderer.setRenderTarget(colorRT);renderer.render(scene,camera);floor.visible=false;renderer.shadowMap.autoUpdate=false;for(const o of inkMeshes){o.paint=o.m.material;o.m.material=o.mask;}renderer.setRenderTarget(normalRT);renderer.render(scene,camera);for(const o of inkMeshes)o.m.material=o.paint;renderer.shadowMap.autoUpdate=true;floor.visible=true;renderer.setRenderTarget(null);renderer.render(screen,screenCamera);}};

const button=document.querySelector('#act'),lock=document.querySelector('#lock'),play=document.querySelector('#motion'),status=document.querySelector('#status'),reset=document.querySelector('#reset');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let running=!reduce.matches,on=false,finishing=false,locked=false,phase=0,time=0,dirty=true,last=0,press=null,cursor=0,cycles=0,cycleStage='idle';
const isMoving=()=>on||finishing;
function writeText(node,value){if(node.textContent!==value)node.textContent=value;}
function syncAction(){
 button.setAttribute('aria-pressed',String(on));
 writeText(button,on?(reduce.matches?'Return to rest':'Finish cycle'):finishing?'Resume repeat':figure.verb);
 let label=figure.idle;
 if(isMoving()){label=cycleStage==='active'?figure.active:cycleStage==='returning'?'Returning to rest':cycleStage==='resting'?'Ready for next cycle':figure.verb+'…';if(!running&&!reduce.matches)label='Paused · '+label;}
 writeText(status,label);status.dataset.state=isMoving()?'on':'off';
}
function toggleAction(){
 if(reduce.matches){on=!on;finishing=false;phase=on?1:0;cycleStage=on?'active':'idle';}
 else if(on){on=false;finishing=true;if(!running)setMotion(true);}
 else if(finishing){on=true;finishing=false;if(!running)setMotion(true);}
 else{cursor=0;on=true;cycleStage='outbound';if(!running)setMotion(true);}
 syncAction();dirty=true;
}
function setMotion(value){running=value;play.setAttribute('aria-pressed',String(!running));writeText(play,running?'Pause motion':'Resume motion');syncAction();dirty=true;}
function setLock(value){locked=value;orbit.enableRotate=!value;lock.setAttribute('aria-pressed',String(value));lock.title=value?'Unlock rotation':'Lock rotation';lock.querySelector('path').setAttribute('d',value?'M7 10V7a5 5 0 0 1 10 0v3':'M7 10V7a5 5 0 0 1 9-3');dirty=true;}
button.onclick=toggleAction;lock.onclick=()=>setLock(!locked);play.onclick=()=>setMotion(!running);
reset.onclick=()=>{on=finishing=false;phase=cursor=time=cycles=0;cycleStage='idle';press=null;syncAction();fit(true);};
reduce.addEventListener('change',()=>{reset.onclick();setMotion(!reduce.matches);});
const visible=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)dirty=true;});let inView=true;visible.observe(stage);
const face=new Set(mechanism.hits);
const ray=new T.Raycaster();const pt=new T.Vector2();
function pick(e){const r=canvas.getBoundingClientRect();pt.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);ray.setFromCamera(pt,camera);let node=ray.intersectObject(g,true).find(({object})=>{for(let q=object;q;q=q.parent)if(!q.visible)return false;return true;})?.object;for(;node;node=node.parent)if(face.has(node))return node;return null;}
canvas.addEventListener('pointerdown',e=>{if(e.isPrimary&&e.button===0)press={id:e.pointerId,hit:pick(e),x:e.clientX,y:e.clientY,moved:false};});
const moved=e=>press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>5;
canvas.addEventListener('pointerup',e=>{if(press?.id!==e.pointerId)return;if(press.hit&&!press.moved&&!moved(e)&&pick(e)===press.hit)toggleAction();press=null;});
for(const name of ['pointercancel','lostpointercapture','pointerleave'])canvas.addEventListener(name,e=>{if(press?.id===e.pointerId)press=null;});
canvas.addEventListener('pointermove',e=>{if(press?.id===e.pointerId&&moved(e))press.moved=true;if(!e.buttons)canvas.style.cursor=pick(e)?'pointer':locked?'default':'grab';});
canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)toggleAction();}else if(e.key.toLowerCase()==='r'){reset.click();}else if(e.key.startsWith('Arrow')){e.preventDefault();if(locked)return; const s=new T.Spherical().setFromVector3(camera.position.clone().sub(target));s.theta+=e.key==='ArrowLeft'?-.17:e.key==='ArrowRight'?.17:0;s.phi=T.MathUtils.clamp(s.phi+(e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0),orbit.minPolarAngle,orbit.maxPolarAngle);camera.position.copy(target).add(new T.Vector3().setFromSpherical(s));orbit.update();dirty=true;}});
orbit.addEventListener('change',()=>{dirty=true;});new ResizeObserver(()=>fit()).observe(stage);
setLock(false);setMotion(running);fit(true);
function frame(ms){
 requestAnimationFrame(frame);const dt=Math.min(.100,Math.max(0,(ms-(last||ms))/1000));last=ms;
 const advance=running&&inView&&!document.hidden;
 if(advance){time+=dt;if(isMoving()&&!reduce.matches){
   cursor+=dt;if(cursor>=PERIOD){cycles++;if(finishing){on=finishing=false;cycleStage='idle';cursor=phase=0;syncAction();}else cursor%=PERIOD;}
   if(isMoving()){const pose=cyclePose(cursor);phase=pose.v;if(cycleStage!==pose.stage){cycleStage=pose.stage;syncAction();}}
 }}
 if(dirty||advance){mechanism.update(time,phase);post.draw();dirty=false;}
}
requestAnimationFrame(frame);
if(new URLSearchParams(location.search).get('qa')==='1')window.__atlas={internals:{T,scene,g,camera,renderer,get mechanism(){return mechanism;}},get state(){return {id:figure.id,on,finishing,locked,phase,time,running,cursor,cycles,cycleStage,objects:mechanism.hits.length,coords:camera.position.toArray(),zoom:camera.zoom,draw:renderer.info.render.calls};},period:PERIOD,frameAt(t,time=t){mechanism.update(time,cyclePose(((t%PERIOD)+PERIOD)%PERIOD).v);g.updateMatrixWorld(true);post.draw();},view(x,y,z){camera.position.copy(target).addScaledVector(new T.Vector3(x,y,z).normalize(),10);orbit.update();fit();},hits(){g.updateMatrixWorld(true);const r=canvas.getBoundingClientRect();const bb=new T.Box3().setFromObject(g); return [bb.min.toArray(),bb.max.toArray(),...mechanism.hits.map(o=>{const q=new T.Box3().setFromObject(o).getCenter(new T.Vector3()).project(camera);return [r.left+(q.x+1)*r.width/2,r.top+(1-q.y)*r.height/2];})];},detail(x,y,z,dx,dy,dz,zoom){orbit.target.set(x,y,z);camera.position.copy(orbit.target).addScaledVector(new T.Vector3(dx,dy,dz).normalize(),10);orbit.update();camera.zoom=zoom;camera.updateProjectionMatrix();dirty=true;},construction({negative=false}={}){
 const rows=[];for(const v of [0,.2,.4,.6,.8,1]){mechanism.update(0,v);g.updateMatrixWorld(true);if(negative)mounts.forEach(m=>m.position.z+=.045);
 const badges=inspectBadges(T,g,mounts);if(negative)mounts.forEach(m=>m.position.z-=.045);
 rows.push({v,badges,interfaces:mechanism.measure?.()??[]});}
 mechanism.update(time,phase);g.updateMatrixWorld(true);return rows;
 },showPose(v){running=false;mechanism.update(time,v);g.updateMatrixWorld(true);post.draw();},sweep(){
 const maxes={motion:0,baseDeviation:0,reversible:true,finite:true};
 const meshes=[];g.traverse(o=>{if(o.isMesh)meshes.push(o);});
 const read=(t,v)=>{mechanism.update(t,v);g.updateMatrixWorld(true);return meshes.map(o=>o.matrixWorld.elements.slice());};
 const base=read(0,0),mid=read(0,.5),end=read(0,1);const diff=(a,b)=>Math.max(...a.flatMap((m,i)=>m.map((n,j)=>Math.abs(n-b[i][j]))));
 maxes.motion=Math.max(diff(base,mid),diff(base,end));
 for(let i=0;i<=32;i++){const progressed=i/32;const f=read(i*.047,progressed);if(f.some(m=>m.some(n=>!Number.isFinite(n))))maxes.finite=false;}
 maxes.baseDeviation=diff(base,read(0,0));maxes.reversible=diff(mid,read(0,.5))<1e-7;
 mechanism.update(time,phase);g.updateMatrixWorld(true);return {...maxes,meshes:meshes.length};
 },audit(eps=.006){
 const gap=(a,b)=>Math.max(0,a.min.x-b.max.x,b.min.x-a.max.x,a.min.y-b.max.y,b.min.y-a.max.y,a.min.z-b.max.z,b.min.z-a.max.z);
 const rows=[];for(const v of [0,.5,1]){mechanism.update(0,v);g.updateMatrixWorld(true);
 const ms=[];g.traverse(o=>{if(o.isMesh&&!o.userData.brandDecal){let hidden=false;for(let q=o;q;q=q.parent)if(!q.visible)hidden=true;const b=new T.Box3().setFromObject(o,true);const sz=b.getSize(new T.Vector3());if(!hidden&&Math.min(sz.x+sz.y,sz.y+sz.z,sz.x+sz.z)>1e-4)ms.push({o,b});}});
 const n=ms.length,adj=ms.map(()=>[]);for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(gap(ms[i].b,ms[j].b)<=eps){adj[i].push(j);adj[j].push(i);}
 const floorY=Math.min(...ms.map(m=>m.b.min.y));const comp=new Array(n).fill(-1);let k=0;
 const flood=(starts,id)=>{const st=[...starts];st.forEach(i=>comp[i]=id);while(st.length){const i=st.pop();for(const j of adj[i])if(comp[j]<0){comp[j]=id;st.push(j);}}};
 flood(ms.map((m,i)=>m.b.min.y<floorY+.02?i:-1).filter(i=>i>=0),0);
 const clusters=[];for(let i=0;i<n;i++)if(comp[i]<0){k++;flood([i],k);const idx=[...Array(n).keys()].filter(q=>comp[q]===k);const box=new T.Box3();idx.forEach(q=>box.union(ms[q].b));
  let best=1e9,near=null;for(let q=0;q<n;q++)if(comp[q]!==k){const d=gap(ms[idx[0]].b,ms[q].b);for(const z of idx){const dd=gap(ms[z].b,ms[q].b);if(dd<best){best=dd;near=[ms[z].o,ms[q].o];}}}
  const nm=o=>{let s=o.name||'';for(let q=o.parent;q&&q!==g&&!s;q=q.parent)s=q.name||'';return (o.userData.at||'')+' '+s+'#'+o.material.color.getHexString()+':'+o.geometry.type.replace('Geometry','');};
  clusters.push({n:idx.length,c:box.getCenter(new T.Vector3()).toArray().map(x=>+x.toFixed(2)),s:box.getSize(new T.Vector3()).toArray().map(x=>+x.toFixed(2)),gap:+best.toFixed(3),a:nm(near[0]),b:nm(near[1])});}
 rows.push({v,meshes:n,lost:clusters});}
 mechanism.update(time,phase);g.updateMatrixWorld(true);return rows;},collars(){
 const out=[];const ms=[];g.traverse(o=>{if(o.isMesh&&!o.userData.brandDecal&&!o.userData.cap){let hid=false;for(let q=o;q;q=q.parent)if(!q.visible)hid=true;if(!hid)ms.push(o);}});
 const sides=new Map();ms.forEach(o=>{sides.set(o.material,o.material.side);o.material.side=T.DoubleSide;});
 const rc=new T.Raycaster(),nm=o=>(o.userData.at||'')+'#'+o.material.color.getHexString()+':'+o.geometry.type.replace('Geometry','');
 for(const v of [0,.5,1]){mechanism.update(0,v);g.updateMatrixWorld(true);
 for(const R of ms){const gt=R.o?0:R.geometry.type,pr=R.geometry.parameters||{};let rad,half,axis;
  if(gt==='CylinderGeometry'&&pr.height<Math.max(pr.radiusTop,pr.radiusBottom)*1.2&&pr.radialSegments>=12){rad=Math.min(pr.radiusTop,pr.radiusBottom)*.94;half=pr.height/2;axis=new T.Vector3(0,1,0);}
  else if(gt==='TorusGeometry'){rad=pr.radius;half=pr.tube;axis=new T.Vector3(0,0,1);}else continue;
  const others=ms.filter(o=>o!==R);let faces=0;
  for(const sgn of [1,-1]){let hit=0;for(let a=0;a<8;a++){const th=a*Math.PI/4;const loc=axis.y?new T.Vector3(rad*Math.cos(th),sgn*half,rad*Math.sin(th)):new T.Vector3(rad*Math.cos(th),rad*Math.sin(th),sgn*half);
    const P=loc.applyMatrix4(R.matrixWorld),d=axis.clone().multiplyScalar(sgn).transformDirection(R.matrixWorld);
    rc.set(P.clone().addScaledVector(d,-.06),d);rc.near=0;rc.far=.085;if(rc.intersectObjects(others,false).length)hit++;}
   if(hit>=3)faces++;}
  if(!faces)out.push({v,at:nm(R),c:new T.Box3().setFromObject(R).getCenter(new T.Vector3()).toArray().map(x=>+x.toFixed(2))});}}
 sides.forEach((sd,m)=>m.side=sd);mechanism.update(time,phase);g.updateMatrixWorld(true);return out;},
ends(){
 const out=[];const ms=[];g.traverse(o=>{if(o.isMesh&&!o.userData.brandDecal&&!o.userData.cap){let hid=false;for(let q=o;q;q=q.parent)if(!q.visible)hid=true;if(!hid)ms.push(o);}});
 for(const v of [0,1]){mechanism.update(0,v);g.updateMatrixWorld(true);const bx=ms.map(o=>new T.Box3().setFromObject(o,true));
 ms.forEach((o,i)=>{if(o.geometry.type!=='TubeGeometry')return;const pr=o.geometry.parameters;for(const u of [0,1]){const e=pr.path.getPoint(u).applyMatrix4(o.matrixWorld);const inside=bx.some((b,j)=>j!==i&&b.clone().expandByScalar(-pr.radius*.25).containsPoint(e));
  if(!inside)out.push({v,u,at:(o.userData.at||'')+'#'+o.material.color.getHexString(),e:e.toArray().map(x=>+x.toFixed(2)),r:pr.radius});}});}
 mechanism.update(time,phase);g.updateMatrixWorld(true);return out;},
clash(th=.02){
 const ms=[];g.traverse(o=>{if(o.isMesh&&!o.userData.brandDecal)ms.push(o);});
 const snap=v=>{mechanism.update(0,v);g.updateMatrixWorld(true);return ms.map(o=>{let hid=false;for(let q=o;q;q=q.parent)if(!q.visible)hid=true;return {b:new T.Box3().setFromObject(o,true),m:o.matrixWorld.elements.slice(),hid};});};
 const depth=(a,b)=>Math.min(a.max.x-b.min.x,b.max.x-a.min.x,a.max.y-b.min.y,b.max.y-a.min.y,a.max.z-b.min.z,b.max.z-a.min.z);
 const base=snap(0),out=[];
 for(const v of [.25,.5,.75,1]){const cur=snap(v);const moving=cur.map((c,i)=>c.m.some((n,j)=>Math.abs(n-base[i].m[j])>1e-5));
  for(let i=0;i<ms.length;i++)if(moving[i]&&!cur[i].hid)for(let j=0;j<ms.length;j++){if(moving[j]||cur[j].hid||i===j)continue;const d=depth(cur[i].b,cur[j].b),d0=depth(base[i].b,base[j].b);if(d>th&&d>d0+th)out.push({v,d:+d.toFixed(3),a:(ms[i].userData.at||'')+'#'+ms[i].material.color.getHexString(),b:(ms[j].userData.at||'')+'#'+ms[j].material.color.getHexString()});}}
 mechanism.update(time,phase);g.updateMatrixWorld(true);return out;},motionSignature(){g.updateMatrixWorld(true);const out=[];g.traverse(o=>out.push(...o.matrixWorld.elements,o.visible?1:0));return out.map(n=>Math.round(n*1e4)).join(',');}};
