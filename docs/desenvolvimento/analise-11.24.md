# 11.24 — Especificação acompanha a manutenção: análise crítica (04/11)

## 1. O papel do especificador hoje

| Responsabilidade | Hoje | Fonte |
|---|---|---|
| Especificação de épico ([ESP] EP) | do assumir ao **GATE do backlog** | `fluxo/sa-especificar/especificar/especificar.md:3`; `skills/sabia/references/elm.md:118` |
| PRD + artefatos (HF, REG, EL, ET, CT) | escreve; o GATE é do **P.O. ou de quem ele delegou** | `fluxo/sa-prd/prd/passos/gate.md:18` |
| Publicação ao ELM | nenhum passo publica: o fluxo só diz qual é o próximo (`na-aprovacao`) ou deixa para a consolidação (`no-merge`) | `fluxo/sa-especificar/especificar/passos/fechamentos.md:24` |
| Fatiamento e GATE do backlog | **dono** (`sa-fatiar`) | `fluxo/sa-fatiar/fatiar/fatiar.md:2`; `papeis.json` (especificador) |
| Refinamento (cancelar fatias) | dono | `fluxo/sa-fatiar/refinamento/refinamento.md:2` |
| [ESP] FT | só para a fatia `nova` que não passa na DoR; não altera requisito | `fluxo/sa-especificar/fatia/fatia.md:14-15` |
| Correção do PRD depois de aprovado | dono (`sa-prd.mudanca`), sem tarefa própria depois do fatiamento | `fluxo/sa-prd/mudanca/` |
| Fatia sem épico com `altera <id>` | **não participa**: o P.O. escreve e aprova; a regra sobe as-built na consolidação | `padrao/sa-triar/ficha.md:91-98`; `fluxo/sa-consolidar/consolidar/passos/elm.md:15-17` |
| Divergência na VER | cenário errado → `bloqueada` + `sa-prd.mudanca` (com épico) ou `sa-triar` (sem épico), sem reabrir [ESP] | `fluxo/sa-verificar/verificar/passos/decisao.md:50-52` |

**Em resumo:** hoje o especificador cuida do **épico novo**. Na manutenção (fatia sem épico, rápida, correção
depois do fatiamento), quem decide o requisito é o P.O., e o DOORS só é atualizado depois do merge.

## 2. Leitura crítica da proposta

**O que está certo e fortalece o desenho:**
- **Separar especificação de produto.** A [ESP] termina na aprovação do PRD; fatiar e o backlog vão para o P.O./SM.
  Hoje o especificador carrega uma tarefa de produto (GATE do backlog, IBs, cancelar fatias).
- **Mapear os artefatos afetados na triagem.** Hoje a triagem já roda `similares` para as regras. Basta estender a
  pesquisa a incluir, alterar e excluir artefatos, e a uma tabela na ficha.
- **O P.O. autoriza na triagem.** Isso tira o "P.O. aprova o requisito" do caminho crítico do especificador.
- **Uma porta só para mudar requisito.** Achado no plano, na REV ou na VER, tudo vai para a especificação
  ([ESP] FT, ou a [ESP] reaberta). Some a distinção de hoje entre `sa-prd.mudanca` e `sa-triar` (sem épico).
- **Atendimento e sustentação não alteram:** já é assim.

**Pontos que precisam de decisão (onde a proposta é ambígua ou tem custo):**

| # | Ponto | Por que importa |
|---|---|---|
| C1 | **Quem aprova o PRD: o especificador sozinho?** | Hoje é o P.O. ou quem ele delegou. Com o especificador aprovando, o P.O. só vê o conteúdo de negócio no fatiamento, depois de o DOORS já estar atualizado. Se a autorização da triagem cobre só o escopo, a regra de negócio fica sem o P.O. |
| C2 | **DOORS "to-be" antes do código** | Publicar na aprovação (PRD ou [ESP] FT) põe no DOORS um comportamento que ainda não está em produção. Se a fatia for cancelada ou mudar na VER, o DOORS fica errado até alguém reverter. A política `no-merge` existe por isso. A proposta pede publicar antes, sempre? |
| C3 | **Rápida AFK com artefatos: quem valida?** | A proposta diz que a ficha propõe e que, aprovada a ficha, o próximo GATE é o PR. Então o especificador não participa da rápida, o que contradiz o item 1 ("tarefa do especificador"). Hoje a rápida proíbe regra nova (`backlog.md:185`). |
| C4 | **Fatia de épico alterada pela [ESP] FT: e o PRD?** | Se a alteração achada no plano segue o fluxo sem épico, o artefato muda, mas o PRD do épico fica desatualizado. Ou o PRD sobe de versão (`sa-prd.mudanca`), ou o PRD vira registro histórico e o DOORS/bundle passa a ser a verdade. |
| C5 | **Divergência na REV/VER: doc ou código?** | Nem toda divergência muda o artefato: código errado volta ao Dev. Alguém decide de que lado está o erro. Recomendo que REV/VER só marquem e que o especificador decida na [ESP] reaberta (com um caminho de volta rápido "o código está errado"). |
| C6 | **Excluir artefato** | O MCP não apaga: `deprecated` + roteiro manual (`okf-elm.md:117`). Precisa estar previsto na ficha e no PRD. |
| C7 | **Duas fatias alterando o mesmo artefato** | Duas [ESP] FT em paralelo sobre o mesmo id. Hoje só o `modificado_em` pega, e tarde, na publicação. |
| C8 | **A qualidade depende da pesquisa da triagem** | O modelo inteiro depende de o bundle estar sincronizado e de o `similares` achar tudo. O que a triagem não achar aparece no plano, na REV ou na VER e reabre a [ESP]. Isso é um laço caro. A `sa-sync` precisa ser pré-condição da triagem em projeto com ELM. |

## 3. Fluxo proposto (como ficaria)

```
TRIAGEM (sa-triar, P.O./SM)
  similares: artefatos afetados (inclui · altera · exclui) → tabela na ficha → P.O. autoriza
  ├ sem artefato afetado ──────────────────────────────► fatia elegivel → DEV (como hoje)
  ├ rápida com artefato  ── C3: ficha propõe; aprovação → DEV ... GATE do PR
  └ padrão com artefato  ── [ESP] FT ──┐
                                        ▼
ESPECIFICAÇÃO DE FATIA (sa-especificar.fatia, especificador)
  lê a ficha → cópia do bundle (sync se velho) → propõe a alteração (iara ⇢ por tipo)
  → revisão P → aprovação do especificador → publica (C2) → links na ficha → elegivel → DEV

ÉPICO
  [ESP] EP: reunião/protótipo → PRD (novos + alterados + invalidados/excluídos, C6)
  → revisão P → GATE do PRD (C1) → publica → [ESP] concluída
  FATIAMENTO (sa-fatiar → agente sa-produto) → GATE do backlog (P.O./SM) → fichas com links

DEV → PLANO: alteração nova achada → fatia bloqueada → [ESP] FT (C4)
REV/VER: divergência → fatia bloqueada → [ESP] reaberta (EP ou FT) → especificador decide (C5)
CONSOLIDAÇÃO: só o as-built técnico (ET) e o que a política ainda deixar (C2)
```

## 4. Mudanças necessárias

| # | Onde | Mudança |
|---|---|---|
| M1 | `padrao/sa-triar/ficha.md` + `fluxo/sa-triar/triar/passos/triagem.md` | seção **Artefatos afetados** (`id · tipo · ação inclui/altera/exclui · motivo`) em toda trilha; `similares` cobre também os tipos além de REG; o P.O. autoriza na triagem |
| M2 | DoR (`skills/sa-fatiar/references/backlog.md:183-186`) | ficha padrão com artefato afetado → `nova` com `falta: especificação` até a [ESP] FT concluir |
| M3 | `fluxo/sa-especificar/fatia/` | a [ESP] FT ganha os passos de artefato: ler a ficha → copiar do bundle → escrever (desviável por tipo → iara) → revisão P → aprovação → publicar → links. Hoje ela só completa a ficha |
| M4 | `fluxo/tipos.json` (`cria`/`desviavel`) | os tipos passam a nascer ou mudar também em `sa-especificar.fatia.<passo>`. **O iara precisa do desvio nesse passo** (o gerador liga a skill sozinho pelo catálogo) |
| M5 | `fluxo/sa-especificar/especificar/` + `elm.md:118` | a [ESP] EP termina no GATE do PRD + publicação; sai o trecho do GATE do backlog |
| M6 | `fluxo/sa-prd/prd/passos/gate.md:18` | quem aprova (C1) |
| M7 | passo `publicar` (lacuna L1) | no fim da [ESP] EP e da [ESP] FT; a política (C2) decide se fica só `na-aprovacao` |
| M8 | `sa-fatiar` (fatiar e refinamento) | dono `sa-produto`; `papeis.json`: a skill sai do especificador e vai para o produto |
| M9 | `fluxo/sa-plano/plano/passos/decisoes.md:19` | alteração de artefato → `bloqueada` + [ESP] FT (corrige também a L8: o agente certo) |
| M10 | `fluxo/sa-revisar` e `fluxo/sa-verificar/.../decisao.md:50-52` | divergência que mexe em artefato → `bloqueada` + reabrir a [ESP] (EP ou FT) pelo `elm_transicao(reabrir)` que o `entrada.md` já tem |
| M11 | `fluxo/sa-consolidar/consolidar/passos/elm.md` + `drift.md` | sai a "regra da ficha as-built" (já publicada na [ESP] FT); o drift vira reabertura da [ESP]; fica a ET as-built. Fecha a 11.14.6 |
| M12 | `sa-iniciar` (tabela de estados) | `nova` com `falta: especificação` → `sa-especificar` (agente especificador) |
| M13 | `fluxo/sa-prd/prd/passos/similares.md` + `escrever.md` | épico: invalidados/excluídos explícitos + análise de impacto (HF que embute a REG, CT da HF alterada) |

## 5. Impactos

- **Fluxo:** 9 fluxos mudam (triar, especificar.fatia, especificar.especificar, prd.gate, fatiar×2, plano,
  verificar/revisar, consolidar), mais o catálogo, a DoR e o `sa-iniciar`. Nenhum fluxo novo: tudo encaixa na
  [ESP] FT e na [ESP] EP que já existem.
- **Papéis:** o especificador perde o fatiamento e ganha a manutenção (a [ESP] FT vira o caminho normal). O
  `sa-produto` ganha a `sa-fatiar`. É preciso regenerar os agentes dos projetos.
- **Toolkit iara:** o desvio por tipo também em `sa-especificar.fatia`. O `toolkit.json` não muda (os papéis já
  cobrem). A validação dos papéis continua valendo.
- **Sprint e EWM:** mais tarefas [ESP] FT na sprint (capacidade do especificador); reabrir a [ESP] dá horas
  rastreáveis. A triagem cria a [ESP] FT quando há artefato afetado.
- **ELM:** publicação antes do código (C2); exclusão por `deprecated` (C6).
- **Testes e geração:** `cli/compilar.test.mjs`, `cli/prova.test.mjs` e `test_gerar_agentes.py` (dono do fatiar,
  catálogo), grafos e rotas gerados, site (mapa e Fluxos).
- **Risco:** o laço "achou depois → reabre a [ESP]" fica caro se a triagem pesquisar mal (C8).

## 6. Decisões para a pessoa

| # | Pergunta | Recomendação |
|---|---|---|
| C1 | Quem aprova o PRD | o especificador aprova o artefato; o P.O. já autorizou o escopo na triagem e vê o resultado no fatiamento. Manter "ou quem ele delegou" para o projeto escolher |
| C2 | Publicar antes do código? | manter as duas políticas: `na-aprovacao` publica no fim da [ESP]; `no-merge` publica na consolidação, com os artefatos já aprovados pelo especificador |
| C3 | Rápida com artefato | a rápida só **altera** (não inclui nem exclui); o especificador aprova a proposta da ficha numa [ESP] FT curta, ou a fatia vira padrão |
| C4 | PRD depois de publicado | o DOORS/bundle é a verdade; o PRD fica como registro do épico (sem nova versão pela [ESP] FT) |
| C5 | Divergência: doc ou código | REV/VER marcam; o especificador decide na [ESP] reaberta; código errado → volta ao Dev sem mudar o artefato |
| C7 | Mesmo artefato em duas [ESP] FT | a triagem avisa quando o id já está em outra ficha aberta; a fatia leva `bloqueada-por` |
