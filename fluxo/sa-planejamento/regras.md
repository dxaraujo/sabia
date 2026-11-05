---
{"resumo": "Regras comuns a todos os fluxos da sa-planejamento (arquivos, regra de ouro, capacidade, horas de gestão)."}
---
# Regras comuns da `sa-planejamento`

Valem em todos os fluxos da skill.

Arquivos na raiz de `<produto>/` (formatos em [arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md)):
`equipe.json`, `acordos.md`, `roadmap.md`, `sprints/<pai>/sprint-<nn>.md` (a sprint segue a iteração pai do EWM;
chave `<pai>/Sprint <nn>`: `2026/Sprint 03`). Fatias: `<produto>/backlog.md`.

Regra de ouro: cada etapa termina com a proposta na tela e "ok" antes de gravar.

- Créditos do Kiro: toda sessão desta skill registra os créditos no Fechar a sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4): um
  comentário na `[GB]` — `elm_comentar(<id da [GB]>, "Créditos <atividade> <ids>: <créditos> (sessão <sessão>,
  <login>, <AAAA-MM-DD>)")`, ex.: `Créditos planejamento 2026/Sprint 03: 2.40 (sessão 9ec1dcaa, ana.souza,
  2026-10-29)` — e, com sprint aberta, no mesmo commit, a linha na seção **Créditos de gestão** do `sprint-<nn>.md`
  (Atividade = a atividade da sessão, um destes valores: `inicial` · `planejamento` · `encaixe` · `sincronização` ·
  `troca de modo` · `review` · `retrospectiva` · `virada`; `<ids>` do comentário = a chave da sprint, salvo no
  `encaixe` e na `troca de modo`, o id do item).
- Horas de gestão: só o SM lança, na `[GB]` (`elm_lancar_horas`); o P.O. nunca lança, nem quando é também o SM.
- Nunca planeje acima da capacidade de revisão: trabalho que ninguém revisa não está entregue, só está parado.
- Fatia nunca se espalha por sprints para caber; se não cabe, divide.
- Tamanho é do time; o agente propõe P/M/G com justificativa, a pessoa decide. Nada de Planning Poker em pontos: a
  previsão é pela vazão.
- Pontos, se o time os usar no EWM, ficam só no IB (plan item), nunca nas tarefas, e não entram no planejamento.
- O compromisso da sprint é a meta: fatia prevista que não entrou não é falha; meta não atingida vai para a retro.
- Toda hora planejada tem tarefa: nada de especificação ou Sustentação fora da sprint.
