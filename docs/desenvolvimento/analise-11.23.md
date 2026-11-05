# 11.23 — Especificação: requisito existente alterado (análise do agente, 04/11, só leitura)

## Resposta curta
- **Não é verdade hoje:**
  - O especificador não aprova. Quem aprova o GATE do PRD e a ficha é o P.O. ou quem ele delegou
    (`fluxo/sa-prd/prd/passos/gate.md:18`; `padrao/sa-triar/ficha.md:91-92`).
  - A fatia nunca abre uma especificação própria para alterar requisito.
  - Aprovar o PRD não sobe nada sozinho. A subida depende da política e, mesmo com `na-aprovacao`, nenhum passo de
    fluxo faz a publicação.
- **É verdade:**
  - O GATE do PRD aprova todos os conceitos de uma vez.
  - Um conceito alterado atualiza o mesmo artefato no DOORS (o mesmo `resource`/`id`).

## 1. Fluxo de hoje

### 1a. Épico
```
sa-triar → sa-planejamento: [ESP] EP na sprint
  └ sa-especificar.especificar: assumir → pasta (local) → encaminhar
      ├ reuniao (ATA: aprova e sobe NA HORA, fora da política)
      ├ prototipo (aprovação do cliente → D-nn)
      └ sa-prd.prd:
          entender ── pesquisador: bundle (sem bundle → ELM remoto), código, ADR
          entrevistar ─ decisoes.md
          similares ─── bundle + ao vivo → reutilizar | ALTERAR | criar (D-nn + "No ELM")
          escrever ──── elm/: novo, ou cópia do bundle (altera <id>) no estado "depois"
          revisao ───── sa-revisor, rubrica P (P6)
          GATE do PRD ─ P.O./delegado → stable + verified humano
  └ fechamentos: PRD → base → "próximo: publicação (se na-aprovacao) e sa-fatiar"
      [publicação no DOORS: NENHUM passo a executa]
  └ sa-fatiar → GATE do backlog → IBs + elm_ligar(IB, HF, implementa)
  └ [ESP] concluída
```

### 1b. Requisito existente que precisa mudar, por origem

| Origem | Quem pesquisa | Quem edita | Quem aprova | Quando sobe |
|---|---|---|---|---|
| PRD do épico | especificador + pesquisador | especificador (`sa-prd.prd.escrever`) | P.O./delegado no GATE | `na-aprovacao`: depois do GATE, sem passo dono. `no-merge`: na consolidação |
| PRD aprovado, antes do fatiamento | — | especificador (`sa-prd.mudanca`, na mesma [ESP]) | P.O., GATE de novo | versão nova só se já publicado |
| PRD já fatiado (correção) | quem pede: drift, VER, plano, ATA | especificador (`sa-prd.mudanca`) | P.O., GATE | de novo, só "próximo" |
| Fatia de épico em dev | pesquisador, **só o bundle** | ninguém na fatia: vira só um fato no `research.md` | — | — |
| ↳ lacuna no plano · cenário errado na VER · drift na consolidação | Dev · VER · P.O./SM | → `sa-prd.mudanca` | P.O. | como acima |
| [ESP] FT (fatia `nova`) | especificador | não altera requisito (`Cobre` fixo; cenário novo → sa-triar) | — | — |
| Fatia padrão sem épico | P.O. na triagem | P.O. (sa-triar, "No ELM" `altera <id>`) | **P.O.** | consolidação (as-built) |
| Sustentação (AT) | quem atende (bundle) | não altera: desdobramento → sa-triar | — | — |

## 2. Confronto com a nota

| Afirmação | Hoje | Confere? |
|---|---|---|
| Na fatia, pesquisamos no bundle ou no ELM remoto | na fatia, só o bundle; o remoto entra no PRD e na triagem | parcial |
| "Se encontrado, como trabalhamos?" | vira um fato no `research.md`, que ninguém consome | lacuna |
| A fatia altera o requisito | fatia de épico não altera: quem altera é o PRD ou o `sa-prd.mudanca`; só a fatia sem épico altera, pela ficha | não |
| Abre-se especificação antes do dev | não; a [ESP] EP termina no GATE do backlog; a correção roda sem tarefa | não |
| A alteração sai da ficha e o especificador aprova | a ficha de épico só tem links; a ficha sem épico é aprovada pelo P.O. | não |
| Há fluxo em que o especificador atualiza e aprova a subida | atualiza (`sa-prd.mudanca`); aprova, não (P.O./delegado); a subida não tem passo dono | parcial |
| A [ESP] do épico vai até a aprovação do PRD | vai até o GATE do backlog | parcial |
| Os artefatos são gerados para o ELM | nascem no `escrever`, e o GATE os aprova | sim |
| A aprovação do PRD aprova tudo | sim (fora a ATA, aprovada antes) | sim |
| …e sobe ao ELM novos e alterados | só com `na-aprovacao`, sem passo que a execute; com `no-merge`, sobe na consolidação | parcial |

## 3. Lacunas

| # | Prior. | Problema | Proposta mínima | Dono |
|---|---|---|---|---|
| L1 | alta | `na-aprovacao` não tem passo de publicação | passo `publicar` no `sa-especificar.especificar` depois dos fechamentos (`elm-publicar.md` § Requisitos + CT); o mesmo na saída do GATE da mudança | especificador |
| L2 | alta | correção depois do fatiamento roda sem tarefa ([ESP] já concluída) | `[ESP] EP-nn Correção v1.x` pelo encaixe, ou reabrir a [ESP] | especificador · P.O. |
| L3 | alta | requisito achado na pesquisa da fatia não tem roteamento | em `sa-plano.plano.decisoes`: se a doc precisa mudar → fatia `bloqueada` + `sa-prd.mudanca` (mesmo épico) ou `sa-triar` (escopo novo) | Dev → especificador |
| L4 | média | com `no-merge`, o escopo da publicação na consolidação e o link IB→HF sem id | publicar só os conceitos do `Cobre` (+ `depois`) e então `elm_ligar`; no fatiamento sem id → `ELM pendente` | P.O./SM |
| L5 | média | sem análise de impacto (HF que embute a REG, CT, ET, EL, outros épicos) | em `similares`: listar no bundle quem cita o id; coluna "Impacto"; P6 confere | especificador · revisor |
| L6 | média | bundle velho antes de alterar | `elm_ler_req` ao vivo e comparar o `last_modified`; diferente → `sa-sync` | especificador |
| L7 | média | fatia sem épico com `altera <id>`: o especificador não participa | revisão do especificador na regra `altera` (D3) | P.O. + especificador |
| L8 | baixa | `sa-plano.plano.decisoes` manda o `sa-prd` ao `sa-produto`, que não tem a skill | trocar para `sa-especificador` | — |
| L9 | baixa | [ESP] FT citada como origem da correção, mas só sai para a `sa-triar` | saída → `sa-prd.mudanca` | especificador |
| L10 | baixa | remoção de regra pela mudança: `deprecated` + roteiro não citado | uma linha no `mudanca.md` | especificador |

## 4. O que a nota não citou
- **A correção trava o épico inteiro.** Com o PRD `em-revisao (de: fatiado)`, as fatias não iniciadas perdem a DoR.
  Ou se aceita isso, ou se limita às fatias cujo `Cobre` toca o que muda.
- **Dois épicos alterando o mesmo id:** não há checagem; só o `modificado_em` pega, e tarde.
- **Requisito de outro produto ou PA:** não encontrado no fluxo.
- **CT ligado a uma HF alterada:** a mudança não manda revisar o CT.
- **Drift → sa-triar (11.14.6):** continua pendente.
- **Aceite do cliente para um requisito alterado:** sem `D-nn` próprio.

## 5. Decisões para a pessoa

| # | Pergunta | Opções | Recomendação |
|---|---|---|---|
| D1 | Quem aprova a alteração de requisito | a) P.O. · b) especificador · c) especificador valida + P.O. aprova | a/c: o GATE já aceita "o P.O. ou quem ele delegou" |
| D2 | Correção depois do fatiamento: qual tarefa | a) reabrir a [ESP] · b) [ESP] "Correção v1.x" · c) ciclo novo pela sa-triar | b |
| D3 | Fatia sem épico com `altera <id>`: o especificador entra? | a) não · b) sempre · c) só quando o id é de um épico | c |
| D4 | Quem publica | a) especificador (`na-aprovacao`) · b) P.O. na consolidação (`no-merge`) · c) as duas, com dono claro | c (L1 + L4) |
| D5 | Requisito achado na pesquisa da fatia | a) bloqueia antes do plano · b) segue como drift | a |
| D6 | Análise de impacto | a) informativa · b) bloqueante na P6 | a; b só para REG embutida em HF de outro épico |
