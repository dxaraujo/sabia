---
{"fluxo": "promover", "dono": "sa-produto",
 "quando": ["2ª ocorrência da mesma causa e do mesmo tipo de erro, pedido da pessoa ou proposta aceita na retrospectiva: a regra vai para a seção Regras aprendidas do .sabia/sabia.md", "o agente sempre erra X"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "escrever"},
   {"id": "gravar"},
   {"id": "enxugar"}
 ]}
---
# Promover

Entrada: a promoção proposta no registro (`sa-aprender.registrar.promocao`: 2ª ocorrência da mesma causa e do
mesmo tipo de erro, ou a pessoa pede), ou a proposta aceita na retrospectiva.

Roda no **`sa-produto`** (ou na sessão padrão): grava **só** a seção Regras aprendidas do `.sabia/sabia.md`; o resto
do arquivo (Comandos, Git, ELM) é da setup e não muda.

## Regras

- Nunca promova sem "ok". Nunca apague lição (só acréscimo).
