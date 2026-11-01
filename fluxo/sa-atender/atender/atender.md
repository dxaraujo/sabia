---
{"fluxo": "atender", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "chegou", "saidas": {"pedido novo ou AT fora do backlog; não é atendimento": "→ sa-triar.triar", "outra categoria da Sustentação": "→ sa-executar.executar", "AT concluido ou cancelado": "fim"}},
   {"id": "assumir", "saidas": {"AT fora da sprint aberta: a decisão é do P.O.": "→ sa-planejamento.durante.encaixe"}},
   {"id": "executar", "chama": "sa-pesquisar.pesquisar"},
   {"id": "finalizar"},
   {"id": "desdobramentos", "saidas": {"gerar alteração (defeito ou mudança)": "→ sa-triar.triar", "regra que ninguém decidiu": "→ sa-entrevistar.entrevistar", "consulta reaproveitável: lição": "→ sa-aprender.registrar", "arquivar": "fim"}}
 ]}
---
# Atender — atender sem perder o rastro

Atendimento é trabalho real que não vira código: alguém pergunta (chamado, e-mail, pedido), o time consulta, responde
e segue. É a categoria **Atendimento** da **Sustentação** — a única categoria com fluxo próprio; as demais
(Implantação, Banco de dados, Infra, Operação, Apoio a outros times) usam a [`sa-executar`](~/.sabia/framework/skills/sa-executar/SKILL.md).
A **`sa-triar`** registra a demanda (`AT-nnn`, linha na `### Atendimento` da `## Sustentação` do `backlog.md`, IB
`[AT-nnn]` no EWM; a tarefa `[ATD]` nasce quando o AT entra numa sprint); este fluxo é o de quem **atende**: assume
a `[ATD]`, executa e finaliza, deixando um registro versionado **sem dado de cliente**.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

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
