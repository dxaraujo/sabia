---
{"resumo": "Corpo do caso de uso (UC): objetivo, atores, gatilho, pré-condições e garantias; fluxo básico numerado; FA e FE com o passo de origem e o retorno; requisitos especiais e inclusões só se houver."}
---
# Caso de uso (UC)

Só com a linha Casos de uso = `sim` na seção Especificação do `.sabia/sabia.md`. O padrão para comportamento novo é a
HF; o UC serve ao projeto que já descreve o sistema em casos de uso (sistemas existentes, lote, serviço, integração).
O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
**Objetivo:** <o que o ator alcança>
**Ator principal:** <pessoa, sistema ou agendamento> · **Atores secundários:** <… | —>
**Gatilho:** <agendamento diário, 02h00 | chamada | evento | ação na tela>
**Pré-condições:** <estado antes>
**Pós-condição de sucesso:** <estado depois, verificável>
**Pós-condição mínima:** <o que vale mesmo na falha: nada gravado pela metade, a falha registrada>

**Fluxo básico:**

1. O sistema <ação>. **Conforme** REG-<id>
2. O sistema <ação>.
3. O sistema <ação>. **Conforme** MSG-<id>
4. Caso de uso encerrado.

**Fluxos alternativos:**

**FA01 · <condição, como fato>** (no passo 2)

1. O sistema <ação>.
2. Volta ao passo 3.

**Fluxos de exceção:**

**FE01 · <condição>** (no passo 3)

1. O sistema <ação> e registra <o quê>.
2. Caso de uso encerrado.

**Requisitos especiais:**   <!-- só se houver -->

- <volume, janela, prazo: "processar até 5 mil turmas em 30 minutos">

**Inclui:**   <!-- só se houver -->

- UC-<id> <título> (no passo 3)
```

- **Passo:** uma ação, do ator ou do sistema, com o **Conforme** da REG ou da MSG no próprio passo. O fluxo básico
  termina em "Caso de uso encerrado".
- **FA e FE:** o título é a condição, como fato; "(no passo N)" diz onde nasce; a última linha diz onde volta ("Volta
  ao passo N") ou "Caso de uso encerrado". A variação é um FA; não há extensão (extend).
- **Garantias:** a de sucesso é o que vale ao terminar; a mínima, o que vale mesmo quando o caso falha.
- **Cenários:** o fluxo básico e cada FA e FE viram um cenário da ficha, com o seu CT-nn. A fatia pode levar o UC
  inteiro ou só alguns fluxos.
- **Nomes técnicos:** como na REG, só com REG com dados técnicos = `sim`, entre parênteses no passo.
- **Referência só para baixo:** REG, MSG, GL e o UC incluído, nunca a HF. Existente no ELM → link para o arquivo;
  novo → só o id provisório.

## Checklist

- [ ] Objetivo, ator principal, gatilho, pré-condições e as duas garantias.
- [ ] Todo FA e FE com o passo de origem e o retorno.
- [ ] Um passo por ação; o fluxo básico termina em "Caso de uso encerrado".
- [ ] Sem termo vago (superlativo, subjetivo, "etc.", "se possível", "quando for o caso").
