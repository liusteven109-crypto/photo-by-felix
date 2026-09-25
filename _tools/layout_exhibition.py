"""Render curated works. Layouts define scale and reading order; CSS is hand-authored."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'window-light'
photos=json.loads((OUT/'photos.js').read_text().removeprefix('const PHOTOS = ').strip().removesuffix(';'))
by={p['id']:p for p in photos}
# layout, IDs in reading order, optional series title and anchor
chapters=[
('landscape','风景','Land & distance','先看见远方。','海天的边界，山野的呼吸。<br>目光从辽阔处出发。',[
('horizon',['01','25'],'',''),('diptych',['04','27'],'',''),('dialogue',['06','28'],'',''),
('triptych',['69','70','71'],'田野与石巷 / 沿途的风景','fields-and-lanes')]),
('human','人文','Life & encounters','走进生活之中。','走过田间与街巷，靠近平凡日子。<br>那些笑声，让风景有了温度。',[
('fieldnotes',['17','29','30'],'在日常的缝隙里',''),('dialogue reverse',['18','12'],'',''),
('play',['14','15','31','16'],'游乐，永远是彩色的',''),('portrait-pair',['11','13'],'亲密的距离',''),
('stack',['49','48','32'],'风里的童年 / 露营日记','childhood'),
('childhood',['61','57','58','59','60'],'湖畔的童年 / 七个晴日片刻','lakeside'),('diptych',['62','63'],'',''),
('horizon',['52','53'],'岁月欢聚 / 生日记忆','celebrations')]),
('light','光影','Light & form','等一束光经过。','光照亮的，也是暗处留下的。<br>在窗格、回廊与倒影之间停一停。',[
('solo',['03'],'',''),('triptych',['33','34','35'],'光，塑造空间',''),('portrait-pair',['07','36'],'',''),
('portrait-pair reverse',['47','37'],'身影与重叠',''),('vertical-duet',['64','68'],'','')]),
('portrait','人像','People & intimacy','最后，回到目光。','一场相逢，一次回望。<br>镜头的终点，是身旁的人。',[
('portrait-pair feature',['23','22'],'窗光肖像 / 五个片刻','portrait-series-0'),('triptych',['02','20','21'],'',''),
('vertical-duet',['05','38'],'海风经过的时候',''),('wedding',['08','09','39'],'相逢 / 婚礼记忆','portrait-series-2'),
('triptych',['56','65','67'],'在路上的笑容 / 草原与花田','travel-portraits'),
('portrait-pair',['41','54'],'家的温度 / 六幅亲密日常','family'),('diptych',['43','55'],'',''),
('scrapbook',['45','46'],'家庭手记 / 两幅拼贴','family-notes')])]
ids=[id for ch in chapters for s in ch[5] for id in s[1]]
assert len(ids)==len(set(ids))==len(photos), 'Each photograph must appear exactly once'
assert set(ids)==set(by), 'Layout must preserve the curated selection'
indexes={id:i+1 for i,id in enumerate(ids)}
def card(id,hero=False):
 p=by[id];ratio=p['original_width']/p['original_height'];tw=round(900*min(1,ratio));fw=round(1800*min(1,ratio))
 orientation='vertical' if ratio<1 else 'horizontal';load='fetchpriority="high"' if hero else 'loading="lazy"'
 return f'''<figure class="{'cover-card' if hero else 'work-card'} {orientation}" id="{'cover' if hero else 'work'}-{id}">
<a class="photo-link" data-photo="{id}" href="{p['src']}" aria-label="查看作品：{escape(p['title'])}"><img src="{p['src'] if hero else p['thumb']}" srcset="{p['thumb']} {tw}w, {p['src']} {fw}w" sizes="(max-width: 600px) 92vw, (max-width: 1000px) 65vw, 850px" width="{p['original_width']}" height="{p['original_height']}" alt="{escape(p['description'])}" {load} decoding="async"></a>
<figcaption><span class="work-index">{indexes[id]:02d}</span><span>{escape(p['title'])}</span><span class="view-mark" aria-hidden="true">↗</span></figcaption></figure>'''
sections=[];nav=[]
for n,(key,name,en,title,intro,spreads) in enumerate(chapters,1):
 count=sum(len(s[1]) for s in spreads)
 nav.append(f'<a href="#{key}"><span>0{n}</span>{name}<small>{count:02d}</small></a>')
 sections.append(f'''<section class="exhibition-chapter {'dark-chapter' if key=='light' else ''}" id="{key}" aria-labelledby="heading-{key}"><div class="chapter-inner">
<header class="chapter-heading"><div class="chapter-number" aria-hidden="true">0{n}</div><div class="chapter-title"><p class="kicker">{escape(en)} / {count:02d} works</p><h3 id="heading-{key}">{name}<span>{title}</span></h3></div><p class="chapter-intro">{intro}</p></header>''')
 for si,(layout,works,label,anchor) in enumerate(spreads):
  if label:sections.append('<h4 class="series-label"'+(f' id="{anchor}"' if anchor else '')+f'><span>{label}</span><span aria-hidden="true">—</span></h4>')
  sections.append(f'<div class="spread {layout}" data-spread="{key}-{si+1}">')
  sections += [card(id) for id in works]
  if layout=='solo':sections.append('<p class="margin-note"><span>光落之处</span>有光的地方，<br>也有安静。<small>LIGHT, AND THE SILENCE<br>AROUND IT.</small></p>')
  if layout=='scrapbook':sections.append('<p class="margin-note"><span>写在日常的页边</span>把很小的瞬间，<br>留得久一点。<small>NOTES ON EVERYDAY LIFE</small></p>')
  sections.append('</div>')
 sections.append('</div></section>')
template=(ROOT/'_tools/exhibition.html').read_text()
for name,value in {'VERSION':'20260925-landscapes','TOTAL':str(len(ids)),'COVER_LAND':card('01',True),'COVER_PORTRAIT':card('23',True),'NAV':'\n'.join(nav),'CHAPTERS':'\n'.join(sections)}.items():template=template.replace('{{'+name+'}}',value)
(OUT/'index.html').write_text(template)
(OUT/'photos.js').write_text('const PHOTOS = '+json.dumps([by[id] for id in ids],ensure_ascii=False,indent=2)+';\n')
print(f'Rendered {len(ids)} works in {sum(len(c[5]) for c in chapters)} editorial spreads.')
