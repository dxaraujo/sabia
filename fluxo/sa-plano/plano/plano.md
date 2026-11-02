---
{"fluxo": "plano", "dono": "sa-desenvolvedor",
 "quando": ["planejar a fatia: pesquisa, decisões, spec do Kiro, análise independente e GATE do plano", "planeja a FT-031", "gera a spec", "cria as tasks"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao", "saidas": {"aguardando-aprovacao-plano sem a [APR], ou bloqueada \"aguardando troca de modo\"": "gate"}},
   {"id": "pesquisa", "chama": "sa-pesquisar.pesquisar"},
   {"id": "decisoes", "saidas": {"lacuna de negócio: é do P.O.": "fim"}},
   {"id": "escrever", "saidas": {"plano grande demais: proposta de divisão, bloqueada (de: planejando)": "fim"}},
   {"id": "analise", "chama": "sa-revisar.revisar", "travas": ["revisao-independente"], "saidas": {"AJUSTAR, falta do plano": "escrever", "AJUSTAR, falta do PRD": "decisoes", "sem subagente: plano pronto para análise": "fim"}},
   {"id": "gate", "saidas": {"com GATE: aprovador avisado": "→ sa-revisar.aprovar-plano", "sem GATE: fase implementando": "→ sa-codificar.codificar", "AFK com risco: bloqueada, a troca é do P.O. ou do SM": "fim"}}
 ]}
---
# Plano — decidir o como antes de codar

O plano existe para que as decisões de desenho sejam tomadas **com** uma pessoa, não descobertas por ela no
code review. Ele é curto, concreto e descartável: depois do merge, o que vale é o código, o ELM, o glossário e os
ADRs. Templates: o padrão `sa-plano/plano.md`.

Deste fluxo: a pasta `.kiro/specs/<ft>-<slug>/` criada pela `sa-desenvolver`, na branch da fatia, em `pesquisando`,
`planejando`, `bloqueada (de: pesquisando | planejando)` ou `aguardando-aprovacao-plano` sem a `[APR]` (passo `gate`).
Bloqueada por outro motivo → mostre o motivo e a pergunta; resolvido, `Bloqueio: —`, a fase de origem e siga.
Quem retoma é o `responsavel` da linha viva da fatia na sprint (base): outra pessoa → "é de <login>; trocar é do P.O.
ou do SM" e pare. A `[DEV]`, na retomada, pela seção Assumir do passo `sa-plano.plano.entrada` (já é dele → nada;
fechada → reabrir com "sim"). No loop (`AUTONOMO`), o lote já assumiu.

Leia: `status.md`, a fatia no `backlog.md`, o PRD do épico (histórias e regras cobertas), a ficha da fatia sem
épico (`<produto>/fatias/`) ou o defeito,
`.sabia/sabia.md` (com as regras aprendidas) e o steering de tecnologia/estrutura.

## Entrada: vizinhos

- sem `status.md` em nenhuma branch (fatia não iniciada) → `sa-desenvolver.desenvolver`
- `aguardando-aprovacao-plano` com a `[APR] Aprovar plano` criada → `sa-revisar.aprovar-plano`
- `implementando`, `revisando`, `verificando`, `verificada` ou `retrabalho (de: …)` → `sa-codificar.codificar`

## Modo autônomo

`AUTONOMO=true`: sem perguntas; decisão técnica com alternativas → escolha a recomendada e registre; lacuna de
negócio → `fase: bloqueada (de: planejando)` com a pergunta para o P.O. Passo `gate` sem pessoa: fatia AFK com risco →
`fase: bloqueada (de: planejando)`, `aguardando troca de modo` com o risco (a troca é do P.O. ou do SM); GATE → Sênior
segue para `implementando`; Pleno → a escolha do lote que quem chamou passou (sem ela: `aguardando-aprovacao-plano`,
e a pergunta fica para a sessão dele); nada de ELM (`ELM pendente [<chave>]`).

## Regras

- Não invoque nem simule outra skill do fluxo: termine dizendo a próxima (`sa-codificar`, o Dev Sênior da `[APR]`,
  o P.O. ou o SM na troca de modo, o P.O. na divisão) e pare. A `sa-pesquisar` e o subagente revisor, que os passos mandam
  chamar, fazem parte deste fluxo.
