---
{"resumo": "Corpo do caso de uso (UC): atores, pré-condições e, se houver, gatilho e pós-condições; fluxo básico com a referência e o desvio no passo; FA e FE pela condição, com o retorno; requisitos especiais só se houver."}
---
# Caso de uso (UC)

Só com a linha Casos de uso = `sim` na seção Especificação do `.sabia/sabia.md`. O padrão para comportamento novo é a
HF; o UC serve ao projeto que já descreve o sistema em casos de uso (sistemas existentes, lote, serviço, integração).
O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
**Ator principal:** <pessoa, sistema ou agendamento> · **Atores secundários:** <… | —> \
**Gatilho:** <agendamento diário, 02h00 | evento>   <!-- só quando não é óbvio --> \
**Pré-condições:** <estado antes> \
**Pós-condições:** <estado depois, verificável; se a falha deixa estado, diga qual>   <!-- só se houver -->

**Fluxo básico:**

1. O sistema <ação>. REG-<id> <título>
2. O sistema <ação>. UC-<id> <título> (FA01)
3. O sistema <ação>. MSG-<id> <título> (FE01)
4. Caso de uso encerrado.

**Fluxos alternativos:**   <!-- só se houver -->

**FA01 · <condição, como fato>**

1. O sistema <ação>.
2. Volta ao passo seguinte ao do desvio.

**Fluxos de exceção:**   <!-- só se houver -->

**FE01 · <condição>**

1. O sistema <ação> e registra <o quê>.
2. Caso de uso encerrado.

**Requisitos especiais:**   <!-- só se houver -->

- <volume, janela, prazo: "processar até 5 mil turmas em 30 minutos">
```

- **Título:** o nome do caso de uso diz o objetivo; não há campo Objetivo.
- **Passo:** uma ação, do ator ou do sistema, com o link da REG, da MSG ou do UC incluído, sem prefixo, e o desvio `(FA01)` ou
  `(FE01)` no próprio passo. O fluxo básico termina em "Caso de uso encerrado".
- **FA e FE:** o título é só a condição, como fato, porque mais de um passo pode desviar para ele; a última linha diz onde
  volta ("Volta ao passo N", "Volta ao passo seguinte ao do desvio") ou "Caso de uso encerrado". A variação é um FA; não há
  extensão (extend).
- **Quebra de linha:** linhas seguidas do cabeçalho terminam com ` \`; sem isso, o ELM junta tudo numa linha.
- **Cenários:** o fluxo básico e cada FA e FE viram um cenário da ficha, com o seu CT-nn. A fatia pode levar o UC
  inteiro ou só alguns fluxos.
- **Nomes técnicos:** como na REG, só com REG com dados técnicos = `sim`, entre parênteses no passo.
- **Referência só para baixo,** no passo: REG, MSG, GL e o UC incluído, nunca a HF. Existente no ELM → link para o arquivo;
  novo → só o id provisório.

## Checklist

- [ ] Ator principal e pré-condições.
- [ ] Todo FA e FE citado no passo em que o desvio acontece, com o retorno.
- [ ] Um passo por ação; o fluxo básico termina em "Caso de uso encerrado".
- [ ] Sem termo vago (superlativo, subjetivo, "etc.", "se possível", "quando for o caso").
