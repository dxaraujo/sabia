"""Gera as 10 paletas (5 Coolors, 5 Adobe Color) nos papéis de cor do Sabiá.
Cada paleta dá as sementes por papel; o gerador só mexe na luminosidade (HSL) para o contraste passar:
etapas escuras com branco >= 4,5; claras com a tinta >= 4,5; acento claro no escuro >= 4,5.
No mapa, as linhas ficam com contraste >= 3 no branco; na barra lateral (painel), com a cor original da paleta, e os
botões de linha clara (branco < 3:1) recebem o texto escuro da paleta."""
import colorsys, json, sys

def rgb(h): return [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
def hexo(c): return '#%02X%02X%02X' % tuple(round(max(0, min(1, x)) * 255) for x in c)
def lum(h):
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in rgb(h)]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def cr(a, b):
    a, b = lum(a), lum(b); return (max(a, b) + 0.05) / (min(a, b) + 0.05)
def setl(h, l):
    H, _, S = colorsys.rgb_to_hls(*rgb(h)); return hexo(colorsys.hls_to_rgb(H, l, S))
def L(h): return colorsys.rgb_to_hls(*rgb(h))[1]

def escurecer(h, contra, alvo):
    """Escurece (ou clareia, se 'contra' for escuro) até o contraste com 'contra' chegar ao alvo."""
    claro_fundo = lum(contra) > 0.5
    l = L(h)
    while cr(h, contra) < alvo and 0.02 < l < 0.98:
        l += -0.01 if claro_fundo else 0.01
        h = setl(h, l)
    return h

WHITE = '#FFFFFF'; DARKBG = '#1F1F21'

def montar(p):
    s = p['sementes']
    tinta = s['tinta']
    r = {}
    # etapas: claras com tinta, escuras com branco
    for k in ('cyan', 'lime', 'orange'):
        r[k] = escurecer(s[k], tinta, 4.5) if cr(s[k], tinta) < 4.5 else s[k]
        while cr(r[k], tinta) < 4.5:  # clarear se a tinta não alcançar
            r[k] = setl(r[k], min(0.97, L(r[k]) + 0.01))
    for k in ('brand', 'navy', 'green', 'teal'):
        r[k] = escurecer(s[k], WHITE, 4.5)
    r['blue'] = escurecer(s.get('blue', s['brand']), WHITE, 4.5)
    r['yellow'] = s['destaque']
    r['destaque_txt'] = tinta if cr(s['destaque'], tinta) >= cr(s['destaque'], WHITE) else WHITE
    r['capa'] = escurecer(s.get('capa', s['brand']), WHITE, 4.5)
    r['tinta'] = tinta
    # linhas: no mapa, contraste >= 3 no branco; na barra lateral, a cor original (as claras pedem texto escuro)
    linhas = {k: escurecer(v, WHITE, 3.0) for k, v in s['linhas'].items()}
    r['linhas_painel'] = dict(s['linhas'])
    r['tr_texto_escuro'] = [k for k, v in s['linhas'].items() if cr(v, WHITE) < 3.0]
    # escuro: acento e épico claros sobre o fundo escuro
    # cinzas e branco: escala no matiz da paleta, pouco saturada
    H, _, _ = colorsys.rgb_to_hls(*rgb(s['cinza']))
    g = lambda l, sat: hexo(colorsys.hls_to_rgb(H, l, sat))
    r['cinzas'] = {'ink': g(.26, .16), 'muted': escurecer(g(.46, .12), WHITE, 4.5), 'line': g(.84, .16),
                   'soft': g(.96, .45), 'grey': g(.97, .18), 'grey2': g(.92, .16)}
    r['acento_escuro'] = escurecer(r['brand'], DARKBG, 4.5)
    r['epico_escuro'] = escurecer(linhas['epico'], DARKBG, 4.5)
    return r, linhas

def css(pid, p, r, ln):
    return (f'/* {p["nome"]} ({p["site"]}, {p["origem"]}) — {p["ideia"]} */\n'
            f':root[data-paleta="{pid}"]{{\n'
            f'  --brand:{r["brand"]}; --blue:{r["blue"]}; --navy:{r["navy"]}; --cyan:{r["cyan"]}; --lime:{r["lime"]}; --green:{r["green"]}; --orange:{r["orange"]}; --teal:{r["teal"]}; --yellow:{r["yellow"]};\n'
            f'  --l-epico:{ln["epico"]}; --l-hitl:{ln["hitl"]}; --l-afk:{ln["afk"]}; --l-atd:{ln["atd"]}; --l-min:{ln["min"]}; --l-sprint:{ln["sprint"]}; --l-rapida:{ln["rapida"]};\n'
            f'  --viva-capa:{r["capa"]}; --viva-escuro:{r["navy"]}; --viva-destaque:{r["yellow"]}; --viva-tinta:{r["tinta"]}; --destaque-txt:{r["destaque_txt"]};\n'
            f'}}\n'
            f':root[data-paleta="{pid}"]:not([data-modo="escuro"]){{--bg:#FFFFFF; --card:#FFFFFF; --ink:{r["cinzas"]["ink"]}; --title:{r["navy"]}; --muted:{r["cinzas"]["muted"]}; --line:{r["cinzas"]["line"]}; --soft:{r["cinzas"]["soft"]}; --grey:{r["cinzas"]["grey"]}; --grey2:{r["cinzas"]["grey2"]}; --panel-bg:{r["cinzas"]["grey"]}; --acento:{r["blue"]}}}\n'
            f':root[data-paleta="{pid}"][data-modo="escuro"]{{--acento:{r["acento_escuro"]}}}\n'
            f'[data-modo="escuro"][data-paleta="{pid}"] :is(#map,.itin,.trilho,.chip){{--l-epico:{r["epico_escuro"]}}}\n'
            + f'[data-paleta="{pid}"] .panel{{{"; ".join(f"--l-{k}:{v}" for k, v in r["linhas_painel"].items())}}}\n'
            + (f'[data-paleta="{pid}"] .tr:is({",".join(f"[style*=\"--l-{k})\"]" for k in r["tr_texto_escuro"])}){{color:{r["tinta"]}}}\n' if r['tr_texto_escuro'] else ''))

if __name__ == '__main__':
    P = json.load(open(sys.argv[1]))
    out_css, out_js = [], {}
    for pid, p in P.items():
        r, ln = montar(p)
        out_css.append(css(pid, p, r, ln))
        out_js[pid] = {'nome': p['nome'], 'site': p['site'], 'origem': p['origem'], 'ideia': p['ideia'], 'fonte': p['fonte'],
                       'cores': [r[k] for k in ('cyan', 'lime', 'brand', 'navy', 'green', 'orange', 'teal', 'yellow')],
                       'cinzas': [r['cinzas'][k] for k in ('ink', 'muted', 'line', 'grey2', 'soft')],
                       'contraste': {k: round(cr(r[k], WHITE if k in ('brand', 'navy', 'green', 'teal') else r['tinta']), 2)
                                     for k in ('cyan', 'lime', 'brand', 'navy', 'green', 'orange', 'teal')},
                       'destaque': round(cr(r['yellow'], r['destaque_txt']), 2)}
    open(sys.argv[2], 'w').write('\n'.join(out_css))
    json.dump(out_js, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
    for pid, d in out_js.items():
        print(pid, d['nome'], d['cores'], 'contraste etapas', d['contraste'], 'destaque', d['destaque'])
