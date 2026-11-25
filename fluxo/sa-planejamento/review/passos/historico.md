---
{"resumo": "Monta a seção da sprint no Histórico de Entregas (release notes): novidades, correções, atendimentos e épicos concluídos, com a frase de cada entrega aprovada pela pessoa."}
---
## Entrada

A sprint, o `backlog.md` da branch base e as entregas da review.

## Faça

1. As entregas são as da review: a fatia, o bug e o atendimento cujo trabalho principal tem `concluida_em` na sprint e
   status concluído no `backlog.md`, e o épico que ficou `concluido` no ciclo.
2. Para cada fatia e bug, proponha uma frase do que muda para quem usa. A fonte é o título do item e a seção "O quê"
   do MR (o campo `MR` do `status.md` da spec, em `.kiro/specs/<id>-…/`, `openspec/changes/<id>-…/` ou no archive; na
   trilha trivial, o MR lido no GitLab). Sem MR legível, a linha sai só com o título e o id: não invente.
3. Monte a seção da sprint pelo template `sa-planejamento/historico-de-entregas.md`: **Novidades** (fatias),
   **Correções** (bugs), **Atendimentos** (só id e título: dado de cliente não vai ao git) e **Épicos concluídos**
   (com as fatias). Subseção sem item não entra. A meta vem da `**Meta:**` da sprint; "atingida" ou "não atingida" só
   se quem tem `produto` já respondeu.
4. Mostre a seção e ajuste com a pessoa. Ela entra no topo do `.sabia/planejamento/historico-de-entregas.md` (o arquivo
   nasce aqui, com o título do template); a seção da mesma sprint que já existe é trocada, não duplicada.
5. O feedback da review e o que ficou em aberto não entram no histórico.

## Saída

A seção da sprint, com o "ok" da pessoa → passo `metricas`. Sem entrega no ciclo → nada a acrescentar; siga.

## Pare se

Sem condição própria: sem o "ok" às frases, o histórico não é gravado e o fluxo segue.
