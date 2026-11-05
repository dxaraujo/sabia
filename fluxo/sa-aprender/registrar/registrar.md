---
{"fluxo": "registrar", "dono": "sa-produto",
 "quando": ["a cada correção: achado da revisão que chegou ao humano, cenário rejeitado na verificação, PR com mudança pedida, bloqueio por falta de informação; e as Lições candidatas da sa-consolidar", "isso está errado, aprenda", "registra a lição"],
 "travas_gerais": ["sim-da-pessoa"],
 "passos": [
   {"id": "fatos", "saidas": {"chamada pela sa-consolidar: fatos e causa já vêm na linha das Lições candidatas": "gravar"}},
   {"id": "causa"},
   {"id": "gravar"},
   {"id": "promocao", "saidas": {"promoção proposta": "→ sa-aprender.promover"}}
 ]}
---
# Registrar — a cada correção

Entrada — gatilhos: achado da revisão que chegou ao humano, cenário rejeitado na verificação, PR com mudança pedida,
pessoa dizendo "não é assim", bloqueio por falta de informação.

Chamada pela `sa-consolidar` com uma linha das **Lições candidatas** do `status.md` (gravada pelo Dev com a `pronta`,
no `status.md` da base):
os fatos e a causa já vêm de quem recebeu a correção — grave-os no `licoes.md` sem perguntar de novo (passo `gravar`).

Roda no `sa-produto` (também na consolidação) ou na sessão padrão.

## Regras

- Nunca promova sem "ok". Nunca apague lição (só acréscimo; a Situação muda no lugar).
