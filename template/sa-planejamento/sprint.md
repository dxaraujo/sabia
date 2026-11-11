---
{"resumo": "Formato do .sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md: cabeçalho, meta, reserva de capacidade, Itens (uma linha por tarefa, com início e fim), Review e Retro."}
---
```markdown
# 2026/Sprint 03 · 2026-11-09 → 2026-11-20

**Meta:** o cliente consulta o extrato sem ligar para o suporte.

**Reserva de capacidade:** 2 itens (20%)

## Itens

| Item | Trabalho | Responsável | Tarefas | iniciada_em | concluida_em |
|---|---|---|---|---|---|
| FT-031 | especificação | bia.lima | ESP 4520 | 2026-11-09 | 2026-11-10 |
| FT-031 | desenvolvimento | ana.souza | DEV 4512 | 2026-11-10 | |
| FT-034 | desenvolvimento | — | | | |
| EP-04 | especificação | bia.lima | ESP 4521 | 2026-11-09 | |
| AT-012 | atendimento | — | | | |

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
- Datas: início = dia seguinte ao fim da anterior (a primeira: a data que o time informa); fim = início + `timebox_semanas` do `acordos.json` − 1.
- Itens: uma linha por item e trabalho. O mesmo item pode ter uma linha de especificação e outra de desenvolvimento.
  - Trabalho ∈ `especificação` · `desenvolvimento` · `atendimento`.
  - Responsável = `usuario` do `equipe.json` ou `—`.
  - Tarefas = ids do EWM com o prefixo do trabalho, numa coluna só: `DEV <id>` · `ESP <id>` · `ATD <id>`; vazio sem
    ELM. Preenche a `sa-elm.item`.
  - `iniciada_em` e `concluida_em` (AAAA-MM-DD) são da tarefa, não do item: o dia em que aquele trabalho começou e
    o dia em que terminou. Sem `iniciada_em`, a tarefa está planejada; com ela, em andamento; com `concluida_em`,
    concluída. Lead time do trabalho = `concluida_em` − `iniciada_em`.
  - Não há coluna de situação: o status do item é o do `backlog.md`.
  - A linha nunca é apagada (a tarefa do EWM mora nela). O item que volta ao backlog no meio da sprint fica com a
    linha, sem `concluida_em`. Na virada, a linha migrada mantém o `iniciada_em`.
- Datas da tarefa, gravadas no mesmo commit que muda o item. Sem a linha na sprint aberta, quem grava a cria; sem
  sprint aberta, a tarefa segue sem datas.

  | Trabalho | `iniciada_em` | `concluida_em` |
  |---|---|---|
  | especificação | o primeiro fluxo de especificação que roda no item, só se a data está vazia: `sa-especificar.elm` · `sa-especificar.prototipo` · `sa-especificar.reuniao` · `sa-refinar.moldar` (investir) · `sa-refinar.detalhar` · `sa-prd.prd` · `sa-prd.mudanca` | `sa-refinar.detalhar` (a fatia ou o bug fica `elegivel`) · `sa-refinar.fatiar` (o épico fica `fatiado`) |
  | desenvolvimento | `sa-desenvolver.iniciar` | `sa-desenvolver.encerrar` (a data do merge) |
  | atendimento | `sa-atender.atender` (assumir) | `sa-atender.atender` (finalizar) |
- A reserva de capacidade consumida é a contagem das linhas de atendimento.
- Review: `<id> · <retorno>` ou `<id> · sem retorno`, uma linha por item concluído.
- Retro: bom · melhorar · ações (com dono) e a linha Números.

Escrevem: `sa-planejamento.sprint` (cabeçalho, meta, reserva de capacidade, linhas, virada) · a skill que puxa um item fora da seleção
(a linha que falta) · quem inicia ou conclui uma tarefa (as datas) · `sa-elm.item` (Tarefas) · `sa-planejamento.review` (Review) · `sa-planejamento.retrospectiva`
(Retro). Toda escrita vai direto na branch base.
