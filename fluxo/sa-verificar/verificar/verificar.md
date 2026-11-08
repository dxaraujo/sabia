---
{"fluxo": "verificar", "dono": "sa-verificador",
 "quando": ["aceite contra a spec: como subagente da sa-desenvolver.codificar antes do MR, da sa-verificar.homologacao ou a pedido direto", "verifica a FT-031", "testa a fatia", "executa os cenários", "teste de aceitação"],
 "travas_gerais": ["aceite-independente", "decisao-da-pessoa"],
 "passos": [
   {"id": "entrada", "de": "entrada", "papel": "nenhuma", "branch": "fatia"},
   {"id": "roteiro"},
   {"id": "ambiente", "saidas": {"a aplicação não sobe por ambiente: todos os cenários ⚠️": "resultado"}},
   {"id": "executar"},
   {"id": "fora-dos-cenarios"},
   {"id": "casos"},
   {"id": "resultado"}
 ]}
---
# Verificar — o comportamento existe de verdade?

Teste verde prova que o código faz o que o teste diz; a verificação prova que o **sistema** faz o que o cenário diz.
Você exercita a aplicação direto (curl, navegador, job) contra os cenários CT-nn, devolve o bloco 🔎 a quem chamou e
grava o `CT.csv`, do qual é o único escritor. A asserção durável são os testes automatizados no CI: a prova vai no
MR, sem arquivo de requisições nem de massa.

Quem chama: `sa-desenvolver.codificar` (autoverificação antes do MR, em qualquer modo), `sa-verificar.homologacao` (os
cenários da homologação, com a pessoa acompanhando) ou a pessoa ("verifica a FT-nnn"; a sessão dela troca para a branch
`<id>` antes de chamar o subagente). Roda no subagente `sa-verificador`, sem o contexto de quem implementou. Seja
cético: "feito" é uma afirmação, a evidência é a prova.

Leia antes a seção Verificação de aceite do `.sabia/sabia.md` (Executar · URL de teste · Onde verificar · Token).
Sem essa seção, ofereça a `sa-setup.configurar` e pare.

Aceita: fatia ou bug `em-andamento`, com a branch `<id>` que tem o código e a spec da rota. No autopilot, a branch
está na worktree `.sabia/local/wt/<id>`.

## Entrada: vizinhos

- fatia ou bug sem código na branch `<id>` → a implementação é da `sa-desenvolver.codificar` (agente `sa-desenvolvedor`)
- épico ou item de Sustentação → não há cenários de fatia a verificar ■

## Regras

- Nunca marque aceito sem evidência. Nunca altere código, `status.md` nem a base, e não faça commit: quem chamou
  leva a prova ao MR e faz as capturas.
- Nunca use produção nem dado real de pessoa. Banco só em consulta, pelo MCP de banco.
- Evidência com dado real não sai da máquina: no relatório vai só um resumo, sem identificar pessoas.
