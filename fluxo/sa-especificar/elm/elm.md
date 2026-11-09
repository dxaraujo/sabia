---
{"fluxo": "elm", "dono": "sa-especificador",
 "quando": ["só com ELM: o texto oficial que a fatia ou o bug muda, um arquivo inteiro por artefato afetado (HF, UC, REG, MSG, EL, GL) em elm/ da pasta da spec, com o original do DOORS num commit de base, a edição pela autonomia da ficha e a aprovação do especificador; chamado pela sa-refinar.detalhar ou direto", "editar o elm/ da FT-031", "alterei FT-031", "refazer a mescla da FT-031"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "especificador", "branch": "nao", "saidas": {"volta da especificação manual ('alterei FT-nnn')": "sincronizar", "fatia ou bug concluida com 'Publicação: pendente' (refazer a mescla do artefato que a publicação pulou)": "pasta"}},
   {"id": "tarefa", "chama": "sa-elm.item"},
   {"id": "pasta", "saidas": {"fatia ou bug concluida com 'Publicação: pendente'": "conferir"}},
   {"id": "trava", "travas": ["artefato-exclusivo"], "saidas": {"todo artefato afetado segurado por outra fatia": "devolver"}},
   {"id": "baixar", "chama": "sa-elm.baixar"},
   {"id": "base"},
   {"id": "editar", "saidas": {"autonomia manual: o especificador altera direto no DOORS": "fim", "IA supervisionada ou IA autopilot": "conferir"}},
   {"id": "sincronizar", "chama": "sa-elm.baixar", "saidas": {"sincronizado (o arquivo já é o DOORS)": "aprovar"}},
   {"id": "conferir", "chama": "sa-elm.baixar"},
   {"id": "aprovar", "travas": ["aprovacao-no-documento"], "saidas": {"ajuste pedido": "editar"}},
   {"id": "gravar", "de": "gravar-na-base"},
   {"id": "devolver", "chama": "sa-elm.finalizar"}
 ]}
---
# Elm — o texto oficial que a fatia muda

Só com ELM. Para cada artefato afetado da ficha (HF, UC, REG, MSG, EL, GL), o original do DOORS vem pela `sa-elm.baixar` para
`<pasta da spec>/elm/`, num commit de base (original + versão de referência), antes de qualquer edição. Depois, pela autonomia da
linha Especificação da ficha, o arquivo inteiro é editado (IA supervisionada ou IA autopilot) ou, no manual, o
especificador altera direto no DOORS e a skill sincroniza na volta ("alterei"). O especificador aprova cada arquivo,
e o git mostra a diferença contra o commit de base. O `elm/` é a fonte da publicação (`sa-elm.publicar`, depois do
merge) e o texto que a `sa-plano.plano` copia para o delta. Tudo vai direto na base, sem MR.

Leia antes: a ficha da fatia (`.sabia/planejamento/fatias/FT-nnn-<slug>.md`: Especificação, artefatos afetados, Decisões, Em
aberto), o `formato_spec` do `agentes.json` e o padrão `sa-elm/elm-arquivo.md`.

## Entrada: vizinhos

- fatia ou bug `nova` → `sa-triar.triar`
- épico → `sa-prd.prd`
- sustentação → "a Sustentação não tem `elm/`" ■
- sem a chave `elm` no `agentes.json` → "sem ELM, o texto vai só ao delta da spec" ■
- Artefatos afetados da ficha sem inclui, altera nem exclui → "nada a fazer: os artefatos afetados não tocam requisito" ■
- sem pessoa presente (subagente), fora do IA autopilot → "o `elm/` é com uma pessoa; no IA autopilot, o subagente só faz o passo `editar`" ■

## Regras

- Edite só os artefatos afetados. Outro que apareça entra nos artefatos afetados da ficha no mesmo commit.
- A autonomia da linha Especificação da ficha vale até o fim da especificação e não muda no meio.
- Arquivo editado depois de aprovado perde a linha Aprovado e volta ao passo `aprovar`.
