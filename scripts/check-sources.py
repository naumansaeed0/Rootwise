"""Read source pages for editorial review. No source text is published or copied."""
import json,urllib.request,concurrent.futures,re,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
plants=json.loads((root/'src/data/plants.json').read_text())
def check(p):
 url=p['sources'][0]['url']
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Rootwise source verification'})
  with urllib.request.urlopen(req,timeout=25) as r: raw=r.read().decode(); final=r.url
  raw=re.sub(r'<(script|style)[\s\S]*?</\1>','',raw)
  txt=re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',raw))
  start=txt.find('Description')
  excerpt=txt[max(0,start):max(0,start)+9500]
  return dict(plant=p['commonName'],url=url,finalUrl=final,status='read',excerpt=excerpt)
 except Exception as e:return dict(plant=p['commonName'],url=url,status='failed',error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(check,plants))
pathlib.Path('/tmp/rootwise-source-review.json').write_text(json.dumps(results,indent=2))
for r in results:print(r['plant'],r['status'],r.get('error',''))
