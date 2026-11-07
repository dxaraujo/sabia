---
{"resumo": "PRD do épico (prd.md): Aprovado no topo, Problema, Objetivos e métricas, Atores, Requisitos (um bloco por requisito com Tipo e Ação), Não objetivos, Decisões, Em aberto e Mudanças, com o checklist do validar."}
---
```markdown
# PRD — EP-<nn> <título>
**Aprovado:** <usuario> · <AAAA-MM-DD> | —

## Problema

<O problema na visão de quem sofre: quem, quando, quanto custa hoje. 3–6 linhas, do pitch.md.>

## Objetivos e métricas

- <objetivo> · <métrica: como se mede>

## Atores

| Ator | Quem é | Como interage |
|---|---|---|
| <Operador do faturamento> | <perfil> | <tela · API · agendamento · arquivo> |

## Requisitos

### <sigla>-<id> · <título>
**Tipo:** HF | REG | EL | GL · **Ação:** inclui | altera | exclui

<corpo pelo padrão do tipo>

## Não objetivos

- <o que fica fora do épico>

## Decisões

| D-nn | Decisão | Quem | Quando | Fonte |
|---|---|---|---|---|
| D-04 | <decisão> | <nome> (<papel>) \| suposição | <AAAA-MM-DD> | conversa \| ATA-nn \| e-mail \| protótipo v<N> |

## Em aberto

| Pergunta | Para quem | Bloqueia |
|---|---|---|
| <pergunta> | <nome (papel)> | <sigla>-<id> \| FT-nnn \| nada |

## Mudanças

| Versão | Data | O que mudou | Origem |
|---|---|---|---|
| v1 | <AAAA-MM-DD> | primeira versão | pedido |
```

- **Aprovado:** de quem tem `produto`, logo abaixo do título. Mudança depois da aprovação tira a linha (volta a `—`),
  ganha uma linha em Mudanças e pede a aprovação de novo.
- **Id do requisito:** existente = `<sigla>-<id do ELM>` (sem ELM, o id da spec viva); novo = provisório
  `<sigla>-EP<nn>-<nn>` (ex.: `REG-EP03-01`), trocado pelo id do ELM na publicação da fatia. O id nunca é
  reaproveitado; o que sai fica com Ação exclui.
- **Requisito só citado** (o existente que não muda) vai no texto pelo id, sem bloco.
- **Decisões** continuam a numeração D-nn do `pitch.md`.
- **Mudanças:** Versão = `v<N>`; Origem ∈ pedido · `ATA-nn` · `protótipo v<N>` · `FT-nnn`. A aprovação de cada versão
  é a linha Aprovado do topo.
- Sem caminho de arquivo, classe nem SQL. Seção sem conteúdo fica só com o título.

## Checklist

- [ ] Todas as seções presentes; Problema, Objetivos e métricas, Atores e Requisitos preenchidos.
- [ ] Todo requisito com id, Tipo e Ação.
- [ ] Nenhuma regra, valor ou ator sem fonte (D-nn, ATA, requisito vigente ou código).
- [ ] Todo Em aberto com Para quem e Bloqueia.
- [ ] EL só com Telas = `sim` e com o protótipo aprovado (D-nn `Protótipo v<N> aprovado`).
