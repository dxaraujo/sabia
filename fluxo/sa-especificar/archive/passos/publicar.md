---
{"resumo": "Com ELM e algo a publicar, pergunta a quem tem especificador se publica no DOORS (sa-elm.publicar); senão, grava 'Publicação: pendente' no status.md."}
---
## Entrada

A pasta da spec (no OpenSpec, a arquivada), os arquivos de `elm/`, a seção ELM do `.sabia/sabia.md` (`ET as-built`) e
o `equipe.json`.

## Faça

1. **Sem ELM** (sem a chave `elm` no `agentes.json`) → passo `devolver`.
2. **O que publicar.** Os arquivos de `elm/` aprovados (`status: stable`) e sem `publicado: manual` e, com `ET as-built: sim`, a ET
   as-built do `design.md`. Arquivo de `elm/` sem aprovação → avise e deixe de fora.
3. **Já publicado.** Tudo com `publicado: manual` e nada mais a publicar → a linha `Publicação: publicada
   <AAAA-MM-DD>` no `status.md`, pelo commit direto na branch base (passo `gravar`, commit `FT-nnn publicação`), sem a
   `sa-elm.publicar`.
4. **Perguntar.** Quem tem `especificador` responde "publicar no DOORS?". Sim → `sa-elm.publicar`: confere a versão
   de cada artefato, publica, renomeia os novos, troca o id provisório e grava `Publicação: publicada <AAAA-MM-DD>`.
5. **Pendente.** Não, ou pessoa sem a booleana → `Publicação: pendente` no `status.md` da spec (no OpenSpec, o
   arquivado), pelo commit direto na branch base (passo `gravar`, commit `FT-nnn publicação pendente`), e mostre os
   especificadores do `equipe.json`.

## Saída

Publicado, pendente ou sem ELM → passo `devolver`.

## Pare se

Nenhum caso próprio deste passo: a publicação nunca trava o archive.
