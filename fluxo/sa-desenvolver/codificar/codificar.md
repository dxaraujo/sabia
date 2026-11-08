---
{"fluxo": "codificar", "dono": "sa-desenvolvedor",
 "quando": ["codificar a fatia com TDD e backpressure em camadas, autorrevisão (sa-revisor), autoverificação (sa-verificador), lições e MR; retomar, corrigir os achados do MR ou seguir depois da codificação manual", "implementa a FT-031", "retoma a FT-031", "corrige os achados do MR", "terminei", "abre o MR"],
 "travas_gerais": ["sim-da-pessoa", "backpressure", "sem-force", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "desenvolvedor", "branch": "fatia"},
   {"id": "ler", "saidas": {"volta da codificação manual ('terminei')": "validar"}},
   {"id": "preparar"},
   {"id": "retrabalho"},
   {"id": "tarefa", "desvio": true, "travas": ["toolkit-sem-commit"], "saidas": {"ainda há tarefa": "tarefa", "o código não bate com o plano, ou trabalho fora do escopo": "desvio", "a tarefa precisa de DDL": "banco", "duas correções seguidas sem progresso, ou contexto cheio": "sem-progresso", "todas as tarefas marcadas": "atualizar"}},
   {"id": "desvio", "travas": ["decisao-da-pessoa"], "saidas": {"tratado, ainda há tarefa": "tarefa", "arquitetural ou irreversível decidido, ou texto novo aprovado: replanejar": "→ sa-plano.replanejar", "autopilot, arquitetural ou irreversível: devolvido à pessoa": "fim"}},
   {"id": "banco", "saidas": {"ainda há tarefa que não depende da DDL": "tarefa", "só restam tarefas que dependem da DDL": "fim"}},
   {"id": "sem-progresso", "saidas": {"autopilot: conta como tentativa": "disjuntor", "Retomar gravado: sessão nova": "fim"}},
   {"id": "atualizar"},
   {"id": "validar", "saidas": {"vermelho novo: tarefa nova": "tarefa", "falha de ambiente sem o sim de seguir, ou autopilot": "fim"}},
   {"id": "revisar", "chama": "sa-revisar.revisar", "saidas": {"corrige: tarefas [R<n>]": "tarefa", "volta-plano": "→ sa-plano.replanejar", "autopilot, reprovado": "disjuntor"}},
   {"id": "verificar", "chama": "sa-verificar.verificar", "travas": ["aceite-independente"], "saidas": {"ACEITO": "licoes", "REJEITADO fora do autopilot: o ❌ vira tarefa": "tarefa", "autopilot, REJEITADO ou AMBIENTE": "disjuntor", "AMBIENTE fora do autopilot, sem o sim de seguir": "fim"}},
   {"id": "disjuntor", "saidas": {"disparou: devolvido à pessoa": "fim", "não disparou: corrigir": "tarefa"}},
   {"id": "licoes"},
   {"id": "as-built"},
   {"id": "mr", "saidas": {"push sem o sim, ou remoto diferente do local": "fim"}},
   {"id": "avisar", "chama": "sa-elm.horas", "travas": ["revisao-independente"], "saidas": {"MR já aprovado e CI verde": "→ sa-desenvolver.encerrar", "esperando a revisão, ou autopilot devolvido": "fim"}},
   {"id": "captura", "de": "captura"},
   {"id": "gravar", "de": "gravar-na-base"}
 ]}
---
# Codificar — TDD, backpressure e MR

Do plano aprovado (ou da rota trivial) ao MR aberto: uma tarefa por vez em TDD, backpressure em camadas,
autorrevisão no subagente `sa-revisor`, autoverificação no subagente `sa-verificador`, lições e MR com prova e
Cobre. O fluxo termina no MR: a revisão oficial é de outro desenvolvedor e o merge é do fluxo `encerrar`.

Deste fluxo: item `em-andamento` com branch `<id>` e plano aprovado (Fase `implementando` ou `retrabalho`) ou rota
trivial; MR aberto com thread não resolvida, CI vermelho ou conflito (retrabalho); a volta da codificação manual
("terminei"); o subagente do autopilot. Na retomada, o Retomar do `status.md` (no trivial, o MR ou o último commit)
diz o passo.

**Manual**: só a geração do código-fonte é da pessoa. No "terminei", o fluxo segue do validar com as mesmas
validações e, dali em diante, roda como na IA supervisionada (a pessoa decide e dá o sim).

**Autopilot**: sem perguntas; os sins que o autopilot libera (push da própria branch, merge da base nela, MR dela)
seguem direto, e o resto devolve à pessoa. Tudo roda em `cd .sabia/local/wt/<id> && <comando>`.

Os passos `captura` e `gravar` são a captura comum e a gravação comum na base: outros passos os incluem e voltam.

## Entrada: vizinhos

- sem branch `<id>` → `sa-desenvolver.iniciar`
- `pronta` com branch `<id>` (voltou na virada) → `sa-desenvolver.iniciar`
- rota rápida ou completo com Fase — (plano não aprovado) → `sa-plano.plano`
- MR aprovado com CI verde, ou MR já mergeado → `sa-desenvolver.encerrar`
