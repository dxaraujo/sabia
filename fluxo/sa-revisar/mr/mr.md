---
{"fluxo": "mr", "dono": "sa-desenvolvedor",
 "quando": ["revisão oficial do MR de código por um desenvolvedor que não é o autor, em qualquer modo", "revisa o MR da FT-031", "revisar o MR !42", "aprovar o MR da FT-031"],
 "travas_gerais": ["revisao-independente", "pr-lido-por-pessoa", "sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "nao"},
   {"id": "revisor", "saidas": {"a pessoa é o autor do MR ou não tem a booleana desenvolvedor": "fim"}},
   {"id": "ler"},
   {"id": "rubrica", "chama": "sa-revisar.revisar"},
   {"id": "veredito", "saidas": {"nenhum achado com destino adia": "entrega"}},
   {"id": "captura", "de": "captura"},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "entrega"}
 ]}
---
# MR — revisão oficial do MR de código

Um desenvolvedor que não é o autor revisa o MR com o apoio da `sa-revisar.revisar` (rubrica C), tria os achados no
próprio MR e aprova. Vale para qualquer modo (IA supervisionada, IA autopilot ou manual). Não há merge direto: o
merge é do autor, pela `sa-desenvolver.encerrar`. A escrita no GitLab (threads, aprovação) é sempre com o "sim".

Entra o id do item ou o link do MR, depois do aviso da `sa-desenvolver.codificar` de que o MR espera revisão. Não há
conferência de sprint.

Aceita: fatia ou bug com MR aberto da branch `<id>`. MR em Draft: avise que o autor ainda não pediu revisão e só
siga com o "sim".

## Entrada: vizinhos

- fatia ou bug sem MR aberto da branch `<id>` → `sa-desenvolver.codificar` (o MR é aberto por ela)
- MR mergeado e o item ainda não `concluida` → `sa-desenvolver.encerrar`
- MR fechado sem merge → mostre o MR e pare: não há o que revisar ■

## Regras

- O revisor não faz commit na branch nem merge: tudo fica no MR (aprovação ou threads).
- Só o BLOQUEANTE trava o merge. Ele sai por `corrige` ou por `descarta` com o motivo.
- Qualquer desenvolvedor que não é o autor revisa; a revisão não tem tarefa no EWM.
