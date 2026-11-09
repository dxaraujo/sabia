---
{"resumo": "Corpo do requisito não funcional (RNF): um atributo de qualidade com a métrica, o valor e a condição, em itens; como medir só se houver."}
---
# Requisito não funcional (RNF)

Um atributo de qualidade do sistema: tempo de resposta, capacidade, concorrência, uso de recursos, disponibilidade,
segurança. O título diz o atributo. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
O sistema deve <atributo de qualidade, com o escopo>:

- <condição>: <valor com unidade> em <percentil, período ou carga>
- <condição>: <valor com unidade>

**Como medir:** <ferramenta, carga e ambiente>   <!-- só se houver -->
```

- **Mensurável:** todo item tem número, unidade e condição. Sem número, vai ao Em aberto com a pergunta do valor.
- **Um RNF, um atributo.** Vários atributos são vários RNF, citados entre si pelo link.
- **Termos:** o que precisa de definição (ex.: "requisição simples") vira item da lista ou GL.
- **Referência:** o link do artefato, sem prefixo, no item em que se aplica, só para baixo: REG, RNF e GL.
- **Fonte** obrigatória, em `sources` do frontmatter (`sa-elm/elm-arquivo.md`); no `prd.md`, na linha do bloco. Sem fonte, o
  requisito não entra: vai ao Em aberto.

## Checklist

- [ ] Fonte em `sources`.
- [ ] Um atributo, dito no título.
- [ ] Todo item com número, unidade e condição.
- [ ] Sem termo vago (rápido, adequado, "etc.", "se possível", "quando for o caso").
