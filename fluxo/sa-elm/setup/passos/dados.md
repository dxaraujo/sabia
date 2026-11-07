---
{"resumo": "Monta, sem gravar, os dados que a sa-setup aplica: chave elm, bundle, seção ELM e regras."}
---
## Entrada

O `pa` válido e as respostas dos passos `et` e `gl`.

## Faça

Monte, sem gravar:

1. Chave `elm` do `agentes.json`: `{"pa": "<nome>", "bundle": "<caminho>", "regras": {"allow": [...], "ask": [...], "deny": [...]}}`,
   com as tools como `elm/<tool>`. `allow`: as de leitura (`elm_status`, `elm_ler_wi`, `elm_listar_wi`,
   `elm_horas`, `elm_buscar_req`, `elm_ler_req`, `elm_*_local`, `elm_indexar_local`, `elm_explorar_local`,
   `elm_sync`). `ask`: as de escrita (`elm_criar_wi`, `elm_atualizar_wi`, `elm_transicao`, `elm_comentar`,
   `elm_anexo`, `elm_lancar_horas`, `elm_remover_horas`, `elm_ligar`, `elm_publicar_req`, `elm_iteracao`).
   `deny`: `elm_setup_descobrir` e `elm_backlog` (só nesta sessão padrão). O gerador aplica assim: leitura
   `allow` em todos; escrita `ask` nos primários `sa-desenvolvedor` e `sa-especificador`; escrita, `elm_sync` e
   `elm_indexar_local` `deny` nos subagentes e no autopilot.
2. O `bundle` da chave `elm`: o `rm.download` do `pa` (ex.: `docs/elm/<pa>/`).
3. Seção ELM do `sabia.md`: `pa: <nome>` · `ET as-built: sim | não` ·
   `Tarefas: [DEV] <id> <título> · [ESP] <id> <título> · [ATD] <id> <título>` · `Manual no DOORS Next: <texto |
   nada>` (o roteiro do que o MCP não grava: [mcp.md](~/.sabia/framework/skills/sa-elm/references/mcp.md)).

## Saída

Os dados → passo `bundle`.

## Pare se

- Nunca grave o `agentes.json` nem o `sabia.md`: quem aplica é a `sa-setup`.
