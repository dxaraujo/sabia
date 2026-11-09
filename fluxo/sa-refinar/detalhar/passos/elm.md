---
{"resumo": "Com ELM e artefatos afetados com inclui, altera ou exclui: pergunta a autonomia da especificação e chama a sa-especificar.elm, que monta e aprova os arquivos de elm/ da fatia."}
---
## Entrada

Os artefatos afetados do passo `artefatos`; na volta da especificação manual (`alterei FT-nnn`), a ficha com `Especificação: manual`.

## Faça

Sem ELM (sem a chave `elm` no `agentes.json`), ou artefatos afetados sem `inclui`, `altera` ou `exclui` → pule este passo (sem
pergunta e sem a linha Especificação na ficha).

1. **Escolhas da especificação**, num bloco só e antes de chamar a skill; cada uma fica aberta até a resposta da pessoa:
   - **Autonomia**, fixa até o fim da especificação e independente da autonomia da codificação; mostre a recomendada e as
     outras: `IA supervisionada` (o agente edita e o especificador aprova cada arquivo) · `IA autopilot` (o subagente edita
     sem perguntas) · `manual` (o especificador altera direto no DOORS).
   - **Sprint**: com sprint aberta sem a linha da especificação, "acrescento a linha de especificação na sprint?".
   - **ELM**: "quer criar o item no ELM?". O ELM fora do ar não dispensa a pergunta.
   Grave `Especificação: <autonomia>` no cabeçalho da ficha só com a resposta explícita.
2. **Chame a `sa-especificar.elm`** com o especificador presente, a autonomia e as respostas de sprint e ELM. Ela monta a pasta `elm/` dentro da pasta da
   spec (`.kiro/specs/ft-<nnn>-<slug>/elm/` ou `openspec/changes/ft-<nnn>-<slug>/elm/`, pelo `formato_spec`), aplica
   a trava de artefato, baixa os originais e grava o commit de referência, direto na branch base.
   - IA supervisionada ou IA autopilot: edita, e o especificador aprova cada arquivo inteiro (HF, UC, REG, MSG, EL, GL, RF, RNF).
   - Manual: o especificador altera direto no DOORS, e a skill encerra a especificação nesta sessão; na volta
     (`alterei`), ela sincroniza e segue para a aprovação.
3. **Volta**: a `sa-especificar.elm` devolve os arquivos aprovados, pendentes e travados. Artefato travado → Em aberto
   da ficha: `bloqueada por FT-mmm (<sigla>-<id>)`; a fatia espera a outra ficar cancelada ou publicada.
4. **Sem o especificador na sessão**: os artefatos afetados ficam gravados e o item segue `aceita` (DoR incompleta).

## Saída

Os arquivos de `elm/` aprovados, pendentes e travados, e a linha Especificação → passo `duvidas`.

## Pare se

Nenhuma condição própria: pendência de `elm/` só deixa a DoR incompleta.
