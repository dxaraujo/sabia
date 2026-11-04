---
{"resumo": "Propõe a causa (tabela de causas e a correção na fonte); a pessoa confirma."}
---
## Entrada

Os fatos (passo `fatos`).

## Faça

**Causa** (proponha; a pessoa confirma):

| Causa | Quando | Correção na fonte |
|---|---|---|
| `contexto-ausente` | a informação não existia em steering, PRD, glossário ou skill | escrever onde ela deve morar |
| `contexto-ignorado` | existia e o agente não seguiu | se é mecânico: checagem determinística; senão regra em Regras aprendidas |
| `prd-incompleto` | faltava regra/cenário no PRD | a regra ou o cenário que falta pela `[ESP] FT` da fatia (`sa-especificar.fatia`; PRD aprovado e não fatiado: `sa-prd.mudanca`) |
| `plano-errado` | estava no PRD e não foi para o plano | regra R-nn em Regras aprendidas (aplica a: plano) |
| `revisao-branda` | a revisão viu e não reprovou (ou não viu) | regra R-nn em Regras aprendidas (aplica a: revisor) com a severidade certa — as rubricas ficam no power e não são editadas no projeto |
| `skill-desatualizada` | a skill do toolkit ensinou o jeito errado | corrigir a skill do toolkit (avisar quem mantém) |
| `ambiente` | build, dado ou serviço de teste | registrar; não vira regra |

## Saída

A causa confirmada pela pessoa → passo `gravar`.

## Pare se

Sem condição de parada própria: a causa é proposta, e a pessoa confirma.
