---
{"resumo": "Lê o campo Drift de negócio do status.md (indicado pela revisão e pela verificação) e, com sim sem a [ESP] FT concluída, leva a fatia de volta à especificação antes de publicar."}
---
## Entrada

Fatia `pronta` na base, já na base (passo `entrada`), e o campo **Drift de negócio** do `status.md`.

## Faça

Leia o campo **Drift de negócio** do `status.md` — indicado pela revisão (`sa-revisar`, rubrica C) e pela
verificação (`sa-verificar`), decidido pela pessoa que revisou ou verificou. Não releia o `design.md` nem o
`verificacao.md` atrás de drift: isso já foi julgado.

- `sim — <motivo> · artefatos: <id|rótulo> (<tipo>)`, sem ` · especificação:` → o código entregue não é o que o
  artefato aprovado diz, e o artefato volta à especificação **antes** de publicar (passo `elm`): rode a
  [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação) (a `[ESP] FT-<nnn>`
  da fatia; sem ela na sprint aberta, o encaixe). A `pronta` não muda de fase: o campo recebe
  ` · especificação: [ESP] FT-<nnn>`, na base, pelo bloco
  [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base); pare.
- `sim — … · especificação: [ESP] FT-<nnn>` → a `[ESP] FT` aberta (a linha dela na seção Especificação do
  `sprint-<nn>.md` ainda não `concluida`) → aguardando a especificação: pare; concluída → os artefatos aprovados
  estão na base (`.kiro/specs/ft-<nnn>-<slug>/elm/`): siga.
- `não` → nada a especificar.
- vazio (`—`) → pergunte a quem revisou ou verificou (Histórico) e grave a resposta no campo; não procure você;
  sem REV nem VER no Histórico (fatia `pronta` pela sincronização, `merge do PR <link> por fora do Sabiá`) → pergunte
  ao Dev responsável (o dono da `[DEV]`) e grave a resposta no campo.

## Saída

O drift resolvido (`não`, ou a `[ESP] FT` concluída) → passo `elm`. Drift `sim` sem a `[ESP] FT` concluída →
`sa-especificar.fatia` (agente `sa-especificador`).

## Pare se

- Drift `sim` sem ` · especificação:` → a Volta à especificação rodada: pare.
- `[ESP] FT` do drift ainda aberta → aguardando a especificação: pare.
