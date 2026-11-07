---
{"resumo": "Pergunta a resposta do cliente: aprovado (com quem, data, versão e evidência) vira um D-nn em Decisões; ajuste e aguardando ficam no Em aberto."}
---
## Entrada

A versão `v<N>` aguardando o cliente e o documento do item (Decisões, Em aberto).

## Faça

Pergunte:

```
Protótipo v<N> — <id>: qual a resposta do cliente?
aprovado: <nome (papel)> · <AAAA-MM-DD> · <ATA-<nn> | e-mail>
ajuste: <o que o cliente pediu>
aguardando
```

- **Aprovado.** Só com quem, data, versão e evidência; faltando uma, é aguardando. Linha nova em Decisões:
  `D-nn | Protótipo v<N> aprovado | <nome> (<papel>) | <AAAA-MM-DD> | <ATA-nn | e-mail>`, com o próximo D-nn do
  documento. A linha `aprovação do cliente da v<N>` sai do Em aberto. O e-mail fica com quem o recebeu.
- **Ajuste.** A linha do Em aberto vira `ajuste da v<N>: <pedido> · aguardando a v<N+1>`. A versão nova já está na
  pasta → passo `registrar`.
- **Aguardando.** Nada muda.

A gravação é a do passo `gravar`.

## Saída

Aprovado, ajuste sem a versão nova ou aguardando → passo `gravar`. Ajuste com a versão nova na pasta → passo
`registrar`.

## Pare se

Nenhum caso próprio deste passo: sem resposta, a espera fica no Em aberto e bloqueia só as EL.
