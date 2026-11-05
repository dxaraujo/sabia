---
{"resumo": "Entrada comum de quem pega um item: existe, é deste fluxo, está na sprint, a branch certa; e a regra comum de assumir."}
---
## Entrada

Um id (`FT-031`, `EP-04`, `AT-012`, número do EWM), uma tarefa (`[DEV]`, `[REV]`, `[VER]`, `[APR]`, `[ESP]`, `[ATD]`…)
ou um pedido em texto. O que muda de um fluxo para outro vem de Sprint e de Branch deste fluxo (acima) e da seção
Entrada: vizinhos do fluxo.

## Faça

**Chamado por outro fluxo** (⇄ em linha, subagente, `AUTONOMO=true`) → pule este passo inteiro: quem chamou já entrou.
Passagem (⇒, a saída `→ sa-x.f` de outro fluxo) não é chamada: a entrada roda. Em qualquer caso, uma saída do passo
`entrada` no mestre que casa com o estado vence a frase do caso (ex.: `→ sa-triar.triar` no lugar de "use `sa-triar`" e
pare).

Senão, nesta ordem; o primeiro caso que casar decide:

1. **Existe?** Leia o item pela regra A base prevalece do padrão `sa-desenvolver/status.md`: o `status.md` da fatia
   nas branches (as refs: `git for-each-ref --format='%(refname:short)' refs/heads refs/remotes`, que já cobre as
   branches das worktrees; em cada ref,
   `git ls-tree -r --name-only <ref> -- .kiro/specs/ | grep '^.kiro/specs/<id em minúsculas>-[^/]*/status.md$'`, e
   leia o achado com `git show <ref>:<caminho>`) e na base; depois o `backlog.md` da base (ids locais e a coluna
   `elm`). Épico (`EP-nn` ou `[ESP] EP-nn`): a Fase do `status.md` do épico (padrão `sa-especificar/status-epico.md`),
   na pasta da coluna `pasta` do `backlog.md`, na base; sem ele na base (antes do GATE do PRD), o da pasta de trabalho
   `.sabia/local/especificacao/<EP>-<slug>/` (Fase `rascunho` ou `em-revisao`). Número do EWM → a linha com esse
   número na coluna `elm`, depois do rótulo (`DF [4567](…)`, `IB [612010](…)`; registrado sem o MCP: `DF 4567`); IB de um épico →
   a linha do épico; IB de estrutura (`Sustentação`, `Manutenção`, de categoria) → liste os itens não terminais
   abaixo dele e pergunte qual; tarefa `[<papel>] <id>` → o item do pai. O EWM (`elm_ler_wi`) e a pessoa só completam dados;
   nunca se inventa dado de work item. Pedido em texto, ou id que não está no `status.md` nem no `backlog.md` → não
   está registrado: "use `sa-triar`" e pare. Terminal (`concluida`, `concluido`, `cancelada`, `cancelado`,
   `dividida`) → mostre a situação e a `obs` (a substituta, quando há) e pare; reabrir é item novo pela `sa-triar`.
   Uma linha dos vizinhos que qualifica o terminal vence esta regra.
2. **É deste fluxo?** O estado do item (fase, tipo, tarefa e o que a linha qualifica) casa com uma linha dos
   vizinhos → linha com a dona: "<id> em <estado>: entre pela <dona>" (com o agente dela, quando é outro) e pare;
   linha terminada em ■: diga a frase entre aspas da linha, como está, e pare; a linha com
   qualificador vence a fase pura. O estado que segue num passo deste fluxo que não é o próximo vem nas saídas do
   passo `entrada` no mestre: siga por ele, sem parar. Nem deste fluxo nem dos vizinhos → "não é deste papel: use `sa-iniciar <id>`"
   e pare.
3. **Sprint**, pelo modo da linha Sprint deste fluxo:
   - `exige`: o item tem linha viva no `sprint-<nn>.md` aberto
     ([Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), Linha viva), na seção do
     papel: Especificação para a `[ESP]`; Fatias ou Sustentação para os demais (a linha da fatia na seção Especificação
     não põe a fatia na sprint do Dev). Sem sprint aberta, sem linha ou só a linha com `saiu da sprint` → "fale com o P.O. ou o SM (agente `sa-produto`)" e
     pare. A puxada é sempre do encaixe (`sa-planejamento.durante.encaixe`): o P.O., o SM ou quem puxa com a
     aprovação do P.O., registrada (quem aprovou e quando).
   - `nao`: pule; o item chega já dentro da sprint (a tarefa dele só nasce com ela).
4. **Branch da fatia**, pela linha Branch deste fluxo: `nao` → pule. `fatia`: fatia em branch diferente da atual →
   pergunte se troca (nunca ofereça descartar, `stash` ou `reset`); sem o "sim" → pare; com alterações locais não
   commitadas → avise e pare. **Branch
   aberta numa worktree** (`git worktree list` mostra `.sabia/local/wt/<ft>` com ela — fatia do `sa-orquestrar`):
   não troque, o `git switch` falha; trabalhe na worktree — comandos com `cd .sabia/local/wt/<ft> && <comando>`,
   arquivos pelo caminho `.sabia/local/wt/<ft>/<caminho>` — e passe isso à próxima skill.

## Saída

Item registrado, deste fluxo, na sprint (modo `exige`) e na branch certa (branch `fatia`) → o próximo da lista, ou o passo que uma
saída do passo `entrada` no mestre indica; ele assume pela seção Assumir abaixo.

## Pare se

- Não registrado, terminal, vizinho ou de outro papel (casos 1 e 2) → a frase do caso e pare.
- Modo `exige` sem linha viva na sprint aberta → "fale com o P.O. ou o SM (agente `sa-produto`)" e pare.
- Branch `fatia` diferente da atual: sem o "sim" à troca, ou com alterações locais não commitadas → avise e pare.

## Assumir

Não roda aqui: o fluxo assume no próprio passo, e as travas do papel (quem pode pegar a tarefa) vêm antes de
tocar no EWM. Quem executa = o login de quem está na sessão (item 8 da
[Coleta](~/.sabia/framework/skills/sa-status/SKILL.md#coleta) da `sa-status`). Passadas as travas, pela tarefa do item
(`elm_transicao(<id>, "assumir")`): o retorno do EWM decide, e o `responsavel` da linha que diverge dele se corrige
na sincronização da sprint.

- Assumida (sem `ja_estava`) → quem executa vira o responsável. Na `[ESP]` (épico ou fatia), o responsável é o
  Responsável da linha dela na seção Especificação da sprint: o `backlog.md` não muda (o `responsavel` da fatia é
  de quem implementa). Fora da `[ESP]`, na fatia com `responsavel` `—` e não iniciada é a primeira atribuição: o
  modo sai agora pela senioridade de quem assume (não é troca). Grava na base só o fluxo que
  tem os registros do `backlog.md` e dos `sprints/`; os demais deixam a coluna para a sincronização da sprint.
- Já é de quem executa (`ja_estava`) → nada a fazer.
- De outra pessoa (`conflito`): item de Sustentação → pergunte e, com "sim", repita com `forcar: true`; nos demais
  → "é de <login>; trocar é do P.O. ou do SM" e pare.
- Tarefa fechada (`precondicao`) → mostre o estado e, com "sim", `elm_transicao(<id>, "reabrir")` e de novo o
  `assumir`; sem o "sim" → "sincroniza a sprint (P.O. ou SM, agente `sa-produto`)" e pare.
- Sem o MCP `elm` → com `responsavel` `—`, como na assumida; e `ELM pendente [<tipo> <id do item> assumir]: assumir a <tarefa>` (ex.: `[DEV FT-031 assumir]`,
  `[ESP EP-05 assumir]`, `[ATD AT-012 assumir]`) no lugar das pendências do item
  ([Pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)), e siga.
- Fluxo sem tarefa própria no EWM → pule esta seção.
