---
{"resumo": "Lê o campo Drift de negócio do status.md (indicado pela revisão e pela verificação) e registra a divergência depois do merge como débito técnico de especificação, sem reabrir a especificação."}
---
## Entrada

Fatia `pronta` na base, já na base (passo `entrada`), e o campo **Drift de negócio** do `status.md`.

## Faça

Leia o campo **Drift de negócio** do `status.md` — indicado pela revisão (`sa-revisar`, rubrica C) e pela
verificação (`sa-verificar`), decidido pela pessoa que revisou ou verificou. Não releia o `design.md` nem o
`verificacao.md` atrás de drift: isso já foi julgado.

- `não`, ou `… · especificação: [ESP] FT-<nnn>` (ou `[ESP] FT-<nnn> Revisão <n>`) com a `[ESP]` concluída: a linha
  dela `concluida` na seção Especificação de um `sprint-<nn>.md` (do aberto para os fechados) ou, com o MCP, o estado
  concluído no `elm_ler_wi(<id>)` → os artefatos foram publicados na conclusão dela: siga.
- `possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)` sem ` · especificação:` (sem decisão: merge por
  fora do Sabiá), ou `—` respondido com divergência → **débito técnico de especificação**: o código está mergeado e a
  `[DEV]` encerrada, então **não se reabre especificação, e o P.O. de negócio não altera artefato**. Grave uma linha
  por artefato na seção **Débito de especificação** do `sprint-<nn>.md` aberto
  ([arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#sprintspaisprint-nnmd)): FT, Artefato
  (`<id|rótulo> · <título> (<tipo>)`), Divergência, Registrado (`<login>, <AAAA-MM-DD>`), Tarefa `—`. O campo recebe
  ` · débito de especificação (<chave da sprint>)`, e diga, exata:
  `Débito de especificação registrado: FT-<nnn> · <artefatos> (<chave da sprint>) — a correção é decisão do P.O.`
  Sem sprint aberta → a linha vai no Histórico do `status.md` e na `obs` `débito de especificação` da linha da fatia no
  `backlog.md`; a review seguinte lê dali. Vai no commit do passo `fechar`; siga.
- `… · especificação: [ESP] FT-<nnn>` com a `[ESP]` não concluída por esse critério (merge por fora do Sabiá) → a publicação é da
  conclusão dela, com o especificador: siga.
- vazio (`—`) → pergunte a quem revisou ou verificou (Histórico) e grave a resposta no campo; não procure você;
  sem REV nem VER no Histórico (fatia `pronta` pela sincronização, `merge do PR <link> por fora do Sabiá`) → pergunte
  ao Dev responsável (o dono da `[DEV]`) e grave a resposta no campo.

## Saída

O drift lido, e o débito de especificação registrado quando há → passo `elm`.

## Pare se

—
