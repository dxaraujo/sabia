---
{"resumo": "Só nos critérios de revisão C: o C3 vem do pipeline do último commit da branch contra o baseline da branch base, quando o sabia.md declara CI, ou da saída do validar de quem chamou; falha de ambiente dá AMBIENTE."}
---
## Entrada

Os critérios de revisão C e a branch `<id>` (passo `escopo`). Nos critérios de revisão L, pule este passo.

## Faça

1. Com CI declarado no `.sabia/sabia.md` (linha CI dos Comandos): pelo MCP do CI, o pipeline do último commit da
   branch `<id>` e o último pipeline da branch base, que é o baseline. O C3 passa com o pipeline verde e nenhum teste
   verde no baseline vermelho na branch.
2. Sem CI declarado, ou com o MCP fora do ar: vale a saída do validar que quem chamou passou
   (`sa-desenvolver.codificar`): a suíte completa local e o baseline rodado antes de mexer.
3. Você não roda a suíte (o `sa-revisor` é só leitura) e não aceita "os testes passaram" sem a saída.
4. Validação que falhou por ambiente (serviço fora do ar, credencial, dependência externa) → C3 = AMBIENTE; diga o
   que falhou.

## Saída

O resultado do C3 (✅, ❌ ou AMBIENTE), com a evidência → passo `evidencia`.

## Pare se

—
