---
{"resumo": "Na base, pelo bloco Gravar na base: linhas no backlog.md, fichas com os artefatos afetados do PRD, Fase fatiado, IBs no EWM, créditos na [GB] e um commit."}
---
## Entrada

O GATE do backlog ("ok" do passo `perguntar`).

## Faça

Na **base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):

1. `backlog.md`: uma linha por fatia no fim de `## Fatias`, na ordem do rascunho (que respeita as dependências), com
   `origem` `EP-<nn>`, a `prioridade` do épico, `elm` (item 4) e `status` `elegivel` se passa na **Definition of
   Ready** ([references/backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)) ou
   `nova` com `obs` `falta: <o quê>`. Ids `FT-<nnn>` sequenciais no projeto, **nunca reaproveitados**. O `status` do
   épico não muda (segue `iniciado`, com as fatias).
2. **Fichas** das fatias (`<produto>/fatias/FT-<nnn>-<slug>.md`, formato "padrão de épico"): Objetivo, Cobre (links
   para os cenários do PRD, sem copiar), **Artefatos afetados** (os do rascunho, item 5, no formato da ficha de épico do
   padrão `sa-triar/ficha.md`, seção "Artefatos afetados — a seção"; o fecho, pela versão do PRD e o `verified` dos
   conceitos) e Como verificar; a coluna `ficha` aponta para elas.
3. `status.md` do épico: `Fase: fatiado`.
4. **EWM** (com ELM, com "sim"): um IB por fatia sob o épico, no backlog do EWM e no estado inicial ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3,
   `iteracao = backlog`); os ids vão para a coluna `elm` (`IB [<id>](<url>)`). Sem o MCP `elm` → `pendente`.
5. **Créditos** da sessão e **horas** (só do SM) na `[GB]`, como no passo `sa-consolidar.consolidar.elm` (*horas* e
   *créditos*), com a Atividade `fatiamento EP-<nn>` (`Créditos fatiamento EP-<nn>: …`).
6. Commit (padrão do `sabia.md`): `backlog.md`, fichas, `status.md` do épico e o `sprint-<nn>.md` (Créditos de
   gestão).

## Saída

Backlog, fichas, `status.md` do épico e os créditos commitados na base → passo `proximos`.

## Pare se

O bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) manda parar: siga o que
ele diz.
