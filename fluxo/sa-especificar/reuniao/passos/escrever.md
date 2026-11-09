---
{"resumo": "Escreve o rascunho da ATA ao lado da transcrição pelo template requisitos/template-ata.md, ou pela skill de toolkit da ATA, só com o que a transcrição diz."}
---
## Entrada

O `.transcricao.md` (passo `transcricao`), o documento do item (para o próximo D-nn) e, no ajuste, o pedido da pessoa.

## Faça

Tipo `ATA` com skill de toolkit no seu prompt (sem agente: a seção Tipos com skill de toolkit do `.sabia/sabia.md`) →
a ATA sai pela skill, com o fluxo e o template do tipo; na volta, confira as seções do template `requisitos/template-ata.md`.

Senão, escreva `.sabia/local/reunioes/<id>-<AAAA-MM-DD>.ata.md` pelo template `requisitos/template-ata.md`:

- Frontmatter com `status: draft`; Reunião (`AAAA-MM-DD · <h>h<mm> · <assunto>`, a duração pelo último `[mm:ss]`) e Item.
- Participantes por nome e papel, com os papéis do passo `transcricao`.
- Discussão com `[mm:ss]`; Decisões só as ditas pelo P.O. ou pelo representante do cliente, com o próximo D-nn livre
  do documento do item, Quem = `<nome> (<papel>)`, Quando = a data da reunião e Fonte = `ATA-nn [mm:ss]` (o `nn` entra
  na aprovação).
- Em aberto e Encaminhamentos (`O quê | Quem | Até`).
- Termo novo vai aos Encaminhamentos, não ao glossário.

## Saída

O rascunho ao lado da transcrição → passo `aprovar`.

## Pare se

Nenhum caso próprio deste passo.
