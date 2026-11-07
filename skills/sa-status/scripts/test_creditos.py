"""Checagem do creditos.py: uv run --no-project python test_creditos.py"""
import csv
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from creditos import _ts, main, sessoes  # noqa: E402


def _sessao(kiro, sid, pasta, turnos, modo="sa-desenvolvedor"):
    d = Path(kiro, "sessions", "h", f"sess_{sid}-0000")
    d.mkdir(parents=True, exist_ok=True)
    (d / "session.json").write_text(json.dumps({"workspacePaths": [pasta], "agentMode": modo, "title": sid}))
    linhas = [{"timestamp": ts, "payload": {"type": "usage_summary", "promptTurnSummaries": [{"unit": "credit", "usage": u}]}}
              for ts, u in turnos]
    linhas.append({"timestamp": "2026-10-21T10:00:00Z", "payload": {"type": "user"}})
    (d / "messages.jsonl").write_text("\n".join(map(json.dumps, linhas)) + "\nnão é json\n")


def _csv(raiz):
    with Path(raiz, ".sabia", "creditos", "ana.csv").open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


with tempfile.TemporaryDirectory() as k:
    repo, outro = str(Path(k, "repo")), str(Path(k, "outro"))
    _sessao(k, "aaaa", repo, [("2026-10-21T10:00:00.500Z", 1.5), ("2026-10-21T11:00:00Z", 2.0)])
    _sessao(k, "bbbb", outro, [("2026-10-21T12:00:00Z", 9.0)])
    _sessao(k, "cccc", str(Path(repo, "sub")), [("2026-10-21T13:00:00Z", 0.25)], modo="vibe")

    r = sessoes(k, [repo])
    assert [x[1] for x in r] == ["aaaa", "cccc"], r  # filtra a pasta
    assert r[0][2] == 3.5 and r[1][3] == "padrão", r  # agente fora dos 5 → padrão
    # o "ate" gravado (segundos inteiros) não conta o mesmo turno de novo
    r = sessoes(k, [repo], {"aaaa": _ts("2026-10-21T10:00:00Z")})
    assert [(x[1], x[2]) for x in r] == [("aaaa", 2.0), ("cccc", 0.25)], r

    args = ["--usuario", "ana", "--item", "FT-031", "--skill", "sa-desenvolver", "--pasta", repo, "--raiz", repo, "--kiro", k]
    assert main(args) == 0
    linhas = _csv(repo)
    assert [(x["sessao"], x["creditos"], x["item"], x["modo"]) for x in linhas] == [
        ("aaaa", "3.50", "FT-031", "sa-desenvolvedor"), ("cccc", "0.25", "FT-031", "padrão")], linhas
    # de novo sem consumo novo: nenhuma linha
    assert main(args) == 0 and len(_csv(repo)) == 2
    # turno novo na aaaa: só o consumo depois do maior "ate" dela
    _sessao(k, "aaaa", repo, [("2026-10-21T10:00:00.500Z", 1.5), ("2026-10-21T11:00:00Z", 2.0), ("2026-10-21T15:00:00Z", 0.5)])
    assert main(args) == 0
    linhas = _csv(repo)
    assert len(linhas) == 3 and (linhas[2]["sessao"], linhas[2]["creditos"]) == ("aaaa", "0.50"), linhas
print("ok")
