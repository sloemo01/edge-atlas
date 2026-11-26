import {createServer} from 'node:http';
import {readFile,readdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const req=createRequire(join(resolve(process.env.ATLAS_QA_MODULES||'.'),'qa-entry.cjs'));
const {chromium}=req('playwright-core'),sharp=req('sharp');
const root=fileURLToPath(new URL('.',import.meta.url));
const work=await mkdtemp(join(tmpdir(),'edge-atlas-captures-'));
const server=createServer(async (r,s)=>{try{const path=join(root,new URL(r.url,'http://localhost').pathname);s.setHeader('content-type',extname(path)==='.html'?'text/html; charset=utf-8':extname(path)==='.webp'?'image/webp':'application/octet-stream');s.end(await readFile(path));}catch{s.statusCode=404;s.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const site=`http://127.0.0.1:${server.address().port}`;
let browser;
const expect=(x,message)=>{if(!x)throw Error(message);};
try{
 browser=await chromium.launch({executablePath:process.env.ATLAS_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 const context=await browser.newContext({viewport:{width:1030,height:760},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await context.newPage(); const messages=[]; page.on('pageerror',e=>messages.push(e.message));page.on('console',c=>{if(c.type()==='error')messages.push(c.text());}); page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ABORTED'))messages.push(`${r.url()} ${r.failure().errorText}`);});
 const state=()=>page.evaluate(()=>window.__atlas.state), sig=()=>page.evaluate(()=>window.__atlas.motionSignature());
 const viewport=page.locator('.stage'), canvas=page.locator('canvas'); const failures=[], sheets=[];
 // Each figure is its own navigation; measure real input, not calls to state setters.
 const assets=(await readdir(join(root,'figures'))).filter(k=>k.endsWith('.html'));const fullCount=assets.length;
 for(const asset of assets.filter(k=>!process.env.ATLAS_ONLY||k===`${process.env.ATLAS_ONLY}.html`)){
  messages.length=0;const id=asset.slice(0,-5);
  try{
   await page.setViewportSize({width:1030,height:760});await page.goto(`${site}/figures/${asset}?qa=1&shot=1`,{waitUntil:'domcontentloaded',timeout:15000});
   await page.waitForFunction(()=>window.__atlas?.state.draw>=1||!document.querySelector('#error').hidden,{timeout:14000}); if(messages.length)throw Error(messages.join('; '));
   expect((await state()).objects>0,`${id}: no pointer targets`);
   const construction=await page.evaluate(()=>window.__atlas.construction());
    for(const {v,badges,interfaces} of construction){
      expect(badges.length===1,`${id}: expected one Edge Atlas mark`);
      for(const b of badges)expect(b.tested>=6&&b.seated===b.tested&&b.blocked===0,`${id}: logo not fully seated at ${v} ${JSON.stringify(b)}`);
      for(const m of interfaces)expect(Number.isFinite(m.value)&&m.value>=(m.min??-Infinity)-1e-6&&m.value<=(m.max??Infinity)+1e-6,`${id}: ${m.name} at ${v} ${JSON.stringify(m)}`);
    }
    if(id==='workers'){
      const fail=await page.evaluate(()=>window.__atlas.construction({negative:true}));
      expect(fail.some(({badges})=>badges.some(b=>b.seated<b.tested)),'Negative badge offset was not detected');
    }
    if(process.env.ATLAS_CONSTRUCTION_ONLY==='1'){console.log(`${id}: six badge/assembly poses PASS`);continue;}
    const sweep=await page.evaluate(()=>window.__atlas.sweep());
   expect(sweep.meshes>=24&&sweep.finite&&sweep.motion>.045&&sweep.baseDeviation<1e-7&&sweep.reversible,`${id}: non-reversible or empty mechanism ${JSON.stringify(sweep)}`);
   const saved=await sig(), idle=await page.locator('#status').textContent();
   const first=await viewport.screenshot({animations:'disabled',omitBackground:true,timeout:12000});
   if(process.env.ATLAS_PREVIEWS==='1'){
    const {data,info:{width,height}}=await sharp(first).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let left=width,top=height,right=0,bottom=0;
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const j=(y*width+x)*4;const [r,g,b,a]=[data[j],data[j+1],data[j+2],data[j+3]];if(a>160&&(Math.max(r,g,b)<178||Math.max(r,g,b)-Math.min(r,g,b)>60)){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
    const pad=Math.round((right-left)*.10);left=Math.max(0,left-pad);top=Math.max(0,top-pad);right=Math.min(width,right+pad);bottom=Math.min(height,bottom+pad);
    const trimmed=await sharp(first).extract({left,top,width:right-left,height:bottom-top}).png().toBuffer();
    const figure=await sharp(trimmed).resize(585,398,{fit:'contain',background:'#ffffff'}).flatten({background:'#ffffff'}).png().toBuffer();
    await sharp({create:{width:620,height:424,channels:3,background:'#ffffff'}}).composite([{input:figure,gravity:'center'}]).webp({quality:89}).toFile(join(root,'previews',`${id}.webp`));
   }
   const stats=await sharp(first).stats();expect(stats.entropy>1.05,`${id}: nearly blank render`);
   await page.locator('#act').click();await page.waitForFunction(before=>window.__atlas.state.phase>.99&&window.__atlas.motionSignature()!==before,saved,{timeout:4000});expect((await page.locator('#status').textContent())!==idle,`${id}: readout unchanged`);
   const activated=await viewport.screenshot();
   await canvas.focus();await canvas.press('Space');await page.waitForFunction(()=>!window.__atlas.state.on&&window.__atlas.state.phase<.01);
   await page.locator('#lock').click();const pose=(await state()).coords.join();await canvas.focus();await canvas.press('ArrowLeft');expect((await state()).coords.join()===pose,`${id}: lock did not block arrows`);
   const box=await canvas.boundingBox();await page.mouse.click(box.x+10,box.y+45);expect(!(await state()).on,`${id}: empty space triggered action`);
   let pointerFound=false;const initial=(await page.evaluate(()=>window.__atlas.hits())).slice(2);
   for(const [a,b] of initial){for(const [x,y] of [[0,0],[18,0],[-18,0],[0,18],[0,-18],[30,8],[-30,-8]]){await page.mouse.move(a+x,b+y);if((await canvas.evaluate(n=>n.style.cursor))==='pointer'){await page.mouse.down();await page.mouse.move(a+x+9,b+y+7);await page.mouse.move(a+x,b+y);await page.mouse.up();expect(!(await state()).on,`${id}: drag returning to the origin activated a part`);await page.mouse.click(a+x,b+y);await page.waitForFunction(()=>window.__atlas.state.on,null,{timeout:3000});pointerFound=true;break;}}if(pointerFound)break;}
   if(!pointerFound){for(let j=1;j<15&&!pointerFound;j++)for(let i=1;i<22&&!pointerFound;i++){await page.mouse.move(box.x+i*box.width/22,box.y+j*box.height/15);if((await canvas.evaluate(n=>n.style.cursor))==='pointer'){await page.mouse.down();await page.mouse.up();await page.waitForFunction(()=>window.__atlas.state.on);pointerFound=true;}}}
   expect(pointerFound,`${id}: no clickable visible part found`);
   await canvas.focus();await canvas.press('r');expect((await state()).locked&&!(await state()).on,`${id}: reset changed lock or failed to reset mechanism`);
   await page.locator('#lock').click();await page.mouse.move(box.x+50,box.y+70);await page.mouse.down();await page.mouse.move(box.x+145,box.y+115,{steps:6});await page.mouse.up();expect((await state()).coords.join()!==pose&&!(await state()).on,`${id}: orbit drag did not rotate independently`);
   await page.evaluate(()=>window.__atlas.view(-1,.55,-.95));const rear=await viewport.screenshot();
   await page.evaluate(()=>{window.__atlas.view(1,.25,.20);window.__atlas.showPose(.55);});const side=await viewport.screenshot();
    await page.evaluate(()=>{window.__atlas.view(.8,.43,-1);window.__atlas.showPose(1);});const activeRear=await viewport.screenshot();
   await page.setViewportSize({width:390,height:800});await page.locator('#reset').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),`${id}: horizontal overflow at phone width`);
   const mobile=await viewport.screenshot();
   const shots=await Promise.all([first,activated,rear,side,activeRear,mobile].map((b)=>sharp(b).resize(246,156,{fit:'contain',background:'#fbfaf6'}).flatten({background:'#fbfaf6'}).png().toBuffer()));
   sheets.push(shots);expect(!messages.length,`${id}: console ${messages.join('; ')}`);console.log(`${id}: renders, part click, state, keyboard, lock, orbit, phone PASS`);
  }catch(e){failures.push(`${id}: ${e.message}`);console.error(failures.at(-1));}
 }
 if(sheets.length){for(let start=0;start<sheets.length;start+=5){const tiles=sheets.slice(start,start+5);const output=process.env.ATLAS_REVIEW_DIR||work;await sharp({create:{width:1476,height:156*tiles.length,channels:3,background:'#fbfaf6'}}).composite(tiles.flatMap((row,j)=>row.map((input,i)=>({input,left:i*246,top:j*156})))).png().toFile(join(output,`review-${start/5+1}.png`));}}
 if(!process.env.ATLAS_ONLY&&process.env.ATLAS_CONSTRUCTION_ONLY!=='1'){await page.goto(`${site}/`+'index.html');expect(await page.locator('.card:visible').count()===fullCount,'Gallery missing some cards');expect(await page.locator('section.group').count()===3,'Gallery category sections missing');expect(await page.locator('#lookup, [data-filter]').count()===0,'Search and filters should be removed');await page.setViewportSize({width:390,height:800});expect(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Gallery phone overflow');await page.locator('.card').first().click();expect(page.url().endsWith('/figures/dns.html'),'Gallery navigation incorrect');console.log('Gallery sections, navigation, and phone width PASS');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1030,height:760});
 const cycleIds=(fullCount>15?['workers','queues','analytics','turnstile','d1','stream','ssl-tls','spectrum','waiting-room','logpush','containers','radar']:['workers','queues','analytics','turnstile']);
 for(const id of cycleIds){try{
  await page.goto(`${site}/figures/${id}.html?qa=1`);
  await page.waitForFunction(()=>window.__atlas?.state.time>0);
  await page.locator('#act').click();
  await page.waitForFunction(()=>{const q=window.__atlas.state;return q.phase>.12&&q.phase<.85&&q.cycleStage==='outbound';});
  await page.locator('#motion').click();const still=await state();const hold=await sig();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  expect(!still.running&&(await state()).cursor===still.cursor&&(await sig())===hold,`${id}: pause did not hold exact pose`);
  await page.locator('#motion').click();
  await page.waitForFunction(()=>window.__atlas.state.cycleStage==='active');
  await page.waitForFunction(()=>{const q=window.__atlas.state;return q.phase<.86&&q.cycleStage==='returning';});
  await page.waitForFunction(()=>window.__atlas.state.cycles>=1&&window.__atlas.state.cycleStage==='outbound');
  await page.locator('#act').click();
  await page.waitForFunction(()=>{const q=window.__atlas.state;return !q.on&&!q.finishing&&q.phase===0&&q.cycles>=2;});
  await page.locator('#lock').click();await page.locator('#reset').click();
  expect((await state()).locked&&(await state()).phase===0,`${id}: reset or lock regression`);
  console.log(`${id}: full forward/return/repeat, exact pause and finish-cycle PASS`);
  }catch(e){console.log(id,'cycle FAIL state',JSON.stringify(await state()));throw e;}
 }
 if(process.env.ATLAS_REVIEW_DIR){await page.screenshot({path:join(process.env.ATLAS_REVIEW_DIR,'figure-page.png')});await page.goto(`${site}/index.html`);await page.locator('.card img').first().evaluate(i=>i.decode());await page.screenshot({path:join(process.env.ATLAS_REVIEW_DIR,'gallery-page.png')});}
 }
 expect(!failures.length,failures.join('\n'));
}finally{await browser?.close();server.close();const check=resolve(work);if(check===work&&check.startsWith(resolve(tmpdir())+'/edge-atlas-captures-'))await rm(check,{recursive:true,force:true});}
