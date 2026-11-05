---
{"resumo": "Escreve .config.kiro, requirements.md ou bugfix.md, design.md e tasks.md pelo padrão sa-plano/plano.md, dentro do limite de tamanho; fase planejando."}
---
## Entrada

`research.md` e as decisões do passo `decisoes`. Formato: o padrão `sa-plano/plano.md`.

## Faça

0. **`.config.kiro`** (se não existe ou o `specType` não bate com a trilha): `specType` `feature` (padrão) ou `bugfix` (rápida) — é o que faz o painel
   de specs do Kiro reconhecer a pasta.
1. **`requirements.md`** (padrão) ou **`bugfix.md`** (trilha rápida). Cada critério EARS é **falsificável na
   base**: diga a observação que hoje mostra que ele é falso — se ela não existe, o critério já passa e não serve
   como teste.
2. **`design.md`**: pattern grounding (da research), **forma do programa** (árvore de arquivos com ação, assinaturas,
   árvore de chamadas — cada uma é uma decisão que, sem isso, seria tomada implicitamente no code review),
   pontos de teste (o mais alto possível), erros/transação/reexecução, **contrato de pronto** (como cada cenário
   será verificado de ponta a ponta) e decisões técnicas.
3. **`tasks.md`**: uma tarefa por comportamento, teste primeiro, comando de pronto, `_Requirements: N.M_`; a
   última é o checkpoint de validação completa (compilar, suíte inteira, lint, cobertura); a revisão não é tarefa do
   `tasks.md`: é da `sa-revisar`. Não marque toolkit na tarefa: quem o usa é o
   desenvolvedor, pela configuração dele (os desvios do prompt).
4. Skills do toolkit ligadas ao agente: consulte a da stack para a forma do programa (camadas, nomes, testes).
5. Limite: mais de 200 linhas somando `requirements.md` (ou `bugfix.md`), `design.md` e `tasks.md`, ou mais de 8
   tarefas de primeiro nível (`- [ ] N.` e `- [ ]* N.`) no `tasks.md`, sem contar o checkpoint → a fatia está grande:
   em vez de escrever um plano maior, `fase: bloqueada (de: planejando)` com o Bloqueio `plano acima do limite: <n>
   linhas, <m> tarefas · proposta: <seguir | dividir em …>`, e a sessão fecha como no pedido de
   troca de modo (passo `gate`). Ela já está `iniciada`, e quem decide é o P.O., pelas
   [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações): fatia de épico → seguir com ela (plano acima do
   limite) ou cancelá-la pela `sa-fatiar.refinamento` e registrar as partes como fatia nova pela `sa-triar`
   (`origem EP-<nn>`); fatia sem épico → a divisão pela `sa-triar`.

`status.md`: fase `planejando` (vale também durante a análise do passo `analise`).

## Saída

Os artefatos do plano na pasta da fatia, `fase: planejando` → passo `analise`.

## Pare se

Plano acima do limite (item 5) → `fase: bloqueada (de: planejando)` com a proposta para o P.O.; a sessão fecha como
na troca de modo e para.
