---
{"resumo": "Só no manual, na volta do 'alterei': baixa do DOORS os artefatos do Cobre para elm/, atualiza a versão lida, grava o delta completo e marca Publicado: manual."}
---
## Entrada

O "alterei FT-nnn" (nesta ou em outra sessão), a ficha com Especificação `manual` e os arquivos de `elm/` com commit
de base.

## Faça

1. **Baixar.** Para cada artefato do Cobre, peça à `sa-elm.baixar` (modo artefato) o texto atual e o `modificado_em`
   e regrave o arquivo de `elm/`: o diff contra o commit de base mostra o que mudou.
2. **Por ação.** Altera: atualize a versão lida na linha do Cobre. Inclui: pergunte o id do ELM que o
   especificador criou, baixe, renomeie para `<id do ELM>-<TIPO>-<slug>.md` e troque o id provisório no Cobre e no
   `prd.md` do épico pai. Exclui: pergunte se foi para a lixeira do DOORS.
3. **Delta.** Grave na pasta da spec o texto completo de cada requisito tocado: OpenSpec, `specs/<cap>/spec.md` com
   ADDED · MODIFIED · REMOVED; Kiro, `requirements.md` (no bug, `bugfix.md`) com o bloco completo de cada requisito.
4. **Publicado.** Em cada arquivo, `publicado: manual <AAAA-MM-DD>` no frontmatter, para a `sa-elm.publicar` não
   reenviar.
5. **Gravar.** Pela gravação comum na base (passo `gravar`, commit `FT-nnn elm: sincroniza <ids>`), e volte aqui.

## Saída

Sincronizado → passo `aprovar`. O passo `conferir` não roda: o arquivo já é o DOORS.

## Pare se

- A ficha não está em Especificação `manual` → "o 'alterei' é só da especificação manual" e pare.
- Inclui sem o id do ELM → o arquivo fica com o id provisório e a pendência no Em aberto da ficha; siga com os outros.
