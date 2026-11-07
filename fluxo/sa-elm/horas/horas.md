---
{"fluxo": "horas", "dono": "sa-desenvolvedor",
 "quando": ["o sim a \"deseja lançar horas?\" em qualquer skill", "lançar 8 h hoje na DEV 123", "lançar horas", "minhas horas da semana", "relatório de horas da sprint", "remover o lançamento errado"],
 "travas_gerais": ["sim-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "inicio", "chama": "sa-elm.regras", "saidas": {"ELM não configurado ou autopilot (sa-elm.regras)": "fim", "pedido completo": "direto", "relatório": "relatorio"}},
   {"id": "direto", "saidas": {"completo": "lancar"}},
   {"id": "perguntar"},
   {"id": "lancar", "saidas": {"lançado": "devolver"}},
   {"id": "relatorio"},
   {"id": "devolver"}
 ]}
---
# Horas — lançar só quando perguntado ou pedido

Lança horas só quando uma skill pergunta ou a pessoa pede, e nunca trava ninguém. Um pedido completo lança
direto. Os relatórios só aparecem a pedido.
