---
{"resumo": "Avisa o Dev pela dona da fase gravada (sem passagem): sa-plano, sa-codificar ou sa-desenvolver; no HITL novo, também o revisor e o verificador."}
---
## Entrada

A troca gravada (passo `gravar`).

## Faça

Diga ao Dev por onde ele retoma, pela fase gravada no `status.md`:

- fatia `planejada`, ou `iniciada` sem `status.md` → "o Dev começa pela `sa-desenvolver FT-<nnn>`";
- `pesquisando`, `planejando`, `bloqueada (de: planejando)` → "o Dev retoma pela `sa-plano FT-<nnn>`" (o GATE no
  modo gravado);
- `aguardando-aprovacao-plano` → "o aprovador segue pela `sa-revisar` (`[APR] Aprovar plano`)";
- `implementando`, `revisando`, `verificando`, `verificada`, `aguardando-aprovacao-pr`, `retrabalho` → "o Dev retoma
  pela `sa-codificar FT-<nnn>`";
- `bloqueada (de: <fase>)` → pela fase de origem, nesta lista.

No HITL novo, avise também o revisor e o verificador: a `[REV]` e a `[VER]` são deles quando o PR abrir — com o PR
já aberto (`aguardando-aprovacao-pr`), já: o revisor entra pela `sa-revisar FT-<nnn>`.

## Saída

O Dev avisado: o fluxo termina.

## Pare se

Sem condição de parada própria.
