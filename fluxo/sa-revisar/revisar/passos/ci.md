---
{"resumo": "Só na rubrica C: o C3 vem do pipeline do último commit da branch contra o baseline da branch base (MCP do Jenkins), ou da saída do validar de quem chamou, ou do resultado que a pessoa informa; falha de ambiente dá AMBIENTE."}
---
## Entrada

A rubrica C e a branch `<id>` (passo `escopo`). Na rubrica L, pule este passo.

## Faça

1. Pelo MCP do Jenkins: o pipeline do último commit da branch `<id>` e o último pipeline da branch base, que é o baseline.
   O C3 passa com o pipeline verde e nenhum teste verde no baseline vermelho na branch.
2. Sem esse MCP: vale a saída do validar que quem chamou passou (`sa-desenvolver.codificar`), ou o resultado do
   pipeline que a pessoa informa, com o link.
3. Você não roda a suíte (o `sa-revisor` é só leitura) e não aceita "os testes passaram" sem a saída.
4. Pipeline que falhou por ambiente (serviço fora do ar, credencial, dependência externa) → C3 = AMBIENTE; diga o
   que falhou.

## Saída

O resultado do C3 (✅, ❌ ou AMBIENTE), com a evidência → passo `evidencia`.

## Pare se

—
