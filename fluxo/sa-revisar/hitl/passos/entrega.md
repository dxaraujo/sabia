---
{"resumo": "Créditos (e a lição, se houver), commit do relatório e do status.md, push da branch do PR, conferência no remoto e só então a [REV] (concluir ou manter) e o aviso ao próximo papel."}
---
## Entrada

O relatório e o `status.md` com a fase do veredito (passo `veredito`).

## Faça

**Entrega**, nesta ordem — o próximo só acha o seu trabalho no remoto:

1. créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e,
   se a pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra); commit
   do relatório e do `status.md` (`FT-<nnn> revisão <N>: <veredito | volta à especificação>`);
2. push da branch do PR (`git push origin <branch>`, nunca a base; o Kiro pergunta). Push recusado (pela
   pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou;
3. **confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
4. só então: `APROVADO` → saldo de horas e conclusão da `[REV]` (`elm_horas` → `elm_lancar_horas` do saldo →
   `elm_transicao(<id>, "concluir")`, numa confirmação; sem o MCP `elm` → `ELM pendente [<chave>]: lançar <h>h e concluir [REV] FT-<nnn>`) e avise o
   verificador de que a `[VER]` está disponível; `REVISAR` → avise o Dev responsável (o retrabalho é dele, no
   mesmo PR); volta à especificação → horas da sessão na `[REV]` (lança, não conclui) e avise o especificador
   (`sa-especificar FT-<nnn>`, agente `sa-especificador`) e o Dev responsável (a fatia espera a `[ESP] FT`).

## Saída

Relatório e `status.md` no remoto, a `[REV]` concluída (`APROVADO`) ou em andamento (`REVISAR`, volta à
especificação) e o próximo papel avisado. Aqui o fluxo termina.

## Pare se

- Remoto diferente do local (item 3) → não siga: diga o que falta.
