---
{"resumo": "Grava a resposta do cliente à versão vN do protótipo: aprovado → um D-nn com quem, data, versão e evidência (ATA ou e-mail); ajuste → versão nova; sem resposta ou sem a versão do ajuste, a sessão fecha aguardando."}
---
## Entrada

A última versão registrada do protótipo (passo `registrar`) e o `decisoes.md` da pasta de trabalho.

## Faça

Pergunte:

```
✅ Protótipo v<N> — EP-<nn>: qual a resposta do cliente?
aprovado: <nome (papel)> · <AAAA-MM-DD> · <ATA-<nn> | e-mail <AAAA-MM-DD> "<assunto>">
ajuste: <o que o cliente pediu>
aguardando
```

- **Aprovado** — só com quem, data, versão e evidência; faltando uma delas, é `aguardando`.
  - **ATA:** a `ATA-<nn>` aprovada que registra a aprovação; o `D-nn` dela (passo `sa-especificar.reuniao.decisoes`) é o da
    aprovação, se diz a versão: a Pergunta e a Decisão dele passam ao texto abaixo, com a ATA na Fonte (é por esse
    texto que o encaminhar e o `sa-prd.prd.escrever` acham a aprovação). ATA ainda `draft` ou transcrição sem ATA → a ATA antes (o encaminhar a
    traz); a ATA sem essa decisão → `D-nn` novo, com a ATA na fonte.
  - **E-mail:** `D-nn` novo. O e-mail fica com quem o recebeu (não sobe: pode ter dado do cliente).

  O `D-nn` (padrão `sa-entrevistar/decisoes.md`): Pergunta `Protótipo aprovado pelo cliente?`, Decisão
  `Protótipo v<N> aprovado (prototipo-v<N>-<slug>.<ext>)`, Fonte / quem decidiu
  `<nome> (<papel>) · <ATA-<nn> [mm:ss] | e-mail <AAAA-MM-DD> "<assunto>">`, a data da aprovação, Situação
  `decidida` (a de uma versão aprovada antes: `decidida — substitui D-nn`). No `rascunho.md`, a linha da versão
  passa a `aprovado — D-<nn>`.
- **Ajuste** — no `rascunho.md`, o que o cliente pediu, com a data e a fonte; a linha da versão passa a `ajuste`.
  A versão nova já está em `prototipo/` → passo `registrar`; senão, a linha passa a `ajuste — aguardando a v<N+1>`
  e a sessão fecha (o encaminhar seguinte, com o arquivo novo, traz o `registrar`).
- **Aguardando** — a linha da versão segue `aguardando o cliente`; o próximo encaminhar traz de volta a este passo.

## Saída

- Aprovado → volte a quem chamou: o encaminhar segue para o PRD; do `sa-prd.prd.escrever`, o lote segue. Com o
  `prd.md` já escrito, a versão nova muda os leiautes: as EL citam a versão antiga, e o encaminhar leva o `sa-prd.prd`
  ao passo `sa-prd.prd.escrever`.
- Ajuste com a versão nova → passo `registrar`.
- Ajuste sem a versão nova, ou aguardando o cliente → passo `sa-especificar.especificar.fechar-sessao`.

## Pare se

- Aguardando o cliente ou a versão do ajuste → feche a sessão (`sa-especificar.especificar.fechar-sessao`); ali a
  sessão termina.
