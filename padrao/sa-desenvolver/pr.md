---
{"resumo": "Template do MR (.gitlab/merge_request_templates/Default.md): título <FT-nnn> — <título> e as seções O quê · Porquê · Prova · Risco · Foco · Cobre."}
---
```markdown
FT-<nnn> — <título>

## O quê
<1–3 linhas do comportamento entregue>

## Porquê
<motivo, da Entrada e do Objetivo da ficha> · Ficha: [FT-<nnn>](<caminho da ficha>) · Spec: <pasta da spec | trivial: sem pasta>

## Prova
- CI: <pipeline do último commit: verde | vermelho | sem CI: suíte local verde> (baseline: último pipeline da base)
- Autorrevisão (sa-revisor, rubrica C): <VEREDITO> · achados aceitos: <[R1], … | nenhum> · descartados: <motivo | nenhum>
- Verificação (sa-verificador):
  | CT-nn | Resultado | Esperado × obtido | Evidência |
  |---|---|---|---|
  <a ✅ · r ❌ · e ⚠️ · p 🔁> · VERIFICACAO: <ACEITO | REJEITADO | AMBIENTE>
- homologação: <— | 🔎 da homologação, quando houve>

## Risco
- Reversível: <sim | não — <o que fazer>>
- DDL: <— | BD-nnn>
- ADRs: <NNNN, … | —>

## Foco
<ordem de leitura sugerida, do teste do cenário principal ao código que ele exercita>
1. `<arquivo de teste>`
2. `<arquivo de produção>`

## Cobre
<<sigla>-<id> · inclui | altera | exclui, como na ficha | nenhum requisito>

## Lições
<só na rota trivial: lição · regra proposta | —>
```

A primeira linha é o título do MR; o resto é a descrição. O MR é para uma pessoa ler o código: pequeno, com a
evidência e o caminho de leitura, sem despejar o plano. Evidência com dado real nunca vai ao MR: só o resumo, sem
identificar pessoas.
