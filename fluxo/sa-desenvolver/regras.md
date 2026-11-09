---
{"resumo": "Leitura de entrada e regras comuns aos fluxos da sa-desenvolver."}
---
# Regras comuns da `sa-desenvolver`

Valem em todos os fluxos da skill.

Leia antes: `.sabia/sabia.md` (Projeto, Especificação, Comandos, Verificação de aceite, ELM, Regras aprendidas) e o
`.sabia/config/agentes.json` (`base`, `prefixo_branch`, `formato_spec`, `elm`). Sem o `.sabia/sabia.md` →
ofereça a `sa-setup.configurar` e pare.

- **Autonomia da codificação** (linha Autonomia do `status.md`): IA supervisionada, IA autopilot ou manual, escolhido ao assumir
  e fixo até o fim da tarefa. No manual, só a geração do código-fonte é da pessoa; o resto do fluxo segue igual.
  Pedido de trocar no meio → diga isso e siga na autonomia atual.
- **Trilha**: trivial (sem arquivo de spec, tudo no MR), rápida ou completo. Com artefatos afetados, nunca trivial.
- **Onde se grava**: as linhas do `backlog.md` e do `sprint-<nn>.md` só na base, pela gravação comum na base; código,
  delta, design, tasks, `research.md`, `status.md` e `CT.csv` só na branch `<id>`, com MR. MR só para código.
- **Branch**: atualiza só por merge da base (`git merge origin/<base>`). Nunca rebase, nunca `--force`.
- **Autopilot**: o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`. Liberados: push da própria
  branch, merge da base nela e abrir ou atualizar o MR dela. Bloqueados: merge do MR, ELM e rede. Ele não grava na
  base: o que gravaria vai ao Em aberto do `status.md` e volta à pessoa no resumo.
- **ELM**: só com a chave `elm` do `agentes.json`; a skill só oferece a `sa-elm`, e a resposta não muda o fluxo.
- Nunca invente dado de work item, regra ou valor.
- Fim de cada fluxo: ofereça seguir na mesma sessão quando é a mesma tarefa; pedido sobre outra tarefa → sugira uma
  sessão nova, sem impor.
