#!/bin/bash
# Build the deployable Seniors of NJ static site from /home/claude/seniors-of-nj/v2
set -e
SP=/tmp/claude-0/-home-claude/427d6a4c-823a-51e6-b228-41c85e4eaf89/scratchpad; D=$(cd $(dirname $0)/.. && pwd)/site; SRC=$(cd $(dirname $0)/.. && pwd)/src
find $D -mindepth 1 -delete 2>/dev/null || mkdir -p $D
cp -r $SRC/content $SRC/img $D/; rm -f $D/content/*.md
cp $SRC/google*.html $SRC/BingSiteAuth.xml $SRC/CNAME $SRC/.nojekyll $D/ 2>/dev/null || true
python3 - "$SRC" "$D" <<'PY'
import re,sys
src,D=sys.argv[1],sys.argv[2]
s=open(src+'/index.html').read()
logo=re.search(r'<svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true">.*?</svg>',s,re.S).group(0)
fav=logo.replace('width="38" height="38" viewBox="0 0 48 48" aria-hidden="true"','xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"').replace('var(--blue)','#1F4E8C').replace('var(--buff)','#F0E6D6').replace('var(--red)','#BF5530')
open(D+'/favicon.svg','w').write(fav)
open(D+'/icon-full.svg','w').write(re.sub(r'rx="[0-9.]+"','rx="0"',fav,count=1))
open(D+'/site.webmanifest','w').write('{"name":"Seniors of NJ","short_name":"Seniors of NJ","start_url":"/","display":"browser","background_color":"#FAF7F2","theme_color":"#1F4E8C","icons":[{"src":"/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"/icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}')
head='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#FAF7F2">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
<script>window.SON_STATIC=1</script>
'''
i=s.index('</style>')+8
open(D+'/index.html','w').write(head+s[:i]+'\n</head>\n<body>\n'+s[i:]+'\n</body>\n</html>\n')
PY
node -e "
const {chromium}=require('/opt/npm-tools/node_modules/playwright');(async()=>{const b=await chromium.launch();for(const [f,o] of [['favicon.svg','icon-512.png'],['icon-full.svg','icon-maskable-512.png']]){const p=await b.newPage({viewport:{width:512,height:512}});await p.goto('file://$D/'+f);await p.screenshot({path:'$D/'+o,omitBackground:true});await p.close()}await b.close()})()"
curl -s -o /dev/null localhost:8800/ || (cd $D && nohup python3 -m http.server 8800 >/dev/null 2>&1 &) ; sleep 1
node $(dirname $0)/build_static.js $D ${DOMAIN:-https://seniorsofnj.com}
python3 -c "
from PIL import Image
im=Image.open('$D/icon-512.png').convert('RGBA');full=Image.open('$D/icon-maskable-512.png').convert('RGBA')
for n in (32,48,192): im.resize((n,n),Image.LANCZOS).save('$D/'+('favicon-%d.png'%n if n<100 else 'icon-%d.png'%n))
bg=Image.new('RGB',(512,512),'#1F4E8C');bg.paste(full,(0,0),full);bg.resize((180,180),Image.LANCZOS).save('$D/apple-touch-icon.png')
im.save('$D/favicon.ico',sizes=[(16,16),(32,32),(48,48)])
"
