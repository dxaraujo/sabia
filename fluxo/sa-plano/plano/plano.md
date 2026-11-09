---
{"fluxo": "plano", "dono": "sa-desenvolvedor",
 "quando": ["planejar a fatia nas trilhas rápida e completo: pesquisa (research.md), decisões técnicas, delta com o texto aprovado copiado e design e tasks pela matriz trilha × formato (Kiro ou OpenSpec)", "planeja a FT-031", "gera a spec", "cria as tasks"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "fatia"},
   {"id": "ler"},
   {"id": "texto-aprovado", "travas": ["aprovacao-no-documento"], "saidas": {"falta a aprovação: Em aberto registrado (no autopilot, devolvido)": "fim"}},
   {"id": "pesquisa", "chama": "sa-pesquisar.pesquisar"},
   {"id": "decisoes", "saidas": {"arquitetural ou irreversível sem a decisão da pessoa (no autopilot, devolvido)": "fim"}},
   {"id": "delta"},
   {"id": "escrever", "saidas": {"o plano mostra que passa de G: vira épico": "→ sa-refinar.moldar"}},
   {"id": "revisar", "chama": "sa-revisar.revisar", "saidas": {"completo com parte por escrever, ou achado corrige": "escrever", "autopilot, 2ª reprovação seguida": "→ sa-desenvolver.codificar.disjuntor"}},
   {"id": "aprovar", "saidas": {"ajuste pedido por quem desenvolve": "escrever"}},
   {"id": "seguir", "saidas": {"IA supervisionada ou IA autopilot": "→ sa-desenvolver.codificar", "manual: Retomar gravado, sessão encerrada até o 'terminei'": "fim"}},
   {"id": "captura", "de": "captura"},
   {"id": "gravar", "de": "commit-na-branch-base"}
 ]}
---
# Plano — decidir o como antes de codar

O plano da fatia nas trilhas rápida e completo; o trivial não passa por aqui. Junta os fatos pela `sa-pesquisar` e
grava o `research.md`, toma as decisões técnicas, copia o texto aprovado para o delta (sem reescrever) e escreve
design e tasks pela matriz trilha × formato. Quem desenvolve aprova o próprio plano; no autopilot, o subagente aprova
e registra. Modelos: o padrão `sa-plano/plano.md` e o padrão `sa-plano/research.md`.

Deste fluxo: item `em-andamento`, branch `<id>`, pasta da spec com `status.md`, trilha rápida ou completo e Fase `—`.
O manual segue as regras da IA supervisionada: a pessoa está presente.

Os passos `captura` e `gravar` são a captura comum e o commit direto na branch base: outros passos os incluem e voltam.

## Entrada: vizinhos

- trilha trivial → `sa-desenvolver.codificar`
- sem branch `<id>` ou sem pasta da spec → `sa-desenvolver.iniciar`
- Fase diferente de — (plano já aprovado) → `sa-desenvolver.codificar`
- mudança pedida num plano já aprovado → `sa-plano.replanejar`
