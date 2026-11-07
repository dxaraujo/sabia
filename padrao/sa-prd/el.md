---
{"resumo": "Corpo do leiaute (EL): uma tela do protótipo aprovado, com campos, ações, mensagens e estados no texto visível, e as histórias que a usam."}
---
# Leiaute (EL)

Uma tela, como o cliente a aprovou no protótipo. Só com a linha Telas = `sim` na seção Especificação do
`.sabia/sabia.md`, e escrita da versão aprovada (o D-nn `Protótipo v<N> aprovado`). Sem protótipo aprovado, a EL fica
no Em aberto.

```markdown
**Tela:** <nome, como o usuário a vê> · **Objetivo:** <o que o ator faz nela> · **Atores:** <…> ·
**Protótipo:** prototipos/<id>-<slug>/v<N>/<arquivo> · aprovado em D-<nn>

## Campos

| Campo (rótulo) | Tipo | Obrigatório | Formato e exemplo fictício | Regra |
|---|---|---|---|---|
| <Data de vencimento> | data | sim | <dd/mm/aaaa · 15/03/2026> | REG-<id> |

## Ações

| Ação (rótulo) | Quando habilitada | Efeito | História |
|---|---|---|---|
| <Confirmar> | <obrigatórios preenchidos> | <grava e volta à lista> | HF-<id> |

## Mensagens

| Situação | Texto (igual ao visível) | Tipo |
|---|---|---|
| <data no passado> | <"A data de vencimento não pode ser anterior a hoje."> | erro \| aviso \| sucesso |

## Estados e navegação

- <vazio · carregando · sem permissão · erro de comunicação: o que a tela mostra>
- <de onde se chega e para onde vai: EL-<id>>

## Histórias

- HF-<id> <título>
```

- **Texto visível igual ao do protótipo** (rótulo, mensagem, ação). Divergência entre o protótipo e uma decisão → Em
  aberto.
- **Tipo do campo**, lista fechada: texto · número · data · moeda · lista · sim/não · arquivo.
- Campo, regra ou mensagem sem história, regra ou D-nn que a sustente → Em aberto.
- HF e EL nos dois sentidos: a HF cita a EL em Telas; a EL lista as HF em Histórias.
- Só dado fictício; nenhuma imagem no corpo.
