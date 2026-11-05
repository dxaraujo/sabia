# Revisão final 11.27 — relatório

Base: `sabia-2.0`, HEAD `aeba147` + as correções desta revisão, **sem commit**. Estado no fim: validação dos fluxos `[]` · `node --test cli/*.test.mjs` 49/49 · `test_gerar_agentes.py` 47 OK · as linhas acrescentadas pela pessoa (`usuario.patch`: README.md, plugin.json, papeis.json, sa-sync/SKILL.md, sabia/references/elm.md) continuam todas no disco.

## 1. Resumo em números

Recusados = falsos positivos descartados na verificação. Nenhuma correção sem decisão foi recusada na etapa de correção. Corrigidos inclui o que a integração aplicou a pedido de outra área.

| Área | Achados | Reais | Corrigidos | Recusados | Para decidir |
|---|---:|---:|---:|---:|---:|
| triagem | 32 | 30 | 18 | 2 | 12 |
| especificar | 48 | 45 | 24 | 3 | 21 |
| prd | 37 | 35 | 20 | 2 | 15 |
| fatiar | 38 | 37 | 28 | 1 | 9 |
| planejamento-fluxos | 35 | 31 | 15 | 4 | 16 |
| planejamento-refs | 40 | 38 | 25 | 2 | 13 |
| codificar (+ orquestrar) | 32 | 31 | 14 | 1 | 17 |
| dev (desenvolver + plano) | 46 | 43 | 28 | 3 | 14 |
| rev-ver | 36 | 35 | 21 | 1 | 14 |
| consolidar-elm | 37 | 35 | 24 | 2 | 11 |
| sustentacao-guias | 33 | 31 | 13 | 2 | 18 |
| setup-assets | 28 | 26 | 19 | 2 | 7 |
| setup-skill | 29 | 28 | 19 | 1 | 9 |
| nucleo | 22 | 20 | 15 | 2 | 5 |
| chamadas (transversal) | 2 | 2 | 1 | 0 | 1 |
| formatos (transversal) | 29 | 27 | 19 | 2 | 8 |
| **Total** | **524** | **494** | **303** | **30** | **190** |

- dev: 43 reais = 28 + 14 + **1 sem destino registrado** (um entre dev-23, 40, 42 e 46; os outros três são os recusados).
- As 190 perguntas viraram **131 decisões** (D1–D131) depois da deduplicação. **26 bloqueiam a 2.0.0** (⛔: há na origem um achado de gravidade alta, isto é, passo impossível, laço ou dado perdido).
- Além disso: o `chamadas.mjs` ficou com 0 quebras (5 corrigidas na integração).

## 2. O que foi corrigido

Uma linha por item: `id` · arquivo principal — o defeito que a correção fechou (resumo do achado). O texto completo de cada correção está em `resultados.json` e nos retornos das áreas.

### 2.1 Chamada (saída, chama, vizinho, link sem destino) — 43

- `triagem-07` · `fluxo/sa-triar/lote-ewm/passos/lote.md` — "`pa` sem backlog → §0 antes" manda o agente rodar o §0, que precisa do `elm_backlog`
- `especificar-01` · `fluxo/sa-especificar/especificar/passos/fechar-sessao.md` — O passo manda enviar os .md de elm/ 'com o prefixo elm-', mas elm_anexo não tem parâmetro de nome: o anexo…
- `especificar-08` · `fluxo/sa-especificar/reuniao/reuniao.md` — As saídas 'fatiado: …' (→ sa-especificar.fatia, → sa-triar.triar) nunca acontecem
- `especificar-29` · `fluxo/sa-especificar/especificar/passos/assumir.md` — Manda seguir 'a regra "complete o registro" do passo sa-triar.triar.chegou', passo de outro agente…
- `especificar-30` · `fluxo/sa-especificar/fatia/fatia.md` — O passo trabalho chama a sa-entrevistar ('Decisão em aberto → sa-entrevistar'), mas o mestre não declara…
- `especificar-38` · `fluxo/sa-especificar/prototipo/prototipo.md` — 'Leia antes: .sabia/sabia.md (ELM, Telas, papéis)' e '(ELM, caminhos, papéis)': o sabia.md não tem seção de…
- `especificar-45` · `skills/sabia/references/elm.md` — 'produto na [ESP] e na [GB]' atribui a [ESP] ao agente de produto, mas ela é do especificador (agente…
- `prd-12` · `fluxo/sa-prd/mudanca/passos/mudanca.md` — No épico fatiado, a mudança roda a Volta à especificação da fatia mas fixa o próximo em 'use sa-especificar…
- `fatiar-01` · `fluxo/sa-fatiar/fatiar/passos/rascunho.md` — O passo chama `sa-pesquisar.pesquisar`, mas a Entrada desse fluxo (pesquisar.md:19-22) exige a pasta da fatia…
- `fatiar-02` · `fluxo/sa-fatiar/refinamento/refinamento.md` — A alteração de artefato tem uma saída só, `→ sa-especificar.fatia`
- `fatiar-03` · `fluxo/sa-fatiar/fatiar/fatiar.md` — O vizinho "`aprovado` com a `obs` `falta: especificação`" diz no texto "pelo encaixe ou no próximo…
- `fatiar-04` · `fluxo/sa-fatiar/fatiar/fatiar.md` — O vizinho "`aprovado` com a linha viva `planejada` de uma `[ESP] EP-nn Revisão <n>`" aponta para…
- `fatiar-16` · `fluxo/sa-fatiar/fatiar/passos/rascunho.md` — A busca de conflito entre fichas procura o id do ELM do `altera <id>` ou `exclui <id>` em `<produto>/fatias/`…
- `planejamento-fluxos-02` · `fluxo/sa-planejamento/retrospectiva/retrospectiva.md` — O `recalcular` roda o fluxo `sa-planejamento.sprint` inteiro, mas o mestre não declara `chama`; o `gravar` do…
- `planejamento-fluxos-20` · `fluxo/sa-planejamento/retrospectiva/passos/precondicao.md` — O passo `precondicao` só nomeia os passos `sa-planejamento.review.sincronizar` e…
- `codificar-01` · `fluxo/sa-codificar/codificar/passos/revisar.md` — Na revisão automática do HITL, o sa-revisor recebe "pré-PR" e o pedido de "relatório só na conversa, sem…
- `codificar-04` · `fluxo/sa-codificar/codificar/passos/tarefa.md` — "**Toolkit na tarefa.** Passo `desenvolvedor` de passos.md": em skills/sabia/references/passos.md não há…
- `codificar-20` · `fluxo/sa-orquestrar/orquestrar/passos/fases.md` — A fase 8 (entrega) cita do passo sa-codificar.codificar.pr só "ADRs, texto e gitlab_criar_mr"
- `dev-12` · `fluxo/sa-plano/plano/plano.md` — A saída "artefato … que precisa mudar" leva sempre a `→ sa-especificar.fatia`
- `dev-24` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — A chamada `elm_ler_wi(<id>, comentarios: true)` está com o tipo errado
- `dev-39` · `fluxo/sa-desenvolver/desenvolver/desenvolver.md` — Na linha do vizinho falta a vírgula entre `retrabalho (de: …)` e `bloqueada (de: implementando / revisando /…
- `planejamento-refs-03` · `skills/sa-planejamento/references/elm-sprint.md` — O §5 diz que `elm_horas(iteracao)` devolve "horas por prefixo e por pessoa, planejadas × lançadas, e as…
- `planejamento-refs-22` · `skills/sa-planejamento/references/elm-sprint.md` — "Item que sai da sprint sem ter começado (`sa-planejamento.durante.encaixe`, ou §9: a Volta)"
- `rev-ver-06` · `fluxo/sa-revisar/revisar/passos/relatorio.md` — No HITL, fluxo/sa-codificar/codificar/passos/revisar.md:11 pede ao sa-revisor a rubrica C com "pré-PR":…
- `rev-ver-15` · `fluxo/sa-revisar/hitl/hitl.md` — A saída "volta à especificação" aponta só para `→ sa-especificar.fatia`
- `rev-ver-16` · `fluxo/sa-revisar/aprovar-pr/aprovar-pr.md` — Os vizinhos não têm o caso que o hub (skills/sa-iniciar/SKILL.md) manda à sa-codificar:…
- `rev-ver-32` · `fluxo/sa-verificar/verificar/passos/decisao.md` — "Não há `[VER]` no EWM (Q8)": `Q8` não existe em nenhum arquivo do framework (é um rótulo do plano de…
- `rev-ver-33` · `skills/sa-setup/assets/agents/sa-revisor.md` — O prompt do agente da skill sa-revisar diz "e o JSON de veredito em `.sabia/local/`, se pedido"
- `rev-ver-34` · `fluxo/sa-revisar/aprovar-plano/passos/entrega.md` — O passo diz "conferir no remoto (como na entrega do passo `sa-codificar.codificar.pr`)": manda o sa-revisor…
- `rev-ver-35` · `fluxo/sa-revisar/aprovar-plano/aprovar-plano.md` — Os vizinhos não têm `aguardando-aprovacao-plano` sem a [APR] com o MCP `elm` (a criação falhou: pendência…
- `rev-ver-36` · `fluxo/sa-orquestrar/orquestrar/passos/fases.md` — Fora da área, mas é o destino do ajuste pedido no aprovar-plano
- `consolidar-elm-24` · `fluxo/sa-consolidar/consolidar/passos/elm.md` — "Depois da publicação, a `sa-sync` traz o publicado ao bundle" aponta para uma skill que o agente dono não…
- `consolidar-elm-34` · `skills/sabia/references/elm.md` — A operação lista o tipo de vínculo `testado por` (com espaço), mas o `elm_ligar` só aceita o literal…
- `setup-assets-03` · `skills/sa-setup/scripts/gerar_agentes.py` — A regra entre fluxos, posta no prompt de todo agente, diz "chama **subagente** → chame esse agente ..
- `setup-assets-12` · `skills/sa-setup/assets/agents/sa-especificador.md` — O prompt roteia o épico até o GATE e a [ESP] FT, mas não tem rota para o fluxo sa-prd.mudanca, que é dele…
- `setup-skill-05` · `skills/sa-setup/references/toolkits.md` — A lista dos passos de desvio por tipo está incompleta frente ao `fluxo/tipos.json`
- `setup-skill-06` · `skills/sa-setup/references/toolkits.md` — 'A setup lista os passos no W5 e os oferece no W6 do agente dono (`sa-especificador`, `sa-desenvolvedor`)'
- `setup-skill-14` · `skills/sa-setup/references/wizard.md` — O W6 diz que a tabela de subagentes aparece em 'produto, especificador, desenvolvedor, orquestrador: os do…
- `setup-skill-15` · `skills/sa-setup/SKILL.md` — A lista dos papéis com escrita no ELM ('`sa-produto`, `sa-desenvolvedor`, `sa-orquestrador`, `sa-revisor` e…
- `setup-skill-20` · `skills/sa-setup/references/agentes.md` — 'os três com subagentes aparecem como `out of sync`': pelo papeis.json, quatro agentes têm subagentes…
- `nucleo-05` · `cli/compilar.mjs` — A entrada manda dizer a dona "com o agente dela, quando é outro" (entrada.md:26)
- `nucleo-22` · `plugin.json` — (1) A description diz "Inclui o MCP mcp-elm", mas o power sobe três MCPs (elm, elk e gitlabpr, no mcp.json e…
- `chamadas-02` · `fluxo/sa-planejamento/retrospectiva/passos/recalcular.md` — liga o §1 do elm-sprint.md

### 2.2 Formato (coluna, valor ou nome sem definição fechada) — 96

- `triagem-11` · `fluxo/sa-entrevistar/entrevistar/passos/registrar.md` — Os valores da Situação se contradizem: O passo diz "só acréscimo" e lista `substituída`, que só existiria se…
- `triagem-19` · `padrao/sa-atender/registro.md` — Os formatos de cancelamento e de pendência não batem
- `triagem-28` · `padrao/sa-entrevistar/glossario.md` — Só o exemplo define as colunas do glossário: Faltam o formato da Fonte (`D-nn`? id do ELM? ATA?) e da coluna…
- `especificar-09` · `fluxo/sa-especificar/especificar/passos/fechar-sessao.md` — O comentário de sessão não tem primeira linha fixa, mas o passo pasta precisa achar 'o último comentário de…
- `especificar-13` · `fluxo/sa-especificar/fatia/fatia.md` — Na fatia, a sessão fecha 'como o passo fechar-sessao', mas esse passo é do épico: commit EP-<nn> registrar…
- `especificar-14` · `padrao/sa-triar/ficha.md` — A tabela de Créditos da ficha tem a coluna 'Sessão', e a própria ficha diz 'com a tabela do status.md'
- `especificar-17` · `padrao/sa-especificar/ata.md` — '<slug> = data e assunto' não tem formato. '<duração>' não diz o formato nem de onde vem
- `especificar-19` · `fluxo/sa-especificar/especificar/passos/pasta.md` — O passo que cria a pasta '<EP>-<slug>' não diz de onde vem o slug
- `especificar-26` · `fluxo/sa-especificar/fatia/passos/concluir.md` — Na fatia, a linha da sprint vai a concluida sem os Créditos
- `especificar-42` · `fluxo/sa-especificar/fatia/passos/artefatos.md` — 'Conceito de épico ainda sem resource (o Especificado aponta para epicos/<EP>-<slug>/elm/)': a linha altera…
- `prd-05` · `padrao/sa-revisar/rubricas.md` — O similares cria o valor `novo (só bundle <data>)` para a coluna No ELM (a publicação refaz a busca), mas o…
- `prd-07` · `fluxo/sa-prd/prd/passos/escrever.md` — 'Sem bundle, leia o artefato pelo elm_ler_req(id) e grave a mesma estrutura.' O `elm_ler_req` não devolve um…
- `prd-16` · `skills/sa-prd/references/okf-elm.md` — O `verified` não tem exemplo YAML: O okf-elm diz 'um registro por aprovação' e 'a lista verified acumula'; o…
- `prd-19` · `fluxo/sa-prd/prd/passos/similares.md` — 'Registre cada decisão no decisoes.md (D-nn: artefato, id do ELM encontrado, relação, decisão, motivo).' O…
- `prd-20` · `fluxo/sa-prd/prd/passos/similares.md` — A coluna Impacto aparece em quatro formas: `<id> <como cita>` (passo e comentário do padrão), `<id> embute…
- `prd-21` · `padrao/sa-prd/prd.md` — A tabela 'Em aberto' (`/ D / Tema / Bloqueia? /`) não lista os valores de 'Bloqueia?' nem como se decide cada…
- `prd-26` · `fluxo/sa-prd/mudanca/passos/mudanca.md` — Na reabertura, a mudança grava a linha da [ESP] na seção Especificação como `iniciada`, mas omite a…
- `prd-27` · `padrao/sa-prd/ct.md` — A numeração não está definida: Não se diz se o `nn` do CT-nn é sequencial no épico (e de onde continua numa…
- `prd-29` · `skills/sa-prd/references/okf-elm.md` — `generated.by: sabia/<versão do power>` não diz de onde ler a versão ('power' é termo do Kiro, sem…
- `prd-30` · `padrao/sa-prd/gl.md` — O GL não tem bloco de modelo, ao contrário dos outros padrões
- `prd-36` · `skills/sa-prd/references/okf-elm.md` — 'a ATA … recebe na aprovação dela, no passo sa-especificar.reuniao.aprovar, e é publicada ali': quem publica…
- `fatiar-11` · `skills/sa-fatiar/references/backlog.md` — A lista de convenções da `obs` da fatia está incompleta
- `fatiar-12` · `fluxo/sa-fatiar/fatiar/passos/gravar.md` — A mesma cobertura aparece em três notações: O rascunho usa `HF-01 · 1.1, 1.2 · REG-01` e a faixa `HF-02 ·…
- `fatiar-13` · `fluxo/sa-fatiar/fatiar/passos/rascunho.md` — O exemplo põe `HITL (texto do e-mail)` na coluna Modo
- `fatiar-14` · `fluxo/sa-fatiar/fatiar/passos/gravar.md` — No `status.md` do épico, a Fase é uma linha de tabela, `/ Fase / rascunho /` (status-epico.md:10)
- `fatiar-15` · `padrao/sa-triar/ficha.md` — O fecho da ficha de épico é `Aprovados no GATE do PRD v<x> (…)`, com o exemplo `v1`, mas a versão do PRD tem…
- `fatiar-25` · `skills/sa-fatiar/references/backlog.md` — "Com a autorização do P.O. ou do SM registrada na linha" e "Especificado `—`, autorização do P.O. ou do SM":…
- `fatiar-26` · `skills/sa-fatiar/references/backlog.md` — Colunas sem definição na tabela Coluna / Valores: `id` (formato e origem na linha Próximos ids), `título` e…
- `fatiar-27` · `fluxo/sa-fatiar/fatiar/passos/gravar.md` — Nenhum arquivo define o `<slug>` da fatia; o do épico só tem "kebab-case, sem acento"…
- `fatiar-28` · `skills/sa-fatiar/references/backlog.md` — A DoR exige "nenhuma decisão bloqueante `em aberto` (`decisoes.md` ou ficha)", mas o `decisoes.md`…
- `fatiar-35` · `skills/sa-planejamento/references/arquivos.md` — A Observação `reaberta: <motivo>`, gravada na linha da Especificação reaberta (backlog.md:142) e lida por…
- `fatiar-36` · `skills/sa-fatiar/references/backlog.md` — A definição de `bloqueada-por` diz "(o artefato do ELM já na ficha de outra fatia aberta, gravado pela…
- `planejamento-fluxos-03` · `fluxo/sa-planejamento/durante/passos/encaixe.md` — "Com a decisão (fatia `elegivel`, épico ou item de Sustentação): `status` `planejada` (no épico da `[ESP]`,…
- `planejamento-fluxos-08` · `fluxo/sa-planejamento/regras.md` — A coluna Atividade de Créditos de gestão e o `<atividade>` do comentário na `[GB]` não têm lista fechada:…
- `planejamento-fluxos-16` · `skills/sa-planejamento/references/arquivos.md` — A Observação do sprint-<nn>.md acumula valores (`encaixe: …`, `modo: …`, `revisor único`, `migrada de …`,…
- `planejamento-fluxos-19` · `fluxo/sa-planejamento/retrospectiva/passos/fechar.md` — A primeira linha de `## Números` (`Concluídas: <n> fatias (<p> previstas · <q> por encaixe) · meta: … · lead…
- `codificar-19` · `padrao/sa-codificar/pr.md` — (1) O pr.md:44 chama `gitlab_criar_mr(titulo, …, descricao=<texto do item 2>)`, mas o padrão não diz se a…
- `codificar-25` · `fluxo/sa-orquestrar/orquestrar/passos/worktree.md` — No loop, nenhum passo grava o campo ELM do status.md
- `dev-07` · `padrao/sa-desenvolver/status.md` — Vários campos do status.md não têm regra: PR: o padrão só mostra `—`, mas o passo sa-codificar.codificar.pr…
- `dev-09` · `padrao/sa-desenvolver/status.md` — A regra "A base prevalece" diz que "o Modo, o revisor e o verificador também: os do backlog.md e da linha da…
- `dev-10` · `padrao/sa-desenvolver/status.md` — As colunas das tabelas do status.md não têm valores definidos
- `dev-26` · `padrao/sa-desenvolver/status.md` — O padrão do Bloqueio só lista `<motivo> · pergunta: <pergunta exata>` e `aguardando especificação [ESP]…
- `dev-29` · `fluxo/sa-desenvolver/desenvolver/passos/iniciar.md` — O item 2 manda gravar o modo da primeira atribuição "com o `obs`", sem dar o texto
- `dev-38` · `fluxo/sa-plano/plano/passos/analise.md` — Os nomes não batem com a rubrica L: O passo diz "(`OK` ou `AJUSTAR`)", e o fecho da rubrica é `ANALISE: OK`…
- `dev-41` · `padrao/sa-plano/plano.md` — A regra diz "Toda tarefa diz o comando que prova que terminou", mas no exemplo a tarefa 3 (opcional `*`) não…
- `planejamento-refs-08` · `skills/sa-planejamento/references/arquivos.md` — A lista de Observações do `sprint-<nn>.md` não traz valores que outros passos gravam nela: `reaberta:…
- `planejamento-refs-09` · `skills/sa-planejamento/references/arquivos.md` — A Observação `encaixe: <decisão> (<quem aprovou>, <data>)` não lista os valores de `<decisão>`
- `planejamento-refs-10` · `skills/sa-planejamento/references/arquivos.md` — As tabelas Fatias, Especificação e Sustentação do `sprint-<nn>.md` não têm definição por coluna, ao contrário…
- `planejamento-refs-11` · `skills/sa-planejamento/references/arquivos.md` — A primeira coluna da tabela `## Especificação` se chama `EP`, mas a tabela também guarda a fatia em…
- `planejamento-refs-16` · `skills/sa-planejamento/references/arquivos.md` — A linha `Reserva (Sustentação + retrabalho): <h>h · consumido: <h>h · retrabalho migrado: <h>h` não diz se é…
- `planejamento-refs-18` · `skills/sa-planejamento/references/arquivos.md` — A Previsão do roadmap é `fatias restantes ÷ vazão média, arredondando para cima`, mas o texto não diz como…
- `planejamento-refs-25` · `skills/sa-planejamento/references/elm-sprint.md` — A coluna **Campo** da tabela da sincronização tem a lista `estado` · `dono` · `estimativa` · `iteração` ·…
- `planejamento-refs-34` · `skills/sa-planejamento/references/arquivos.md` — O acordo de WIP diz "exceção fica registrada: `WIP excedido`" sem dizer onde nem a forma
- `planejamento-refs-35` · `skills/sa-planejamento/references/arquivos.md` — Na seção Débito de especificação, "Tarefa fica `—` até o P.O. abrir a correção pela sa-triar…, que grava o id…
- `planejamento-refs-36` · `skills/sa-planejamento/references/arquivos.md` — `**Fechamento sem consolidar:** <FT-… (<P.O.>, <data>)>` não diz como ficam várias fatias (separador) nem o…
- `planejamento-refs-38` · `skills/sa-planejamento/references/elm-sprint.md` — O `status.md` que a sincronização cria para o merge por fora leva "Lições candidatas `—`", mas o padrão…
- `planejamento-refs-39` · `skills/sa-planejamento/references/elm-sprint.md` — O item de Sustentação que nasce da tarefa por fora leva "`falta: prazo, critério de pronto` no que o EWM não…
- `rev-ver-03` · `padrao/sa-verificar/verificacao.md` — O bloco de decisão (`🔎 Verificação FT-<nnn> — rodada <N>` … `VERIFICACAO: ACEITO / REJEITADO`) só é…
- `rev-ver-20` · `fluxo/sa-verificar/verificar/passos/executar.md` — O executar.md só traz instrução para os tipos backend, batch, frontend e dados.…
- `rev-ver-22` · `fluxo/sa-revisar/revisar/passos/escopo.md` — A entrada da rubrica L (1) usa o caminho `.kiro/specs/<ft>/`, sem `-<slug>`; em todo o resto é…
- `rev-ver-28` · `padrao/sa-desenvolver/status.md` — Os valores de coluna que a área grava não estão listados no padrão
- `consolidar-elm-14` · `skills/sa-consolidar/references/elm-publicar.md` — "O id ao lado do cenário" e "ids no `verificacao.md`" não têm formato: o padrão verificacao.md define…
- `consolidar-elm-20` · `fluxo/sa-consolidar/consolidar/passos/fechar.md` — "Transcreva sem reclassificar" não diz a correspondência entre as colunas das Lições candidatas (`Correção…
- `consolidar-elm-29` · `skills/sa-consolidar/references/elm-publicar.md` — Na prévia, "o resto do escopo, 'aguardando aprovação'" usa uma Ação fora da lista fechada da regra 1 do…
- `sustentacao-guias-05` · `padrao/sa-atender/registro.md` — O padrão mostra `**ELM:** feito / pendente: <o que falta>`, mas todo o resto do framework usa `ELM pendente…
- `sustentacao-guias-12` · `padrao/sa-aprender/regra.md` — A numeração de `R-<nn>` não está definida: `aplica a` lista valores (`desenvolvedor / revisor / plano / PRD /…
- `sustentacao-guias-27` · `padrao/sa-atender/registro.md` — O padrão é só um exemplo, sem definir os campos: Faltam: Categoria (valores da tabela Sustentação do…
- `setup-assets-16` · `skills/sa-setup/assets/steering/sabia.md` — A tabela Agentes não tem as colunas definidas em nenhum lugar: só cabeçalho e `<…>`
- `setup-assets-20` · `skills/sa-setup/assets/steering/sabia.md` — "fica em `.sabia/local/<origem>/<id>/`": `<origem>` não é definido, e os caminhos reais variam:…
- `setup-skill-03` · `skills/sa-setup/references/wizard.md` — Os cartões W3, W4 e W7 não têm o bloco `> ❓`, que a SKILL.md:34 exige em toda mensagem ('uma pergunta por…
- `setup-skill-08` · `skills/sa-setup/references/agentes.md` — A tabela de campos do agentes.json deixa campos sem formato
- `setup-skill-16` · `skills/sa-setup/references/wizard.md` — No W6, a linha `elm` é sempre `[✅]` e só aceita os acessos dos papéis com ELM
- `setup-skill-26` · `skills/sa-setup/references/toolkits.md` — (1) `tipos-de-projeto` que casa torna o toolkit 'sugestão', mas o W5 e o W6 só têm o estado '🔍 detectado', e…
- `nucleo-02` · `fluxo/entrada.md` — O caso 1 manda ler o status.md da fatia (`.kiro/specs/*/status.md`) e o backlog.md, mas não diz onde fica a…
- `nucleo-08` · `fluxo/entrada.md` — Falta definir duas coisas em "`ELM pendente [<chave>]: assumir <tarefa> <id>` no registro do item"
- `nucleo-18` · `cli/sabia.mjs` — O CLI lê `~/.sabia/indices.json` (lista de índices extras de toolkits) sem que o formato esteja definido em…
- `nucleo-21` · `README.md` — "CT ..: ETM ou repositório, pela política": os valores da linha Casos de teste do sabia.md são `CSV` e `ETM`…
- `formatos-02` · `padrao/sa-triar/ficha.md` — coluna `Sessão Kiro` na tabela Créditos
- `formatos-04` · `padrao/sa-desenvolver/status.md` — Achados abertos: Origem fechada (PR · GATE do plano · [ESP] FT-<nnn>)
- `formatos-05` · `padrao/sa-desenvolver/status.md` — Achados abertos: Achado e Situação descritos; onde.md:36 alinhado
- `formatos-06` · `padrao/sa-desenvolver/status.md` — campo Origem separado da coluna `origem` do backlog
- `formatos-07` · `padrao/sa-desenvolver/status.md` — Responsável = quem tem a próxima ação
- `formatos-08` · `skills/sa-fatiar/references/backlog.md` — coluna `responsavel` definida
- `formatos-09` · `skills/sa-fatiar/references/backlog.md` — `origem EP-<nn>` na obs do épico
- `formatos-11` · `skills/sa-fatiar/references/backlog.md` — `tamanho` ligado ao acordos.md, à divisão, à ficha e à sprint
- `formatos-12` · `skills/sa-fatiar/references/backlog.md` — `cobre` exatamente `HF-nn#c.c`
- `formatos-13` · `skills/sa-planejamento/references/arquivos.md` — colunas da sprint: `EP · FT` na Especificação
- `formatos-14` · `skills/sa-planejamento/references/arquivos.md` — colunas da sprint: Responsável, Revisor, Verificador
- `formatos-15` · `skills/sa-planejamento/references/arquivos.md` — colunas da sprint: Horas previstas e Horas da Sustentação
- `formatos-16` · `fluxo/sa-executar/executar/` — arquivo de Sustentação = `registro` (sa-executar, sa-atender, sa-status, steering, elm.md:114)
- `formatos-17` · `padrao/sa-atender/registro.md` — `**ELM:**` com chave (já estava no formato)
- `formatos-18` · `padrao/sa-atender/registro.md` — `**Saída:**` com valores fechados
- `formatos-23` · `padrao/sa-triar/ficha.md` — `GATE do PRD v<x.y>`; Origem das Mudanças no padrao/sa-prd/prd.md
- `formatos-26` · `skills/sabia/SKILL.md` — `<ft>` definido; `.kiro/specs/<ft>-<slug>/` no sa-setup/references/agentes.md:49; nota no okf-elm.md
- `formatos-27` · `fluxo/sa-codificar/codificar/passos/pr.md` — corpo do ADR; nome e numeração no conhecimento.md
- `formatos-28` · `padrao/sa-desenvolver/status.md` — linha `nenhuma` com células; licao.md cita a lista de causas

### 2.3 Aberto (caso sem regra) — 65

- `triagem-01` · `fluxo/sa-triar/triar/passos/chegou.md` — Não há caso para o item terminal (`concluida`, `cancelada`, `dividida`, `concluido`, `cancelado`) que volta…
- `triagem-04` · `fluxo/sa-triar/triar/passos/encaminhar.md` — O texto diz que "a fatia e o épico fora da sprint entram nela ao começar —…
- `triagem-05` · `fluxo/sa-triar/triar/passos/chegou.md` — O caso "fatia `nova` no backlog … de épico ou de Manutenção → deixe-a pronta" (50-52) não tem saída em…
- `triagem-06` · `fluxo/sa-triar/triar/passos/chegou.md` — Há dois problemas: (1) Em chegou.md:36-37, o artefato novo vai à Volta à especificação "por quem a conduz",…
- `triagem-14` · `fluxo/sa-entrevistar/entrevistar/passos/linguagem.md` — Chamado pela triagem, o passo linguagem grava o glossário "pelo bloco Gravar na base", que tem commit e push…
- `triagem-16` · `fluxo/sa-triar/lote-ewm/passos/lote.md` — "com um commit para o lote" contradiz o commit único da sessão, que registrar.md:101 faz no passo…
- `triagem-17` · `fluxo/sa-triar/lote-ewm/passos/lote.md` — A Entrada assume "Na base, conferida pelo passo `sa-triar.triar.chegou`", mas o lote-ewm tem `quando` próprio…
- `triagem-29` · `fluxo/sa-entrevistar/entrevistar/passos/rodadas.md` — Dois casos ficam sem definição: (1) A pessoa não confirma o entendimento no fim: a Saída só prevê…
- `especificar-11` · `fluxo/sa-especificar/especificar/passos/fechar-sessao.md` — A pendência da sessão vai sempre para o rascunho.md
- `especificar-22` · `fluxo/sa-especificar/especificar/passos/encaminhar.md` — 'com a Especificação iniciada, vai do passo entrada ao publicar' contradiz o mestre (especificar.md:6), em…
- `especificar-24` · `fluxo/sa-especificar/fatia/passos/artefatos.md` — 'Por linha da seção' não filtra o Especificado '—'
- `especificar-35` · `fluxo/sa-especificar/reuniao/passos/decisoes.md` — O item 1 grava as dúvidas da próxima reunião no rascunho.md, que com o PRD na base também está na base…
- `especificar-43` · `fluxo/sa-especificar/fatia/passos/publicar.md` — O elm-publicar diz que 'o resource/id volta aos dois' (cópia da fatia e conceito do épico), mas o publicar e…
- `prd-06` · `fluxo/sa-prd/prd/passos/gate.md` — O GATE manda gravar `status: stable` e um `verified` novo em CADA conceito de elm/
- `fatiar-09` · `fluxo/sa-fatiar/refinamento/refinamento.md` — A Entrada e o "quando" restringem o refinamento ao épico na Fase `fatiado`
- `fatiar-17` · `fluxo/sa-fatiar/fatiar/passos/rascunho.md` — O item 5 manda pôr em alguma fatia "cada conceito com No ELM `novo`, `altera` ou `exclui`"
- `fatiar-20` · `fluxo/sa-fatiar/fatiar/passos/perguntar.md` — Depois de um ajuste (dividir, juntar, mudar), o passo não manda refazer a cobertura, o ponta a ponta, os…
- `fatiar-22` · `fluxo/sa-fatiar/refinamento/passos/refinar.md` — O refinamento é uma sessão do P.O. ou do SM no agente `sa-produto`, mas não registra os créditos na `[GB]`…
- `fatiar-24` · `skills/sa-fatiar/references/backlog.md` — A linha "não existe (fatia de épico) → o encaixe cria a `[ESP] FT-<nnn> Especificação`" supõe sprint aberta
- `fatiar-33` · `fluxo/sa-fatiar/fatiar/passos/gravar.md` — O item 4 só cobre "Sem o MCP `elm` → `pendente`": Ficam de fora a falha com o MCP presente (`erro`,…
- `fatiar-37` · `fluxo/sa-fatiar/refinamento/passos/refinar.md` — O refinamento não tem o passo `entrada` compartilhado, e nada confere se o id existe ou se já é terminal
- `fatiar-38` · `skills/sa-fatiar/references/backlog.md` — As Regras mandam "Antes de gravar: `git switch <base>` e `git pull --ff-only`" direto, enquanto o bloco…
- `planejamento-fluxos-15` · `fluxo/sa-planejamento/durante/passos/encaixe.md` — A Saída diz "o executor retoma pela própria skill (`<skill> <id>`)" sem dizer qual skill para cada tipo de…
- `planejamento-fluxos-17` · `fluxo/sa-planejamento/sprint/passos/gravar.md` — "`status` `planejada` (no épico da `[ESP]`, `planejado`; a fatia `nova` com a `[ESP]` segue `nova`)" não…
- `planejamento-fluxos-23` · `fluxo/sa-planejamento/troca-modo/passos/avisar.md` — A lista só cobre `bloqueada (de: planejando)`; `bloqueada (de: implementando / revisando / verificando / …)`…
- `planejamento-fluxos-24` · `fluxo/sa-planejamento/troca-modo/passos/mostrar.md` — Sem o passo `entrada`, os dois fluxos que recebem um id não cobrem: troca-modo com fatia inexistente,…
- `planejamento-fluxos-32` · `fluxo/sa-planejamento/retrospectiva/passos/horas.md` — O passo horas não tem o caso sem o MCP `elm` (Planejadas e Lançadas dos Números vêm do `elm_horas`), e a…
- `planejamento-fluxos-33` · `fluxo/sa-planejamento/retrospectiva/passos/virada.md` — A "virada pela metade" só cobre a parada depois do `recalcular`
- `codificar-10` · `fluxo/sa-codificar/codificar/passos/tarefa.md` — "O código real não bate com o plano → **pare** e reporte, sem improvisar"
- `dev-02` · `fluxo/sa-plano/plano/passos/gate.md` — O gate lê a senioridade de quem implementa no `Responsável` do status.md, mas o próprio gate troca esse campo…
- `dev-04` · `fluxo/sa-desenvolver/desenvolver/passos/compromisso.md` — Quando a DoR falha, o texto diz que a fatia "volta a `nova` com o `falta:`", sem dizer quem grava
- `dev-05` · `fluxo/sa-desenvolver/regras.md` — A regra diz que, na base, o Dev só grava a situação (`iniciada`, `pronta`) e o status.md depois do merge
- `dev-11` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — O texto manda gravar causa `—` na "correção sem lição (ambiente, digitação)"
- `dev-15` · `fluxo/sa-plano/plano/passos/pesquisa.md` — A sa-pesquisar (research.md:14-16) diz que o agente pesquisador nunca grava o status.md e que "quem o chamou…
- `dev-17` · `fluxo/sa-plano/plano/passos/escrever.md` — O escrever.md diz que a última tarefa do tasks.md é "o checkpoint de validação completa + revisão"
- `dev-25` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — O item 1 ("Leia o PR") depende de `gitlab_obter_mr` pelo `iid` do link no status.md
- `planejamento-refs-05` · `skills/sa-planejamento/references/elm-sprint.md` — A idempotência da [GB] procura `elm_listar_wi(pai = <id da Sustentação>, titulo_prefixo "[GB]")` e aceita "só…
- `planejamento-refs-23` · `skills/sa-planejamento/references/elm-sprint.md` — §0 passo 1: "Já há `atual` → mostre e confirme e vá ao passo 4"
- `planejamento-refs-32` · `skills/sa-planejamento/references/arquivos.md` — A "Tarefa ELM" é "gravada na publicação da sprint (§4)", mas outros também a gravam: a troca de modo…
- `planejamento-refs-37` · `skills/sa-planejamento/references/elm-sprint.md` — Para a iteração que cobre as duas sprints, o §5 só diz que o movimento não muda nada
- `planejamento-refs-40` · `skills/sa-planejamento/references/arquivos.md` — Pela regra, na Especificação "a que sai da sprint fica `elegivel`, com `saiu da sprint`"
- `rev-ver-04` · `fluxo/sa-verificar/verificar/passos/casos.md` — casos.md busca o CT planejado só no `elm/` da pasta do épico e diz que o CT novo é "só na fatia sem épico (um…
- `rev-ver-14` · `fluxo/sa-revisar/hitl/passos/entrega.md` — As horas da sessão não têm regra única: Na REV HITL, APROVADO lança o saldo e conclui, e a volta à…
- `rev-ver-24` · `fluxo/sa-revisar/aprovar-pr/aprovar-pr.md` — As permissões declaradas contradizem os passos: O aprovar-pr diz "não faz commit — neste fluxo, só nas…
- `consolidar-elm-03` · `fluxo/sa-consolidar/consolidar/passos/elm.md` — Dois textos se contradizem: O item *créditos* diz "Falha no comentário → `ELM pendente [GB <id> créditos]` no…
- `consolidar-elm-06` · `fluxo/sa-consolidar/consolidar/passos/drift.md` — O caso 1 exige "a linha da `[ESP]` `concluida` na seção Especificação do `sprint-<nn>.md`" sem dizer qual…
- `consolidar-elm-22` · `fluxo/sa-consolidar/consolidar/passos/fechar.md` — "Na linha da fatia no `sprint-<nn>.md` aberto" e "a linha em Créditos de gestão" não cobrem o caso sem sprint…
- `consolidar-elm-33` · `skills/sabia/references/elm.md` — A tabela de erros não trata `entrada` (parâmetro inválido: par de `elm_ligar` errado, título vazio, sigla…),…
- `consolidar-elm-35` · `skills/sabia/SKILL.md` — A tabela Gates diz `PRD / P.O.`, mas o resto do framework dá o GATE do PRD ao especificador: SKILL.md:48…
- `consolidar-elm-37` · `skills/sa-consolidar/SKILL.md` — A description diz "the test cases (created by the agent in ETM, one per verified scenario)", o que contradiz…
- `sustentacao-guias-28` · `fluxo/sa-atender/atender/passos/assumir.md` — 'EWM, com sim: falta o IB ou a [ATD] → crie o que faltar' não diz o que fazer sem o MCP `elm`
- `sustentacao-guias-31` · `fluxo/sa-aprender/regras.md` — 'alterações pendentes na branch da fatia → commite-as ou peça à pessoa antes' contradiz o bloco Gravar na…
- `setup-assets-09` · `skills/sa-setup/assets/agents/sa-revisor.md` — O prompt diz "Escreva só o relatório da rodada (e o JSON de veredito em `.sabia/local/`, se pedido); na…
- `setup-assets-11` · `skills/sa-setup/assets/agents/sa-especificador.md` — Os prompts e o steering tratam como incondicional o que depende das políticas da seção ELM
- `setup-assets-17` · `skills/sa-setup/assets/steering/sabia.md` — "a fatia usa a do módulo que altera (o design.md diz qual)" contradiz a frase seguinte e o passo…
- `setup-assets-24` · `skills/sa-setup/assets/agents/sa-orquestrador.md` — "a escrita nas worktrees e os comandos de build estão liberados para os subagentes, que herdam as suas…
- `setup-assets-25` · `skills/sa-setup/assets/agents/papeis.json` — Textos que contradizem o comportamento atual: (1) O $comment diz que o gerador "grava…
- `setup-skill-11` · `skills/sa-setup/references/wizard.md` — O W2 pergunta 'Rodo os comandos 1 a 5 uma vez?', mas a SKILL manda rodar 'cada comando proposto', o que…
- `setup-skill-12` · `skills/sa-setup/SKILL.md` — As Regras limitam a escrita a '`.sabia/`, `.kiro/`, `.opencode/` e `opencode.json` (só os ponteiros e os…
- `setup-skill-24` · `skills/sa-setup/SKILL.md` — O MCP de banco só é procurado em `.kiro/settings/mcp.json` e `~/.kiro/settings/mcp.json`
- `setup-skill-27` · `skills/sa-setup/references/elm-pa.md` — A validação cria 'uma tarefa …, um IB e um defeito', mas o `defeito` é opcional (bloco 2: '"não" → o `pa`…
- `setup-skill-29` · `skills/sa-setup/references/wizard.md` — A linha 6 do W0 (Credencial do ELM) oferece '➖ projeto sem ELM', mas o Passo 0 ainda não sabe se o projeto…
- `nucleo-01` · `cli/compilar.mjs` — Três textos dizem coisas diferentes sobre o que vale numa sessão sem agente
- `nucleo-11` · `README.md` — A linha da sa-especificar diz "alteração depois dela [da publicação], pela regra única da tarefa de…
- `nucleo-15` · `fluxo/entrada.md` — Duas precedências estão em aberto: (1) A entrada só diz que pula quando "chamado (⇄)", e não diz o que…

### 2.4 Robustez (critério que depende do modelo) — 99

- `triagem-22` · `fluxo/sa-triar/triar/passos/registrar.md` — Há dois critérios para propor o modo: Aqui: "`AFK` quando o esperado e o teste são claros e não há dado…
- `triagem-24` · `fluxo/sa-triar/triar/passos/chegou.md` — O caso do item de Sustentação devolvido junta 5 condições numa frase, e "a fechada não é a tarefa do novo" é…
- `triagem-25` · `fluxo/sa-triar/triar/passos/encaminhar.md` — O modelo de resumo põe `modo <AFK / HITL>` em todo item, mas o épico e o item de Sustentação não têm modo, e…
- `triagem-30` · `fluxo/sa-triar/lote-ewm/passos/lote.md` — `elm_ler_wi(id, comentarios)` não dá valor ao parâmetro
- `triagem-31` · `fluxo/sa-entrevistar/entrevistar/passos/registrar.md` — O "Faça" fala só de `decisoes.md` ("cria na primeira")
- `triagem-32` · `fluxo/sa-triar/triar/passos/registrar.md` — "Responsável sugerido: quem tem `atende: true` no `equipe.json`" não diz o que fazer quando há mais de uma…
- `especificar-10` · `fluxo/sa-especificar/especificar/passos/fechar-sessao.md` — A pendência da sessão usa 'ELM pendente [<chave>]', e o elm.md:85-89 exige 'uma pendência por chave'
- `especificar-23` · `fluxo/sa-especificar/especificar/passos/encaminhar.md` — 'a sessão segue nela, até o passo fechar-sessao', mas nenhum passo da sa-prd ou da sa-entrevistar volta ao…
- `especificar-31` · `fluxo/sa-especificar/reuniao/passos/transcricao.md` — O script recebe 'reunioes/<arquivo.ext>' relativo, mas o shell roda na raiz do projeto, onde reunioes/ não…
- `especificar-41` · `fluxo/sa-especificar/fatia/passos/artefatos.md` — A cópia vem do bundle ou de 'elm_ler_req(id)': Só que o elm_ler_req devolve 'YAML {id, titulo, tipo, pasta,…
- `especificar-46` · `fluxo/sa-especificar/fatia/passos/concluir.md` — Sob '**Próximo**, exato', o aviso da fatia iniciada não começa com 'Próximo:', ao contrário do da elegivel, e…
- `especificar-47` · `fluxo/sa-especificar/especificar/passos/pasta.md` — 'rascunho.md com o título e a descrição do item do EWM' não diz a tool (elm_ler_wi do IB do épico, coluna elm…
- `prd-22` · `fluxo/sa-prd/prd/passos/escrever.md` — O padrão sem a linha Especificação aparece como '~8 histórias e um objetivo' (63) e '~8 histórias ou mais de…
- `prd-23` · `fluxo/sa-prd/prd/passos/entender.md` — 'linha com prd —: novo ou elegivel na triagem, iniciado pela sa-especificar' lista situações que não ocorrem…
- `prd-24` · `fluxo/sa-prd/prd/prd.md` — 'Não invoque nem simule outra skill além das que os passos mandam chamar (sa-entrevistar, o subagente…
- `prd-25` · `fluxo/sa-prd/prd/prd.md` — A mensagem do modo autônomo termina em 'especifique numa sessão com o P.O.', mas o dono do sa-prd e do GATE…
- `prd-32` · `fluxo/sa-prd/prd/passos/escrever.md` — (1) O desvio só cita 'no seu prompt'; a sessão sem agente usa a seção **Tipos com skill de toolkit** do…
- `prd-34` · `fluxo/sa-prd/prd/passos/gate.md` — A linha Artefatos do painel ('HF <n> (<c> cenários) · REG <n> · GL <n> novos · …') mistura critérios: só o GL…
- `prd-35` · `fluxo/sa-prd/prd/passos/escrever.md` — O sa-prd procura os D-nn `Protótipo v<N> aprovado` e `Épico sem tela` como se fossem o texto inteiro, mas o…
- `fatiar-18` · `fluxo/sa-fatiar/fatiar/passos/rascunho.md` — O passo manda ler "o PRD inteiro e o `decisoes.md`", mas o `prd.md` só traz o índice dos artefatos…
- `fatiar-21` · `fluxo/sa-fatiar/fatiar/passos/gravar.md` — O commit do fatiamento é "padrão do `sabia.md`", mas a linha Mensagens do fluxo do modelo do `sabia.md`…
- `fatiar-29` · `fluxo/sa-fatiar/fatiar/passos/proximos.md` — O refinamento passa ao `proximos`, mas o texto dele só trata de fatias novas (IBs no backlog do EWM, alocar…
- `fatiar-34` · `fluxo/sa-fatiar/fatiar/passos/perguntar.md` — `tamanhos <P/M/G>` é ambíguo: pode ser a lista dos tamanhos ou a contagem por tamanho
- `planejamento-fluxos-25` · `fluxo/sa-planejamento/durante/passos/encaixe.md` — O parágrafo "Com a decisão…" é uma frase única de ~19 linhas com uns dez casos aninhados (fatia, épico,…
- `planejamento-fluxos-26` · `fluxo/sa-planejamento/durante/passos/sincronizar.md` — Os dois passos de sincronização reescrevem o §9 em prosa, com diferenças na mesma string exata: sem o MCP, o…
- `planejamento-fluxos-31` · `fluxo/sa-planejamento/sprint/passos/modo.md` — "critérios da `sa-fatiar`" não cita a fonte: os critérios estão no passo `sa-fatiar.fatiar.rascunho`…
- `codificar-08` · `fluxo/sa-codificar/codificar/passos/revisar.md` — A linha 31 diz "REVISAR → corrija só os achados (como tarefas [R<n>], passo onde) e volte ao passo validar"
- `codificar-13` · `fluxo/sa-codificar/codificar/passos/pr.md` — O item 7 diz "push 'não' já parou no item 2", mas o push é o 3.2
- `codificar-16` · `fluxo/sa-orquestrar/orquestrar/passos/lote.md` — A mesma pendência do ELM aparece em três formas: lote.md:66 `ELM pendente [<chave>]: assumir a tarefa`,…
- `codificar-23` · `fluxo/sa-orquestrar/orquestrar/passos/retomar.md` — "Retomar = continuar cada fatia da fase registrada no status.md dela" pede que o modelo deduza de qual das…
- `codificar-29` · `fluxo/sa-codificar/codificar/passos/onde.md` — "No loop (AUTONOMO), o lote já assumiu: pule." vem depois da conferência da [DEV] e não diz se pula o item…
- `codificar-30` · `fluxo/sa-orquestrar/orquestrar/passos/fases.md` — A célula da fase 4 junta, numa frase só, três ramos (plano com risco; Sênior ou Pleno que dispensou; Pleno…
- `codificar-31` · `fluxo/sa-codificar/codificar/passos/tarefa.md` — (1) "steering de estrutura do projeto" (investigar.md:10): o pesquisador não é mandado ler o sabia.md, onde…
- `codificar-32` · `fluxo/sa-orquestrar/orquestrar/passos/lote.md` — "`bloqueada-por` nem `pronta` nem `concluida` e não presente antes no lote": a frase não tem sujeito
- `dev-18` · `fluxo/sa-plano/plano/plano.md` — A lista "Leia" cita a ficha só da "fatia sem épico"
- `dev-19` · `fluxo/sa-desenvolver/desenvolver/passos/iniciar.md` — O placeholder `<ft>` de `.kiro/specs/<ft>-<slug>/` e de `.sabia/local/wt/<ft>` não é definido
- `dev-20` · `fluxo/sa-desenvolver/desenvolver/passos/iniciar.md` — O comando é sempre `git switch -c <branch> origin/<base>`
- `dev-22` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — Na área dev, as strings de `ELM pendente` aparecem com variações em relação ao formato `ELM pendente…
- `dev-28` · `fluxo/sa-plano/plano/passos/gate.md` — A Volta da troca reconhece "trocou", "manteve" e "nada registrado" pela "Observação `modo: …` da linha da…
- `dev-30` · `fluxo/sa-desenvolver/desenvolver/passos/iniciar.md` — Dois dados dependem de memória entre passos: Na retomada "a partir do item 3", o item 5 manda criar a [REV] e…
- `dev-32` · `fluxo/sa-desenvolver/desenvolver/passos/compromisso.md` — O texto diz que a linha da fatia, a ficha e a linha da sprint têm de estar em `origin/<base>`, mas o comando…
- `dev-34` · `fluxo/sa-plano/plano/passos/escrever.md` — O limite "~200 linhas no total ou ~8 tarefas" é aproximado e não diz quais arquivos entram no total nem como…
- `dev-36` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — O aviso ao P.O. ou ao SM diz "(sa-consolidar, no agente sa-produto, com os créditos num comentário na [GB];…
- `dev-37` · `fluxo/sa-desenvolver/encerrar/passos/merge.md` — Duas frases são crípticas para um modelo pequeno: No item 2, "o `git merge-base` cai na negação do `git…
- `dev-45` · `padrao/sa-desenvolver/status.md` — A regra de quem incrementa "retrabalho" em Rodadas lista o revisor e o verificador (HITL) e o orquestrador ou…
- `planejamento-refs-01` · `skills/sa-planejamento/references/elm-sprint.md` — Quando a troca HITL → AFK não consegue cancelar uma tarefa, o §7 grava `ELM pendente [<REV/VER> FT-<nnn>…
- `planejamento-refs-15` · `skills/sa-planejamento/references/arquivos.md` — "Horas de uma sprint = `horas-semana × semanas` − ausências que caem nela"
- `planejamento-refs-26` · `skills/sa-planejamento/references/elm-sprint.md` — Exemplos que contradizem as regras, e o modelo pequeno copia o exemplo
- `planejamento-refs-27` · `skills/sa-planejamento/references/arquivos.md` — O exemplo da linha FT-033 tem Responsável `ana.souza`, que no exemplo do equipe.json (linhas 28-31) é…
- `planejamento-refs-28` · `skills/sa-planejamento/references/elm-sprint.md` — A "pendência registrada" (`ELM pendente [<chave>]` sem `ELM feito`) sai da comparação porque "já cobre a…
- `planejamento-refs-30` · `skills/sa-planejamento/references/elm-sprint.md` — Uma mesma mensagem exata aparece com variações: Aqui (§9) e em review/passos/sincronizar.md: "sincronização…
- `rev-ver-19` · `fluxo/sa-revisar/hitl/passos/entrega.md` — As mensagens de commit da área (`FT-<nnn> revisão <N>: …`, `FT-<nnn> verificação: ACEITO/REJEITADO/volta à…
- `rev-ver-25` · `fluxo/sa-revisar/hitl/passos/pr.md` — O item 3 e a saída "PR atualizado com a [REV] já concluída" → `assumir` voltam a um passo que já rodou e já…
- `rev-ver-26` · `fluxo/sa-revisar/hitl/passos/pr.md` — O PR é lido só pelo `gitlab_obter_mr`, sem caminho para o projeto sem o MCP `gitlabpr`
- `rev-ver-27` · `fluxo/sa-verificar/verificar/passos/assumir.md` — O `git pull --ff-only` na branch do PR não tem Pare se para árvore suja ou para pull recusado (branch…
- `rev-ver-29` · `fluxo/sa-revisar/hitl/passos/entrega.md` — A pendência de conclusão varia de forma: `ELM pendente [<chave>]: lançar <h>h e concluir [REV] FT-<nnn>` e `……
- `rev-ver-31` · `fluxo/sa-verificar/verificar/passos/decisao.md` — O ACEITO e o REJEITADO misturam AFK e HITL em listas com até três níveis (fase, Rodadas, Retrabalho, commit,…
- `consolidar-elm-05` · `fluxo/sa-consolidar/consolidar/passos/elm.md` — O item *horas* manda `elm_lancar_horas(id, horas)`, mas não pergunta as horas, não diz de onde vem o id (a…
- `consolidar-elm-11` · `fluxo/sa-consolidar/consolidar/passos/conhecimento.md` — "Termos que o código novo introduziu ou renomeou" depende de ler o código, e o passo não manda ler nada além…
- `consolidar-elm-12` · `skills/sa-consolidar/references/elm-publicar.md` — A linha `Código: PR <link> · merge <sha curto>` precisa do sha do merge, e nada diz de onde ele vem
- `consolidar-elm-13` · `skills/sa-consolidar/references/elm-publicar.md` — Três passos dependem de inferência: (1) Para ligar uma linha do CT.csv ao CT planejado, falta dizer a chave:…
- `consolidar-elm-15` · `fluxo/sa-consolidar/consolidar/passos/elm.md` — "`ETM` (com `qm` no `pa`)" pede saber se o `pa` tem `qm`, mas o agente não lê o `pa` (elm.md:6-7), e o…
- `consolidar-elm-18` · `fluxo/sa-consolidar/consolidar/consolidar.md` — O vizinho "sem `pronta` na base, com o PR mergeado pelo Sabiá" × "PR mergeado por fora do Sabiá" exige…
- `consolidar-elm-21` · `fluxo/sa-consolidar/consolidar/passos/fechar.md` — Os ids do campo ELM do `status.md` são sem link (`DEV <id>`), mas o `fechar` manda gravar no `backlog.md`…
- `consolidar-elm-23` · `fluxo/sa-consolidar/consolidar/passos/proximo.md` — O fecho não define: (1) qual é a "próxima" fatia (a regra de escolha: prioridade, `bloqueada-por`, só do…
- `consolidar-elm-27` · `skills/sa-consolidar/references/elm-publicar.md` — "IB da fatia" não cobre a fatia que veio de um defeito ou IB do EWM: na coluna `elm`, esse item fica no lugar…
- `consolidar-elm-30` · `skills/sa-consolidar/references/elm-publicar.md` — Várias strings de pendência saem sem o `: <ação>` do formato único (`ELM pendente [<chave>]: <o que falta>`,…
- `consolidar-elm-31` · `skills/sa-sync/SKILL.md` — O texto não bate com o que o MCP devolve: (1) Passo 1: "conflitos (… com as duas datas)", mas o `plano`…
- `consolidar-elm-32` · `skills/sa-sync/SKILL.md` — "Com o índice pronto, ofereça a visualização" e "sem índice → `elm_indexar_local` e rode de novo" não dizem…
- `consolidar-elm-36` · `skills/sabia/SKILL.md` — O caminho da pasta da fatia aparece de dois jeitos, `.kiro/specs/<ft>-<slug>/` e…
- `sustentacao-guias-06` · `fluxo/sa-atender/atender/passos/finalizar.md` — A pendência do EWM aparece com três formatos e a `<chave>` nunca é instanciada. finalizar: `ELM pendente…
- `sustentacao-guias-14` · `fluxo/sa-aprender/registrar/passos/gravar.md` — Faltam mensagens de commit: As gravações da sa-aprender (lição no licoes.md, regra nas Regras aprendidas,…
- `sustentacao-guias-18` · `skills/sa-iniciar/SKILL.md` — Sem o MCP, 'Minha próxima tarefa' lista só as linhas da sprint com `responsavel` = a pessoa
- `sustentacao-guias-19` · `skills/sa-iniciar/SKILL.md` — As linhas 'PR da fatia mergeado sem `pronta`', 'tarefa [DEV] fechada com o PR mergeado' e '[APR] Aprovar PR…
- `sustentacao-guias-25` · `skills/sa-status/SKILL.md` — A confirmação dos créditos tem três frases que se encadeiam
- `sustentacao-guias-26` · `skills/sa-status/SKILL.md` — Em `--desde <Data da sua última linha onde vai gravar / início do item>`, o 'início do item' não tem formato…
- `sustentacao-guias-29` · `fluxo/sa-atender/atender/passos/executar.md` — O executar.md do atender permite lançar horas 'a qualquer momento', mas não manda acrescentar a linha na…
- `sustentacao-guias-32` · `fluxo/sa-aprender/registrar/passos/gravar.md` — 'branch base (mestre)' e 'gatilho do mestre' usam o jargão interno 'mestre' (o arquivo do fluxo)
- `setup-assets-01` · `skills/sa-setup/scripts/gerar_agentes.py` — No opencode, o sa-produto não consegue gravar a seção Regras aprendidas do .sabia/sabia.md (fluxo…
- `setup-assets-07` · `skills/sa-setup/assets/steering/sabia.md` — A pergunta dos créditos aparece em três versões: steering `💳 Fechar a sessão e registrar os créditos?…
- `setup-assets-10` · `skills/sa-setup/assets/agents/sa-desenvolvedor.md` — As listas de ações no ELM dos prompts são mais curtas que os fluxos, e um modelo pequeno lê a lista como…
- `setup-assets-13` · `skills/sa-setup/assets/agents/sa-produto.md` — "PRD aprovado e publicado (`EP-nn` `aprovado` na base, a Especificação `concluida`)": no backlog.md,…
- `setup-assets-14` · `skills/sa-setup/scripts/gerar_agentes.py` — (1) A linha gerada manda escrever "o arquivo pela coluna Arquivo do catálogo, o envelope do `okf-elm.md`" sem…
- `setup-assets-19` · `skills/sa-setup/assets/steering/sabia.md` — "Uma skill por vez: ... nunca invoca nem simula a do passo seguinte (os subagentes que ela manda chamar fazem…
- `setup-assets-21` · `skills/sa-setup/assets/agents/sa-desenvolvedor.md` — Strings exatas que divergem da fonte: (1) "aguardando revisão" / "aguardando verificação" × "aguardando…
- `setup-assets-23` · `skills/sa-setup/scripts/gerar_agentes.py` — (1) fonte_toolkits lê o toolkit.json com `ler` (arquivo ausente → {})
- `setup-assets-27` · `skills/sa-setup/assets/steering/sabia.md` — As confirmações são atribuídas só ao Kiro ("o Kiro pergunta a cada um (`ask`)", "a confirmação do Kiro", "o…
- `setup-assets-28` · `skills/sa-setup/assets/steering/sabia.md` — Os dois parágrafos mais carregados do steering (que todo agente lê, inclusion: always) aninham várias…
- `setup-skill-07` · `skills/sa-setup/SKILL.md` — O Passo 5 manda seguir o toolkits.md, mas lista outros lugares: `.kiro/skills`, `~/.kiro/skills` e os powers
- `setup-skill-09` · `skills/sa-setup/SKILL.md` — 'A pessoa recusou na tabela → registre "não há" e remova dos agentes as regras e linhas que os citam…
- `setup-skill-19` · `skills/sa-setup/references/wizard.md` — As linhas do W9 não batem com as verificações do Passo 9
- `setup-skill-21` · `skills/sa-setup/references/agentes.md` — Comandos com variações de string: O agentes.md usa `<power>/skills/sa-setup/scripts/gerar_agentes.py`, e a…
- `setup-skill-28` · `skills/sa-setup/references/wizard.md` — (1) A linha de tabela vazia (`/ — / nada a mostrar / ➖ /`, e no W5-F `/ — / o Sabiá como vem / ➖ /`) tem 3…
- `nucleo-04` · `fluxo/entrada.md` — O caso 2 só ensina a frase "<id> em <estado>: entre pela <dona>"
- `nucleo-09` · `fluxo/entrada.md` — O comando sugerido `git grep -l '<id>' <ref> -- '.kiro/specs/*/status.md'` depende de duas inferências
- `nucleo-10` · `cli/compilar.mjs` — O texto compilado diz só "Sem Saídas, segue para o próximo da lista"
- `nucleo-14` · `fluxo/entrada.md` — Strings de parada e marcadores aparecem com variações
- `nucleo-17` · `cli/compilar.mjs` — O tipos.md compilado cita "o envelope OKF ... é o do `okf-elm.md` da `sa-prd`" sem link, e o reescrever não…
- `nucleo-19` · `cli/sabia.mjs` — Mensagens que dizem mais do que aconteceu: (1) "Pronto: skills e MCPs instalados" aparece também com…

## 3. Decisões para a pessoa

Formato: contexto em 1 linha · opções separadas por ` · ` · recomendação · achados de origem. ⛔ = bloqueia a 2.0.0. "Divergência" = áreas recomendaram coisas diferentes; a recomendação escolhe uma.

**Bloqueiam a 2.0.0 (26):** D1, D2, D7, D9, D17, D28, D29, D30, D37, D40, D49, D50, D55, D56, D57, D58, D59, D60, D61, D62, D84, D85, D100, D101, D108, D109.

### 3.1 Identidade, papéis e permissões

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D1 ⛔ | Três regras para o login de quem está na sessão (sa-iniciar, sa-status, entrada.md); coluna local × retorno do EWM sem regra | (a) `equipe.json`: `login` = parte antes do @ do `git config user.email`, ou `nome` = `git config user.name`; sem casar, pergunta uma vez · (b) só `user.name` · (c) login no `sabia.md`. Divergência: EWM vence (coluna se corrige na sincronização) · coluna vence | (a) + EWM vence | nucleo-03, sustentacao-guias-17, triagem-26 |
| D2 ⛔ | Volta à especificação achada na REV, VER ou [APR]: o bloco grava na base, mas sa-revisor e sa-verificador têm `registros: []` e push da base negado | (a) quem acha grava só a branch; a base fica com quem o `Próximo:` indica · (b) revisor e verificador ganham `registros: [backlog, sprints]` e push da base com pergunta | (b): mantém "quem acha roda o bloco", o fluxo de hoje. **Divergência** (rev-ver: b; setup-assets: a) | rev-ver-01, setup-assets-02 |
| D3 | O encerrar não confere se quem mergeia é o responsável | recusa outro (a trava do desenvolver) · não confere | recusa | dev-33 |
| D4 | Verificador da fatia HITL sem papel definido; `—` aceito? | só QA · QA ou Dev ativo · qualquer ativo que não implementa | QA ou Dev ativo, `—` aceito | dev-31 |
| D5 | sa-especificador e sa-verificador rodam a sa-status sem `gitlab_listar_mrs` | (a) só o link do `status.md` (texto) · (b) `+gitlab-leitura` no papeis.json | (a) — **já aplicada** na integração (sa-status, sa-iniciar, chamadas.mjs); confirmar | chamadas-01 |
| D6 | Subagentes do projeto em quais agentes | (a) só desenvolvedor e orquestrador · (b) também produto e especificador | (a): W6 e steering já seguem (a) (setup-skill-14, 06); falta tirar `{{SUBAGENTES}}` do sa-especificador.md e o gerador recusar outro papel | setup-assets-15 |

### 3.2 Commits e entrega

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D7 ⛔ | Commits sem mensagem definida; "Mensagens do fluxo" não é lista fechada | aprovar a lista fechada, sempre com o id, com as novas: `<FT> trocar modo` · `planejamento: <equipe · acordos · roadmap · base do EWM>` · `EP-<nn> registrar protótipo v<N>` · `<FT> sincronizar modo` · `<FT> registrar bloqueio` · `<FT> abrir PR` · `<FT> registrar progresso` · as da virada (commit único, chave da sprint que fecha); `ELM - Sincronizar bundle` fica sem o padrão do projeto · outros nomes | aprovar. Fatiamento, refinamento, HITL e aprendizado já entraram na integração | setup-assets-04, codificar-15, planejamento-fluxos-13 |
| D8 | Padrão do projeto com id (`Task <id> - …`): qual id | `<id>` = tarefa EWM do papel que commita ([GB] na gestão), mensagem do fluxo = `<descrição>`, sem ELM só a mensagem; commit da setup: (a) pergunta o id no W9 · (b) sem id · (c) a pessoa commita | sim + (a) | setup-assets-05, setup-skill-10 |
| D9 ⛔ | Item de Sustentação em várias sessões deixa a ficha sem commit; a sessão seguinte para por árvore suja | (a) commit `<ID> registrar sessão` por sessão · (b) exceção no item 1 do Gravar na base · (c) fora da ficha até concluir | (a) | sustentacao-guias-01 |
| D10 | Push negado pela pessoa na confirmação | (a) é o "não": para em "aguardando o PR" · (b) toda recusa entrega o comando e espera | (a), também em sa-verificar decisao.md | codificar-11 |
| D11 | PR sem MCP gitlabpr e sem link na sessão | (a) a fase não avança, para em "aguardando o link" · (b) avança com `PR: texto entregue` (hoje) | (a) | codificar-12 |

### 3.3 Créditos e horas

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D12 | Valores da coluna Papel dos Créditos (fatia, épico, ficha, registro) | (a) sigla da tarefa: `DEV` `REV` `VER` `APR` `ESP` `ATD`… · (b) por extenso (`desenvolvimento`, `atendimento`…) | (a); na Revisão do épico, `ESP`. **Divergência** (sustentação: b) | formatos-01, sustentacao-guias-15, especificar-15 |
| D13 | Atividade dos Créditos de gestão com ou sem id | (a) sem id, lista fechada (+ `fatiamento`, `refinamento`); o id vai no comentário da [GB] · (b) com id, igual ao comentário | (a) — **já aplicada** na integração; confirmar | planejamento-refs-07, formatos-03, sustentacao-guias-15 |
| D14 | Créditos numa sessão do opencode (o creditos.py lê só o `~/.kiro`) | (a) não registra · (b) valor que a pessoa lê, Sessão `informado` | (a) | setup-assets-06 |
| D15 | Créditos em dobro ou faltando | retrospectiva de sprint não grava (fica a da sa-planejamento) · de fatia grava como gestão · Sustentação do P.O./SM só na ficha, sem a [GB] | confirmar os três | sustentacao-guias-16 |
| D16 | Saldo do SM na [GB] quando a virada não é conduzida pelo SM (`elm_lancar_horas` só lança para o dono) | (a) [GB] antiga fica aberta com `ELM pendente [GB <id> concluir]` · (b) conclui sem o saldo · (c) a virada exige o SM | (a) | planejamento-refs-06 |
| D17 ⛔ | Estimativa das tarefas [DEV], [REV], [VER] na publicação sem fonte; idem a [APR] do loop | (a) horas por papel na proposta · (b) tabela por tamanho P/M/G no acordos.md, ajustável por fatia · (c) nasce sem estimativa. [APR] do loop: perguntada uma vez no lote · valor fixo | (b) + [APR] perguntada no lote | planejamento-refs-02, planejamento-fluxos-04, codificar-28 |
| D18 | `HITL <h>h` da capacidade sem fórmula (a ausência já ficou dias úteis × horas-semana ÷ 5, refs-15) | (a) soma da [DEV] das fatias HITL · (b) adicional fixo no acordos.md · (c) sai | (a) com a D17-(b); sem ela, (c) | planejamento-refs-17, planejamento-fluxos-11 |
| D19 | `historico[].horas-revisao` sem definição; `reserva-sustentacao` ambígua | (a) capacidade de revisão planejada · (b) REV+APR+VER lançadas · (c) sai do schema. Reserva = % do acordo em fração · consumido | (c): ninguém grava nem lê, `horas-lancadas` já separa; reserva em fração. **Divergência** (refs e planejamento-fluxos: a) | planejamento-refs-14, planejamento-fluxos-29, formatos-25 |
| D20 | Horas do lote do orquestrador | toda fatia trabalhada (inclusive parada no GATE e bloqueada), rateio igual ajustável · só as de hoje | toda fatia | codificar-24 |

### 3.4 Métricas e painel

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D21 | Lead time sem eventos definidos | início `iniciada` · `planejada`; fim `pronta` (merge) · `concluida`; dias corridos · úteis | `iniciada` → `pronta`, dias corridos, 1 casa: mede o fluxo do time (a consolidação é do P.O.). **Divergência** (planejamento-fluxos: fim em `concluida`) | planejamento-refs-13, planejamento-fluxos-10, sustentacao-guias-30 |
| D22 | Números da retrospectiva sem definição | rodadas = contadores `revisão do código` + `verificação` do status.md · só revisão; correções humanas = linhas das Lições candidatas · L-nnn gravados; sem intervenção = AFK sem Retrabalho nem Lições; recorte fatia, épico, sprint como proposto | as primeiras | planejamento-refs-12, sustentacao-guias-30 |
| D23 | WIP "fatias esperando pessoa": por revisor (acordos.md) ou total do time (leitores sem o arquivo) | (a) por revisor; PR parado = `atualizado_em` há mais de 1 dia; o lote conta contra o Sênior da [APR] · (b) total do time | (a). **Divergência** (planejamento-fluxos: b) | dev-21, sustentacao-guias-20, planejamento-fluxos-09, codificar-27 |
| D24 | "Prazo vencendo" no painel | vencido ou até o próximo dia útil · outro nº de dias | o primeiro | sustentacao-guias-21 |
| D25 | "Consumido" da reserva; forma da linha da `## Review` | soma das estimativas (como a triagem) · horas lançadas (como o recalcular); uma conta nos três lugares; linha Review como proposta | estimativas, uma conta só | sustentacao-guias-22, planejamento-fluxos-18 |
| D26 | "Dado de cliente versionado" sem critério verificável | por caminho e extensão (`git ls-files`), fora `CT.csv`, `evidencias/`, `massa/` · julgamento do conteúdo | caminho e extensão | sustentacao-guias-23 |
| D27 | "Possível alteração" sem decisão na fatia HITL `aceita` | verificador, e conta como inconsistência · revisor | verificador | sustentacao-guias-24 |

### 3.5 Planejamento e EWM

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D28 ⛔ | Virada: ninguém cria o `sprint-<nn>.md` da próxima | (a) o `fechar`: decide a chave, grava cabeçalho mínimo e as migradas · (b) o `gravar` do fluxo sprint cria as `migrada de` | (a) | planejamento-fluxos-01 |
| D29 ⛔ | Pré-condições do fluxo sprint | (1) sprint aberta → manda à virada e para · planeja a próxima antes; (2) retrospectiva sem review → para · segue com o "sim" do P.O. | para, nos dois | planejamento-fluxos-05 |
| D30 ⛔ | `equipe.md` alternativo: quase todos os leitores só leem o JSON | (a) mantém, com mapeamento coluna → chave · (b) sai: só `equipe.json` com schema | (b) (as três áreas) | planejamento-refs-33, planejamento-fluxos-06, formatos-24 |
| D31 | Datas da sprint | início = dia seguinte ao fim da anterior, fim = início + 7×semanas − 1 · fim sempre na sexta (− 3) | a primeira | planejamento-fluxos-12 |
| D32 | Projeto sem ELM no `sprint-<nn>.md` | `**Iteração no EWM:** —`, sem marcador de publicação, Tarefa ELM `—` · guarda o nome "com ou sem ELM" | `—` | planejamento-refs-04 |
| D33 | Troca de modo na fatia iniciada: a pendência já vai ao Histórico do status.md (integração, refs-01); falta quem grava na branch | (a) o sa-produto troca para a branch (switch, `pull --ff-only`, commit com "sim") · (b) Observação da sprint, na base | (a) | planejamento-fluxos-07 |
| D34 | HITL → AFK recusado (Júnior ou PR aberto) | nada gravado · `modo: HITL mantido (<quem>, <data>)` | nada | planejamento-fluxos-22 |
| D35 | Quem mantém o roadmap.md | o planejamento da sprint grava os épicos novos · só o fluxo inicial, a pedido | só a pedido (fluxo de hoje) | planejamento-fluxos-27 |
| D36 | acordos.md e fluxo inicial | Cerimônias perguntada · sai; "rever equipe e acordos" termina depois de `acordos` · segue; "capacidade do time" fica no inicial · sai do gatilho | perguntada; termina; fica | planejamento-fluxos-28, planejamento-fluxos-34 |
| D37 ⛔ | O épico no EWM: o `pa` só tem `ib`, `defeito`, `tarefa`; a descrição do IB "depois do GATE" não tem dono | reconhecer: IB sem pai `[EP-…]` → a pessoa decide caso a caso · linha "Tipo do épico" no sabia.md. Descrição: a publicação da sa-especificar atualiza · a frase sai | IB + a pessoa decide; a frase sai | triagem-03, planejamento-refs-21 |
| D38 | Linhas "Critérios de aceite no IB" e "IB de defeito" do sabia.md: só o elm-sprint §3 as cita, sem origem nem condição | Critérios: fica (campo ou `descrição`; regravado pela sa-triar na aprovação da ficha e pela sa-especificar.fatia.concluir) · sai. IB de defeito: campo `Tipo` na ficha · trilha rápida = defeito · sai (o DF de origem já é o item) | Critérios fica; IB de defeito sai | planejamento-refs-19, planejamento-refs-20, setup-skill-17 |
| D39 | Prefixo `[FT-<nnn>]` no título do item de origem (DF ou IB do EWM) | pelas opções do §9 (renomear · só o prefixo · manter), como a Sustentação · mantém o título | como a Sustentação | planejamento-refs-24 |

### 3.6 Triagem, fatiamento e backlog

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D40 ⛔ | Saída do passo chegou com gravação pendente na sessão | (a) fecha a sessão (resumo, créditos, commit único) antes · (b) só avisa e para | (a) | triagem-02 |
| D41 | Motivo do cancelamento de item de Sustentação | (a) coluna `obs` nova na Sustentação do backlog · (b) `**Situação:** cancelado (<motivo>)` no registro (**já aplicado**, triagem-19) + Observação da sprint | (b), já no disco. A verificação recomendou (a) | triagem-08 |
| D42 | Várias faltas na `obs` (`origem EP-<nn>` sem dois-pontos já aplicado, formatos-09) | um só `falta:`, itens por vírgula, ordem fixa · um `falta:` por item, com ` · ` | o primeiro | triagem-09 |
| D43 | `**Origem:**` da ficha; trilha rápida com decisão nova | id do EWM ou chamado · pedido em texto; a rápida ganha `## Decisões` e Situação · não | id ou chamado; sim | triagem-10 |
| D44 | Decisão bloqueante no decisoes.md (o PRD já tem `Bloqueia?` em Em aberto, prd-21) | `bloqueia: sim` ou `não` dentro da Decisão · coluna nova | dentro da Decisão | triagem-12 |
| D45 | Lote do EWM: as perguntas do registrar | padrões fixos aceitos pelo "sim" da tabela, com colunas Responsável e Estimativa · para e pergunta nas linhas de épico e de Sustentação | padrões fixos | triagem-15 |
| D46 | `**Pedido por:**` no atendimento | pergunta A-7 nova · `—` | A-7 | triagem-18 |
| D47 | Conflito de id depois do fim da triagem | (a) volta ao sa-produto e retoma no bloco de conflito · (b) comando pronto com as instruções | (a) | triagem-23 |
| D48 | Regra de nome: slug e `nn` | slug kebab-case sem acento, sem artigos/preposições, até 5 palavras · sem corte; pasta antecipada do épico sempre · só com 3+ palavras; `nn` = 2 dígitos de 01 por pasta `elm/`, e a fatia segue a numeração do épico · recomeça em 01; `CT.csv` sai da célula Arquivo para o `$comment` | com corte; sempre; segue a do épico (as cópias do épico ficam na fatia com o mesmo nome); sim | triagem-20, nucleo-13 |
| D49 ⛔ | Ids no fatiamento e avanço de `Próximos ids` | (a) provisórios até o gravar, reais depois do pull; conflito de push renumera só os não publicados, IB incluído · (b) reais desde o rascunho; conflito refaz tudo | (a) | fatiar-23 |
| D50 ⛔ | Fatia que depende de outra não pronta passa na DoR? | (a) sim; `bloqueada-por` só no planejamento e no início · (b) nasce `nova` com `falta: dependência FT-<mmm>` | (a) | fatiar-06 |
| D51 | Refinamento: casos sem regra | fatia `pronta` com artefato a mudar: o P.O. abre a correção pela sa-triar · espera a consolidação; cancelar fatia com dependentes: tira o id do `bloqueada-por` e mostra · cancela junto · para; todas canceladas sem concluída: o épico cancela no mesmo commit · fica `iniciado`; [ESP] FT da cancelada: conclui com as horas, cancela sem · sempre cancela; conceitos não publicados ficam na base · apagados; DoR reaplicada só ao épico refinado · a todo o backlog; `planejada` que perdeu a DoR: o P.O. escolhe sair ou virar especificação · sai sempre | as primeiras, em todos | fatiar-05, fatiar-07, fatiar-08, fatiar-10, fatiar-32 |
| D52 | Prefactoring e refatoração larga | ficam no plano da primeira fatia que precisa · viram fatia sem cenário (exceção) | no plano | fatiar-19 |
| D53 | Fatiamento acha conceito do PRD a mudar | o P.O. ou o SM registra pelo bloco Volta antes de passar · só "use sa-prd.mudanca" | registra | fatiar-31 |
| D54 | Termo novo numa entrevista de fatia: o "decisoes.md da fatia" não existe e `termo pendente` não está na lista | (a) linha `termo pendente` na `## Decisões` da ficha + valor na lista · (b) o caso sai da linguagem.md e da consolidação: nenhum fluxo entrevista na branch | (b) | triagem-13, formatos-22, consolidar-elm-10 |

### 3.7 Especificação e PRD

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D55 ⛔ | `rascunho.md` do épico sem padrão; a sessão local mais recente é deduzida | padrão com Pedido · Levantamento · Dúvidas · Protótipo (estados fechados) · ELM pendente; a data local = última linha de Créditos do status.md do épico · linha nova de sessão no rascunho · outro arquivo | padrão + Créditos | especificar-03, formatos-21 |
| D56 ⛔ | Retomada da publicação (PRD na base) fecha a sessão no início e entra em ciclo | (a) não fecha no início (fecha no Pare se do publicar ou no fim do concluir) · (b) mantém e quebra o ciclo com "volte a quem chamou" | (a) | especificar-02 |
| D57 ⛔ | Reunião na mudança do PRD: o transcricao exige a linha `iniciada` da [ESP] | (a) a linha é gravada ao reabrir, em commit próprio · (b) o transcricao aceita `concluida`/`planejada` vindo da sa-prd.mudanca | (a) | especificar-04 |
| D58 ⛔ | [ESP] FT: dono e pendências | não toca o `responsavel` da fatia; quem especifica só na linha da sprint; pendências do ELM sempre no rodapé da ficha (base), também na fatia iniciada · outra regra | sim aos dois | especificar-05, especificar-06 |
| D59 ⛔ | Mudança do PRD já na base: onde se edita até o GATE | (a) direto na base; o commit do GATE leva a pasta do épico (exceção no Gravar na base) · (b) cópia na pasta de trabalho | (a) | prd-01 |
| D60 ⛔ | Pesquisa fora de uma fatia (épico, AT): o sa-pesquisar exige a pasta da fatia | (a) devolve os fatos (arquivo:linha) na resposta e não grava; quem chama guarda: épico → Fonte no decisoes.md; AT → seção `## Pesquisa de código` do registro · (b) `research.md` na pasta de trabalho do épico ou em `.sabia/local/…/AT-<nnn>/` | (a): o pesquisar.md já faz assim para o fatiamento (fatiar-01). **Divergência** (prd: research.md no épico) | prd-02, codificar-02, sustentacao-guias-02 |
| D61 ⛔ | Projeto sem ELM: histórias e regras do PRD | (a) conceitos em `elm/` igual, `type` = Nome do catálogo, sem tags, No ELM `—`, nunca publicados · (b) tudo no prd.md | (a) | prd-03 |
| D62 ⛔ | CT já publicado que muda (o MCP não atualiza CT) | roteiro manual + `ELM pendente [CT-<nn> … atualizar]` · CT novo e o antigo deprecated | roteiro manual | prd-04, consolidar-elm-28 |
| D63 | ATA com o PRD na base: onde nasce | (a) na base, no commit do passo decisoes · (b) pasta de trabalho, copiada no commit | (a) | especificar-07 |
| D64 | Ordem do fechar-sessao | (a) horas, script e prévia completa com "Registrar? (sim)" · (b) pergunta única, script depois | (a) | especificar-12 |
| D65 | [ESP] EP-<nn> Revisão <n> no status.md do épico | campo [ESP] = id da Revisão · o da primeira; Início muda · fica; Papel pela D12 | id da Revisão; Início fica | especificar-15 |
| D66 | Decisão substituída (a triagem já grava só `decidida — substitui D-nn`, triagem-11) | a antiga muda para `substituída` · fica como está; exceção ao "só acréscimo" para a linha reservada pela ATA draft · sem exceção | fica + exceção | especificar-16 |
| D67 | Quem decide numa reunião | (a) P.O. do épico e o representante do cliente marcado no transcricao · (b) só o P.O. | (a) | especificar-18 |
| D68 | Protótipo com vários arquivos | (a) `prototipo-v<N>-<slug>-<nn>.<ext>` por tela · (b) um arquivo só (PDF ou zip) | (a) | especificar-20 |
| D69 | Retomar a sa-prd (inclusive a mudança em `em-revisao (de: aprovado)`) sem deduzir o passo | um roteador: o encaminhar da sa-especificar escolhe pela Fase e pelo último `revisao-prd-<N>.md` · registro explícito do passo · a sa-prd.mudanca aceita a Fase | roteador único | especificar-21, prd-13 |
| D70 | Commit das mudanças da ficha na [ESP] FT | (a) `FT-<nnn> completar ficha` no trabalho; as dos artefatos no aprovacao · (b) tudo no aprovacao ou no concluir | (a) | especificar-25 |
| D71 | Fatia que conclui a [ESP] FT e fica `elegivel` | sprint `—` no backlog (entra pelo encaixe) · mantém a chave | `—` | especificar-27 |
| D72 | Guia da [ESP] FT na fatia iniciada | linha com Especificado `—` + filtro do elm-publicar · Bloqueio do status.md | o primeiro | especificar-28 |
| D73 | ATA: casos de borda | transcrição trocada depois da ATA aprovada: refaz a mesma (draft e nova aprovação) · ATA nova; sem "sim" para publicar: segue aos D-nn · para; sem sigla ATA no `pa` ou sem ELM: `type` `Ata de reunião` sem tags · outro | refaz; segue; `Ata de reunião` | especificar-32, especificar-33, especificar-34 |
| D74 | Aprovação do protótipo depende de ATA não aprovada | "aguardando" e fecha a sessão · chama a reunião | aguardando | especificar-36 |
| D75 | `inclui` da [ESP] FT com similar `igual` ou `sobrepõe` | a Ação muda (reutilizar sai; alterar vira `altera`, com autorização do P.O./SM) · só no Motivo | a Ação muda | especificar-37 |
| D76 | Teto de 2 rodadas sem aprovação | PRD e [ESP] FT: a pessoa decide achado a achado (aceito vai ao GATE; negócio volta à entrevista) · bloqueia o GATE; P12 fora da rubrica da fatia. Plano: HITL a pessoa decide; AFK GATE obrigatório do Sênior com o `analise-plano-2.md` · `bloqueada`. Código AFK: 2 reprovações desde o último desbloqueio (contando as depois de rejeição na VER), "zera" só o teto · 2 no total | as primeiras | prd-15, especificar-44, dev-13, codificar-09 |
| D77 | Similares sem o MCP elm ou sem bundle | `novo (não verificado)` e a publicação refaz · para; Impacto `pendente (sem bundle)` revisto antes do GATE · pede a sa-sync | as primeiras | prd-08 |
| D78 | Mudança do PRD desistida antes do GATE | (a) revert do commit de abertura, Fase volta a `aprovado` · (b) `desistida` na linha de Mudanças | (a) | prd-09 |
| D79 | Transcrição nova numa mudança do PRD | (a) a mudança abre a versão e passa ao sa-especificar, cujo encaminhar chama a reunião · (b) ampliar o `quando` do reuniao | (a) | prd-11 |
| D80 | Contrato do toolkit violado na volta ao escrever | completa sem registrar (toolkit transparente) · registra no status.md | completa sem registrar | prd-14 |
| D81 | Campo `demanda` do PRD | id do IB do épico · item de origem do EWM | IB do épico | prd-17 |
| D82 | IB do épico `pendente` quando o PRD começa | anota e segue · o especificador cria pelo §3 | anota e segue | prd-18 |
| D83 | Valores do PRD sem lista | No ELM do CT planejado: `novo` · o da HF · `—`; Tipo do EL: `texto` `número` `data` `moeda` `lista` `sim/não` `arquivo` (outro → em aberto) · livre; rótulo do reutilizado: `<sigla>-<id do ELM>` · `REG-nn` da série | `novo`; lista fechada; `<sigla>-<id>` | prd-28, prd-31, prd-33 |

### 3.8 Plano, desenvolvimento e loop

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D84 ⛔ | Ajuste pedido no GATE do plano: nenhum passo da sa-plano o lê; Achados de origem `GATE do plano` podem virar tarefa de código | destino `sa-plano.plano`, passo `escrever` (já em fases.md, rev-ver-36; o Responsável já volta, dev-02) · `sa-plano.replanejar`; o achado fica em Achados abertos e fecha com `resolvido — plano` · só no Histórico; volta ao gate = a mesma [APR], sem perguntar ao Pleno nem o aprovador; Achados abertos = fonte única das [R<n>], filtrada por origem, com a Situação `aceito — <login>: <motivo>` | `sa-plano.plano` + Achados abertos + fonte única | dev-01, rev-ver-13, codificar-07 |
| D85 ⛔ | "Seguir com o plano acima do limite" do P.O. não fica registrado; a retomada bloqueia de novo | (a) `obs` `plano acima do limite: seguir (<P.O.>, <data>)` na linha da fatia, gravada pela sa-fatiar.refinamento · (b) conversa + Histórico | (a) | dev-03 |
| D86 | [DEV] fechada e PR mergeado achados no iniciar | (a) sincronização da sprint (P.O./SM) · (b) fluxo encerrar | (a) | dev-06 |
| D87 | Campo Banco: `aplicada em dev` e `aplicada em prod` sem quem grava | dev: o Dev na sa-codificar, ao confirmar a DDL com o time de banco; prod: a sa-executar do item BD/Implantação · os dois valores saem | o primeiro | dev-08 |
| D88 | Análise do plano sem subagente | noutra sessão (sa-revisor, sa-revisar.revisar) e a sa-plano retoma no gate pelo `analise-plano-<N>.md` · exige subagente | noutra sessão | dev-14 |
| D89 | Fase durante o replanejar | `planejando` (o padrão) · `implementando` | `planejando` | dev-16 |
| D90 | Sem GATE: horas e push | lança as horas sempre, push opcional · um commit só (hoje) | horas sempre | dev-27 |
| D91 | Critério de risco para AFK → HITL | mais de 6 cenários no contrato de pronto; sensível = dinheiro, acesso, dado pessoal · outro | sim | dev-35 |
| D92 | Defeito fora do Cobre achado na pesquisa | entra só se no Cobre, senão item novo pela sa-triar; AUTONOMO → `bloqueada (de: pesquisando)` · outro | sim | dev-43 |
| D93 | status.md da fatia leva os comentários de regra do padrão? | só a estrutura · tudo | só a estrutura | dev-44 |
| D94 | Retomada em `verificando` (AFK) | direto ao verificar · validar e revisar de novo | direto | codificar-05 |
| D95 | Vermelho na validação completa | tarefa nova no tasks.md e volta ao passo tarefa · corrige direto | tarefa nova | codificar-06 |
| D96 | Falha de ambiente: marcador e fecho | status.md: `bloqueada (de: <fase>)` com Bloqueio `⚠️ ambiente: <o que faltou>` · `AMBIENTE: <comando> — <falha>` · só Histórico. VER: valor `VERIFICACAO: AMBIENTE` · REJEITADO com bloqueio. REV C3: `VEREDITO: REVISAR` com achado AMBIENTE que não conta · `VEREDITO: AMBIENTE` · para sem relatório. Quem chama para sem contar rejeição nem rodada | `⚠️ ambiente:` e um valor `AMBIENTE` nos dois fechos. **Divergência** (rev-ver-17: REVISAR, para não mexer em quem chama) | codificar-14, setup-assets-18, rev-ver-11, rev-ver-17 |
| D97 | ADR | nome **já aplicado** (`0001-<slug>` ou o padrão da pasta, formatos-27) e o corpo no pr.md; padrão próprio `sa-codificar/adr.md` · não | confirmar o aplicado; sem padrão próprio | codificar-17, consolidar-elm-09 |
| D98 | Log do loop e retomada | Fase = 1–8 do loop e Rodada = contador da fase em curso · Rodada = nº da fase; finalizada = `aguardando-aprovacao-pr`, `verificada` sem PR, `bloqueada` (o `aguardando-aprovacao-plano` retoma) · inclui o do plano; retrabalho depois do PR: pelo log do lote, valendo a autorização dada · lote novo · só o Dev | Fase + contador; o primeiro; pelo log | codificar-21, codificar-22, formatos-19 |
| D99 | Loop sem equipe.json ou quem dispara sem papel Dev | não roda e indica a sa-planejamento.inicial · pergunta a senioridade e segue | não roda | codificar-26 |

### 3.9 Revisão, verificação e CT.csv

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D100 ⛔ | Fatia HITL `bloqueada (de: em-verificacao)` por ambiente ou pela pergunta da ficha: ninguém retoma e não há entrega | o verificador retoma pela sa-verificar quando o Bloqueio se resolve; entrega e horas como no rejeitado · devolve ao Dev | o verificador | rev-ver-02 |
| D101 ⛔ | CT.csv: Status com `qm` (o `pa` não tem o estado; 11.26: "o que o pa/template definir"), cabeçalho e trilha rápida | Status: pergunta no bloco 9 do elm-pa · linha 8 do W4 · o mcp-elm descobre os estados; linha 1 = cabeçalho · sem cabeçalho; rápida: um CT por comportamento do bugfix.md · sem CT.csv | bloco 9; cabeçalho; um CT por comportamento | setup-skill-01, rev-ver-21, rev-ver-05 |
| D102 | Nome do relatório da revisão P de uma [ESP] FT | `revisao-esp-<N>.md` em `.sabia/local/especificacao/FT-<nnn>-<slug>/` · outro | o primeiro | rev-ver-07 |
| D103 | Quem grava `verificando` no AFK | (a) o verificador subagente, no roteiro (corrige o padrão) · (b) quem pede a verificação | (a) | rev-ver-08 |
| D104 | Rodadas no verificacao.md (o bloco Decisão por rodada já entrou, rev-ver-03) | `## Rodada <N>` acrescentada sem apagar; rodada nova só ❌ + repetição (AFK e HITL); CT.csv pelo último ✅ · reescreve no lugar; no HITL roda tudo | acrescentar + a regra do AFK | rev-ver-09, formatos-20 |
| D105 | HITL: cenário que o verificador atribui ao artefato, antes da decisão da pessoa | (a) 🔁 provisório também no HITL; CT.csv depois da decisão · (b) ❌ sempre | (a) | rev-ver-10 |
| D106 | Cenários rejeitados na VER | só no verificacao.md (como a REV) · também em Achados abertos (Origem VER) | só no verificacao.md | rev-ver-12 |
| D107 | Canal da lição e da aprovação do PR AFK (a aprovação não faz commit) | com MCP: tudo no comentário da [APR]; sem MCP: comentário no MR · texto entregue para o Dev colar | comentário da [APR]; sem MCP, no MR | rev-ver-18 |

### 3.10 Consolidação e ELM

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D108 ⛔ | ET as-built: ninguém grava `stable` e `verified`; o `at` e os `sources` sem ET inicial não têm fonte | sem toolkit: HITL = data do commit do `revisao-codigo-<N>.md` APROVADO; AFK = a linha `PR aprovado por` · o instante da consolidação. Com toolkit: quem consolida, depois do "sim". `sources` = design.md (+ ficha sem épico) · nada | os primeiros | consolidar-elm-01, codificar-18 |
| D109 ⛔ | `last_modified` depois de publicar (o `elm_publicar_req` não devolve) | `elm_ler_req(id)` logo depois · o mcp-elm passa a devolver `modificado` | ler logo depois | consolidar-elm-02 |
| D110 | Drift na consolidação | sem sprint aberta: ` · débito de especificação (sem sprint)` + a linha do Histórico; campo vazio com a pessoa fora da sessão: para `aguardando <login>` · trata como `não` | os primeiros | consolidar-elm-07, consolidar-elm-08 |
| D111 | ET as-built faltando no PR | segue; o P.O./SM publica ao resolver a pendência · para · fatia nova | segue | consolidar-elm-16 |
| D112 | Conclusão do IB/épico e créditos antes do commit e do push da base | depois do push conferido, no `fechar` (regra da Entrega) · confirmação única no `elm` | depois do push | consolidar-elm-17 |
| D113 | Sem a [GB] | só indica a sa-planejamento.inicial · cria pelo §2 com "sim" | só indica | consolidar-elm-25 |

### 3.11 Sustentação e aprendizado

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D114 | Fontes do atendimento a critério do modelo | tabela por tipo de pedido (pesquisa de código obrigatória em regra ou comportamento, salvo dispensa) + campo `**Base da resposta:**` · como hoje | a tabela + o campo | sustentacao-guias-03 |
| D115 | Sem MCP de banco | o agente escreve o SQL, a pessoa roda e informa · para | o primeiro | sustentacao-guias-04 |
| D116 | `**Saída:**` do registro (valores fechados **já aplicados**, formatos-18) | guarda só a escolha; o vínculo fica na fatia · a sa-triar e a sa-aprender gravam o id de volta | o primeiro; confirmar | sustentacao-guias-07 |
| D117 | Consulta reaproveitável do atendimento | catálogo `sustentacao/atendimento/consultas.md`; lição só para erro corrigido · lição de tipo novo · glossário ou ADR | catálogo | sustentacao-guias-08 |
| D118 | Situação da lição | muda no lugar ("só acréscimo" vale para o conteúdo); `aplicada` por quem corrigiu, `descartada` por quem recusou · uma linha nova por mudança | no lugar | sustentacao-guias-09 |
| D119 | "Mesmo tipo" de erro sem campo (2ª ocorrência; calibração do revisor por `revisao-branda`) | critério objetivo: mesma causa + mesma Correção na fonte, com confirmação; no revisor, o mesmo item de rubrica no Feito, lendo o `licoes.md` da base · campo `Tipo` novo · julgamento livre | critério objetivo + base | sustentacao-guias-10, rev-ver-30 |
| D120 | Casos de avaliação em `aprendizado/avaliacoes/`: ninguém os lê | padrão novo, um por lição promovida · a frase sai até haver fluxo que os rode | a frase sai | sustentacao-guias-11 |
| D121 | Promoção proposta durante a consolidação | anota e mostra no fecho, sem interromper · a consolidação termina passando à sa-aprender.promover | anota | consolidar-elm-19 |

### 3.12 Setup e núcleo

| D | Contexto | Opções | Recomendo | Origem |
|---|---|---|---|---|
| D122 | Conferência do sabia.md contra o modelo lê o arquivo do disco, que só existe depois do "ok" | (a) depois de gravado no d., corrige e roda de novo · (b) `--sabia-md <rascunho>` antes do W8 | (a) | setup-skill-02 |
| D123 | Onde se diz sim a um toolkit com `tipos` | W5, uma linha por toolkit de tipo · W6 de cada dono · entra sozinho se detectado | W5 | setup-skill-04 |
| D124 | backlog.md mínimo | cabeçalho e separador nas tabelas; Sustentação com `—` · seções vazias | o primeiro | setup-skill-13 |
| D125 | Espelhamento na setup sem equipe.json | pula a Sustentação e a [GB] · pergunta o SM · não oferece | pula | setup-skill-22 |
| D126 | Steering que falta | a pessoa roda "Generate Steering Docs" e a setup relê · a setup escreve um rascunho e grava no Passo 8 | a pessoa | setup-skill-23 |
| D127 | Nome do `pa_<nome>.json` | nome da PA do EWM, minúsculas, sem acento, hífen · a pessoa diz · nome do produto | o primeiro | setup-skill-25 |
| D128 | Glossário ou ADR `null` no prompt do agente | (a) a linha sai do prompt (a SKILL já diz isso, setup-skill-09; muda o gerador e o teste) · (b) `não há` + destino | (a) | setup-assets-08 |
| D129 | Fluxo que trabalha na branch da fatia não é declarado | (a) campo `branch: fatia` ou `nao` no passo entrada, validado pelo compilador · (b) lista no texto da entrada.md; "não" à troca de branch → para | (a) + para | nucleo-06 |
| D130 | IB de épico e IB de estrutura na entrada | épico → a linha do épico · as fatias dele; estrutura → lista os itens não terminais e pergunta | o primeiro + lista | nucleo-07 |
| D131 | README: "os seis passam no `kiro-cli agent validate`" (são sete) e a verificação pendente da ATA/EL numa PA real | conferir antes da 2.0.0 e atualizar · vira limitação conhecida | conferir os sete; ATA/EL como limitação conhecida (preservar as alterações da pessoa no README) | nucleo-20 |

## 4. O que ficou de fora

| Item | Por quê / para onde |
|---|---|
| `description` de skill acima de 1024 caracteres (7 skills + o toolkit de batch do projeto real) | lote seguinte, já decidido (11.27): enxugar + teste de 1024 |
| `description` de agente de toolkit em português (`spring-batch-job`) | mesmo lote, com versão nova dos toolkits |
| Nomes e campos dos JSON internos em inglês | lote da 11.28 |
| Índice dos toolkits (`index.json` no `sabia-toolkits`) | lote da 11.28 |
| [APR] na sa-desenvolver? · sa-verificar com `hitl`? | 11.29: nota sem decisão, analisar depois desta revisão |
| Passo de "pistas" nos fluxos HITL | 11.30: v2.0.1 |
| 30 falsos positivos | descartados na verificação, com motivo em `resultados.json` (triagem-21, 27 · especificar-39, 40, 48 · prd-10, 37 · fatiar-30 · planejamento-fluxos-14, 21, 30, 35 · codificar-03 · os demais nos retornos de cada área) |
| 1 achado real da área dev sem destino registrado | um entre dev-23, 40, 42 e 46: conferir antes do commit |
| Aplicado na integração sem decisão explícita, para confirmar | Atividade dos Créditos de gestão sem id + `fatiamento`/`refinamento` (D13) · o `Responsável` volta a quem implementa no ajuste do plano (dev-02, ligado à D84) · `encaixe: trazida do EWM — entra como especificação (<quem aprovou>, <data>)` também no arquivos.md:265 e no elm-sprint.md:647 |
| Avisos do `gerar_agentes.py` no projeto alta (rito.md com base mudada; "Publicar requisitos" no `.sabia/sabia.md` do alta) | vêm de arquivos do projeto alta, não do framework; o projeto não foi tocado |
| Commit | nada commitado nesta revisão (pedido da rodada) |

## 5. Respostas da pessoa (05/11)

| # | Decisão |
|---|---|
| D1 | `equipe.json` com o login = a parte antes do @ do `git config user.email` (ou o nome = `git config user.name`); sem casar, pergunta uma vez. Na divergência entre a coluna e o EWM, **o EWM vence** e a coluna se corrige na sincronização |
| D2 | **Quem acha grava só na branch:** atualiza o `status.md` (bloqueada, possível alteração) e **reabre a tarefa [ESP] no EWM**. Não grava na base: nesse ponto a base já está diferente da branch da feature. O revisor e o verificador continuam sem `registros` e sem push na base; a linha da base fica para o especificador, ao assumir a [ESP] |
| D7 | aprovada a lista fechada de mensagens de commit, sempre com o id, com as novas da recomendação |
| D9 | commit `<ID> registrar sessão` por sessão de um item de Sustentação |
| D17 | tabela de horas por papel para cada tamanho (P/M/G) no `acordos.md`, ajustável por fatia na proposta; a [APR] do loop é perguntada uma vez por lote |
| D28 | o passo `fechar` da virada decide a chave da próxima sprint, grava o cabeçalho mínimo do `sprint-<nn>.md` e já inclui as fatias migradas, no commit da virada |
| D29 | o fluxo sprint para nos dois casos: com a sprint aberta, manda para a virada; com a retrospectiva sem a review, manda fazer a review antes |
| D30 | sai o `equipe.md`; fica só o `equipe.json`, com JSON Schema |
| D37 | o épico é um **IB**, porque o ELM não permite criar o tipo Épico; um IB sem pai `[EP-…]` a pessoa decide caso a caso. Sai a frase da descrição do IB "depois do GATE" (é a opção 1, lida da resposta "1 - ELM não liberado para criar tipo épico, por isso utilizamos IB") |
| D40 | antes de encaminhar, o `chegou` fecha a sessão pendente: resumo, créditos e um commit único |
| D49 | ids provisórios até o `gravar`; os reais saem depois do pull, e um conflito de push renumera só os não publicados, IB incluído |
| D50 | a fatia dependente passa na DoR; o `bloqueada-por` é conferido só no planejamento e no início do desenvolvimento |
| D55 | padrão do `rascunho.md` com Pedido · Levantamento · Dúvidas · Protótipo (estados fechados) · ELM pendente; a sessão mais recente é a última linha de Créditos do `status.md` do épico |
| D56 | a retomada da publicação não fecha a sessão no início; fecha no Pare se do `publicar` ou no fim do `concluir` |
| D57 | ao reabrir a [ESP], a `sa-prd.mudanca` grava a linha da Especificação `iniciada` na sprint, num commit próprio |
| D58 | a [ESP] FT não toca o `responsavel` da fatia (quem especifica fica só na linha da sprint); as pendências do ELM ficam sempre no rodapé da ficha, na base, também na fatia iniciada |
| D59 | **direto na base** (recomendação; a pessoa trocou a escolha em 05/11): a mudança edita na pasta do épico na base, e o commit do GATE leva essa pasta (exceção explícita no "Gravar na base") |
| D60 | fora de uma fatia, o pesquisador devolve os fatos (arquivo:linha) na resposta e não grava; quem chamou guarda (épico → Fonte do `decisoes.md`; AT → `## Pesquisa de código` do registro) |
| D61 | sem ELM, os conceitos ficam em `elm/` do mesmo jeito (`type` = o nome do catálogo, sem tags, No ELM `—`) e nunca são publicados |
| D62 | CT já publicado que muda: roteiro manual + `ELM pendente [CT-<nn> … atualizar]` |
| D84 | o ajuste pedido na [APR] do plano volta a `sa-plano.plano` (passo `escrever`) e o Responsável volta a quem implementa. O achado fica em Achados abertos (origem GATE do plano) e fecha com `resolvido — plano`. A volta ao GATE é a mesma [APR], sem perguntar de novo, e Achados abertos é a fonte única dos achados |
| D85 | `obs` da fatia `plano acima do limite: seguir (<P.O.>, <data>)`, gravada pela `sa-fatiar.refinamento`; a retomada lê e não bloqueia |
| D100 | o verificador retoma pela `sa-verificar.hitl` quando o Bloqueio se resolve; a entrega e as horas seguem como no rejeitado |
| D101 | com `qm`, a setup pergunta o estado de aprovado no bloco 9 do elm-pa e grava no `Status=` do sabia.md; a linha 1 do CT.csv é o cabeçalho; na rápida, um CT por comportamento do `bugfix.md` |
| D108 | **(a), como está:** o Dev escreve a ET as-built no PR, o revisor a julga (C15), e na consolidação o P.O./SM a ajusta (toolkit do tipo ET, se houver), publica e liga à [DEV]; `stable`/`verified` são gravados por quem consolida, no momento da consolidação (opção 2); sem ET inicial, `sources` fica vazio |
| D109 | o `publicar` chama `elm_ler_req(id)` logo depois de publicar e grava o `last_modified` no conceito |

**Implementação das 26 ⛔ (05/11, commit aa6badf).** A pessoa confirmou os dois pontos em aberto, como estão:
- `EP-<nn> registrar protótipo v<N>` só na mudança de um PRD que já está na base; antes do GATE, o protótipo fica na
  pasta local, sem commit;
- o conflito no merge usa `<FT> registrar bloqueio`.
Para as 105 restantes, entram também: o achado de origem `ambiente` que nenhum fluxo fecha, e o encaixe que grava
`responsavel` no épico enquanto a tabela Épicos tem `po`.

**Decisões restantes, por gravidade (05/11):**

| # | Decisão |
|---|---|
| D8 | `<id>` = a tarefa do EWM do papel que commita ([GB] nos commits de gestão); a mensagem do fluxo é a `<descrição>`; sem ELM, só a mensagem. No commit da setup, o W9 pergunta qual id usar |
| D10 | push recusado na confirmação = o "não": o fluxo para em "aguardando o PR" (também na entrega da sa-verificar) |
| D11 | **mantém o de hoje:** sem o gitlabpr e sem o link, a fase avança com `PR: texto entregue`. Exigir o link seria uma trava a mais, já que o Dev pode ter aberto o PR por fora do Sabiá |
| D12 | coluna Papel dos Créditos = a sigla da tarefa: `DEV` `REV` `VER` `APR` `ESP` `ATD`… (na Revisão do épico, `ESP`) |
| D13 | **com id** (desfaz o que a integração tinha aplicado): a Atividade dos Créditos de gestão leva o id do item. Motivo da pessoa: alguns repositórios têm o hook do ELM ativo, que exige o id do work item no commit. O hook é decisão de cada projeto, então o framework deve sempre produzir mensagens com o `<id>` |
| D14 | o `creditos.py` vale só para o Kiro; no opencode não se registra crédito de sessão |
| D15 | confirmadas as três regras: a retrospectiva de sprint não grava créditos próprios (vale a linha da sa-planejamento); a retrospectiva de fatia grava como gestão; a Sustentação feita pelo P.O./SM grava só no registro, sem a [GB] |
| D16 | **conclui sem o saldo:** a [GB] antiga é concluída sem lançar o saldo do SM, e o SM lança depois. Princípio da pessoa: **lançar horas é uma ajuda, não uma obrigação do Sabiá; nunca bloquear o processo por causa disso.** A orientação é perguntar e registrar, porque a pessoa pode não ter como abrir o ELM e lançar as horas |
| D18 | `HITL <h>h` da capacidade = a soma das horas estimadas da [DEV] das fatias HITL da sprint (pela tabela P/M/G da D17) |
| D19 | `historico[].horas-revisao` sai do schema (o `horas-lancadas` já separa); `reserva-sustentacao` = o % do acordo, gravado em fração (0,2) |
| D20 | horas do lote do orquestrador: rateio igual, ajustável, entre toda fatia que o lote tocou, inclusive as paradas no GATE e as bloqueadas |
| D21 | lead time = de `iniciada` até `pronta` (merge), em dias corridos, com 1 casa decimal |
| D22 | números da retrospectiva: rodadas = contadores `revisão do código` + `verificação` do status.md; correções humanas = linhas das Lições candidatas; sem intervenção = AFK sem Retrabalho nem Lições; recorte por fatia, épico e sprint |
| D23 | WIP "esperando pessoa" contado por revisor; PR parado = `atualizado_em` há mais de 1 dia; o lote conta contra o Sênior da [APR] |
| D24 | "prazo vencendo" = vencido ou vence até o próximo dia útil |
| D25 | consumido da reserva = soma das estimativas, a mesma conta nos três lugares; a linha da `## Review` como proposta |
| D26 | "dado de cliente versionado" detectado pelo caminho e pela extensão (`git ls-files`), fora `CT.csv`, `evidencias/` e `massa/` |
| D31 | início da sprint = dia seguinte ao fim da anterior; fim = início + 7×semanas − 1 |
| D32 | sem ELM, o `sprint-<nn>.md` traz `**Iteração no EWM:** —`, sem marcador de publicação e com a Tarefa ELM `—` |
| D33 | a pendência da troca de modo **fica na branch** (Histórico do `status.md`) e chega à base no merge, como todo o resto; não há cópia na base. Grava quem faz a troca, na branch da fatia |
| D13 ↩ | a pessoa pediu para voltar a ela depois, com uma explicação melhor (o que é a Atividade dos Créditos de gestão, onde aparece e a relação com o id do commit) |
| D35 | o roadmap.md só muda a pedido (fluxo inicial do planejamento), como hoje |
| D38 | a linha "Critérios de aceite no IB" fica (campo do IB ou a descrição, regravada pela sa-triar na aprovação da ficha e pela [ESP] FT na conclusão); a linha "IB de defeito" sai, porque o DF de origem já é o item |
| D41 | o motivo do cancelamento de um item de Sustentação vai em `**Situação:** cancelado (<motivo>)` no registro e na Observação da sprint |
| D42 | várias faltas na obs: um só `falta:`, com os itens separados por vírgula e em ordem fixa |
| D43 | `**Origem:**` da ficha = o id do EWM (DF/IB) ou o número do chamado; a rápida com decisão nova ganha `## Decisões` e a Situação |
| D44 | decisão bloqueante: `bloqueia: sim` ou `bloqueia: não` escrito dentro da Decisão, no decisoes.md |
| D45 | lote do EWM: valores padrão fixos, aceitos pelo "sim" da tabela, que ganha as colunas Responsável e Estimativa |
| D46 | atendimento: a pergunta nova A-7 ("quem pediu?") alimenta o `**Pedido por:**` |
| D47 | conflito de id depois do fim da triagem: a pessoa volta ao sa-produto, que retoma no bloco de conflito e renumera |
| D48 | slug kebab-case sem acento e sem artigos/preposições, com corte em 5 palavras; pasta antecipada do épico sempre; `nn` com 2 dígitos a partir de 01 por `elm/`, e na fatia segue a numeração do épico; `CT.csv` sai da célula Arquivo e vai para o `$comment` |
| D51 ↩ | a pessoa pediu para voltar a ela depois, com uma explicação melhor (os 7 casos do refinamento) |
| D52 | **prefactoring e refatoração larga não são fatia nem plano: são um épico.** O caso "várias fatias precisam de uma mudança técnica" sai dos fluxos; o caminho é a triagem de um épico técnico |
| D54 | o caso "termo novo na entrevista de fatia" sai (da linguagem.md e da consolidação): nenhum fluxo entrevista na branch |
| D63 | com o PRD na base, a ATA nasce na pasta do épico, na base, no commit do passo decisoes |
| D64 | fechar-sessao: horas → script → prévia completa → "Registrar? (sim)" |
| D65 | o campo [ESP] do status.md do épico guarda **só o id da tarefa nova** ([ESP] EP-<nn> Revisão <n>); o pai continua sendo o IB do épico, que vem da sprint anterior; o Início não muda |
| D66 | a decisão antiga fica como está (o decisoes.md é só acréscimo); a única exceção é a linha reservada por uma ATA ainda em draft |
| D67 | numa reunião, decidem o P.O. do épico e o representante do cliente marcado no passo transcricao |
| D68 | protótipo com várias telas: um arquivo por tela, `prototipo-v<N>-<slug>-<nn>.<ext>` |
| D69 | um roteador único: o encaminhar da sa-especificar escolhe o passo da sa-prd pela Fase do PRD e pelo último `revisao-prd-<N>.md` |

**Observação da pessoa (05/11, depois da D69):** a maioria das perguntas novas vem de fluxos de exceção, ou até de
fluxos que não existem e que os agentes levantaram. Ela vai responder mais algumas para conferir. Se o padrão
continuar, avisa, e as perguntas seguintes serão revisadas (filtrando as que tratam de caso inexistente ou improvável)
antes de seguir. Exemplos até aqui: D52 ("isso deveria ser um épico, esse caso não existe") e D51 (sete casos de
refinamento).
| D70 | na [ESP] FT, a ficha completada entra no commit `FT-<nnn> completar ficha` do passo trabalho; os artefatos, no commit do passo aprovacao |
| D71 | **mantém a chave da sprint:** a coluna sprint registra a mesma sprint da [ESP] FT. Na conclusão, o encaixe cria a [DEV] nessa sprint, e o registro da sprint em que a [DEV] nasceu e foi desenvolvida se mantém |
| D72 | na fatia iniciada que volta à especificação, o que guia a [ESP] FT são as linhas de Artefatos afetados com Especificado `—`, mais o filtro do elm-publicar |
| D73 | **casos que não existem:** transcrição trocada depois da ATA aprovada, publicação sem "sim" e ATA sem sigla no `pa` ou sem ELM. Não tratar; o texto que existir sobre eles sai |
| D74 | **caso que não existe:** a aprovação do protótipo pelo cliente não depende de ATA. O texto sobre isso sai |
| D76 ↩ | a pessoa não entendeu a pergunta. Voltar com uma explicação melhor do teto de 2 rodadas por tipo de revisão, ou descartar, conforme a triagem das restantes |
| D77 | similares sem o MCP elm ou sem o bundle: não há o que fazer além de **informar os riscos** (sem parar e sem pendência a mais); segue como `novo (não verificado)` |
| D78 | mudança do PRD desistida antes do GATE: revert do commit de abertura, e a Fase volta a `aprovado` |

## 6. Triagem das 57 decisões restantes (05/11)

A pessoa notou que muitas perguntas eram de exceção ou de casos inexistentes. Um agente conferiu cada uma no código
e classificou: **X** inexistente (descartar) · **E** exceção (regra mínima, sem trava) · **M** mecânica (aplicar sem
perguntar) · **I** importante (perguntar).

| Classe | Decisões |
|---|---|
| X (3) | D88, D99, D120 |
| E (10) | D3, D53, D75, D86, D92, D94, D110, D111, D113, D115 |
| M (41) | D4, D5, D6, D27, D34, D36, D39, D79–D83, D89–D91, D93, D95–D98, D102, D103, D105–D107, D112, D114, D116, D118, D119, D121–D131 |
| I (3) | D87, D104, D117 |

**Propostas para X, E e M** (aplicar sem perguntar, se a pessoa confirmar em bloco):
- **X, descartar:** D88 (o revisor sempre é subagente na sessão), D99 (sem sprint não há loop), D120 (pasta `avaliacoes/` sem leitor: a frase sai).
- **E, regra mínima, sem trava:**
  - D3: quem mergeia não sendo o responsável → avisa e segue; as horas ficam com o dono.
  - D53: mantém "use `sa-prd.mudanca`".
  - D75: a Ação segue a decisão de similares.
  - D86: merge por fora → sincronização da sprint.
  - D92: divergência na pesquisa: fora do Cobre → Histórico + sa-triar; dentro do Cobre → `possível alteração` e segue.
  - D94: retoma no passo verificar.
  - D110: drift sem sprint → só a marca; campo vazio → segue como `não`, com o registro no Histórico.
  - D111: segue, com a pendência.
  - D113: só indica a `sa-planejamento.inicial`.
  - D115: sem MCP de banco → o agente escreve o SQL, a pessoa roda e informa.
- **M, mecânica:**
  - D4: verificador = qualquer membro ativo que não implementa, com `—` aceito.
  - D5, D79, D97, D116: confirmar o que já está aplicado.
  - D6: tirar `{{SUBAGENTES}}` do sa-especificador e o gerador recusar outro papel.
  - D27: painel com "HITL antes da VER → o revisor".
  - D34: nada gravado na troca recusada.
  - D36: a linha Cerimônias sai.
  - D39: as opções do §9.
  - D80: tirar "registre no status.md" (toolkit transparente).
  - D81: `demanda` = o IB do épico.
  - D82: avisa e segue.
  - D83: listas fechadas.
  - D89: `planejando`.
  - D90: lançar horas no caminho Sem GATE, perguntado, sem bloquear.
  - D91: risco = mais de 6 cenários ou regra sensível.
  - D93: só a estrutura.
  - D95: vermelho → tarefa nova.
  - D96: `⚠️ ambiente` = um marcador só, fechando com AMBIENTE.
  - D98: log com Fase + contador.
  - D102: `revisao-esp-<N>.md`.
  - D103: corrigir o padrão (`verificando`).
  - D105: 🔁 provisório também no HITL.
  - D106: rejeitados só no `verificacao.md`.
  - D107: aprovação AFK pelo comentário da [APR], ou no MR, sem trava.
  - D112: concluir depois do push.
  - D114: como hoje, sem campo novo.
  - D118: Situação da lição muda no lugar (`promovida → R-nn`, `descartada`).
  - D119: mesma causa + mesma correção.
  - D121: anota e mostra no fecho.
  - D122: conferir depois de gravar.
  - D123: perguntar no W5.
  - D124: cabeçalho e separador.
  - D125: pular Sustentação e [GB] na setup.
  - D126: a pessoa gera o steering e a setup relê.
  - D127: nome da PA em minúsculas, sem acento, com hífen.
  - D128: (a).
  - D129: campo `branch: fatia|nao` no passo entrada.
  - D130: redação.
  - D131: README com os sete agentes.
- **Divergem da recomendação do relatório** (para não travar e não criar caso): D3, D4, D36, D53, D92, D110, D114.

**Importantes:**
- **D87:** quem grava `aplicada em dev`/`prod` no campo Banco.
- **D104:** alcance da reverificação HITL depois de uma rejeição.
- **D117:** a consulta SQL reaproveitável de um atendimento.

**Respostas da pessoa à triagem (05/11):**

| # | Decisão |
|---|---|
| D87 | **A aplicação de baseline de banco é atividade de manutenção (Sustentação: item BD/Implantação), não do Dev.** O time de banco pode levar dias, e DDL nunca é aplicada à mão. O que importa é a fatia poder ficar `bloqueada (aguardando aplicação de baseline de banco)` até a aplicação; sai a cobrança de `aplicada em dev/prod` gravada pelo Dev |
| D104 | reverificação HITL depois de uma rejeição: só os rejeitados e os de repetição, como no AFK (o verificador pode pedir todos); o CT.csv usa o último ✅ de cada cenário |
| D117 | **consulta de atendimento não se reaproveita:** em homologação e produção não há acesso; em dev, a consulta fica no registro do atendimento ou a pessoa a copia para a IDE (ex.: DBeaver). Sai a opção de virar lição, e não há catálogo |
| X/E/M (54) | **confirmadas em bloco,** como propostas na seção 6 (inclusive as 7 que divergem da recomendação original: D3, D4, D36, D53, D92, D110, D114) |

**Situação (05/11):** das 131, todas estão decididas, menos **D13, D51 e D76**, que a pessoa pediu para voltar com uma
explicação melhor.
