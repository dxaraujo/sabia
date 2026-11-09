---
{"resumo": "Texto do MR pelo padrão (O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados), commit, push, conferência no remoto e MR pelo gitlabpr."}
---
## Entrada

A branch verificada, com lições aprendidas e as-built, o resumo da revisão do agente e o bloco 🔎.

## Faça

1. Texto pelo `.gitlab/merge_request_templates/Default.md` do projeto ou, sem ele, pelo padrão
   `sa-desenvolver/pr.md`. Título `<FT-nnn> — <título>`. Seções: O quê · Porquê · Evidência (CI, 🔎, revisão do agente) ·
   Risco (Reversível?, DDL pendente `BD-nnn`, ADRs) · Foco (como ler) · Artefatos afetados · Lições aprendidas (só no trivial).
2. Entrega, nesta ordem:
   1. commit do que faltar, com a árvore limpa;
   2. push da branch (com o "sim"; liberado no autopilot);
   3. conferência no remoto: `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
   4. MR pelo `gitlabpr`: já existe (retrabalho) → o push o atualizou, atualize a descrição; senão
      `gitlab_criar_mr` (destino `<branch_base>`, `remover_origem: true`: o MR já nasce com "apagar a branch de origem após o
      merge" marcado). Sem o MCP, a pessoa abre o MR com essa opção marcada e passa o link.
3. No `status.md`: Fase `pr-aberto`, MR `!<iid> <url>` e o Retomar; commit e push.

## Saída

MR aberto ou atualizado → passo `avisar`.

## Pare se

- Push sem o "sim" → não há MR: pare com o título e o texto prontos.
- Remoto diferente do local → diga o que falta e pare.
