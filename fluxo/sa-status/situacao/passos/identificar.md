---
{"resumo": "Acha o item, confere quem pode (produto ou o responsável da tarefa em curso) e leva ao passo do pedido."}
---
## Entrada

Um id do Sabiá e o pedido: impedir, liberar, cancelar ou devolver ao backlog.

## Faça

1. Leia a linha do item no `backlog.md` da branch base (depois do `git fetch`) e as linhas dele na sprint aberta.
2. **Quem pode.** O usuário da sessão tem `produto` no `equipe.json`, ou é o responsável da tarefa em curso: o
   Responsável da linha da sprint com `iniciada_em` e sem `concluida_em`; sem linha em curso, o `responsável` do
   item. Senão → "isso é de quem tem `produto` (`<nomes>`) ou de `<responsável>`" e pare.
3. **O pedido casa com o status?**

   | Pedido | Vale para | Passo |
   |---|---|---|
   | impedir (também "adiar até <data>") | qualquer status não terminal, menos `impedida` e `impedido` | `impedir` |
   | liberar | `impedida` · `impedido` | `liberar` |
   | cancelar | fatia, bug ou sustentação `em-andamento`, ou impedida que veio de `em-andamento` | `cancelar` |
   | devolver ao backlog | item com linha na sprint aberta, sem `concluida_em` | `devolver` |

4. Cancelar um item que ainda não começou é do dono do status: `nova` → `sa-triar.triar`; `aceita`, `elegivel`,
   épico `em-especificacao` ou `fatiado` → `sa-refinar.ajustar`; épico `a-moldar` → `sa-refinar.moldar`. Diga a dona e
   pare.

## Saída

O item e o pedido conferidos → o passo do pedido.

## Pare se

- Id fora do `backlog.md`, ou item `concluida`, `concluido`, `cancelada` ou `cancelado` → mostre o status e pare.
- Sem `produto` e sem ser o responsável da tarefa em curso → a frase do item 2 e pare.
- Pedido que não vale para o status → diga o status e o que vale para ele, e pare.
