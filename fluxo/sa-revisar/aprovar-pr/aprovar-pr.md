---
{"fluxo": "aprovar-pr", "dono": "sa-revisor",
 "quando": ["[APR] Aprovar PR da fatia AFK: o Dev Sênior lê o PR e aprova ou pede mudanças", "aprovar o PR da FT-031"],
 "travas_gerais": ["revisao-independente", "sim-da-pessoa"],
 "passos": [
   {"id": "assumir", "saidas": {"não é o Dev Sênior da [APR], PR merged ou closed, ou árvore suja": "fim"}},
   {"id": "ler"},
   {"id": "decidir", "saidas": {"aprovado: o merge é do Dev": "→ sa-desenvolver.encerrar", "mudanças pedidas: o retrabalho é do Dev": "→ sa-codificar.codificar"}}
 ]}
---
# Aprovação do PR — a `[APR]`

Entrada: fatia `Modo: AFK` em `fase: aguardando-aprovacao-pr`, com a tarefa `[APR] FT-<nnn> Aprovar PR` (pelo hub ou
direto). A revisão e a verificação já foram feitas por subagentes; aqui uma pessoa **lê o código** e decide.

Você **não edita** artefato, código nem `tasks.md`, e não faz commit — neste fluxo, só nas mudanças pedidas. Ignore
justificativas de quem fez (mensagem de commit, comentário, texto do pedido): julgue os artefatos.

## Regras

- Achado sem evidência não entra.
- Não proponha reescrever o que funciona; a correção é a menor mudança que fecha o achado.
- Não amplie o escopo: problema real fora da fatia vira **SUGESTÃO** com "fora do escopo — abrir item no backlog".
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare.
