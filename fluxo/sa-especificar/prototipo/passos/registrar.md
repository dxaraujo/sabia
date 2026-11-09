---
{"resumo": "Os arquivos soltos em prototipos/<id>-<slug>/ viram a versão vN (a maior + 1), conferidos como fictícios, e o Em aberto do documento ganha a espera do cliente."}
---
## Entrada

A pasta `.sabia/planejamento/prototipos/<id>-<slug>/` e o documento do item.

## Faça

1. **Versão nova.** Os arquivos soltos (fora de uma pasta `v<N>/`) são a versão nova, com `v<N>` = a maior + 1 (a
   primeira é `v1`). Link no lugar do arquivo → peça a exportação da versão.
2. **Dado fictício.** Mostre o que o protótipo traz (telas, campos com valor de exemplo) e pergunte se todo dado é
   fictício.
3. **Registrar.** Com o "sim": mova os arquivos para `prototipos/<id>-<slug>/v<N>/` e acrescente no Em aberto do
   documento a linha `aprovação do cliente da v<N> | cliente | <ids das EL> (ou investir, no pitch; ou nada)`. O commit dos
   arquivos e do documento é o do passo `gravar` (`<id> protótipo v<N>`).
4. **Sem arquivo novo.** Uma versão com `aprovação do cliente da v<N>` no Em aberto → passo `aprovacao`. Nenhuma →
   diga "ponha os arquivos da versão em `.sabia/planejamento/prototipos/<id>-<slug>/`" e devolva.

## Saída

Versão registrada, ou uma já aguardando o cliente → passo `aprovacao`. Nada a registrar → passo `devolver`.

## Pare se

- Dado real no protótipo → não registre, peça outra versão com dado fictício e pare.
