---
{"resumo": "A pessoa faz o trabalho e a IA ajuda a pedido: regras vigentes, pesquisa de código pela sa-pesquisar, banco só em leitura, logs, rascunho de resposta; dado real fora do git; Atividade no registro."}
---
## Entrada

O item `em-andamento` com a pessoa (passo `assumir`).

## Faça

A pessoa faz o trabalho; a IA ajuda quando ela pede.

1. **Regras vigentes**, em leitura local: specs arquivadas → especificação vigente → bundle do ELM. Com ELM, sem bundle ou com
   bundle desatualizado (`sincronizado_em` anterior à última publicação; mostre a data) → ofereça a `sa-elm.baixar`.
   Sem ELM, não ofereça.
2. **Código:** pela `sa-pesquisar.pesquisar` (subagente `sa-pesquisador`), com o pedido e um escopo fechado (termos
   ou arquivos e um limite de leitura). Ela devolve fatos com `arquivo:linha`; o resumo vai na Atividade.
3. **Banco** só pelo MCP de consulta, em leitura. Sem o MCP, escreva a SQL e a pessoa roda.
4. **Logs** pelo MCP `elk`, se configurado.
5. **Resposta:** rascunho só se a pessoa pedir. Quem envia é a pessoa.
6. **Em ambiente:** script, deploy, DDL e comando são da pessoa. A Atividade registra o que foi feito · onde ·
   resultado.
7. **Dado de cliente** fica em `.sabia/local/sustentacao/<ID>/`, fora do git. No registro ficam só a consulta, a
   contagem, o caminho e um resumo anônimo.
8. Regra que ninguém decidiu fica em aberto ao P.O., na Atividade, e para só o que depende dela. Especificador, P.O.
   ou o time entram quando a pessoa chama.
9. Cada avanço vira uma linha da Atividade: `AAAA-MM-DD · feito · próximo`.

## Saída

A pessoa declara resolvido, ou o pedido foi retirado → passo `finalizar`. Pedido que muda o código, ou categoria
errada → passo `fora-do-escopo`. A sessão termina antes de resolver → commit `<ID> registrar sessão` do registro pelo commit direto na branch base (passo `commit-na-branch-base`), e o fluxo termina.

## Pare se

—
