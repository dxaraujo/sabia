---
{"fluxo": "iniciar", "dono": "sa-desenvolvedor",
 "quando": ["assumir uma fatia ou um bug para desenvolvimento: tamanho, trilha e autonomia num passo só, posse na branch base, branch <id> e pasta da spec", "vamos trabalhar na FT-031", "pegar a FT-031", "próxima", "corrigir o defeito 4567", "puxar o topo da sprint"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "nao", "saidas": {"pedido em texto ou defeito sem id": "captura"}},
   {"id": "conferir", "travas": ["artefato-exclusivo"], "saidas": {"aceita sem o sim de quem puxa: refinar antes": "→ sa-refinar.detalhar", "fora da sprint sem prioridade crítica, trava de artefato ou registro só local sem o push": "fim"}},
   {"id": "assumir", "saidas": {"maior que G: vira épico, sem branch": "→ sa-refinar.moldar"}},
   {"id": "posse", "saidas": {"outra pessoa pegou o item, ou a gravação na branch base parou": "fim"}},
   {"id": "branch", "saidas": {"sem o ok da branch": "fim"}},
   {"id": "pasta"},
   {"id": "push"},
   {"id": "elm", "chama": "sa-elm.item"},
   {"id": "seguir", "saidas": {"IA supervisionada ou manual, trilha rápida ou completo": "→ sa-plano.plano", "IA supervisionada, trilha trivial": "→ sa-desenvolver.codificar", "manual, trilha trivial: sessão encerrada até o 'terminei'": "fim", "IA autopilot": "autopilot"}},
   {"id": "autopilot", "saidas": {"subagente lançado: a devolução vem no fim do codificar ou no disjuntor": "fim"}},
   {"id": "captura", "de": "captura", "saidas": {"capturado: a triagem vem antes do desenvolvimento": "→ sa-triar.triar"}},
   {"id": "gravar", "de": "commit-na-branch-base"}
 ]}
---
# Iniciar — assumir a tarefa

Quem tem a booleana `desenvolvedor` pega uma fatia ou um bug (`FT-nnn`) e assume: confirma o tamanho, escolhe a trilha
e a autonomia, grava a posse na branch base e cria a branch `<id>` e a pasta da spec. A posse é o push da branch.

Deste fluxo: fatia ou bug `pronta` (ou `aceita`, com o sim de quem puxa) sem branch `<id>` publicada; ou
`em-andamento` sem branch publicada, retomado pelo responsável (a sessão parou antes do push); ou `pronta` com branch
`<id>` publicada, que voltou ao backlog na virada (a posse volta; branch, pasta e `status.md` são reaproveitados). "Próxima" sem id: o
primeiro item do `sprint-<nn>.md` aberto com Trabalho `desenvolvimento`, status `pronta` e sem Responsável; nenhum →
"o topo está vazio; o reabastecimento é do P.O. (`sa-planejamento.sprint`)" e pare.

Os passos `captura` e `gravar` são a captura comum e o commit direto na branch base: outros passos os incluem e voltam.

## Entrada: vizinhos

- tipo sustentação → `sa-atender.atender`
- tipo épico → épico não se puxa para desenvolvimento: `sa-status <id>` mostra a fase e o dono ■
- status nova → `sa-triar.triar` (agente `sa-especificador`)
- status em-andamento com branch `<id>` publicada → `sa-desenvolver.codificar`
