---
{"resumo": "Consulta banco (só leitura) e bundle do ELM, código só em escopo fechado; dado real fora do git; rascunho da resposta para o \"ok\" da pessoa; horas e créditos."}
---
## Entrada

O AT assumido no passo `assumir`, já `em-andamento`.

## Faça

1. **Fontes, nesta ordem** — subagente `sa-pesquisador`, se houver: banco pelo MCP de consulta (**somente
   leitura**) e bundle do ELM pelo `elm_buscar_req_local`/`elm_ler_req_local` ([sem bundle → ELM remoto](~/.sabia/framework/skills/sabia/references/elm.md#bundle-local)). Código só se necessário e em escopo fechado:
   termos ou arquivos indicados e um limite de leitura, para não gastar tokens. Se a demanda envolver lógica de
   negócio complexa (regras de cálculo, fluxos condicionais, comportamentos do sistema) — e não for uma extração
   simples de dados — considere acionar o **`sa-pesquisar`** antes das consultas SQL para entender o contexto
   do código, passando só o `AT-<nnn>`, o pedido do registro e o escopo fechado (termos ou arquivos e o limite de
   leitura); ele devolve os fatos na resposta e não grava nada; grave um resumo, sem dado de cliente, na seção
   `## Pesquisa de código` do registro; nesse caso, registre no AT: `"análise baseada em pesquisa de código"`. Sem tempo para pesquisa:
   registre `"resposta baseada apenas no bundle do ELM e no banco"` na seção Consultas do AT.
2. **Resultado com dado real** (linhas, telas, planilhas) → `.sabia/local/sustentacao/atendimento/AT-<nnn>/`. No registro
   ficam só a consulta (SQL), a contagem, o caminho do arquivo e um resumo **sem identificar pessoas**.
3. **Rascunho da resposta** → "ok" da pessoa antes de enviar. Quem envia é a pessoa; o agente não manda e-mail
   nem responde chamado.
4. **Horas** podem ser lançadas a qualquer momento (`elm_lancar_horas(<id da [ATD]>, <h>)`, com "sim", e uma linha
   `| <AAAA-MM-DD> | <h> |` na tabela Horas do registro): lançar não conclui a `[ATD]`. Ao fechar cada sessão do atendimento, os **créditos** dela na seção Créditos do registro ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4)
   — a sessão que não conclui o AT fecha com o commit `AT-<nnn> registrar sessão` (o registro), pelos itens 3 e 4 do
   bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base); a que conclui, no
   commit do passo `desdobramentos`.

## Saída

Consultas no registro, dado real em `.sabia/local/`, a resposta aprovada pela pessoa → passo `finalizar` quando ela
disser "enviei" ou "conclui o AT-<nnn>". A sessão que termina antes disso fecha aqui, com o commit `AT-<nnn>
registrar sessão` (item 4).

## Pare se

- Sem o "ok" da pessoa no rascunho da resposta → não envie: quem envia é a pessoa.
- Não é atendimento (pedido que exige escrita na base, que muda o comportamento do sistema ou regra que ninguém
  decidiu) → nada a enviar: "devolva à `sa-triar` (categoria errada, origem AT-<nnn>)" e pare.
