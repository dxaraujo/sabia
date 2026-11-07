---
{"resumo": "Sobe a aplicação ou o job pelo Executar do sabia.md, local ou na URL de teste, nunca produção; dados pela própria aplicação ou pelos fixtures; DDL não aplicada deixa os cenários dela em ambiente."}
---
## Entrada

O roteiro (passo `roteiro`) e a seção Verificação de aceite do `sabia.md`.

## Faça

1. Suba a aplicação ou o job pelo comando Executar do `sabia.md`, local ou na URL de teste. Nunca use produção nem
   dado real de pessoa.
2. Os dados do cenário nascem pela própria aplicação (as chamadas do cenário) ou pelos fixtures do projeto. Nunca
   escreva direto no banco; consulte só pelo MCP de banco, em leitura.
3. DDL da fatia não aplicada no ambiente → procure no `backlog.md` o item BD com `origem FT-nnn` na `obs`. Achou:
   os cenários que dependem dela ficam ⚠️ ambiente, citando o `BD-nnn`, e os outros seguem. Não achou: o caso vai
   para o passo `fora-dos-cenarios`.

## Saída

A aplicação no ar e os dados prontos → passo `executar`. A aplicação não sobe por ambiente (serviço fora do ar,
credencial de teste) → todos os cenários ⚠️ ambiente, com o que faltou → passo `resultado`.

## Pare se

—
