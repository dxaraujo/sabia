---
{"resumo": "Arquivo de artefato em elm/ da pasta da spec: frontmatter type · title · status · sources (verified na aprovação, publicado só no manual) e o corpo inteiro pelo padrão do tipo; o id vai no nome do arquivo."}
---
```markdown
---
type: <o tipo do DOORS para a sigla: História de Usuário | Regra | Leiaute | Mensagem | Caso de Uso | Termo>
title: <título do DOORS>
status: draft | stable
verified: {by: human:<usuario>, at: <AAAA-MM-DD>}   # só com status: stable
sources: [{id: D-<nn>}, {id: ATA-<nn> [mm:ss]}, {id: <sigla>-<id>}]
publicado: manual <AAAA-MM-DD>   # só na especificação manual
---
<o corpo inteiro do artefato, pelo padrão do tipo; no exclui, o original>
```

- **Caminho:** `<pasta da spec>/elm/`, com a pasta da spec `.kiro/specs/ft-<nnn>-<slug>/` ou
  `openspec/changes/ft-<nnn>-<slug>/`. Só com ELM e só os artefatos afetados da ficha.
- **Nome e id:** o id mora no nome do arquivo. Existente, `<id do ELM>-<TIPO>-<slug>.md` (ex.:
  `2101-REG-limite-saque.md`, id `REG-2101`); novo, `<EP|FT><nn>-<nn>-<TIPO>-<slug>.md` (ex.:
  `EP03-01-REG-limite-saque.md`, id provisório `REG-EP03-01`; na fatia de épico, o mesmo id do `prd.md`), renomeado
  para `<id do ELM>-<TIPO>-<slug>.md` na publicação. `<slug>`: o título em kebab-case, sem acento, até 5 palavras; no
  GL, o termo.
- **type:** o tipo do DOORS da sigla, na configuração do ELM do projeto (`rm.artefatos`).
- **title:** igual ao título do DOORS.
- **status:** `draft` na escrita; `stable` na aprovação, por quem tem `especificador`, com o `verified`. Editado
  depois de aprovado, volta a `draft` e perde o `verified`.
- **sources:** de onde veio: D-nn da tabela Decisões do documento do item, ATA com o minuto da fala, requisito pelo
  id. No altera e no exclui, o próprio requisito.
- **publicado:** só na especificação manual, quando o texto já está no DOORS; a publicação não reenvia.
- **Ação e versão de referência** moram nos artefatos afetados da ficha (`<sigla>-<id> · inclui | altera | exclui · versão de referência`). A versão de referência é o `modificado_em` do DOORS no download; `—` no novo. A publicação compara e, se mudou, avisa e pula.
- **Ao DOORS sobe só o corpo:** a publicação tira o frontmatter.
- **Corpo sem cabeçalho:** sem título `#` nem linhas de aprovação, tipo ou ação; começa no primeiro rótulo do padrão.
- **Sem título Markdown no corpo:** as partes são rótulos em negrito (`**Narrativa:**`, `**1. <contexto>**`), para o
  mesmo texto servir ao bloco do `prd.md`, ao delta (dentro do `### Requirement:`) e ao DOORS.
- **Commit de base:** o original, antes de qualquer edição; o git mostra a diferença contra ele.
- **Um artefato, uma fatia:** duas fatias não têm o mesmo artefato em `elm/` ao mesmo tempo; a segunda espera a
  primeira ficar cancelada ou com `Publicação: publicada`.
