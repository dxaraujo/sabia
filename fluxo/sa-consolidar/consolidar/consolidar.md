---
{"fluxo": "consolidar", "dono": "sa-produto",
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "sprint": "nao", "branch": "nao"},
   {"id": "drift"},
   {"id": "elm"},
   {"id": "conhecimento"},
   {"id": "fechar", "chama": "sa-aprender.registrar"},
   {"id": "proximo"}
 ]}
---
# Consolidar — Documentação viva depois do merge

O plano da fatia (`research`, `design`, `tasks`) é andaime: cumpriu o papel quando o código chegou à base. O que
fica valendo é a documentação oficial no ELM — e ela tem de descrever o que **foi** construído. Este fluxo fecha a
distância entre os dois: os artefatos aprovados na `[ESP]` foram publicados na conclusão dela; aqui ficam a ET
as-built, o vínculo dela e o débito de especificação.

**Processo de produto:** quem consolida é o **P.O. ou o SM** (analista de negócio), no agente **`sa-produto`**, e
a tarefa é a **`[GB] Gerenciamento do backlog`** (a `GB` da primeira linha de `## Sustentação` do `backlog.md`;
dono = o SM). A consolidação não repete a revisão nem a verificação: o drift de negócio já vem marcado por elas no
`status.md`; os ADRs já vêm escritos no PR.

Entrada: fatia `pronta` — o Dev responsável mergeou o PR aprovado e, conferido o merge, gravou `Fase: pronta` no
`status.md` da **base** (`sa-desenvolver.encerrar`; merge por fora do Sabiá: a sincronização da sprint,
[elm-sprint.md](~/.sabia/framework/skills/sa-planejamento/references/elm-sprint.md) §9). O passo `entrada` lê a fase
da base; `concluida` é terminal: nada se repete (ADR, lições, glossário, CT, ELM). Tudo aqui é gravado na **base**,
pelo bloco [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base) (a troca e o
`pull --ff-only` vêm antes de qualquer passo).

## Entrada: vizinhos

- sem `pronta` na base, PR mergeado com a aprovação registrada (HITL: REV APROVADO e VER ACEITO; AFK: `[APR] Aprovar PR` concluída); ou `pronta` com a `[DEV]` aberta (`elm_ler_wi(<id da DEV>)` não concluída; sem o MCP: a `ELM pendente [<chave>]: lançar … e concluir [DEV] FT-<nnn>` sem o `ELM feito`) → `sa-desenvolver.encerrar` (agente `sa-desenvolvedor`: o merge, o registro dele e a conclusão da `[DEV]` são do Dev)
- PR mergeado sem a aprovação registrada, sem `pronta` na base → `sa-planejamento.durante.sincronizar` (a sincronização da sprint grava a `pronta` pela evidência do merge)

## Regras

- Não apague a pasta da fatia: ela é o registro de como a mudança foi feita (o ELM é o registro do que o sistema
  faz).
- Toda escrita no ELM só com confirmação ([regras](~/.sabia/framework/skills/sabia/references/elm.md#regras-de-toda-escrita)).
- Não escreve código: a correção que o glossário ou o drift pedirem no código vira fatia.
- Não escreve requisito: o que a fatia cobre já foi aprovado e publicado na `[ESP]` (a ET as-built é do Dev, ajustada
  só pela skill de toolkit do tipo); a divergência depois do merge é débito técnico de especificação (passo `drift`).
- Não invoque nem simule outra skill além das que os passos mandam chamar (`sa-aprender.registrar`): termine com o
  passo `proximo` e pare.
