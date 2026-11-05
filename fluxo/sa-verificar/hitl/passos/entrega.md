---
{"resumo": "Créditos (e a lição, se houver), commit da verificação e do status.md, push da branch do PR, conferência no remoto e só então a [VER] (concluir ou lançar horas) e o aviso ao Dev."}
---
## Entrada

O `verificacao.md`, o `CT.csv` (ACEITO) e o `status.md` com a fase da decisão (passo `decisao`).

## Faça

| Resultado | commit (mensagem no padrão do `sabia.md`) | ELM | aviso |
|---|---|---|---|
| ACEITO | `FT-<nnn> verificação: ACEITO` | saldo de horas e conclusão da `[VER]` (`elm_horas` → `elm_lancar_horas` do saldo → `elm_transicao(<id>, "concluir")`, numa confirmação; sem o MCP `elm` → `ELM pendente [VER FT-<nnn> concluir]: lançar <h>h e concluir`) | o **Dev responsável**: a fatia está `aceita`, à espera do merge (`sa-desenvolver.encerrar`) |
| REJEITADO | `FT-<nnn> verificação: REJEITADO` | horas da sessão na `[VER]` (lança, não conclui; sem o MCP `elm` → `ELM pendente [VER FT-<nnn> horas]: lançar <h>h (<data>)`); a `[VER]` fica em andamento | o Dev responsável |
| Volta (a pessoa decidiu) | `FT-<nnn> verificação: volta à especificação` | horas da sessão na `[VER]`, como no REJEITADO; a `[VER]` fica em andamento | quem o `Próximo:` do bloco diz (o especificador, ou o P.O. ou o SM, agente `sa-produto`) e o Dev responsável |

**Entrega**, nesta ordem — o Dev só acha o seu trabalho no remoto:

1. créditos da sessão no `status.md` ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e, se a
   pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra); commit de
   `verificacao.md`, `CT.csv` (ACEITO), `evidencias/`, `massa/` e `status.md`, com a mensagem da tabela;
2. push da branch do PR (`git push origin <branch>`, nunca a base; o Kiro pergunta). Push recusado (pela
   pessoa ou pela regra) → entregue o comando pronto e espere a pessoa dizer que publicou;
3. **confira no remoto:** `git fetch` e `git rev-parse HEAD` = `git rev-parse origin/<branch>`;
4. só então: a coluna ELM e o aviso.

## Saída

Verificação e `status.md` no remoto, a `[VER]` concluída (ACEITO) ou em andamento (REJEITADO, volta à especificação)
e o Dev avisado. Aqui o fluxo termina.

## Pare se

- Remoto diferente do local (item 3) → não siga: diga o que falta.
