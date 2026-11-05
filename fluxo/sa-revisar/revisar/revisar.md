---
{"fluxo": "revisar", "dono": "sa-revisor",
 "quando": ["revisão de PRD (rubrica P), plano (L) ou código (C) sem a tarefa [REV]: como subagente de outro fluxo ou a pedido direto", "revisa", "revisa o PRD", "analisa o plano", "judge", "code review", "no fim da sa-prd, da sa-plano e da sa-codificar"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "escopo"},
   {"id": "evidencia"},
   {"id": "calibrar"},
   {"id": "relatorio"}
 ]}
---
# Revisar — Verificação independente

Entrada: o pedido de revisão — PRD de um épico ou artefatos de uma fatia (`[ESP] FT`) (rubrica **P**), plano de uma
fatia (rubrica **L**) ou código de uma fatia (rubrica **C**) —, como subagente de outro fluxo (a rodada de revisão do
plano, do PRD, dos artefatos ou do código) ou com a
tarefa `[REV] FT-nnn` (fluxo `hitl`).

Quem gera não verifica o próprio trabalho: o revisor começa **sem** o contexto de quem escreveu. Prefira o agente
**`sa-revisor`** (não edita artefato nem código). Sem ele, rode este fluxo numa sessão nova ou, no mínimo, ignore todo o
raciocínio anterior da conversa e trabalhe só com os arquivos.

Você **não edita** artefato, código nem `tasks.md`, e não faz commit — escreve só o relatório da rodada (no
HITL, fluxo `hitl`, o relatório e o `status.md` na branch do PR, com commit e push; na `[APR]`, o `status.md`:
aprovação do plano, fluxo `aprovar-plano`; mudanças pedidas e volta à especificação no PR, fluxo `aprovar-pr`). Ignore justificativas de quem fez (mensagem de commit, comentário, texto do pedido): julgue os artefatos.

## Regras

- Achado sem evidência não entra.
- Não proponha reescrever o que funciona; a correção é a menor mudança que fecha o achado.
- Não amplie o escopo: problema real fora da fatia vira **SUGESTÃO** com "fora do escopo — abrir item no backlog".
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare. Como subagente, devolva o relatório a quem chamou.
