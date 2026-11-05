---
{"fluxo": "plano", "dono": "sa-desenvolvedor",
 "quando": ["planejar a fatia: pesquisa, decisões, spec do Kiro, análise independente e GATE do plano", "planeja a FT-031", "gera a spec", "cria as tasks"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao", "saidas": {"aguardando-aprovacao-plano sem a [APR], ou bloqueada \"aguardando troca de modo\"": "gate"}},
   {"id": "pesquisa", "chama": "sa-pesquisar.pesquisar"},
   {"id": "decisoes", "saidas": {"lacuna de negócio na ficha sem épico: é do P.O.": "fim", "artefato que precisa mudar, [ESP] FT aberta ou reaberta: bloqueada, a [ESP] é do especificador": "→ sa-especificar.fatia", "artefato que precisa mudar, [ESP] concluída numa sprint fechada ou sem [ESP]: bloqueada, o encaixe é do P.O. ou do SM": "→ sa-planejamento.durante", "artefato que precisa mudar, sem sprint aberta: bloqueada, pendência do P.O. na [GB]": "→ sa-planejamento.sprint"}},
   {"id": "escrever", "saidas": {"plano grande demais: bloqueada (de: planejando), o P.O. decide (de épico: seguir ou cancelar e registrar as partes pela sa-triar; sem épico: dividir pela sa-triar)": "fim"}},
   {"id": "analise", "chama": "sa-revisar.revisar", "travas": ["revisao-independente"], "saidas": {"ANALISE: AJUSTAR, falta do plano": "escrever", "ANALISE: AJUSTAR, falta do PRD ou da ficha": "decisoes", "sem subagente: plano pronto para análise": "fim"}},
   {"id": "gate", "saidas": {"com GATE: aprovador avisado": "→ sa-revisar.aprovar-plano", "sem GATE: fase implementando": "→ sa-codificar.codificar", "AFK com risco: bloqueada, a troca é do P.O. ou do SM": "fim"}}
 ]}
---
# Plano — decidir o como antes de codar

O plano existe para que as decisões de desenho sejam tomadas **com** uma pessoa, não descobertas por ela no
code review. Ele é curto, concreto e descartável: depois do merge, o que vale é o código, o ELM, o glossário e os
ADRs. Templates: o padrão `sa-plano/plano.md`.

Deste fluxo: a pasta `.kiro/specs/<ft>-<slug>/` (`<ft>` = `ft-<nnn>` em minúsculas) criada pela `sa-desenvolver`, na branch da fatia, em `pesquisando`,
`planejando`, `bloqueada (de: pesquisando | planejando)` ou `aguardando-aprovacao-plano` sem a `[APR]` (passo `gate`).
Bloqueada `aguardando especificação [ESP] FT-<nnn>` com a linha da Especificação `concluida` na base → traga a base para
a branch (`git merge origin/<base>`, com "sim": os conceitos aprovados chegam em `elm/`), `Bloqueio: —`, a fase de
origem e siga. A ficha com linha de Especificado `—` e a `[ESP] FT` aberta (pedido de fora da fatia, [Volta à
especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) → `bloqueada (de: <fase>)` com o
Bloqueio `aguardando especificação [ESP] FT-<nnn>: …`, commit, e pare. Bloqueada por outro motivo → mostre o motivo e a pergunta; resolvido, `Bloqueio: —`, a fase de origem e siga.
Quem retoma é o `responsavel` da linha viva da fatia na sprint (base): outra pessoa → "é de <login>; trocar é do P.O.
ou do SM" e pare. A `[DEV]`, na retomada, pela seção Assumir do passo `sa-plano.plano.entrada` (já é dele → nada;
fechada → reabrir com "sim"). No loop (`AUTONOMO`), o lote já assumiu.

Leia: `status.md`, a fatia no `backlog.md`, a ficha da fatia (toda fatia; na base: `git fetch` e `git show
origin/<base>:<produto>/<caminho da coluna ficha>`, com a seção Artefatos afetados), o PRD do épico (histórias e regras
cobertas) ou o defeito, os conceitos aprovados em `elm/` da pasta da fatia, `.sabia/sabia.md` (com as regras
aprendidas) e o steering de tecnologia/estrutura.

## Entrada: vizinhos

- sem `status.md` em nenhuma branch (fatia não iniciada) → `sa-desenvolver.desenvolver`
- `bloqueada (de: pesquisando | planejando)` com Bloqueio `aguardando especificação [ESP] FT-<nnn>` e a `[ESP] FT` aberta → `sa-especificar.fatia` (agente `sa-especificador`)
- `aguardando-aprovacao-plano` com a `[APR] Aprovar plano` criada → `sa-revisar.aprovar-plano` (agente `sa-revisor`)
- `implementando`, `revisando`, `verificando`, `verificada` ou `retrabalho (de: …)` → `sa-codificar.codificar`

## Modo autônomo

`AUTONOMO=true`: sem perguntas; decisão técnica com alternativas → escolha a recomendada e registre; lacuna de
negócio na ficha → `fase: bloqueada (de: planejando)` com a pergunta para o P.O.; artefato que precisa mudar → o bloco
Volta à especificação (passo `decisoes`): a `[ESP]` concluída na sprint aberta tem a linha gravada `iniciada` (`reaberta: <motivo>`), e quem especifica a reabre no EWM ao assumir. Passo `gate` sem pessoa: fatia AFK com risco →
`fase: bloqueada (de: planejando)`, Bloqueio `aguardando troca de modo · motivo: <risco>` (a troca é do P.O. ou do SM); GATE → Sênior
segue para `implementando`; Pleno → a escolha do lote que quem chamou passou (sem ela: `aguardando-aprovacao-plano`,
e a pergunta fica para a sessão dele); nada de ELM (as pendências com a chave do passo: `[DEV FT-<nnn> horas]`, `[APR FT-<nnn> criar]`).

## Regras

- Não invoque nem simule outra skill do fluxo: termine dizendo a próxima (`sa-codificar`, o Dev Sênior da `[APR]`,
  o P.O. ou o SM na troca de modo, o P.O. no plano grande demais, quem o `Próximo:` do bloco diz na volta à especificação) e pare. A `sa-pesquisar` e o subagente revisor, que os passos mandam
  chamar, fazem parte deste fluxo.
