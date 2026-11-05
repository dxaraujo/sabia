---
{"resumo": "Formato de cada cenário no verificacao.md: o roteiro (passo roteiro da sa-verificar) e, logo abaixo, o resultado (passo executar); no fim do arquivo, a decisão de cada rodada (passo decisao)."}
---
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

`🔁 possível alteração`, só no AFK: o cenário que o verificador atribui a um artefato (o artefato parece errado, não o
código). Não vira tarefa de código: vai ao Drift de negócio, e quem decide é o Dev Sênior na `[APR] Aprovar PR`.

## Decisão (fim do arquivo, uma por rodada)

```markdown
🔎 Verificação FT-<nnn> — rodada <N>
Cenários: <a> aceitos · <r> rejeitados · <e> ambiente · <p> possível alteração (AFK)
Drift de negócio: não | possível alteração — <motivo> · artefatos: <id|rótulo> (<tipo>)
VERIFICACAO: ACEITO | REJEITADO
```

A **última linha** do arquivo é `VERIFICACAO: ACEITO` ou `VERIFICACAO: REJEITADO`.
