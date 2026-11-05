# Desenvolvimento do Sabiá 2.0: documentos de trabalho

Documentos para continuar o desenvolvimento da 2.0 em outra máquina. Eles valem para a branch `sabia-2.0`, na versão
`2.0.0-beta.1`.

| Arquivo | O que é |
|---|---|
| [plano-2.0.md](plano-2.0.md) | O plano de desenho da 2.0. As seções 11.13 a 11.30 trazem as decisões, em ordem; a mais recente vale |
| [analise-11.23.md](analise-11.23.md) | Requisito existente alterado por uma fatia: o fluxo de então, lacunas e decisões |
| [analise-11.24.md](analise-11.24.md) | A especificação acompanha a manutenção: análise crítica e as mudanças M1–M13 |
| [revisao-11.27.md](revisao-11.27.md) | Relatório da revisão final: o que foi corrigido (seção 2), as decisões D1–D131 (seção 3) e as respostas da pessoa (seção 5) |

## Onde está o trabalho

**Feito na `sabia-2.0`:**
- a especificação acompanha a manutenção (11.24);
- CT.csv (11.26);
- revisão final com 303 correções (11.27);
- `sa-verificar` dividida em `verificar` (motor) e `hitl` (a [VER]) (11.29, P2);
- as 26 decisões que bloqueavam a 2.0.0 (D1, D2, D7, D9, D17, D28–D30, D37, D40, D49, D50, D55–D62, D84, D85, D100,
  D101, D108, D109).

**Falta, na ordem:**
1. **As 105 decisões restantes da 11.27.** Estão na seção 3 do `revisao-11.27.md`, cada uma com o contexto, as
   opções e a recomendação. Para cada uma, registre a resposta na seção 5 ("Respostas da pessoa"), uma linha por
   decisão. A resposta vale sobre a recomendação. A implementação vem depois, numa rodada só.
2. **O lote pós-revisão (11.28):**
   - descriptions de skill com até 1024 caracteres, mais um teste;
   - a description dos agentes de toolkit em inglês;
   - nomes e campos dos arquivos internos do Sabiá em inglês (`index.json` no lugar do marketplace, `toolkit.json`,
     `agentes.json`, `papeis.json`, `tipos.json`…). Os artefatos de planejamento (`.sabia/planejamento/`) continuam
     em português;
   - versões novas dos toolkits.
3. **11.29, P1, adiada:** a [REV] e as [APR] são do Dev Sênior. Elas deveriam ir para a `sa-desenvolver`?
4. **Pendências:** as da rodada 2 da 11.24, o site (gh-pages) e o mapa dos fluxos do épico aprovado.
5. **A 2.0.0 sai da beta** quando todas as perguntas estiverem respondidas e as 131 decisões implementadas.

**Depois da 2.0.0:**
- 11.25: `sa-status` como painel do projeto;
- 11.30: pistas antes da busca, só nas tarefas HITL (v2.0.1);
- 11.15: toolkits de stack e de migração.

## Regras de trabalho

- **O Sabiá não tem usuários:** sem migração, sem compatibilidade, sem citar versões anteriores nem "antes era" nos
  docs e nas skills.
- **Explicação não é pedido de mudança:** a base é o fluxo de hoje. A decisão de desenho é da pessoa.
- **Épico × fatia na especificação:**
  - o épico publica no GATE do PRD e nunca reabre depois do fatiamento;
  - a fatia aceita mudança enquanto a [ESP] FT está aberta e publica na conclusão;
  - a tarefa de especificação aberta registra a mudança; concluída na sprint corrente, reabre; concluída numa sprint
    fechada, a mudança vai para a [GB] ou para uma `[ESP] <id> Revisão <n>`.
- **Commits:** um por etapa concluída, com os testes verdes, sem linha de coautoria.
- **Testes:**
  - `node --test cli/*.test.mjs`;
  - `cd skills/sa-setup/scripts && uv run --no-project --with pytest python -m pytest -q test_gerar_agentes.py`;
  - a validação dos fluxos:
    `node -e 'import("./cli/compilar.mjs").then(c=>console.log(JSON.stringify(c.validar(c.carregar(".")))))'`,
    que deve dar `[]`.
- **Repositório público:** nada de projeto privado (forma, seções ou textos), de empresa, de dado pessoal nem de
  caminho da máquina.
