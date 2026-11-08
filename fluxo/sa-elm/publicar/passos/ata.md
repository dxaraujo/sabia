---
{"resumo": "Se a pessoa quiser, a ATA aprovada do item sobe junto."}
---
## Entrada

As ATAs do item em `.sabia/planejamento/atas/` com `status: stable`.

## Faça

Pergunte "subir a ATA <nn> junto?". Com "sim", `elm_publicar_req` com a sigla `ATA`. Com "não", siga.

## Saída

Segue para o passo `marcar`.

## Pare se

- Nunca: a ATA não trava a publicação.
