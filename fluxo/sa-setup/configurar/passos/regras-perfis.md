---
{"resumo": "Mostra os 2 modelos de permissão do perfis.json e as regras ELM quando há ELM."}
---
## Entrada

O `perfis.json` e os dados do passo `elm`.

## Faça

Mostre, sem perguntas:

1. **build** (`sa-desenvolvedor` e `sa-especificador`): ler e editar sem restrição por pasta; só o harness
   (caminhos explícitos) e os segredos em deny; push, merge, curl e wget em ask; rebase, `--force`,
   `--force-with-lease`, `reset --hard`, `--no-verify` e destrutivos em deny; GitLab: leitura allow, escrita ask.
2. **só leitura** (`sa-pesquisador` e `sa-revisor`): ler allow, editar deny, comandos e MCP só de leitura.
3. **`sa-verificador`:** só leitura mais rodar a aplicação (Executar do `sabia.md`), curl na URL de teste e gravar o
   `CT.csv`.
4. **ELM** (`elm.regras` do `agentes.json`): só com `elm` diferente de `false`.
5. **Autopilot** (o `sa-desenvolvedor` como subagente na worktree): liberados o push da própria branch (sem
   `--force`), o merge da base nela e abrir ou atualizar o MR dela; merge do MR, ELM e rede continuam bloqueados.

## Saída

→ passo `verificacao`.

## Pare se

- Nunca afrouxe uma regra por projeto.
