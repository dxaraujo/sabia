---
{"resumo": "Com ELM, cita o GL do DOORS e leva a mudança de termo ao Cobre; sem ELM, grava o termo no glossario.md opcional."}
---
## Entrada

Os termos de negócio que apareceram na entrevista e a chave `glossario` do `agentes.json`.

## Faça

- **Com ELM e o termo no GL do DOORS** → cite o GL. Mudar ou criar um GL entra no Cobre da ficha
  (`GL-<id> · altera` ou `inclui`) e vai ao texto oficial pela `sa-especificar.elm`.
- **Sem ELM** → o `glossario.md` opcional (`glossario` = `null`: não usa), pelo padrão
  `sa-entrevistar/glossario.md`: `Termo | Definição | Evitar | Fonte`. Um termo por conceito; sinônimos vão a Evitar.
- Termo novo não é exigido.

## Saída

Chamada por outra skill → passo `devolver`. Chamada direta → passo `gravar`, com o documento e o glossário.

## Pare se

Nenhum caso próprio deste passo.
