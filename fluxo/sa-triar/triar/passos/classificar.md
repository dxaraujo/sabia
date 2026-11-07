---
{"resumo": "Classifica o item aceito: tipo, tamanho P/M/G, prioridade crítica ou vazia, pai e os campos mínimos do corpo."}
---
## Entrada

O item aceito no passo `decidir`.

## Faça

1. **Tipo** ∈ `épico` · `fatia` · `bug` · `sustentação`. Sustentação é trabalho sem mudança no repositório, numa
   categoria da seção Sustentação do `sabia.md` (`AT` · `IM` · `BD` · `IN` · `OP` · `EX`), confirmada aqui: o id sai
   dela e não existe recategorizar. O que muda código ou configuração é fatia ou bug. O que não cabe em G é épico.
2. **Tamanho** ∈ `P` · `M` · `G` (linha Tamanhos do `acordos.md`), só em fatia e bug.
3. **Prioridade** ∈ `crítica` · vazio. `crítica` = expedite pela política do `acordos.md`; vazio = vale a ordem das
   linhas.
4. **Pai** = `EP-nn` aberto ou vazio, só em fatia e bug.
5. **Campos mínimos do corpo**, perguntados numa rodada, cada um com a recomendação:

   | Tipo | Campos |
   |---|---|
   | bug | passos · atual · esperado · reproduzido (`sim` · `não` · `detalhe insuficiente`); reproduza só quando é barato |
   | fatia | pedido · quem pediu · requisito (se souber) |
   | sustentação | pedido · pedido por · prazo |
   | épico | só a linha |

6. **Troca de série.** O tipo novo tem série diferente da do id que o item já tem (fatia ou bug ↔ épico ou
   sustentação, ou outra categoria): nasce a linha da série certa, com `veio de <id>` na `obs`, e a antiga fica
   `cancelada` com `virou <novo id>`. O id nunca muda. Entre fatia e bug, só a coluna tipo muda.

## Saída

Tipo, tamanho, prioridade, pai, os campos do corpo e, se houver, a troca de série → passo `registrar`.

## Pare se

- Categoria da sustentação sem a confirmação da pessoa → não grave: pergunte de novo.
