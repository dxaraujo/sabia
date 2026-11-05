---
{"resumo": "Grava no registro o que foi feito, sem dado de cliente (comentário ou anexo na tarefa, se a pessoa quiser), e lança as horas; em várias sessões, cada uma fechada com o commit <ID> registrar sessão."}
---
## Entrada

O item com a tarefa assumida e `em-andamento` (passo `assumir`; na retomada, já feito).

## Faça

Os dois itens valem em qualquer ordem e em várias sessões.

1. **Registrar o trabalho:** em `## O que foi feito` do registro, os passos e a evidência (o que foi executado, onde,
   resultado, link do chamado ou da mudança), **sem dado de cliente** — dado real fica em `.sabia/local/sustentacao/<pasta>/<ID>/`.
   Comentário ou anexo na própria tarefa (`elm_comentar`, `elm_anexo enviar`), se a pessoa quiser.
2. **Lançar horas:** a qualquer momento, `elm_lancar_horas(id, horas)`; cada lançamento é uma linha na tabela Horas
   do registro. Lançar **não** conclui.

## Saída

O trabalho e as horas no registro → passo `encerrar` quando a pessoa disser "concluir o <ID>". A sessão que termina
antes disso fecha aqui: os créditos dela no registro ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão),
item 4) e o commit `<ID> registrar sessão` (o registro), pelos itens 3 e 4 do bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base).

## Pare se

- O trabalho não é desta categoria (muda o repositório, regra de negócio em aberto, ou é de outra categoria da
  Sustentação) → "devolva à `sa-triar` (categoria errada, origem <ID>)" e pare.
