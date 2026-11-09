---
{"resumo": "Corpo da história de usuário (HF): narrativa, telas, fluxo básico com os desvios no passo, FA e FE, critérios Gherkin por contexto (um Quando por cenário, todo fluxo coberto), com a regra citada no passo em que é aplicada."}
---
# História de usuário (HF)

Um comportamento observável, com o valor para quem o usa. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de
`elm/` (no arquivo, o frontmatter do `sa-elm/elm-arquivo.md` vem antes).

```markdown
**Narrativa:**

**Como** <perfil>, \
**Eu quero** <ação>, \
**Para** <objetivo>.

**Telas:** EL-<id> <tela>   <!-- só com Telas = sim; sem tela na história de usuário, a linha sai -->

**Fluxo básico:**

1. <passo>. REG-<id> <título>
2. <passo>. MSG-<id> <título> (FA01) (FE01)

**Fluxos alternativos:**   <!-- só se houver -->

FA01 · <condição, como fato>: <o que acontece>. HF-<id> <título>

**Fluxos de exceção:**   <!-- só se houver -->

FE01 · <condição>: <o que acontece>.

**Critérios de aceite:**

**1. <contexto>**

1.1 <caminho feliz>

**Dado que** <estado antes> \
**E** <outra pré-condição> \
**Quando** <uma ação, dita pelo que faz e não pelo clique> \
**Então** <efeito verificável: valor gravado, resposta, mensagem, contagem>

---

1.2 <o que não deve ser aceito>

**2. <outro contexto, ou um perfil>**

2.1 Esquema do cenário: <título>

**Dado que** estou logado como <perfil> \
**Quando** <ação> \
**Então** o campo "<campo>" fica <visibilidade>

| perfil | visibilidade |
|---|---|
| **<Perfil A>** | <visível> |
```

- **Cenário:** um comportamento e um **Quando**. Dois Quando são dois cenários. Declarativo: o quê, não clique a
  clique (o detalhe de tela é da EL). Até 7 passos.
- **Cobertura:** caminho feliz, o que não deve ser aceito, repetição (rodar de novo não duplica nem corrompe) e erro
  em um item (a operação continua? o que fica registrado?), ou por que não se aplica. Todo FA e todo FE tem pelo
  menos um cenário.
- **Então verificável**, com os valores.
- **Perfil** que muda o comportamento: critérios separados por perfil, com o que ele não vê nem faz.
- **Escopo:** ação que navega para outra tela ou tem regra complexa vira HF própria; aqui fica só quem a vê, quando
  fica habilitada e a referência. HF grande (abas com grids, filtros por aba, mais de 6 FA, mais de 15 cenários)
  se desmembra em HF mãe (acesso, abas, ordenação, paginação) e filhas.
- Nenhum componente de tela, caminho de arquivo, classe ou SQL. Botões, campos e mensagens entre aspas; perfis e
  status em negrito.
- **Regra:** citada uma vez, pelo link e sem prefixo, no passo em que é aplicada; não há tabela de regras no fim.
- **Desvio:** `(FA01)` ou `(FE01)` no passo em que acontece. O título do FA e do FE é só a condição, porque mais de um passo pode desviar para ele.
- **Quebra de linha:** linhas seguidas do mesmo bloco terminam com ` \`; sem isso, o ELM junta tudo numa linha.
- **Referência só para baixo:** REG, EL, MSG, GL e UC, nunca a ET. O que já existe no ELM leva link para o arquivo
  dele (`[REG-2087 <título>](2087-REG-<slug>.md)`); o novo, só o id provisório (`REG-EP03-02`). Na publicação, a REG
  entra em embed na história de usuário.
- Os cenários não têm CT-nn: o CT-nn nasce na ficha da fatia, que diz qual cenário cobre.
- Só dado fictício nos exemplos.

## Checklist

- [ ] Narrativa com perfil, ação e objetivo.
- [ ] Todo FA e FE citado no passo em que o desvio acontece.
- [ ] Todo cenário com um Quando e o Então verificável; todo FA e FE coberto; os quatro casos cobertos ou
  justificados.
- [ ] Sem termo vago: superlativo, linguagem subjetiva (fácil, amigável), pronome sem referente, "etc.", "entre
  outros", "se possível", "quando for o caso". O termo vago vai ao Em aberto com a pergunta do valor.
- [ ] Nenhum componente de tela nem nome técnico.
- [ ] Toda REG está citada no passo em que é aplicada.
