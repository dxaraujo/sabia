---
{"resumo": "Uma tarefa do tasks.md por ciclo: vermelho, verde, arrumar, passo validar, marcar e commit pequeno."}
---
## Entrada

A primeira tarefa não marcada do `tasks.md`.

## Faça

Para cada tarefa do `tasks.md`, nesta ordem:

1. **Carregue a skill** da stack que a tarefa cita (toolkit ligado ao agente) **antes** de escrever. Nunca escreva
   de memória o que uma skill do projeto padroniza.
2. **Vermelho:** escreva o teste do comportamento (um cenário ou critério por vez), **pelo ponto de teste do
   `design.md`** — interface pública, sem mock de detalhe interno, sem recalcular o esperado do jeito que o código
   calcula — e rode só ele (comando de teste único). Ele tem de **falhar pelo motivo certo**. Corretiva: o teste
   que reproduz o defeito vem primeiro, e ele e a correção são **um ciclo só** — marcados e commitados juntos, já
   verdes (o vermelho fica registrado no Histórico: `teste do defeito vermelho: <falha observada>`); os testes de
   preservação rodam verdes antes da correção.
3. **Verde:** a menor mudança de produção que faz o teste passar, imitando o análogo do `design.md`.
4. **Arrumar** só o que você acabou de escrever (nomes do glossário, duplicação), com os testes verdes.
   Refatorar código existente não é desta tarefa: vira sugestão para a revisão ou fatia própria.
5. **Backpressure:** o passo `validar` (compilar, testes, lint e cobertura do `sabia.md`). Falhou → corrija antes de
   seguir; não acumule vermelho.
6. Marque `- [x]` e acrescente a linha no Histórico do `status.md`: `<data> — tarefa N ok · <testes>`.
7. **Commit** pequeno, só com o passo `validar` verde (padrão do `sabia.md`, com o id da fatia) com o código, os testes, o `tasks.md` e o
   `status.md` — a árvore fica limpa a cada tarefa.

Regras do ciclo:
- **Nunca** apague, desabilite, pule ou enfraqueça um teste para ficar verde. Teste que parece errado → pare e
  pergunte (ou, autônomo, registre como bloqueio).
- O código real não bate com o plano → **pare** e reporte, sem improvisar:
  ```
  Divergência na tarefa N — Esperado: <o que o plano diz> · Encontrado: <o que o código tem, arquivo:linha>
  · Por que importa: <o que muda>
  ```
  Muda comportamento de negócio → P.O. (agente `sa-produto`: `sa-entrevistar` / `sa-prd`); muda o desenho → `sa-plano.replanejar`. Decisão técnica equivalente → decida e registre no `design.md` (Decisões técnicas).
- Nada de funcionalidade que a fatia não pediu, mesmo "aproveitando".
- Duas correções seguidas sem sair do lugar → pare de tentar variações: registre no `status.md` o que foi tentado e
  continue numa sessão nova a partir dele (contexto poluído piora a terceira tentativa); persistindo,
  `fase: bloqueada (de: implementando)`, com motivo e pergunta.
- Banco: somente leitura pelo MCP; DDL é do time de banco (registre no `status.md`, campo Banco).
- Contexto cheio ou sessão longa → atualize o `status.md` (o que foi feito, próximo passo, decisões), **commite-o**
  e continue numa sessão nova a partir dele. O estado vive nos arquivos, não na conversa.

**Toolkit na tarefa.** Passo `desenvolvedor` de [passos.md](~/.sabia/framework/skills/sabia/references/passos.md). Quem
decide é a sua configuração: a tarefa que casa com um desvio do seu prompt vai ao toolkit, sem marca no `tasks.md` e
sem perguntar à pessoa:

- **Sem agente** (o desvio manda carregar a skill) → carregue a skill do desvio e faça o ciclo acima por ela.
- **Com agente** → delegue a tarefa com o briefing de codificação de
  [passos.md](~/.sabia/framework/skills/sabia/references/passos.md#sem-agente-e-com-agente) (a tarefa, `design.md`, `research.md`, os
  pontos de teste e os comandos) e o contrato: código e testes da tarefa, dentro do escopo, e o resumo dos
  arquivos; sem commit, push nem PR.
- **Depois, sempre o Sabiá:** confira que só mudaram arquivos da tarefa (`git status`), rode o passo `validar`
  (evidência, não afirmação) e siga os itens 6 e 7 acima (marcar, Histórico, commit). Fora do escopo ou vermelho →
  devolva uma vez com a falha; de novo → divergência (acima).

## Saída

Tarefa marcada, Histórico e commit; todas as tarefas `[x]` → passo `validar` (validação completa).

## Pare se

Teste que parece errado, divergência com o plano, ou a segunda correção seguida sem sair do lugar (acima).
