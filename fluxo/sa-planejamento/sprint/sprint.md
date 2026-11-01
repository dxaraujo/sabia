---
{"fluxo": "sprint", "dono": "sa-produto",
 "quando": ["planejar a próxima sprint: capacidade, previsão, responsáveis, meta e publicação no EWM; também o replanejamento da próxima na virada", "planejar a sprint"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "senioridade"},
   {"id": "capacidade"},
   {"id": "especificacao"},
   {"id": "previsao"},
   {"id": "responsaveis"},
   {"id": "modo"},
   {"id": "meta"},
   {"id": "iteracao"},
   {"id": "proposta"},
   {"id": "gravar"}
 ]}
---
# Modo sprint — planejar a próxima

Entrada: "planejar a sprint", ou o replanejamento da próxima na virada (passo `sa-planejamento.retrospectiva.recalcular`).
O passo `modo` (Modo pela senioridade) também vale fora deste fluxo: no encaixe (`sa-planejamento.durante.encaixe`),
na Troca de modo (fluxo `sa-planejamento.troca-modo`) e quando alguém assume uma fatia que entrou sem responsável.

Com agentes escrevendo código, o que limita a entrega é a **atenção humana**: decidir (P.O.), revisar planos e
PRs, verificar e aceitar. O planejamento do Sabiá mede e protege essa capacidade, trabalha com fatias pequenas e de
tamanho parecido e prevê pela **vazão** (fatias concluídas por sprint) e pelo **lead time** por fatia — sem pontos
(opcionais só no IB do EWM, para quem usa o relatório de velocidade de lá).

**A sprint é cadência, não contêiner de escopo:** o time se compromete com a **meta**; a seleção do planejamento é
uma **previsão**. Dentro da sprint o fluxo é **puxado** — terminou uma fatia, a `elegivel` do topo entra, enquanto o
WIP de revisão humana tiver folga (a `sa-desenvolver` puxa, sem cerimônia). O Encaixe (passo
`sa-planejamento.durante.encaixe`) fica para quem fura a fila ou estoura o WIP.
Toda hora do time cabe numa tarefa da sprint, em seis frentes: entrega `[DEV]`, revisão `[REV]`, aprovação `[APR]`
(do Dev Sênior, nos gates sem tarefa de papel: plano e PR do AFK), verificação `[VER]`, especificação `[ESP]` e
Sustentação (`[ATD]`, `[IMPL]`, `[BD]`, `[INF]`, `[OPE]`, `[EXT]` — tabela **Sustentação** do `sabia.md`; as fatias
de Manutenção, sem épico, usam as tarefas de papel, como as de épico).
