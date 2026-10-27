// Branded 1200x630 share thumbnails, one per page. Cached in src/img/og/p by a hash of photo + headline.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const VER='v1';
const FALLBACK={'/':'couple-walking','/counties':'main-street','/towns':'main-street','/checker':'paperwork','/dates':'paperwork','/glossary':'library','/directory':'phone-call','/about':'couple-walking','/articles':'library','/es':'kitchen','/for/seniors':'friends-coffee','/for/families':'grandparent-child','/for/pros':'doctor','/find-help':'hands-holding','/find-help/care-managers':'kitchen','/find-help/social-services':'friends-coffee','/find-help/home-care':'volunteers','/find-help/adult-day':'cards-chess'};
const HEAD={'/':'The home for older adults in New Jersey.'};
module.exports=async(browser,DIST,list)=>{
 const SRC=path.join(__dirname,'..','src','img','og','p');fs.mkdirSync(SRC,{recursive:true});fs.mkdirSync(path.join(DIST,'img','og','p'),{recursive:true});
 const F=path.join(__dirname,'og-fonts');const font=f=>'data:font/woff2;base64,'+fs.readFileSync(path.join(F,f)).toString('base64');
 const css=`@font-face{font-family:B;font-weight:800;src:url(${font('bricolage-grotesque-latin-800-normal.woff2')})}@font-face{font-family:F;font-weight:800;src:url(${font('figtree-latin-800-normal.woff2')})}@font-face{font-family:F;font-weight:600;src:url(${font('figtree-latin-600-normal.woff2')})}`;
 const logo=fs.readFileSync(path.join(DIST,'favicon.svg'),'utf8');
 const manPath=path.join(SRC,'manifest.json');let man={};try{man=JSON.parse(fs.readFileSync(manPath,'utf8'))}catch(e){}
 const p=await browser.newPage({viewport:{width:1200,height:630}});let made=0;const keep=new Set(['manifest.json']);
 for(const o of list){
  const pk=o.pk||FALLBACK[o.r]||(o.r.startsWith('/county/')?'main-street':'couple-walking');const photo=FALLBACK[o.r]&&o.r==='/'?FALLBACK['/']:pk;
  const h=(HEAD[o.r]||o.h||'Seniors of NJ').replace(/\s+/g,' ').trim();
  const key=crypto.createHash('sha1').update(VER+photo+h).digest('hex').slice(0,12);const file=o.name+'.jpg';keep.add(file);
  const out=path.join(SRC,file);
  if(man[file]!==key||!fs.existsSync(out)){
   const img='data:image/jpeg;base64,'+fs.readFileSync(path.join(DIST,'img',photo+'.jpg')).toString('base64');
   await p.setContent(`<html><head><style>${css}body{margin:0;width:1200px;height:630px;display:flex;background:#FAF7F2;color:#1E2A33}
.l{width:590px;box-sizing:border-box;padding:56px 50px 52px 60px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:14px;font:800 34px F}.brand svg{width:58px;height:58px}
.hw{flex:1;display:flex;align-items:center}.h{font:800 56px/1.08 B;letter-spacing:-.01em}.bar{width:64px;height:6px;border-radius:3px;background:#BF5530}
.r{flex:1;background:url(${img}) center/cover}</style></head><body><div class="l"><div class="brand">${logo}<span>Seniors of NJ</span></div><div class="hw"><div class="h" id="h">${h.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div></div><div class="bar"></div></div><div class="r"></div></body></html>`);
   await p.evaluate(()=>document.fonts.ready);
   await p.evaluate(()=>{const e=document.getElementById('h');let s=56;while(s>32&&(e.scrollHeight>360||e.scrollWidth>480)){s-=2;e.style.fontSize=s+'px'}});
   await p.screenshot({path:out,type:'jpeg',quality:72});man[file]=key;made++;
  }
  fs.copyFileSync(out,path.join(DIST,'img','og','p',file));
 }
 for(const f of fs.readdirSync(SRC))if(!keep.has(f)){fs.unlinkSync(path.join(SRC,f));delete man[f]}
 fs.writeFileSync(manPath,JSON.stringify(man,null,0));await p.close();console.log('og cards',list.length,'made',made);
};
