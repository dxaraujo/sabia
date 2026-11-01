---
{"resumo": "Na base, pelo bloco Gravar na base: linhas no backlog.md, fichas, Fase fatiado, IBs no EWM e um commit."}
---
## Entrada

O GATE do backlog ("ok" do passo `perguntar`).

## Faça

Na **base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base):

1. `backlog.md`: uma linha por fatia no fim de `## Fatias`, na ordem do rascunho (que respeita as dependências), com
   `origem` `EP-<nn>`, a `prioridade` do épico, `elm` (item 4) e `status` `elegivel` se passa na **Definition of
   Ready** ([references/backlog.md](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#definition-of-ready-o-que-faz-uma-fatia-elegivel)) ou
   `nova` com `obs` `falta: <o quê>`. Ids `FT-<nnn>` sequenciais no projeto, **nunca reaproveitados**. O `status` do
   épico não muda (a `[ESP]` e a Especificação `concluida` são da `sa-especificar`).
2. **Fichas** das fatias (`<produto>/fatias/FT-<nnn>-<slug>.md`, formato "padrão de épico"): Objetivo, Cobre (links
   para os cenários do PRD, sem copiar) e Como verificar; a coluna `ficha` aponta para elas.
3. `status.md` do épico: `Fase: fatiado`.
4. **EWM** (com ELM, com "sim"): um IB por fatia sob o épico, no backlog do EWM e no estado inicial ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3,
   `iteracao = backlog`); os ids vão para a coluna `elm` (`IB [<id>](<url>)`). Sem o MCP `elm` → `pendente`.
5. Commit (padrão do `sabia.md`): `backlog.md`, fichas, `status.md` do épico.

## Saída

Backlog, fichas e `status.md` do épico commitados na base → passo `proximos`.

## Pare se

O bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) manda parar: siga o que
ele diz.
