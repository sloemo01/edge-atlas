import {createServer} from 'node:http';
import {readFile,readdir,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {join,extname} from 'node:path';
import {createRequire} from 'node:module';const {chromium}=createRequire(join(process.env.ATLAS_QA_MODULES||'.','x.cjs'))('playwright-core');
const root=new URL('.',import.meta.url).pathname.replace(/\/$/,''), out=join(root,'media'), S=+(process.env.SIZE||1080), FPS=30, CYCLES=2;
await mkdir(out,{recursive:true});
const server=createServer(async (r,s)=>{try{const path=join(root,new URL(r.url,'http://x').pathname);s.setHeader('content-type',extname(path)==='.html'?'text/html; charset=utf-8':'application/octet-stream');s.end(await readFile(path));}catch{s.statusCode=404;s.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const site=`http://127.0.0.1:${server.address().port}`;
const args=process.env.SWIFT?['--enable-unsafe-swiftshader','--use-angle=swiftshader']:['--use-angle=metal','--enable-gpu'];
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args});
const page=await browser.newPage({viewport:{width:S,height:S},deviceScaleFactor:1,reducedMotion:'reduce'});
page.on('pageerror',e=>console.log('ERR',e.message));
const ids=(await readdir(join(root,'figures'))).filter(k=>k.endsWith('.html')).map(k=>k.slice(0,-5)).filter(k=>!process.env.ONLY||process.env.ONLY.split(',').includes(k));
for(const id of ids){
 const t0=Date.now();
 await page.goto(`${site}/figures/${id}.html?qa=1&shot=1`,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__atlas?.state.draw>=1,{timeout:30000});
 await page.addStyleTag({content:'.site-header,.crumbs,nav,.side,.viewer-foot,.viewer header,.pager,footer,.card>header{display:none!important}.stage{position:fixed!important;inset:0!important;height:100vh!important;width:100vw!important;z-index:99;border:0!important;background:#fff!important}'});
 await page.evaluate(()=>{const m=document.querySelector('#motion');if(window.__atlas.state.running)m.click();window.dispatchEvent(new Event('resize'));});
 await page.waitForTimeout(600);
 await page.evaluate(([fill])=>{const a=window.__atlas,{T,g,camera:c}=a.internals;a.view(...a.state.coords);c.updateMatrixWorld(true);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(let k=0;k<=12;k++){a.frameAt(k/12*a.period);g.updateMatrixWorld(true);g.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new T.Box3().setFromObject(o);if(b.isEmpty())return;for(const X of [b.min.x,b.max.x])for(const Y of [b.min.y,b.max.y])for(const Z of [b.min.z,b.max.z]){const v=new T.Vector3(X,Y,Z).project(c);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}});}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,ext=Math.max(x1-x0,y1-y0)/2;
  const hw=(c.right-c.left)/2/c.zoom,hh=(c.top-c.bottom)/2/c.zoom;
  const r=new T.Vector3().setFromMatrixColumn(c.matrixWorld,0),u=new T.Vector3().setFromMatrixColumn(c.matrixWorld,1);
  c.position.addScaledVector(r,cx*hw).addScaledVector(u,cy*hh-.03*hh);c.zoom*=fill/ext;c.updateProjectionMatrix();c.updateMatrixWorld(true);
 },[+(process.env.FILL||.88)]);
 const n=Math.round(await page.evaluate(()=>window.__atlas.period)*FPS*CYCLES);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-vf',`scale=${S}:${S}:flags=lanczos,format=yuv420p`,'-c:v','libx264','-preset','slow','-crf','18','-movflags','+faststart','-an',join(out,`${id}.mp4`)],{stdio:['pipe','inherit','inherit']});
 for(let i=0;i<n;i++){
  const url=await page.evaluate(([t,L,F])=>{const c=document.querySelector('canvas'),o=window.__o||(window.__o=document.createElement('canvas'));o.width=c.width;o.height=c.height;const x=o.getContext('2d');x.globalAlpha=1;x.fillStyle='#fff';x.fillRect(0,0,o.width,o.height);window.__atlas.frameAt(t);x.drawImage(c,0,0);
  // Fade idle wobble into the t-L timeline so the last frame flows into frame 0 seamlessly.
  const w=Math.max(0,(t-(L-F))/F);if(w>0){const u=w*w*(3-2*w);const b=window.__b||(window.__b=document.createElement('canvas'));b.width=c.width;b.height=c.height;const y=b.getContext('2d');y.fillStyle='#fff';y.fillRect(0,0,b.width,b.height);window.__atlas.frameAt(t,t-L);y.drawImage(c,0,0);x.globalAlpha=u;x.drawImage(b,0,0);x.globalAlpha=1;}
  return o.toDataURL('image/jpeg',.95);},[i/FPS,n/FPS,.8]);
  if(!ff.stdin.write(Buffer.from(url.slice(23),'base64')))await new Promise(r=>ff.stdin.once('drain',r));
 }
 const seam=await page.evaluate(([a])=>{const c=document.querySelector('canvas'),grab=t=>{window.__atlas.frameAt(t);const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const x=o.getContext('2d');x.drawImage(c,0,0);return x.getImageData(0,0,o.width,o.height).data;};const A=grab(0),B=grab(a);let d=0,k=0;for(let i=0;i<A.length;i+=4)if(Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2])>30)k++;return (k/(A.length/4)*100).toFixed(3);},[n/FPS]);
 ff.stdin.end();await new Promise(r=>ff.on('close',r));
 console.log(id,n,'frames','seam%',seam,((Date.now()-t0)/1000).toFixed(1)+'s');
}
await browser.close();server.close();
