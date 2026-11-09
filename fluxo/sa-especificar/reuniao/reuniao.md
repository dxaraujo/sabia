---
{"fluxo": "reuniao", "dono": "sa-especificador",
 "quando": ["opcional: a transcrição de uma reunião (.vtt ou .md em .sabia/local/reunioes/) vira ATA aprovada em .sabia/planejamento/atas/, e as decisões vão à seção Decisões do documento do item; pedido direto de quem conduziu a reunião ou oferta da sa-prd.prd, da sa-prd.mudanca, da sa-refinar.moldar e da sa-refinar.detalhar", "tenho a transcrição da reunião do EP-03", "registrar a ata da reunião"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "nao", "saidas": {"ATA em rascunho para a mesma transcrição": "aprovar"}},
   {"id": "transcricao"},
   {"id": "escrever"},
   {"id": "aprovar", "saidas": {"ajuste pedido": "escrever", "sem o \"sim\" (o rascunho fica em .sabia/local/reunioes/)": "devolver"}},
   {"id": "decisoes"},
   {"id": "gravar", "de": "commit-na-branch-base"},
   {"id": "devolver", "saidas": {"outra transcrição sem ATA": "transcricao", "decisão muda um prd.md aprovado": "→ sa-prd.mudanca", "decisão muda o texto do elm/ de uma fatia": "→ sa-especificar.elm"}}
 ]}
---
# Reunião — a ATA da transcrição

Opcional. A transcrição de uma reunião vira uma ATA aprovada em `.sabia/planejamento/atas/`, e as decisões dela vão à
seção Decisões do documento do item: o `pitch.md` (antes da decisão de investir), o `prd.md` ou a ficha. A transcrição nunca sai da
máquina. Nada vai ao ELM aqui: a ATA sobe junto da publicação, se a `sa-elm.publicar` perguntar.

Entrada: o item (`EP-nn` ou `FT-nnn`) não terminal e a transcrição em
`.sabia/local/reunioes/<id>-<AAAA-MM-DD>.<vtt|md>`.

## Entrada: vizinhos

- sustentação → "a ATA é de épico, fatia ou bug" ■
- sem transcrição em `.sabia/local/reunioes/` → "ponha a transcrição em `.sabia/local/reunioes/<id>-<AAAA-MM-DD>.<vtt|md>`" ■

## Regras

- A transcrição e o `.transcricao.md` ficam em `.sabia/local/reunioes/`: nunca vão ao git nem ao ELM.
- Nunca invente fala, decisão ou participante: o que a transcrição não diz não entra na ATA.
- Aprovada, a ATA não muda.
