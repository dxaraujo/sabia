---
{"resumo": "Filtra os itens novos do EWM, tira os que já estão no fluxo, propõe a triagem numa tabela e, com um \"sim\", registra cada linha."}
---
## Entrada

"Importar do EWM", "triar os defeitos do time" — precisa do MCP `elm` nesta sessão. Na base, conferida pelo passo
`sa-triar.triar.chegou` (bloco Gravar na base).

## Faça

0. Se a sessão não passou pelo passo `sa-triar.triar.chegou`: os itens 1 e 5 do bloco
   [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) e o espelhamento Backlog sem IB, como no passo
   `sa-triar.triar.chegou`.
1. **Filtro**, com padrão e uma confirmação: o `pa` (vários → pergunte qual), a iteração (padrão: o backlog do
   produto, `iteracao = backlog` — `pa` sem backlog → peça "atualizar a configuração do Sabiá" (a `sa-setup`, na sessão padrão, roda o §0 do
   [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md)) e pare; o MCP não lista sem iteração, dono ou pai), tipos
   Defeito e Item de Backlog, estado `Novo` (o nome do estado inicial na PA; a pessoa troca).
   `elm_listar_wi(iteracao, tipo, estado)`, por tipo.
2. **Fora do lote:** os itens do fluxo — pelo **id**, todo id do `backlog.md` (colunas `origem` e `elm` e as linhas
   da `## Sustentação` e das `### <Categoria>`), e pelo **título exato** `Sustentação`, `Manutenção` ou o de uma
   categoria (nunca pela palavra inicial: "Infra: certificado vencido" é demanda) —, as tarefas (as da iteração da
   sprint entram pelo passo `sa-planejamento.durante.sincronizar`, "sincroniza a sprint") e, depois de ler o item (item 3), o que tem pai
   do fluxo (um id do `backlog.md`) ou o comentário `sabia: não fazer`.
3. Leia cada item (`elm_ler_wi(id, comentarios = -1)` (todos)) e proponha a triagem numa tabela, com **uma
   confirmação para o lote**:
   ```
   📥 Lote EWM — <time> · <tipos> · estado <…> · <n> itens novos (<m> já no backlog)
   | Item | Tipo | Título | Trilha | Status | Motivo |
   |---|---|---|---|---|---|
   | DF 4567 | Defeito | Juros calculados em dobro no atraso | rápida | nova | comportamento certo na REG 2101; falta: artefatos afetados |
   | IB 611 | Item de Backlog | Portal de renegociação de dívidas | épico | novo | várias histórias, decisões de produto; falta: quem pede |
   | IB 613 | Item de Backlog | Limitar o desconto de pontualidade a 10% | padrão | nova | regra nova clara; falta: regras, cenários, artefatos afetados e aprovação do P.O. |
   | DF 4570 | Defeito | Erro ao consultar CPF sem máscara | rápida | nova | falta: como reproduzir, artefatos afetados |
   | IB 615 | Item de Backlog | Relação de contas bloqueadas para a auditoria | sustentação · Atendimento | aberto · 2026/Sprint 03 | extração, sem mudança |
   "sim" registra tudo · ou ajuste por linha (ex.: "DF 4570: não fazer")
   ```
4. Com "sim": o passo `sa-triar.triar.registrar` para cada linha (o item fora do estado inicial volta a ele), sem commit aqui (o lote entra no commit
   único do passo `sa-triar.triar.encaminhar`, resposta "não") e com o EWM numa confirmação só. Padrão no lote → ficha em `rascunho` só com o Pedido e `falta: regras, cenários, artefatos afetados e aprovação
   do P.O.`; rápida → `nova` com `falta: artefatos afetados` e o mais que a ficha da trilha pedir (a entrevista e a
   lista confirmada são uma a uma, depois, pelo fluxo `sa-triar.triar`). A seção Artefatos afetados das duas fica
   `Lista a confirmar na triagem.` (padrão `sa-triar/ficha.md`). Sustentação no
   lote → registrado como no passo `sa-triar.triar.registrar`, sem a entrevista curta (o item do EWM é o pedido e o IB do item; prazo e
   critério de pronto ficam `—`), com a categoria, a sprint e o responsável da tabela e, se entra na sprint, a tarefa
   na mesma confirmação.

## Saída

A tabela com os ids criados e o que ficou pendente — e **"Mais algum item para triar?"** (passo
`sa-triar.triar.encaminhar`).

## Pare se

- Sem o MCP `elm` nesta sessão → diga isso e pare.
- Mais de 15 itens → mostre a contagem e peça um filtro mais fino.
