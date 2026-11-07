---
{"resumo": "ATA de reunião: Aprovado, Reunião e Item no cabeçalho; Participantes, Pauta, Discussão, Decisões (D-nn), Em aberto e Encaminhamentos, só com o que a transcrição diz."}
---
```markdown
# ATA-<nn> · <assunto>
**Aprovado:** <usuario> · <AAAA-MM-DD> | —
**Reunião:** <AAAA-MM-DD> · <h>h<mm> · <assunto> · **Item:** EP-<nn> | FT-<nnn>

## Participantes

| Nome | Papel |
|---|---|
| Ana Souza | P.O. |
| Bruno Lima | representante do cliente — atendimento |

## Pauta

1. <tema>

## Discussão

- <tema>: <o que foi dito, resumido> ([12:40])

## Decisões

| D-nn | Decisão | Quem | Quando | Fonte |
|---|---|---|---|---|
| D-07 | <a decisão, como foi dita> | Ana Souza (P.O.) | <data da reunião> | ATA-<nn> [18:05] |

## Em aberto

- <pergunta> — para <nome (papel)>

## Encaminhamentos

| O quê | Quem | Até |
|---|---|---|
| <ação> | <nome> (<papel>) | <AAAA-MM-DD> \| — |
```

- **Arquivo:** rascunho em `.sabia/local/reunioes/`, ao lado da transcrição, com `<nn>` = `—`; aprovada, vai para
  `.sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md`, com `<nn>` = a maior da pasta + 1 e `<assunto>` em
  kebab-case, sem acento, até 5 palavras.
- **Aprovado:** de quem conduziu a reunião (não é a aprovação de produto). Aprovada, a ATA não muda.
- **Duração** `<h>h<mm>`, do último `[mm:ss]` da transcrição.
- **Participantes:** só nome e papel; nenhum outro dado pessoal (e-mail, telefone, matrícula).
- **Decisões:** só as ditas pelo P.O. ou pelo representante do cliente; o D-nn é o próximo livre na seção Decisões do
  documento do item, para onde a decisão é copiada. O resto é Discussão ou Em aberto.
- **Só o que a transcrição diz**, resumido; o `[mm:ss]` aponta a fala. Nada de transcrição literal longa: a
  transcrição não sai da máquina.
- Dado de cliente identificável dito na reunião → só o resumo anônimo. Termo novo → Encaminhamentos.
- Seção sem conteúdo fica só com o título.
