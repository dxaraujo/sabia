---
{"resumo": "Monta o sprint-<nn>.md (ou só as linhas novas), o backlog.md dos itens que a virada tirou e a previsão do roadmap."}
---
## Entrada

A proposta com o "ok".

## Faça

1. **`sprint-<nn>.md`** em `.sabia/planejamento/sprints/<AAAA>/`, pelo padrão `sa-planejamento/sprint.md`: cabeçalho
   `# <AAAA>/Sprint <nn> · AAAA-MM-DD → AAAA-MM-DD`, `**Meta:**`, `**Folga:** <n> itens (<p>%)`, a tabela `## Itens`
   (Item · Trabalho · Responsável · Tarefas) e as seções vazias `## Review` e `## Retro`. No reabastecimento, só
   acrescente as linhas. A coluna Tarefas fica vazia: quem puxa preenche pela `sa-elm.item`.
2. **`backlog.md`**: os itens que a virada tirou da sprint (`em-andamento` → `pronta`).
3. **`roadmap.md`**, só se existe: pergunte "atualizar o roadmap?" e, com o sim, atualize a Previsão pela vazão.
4. Mensagem: `<AAAA>/Sprint <nn>: planejamento` (ou `: reabastecimento`). Grave tudo num commit só, pelo passo
   `commit-na-branch-base`.

## Saída

Os arquivos e a mensagem → passo `commit-na-branch-base`.

## Pare se

Sem condição própria.
