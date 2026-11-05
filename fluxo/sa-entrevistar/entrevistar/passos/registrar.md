---
{"resumo": "Registra cada decisão no decisoes.md (padrão sa-entrevistar/decisoes.md), só por acréscimo."}
---
## Entrada

As decisões das rodadas (decididas, confirmadas e em aberto) e onde registrar (entrada do fluxo).

## Faça

No destino da entrada do fluxo, no formato do padrão `sa-entrevistar/decisoes.md` (o formato único: triagem,
especificação e PRD criam por este): o `decisoes.md` do épico ou a seção `## Decisões` da ficha (fatia sem épico;
nunca um `decisoes.md` ao lado dela). Cria na primeira; só acréscimo (a única exceção é a linha reservada por uma ATA `draft`, passo `sa-especificar.reuniao.escrever`) — decisão revista ganha nova linha que
**substitui** a antiga.

Situações: `decidida` (uma pessoa respondeu) · `confirmada` (fonte encontrada) · `em aberto` (sem resposta) ·
`em aberto — ATA-<nn> draft` · `decidida — substitui D-nn` (a linha antiga não muda). Em aberto → o `bloqueia: sim`
ou `bloqueia: não` na Decisão (padrão).

## Saída

`decisoes.md` (ou a seção Decisões da ficha) atualizado → passo `linguagem`.

## Pare se

Nenhum caso próprio deste passo.
