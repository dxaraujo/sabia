---
{"resumo": "Devolve os dados à sa-setup, ou oferece seguir para ela na chamada direta."}
---
## Entrada

Os dados do passo `dados` (ou `elm: false` do passo `mcp`).

## Faça

Resuma: `pa`, o que mudou, `ET as-built`, bundle. Se a `sa-setup.configurar` chamou, devolva os dados, e ela
segue do ponto em que parou. Na chamada direta, ofereça "seguir para a `sa-setup.configurar` em atualização?",
que aplica os dados e regenera os agentes.

## Saída

Devolução à `sa-setup`, ou passagem a ela com o "sim". Sem o "sim", fim.

## Pare se

- Nunca aplique os dados aqui.
