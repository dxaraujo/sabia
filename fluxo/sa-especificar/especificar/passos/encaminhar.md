---
{"resumo": "Mostra o painel do épico e encaminha pela Fase do status.md (sa-prd, sa-fatiar ou o passo fechamentos); a transcrição sem ATA aprovada passa antes pela ata da reunião e, com Telas = sim, a versão nova do protótipo ou a que aguarda o cliente passa antes pelo protótipo; um tipo pode sair pela skill de um toolkit."}
---
## Entrada

A pasta de trabalho montada (passo `pasta`) e o `status.md` do épico.

## Faça

Encaminhar pela Fase do épico (a linha com transcrição vence as outras; a do protótipo vence a da Fase pura):

```
🧭 EP-<nn> — <título> · [ESP] <id | pendente> · fase <…>
Pasta de trabalho: .sabia/local/especificacao/<EP>-<slug>/
Próximo: <skill>
```

| Fase (`status.md` do épico: o da base se a linha do épico já tem `prd`; senão, o da pasta de trabalho) | Próxima skill |
|---|---|
| `rascunho`/`em-revisao` com transcrição em `reunioes/` sem ATA aprovada, ou ATA aprovada não registrada | **`sa-especificar.reuniao`** (chama e volta); depois, a linha da Fase |
| `aprovado` (`prd` na base)/`fatiado`, Especificação `iniciada`, com transcrição sem ATA aprovada, ou ATA aprovada não registrada | **`sa-especificar.reuniao`** (chama e volta): registra a ATA; a decisão que muda o PRD segue o passo `sa-especificar.reuniao.decisoes`: `aprovado` → `sa-prd.mudanca`, nesta `[ESP]`; `fatiado` → a correção do que o PRD já diz, `sa-prd.mudanca`; escopo novo, `sa-triar`. O `aprovado` na pasta de trabalho vai antes ao passo `fechamentos`; a ATA entra no encaminhar seguinte |
| `rascunho`/`em-revisao`, linha Telas = `sim` (seção ELM do `.sabia/sabia.md`), com arquivo novo em `prototipo/` (sem o prefixo `prototipo-v<N>-`) ou com a última versão registrada (o maior `prototipo-v<N>-*`) sem o `D-nn` `Protótipo v<N> aprovado` dessa versão no `decisoes.md` | **`sa-especificar.prototipo`** (chama e volta); aprovado, a linha da Fase; aguardando o cliente ou a versão nova, o passo `fechar-sessao`. Sem arquivo em `prototipo/`, vale a linha da Fase: o protótipo entra no `sa-prd.prd.escrever` |
| `rascunho`, sem `prd.md` | **`sa-prd`** (`sa-prd.prd.entender`: explora o código e o ELM; `sa-prd.prd.entrevistar`: `sa-entrevistar`) |
| `rascunho`/`em-revisao` com `prd.md` | **`sa-prd`** no passo em que parou (escrita, revisão P ou GATE); com Telas = `sim` e o `D-nn` `Protótipo v<N> aprovado` de uma versão mais nova que a citada nas EL, no passo `sa-prd.prd.escrever` |
| `aprovado` na pasta de trabalho (`prd` `—` no `backlog.md`) | **passo `fechamentos`** deste fluxo — levar para a base |
| `aprovado` na base | **`sa-fatiar`**; depois do GATE do backlog, volte aqui (passo `fechamentos`) |
| `fatiado`, Especificação ainda `iniciada` na sprint | **passo `fechamentos`** deste fluxo — concluir a `[ESP]` |

### Toolkit na especificação

Um toolkit pode trazer a skill que escreve um tipo desviável do [catálogo](~/.sabia/framework/skills/sabia/references/tipos.md)
(HF, REG…), com o fluxo e o padrão do tipo ou só com as references dela ([passos.md](~/.sabia/framework/skills/sabia/references/passos.md#tipos-com-skill-de-toolkit)).

Quem decide é a configuração do agente: a linha **Tipos com skill de toolkit** do seu prompt, gerada do `agentes.json`
pela setup. É transparente para quem está no fluxo: nada é perguntado nem marcado no `status.md` do épico.

1. **Escrita (passo `sa-prd.prd.escrever`; a ATA, no passo `sa-especificar.reuniao.escrever`).** Cada tipo da linha sai pela skill do toolkit, que segue o
   fluxo e o padrão do tipo pelos caminhos da linha, se a linha os trouxer, senão as references dela (a skill está ligada a você), e volta ao passo; os demais tipos e o `prd.md` são do Sabiá. Sem a linha → tudo é do Sabiá. O
   passo `sa-prd.prd.similares` vem antes e é seu.
2. **Contrato, antes da revisão P.** `prd.md` com todas as H2 do template (o padrão `sa-prd/prd.md`), `elm/` com os conceitos OKF quando há
   ELM, um arquivo por artefato, com a sigla e o nome do catálogo. A revisão P e o GATE continuam os do Sabiá; os itens
   de rubrica do toolkit se somam à P (no prompt do `sa-revisor`; sem agente, na seção **Tipos com skill de toolkit**
   do `.sabia/sabia.md`).

## Saída

A ATA de cada transcrição pendente, quando há; com Telas = `sim` e versão nova ou aguardando, o protótipo aprovado (ou,
aguardando o cliente ou a versão nova, o passo `fechar-sessao`); depois, a próxima skill dita (e a sessão segue nela, até o passo
`fechar-sessao`), ou, em `aprovado` na pasta de trabalho ou `fatiado` com a Especificação `iniciada`, o passo
`fechamentos`. `fatiado` com a Especificação `concluida` não
chega aqui: é vizinho, no passo `entrada`.

## Pare se

Nenhum caso próprio deste passo.
