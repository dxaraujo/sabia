---
{"resumo": "IA supervisionada: oferece seguir para a codificação; manual: Retomar e sessão encerrada; autopilot: segue direto."}
---
## Entrada

O plano aprovado e a autonomia (`status.md`).

## Faça

1. IA supervisionada: ofereça "seguir para `sa-desenvolver.codificar`?" na mesma sessão, em pergunta própria: aprovar
   não implica seguir.
2. Manual: grave no Retomar `codificação manual; avise quando terminar`, faça commit e push da branch (com o "sim") e
   encerre a sessão. Na volta ("terminei", nesta ou em outra sessão), a `sa-desenvolver.codificar` segue do que vem
   depois da codificação (validar).
3. IA autopilot: siga direto.

## Saída

A saída da definição do fluxo pela autonomia.

## Pare se

- Sem o "sim" para seguir → termine com a frase de retomada ("retoma a FT-nnn").
