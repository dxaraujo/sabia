---
{"resumo": "Retrospectiva com dados (fluxo, correções humanas, autonomia, créditos, propostas); pergunta quais propostas aplicar e grava os créditos da sessão."}
---
## Entrada

Fim de fatia, épico ou sprint (a de sprint chamada pelo passo `sa-planejamento.retrospectiva.retro`, com a
pré-condição cumprida).

## Faça

Com dados, não impressões:

```
🔁 Retrospectiva — <FT | EP | <pai>/Sprint <nn>>
Fluxo: <fatias concluídas> · lead time médio <d> dias · retrabalho <n> rodadas de revisão / <n> verificações
Onde o humano corrigiu: <n> correções (<causa> <n> · …)
Autonomia: AFK <n> (<x> sem intervenção) · HITL <n>
Créditos: <total> · por fatia <média> · por versão do power sabia <versão> <x> · …
Débito de especificação: <n> (<FT…>) · <m> com tarefa
Propostas: <promoções, rubricas, skills, steering>
```

Fontes: `status.md` das fatias (Histórico; a seção Créditos, para a versão do power), `revisao-*`, `verificacao.md`,
`licoes.md`, `backlog.md` e `sprint-<nn>.md` (Status; a coluna Créditos, para o total por item; a seção Débito de especificação, com a
Tarefa preenchida nas `<m>` com tarefa). As contas (lead time, rodadas de revisão, correções humanas — aqui também por
Causa proposta —, AFK sem intervenção) são as da `## Números` do
[arquivos.md](~/.sabia/framework/skills/sa-planejamento/references/arquivos.md#sprintspaisprint-nnmd), no recorte da
retrospectiva: a fatia, as fatias do épico ou as concluídas na sprint.

Termine perguntando quais propostas aplicar. Retrospectiva de fatia ou de épico grava, no commit dela
(`<FT | EP-nn> registrar retrospectiva`), a linha de créditos da sessão na seção **Créditos de gestão** do
`sprint-<nn>.md` aberto (Atividade `retrospectiva`; ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4))
e, na sessão do P.O. ou do SM, o comentário de créditos na `[GB]` (o mesmo item 4). A de sprint não grava créditos
próprios: vale a linha da `sa-planejamento` (a virada).

## Saída

As propostas escolhidas → fluxo `sa-aprender.registrar` ou `sa-aprender.promover`. Retrospectiva de épico ou de sprint (ou pedido da
pessoa) → passo `lint`; de fatia, o fluxo termina.

## Pare se

Sem condição de parada própria.
