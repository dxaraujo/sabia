---
{"resumo": "Um commit com o que a publicação gravou de volta e a linha do épico na seção Especificação concluida; conclui a [ESP] (saldo de horas) e diz que o fatiamento, do P.O. ou do SM, vem logo em seguida."}
---
## Entrada

O PRD publicado e ligado à `[ESP]` (ou `ELM pendente`), ou o projeto sem ELM (passo `publicar`).

## Faça

1. **Base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), **um** commit
   `EP-<nn> concluir especificação` (padrão do `sabia.md`), direto na base: o que o passo `publicar` gravou de volta
   (conceitos e glossário) e, no `sprint-<nn>.md` aberto, a linha do épico na seção Especificação com Situação
   `concluida` e os Créditos (a soma da seção Créditos do `status.md` do épico; na `[ESP] EP-<nn> Revisão <n>`, só
   das linhas com Data depois da conclusão anterior, já contada na linha dela; o `creditos` do `backlog.md` é da
   virada da sprint), com as pendências no rodapé do PRD. Sem o MCP `elm`, vai junto a pendência da Conclusão da
   `[ESP]`.
2. **Conclusão da `[ESP]`** (com ELM): mostre as horas já lançadas (`elm_horas(id)`) e pergunte só o saldo a quem
   especificou → `elm_lancar_horas(id, horas)` e `elm_transicao(id, "concluir")`, numa confirmação. Sem o MCP `elm`
   → `ELM pendente [<chave>]: lançar <h>h e concluir [ESP] EP-<nn>` (no commit do item 1).
3. Diga, exata: `Próximo: fatiar o EP-<nn> — P.O. ou SM, agente sa-produto (sa-fatiar). O fatiamento vem logo em seguida.`
   e pare.

Situação da linha do épico na seção Especificação ([situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações)):
`planejada` (`sa-planejamento`; a `[ESP] EP-<nn> Revisão <n>`, também pelo encaixe), `iniciada` (passo `assumir`; a
reabertura e a Revisão, pela `sa-prd.mudanca`) e `concluida` (aqui); `cancelada` com o épico cancelado (`sa-fatiar`).

## Saída

O PRD na base com o que a publicação gravou, a linha da Especificação `concluida`, a `[ESP]` concluída (ou
`ELM pendente`) e o próximo dito (`sa-fatiar`, do P.O. ou do SM). Aqui o fluxo termina.

## Pare se

- Próximo dito → pare: o fatiamento é de outro papel.
