---
{"resumo": "Com ELM e Cobre com inclui, altera ou exclui: pergunta o modo da especificação e chama a sa-especificar.elm, que monta e aprova os arquivos de elm/ da fatia."}
---
## Entrada

O Cobre do passo `cobre`; na volta da especificação manual (`alterei FT-nnn`), a ficha com `Especificação: manual`.

## Faça

Sem ELM (sem a chave `elm` no `agentes.json`), ou Cobre sem `inclui`, `altera` ou `exclui` → pule este passo (sem
pergunta e sem a linha Especificação na ficha).

1. **Modo da especificação**, perguntado uma vez e fixo até o fim dela: IA supervisionada · IA autopilot · manual.
   Grave `Especificação: <modo>` no cabeçalho da ficha. É independente do modo da codificação.
2. **Chame a `sa-especificar.elm`** com o especificador presente e o modo. Ela monta a pasta `elm/` dentro da pasta da
   spec (`.kiro/specs/ft-<nnn>-<slug>/elm/` ou `openspec/changes/ft-<nnn>-<slug>/elm/`, pelo `formato_spec`), aplica
   a trava de artefato, baixa os originais e grava o commit de base, direto na base.
   - IA supervisionada ou IA autopilot: edita, e o especificador aprova cada arquivo inteiro (HF, UC, REG, MSG, EL, GL).
   - Manual: o especificador altera direto no DOORS, e a skill encerra a especificação nesta sessão; na volta
     (`alterei`), ela sincroniza e segue para a aprovação.
3. **Volta**: a `sa-especificar.elm` devolve os arquivos aprovados, pendentes e travados. Artefato travado → Em aberto
   da ficha: `bloqueada por FT-mmm (<sigla>-<id>)`; a fatia espera a outra ficar cancelada ou publicada.
4. **Sem o especificador na sessão**: o Cobre fica gravado e o item segue `aceita` (DoR incompleta).

## Saída

Os arquivos de `elm/` aprovados, pendentes e travados, e a linha Especificação → passo `duvidas`.

## Pare se

Nenhuma condição própria: pendência de `elm/` só deixa a DoR incompleta.
