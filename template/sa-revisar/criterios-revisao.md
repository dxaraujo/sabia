---
{"resumo": "Critérios de revisão L (plano da fatia) e C (código, eixos spec · padrões · segurança), com severidades, destinos, fechos e o formato do relatório."}
---
# Critérios de revisão de revisão do Sabiá

Cada item tem severidade. Só o **BLOQUEANTE** reprova. **IMPORTANTE** e **SUGESTÃO** não reprovam: a pessoa tria
cada um. Todo achado tem **evidência** (`arquivo:linha`, comando com a saída ou "procurado em X, não encontrado"), a
**correção** esperada e o **destino** sugerido. Achado sem evidência não é achado.

As Regras aprendidas do `.sabia/sabia.md` valem como itens extras dos critérios de revisão a que se referem. Os itens de critério de revisão de
um toolkit (no prompt do revisor e na seção Tipos com skill de toolkit do `sabia.md`) também só se somam: nenhum
troca, afrouxa ou dispensa um item daqui.

Item que não se aplica à trilha (a trivial não tem plano; a rápida do OpenSpec não tem `design.md`) fica `N/A`.

## Destinos

| Destino | Quando |
|---|---|
| corrige | o autor corrige nesta fatia |
| adia | problema real fora do escopo da fatia: vira item novo pelo cadastro comum |
| volta-plano | o plano não serve mais: `sa-plano.replanejar` |
| volta-spec | o comportamento diverge da spec ou a spec parece errada: decide o especificador |
| descarta | não procede; o motivo fica registrado |

## L — Plano da fatia

Entrada: a pasta da spec (Kiro: `requirements.md` ou `bugfix.md`, `design.md`, `tasks.md`; OpenSpec: `proposal.md`,
o delta, `tasks.md` e, no completo, `design.md`), `research.md`, a ficha, o `prd.md` do épico e, com ELM, os
arquivos aprovados de `elm/`.

| # | Verificação | Severidade |
|---|---|---|
| L1 | Todo cenário CT-nn da ficha tem critério de aceite na spec, com o mesmo CT-nn, e nenhum critério sai da ficha. Todo valor visível ao usuário no "Então" (texto, rótulo, mensagem, formato) aparece igual, palavra por palavra. No bug, o `bugfix.md` (ou o delta MODIFIED) tem o atual com evidência, o esperado com fonte e o Não muda da ficha | BLOQUEANTE |
| L2 | O delta traz o texto completo de cada requisito dos artefatos afetados (OpenSpec: ADDED para inclui, MODIFIED para altera, REMOVED para exclui; Kiro: o bloco completo de cada requisito), copiado do texto aprovado da ficha, do `prd.md` ou de `elm/`, sem reescrita | BLOQUEANTE |
| L3 | Todo critério tem ao menos uma tarefa no `tasks.md`; o bug começa pelo teste que reproduz o defeito e pelos testes do Não muda | BLOQUEANTE |
| L4 | Os caminhos, classes e análogos citados existem, ou estão marcados "a criar" | BLOQUEANTE |
| L5 | Nenhuma regra de negócio sem fonte (Regras e Decisões da ficha, `prd.md`, `elm/` aprovado). Expectativa de teste existente que muda está listada no plano com a decisão de uma pessoa | BLOQUEANTE |
| L6 | O design segue o Projeto e as Regras aprendidas do `sabia.md` e o steering de tecnologia e estrutura | BLOQUEANTE |
| L7 | Reexecução segura, transação e concorrência tratadas quando há escrita | BLOQUEANTE |
| L8 | TDD: cada comportamento começa por um teste que falha, ligado ao CT-nn do cenário | IMPORTANTE |
| L9 | Tarefas pequenas, na ordem de dependência, cada uma com o comando que prova que terminou | IMPORTANTE |
| L10 | Todo componente do design aparece em alguma tarefa, e vice-versa | IMPORTANTE |
| L11 | Nada fora do escopo da fatia; refatoração preparatória só no trecho tocado e como tarefa do plano | IMPORTANTE |
| L12 | `research.md` com fatos e `arquivo:linha`, sem opinião; o plano não contradiz os fatos | SUGESTÃO |

Origem de cada achado: `plano` (quem desenvolve corrige), `ficha` ou `PRD` (cenário ausente, regra contraditória:
destino `volta-spec`).

Fecho: `ANALISE: OK` ou `ANALISE: AJUSTAR` (algum BLOQUEANTE).

## C — Código da fatia

Entrada: o diff contra `origin/<branch_base>`, a pasta da spec, a ficha e, com o MR aberto, os campos dele. Três eixos,
avaliados em separado e relatados em tabelas próprias: um não compensa nem esconde o outro.

**Eixo spec** — o diff faz o que a fatia promete, e só isso:

| # | Verificação | Severidade |
|---|---|---|
| C1 | Cada critério da spec (na trivial, cada cenário da ficha) tem implementação (`critério → arquivo:linha`) | BLOQUEANTE |
| C2 | Cada cenário CT-nn tem teste automatizado que o exercita, com o esperado igual ao "Então"; com `CT no teste = sim` no `acordos.md`, o teste traz a marca `<FT-nnn> CT-nn` | BLOQUEANTE |
| C3 | CI verde no último commit da branch, sem teste verde no baseline (último pipeline da branch base) que ficou vermelho. Fonte: MCP do Jenkins, a saída do validar de quem chamou ou o resultado informado pela pessoa; nunca "os testes passaram" sem a saída | BLOQUEANTE |
| C4 | Oráculo protegido: nenhum teste removido, desabilitado, ignorado, com assert vazio, enfraquecido ou tautológico; nenhuma exceção engolida. Expectativa de teste existente alterada só com a decisão registrada no plano | BLOQUEANTE |
| C5 | Reexecução segura: rodar de novo não duplica nem corrompe (chave, situação gravada, transação) | BLOQUEANTE |
| C6 | As tarefas `[x]` do `tasks.md` têm código no diff | BLOQUEANTE |
| C7 | Os artefatos afetados do MR é o da ficha, e o diff não muda comportamento de requisito fora dele (diverge: destino `volta-spec`) | IMPORTANTE |
| C8 | Escopo: nada além da fatia (funcionalidade não pedida, arquivo fora do design, refatoração oportunista) | IMPORTANTE |
| C20 | Onde há `CT.csv` (rápida e completo, no MR), ele segue o padrão do CT em vigor (o do Sabiá, ou o do toolkit que desvia o CT): uma linha por cenário ✅, os blocos da Descrição na ordem e o RESULTADO ESPERADO igual ao "Então" | IMPORTANTE |

**Eixo padrões** — o diff deixa o código pior para quem vem depois?

| # | Verificação | Severidade |
|---|---|---|
| C9 | Projeto e Regras aprendidas do `sabia.md` e steering de tecnologia e estrutura | BLOQUEANTE |
| C10 | Modelo e entidade batem com o schema real (MCP de banco, em leitura; sem o MCP, `N/A`). DDL nova tem o item BD citado no Risco do MR | BLOQUEANTE |
| C11 | Segue o análogo e a forma do design; nada de padrão novo sem decisão registrada. Decisão que atravessa fatias (banco, framework, padrão de integração) tem ADR no MR | IMPORTANTE |
| C12 | Nomes do domínio = termos do glossário (GL ou `glossario.md`); nomes técnicos no template dos vizinhos | IMPORTANTE |
| C13 | Módulos profundos: interface pequena para o que esconde; sem abstração especulativa, camada a mais ou duplicação evitável | IMPORTANTE |
| C14 | Sem `TODO`, `FIXME`, print ou log de depuração e código comentado; registros obrigatórios da estrutura (trilhas, menus, agendamentos, migrações) presentes | IMPORTANTE |
| C15 | Onde o projeto mantém ET (`ET as-built: sim` na seção ELM do `sabia.md`), as seções as-built do `design.md` descrevem o que o diff faz, e nada além | IMPORTANTE |

**Eixo segurança** — o diff abre risco?

| # | Verificação | Severidade |
|---|---|---|
| C16 | Sem segredo no código, em configuração versionada, em teste ou em log | BLOQUEANTE |
| C17 | Sem injeção (SQL, comando, HTML, caminho); a entrada externa é validada na borda | BLOQUEANTE |
| C18 | Dado pessoal ou sensível protegido: fora de log e de resposta indevida, sem dado real em teste; autorização conferida em cada operação nova | BLOQUEANTE |
| C19 | Dependência nova com versão fixa e origem conhecida | IMPORTANTE |

Calibragem: seja cético (o autor tende a achar que terminou), mas aponte só o que afeta correção, requisito,
segurança ou manutenção real. Gosto pessoal é SUGESTÃO, quando muito.

C3 falhando por ambiente (serviço fora do ar, credencial, dependência externa) → `AMBIENTE`, não conta como
achado; diga o que falhou. Sem o C3, a revisão não aprova.

Origem de cada achado: `código` ou `ambiente`.

Fecho: `VEREDITO: APROVADO`, `VEREDITO: REVISAR` (algum BLOQUEANTE) ou `VEREDITO: AMBIENTE` (C3 sem rodar por
ambiente, sem BLOQUEANTE).

## Formato do relatório

```markdown
# Revisão <L | C> — FT-<nnn>

## Resumo
<1–2 frases: o que foi revisado e a impressão geral>

## Achados
<!-- Critérios de revisão C: uma tabela por eixo (spec, padrões, segurança). -->
| # | Severidade | Achado | Evidência | Correção | Origem | Destino |
|---|---|---|---|---|---|---|

## Verificações
| # | Resultado (✅ ❌ N/A AMBIENTE) | Observação |
|---|---|---|

<última linha: ANALISE: OK | ANALISE: AJUSTAR | VEREDITO: APROVADO | VEREDITO: REVISAR | VEREDITO: AMBIENTE>
```

A **última linha** é exatamente um dos fechos: quem chamou lê só ela para decidir.
