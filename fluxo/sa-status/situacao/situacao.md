---
{"fluxo": "situacao", "dono": "sa-desenvolvedor",
 "quando": ["mudar a situação de um item, por quem tem produto ou é o responsável da tarefa em curso: impedir (algo de fora impede o item; pode ter data), liberar o impedido, cancelar um item em andamento ou devolver ao backlog no meio da sprint", "a FT-031 está impedida: ambiente fora do ar", "adiar a FT-040 até 20/11", "liberar a FT-031", "cancelar a FT-034, que está em andamento", "devolver a FT-036 ao backlog"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa", "elm-pela-sa-elm"],
 "passos": [
   {"id": "identificar", "saidas": {"não registrado, terminal ou sem permissão": "fim", "cancelar um item que ainda não começou: é do fluxo dono do status": "fim", "impedir": "impedir", "liberar": "liberar", "cancelar em andamento": "cancelar", "devolver ao backlog": "devolver"}},
   {"id": "impedir", "saidas": {"impedimento pronto": "gravar"}},
   {"id": "liberar", "saidas": {"liberação pronta": "gravar"}},
   {"id": "cancelar", "saidas": {"cancelamento pronto": "gravar"}},
   {"id": "devolver", "saidas": {"devolução pronta": "gravar"}},
   {"id": "gravar"},
   {"id": "commit-na-branch-base", "de": "commit-na-branch-base"},
   {"id": "seguir", "chama": "sa-elm.finalizar"}
 ]}
---
# Situação — impedir, liberar, cancelar em andamento e devolver ao backlog

O `backlog.md` é o dono do status do item. Este fluxo faz as mudanças de situação que não são de nenhum outro: o
item impedido por algo de fora (outra equipe, ambiente, acesso, fornecedor, decisão externa, ou um "agora não" com
data), a liberação, o cancelamento de um item já em andamento e a devolução ao backlog no meio da sprint. Mostra a
prévia, grava com o "sim" e vai num commit direto na branch base.

Quem pode: quem tem `produto`, ou o responsável da tarefa em curso (o Responsável da linha de especificação ou de
desenvolvimento da sprint; no atendimento, o `responsável` do item). É a única exceção, com a `sa-status.fechar-sessao`,
ao "só leitura" da skill.

Levar um item do backlog para a sprint é o reabastecimento da `sa-planejamento.sprint`. Cancelar um item que ainda
não começou segue com o dono do status: `sa-triar.triar` (`nova`), `sa-refinar.ajustar` (`aceita`, `elegivel`, épico)
e `sa-refinar.moldar` (épico `a-moldar`).
