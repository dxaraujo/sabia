---
{"fluxo": "pesquisar", "dono": "sa-pesquisador",
 "quando": ["pesquisa neutra e só de leitura para quem chama (sa-plano, sa-prd, sa-refinar, sa-entrevistar, sa-atender): recebe escopo e perguntas e devolve fatos com arquivo:linha, sem gravar nada", "pesquisa o código da FT-031", "onde isso está implementado", "entender o código antes de planejar"],
 "travas_gerais": ["decisao-da-pessoa"],
 "passos": [
   {"id": "escopo"},
   {"id": "perguntas"},
   {"id": "investigar"},
   {"id": "fatos"}
 ]}
---
# Pesquisar — fatos antes de decidir

Uma linha errada na pesquisa vira um plano errado, que vira centenas de linhas de código erradas. Por isso a
pesquisa é curta, factual e verificável: cada fato com `arquivo:linha`.

Roda no subagente `sa-pesquisador`, só leitura e com contexto próprio: lê muito e devolve pouco. Não grava nada;
quem guarda é quem chamou (o `research.md` é da `sa-plano.plano`). Chamada por `sa-plano.plano`, `sa-prd.prd`,
`sa-refinar.fatiar`, `sa-entrevistar.entrevistar` e `sa-atender.atender`.
