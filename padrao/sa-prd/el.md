---
{"resumo": "Corpo do leiaute (EL): uma tela do protótipo aprovado, com campos, ações, mensagens e estados no texto visível, e as histórias que a usam (o envelope OKF fica no okf-elm.md da sa-prd)."}
---
# Leiaute (EL)

**Leiaute (EL)** — uma tela, como o cliente a aprovou no protótipo, só com a linha **Telas** = `sim` na seção ELM do
`sabia.md`. Uma EL por tela que as histórias usam, no lote do PRD (`sa-prd.prd.escrever`), escrita da versão
aprovada do protótipo (o `D-nn` `Protótipo v<N> aprovado` da última versão registrada) e das decisões. Com o
`D-nn` `Épico sem tela`, nenhuma EL.

```markdown
**Tela:** <nome da tela, como o usuário a vê> · **Objetivo:** <o que o ator faz nela> · **Atores:** <…> ·
**Protótipo:** `prototipo-v<N>-<slug>.<ext>` (em `prototipo/` da pasta do épico e anexo da [ESP] <id>), aprovado em D-<nn>

## Campos
| Campo (rótulo) | Tipo | Obrigatório | Formato e exemplo fictício | Regra · origem |
|---|---|---|---|---|
| <Data de vencimento> | <data> | <sim> | <dd/mm/aaaa · 15/03/2026> | <[REG-02 <nome>](REG-02-<slug>.md) · D-nn> |

## Ações
| Ação (rótulo) | Quando habilitada | Efeito | História |
|---|---|---|---|
| <Confirmar> | <todos os obrigatórios preenchidos> | <grava e volta à lista> | <[HF-01 <nome>](HF-01-<slug>.md)> |

## Mensagens
| Situação | Texto (igual ao visível) | Tipo |
|---|---|---|
| <data no passado> | <"A data de vencimento não pode ser anterior a hoje."> | <erro · aviso · sucesso> |

## Estados e navegação
- <vazio · carregando · sem permissão · erro de comunicação: o que a tela mostra>
- <de onde se chega e para onde vai: [EL-02 <tela>](EL-02-<slug>.md)>

## Histórias
- [HF-01 <nome>](HF-01-<slug>.md)

## Relações
- <restringe / satisfaz, com link — só local>
```

- **Texto visível igual ao do protótipo** (rótulo, mensagem, ação): é o que a verificação compara, palavra por
  palavra. Divergência entre o protótipo e uma decisão → `em aberto`, nunca escolhida na escrita.
- **Nada inventado:** campo, regra ou mensagem que o protótipo mostra sem história, regra ou `D-nn` que o sustente
  → `em aberto` no `decisoes.md`.
- **Só dado fictício** nos exemplos; nenhuma imagem no corpo: o protótipo é citado pelo anexo.
- **HF ↔ EL nos dois sentidos:** a EL lista em `## Histórias` as HFs que usam a tela; a HF cita a EL na linha
  `**Telas:**`. A P9 vale: rótulo é texto do usuário, nome técnico de campo não entra.
- **Envelope:** `type` e `tags` pela sigla `EL` em `rm.artefatos`; `title: EL - <nome da tela>`; `sources` com o
  PRD, o `decisoes.md` (o `D-nn` da aprovação) e o protótipo só pelo nome do anexo. No `index.md`, a seção
  `# Leiautes`.
- Seção sem conteúdo → `não se aplica` (não apague a seção).
