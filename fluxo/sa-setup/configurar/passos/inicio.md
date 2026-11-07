---
{"resumo": "Entrada do configurar: inicial, atualização ou aplicar os dados de uma sa-elm.setup; sempre na sessão padrão."}
---
## Entrada

Um pedido: "configurar o Sabiá" (inicial), "atualizar a configuração do Sabiá", "regenerar os agentes", "ligar o
toolkit", ou a passagem da `sa-elm.setup` chamada direto, com os dados do ELM para aplicar.

## Faça

1. Dentro de um agente `sa-*` → diga que a `sa-setup` roda na sessão padrão, porque grava o harness que os
   agentes negam, e pare.
2. Leia o [wizard.md](~/.sabia/framework/skills/sa-setup/references/wizard.md) antes da primeira mensagem.
3. Raiz do repositório: `git rev-parse --show-toplevel`. Sem git → avise que o fluxo depende de branch e MR.
4. Veio da `sa-elm.setup` → guarde os dados (chave `elm`, texto da seção ELM, regras ELM): o passo `elm` os usa sem
   chamar de novo.

## Saída

Sessão padrão → passo `pre-checagem`. Dentro de um agente → fim.

## Pare se

- Dentro de um agente `sa-*`: diga e pare.
