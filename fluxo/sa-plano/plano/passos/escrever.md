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
   última é o checkpoint de validação completa + revisão. Não marque toolkit na tarefa: quem o usa é o
   desenvolvedor, pela configuração dele (os desvios do prompt).
4. Skills do toolkit ligadas ao agente: consulte a da stack para a forma do programa (camadas, nomes, testes).
5. Limite: plano que passa de ~200 linhas no total ou de ~8 tarefas → a fatia está grande: em vez de escrever um
   plano maior, proponha dividi-la. Ela já está `iniciada`: quem divide é o P.O., pela `sa-fatiar` (sem épico, pela
   `sa-triar`), como manda a divisão depois de `iniciada` das
   [Situações](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#situações). Aqui, `fase: bloqueada (de: planejando)` com a
   proposta de divisão no Bloqueio, e a sessão fecha como na troca de modo (passo `gate`, "Dev aceita").

`status.md`: fase `planejando` (vale também durante a análise do passo `analise`).

## Saída

Os artefatos do plano na pasta da fatia, `fase: planejando` → passo `analise`.

## Pare se

Plano acima do limite (item 5) → `fase: bloqueada (de: planejando)` com a proposta de divisão; a sessão fecha como
na troca de modo e para.
