---
{"resumo": "PRD do épico (prd.md): problema, solução, atores, índice dos artefatos do ELM, decisões de implementação e de teste, não funcionais, fora de escopo e em aberto (passo escrever da sa-prd)."}
---
---
id: EP-<nn>
titulo: <título curto, linguagem do negócio>
po: <login do P.O.>
demanda: <id da demanda/épico no EWM | —>
atualizado: <AAAA-MM-DD>
---

# PRD — EP-<nn> <título>

> O quê e por quê, na linguagem do negócio. O **como** técnico fica no plano de cada fatia (`design.md`).
> Decisões: `decisoes.md` (nesta pasta) · Glossário e ADRs: caminhos no `.sabia/sabia.md`

## Problema

<O problema do ponto de vista de quem sofre com ele: quem, quando, quanto custa hoje. 3–6 linhas.>

## Solução

<A solução do ponto de vista do usuário: o que passa a ser possível. Sem tecnologia. 3–6 linhas.>

## Atores

| Ator | Quem é | Como interage |
|---|---|---|
| <Operador do faturamento> | <perfil> | <tela X · API · agendamento · arquivo do parceiro> |

## Histórias, regras e termos (artefatos do ELM)

<!-- Cada história (HF), regra (REG), termo novo (GL), leiaute (EL), ET e caso de teste planejado (CT) é um conceito OKF
     v0.2 próprio em elm/ (formato em okf-elm.md da skill sa-prd): é o que sobe ao ELM depois do GATE (o CT, ao ETM).
     Aqui fica só o índice. Cenários são os critérios de aceite: cada um é verificável e tem o seu CT. -->

| Artefato | Arquivo | Resumo | No ELM |
|---|---|---|---|
| HF-01 | [HF - <nome>](elm/HF-01-<slug>.md) | <description> | novo (verificado <AAAA-MM-DD>) \| altera <id> |
| HF-02 | [HF - <nome>](elm/HF-02-<slug>.md) | <description> | novo (verificado <AAAA-MM-DD>) |
| REG-01 | — (existente no ELM) | <description> | reusa <id> |
| GL | [<termo>](elm/GL-<termo>.md) | <definição curta> | novo (verificado <AAAA-MM-DD>) |
| EL-01 | [EL - <tela>](elm/EL-01-<slug>.md) | <description> — só com a linha Telas = `sim` | novo (verificado <AAAA-MM-DD>) |
| ET | [ET - EP-<nn> <título>](elm/ET-<slug>.md) | <description> — só com a linha ET = `inicial no PRD + as-built` | novo (verificado <AAAA-MM-DD>) |
| CT-01 | [CT01 - <título do cenário>](elm/CT-01-<slug>.md) | <objetivo> (HF-01 · cenário 1.2) | novo (verificado <AAAA-MM-DD>) |

## Decisões de implementação

<!-- Estilo Pocock: módulos, interfaces e contratos — sem caminho de arquivo nem código (eles envelhecem rápido).
     Só o que precisa de acordo antes de fatiar. -->

- **Módulos afetados:** <módulo e o que muda nele; módulo novo e sua interface pública>
- **Contratos:** <API, arquivo, mensagem — formato e versão>
- **Dados:** <entidades/tabelas novas ou alteradas — a DDL é do time de banco>
- **Integrações:** <sistema, sentido, frequência>

## Decisões de teste

- **Pontos de teste (seams):** <onde os testes entram — o mais alto possível; ex.: "a API `POST /login`" e
  "o módulo de bloqueio, pela interface pública">
- **O que é um bom teste aqui:** <comportamento externo, sem mock de detalhe interno, sem recalcular o esperado
  do jeito que o código calcula>
- **Precedente no código:** <testes vizinhos que servem de modelo>

## Não funcionais

| Tema | Requisito |
|---|---|
| Volume | <ordem de grandeza> |
| Desempenho | <tempo máximo, janela de execução> |
| Segurança e auditoria | <quem pode, o que é registrado> |

## Fora de escopo

- <o que fica explicitamente de fora — evita fatias que crescem sozinhas>

## Em aberto

<!-- Decisões "em aberto" do decisoes.md. Uma que muda comportamento impede a aprovação (GATE PRD). -->

| D | Tema | Bloqueia? |
|---|---|---|

---
Artefato produzido com apoio de IA generativa — fluxo Sabiá · Versão <x.y> · <AAAA-MM-DD>
