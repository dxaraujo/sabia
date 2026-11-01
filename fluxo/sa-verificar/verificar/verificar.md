---
{"fluxo": "verificar", "dono": "sa-verificador",
 "travas_gerais": ["sim-da-pessoa", "aceite-independente"],
 "passos": [
   {"id": "assumir", "saidas": {"quem está na sessão implementa a fatia": "fim"}},
   {"id": "roteiro"},
   {"id": "ambiente", "saidas": {"campo Banco pendente": "fim"}},
   {"id": "executar", "saidas": {"algum cenário rejeitado ou ⚠️": "decisao"}},
   {"id": "casos"},
   {"id": "decisao", "saidas": {"HITL, ACEITO: a fatia aceita espera o merge do Dev": "→ sa-desenvolver.encerrar", "HITL, REJEITADO: o retrabalho é do Dev": "→ sa-codificar.codificar", "cenário errado no PRD: bloqueada, é do P.O.": "→ sa-prd.mudanca"}}
 ]}
---
# Verificar — O comportamento existe de verdade?

Teste unitário verde prova que o código faz o que o teste diz; a verificação prova que o **sistema** faz o que o
cenário do PRD diz. Prefira o agente **`sa-verificador`** (contexto limpo; não implementou a fatia).

Seja cético: quem implementou tende a achar que terminou, e funcionalidade pela metade costuma passar em teste de
unidade. "Feito" é uma afirmação; a evidência é a prova.

Entrada: pasta da fatia com revisão `APROVADO`, na branch da fatia. **HITL** (tarefa `[VER]` assumida no
passo `assumir`): só com `fase: em-verificacao` — a REV aprovou antes (sem isso, diga que a `[VER]` espera a revisão e
pare, **antes** do passo `assumir`, sem assumir a `[VER]`; retomando uma verificação interrompida, `em-verificacao` vale);
vá para a branch do PR (`git switch <branch>` com "sim", `git pull --ff-only`) e a rodada de verificação é sua. Tipo de projeto, como executar e onde ver o
resultado: seção **Verificação de aceite** do `.sabia/sabia.md` (vem do toolkit, confirmado na setup).

## Regras

- Nunca marque aceito sem evidência. Nunca altere código de produção aqui — só massa, fixtures e evidências.
- Nunca rode contra produção, nem com dado real de pessoa. Evidência ou trecho de resposta que traga dado real
  (homologação com cópia de produção, por exemplo) vai para `.sabia/local/verificacao/<ft>/`, fora do git; no
  `verificacao.md` ficam a consulta, a contagem, o caminho e um resumo sem identificar pessoas.
- Não invoque nem simule outra skill do fluxo: termine com a decisão (e, com a `[VER]`, o aviso ao Dev) e pare. Como
  subagente, devolva o relatório a quem chamou.
