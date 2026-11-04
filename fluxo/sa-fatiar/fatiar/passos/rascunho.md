---
{"resumo": "Lê o PRD e o decisoes.md, relê o código e monta a tabela de fatias pelos critérios de boa fatia, com cobertura completa, uma fatia ponta a ponta e os artefatos afetados de cada uma, do PRD."}
---
## Entrada

O PRD aprovado e o `decisoes.md` do épico, na base.

## Faça

### O que é uma boa fatia

- **Vertical (tracer bullet):** atravessa entrada → regra → dado → saída. "Criar a tabela", "fazer o DAO" ou
  "tela sem backend" **não** são fatias. A primeira fatia de um épico é a mais fina que prova o caminho inteiro
  (um cenário feliz, ponta a ponta); as seguintes engrossam.
- **Verificável sozinha:** tem cenários de aceite do PRD (`HF-01 · 1.1, 1.2`) que passam ao fim dela.
- **Cabe numa janela de contexto nova:** um agente pesquisa, planeja e implementa a fatia sem perder o fio, e uma
  pessoa revisa o PR numa sentada. Tamanho `P` (horas), `M` (≈ 1 dia), `G` (2–3 dias); maior que `G` → divida.
- **Nem fina demais:** doze fatias para uma mudança de três linhas é o erro mais comum. Teste de cada fatia:
  *"o que dá para demonstrar quando ela terminar?"* — se a resposta é "nada visível", junte com a vizinha.
- **Critério falsificável:** cada cenário coberto falha hoje, na base (diga a observação que mostra isso). Cenário
  que já passa não prova nada; cenário que só outra fatia consegue fazer passar está na fatia errada.
- **Preparação antes:** se a mudança exige mexer em código compartilhado, a primeira fatia deixa a mudança fácil
  (prefactoring) e a seguinte faz a mudança. Refatoração larga: expandir → migrar em lotes → contrair.
- **Independente quando der:** dependência só quando uma fatia precisa de algo que outra entrega (`bloqueada-por`).
- **Autonomia declarada:**
  - `AFK` — critérios claros, padrão conhecido no código, backpressure forte (testes e verificação automatizáveis),
    sem decisão de produto ou de UX no caminho: o agente pode ir do plano ao PR sem pessoa (a pessoa revisa o PR).
  - `HITL` — tem decisão de design, UX, integração nova, dado sensível ou risco alto: uma pessoa acompanha o plano e
    a implementação.
  - Tipo de trabalho novo no projeto começa `HITL`; vira `AFK` depois que fatias parecidas chegaram ao PR sem
    correção humana (a `sa-aprender` mostra isso na retrospectiva).
  - O modo do fatiamento é uma **proposta** para a fatia, que ainda não tem responsável. O modo final é gravado
    quando ela ganha responsável (seleção da sprint ou encaixe, na `sa-planejamento`), pela senioridade de quem
    implementa: Júnior → sempre `HITL`; Pleno → estes critérios; Sênior → `AFK` por padrão (`HITL` só com motivo
    forte, registrado).

### Rascunho

1. Leia o PRD inteiro e o `decisoes.md`. Releia o código das fatias que mexem
   em módulos existentes (subagente `sa-pesquisador`, se houver) — a fatia tem de ser possível no código real.
2. Monte a lista:

```
| FT | Título (comportamento, linguagem do negócio) | Cobre | Bloqueada por | Tam. | Modo |
|---|---|---|---|---|---|
| FT-031 | Bloquear a conta após 3 tentativas inválidas | HF-01 · 1.1, 1.2 · REG-01 | — | M | AFK |
| FT-032 | Desbloquear automaticamente após 30 min | HF-01 · 1.3 · REG-02 | FT-031 | P | AFK |
| FT-033 | Avisar o usuário do bloqueio por e-mail | HF-02 · 2.1–2.3 | FT-031 | M | HITL (texto do e-mail) |
```

3. Confira a **cobertura**: todo cenário de todas as histórias do PRD aparece em exatamente uma fatia (cenário
   compartilhado → a primeira que o entrega). Cenário sem fatia ou fatia sem cenário → corrija antes de mostrar.
4. Confira o **ponta a ponta**: ao menos uma fatia (a primeira) atravessa do gatilho do PRD (agendamento, chamada,
   tela, arquivo de entrada) até a saída que o ator observa (arquivo, resposta, tela, registro). Cobertura completa
   com fatias que só entregam peças internas (classificador, DAO, regra isolada) **não** passa: falta a fatia que
   liga as peças ao gatilho — acrescente-a (ou engrosse a primeira) antes de mostrar.
5. Monte os **artefatos afetados** de cada fatia, do PRD: cada conceito com No ELM `novo`, `altera` ou `exclui`
   (ação `inclui`, `altera`, `exclui`) vai na fatia que o entrega — a das HF e REG do Cobre, com os EL, GL e CT que
   elas citam; o `exclui`, na fatia que o substitui (nenhuma o substitui → a primeira). Todo conceito desses em ao
   menos uma fatia; faltando → corrija antes de mostrar. Cada `altera` ou `exclui <id>` já na seção Artefatos
   afetados de outra fatia não terminal (`git grep -n '<id>' -- '<produto>/fatias/'` + o `status` no `backlog.md`,
   como no passo `sa-triar.triar.triagem`) → a coluna Bloqueada por recebe a `FT-<mmm>`.

## Saída

A tabela de fatias com cobertura completa, a fatia ponta a ponta e os artefatos afetados → passo `perguntar`.

## Pare se

Nenhuma condição própria deste passo: cobertura, ponta a ponta ou artefato sem fatia se corrigem antes de mostrar
(itens 3 a 5).
