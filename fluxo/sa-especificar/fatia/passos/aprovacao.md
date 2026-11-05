---
{"resumo": "GATE da [ESP] FT pelo especificador: aprovado → status stable (exclui segue deprecated) e verified humano, os conceitos e a coluna Especificado da ficha na base num commit; a publicação é do passo publicar."}
---
## Entrada

Os conceitos revistos (passo `revisao`).

## Faça

Mostre à pessoa:

```
📄 Especificação FT-<nnn> — <título>
Artefatos: <id | rótulo> (<tipo>, <inclui | altera | exclui>) · … · impacto revisto: <ids | —>
Revisão: <OK na rodada N | achados aceitos: …>
Aprovar? (o especificador)
```

- Ajuste pedido → volte à escrita.
- Aprovado → em cada conceito, `status: stable` (o `exclui` segue `deprecated`) e um `verified`
  `{ by: human:<login de quem especifica>, at: <agora> }`, acrescentado à lista. Pelo bloco
  [Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), **um** commit `FT-<nnn> aprovar especificação`:
  os conceitos em `.kiro/specs/ft-<nnn>-<slug>/elm/` (a pasta sem `status.md` não é fatia iniciada) e, na ficha, a
  coluna Especificado de cada linha com o link para o conceito aprovado e o `novo · <título>` trocado pelo rótulo
  local (padrão `sa-triar/ficha.md`, seção "Artefatos afetados — a seção").

## Saída

Aprovado e na base → passo `publicar`. Ajuste pedido → passo `escrever`.

## Pare se

- Sem o "sim" e sem ajuste → a especificação fica na pasta de trabalho; a sessão fecha (Regras do fluxo) e pare.
