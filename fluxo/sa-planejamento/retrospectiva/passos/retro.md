---
{"resumo": "Pontos positivos · negativos · de melhoria, agrupados e votados, as ações e as lições aprendidas, em etapas que o apresentador libera na página sabia retrospective."}
---
## Entrada

Os dados do ciclo.

## Faça

A `## Retro` do `sprint-<nn>.md` recebe **pontos positivos** · **pontos negativos** · **pontos de melhoria** · **ações
propostas**, cada ação com dono (`usuario` do `equipe.json`) e, quando nasce de um ponto, com o item dela (`sobre …`), e
as **lições aprendidas** do ciclo que o apresentador marcou Sim. Ponto é o assunto que a pessoa levanta; quem levanta e
quem vota é o time.

1. Peça à pessoa que conduz para abrir a página, no terminal dela, na branch base: `sabia retrospective` (com
   `--propostas .sabia/local/cerimonia/propostas.json` se o passo `dados` gravou propostas, e `--rede` para o time abrir
   o link). Quem abre a página nessa máquina é o apresentador: só ele libera a etapa seguinte, e não há volta. Cada
   um entra com o nome. As etapas:
   - **Pontos**: cada pessoa inclui, altera e remove os seus pontos positivos, negativos e de melhoria. Só ela e o
     apresentador veem o que ela escreveu. A proposta do `propostas.json` entra como ponto do autor dela.
   - **Agrupamento**: os pontos de todos ficam à vista, só texto. O apresentador junta os repetidos ou correlatos da
     mesma categoria num item, com o título escolhido entre os pontos e ajustado por ele.
   - **Votação**: cada um vota nos itens (o grupo conta como um). Só a pessoa e o apresentador veem o voto dela.
   - **Ações**: o resultado da votação aparece para todos. O time propõe ações para um item ou gerais; a tabela das
     ações junta todas.
   - **Lições aprendidas**: aparecem as lições do ciclo; o apresentador marca Sim ou Não em cada uma.

   Terminada uma etapa, o que é dela não se altera mais; o apresentador ainda inclui, sem alterar. Na última etapa,
   o apresentador usa o botão Publicar: ele pede a mensagem do commit e só então grava a `## Retro`, com quem levantou
   e quem votou em cada linha, com commit e push.
2. Com o "publicamos", atualize a branch base e leia a `## Retro` do `sprint-<nn>.md` e mostre o resultado pela ordem dos votos. Ação sem dono →
   pergunte o dono.
3. Sem a página (a pessoa não quer, ou não há como abrir): conduza na conversa e monte as linhas no mesmo formato, com
   `por <quem levantou>` em cada uma.

A ação que muda uma política vai ao `acordos.json` (passo `reserva-capacidade` para a reserva de capacidade; as outras
chaves, com o "ok" de quem tem `produto`, no mesmo commit).

## Saída

A Retro → passo `regras-aprendidas`.

## Pare se

Sem condição própria.
