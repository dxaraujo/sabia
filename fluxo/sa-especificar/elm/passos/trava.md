---
{"resumo": "Para cada altera ou exclui, procura o mesmo id no elm/ de outra fatia que ainda o segura; o artefato segurado fica de fora."}
---
## Entrada

As linhas altera e exclui dos artefatos afetados da ficha.

## Faça

1. **Procurar.** Para cada id, procure um arquivo `<id do ELM>-*` em `.kiro/specs/*/elm/`, `openspec/changes/*/elm/`
   e `openspec/changes/archive/*/elm/`, fora da pasta desta fatia.
2. **Quem segura.** A outra fatia segura o artefato enquanto não está `cancelada` no `backlog.md` e não tem
   `Publicação: publicada` no `status.md` da pasta da spec dela. A precedência é de quem gravou o arquivo primeiro na branch base (`git log --diff-filter=A --format=%h\ %ad -- <arquivo>`).
3. **Segurado.** Mostre a fatia dona e deixe esse artefato de fora: "`<id>` está no `elm/` da `<FT dona>` até ela
   ficar cancelada ou publicada". Siga com os outros. A `sa-status.painel` mostra a trava.

## Saída

Os artefatos livres → passo `baixar`. Todos segurados → passo `devolver`, com a lista.

## Pare se

Nenhum caso próprio deste passo: o artefato segurado fica de fora e o fluxo segue com os outros.
