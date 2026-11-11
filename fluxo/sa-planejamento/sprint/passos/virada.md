---
{"resumo": "Só no início do ciclo: os itens abertos da sprint anterior migram ou voltam ao backlog (em-andamento → elegível)."}
---
## Entrada

A sprint anterior (a de maior chave) e o `backlog.md` da branch base. Sem sprint anterior, este passo não faz nada.

## Faça

1. Liste as linhas da sprint anterior cujo item ainda está aberto no `backlog.md`:
   - **especificação** aberta: fatia ou bug `nova` ou `aceita`; épico `a-moldar` ou `em-especificacao`;
   - **desenvolvimento** aberto: `elegivel` ou `em-andamento`;
   - **atendimento** aberto: `nova` ou `em-andamento`.
   - **impedido** (`impedida`, `impedido`): conta como aberto no trabalho da linha, e continua impedido.
   Linhas de itens concluídos ou cancelados não migram.
2. Pergunte "migrar para esta sprint?", por item ou todos. Quem tem `produto` decide.
3. **Migra**: ganha na sprint nova uma linha igual (Item · Trabalho · Responsável · Tarefas), com o `iniciada_em` que
   já tinha, e entra primeiro na capacidade.
4. **Não migra**: volta ao backlog com a branch, a ficha e a pasta mantidas. O item `em-andamento` passa a `elegivel`
   (sustentação: `nova`) e o responsável fica; no impedido, é o `de` do `motivo` que passa a `elegivel` (ou `nova`); os
   outros status não mudam. A mudança do `backlog.md` vai no commit do passo `gravar`.
5. Com ELM, ofereça cancelar a tarefa do item que saiu (`sa-elm.finalizar`, só a tarefa; o IB fica) e mover os
   migrados para a iteração nova (`sa-elm.iteracao`). Sem o sim, siga.

A sprint anterior não é alterada: os números dela ficam para a retrospectiva. Não existe "incompleto no fechamento".

## Saída

Migrados e devolvidos decididos → passo `capacidade`.

## Pare se

Sem condição própria.
