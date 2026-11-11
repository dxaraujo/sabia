---
{"resumo": "Prepara a linha e o corpo do item com a triagem aplicada; o item novo nasce pelo cadastro comum, e tudo vai num commit por item na branch base."}
---
## Entrada

O destino do passo `decidir` e, no aceito, a classificação do passo `classificar`.

## Faça

**Status gravado:**

| Caso | Status |
|---|---|
| fatia ou bug aceito | `aceita` |
| épico aceito | `a-moldar` |
| sustentação aceita, ou qualquer item com `falta:` | `nova` |
| duplicado ou recusa | `cancelada` |
| agora não | `adiada até <AAAA-MM-DD>` (fatia ou bug) |

**Colunas:** id · título · tipo · status · prioridade · tamanho · responsável (vazio) · pai · relator (`usuario` do
`equipe.json` ou `externo: <área ou nome>`) · `ib` (só o número, quando veio do EWM) · `obs` · `entrou_em`
(do cadastro; a triagem não muda) · `concluida_em` (AAAA-MM-DD).

**Corpo:**
- fatia e bug: a ficha curta `.sabia/planejamento/fatias/FT-nnn-<slug>.md`, só com a seção Entrada do tipo, pelo template `sa-refinar/ficha.md`;
- sustentação: o registro `.sabia/planejamento/sustentacao/<ID>-<slug>.md`, pelo template `sa-atender/registro.md`;
- épico: só a linha (o pitch nasce na `sa-refinar.moldar`).

**Item novo** (pedido em texto ou EWM) **ou troca de série**: a linha nasce pelo passo `cadastro`, com a triagem já
aplicada na mesma gravação (status, tamanho, prioridade, pai e, na troca, a linha antiga `cancelada` com `virou <novo
id>`). **Item que já está no `backlog.md`**: só a linha dele muda.

Mensagem do commit: `backlog: triagem <id>`. Não toque no ELM nem no `sprint-<nn>.md`.

## Saída

Item novo ou troca de série → passo `cadastro`. Item que já está no `backlog.md` → passo `commit-na-branch-base`.

## Pare se

Nenhuma condição própria: as paradas da gravação são as do passo `commit-na-branch-base`.
