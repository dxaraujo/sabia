---
{"resumo": "Lê o código de ponta a ponta: estrutura, fluxo atual, análogos, reaproveitamento, dados, documentação do ELM e testes."}
---
## Entrada

As perguntas do passo `perguntas`.

## Faça

- Estrutura: o steering de estrutura da linha Steering do `.sabia/sabia.md` e `glob` dos módulos envolvidos.
- Fluxo atual: siga do ponto de entrada (rota, job, tela, consumidor) até o dado, lendo os arquivos — não
  deduza pelo nome.
- **Análogos:** 1–2 funcionalidades reais do mesmo tipo (mesma camada, mesma forma de entrada/saída). Leia de ponta
  a ponta, incluindo os testes.
- **Reaproveitamento:** serviços, utilitários, componentes, queries e clientes de integração existentes.
- **Dados:** schema real pelo MCP de banco (somente leitura) ou pelos modelos/migrações; volumetria se importar.
  No `research.md` vão só a consulta e a contagem — nunca linhas com dado real (o arquivo vai para o git).
- **Documentação:** os conceitos aprovados em `elm/` da pasta da fatia (valem sobre o bundle); histórias e regras do
  bundle do ELM que tratam do mesmo comportamento, pelo
  `elm_buscar_req_local`/`elm_ler_req_local` (nunca lendo os arquivos; sem bundle baixado — erro `nao_encontrado`
  campo `bundle` — registre isso e indique a `sa-sync`: o pesquisador não tem o ELM remoto) —
  divergência entre código e documentação é um achado importante.
- **Testes:** como rodar só os testes da área (comando de teste único do `sabia.md`) e o que já cobrem.
- Skills do toolkit do projeto ligadas a você: carregue a da stack antes de interpretar código dela.

## Saída

Os fatos, com `arquivo:linha`, para cada pergunta → passo `research`.

## Pare se

Nenhum caso próprio deste passo: sem bundle do ELM, registre e siga (acima).
