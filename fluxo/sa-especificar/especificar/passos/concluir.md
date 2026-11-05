---
{"resumo": "Fecha a sessão que o passo fechamentos não fechou (PRD já na base); um commit com o que a publicação gravou de volta, a linha de créditos da sessão e a linha do épico na seção Especificação concluida; conclui a [ESP] (saldo de horas) e diz que o fatiamento, do P.O. ou do SM, vem logo em seguida."}
---
## Entrada

O PRD publicado e ligado à `[ESP]` (ou `ELM pendente`), ou o projeto sem ELM (passo `publicar`).

## Faça

1. **Sessão** — PRD já na base ao chegar ao passo `fechamentos` (a mudança ou a retomada da publicação: ali a sessão
   não fechou) → feche-a antes do commit (passo `fechar-sessao`), sem a pergunta das horas (o saldo do item 3 já as
   conta) e sem commit próprio: a linha de créditos no `status.md` do épico e, sem o MCP `elm`, a pendência da sessão
   vão no commit do item 2.
2. **Base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), **um** commit
   `EP-<nn> concluir especificação` (padrão do `sabia.md`), direto na base: o que o passo `publicar` gravou de volta
   (conceitos e glossário) e, no `sprint-<nn>.md` aberto, a linha do épico na seção Especificação com Situação
   `concluida` e os Créditos (a soma da seção Créditos do `status.md` do épico, já com a linha do item 1; na `[ESP] EP-<nn> Revisão <n>`, só
   das linhas com Data depois da conclusão anterior, já contada na linha dela; o `creditos` do `backlog.md` é da
   virada da sprint), com as pendências no rodapé do PRD. Sem o MCP `elm`, vai junto a pendência da Conclusão da
   `[ESP]`.
3. **Conclusão da `[ESP]`** (com ELM): mostre as horas já lançadas (`elm_horas(id)`) e pergunte só o saldo a quem
   especificou → `elm_lancar_horas(id, horas)` e `elm_transicao(id, "concluir")`, numa confirmação. Sem o MCP `elm`
   → `ELM pendente [ESP EP-<nn> concluir]: lançar <h>h e concluir` (no commit do item 2).
4. Diga, exata: `Próximo: fatiar o EP-<nn> — P.O. ou SM, agente sa-produto (sa-fatiar). O fatiamento vem logo em seguida.`
   e pare.

Situação da linha do épico na seção Especificação ([situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações)):
`planejada` (`sa-planejamento`; a `[ESP] EP-<nn> Revisão <n>`, também pelo encaixe), `iniciada` (passo `assumir`; a
reabertura e a Revisão, pela `sa-prd.mudanca`) e `concluida` (aqui); `cancelada` com o épico cancelado (`sa-fatiar`).

## Saída

O PRD na base com o que a publicação gravou, a linha da Especificação `concluida`, a `[ESP]` concluída (ou
`ELM pendente`), a sessão fechada e o próximo dito (`sa-fatiar`, do P.O. ou do SM). Aqui o fluxo termina.

## Pare se

- Próximo dito → pare: o fatiamento é de outro papel.
