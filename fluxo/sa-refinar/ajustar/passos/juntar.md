---
{"resumo": "Junta fatias: a primeira na ordem absorve as outras, que ficam canceladas com virou FT-nnn."}
---
## Entrada

As fatias aprovadas no passo `previa`, todas antes de `em-andamento`.

## Faça

1. A primeira na ordem absorve as outras: Regras, Cenários (renumerados na série dela), Cobre e os arquivos de
   `elm/` (`git mv` para a pasta da spec dela).
2. As absorvidas ficam `cancelada`, com `virou FT-nnn` na `obs`.
3. A ficha que absorveu volta para `**Aprovado:** —`, e a DoR é refeita; o tamanho se atualiza (maior que G → não
   junte: diga e volte à prévia).

## Saída

A junção → passo `gravar`.

## Pare se

- A soma passa de G → diga "a junção passa de G" e volte ao passo `previa`.
