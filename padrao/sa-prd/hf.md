---
{"resumo": "Corpo da história (HF): como/quero/para, gatilho, telas, cenários Dado/Quando/Então com a regra que conforma e as regras que embute."}
---
# História (HF)

Um comportamento observável. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
**Como** <ator>, **quero** <capacidade>, **para** <benefício>.

**Gatilho:** <ação na tela | chamada de API | agendamento | evento> · **Entradas:** <…> · **Pré-condições:** <…>
**Telas:** EL-<id> <tela>   <!-- só com Telas = sim; sem tela na história, a linha sai -->

## Cenários

**<h>.1 · <caminho feliz>**
**Dado que** <estado antes>
**Quando** <o ator faz X>
**Então** <efeito verificável: valor gravado, resposta, mensagem, contagem>
**Conforme** REG-<id>

**<h>.2 · <o que não deve ser aceito>**
**<h>.3 · <repetição: rodar de novo não duplica nem corrompe>**
**<h>.4 · <erro em um item: a operação continua? o que fica registrado?>**

## Regras

- REG-<id> <título>
```

- **Então verificável**, com valores; nada de "corretamente".
- Os cenários não têm CT-nn: o CT-nn nasce na ficha da fatia, que diz qual cenário cobre.
- A HF cita as REG pelo id; na publicação, a REG entra em embed.
- Sem caminho de arquivo, classe nem SQL. Só dado fictício nos exemplos.
