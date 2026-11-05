---
{"fluxo": "aprovar-pr", "dono": "sa-revisor",
 "quando": ["[APR] Aprovar PR da fatia AFK: o Dev Sênior lê o PR e aprova ou pede mudanças", "aprovar o PR da FT-031"],
 "travas_gerais": ["revisao-independente", "sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "assumir", "saidas": {"não é Dev Sênior ativo, ou é quem implementa sem ser o único Dev Sênior ativo; PR closed ou árvore suja": "fim"}},
   {"id": "ler"},
   {"id": "decidir", "saidas": {"aprovado: o merge é do Dev": "→ sa-desenvolver.encerrar", "mudanças pedidas: o retrabalho é do Dev": "→ sa-codificar.codificar", "volta à especificação, [ESP] FT aberta ou reaberta: bloqueada, é do especificador": "→ sa-especificar.fatia", "volta à especificação, [ESP] FT concluída numa sprint fechada (com sprint aberta) ou inexistente: o encaixe, do P.O. ou do SM": "→ sa-planejamento.durante", "volta à especificação, sem sprint aberta: pendência do P.O. na [GB]": "→ sa-planejamento.sprint"}}
 ]}
---
# Aprovação do PR — a `[APR]`

Entrada: fatia `Modo: AFK` em `fase: aguardando-aprovacao-pr`, com a tarefa `[APR] FT-<nnn> Aprovar PR` (pelo hub ou
direto). A revisão e a verificação já foram feitas por subagentes; aqui uma pessoa **lê o código** e decide — também a
possível alteração que eles indicaram (volta à especificação ou código errado): quem devolve a fatia à especificação
no AFK é você.

Você **não edita** artefato, código nem `tasks.md`, e não faz commit — neste fluxo, só nas mudanças pedidas e na volta à especificação. Ignore
justificativas de quem fez (mensagem de commit, comentário, texto do pedido): julgue os artefatos.

## Entrada: vizinhos

- `implementando`, `revisando`, `verificando`, `verificada` ou `retrabalho (de: aguardando-aprovacao-pr)` → `sa-codificar.codificar` (agente `sa-desenvolvedor`: o PR ainda não espera a `[APR]`)
- `aguardando-aprovacao-pr` com Modo HITL no `backlog.md` da base (a troca de modo cancelou a `[APR]`) → `sa-codificar.codificar` (agente `sa-desenvolvedor`: o PR vira HITL, `pr-aberto`)
- a `[APR]` concluída sem commit no PR depois do `sha` aprovado, ou o PR mergeado pelo Sabiá (com a aprovação registrada) sem `pronta` na base → `sa-desenvolver.encerrar` (agente `sa-desenvolvedor`: o merge e o registro dele são do Dev)
- PR mergeado por fora do Sabiá, sem `pronta` na base → "sincroniza a sprint (P.O. ou SM, agente `sa-produto`)" ■

## Regras

- Achado sem evidência não entra.
- Não proponha reescrever o que funciona; a correção é a menor mudança que fecha o achado.
- Não amplie o escopo: problema real fora da fatia vira **SUGESTÃO** com "fora do escopo — abrir item no backlog".
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare.
