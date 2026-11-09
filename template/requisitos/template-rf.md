---
{"resumo": "Corpo do requisito funcional (RF): a capacidade que o sistema deve ter, numa frase verificável, com os limites em itens e a referência no item em que se aplica."}
---
# Requisito funcional (RF)

Uma capacidade que o sistema deve ter, como o cliente ou o contrato a declara. O comportamento passo a passo fica na HF
ou no UC. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
O sistema deve <capacidade, com o objeto e os valores>.

- <condição ou limite>. REG-<id> <título>
- <condição ou limite>.
```

- **Frase:** "O sistema deve" e uma capacidade. Os itens só aparecem quando há condição ou limite.
- **Um RF, uma capacidade.** Duas capacidades são dois RF, citados entre si pelo link.
- **Verificável:** dá para dizer se o sistema atende, com os valores.
- **Referência:** o link do artefato, sem prefixo, no item em que se aplica, só para baixo: REG, MSG e GL.
- **Fonte** obrigatória, em `sources` do frontmatter (`sa-elm/elm-arquivo.md`); no `prd.md`, na linha do bloco. Sem fonte, o
  requisito não entra: vai ao Em aberto.

## Checklist

- [ ] Fonte em `sources`.
- [ ] Uma capacidade, numa frase verificável.
- [ ] Nada de passo a passo: isso é da HF ou do UC.
- [ ] Sem termo vago (superlativo, subjetivo, "etc.", "se possível", "quando for o caso").
