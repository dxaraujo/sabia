---
{"resumo": "Mostra a tabela à pessoa uma vez, com cobertura e ponta a ponta, e ajusta até o ok: o GATE do backlog."}
---
## Entrada

A tabela de fatias do passo `rascunho`.

## Faça

Pergunte à pessoa (uma vez, com a tabela):

```
🍰 EP-<nn> — <n> fatias · <a> AFK · <h> HITL · tamanhos <P/M/G>
<tabela>
Cobertura: <c>/<c> cenários · Ponta a ponta (tracer bullet): FT-<…> — <gatilho> → <saída observável>
- A granularidade está boa? (muito grossa / muito fina)
- As dependências estão certas?
- Alguma fatia deveria ser HITL/AFK ao contrário?
```

Ajuste (dividir, juntar ou mudar uma fatia) e repita até "ok". Esse "ok" é o **GATE do backlog** (o P.O.) — e não
vale sem a fatia ponta a ponta. Depois dele, as fatias não se alteram mais: só o cancelamento pelo P.O.
(`sa-fatiar.refinamento`).

## Saída

"ok" da pessoa (GATE do backlog) → passo `gravar`. Ajuste pedido → repita este passo.

## Pare se

Sem a fatia ponta a ponta, o "ok" não vale: não grave.
