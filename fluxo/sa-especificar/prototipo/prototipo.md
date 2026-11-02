---
{"fluxo": "prototipo", "dono": "sa-especificador",
 "quando": ["protótipo de tela de um épico com a linha Telas = sim do sabia.md, antes do PRD: registrar a versão que o cliente vê e a aprovação dele; chamado pelo encaminhar da especificação (versão nova ou aguardando o cliente) e pelo sa-prd.prd.escrever (sem protótipo aprovado), e volta (o pedido direto, \"tenho o protótipo\" ou \"o cliente aprovou o protótipo\", entra pelo sa-especificar.especificar)"],
 "travas_gerais": ["sim-da-pessoa", "decisao-da-pessoa"],
 "passos": [
   {"id": "registrar", "saidas": {"épico sem tela: D-nn e volta a quem chamou": "fim", "épico com tela sem arquivo em prototipo/, ou ajuste sem a versão nova": "→ sa-especificar.especificar.fechar-sessao"}},
   {"id": "aprovacao", "travas": ["aprovacao-do-cliente"], "saidas": {"ajuste pedido pelo cliente (versão nova)": "registrar", "aguardando o cliente ou a versão nova": "→ sa-especificar.especificar.fechar-sessao"}}
 ]}
---
# Protótipo — a versão que o cliente aprova antes do PRD

Num projeto com tela (linha **Telas** = `sim` na seção ELM do `.sabia/sabia.md`), o PRD só começa com um protótipo
aprovado pelo cliente: é dele que o lote do PRD tira os leiautes (EL, no passo `sa-prd.prd.escrever`). O protótipo é
**entrada**, não requisito: feito fora do Sabiá, entra como anexo da `[ESP]`, numa versão `v<N>`, e a aprovação do
cliente vira um `D-nn` no `decisoes.md`. O fluxo volta a quem chamou; enquanto o protótipo não chega, o cliente não
responde ou a versão do ajuste não vem, a sessão fecha. Épico sem tela num projeto com tela → um `D-nn` da pessoa, e
o lote do PRD não cria EL.

Entrada: o épico com a `[ESP]` aberta e a pasta de trabalho com `prototipo/`.

Leia antes: `.sabia/sabia.md` (ELM, Telas, papéis).

## Regras

- Só dado fictício no protótipo: nome, documento, conta ou valor de cliente real → não registra (o anexo sobe ao EWM).
- O que se aprova é um arquivo (PDF, imagens, HTML exportado), nunca um link que muda: link de ferramenta de
  protótipo → peça a exportação da versão.
- Aprovação é do cliente, com evidência: nunca a deduza de silêncio, de "parece bom" de quem especifica ou de versão
  anterior.
- Não invoque outra skill por conta própria: volte a quem chamou, ou diga a próxima e pare.
