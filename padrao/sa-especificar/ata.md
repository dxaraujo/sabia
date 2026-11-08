---
{"resumo": "ATA de reunião: frontmatter type · title · status · sources; Reunião, Item e Tipo; Participantes, Pauta, Discussão (regras, requisitos novos, complementos, contexto), Decisões (D-nn), Em aberto e Encaminhamentos, só com o que a transcrição diz."}
---
```markdown
---
type: Ata de Reunião
title: ATA - <AAAA-MM-DD> <assunto>
status: draft | stable
verified: {by: human:<usuario>, at: <AAAA-MM-DD>}   # só com status: stable
sources: [{id: reunioes/<arquivo da transcrição>, local: sim}]
---
**Reunião:** <AAAA-MM-DD> · <h>h<mm> · <assunto> · **Item:** EP-<nn> | FT-<nnn>
**Tipo:** Refinamento | Alinhamento com o cliente | Técnica | Kickoff · **Funcionalidades:** <…>

## Participantes

| Nome | Papel |
|---|---|
| Ana Souza | P.O. |
| Bruno Lima | representante do cliente — atendimento |

## Pauta

1. <tema>

## Discussão

### Regras

| R-nn | Regra | Confiança | Funcionalidade | Responsável | Fala |
|---|---|---|---|---|---|
| R-01 | **<título curto>:** <a regra, autocontida> | Alta \| Média \| Baixa | <funcionalidade> | <especificador> | [14:20] |

### Requisitos novos

| RN-nn | Requisito | Confiança | Funcionalidade | Responsável |
|---|---|---|---|---|
| RN-01 | **<título curto>:** <o que se pede> | Média | <funcionalidade> | <especificador> |

### Complementos

| C-nn | Artefato | O que muda | Responsável |
|---|---|---|---|
| C-01 | <sigla>-<id> <título> | <o que acrescentar ou mudar> | <especificador> |

### Contexto

- **<tópico>** — <o que ajuda a entender o cenário> ([31:05])

## Decisões

| D-nn | Decisão | Por quê | Quem | Quando | Fonte |
|---|---|---|---|---|---|
| D-07 | <a decisão, como foi dita> | <por quê, numa frase \| —> | Ana Souza (P.O.) | <data da reunião> | ATA-<nn> [18:05] |

## Em aberto

- <pergunta> — para <nome (papel)>

## Encaminhamentos

| O quê | Quem | Até |
|---|---|---|
| <ação> | <uma pessoa> (<papel>) | <AAAA-MM-DD> |
```

- **Arquivo:** rascunho em `.sabia/local/reunioes/`, ao lado da transcrição, com `<nn>` = `—`; aprovada, vai para
  `.sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md`, com `<nn>` = a maior da pasta + 1 e `<assunto>` em
  kebab-case, sem acento, até 5 palavras.
- **status:** `draft` na escrita; `stable` com o `verified` de quem conduziu a reunião (não é a aprovação de
  produto). Aprovada, a ATA não muda. Ao DOORS sobe só o corpo.
- **Data e tipo** vêm do nome do arquivo da transcrição ou de quem conduziu; nunca deduzidos. **Duração** `<h>h<mm>`,
  do último `[mm:ss]` da transcrição.
- **Participantes:** só nome e papel; nenhum outro dado pessoal (e-mail, telefone, matrícula).
- **Discussão:** cada item classificado como regra, requisito novo, complemento ou contexto, com a fala `[mm:ss]`.
  **Confiança:** Alta (dito e confirmado por mais de um), Média (dito sem confirmação, ou ambíguo), Baixa (inferido
  do contexto); abaixo de Baixa, o item não entra. Requisito novo é o que o documento do item não tem; o que ele tem
  em parte é complemento. **Responsável:** o especificador da funcionalidade; sem como saber, "A definir", resolvido
  na aprovação.
- **Decisões:** só as ditas pelo P.O. ou pelo representante do cliente; o D-nn é o próximo livre na seção Decisões do
  documento do item, para onde a decisão é copiada. Decisão ambígua vai ao Em aberto.
- **Encaminhamentos:** uma pessoa e uma data por item. Sem prazo dito, o item vai ao Em aberto ("prazo de <ação>?").
  Termo novo → Encaminhamentos.
- **Só o que a transcrição diz**, resumido; o `[mm:ss]` aponta a fala. Conversa informal e ruído de transcrição
  ficam fora. Nada de transcrição literal longa: a transcrição não sai da máquina. Uma ATA por transcrição.
- Dado de cliente identificável dito na reunião → só o resumo anônimo.
- Seção sem conteúdo fica só com o título.
