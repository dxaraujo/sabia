---
{"resumo": "Regras comuns aos fluxos da sa-planejamento: arquivos, regra de ouro, quem decide, previsão pela vazão e ELM fora do rito."}
---
# Regras comuns da `sa-planejamento`

Valem em todos os fluxos da skill.

- **Arquivos** em `.sabia/planejamento/`, cada um pelo seu template:
  - `equipe.json`, validado pelo [equipe.schema.json](~/.sabia/framework/skills/sa-planejamento/assets/equipe.schema.json): o template `sa-planejamento/equipe.md`;
  - `acordos.json`, validado pelo [acordos.schema.json](~/.sabia/framework/skills/sa-planejamento/assets/acordos.schema.json): o template `sa-planejamento/acordos.md`;
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
- **Previsão pela vazão**: itens de desenvolvimento concluídos por sprint, sem pontos. A meta é o compromisso; a
  seleção é previsão. Item previsto que não terminou não é falha: volta na virada do próximo planejamento.
- **Item maior que G** é épico: não entra como desenvolvimento; vai ao refinamento (`sa-refinar.moldar`).
- **ELM fora do rito**: com a seção ELM no `.sabia/sabia.md`, a iteração (`sa-elm.iteracao`) e o cancelamento da
  tarefa do item que sai da sprint (`sa-elm.finalizar`) são só oferecidos. A resposta nunca trava o fluxo. Sem ELM,
  nenhuma oferta aparece.
