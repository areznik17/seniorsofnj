// Pre-render every route of Seniors of NJ into static HTML with SEO tags.
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs'),path=require('path');
const DIST=process.argv[2], DOMAIN=process.argv[3]||'https://seniorsofnj.com';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8800/');await p.waitForFunction(()=>window.__route&&document.querySelector('#app').children.length>0);
 const data=await p.evaluate(async()=>{const j=u=>fetch(u).then(r=>r.json());const files=["benefits","health","caregiving","living","home2","todo2","fun1","fun2","local"];let A=[];for(const f of files){try{A=A.concat(await j('/content/'+f+'.json'))}catch(e){}}const C=await j('/content/counties.json');const X=await j('/content/extras.json');return{a:A.map(x=>({slug:x.slug,title:x.title,dek:x.dek,photo:x.photo,updated:x.updated})),c:C.map(x=>x.slug),s:X.steps.map(x=>x.slug),k:X.checklists.map(x=>x.slug)}});
 const AM=Object.fromEntries(data.a.map(a=>[a.slug,a]));
 const routes=['/'].concat(['benefits','health','caregiving','home','things-to-do','living'].map(h=>'/hub/'+h),data.a.map(a=>'/article/'+a.slug),data.s.map(s=>'/steps/'+s),['/counties'],data.c.map(s=>'/county/'+s),['/checker','/dates','/glossary','/directory','/about','/articles'],data.k.map(s=>'/checklist/'+s),['/for/seniors','/for/families','/for/pros']);
 const render=async(r)=>{
  await p.evaluate(r=>{window.__forcePath=r;window.__route()},r);await p.waitForTimeout(50);
  const meta=await p.evaluate(()=>({t:document.title,d:document.querySelector('meta[name="description"]').content}));
  let html='<!doctype html>\n'+await p.evaluate(()=>document.documentElement.outerHTML);
  const url=DOMAIN+(r==='/'?'/':r+'/');const slug=r.startsWith('/article/')?r.slice(9):null;const art=slug&&AM[slug];
  const img=DOMAIN+'/img/'+(art?art.photo:'shore-lighthouse')+'.jpg';
  let tags=`<link rel="canonical" href="${url}">\n<meta property="og:type" content="${art?'article':'website'}">\n<meta property="og:site_name" content="Seniors of NJ">\n<meta property="og:title" content="${esc(meta.t)}">\n<meta property="og:description" content="${esc(meta.d)}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${img}">\n<meta name="twitter:card" content="summary_large_image">\n`;
  if(art)tags+=`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":art.title,"description":art.dek,"image":img,"dateModified":art.updated,"datePublished":art.updated,"author":{"@type":"Organization","name":"Seniors of NJ"},"publisher":{"@type":"Organization","name":"Seniors of NJ"},"mainEntityOfPage":url})}</script>\n`;
  if(r==='/')tags+=`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"WebSite","name":"Seniors of NJ","url":DOMAIN+'/',"potentialAction":{"@type":"SearchAction","target":DOMAIN+'/search/{q}/',"query-input":"required name=q"}})}</script>\n`;
  html=html.replace(/<link rel="canonical"[^>]*>\n?/g,'').replace(/<meta (property="og:|name="twitter:)[^>]*>\n?/g,'').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g,'').replace(/(<meta name="viewport"[^>]*>)/,'$1\n'+tags);
  return html;
 };
 for(const r of routes){const html=await render(r);const dir=path.join(DIST,r);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html)}
 fs.writeFileSync(path.join(DIST,'404.html'),await render('/not-found'));
 const today=new Date().toISOString().slice(0,10);
 fs.writeFileSync(path.join(DIST,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(r=>`  <url><loc>${DOMAIN}${r==='/'?'/':r+'/'}</loc><lastmod>${today}</lastmod></url>`).join('\n')+'\n</urlset>\n');
 fs.writeFileSync(path.join(DIST,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+DOMAIN+'/sitemap.xml\n');
 fs.writeFileSync(path.join(DIST,'_redirects'),'/search/*  /index.html  200\n');
 console.log(routes.length,'pages',errs.slice(0,3));
 await b.close();
})();
