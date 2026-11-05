---
{"resumo": "Formato do verificacao.md: uma seção por rodada, acrescentada sem apagar, com o roteiro de cada cenário (passo roteiro da sa-verificar), logo abaixo o resultado (passo executar) e, no fim da rodada, a decisão (passo resultado)."}
---
## Rodada (acrescentada no fim do arquivo, sem apagar as anteriores)

```markdown
## Rodada <N> · <AAAA-MM-DD>
```

A rodada 1 tem todos os cenários; a seguinte, só os rejeitados e os de repetição da anterior (AFK e HITL; no HITL, o
verificador pode pedir todos). Vale o resultado mais recente de cada cenário (o `CT.csv`: padrão `sa-verificar/ct-csv.md`).

## Roteiro (escrito antes de executar)

```markdown
### HF-01 · 1.2 — Rejeitar após a terceira tentativa inválida
- Massa: <script/fixture e o estado que ele cria>
- Executar: <requisição HTTP | comando do job com parâmetros | passos no browser | carga>
- Esperado: <exatamente o "Então" do cenário, com valores>
- Verificar em: <resposta | SELECT … | log | tela>
```

## Resultado (logo abaixo do roteiro)

```markdown
- Resultado: ✅ aceito | ❌ rejeitado | ⚠️ ambiente | 🔁 possível alteração
- Obtido: <o que aconteceu, com valores>
- Evidência: <trecho da resposta | resultado da consulta | linha de log | evidencias/ft-031-1.2.png>
- CT ETM: <id> (<CT-nn planejado | novo>) — gravada pela consolidação
```

`CT ETM` é opcional: só depois da consolidação, com o ETM (passo `sa-consolidar.consolidar.elm`).

`🔁 possível alteração`: o cenário que o verificador atribui a um artefato (o artefato parece errado, não o
código). Não vira tarefa de código: vai ao Drift de negócio, e quem decide é o Dev Sênior na `[APR] Aprovar PR`
(AFK) ou a pessoa verificadora (HITL: provisório até a decisão dela; código errado → `❌`).

## Decisão (fim da rodada, uma por rodada)

```markdown
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente · <p> possível alteração
Drift de negócio: não | possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)
VERIFICACAO: ACEITO | REJEITADO | AMBIENTE
```

`AMBIENTE` = só `⚠️ ambiente`, nenhum `❌`. A **última linha** do arquivo é `VERIFICACAO: ACEITO`,
`VERIFICACAO: REJEITADO` ou `VERIFICACAO: AMBIENTE`.
