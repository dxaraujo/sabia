---
{"fluxo": "fatia", "dono": "sa-especificador",
 "quando": ["especificação de fatia: a [ESP] FT-nnn da fatia nova que não passa na DoR (inclusive falta: especificação) ou da fatia que voltou à especificação (plano, revisão, verificação, consolidação)", "pegar a [ESP] da FT-031", "especificar a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige"},
   {"id": "assumir"},
   {"id": "trabalho", "saidas": {"sem artefato afetado": "concluir"}},
   {"id": "artefatos"},
   {"id": "escrever"},
   {"id": "revisao", "chama": "sa-revisar.revisar", "saidas": {"achado que é decisão de negócio": "trabalho"}},
   {"id": "aprovacao", "saidas": {"ajuste pedido": "escrever"}},
   {"id": "concluir", "saidas": {"desdobramento: alteração, regra ou demanda nova": "→ sa-triar.triar"}}
 ]}
---
# Especificar — especificação de fatia (`[ESP] FT-nnn`)

A `[ESP] FT-nnn` é a tarefa de quem especifica numa fatia. Ela deixa pronta a fatia `nova` que não passa na DoR: a
ficha incompleta e, na de toda trilha, os artefatos do ELM da seção **Artefatos afetados** (`inclui` · `altera` ·
`exclui`), que nascem aqui como conceitos OKF, passam pela revisão P e pela aprovação do especificador e vão à base em
`.kiro/specs/ft-<nnn>-<slug>/elm/`. A mesma tarefa, reaberta, recebe a fatia `iniciada` ou `pronta` que voltou à
especificação (plano, revisão, verificação, consolidação). A publicação no ELM é da consolidação, depois do merge. A
`[DEV]`, a `[REV]` e a `[VER]` nascem quando ela, `elegivel`, entrar numa sprint.

Entrada: a `[ESP] FT-nnn` na sprint aberta — a linha viva da fatia na seção Especificação do `sprint-<nn>.md`
aberto, criada pelo planejamento ou pelo encaixe (a linha da fatia na seção Fatias não conta; sem a da
Especificação → "fale com o P.O. ou o SM (agente `sa-produto`)"): da fatia `nova`, ou da fatia `iniciada` (Fase `bloqueada`, Bloqueio
`aguardando especificação [ESP] FT-nnn`) ou `pronta` (Drift com `especificação: [ESP] FT-nnn`) com a `[ESP]` aberta.

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `EP-nn` ou `[ESP] EP-nn` → `sa-especificar.especificar`
- fatia `nova` no backlog, sem a `[ESP]`, só com `falta: especificação` → "entra na sprint pelo planejamento ou pelo encaixe (P.O. ou SM, agente `sa-produto`)" ■
- fatia `nova` no backlog, sem a `[ESP]`, com outra falta → "completar é do P.O., pela `sa-triar` (agente `sa-produto`)" ■
- fatia `elegivel` até `iniciada` sem `[ESP] FT` aberta → "é do Dev: `sa-desenvolver FT-nnn` (agente `sa-desenvolvedor`)" ■
- fatia `pronta` sem `[ESP] FT` aberta → "é da consolidação: `sa-consolidar FT-nnn` (agente `sa-produto`)" ■

## Regras

As Regras de `sa-especificar.especificar` valem aqui, com a pasta de trabalho da fatia no lugar da do épico: até a
aprovação, nada dos artefatos vai à base — só a linha da Especificação (passo `assumir`).
- Só os artefatos da seção Artefatos afetados da ficha: outro só entra com a autorização do P.O. ou do SM registrada na linha
  nova; sem ela, é desdobramento (passo `concluir`).
- Nada vai ao ELM por este fluxo: o aprovado vai à base, e a consolidação o publica depois do merge.
- Toda sessão fecha como o passo `sa-especificar.especificar.fechar-sessao` (comentário, anexos `elm-<arquivo>.md`
  da pasta de trabalho, horas na `[ESP]`), com a linha de créditos na seção `## Créditos` da ficha.
