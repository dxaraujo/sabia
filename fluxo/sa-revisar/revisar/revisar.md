---
{"fluxo": "revisar", "dono": "sa-revisor",
 "quando": ["revisão independente do plano (critérios de revisão L) ou do código (critérios de revisão C), como subagente de quem chama ou a pedido direto", "revisa o plano da FT-031", "revisa o código da FT-031", "code review", "revisão do agente antes do MR"],
 "travas_gerais": ["decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "fatia"},
   {"id": "escopo"},
   {"id": "ci"},
   {"id": "evidencia"},
   {"id": "relatorio"}
 ]}
---
# Revisar — revisão independente

Entra o pedido de quem chama: os critérios de revisão (L ou C), o item e a parte do plano ou o diff. Quem chama:

| Quem chama | Critérios de revisão | Quando |
|---|---|---|
| `sa-plano.plano` | L | a pessoa aceita "quer revisar agora?" ao fim de uma parte do plano |
| `sa-plano.replanejar` | L | só a parte alterada |
| `sa-desenvolver.codificar` | C | revisão do agente antes do MR, em qualquer autonomia |
| `sa-revisar.mr` | C | apoio ao revisor humano |

O pedido direto também entra ("revisa o plano da FT-nnn", "revisa o código da FT-nnn"); nele, a sessão da pessoa
troca para a branch `<id>` antes de chamar o subagente. A trilha trivial não tem plano: só recebe os critérios de revisão C.

Roda no subagente `sa-revisor`, sem o contexto de quem escreveu: julgue os arquivos e ignore as justificativas
(mensagem de commit, texto do pedido). Você só lê: não grava arquivo, não roda a suíte e não faz commit. O relatório
volta a quem chamou, que tria e grava.

Aceita: fatia ou bug `em-andamento`, com a branch `<id>` que tem o plano (critérios de revisão L) ou diff contra `origin/<branch_base>`
(critérios de revisão C). No autopilot, a branch está na worktree `.sabia/local/wt/<id>`.

## Entrada: vizinhos

- fatia ou bug sem plano na branch `<id>` (critérios de revisão L) → nada a revisar: o plano é da `sa-plano.plano` (agente `sa-desenvolvedor`)
- fatia ou bug sem diff contra `origin/<branch_base>` (critérios de revisão C) → nada a revisar: o código é da `sa-desenvolver.codificar` (agente `sa-desenvolvedor`)
- épico ou item de Sustentação → nada a revisar: só fatia e bug têm plano e código ■

## Regras

- Achado sem evidência não entra.
- A correção é a menor mudança que fecha o achado; não proponha reescrever o que funciona.
- Problema real fora do escopo da fatia vira SUGESTÃO com destino `adia`.
- Só o BLOQUEANTE reprova. Os outros achados a pessoa tria (corrige · adia · volta-plano · volta-spec · descarta).
- Banco só pelo MCP de consulta, em leitura.
