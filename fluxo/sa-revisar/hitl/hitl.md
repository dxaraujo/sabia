---
{"fluxo": "hitl", "dono": "sa-revisor",
 "quando": ["fatia HITL com a tarefa [REV] e o PR aberto: a revisão oficial sobre o PR", "pegar a [REV] da FT-031", "revisa a FT-031"],
 "travas_gerais": ["revisao-independente", "sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao"},
   {"id": "assumir", "saidas": {"não é Dev Sênior ativo, ou é quem implementa sem ser o único Dev Sênior ativo": "fim"}},
   {"id": "pr", "saidas": {"PR closed ou árvore suja": "fim", "PR atualizado com a [REV] já concluída": "assumir"}},
   {"id": "rubrica", "chama": "sa-revisar.revisar"},
   {"id": "veredito"},
   {"id": "entrega", "saidas": {"APROVADO: a [VER] está disponível": "→ sa-verificar.verificar", "REVISAR: o retrabalho é do Dev, no mesmo PR": "→ sa-codificar.codificar", "volta à especificação: bloqueada, a [ESP] FT é do especificador": "→ sa-especificar.fatia"}}
 ]}
---
# Revisão HITL — a `[REV]` sobre o PR

Entrada: fatia `Modo: HITL` com a tarefa `[REV]` e `fase: pr-aberto` (ou `em-revisao`, retomando) — a revisão
oficial é sua, na sua sessão.

Quem gera não verifica o próprio trabalho: o revisor começa **sem** o contexto de quem escreveu. Prefira o agente
**`sa-revisor`** (somente leitura). Sem ele, rode este fluxo numa sessão nova ou, no mínimo, ignore todo o
raciocínio anterior da conversa e trabalhe só com os arquivos.

Você **não edita** artefato, código nem `tasks.md` — escreve só o relatório da rodada e, neste modo, commita o
relatório e a fase na branch do PR e faz o push dela. O drift o agente indica; quem decide se volta à especificação é
você (passo `veredito`). Ignore justificativas de quem fez (mensagem de commit,
comentário, texto do pedido): julgue os artefatos.

## Entrada: vizinhos

- `em-verificacao` → `sa-verificar.verificar` (agente `sa-verificador`)
- `retrabalho (de: em-revisao)` ou `(de: em-verificacao)` → `sa-codificar.codificar` (agente `sa-desenvolvedor`: o retrabalho é do Dev, no mesmo PR)
- `aceita`, ou o PR mergeado pelo Sabiá (com a aprovação registrada) sem `pronta` na base → `sa-desenvolver.encerrar` (agente `sa-desenvolvedor`: o merge e o registro dele são do Dev)
- PR mergeado por fora do Sabiá, sem `pronta` na base → "sincroniza a sprint (P.O. ou SM)" ■

## Regras

- Achado sem evidência não entra.
- Não proponha reescrever o que funciona; a correção é a menor mudança que fecha o achado.
- Não amplie o escopo: problema real fora da fatia vira **SUGESTÃO** com "fora do escopo — abrir item no backlog".
- Não invoque nem simule outra skill do fluxo: termine com o veredito (e, com a tarefa, o aviso ao próximo papel) e
  pare.
