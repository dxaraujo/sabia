---
{"resumo": "Ficha da fatia por trilha (padrão sem épico, padrão de épico, rápida), escrita pela sa-triar ou pela sa-fatiar."}
---
# Ficha da fatia — `<produto>/fatias/FT-<nnn>-<slug>.md`

**Toda fatia tem ficha**: o que fazer, os critérios de aceite e como verificar, num arquivo que a pesquisa, o
plano, a revisão, a verificação e a consolidação leem. Quem escreve: a **`sa-triar`** (fatia sem épico) ou a
**`sa-fatiar`** (fatia de épico). Artefato de produto: só na branch base. A coluna `ficha` do `backlog.md` é
sempre preenchida e a Definition of Ready confere o arquivo. O conteúdo muda com a trilha:

| Trilha | Seções | De onde vem o critério |
|---|---|---|
| padrão sem épico | Pedido · Regras · Artefatos afetados · Cenários de aceite · Decisões · Fora de escopo (formato abaixo) | os cenários `C<n>` da própria ficha |
| padrão de épico | Objetivo · Cobre (links para os cenários do PRD, sem copiar) · Artefatos afetados · Como verificar | o PRD (`cobre`) |
| rápida | Comportamento (atual com evidência · esperado com fonte · o que não muda) · Decisões (só com decisão nova) · Artefatos afetados · Como verificar | a ficha — é o que o `bugfix.md` detalha |

Item das categorias da Sustentação (`AT-nnn`, `IM-nnn`…) não é fatia: não tem ficha, tem o registro
`<produto>/sustentacao/<pasta>/<ID>-<slug>.md`. A fatia de Manutenção (sem épico) tem ficha, como toda fatia.

## Formato — padrão sem épico

```markdown
# FT-040 · Limitar o desconto de pontualidade a 10% da parcela

**Trilha:** padrão · **Origem:** IB 613 · **Pedido por:** área financeira · **Modo:** HITL · **Tamanho:** M
**Situação:** aprovada por ana.souza em 2026-10-15

## Pedido
<o que mudar e por quê, nas palavras de quem pediu>

## Regras
| Regra | Texto | Fonte / decisão | No ELM |
|---|---|---|---|
| R1 · Teto do desconto de pontualidade | O desconto de pontualidade nunca passa de 10% do valor da parcela. | D-01 (ana.souza) | altera 2101 |

## Artefatos afetados
| Artefato | Tipo | Ação | Motivo | Especificado |
|---|---|---|---|---|
| 2101 · REG - Desconto de pontualidade | REG | altera | R1: teto de 10% por parcela · impacto: HF 1890 embute, sem mudança | — |
| novo · Teto do desconto | GL | inclui | termo novo de R1 | — |
| 2207 · REG - Desconto progressivo | REG | exclui | substituída por R1 (D-01) | — |

Autorização: ana.souza (P.O.) em 2026-10-15 · Lista completa: confirmada por ana.souza em 2026-10-15 · bundle de 2026-10-12 · ao vivo: sim

## Cenários de aceite
**C1 · Desconto acima do teto é limitado**
Dado uma parcela de R$ 1.000,00 com desconto de pontualidade calculado em R$ 150,00
Quando o pagamento é feito até o vencimento
Então o desconto aplicado é de R$ 100,00

**C2 · Desconto abaixo do teto não muda**
Dado uma parcela de R$ 1.000,00 com desconto de pontualidade calculado em R$ 50,00
Quando o pagamento é feito até o vencimento
Então o desconto aplicado é de R$ 50,00

## Decisões
| D | Pergunta | Decisão | Fonte / quem decidiu | Data | Situação |
|---|---|---|---|---|---|
| D-01 | O teto vale por parcela ou por contrato? | Por parcela | ana.souza (P.O.) | 2026-10-15 | decidida |

## Fora de escopo
- Parcelas já pagas não são recalculadas.
```

## Formato — padrão de épico (escrita pela `sa-fatiar`)

```markdown
# FT-031 · Bloquear a conta após 3 tentativas inválidas

**Trilha:** padrão · **Épico:** EP-03 · **Modo:** AFK · **Tamanho:** M

## Objetivo
<o comportamento que a fatia entrega, em 1–2 frases>

## Cobre
- [HF-01 · 1.1](../epicos/EP-03-<slug>/elm/HF-01-<slug>.md) · [HF-01 · 1.2](…) · [REG-01](…)

## Artefatos afetados
| Artefato | Tipo | Ação | Motivo | Especificado |
|---|---|---|---|---|
| REG-01 · Limite de tentativas | REG | inclui | HF-01 · 1.1 | [REG-01](../epicos/EP-03-<slug>/elm/REG-01-<slug>.md) |

Aprovados no GATE do PRD v1.0 (carla.dias, 2026-10-08).

## Como verificar
<o ponto de observação: chamada, job, tela, consulta — o detalhe fica no contrato de pronto do `design.md`>
```

## Formato — rápida

```markdown
# FT-044 · Não gerar espaço duplo ao remover pontuação do nome

**Trilha:** rápida · **Origem:** DF 4567 · **Modo:** AFK · **Tamanho:** P

## Comportamento
- **Atual:** `"Maria - Joao"` sai `"Maria  Joao"` (evidência: <log, teste, passo a passo>)
- **Esperado:** um espaço entre as palavras — fonte: <DF, HF/REG do ELM, decisão D-nn, regra óbvia>
- **Não muda:** nome nulo ou em branco continua nulo; pontuação sem espaços em volta só é removida

## Artefatos afetados
Nenhum artefato afetado. Lista completa: confirmada por ana.souza em 2026-10-20 · bundle de 2026-10-18 · ao vivo: sim

## Como verificar
<chamada, teste ou execução que mostra o esperado>
```

## Artefatos afetados — a seção

Em **toda** ficha, sempre presente: o que a fatia inclui, altera ou exclui no ELM. Quem escreve: a `sa-triar` (passo
`sa-triar.triar.triagem`) ou a `sa-fatiar` (do PRD); a coluna Especificado, a `[ESP] FT` (`sa-especificar.fatia`).

- **Artefato:** `<id do ELM> · <título>`; novo: `novo · <título provisório>` (a `[ESP] FT` troca pelo rótulo local,
  `REG-01`); na ficha de épico, `<rótulo do PRD> · <título>` e, nas linhas `altera` e `exclui`, `<rótulo do PRD> (<id do
  ELM>) · <título>` (ex.: `REG-02 (2101) · Desconto de pontualidade`).
- **Tipo:** sigla do catálogo (`HF` `REG` `GL` `EL` `CT`). `ET` e `ATA` não entram: a ET as-built é do Dev, e a ATA,
  da reunião.
- **Ação:** `inclui` · `altera` · `exclui`, exatamente.
- **Motivo:** uma frase com a origem (`R<n>`, `C<n>`, `D-nn`) e o impacto revisto sem mudança (`impacto: <id> <como
  cita>, sem mudança`); o impacto que muda tem linha própria. Linha acrescentada depois do fecho (Volta à
  especificação, ou outro artefato na `[ESP] FT`): ao fim do Motivo, `· autorizado por <login> (<P.O. | SM>) em
  <AAAA-MM-DD>`.
- **Especificado:** `—` até a `[ESP] FT`; depois, o link relativo ao conceito aprovado
  (`.kiro/specs/ft-<nnn>-<slug>/elm/REG-01-<slug>.md`), que sobe ao ELM na conclusão da `[ESP] FT`. Na ficha de
  épico, o link para `../epicos/<EP>-<slug>/elm/…`, publicado na conclusão da `[ESP] EP`.
- **Fecho**, abaixo da tabela, uma linha:
  - sem épico: `Autorização: <login> (<P.O. | SM>) em <AAAA-MM-DD> · Lista completa: confirmada por <login> em
    <AAAA-MM-DD> · bundle de <AAAA-MM-DD | sem data> · ao vivo: <sim | pendente>` — quem tria autoriza a alteração e
    se compromete com a lista;
  - com ELM e nada afetado, no lugar da tabela: `Nenhum artefato afetado. Lista completa: confirmada por <login> em
    <AAAA-MM-DD> · bundle de <AAAA-MM-DD | sem data> · ao vivo: <sim | pendente>`;
  - projeto sem ELM, no lugar da tabela, só: `Projeto sem ELM.`;
  - lista não confirmada (o lote do EWM, que não entrevista): `Lista a confirmar na triagem.`, e a fatia `nova` com
    `falta: artefatos afetados`;
  - de épico: `Aprovados no GATE do PRD v<x.y> (<login do especificador>, <AAAA-MM-DD>).` — a Versão do rodapé do
    `prd.md`. Cada `exclui` do PRD vai na
    ficha da fatia que o substitui; se nenhuma o substitui, na primeira.
- Linha `inclui`, `altera` ou `exclui` com Especificado `—` → a fatia fica `nova` com `falta: especificação` até a
  `[ESP] FT` concluir: ela escreve e aprova os conceitos (na base, em `.kiro/specs/ft-<nnn>-<slug>/elm/`), preenche
  Especificado e, na conclusão, publica no ELM (passo `sa-especificar.fatia.publicar`).

## Regras de escrita

- **Origem** (sem épico): o item do EWM (`DF 4567`, `IB 613`) ou o chamado (`chamado 4521`); pedido em texto, sem os
  dois → `—`.
- **Situação** (padrão sem épico; na rápida, só com a seção Decisões): `rascunho` ou `aprovada por <login do P.O.>
  em <data>`. Regra nova ou alterada (na rápida, a decisão nova) só vale aprovada; sem isso, a fatia fica `nova` com
  `falta: aprovação do P.O.`.
- **Cenários** como na `sa-prd`: caminho feliz, o que **não** deve ser aceito, repetição, erro em um item — ou por
  que não se aplica; "Então" sempre verificável. Numerados `C1`, `C2`… — são o `cobre` da fatia: o plano, a
  rubrica L e a verificação leem daqui.
- **Regras:** uma por linha, com valores e a fonte (`D-nn` ou id do ELM). Antes de escrever uma regra nova ou
  alterada, [similares](~/.sabia/framework/skills/sa-prd/references/similares.md); "No ELM" = `reusa <id>` · `altera <id>` ·
  `inclui`. Toda regra `altera` ou `inclui` tem a sua linha em Artefatos afetados (esta é a lista que vale).
- **Rápida:** sem Regras nem Cenários — o que está no formato dela. Esperado cuja fonte é uma decisão nova → a
  seção `## Decisões` (depois de Comportamento, com a `D-nn` na fonte) e a linha `**Situação:**`. Sem `inclui` de `REG` ou `HF` (regra nova → trilha padrão).
- **Padrão de épico:** nada de regra ou cenário copiado do PRD — só os links; o PRD continua a fonte.
- **Decisões** no formato do `decisoes.md` da `sa-entrevistar`, aqui dentro (a ficha não tem pasta).
- **Créditos da `[ESP] FT`** (`sa-especificar.fatia`: a fatia `nova` em especificação na sprint, ou a que voltou à
  especificação): uma seção `## Créditos` no
  fim da ficha, com a tabela do `status.md` (`| Data | Papel | Login | Sessão Kiro | Power sabia | Créditos |`, Papel `ESP`), criada na
  primeira sessão; a `sa-desenvolver` não a leva para o `status.md` da fatia.
- **Pendências do ELM** da fatia não iniciada, `dividida` ou `cancelada` (sem `status.md` que valha): no rodapé da
  ficha, `ELM pendente [<chave>]: <o que falta>` — ex.: `[FT-040 cancelar]`, quando o `elm_transicao(<id>,
  "cancelar")` do IB ou das tarefas falhou (sem o MCP, `precondicao`, erro); resolvida, `ELM feito [<chave>]: …`
  abaixo dela ([pendências](~/.sabia/framework/skills/sabia/references/elm.md#pendências)).
- Termos do glossário em todo o texto; termo novo vai para o glossário (a triagem roda na base).
- Mais de ~3 cenários de comportamentos diferentes, ou mais de uma regra nova independente → não é uma fatia: a
  `sa-triar` refaz a triagem como épico.
