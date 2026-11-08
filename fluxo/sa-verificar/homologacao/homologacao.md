---
{"fluxo": "homologacao", "dono": "sa-desenvolvedor",
 "quando": ["homologação humana sobre o MR aberto, só quando o risco pede (o Risco do MR, o revisor ou o P.O.), por qualquer pessoa", "homologação da FT-031", "teste de aceite do usuário"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao"},
   {"id": "branch", "saidas": {"árvore suja": "fim"}},
   {"id": "cenarios", "chama": "sa-verificar.verificar"},
   {"id": "decisao", "saidas": {"nenhum ❌ adiado": "entrega"}},
   {"id": "captura", "de": "captura"},
   {"id": "gravar-na-base", "de": "gravar-na-base"},
   {"id": "entrega"}
 ]}
---
# homologação — o usuário aceita?

homologação humana, feito só quando o risco pede (o Risco do MR, o revisor ou o P.O.), por qualquer pessoa, sobre a branch
do MR aberto. A pessoa escolhe os cenários e a `sa-verificar.verificar` os roda com ela. Os achados são triados no
MR, e só o `corrige` segura o merge.

Quem chama: a pessoa ("homologação da FT-nnn") ou a oferta da `sa-revisar.mr` (agente `sa-desenvolvedor`). Não há sprint nem
booleana: quem a pessoa é sai do `equipe.json` pelo `usuario`.

Aceita: fatia ou bug com MR aberto da branch `<id>`.

## Entrada: vizinhos

- fatia ou bug sem MR aberto da branch `<id>` → `sa-desenvolver.codificar` (a autoverificação e o MR são dela)
- MR mergeado → a homologação é antes do merge ■

## Regras

- A homologação não grava arquivo na branch do autor: o `CT.csv` e o `status.md` são dele.
- O ELM aparece só como oferta das horas.
- Não há contagem de rodadas; o disjuntor vale só no autopilot.
