---
{"resumo": "Lê a descrição longa da demanda, explora o ELM, o código, o glossário e os ADRs antes de perguntar e confere o EP-<nn> da triagem e a pasta de trabalho da sa-especificar."}
---
## Entrada

A demanda: a descrição que veio da `sa-triar` ou a que a pessoa dá; work item do EWM, se houver.

## Faça

1. Peça (ou leia, se veio da `sa-triar`) a descrição **longa** da demanda: quem pediu, o problema, exemplos
   reais, prazos. Work item do EWM → `elm_ler_wi(id, comentarios)`.
2. **Explore antes de perguntar** (subagente `sa-pesquisador`, se houver; senão você mesmo, só leitura):
   - documentação atual no bundle do ELM, pelo `elm_buscar_req_local`/`elm_ler_req_local` ([sem bundle → ELM remoto](~/.sabia/framework/skills/sabia/references/elm.md#bundle-local)): histórias e regras
     que já tratam do assunto —
     o PRD **altera** o que existe, não duplica;
   - código: onde o comportamento mora hoje, funcionalidades análogas;
   - glossário e ADRs (caminhos na seção Projeto do `sabia.md`): termos e decisões que já valem.
   Registre o que achou como fontes (id ELM, `arquivo:linha`).
3. Defina o id: o `EP-<nn>` que a `sa-triar` registrou (linha com `prd` `—`: `novo` ou `elegivel` na triagem,
   `iniciado` pela `sa-especificar`).
   Pasta de trabalho: a da `sa-especificar` (`.sabia/local/especificacao/<EP>-<slug>/`, `slug` em kebab-case, sem
   acento).
4. **EWM:** nada a registrar aqui — o épico nasceu no backlog do EWM na triagem (o `IB` da coluna `elm`;
   `pendente` → crie pela [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §3) e entrou na sprint com a
   `[ESP]`.

## Saída

A demanda entendida, as fontes registradas, o `EP-<nn>` e a pasta de trabalho → passo `entrevistar`.

## Pare se

- Sem registro, a demanda não passou pela triagem → "use `sa-triar`" e pare.
- Sem a pasta de trabalho → "use `sa-especificar EP-<nn>`" e pare (é ela que assume a `[ESP]` e monta a pasta).
