"""Transcrição de reunião (.vtt ou .md) → .md de falas "[mm:ss] papel: fala" (só biblioteca padrão).

Uso: uv run --no-project python transcricao.py <entrada.vtt|.md> [--papel "Nome=papel"]... [-o <saida.md>]

Entrada .vtt: as falas dos cues, cada trecho com o falante do seu <v Nome>; arquivo sem nenhum <v>, o prefixo
"Nome: " da primeira linha do cue. Cue sem falante → "?". Entrada .md: linhas "[hh:mm:ss] Nome: fala" (ou sem
colchetes), ou um cabeçalho "Nome   hh:mm:ss" (negrito opcional; no início do arquivo ou depois de linha em branco
ou título) seguido das linhas da fala. Falas seguidas do mesmo falante viram uma. A saída (padrão:
<entrada com a extensão>.transcricao.md, ao lado) começa com um comentário com o nome e o sha256 da entrada; o
falante sem --papel sai pelo nome e é listado no stderr, com a contagem das falas sem falante.
Nenhuma fala reconhecida → código 1; entrada ilegível (não existe, não é UTF-8) → código 2.
"""
import argparse
import hashlib
import re
import sys
from pathlib import Path

TEMPO = r"(?:\d+:)?\d{1,2}:\d{2}"
CUE = re.compile(rf"^({TEMPO})[.,]\d{{1,3}}\s+-->")
VOZ = re.compile(r"<v(?:\.[^ >]*)?\s+([^>]+)>")
TAG = re.compile(r"<[^>]+>")
PREFIXO = re.compile(r"^([^:]{1,60}?):\s+(.+)$")
INLINE = re.compile(rf"^\[?({TEMPO})\]?\s+([^:\[\]]+?):\s*(.*)$")
CABECALHO = re.compile(rf"^\**\s*([^\[\]*:]+?)\s*\**\s+({TEMPO})\s*$")
SUFIXO = ".transcricao.md"


def _seg(t):
    s = 0
    for p in t.split(":"):
        s = s * 60 + int(p)
    return s


def _vtt(texto):
    vozes = bool(VOZ.search(texto))  # com <v> no arquivo, "Palavra: " no texto é fala, não falante
    falas, cue = [], None
    for linha in texto.splitlines() + [""]:
        linha = linha.strip()
        m = CUE.match(linha)
        if m:
            cue = (_seg(m.group(1)), [])
        elif not linha:
            if cue:
                falas += [(cue[0], quem, fala) for quem, fala in cue[1] if fala]
            cue = None
        elif cue is not None:
            partes = VOZ.split(linha)  # [antes, nome, trecho, nome, trecho...]
            antes = TAG.sub("", partes[0]).strip()
            if antes:
                p = None if vozes or cue[1] else PREFIXO.match(antes)
                if p:
                    cue[1].append([p.group(1).strip(), p.group(2)])
                elif cue[1]:
                    cue[1][-1][1] = f"{cue[1][-1][1]} {antes}".strip()
                else:
                    cue[1].append(["?", antes])
            for nome, trecho in zip(partes[1::2], partes[2::2]):
                cue[1].append([nome.strip(), TAG.sub("", trecho).strip()])
    return falas


def _md(texto):
    falas, bloco = [], True  # bloco: linha anterior vazia, título ou início; só aí vale o cabeçalho
    for linha in texto.splitlines():
        linha = linha.strip()
        m = INLINE.match(linha)
        c = None if m or not bloco else CABECALHO.match(linha)
        if m:
            falas.append([_seg(m.group(1)), m.group(2).strip(), m.group(3).strip()])
        elif c:
            falas.append([_seg(c.group(2)), c.group(1).strip(), ""])
        elif linha and falas and not linha.startswith(("#", "<!--")):
            falas[-1][2] = f"{falas[-1][2]} {linha}".strip()
        bloco = not linha or linha.startswith(("#", "<!--"))
    return [tuple(f) for f in falas if f[2]]


def converter(caminho, papeis=None):
    """(linhas da saída, falantes sem papel, falas sem falante) de uma transcrição .vtt ou .md."""
    caminho, papeis = Path(caminho), papeis or {}
    bruto = caminho.read_bytes()
    texto = bruto.decode("utf-8-sig")
    falas = _vtt(texto) if caminho.suffix.lower() == ".vtt" else _md(texto)
    juntas = []
    for t, quem, fala in falas:
        if juntas and juntas[-1][1] == quem:
            juntas[-1][2] += " " + fala
        else:
            juntas.append([t, quem, fala])
    linhas = [f"<!-- transcrição de {caminho.name} · sha256 {hashlib.sha256(bruto).hexdigest()} · só local -->", ""]
    linhas += [f"[{t // 60:02d}:{t % 60:02d}] {papeis.get(quem, quem)}: {fala}" for t, quem, fala in juntas]
    sem = sorted({q for _, q, _ in juntas if q not in papeis and q != "?"})
    return (linhas if juntas else []), sem, sum(q == "?" for _, q, _ in juntas)


def main(argv=None):
    a = argparse.ArgumentParser()
    a.add_argument("entrada")
    a.add_argument("--papel", action="append", default=[], help='"Nome=papel"')
    a.add_argument("-o", "--saida")
    o = a.parse_args(argv)
    e = Path(o.entrada)
    if e.name.endswith(SUFIXO) or e.suffix.lower() not in (".vtt", ".md"):
        a.error(f"entrada .vtt ou .md (não {SUFIXO})")
    papeis = {}
    for p in o.papel:
        nome, sep, papel = p.partition("=")
        if not sep or not nome.strip() or not papel.strip():
            a.error(f'--papel "{p}": use "Nome=papel"')
        papeis[nome.strip()] = papel.strip()
    if not e.is_file():
        a.error(f"{e}: arquivo não encontrado")
    try:
        linhas, sem, sem_falante = converter(e, papeis)
    except UnicodeDecodeError:
        a.error(f"{e.name}: não é UTF-8; salve a transcrição em UTF-8")
    except OSError as erro:
        a.error(f"{e.name}: {erro.strerror or erro}")
    if not linhas:
        print(f"{e.name}: nenhuma fala reconhecida (.vtt com cues, ou .md com [hh:mm:ss] Nome: fala)", file=sys.stderr)
        return 1
    saida = Path(o.saida) if o.saida else e.with_name(e.name + SUFIXO)
    saida.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(saida)
    if sem:
        print("sem papel: " + ", ".join(sem), file=sys.stderr)
    if sem_falante:
        print(f"falas sem falante: {sem_falante}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
