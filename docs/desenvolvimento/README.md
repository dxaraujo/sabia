# Desenvolvimento do Sabiá: documentos de trabalho

O desenvolvimento acontece na branch `sabia-2.1`, e a `main` avança por fast-forward a cada versão.

| Arquivo | O que é |
|---|---|
| [2.1/especificacao.md](2.1/especificacao.md) | A especificação da 2.1 |
| [2.1/decisoes.md](2.1/decisoes.md) | As decisões de desenho da 2.1 |
| [plano-2.0.md](plano-2.0.md) · [analise-11.23.md](analise-11.23.md) · [analise-11.24.md](analise-11.24.md) · [revisao-11.27.md](revisao-11.27.md) | Histórico do desenho da 2.0; não descrevem o fluxo atual |

## Regras de trabalho

- **O Sabiá não tem usuários:** sem migração, sem compatibilidade, sem citar versões anteriores nem "antes era" nos
  docs e nas skills.
- **Explicação não é pedido de mudança:** a branch base é o fluxo de hoje. A decisão de desenho é da pessoa.
- **Commits:** um por etapa concluída, com os testes verdes, sem linha de coautoria.
- **Versão:** `cli/package.json`, `cli/package-lock.json`, `plugin.json` e todos os `skills/*/SKILL.md`; a tag é
  `sabia-<versão>`, e o site, na branch `gh-pages`, sobe no mesmo dia.
- **Repositório público:** nada de projeto privado (forma, seções ou textos), de empresa, de dado pessoal nem de
  caminho da máquina.

## Testes

- O CLI, o compilador e o gerador de agentes: `cd cli && node --test`.
- Os scripts das skills: `uv run --no-project --with pytest pytest -q skills/sa-status/scripts skills/sa-especificar/scripts`.
- A validação dos fluxos, que deve dar `[]`:
  `node -e 'import("./cli/compilar.mjs").then(c=>console.log(JSON.stringify(c.validar(c.carregar(".")))))'`.
