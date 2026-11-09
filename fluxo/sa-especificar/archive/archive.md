---
{"fluxo": "archive", "dono": "sa-desenvolvedor",
 "quando": ["depois do merge do código: arquiva a spec da fatia ou do bug (OpenSpec) ou a deixa no lugar (Kiro) e, com ELM, pergunta se publica no DOORS; chamado pela sa-desenvolver.encerrar ou direto", "archive da FT-031"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "nao", "saidas": {"fatia ou bug concluida, com o MR do item mergeado": "arquivar"}},
   {"id": "arquivar", "saidas": {"sem pasta da spec (trilha trivial) ou sem delta": "devolver", "spec já arquivada (OpenSpec), ou com a linha Publicação no status.md": "publicar"}},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "publicar", "chama": "sa-elm.publicar"},
   {"id": "devolver"}
 ]}
---
# Archive — a spec depois do merge

Roda depois do merge do código. No OpenSpec, arquiva a spec da fatia; no Kiro, a deixa no lugar, porque o vigente
são as specs em `.kiro/specs/`. Com ELM, pergunta se publica no DOORS; sem a booleana `especificador`, grava
`Publicação: pendente` no `status.md`, e a `sa-status.painel` mostra a pendência. Nunca trava.

## Entrada: vizinhos

- épico ou sustentação → "o archive é da spec de fatia ou bug" ■
- fatia ou bug antes de `concluida` (MR aberto ou sem merge) → `sa-desenvolver.encerrar`
