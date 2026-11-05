---
{"resumo": "Formato do CT.csv da fatia: a evidência da execução de cada cenário verificado, ligada ao CT planejado do PRD (ou um CT novo), para ligar, criar ou importar no ETM."}
---
# `CT.csv` — evidências dos casos de teste da fatia

Uma linha por cenário **aprovado** na verificação (aceito com evidência) da fatia — só os aprovados: cenário
rejeitado ou com possível alteração (`🔁`) não entra: a execução do CT planejado que o prova (padrão
`sa-prd/ct.md`, aprovado na `[ESP]`) ou, sem ele, um CT novo. Na consolidação, o CT planejado (publicado no ETM na
conclusão da `[ESP]`) é ligado ao IB, e `elm_criar_ct` cria cada CT novo, com o Resumo como título e a Descrição como cenário, já
ligado ([elm-publicar.md](~/.sabia/framework/skills/sa-consolidar/references/elm-publicar.md)). Sem permissão de criar no ETM ou sem
o MCP `elm`, o arquivo é importado à mão (Importar → CSV) e os links são feitos depois (`elm_ligar`).

## Arquivo

- `.kiro/specs/<ft>-<slug>/CT.csv` · UTF-8 **com BOM** · quebras de linha **LF** · separador `;`.
- Linha 1 = o cabeçalho: os nomes das colunas da linha `CT.csv` do `sabia.md`, na ordem dela; da linha 2 em diante,
  uma por cenário.
- Grave o arquivo já assim: o conteúdo começa pelo caractere BOM (U+FEFF) e usa só `\n` nas quebras de linha —
  inclusive dentro da Descrição. Não dependa de `sed` depois (no Windows ele nem existe).

## Colunas (nesta ordem)

Valores do ELM vêm do `.kiro/config/elm/pa_<nome>.json` e do `sabia.md`; sem ELM, deixe vazio só o Planejado para.
Toda linha de cenário tem Tipo, Resumo, Responsável, Status e Descrição preenchidos. A ordem, os nomes e os valores fixos (Tipo,
Status) vêm da linha `CT.csv` da seção ELM do `sabia.md`.

| # | Coluna | Valor |
|---|---|---|
| 1 | Tipo | tipo de artefato de teste da importação (padrão: Caso de Teste) |
| 2 | Resumo | `<FT-nnn> <título curto> : CT<nn> - <título do cenário>` (o `CT<nn>` do CT planejado; CT novo, `CT<FT-nnn>-<nn>`, com a fatia e a sequência dela, para não colidir com outra fatia do épico) |
| 3 | Responsável | login do ELM de quem verificou (AFK, verificado por subagente: quem disparou o loop, ou o Dev da fatia — o responsável da `[DEV]`) |
| 4 | Status | o estado do caso de teste, **sempre preenchido** (tabela abaixo) |
| 5 | Planejado para | a iteração no EWM da sprint da fatia, se houver: o `**Iteração no EWM:**` do `sprint-<nn>.md` (o nome no EWM é livre e pode diferir da chave da sprint) |
| 6 | Descrição | bloco abaixo, entre aspas duplas, com quebras de linha reais |

### Status

É o estado do caso de teste, não o resultado da execução (o resultado está na Descrição e no `verificacao.md`).

| O `pa` | Valor | Significa |
|---|---|---|
| sem `qm` (sem o Quality Manager — o caso comum) | `Aprovado` | o cenário passou e a `[VER]` da fatia foi concluída com ele aceito |
| com `qm` (a linha Casos de teste `ETM` ou `CSV`) | o estado de aprovado do caso de teste no QM do projeto, como está no `Status=` da linha `CT.csv` do `sabia.md` (a setup o pergunta no bloco 9 do `elm-pa.md`) | o mesmo, no nome que o template de importação do ETM do projeto aceita |

Sem o `Status=` na linha do `sabia.md` → `Aprovado`. Nunca deixe o Status vazio nem invente outro valor.

## Descrição

```
"OBJETIVO:
<o que o caso comprova> (HF-01 · cenário 1.2; REG-01)

CT PLANEJADO:
- <CT-nn-<slug>.md (ETM <id> | só no repositório) | novo: bugfix <2.x | 3.x> | novo: descoberto na verificação>  (informativo: a consolidação lê o id do conceito)

PRÉ-CONDIÇÕES:
- <massa: script/fixture e o estado criado>

PASSOS:
1. <executar: requisição, job, tela> com <entradas>
2. <verificar em: consulta, resposta, log, tela>

RESULTADO ESPERADO:
- <o 'Então' do cenário, com valores>

EVIDÊNCIA DA VERIFICAÇÃO (FT-<nnn>, <AAAA-MM-DD>):
- <resumo do obtido>"
```

Aspas duplas dentro do texto são dobradas (`""`), como manda o CSV.
