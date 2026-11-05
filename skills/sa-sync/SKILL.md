---
name: sa-sync
description: "Syncs the DOORS Next OKF bundle with ELM both ways, via the elm MCP: plan (what to download, what to upload, conflicts), download the official version, upload what changed in the repository, and, after downloading, index the local search (asks first). Uses the folder and project area from the project's pa_<nome>.json. Use when the user says \"sincroniza o ELM\", \"baixa os requisitos\", \"atualiza o bundle\", \"envia os requisitos alterados\", \"sync do DOORS\"."
license: MIT
metadata:
  author: "Daniel Xavier Araújo"
  version: "2.0.0-alpha.1"
---

# sa-sync — Bundle do DOORS Next nas duas vias

O bundle (pasta `rm.download` do `pa`) é a cópia local, em OKF, dos requisitos oficiais: a `sa-prd` e os similares
o leem pelas tools `elm_*_local` do MCP `elm`. Regras comuns: [../sabia/references/elm.md](../sabia/references/elm.md).

1. `elm_sync(projeto, pa, direcao "plano")` → mostre: a baixar (mudou no ELM), a enviar (mudou no bundle) e
   **conflitos** (`id`, `titulo`, `caminho`: mudou nos dois lados). `removidos` → liste; `inconsistentes` → diga que a
   listagem dessas pastas veio incompleta e nada foi removido.
2. Conflito → mostre o diff de cada um (`elm_ler_req(<id>)` × `elm_ler_req_local(<id>)`) e pergunte qual fica (ELM
   → baixar aquele id; repositório → enviar). Nunca sobrescreva o ELM sem "sim".
3. Com "sim": `elm_sync(direcao "baixar")` — sempre, mesmo sem nada a baixar: o `baixar` da fila (sem `ids`) sem
   erro grava a data da sincronização (`sincronizado_em`, no `sync.md` do bundle; volta no resultado); o conflito que
   fica com o ELM, com o id dele (`ids`) — e, se houver, `elm_sync(direcao "enviar")` sem `ids` para o `enviar` do
   plano (confere o ELM antes) e `elm_sync(direcao "enviar", ids = <conflitos decididos 'repositório'>)` para os
   conflitos (sem conferir). Envio é escrita no ELM: um "sim" para o lote, com a lista. `erros` (no baixar ou no
   enviar) → mostre e diga que a data da sincronização não mudou.
4. Commit `ELM - Sincronizar bundle` com o que baixou e o `sync.md` (a data da sincronização), mesmo sem nada
   baixado (bundle no `.gitignore` → não há commit). Os agentes `sa-*`
   não tocam no bundle pelo shell (`git add` com o caminho dele é negado): rode esta skill na sessão padrão da
   ferramenta (Kiro ou opencode, sem agente `sa-*`);
   num agente, entregue o comando do commit pronto e a pessoa o roda. Baixou algo → pergunte se indexa agora (a busca local só acha o
   que está indexado): "sim" → `elm_indexar_local`, que roda em segundo plano e responde na hora; mostre `restantes`
   e siga. "não" → diga que a próxima busca local indexa o que mudou.

Saída: `🔄 Sync ELM · baixados <n> · enviados <n> · conflitos <n resolvidos> · bundle de <data>` (`<data>` = os 10 primeiros caracteres do
`sincronizado_em`).
