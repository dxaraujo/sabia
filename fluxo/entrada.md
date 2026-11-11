---
{"resumo": "Entrada comum de quem pega um item: existe, terminal, impedida, é deste fluxo, papel pelo equipe.json, dono e a branch <id>."}
---
## Entrada

Um id do Sabiá (`EP-nn`, `FT-nnn`, `AT-nnn`, `IM-nnn`, `BD-nnn`, `IN-nnn`, `OP-nnn`, `EX-nnn`), um número do EWM, uma
tarefa do EWM (`DEV`, `ESP` ou `ATD` com o número) ou um pedido em texto. O que muda de um fluxo para outro vem de
Papel e de Branch deste fluxo (acima) e da seção Entrada: vizinhos do fluxo:

- **Papel**: a booleana do `equipe.json` que o fluxo exige: `desenvolvedor`, `especificador`, `produto` ou `nenhuma`.
- **Branch**: `fatia` (o trabalho é na branch `<id>` do item) ou `nao`.
- **Vizinhos**: uma linha por estado que é de outro fluxo, com a dona.

A sprint nunca é pré-condição. Cada fluxo grava o próprio responsável, e o ELM é só oferecido (`sa-elm.item`).

## Faça

**Chamado por outro fluxo** (em linha, como subagente ou pelo autopilot) → pule este passo inteiro: quem chamou já
entrou. A passagem (a saída `→ skill.fluxo` de outro fluxo, que a pessoa aceita) não é chamada: a entrada roda. Uma
saída do passo `entrada` na definição do fluxo que casa com o estado vence a frase do caso.

Senão, nesta ordem; o primeiro caso que casar decide:

1. **Existe?** Rode `git fetch` e leia o `backlog.md` da branch base (com a branch base local atrás do remoto, o de
   `origin/<branch_base>`; sem rede, o local). Id do Sabiá → a linha dele. Número do EWM → a linha com esse número na
   coluna `ib`. Tarefa do EWM → a linha do `sprint-<nn>.md` que a tem em Tarefas e, por ela, o item. Fatia ou bug
   com branch `<id>`: o `status.md` dela (Fase) completa o estado, mas o status vem da linha da branch base. Pedido em
   texto ou id fora do `backlog.md` → pergunte "não está registrado: cadastro agora?". Com o "sim", rode o cadastro
   comum (a linha nasce `nova`; épico, `a-moldar`) e siga só se os vizinhos deste fluxo aceitam esse status; senão
   diga "cadastrado `<id>`; a triagem é pela `sa-triar.triar`" e pare. Nunca invente dado de work item: o EWM (pela
   `sa-elm.item`) e a pessoa só completam.
2. **Terminal?** Status `concluida`, `concluido`, `cancelada` ou `cancelado` → mostre o status e a `obs` e pare. Com
   `virou <id>` na `obs`, diga "o item seguiu como `<id>`". Pedido novo sobre item terminal não reabre nada: é item
   novo pelo cadastro comum, com `origem <id>` na `obs`.
3. **Impedida?** Status `impedida` ou `impedido` (todo tipo) → mostre a coluna `motivo`: o que impede, quem, desde
   quando e até quando. Com o `até` vencido, libere sem perguntar. Senão, pergunte "o que impedia foi resolvido?
   libero?"; só libera quem tem `produto` ou é o responsável da tarefa em curso (regra da `sa-status.situacao`). Sem o
   "sim", ou sem poder: pare. Liberar: o status volta ao `de <status>` do `motivo`, a coluna `motivo` fica vazia e a
   `obs` ganha `impedida <desde> a <hoje>: <motivo>`. A correção grava pelo commit direto na branch base junto com a
   próxima gravação do fluxo (ou logo, se o fluxo não grava estado). O item segue pelo status que voltou.
4. **É deste fluxo?** O estado do item (tipo, status da linha e, na fatia em andamento, a Fase do `status.md` ou o MR
   aberto, que dá o `em-revisao` derivado) casa com uma linha dos vizinhos → linha com a dona: "`<id>` está
   `<estado>`: entre pela `<skill.fluxo>`" (com o agente dela, quando é outro) e pare; linha terminada em ■: diga a
   frase da linha, como está, e pare. Uma linha dos vizinhos vence o caso terminal; o caso impedida vem antes dos vizinhos e vale para todo fluxo. Estado aceito por
   este fluxo: siga. Nem deste fluxo nem dos vizinhos → "não é deste fluxo: veja `sa-status.item`" e pare.
5. **Papel.** O usuário da sessão é o usuário do GitLab (o MCP `gitlabpr` informa; sem o MCP, pergunte uma vez na
   sessão), procurado no campo `usuario` do `equipe.json`. Papel `nenhuma`: siga mesmo fora do `equipe.json`, e o
   relator vira `externo: <nome>`. Outro papel: fora do `equipe.json` → "peça a inclusão na equipe
   (`sa-planejamento.inicial`)" e pare; sem a booleana → "isso é de quem tem `<booleana>`: `<nomes>`" e pare.
6. **Dono.** Item com responsável diferente do usuário da sessão, num fluxo que grava o responsável → mostre de
   quem é e só siga com o "sim". O fluxo grava o novo responsável na linha.
7. **Branch.** Branch `nao`: pule. Branch `fatia`, com a branch `<id>` do item diferente da atual → pergunte "troco
   para `<id>`?" (nunca ofereça descartar, `stash` nem `reset`). Sem o "sim": pare. Árvore suja: avise e pare. Branch
   aberta numa worktree do autopilot (`git worktree list` mostra `.sabia/local/wt/<id>`) → "`<id>` está no
   autopilot: espere a devolução" e pare. Sem branch `<id>`, o fluxo decide pelos vizinhos.

## Saída

Item registrado, deste fluxo, com a pessoa certa e na branch certa → o próximo da lista, ou o passo que uma saída do
passo `entrada` na definição do fluxo indica para aquele estado.

## Pare se

- Não registrado sem o "sim" ao cadastro, terminal, impedida sem o "sim", vizinho ou fora deste fluxo → a frase do caso,
  com a `skill.fluxo` seguinte quando há uma, e pare.
- Fora do `equipe.json` ou sem a booleana do papel → a frase do caso e pare.
- Branch `fatia`: sem o "sim" à troca, árvore suja ou branch no autopilot → avise e pare.
