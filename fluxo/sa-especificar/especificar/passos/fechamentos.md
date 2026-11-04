---
{"resumo": "Depois do GATE do PRD (o primeiro, ou a mudança antes do fatiamento): fecha a sessão, leva o PRD aprovado, com o protótipo registrado, para a base com a linha da Especificação concluida (um commit), conclui a [ESP] e passa o fatiamento ao P.O. ou ao SM."}
---
## Entrada

O GATE do PRD feito, com a `[ESP]` aberta: Fase `aprovado` no `status.md` da pasta de trabalho (o primeiro GATE) ou
no da base (a mudança antes do fatiamento, `sa-prd.mudanca`). Ou, pelo passo `entrada`: o PRD na base na Fase
`aprovado`, com a linha da Especificação ainda `iniciada`.

## Faça

Fechamentos da `[ESP]`, que termina no GATE do PRD. A `sa-prd` conduz o GATE e grava só o próprio artefato; o que é
da `[ESP]` é daqui. O fatiamento e o backlog são do P.O. ou do SM.

1. Feche a sessão (passo `fechar-sessao`), para a `[ESP]` ter a versão aprovada.
2. **Base**, pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), **um** commit
   (padrão do `sabia.md`), direto na base; nunca numa branch de fatia:
   - **primeiro GATE** → leve a pasta: copie-a, fora de `reunioes/` (a transcrição fica só nesta máquina), para
     `<produto>/epicos/<EP>-<slug>/`, com `prototipo/` só com as versões registradas (`prototipo-v<N>-<slug>.<ext>`,
     conferidas com dado fictício; arquivo sem o prefixo fica fora; o anexo da `[ESP]` continua) (substitui o
     `rascunho.md`, o `decisoes.md` e o `status.md` da triagem), com o `revisao-prd-<N>.md`; no `backlog.md`, só o
     link `prd` na linha do épico e, se estava `—`, o da `pasta` (ele segue `iniciado`). Commit `EP-<nn> aprovar PRD`.
     A partir daí a base é a fonte; a pasta local pode ser apagada pela pessoa (o fluxo não apaga);
   - nos dois casos, no `sprint-<nn>.md` aberto, a linha do épico na seção Especificação com Situação `concluida` e
     os Créditos (a soma da seção Créditos do `status.md` do épico; o `creditos` do `backlog.md` é da virada da
     sprint); na mudança, o commit é `EP-<nn> concluir especificação`. Sem o MCP `elm`, vai junto, no rodapé do
     PRD, a pendência da Conclusão da `[ESP]`.
3. **Conclusão da `[ESP]`** (com ELM): mostre as horas já lançadas (`elm_horas(id)`) e pergunte só o saldo a quem
   especificou → `elm_lancar_horas(id, horas)` e `elm_transicao(id, "concluir")`, numa confirmação. Sem o MCP `elm`
   → `ELM pendente [<chave>]: lançar <h>h e concluir [ESP] EP-<nn>` (no commit da base, acima).
4. Diga `Próximo: o fatiamento é do P.O. ou do SM — sa-fatiar EP-<nn> (agente sa-produto)` e pare.

Situação da linha do épico na seção Especificação ([situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações)):
`planejada` (`sa-planejamento`), `iniciada` (passo `assumir`; a reabertura, pela `sa-prd.mudanca`) e `concluida`
(GATE do PRD, aqui); `cancelada` com o épico cancelado (`sa-fatiar`).

## Saída

O PRD aprovado na base, a linha da Especificação `concluida`, a `[ESP]` concluída (ou `ELM pendente`) e o próximo
dito (`sa-fatiar`, do P.O. ou do SM). Aqui o fluxo termina.

## Pare se

- Próximo dito → pare: o fatiamento é de outro papel.
