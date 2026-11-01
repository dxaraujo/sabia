---
{"resumo": "Formato de cada cenário no verificacao.md: o roteiro (passo roteiro da sa-verificar) e, logo abaixo, o resultado (passo executar)."}
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
- Resultado: ✅ aceito | ❌ rejeitado | ⚠️ ambiente
- Obtido: <o que aconteceu, com valores>
- Evidência: <trecho da resposta | resultado da consulta | linha de log | evidencias/ft-031-1.2.png>
```
