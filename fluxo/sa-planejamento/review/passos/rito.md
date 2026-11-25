---
{"resumo": "Mostra os concluídos com o link do MR e os abertos; o feedback de cada entrega e as novas ideias e necessidades entram pela página sabia review, que o apresentador conduz em etapas; cada ideia ou necessidade vai ao cadastro."}
---
## Entrada

A sprint e o `backlog.md` da branch base.

## Faça

1. Mostre os itens concluídos no ciclo: linhas desenvolvimento e atendimento com `concluida_em` dentro das
   datas da sprint, cada um com o link do MR, onde está a evidência. Depois, os abertos: vão para a virada do próximo
   planejamento.
2. Peça à pessoa que conduz para abrir a página, no terminal dela, na branch base: `sabia review` (`--rede` para os
   stakeholders abrirem o link). Quem abre a página nessa máquina é o apresentador: só ele registra (inclui, altera
   e remove) e libera a etapa seguinte, sem volta; os demais acompanham. As etapas:
   - **Feedback**: um bloco por entrega, com o MR. Entrega é a fatia, o bug ou o atendimento cujo trabalho principal
     foi concluído na sprint, e o épico concluído no ciclo, com a especificação fechada na sprint ou com fatia entregue
     nela (o épico vem antes das fatias dele). O apresentador registra o feedback e diz de quem é.
   - **Novas ideias e necessidades**: o apresentador registra cada uma, com de quem é. Não há tipo nem prioridade
     aqui: tudo entra como item novo, para a triagem.

   Na última etapa, o apresentador usa o botão Publicar: ele pede a mensagem do commit e só então grava a `## Review`
   do `sprint-<nn>.md`, com commit e push: uma linha por entrega, `<id> · <feedback> — por <quem>; <feedback> — por
   <quem>` ou `<id> · sem feedback`, e `ideia ou necessidade · <texto> — por <quem>`. A review não tem votação.
3. Sem a página: registre na conversa o feedback de quem está presente, no mesmo formato; vai na `## Review` pelo
   passo `gravar`.
4. Com o "publicamos", atualize a branch base e leia a `## Review`. Cada linha `ideia ou necessidade` vira item
   `nova` pelo passo `cadastro`, com `origem review <AAAA>/Sprint <nn>` na `obs`; depois do cadastro, a linha ganha o
   id no fim: `… (FT-040)`. A triagem (tipo, tamanho, prioridade) é depois, pela `sa-triar`. Item concluído não
   reabre: a necessidade sobre ele também entra pelo cadastro.

## Saída

Ideia ou necessidade nova → passo `cadastro`. Sem nenhuma → passo `gravar`.

## Pare se

Sem condição própria: a review não trava.
