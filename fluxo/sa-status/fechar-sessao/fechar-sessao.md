---
{"fluxo": "fechar-sessao", "dono": "sa-desenvolvedor",
 "quando": ["ao encerrar uma sessão num item: Retomar, tasks.md, horas (sa-elm), créditos do Kiro no CSV da pessoa, commit com ok e a frase de retomada", "fechar a sessão", "encerrar por hoje"],
 "travas_gerais": ["sim-da-pessoa", "sem-force", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio"},
   {"id": "retomar"},
   {"id": "tasks"},
   {"id": "horas", "chama": "sa-elm.horas"},
   {"id": "creditos"},
   {"id": "commit", "saidas": {"na branch <id>, ou sem o ok": "retomada"}},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "retomada"}
 ]}
---
# Fechar a sessão

Ao encerrar uma sessão num item: Retomar no `status.md` (ou Atividade no registro) → `tasks.md` → "lançar horas?"
(`sa-elm.horas`) → créditos no `.sabia/creditos/<usuario>.csv` (Kiro) → commit com o "ok" → "seguir para a
próxima?" ou a frase de retomada. É o único fluxo da skill que grava.
