---
{"resumo": "Leitura de entrada e regras comuns aos fluxos da sa-desenvolver."}
---
# Regras comuns da `sa-desenvolver`

Valem em todos os fluxos da skill.

Leia antes: `.sabia/sabia.md` (Projeto, Especificação, Comandos, Verificação de aceite, ELM, Regras aprendidas) e o
`.sabia/config/agentes.json` (`branch_base`, `prefixo_branch`, `formato_spec`, `elm`). Sem o `.sabia/sabia.md` →
ofereça a `sa-setup.configurar` e pare.

- **CI e validação verde.** A linha CI da seção Comandos do `.sabia/sabia.md` diz se o projeto tem CI e qual MCP lê o
  pipeline. Com CI: vale o pipeline do último commit da branch, lido por esse MCP, e o baseline é o último pipeline
  da branch base. Sem CI declarado, ou com o MCP fora do ar: vale a suíte completa rodada localmente pelos Comandos,
  com a saída na Evidência do MR, e o baseline é a suíte rodada antes de mexer. Nos dois casos o teste que já estava
  vermelho no baseline não conta; nenhum teste verde pode ficar vermelho. Onde um fluxo diz "CI verde", leia
  "validação verde" por esta regra. Nenhum fluxo presume um CI que o `sabia.md` não declara.
- **Autonomia da codificação** (linha Autonomia do `status.md`): IA supervisionada, IA autopilot ou manual, escolhido ao assumir
  e fixo até o fim da tarefa. No manual, só a geração do código-fonte é da pessoa; o resto do fluxo segue igual.
  Pedido de trocar no meio → diga isso e siga na autonomia atual.
- **Trilha**: trivial (sem arquivo de spec, tudo no MR), rápida ou completo. Com artefatos afetados, nunca trivial.
- **Onde se grava**: as linhas do `backlog.md` e do `sprint-<nn>.md` só por commit direto na branch base; código,
  delta, design, tasks, `research.md`, `status.md` e `CT.csv` só na branch `<id>`, com MR. MR só para código.
- **Branch**: atualiza só por merge da branch base (`git merge origin/<branch_base>`). Nunca rebase, nunca `--force`.
- **Autopilot**: o `sa-desenvolvedor` como subagente na worktree `.sabia/local/wt/<id>`. Liberados: push da própria
  branch, merge da branch base nela e abrir ou atualizar o MR dela. Bloqueados: merge do MR, ELM e rede. Ele não grava na branch base: o que gravaria vai ao Em aberto do `status.md` e volta à pessoa no resumo.
- **ELM**: só com a chave `elm` do `agentes.json`; a skill só oferece a `sa-elm`, e a resposta não muda o fluxo.
- Nunca invente dado de work item, regra ou valor.
- Fim de cada fluxo: ofereça seguir na mesma sessão quando é a mesma tarefa; pedido sobre outra tarefa → sugira uma
  sessão nova, sem impor.
