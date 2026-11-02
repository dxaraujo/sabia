---
{"resumo": "Mostra o painel do épico e encaminha pela Fase do status.md (sa-prd, sa-fatiar ou o passo fechamentos); a transcrição sem ATA aprovada passa antes pela ata da reunião; um tipo pode sair pelo fluxo de um toolkit."}
---
## Entrada

A pasta de trabalho montada (passo `pasta`) e o `status.md` do épico.

## Faça

Encaminhar pela Fase do épico (a linha com transcrição vence a da Fase pura):

```
🧭 EP-<nn> — <título> · [ESP] <id | pendente> · fase <…>
Pasta de trabalho: .sabia/local/especificacao/<EP>-<slug>/
Próximo: <skill>
```

| Fase (`status.md` do épico: o da base se a linha do épico já tem `prd`; senão, o da pasta de trabalho) | Próxima skill |
|---|---|
| `rascunho`/`em-revisao` com transcrição em `reunioes/` sem ATA aprovada, ou ATA aprovada não registrada | **`sa-especificar.reuniao`** (chama e volta); depois, a linha da Fase |
| `aprovado` (`prd` na base)/`fatiado`, Especificação `iniciada`, com transcrição sem ATA aprovada, ou ATA aprovada não registrada | **`sa-especificar.reuniao`** (chama e volta): registra a ATA; a decisão que muda o PRD segue o passo `sa-especificar.reuniao.decisoes`. O `aprovado` na pasta de trabalho vai antes ao passo `fechamentos`; a ATA entra no encaminhar seguinte |
| `rascunho`, sem `prd.md` | **`sa-prd`** (`sa-prd.prd.entender`: explora o código e o ELM; `sa-prd.prd.entrevistar`: `sa-entrevistar`) |
| `rascunho`/`em-revisao` com `prd.md` | **`sa-prd`** no passo em que parou (escrita, revisão P ou GATE) |
| `aprovado` na pasta de trabalho (`prd` `—` no `backlog.md`) | **passo `fechamentos`** deste fluxo — levar para a base |
| `aprovado` na base | **`sa-fatiar`**; depois do GATE do backlog, volte aqui (passo `fechamentos`) |
| `fatiado`, Especificação ainda `iniciada` na sprint | **passo `fechamentos`** deste fluxo — concluir a `[ESP]` |

### Toolkit na especificação

Um toolkit pode trazer o fluxo que escreve um tipo desviável do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md)
(HF, REG…), no padrão dele ([passos.md](~/.sabia/framework/skills/sabia/references/passos.md#tipos-com-fluxo-de-toolkit)).

Quem decide é a configuração do agente: a linha **Tipos com fluxo de toolkit** do seu prompt, gerada do `agentes.json`
pela setup. É transparente para quem está no fluxo: nada é perguntado nem marcado no `status.md` do épico.

1. **Escrita (passo `sa-prd.prd.escrever`; a ATA, no passo `sa-especificar.reuniao.escrever`).** Cada tipo da linha sai pelo fluxo do toolkit, em linha (a skill dele está
   ligada a você), e volta ao passo; os demais tipos e o `prd.md` são do Sabiá. Sem a linha → tudo é do Sabiá. O
   passo `sa-prd.prd.similares` vem antes e é seu.
2. **Contrato, antes da revisão P.** `prd.md` com todas as H2 do template (o padrão `sa-prd/prd.md`), `elm/` com os conceitos OKF quando há
   ELM, um arquivo por artefato, com a sigla e o nome do catálogo. A revisão P e o GATE continuam os do Sabiá; os itens
   de rubrica do toolkit se somam à P (no prompt do `sa-revisor`; sem agente, na seção **Tipos com fluxo de toolkit**
   do `.sabia/sabia.md`).

## Saída

A ATA de cada transcrição pendente, quando há; depois, a próxima skill dita (e a sessão segue nela, até o passo
`fechar-sessao`), ou, em `aprovado` na pasta de trabalho ou `fatiado` com a Especificação `iniciada`, o passo
`fechamentos`. `fatiado` com a Especificação `concluida` não
chega aqui: é vizinho, no passo `entrada`.

## Pare se

Nenhum caso próprio deste passo.
