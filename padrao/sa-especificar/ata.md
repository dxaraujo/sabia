---
{"resumo": "Corpo da ata de reunião (ATA) da [ESP]: participantes por nome e papel, pauta, discussão, decisões D-nn, em aberto e encaminhamentos (o envelope OKF fica no okf-elm.md da sa-prd)."}
---
# Ata de reunião (ATA)

**Ata de reunião (ATA)** — o registro de uma reunião com o cliente durante a `[ESP]` aberta, escrito da transcrição.
Uma ata por reunião, em `elm/ATA-nn-<slug>.md` da pasta do épico (`nn` em sequência; `<slug>` = data e assunto).

```markdown
**Reunião:** <AAAA-MM-DD> · <duração> · <assunto> · [ESP] <id>

## Participantes
| Nome | Papel |
|---|---|
| Ana Souza | P.O. |
| Bruno Lima | cliente — área de atendimento |

## Pauta
1. <tema>

## Discussão
- <tema>: <o que foi dito, resumido> ([12:40])

## Decisões
- D-07 <a decisão, como uma pessoa com papel de decidir a disse> — Ana Souza (P.O.) ([18:05])

## Em aberto
- <pergunta> — para <nome (papel)>, na próxima reunião

## Encaminhamentos
| O quê | Quem | Até |
|---|---|---|
```

- **Participantes por nome e papel**, só quem falou ou foi dado como presente; nenhum outro dado pessoal (e-mail,
  telefone, matrícula).
- **Só o que a transcrição diz**, resumido; o `[mm:ss]` aponta a fala. Nada de transcrição literal longa: a
  transcrição não sobe.
- **Decisão** só quando quem tem o papel de decidir a disse; o resto é discussão ou `em aberto`. Cada decisão leva o
  `D-nn` que terá no `decisoes.md` (o próximo livre, reservado ali enquanto a ata é `draft`).
- Dado de cliente identificável dito na reunião (documento, conta, nome de quem não participou) → só o resumo
  anônimo.
- **Envelope:** `type` e `tags` pela sigla `ATA` em `rm.artefatos`; `title: ATA - <AAAA-MM-DD> <assunto>`; `sources`
  com o `decisoes.md` e a transcrição só pelo nome, sem `resource` (a `reunioes/` não sai desta máquina):
  `- id: transcricao` e `title: "reunioes/<arquivo.ext> · sha256 <do cabeçalho do .transcricao.md> (só local)"`. Nasce `status: draft`; o "sim" da aprovação grava `status: stable` e o
  `verified` humano, sem esperar o GATE do PRD. No `index.md`, a seção `# Atas`.
- Aprovada, a ata não muda: correção é conceito em `draft` de novo e outra aprovação
  ([Ciclo de vida](~/.sabia/framework/skills/sa-prd/references/okf-elm.md#ciclo-de-vida)).
