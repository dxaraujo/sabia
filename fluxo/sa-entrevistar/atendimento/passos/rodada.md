---
{"resumo": "Uma rodada só, numerada e com recomendação, para registrar um AT na triagem; as respostas voltam à sa-triar."}
---
## Entrada

O pedido de atendimento que a `sa-triar` está registrando.

## Faça

Uma rodada só, no mesmo formato (numerada, com recomendação, "sim" aceita tudo), sem árvore nem glossário:

```
Atendimento AT-012 · 7 perguntas

A-1 · O que o cliente precisa receber?   Recomendo: planilha com as contas bloqueadas por dia em setembro.
A-2 · Origem?                            Recomendo: chamado 4521 (citado no pedido).
A-3 · Prazo?                             Recomendo: 2026-10-16 (2 dias úteis).
A-4 · Quem responde?                     Recomendo: joao.lima (atende: true no equipe.json).
A-5 · Critério de pronto?                Recomendo: planilha enviada e chamado respondido.
A-6 · Estimativa?                        Recomendo: 3 h (extração simples no banco).
A-7 · Quem pediu?                        Recomendo: área de segurança (citada no chamado).
```

## Saída

As respostas voltam para quem chamou (a `sa-triar`), que as grava no cabeçalho do `AT-<nnn>-<slug>.md` (a A-7 no
`**Pedido por:**`) — não num `decisoes.md`. Aqui o fluxo termina.

## Pare se

Regra de negócio em aberto que aparecer → não decide aqui: não é atendimento, e a triagem a trata
como fatia padrão ou épico.
