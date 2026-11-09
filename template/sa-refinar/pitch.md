---
{"resumo": "Pitch do épico (Shape Up), uma página: Aprovado no topo, problema, limite de investimento, esboço da solução, riscos, fora do escopo, Decisões, Em aberto e a decisão de investimento."}
---
# Pitch — `.sabia/planejamento/epicos/EP-<nn>-<slug>/pitch.md`

Uma página, escrita na moldagem do épico, direto na branch base. A pasta do épico nasce com ele, e o `prd.md` nasce ao investir.
Ao cancelar, a pasta fica.

## Formato

```markdown
# EP-04 · Renegociação de dívidas pelo app

**Aprovado:** —

## Problema
Clientes com parcelas atrasadas ligam para a central para renegociar: 3.000 ligações por mês, 12 minutos cada.

## Limite de investimento
6 semanas

## Esboço da solução
- Simulação de renegociação no app, com as condições vigentes.
- Aceite com assinatura digital.
- Aviso à cobrança quando o acordo é fechado.

## Riscos
- Integração com a assinatura digital ainda não usada neste produto.

## Fora do escopo
- Renegociação de contratos de empresa.

## Decisões
| D-nn | Decisão | Por quê | Quem | Quando | Fonte |
|---|---|---|---|---|---|
| D-01 | Só contratos de pessoa física | <por quê, numa frase \| —> | ana.souza (P.O.) | 2026-10-20 | conversa |

## Em aberto
| Pergunta | Para quem | Bloqueia |
|---|---|---|
| Desconto máximo na renegociação? | ana.souza | investir |

## Decisão
```

## Campos

| Campo | Valores | Quem preenche |
|---|---|---|
| Aprovado | `<usuario> · AAAA-MM-DD` de quem tem `produto`, gravado com a Decisão · `—` | `sa-refinar.moldar` |
| Problema | quem sofre, quando e quanto custa hoje | `sa-refinar.moldar` |
| Limite de investimento | `<n> semanas`: o tempo que se aceita investir | `sa-refinar.moldar` |
| Esboço da solução | lista dos elementos da solução, sem detalhe | `sa-refinar.moldar` |
| Riscos | lista dos buracos de coelho conhecidos | `sa-refinar.moldar` |
| Fora do escopo | lista do que fica fora | `sa-refinar.moldar` |
| Decisões | tabela `D-nn \| Decisão \| Quem \| Quando \| Fonte`; `D-nn` sequencial (continua no `prd.md`); Quem = `<nome> (<papel>)` ou `suposição`; Quando = AAAA-MM-DD; Fonte ∈ `conversa` · `ATA-nn` · `e-mail` · `protótipo v<N>` | `sa-refinar.moldar` · `sa-entrevistar.entrevistar` · `sa-especificar.reuniao` · `sa-especificar.prototipo` |
| Em aberto | tabela `Pergunta \| Para quem \| Bloqueia`, com Bloqueia ∈ `investir` · `<sigla>-<id>` · `nada` (inclui `aprovação do cliente da v<N>`) | `sa-refinar.moldar` · `sa-especificar.prototipo` |
| Decisão | `Decisão: investir` · `Decisão: cancelar · <motivo>`; vazia até a decisão de investimento | `sa-refinar.moldar` |
