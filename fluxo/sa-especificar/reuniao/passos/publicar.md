---
{"resumo": "Publica a ATA aprovada no DOORS Next pela seção ATA do elm-publicar.md (tipo de reunião da PA) e a liga à [ESP], na aprovação dela e fora da ordem dos requisitos."}
---
## Entrada

A ATA `stable` com o `verified` humano (passo `aprovar`).

## Faça

Projeto com ELM (seção ELM do `.sabia/sabia.md`) → a seção [ATA](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md#ata-reunião-da-esp)
do `elm-publicar.md`, com prévia e "sim": a ATA é registro da reunião, não requisito, e sobe na aprovação, ligada à
`[ESP]` (`elm_ligar`, `tipo rastreia`). Sem o
"sim", a ATA segue sem publicar e o próximo encaminhar a traz de volta a este passo. Sem o MCP `elm` ou com falha →
`ELM pendente [ATA-<nn> EP-<nn> publicar]: publicar a ATA e ligar à [ESP]`, no lugar do épico na tabela de
[pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências) (o `rascunho.md` até o PRD na base; o
rodapé do `prd.md` depois), e o fluxo segue. Sem a sigla `ATA` em `rm.artefatos` do `pa` → a ATA fica só no repositório; avise. Projeto sem ELM → pule.

## Saída

A ATA publicada e ligada à `[ESP]` (ou `ELM pendente`, ou só no repositório) → passo `decisoes`.

## Pare se

Nenhum caso próprio deste passo: sem o MCP `elm`, `ELM pendente` e o fluxo segue.
