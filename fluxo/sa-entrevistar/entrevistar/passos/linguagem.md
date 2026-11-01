---
{"resumo": "Leva cada termo de negócio ao glossário (padrão sa-entrevistar/glossario.md) na base, ou o deixa pendente no decisoes.md, e devolve o resumo a quem chamou."}
---
## Entrada

Os termos de negócio que apareceram na entrevista (novos, renomeados ou desambiguados).

## Faça

Linguagem ubíqua. Todo termo de negócio que apareceu (novo, renomeado ou desambiguado) vai para o glossário do projeto (artefato de
produto: pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base); durante uma especificação em andamento, o termo fica no `decisoes.md` da pasta de
trabalho e vai ao glossário no GATE do PRD), no padrão `sa-entrevistar/glossario.md`.

- Um termo por conceito; sinônimos vão para "Evitar". O código novo usa o termo canônico (o revisor confere).
- Termo que já existe no ELM (bundle) → cite o id na coluna ELM; termo novo fica com `—` e, num épico, vira um
  conceito `GL-<termo>.md` em `elm/` (`sa-prd`), publicado como Termo de Glossário ([elm-publicar.md](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md)).
- O glossário é artefato de produto: só na branch base. Entrevista de uma **fatia** (na branch dela) → não grave o
  glossário; registre o termo no `decisoes.md` da fatia como `termo pendente`, e a `sa-consolidar` o leva para o
  glossário depois do merge.

## Saída

Saída para quem chamou:

```
Entrevista — <EP | FT> · <N> decisões: <d> decididas · <c> confirmadas por fonte · <a> em aberto
Termos no glossário: <novos> novos · <alterados> alterados
Em aberto (bloqueiam?): D-03 <tema> — <sim: muda o comportamento | não: detalhe de apresentação>
```

Aqui o fluxo termina.

## Pare se

Entrevista de uma fatia (na branch dela) → não grave o glossário (acima).
