"""Créditos do Kiro por sessão, lidos do ~/.kiro desta máquina (só leitura), acrescentados ao CSV da pessoa.

Uso: uv run --no-project python creditos.py --usuario <usuario> --item <id> --skill <skill> [--pasta <dir>]... [--raiz <repo>]

Acrescenta ao <raiz>/.sabia/creditos/<usuario>.csv (sessao,ate,item,skill,modo,creditos) uma linha por sessão do Kiro
aberta numa das pastas com consumo depois do maior "ate" já gravado dela. Sessão sem consumo novo não gera linha.
Imprime as linhas acrescentadas; sem nenhuma, avisa e sai com 0.
"""
import argparse
import csv
import json
import os
import sys
from datetime import datetime
from pathlib import Path

CAMPOS = ["sessao", "ate", "item", "skill", "modo", "creditos"]
AGENTES = {"sa-desenvolvedor", "sa-especificador", "sa-pesquisador", "sa-revisor", "sa-verificador"}
FORMATO = "%Y-%m-%dT%H:%M:%S"


def _norm(p):
    return os.path.normcase(os.path.abspath(p))


def _dentro(a, b):
    a, b = _norm(a), _norm(b)
    return a == b or a.startswith(b.rstrip(os.sep) + os.sep)


def _ts(s):
    # Kiro grava em UTC com Z; o "ate" do CSV é hora local sem fuso. Compara em segundos inteiros, porque o "ate"
    # gravado tem segundos e o turno dele não pode contar de novo.
    d = datetime.fromisoformat(s.replace("Z", "+00:00"))
    return (d if d.tzinfo else d.astimezone()).astimezone().replace(microsecond=0)


def sessoes(kiro, pastas, desde=None):
    """(ate, sessao, creditos, modo) por sessão com consumo; desde = {sessao: datetime} já gravado."""
    # shortcut: o turno em curso não entra (o usage_summary é gravado no fim do turno); a skill roda na resposta a
    # uma pergunta, e o turno do registro fica para o próximo fechamento
    desde = desde or {}
    out = []
    for meta in Path(kiro, "sessions").glob("*/sess_*/session.json"):
        try:
            s = json.loads(meta.read_text(encoding="utf-8"))
            msgs = (meta.parent / "messages.jsonl").read_text(encoding="utf-8").splitlines()
        except (OSError, ValueError):
            continue
        wps = s.get("workspacePaths") or []
        if not any(_dentro(w, p) or _dentro(p, w) for w in wps for p in pastas):
            continue
        sid = meta.parent.name.removeprefix("sess_").split("-")[0]
        corte = desde.get(sid)
        total, ate = 0.0, None
        for linha in msgs:
            try:
                r = json.loads(linha)
            except ValueError:
                continue
            p = r.get("payload") or {}
            if p.get("type") != "usage_summary":
                continue
            t = _ts(r["timestamp"])
            if corte and t <= corte:
                continue
            total += sum(x.get("usage", 0) for x in p.get("promptTurnSummaries", []) if x.get("unit") == "credit")
            ate = max(ate, t) if ate else t
        if ate:
            modo = s.get("agentMode")
            out.append((ate, sid, total, modo if modo in AGENTES else "padrão"))
    return sorted(out)


def gravados(arq):
    """{sessao: maior ate} do CSV (vazio se não existe)."""
    if not arq.exists():
        return {}
    out = {}
    with arq.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            t = _ts(r["ate"])
            out[r["sessao"]] = max(out.get(r["sessao"], t), t)
    return out


def main(argv=None):
    a = argparse.ArgumentParser()
    a.add_argument("--usuario", required=True)
    a.add_argument("--item", default="—")
    a.add_argument("--skill", default="—")
    a.add_argument("--pasta", action="append")
    a.add_argument("--raiz", default=".")
    a.add_argument("--kiro", default=os.environ.get("KIRO_HOME", str(Path.home() / ".kiro")))
    o = a.parse_args(argv)
    arq = Path(o.raiz, ".sabia", "creditos", f"{o.usuario}.csv")
    novas = sessoes(o.kiro, o.pasta or [os.getcwd()], gravados(arq))
    if not novas:
        print("nenhuma sessão do Kiro com consumo novo nestas pastas", file=sys.stderr)
        return 0
    arq.parent.mkdir(parents=True, exist_ok=True)
    cabecalho = not arq.exists()
    with arq.open("a", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        if cabecalho:
            w.writerow(CAMPOS)
        for ate, sid, total, modo in novas:
            linha = [sid, ate.strftime(FORMATO), o.item, o.skill, modo, f"{total:.2f}"]
            w.writerow(linha)
            print(",".join(linha))
    return 0


if __name__ == "__main__":
    sys.exit(main())
