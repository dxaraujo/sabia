---
{"resumo": "Propõe as linhas de desenvolvimento (itens pronta, crítica primeiro, até a sobra) e de atendimento (até a folga)."}
---
## Entrada

A sobra e a folga (passo `capacidade`) e o `backlog.md` da base.

## Faça

1. **Desenvolvimento**: itens `pronta` (fatia ou bug). Prioridade `crítica` primeiro, depois a ordem das linhas do
   `backlog.md`, até a sobra. `adiada até <data>` não entra antes da data. O item preso pela trava de artefato
   (`sa-status.pendencias`) entra com o aviso `aguarda <FT> (artefato <id>)`.
2. **Atendimento**: itens sustentação `nova` ou `em-andamento` com prazo dentro da sprint, até a folga.
3. Os desenvolvedores dizem se cabe; quem tem `produto` decide. A DoR é só o checklist da ficha.

## Saída

As linhas de desenvolvimento e atendimento → passo `responsaveis`.

## Pare se

Sem condição própria.
