---
{"resumo": "Regra promovida na seção Regras aprendidas do .sabia/sabia.md (`sa-aprender.promover.escrever`)."}
---
```markdown
### R-<nn> · <título> · aplica a: <desenvolvedor | revisor | plano | PRD | todos> · severidade: <BLOQUEANTE | IMPORTANTE>
<A regra em 1–2 frases imperativas.>
- ✅ <exemplo certo> · ❌ <exemplo errado>
- Origem: L-<nnn>, L-<nnn>
```

- `R-<nn>` = o maior R da seção Regras aprendidas + 1, com 2 dígitos (R-01 na primeira).
- aplica a: `desenvolvedor` (quem implementa, `sa-codificar`; item extra da rubrica C) · `revisor` (item extra de
  qualquer rubrica, passo `sa-revisar.revisar.calibrar`) · `plano` (`sa-plano`; rubrica L) · `PRD` (`sa-prd` e
  `sa-especificar`; rubrica P) · `todos`.
- severidade: a das rubricas ([rubricas.md](~/.sabia/framework/padrao/sa-revisar/rubricas.md)): `BLOQUEANTE` reprova;
  `IMPORTANTE` também reprova (barato de corrigir agora, caro depois).
