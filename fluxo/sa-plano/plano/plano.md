---
{"fluxo": "plano", "dono": "sa-desenvolvedor",
 "quando": ["planejar a fatia: pesquisa, decisões, spec do Kiro, análise independente e GATE do plano", "planeja a FT-031", "gera a spec", "cria as tasks"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "pesquisa", "chama": "sa-pesquisar.pesquisar"},
   {"id": "decisoes", "saidas": {"lacuna de negócio: é do P.O.": "fim"}},
   {"id": "escrever", "saidas": {"plano grande demais: proposta de divisão, bloqueada (de: planejando)": "fim"}},
   {"id": "analise", "chama": "sa-revisar.revisar", "travas": ["revisao-independente"], "saidas": {"AJUSTAR, falta do plano": "escrever", "AJUSTAR, falta do PRD": "decisoes", "sem subagente: plano pronto para análise": "fim"}},
   {"id": "gate", "saidas": {"com GATE: aprovador avisado": "→ sa-revisar.aprovar-plano", "sem GATE: fase implementando": "→ sa-codificar.codificar", "Dev aceitou a troca para HITL: P.O. avisado": "→ sa-planejamento.troca-modo"}}
 ]}
---
# Plano — decidir o como antes de codar

O plano existe para que as decisões de desenho sejam tomadas **com** uma pessoa, não descobertas por ela no
code review. Ele é curto, concreto e descartável: depois do merge, o que vale é o código, o ELM, o glossário e os
ADRs. Templates: o padrão `sa-plano/plano.md`.

Entrada: pasta `.kiro/specs/<ft>-<slug>/` criada pela `sa-desenvolver`, na branch da fatia.
Leia: `status.md`, a fatia no `backlog.md`, o PRD do épico (histórias e regras cobertas), a ficha da fatia sem
épico (`<produto>/fatias/`) ou o defeito,
`.sabia/sabia.md` (com as regras aprendidas) e o steering de tecnologia/estrutura.

## Modo autônomo

`AUTONOMO=true`: sem perguntas; decisão técnica com alternativas → escolha a recomendada e registre; lacuna de
negócio → `fase: bloqueada (de: planejando)` com a pergunta para o P.O. Passo `gate` sem pessoa: fatia AFK com risco →
`fase: bloqueada (de: planejando)`, `aguardando troca para HITL` com o risco (a sugestão vai ao P.O.); GATE → Sênior
segue para `implementando`; Pleno → a escolha do lote que quem chamou passou (sem ela: `aguardando-aprovacao-plano`,
e a pergunta fica para a sessão dele); nada de ELM (`ELM pendente [<chave>]`).

## Regras

- Não invoque nem simule outra skill do fluxo: termine dizendo a próxima (`sa-codificar`, o Dev Sênior da `[APR]`
  ou o P.O. na troca de modo e na divisão) e pare. A `sa-pesquisar` e o subagente revisor, que os passos mandam
  chamar, fazem parte deste fluxo.
