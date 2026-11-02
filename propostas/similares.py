"""Regera o bloco "similares à atual" (CSS, seletor e índice) a partir de SIMILARES. Roda dentro de propostas/.
Cada paleta: 9 cores na ordem dos papéis da atual, aplicadas puras; só o texto escolhe branco ou quase preto."""
import colorsys, html, json, re

T = '#121821'
SIMILARES = {
 'arctic': ('Arctic Innovation', 'Direções', 'tecnológica, contemporânea e sofisticada', '#3659A8 #5279C7 #34465F #48A6B8 #347F91 #69977B #A1B78B #D5B96A #D88B62'),
 'botanical': ('Botanical Tech', 'Direções', 'tecnologia com natureza, saúde e bem-estar', '#426B91 #557F9C #3C5360 #58A5A0 #39877E #6D9B62 #A0B77A #D6B77D #C98C69'),
 'digital': ('Digital Spectrum', 'Direções', 'mais ousada, jovem e com personalidade digital', '#514B9A #6D62B7 #383D62 #627FC0 #478FAF #5B9B89 #9BB65D #D4A65A #D77C58'),
 'mineral': ('Mineral Balance', 'Direções', 'elegante, equilibrada e institucional', '#536D8A #71879C #414D5C #6C9B9D #527E83 #829B78 #B0B68A #D1B58B #C58F79'),
 'aurora': ('Aurora Spectrum', 'Direções', 'mais expressiva, luminosa e diferenciada', '#465FAD #6577C5 #39466F #55A7C9 #4B8FAD #73A66E #B0C36A #E0C16A #E39A60'),
 'v-pastel': ('Pastel / Suave', 'Variações da atual', 'mais leve e moderna, menos agressiva aos olhos', '#5EB1EC #4FA1D6 #537B93 #64D5E2 #51B5C7 #96C96C #C3DC63 #FFCD43 #FBB846'),
 'v-neon': ('Neon / Alta saturação', 'Variações da atual', 'mais enérgica, para destacar muito a atenção', '#0095FF #009AE5 #1E465E #00D9F0 #00ADC9 #7ED13B #C6EC2A #FFCB00 #FFAC12'),
 'v-corporativa': ('Corporativa / Sóbria', 'Variações da atual', 'amarelo e verde menos vibrantes, tom mais sério', '#106FA8 #0A6E9B #244052 #0AA2B2 #098296 #608F37 #95AF2D #D6A111 #D18B17'),
 'v-retro': ('Retrô / Vintage', 'Variações da atual', 'tons levemente queimados, menos digitais', '#247BB6 #1B7AA3 #3C5463 #26A3B0 #228696 #6D9747 #A1B93F #E4B127 #DB992B'),
 'v-minimalista': ('Minimalista', 'Variações da atual', 'peso nos azuis e cianos; amarelo e laranja só como destaque', '#0B73BF #036E9E #253B47 #00A9BA #03889D #5F9E2C #A1C21F #E0A80D #DE9314'),
 'i-nebula': ('Nebula Tech', 'Paletas de IA', 'tecnologia de ponta com energia e criatividade', '#4F46E5 #3B82F6 #0F172A #06B6D4 #0891B2 #84CC16 #BEF264 #F59E0B #F97316'),
 'i-horizon': ('AI Horizon', 'Paletas de IA', 'equilíbrio entre inovação e bem-estar', '#2563EB #0EA5E9 #1D4ED8 #14B8A6 #0F766E #65A30D #A3E635 #FBBF24 #F97316'),
 'i-quantum': ('Quantum Flow', 'Paletas de IA', 'inteligência, fluidez e performance', '#0B63CE #0066B3 #1E293B #00D1D1 #0EA5A4 #22C55E #A7F3D0 #F59E0B #FB923C'),
 'i-infinity': ('Infinity Gradient', 'Paletas de IA', 'design arrojado com gradientes de impacto', '#6366F1 #8B5CF6 #312E81 #06B6D4 #0891B2 #84CC16 #D9F99D #F59E0B #F97316'),
 'i-aurora': ('Tech Aurora', 'Paletas de IA', 'tecnologia, clareza e um futuro mais aberto', '#1E40AF #0EA5E9 #075985 #14B8A6 #0F766E #86EFAC #FDE68A #F59E0B #EA580C'),
 'j-aurora-code': ('Aurora Code', 'Paletas de IA · 2', 'tecnologia e criatividade em perfeita harmonia', '#6366F1 #4F46E5 #312E81 #06B6D4 #0891B2 #22C55E #84CC16 #F59E0B #F97316'),
 'j-sage': ('Sage Flow', 'Paletas de IA · 2', 'equilíbrio entre inovação, natureza e tecnologia (sem azul: o verde-petróleo faz marca e navy)', '#0F766E #14B8A6 #0F766E #06B6D4 #14B8A6 #65A30D #84CC16 #FBBF24 #F97316'),
 'j-quantum-blue': ('Quantum Blue', 'Paletas de IA · 2', 'performance e inovação em alto nível', '#0EA5E9 #0284C7 #0F172A #22D3EE #06B6D4 #10B981 #84CC16 #FBBF24 #FB923C'),
 'j-prism': ('Prism Tech', 'Paletas de IA · 2', 'clareza, inovação e impacto real (violeta no lugar do navy)', '#4F46E5 #8B5CF6 #7C3AED #06B6D4 #14B8A6 #8ACC15 #FACC15 #FACC15 #F97316'),
 'j-neo': ('Neo Horizon', 'Paletas de IA · 2', 'modernidade, energia e novas possibilidades', '#2563EB #1E3A8A #0B132B #06B6D4 #2DD4BF #A3E635 #FDE047 #F59E0B #EA580C'),
 'k-explorer': ('IA Explorer', 'Paletas de IA · 3', 'tecnologia e criatividade para ir além', '#6366F1 #4F46E5 #3730A3 #06B6D4 #0891B2 #22C55E #84CC16 #F59E0B #EA580C'),
 'k-green': ('Green Core', 'Paletas de IA · 3', 'equilíbrio entre inovação, conhecimento e impacto (sem cor escura: navy #0F766E de fora da paleta)', '#0EA5E9 #06B6D4 #0F766E #14B8A6 #10B981 #84CC16 #A3E635 #FACC15 #F97316'),
 'k-deep': ('Deep Tech', 'Paletas de IA · 3', 'performance, escala e alta performance', '#0B63CE #2563EB #1E40AF #06B6D4 #0891B2 #059669 #16A34A #FBBF24 #F97316'),
 'k-neon': ('Neon Flow', 'Paletas de IA · 3', 'inovação com energia e possibilidades infinitas (sem cor escura: o rosa faz o navy)', '#8B5CF6 #A855F7 #EC4899 #06B6D4 #14B8A6 #22C55E #A3E635 #F59E0B #FB7185'),
 'k-pulse': ('Future Pulse', 'Paletas de IA · 3', 'inteligência, clareza e um amanhã mais aberto', '#3B82F6 #1E3A8A #0F172A #06B6D4 #2DD4BF #86EFAC #FDE047 #F59E0B #FB923C'),
 'm-midnight': ('Midnight Violet', 'Paletas de IA · 4', 'feita para interface escura: midnight, violeta elétrico, menta neural e lima ácida de CTA', '#6D5BFF #6D5BFF #171326 #A78BFA #777287 #22D3B4 #FFB86B #B7F34A #FF6B70',
  'P:not([data-modo="escuro"]){--soft:#F4F0FF; --muted:#777287; --line:#DDD8EC; --grey:#F7F5FF; --grey2:#E8E4F5; --panel-bg:#F7F5FF; --ink:#2A2540}\n'
  'P[data-modo="escuro"]{--bg:#171326; --card:#201B35; --soft:#2A2442; --grey:#201B35; --grey2:#2A2442; --line:#3A3352; --panel-bg:#201B35; --ink:#F4F0FF; --title:#F4F0FF; --muted:#A7A2B8; --hero-bg:#201B35; --navy:#352D5C; --viva-escuro:#352D5C}\n'),
}
PAPEIS = ['brand', 'blue', 'navy', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange']
ETAPAS = ['cyan', 'lime', 'brand', 'navy', 'green', 'orange', 'teal']   # ordem das etapas no HTML
LINHAS = {'epico': 'navy', 'hitl': 'blue', 'afk': 'cyan', 'atd': 'green', 'min': 'teal', 'sprint': 'yellow', 'rapida': 'orange'}

def rgb(h): return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
def lum(h):
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in rgb(h)]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def cr(a, b): a, b = lum(a), lum(b); return (max(a, b) + .05) / (min(a, b) + .05)
def escuro(v): return cr(v, T) > cr(v, '#FFFFFF')
def clarear(h, fundo='#1F1F21', alvo=4.5):
    H, L, S = colorsys.rgb_to_hls(*rgb(h))
    while cr(h, fundo) < alvo and L < .95:
        L += .01; h = '#%02X%02X%02X' % tuple(round(x * 255) for x in colorsys.hls_to_rgb(H, L, S))
    return h

INI = '/* ===== propostas similares à atual'
FIM = '\n/* ===== variantes da sóbria'
css = [INI + ': 9 cores na ordem dos papéis da atual (marca, azul, navy, ciano, teal, verde, lima, amarelo,\n'
       '   laranja), aplicadas puras, com as regras e os neutros da atual. Só o texto se adapta: branco ou quase preto\n'
       f'   ({T}), o que contrastar mais com cada cor (etapas e botões da barra lateral). Seletores com :root para ganhar das\n'
       '   regras de texto da atual (.claro:first-child) ===== */']
rel = []
for pid, v in SIMILARES.items():
    nome, grupo, ideia, cores = v[:4]; extra = v[4] if len(v) > 4 else ''  # extra: CSS próprio (neutros, escuro)
    c = dict(zip(PAPEIS, cores.split())); nv = c['navy']; P = f':root[data-paleta="{pid}"]'
    nth = ','.join(f':nth-child({i + 1})' for i, k in enumerate(ETAPAS) if escuro(c[k]))
    tr = ','.join(f'[style*="--l-{l})"]' for l, k in LINHAS.items() if escuro(c[k]))
    css.append(f'/* {nome} — {ideia} */\n{P}{{\n  ' + '; '.join(f'--{k}:{v}' for k, v in c.items()) + ';\n  '
               + '; '.join(f'--l-{l}:{c[k]}' for l, k in LINHAS.items())
               + f';\n  --viva-capa:{c["brand"]}; --viva-escuro:{nv}; --viva-destaque:{c["yellow"]}; --viva-tinta:{nv}; --destaque-txt:{T if escuro(c["yellow"]) else "#FFFFFF"};\n}}\n'
               + f'{P}:not([data-modo="escuro"]){{--bg:#ffffff; --card:#ffffff; --ink:#404040; --title:{nv}; --muted:#6b7a88; --line:#C9D3DC; --soft:#EEF6FD; --grey:#F3F5F7; --grey2:#E6EBEF; --panel-bg:#F3F5F7; --acento:{c["blue"]}}}\n'
               + f'{P}[data-modo="escuro"]{{--acento:{clarear(c["blue"])}}}\n'
               + f'{P}[data-modo="escuro"] :is(#map,.itin,.trilho,.chip){{--l-epico:{clarear(nv)}}}\n'
               + (f'{P} .etapas li:is({nth}){{color:{T}}}\n{P} .etapas li:is({nth}) code{{background:rgba(0,0,0,.08)}}\n'
                  f'{P} .etapas li:not({nth}){{color:#FFFFFF}}\n' if nth else f'{P} .etapas li{{color:#FFFFFF}}\n')
               + (f'{P} .tr:is({tr}){{color:{T}}}\n{P} .tr:not({tr}){{color:#FFFFFF}}\n' if tr else '')
               + re.sub(r'^P', P, extra, flags=re.M))
    pior = min(max(cr(c[k], '#FFFFFF'), cr(c[k], T)) for k in ETAPAS)
    rel.append(f'{pid:14} pior contraste nas etapas {pior:.2f}')

s = open('paletas.css').read()
if INI in s:
    s = s[:s.index(INI)] + s[s.index(FIM):]
s = s.replace(FIM, '\n' + '\n'.join(css) + FIM, 1)
open('paletas.css', 'w').write(s)

j = open('paleta.js').read()
base = re.search(r'var OP=\{paleta:(\[.*?\]),modo:', j, re.S)
op = [o for o in json.loads(base.group(1)) if o[0] not in SIMILARES] + [[k, v[0]] for k, v in SIMILARES.items()]
j = j.replace(base.group(1), json.dumps(op, ensure_ascii=False))
g = re.search(r'var GRUPO=(\{.*?\});', j, re.S)
gr = {k: v for k, v in json.loads(g.group(1)).items() if k not in SIMILARES}
gr.update({k: 'Similares à atual · ' + v[1] for k, v in SIMILARES.items()})
j = j.replace(g.group(1), json.dumps(gr, ensure_ascii=False))
open('paleta.js', 'w').write(j)

h = open('index.html', encoding='utf-8').read()
h = re.sub(r'    <h3 class="grupo">Similares à atual[^<]*</h3>\n    <div class="paletas"[^>]*>\n.*?    </div>\n', '', h, flags=re.S)
bloco = ''
for grupo in dict.fromkeys(v[1] for v in SIMILARES.values()):
    cards = ''.join(f'      <label><input type="radio" name="paleta" value="{k}"><b>{html.escape(v[0])}</b><small>{html.escape(v[2].capitalize())}. As 9 cores nos papéis da atual.</small>\n'
                    f'        <span class="sw">' + ''.join(f'<i style="background:{x}"></i>' for x in v[3].split()) + '</span></label>\n'
                    for k, v in SIMILARES.items() if v[1] == grupo)
    bloco += f'    <h3 class="grupo">Similares à atual · {grupo}</h3>\n    <div class="paletas" role="radiogroup" aria-label="Similares à atual · {grupo}">\n' + cards + '    </div>\n'
i = h.index('  </section>', h.index('<h2>Paleta</h2>'))
h = h[:i] + bloco + h[i:]
open('index.html', 'w', encoding='utf-8').write(h)
print('\n'.join(rel))
