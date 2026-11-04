---
{"resumo": "Mostra o item registrado e o caminho para começá-lo pelo sa-iniciar e pergunta se há mais item; no \"não\", resumo, créditos e o commit único."}
---
## Entrada

O item registrado no passo `registrar` (ou o épico `novo` completado no passo `chegou`; ou o não fazer do passo
`triagem`).

## Faça

```
📥 <FT-nnn | EP-nn | AT-nnn | IM-nnn…> — <título> · trilha <…> (sustentação: · <categoria>) · <elegivel | nova: falta … | novo: falta … | aberto | aberto na sprint <pai>/Sprint <nn>> · modo <AFK | HITL>
Origem: <DF 4567 | IB 611 | AT-012 | chamado | pedido> · Ficha: <caminho | —> · EWM: <DF 4567 | criado IB <id> (· ATD <id>) | pendente | sem ELM>
Artefatos afetados: <n> (<inclui · altera · exclui>) | nenhum | a confirmar · bloqueada-por: <FT-mmm | —>
Registrado. Para começar: use `sa-iniciar <id>` (o hub encaminha para a skill do papel; a fatia e o épico fora
da sprint entram nela ao começar — `sa-desenvolver.desenvolver.compromisso`; `sa-especificar.especificar.assumir`). Item de Sustentação fora
da sprint → use `sa-planejamento.durante.encaixe`, antes. Fatia `nova` com só `falta: especificação` → entra na
sprint como especificação, com a `[ESP] FT` (`sa-planejamento.sprint.previsao` ou `sa-planejamento.durante.encaixe`),
e o especificador começa pela `sa-iniciar FT-<nnn>`.
Mais algum item para triar?
```

- **"sim"** → volte ao passo `chegou` com o novo item, na mesma sessão e na base (sem novo `switch` nem `pull`).
- **"não"** → mostre o resumo da sessão (ids, trilhas, os itens espelhados no passo `chegou`, pendências `falta:`, `bloqueada-por` e `ELM
  pendente`), registre os créditos
  (o comentário na `[GB]`; as horas, só se é o SM e não é o P.O.), faça o commit único do passo `registrar` e encerre; se a
  triagem trocou de branch no passo `chegou`, ofereça voltar à anterior.

## Saída

"sim" → passo `chegou`. "não" → o commit único e o fim do fluxo.

## Pare se

A triagem termina aqui. **Nunca invoque nem simule outra skill** (nem `sa-iniciar`, nem a do papel): responda com
a instrução acima e pare. Recomeçar a própria triagem com o próximo item não é invocar outra skill.
