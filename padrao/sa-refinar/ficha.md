---
{"resumo": "Ficha da fatia e do bug: Aprovado no topo, cabeçalho, Entrada do tipo, regras, cenários CT-nn, artefatos afetados, Em aberto, Decisões e DoR."}
---
# Ficha — `.sabia/planejamento/fatias/FT-<nnn>-<slug>.md`

Toda fatia e todo bug têm ficha. Nasce curta na captura (só a Entrada), cresce no detalhar e é editável até alguém
puxar (status `em-andamento`). Fica direto na base. Seção sem conteúdo fica só com o título.

## Formato

```markdown
# FT-031 · Limitar o desconto de pontualidade

**Aprovado:** ana.souza · 2026-10-15
**Tipo:** fatia · **Pai:** EP-03 · **Especificação:** IA supervisionada

## Entrada
**Pedido:** o desconto de pontualidade não pode passar de 10% da parcela · **Quem pediu:** área financeira ·
**Requisito citado:** REG-2101

## Objetivo
Garantir o teto do desconto antes da campanha de renegociação.

## Regras
- R1 · O desconto de pontualidade nunca passa de 10% do valor da parcela · fonte: D-01
- R2 · O teto vale por parcela, não por contrato · fonte: D-02

## Cenários
**CT-01 · Desconto acima do teto é limitado**
Dado uma parcela de R$ 1.000,00 com desconto de pontualidade calculado em R$ 150,00
Quando o pagamento é feito até o vencimento
Então o desconto aplicado é de R$ 100,00

**CT-02 · Desconto abaixo do teto não muda**
Dado uma parcela de R$ 1.000,00 com desconto de pontualidade calculado em R$ 50,00
Quando o pagamento é feito até o vencimento
Então o desconto aplicado é de R$ 50,00

## Não muda
- O cálculo dos juros de atraso.

## Artefatos afetados
- REG-2101 · altera · versão de referência 2026-10-12T14:03
- GL-FT031-01 · inclui · versão de referência —

## Em aberto
| Pergunta | Para quem | Bloqueia |
|---|---|---|
| O teto vale para contratos renegociados? | ana.souza | CT-02 |

## Decisões
| D-nn | Decisão | Por quê | Quem | Quando | Fonte |
|---|---|---|---|---|---|
| D-01 | Teto de 10% do valor da parcela | acima disso o desconto exige renegociação do contrato | ana.souza (P.O.) | 2026-10-15 | conversa |
| D-02 | O teto vale por parcela | — | ana.souza (P.O.) | 2026-10-15 | ATA-03 |

## DoR
- [x] entrada mínima do tipo
- [x] cenários CT-nn com Então verificável
- [x] Artefatos afetados preenchidos ou 'nenhum requisito'
- [ ] com ELM, arquivos de elm/ aprovados pelo especificador
- [x] nenhum artefato afetado bloqueado por outra fatia
- [x] nenhum Em aberto que bloqueie a fatia inteira
- [x] tamanho ≤ G
- [x] ficha aprovada pelo P.O. (bug sem artefatos afetados dispensa)
```

## Campos

| Campo | Valores | Quem preenche |
|---|---|---|
| título | `# FT-<nnn> · <título>`, o título da linha do `backlog.md` | a captura |
| Aprovado | `<usuario> · AAAA-MM-DD` de quem tem `produto` · `—`; logo abaixo do título. Qualquer mudança depois volta a `—` | `sa-refinar.detalhar` · `sa-refinar.fatiar` |
| Tipo | `fatia` · `bug` | a captura |
| Pai | `EP-nn` · `—` | `sa-refinar.fatiar` · `sa-triar.triar` |
| Especificação | `IA supervisionada` · `IA autopilot` · `manual`; a linha só existe com ELM e artefatos afetados com `inclui`, `altera` ou `exclui`. Fixa até o fim da especificação e independente do modo da codificação | `sa-refinar.detalhar` |
| Entrada | fatia: Pedido · Quem pediu · Requisito citado (opcional). bug: Passos · Atual · Esperado · Reproduzido (`sim` · `não` · `detalhe insuficiente`) | a captura · `sa-triar.triar` |
| Objetivo | para que serve a fatia do épico (opcional) | `sa-refinar.fatiar` |
| Regras | `R<n> · <texto> · fonte: <D-nn \| <sigla>-<id>>` | `sa-refinar.detalhar` |
| Cenários | `**CT-nn · <título>**` + Dado / Quando / Então, com o Então verificável e com valores. O `CT-nn` é sequencial na ficha; o teste e o `CT.csv` usam `FT-<nnn> CT-nn` | `sa-refinar.detalhar` |
| Não muda | lista do que não pode mudar (regressão) | `sa-refinar.detalhar` |
| Artefatos afetados | uma linha por requisito tocado: `<sigla>-<id> · inclui \| altera \| exclui · versão de referência <modificado_em do DOORS \| —>`, com `<sigla>` ∈ `HF` · `REG` · `EL` · `GL` e `<id>` = id do ELM ou provisório `<EP\|FT>nn-nn` (ex.: `REG-EP03-01`); versão `—` no requisito novo e sem ELM. Sem requisito: a linha `nenhum requisito` | `sa-refinar.detalhar` · `sa-refinar.fatiar` |
| Em aberto | tabela `Pergunta \| Para quem \| Bloqueia`, com Bloqueia ∈ `esta fatia` · `CT-nn` · `<sigla>-<id>` · `nada`; o artefato travado entra como `bloqueada por FT-mmm (<sigla>-<id>)` | `sa-refinar.detalhar` · `sa-entrevistar.entrevistar` |
| Decisões | tabela `D-nn \| Decisão \| Quem \| Quando \| Fonte`; `D-nn` sequencial no arquivo; Quem = `<nome> (<papel>)` ou `suposição`; Quando = AAAA-MM-DD; Fonte ∈ `conversa` · `ATA-nn` · `e-mail` · `protótipo v<N>` | `sa-refinar.detalhar` · `sa-entrevistar.entrevistar` · `sa-especificar.reuniao` |
| DoR | o checklist acima; avisa e não trava. Completa → a linha vai para `pronta`; a `pronta` que perde um item volta a `aceita` | `sa-refinar.detalhar` |

## Bug sem requisito tocado

Ficha curta, do Dev sozinho: Entrada (passos · atual · esperado · reproduzido), Cenários (o esperado como `CT-01`),
Não muda e artefatos afetados com `nenhum requisito`.
