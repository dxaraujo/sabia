---
{"resumo": "Tria cada resultado que não é ✅: ❌ corrige, adia ou descarta; 🔁 decidido com o autor (código errado vira ❌, spec que muda é volta-spec); ⚠️ vira thread sem contar como falha."}
---
## Entrada

O 🔎 da revisão humana (passo `cenarios`).

## Faça

1. Tria cada resultado que não é ✅:

| Resultado | Decisão |
|---|---|
| ❌ | corrige (thread no MR, que segura o merge) · adia (cadastro de um bug com `origem FT-nnn` na `obs`, passo `cadastro`) · descarta (com o motivo) |
| 🔁 | a pessoa decide com o autor: código errado vira ❌; spec que muda é `volta-spec` (thread; o autor registra em Em aberto a pergunta ao especificador, que decide, com ELM pela `sa-especificar.elm`, e a `sa-plano.replanejar` recopia o texto para o delta) |
| ⚠️ | thread dizendo o que faltou no ambiente, sem contar como falha |

2. Só o `corrige` segura o merge.

## Saída

Cada resultado com a decisão. Algum ❌ adiado → passo `cadastro`, um por achado.

## Pare se

—
