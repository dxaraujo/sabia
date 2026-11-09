---
{"fluxo": "capturar", "dono": "sa-especificador",
 "quando": ["registrar sem triar: a linha nasce nova (épico: a-moldar) e a triagem fica para depois", "registra isso", "anota no backlog", "abre um bug", "registrar sem triar"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"pedido em texto, ou sem texto (pergunte o que registrar)": "capturar"}},
   {"id": "capturar", "de": "captura"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "saidas": {"fatia ou bug nova: triar agora": "→ sa-triar.triar", "mais um item": "capturar", "não": "fim"}}
 ]}
---
# Capturar — registrar sem triar

Entrada direta "registrar sem triar": roda a captura comum com o tipo que a pessoa diz (ou que a captura pergunta,
com a recomendação), grava a linha `nova` (épico: `a-moldar`) com o corpo mínimo e oferece triar. As outras skills
não chamam este fluxo: incluem a captura comum.

## Entrada: vizinhos

- item já registrado no `backlog.md` → o capturar só cria item: diga o id e o status e pare ■
