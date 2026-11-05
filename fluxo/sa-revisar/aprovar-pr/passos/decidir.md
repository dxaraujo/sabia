---
{"resumo": "Aprovado → comentário com o sha e os créditos, horas e conclusão da [APR] e o vínculo da [DEV] aos requisitos que a fatia cobre, sem commit na branch; mudanças pedidas (inclusive a possível alteração de código errado) → Achados abertos, retrabalho, commit, push e aviso ao Dev; volta à especificação → bloqueada, commit, push e aviso ao especificador."}
---
## Entrada

A decisão da pessoa (passo `ler`) e o `sha` do PR (passo `assumir`).

## Faça

Possível alteração indicada (passo `ler`) → antes, a pessoa decide (`Possível alteração: <motivo> · <artefatos>.
Volta à especificação, ou o código está errado?`): **código errado** → é uma mudança pedida (item 2), o Drift fica
`não` e o Histórico ganha `drift descartado: código errado (<login>)`; **volta** → item 3. Aprovado só sem possível
alteração pendente: o Drift `—`, `não` ou já com ` · especificação:` de uma `[ESP] FT` concluída.

1. **Aprovado** → **não commite na branch nem grave fase** (o `sha` que o Dev vai mergear não pode mudar; a fatia
   segue em `aguardando-aprovacao-pr` até o merge): numa
   confirmação, `elm_comentar(<id da [APR]>, "PR aprovado, sha <sha> · créditos <linha da seção Créditos>")` (
   os créditos saem do script ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4), e o Dev grava a
   linha no `status.md` da base, no registro do merge), o saldo de horas e a
   conclusão (`elm_lancar_horas`, `elm_transicao(<id>, "concluir")`) e o vínculo da `[DEV]` da fatia: `elm_ligar(wi =
   <id da [DEV]>, req = <id>, tipo implementa)` por requisito que a fatia cobre
   ([vínculos](~/.sabia/framework/skills/sabia/references/elm.md#vínculos-cada-um-liga-o-que-gera)). Avise o Dev
   responsável: o merge é dele (`sa-desenvolver.encerrar`), que confere essa `[APR]`. Sem o MCP `elm` → entregue ao
   Dev a linha `PR aprovado por <login>, sha <sha>`, a linha de créditos e as pendências `ELM pendente [APR FT-<nnn>
   concluir]: lançar <h>h e concluir (<login>)` e `ELM pendente [DEV FT-<nnn> ligar]: ligar a [DEV] a <rótulos>`
   (esta também com o MCP, para o requisito sem `id`) — ele as grava na base, no commit `FT-<nnn> registrar merge`. Se a pessoa corrigiu algo nesta sessão, entregue também a linha da lição, que o
   Dev grava nas **Lições candidatas** com o merge.
2. **Mudanças pedidas** → cada uma em Achados abertos (origem: PR), `fase: retrabalho (de: aguardando-aprovacao-pr)`,
   "retrabalho" + 1 em Rodadas, uma linha na tabela Retrabalho (papel APR), os créditos da sessão ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) e, se a
   pessoa corrigiu algo nesta sessão, uma linha nas **Lições candidatas** (a consolidação a registra). Commit
   (`FT-<nnn> aprovação do PR: mudanças pedidas`) → push → conferir no remoto (como no passo `sa-revisar.hitl.entrega`) → horas
   da sessão na `[APR]` (lança, não conclui) → avise o Dev responsável. A `[APR]` fica em andamento e é a mesma na
   nova aprovação.
3. **Volta à especificação** → ` · especificação: [ESP] FT-<nnn>` no Drift e o bloco
   [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação)
   (`de: aguardando-aprovacao-pr`), os créditos da sessão; commit (`FT-<nnn> aprovação do PR: volta à especificação`) → push → conferir no remoto →
   horas da sessão na `[APR]` (lança, não conclui) → avise quem o `Próximo:` do bloco diz (o especificador, ou o
   P.O. ou o SM, agente `sa-produto`) e o Dev responsável. A `[APR]` fica em andamento e é a mesma na nova aprovação.

## Saída

Aprovado: a `[APR]` concluída e o Dev avisado do merge. Mudanças pedidas: o `status.md` no remoto, a `[APR]` em
andamento e o Dev avisado. Volta à especificação: o `status.md` no remoto, a fatia `bloqueada`, a `[APR]` em
andamento e quem o bloco diz e o Dev avisados. Aqui o fluxo termina.

## Pare se

- Mudanças pedidas ou volta à especificação, com o remoto diferente do local → não siga: diga o que falta.
