---
{"resumo": "Lê o PRD e o decisoes.md, relê o código e monta a tabela de fatias pelos critérios de boa fatia, com cobertura completa, uma fatia ponta a ponta e os artefatos afetados de cada uma, do PRD."}
---
## Entrada

O `prd.md`, a `elm/` aprovada e o `decisoes.md` do épico, na base.

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

1. Leia o `prd.md`, todos os conceitos de `elm/` do épico (os cenários estão nas HF; as citações, nos links de cada
   conceito) e o `decisoes.md` do épico. Releia o código dos módulos existentes que as fatias tocam pelo subagente
   `sa-pesquisador` (fluxo `sa-pesquisar.pesquisar`). Passe a ele o `prd.md`, os conceitos de `elm/` do épico e a
   lista provisória das fatias, com três perguntas: onde entra o gatilho do PRD, que módulos cada fatia toca e que
   código compartilhado precisa mudar antes. Ele devolve os fatos na resposta e nada é gravado (sem `research.md` nem
   `status.md`). Sem o subagente na sessão, leia você mesmo, com as mesmas perguntas: a fatia tem de ser possível no
   código real.
2. Monte a lista:

```
| FT | Título (comportamento, linguagem do negócio) | Cobre | Bloqueada por | Tam. | Modo |
|---|---|---|---|---|---|
| FT-031 | Bloquear a conta após 3 tentativas inválidas | HF-01 · 1.1, 1.2 · REG-01 | — | M | AFK |
| FT-032 | Desbloquear automaticamente após 30 min | HF-01 · 1.3 · REG-02 | FT-031 | P | AFK |
| FT-033 | Avisar o usuário do bloqueio por e-mail | HF-02 · 2.1–2.3 | FT-031 | M | HITL (texto do e-mail) |
```

   O motivo do `HITL` aparece só no rascunho e no GATE; no `backlog.md` e na ficha, o modo é só `AFK` ou `HITL`.
3. Confira a **cobertura**: todo cenário de todas as histórias do PRD aparece em exatamente uma fatia (cenário
   compartilhado → a primeira que o entrega). Cenário sem fatia ou fatia sem cenário → corrija antes de mostrar.
4. Confira o **ponta a ponta**: ao menos uma fatia (a primeira) atravessa do gatilho do PRD (agendamento, chamada,
   tela, arquivo de entrada) até a saída que o ator observa (arquivo, resposta, tela, registro). Cobertura completa
   com fatias que só entregam peças internas (classificador, DAO, regra isolada) **não** passa: falta a fatia que
   liga as peças ao gatilho — acrescente-a (ou engrosse a primeira) antes de mostrar.
5. Monte os **artefatos afetados** de cada fatia, do PRD: entram os conceitos HF, REG, GL, EL e CT com No ELM
   `novo (verificado …)` → ação `inclui`, `altera <id>` → `altera` e `exclui <id>` → `exclui`; `reusa` e a ET não
   entram (a ET é do Dev, as-built). HF e REG vão na fatia que os cobre; o CT, na fatia que cobre o cenário que ele
   testa (o Resumo do PRD diz `HF-nn · cenário c.c`); GL e EL, na primeira fatia cuja HF ou REG os cita (links do
   conceito), e, se nenhuma cita, na primeira fatia; o `exclui`, na fatia que o substitui (nenhuma o substitui → a
   primeira). Todo conceito desses em ao menos uma fatia; faltando → corrija antes de mostrar. Cada `altera` ou
   `exclui <id>` já na seção Artefatos afetados de outra fatia não terminal
   (`git grep -n '<id>' -- '<produto>/fatias/'` + o `status` no `backlog.md`, como no passo `sa-triar.triar.triagem`)
   → a coluna Bloqueada por recebe a `FT-<mmm>`.

## Saída

A tabela de fatias com cobertura completa, a fatia ponta a ponta e os artefatos afetados → passo `perguntar`.

## Pare se

Nenhuma condição própria deste passo: cobertura, ponta a ponta ou artefato sem fatia se corrigem antes de mostrar
(itens 3 a 5).
