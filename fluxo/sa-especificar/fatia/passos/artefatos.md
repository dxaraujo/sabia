---
{"resumo": "Monta a pasta de trabalho da fatia (local, anexos elm-* da [ESP] ou a base) e traz, por linha da seção Artefatos afetados, a cópia da versão aprovada mais nova (altera, exclui) ou os similares (inclui), com o impacto revisto."}
---
## Entrada

A ficha com a seção **Artefatos afetados** com linha `inclui`, `altera` ou `exclui` (passo `trabalho`). Fatia
`iniciada` (reaberta, Revisão ou a `[ESP] FT-<nnn> Especificação` que o encaixe criou na Volta): o Bloqueio do `status.md` da fatia (`aguardando especificação [ESP] FT-<nnn>: <artefato> (<tipo>, <ação>) — <motivo>`).

## Faça

1. **Pasta de trabalho** (fora do git): `.sabia/local/especificacao/FT-<nnn>-<slug>/elm/`, com o `<slug>` da ficha
   (`fatias/FT-<nnn>-<slug>.md`). Fonte, a primeira que existir: a pasta local (compare com a `[ESP]` como no passo
   `sa-especificar.especificar.pasta`) · os anexos `elm-*` da `[ESP]` (`elm_anexo(id, "listar")` e
   `elm_anexo(id, "baixar", caminho)`: cada `elm-<arquivo>.md` com caminho = `<pasta de trabalho>/elm/elm-<arquivo>.md`
   — o caminho termina no nome do anexo —, renomeado depois para `elm/<arquivo>.md`) · `.kiro/specs/ft-<nnn>-<slug>/elm/` da base (a
   especificação já aprovada, na fatia `iniciada`).
2. **Por linha** da seção com Especificado `—`, um arquivo pela coluna Arquivo do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md):
   - **`altera` · `exclui`** → a cópia da versão aprovada mais nova, mantendo `resource`, `id` e `sources`, da primeira
     que existir: a da fatia de `bloqueada-por` ainda não publicada (`.kiro/specs/ft-<mmm>-<slug>/elm/` na base, com
     o `<slug>` da ficha dela, mesmo `id`);
     o bundle (`elm_ler_req_local(id)`: o `markdown` devolvido é o arquivo inteiro); `elm_ler_req(id)` — dele, monte o
     frontmatter como o do bundle: `type` = `tipo`, `title` = `titulo`, `tags` = `[pasta]`, `id`, `resource` = `url`,
     `sources` com `{id: elm, resource: url, last_modified: modificado}`; corpo = o corpo devolvido; `status: draft`,
     `generated` novo. Conceito de épico ainda sem `resource` (o Artefato da linha é o rótulo do PRD, ex.: `REG-01`,
     sem id do ELM) → o arquivo de `<produto>/epicos/<EP>-<slug>/elm/`, mesmo nome.
   - **`inclui`** → ficha com `ao vivo: pendente` → [similares](~/.sabia/framework/skills/sa-prd/references/similares.md) antes de
     virar arquivo; acerto `igual` ou `sobrepõe` → a decisão da pessoa, no Motivo da linha.
3. **Impacto** — por `altera` e `exclui`, quem cita o artefato (`elm_ler_req_local(id).links.entrada`: a HF que
   embute a REG, o CT da HF, a EL…), revisto: muda → linha própria; não muda → no Motivo da linha de origem,
   `impacto: <id> <como cita>, sem mudança`.
4. **Fora da lista** (o impacto que muda, ou artefato que aparece no trabalho) → só com a autorização do P.O. ou do SM
   registrada na linha nova (`autorizado por <login> (<P.O. | SM>) em <AAAA-MM-DD>`, no Motivo), como na
   [Volta à especificação](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#volta-à-especificação); sem ela,
   fica para o desdobramento (passo `concluir`).
5. **Fatia `iniciada`** (reaberta, Revisão ou a do encaixe) → o artefato e o motivo do Bloqueio: a linha dele na seção e a cópia vinda da
   especificação aprovada. Fora da seção → peça a autorização do P.O. ou do SM (item 4, com "sim"); sem ela, a
   `[ESP]` fica aberta, sem concluir, a fatia segue `bloqueada` (o Bloqueio não muda) e o aviso é
   `aguardando autorização do P.O. ou do SM para <artefato> (sa-triar, agente sa-produto)` (Pare se).

## Saída

A pasta de trabalho com a cópia (ou a decisão de similares) de cada linha e o impacto revisto → passo `escrever`.

## Pare se

- `altera` ou `exclui` sem cópia (fora do bundle e sem o MCP `elm`) → diga qual falta e pare: sem a versão aprovada,
  não há alteração.
- `altera` ou `exclui` também na ficha da fatia de `bloqueada-por` com a `[ESP] FT` dela não concluída (Especificado
  `—`) → "aguardando a especificação de FT-<mmm>" e pare, com a `[ESP]` aberta.
- Fatia `iniciada`, com o artefato do Bloqueio fora da seção e sem a autorização (item 5) → pare, com a `[ESP]`
  aberta.
