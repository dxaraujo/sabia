---
{"resumo": "Pontos positivos · negativos · de melhoria · ações propostas, levantados e votados pelo time na página sabia retrospective."}
---
## Entrada

Os dados do ciclo.

## Faça

A `## Retro` do `sprint-<nn>.md` recebe **pontos positivos** · **pontos negativos** · **pontos de melhoria** · **ações
propostas**, cada ação com dono (`usuario` do `equipe.json`). Ponto é o assunto que a pessoa levanta; quem levanta e
quem vota é o time.

1. Peça à pessoa que conduz para abrir a página, no terminal dela, na branch base: `sabia retrospective` (com
   `--propostas .sabia/local/cerimonia/propostas.json` se o passo `dados` gravou propostas, e `--rede` para o time abrir
   o link). A página mostra os dados do ciclo; cada um entra com o nome, inclui, vota e remove; cada mudança regrava a
   `## Retro`, com quem levantou e quem votou em cada linha.
2. Com o "terminamos", leia a `## Retro` do `sprint-<nn>.md` e mostre o resultado pela ordem dos votos. Ação sem dono →
   pergunte o dono.
3. Sem a página (a pessoa não quer, ou não há como abrir): conduza na conversa e monte as linhas no mesmo formato, com
   `por <quem levantou>` em cada uma.

A ação que muda uma política vai ao `acordos.json` (passo `reserva-capacidade` para a reserva de capacidade; as outras
chaves, com o "ok" de quem tem `produto`, no mesmo commit).

## Saída

A Retro → passo `fechar`.

## Pare se

Sem condição própria.
