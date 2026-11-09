---
{"resumo": "Modelos do plano da fatia pela matriz trilha × formato: .config.kiro, proposal.md, delta OpenSpec, requirements.md, bugfix.md, design.md e tasks.md."}
---
# Plano da fatia — modelos por formato

A pasta da spec é `.kiro/specs/ft-<nnn>-<slug>/` (Kiro) ou `openspec/changes/ft-<nnn>-<slug>/` (OpenSpec), pelo
`formato_spec` do `agentes.json`. O texto é no idioma do projeto; os títulos que a ferramenta valida ficam
exatamente como abaixo (em inglês, no Kiro e no OpenSpec). Seção fixa sem conteúdo leva `Não se aplica.`, nunca
conteúdo inventado. Plano curto: quem aprova lê tudo numa sentada.

## Matriz trilha × formato

| Trilha | Kiro | OpenSpec |
|---|---|---|
| trivial | sem pasta: tudo no MR | sem pasta: tudo no MR |
| rápida fatia | Quick Spec: `requirements.md`, `design.md`, `tasks.md` numa passada, sem portões | `proposal.md`, `specs/<cap>/spec.md`, `tasks.md` |
| rápida bug | Bugfix Spec: `bugfix.md`, `design.md`, `tasks.md` | `proposal.md`, delta MODIFIED, `tasks.md` |
| completo | `requirements.md` → `design.md` → `tasks.md`, com "quer revisar agora?" em cada parte | `proposal.md`, delta, `design.md`, `tasks.md` |

Rápida e completo têm também `research.md`, `status.md` e `CT.csv`; o Kiro tem `.config.kiro`; com ELM e artefatos afetados,
`elm/`. Artefatos afetados com inclui, altera ou exclui exigem rápida ou completo.

## `.config.kiro` (Kiro)

Uma linha de JSON, criada pela `sa-desenvolver.iniciar.pasta`:

```json
{"specId": "<uuid v4>", "workflowType": "requirements-first", "specType": "feature"}
```

`specType`: `feature` (fatia) ou `bugfix` (bug). `specId`: um UUID novo (`uuidgen`, em minúsculas).

## `proposal.md` (OpenSpec)

```markdown
**Fatia:** [FT-<nnn>](<caminho da ficha>) · **Trilha:** <rapida | completo>

## Why
<motivo, a partir da Entrada e do Objetivo da ficha>

## What Changes
- <o que muda>
<!-- no bug: Atual · Esperado · Não muda -->

## Capabilities
### New Capabilities
- `<cap>`: <o que ela cobre>
### Modified Capabilities
- `<cap>`: <o que muda nela>

## Impact
- <código, APIs e dados afetados>
```

Na rápida, que não tem `design.md`, as Decisões técnicas vão numa seção `## Decisões técnicas` no fim.

## Delta OpenSpec — `specs/<cap>/spec.md`

```markdown
## ADDED Requirements

### Requirement: <sigla>-<id> <título>
<texto completo do requisito, copiado do aprovado>
<!-- versão de referência: <data-hora ISO do DOORS | —> -->

#### Scenario: CT-nn <título>
- **WHEN** <gatilho>
- **THEN** <resultado visível>

## MODIFIED Requirements

### Requirement: <sigla>-<id> <título>
<o texto inteiro novo, não só o trecho que muda>

## REMOVED Requirements

### Requirement: <sigla>-<id> <título>
**Reason**: <por que sai>
**Migration**: <o que fazer com o que dependia dele>
```

- Operação pela ação dos artefatos afetados: `ADDED` = inclui · `MODIFIED` = altera · `REMOVED` = exclui. `RENAMED` não se usa:
  renomear é altera.
- `<sigla>` ∈ HF · UC · REG · MSG · EL · GL; `<id>` = id do ELM, ou o provisório `<EP|FT>nn-nn` no requisito novo (sem ELM, o
  provisório é o definitivo).
- `<cap>` em kebab-case; um requisito vive numa só. Requisito existente na especificação vigente mantém a `<cap>` de lá; o novo
  usa o slug do épico pai, ou o da fatia sem pai.
- O texto é copiado, sem reescrever, do arquivo aprovado de `elm/` (com ELM) ou da especificação vigente com as regras
  aprovadas da ficha (sem ELM).

## `requirements.md` (Kiro, fatia)

```markdown
# Requirements Document

## Introduction
FT-<nnn> — <título>. <o comportamento que a fatia entrega, em 2–3 frases.> Ficha: `<caminho da ficha>`.

## Glossary
- **<Sistema_X>**: <o componente que responde pelos critérios>
<!-- só os termos usados aqui; nenhum → Não se aplica. -->

## Requirements

### Requirement 1: <sigla>-<id> <título>
**Ação:** <inclui | altera | exclui> · **Versão de referência:** <data-hora ISO | —>
**User Story:** Como <ator>, quero <…>, para <…>.
<!-- HF: a User Story; REG, EL, GL: o corpo do tipo, completo. Requisito sem DOORS: só o título. -->

#### Acceptance Criteria
1. QUANDO <gatilho>, ENTÃO o <Sistema_X> DEVE <resultado> (CT-01)
2. ENQUANTO <estado>, o <Sistema_X> DEVE <resultado> (CT-02)
3. SE <condição indesejada>, ENTÃO o <Sistema_X> DEVE <resultado> (CT-03)
```

Padrões EARS: `QUANDO … ENTÃO … DEVE` · `ENQUANTO … DEVE` · `SE … ENTÃO … DEVE` · `ONDE … DEVE`. Critérios
numerados `N.M`, cada um com o `CT-nn` que o evidência; o `tasks.md` cita `N.M`.

## `bugfix.md` (Kiro, bug na rápida)

```markdown
# Bugfix Requirements Document

## Introduction
FT-<nnn> — <título>. Ficha: `<caminho da ficha>`. Fonte do comportamento correto: <sigla>-<id> | D-nn | regra óbvia.

## Bug Analysis

### Current Behavior (Defect)
1.1 QUANDO <condição>, ENTÃO o sistema <faz o errado> — evidência: <log, consulta, passo a passo> (CT-01)

### Expected Behavior (Correct)
2.1 QUANDO <condição>, ENTÃO o sistema DEVE <o certo> (CT-01)

### Unchanged Behavior (Regression Prevention)
3.1 QUANDO <condição vizinha>, ENTÃO o sistema DEVE CONTINUAR A <comportamento de hoje> (CT-02)

### Bug Condition
    FUNÇÃO condicaoDoDefeito(entrada)
      RETORNA <predicado que separa as entradas afetadas>
    FIM

### Fix Property
Para toda entrada com `condicaoDoDefeito`, o resultado é o de 2.x.

### Preservation Property
Para toda entrada sem `condicaoDoDefeito`, o resultado é igual ao de antes da correção.

## Requisitos tocados

### <sigla>-<id> <título>
**Ação:** <altera | exclui>
<texto completo do requisito, copiado do aprovado>
```

Current, Expected e Unchanged vêm da Entrada e de Não muda da ficha. `## Requisitos tocados` só quando os artefatos afetados têm
requisito. As primeiras tarefas do bug são sempre o teste que reproduz o defeito e os testes de preservação.

## `design.md`

Kiro (completo e Quick Spec):

```markdown
# Design Document: FT-<nnn> <título>

## Overview
<abordagem em 3–6 linhas; no bug, a causa raiz com arquivo:linha do research.md>

## Architecture
<padrões a seguir (análogos do research.md) · árvore de arquivos (criar | alterar) · árvore de chamadas do caminho principal>

## Components and Interfaces
<assinaturas e contratos>

## Data Models
<tabelas e colunas reais, contratos de API ou arquivo; DDL necessária → item BD>

## Correctness Properties
### Property 1: <título>
*Para qualquer* <entrada válida>, <o que deve valer>.
**Validates: Requirements 1.1, 1.3**

## Error Handling
<o que é rejeitado, registrado, desfeito; transação; como repetir não duplica>

## Testing Strategy
- Pontos de teste: <o mais alto possível, pela interface pública>
- Critérios de pronto:

| Cenário | Como executar | Esperado | Onde verificar |
|---|---|---|---|
| CT-01 <título> | <chamada, tela ou job> | <o "Então" do cenário, com os mesmos valores visíveis> | <resposta · banco · log> |

## Decisões técnicas
- <decisão> — <motivo>; <consequência: o que fica mais fácil ou mais difícil> (<ADR NNNN | local>)

## Riscos
<concorrência, volume, dependências, DDL pendente>
```

OpenSpec (só completo):

```markdown
## Context
<estado atual, com arquivo:linha do research.md>

## Goals / Non-Goals
**Goals:** <…> · **Non-Goals:** <…>

## Decisions
- <decisão> — <motivo>; <consequência> (<ADR NNNN | local>)
<!-- contratos e dados; os critérios de pronto (Cenário CT-nn · Como executar · Esperado · Onde verificar) também aqui -->

## Risks / Trade-offs
- <risco> → <mitigação>
```

O Esperado dos critérios de pronto repete o "Então" do cenário palavra por palavra (texto, rótulo, mensagem); o valor
interno que o produz vai em Data Models. A decisão que atravessa fatias vira ADR no MR; a local fica aqui. Onde o
projeto mantém ET (`ET as-built: sim` na seção ELM do `sabia.md`), Components and Interfaces, Data Models e Decisões
técnicas (OpenSpec: Decisions) formam a ET publicada; a codificação os ajusta ao que foi feito antes do MR.

Onde o projeto mantém ET, a forma dessas seções é o padrão `requisitos/padrao-et.md`.

## `tasks.md`

Kiro:

````markdown
# Implementation Plan: FT-<nnn> <título>

## Overview
<1–2 linhas: ordem e estratégia (teste primeiro, do núcleo para a borda)>

## Tasks

- [ ] 1. <comportamento> (CT-01)
  - [ ] 1.1 Teste em `<Teste>`: <cenário> (vermelho)
  - [ ] 1.2 Implementar `<unidade>` imitando `<análogo>` (verde)
  - Pronto quando: `<comando de teste único>` verde
  - _Requirements: 1.1_
- [ ]* 2. <tarefa opcional>
  - Pronto quando: `<comando>` verde
  - _Requirements: 1.2_
- [ ] 3. Suíte completa (compilar, testes, lint, cobertura)

## Task Dependency Graph

```json
{"waves": [{"id": 0, "tasks": ["1.1"]}, {"id": 1, "tasks": ["1.2", "2"]}]}
```

## Notes
- <por que uma tarefa depende da outra, se não for óbvio>
````

OpenSpec:

```markdown
## 1. <grupo>
- [ ] 1.1 Teste: <cenário> (CT-01) — pronto: `<comando>`
- [ ] 1.2 <implementação> — pronto: `<comando>`

## 2. Validação
- [ ] 2.1 Suíte completa (compilar, testes, lint, cobertura)
```

- Uma tarefa = um comportamento, começando pelo teste que falha (no bug, o teste que reproduz o defeito).
- Toda tarefa diz o comando que prova que terminou e o `CT-nn` que ela cobre.
- Refatoração preparatória no trecho tocado entra como tarefa própria, antes da mudança, em commit separado.
- A última tarefa é a suíte completa.
- Achado aceito da revisão do agente ou do MR entra como tarefa `[R<n>]` (ex.: `- [ ] [R1] 4.1 <correção>`).
- Kiro: o bloco ```` ```json ```` com `waves` não vazio é obrigatório; toda tarefa folha não marcada aparece em
  exatamente uma wave, inclusive as opcionais `*`; ids de wave contíguos a partir de 0; dependente (ou que mexe no
  mesmo arquivo) vai numa wave posterior.
- DDL não vira tarefa: vai para Riscos e, pela captura, para um item BD.
