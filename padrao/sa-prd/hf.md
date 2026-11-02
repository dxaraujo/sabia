---
{"resumo": "Corpo da história (HF): Como/quero/para, gatilho, telas (EL), cenários Dado/Quando/Então com a regra que conforma, regras e relações (o envelope OKF fica no okf-elm.md da sa-prd)."}
---
# História (HF)

**História (HF)** — um comportamento observável:

```markdown
**Como** <ator>, **quero** <capacidade>, **para** <benefício>.

**Gatilho:** <ação na tela | chamada de API | agendamento | evento> · **Entradas:** <…> · **Pré-condições:** <…>
**Telas:** [EL-01 <tela>](EL-01-<slug>.md)   <!-- só com a linha Telas = sim do sabia.md; sem tela na história, a linha sai -->

## Cenários
1.1 <caminho feliz>
**Dado que** <estado antes>
**Quando** <o ator faz X>
**Então** <efeito verificável: valor gravado, resposta, mensagem, contagem>
**Conforme** a regra [REG-01 <nome>](REG-01-<slug>.md)

1.2 <o que NÃO deve ser aceito/processado>
1.3 <repetição / reexecução: rodar de novo não duplica nem corrompe>
1.4 <erro em um item: a operação continua? o que fica registrado?>

## Regras
- [REG-01 <nome>](REG-01-<slug>.md)

## Relações
- <restringe / satisfaz / elabora, com link — só local>
```
