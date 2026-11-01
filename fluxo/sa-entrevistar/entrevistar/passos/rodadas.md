---
{"resumo": "Pergunta em rodadas pequenas só a fronteira, numerada e com a recomendada de cada decisão, até a fronteira esvaziar e o entendimento ser confirmado."}
---
## Entrada

A árvore do passo `arvore`, com o que já tem fonte respondido.

## Faça

Perguntar em rodadas, pela fronteira. A cada rodada, pergunte só a **fronteira**: as decisões cujos pré-requisitos já estão decididos. Numere, traga a
recomendada de cada uma e escreva de modo que **"sim" aceite todas as recomendadas**:

```
Rodada 2 · ramo: exceções · faltam ~5 decisões depois desta rodada

D-04 · Tentativas contam por usuário ou por IP?
     Contexto: o login registra só o usuário (`LoginService.java:42`); não há tabela por IP.
     Recomendo: por usuário — é o que o dado atual permite e o que a demanda descreve.
D-05 · O que a tela mostra para a conta bloqueada?
     Recomendo: a mensagem MSG 2005 do ELM ("Conta bloqueada temporariamente"), já usada no desbloqueio manual.

"sim" aceita as recomendações · ou responda por número (ex.: "D-05: mensagem nova, texto a definir")
```

- **Fatos são trabalho seu, decisões são da pessoa.** Antes de perguntar, mande buscar (subagente
  `sa-pesquisador`, se houver) o que o código, o ELM ou o banco respondem.
- Recomendação sempre com o motivo em uma linha. Pergunta sem recomendação transfere o trabalho de pensar.
- Rodadas pequenas (até ~5 perguntas). Resposta que abre ramos novos → eles entram na próxima rodada.
- Resposta vaga ("tanto faz", "o de sempre") → registre a recomendada como decisão e diga isso.
- Termo novo ou ambíguo (dois nomes para a mesma coisa, um nome para duas coisas) → vira pergunta da rodada
  seguinte: qual é o termo canônico (passo `linguagem`).
- Termina quando a fronteira está vazia: resuma as decisões e **peça a confirmação do entendimento** antes de quem
  chamou escrever qualquer coisa. A pessoa pode dizer "chega" antes: o que restar fica `em aberto` (passo `registrar`).

## Saída

Fronteira com decisões → nova rodada (este passo). Fronteira vazia e entendimento confirmado, ou "chega" → passo
`registrar`.

## Pare se

Nenhum caso próprio deste passo: sem resposta, a decisão fica `em aberto` (Regras).
