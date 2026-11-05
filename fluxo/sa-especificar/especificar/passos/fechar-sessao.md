---
{"resumo": "Toda sessão, antes de parar: créditos no status.md do épico, comentário e anexos na [ESP] e as horas da sessão, numa pergunta só."}
---
## Entrada

Toda sessão de especificação, antes de parar: a pasta de trabalho com a última versão de cada artefato.

## Faça

Fechar a sessão (toda sessão, antes de parar). Pergunta única, com prévia do que vai:

```
📝 Sessão de especificação — EP-<nn> · <data>
Comentário na [ESP] <id>: Sessão de especificação — EP-<nn> · <AAAA-MM-DDTHH:MMZ>
  <resumo do levantamento · decisões D-nn novas · dúvidas para a próxima reunião>
Anexos (última versão, substituem os anteriores): rascunho.md · decisoes.md · status.md · prd.md · elm-<arquivo>.md …
Horas desta sessão na [ESP]: <h> h em <data>   (pergunte à pessoa; nunca estime por ela)
Créditos desta sessão: <x.xx> (sessão <id>) · power sabia <versão>   (script da sa-status, item 4)
Registrar? (sim)
```

O comentário começa com a linha exata `Sessão de especificação — <EP-nn | FT-nnn> · <AAAA-MM-DDTHH:MMZ>` (a hora
em UTC): é por ela que o passo `pasta` acha o último comentário de sessão.

Antes de registrar, para cada `ELM pendente [ESP EP-<nn> sessão <AAAA-MM-DD>]` sem o `ELM feito` da mesma chave:
`elm_lancar_horas(id, <h>, <AAAA-MM-DD>)` (as horas e a data do texto da pendência) e acrescente
`ELM feito [<mesma chave>]: registrada (<data de hoje>)` no mesmo lugar.

Com "sim": primeiro a linha de créditos no `status.md` do épico ([`sa-status`](~/.sabia/framework/skills/sa-status/SKILL.md#fechar-a-sessão), item 4) — o da pasta de
trabalho até o PRD ir à base; depois, o da base, no commit do passo `fechamentos` ou, na sessão sem GATE, pelo bloco
[Gravar na base](~/.sabia/framework/skills/sa-fatiar/references/backlog.md#gravar-na-base), commit `EP-<nn> registrar sessão` —; então `elm_comentar` (o comentário), `elm_anexo(id, "enviar", caminho)` para cada `.md` da pasta de trabalho fora de `reunioes/`, de `prototipo/`, de `elm/` e de `.anexos/` (a transcrição não
sobe; o protótipo já subiu no registro da versão); para cada `elm/<arquivo>.md` (com as atas), copie-o para
`<pasta de trabalho>/.anexos/elm-<arquivo>.md` e envie esse caminho (`elm_anexo(id, "enviar", <caminho da cópia>)`:
o anexo leva o nome do arquivo enviado, e o prefixo `elm-` evita colidir com o nome de outro arquivo); e
`elm_lancar_horas(id, horas)` (lança; não conclui). Sem o MCP `elm` ou com falha →
`ELM pendente [ESP EP-<nn> sessão <AAAA-MM-DD>]: registrar sessão: comentário, anexos e <h>h em <AAAA-MM-DD>` — no
`rascunho.md` da pasta de trabalho até o PRD ir à base; depois, no rodapé do `prd.md` da base, no commit
`EP-<nn> registrar sessão` —, e o próximo fechamento lança as horas dela (acima).

## Saída

A sessão registrada na `[ESP]` (ou `ELM pendente`). Depois do GATE do PRD (Fase `aprovado`) → passo `fechamentos`;
senão, aqui a sessão termina.

## Pare se

Nenhum caso próprio deste passo: sem o MCP `elm`, `ELM pendente` e o fluxo segue.
