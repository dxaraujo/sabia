---
{"resumo": "Mostra o painel do épico e encaminha pela Fase do status.md (sa-prd, sa-fatiar ou o passo fechamentos); a escrita do PRD pode ir a um toolkit pelo desvio do prompt."}
---
## Entrada

A pasta de trabalho montada (passo `pasta`) e o `status.md` do épico.

## Faça

Encaminhar pela Fase do épico:

```
🧭 EP-<nn> — <título> · [ESP] <id | pendente> · fase <…>
Pasta de trabalho: .sabia/local/especificacao/<EP>-<slug>/
Próximo: <skill>
```

| Fase (`status.md` do épico: o da base se a linha do épico já tem `prd`; senão, o da pasta de trabalho) | Próxima skill |
|---|---|
| `rascunho`, sem `prd.md` | **`sa-prd`** (`sa-prd.prd.entender`: explora o código e o ELM; `sa-prd.prd.entrevistar`: `sa-entrevistar`) |
| `rascunho`/`em-revisao` com `prd.md` | **`sa-prd`** no passo em que parou (escrita, revisão P ou GATE) |
| `aprovado` na pasta de trabalho (`prd` `—` no `backlog.md`) | **passo `fechamentos`** deste fluxo — levar para a base |
| `aprovado` na base | **`sa-fatiar`**; depois do GATE do backlog, volte aqui (passo `fechamentos`) |
| `fatiado`, Especificação ainda `iniciada` na sprint | **passo `fechamentos`** deste fluxo — concluir a `[ESP]` |
| `fatiado`, Especificação `concluida` | nada a especificar; dividir, juntar ou cancelar fatias → `sa-fatiar.refinamento`; completar uma fatia `nova` → [Completar uma fatia `nova`](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#completar-uma-fatia-nova) (na sprint, a `[ESP] FT` dela; no backlog, o `sa-produto`) |

### Toolkit na especificação

Passo `especificador` de [passos.md](~/.sabia/framework/skills/sabia/references/passos.md): uma skill de toolkit pode assumir a escrita
do passo `sa-prd.prd.escrever` (os modelos de PRD e os extras de uma stack ou de um tipo de sistema).

Quem decide é a configuração do agente: os **desvios** do seu prompt, gerados do `agentes.json` pela
setup. É transparente para quem está no fluxo: nada é perguntado nem marcado no `status.md` do épico.

1. **Escrita (este passo, `sa-prd.prd.escrever`).** O épico casa com o `para` de um desvio seu → com subagente, delegue com o
   briefing de especificação de [passos.md](~/.sabia/framework/skills/sabia/references/passos.md#sem-agente-e-com-agente); sem
   subagente, carregue a skill do desvio e escreva por ela, no seu contexto. Não casa, ou não há desvio → a escrita
   é a do Sabiá. O passo `sa-prd.prd.similares` vem antes e é seu.
2. **Contrato, antes da revisão P.** `prd.md` com todas as H2 do template (o padrão `sa-prd/prd.md`), `elm/` com os conceitos OKF quando há
   ELM, extras só em `.md` na pasta de trabalho. Fora disso → como manda o `passos.md`. A revisão P e o GATE
   continuam os do Sabiá.

## Saída

A próxima skill dita (e a sessão segue nela, até o passo `fechar-sessao`), ou, em `aprovado` na pasta de trabalho
ou `fatiado` com a Especificação `iniciada`, o passo `fechamentos`.

## Pare se

`fatiado`, Especificação `concluida` → nada a especificar: diga a próxima (tabela) e pare.
