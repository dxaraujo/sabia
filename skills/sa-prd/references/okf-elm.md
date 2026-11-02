# Artefatos do ELM em OKF v0.2

Cada artefato que vai ao ELM — um tipo do [catálogo](../../sabia/references/tipos.md) com ELM `DOORS` ou, o CT planejado, `ETM` — nasce
como **um conceito OKF v0.2** (Open Knowledge Format,
[SPEC.md](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md), versão 0.2) **na pasta da
spec**, até ser aprovado e publicado. É o mesmo formato do bundle que a `sa-sync` mantém
no repositório, então o rascunho e a versão oficial se leem do mesmo jeito. Cada conceito vale por si, pelo
frontmatter: a pasta não tem `index.md` nem `log.md` (OKF §8 e §9), que são do bundle da `sa-sync`.

## Onde fica

| Origem | Pasta |
|---|---|
| épico (PRD) | até o GATE do PRD, na pasta de trabalho local `.sabia/local/especificacao/<EP>-<slug>/elm/` (fora do git, anexada na `[ESP]`); aprovado, `<produto>/epicos/<EP>-<slug>/elm/` na base |
| ET as-built de uma fatia (o Dev, no PR; publicada na consolidação; a ET inicial do épico, quando há, fica na pasta do épico) | `.kiro/specs/<ft>-<slug>/elm/` |
| regra da ficha de uma fatia padrão sem épico (`sa-consolidar`, as-built) | `.kiro/specs/<ft>-<slug>/elm/` |

```
elm/
  GL-tentativa-de-login.md
  REG-01-bloqueio-apos-3-tentativas.md
  HF-01-bloquear-conta.md
  CT-01-bloquear-apos-terceira-falha.md
```

- **Nunca dentro do bundle da `sa-sync`** (`rm.download` do `pa`): lá só a `sa-sync` grava, e um sincronismo regravaria
  ou apagaria o rascunho.
- O **Concept ID** do OKF (o caminho do arquivo dentro de `elm/`, sem `.md`) é a chave estável do artefato. Ele não
  muda depois de criado; o id do ELM fica em `resource`/`id`.
- Nome do arquivo: a coluna Arquivo do [catálogo](../../sabia/references/tipos.md) (`HF-nn-<slug>.md`,
  `GL-<termo-kebab>.md`…) — o rótulo local (`HF-01`) é o mesmo que o PRD e o backlog (`cobre`) usam.

## Frontmatter — só campos do OKF v0.2

```yaml
---
type: Regra                                   # REQUIRED (§4.1): o tipo do artefato no DOORS Next
title: REG - Bloqueio após 3 tentativas       # título no ELM
description: Após 3 tentativas inválidas em 15 minutos, a conta fica Bloqueada por 30 minutos.
tags: ["03-Regras"]                           # pasta de destino no RM — o mesmo uso que o bundle faz
status: draft                                 # §5.4: draft → stable (aprovado) → deprecated (obsoleto)
sources:                                      # §5.1: de onde o conteúdo veio
  - id: prd
    resource: ../prd.md
    title: PRD EP-03 — Bloqueio por tentativas de login
  - id: d-02
    resource: ../decisoes.md
    title: Decisão D-02
generated: { by: sabia/2.0.0, at: 2026-10-14T13:00:00Z }   # §5.2: quem escreveu e quando mudou por último
---
```

| Campo (OKF v0.2) | Uso no Sabiá |
|---|---|
| `type` (obrigatório) | nome do tipo no DOORS Next — o `tipo` da sigla em `rm.artefatos` do `pa_<nome>.json` (ex.: `História de Usuário`, `Regra`, `Termos de Glossário`); o CT planejado, o do ETM (padrão `sa-prd/ct.md`) |
| `title` | título no ELM: `HF - <nome>`, `REG - <nome>`, o termo |
| `description` | uma frase |
| `tags` | `[<pasta do RM>]` — a `pasta` da sigla em `rm.artefatos`; o CT planejado não tem |
| `resource` | **ausente até publicar**; depois, a URI do artefato no ELM. Decide criar × atualizar |
| `sources` | o PRD, as decisões e, numa alteração, o próprio artefato do ELM (`resource` = URI, `last_modified` = última modificação no ELM vista por nós) |
| `generated` | `by: sabia/<versão do power>` (ator `<producer>/<version>`, §7); `at` = última mudança de conteúdo |
| `verified` | **aprovação no GATE**: `{ by: human:<login de quem aprovou — o P.O. ou quem ele delegou>, at: <instante> }` (§5.2), um registro por aprovação. Sem `verified` humano o conceito é *unverified* (§5.3) e **não é publicado** |
| `status` | `draft` enquanto não aprovado (obrigatório escrever: no OKF, ausência = `stable`), `stable` depois do GATE, `deprecated` quando deixa de valer |

**Uma extensão só** (OKF §4.1 permite chaves do produtor): `id` — o id numérico do DOORS Next, gravado na
publicação. É a mesma chave que o MCP `elm` grava no bundle e que o `elm_publicar_req` usa para atualizar. Copiado do bundle,
o arquivo mantém também as extensões que vierem dele (`created`, `links`): o OKF manda preservar chaves
desconhecidas. Nenhuma outra chave é inventada.

Mudou o conteúdo depois da aprovação → `generated.at` novo e `status: draft`. Só volta a publicar com um
`verified` humano **posterior** ao `generated.at` (a lista `verified` acumula as aprovações).

## Corpo e relações

O corpo é Markdown estrutural (§4.2). A relação entre conceitos é um **link Markdown** e o tipo da relação vem da
prosa (§6.1):

```markdown
**Como** usuário, **quero** ser avisado do bloqueio, **para** saber quando tentar de novo.

## Cenários
1.1 Bloquear após a terceira falha
**Dado que** …
**Conforme** a regra [REG-01 Bloqueio após 3 tentativas](REG-01-bloqueio-apos-3-tentativas.md)

## Regras
- [REG-01 Bloqueio após 3 tentativas](REG-01-bloqueio-apos-3-tentativas.md)

## Relações
- Satisfaz a necessidade [DV 1800 — Segurança de acesso](https://elm.exemplo/rm/resources/TX_…).
```

| Relação | No rascunho |
|---|---|
| HF → REG | link relativo para o arquivo da REG |
| HF/REG → termo | link relativo para o `GL-*.md` |
| HF ↔ EL (Telas = `sim`) | link relativo nos dois corpos: a HF na linha `**Telas:**`, a EL em `## Histórias`; na publicação, a 2ª passada grava os ids nos dois |
| restringe, satisfaz, elabora (requisito ↔ requisito) | prosa + link na seção `## Relações` |
| ET as-built → ET inicial do épico | link relativo no **Elabora** do corpo (padrão `sa-prd/et.md`): é publicado |

A seção `## Relações` e os atributos (`verified`, `status`) ficam só no repositório. O resto do corpo é o texto
publicado — como cada link vira no ELM: [elm-publicar.md](../../sa-consolidar/references/elm-publicar.md#requisitos-conceitos-okf-de-elm--doors-next), item 2.

### Corpo por tipo

O corpo é o do padrão do tipo, na coluna Padrão do [catálogo](../../sabia/references/tipos.md).

## Ciclo de vida

| Momento | O que acontece |
|---|---|
| Rascunho | `sa-prd` (ou a fatia) cria o conceito com `status: draft`, `sources`, `generated` |
| GATE do PRD | a pessoa aprova → cada conceito recebe `verified` humano e `status: stable` (a ATA já os recebe na aprovação dela, no passo `sa-especificar.reuniao.aprovar`) |
| Publicação | [elm-publicar.md](../../sa-consolidar/references/elm-publicar.md#requisitos-conceitos-okf-de-elm--doors-next) (grava `resource`, `id` e a entrada do ELM em `sources`) |
| Depois | a `sa-sync` baixa a versão oficial para o bundle, que passa a ser a versão viva; o rascunho fica como registro histórico, com `resource` preenchido |
| Alteração de artefato existente | traga o arquivo do bundle pelo `elm_ler_req_local` (sem bundle: `elm_ler_req`) e grave-o em `elm/`, mantendo `resource`, `id` e o `sources` do ELM; `status: draft`, `generated` novo; edite. O `last_modified` desse `sources` detecta conflito na publicação |
| Obsoleto | `status: deprecated`; no ELM, roteiro manual na UI |

## Conformidade (conferida pela rubrica P, item P11)

1. Todo `.md` de `elm/` tem frontmatter YAML que faz parse, com `type` não vazio.
2. Só chaves do OKF v0.2, mais `id` (e as que vieram do bundle numa cópia).
3. `status` presente; `draft` antes do GATE, fora a ATA aprovada (`stable` desde a aprovação dela).
4. `type` e `tags` existem em `rm.artefatos` do `pa_<nome>.json` — fora o tipo com ELM `ETM` (o CT planejado): `type` =
   a coluna Tipo da linha `CT.csv` da seção ELM do `sabia.md`, sem `tags`.
5. Toda HF tem cenários; todo conceito liga os que cita dos tipos da sua coluna Embute (a HF, as suas REGs); HF e
   EL ligadas nos dois sentidos; todo link relativo aponta para um arquivo que existe.
