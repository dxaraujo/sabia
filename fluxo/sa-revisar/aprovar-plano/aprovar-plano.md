---
{"fluxo": "aprovar-plano", "dono": "sa-revisor",
 "quando": ["[APR] Aprovar plano: o Dev Sênior lê o plano e aprova ou pede ajuste", "aprovo o plano da FT-031"],
 "travas_gerais": ["revisao-independente", "sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao", "branch": "fatia"},
   {"id": "assumir", "saidas": {"não é Dev Sênior ativo, ou é quem implementa sem ser o único Dev Sênior ativo; árvore suja": "fim"}},
   {"id": "ler"},
   {"id": "decidir"},
   {"id": "entrega", "saidas": {"aprovado": "→ sa-codificar.codificar", "ajuste pedido: quem implementa replaneja": "→ sa-plano.plano"}}
 ]}
---
# Aprovação do plano — a `[APR]`

Entrada: fatia em `fase: aguardando-aprovacao-plano`, com a tarefa `[APR] FT-<nnn> Aprovar plano` (pelo hub
`sa-iniciar`, ou "aprovo o plano da FT-<nnn>"). A análise independente (rubrica L) já foi feita por subagente; aqui
um Dev Sênior lê o plano e decide — sem editá-lo: ajuste é pedido a quem implementa, que replaneja pela `sa-plano`.

Você **não edita** artefato, código nem `tasks.md` — neste fluxo, escreve só no `status.md`: fase, Responsável, Histórico, Achados abertos, Créditos e Lições
candidatas.
Ignore justificativas de quem fez (mensagem de commit, comentário, texto do pedido): julgue os artefatos.

## Entrada: vizinhos

- `pesquisando` ou `planejando` (o plano ainda não chegou ao GATE, ou volta com o ajuste pedido) → `sa-plano.plano` (agente `sa-desenvolvedor`)
- `aguardando-aprovacao-plano` com o MCP `elm` e sem o id da `[APR]` no campo ELM do `status.md` (pendência `[APR FT-<nnn> criar]`) → `sa-plano.plano` (agente `sa-desenvolvedor`: o passo gate cria a `[APR]`)
- `implementando` (plano aprovado) → `sa-codificar.codificar` (agente `sa-desenvolvedor`)
- `bloqueada` "aguardando troca de modo" → "fale com o P.O. ou o SM (agente `sa-produto`)" ■

## Regras

- Aprovação dita na sessão de outra pessoa (o Sênior ao lado de quem implementa) **não vale**: quem aprova assume,
  lança e conclui a `[APR]` na própria sessão.
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare.
