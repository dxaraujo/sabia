---
{"resumo": "Mostra a tabela à pessoa uma vez, com cobertura e ponta a ponta, e ajusta até o ok: o GATE do backlog, do P.O. ou do SM."}
---
## Entrada

A tabela de fatias do passo `rascunho`.

## Faça

Pergunte à pessoa (uma vez, com a tabela):

```
🍰 EP-<nn> — <n> fatias · <a> AFK · <h> HITL · tamanhos <p>P · <m>M · <g>G
<tabela>
Cobertura: <c>/<c> cenários · Ponta a ponta (tracer bullet): FT-?<n> — <gatilho> → <saída observável>
Artefatos afetados: <a>/<a> do PRD (<i> inclui · <l> altera · <x> exclui) · FT-?<n>: <ids ou rótulos>
🔗 <id> (<tipo>) já está na ficha de FT-<mmm> (<status>) → FT-?<n> bloqueada-por FT-<mmm>   (uma por id; nenhuma → sem a linha)
- A granularidade está boa? (muito grossa / muito fina)
- As dependências estão certas?
- Alguma fatia deveria ser HITL/AFK ao contrário?
```

Os ids da tabela são os provisórios do rascunho (`FT-?<n>`); a fatia nova de um ajuste ganha o próximo `FT-?<n>`.
Ajuste (dividir, juntar ou mudar uma fatia); depois de cada ajuste, refaça na tabela ajustada os itens 3 a 5 do passo
`rascunho` (cobertura, ponta a ponta, artefatos afetados e `bloqueada-por`) e mostre-a de novo, até "ok". Esse "ok"
é o **GATE do backlog** (o P.O. ou o SM) — e não vale sem a fatia ponta a ponta. Depois dele, as fatias não se
alteram mais: só o cancelamento pelo P.O. (`sa-fatiar.refinamento`).

Conceito do PRD que precisa mudar (a pessoa pede, ou o rascunho mostra) → não se muda aqui: `sa-prd.mudanca`
(agente `sa-especificador`), antes de fatiar.

## Saída

"ok" da pessoa (GATE do backlog) → passo `gravar`. Ajuste pedido → repita este passo. Conceito do PRD que precisa
mudar → `sa-prd.mudanca`.

## Pare se

Sem a fatia ponta a ponta, o "ok" não vale: não grave; diga o que falta e repita este passo.
