---
{"resumo": "Mostra a fatia, o sentido e a regra pela senioridade do responsável; pergunta \"seguir na trilha <atual> ou alterar para <outra>?\" e registra a resposta."}
---
## Entrada

O pedido de troca do P.O. ou do SM, ou a fatia em `bloqueada (de: planejando)` com `aguardando troca de modo` e o
motivo.

## Faça

Leia a fatia pela regra A base prevalece do padrão `sa-desenvolver/status.md`: a fase, o Modo e o motivo (Histórico
do `status.md` da branch, por `git show origin/<branch>:…`), o `responsavel` e a `senioridade` dele no `equipe.json`.
Mostre a fatia, o sentido e a regra da janela (mestre do fluxo):

- **AFK → HITL:** sugira o **revisor** (Dev Sênior ativo, pela regra do revisor: `sa-planejamento.sprint.modo`) e o
  **verificador** (não quem implementa), cada um o de **menor alocação** na sprint: a soma das horas estimadas das
  tarefas abertas de cada pessoa na iteração da sprint no EWM (`elm_listar_wi(iteracao, dono)`); sem ELM, a contagem
  de fatias de cada um no `sprint-<nn>.md`. PR já aberto (`aguardando-aprovacao-pr`) → diga que a `[APR] Aprovar PR`
  existente será cancelada.
- **HITL → AFK:** Júnior → "nunca: Júnior é sempre HITL" e pare. PR aberto (campo PR do `status.md` preenchido, inclusive em
  `retrabalho` ou de volta a `implementando`) → "com o PR aberto, a `[REV]` e a `[VER]` já correm: segue HITL" e pare. Sênior → direto. Pleno → a pergunta abaixo é feita a
  ele, e a resposta fica anotada. Diga que a `[REV]` e a `[VER]` existentes serão canceladas no EWM.

Pergunte: "quer seguir na trilha `<atual>` ou alterar para `<outra>`?". Registre a resposta na Observação da linha
da fatia no `sprint-<nn>.md`: `modo: <atual> mantido (<quem>, <data>)`, ou, no Pleno,
`modo: HITL → AFK (Pleno <login> aceitou|recusou, <data>)`.

## Saída

Alterar → passo `gravar`. Seguir, Júnior, PR aberto ou o Pleno recusou → a Observação gravada, com o "ok", pelo
bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `<FT> trocar modo`; a fatia bloqueada
sai do bloqueio na retomada do Dev, no modo atual; diga por onde o Dev retoma, pela fase (a lista do passo `avisar`): o fluxo
termina.

## Pare se

- Pedido do Dev, fora do agente `sa-produto` → "a troca de modo é do P.O. ou do SM (agente `sa-produto`)" e pare.
- Fatia sem responsável e não iniciada → não é troca: o modo sai de quem a assumir (`sa-planejamento.sprint.modo`).
- Fatia fora do `backlog.md` → "use `sa-triar`" e pare.
- Fatia terminal ou `pronta` → mostre a situação: "sem troca de modo depois do merge" e pare.
- Fatia sem linha viva na sprint aberta → "o modo é o do backlog até a fatia entrar na sprint (planejamento ou
  encaixe)" e pare.
