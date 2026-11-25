---
{"resumo": "Regras comuns aos fluxos da sa-planejamento: arquivos, regra de ouro, quem decide, previsão pela vazão e ELM fora do rito."}
---
# Regras comuns da `sa-planejamento`

Valem em todos os fluxos da skill.

- **Arquivos** em `.sabia/planejamento/`, cada um pelo seu template:
  - `equipe.json`, validado pelo [equipe.schema.json](~/.sabia/framework/schemas/equipe.schema.json): o template `sa-planejamento/equipe.md`;
  - `acordos.json`, validado pelo [acordos.schema.json](~/.sabia/framework/schemas/acordos.schema.json): o template `sa-planejamento/acordos.md`;
  - `roadmap.md` (opcional): o template `sa-planejamento/roadmap.md`;
  - `sprints/<AAAA>/sprint-<nn>.md`: o template `sa-planejamento/sprint.md`;
  - Regras aprendidas, no `.sabia/sabia.md`: o template `sa-planejamento/regras-aprendidas.md`.
- **Sprint aberta** = o `sprint-<nn>.md` de maior chave (`<AAAA>/Sprint <nn>`). A sprint não tem campo de situação:
  deixa de ser a aberta quando a próxima é gravada. O andamento de cada linha vem do status do `backlog.md`.
- **Regra de ouro**: cada fluxo mostra a proposta na tela e só grava com o "ok". Ajuste → a proposta de novo.
- **Quem decide**: qualquer pessoa conduz. A ordem do backlog, a seleção, a meta e o "ok" da sprint são de quem tem
  `produto` no `equipe.json`. Sem a booleana: mostre a proposta, diga quem aprova (os nomes do `equipe.json`) e não
  grave; no reabastecimento da sprint, vale a anuência nomeada de quem tem `produto`.
- **Gravação**: todo estado e todo arquivo de planejamento vão direto na branch base, num commit pequeno de cada fluxo. Nada daqui vai por MR.
- **Página da cerimônia**: `sabia retrospective` e `sabia review` abrem a página da sprint (`--rede` dá o link ao
  time). Cada pessoa entra com o nome; a cerimônia fica na página até o botão Publicar, que pede a mensagem do
  commit (já preenchida), grava a seção `## Retro` ou `## Review` do `sprint-<nn>.md` e faz o commit e o push na branch
  base. A seção guarda o ponto, quem levantou e quem votou (formato no template `sa-planejamento/sprint.md`); não há
  arquivo à parte, e fechar o comando sem publicar perde o que não foi publicado.
  Quem roda o comando é a pessoa, no terminal dela. O agente não levanta ponto em nome próprio: o que ele redige é
  proposta de quem conduz, em `.sabia/local/cerimonia/propostas.json` (fora do git), com o `autor` de cada uma, e só
  entra no `sprint-<nn>.md` quando quem conduz publica a página. Sem a página, o rito segue na conversa, no mesmo formato.
- **Previsão pela vazão**: itens de desenvolvimento concluídos por sprint, sem pontos. A meta é o compromisso; a
  seleção é previsão. Item previsto que não terminou não é falha: volta na virada do próximo planejamento.
- **Item maior que G** é épico: não entra como desenvolvimento; vai ao refinamento (`sa-refinar.moldar`).
- **ELM fora do rito**: com a seção ELM no `.sabia/sabia.md`, a iteração (`sa-elm.iteracao`) e o cancelamento da
  tarefa do item que sai da sprint (`sa-elm.finalizar`) são só oferecidos. A resposta nunca trava o fluxo. Sem ELM,
  nenhuma oferta aparece.
