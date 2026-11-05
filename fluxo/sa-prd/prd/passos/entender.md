---
{"resumo": "Lê a descrição longa da demanda, explora o ELM, o código, o glossário e os ADRs antes de perguntar e confere o EP-<nn> da triagem e a pasta de trabalho da sa-especificar."}
---
## Entrada

A demanda: a descrição que veio da `sa-triar` ou a que a pessoa dá; work item do EWM, se houver.

## Faça

1. Peça (ou leia, se veio da `sa-triar`) a descrição **longa** da demanda: quem pediu, o problema, exemplos
   reais, prazos. Work item do EWM → `elm_ler_wi(id, comentarios)`.
2. **Explore antes de perguntar** (subagente `sa-pesquisador`, se houver; senão você mesmo, só leitura):
   - documentação atual no bundle do ELM, pelo `elm_buscar_req_local`/`elm_ler_req_local` ([sem bundle → ELM remoto](~/.sabia/framework/skills/sabia/references/elm.md#bundle-local); projeto sem ELM →
     pule): histórias e regras que já tratam do assunto —
     o PRD **altera** o que existe, não duplica;
   - código: onde o comportamento mora hoje, funcionalidades análogas;
   - glossário e ADRs (caminhos na seção Projeto do `sabia.md`): termos e decisões que já valem.
   O pesquisador devolve os fatos na resposta e não grava nada; guarde-os como Fonte das linhas do `decisoes.md` (id
   ELM, `arquivo:linha`).
3. Defina o id: o `EP-<nn>` da linha do `backlog.md` com `status` `iniciado` e `prd` `—` (a `sa-especificar` já
   assumiu a `[ESP]`). Outra situação → "use `sa-especificar EP-<nn>`" e pare.
   Pasta de trabalho: a da `sa-especificar` (`.sabia/local/especificacao/<EP>-<slug>/`, `<slug>` o da coluna `pasta` do `backlog.md`).
4. **EWM:** nada a registrar aqui — o épico nasceu no backlog do EWM na triagem (o `IB` da coluna `elm`;
   `pendente` → avise e siga) e entrou na sprint com a `[ESP]`.

## Saída

A demanda entendida, as fontes no `decisoes.md`, o `EP-<nn>` e a pasta de trabalho → passo `entrevistar`.

## Pare se

- Sem registro, a demanda não passou pela triagem → "use `sa-triar`" e pare.
- Sem a pasta de trabalho → "use `sa-especificar EP-<nn>`" e pare (é ela que assume a `[ESP]` e monta a pasta).

Ao parar aqui (na sessão da `[ESP]`, feche-a: `sa-especificar.especificar.fechar-sessao`).
