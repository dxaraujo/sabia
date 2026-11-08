---
{"resumo": "Quem conduziu a reunião aprova a ATA; com o sim, ela ganha o número e vai para .sabia/planejamento/atas/."}
---
## Entrada

O rascunho da ATA em `.sabia/local/reunioes/`.

## Faça

Confira que cada D-nn do rascunho ainda é o próximo livre no documento do item; tomado por outra decisão, renumere.
Mostre a ATA inteira e pergunte a quem conduziu a reunião:

```
ATA — <AAAA-MM-DD> <assunto> · <id>
Participantes: <n> · Decisões: D-<nn>…D-<nn> · Em aberto: <n>
Aprovar? (sim | ajuste: <o quê>)
```

- **Sim.** `status: stable` e `verified: {by: human:<usuario>, at: <AAAA-MM-DD>}` no frontmatter, `<nn>` = a maior ATA de `.sabia/planejamento/atas/`
  + 1, o `ATA-nn` nas Fontes, e o arquivo vai para `.sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md`
  (`<assunto>` em kebab-case, sem acento, até 5 palavras).
- **Ajuste** → passo `escrever`, com o pedido.

## Saída

ATA aprovada em `.sabia/planejamento/atas/` → passo `decisoes`. Ajuste → passo `escrever`. Sem o "sim" → passo
`devolver`, com o rascunho em `.sabia/local/reunioes/`.

## Pare se

Nenhum caso próprio deste passo: sem o "sim", o rascunho fica e a próxima entrada volta aqui.
