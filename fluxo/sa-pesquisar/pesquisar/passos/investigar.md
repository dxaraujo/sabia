---
{"resumo": "Investiga na ordem: estrutura, fluxo atual, análogos, reaproveitamento, dados, testes e documentação (spec da fatia → specs → bundle → ELM ao vivo)."}
---
## Entrada

As perguntas e o escopo.

## Faça

Nesta ordem:

1. **Estrutura**: o steering e o glob dos módulos.
2. **Fluxo atual**: do ponto de entrada até o dado, lendo os arquivos.
3. **Análogos**: 1 ou 2, lidos de ponta a ponta com os testes.
4. **Reaproveitamento**: o que já existe e serve.
5. **Dados**: MCP de banco só em leitura; guarde só a consulta e a contagem, nunca dado real.
6. **Testes**: como rodar os da área (pelos Comandos do `.sabia/sabia.md`) e o que eles já cobrem.
7. **Documentação**: a pasta da spec da fatia (delta e `elm/`), se houver; depois as specs do repositório
   (`openspec/specs` e `openspec/changes/archive`, ou `.kiro/specs`); depois o bundle (`elm_buscar_req_local`, só com
   ELM); por fim, o ELM ao vivo, em leitura. Sem bundle, registre em Não encontrado e siga.

Antes de ler código de uma stack, carregue a skill do toolkit dela.

## Saída

Fatos coletados → passo `fatos`.

## Pare se

Nunca: o que não achou vai para Não encontrado.
