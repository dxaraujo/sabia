---
{"resumo": "Corpo da regra de negócio (REG): pré-condição, a lógica no bloco da categoria com a condição na forma positiva e a ação; regra simples é uma frase; a referência fica no item em que se aplica."}
---
# Regra de negócio (REG)

Uma regra, testável, com os valores. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
**Pré-condição:** <quando a regra se aplica>

**Validação:** o sistema verifica se:

- <condição>. **Conforme** REG-<id>, e;
- <condição>.

**Ação:** <o que acontece>. **Conforme** MSG-<id>
```

Regra simples é uma frase declarativa com os valores, sem blocos: `Uma turma tem no máximo **40** inscrições **Confirmadas**.`

O rótulo do bloco é a categoria da regra:

| Bloco | Forma |
|---|---|
| **Validação:** | o sistema verifica se (itens ligados por "e;" ou "ou;"), seguido da **Ação:** |
| **Cálculo:** | fórmula com unidades, arredondamento e um exemplo numérico |
| **Permissão:** | tabela perfil × operação |
| **Status:** | tabela de transições: de · para · quem · condição |
| **Abrangência:** | tabela perfil × o que vê |
| **Temporal:** | período ou prazo, com o calendário (dias corridos ou úteis), seguido da **Ação:** ao vencer |

- **Condição positiva:** a condição diz o que dispara a Ação, como o negócio fala. Não inverta a lógica.
- **Declarativa:** o bloco diz só como a regra é avaliada e o que acontece. O que o processo faz depois (lista de espera,
  reenvio, aviso) fica na HF ou no UC.
- **Atômica:** uma regra por REG. Várias validações ("N° Validação") são várias REG, citadas entre si com **Conforme**.
- **Fonte** obrigatória, em `sources` do frontmatter (`sa-elm/elm-arquivo.md`); no `prd.md`, na linha do bloco. Sem fonte, a
  regra não entra: vai ao Em aberto. A exceção também vem da fonte; a que a fonte não diz vai ao Em aberto.
- **Nomes técnicos:** só com a linha REG com dados técnicos = `sim` na seção Especificação do `.sabia/sabia.md`,
  entre parênteses no próprio item, na forma original (`(TB_TURMA.QT_VAGAS)`). Com `não`, só o rótulo que o
  usuário vê.
- **Mensagem:** pelo id da MSG, na Ação; o texto mora na MSG.
- **Referência:** com **Conforme** no item em que se aplica, só para baixo: REG, MSG e GL, nunca a HF, a EL ou a ET que
  usam a regra. Existente no ELM → link para o arquivo; novo → só o id provisório.
- Bloco sem conteúdo sai.

## Checklist

- [ ] Fonte em `sources`.
- [ ] Regra simples numa frase, ou Pré-condição, bloco da categoria e Ação.
- [ ] Condição na forma positiva; a Ação com a MSG; nada do passo seguinte do processo.
- [ ] Uma regra só.
- [ ] Sem termo vago (superlativo, subjetivo, "etc.", "se possível", "quando for o caso").
