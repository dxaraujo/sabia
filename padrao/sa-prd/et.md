---
{"resumo": "Corpo da especificação técnica (ET): visão, interfaces e contratos, dados, integrações e decisões técnicas, com a origem de cada item; inicial (do PRD) ou as-built (do código da fatia), ligadas (o envelope OKF fica no okf-elm.md da sa-prd)."}
---
# Especificação técnica (ET)

**Especificação técnica (ET)** — o **como** técnico, no nível de contrato. Duas formas, pela linha ET da seção ELM do
`sabia.md`:
- **inicial** (`inicial no PRD + as-built`): uma por épico, no lote do PRD (`sa-prd.prd.escrever`), escrita das
  Decisões de implementação do `prd.md`, das `D-nn` e das fontes; descreve o que se propõe. Título `ET - EP-<nn> <título>`.
- **as-built** (`só as-built` ou `inicial no PRD + as-built`): uma por fatia, no PR (`sa-codificar.codificar.pr`),
  escrita do `design.md` e do diff; descreve só o que foi feito. Título `ET - FT-<nnn> <título>`. Fatia de épico com
  ET inicial → liga-se a ela no **Elabora** (vira link no ELM); fatia sem épico → sem ligação.

```markdown
**Escopo:** <EP-<nn> — o que o épico muda no sistema | FT-<nnn> — o que a fatia entregou> · **Atende:** [HF-01 <nome>](HF-01-<slug>.md), … ·
**Elabora:** <as-built de fatia de épico: [ET - EP-<nn> <título>](<caminho relativo da ET inicial>) | —>

## Visão
<módulos afetados e a responsabilidade de cada um; módulo novo e a interface pública dele. 3–8 linhas.>

## Interfaces e contratos
| Contrato | Tipo | Formato e versão | Origem |
|---|---|---|---|
| <`POST /contas/{id}/bloqueio`> | <API · arquivo · mensagem · job> | <campos, códigos de resposta, layout> | <D-nn · PRD · id do ELM · fonte> |

## Dados
| Entidade · tabela | Campo | O que muda | Origem |
|---|---|---|---|
| <CONTA> | <SITUACAO> | <novo valor `BLOQUEADA`> | <D-nn> |

<!-- A DDL é do time de banco: aqui fica o que muda, não o script. -->

## Integrações
- <sistema · sentido · frequência · contrato acima>

## Decisões técnicas
- <decisão> — <motivo> (<D-nn | ADR `adr/<arquivo>` (as-built)>)

## Relações
- <restringe / satisfaz, com link — só local>
```

- A P9 não vale na ET: nomes técnicos (módulo, classe, contrato, tabela, campo, endpoint, job) na forma original.
- Todo item cita a origem; sem fonte e sem decisão de uma pessoa, não entra (P5).
- Seção sem conteúdo → `não se aplica` (não apague a seção).
