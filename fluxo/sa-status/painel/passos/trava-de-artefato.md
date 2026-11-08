---
{"resumo": "Precedência quando duas fatias alteram o mesmo artefato do DOORS."}
---
## Entrada

As pastas `elm/` das fatias e os artefatos afetados das fichas, na base.

## Faça

1. Leia na base as pastas `elm/` das fatias que ainda seguram artefato: não `cancelada` e sem `Publicação:
   publicada` no `status.md` (sem ELM: não `concluida`). Arquivo: `<pasta da spec>/elm/<id do ELM>-<tipo>-<slug>.md`;
   no OpenSpec, também as arquivadas. Leia também os artefatos afetados das fichas com `altera` ou `exclui`.
2. O mesmo `<id do ELM>` em duas fatias → a precedência é da fatia cujo arquivo entrou primeiro na base
   (`git log --diff-filter=A`). A outra fica `aguarda <FT> (artefato <id>)` até a primeira ficar cancelada ou com
   `Publicação: publicada`. A fatia que só tem o artefato nos artefatos afetados também aguarda.

## Saída

Travas por item → passo `metricas`.

## Pare se

Sem condição própria.
