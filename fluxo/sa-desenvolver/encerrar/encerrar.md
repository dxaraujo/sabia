---
{"fluxo": "encerrar", "dono": "sa-desenvolvedor",
 "quando": ["MR aprovado por um desenvolvedor ≠ autor e CI verde: merge, concluida na branch base, épico concluido na última fatia, archive da spec e worktree", "mergeia a FT-031", "o MR da FT-031 foi aprovado", "MR mergeado", "fecha a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "sem-force", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "nao", "saidas": {"concluida com a spec por arquivar": "archive", "concluida com a spec já arquivada, ou trivial": "seguir", "MR já mergeado (auto-merge ou UI)": "conferir"}},
   {"id": "ler-mr", "saidas": {"conflito com a branch base: retrabalho": "→ sa-desenvolver.codificar", "fechado sem merge": "fim"}},
   {"id": "aprovacao", "travas": ["revisao-independente", "pr-lido-por-pessoa"], "saidas": {"falta aprovação ou CI verde": "fim"}},
   {"id": "merge", "saidas": {"sem o sim ao merge": "fim"}},
   {"id": "conferir", "saidas": {"não mergeado": "fim"}},
   {"id": "concluir"},
   {"id": "finalizar", "chama": "sa-elm.finalizar"},
   {"id": "archive", "chama": "sa-especificar.archive"},
   {"id": "worktree"},
   {"id": "seguir", "saidas": {"seguir para a próxima": "→ sa-desenvolver.iniciar", "sem o sim": "fim"}},
   {"id": "gravar", "de": "commit-na-branch-base"}
 ]}
---
# Encerrar — merge e fechamento

O autor mergeia o MR aprovado por um desenvolvedor que não é ele, com o CI verde. Depois: `concluida` na branch base (e
`concluido` no épico, na última fatia), a oferta de finalizar a tarefa no ELM, o archive da spec e a limpeza da
worktree do autopilot. Não há consolidação depois: o fechamento é o status final, o archive e a publicação.

Deste fluxo: MR da branch `<id>` aberto, com aprovação vigente e CI verde; MR já mergeado (auto-merge ou UI) com o
item ainda não `concluida`; item `concluida` com a spec por arquivar. O merge é do autor do MR: outra pessoa segue a
regra de dono da entrada comum.

O passo `gravar` é o commit direto na branch base: outros passos o incluem e voltam.

## Entrada: vizinhos

- sem MR da branch `<id>` → `sa-desenvolver.codificar`
- MR aberto sem aprovação de desenvolvedor ≠ autor → `sa-revisar.mr`
- MR com CI vermelho ou thread aberta → `sa-desenvolver.codificar`
