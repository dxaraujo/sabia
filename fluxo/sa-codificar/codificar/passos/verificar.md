---
{"resumo": "Só AFK: verificação de aceite pelo sa-verificador (subagente), até 2 rodadas; commita o relatório antes do PR."}
---
## Entrada

AFK, com a revisão `APROVADO`. HITL não passa por aqui (passo `revisar` → passo `pr`).

## Faça

Incremente "verificação" em Rodadas e peça ao agente **`sa-verificador`** (subagente) a **`sa-verificar`** (cenários
de aceite executados de ponta a ponta, com evidência) — nunca a execute você: quem implementou não verifica.
`ACEITO` → ela deixa a fatia em `fase: verificada`; `REJEITADO` → devolve para cá os cenários reprovados (passo
`onde`). Teto de 2 rodadas, como na revisão. Corrigida uma rejeição, volte aos passos `validar` e `revisar` (a nova
revisão conta no teto de rodadas) antes de verificar de novo.

Com `ACEITO` ou `REJEITADO`: grave o **Drift de negócio** do relatório no `status.md` (como no passo `revisar`: a
indicação do agente, com os cenários `🔁 possível alteração`, decidida pelo Dev Sênior na `[APR] Aprovar PR`; o `🔁`
não vira tarefa de código); com
`REJEITADO`, some 1 em Retrabalho e acrescente a linha na tabela `## Retrabalho` (Papel `verificação (AFK)`); e
**commite imediatamente** `verificacao.md`, `CT.csv`, `evidencias/`, `massa/` e o
`status.md` antes de prosseguir — mensagem no padrão do `sabia.md`, `registrar verificação`. O PR cita esses arquivos e eles precisam estar na branch antes da abertura.

## Saída

`ACEITO` → `fase: verificada` e passo `pr`. `REJEITADO` → cenários reprovados como tarefas e passo `tarefa`.

## Pare se

- Sem subagente disponível → pare aqui e devolva a quem chamou: "aguardando verificação (rodada <N>)".
- 2ª rejeição seguida → `fase: bloqueada (de: verificando)` com as mesmas opções do passo `revisar`.
