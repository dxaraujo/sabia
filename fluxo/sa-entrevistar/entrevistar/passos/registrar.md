---
{"resumo": "Só por acréscimo no documento do item: uma linha D-nn em Decisões por decisão ou suposição e o Em aberto com para quem e o que bloqueia."}
---
## Entrada

As respostas das rodadas, os fatos com fonte e as suposições.

## Faça

1. **Decisões.** Uma linha por decisão na tabela `D-nn | Decisão | Por quê | Quem | Quando | Fonte`, com o próximo D-nn do
   documento: Quem = `<nome> (<papel>)` ou `suposição`; Quando = `AAAA-MM-DD`; Fonte ∈ conversa · `ATA-nn` · e-mail ·
   `protótipo v<N>` (fato encontrado: o `arquivo:linha` ou o id do requisito).
2. **Em aberto.** Uma linha `Pergunta | Para quem | Bloqueia`, com Bloqueia = ids de requisito, de fatia ou de
   cenário, ou `nada`.
3. **Respondido.** O em aberto respondido sai do Em aberto e entra em Decisões.
4. **Gravar.** Chamada por outra skill → ela grava junto com o documento dela. Chamada direta → o commit é o do passo
   `gravar` (`<id> decisões`).

## Saída

O documento com Decisões e Em aberto → passo `linguagem`.

## Pare se

Nenhum caso próprio deste passo.
