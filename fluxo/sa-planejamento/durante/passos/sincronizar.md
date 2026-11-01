---
{"resumo": "Sincronizar com o EWM (§9): traz as tarefas por fora, compara os itens conhecidos e mostra uma tabela com a solução proposta, ou a linha iguais."}
---
## Entrada

"sincroniza a sprint", "sincronizar com o EWM"; o painel da `sa-status` avisa quando há
tarefa por fora, divergência ou id `a conferir`.

## Faça

**Sincronizar com o EWM** — **leva o Sabiá até onde o trabalho chegou**: acabados os tokens, o
time segue no desenvolvimento tradicional (código, PR, merge, tarefas no EWM), e a sincronização põe os arquivos e o
EWM em dia ([elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9). Fontes: o EWM (a iteração da sprint e, numa
chamada, a de backlog — `elm_listar_wi(iteracao = backlog)`), o `status.md` (base e branch, pela regra A base
prevalece, inclusive a fase), o `sprint-<nn>.md` × `backlog.md` e o git (a branch da fatia, o PR e o merge: a **rede
de proteção**, que roda dentro do §9, também sob pedido). Traz o que nasceu **por fora** — tarefa criada direto no EWM
(Sustentação, ou uma `[DEV]`/`[ESP]` aberta à mão quando a sessão do agente parou) entra na sprint com o mesmo id: o
Sabiá infere o que ela é e propõe o tipo e o título (renomear, só incluir o prefixo ou manter o título); a de
Sustentação sem item vira item, com o IB dele acima dela (a que tem por pai um IB ou defeito fora do `backlog.md` vai
com ele para a triagem) — e compara **o que mudou** nos itens que os arquivos já
conhecem (estado, iteração, dono, estimativa; as tarefas de papel pela fase do `status.md`; o IB do backlog fora do
estado inicial). Mostra **uma tabela**, agrupada por item, com todas as divergências e as por fora, cada linha com a
solução proposta: "ok" aplica tudo como proposto, ou a pessoa ajusta uma ou mais linhas (`<n>: arquivo`,
`<n>: EWM`, `<n>: manter`; na por fora, o tipo e o título). A situação da fatia e do épico nunca muda pelo estado do
EWM, só pela skill que a causa ou pela evidência do git (PR mergeado → `pronta`; PR aberto, branch com commits ou
`status.md` numa branch → `iniciada`); na Sustentação, o arquivo recebe o EWM. As linhas que mudam o escopo (o item que sai
da sprint, o encaixe, o épico que entra com a `[ESP]`) esperam o "sim" do **P.O.** — sem ele, ficam `manter` nesta
rodada —, e as `encaixe` seguem depois, uma a uma, para o Encaixe (passo `encaixe`). Sprint não publicada
(`**Publicação no EWM:** pendente`) → a primeira linha cria a iteração e o plano (§1), e a listagem vem depois do
"ok". Nada diverge → sempre a linha `🔄 <chave> × EWM: iguais — <n> itens conferidos`; nunca diga que "não é preciso
sincronizar" sem ter rodado a comparação. Sem o MCP `elm` → diga que não há como comparar com o EWM; só as linhas do
git (a rede de proteção) seguem.

## Saída

A tabela aplicada, ou a linha `🔄 <chave> × EWM: iguais — <n> itens conferidos`. Linhas `encaixe` → passo
`encaixe`, uma a uma; nenhuma → o fluxo termina.

## Pare se

Sem condição de parada própria: as linhas que mudam o escopo, sem o "sim" do **P.O.**, ficam `manter` nesta rodada.
