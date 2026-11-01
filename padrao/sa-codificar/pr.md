---
{"resumo": "Texto do PR da fatia (passo pr da sa-codificar)."}
---
```
FT-<nnn> — <título>   (<EP-<nn> | Manutenção> · <IB | DF> <id ELM | —>)
O quê: <1–3 linhas do comportamento entregue>
Cobre: HF-01 · 1.1, 1.2 · REG-01   (ELM: <ids | pendente>)
Plano: .kiro/specs/<ft>-<slug>/ (research · requirements · design · tasks)
Revisão: <AFK: revisao-codigo-<N>.md (APROVADO) · Aceite: verificacao.md (ACEITO, <n> cenários) | HITL: revisão automática OK (achados aceitos: …) — revisão e aceite no PR>
Backpressure: compilar ok · testes ok · lint ok · cobertura <x% | sem gate>
Banco (DDL): <não se aplica | pendente — implantação bloqueada>
ADRs: <adr/<arquivo>, … | nenhum> · ET as-built: <elm/ET-<slug>.md | não se aplica>
Como ler: <ordem sugerida dos arquivos — do teste do cenário principal para o código que ele exercita>
Reversível? <sim, só reverter o PR | não: dado migrado/contrato publicado — o que fazer>
```
O PR é para uma pessoa **ler o código**: pequeno, com a evidência e o caminho de leitura, sem despejar o plano.
