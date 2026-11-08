---
{"resumo": "Regras comuns aos fluxos da sa-status: só leitura (salvo o fechar-sessao), coleta única, pasta da spec, quem pode e nada inventado."}
---
# Regras comuns da `sa-status`

Valem em todos os fluxos da skill.

- **Só leitura**: nenhum fluxo grava arquivo, branch nem ELM, salvo a `sa-status.fechar-sessao` (Retomar, `tasks.md`
  e o CSV de créditos, com o "ok"). O EWM é da `sa-elm`.
- **Coleta única**: todos os fluxos leem pela coleta da `sa-status.painel` (do `sa-status.painel.backlog-e-sprint` ao
  `sa-status.painel.trava-de-artefato`), sempre da base remota depois do `git fetch --quiet`. Sem rede, a base local,
  com o aviso "dados locais".
- **Pasta da spec** pelo `formato_spec` do `agentes.json`: Kiro `.kiro/specs/ft-<nnn>-<slug>/`; OpenSpec
  `openspec/changes/ft-<nnn>-<slug>/` (arquivada: `openspec/changes/archive/*-ft-<nnn>-<slug>/`). A rota trivial não
  tem pasta: a fase sai do MR.
- **Identidade**: a regra do `sa-status.painel.identidade`, citada pelas outras skills.
- **Quem pode**, pelas booleanas do `equipe.json`: `desenvolvedor` para `sa-desenvolver.*` e `sa-revisar.mr`; `produto`
  para go/kill e aprovações de pitch, PRD e ficha; `especificador` para `elm/` e `sa-elm.publicar`; captura, triagem
  e revisão humana, qualquer pessoa.
- **Sem ELM** (sem a seção ELM no `.sabia/sabia.md`): publicação pendente, horas e Tarefas não aparecem.
- **Nunca invente** dado de item: o que não está no `backlog.md`, nos `sprint-<nn>.md` ou no MR não existe para a
  skill.
- **Encadeamento**: seguir pela skill dona na mesma sessão só quando é a mesma tarefa; outra tarefa → a frase para a
  sessão nova (`vamos trabalhar na <id>`).
