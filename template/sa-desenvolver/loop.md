---
{"resumo": "Log do disjuntor do autopilot em .sabia/local/loop-<id>.md: uma linha por etapa e a linha Devolvido."}
---
```markdown
# Autopilot FT-<nnn> — teto: tentativas <n> · tempo <n> h · custo <n> créditos

| Quando | Etapa | Tentativa | Resultado | Tempo | Custo |
|---|---|---|---|---|---|
| AAAA-MM-DD HH:MM | <tarefa \| revisar \| verificar> | <n> | <ok \| falhou \| reprovado> | <min acumulados> | <créditos acumulados \| —> |

Devolvido: <motivo> · AAAA-MM-DD HH:MM
```

Uma linha por etapa, só acréscimo. O teto vem da chave `disjuntor` do `acordos.json`. Dispara no teto (tentativas, tempo
ou custo) ou em 2 linhas `reprovado` seguidas na mesma etapa (revisar ou verificar). A linha Devolvido só aparece
quando dispara. O relançamento pela pessoa zera as reprovações seguidas e mantém as tentativas. Fica fora do git
(`.sabia/local/`) e é apagado pela `sa-desenvolver.encerrar.worktree`.
