---
{"resumo": "Formato e critério da seção Regras aprendidas do .sabia/sabia.md (curadoria da sa-planejamento.review)."}
---
```markdown
## Regras aprendidas

- Toda consulta de extrato filtra pelo período antes de paginar · origem FT-031 · 2026-11-20
- Reprocessar arquivo de retorno só depois de conferir o lote no banco · origem AT-012 · 2026-11-20
```

- Uma linha por regra: `- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD` (data da review). A origem é o item cuja
  Lição gerou a regra: fatia ou bug (Lições aprendidas do `status.md`) ou Sustentação (Lições aprendidas do registro).
- A regra é curta e imperativa, uma frase. A explicação longa fica na Lição de origem.
- Antes de virar regra, escolha o lugar certo da correção: erro mecânico → checagem determinística (lint, teste, hook,
  CI), não regra; julgamento → esta seção; conhecimento de domínio → glossário, ADR ou PRD; conhecimento de stack →
  skill do toolkit.
- Nunca culpe pessoas: a regra é sobre o contexto e o processo.

Grava: só a `sa-planejamento.review`, pelo commit direto na branch base. A `sa-setup` regrava o `.sabia/sabia.md`
preservando esta seção. Leem: todos os agentes (steering), `sa-plano.plano` e a rubrica da `sa-revisar.revisar`.
