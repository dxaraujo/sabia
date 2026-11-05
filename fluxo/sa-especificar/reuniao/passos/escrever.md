---
{"resumo": "Escreve em elm/ a ATA da reunião (padrão sa-especificar/ata.md, envelope OKF, status draft), com o D-nn de cada decisão reservado no decisoes.md; com skill de toolkit para a ATA no prompt, sai por ela."}
---
## Entrada

O `.transcricao.md` da reunião (passo `transcricao`), o `decisoes.md` e o `rascunho.md` da pasta do épico.

## Faça

Tipo `ATA` com skill de toolkit no seu prompt (**Tipos com skill de toolkit**) → a ATA sai pela skill: carregue-a,
siga o fluxo e o padrão da ATA pelos caminhos da linha, se a linha os trouxer (senão, a skill), e volte a este passo ("Toolkit na especificação", no
passo `sa-especificar.especificar.encaminhar`). Na volta, confira o artefato pelo contrato: arquivo pela coluna Arquivo do catálogo, envelope do `okf-elm.md`,
`status: draft`.

Sem ele, crie `elm/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md` (nome pelo padrão) na pasta do épico (a da base se a linha do épico no `backlog.md` já tem o link `prd`; senão, a de trabalho), com o corpo do padrão
`sa-especificar/ata.md` e o envelope de [references/okf-elm.md](~/.sabia/framework/skills/sa-prd/references/okf-elm.md):
`status: draft`, `sources` (a transcrição, só pelo nome e o sha256 no `title`, e o `decisoes.md`), `generated`.

- Participantes por nome e papel, com os papéis do passo `transcricao`.
- Cada decisão com o próximo `D-nn` livre do `decisoes.md`, na ordem da reunião, **reservado** ali na hora: a linha
  do `D-nn` com a pergunta e a Situação `em aberto — ATA-<nn> draft`, para a entrevista não dar o mesmo número. O
  que muda uma decisão já registrada diz qual (`revisa D-nn`). No ajuste, a decisão que sai libera o `D-nn` (apague
  a linha reservada); a ATA descartada libera todos os dela.
- Termos do glossário no texto; termo novo vai para as dúvidas da próxima reunião, não para o glossário.

## Saída

A ATA `draft` em `elm/`, com os `D-nn` reservados no `decisoes.md` → passo `aprovar`.

## Pare se

Nenhum caso próprio deste passo.
