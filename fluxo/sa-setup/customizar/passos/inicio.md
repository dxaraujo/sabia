---
{"resumo": "Entrada do customizar: trocar, inserir ou remover passo, trocar template ou descustomizar."}
---
## Entrada

Um pedido: "customizar o passo X", "trocar o template Y", "o que este projeto mudou?" ou "descustomizar …".

## Faça

1. Dentro de um agente `sa-*` → diga que roda na sessão sem agente, porque `.sabia/fluxo/` e `.sabia/template/` são
   harness, e pare.
2. Sem `.sabia/config/agentes.json` → o projeto não está configurado: ofereça a `sa-setup.configurar`.
3. "O que este projeto mudou?" → mostre o bloco Fluxos (W5-F) e, por linha, o diff contra o original (passo ou
   template trocado: o corpo contra o compilado; inserido: o arquivo inteiro; removido: a linha) e encerre.

## Saída

Pedido de mudança → passo `achar-ponto`. "O que mudou?" → fim. Dentro de um agente → fim.

## Pare se

- Dentro de um agente `sa-*`: diga e pare.
