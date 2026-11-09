---
{"resumo": "Só no manual, na volta do 'alterei': baixa do DOORS os artefatos afetados para elm/, atualiza a versão de referência, grava o delta completo e marca Publicado: manual."}
---
## Entrada

O "alterei FT-nnn" (nesta ou em outra sessão), a ficha com Especificação `manual` e os arquivos de `elm/` com commit de referência.

## Faça

1. **Baixar.** Para cada artefato afetado, peça à `sa-elm.baixar` (modo artefato) o texto atual e o `modificado_em`
   e regrave o arquivo de `elm/`: o diff contra o commit de referência mostra o que mudou.
2. **Por ação.** Altera: atualize a versão de referência na linha dos artefatos afetados. Inclui: pergunte o id do ELM que o
   especificador criou, baixe, renomeie para `<id do ELM>-<TIPO>-<slug>.md` e troque o id provisório nos artefatos afetados e no
   `prd.md` do épico pai. Exclui: pergunte se foi para a lixeira do DOORS.
3. **Delta.** Grave na pasta da spec o texto completo de cada requisito tocado: OpenSpec, `specs/<cap>/spec.md` com
   ADDED · MODIFIED · REMOVED; Kiro, `requirements.md` (no bug, `bugfix.md`) com o bloco completo de cada requisito.
4. **Publicado.** Em cada arquivo, `publicado: manual <AAAA-MM-DD>` no frontmatter, para a `sa-elm.publicar` não
   reenviar.
5. **Gravar.** Pelo commit direto na branch base (passo `gravar`, commit `FT-nnn elm: sincroniza <ids>`), e volte aqui.

## Saída

Sincronizado → passo `aprovar`. O passo `conferir` não roda: o arquivo já é o DOORS.

## Pare se

- A ficha não está em Especificação `manual` → "o 'alterei' é só da especificação manual" e pare.
- Inclui sem o id do ELM → o arquivo fica com o id provisório e a pendência no Em aberto da ficha; siga com os outros.
