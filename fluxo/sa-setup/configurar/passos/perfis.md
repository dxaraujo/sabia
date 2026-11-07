---
{"resumo": "Mostra o cartão dos 5 agentes fixos; a pessoa só marca os extras por agente."}
---
## Entrada

O inventário do passo `toolkits` e a tool de banco do passo `banco`.

## Faça

Um cartão por agente (W6), nesta ordem, com o que vem do `perfis.json`:

| Agente | Modo | Skills |
|---|---|---|
| `sa-desenvolvedor` | primário | `sa-desenvolver`, `sa-plano`, `sa-revisar.mr`, `sa-verificar.uat`, `sa-atender` e a `sa-especificar.archive` que a `sa-desenvolver.encerrar` chama |
| `sa-especificador` | primário | `sa-refinar`, `sa-prd`, `sa-especificar`, `sa-entrevistar`, `sa-planejamento` (inclui as funções de produto) |
| `sa-pesquisador` | subagente | `sa-pesquisar` |
| `sa-revisor` | subagente | `sa-revisar.revisar`, com as rubricas do toolkit |
| `sa-verificador` | subagente | `sa-verificar.verificar`, com o texto `verificacao` do toolkit |

Nos dois primários: `sa-triar`, `sa-status`, `sabia` e as ofertas da `sa-elm`. A `sa-setup` e a `sa-elm.setup` ficam
na sessão padrão. A pessoa só marca os extras por agente: skills de toolkit, a tool de banco e os agentes do projeto
(como subagentes), que vêm desmarcados e com o "para quê". O modelo é o padrão da ferramenta; a pessoa troca se
quiser.

## Saída

Os 5 cartões com o "ok" → passo `regras-perfis`.

## Pare se

- Nunca tire uma skill fixa do agente: ela é do perfil, não do projeto.
