---
{"resumo": "Formato do .sabia/planejamento/historico-de-entregas.md: o que cada sprint entregou (release notes), a mais nova no topo, escrito pela sa-planejamento.review."}
---
```markdown
# Histórico de entregas

## 2026/Sprint 03 · 2026-11-09 → 2026-11-20

**Meta:** o cliente consulta o extrato sem ligar para o suporte — atingida

### Novidades

- **Bloqueio de conta após 3 tentativas inválidas** — a conta bloqueia sozinha e o cliente recebe o aviso por e-mail · FT-031 · EP-03 · MR !42

### Correções

- **Erro 500 no login com senha vazia** — o login mostra a mensagem de campo obrigatório · FT-034 · MR !45

### Atendimentos

- AT-012 · Extrair contas bloqueadas de outubro

### Épicos concluídos

- EP-03 · Bloqueio de conta por tentativas (FT-030, FT-031)
```

- Caminho: `.sabia/planejamento/historico-de-entregas.md`, um arquivo só, cumulativo. Uma seção por sprint, a mais nova
  no topo; regerar a mesma sprint troca a seção dela.
- Cabeçalho da seção: a chave e as datas da sprint. `**Meta:**` é a da sprint, com `— atingida` ou `— não atingida`
  quando quem tem `produto` já respondeu.
- Novidades (fatias) e Correções (bugs): `**<título>** — <o que muda para quem usa, numa frase> · <id> · <épico pai> · MR !<n>`.
  A frase vem do título do item e do "O quê" do MR, e só entra com o "ok" da pessoa; sem MR legível, a linha fica só
  com o título, o id e o épico.
- Atendimentos: só `<id> · <título>`. Dado de cliente não vai ao git.
- Épicos concluídos: `<id> · <título> (<fatias>)`.
- Subseção sem item não entra. O feedback da review e o que ficou em aberto não entram.

Escreve: `sa-planejamento.review` (passo `historico`). Vai direto na branch base.
