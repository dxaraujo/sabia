---
{"resumo": "Cancela um item em andamento: status e motivo no backlog, pasta da spec fora da branch base, épico pai fechado quando era a última fatia, e o que a pessoa precisa desfazer."}
---
## Entrada

A fatia, o bug ou a sustentação `em-andamento` (ou impedida que veio de `em-andamento`) e o motivo.

## Faça

1. Pergunte o motivo numa linha, se falta.
2. Prévia:
   - linha do `backlog.md`: status `cancelada`, `motivo` `<motivo> · desde <hoje>`;
   - fatia ou bug: a pasta da spec (com `elm/`), se existe na branch base, sai no mesmo commit (`git rm`), para não
     valer como vigente nem prender artefato;
   - era a última fatia aberta do épico (aberta = não `concluida` nem `cancelada`)? Com alguma `concluida`: o épico
     fica `concluido`, com `concluida_em` = hoje. Sem nenhuma: `cancelado`, `motivo` `fatias canceladas · desde <hoje>`;
   - sustentação: a Resposta do registro diz "cancelado: <motivo>".
3. A linha da sprint fica, sem `concluida_em`.
4. Diga o que a pessoa desfaz, porque o fluxo não fecha nada sozinho: fechar o MR aberto, apagar a branch remota
   `<id>` (sem `--force`) e remover a worktree. Com autopilot rodando, peça para parar antes.
5. Peça o "sim".

## Saída

Com o "sim" → passo `gravar`, com a mensagem `<ID> cancelar`.

## Pare se

Sem o motivo ou sem o "sim" → nada é gravado; o fluxo termina.
