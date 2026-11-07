---
{"resumo": "Arquivo de artefato em elm/ da pasta da spec: título igual ao do DOORS, Aprovado, Tipo · Ação · Versão lida, Publicado (só no manual) e o corpo inteiro pelo padrão do tipo."}
---
```markdown
# <sigla>-<id> · <título do DOORS>
**Aprovado:** <usuario> · <AAAA-MM-DD> | —
**Tipo:** HF | REG | EL | GL · **Ação:** inclui | altera | exclui · **Versão lida:** <modificado_em ISO do DOORS> | —
**Publicado:** manual <AAAA-MM-DD>   <!-- só na especificação manual -->

<o corpo inteiro do artefato, pelo padrão do tipo; no exclui, o original>
```

- **Caminho:** `<pasta da spec>/elm/`, com a pasta da spec `.kiro/specs/ft-<nnn>-<slug>/` ou
  `openspec/changes/ft-<nnn>-<slug>/`. Só com ELM e só os artefatos do Cobre da ficha.
- **Nome:** existente, `<id do ELM>-<TIPO>-<slug>.md` (ex.: `2101-REG-limite-saque.md`); novo,
  `<EP|FT><nn>-<nn>-<TIPO>-<slug>.md` (ex.: `EP03-01-REG-limite-saque.md`), renomeado para `<id do ELM>-<TIPO>-<slug>.md`
  na publicação, com o título igual. `<slug>`: o título em kebab-case, sem acento, até 5 palavras; no GL, o termo.
- **Id no título:** `<sigla>-<id do ELM>` (ex.: `REG-2101`) ou o provisório `<sigla>-EP<nn>-<nn>` ·
  `<sigla>-FT<nnn>-<nn>` (ex.: `REG-EP03-01`); na fatia de épico, o mesmo id do `prd.md`.
- **Aprovado:** de quem tem `especificador`, logo abaixo do título. Arquivo editado depois de aprovado perde a linha.
- **Versão lida:** o `modificado_em` do DOORS no download, do commit de base; `—` no novo. A publicação compara e, se
  mudou, avisa e pula.
- **Publicado:** só na especificação manual, quando o texto já está no DOORS; a publicação não reenvia.
- **Commit de base:** o original e a versão lida, antes de qualquer edição; o git mostra a diferença contra ele.
- **Um artefato, uma fatia:** duas fatias não têm o mesmo artefato em `elm/` ao mesmo tempo; a segunda espera a
  primeira ficar cancelada ou com `Publicação: publicada`.
