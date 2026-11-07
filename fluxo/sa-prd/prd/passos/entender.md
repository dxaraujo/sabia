---
{"resumo": "Lê o pitch e as decisões dele; com a pessoa presente, pede pistas; os fatos do trecho tocado vêm da sa-pesquisar.pesquisar."}
---
## Entrada

O `pitch.md` (com as Decisões), o `prd.md` aberto e o `agentes.json` (`elm.bundle`, `glossario`, `adr`).

## Faça

1. **Ler.** O `pitch.md` e as decisões dele.
2. **Pistas.** Com a pessoa presente, pergunte antes da busca: telas, regras, sistemas ou ids do ELM que ela já sabe
   que o épico toca.
3. **Fatos.** Peça à `sa-pesquisar.pesquisar` (subagente `sa-pesquisador`), só do trecho tocado: o vigente na ordem
   specs arquivadas → bundle → ELM ao vivo (leitura), o código, o GL (ou o `glossario.md`) e os ADRs. Bundle com
   `sincronizado_em` anterior à última publicação → mostre a data e pergunte se baixa (`sa-elm.baixar`).

## Saída

Os fatos com a fonte → passo `esclarecer`.

## Pare se

Nenhum caso próprio deste passo: sem bundle e sem ELM, o vigente vem das specs e do código.
