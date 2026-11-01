---
{"resumo": "Contexto e regras comuns aos fluxos da sa-aprender (arquivos, ordem de preferência da correção)."}
---
# Regras comuns da `sa-aprender`

Valem em todos os fluxos da skill.

Todo retrabalho tem uma causa no **ambiente** do agente: contexto, verificação ou processo. Corrigir só o código
resolve hoje; corrigir o ambiente resolve para sempre. Arquivos (versionados):

- `<produto>/aprendizado/licoes.md` — log de lições (só acréscimo);
- a seção **Regras aprendidas** do `.sabia/sabia.md` — regras promovidas de **julgamento** (o revisor
  cobra, o plano respeita; o steering é sempre carregado, então cada regra é curta, imperativa, com exemplo).

Os dois só mudam na **branch base** (artefato de produto), pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) (com
"sim" na troca de branch; alterações pendentes na branch da fatia → commite-as ou peça à pessoa antes).

**Ordem de preferência da correção:** (1) erro **mecânico** → checagem determinística (lint, teste, hook, CI) —
ponto final, não vira texto; (2) regra de **julgamento** → seção Regras aprendidas do `sabia.md` (o revisor
cobra); (3) conhecimento de domínio → glossário, ADR ou PRD/ELM; (4) conhecimento de stack → skill do toolkit. O steering recebe só a regra
curta, nunca a explicação longa (ela fica no `licoes.md`).

- Nunca culpe pessoas; a lição é sobre o contexto e o processo.
