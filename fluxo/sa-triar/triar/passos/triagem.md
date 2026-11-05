---
{"resumo": "Decide a trilha (épico, padrão, rápida ou sustentação) com o motivo, levanta o que a ficha pede e os artefatos do ELM que a fatia inclui, altera ou exclui (lista confirmada por quem tria); não fazer não entra no backlog."}
---
## Entrada

O item lido no passo `chegou` (novo, ou a fatia sem épico que voltou, com o mesmo `FT` e a ficha que existe).

## Faça

| Trilha | Quando | O que se registra |
|---|---|---|
| **épico** | funcionalidade nova com várias histórias ou fatias, mais de ~3 dias, mais de um objetivo, ou decisão de produto em aberto | `EP-nn` `novo` ou `elegivel` (DoR do épico) → depois `sa-prd` → `sa-fatiar` |
| **padrão** | uma fatia (≤ G) que cria ou muda regra de negócio **clara** — o P.O. decide aqui —, sem decisão de produto em aberto | fatia sem épico, com **ficha** (regras, cenários, decisões, artefatos afetados) aprovada pelo P.O. |
| **rápida** | defeito ou ajuste ≤ 1 dia **sem** regra nova (`inclui` de `REG` ou `HF` é regra nova; o comportamento certo já está documentado ou é óbvio) — inclusive o diff que cabe numa frase (texto, configuração, ajuste trivial) | fatia sem épico, com ficha de **comportamento** (atual · esperado · não muda), artefatos afetados e como verificar |
| **sustentação** | trabalho que não muda o repositório, numa das categorias da tabela **Sustentação** do `sabia.md` (Atendimento: consulta, extração, explicação ou conferência pedida pelo cliente; Implantação; Banco de dados; Infra; Operação; Apoio a outros times) | item da categoria (`AT-nnn`, `IM-nnn`…) na `### <Categoria>` da `## Sustentação`, com o registro, a sprint sugerida e o IB do item (a tarefa da categoria, `[ATD]`, `[IMPL]`…, nasce quando ele entra numa sprint) (a triagem registra; quem executa: **`sa-atender`** no Atendimento, a **`sa-executar`** nas demais) |

- Fatia de um épico não passa de novo por aqui: o épico foi triado na entrada e as fatias dele vêm da `sa-fatiar`.
  Cenário novo de um épico já fatiado entra aqui como épico novo ou fatia sem épico (`obs` `origem EP-<nn>`), pela
  trilha que couber.
- Diga a trilha e o motivo numa linha; dúvida entre duas → sim/não pela mais leve (rápida, depois padrão, depois épico). Padrão que precisaria de mais de
  ~3 cenários de comportamentos diferentes, ou de mais de uma regra nova independente → é épico.
- **Padrão:** rodadas da `sa-entrevistar` até as regras e os cenários fecharem, gravando na seção Decisões da
  ficha (ela nasce aqui, com o próximo `FT-nnn` de "Próximos ids"); regra nova ou alterada → a pesquisa de
  Artefatos afetados (abaixo) antes de escrevê-la; no fim, o P.O. aprova a ficha. Sem a aprovação, a fatia fica
  `nova` com `falta: aprovação do P.O.`.
- **Rápida:** **uma** rodada no formato da `sa-entrevistar` (numerada, cada pergunta com a recomendação,
  "sim" aceita todas) para o que a ficha pede e a origem não traz: atual com evidência, esperado com fonte, o que
  não muda, como verificar.
- **Artefatos afetados** (padrão e rápida, AFK ou HITL; a seção e o fecho no padrão `sa-triar/ficha.md`):
  1. **Bundle**, antes da pesquisa: a data é o `sincronizado_em` (a parte da data) do `elm_listar_req_local`; sem
     o campo, `git log -1 --format=%cs --grep='^ELM - Sincronizar bundle'`; sem os dois, `sem data`. Mais de 7 dias
     ou sem data, uma vez por sessão → `⚠️ Bundle do ELM de <data | sem data> (<n> dias): rode a sa-sync (baixar)
     antes de triar — a triagem segue se você quiser.` Não bloqueia; a data vai no `bundle de` do fecho.
  2. **Pesquisa:** [similares](~/.sabia/framework/skills/sa-prd/references/similares.md) para o que a fatia toca, em
     todos os tipos da seção, bundle e ao vivo: reutilizar → `reusa` (sem linha) · alterar → `altera` · criar novo →
     `inclui`; o que a fatia retira → `exclui`. **Impacto:** para cada `altera` ou `exclui`, quem o cita
     (`elm_ler_req_local(<id>).links.entrada`: a HF que embute a REG, a EL, o CT da HF…), revisto — muda → linha
     própria; não muda → no Motivo da linha de origem.
  3. **Outra ficha aberta:** id `altera` ou `exclui` na seção Artefatos afetados de outra fatia não terminal
     (`git grep -n '<id>' -- '<produto>/fatias/'` + o `status` no `backlog.md`) →
     `🔗 <id> (<tipo>) já está na ficha de FT-<mmm> (<status>) → FT-<nnn> bloqueada-por FT-<mmm>` (a coluna
     `bloqueada-por`, no passo `registrar`).
  4. **Compromisso:** mostre a seção e pergunte, exata: `A lista de artefatos afetados está completa? (sim: você
     autoriza a alteração e se compromete com a lista)`. "sim" → o fecho com o login e a data de quem tria; "não" →
     complete com a pessoa e pergunte de novo; sem o "sim", `falta: artefatos afetados`.

  Linha `inclui`, `altera` ou `exclui` → a fatia espera a `[ESP] FT` (`falta: especificação`, passo `registrar`).
  Projeto sem ELM → sem aviso, pesquisa nem pergunta: só a linha `Projeto sem ELM.` do padrão.
- Fatos o agente busca (código, bundle do ELM pelas `elm_*_local`, banco só leitura); decisões são da pessoa.
- **Não fazer** (já entregue, fora do produto, recusado pelo P.O.) → nada no backlog; item do EWM → ofereça um
  comentário `sabia: não fazer — <motivo>` (`elm_comentar`, com "sim"), que o tira dos próximos lotes;
  cancelar o item é do P.O. (`elm_transicao(<id>, "cancelar")`, com "sim").

## Saída

A trilha com o motivo, as respostas da entrevista e a seção Artefatos afetados (com o `bloqueada-por`) → passo
`registrar`. Não fazer → passo `encaminhar`.

## Pare se

Não fazer (acima) → nada a registrar: passo `encaminhar` ("Mais algum item para triar?").
