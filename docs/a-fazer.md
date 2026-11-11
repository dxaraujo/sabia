# A fazer

## Implementar

- **Conclusão inferida do merge sem o GitLab.** O `sabia status` só marca o item em andamento como mesclado ("falta
  registrar a conclusão") com `GITLAB_API_URL` e `GITLAB_API_TOKEN`. Falta um sinal local, pelo git (a branch `<id>`
  contida na branch base, ou o `status.md` do item na branch base), para o aviso e o "Concluir" do Quadro Kanban
  valerem sem o GitLab.

## Verificar

- **Quadro Kanban:** o arrasto do card com o mouse (só eventos simulados e o menu do card foram exercitados) e o Safari
  (o Chrome e o Firefox foram conferidos).
- **MR mesclado:** a detecção contra um GitLab de verdade (só respostas simuladas).
- **CI:** um projeto com um MCP de CI declarado no `.sabia/sabia.md`, lendo o pipeline e o baseline.
- **Fluxos novos num agente:** `sa-status.situacao` (impedir, liberar, cancelar, devolver) e as datas de início e fim
  das tarefas na sprint; até aqui só a estrutura foi validada (compilam e as referências existem).
- **Site:** as páginas alteradas nas versões 2.1.28 a 2.1.32, fora a do Quadro Kanban, e o mapa de linhas do início
  depois das trocas de texto.
