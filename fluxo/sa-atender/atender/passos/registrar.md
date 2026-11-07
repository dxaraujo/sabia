---
{"resumo": "Pedido novo: confirma a categoria antes de gravar (o id nasce da série dela), a prioridade e o critério de pronto, e registra pela captura comum a linha nova e o registro do item."}
---
## Entrada

Um pedido em texto, ou um id que não existe no `backlog.md` (passo `entrada`).

## Faça

1. **Categoria.** A pessoa confirma a categoria (AT · IM · BD · IN · OP · EX), pela seção Sustentação do `sabia.md`
   (Categoria · Descrição · Exemplo), com a sua recomendação. Ela vem antes de gravar porque o id nasce da série
   dela (`<sigla>-nnn`) e nunca muda. Pedido que muda o código ou o comportamento do sistema não é Sustentação:
   registre como bug ou fatia pela captura comum (passo `captura`), que segue para a `sa-triar.triar`, e pare.
2. **Prioridade.** `crítica` (expedite pela política do `acordos.md`) ou vazio.
3. **Registro.** Junte o que vai no registro, pelo padrão `sa-atender/registro.md`: Origem (`chamado <n>`, `EWM <n>`,
   `pedido` ou `origem <id>`), Pedido por (área ou papel, sem nome de pessoa), Prazo (`AAAA-MM-DD` ou `—`), a seção
   Pedido (sem dado de cliente) e o Critério de pronto, numa frase.
4. **Gravar.** Inclua a captura comum (passo `captura`) com tipo `sustentação` e a categoria, e grave na mesma
   gravação: status `nova`, a prioridade, `aceita_em` = hoje, `obs` `origem chamado <n>` quando houver, e o
   registro `.sabia/planejamento/sustentacao/<ID>-<slug>.md`.
5. Pergunte "atender agora?".

## Saída

O item registrado. Atender agora → passo `puxar`. Só registrar → o fluxo termina.

## Pare se

- Pedido que muda o código: capturado como bug ou fatia, para a triagem → pare.
- A gravação na base parou (passo `gravar-na-base`) → mostre o que gravaria e pare.
