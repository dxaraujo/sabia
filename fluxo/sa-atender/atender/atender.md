---
{"fluxo": "atender", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "branch": "nao", "saidas": {"pedido novo ou AT fora do backlog": "→ sa-triar.triar", "AT terminal, ou fora da sprint aberta (P.O. ou SM)": "fim"}},
   {"id": "assumir"},
   {"id": "executar", "chama": "sa-pesquisar.pesquisar", "saidas": {"não é atendimento (categoria errada)": "→ sa-triar.triar"}},
   {"id": "finalizar"},
   {"id": "desdobramentos", "saidas": {"alteração (defeito ou mudança) ou regra que ninguém decidiu": "→ sa-triar.triar", "nada": "fim"}}
 ]}
---
# Atender — atender sem perder o rastro

Atendimento é trabalho real que não vira código: alguém pergunta (chamado, e-mail, pedido), o time consulta, responde
e segue. É a categoria **Atendimento** da **Sustentação** — a única categoria com fluxo próprio; as demais
(Implantação, Banco de dados, Infra, Operação, Apoio a outros times) usam a [`sa-executar`](~/.sabia/framework/skills/sa-executar/SKILL.md).
A **`sa-triar`** registra a demanda (`AT-nnn`, linha na `### Atendimento` da `## Sustentação` do `backlog.md`, IB
`[AT-nnn]` no EWM; a tarefa `[ATD]` nasce quando o AT entra numa sprint); este fluxo é o de quem **atende**: assume
a `[ATD]`, executa e finaliza, deixando um registro versionado **sem dado de cliente**. Entra o `AT-nnn`, a `[ATD]
AT-nnn` ou o número do EWM do IB `[AT-nnn]` ou da `[ATD]`.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `IM-`, `BD-`, `IN-`, `OP-`, `EX-nnn` ou a tarefa `[IMPL]` `[BD]` `[INF]` `[OPE]` `[EXT]` (outra categoria da Sustentação) → `sa-executar.executar`

## Arquivos

- `<produto>/sustentacao/atendimento/AT-<nnn>-<slug>.md` — o registro (formato no padrão `sa-atender/registro.md`), criado pela triagem.
- Linha do AT na `### Atendimento` da `## Sustentação` do `backlog.md` e do `sprints/<pai>/sprint-<nn>.md`.
- `.sabia/local/sustentacao/atendimento/AT-<nnn>/` — extrações, telas e respostas com dado real. Fora do git.

## Regras

- **Dado de cliente nunca vai para o git**: resultado de consulta, extração ou tela com dado real fica em
  `.sabia/local/sustentacao/atendimento/AT-<nnn>/`. O registro guarda consulta, contagem, caminho e resumo anônimo.
- Banco só em leitura. Pedido que exige escrita na base não é atendimento: vira Banco de dados (`[BD]`, a pessoa
  executa o script fora; pela `sa-executar`) ou, se muda o repositório, fatia de Manutenção.
- Um IB `[AT-nnn]` e uma `[ATD]` por demanda, sem balde. Registrar o AT é da `sa-triar`; este fluxo nunca numera
  nem abre AT (só cria no EWM o IB e a tarefa que faltam a um AT registrado).
- Lançar horas é registro de empenho, a qualquer momento na `[ATD]` assumida; concluir é o passo `finalizar`, com o saldo.
- Toda escrita no EWM e todo envio de resposta pedem confirmação da pessoa.
- Sem o MCP `elm` ou com falha → uma linha por chave no campo `**ELM:**` do registro, e siga: `ELM pendente [ATD
  AT-<nnn> assumir]: assumir a tarefa` · `ELM pendente [ATD AT-<nnn> horas]: lançar <h>h (<AAAA-MM-DD>)` · `ELM
  pendente [ATD AT-<nnn> concluir]: concluir a tarefa` · `ELM pendente [IB AT-<nnn> concluir]: concluir o IB`.
