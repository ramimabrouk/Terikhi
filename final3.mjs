import { chromium } from 'playwright-core';
import fs from 'fs';
const out='C:/Users/LENOVO/AppData/Local/Temp/opencode/r3-verify'; fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const res={};
async function boot(page,w,h,showIntro=false){await page.setViewportSize({width:w,height:h});await page.goto('http://127.0.0.1:4300/',{waitUntil:'networkidle'});await page.evaluate((show)=>show?sessionStorage.removeItem('tunisia-explorer:intro'):sessionStorage.setItem('tunisia-explorer:intro','1'),showIntro);await page.reload({waitUntil:'networkidle'});await wait(2400);}
function labelsEval(){
 const ls=[...document.querySelectorAll('text.map-label')];const rows=ls.map(l=>{const id=l.getAttribute('data-label-city');const path=document.querySelector(`path.gov[data-city="${id}"]`);const bb=l.getBBox();const pts=[[bb.x,bb.y],[bb.x+bb.width,bb.y],[bb.x,bb.y+bb.height],[bb.x+bb.width,bb.y+bb.height],[bb.x+bb.width/2,bb.y],[bb.x+bb.width/2,bb.y+bb.height],[bb.x,bb.y+bb.height/2],[bb.x+bb.width,bb.y+bb.height/2],[bb.x+bb.width/2,bb.y+bb.height/2]];return {id,inside:pts.every(([x,y])=>path.isPointInFill(new DOMPoint(x,y)))};});
 const rects=ls.map(l=>l.getBoundingClientRect());let collisions=0;for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(!(a.right+4<=b.left||a.left>=b.right+4||a.bottom+4<=b.top||a.top>=b.bottom+4))collisions++;}
 const clusters=[...document.querySelectorAll('.cluster-text')].map(c=>({text:c.textContent.trim(),rect:c.getBoundingClientRect()}));
 const sea=document.querySelector('.geo-label--sea')?.getBoundingClientRect();let clusterSeaOverlaps=0;if(sea)for(const c of clusters){const r=c.rect;if(!(r.right+2<=sea.left||r.left>=sea.right+2||r.bottom+2<=sea.top||r.top>=sea.bottom+2))clusterSeaOverlaps++;}
 return {count:ls.length,labels:ls.map(l=>l.textContent.trim()),outside:rows.filter(r=>!r.inside).map(r=>r.id),collisions,clusters:clusters.map(c=>c.text),clusterSeaOverlaps};
}
function foldLines(){const s=document.querySelector('.detail-scroll');const p=document.querySelector('.section-body');if(!s||!p)return null;const sr=s.getBoundingClientRect();const range=document.createRange();range.selectNodeContents(p);const lines=[...range.getClientRects()].filter(r=>r.width>0&&r.top<sr.bottom&&r.bottom>sr.top);return {count:lines.length,scrollTop:+sr.top.toFixed(0),scrollBottom:+sr.bottom.toFixed(0),bodyTop:+p.getBoundingClientRect().top.toFixed(0),lineHeight:getComputedStyle(p).lineHeight,tags:document.querySelectorAll('.known li').length,identity:!!document.querySelector('.identity-bar')};}
function small(){const sel='.eyebrow,.row-num,.row-meta,.row-capital,.row-seen,.chip,.chip-count,.group-head span,.foot-count,.toolbar-meta,.meta-strip dt,.meta-status,.known li,.badge,.map-label,.cluster-text,.tip-region,.tip-cta,.geo-label,.stat-label,.coord,.map-focus-region,.scroll-hint,.index-cue,.identity-region,.identity-stat,.colophon,.brand-sub,.chrome-coord,.search-btn,.map-count em,.map-note,.tl-year,.entry-num,.origin-mark,.si-num,.section-index .eyebrow';return [...document.querySelectorAll(sel)].filter(e=>e.offsetParent!==null||e.ownerSVGElement).map(e=>({cls:e.className?.baseVal??e.className,size:parseFloat(getComputedStyle(e).fontSize),text:(e.textContent||'').trim().slice(0,28)})).filter(x=>x.size<10);}
const page=await browser.newPage({viewport:{width:1440,height:900}});await boot(page,1440,900,false);
res.map=await page.evaluate(labelsEval);
res.water=await page.evaluate(()=>{const st=document.querySelector('.map-stage');const p=document.querySelector('path.region-sud');const rect=document.querySelector('.map-field');return {stage:getComputedStyle(st).backgroundColor,field:rect?.getAttribute('fill'),land:getComputedStyle(p).fill,coast:getComputedStyle(p).stroke};});
await page.screenshot({path:`${out}/01-map-1440.png`});
const nabeul=page.locator('path[data-city="nabeul"]');const nb=await nabeul.boundingBox();if(nb)await page.mouse.move(nb.x+nb.width/2,nb.y+nb.height/2);await wait(300);await page.screenshot({path:`${out}/02-hover-1440.png`});
await page.evaluate(()=>document.activeElement?.blur());for(let i=0;i<8;i++){await page.keyboard.press('Tab');const city=await page.evaluate(()=>document.activeElement?.getAttribute?.('data-city'));if(city)break;}await wait(300);
res.focus=await page.evaluate(()=>{const a=document.activeElement;const p=a instanceof SVGPathElement?a:null;const ring=document.querySelectorAll('.focus-ring path');return {tag:a?.tagName,city:p?.getAttribute('data-city'),focusVisible:p?.matches(':focus-visible'),outline:p?getComputedStyle(p).outlineStyle:null,rings:ring.length,halo:ring[0]?getComputedStyle(ring[0]).stroke:null,line:ring[1]?getComputedStyle(ring[1]).stroke:null,tooltip:!!document.querySelector('.map-tip')};});
await page.screenshot({path:`${out}/03-focus-1440.png`});
const sfax=page.locator('path[data-city="sfax"]');await sfax.click({force:true});await wait(1800);
res.selected=await page.evaluate(()=>{const sel=document.querySelector('.selected-shape');const base=document.querySelector('path.gov.is-selected');return {selected:!!sel,fill:sel?getComputedStyle(sel).fill:null,stroke:sel?getComputedStyle(sel).stroke:null,filter:sel?getComputedStyle(sel).filter:null,baseStroke:base?getComputedStyle(base).stroke:null,focusRing:document.querySelectorAll('.focus-ring path').length,tooltip:!!document.querySelector('.map-tip')};});
res.detail=await page.evaluate(foldLines);
res.statGaps=await page.evaluate(()=>{const cells=[...document.querySelectorAll('.meta-strip > div')];return cells.map((c,i)=>({i,gap:i<cells.length-1?+(cells[i+1].querySelector('dd').getBoundingClientRect().left-c.getBoundingClientRect().right).toFixed(1):null,border:getComputedStyle(c).borderRightWidth}));});
res.smallText=await page.evaluate(small);
res.chrome=await page.evaluate(()=>({header:document.querySelector('.chrome-coord')?.textContent.trim(),footer:document.querySelector('.colophon')?.textContent.replace(/\s+/g,' ').trim(),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,silhouette:!!document.querySelector('.silhouette'),dropcap:!!document.querySelector('.has-dropcap')}));
await page.screenshot({path:`${out}/04-detail-1440.png`});
await page.evaluate(()=>{document.querySelector('.detail-scroll').scrollTop=260;});await wait(500);
res.detailScrolled=await page.evaluate(()=>({identity:document.querySelector('.identity-bar')?.textContent.replace(/\s+/g,' ').trim(),tags:document.querySelectorAll('.known li').length,toolbar:getComputedStyle(document.querySelector('.scroll-hint')).display,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
await page.screenshot({path:`${out}/05-detail-scrolled-1440.png`});
await page.evaluate(()=>document.querySelector('.back-btn')?.click());await wait(900);
res.index=await page.evaluate(()=>{const scroll=document.querySelector('.index-scroll');const sr=scroll.getBoundingClientRect();const heads=[...document.querySelectorAll('.group-head')].map(h=>({text:h.textContent.replace(/\s+/g,' ').trim(),top:h.getBoundingClientRect().top,bottom:h.getBoundingClientRect().bottom}));const cue=document.querySelector('.index-cue');const cr=cue?.getBoundingClientRect();return {heads,cuePos:cue?getComputedStyle(cue).position:null,cueTop:cr?.top,scrollBottom:sr.bottom,lastViewed:!!document.querySelector('.city-row.is-last-viewed'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
await page.screenshot({path:`${out}/06-index-1440.png`});

const mobile=await browser.newPage({viewport:{width:390,height:844}});await boot(mobile,390,844,false);
res.mobileMap=await mobile.evaluate(labelsEval);
await mobile.screenshot({path:`${out}/07-mobile-map-390.png`});
await mobile.evaluate(()=>document.querySelector('.sheet-grab')?.click());await wait(500);await mobile.evaluate(()=>document.querySelectorAll('.city-row')[14]?.click());await wait(1600);
res.mobileDetail=await mobile.evaluate(()=>{const s=document.querySelector('.detail-scroll');const r=document.querySelector('.section-index');const f=document.querySelector('.detail-foot');return {fold:foldLines(),scrollH:s.clientHeight,scrollW:s.scrollWidth,rubricW:r.scrollWidth,rubricClient:r.clientWidth,foot:getComputedStyle(f).gridTemplateColumns,scrollHint:getComputedStyle(document.querySelector('.scroll-hint')).display,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
res.mobileSmall=await mobile.evaluate(small);
await mobile.screenshot({path:`${out}/08-mobile-detail-390.png`});
await mobile.evaluate(()=>{document.querySelector('.detail-scroll').scrollTop=260;});await wait(500);
res.mobileScrolled=await mobile.evaluate(()=>({identity:document.querySelector('.identity-bar')?.textContent.replace(/\s+/g,' ').trim(),tags:document.querySelectorAll('.known li').length}));
await mobile.screenshot({path:`${out}/09-mobile-detail-scrolled-390.png`});

for(const [w,h,name] of [[1440,900,'10-intro-1440'],[390,844,'11-intro-390']]){
 const ip=await browser.newPage({viewport:{width:w,height:h}});await boot(ip,w,h,true);
 res[name]=await ip.evaluate(()=>{const rect=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?{x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1),right:+r.right.toFixed(1),bottom:+r.bottom.toFixed(1)}:null;};const compass=document.querySelector('.compass')?.getBoundingClientRect();const lede=document.querySelector('.intro-lede')?.getBoundingClientRect();const stats=document.querySelector('.stats')?.getBoundingClientRect();const enter=document.querySelector('.enter')?.getBoundingClientRect();const skip=document.querySelector('.skip');const cs=skip?getComputedStyle(skip):null;const circles=[...document.querySelectorAll('.compass circle')].map(c=>({cx:c.getAttribute('cx'),cy:c.getAttribute('cy'),r:c.getAttribute('r')}));return {skip:rect('.skip'),skipBorder:cs?.borderTopWidth,skipDecoration:cs?.textDecorationLine,compass:rect('.compass'),compassInside:compass?compass.left>=0&&compass.right<=innerWidth&&compass.top>=0&&compass.bottom<=innerHeight:false,compassOverLede:compass&&lede?!(compass.right<=lede.left||compass.left>=lede.right||compass.bottom<=lede.top||compass.top>=lede.bottom):false,circles,stats:rect('.stats'),statsX:stats?+stats.x.toFixed(1):null,enter:rect('.enter'),ledeBottom:lede?+lede.bottom.toFixed(1):null,deadGap:lede&&stats?+(stats.top-lede.bottom).toFixed(1):null,metaDot:document.querySelector('.intro-meta-dot')?getComputedStyle(document.querySelector('.intro-meta-dot')).display:null,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
 await ip.screenshot({path:`${out}/${name}.png`});await ip.close();
}
console.log(JSON.stringify(res,null,2));await browser.close();
