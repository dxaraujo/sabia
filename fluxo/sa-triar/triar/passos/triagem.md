---
{"resumo": "Decide a trilha (épico, padrão, rápida ou sustentação) com o motivo e levanta o que a ficha pede; não fazer não entra no backlog."}
---
## Entrada

O item lido no passo `chegou` (novo, ou a fatia sem épico que voltou, com o mesmo `FT` e a ficha que existe).

## Faça

| Trilha | Quando | O que se registra |
|---|---|---|
| **épico** | funcionalidade nova com várias histórias ou fatias, mais de ~3 dias, mais de um objetivo, ou decisão de produto em aberto | `EP-nn` `novo` ou `elegivel` (DoR do épico) → depois `sa-prd` → `sa-fatiar` |
| **padrão** | uma fatia (≤ G) que cria ou muda regra de negócio **clara** — o P.O. decide aqui —, sem decisão de produto em aberto | fatia sem épico, com **ficha** (regras, cenários, decisões) aprovada pelo P.O. |
| **rápida** | defeito ou ajuste ≤ 1 dia **sem** regra nova (o comportamento certo já está documentado ou é óbvio) — inclusive o diff que cabe numa frase (texto, configuração, ajuste trivial) | fatia sem épico, com ficha de **comportamento** (atual · esperado · não muda) e como verificar |
| **sustentação** | trabalho que não muda o repositório, numa das categorias da tabela **Sustentação** do `sabia.md` (Atendimento: consulta, extração, explicação ou conferência pedida pelo cliente; Implantação; Banco de dados; Infra; Operação; Apoio a outros times) | item da categoria (`AT-nnn`, `IM-nnn`…) na `### <Categoria>` da `## Sustentação`, com o registro, a sprint sugerida e o IB do item (a tarefa da categoria, `[ATD]`, `[IMPL]`…, nasce quando ele entra numa sprint) (a triagem registra; quem executa: **`sa-atender`** no Atendimento, a **`sa-executar`** nas demais) |

- Fatia de um épico não passa de novo por aqui: o épico foi triado na entrada e as fatias dele vêm da `sa-fatiar`.
- Diga a trilha e o motivo numa linha; dúvida entre duas → sim/não pela mais leve (rápida, depois padrão, depois épico). Padrão que precisaria de mais de
  ~3 cenários de comportamentos diferentes, ou de mais de uma regra nova independente → é épico.
- **Padrão:** rodadas da `sa-entrevistar` até as regras e os cenários fecharem, gravando na seção Decisões da
  ficha (ela nasce aqui, com o próximo `FT-nnn` de "Próximos ids"); regra nova ou alterada → [similares](~/.sabia/framework/skills/sa-prd/references/similares.md) antes de escrevê-la; no fim, o P.O.
  aprova a ficha. Sem a aprovação, a fatia fica `nova` com `falta: aprovação do P.O.`.
- **Rápida:** **uma** rodada no formato da `sa-entrevistar` (numerada, cada pergunta com a recomendação,
  "sim" aceita todas) para o que a ficha pede e a origem não traz: atual com evidência, esperado com fonte, o que
  não muda, como verificar.
- Fatos o agente busca (código, bundle do ELM pelas `elm_*_local`, banco só leitura); decisões são da pessoa.
- **Não fazer** (já entregue, fora do produto, recusado pelo P.O.) → nada no backlog; item do EWM → ofereça um
  comentário `sabia: não fazer — <motivo>` (`elm_comentar`, com "sim"), que o tira dos próximos lotes;
  cancelar o item é do P.O. (`elm_transicao(<id>, "cancelar")`, com "sim").

## Saída

A trilha com o motivo e as respostas da entrevista → passo `registrar`. Não fazer → passo `encaminhar`.

## Pare se

Não fazer (acima) → nada a registrar: passo `encaminhar` ("Mais algum item para triar?").
