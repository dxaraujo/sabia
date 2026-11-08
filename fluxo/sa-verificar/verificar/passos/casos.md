---
{"resumo": "Na quick e no completo, reescreve o CT.csv da pasta da spec com uma linha por cenário ✅, pelo padrão sa-verificar/ct-csv.md; na trivial e quando quem chama é o UAT, não há CT.csv."}
---
## Entrada

Os resultados por cenário (passo `executar`) e a rota da fatia.

## Faça

1. Na trivial não há `CT.csv`: a prova fica no MR. Quando quem chama é a `sa-verificar.uat`, o `CT.csv` não é
   reescrito, porque o arquivo é do autor. Nos dois casos, pule este passo.
2. Na quick e no completo, reescreva o `CT.csv` da pasta da spec (`<pasta da spec>/CT.csv`; no autopilot, dentro
   da worktree) com uma linha por cenário ✅, no padrão `sa-verificar/ct-csv.md`. Tipo `CT` com skill de toolkit no seu
   prompt (sem agente: a seção Tipos com skill de toolkit do `.sabia/sabia.md`) → as linhas saem pela skill, com o
   fluxo e o padrão do tipo; o arquivo, a codificação e as colunas continuam as do padrão do Sabiá. Os cenários ❌, ⚠️ e 🔁 não entram.
3. Responsável = o `usuario` de quem disparou a verificação (no autopilot, quem desenvolve). O `<FT-nnn> CT-nn` do
   Resumo é a mesma marca do teste automatizado.

## Saída

O `CT.csv` reescrito (ou nada, na trivial e no UAT) → passo `resultado`. O commit é de quem chamou.

## Pare se

—
