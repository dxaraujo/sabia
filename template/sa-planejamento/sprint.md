---
{"resumo": "Formato do .sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md: cabeçalho, meta, reserva de capacidade, capacidade prevista, Itens (uma linha por tarefa, com início e fim), Review, Retro e Métricas."}
---
```markdown
# 2026/Sprint 03 · 2026-11-09 → 2026-11-20

**Meta:** o cliente consulta o extrato sem ligar para o suporte.

**Reserva de capacidade:** 2 itens (20%)

**Capacidade:** vazão prevista 4 · migrados 1 · sobra 3

## Itens

| Item | Trabalho | Responsável | Tarefas | iniciada_em | concluida_em |
|---|---|---|---|---|---|
| FT-031 | especificação | bia.lima | ESP 4520 | 2026-11-09 | 2026-11-10 |
| FT-031 | desenvolvimento | ana.souza | DEV 4512 | 2026-11-10 | |
| FT-034 | desenvolvimento | — | | | |
| EP-04 | especificação | bia.lima | ESP 4521 | 2026-11-09 | |
| AT-012 | atendimento | — | | | |

## Review

- FT-031 · cliente aprovou o extrato — por Rui Prado; faltou o total no rodapé — por Ana Souza
- FT-034 · sem feedback
- ideia ou necessidade · filtro por data no extrato — por Rui Prado (FT-040)
- Backlog: ordem FT-052, FT-040, FT-047 · cancelada FT-049 (fora do escopo do contrato) — por bia.lima

## Retro

- Positivo: … · por Ana Souza · 2 votos (Bia Lima, Caio Reis)
- Negativo: revisão de MR lenta · 3 votos (Ana Souza, Bia Lima, Caio Reis)
  - MR parado três dias · por Bia Lima
  - revisão demorou · por Caio Reis
- Negativo: … · por Bia Lima
- Melhoria: … · por Caio Reis · 1 voto (Ana Souza)
- Lição: … · origem FT-031
- Ação: … · sobre Negativo: revisão de MR lenta · por Ana Souza · dono ana.souza
- Ação: … · por Bia Lima

## Métricas

- Medida em: 2026-11-20 · meta atingida
- Conclusão: 4 de 6 linhas (67%) · no prazo 3 · depois 1 · em aberto 2
- Vazão: desenvolvimento 3 (prevista 4) · atendimento 1 · especificação 2
- Lead time médio: desenvolvimento 3,5 dias · atendimento 1 dia · especificação 2 dias
- SLE: 75% em até 5 dias (alvo 85%)
- Reserva de capacidade: 1 de 2 itens

| Entrega | Tipo | Tam. | Especificação (d) | Desenvolvimento (d) | Atendimento (d) | Lead time (d) | No prazo |
|---|---|---|---|---|---|---|---|
| FT-031 | fatia | M | 1 | 4 |  | 5 | sim |
| AT-012 | sustentação |  |  |  | 1 | 1 | sim |
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
  - A linha só sai quando o item é devolvido ao backlog no meio da sprint (`sa-status.situacao` ou o Quadro Kanban):
    saem as tarefas abertas, e o que elas guardavam (início, tarefa do EWM) vai para a `obs` do item. Na virada, a
    sprint anterior não muda, e a linha migrada mantém o `iniciada_em`.
- Datas da tarefa, gravadas no mesmo commit que muda o item. Sem a linha na sprint aberta, quem grava a cria; sem
  sprint aberta, a tarefa segue sem datas.

  | Trabalho | `iniciada_em` | `concluida_em` |
  |---|---|---|
  | especificação | o primeiro fluxo de especificação que roda no item, só se a data está vazia: `sa-especificar.elm` · `sa-especificar.prototipo` · `sa-especificar.reuniao` · `sa-refinar.moldar` (investir) · `sa-refinar.detalhar` · `sa-prd.prd` · `sa-prd.mudanca` | `sa-refinar.detalhar` (a fatia ou o bug fica `elegivel`) · `sa-refinar.fatiar` (o épico fica `fatiado`) |
  | desenvolvimento | `sa-desenvolver.iniciar` | `sa-desenvolver.encerrar` (a data do merge) |
  | atendimento | `sa-atender.atender` (assumir) | `sa-atender.atender` (finalizar) |
- A reserva de capacidade consumida é a contagem das linhas de atendimento.
- Review: uma linha por entrega, `<id> · <feedback> — por <quem>; <feedback> — por <quem>` ou `<id> · sem feedback`, e
  uma por ideia ou necessidade nova, `ideia ou necessidade · <texto> — por <quem>`, que ganha o id no fim depois do
  cadastro. Entrega é a fatia, o bug ou o atendimento concluído na sprint e o épico concluído ou com entrega nela. A
  linha `Backlog: ordem <ids> · cancelada <id> (<motivo>) — por <usuario>` é o rastro da repriorização feita na review:
  o trecho da ordem que mudou e os cancelados; o estado está no `backlog.md`. A página `sabia review` lê e grava essas
  linhas; a review não tem votação.
- Retro: uma linha por item, `- Positivo: …` · `- Negativo: …` · `- Melhoria: …` · `- Lição: …` · `- Ação: …`. Cada linha guarda, nesta ordem e separados por ` · `: o texto, `origem <id>` (só na lição do ciclo),
  `sobre <Categoria>: <título do item>` (só na ação que nasceu de um item), `por <quem levantou>`, `dono <usuario>` (só na
  ação) e `<n> votos (<quem votou>, …)` (só nos pontos).
  - Grupo: os pontos que o apresentador juntou viram uma linha com o título do grupo e os votos dele, e cada ponto
    fica recuado abaixo dela, `  - <ponto> · por <quem levantou>`.
  - `- Lição:` é a lição do ciclo marcada Sim para virar Regra aprendida; a marcada Não e a sem resposta não são
    gravadas.
  - A página `sabia retrospective` lê e grava essas linhas, os pontos pela ordem dos votos; não há arquivo à parte.
- Capacidade: os três números da proposta do planejamento, `vazão prevista <n> · migrados <n> · sobra <n>`. É o
  previsto que as métricas comparam com o realizado.
- Métricas: o retrato da sprint no dia da medida, impresso por `sabia metricas --md` (calculado das linhas da sprint e
  do `backlog.md`): conclusão, vazão por trabalho contra a prevista, lead time médio, SLE e reserva de capacidade
  consumida (as linhas de SLE e de reserva só quando há o acordo e a reserva), e uma linha por entrega (item com
  alguma tarefa concluída) com os dias de cada trabalho, o lead time na sprint e se fechou até o fim dela. Só
  `meta atingida` ou `meta não atingida — <por quê>`, na primeira linha, não é calculado: é a resposta de quem tem
  `produto`. O histórico da equipe (vazão média, duração por tamanho) não é gravado: `sabia metricas` o deriva das
  sprints.

Escrevem: `sa-planejamento.sprint` (cabeçalho, meta, reserva de capacidade, capacidade, linhas, virada) · a skill que puxa um item fora da seleção
(a linha que falta) · quem inicia ou conclui uma tarefa (as datas) · `sa-elm.item` (Tarefas) · `sa-planejamento.review` (Review e Métricas) · `sa-planejamento.retrospectiva`
(Retro e Métricas). Toda escrita vai direto na branch base.
