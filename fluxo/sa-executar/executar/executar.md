---
{"fluxo": "executar", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "saidas": {"pedido novo ou id fora do backlog": "→ sa-triar.triar", "item terminal, ou fora da sprint aberta (P.O. ou SM)": "fim"}},
   {"id": "assumir"},
   {"id": "registrar", "saidas": {"não é desta categoria (categoria errada)": "→ sa-triar.triar"}},
   {"id": "encerrar", "saidas": {"alteração (muda o repositório) ou regra que ninguém decidiu": "→ sa-triar.triar", "lição": "→ sa-aprender.registrar", "nada": "fim"}}
 ]}
---
# Executar — Sustentação sem fluxo próprio

Implantação `[IMPL]`, Banco de dados `[BD]`, Infra `[INF]`, Operação `[OPE]`, Apoio a outros times `[EXT]` — e toda
categoria da tabela **Sustentação** do `sabia.md` com Skill `sa-executar`. O trabalho acontece fora do repositório (a
pessoa executa; o agente não roda script, deploy nem comando em ambiente): aqui só se registra. A **`sa-triar`**
registra o item; este fluxo é o de quem **faz**: assume a tarefa, registra o trabalho e as horas e encerra. Entra o
id do item (`IM-`, `BD-`, `IN-`, `OP-`, `EX-nnn`), a tarefa da categoria ou o número do EWM (do IB do item ou da
tarefa: a linha com esse id em `elm`).

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `AT-nnn` ou a tarefa `[ATD]` (Atendimento) → `sa-atender.atender`

## Arquivos

- `<produto>/sustentacao/<pasta>/<ID>-<slug>.md` — a ficha (formato: o padrão `sa-atender/registro.md`, com `## O
  que foi feito`), criada pela triagem.
- Linha do item na `### <Categoria>` da `## Sustentação` do `backlog.md` e do `sprints/<pai>/sprint-<nn>.md`.
- `.sabia/local/sustentacao/<pasta>/<ID>/` — o que tiver dado real. Fora do git.

## Regras

- O agente não executa o trabalho: script, deploy e comando em ambiente são da pessoa; aqui fica o registro.
- **Dado de cliente nunca vai para o git**: fica em `.sabia/local/sustentacao/<pasta>/<ID>/`.
- Registrar o item é da `sa-triar`; este fluxo nunca numera nem abre item (só cria no EWM o IB e a tarefa que
  faltam a um item registrado).
- Lançar horas é registro de empenho, a qualquer momento na tarefa assumida; concluir é o passo `encerrar`, com o saldo.
- Ficha, backlog e sprint são gravados na base (bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base)).
  Cada escrita no EWM com "sim"; sem o MCP `elm` ou com falha → `ELM pendente [<chave>]: <assumir | lançar <h>h |
  concluir tarefa e IB> <prefixo> <ID>` no campo `**ELM:**` da ficha, e siga.
