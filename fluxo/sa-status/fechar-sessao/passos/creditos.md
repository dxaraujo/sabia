---
{"resumo": "Só no Kiro: roda o creditos.py, que acrescenta ao .sabia/creditos/<usuario>.csv o consumo novo de cada sessão."}
---
## Entrada

O alvo da sessão. No opencode, pule.

## Faça

Pergunte `💳 Registrar os créditos desta sessão? (sim)` e rode o script **na resposta** (o Kiro só grava o consumo
do turno quando ele termina):

```
uv run --no-project python <caminho desta skill>/scripts/creditos.py --usuario <usuario> --item <id> \
  --skill <skill da sessão> --pasta <cada pasta do git worktree list>
```

O script lê o `~/.kiro` (só leitura) e acrescenta ao `.sabia/creditos/<usuario>.csv` (`sessao,ate,item,skill,modo,
creditos`) uma linha por sessão com consumo depois do maior `ate` já gravado dela; `modo` é o agente
(`sa-desenvolvedor` · `sa-especificador` · `sa-pesquisador` · `sa-revisor` · `sa-verificador` · `padrão`). Sessão sem
consumo novo não gera linha. Mostre as linhas que ele imprimiu. A skill da sessão: deduza ou pergunte; sem uma, `—`.
Nenhum outro arquivo guarda créditos; nunca estime.

## Saída

→ passo `commit`.

## Pare se

Script com erro → mostre o erro e siga sem os créditos.
