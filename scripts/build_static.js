// Pre-render every route of Seniors of NJ into static HTML with SEO and AI-search metadata.
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs'),path=require('path');
const DIST=process.argv[2], DOMAIN=process.argv[3]||'https://seniorsofnj.com', PORT=8800;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const strip=h=>String(h).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const HUBN={benefits:'Benefits & Money',health:'Health & Medicare',caregiving:'Caregiving',home:'Housing & Legal','things-to-do':'Things to Do',living:'Living Well'};
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`http://localhost:${PORT}/`);await p.waitForFunction(()=>window.__route&&document.querySelector('#app').children.length>0);
 const data=await p.evaluate(async()=>{const j=u=>fetch(u).then(r=>r.json());const files=["benefits","health","caregiving","living","home2","todo2","fun1","fun2","local","new3","programs","howto"];let A=[];for(const f of files){try{A=A.concat(await j('/content/'+f+'.json'))}catch(e){}}const C=await j('/content/counties.json');const X=await j('/content/extras.json');const T=await j('/content/towns.json').catch(()=>[]);const E=await j('/content/es.json').catch(()=>[]);return{t:T.map(x=>({slug:x.slug,name:x.name,county:x.county,countyName:x.countyName,intro:x.intro})),e:E.map(x=>({slug:x.slug,en:x.en,title:x.title,dek:x.dek,seoDesc:x.seoDesc,photo:x.photo,updated:x.updated,faq:x.faq||[]})),a:A.map(x=>({slug:x.slug,title:x.title,dek:x.dek,photo:x.photo,updated:x.updated,hub:x.hub,faq:x.faq||[]})),c:C.map(x=>({slug:x.slug,name:x.name,intro:x.intro})),s:X.steps.map(x=>x.slug),k:X.checklists.map(x=>x.slug)}});
 const AM=Object.fromEntries(data.a.map(a=>[a.slug,a])),CM=Object.fromEntries(data.c.map(c=>[c.slug,c]));
 const routes=['/'].concat(Object.keys(HUBN).map(h=>'/hub/'+h),data.a.map(a=>'/article/'+a.slug),data.s.map(s=>'/steps/'+s),['/counties'],data.c.map(c=>'/county/'+c.slug),['/checker','/dates','/glossary','/directory','/about','/articles'],data.k.map(s=>'/checklist/'+s),['/for/seniors','/for/families','/for/pros'],['/find-help','/find-help/care-managers','/find-help/social-services','/find-help/home-care','/find-help/adult-day','/towns'],data.t.map(t=>'/town/'+t.slug),data.e.length?['/es']:[],data.e.map(e=>'/es/'+e.slug));
 const EM=Object.fromEntries(data.e.map(e=>[e.slug,e])),EN2ES=Object.fromEntries(data.e.map(e=>[e.en,e]));
 const urlOf=r=>DOMAIN+(r==='/'?'/':r+'/');
 const crumbsFor=r=>{const L=[['Home',DOMAIN+'/']];const [,a,b2]=r.split('/');
  if(a==='hub')L.push([HUBN[b2],urlOf(r)]);
  else if(a==='article'&&AM[b2]){L.push([HUBN[AM[b2].hub],urlOf('/hub/'+AM[b2].hub)]);L.push([AM[b2].title,urlOf(r)])}
  else if(a==='county'&&CM[b2]){L.push(['Counties',urlOf('/counties')]);L.push([CM[b2].name,urlOf(r)])}
  else if(a)L.push([null,urlOf(r)]);return L};
 const render=async(r)=>{
  await p.evaluate(r=>{window.__forcePath=r;window.__route()},r);await p.waitForTimeout(50);
  const meta=await p.evaluate(()=>({t:document.title,d:document.querySelector('meta[name="description"]').content,h:(document.querySelector('h1')||{}).textContent||''}));
  let html='<!doctype html>\n'+await p.evaluate(()=>document.documentElement.outerHTML);
  const url=urlOf(r);const slug=r.startsWith('/article/')?r.slice(9):null;const esSlug=r.startsWith('/es/')?r.slice(4):null;const esa=esSlug&&EM[esSlug];const art=(slug&&AM[slug])||(esa?{...esa,hub:(AM[esa.en]||{}).hub}:null);const pairEs=slug&&EN2ES[slug];
  const img=DOMAIN+'/img/og/'+(art?art.photo:'home')+'.jpg';
  const ld=[];
  const cr=crumbsFor(r);if(r!=='/')ld.push({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":cr.map((c,i)=>({"@type":"ListItem","position":i+1,"name":c[0]||meta.h,"item":c[1]}))});
  if(art){ld.push({"@context":"https://schema.org","@type":"Article","headline":art.title,"description":art.dek,"image":img,"dateModified":art.updated,"datePublished":art.updated,"inLanguage":esa?"es-US":"en-US","about":HUBN[art.hub],"author":{"@type":"Organization","name":"Seniors of NJ","url":DOMAIN+'/'},"publisher":{"@type":"Organization","name":"Seniors of NJ","url":DOMAIN+'/',"logo":{"@type":"ImageObject","url":DOMAIN+'/apple-touch-icon.png'}},"mainEntityOfPage":url,"spatialCoverage":{"@type":"State","name":"New Jersey"}});
   if(art.faq.length)ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":art.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":strip(f.a)}}))})}
  if(r==='/'){ld.push({"@context":"https://schema.org","@type":"WebSite","name":"Seniors of NJ","url":DOMAIN+'/',"description":meta.d,"inLanguage":"en-US","potentialAction":{"@type":"SearchAction","target":DOMAIN+'/search/{q}/',"query-input":"required name=q"}});
   ld.push({"@context":"https://schema.org","@type":"Organization","name":"Seniors of NJ","url":DOMAIN+'/',"logo":DOMAIN+'/apple-touch-icon.png',"areaServed":{"@type":"State","name":"New Jersey"}})}
  let tags=`<link rel="canonical" href="${url}">\n<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">\n<meta property="og:type" content="${art?'article':'website'}">\n<meta property="og:site_name" content="Seniors of NJ">\n<meta property="og:locale" content="${esa||r==='/es'?'es_US':'en_US'}">\n<meta property="og:title" content="${esc(meta.t)}">\n<meta property="og:description" content="${esc(meta.d)}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${img}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${esc(meta.h)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(meta.t)}">\n<meta name="twitter:description" content="${esc(meta.d)}">\n<meta name="twitter:image" content="${img}">\n`;
  if(art)tags+=`<meta property="article:modified_time" content="${art.updated}">\n`;
  if(pairEs||esa){const en=urlOf('/article/'+(esa?esa.en:slug)),es=urlOf('/es/'+(esa?esa.slug:pairEs.slug));tags+=`<link rel="alternate" hreflang="en" href="${en}">\n<link rel="alternate" hreflang="es" href="${es}">\n<link rel="alternate" hreflang="x-default" href="${en}">\n`}
  ld.forEach(o=>tags+=`<script type="application/ld+json">${JSON.stringify(o)}</script>\n`);
  html=html.replace(/<link rel="alternate" hreflang[^>]*>\n?/g,'').replace(/<link rel="canonical"[^>]*>\n?/g,'').replace(/<meta name="robots"[^>]*>\n?/g,'').replace(/<meta (property="(og|article):|name="twitter:)[^>]*>\n?/g,'').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g,'').replace(/(<meta name="viewport"[^>]*>)/,m=>m+'\n'+tags);
  const GA='<!-- ga --><script async src="https://www.googletagmanager.com/gtag/js?id=G-CDCV04STJY"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-CDCV04STJY");</script><!-- /ga -->';
  html=html.replace(/<!-- ga -->[\s\S]*?<!-- \/ga -->\n?/g,'').replace(/<script async="" src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/g,'').replace('<head>','<head>\n'+GA);
  return html;
 };
 for(const r of routes){const html=await render(r);const dir=path.join(DIST,r);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html)}
 let nf=await render('/not-found');nf=nf.replace(/<link rel="canonical"[^>]*>\n?/,'').replace(/<meta name="robots"[^>]*>/,'<meta name="robots" content="noindex">');fs.writeFileSync(path.join(DIST,'404.html'),nf);
 const today=new Date().toISOString().slice(0,10);
 const lm=r=>{const s=r.startsWith('/article/')&&AM[r.slice(9)];return s?s.updated:today};
 fs.writeFileSync(path.join(DIST,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(r=>`  <url><loc>${urlOf(r)}</loc><lastmod>${lm(r)}</lastmod></url>`).join('\n')+'\n</urlset>\n');
 fs.writeFileSync(path.join(DIST,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: '+DOMAIN+'/sitemap.xml\n');
 // AI search: llms.txt summary of the site
 const byHub=h=>data.a.filter(a=>a.hub===h).map(a=>`- [${a.title}](${urlOf('/article/'+a.slug)}): ${a.dek}`).join('\n');
 const llms=`# Seniors of NJ\n\n> The home for older adults in New Jersey. Independent, plain-English guides to New Jersey senior benefits (ANCHOR, Senior Freeze, Stay NJ, PAAD, LIHEAP), Medicare, caregiving, housing, things to do and ways to learn, work and meet people. Every guide cites official sources and shows the date it was last updated. Not a government agency.\n\n`+Object.entries(HUBN).map(([h,n])=>`## ${n}\n\n${byHub(h)}`).join('\n\n')+`\n\n## County guides\n\n`+data.c.map(c=>`- [${c.name}](${urlOf('/county/'+c.slug)}): office on aging, senior transportation and places to go`).join('\n')+`\n\n## Tools\n\n- [Benefits checker](${urlOf('/checker')}): six questions to see which New Jersey programs may fit\n- [Key dates](${urlOf('/dates')}): deadlines and enrollment windows\n- [Phone directory](${urlOf('/directory')}): official offices that help older adults\n- [Glossary](${urlOf('/glossary')}): plain-English definitions\n`;
 fs.writeFileSync(path.join(DIST,'llms.txt'),llms+`\n## Find care help\n\n- [Find care help in New Jersey](${DOMAIN}/find-help/): geriatric care managers, social workers, home care agencies and adult day programs with phone numbers\n- [Geriatric care managers](${DOMAIN}/find-help/care-managers/)\n- [Social workers and family services](${DOMAIN}/find-help/social-services/)\n- [Home care agencies](${DOMAIN}/find-help/home-care/)\n- [Adult day programs](${DOMAIN}/find-help/adult-day/)\n`+(data.t.length?`\n## Town guides\n\n`+data.t.map(t=>`- [Seniors in ${t.name}, NJ](${DOMAIN}/town/${t.slug}/): senior center, rides, library and outings in ${t.countyName}`).join('\n')+'\n':'')+(data.e.length?`\n## En español\n\n`+data.e.map(e=>`- [${e.title}](${DOMAIN}/es/${e.slug}/): ${e.dek}`).join('\n')+'\n':''));
 fs.writeFileSync(path.join(DIST,'_redirects'),'/search/*  /index.html  200\n');
 console.log(routes.length,'pages',errs.slice(0,3));
 await b.close();
})();
