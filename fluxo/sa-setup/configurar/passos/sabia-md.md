---
{"resumo": "Grava o .sabia/sabia.md com as seções fechadas; em atualização, preserva as Regras aprendidas."}
---
## Entrada

Tudo o que os passos anteriores montaram.

## Faça

1. Monte do modelo [sabia.md](~/.sabia/framework/skills/sa-setup/assets/steering/sabia.md), sem `<…>` sobrando, com
   estas seções, fechadas: Resumo do fluxo · Especificação · Verificação de aceite · Sustentação · ELM (o texto da
   `sa-elm.setup`, só com ELM) · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas
   (`- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD`).
2. Em atualização, monte do modelo, não do antigo, e preserve a seção Regras aprendidas como está no disco (do título
   até a próxima `## `): ela é da `sa-planejamento.review`.
3. Monte o `agentes.json` do passo `agentes` e rode o gerador sem `--gravar`: ele imprime a tabela dos agentes.
4. Mostre o cartão W8 com tudo o que vai ser gravado (a tabela do gerador colada como saiu; em atualização, o diff de
   cada arquivo). Com o "ok", grave o `sabia.md` (com as seções `## Projeto`
   e `## Comandos`, por mescla); os passos seguintes gravam o resto com o mesmo "ok".

## Saída

Gravado → passo `ponteiros`.

## Pare se

- Nunca apague nem reescreva uma Regra aprendida.
