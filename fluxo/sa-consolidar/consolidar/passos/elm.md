---
{"resumo": "Numa confirmação, publica no ELM a ET as-built (ajustada pela skill de toolkit do tipo ET, quando há) ligada à [DEV] e ao código, os casos de teste da fatia e a conclusão do IB, lança as horas do SM e prepara os créditos; sem o MCP, pendências."}
---
## Entrada

O drift lido (passo `drift`).

## Faça

Com o MCP `elm`; senão registre pendências.

Numa confirmação só, nesta ordem, como diz [elm-publicar.md](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md).
Os requisitos e os CT planejados já foram publicados na conclusão da `[ESP]`: aqui não sobem (os casos de teste usam
os ids deles).
- *especificação técnica* — se a linha ET do `sabia.md` diz `só as-built` ou `inicial no PRD + as-built`: a ET
  **as-built** chegou escrita pelo Dev no PR (`elm/ET-<slug>.md`) e foi julgada com o código (rubrica C15); você
  não a escreve nem a reescreve, salvo pelo toolkit: tipo `ET` com skill de toolkit no seu prompt (**Tipos com skill
  de toolkit**) → antes de publicar, ajuste a ET as-built pela skill (o fluxo e o padrão do tipo pelos caminhos da
  linha; sem eles, as references dela), sem mudar o que o código faz, e confira o contrato na volta (arquivo,
  envelope do `okf-elm.md`); a diferença vai na prévia, e o `verified` humano passa a ser de quem consolida.
  O `verified` humano é de quem aprovou o código: `{ by: human:<login>, at: <data da aprovação> }` do revisor
  (`revisao-codigo-<N>.md` APROVADO, HITL) ou do Dev Sênior da `[APR] Aprovar PR` (AFK), com `status: stable`.
  Ela sobe com a linha `Código: PR <link> · merge <sha curto>` no texto e ligada à `[DEV]` da fatia (`implementa`).
  Sem a ET no PR → `ELM pendente [ET FT-<nnn> escrever]` para o Dev, que a entrega num PR curto. Fatia de épico com
  ET inicial → a as-built sobe ligada a ela (seção ET as-built do `elm-publicar.md`);
- *casos de teste* — pela linha Casos de teste do `sabia.md`: `ETM` (com `qm` no `pa`) → por cenário verificado
  (`verificacao.md`/`CT.csv`), o CT planejado (publicado na `[ESP]`) ligado ao IB e o CT novo criado, ids no `verificacao.md` e no
  `status.md`; `CSV` (ou sem `qm`) → o `CT.csv` é a
  entrega, sem ELM pendente;
- *tarefas* — a consolidação **não** lança horas nem conclui `[DEV]`, `[REV]`, `[VER]` ou `[APR]`: cada skill de
  papel concluiu a sua (a `[DEV]` no merge, a `[REV]` ao aprovar, a `[VER]` ao aceitar, a `[APR]` na aprovação do
  plano ou do PR; no AFK não há `[REV]` nem `[VER]`). Tarefa da fatia ainda aberta (a `[DEV]` aberta já parou no
  passo `entrada`) → mostre qual e de quem, e
  registre `ELM pendente [<chave>]: concluir <tarefa> (<login>)`, que a pessoa faz na sessão dela;
- *backlog* — concluir o IB da fatia (e o do épico, na última fatia — passo `fechar`). Tarefa concluída sem horas não
  trava: a virada aponta. A consolidação é **pré-condição dos ritos de fechamento** da sprint (review, retrospectiva,
  virada): fatia `pronta` sem ela para o rito, salvo decisão do P.O.;
- *horas* — só o SM lança as da consolidação na `[GB] Gerenciamento do backlog`: `elm_lancar_horas(id, horas)`
  (lança, não conclui — a `[GB]` é contínua). O P.O. nunca lança horas, nem quando também é o SM.
- *créditos* — em toda consolidação, do P.O. ou do SM, os créditos desta sessão
  ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) vão, no passo `fechar`, num comentário na `[GB]`
  (`elm_comentar(<id da [GB]>, "Créditos consolidação FT-<nnn>: <créditos> (sessão <sessão>, <login>, <AAAA-MM-DD>)")`,
  com "sim") e na seção **Créditos de gestão** do `sprint-<nn>.md` aberto (Atividade `consolidação FT-<nnn>`), no
  commit do passo `fechar`. `## Sustentação` sem a `GB` → indique o fluxo `sa-planejamento.inicial` (ou crie-a pelo
  [elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §2, com "sim"); sem ela, grave só a linha em
  Créditos de gestão. Falha no comentário → `ELM pendente [GB <id> créditos]` no lugar das pendências da `[GB]`
  ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4), não no `status.md`.

Sem o MCP `elm` nesta sessão ou com falha → `ELM pendente [<chave>]: <ação>` no Histórico do `status.md`
([pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)). Depois da publicação, a `sa-sync` traz o publicado ao bundle (e
pergunta se indexa; a busca local também indexa o que mudou, em segundo plano).

## Saída

O publicado no ELM (ids no `verificacao.md` e no `status.md`) ou as pendências no Histórico → passo `conhecimento`.

## Pare se

—
