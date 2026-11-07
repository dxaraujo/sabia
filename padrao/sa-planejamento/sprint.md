---
{"resumo": "Formato do .sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md: cabeçalho, meta, folga, Itens, Review e Retro."}
---
```markdown
# 2026/Sprint 03 · 2026-11-09 → 2026-11-20

**Meta:** o cliente consulta o extrato sem ligar para o suporte.

**Folga:** 2 itens (20%)

## Itens

| Item | Trabalho | Responsável | Tarefas |
|---|---|---|---|
| FT-031 | desenvolvimento | ana.souza | DEV 4512 |
| FT-034 | especificação | — | |
| EP-04 | especificação | bia.lima | ESP 4520 |
| AT-012 | atendimento | — | |

## Review

- FT-031 · cliente aprovou o extrato; pediu filtro por data (FT-040)

## Retro

- Bom: …
- Melhorar: …
- Ação: … · dono ana.souza
- Números: concluídas 4 (desenvolvimento) · atendimento 2 · meta atingida · lead time médio 3.5 dias
```

- Caminho: `.sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md`; `<AAAA>` = ano do início, `<nn>` com 2 dígitos
  (ano novo → `01`). Chave: `<AAAA>/Sprint <nn>`. A sprint aberta é a de maior chave.
- Datas: início = dia seguinte ao fim da anterior (a primeira: a data que o time informa); fim = início + Timebox − 1.
- Itens: uma linha por item e trabalho. O mesmo item pode ter uma linha de especificação e outra de desenvolvimento.
  - Trabalho ∈ `especificação` · `desenvolvimento` · `atendimento`.
  - Responsável = `usuario` do `equipe.json` ou `—`.
  - Tarefas = ids do EWM com o prefixo do trabalho, numa coluna só: `DEV <id>` · `ESP <id>` · `ATD <id>`; vazio sem
    ELM. Preenche a `sa-elm.item`.
  - Não há coluna de situação: o andamento é o status do `backlog.md`.
- A folga consumida é a contagem das linhas de atendimento.
- Review: `<id> · <retorno>` ou `<id> · sem retorno`, uma linha por item concluído.
- Retro: bom · melhorar · ações (com dono) e a linha Números.

Escrevem: `sa-planejamento.sprint` (cabeçalho, meta, folga, linhas, virada) · a skill que puxa um item fora da seleção
(a linha que falta) · `sa-elm.item` (Tarefas) · `sa-planejamento.review` (Review) · `sa-planejamento.retrospectiva`
(Retro). Toda escrita vai direto na base.
