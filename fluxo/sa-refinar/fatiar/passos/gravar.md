---
{"resumo": "Prepara as linhas aceita das fatias logo abaixo do épico, na ordem do P.O., as fichas com Objetivo, artefatos afetados e cenários do PRD, e o épico em fatiado, num commit."}
---
## Entrada

A tabela aprovada e ordenada no passo `perguntar`.

## Faça

1. **Linhas**, logo abaixo da do épico, na ordem do P.O.: id `FT-nnn` (maior da série + 1, lido depois do pull, na
   ordem da tabela) · tipo `fatia` · status `aceita` · `aceita_em` = hoje · tamanho · pai `EP-nn` · relator do
   épico · `ib` vazia. Troque os F1, F2… do Depende de pelos ids reais.
2. **Ficha** de cada fatia, pelo padrão `sa-refinar/ficha.md`: Tipo `fatia`, Pai `EP-nn`, Objetivo, artefatos afetados (sem versão de referência, que entra no detalhar), os cenários do PRD que ela cobre (os `CT-nn` se numeram no detalhar) e
   `**Aprovado:** <usuario> · AAAA-MM-DD` de quem deu o ok.
3. **Épico** → status `fatiado`.
4. Tudo num commit: `backlog: fatiamento EP-nn`.

## Saída

Linhas, fichas e a linha do épico prontas → passo `gravar-na-base`.

## Pare se

Nenhuma condição própria: as paradas da gravação são as do passo `gravar-na-base`.
