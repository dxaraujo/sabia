---
{"resumo": "Só AFK: verificação de aceite pelo sa-verificador (subagente), com teto de 2 rejeições seguidas; commita o relatório antes do PR."}
---
## Entrada

AFK, com a revisão `APROVADO`. HITL não passa por aqui (passo `revisar` → passo `pr`).

## Faça

Incremente "verificação" em Rodadas e peça ao agente **`sa-verificador`** (subagente) a **`sa-verificar`** (cenários
de aceite executados de ponta a ponta, com evidência) — nunca a execute você: quem implementou não verifica.
`ACEITO` → ela deixa a fatia em `fase: verificada`; `REJEITADO` → devolve para cá os cenários reprovados (passo
`onde`); `AMBIENTE` (só `⚠️ ambiente`) → ela deixa a fatia `bloqueada (de: verificando)` com o `⚠️ ambiente: <o que
faltou>`: commit do relatório e pare, sem contar rejeição. Teto: 2 rejeições seguidas. Corrigida uma rejeição, volte aos passos `validar` e `revisar` (a nova
revisão conta no teto de rodadas) antes de verificar de novo.

Com `ACEITO` ou `REJEITADO`: grave a linha `Drift de negócio:` do bloco `🔎 Verificação` (o bloco Decisão, no fim do
`verificacao.md`: padrão `sa-verificar/verificacao.md`) que o `sa-verificador` devolve no **Drift de negócio** do `status.md` (como no passo `revisar`: a
indicação do agente, com os cenários `🔁 possível alteração`, decidida pelo Dev Sênior na `[APR] Aprovar PR`; o `🔁`
não vira tarefa de código); com
`REJEITADO`, some 1 em Retrabalho e acrescente a linha na tabela `## Retrabalho` (Papel `verificação (AFK)`); e
**commite imediatamente** `verificacao.md`, `CT.csv`, `evidencias/`, `massa/` e o
`status.md` antes de prosseguir — mensagem no padrão do `sabia.md`, `<FT> registrar verificação`. O PR cita esses arquivos e eles precisam estar na branch antes da abertura.

## Saída

`ACEITO` → `fase: verificada` e passo `pr`. `REJEITADO` → cenários reprovados como tarefas e passo `tarefa`.
`AMBIENTE` → `bloqueada`.

## Pare se

- Sem subagente disponível → pare aqui e devolva a quem chamou: "aguardando verificação (rodada <N>)".
- 2ª rejeição seguida → `fase: bloqueada (de: verificando)` com as mesmas opções do passo `revisar`.
- `VERIFICACAO: AMBIENTE` → `bloqueada` com o `⚠️ ambiente`, e pare.
- A DDL do campo Banco não aplicada (passo `sa-verificar.verificar.ambiente`) → a fatia `bloqueada`, `aguardando
  aplicação de baseline de banco`: commit do `status.md` e pare.
