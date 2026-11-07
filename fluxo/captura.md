---
{"resumo": "Captura comum: o único jeito de registrar item; grava o tipo, a linha e o corpo mínimo na base e volta a quem incluiu."}
---
## Entrada

Incluída por toda skill que registra item; não é chamada de skill: roda dentro do passo que a inclui e volta a ele.
Recebe de quem inclui: tipo, título, corpo mínimo, relator e, se houver, origem, pai e `ib`. Quem inclui pode
gravar na mesma gravação os campos que já decidiu (status `aceita`, tamanho, prioridade, pai) e as próprias linhas.

## Faça

1. **Tipo.** `épico`, `fatia`, `bug` ou `sustentação`. Na sustentação vem também a categoria (`AT` · `IM` · `BD` ·
   `IN` · `OP` · `EX`, da seção Sustentação do `sabia.md`), que define a série. Sem tipo, pergunte à pessoa com a
   recomendação: trabalho sem mudança no repositório é sustentação; defeito é bug; o resto que cabe em G é fatia;
   maior que G é épico.
2. **Duplicado.** Busca leve no `backlog.md` da base (título parecido ou `ib` igual, inclusive canceladas). Achou
   um aberto → mostre e pergunte "é o mesmo?"; com o "sim", não crie e devolva o id existente. Achou um terminal →
   crie o novo com `origem <id>` na `obs`.
3. **Id.** Lido depois do pull da gravação comum na base: próximo id = maior id da série no `backlog.md` + 1,
   contando as canceladas. Séries: épico → `EP-nn`; fatia e bug → `FT-nnn`; sustentação → `<categoria>-nnn`. O id
   nunca muda: troca de série é linha nova com `veio de <id>`, e a antiga fica `cancelada` com `virou <novo id>`.
   Push recusado: o id se recalcula.
4. **Linha.** No fim da tabela (a ordem é a prioridade; quem tem `produto` reordena pela `sa-refinar.ajustar`):
   status `nova` (épico: `a-moldar`); prioridade, tamanho e responsável vazios; `pai` = `EP-nn` aberto ou vazio (só
   fatia e bug); relator = `usuario` do `equipe.json` ou `externo: <área ou nome>`; `ib` = só o número, quando veio do
   EWM; `obs` `origem <id>` quando nasceu do trabalho em outro item; datas vazias (o épico ganha `aceita_em`).
5. **Corpo.** Fatia: ficha curta `.sabia/planejamento/fatias/FT-nnn-<slug>.md` com a seção Entrada (pedido · quem
   pediu · requisito, se souber). Bug: a mesma ficha, com Entrada (passos · atual · esperado · reproduzido: sim | não
   | detalhe insuficiente). Sustentação: registro `.sabia/planejamento/sustentacao/<ID>-<slug>.md`, pelo padrão
   `sa-atender/registro.md`, com o cabeçalho Categoria · Origem · Pedido por · Prazo · Responsável e a seção Pedido.
   Épico: só a linha. `slug` = título em kebab-case, sem acento, até 5 palavras. Dado de cliente nunca vai ao git:
   fica em `.sabia/local/sustentacao/<ID>/`.
6. **Gravar.** Pela gravação comum na base (`backlog: captura <id>`), ou junto com as linhas de quem incluiu, num
   commit só. No autopilot não grave: siga a regra do autopilot da gravação comum na base.

## Saída

"capturado `<id>` · `<tipo>` · `<status>`" e volta ao passo que incluiu. A triagem da fatia ou do bug `nova` é pela
`sa-triar.triar`; a sustentação nova já está na fila da `sa-atender.atender`.

## Pare se

- A gravação na base parou (fora da base sem o "sim", árvore suja, pull ou push recusado duas vezes) → mostre o que
  gravaria e volte a quem incluiu sem o id.
