---
{"resumo": "Trata o que ficou aberto: spike, protótipo ou reunião para dúvida grande, Em aberto para regra sem fonte, dividir ou virar épico para o que passa de G."}
---
## Entrada

As perguntas sem resposta e o tamanho estimado depois dos passos anteriores.

## Faça

| Caso | O que fazer |
|---|---|
| dúvida grande de código | spike pela `sa-pesquisar.pesquisar`, que devolve os fatos aqui |
| dúvida grande de tela | protótipo pela `sa-especificar.prototipo`; só vale com a aprovação do cliente |
| reunião com transcrição | ATA pela `sa-especificar.reuniao`, que leva as decisões à ficha |
| regra sem fonte | Em aberto da ficha: `<pergunta> · para <nome com produto> · Bloqueia: <CT-nn \| esta fatia>`; para só o que depende dela |
| muitas regras ou mais que G, com corte possível | dividir pela `sa-refinar.ajustar` |
| mais que G, sem corte | vira épico: a linha `EP-nn` `a-moldar` nasce pelo passo `captura`, com `veio de FT-nnn`, e a fatia fica `cancelada` com `virou EP-nn`, no mesmo commit |

Dúvida grande não faz o item virar épico: só o tamanho maior que G.

## Saída

Resposta que muda regras ou cenários → passo `regras`. Dividir → passa à `sa-refinar.ajustar`. Vira épico → passo
`captura`. Os demais → passo `ficha`.

## Pare se

Nenhuma condição própria: o que fica aberto vai para Em aberto da ficha.
