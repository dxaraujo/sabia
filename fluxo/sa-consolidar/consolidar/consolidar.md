---
{"fluxo": "consolidar", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "drift", "saidas": {"já concluida": "fim", "sem pronta na base: o merge e o registro do merge são do Dev": "→ sa-desenvolver.encerrar", "drift sim, com épico: o PRD muda antes de publicar": "→ sa-prd.mudanca"}},
   {"id": "elm"},
   {"id": "conhecimento"},
   {"id": "fechar", "chama": "sa-aprender.registrar"},
   {"id": "proximo"}
 ]}
---
# Consolidar — Documentação viva depois do merge

O plano da fatia (`research`, `design`, `tasks`) é andaime: cumpriu o papel quando o código chegou à base. O que
fica valendo é a documentação oficial no ELM — e ela tem de descrever o que **foi** construído. Este fluxo fecha a
distância entre os dois.

**Processo de produto:** quem consolida é o **P.O. ou o SM** (analista de negócio), no agente **`sa-produto`**, e
a tarefa é a **`[GB] Gerenciamento do backlog`** (a `GB` da primeira linha de `## Sustentação` do `backlog.md`;
dono = o SM). A consolidação não repete a revisão nem a verificação: o drift de negócio já vem marcado por elas no
`status.md`; os ADRs já vêm escritos no PR.

Entrada: fatia `pronta` — o Dev responsável mergeou o PR aprovado e, conferido o merge, gravou `Fase: pronta` no
`status.md` da **base** (`sa-desenvolver.encerrar`; merge por fora do Sabiá: a sincronização da sprint,
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9). Leia a fase dali (`git fetch` e `git show
origin/<base>:.kiro/specs/<ft>-<slug>/status.md`), com o `status` da linha no `backlog.md` da base: `concluida` em
qualquer um dos dois → diga "já consolidada em <data>" e pare — nada se repete (ADR, lições, glossário, CT, ELM).
Sem `pronta` na base (PR aberto, ou mergeado sem o registro) → não consolide: mande o Dev ao fluxo `sa-desenvolver.encerrar`
(o merge e o registro do merge são dele; mergeado por fora do Sabiá → "sincroniza a sprint") e
pare. Tudo aqui é gravado na **base**, pelo bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) (a troca e o `pull --ff-only` vêm antes de
qualquer passo).

## Regras

- Não apague a pasta da fatia: ela é o registro de como a mudança foi feita (o ELM é o registro do que o sistema
  faz).
- Toda escrita no ELM só com confirmação ([regras](~/.sabia/framework/skills/sabia/references/elm.md#regras-de-toda-escrita)).
- Não escreve código: a correção que o glossário ou o drift pedirem no código vira fatia.
- Não invoque nem simule outra skill além das que os passos mandam chamar (`sa-prd` ou `sa-triar` no
  drift; `sa-aprender.registrar`): termine com o passo `proximo` e pare.
