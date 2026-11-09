---
{"resumo": "Edita o arquivo inteiro pela autonomia da ficha: IA supervisionada com o especificador, IA autopilot num subagente sem perguntas, ou manual direto no DOORS (diz e encerra)."}
---
## Entrada

Os arquivos de `elm/` com commit de base (ou novos), a ficha (Regras, Cenários, Decisões, Em aberto) e a linha
Especificação da ficha.

## Faça

Tipo com skill de toolkit no seu prompt (sem agente: a seção Tipos com skill de toolkit do `.sabia/sabia.md`) → o
arquivo desse tipo sai pela skill, com o fluxo e o padrão do tipo; na volta, confira o arquivo pelo padrão
`sa-elm/elm-arquivo.md`. Os outros tipos seguem o padrão do tipo (`requisitos/padrao-hf.md`, `requisitos/padrao-uc.md`, `requisitos/padrao-reg.md`,
`requisitos/padrao-msg.md`, `requisitos/padrao-el.md`, `requisitos/padrao-gl.md`).

- **IA supervisionada.** O especificador edita, com o Dev, o arquivo inteiro no estado depois da mudança. Regra sem
  fonte vai à `sa-entrevistar.entrevistar`, nunca ao texto.
- **IA autopilot.** O `sa-especificador` como subagente edita sem perguntas: o que não tem fonte vai ao Em aberto da
  ficha com a recomendação. O subagente não fala com o ELM e não grava na base: devolve os arquivos, e a sessão da
  pessoa grava.
- **Manual.** Não edite. Diga "altere no DOORS `<ids>`; avise com `alterei FT-nnn`" e encerre.
- **Exclui.** O texto fica como veio; a linha Ação diz exclui.

Cada sessão grava pela gravação comum na base (passo `gravar`, commit `FT-nnn elm: edita <ids>`) e volta aqui; a
edição pode levar várias sessões.

## Saída

IA supervisionada ou IA autopilot, edição gravada → passo `conferir`. Manual → o fluxo termina até o "alterei".

## Pare se

- Manual → a frase acima e pare.
- Subagente do IA autopilot → devolva os arquivos editados e o Em aberto à sessão e pare.
