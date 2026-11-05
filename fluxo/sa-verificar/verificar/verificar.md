---
{"fluxo": "verificar", "dono": "sa-verificador",
 "quando": ["verificação de aceite sem a tarefa [VER]: como subagente da sa-codificar ou do loop (AFK), ou chamada pela [VER] HITL (fluxo hitl)", "no fim da sa-codificar e na fase de verificação do sa-orquestrar"],
 "travas_gerais": ["sim-da-pessoa", "aceite-independente"],
 "passos": [
   {"id": "roteiro"},
   {"id": "ambiente", "saidas": {"DDL do campo Banco ainda não aplicada: bloqueada, a aplicação é da Sustentação (item BD/Implantação)": "fim"}},
   {"id": "executar", "saidas": {"algum cenário rejeitado ou ⚠️, ou 🔁 no HITL": "resultado"}},
   {"id": "casos"},
   {"id": "resultado", "saidas": {"cenário errado na ficha sem épico, fora dos artefatos: bloqueada, é da triagem": "→ sa-triar.triar"}}
 ]}
---
# Verificar — O comportamento existe de verdade?

Teste unitário verde prova que o código faz o que o teste diz; a verificação prova que o **sistema** faz o que o
cenário do PRD diz. Prefira o agente **`sa-verificador`** (contexto limpo; não implementou a fatia).

Seja cético: quem implementou tende a achar que terminou, e funcionalidade pela metade costuma passar em teste de
unidade. "Feito" é uma afirmação; a evidência é a prova.

Entrada: pasta da fatia com revisão `APROVADO`, na branch da fatia, sem a tarefa — **AFK** (subagente do loop ou da
`sa-codificar`) ou chamada pela tarefa `[VER]` do **HITL** (fluxo `hitl`, com `fase: em-verificacao`, na branch do
PR; quem chamou é o dono da rodada). Tipo de projeto, como executar e onde ver o resultado: seção
**Verificação de aceite** do `.sabia/sabia.md` (vem do toolkit, confirmado na setup).

## Regras

- Nunca marque aceito sem evidência. Nunca altere código de produção aqui — só massa, fixtures e evidências.
- Nunca rode contra produção, nem com dado real de pessoa. Evidência ou trecho de resposta que traga dado real
  (homologação com cópia de produção, por exemplo) vai para `.sabia/local/verificacao/<ft>/`, fora do git; no
  `verificacao.md` ficam a consulta, a contagem, o caminho e um resumo sem identificar pessoas.
- Não invoque nem simule outra skill do fluxo: termine com o resultado e pare. Como subagente, devolva o relatório a
  quem chamou.
