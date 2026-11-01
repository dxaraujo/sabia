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
   do código; nesse caso, registre no AT: `"análise baseada em pesquisa de código"`. Sem tempo para pesquisa:
   registre `"resposta baseada apenas no bundle do ELM e no banco"` na seção Consultas do AT.
2. **Resultado com dado real** (linhas, telas, planilhas) → `.sabia/local/sustentacao/atendimento/AT-<nnn>/`. No registro
   ficam só a consulta (SQL), a contagem, o caminho do arquivo e um resumo **sem identificar pessoas**.
3. **Rascunho da resposta** → "ok" da pessoa antes de enviar. Quem envia é a pessoa; o agente não manda e-mail
   nem responde chamado.
4. **Horas** podem ser lançadas a qualquer momento (`elm_lancar_horas(id, horas)`, com "sim"): lançar não conclui a
   `[ATD]`. Ao fechar cada sessão do atendimento, os **créditos** dela na seção Créditos da ficha ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4)
   — vão no commit do atendimento.

## Saída

Consultas no registro, dado real em `.sabia/local/`, a resposta aprovada pela pessoa → passo `finalizar` quando ela
disser "enviei" ou "conclui o AT-<nnn>".

## Pare se

- Sem o "ok" da pessoa no rascunho da resposta → não envie: quem envia é a pessoa.
