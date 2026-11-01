---
{"fluxo": "aprovar-plano", "dono": "sa-revisor",
 "quando": ["[APR] Aprovar plano: o Dev Sênior lê o plano e aprova ou pede ajuste", "aprovo o plano da FT-031"],
 "travas_gerais": ["revisao-independente", "sim-da-pessoa"],
 "passos": [
   {"id": "assumir", "saidas": {"não é o Dev Sênior da [APR], árvore suja ou fase diferente de aguardando-aprovacao-plano": "fim"}},
   {"id": "ler"},
   {"id": "decidir"},
   {"id": "entrega", "saidas": {"aprovado": "→ sa-codificar.codificar", "ajuste pedido: quem implementa replaneja": "→ sa-plano.plano"}}
 ]}
---
# Aprovação do plano — a `[APR]`

Entrada: fatia em `fase: aguardando-aprovacao-plano`, com a tarefa `[APR] FT-<nnn> Aprovar plano` (pelo hub
`sa-iniciar`, ou "aprovo o plano da FT-<nnn>"). A análise independente (rubrica L) já foi feita por subagente; aqui
um Dev Sênior lê o plano e decide — sem editá-lo: ajuste é pedido a quem implementa, que replaneja pela `sa-plano`.

Você **não edita** artefato, código nem `tasks.md` — neste fluxo, escreve só a fase e o Histórico do `status.md`.
Ignore justificativas de quem fez (mensagem de commit, comentário, texto do pedido): julgue os artefatos.

## Regras

- Aprovação dita na sessão de outra pessoa (o Sênior ao lado de quem implementa) **não vale**: quem aprova assume,
  lança e conclui a `[APR]` na própria sessão.
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare.
