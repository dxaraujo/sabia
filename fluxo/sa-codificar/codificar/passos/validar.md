---
{"resumo": "Roda os comandos da seção Comandos do sabia.md (compilar, testes, lint, cobertura com gate) e para no primeiro vermelho."}
---
## Entrada

A seção **Comandos (backpressure)** do `.sabia/sabia.md`, gravada pela setup. Na worktree do `sa-orquestrar`:
`cd .sabia/local/wt/<ft> && <comando>`.

## Faça

1. Rode, nesta ordem, cada comando da seção, de todos os módulos: **compilar**, **testes**, **lint** (se houver) e
   **cobertura** com o gate (se houver). Um por vez, e pare no primeiro que falhar.
2. Mostre a evidência: o comando e o resultado (saída curta ou o resumo dos testes). "Passou" sem a saída não vale.
3. **Validação completa** (todas as tarefas `[x]`): a suíte **inteira** de testes; a cobertura, com o gate do
   `sabia.md` (se houver), é medida no que a fatia criou ou alterou — as linhas e os ramos do diff. Falta de cobertura
   que já existia no arquivo antes da fatia (fora do diff) não é tarefa dela: registre no Histórico (`cobertura
   pré-existente: <arquivo> <o que falta>`) e siga.

## Saída

**Verde:** todos os comandos passaram, com a evidência. **Vermelho:** o comando que falhou e a falha.

## Pare se

- Sem a seção Comandos, ou com comando `<…>` → avise que falta rodar a setup e pare.
- Erro de ambiente (não do código) → `AMBIENTE` no `status.md`, nunca consertar.
