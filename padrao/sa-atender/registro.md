---
{"resumo": "Registro do item de Sustentação (AT-nnn e as demais categorias), em <produto>/sustentacao/<pasta>/<ID>-<slug>.md."}
---
`<produto>/sustentacao/<pasta>/<ID>-<slug>.md` (pasta da categoria na tabela **Sustentação** do `sabia.md`) — o mesmo formato para toda categoria; fora do Atendimento, `## Consultas`
e `## Resposta enviada` dão lugar a `## O que foi feito` (passos e evidência, sem dado de cliente).

```markdown
# AT-012 · Extração de contas bloqueadas em setembro

**Categoria:** Atendimento · **Origem:** chamado 4521 · **Pedido por:** área de segurança · **Prazo:** 2026-10-16
**Responsável:** joao.lima · **Situação:** aberto | em-andamento | concluido | cancelado
**Critério de pronto:** planilha com as contas bloqueadas por tentativas, por dia · **Estimativa:** 3 h

## Pedido
<o que o cliente precisa receber, nas palavras dele, sem dado pessoal>

## Consultas
| # | Consulta (SQL) | Resultado |
|---|---|---|
| 1 | `select count(*) from conta where situacao = 'B' and dt_bloqueio between …` | 1.284 contas |

Arquivo: `.sabia/local/sustentacao/atendimento/AT-012/contas-bloqueadas-2026-09.csv` (fora do git)

## Resposta enviada
<texto, sem dado que identifique pessoas>

## Horas
| Data | Horas |
|---|---|
| 2026-10-14 | 2 |

## Créditos
| Data | Papel | Login | Sessão Kiro | Power sabia | Créditos |
|---|---|---|---|---|---|
| 2026-10-14T16:20:05 | atendimento | joao.lima | 5753e516 | 2.0.0 | 3.12 |

**ELM:** feito | pendente: <o que falta>
**Saída:** — | FT-040 (defeito, pela triagem) | lição L-015
```
