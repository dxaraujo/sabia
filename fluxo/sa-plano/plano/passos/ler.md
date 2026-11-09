---
{"resumo": "Lê status.md, ficha, elm/, prd.md do épico pai, Projeto e Regras aprendidas do sabia.md e o steering de tecnologia e estrutura."}
---
## Entrada

A branch `<id>` (no autopilot, a worktree) e a pasta da spec com o `status.md`.

## Faça

Leia:

1. o `status.md` (Rota, Autonomia);
2. a ficha `.sabia/planejamento/fatias/FT-nnn-<slug>.md` da base (`git show origin/<base>:<caminho>`): Regras,
   Cenários `CT-nn`, artefatos afetados com a versão de referência, linha Aprovado, Não muda, Decisões;
3. com ELM, os arquivos de `elm/` da pasta da spec;
4. o `prd.md` do épico pai, na fatia de épico;
5. o Projeto e as Regras aprendidas do `.sabia/sabia.md` e o steering de tecnologia e estrutura.

## Saída

Contexto lido → passo `texto-aprovado`.

## Pare se

- Sem ficha na base → "a ficha é do refinamento (`sa-refinar.detalhar`, agente `sa-especificador`)" e pare.
