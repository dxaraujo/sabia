# Backlog — `.sabia/planejamento/backlog.md`

Uma tabela única, uma linha por item, com o título `# Backlog`. A ordem das linhas é a prioridade: o topo é o
próximo a puxar. O cadastro acrescenta no fim, quem tem a booleana `produto` reordena (`sa-refinar.ajustar`), e a
prioridade `crítica` é urgente. Célula sem valor fica vazia. Toda escrita vai por commit direto na branch base
(commit pequeno, push com o "sim"). O corpo do item é achado pelo id: não há coluna de link nem de sprint.

O backlog é o dono do status do item. As datas do trabalho (início e fim de cada tarefa) ficam na linha da sprint
(o template `sa-planejamento/sprint.md`): o início do item é o primeiro `iniciada_em` das linhas do trabalho
principal dele (fatia e bug: desenvolvimento; sustentação: atendimento; épico: especificação), e o lead time vai
desse início até o `concluida_em` do backlog.

```markdown
# Backlog

| id | título | tipo | status | prioridade | tamanho | responsável | pai | relator | ib | obs | entrou_em | concluida_em |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EP-03 | Bloqueio de conta por tentativas | épico | fatiado | | | | | ana.souza | 612010 | | 2026-10-02 | |
| FT-031 | Bloquear após 3 tentativas inválidas | fatia | elegivel | | M | | EP-03 | ana.souza | | | 2026-10-12 | |
| FT-034 | Erro 500 no login com senha vazia | bug | em-andamento | crítica | P | joao.lima | | externo: suporte | 4567 | | 2026-10-20 | |
| FT-030 | Contador de tentativas inválidas | fatia | concluida | | M | ana.souza | EP-03 | ana.souza | | | 2026-10-12 | 2026-11-06 |
| AT-012 | Extrair contas bloqueadas de outubro | sustentação | nova | | | | | externo: financeiro | | | 2026-11-03 | |
```

## Colunas

| Campo | Valores | Quem preenche |
|---|---|---|
| `id` | `EP-nn` (épico) · `FT-nnn` (fatia e bug) · `<categoria>-nnn` (sustentação: `AT` · `IM` · `BD` · `IN` · `OP` · `EX`) | o cadastro comum e a `sa-elm.importar-backlog`: maior id da série + 1, contando as canceladas, lido depois do pull |
| `título` | o comportamento ou pedido em linguagem do negócio, numa linha; o `<slug>` dos arquivos sai daqui (até 5 palavras, kebab-case, minúsculas, sem acento) | quem cadastro; a `sa-triar.triar` e a `sa-refinar` ajustam |
| `tipo` | `épico` · `fatia` · `bug` · `sustentação` | o cadastro; a `sa-triar.triar` confirma; do EWM, Defeito → bug e Item de Backlog → fatia |
| `status` | abaixo, por tipo | cada fluxo, na sua transição |
| `prioridade` | `crítica` · vazio | `sa-triar.triar` · `sa-atender.atender` |
| `tamanho` | `P` (horas) · `M` (≈ 1 dia) · `G` (2–3 dias) · vazio (épico e sustentação); maior que G é épico | `sa-triar.triar` · `sa-refinar.fatiar` · `sa-refinar.detalhar` |
| `responsável` | `usuario` do `equipe.json` · vazio | `sa-desenvolver.iniciar` (fatia e bug) · `sa-atender.atender` (sustentação); o épico fica vazio |
| `pai` | `EP-nn` · vazio (épico e sustentação: sempre vazio) | `sa-refinar.fatiar` · `sa-triar.triar` |
| `relator` | `usuario` do `equipe.json` · `externo: <área ou nome>` | o cadastro · `sa-elm.importar-backlog` |
| `ib` | só o número do IB no EWM · vazio | `sa-elm.item` · `sa-elm.importar-backlog` |
| `obs` | convenções abaixo, separadas por ` · `; o resto é texto livre | quem causa a anotação |
| `entrou_em` | AAAA-MM-DD: o dia em que o item entrou no backlog | o cadastro comum · `sa-elm.importar-backlog` |
| `concluida_em` | AAAA-MM-DD: o dia em que o item foi concluído | `sa-desenvolver.encerrar` · `sa-atender.atender` · quem fecha o épico |

## Status

| Tipo | Máquina | Quem grava |
|---|---|---|
| fatia e bug | `nova` → `aceita` → `elegivel` → `em-andamento` → `concluida`; mais `cancelada` e `adiada até AAAA-MM-DD` | `nova`: o cadastro · `aceita`: `sa-triar.triar` (ou `sa-refinar.fatiar`) · `elegivel`: `sa-refinar.detalhar` (DoR completa e ficha aprovada) · `em-andamento`: `sa-desenvolver.iniciar` · `concluida`: `sa-desenvolver.encerrar` · `cancelada`: `sa-triar.triar` ou `sa-refinar.ajustar` · `adiada`: `sa-triar.triar` |
| épico | `a-moldar` → `em-especificacao` → `fatiado` → `concluido`; mais `cancelado` | `a-moldar`: o cadastro · `em-especificacao`: investir na `sa-refinar.moldar` · `fatiado`: `sa-refinar.fatiar` · `concluido`: `sa-desenvolver.encerrar`, no merge da última fatia aberta · `cancelado`: cancelar na `sa-refinar.moldar` ou `sa-refinar.ajustar` |
| sustentação | `nova` → `em-andamento` → `concluida`; mais `cancelada` | `sa-atender.atender` |

`em-revisao` é derivado do MR aberto e nunca se grava. A elegível que perde um item da DoR volta a `aceita`. Na
virada, o item que sai da sprint e estava `em-andamento` volta a `elegivel` (`sa-planejamento.sprint`).

## Convenções da `obs`

| Texto | Quando |
|---|---|
| `duplicada de <id>` | duplicado cancelado na triagem |
| `falta: <pergunta> · para <relator>` | triagem sem informação suficiente; o item fica `nova` |
| `motivo: <texto>` | recusa, adiamento ou cancelamento |
| `não investir: <motivo>` | cancelar do épico |
| `origem <id \| chamado <n> \| EWM <n> \| review <AAAA>/Sprint <nn> \| lint>` | item cadastrado a partir de outro item ou fonte (achado, desvio, DDL, desdobramento, verificação, review, importação, lint) |
| `veio de <id>[ v<N>]` | nasceu de outro: virar épico, dividir, juntar, mudança do PRD |
| `virou <id>` | a linha antiga de uma troca de série ou de uma junção |
| `adiamento ignorado (<usuario>, AAAA-MM-DD)` | a entrada comum seguiu antes da data |
| `reserva de capacidade estourada: <decisão> (<usuario>, AAAA-MM-DD)` | a reserva de capacidade do atendimento estourou e o produto decidiu |

## Id estável

O id nunca muda. Troca de série (fatia ou bug ↔ épico ou sustentação, ou outra categoria) é linha nova com
`veio de <id>`, e a antiga fica `cancelada` com `virou <novo id>`. Push recusado porque a branch base andou: o id se
recalcula no commit direto na branch base.
