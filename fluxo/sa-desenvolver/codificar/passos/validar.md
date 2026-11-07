---
{"resumo": "Na volta do manual, o trecho e os CT-nn; em toda autonomia, a suíte completa uma vez pelo pipeline da branch, contra o baseline, e a cobertura."}
---
## Entrada

A branch com todas as tarefas feitas, ou a volta da codificação manual ("terminei").

## Faça

1. **Volta do manual**: árvore suja → mostre o `git status` e proponha o commit do que a pessoa fez (com o "sim").
   Compile, rode os testes do trecho tocado e confira um teste com o `CT-nn` para cada cenário da ficha e da spec.
   Cobrir testes e cenários é de quem codificou: aponte o que falta e não trave.
2. **Suíte completa**, uma vez, em toda autonomia: push da branch e o pipeline dela (sem CI, localmente pelo
   `AGENTS.md`), comparado com o baseline do passo `preparar`. Sem o MCP do Jenkins, a pessoa confere o pipeline ou
   a suíte roda local. Cobertura como o `acordos.md` ou o pipeline pedem.
3. Mostre a evidência: o comando e o resultado. "Passou" sem a saída não vale.
4. Vermelho novo (verde no baseline) → tarefa nova no fim do `tasks.md` e volta ao passo `tarefa`; no manual, vai a
   quem codificou, que avisa de novo.
5. Falha de ambiente (não do código) → registre `⚠️ ambiente: <o que faltou>` no Retomar; fora do autopilot, a
   pessoa decide se segue; no autopilot, devolva à pessoa.

## Saída

Suíte verde contra o baseline → passo `revisar`.

## Pare se

- Falha de ambiente sem o "sim" de seguir, ou no autopilot.
