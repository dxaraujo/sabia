---
{"resumo": "Até 5 perguntas por rodada, numeradas e com a recomendação; o sim aceita todas; termina com a fronteira vazia e o entendimento confirmado, ou com 'chega'."}
---
## Entrada

A árvore do passo `arvore`.

## Faça

Pergunte só a fronteira (as decisões cujos pré-requisitos já estão decididos), até 5 por rodada, numeradas, cada uma
com a recomendação e o motivo numa linha, de modo que "sim" aceite todas:

```
Rodada 2 · ramo: exceções · faltam ~5 decisões depois desta

1 · Tentativas contam por usuário ou por IP?
    Contexto: o login registra só o usuário (LoginService.java:42).
    Recomendo: por usuário — é o que o dado atual permite. Outra opção: por IP.
2 · O que a tela mostra para a conta bloqueada?
    Recomendo: a mensagem já usada no desbloqueio manual.

"sim" aceita as recomendações · ou responda por número
```

- Pergunte só regra de negócio e decisão sem fonte. A regra de negócio é decidida por quem tem `produto` ou pelo
  cliente em reunião.
- Resposta vaga ("tanto faz") → vale a recomendação, com a pessoa como Quem, e diga isso. Pergunta ignorada não é
  resposta vaga.
- Resposta por número: só os números citados estão respondidos; os outros continuam abertos e voltam na próxima rodada.
- Resposta que abre ramos → nova rodada.
- Fronteira vazia → resuma e peça a confirmação do entendimento. "Chega" → o resto vai ao Em aberto.
- Sem pessoa presente → não pergunte: tudo sem fonte vai ao Em aberto com a recomendação.

## Saída

Ramos novos ou fronteira não vazia → nova rodada. Fronteira vazia e entendimento confirmado, ou "chega" → passo
`registrar`.

## Pare se

Nenhum caso próprio deste passo: sem resposta, a decisão fica no Em aberto.
