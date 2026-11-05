---
{"fluxo": "fatia", "dono": "sa-especificador",
 "quando": ["especificação de fatia: a [ESP] FT-nnn da fatia nova que não passa na DoR (inclusive falta: especificação) ou da fatia que voltou à especificação (plano, revisão, verificação, aprovação do PR)", "pegar a [ESP] da FT-031", "especificar a FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "exige", "saidas": {"linha iniciada com conceito da fatia aprovado na base e ainda não publicado (na fatia iniciada, o do Bloqueio com o verified mais novo que o Bloqueio)": "publicar"}},
   {"id": "assumir"},
   {"id": "trabalho", "chama": "sa-entrevistar.entrevistar", "saidas": {"sem artefato afetado": "concluir"}},
   {"id": "artefatos"},
   {"id": "escrever"},
   {"id": "revisao", "chama": "sa-revisar.revisar", "saidas": {"achado que é decisão de negócio": "trabalho"}},
   {"id": "aprovacao", "saidas": {"ajuste pedido": "escrever"}},
   {"id": "publicar"},
   {"id": "concluir", "saidas": {"elegivel: o encaixe na sprint aberta, do P.O. ou do SM": "→ sa-planejamento.durante", "desdobramento: alteração, regra ou demanda nova": "→ sa-triar.triar"}}
 ]}
---
# Especificar — especificação de fatia (`[ESP] FT-nnn`)

A `[ESP] FT-nnn` é a tarefa de quem especifica numa fatia. Ela deixa pronta a fatia `nova` que não passa na DoR: a
ficha incompleta e, na de toda trilha, os artefatos do ELM da seção **Artefatos afetados** (`inclui` · `altera` ·
`exclui`), que nascem aqui como conceitos OKF, passam pela revisão P e pela aprovação do especificador e vão à base em
`.kiro/specs/ft-<nnn>-<slug>/elm/`. A fatia `iniciada` que voltou à especificação (plano, revisão, verificação,
aprovação do PR) volta à mesma tarefa, reaberta na sprint corrente, ou à `[ESP] FT-nnn Revisão <n>`, quando a tarefa
foi concluída numa sprint fechada, ou à `[ESP] FT-nnn Especificação` que o encaixe cria, na fatia de épico sem `[ESP]` ([Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)).
Na conclusão, o aprovado sobe ao ELM, ligado à `[ESP]` (passo `publicar`), e a fatia `elegivel` é oferecida ao
encaixe na sprint aberta: a `[DEV]` nasce ali; a `[REV]` e a `[VER]`, quando o Dev assume.

Entrada: a `[ESP] FT-nnn` na sprint aberta — a linha viva da fatia na seção Especificação do `sprint-<nn>.md`
aberto, criada pelo planejamento ou pelo encaixe (a linha da fatia na seção Fatias não conta; sem a da
Especificação → "fale com o P.O. ou o SM (agente `sa-produto`)"): da fatia `nova`, ou da fatia `iniciada` (Fase `bloqueada`, Bloqueio
`aguardando especificação [ESP] FT-nnn`) com a `[ESP]` aberta (a reaberta, a Revisão ou a do encaixe) — inclusive com a linha `concluida` nesta sprint
sem o motivo do Bloqueio na Observação, quando a volta foi achada na branch e ainda não foi assumida ([De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação): a linha
`iniciada` é gravada no passo `assumir`).

Leia antes: `.sabia/sabia.md`. Sem ele → ofereça a **`sa-setup`** ("configurar o Sabiá") e pare.

## Entrada: vizinhos

- `EP-nn` ou `[ESP] EP-nn` → `sa-especificar.especificar`
- fatia `nova` no backlog, sem a `[ESP]`, só com `falta: especificação` → "entra na sprint pelo planejamento ou pelo encaixe (P.O. ou SM, agente `sa-produto`)" ■
- fatia `nova` no backlog, sem a `[ESP]`, com outra falta → "completar é do P.O., pela `sa-triar` (agente `sa-produto`)" ■
- fatia `elegivel` até `iniciada` sem linha viva `planejada` ou `iniciada` na seção Especificação da sprint aberta (a reaberta fora da branch já volta `iniciada`; a achada na branch, com a linha `concluida` nesta sprint sem o motivo do Bloqueio `aguardando especificação [ESP] FT-nnn` na Observação, é deste fluxo: [De quem é a Volta](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)) → "é do Dev: `sa-desenvolver FT-nnn` (agente `sa-desenvolvedor`)" ■
- fatia `pronta` → "é da consolidação: `sa-consolidar FT-nnn` (agente `sa-produto`)" ■

## Regras

As Regras de `sa-especificar.especificar` valem aqui, com a pasta de trabalho da fatia no lugar da do épico: até a
aprovação, nada dos artefatos vai à base — só a linha da Especificação (passo `assumir`).
- Só os artefatos da seção Artefatos afetados da ficha: outro só entra com a autorização do P.O. ou do SM registrada na linha
  nova; sem ela, é desdobramento (passo `concluir`).
- O aprovado vai à base (passo `aprovacao`) e ao ELM na conclusão, ligado à `[ESP]` (passo `publicar`). Até ela
  concluir, a `[ESP]` aberta aceita mudança; depois, a mudança segue a Volta à especificação.
- Toda sessão fecha como o passo `sa-especificar.especificar.fechar-sessao` (comentário, anexos `elm-<arquivo>.md`
  da pasta de trabalho, horas na `[ESP]`). Na `[ESP] FT`: a linha de créditos na seção `## Créditos` da ficha, na
  base, pelo [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit
  `FT-<nnn> registrar sessão`; o comentário começa com `Sessão de especificação — FT-<nnn> · <AAAA-MM-DDTHH:MMZ>`;
  anexos só os de `elm/`, como `elm-<arquivo>.md`; a pendência `[ESP FT-<nnn> sessão <AAAA-MM-DD>]` como as demais.
- As pendências do ELM da `[ESP] FT` ficam sempre no rodapé da ficha, na base, também na fatia `iniciada`.
