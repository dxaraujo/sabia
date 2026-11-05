---
{"resumo": "Pré-condição dos ritos de fechamento, 2ª parte: fatias prontas ou mergeadas sem consolidar param o rito até o P.O. decidir."}
---
## Entrada

A sincronização feita (passo `sincronizar`).

## Faça

Depois, as fatias da sprint aberta que esperam a consolidação: Status `pronta` nas Fatias do `sprint-<nn>.md`
(inclusive as que a sincronização acabou de gravar), mais as do PR `merged` sem `pronta` (a linha `arquivo: pronta`
ficou `manter`). Nenhuma → siga o rito.

Segue só com o "sim" do **P.O.** (outra pessoa → peça a decisão a ele), gravado no cabeçalho do `sprint-<nn>.md`:
`**Fechamento sem consolidar:** FT-… (<P.O.>, <data>)` (bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base),
commit `<pai>/Sprint <nn>: fechamento sem consolidar`). A decisão vale para essas fatias nos ritos seguintes da
mesma sprint (não pergunte de novo); elas migram como as não concluídas, com a Observação `não consolidada`. Fatia
sem merge (`pr-aberto`, `em-revisao`…) não entra aqui: migra, como sempre.

## Saída

Nenhuma fatia esperando, ou o "sim" do P.O. gravado → o rito (na review, passo `rito`; na retrospectiva, o passo
seguinte do fluxo `sa-planejamento.retrospectiva`).

## Pare se

Alguma → **pare** e mostre:

```
⛔ Consolidação antes do fechamento de <pai>/Sprint <nn>
| FT | Status | PR | Falta |
| FT-031 | pronta | <link> | sa-consolidar (P.O. ou SM, agente sa-produto) |
| FT-033 | iniciada, PR mergeado | <link> | fluxo encerrar da sa-desenvolver (o Dev) ou o arquivo: pronta da sincronização, depois sa-consolidar |
Consolide todas antes da review, da retrospectiva e da virada: só fatia consolidada conta na vazão, entra na
review e fecha no EWM. Seguir mesmo assim? (decisão do P.O.)
```
