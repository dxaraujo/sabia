# Sabiá 2.1 — especificação

Fonte da implementação da 2.1. As decisões estão em [decisoes.md](decisoes.md); os dados, em [especificacao.json](especificacao.json).

## Visão geral
```
Sabiá 2.1 · 7 disciplinas · 5 agentes (principais sa-desenvolvedor · sa-especificador; subagentes sa-pesquisador · sa-revisor · sa-verificador) · alvos Kiro e opencode
papéis = booleanas no equipe.json · identidade = usuário do GitLab
   qualquer pessoa ── captura · triagem · revisão humana
   desenvolvedor ──── puxa para desenvolvimento · revisa MR de outro autor
   especificador ──── aprova os arquivos de elm/ · publica no ELM
   produto ────────── go/kill · ordena · aprova pitch, PRD e ficha

demanda ─► fluxo/captura.md (toda skill que captura · entrada direta: sa-triar.capturar)
   │        tipo ∈ épico · fatia · bug · sustentação        id: EP-nn · FT-nnn · <categoria>-nnn
   └─► 1 TRIAGEM ─────────── sa-triar.triar                       (qualquer pessoa)
        ├─ épico ──────────► 2 REFINAMENTO   sa-refinar.moldar: pitch.md ─► go/kill (produto)
        │                      └─ go ─► 4 ESPECIFICAÇÃO   sa-prd.prd: prd.md aprovado (produto)
        │                               └─► sa-refinar.fatiar ─► fatias FT-nnn (pai EP-nn)
        ├─ fatia · bug ────► 2 REFINAMENTO   sa-refinar.detalhar: ficha (regras · CT-nn · Artefatos afetados) [+ elm/] ─► elegível
        │                      └─ sa-refinar.ajustar até alguém puxar
        └─ sustentação ────► 7 SUSTENTAÇÃO   sa-atender.atender (quem atende puxa, dentro da reserva de capacidade)

3 PLANEJAMENTO ────── sa-planejamento.inicial · .sprint (virada) · .review · .retrospectiva
                      daily: sa-status.painel (WIP · vazão · idade · lead time · pendências de rastreio)
5 DESENVOLVIMENTO ─── sa-desenvolver.iniciar ─► [sa-plano.plano: rápida · completo] ─► sa-desenvolver.codificar ─► MR
                      quem codifica, ao assumir: IA supervisionada · IA autopilot (sa-desenvolvedor como subagente na worktree .sabia/local/wt/<id>) · manual
6 REVISÃO E ACEITE ── sa-verificar.verificar · sa-revisar.mr (desenvolvedor ≠ autor) · [sa-verificar.revisao-humana, por risco]
                      └─► sa-desenvolver.encerrar (merge) ─► sa-especificar.archive ─► Lições aprendidas ─► curadoria na review

estado (linhas do backlog.md e do sprint-<nn>.md): commit pequeno direto na branch base · fluxo/commit-na-branch-base.md
documentos (pitch.md · prd.md · ficha · elm/): direto na branch base, com 'Aprovado: <usuário> · <data>'
MR: só para código (com o delta da spec, design e tasks)

══════════════════ borda ══════════════════
ELM = sa-elm (DOORS + EWM). Só com ELM configurado; a skill do trabalho oferece e nunca trava.
   assumir ──────────► sa-elm.item (tarefa DEV · ESP · ATD)
   horas ────────────► sa-elm.horas (só por pergunta ou pedido)
   concluir ─────────► sa-elm.finalizar
   refinamento ──────► sa-elm.baixar (original do DOORS em elm/)
   depois do merge ──► sa-elm.publicar (especificador; sem a booleana: 'Publicação: pendente')
sem ELM: nenhuma oferta aparece · especificação vigente no repositório (OpenSpec: archive funde o delta · Kiro: .kiro/specs/)
```

## Princípios

- **O mercado é o padrão**: Do Sabiá fica só o que dá produtividade ou preserva o rastreio de requisitos (brownfield). O resto segue o mercado: Kanban com WIP, Shape Up no épico, refinamento conjunto, TDD e MR com revisão.
- **Papéis são permissões**: equipe.json com booleanas. desenvolvedor: puxa item para desenvolvimento e revisa MR de outro autor. especificador: aprova os arquivos de elm/ e publica no ELM. produto: go/kill, ordena, aprova pitch, PRD e ficha. Captura, triagem e revisão humana: qualquer pessoa. Nenhuma regra depende de senioridade.
- **Identidade = GitLab**: usuario no equipe.json = autor do MR = @dono no CODEOWNERS. elm_login é opcional e só a sa-elm lê.
- **ELM utilitário**: Tudo o que fala com o ELM é da sa-elm. As outras skills só oferecem e nunca param o fluxo por causa dele. O ETM fica fora: os casos de teste ficam no CT.csv.
- **Sem ELM, funciona**: Sem ELM configurado, as ofertas do ELM não aparecem. A especificação vigente fica no repositório: no OpenSpec, o archive funde o delta; no Kiro, o vigente são as specs em .kiro/specs/.
- **Estado na branch base**: As linhas do backlog.md e do sprint-<nn>.md vão num commit pequeno direto na branch base, por fluxo/commit-na-branch-base.md. Os documentos de planejamento (pitch, PRD, ficha, elm/) também vão direto na branch base, e a aprovação fica gravada no próprio documento. MR só para código. A branch base precisa aceitar push (ex.: develop).
- **Id estável**: O próximo id é o maior da série no backlog.md + 1, lido depois do pull. O id nunca muda: 'vira épico' cria uma linha EP-nn nova e a antiga fica 'cancelada · virou EP-nn'.
- **Rastreio leve**: A ficha tem os artefatos afetados (<sigla>-<id> · inclui | altera | exclui · versão de referência). A pasta elm/ guarda o arquivo inteiro de cada artefato alterado. O delta traz o texto completo dos requisitos tocados. A publicação no DOORS vem depois do merge e confere a versão.
- **Quem puxa decide**: Trilha (trivial · rápida · completo) e autonomia (IA supervisionada · IA autopilot · manual) são de quem desenvolve. A triagem só registra e ordena. 'Vira épico' devolve o item ao produto.
- **Uma captura só**: Toda skill que captura inclui fluxo/captura.md, que grava o tipo. Desvio maior, DDL pendente e desdobramento viram linha nova e não crescem o escopo do item.
- **Encadeamento**: Cada fluxo termina oferecendo o próximo na mesma sessão quando é a mesma tarefa. Pedido sobre outra tarefa: sugere uma sessão nova, sem impor.
- **Branch só por merge**: A branch se atualiza só por merge da branch base: sem rebase e sem --force.
- **Curadoria das lições aprendidas**: A lição nasce na seção Lições aprendidas do status.md (fatia) ou do registro.md (Sustentação). Na review do ciclo, as escolhidas entram em Regras aprendidas do sabia.md (regra · origem FT/AT · data).

## Disciplina: Triagem
Qualquer pessoa registra e tria. O item é a linha no backlog.md, com o tipo e o id da série. O corpo do item é achado pelo id. A triagem aceita, adia, cancela ou pede informação, e encaminha cada tipo para a disciplina seguinte. Trilha e autonomia não são decididos aqui.
```
demanda (qualquer pessoa, skill ou integração)   (quem descobre)
 └─► captura ─ fluxo/captura.md, incluído por toda skill que captura
       entrada direta 'registrar sem triar': sa-triar.capturar
       do EWM, a pedido: sa-elm.importar-backlog (Defeito → bug · Item de Backlog → fatia)
       grava por fluxo/commit-na-branch-base.md: linha no backlog.md + corpo mínimo do tipo
         id = maior da série + 1, lido depois do pull · tipo · relator · obs com a origem
         ├─ épico ──────► EP-nn · a-moldar ─► fila do sa-refinar.moldar
         ├─ fatia · bug ─► FT-nnn · nova · pai EP-nn ou vazio
         └─ sustentação ─► <categoria>-nnn (AT · IM · BD · IN · OP · EX) · nova · registro.md
                           categoria confirmada antes de gravar
       ─► devolve a quem chamou
 └─► fila = linhas 'nova' ─► sa-status.painel mostra
 └─► sa-triar.triar   (qualquer pessoa; na prática P.O. e SM)
       lê a linha e procura duplicado no backlog.md
       ├─ duplicado ─────────► cancelada · obs 'duplicada de <id>'
       ├─ falta informação ──► fica nova · obs 'falta: <pergunta> · para <relator>'
       ├─ agora não ─────────► adiada até <data>
       ├─ recusa ────────────► cancelada · obs com o motivo
       └─ aceita ─► tamanho (P · M · G) · prioridade (crítica | vazio) · aceita_em
             ├─ fatia · bug ─► aceita ─► oferece sa-refinar.detalhar
             ├─ maior que G ─► vira épico: linha EP-nn a-moldar (obs 'veio de FT-nnn')
             │                 · FT 'cancelada · virou EP-nn' ─► oferece sa-refinar.moldar
             └─ sustentação ─► fica nova na fila da Sustentação ─► oferece sa-atender.atender
       grava por fluxo/commit-na-branch-base.md ─► próximo da fila ou segue a oferta
   expedite: prioridade 'crítica' pela política do acordos.md
   ELM: a coluna ib guarda só o número do IB; as tarefas (DEV · ESP · ATD) vão no sprint-<nn>.md
   roadmap.md não muda na triagem (é do planejamento)
```
- **Onde o item vive**: Na linha do backlog.md. Colunas: id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em (AAAA-MM-DD). Sem coluna link (o corpo é achado pelo id) e sem coluna sprint.
- **Tipos e séries**: tipo ∈ {épico, fatia, bug, sustentação}. épico → EP-nn; fatia e bug → FT-nnn, com pai = EP-nn ou vazio; sustentação → <categoria>-nnn (AT · IM · BD · IN · OP · EX).
- **Id**: Próximo id = maior id da série no backlog.md + 1, lido depois do pull. Sem a linha 'Próximos ids'. O id nunca muda.
- **Status na entrada**: Captura: fatia, bug e sustentação nascem 'nova'; o épico nasce 'a-moldar'. Triagem: fatia e bug aceitos → 'aceita'; a sustentação fica 'nova' até alguém puxar; recusa e duplicado → 'cancelada'; agora não → 'adiada até <data>'.
- **Quem tria**: Qualquer pessoa, sem rodízio, na própria skill. Na prática, P.O. e SM; o Dev pode triar o que achou.
- **Prioridade**: prioridade ∈ {crítica, vazio}. crítica = expedite pela política do acordos.md. Vazio = vale a ordem das linhas, que o produto mantém.
- **Tamanho**: tamanho ∈ {P, M, G}: P = horas, M ≈ 1 dia, G = 2–3 dias (linha Tamanhos do acordos.md). Maior que G é épico; só o épico vai ao pitch e ao go/kill.
- **Agora não**: 'adiada até <data>': o item não é puxado antes da data. A regra é tratada só na entrada comum (fluxo/entrada.md, passo adiada).
- **Sustentação**: A categoria é confirmada antes de gravar, porque o id sai dela. Não existe recategorizar.
- **Trilha e autonomia**: Saem da triagem. Quem puxa decide a trilha e a autonomia.
- **Gravação**: Toda linha de estado vai por fluxo/commit-na-branch-base.md: commit pequeno direto na branch base, push com o sim da pessoa.

## Disciplina: Refinamento
Mesma estrutura do mercado: Shape Up para o épico (pitch e go/kill) e refinamento conjunto para a fatia e o bug (ficha com regras, cenários e artefatos afetados). O Sabiá acrescenta os artefatos afetados com a versão de referência e, com ELM, a pasta elm/ com os artefatos brownfield alterados, aprovados pelo especificador. A ficha é aprovada pelo produto e fica 'elegivel'.
```
item da triagem
 ├─ épico (a-moldar) ─► sa-refinar.moldar   (produto + Dev)
 │     .sabia/planejamento/epicos/EP-nn-<slug>/pitch.md, direto na branch base
 │     pitch: problema · limite de investimento · solução em traços · riscos · não objetivos · go/kill · Decisões
 │     ├─ kill (produto) ─► cancelado · obs 'não investir: <motivo>' · a pasta fica ─► fim
 │     └─ go (produto) ─► 'Aprovado: <usuário> · <data>' no pitch.md · em-especificacao
 │           ─► sa-prd.prd (Especificação): prd.md aprovado pelo produto
 │           ─► sa-refinar.fatiar   (especificador + Dev; fatos pela sa-pesquisar.pesquisar)
 │                 rascunho de fatias verticais P · M · G ─► produto aprova e ordena
 │                 ─► linhas FT-nnn 'aceita' · pai EP-nn · fichas ─► épico 'fatiado'
 │                 ─► oferece sa-refinar.detalhar
 ├─ fatia · bug (aceita) ─► sa-refinar.detalhar   (especificador + Dev [+ QA · UX])
 │     bug sem requisito tocado: o Dev sozinho; ficha curta: passos · atual · esperado · reproduzido?
 │     ficha: regras · cenários CT-nn · Artefatos afetados (<sigla>-<id> · inclui | altera | exclui · versão de referência)   ✚
 │     com ELM e artefatos afetados: sa-especificar.elm monta a pasta elm/ na pasta da spec, direto na branch base   ✚
 │        .kiro/specs/ft-<nnn>-<slug>/elm/ | openspec/changes/ft-<nnn>-<slug>/elm/
 │        autonomia da especificação: IA supervisionada · IA autopilot · manual (grava Especificação na ficha)
 │        sa-elm.baixar: original do DOORS ─► commit de referência (original + versão de referência)
 │        IA: edita e o especificador aprova o arquivo inteiro (HF · UC · REG · MSG · EL · GL)
 │        manual: altera no DOORS ─► 'alterei' ─► sincroniza (elm/, versão de referência, delta, Publicado) ─► aprova
 │        requisito novo: EP03-01-<tipo>-<slug>.md · id provisório <sigla>-<EP ou FT>-nn
 │        artefato já em elm/ de outra fatia ─► esta fica bloqueada até a outra ficar cancelada ou publicada
 │     ├─ dúvida grande ─► spike (sa-pesquisar.pesquisar) · sa-especificar.prototipo
 │     │                  · sa-especificar.reuniao (ATA) ─► volta ao detalhar
 │     ├─ regra sem fonte ─► sa-entrevistar.entrevistar com o produto ─► volta ao detalhar
 │     │                    em aberto bloqueia só o que depende dela
 │     ├─ maior que G ────► vira épico (EP-nn a-moldar · FT 'cancelada · virou EP-nn') ─► sa-refinar.moldar
 │     ├─ muitas regras ──► sa-refinar.ajustar (dividir, 'veio de FT-nnn')
 │     └─ ok ─► DoR (checklist do template da ficha) ─► produto aprova: 'Aprovado: <usuário> · <data>'
 │              ─► 'elegivel' (fluxo/commit-na-branch-base.md) ─► fim: entra na seleção (sa-planejamento.sprint)
 └─ sa-refinar.ajustar   até alguém puxar (status antes de em-andamento)
       dividir · juntar ('veio de FT-nnn') · editar · cancelar fatia ou épico
       ─► grava por fluxo/commit-na-branch-base.md ─► oferece seguir
```
- **Quem refina**: O especificador conduz o refinamento de regra, feature e alteração de requisito com o Dev (e o QA), pouco antes de desenvolver. O bug só passa pelo especificador se tocar um requisito.
- **Épico antes do PRD**: Pitch de uma página (Shape Up) e go/kill do produto. A pasta EP-nn-<slug>/ nasce no shaping com o pitch.md, e o prd.md nasce no go. No kill, o épico fica 'cancelado' e a pasta permanece.
- **Status do épico**: a-moldar → em-especificacao (go) → fatiado → concluido · cancelado. Fecha no merge da última fatia aberta (sa-desenvolver.encerrar).
- **Status da fatia e do bug**: nova → aceita → elegível → em-andamento → concluida, mais cancelada e 'adiada até <data>'. em-revisao é derivado do MR aberto e não se grava.
- **Quem fatia o épico**: O especificador propõe com o Dev. O produto aprova e ordena.
- **Ficha**: Regras, cenários com id CT-nn e artefatos afetados. Vocabulário único: inclui · altera · exclui. A aprovação do produto fica na própria ficha.
- **Pasta elm/**: Só com ELM e só os artefatos brownfield alterados, um arquivo inteiro por artefato, montados pela sa-especificar.elm (chamada pela sa-refinar.detalhar). O commit de referência guarda o original e a versão de referência, e o git mostra a diferença. É a fonte da publicação. Autonomia da especificação (IA supervisionada · IA autopilot · manual), perguntada no detalhar e fixa até o fim: no manual, o especificador altera direto no DOORS e a skill sincroniza na volta; a sa-elm.publicar não reenvia esses artefatos.
- **Trava de artefato**: Duas fatias não alteram o mesmo artefato ao mesmo tempo: a segunda fica bloqueada até a primeira ficar cancelada ou com 'Publicação: publicada' (sem ELM: concluida). A sa-status mostra a trava.
- **Decisões**: Vão na seção Decisões do pitch.md (antes do go), do prd.md (depois) e da ficha (fatia), sempre em tabela D-nn | Decisão | Quem | Quando | Fonte. Não existe decisoes.md.
- **Fatia depois de elegível**: Editável e divisível pela sa-refinar.ajustar até alguém puxar.
- **DoR**: Checklist no template da ficha. O nome vai para a revisão de termos.
- **Dúvida grande**: Spike, protótipo ou reunião, sem virar épico. Maior que G vira épico.

## Disciplina: Planejamento
Ciclo com políticas escritas no acordos.md, seleção pela vazão, puxada com sinal de WIP e daily pela sa-status. O Sabiá acrescenta as pendências de rastreio. A virada acontece no planejamento da sprint seguinte. O ELM fica fora do rito: é só utilitário.
```
sa-planejamento.inicial   (o time)
   equipe.json: usuario (GitLab) · desenvolvedor · especificador · produto · elm_login (opcional)
   acordos.md: timebox · WIP por coluna (valores de status) · DoD · classes de serviço (crítica = expedite)
               · reserva de capacidade % · Tamanhos · disjuntor · id no commit · CT no teste · SLE (opcional)
   roadmap.md ─► oferece sa-planejamento.sprint
sa-planejamento.sprint   (Devs + produto) · início do ciclo ou reabastecimento
   ├─ virada: a sprint anterior tem itens em aberto ou em andamento? ─► migrar? (produto)
   │     ├─ migra ─► linha no sprint-<nn>.md novo
   │     └─ não ──► volta ao backlog (branch, ficha e pasta ficam)
   │               com ELM: sa-elm.finalizar cancela a tarefa · o IB permanece
   ├─ capacidade: vazão (concluídas por ciclo) − reserva de capacidade
   ├─ seleção na ordem do backlog.md; item sem ficha elegível entra como especificação
   └─ grava sprint-<nn>.md por fluxo/commit-na-branch-base.md
         Item · Trabalho (especificação | desenvolvimento | atendimento) · Responsável · Tarefas
         ELM, só a pedido: sa-elm.iteracao ─► oferece puxar o topo (sa-desenvolver.iniciar)
execução: puxa o topo com sinal de WIP   (membro do time)
   ├─ desenvolvimento ─► sa-desenvolver.iniciar · atendimento ─► sa-atender.atender
   │   especificação ─► sa-refinar.detalhar ou sa-prd.prd
   └─ urgente ─► prioridade 'crítica': expedite pela política, sem aprovação
daily ─ sa-status.painel (só leitura)
   WIP por coluna · vazão · idade (hoje − iniciada_em) · lead time · SLE · reserva de capacidade × atendimento
   └─ pendências de rastreio   ✚
         Publicação: pendente · artefato de elm/ travado · CT sem teste · commit sem id (se o acordos.md pede)
fim do timebox
   ├─ sa-planejamento.review: stakeholders quando disponíveis; não trava
   │     └─ regras candidatas (Lições aprendidas das fatias e da Sustentação) ─► quais entram em Regras aprendidas?
   │          grava no .sabia/sabia.md (regra · origem FT/AT · data) ─► oferece sa-planejamento.retrospectiva
   └─ sa-planejamento.retrospectiva: melhorias ─► acordos.md ─► fim
         itens em aberto ficam para a virada do próximo sa-planejamento.sprint
```
- **Políticas**: No acordos.md: timebox, WIP por coluna (com os valores de status do backlog.md), DoD, classes de serviço, reserva de capacidade, Tamanhos, disjuntor do autopilot, id no commit, CT no teste e SLE opcional.
- **Seleção**: No início do ciclo, pelos Devs com o produto, na ordem do backlog.md. Reabastece quando o topo esvazia.
- **sprint-<nn>.md**: Uma linha por item e trabalho: Item · Trabalho (especificação | desenvolvimento | atendimento) · Responsável · Tarefas (ids do EWM com prefixo DEV · ESP · ATD, numa coluna só). Não tem situação própria: o status vem do backlog.md.
- **Item fora da seleção**: Expedite, captura puxada na hora ou especificação que fechou: a skill que puxa acrescenta a linha no sprint aberto. Não há segundo encaixe.
- **Reserva de capacidade**: % da capacidade não alocada. A reserva de capacidade consumida é a soma das linhas de atendimento. Se estourar, a sa-status avisa e o produto decide na seleção.
- **Métricas**: lead time = concluida_em − iniciada_em. WIP e vazão por contagem. Idade = hoje − iniciada_em. SLE opcional no acordos.md.
- **Virada**: No planejamento da sprint seguinte, a skill pergunta se migram os itens em aberto ou em andamento da anterior. O item que sai volta ao backlog com branch, ficha e pasta. A tarefa do ELM é cancelada pela sa-elm e o IB permanece. Não existe 'incompleto no fechamento'.
- **Review**: Com os stakeholders quando disponíveis, sem travar e sem consolidação. Um passo da review faz a curadoria das Regras aprendidas.
- **Retro**: Independente da review. As melhorias vão para o acordos.md.
- **Utilitário ELM**: Só com ELM configurado. Ao assumir, 'quer criar o item no ELM?' → sa-elm.item (DEV · ESP · ATD). 'Lançar horas?' → sa-elm.horas; um pedido completo ('8 horas hoje nesta tarefa') lança direto. Ao concluir, 'finalizar a tarefa?' → sa-elm.finalizar. O relatório da semana só a pedido, na sa-elm.horas. Nunca bloqueia.

## Disciplina: Especificação
O épico ganha o PRD (sa-prd.prd) depois do go. A fatia é especificada na ficha e na pasta elm/ do refinamento, e o texto aprovado é copiado para o delta da spec no desenvolvimento. O delta sempre traz o texto completo dos requisitos tocados, com ou sem ELM. Depois do merge, o archive fecha a spec e oferece a publicação no DOORS.
```
épico (go no pitch.md) ─► sa-prd.prd   (especificador escreve · produto aprova)
   ler o existente só no trecho tocado: specs vigentes ─► bundle local ─► ELM ao vivo (leitura)
   esclarecer: sa-entrevistar.entrevistar (até 5 perguntas por rodada, com recomendação)
      regra de negócio: vale a decisão de uma pessoa, com quem e quando; o agente nunca inventa
   prd.md: objetivos · métricas · requisitos com id · não objetivos · Decisões
      id: <sigla>-<id do ELM> no existente · <sigla>-<EP ou FT>-nn provisório no novo   ✚
      alteração: inclui · altera · exclui, por requisito, com a versão de referência   ✚
   validar: sabia validar-spec (pendente; avisa, não trava)
   produto aprova: 'Aprovado: <usuário> · <data>' no prd.md, direto na branch base ─► oferece sa-refinar.fatiar
   mudança depois da aprovação: sa-prd.mudanca no mesmo prd.md (nova versão e nova aprovação)
      ─► sa-refinar.ajustar nas fatias atingidas
fatia ─► ficha e elm/ no sa-refinar.detalhar (Refinamento) · autonomia: IA supervisionada · IA autopilot · manual (direto no DOORS)
desenvolvimento ─► sa-plano.plano copia o texto aprovado para o delta, sem reescrever
   delta = texto completo de cada requisito tocado, como se não houvesse ELM
      OpenSpec: specs/<cap>/spec.md com ADDED · MODIFIED · REMOVED
      Kiro: requirements.md ou bugfix.md com o bloco completo de cada requisito
   texto precisa mudar ─► Em aberto ao especificador (com ELM, sa-especificar.elm) ─► sa-plano.replanejar recopia
   DOORS mudou desde o commit de referência ─► especificador decide: sa-elm.baixar de novo e mesclar
depois do merge ─► sa-especificar.archive   (chamada pela sa-desenvolver.encerrar)
   ├─ trivial ou sem delta ─► nada a arquivar ─► devolve
   ├─ sem ELM ─► OpenSpec: openspec archive <ft> --yes (funde na especificação vigente)
   │            Kiro: o vigente são as specs em .kiro/specs/ ─► devolve
   └─ com ELM ─► OpenSpec: openspec archive <ft> --skip-specs --yes · 'publicar no DOORS?'
         ├─ especificador ─► sa-elm.publicar ─► 'Publicação: publicada <data>' no status.md arquivado
         │     confere a versão de cada artefato (mudou ─► avisa e pula) · cria os novos
         │     artefato pulado ─► sa-especificar.elm refaz a mescla (fatia concluida · 'Publicação: pendente') ─► publica de novo
         │     renomeia <id do ELM>-<tipo>-<slug>.md e troca o id provisório no PRD, nas fichas e no delta
         │     ET as-built, onde o projeto mantém ET
         └─ sem a booleana ─► 'Publicação: pendente' ─► sa-status.painel mostra ─► especificador roda sa-elm.publicar
ferramentas a pedido: sa-especificar.prototipo (vale com a aprovação do cliente) · sa-especificar.reuniao (ATA opcional)
```
- **Onde mora o vigente**: Com ELM, no DOORS. Sem ELM, na especificação vigente do repositório (OpenSpec: openspec/specs; Kiro: .kiro/specs/).
- **Formato da spec**: A sa-setup.configurar decide por projeto: alvo Kiro → Kiro, sem perguntar; só opencode → pergunta Kiro ou OpenSpec. Grava formato_spec no agentes.json e registra no sabia.md.
- **Trilha × formato**: trivial: nenhum arquivo de spec (tudo no MR). rápida fatia: Kiro Quick Spec (requirements, design, tasks, sem portões) | OpenSpec proposal + delta + tasks. rápida bug: Kiro Bugfix Spec (bugfix, design, tasks) | OpenSpec proposal + delta MODIFIED + tasks. completo: Kiro requirements → design → tasks com 'quer revisar agora?' | OpenSpec proposal + delta + design + tasks. Rápida e completo têm também research.md, status.md e CT.csv. Pasta: ft-<nnn>-<slug>.
- **Quem escreve o delta**: A sa-plano.plano, copiando o texto aprovado da ficha e de elm/, no MR do código. Não há MR de spec separado.
- **Aprovação**: O produto aprova pitch, PRD e ficha. O especificador aprova os arquivos de elm/. A aprovação fica gravada no topo do documento: 'Aprovado: <usuário> · <data>'.
- **Id do requisito**: Existente: <sigla>-<id do ELM>. Novo: <sigla>-<EP ou FT>-nn provisório, trocado pelo id do ELM na publicação, num commit só.
- **Autonomia da especificação**: Só com ELM: IA supervisionada · IA autopilot · manual, na ficha (Especificação), fixo até o fim e independente da autonomia da codificação. Manual: o especificador altera no DOORS; na volta ('alterei'), a skill baixa para o elm/ (diff contra o commit de referência), atualiza a versão de referência, grava o delta completo e marca '**Publicado:** manual'. Sem ELM, não há pergunta.
- **Publicação**: Depois do merge, pela sa-elm.publicar, conferindo a versão. Sem a booleana especificador, fica 'Publicação: pendente' no status.md arquivado, e a sa-status mostra. Artefato pulado porque a versão mudou: a sa-especificar.elm refaz a mescla na fatia concluida com 'Publicação: pendente', e a publicação roda de novo.
- **ET**: Só as-built, publicada na finalização do desenvolvimento e só onde o projeto mantém ET.
- **Perguntas**: Até 5 por rodada, com recomendação. Só a regra de negócio vai à pessoa; lacuna de rotina vira suposição registrada.
- **Validador**: sabia validar-spec no CLI (pendente): forma e ligações. Avisa e não trava; o conteúdo fica com a revisão.

## Disciplina: Desenvolvimento
Do puxar ao MR: quem desenvolve assume pela branch <id>, escolhe a trilha e a autonomia, planeja na rápida e no completo e codifica com TDD e backpressure em camadas. O autopilot roda num subagente em worktree, com disjuntor. A branch se atualiza só por merge da branch base.
```
item pronto no sprint-<nn>.md · expedite (crítica) · captura puxada na hora
 └─► sa-desenvolver.iniciar   (quem tem a booleana desenvolvedor)
       entrada comum fluxo/entrada.md: existe? · terminal · adiada · é deste fluxo · branch
       DoR da ficha · sinal de WIP do acordos.md
       assumir: tamanho (P · M · G) · trilha (trivial · rápida · completo) · autonomia (IA supervisionada · IA autopilot · manual; manual = só o código-fonte, e o 'terminei' segue do validar)
          └─ maior que G ─► vira épico (EP-nn a-moldar · FT 'cancelada · virou EP-nn'), sem branch ─► puxa outra
       branch <id> a partir da branch base · pasta ft-<nnn>-<slug> (rápida · completo) · status.md
       backlog: em-andamento · iniciada_em · responsável · linha no sprint aberto, se faltar
          (fluxo/commit-na-branch-base.md) ─► push da branch = atribuição
       com ELM: 'quer criar o item no ELM?' ─► sa-elm.item (DEV)
       ├─ trivial ────────► sa-desenvolver.codificar
       └─ rápida · completo ─► sa-plano.plano   (quem desenvolve aprova)
             fatos: sa-pesquisar.pesquisar (sa-pesquisador) ─► a sa-plano grava research.md
             delta (cópia do texto aprovado) · design · tasks, conforme trilha × formato
             completo: requirements ─► design ─► tasks, cada um com 'quer revisar agora?'
                ─► sa-revisar.revisar (critérios de revisão L)
             ─► oferece sa-desenvolver.codificar · plano não serve mais ─► sa-plano.replanejar
 └─► sa-desenvolver.codificar   (Fase: implementando)
       TDD por tarefa · refatoração preparatória no trecho tocado é tarefa do plano
       backpressure: a cada alteração, compila + testes do trecho tocado
          antes do MR: suíte completa uma vez (pipeline da branch; local se não houver CI)
          baseline = último pipeline da branch base: nenhum teste verde fica vermelho
       atualizar a branch: só merge da branch base (sem rebase)
       ├─ desvio leve ──────────────► corrige e registra em Desvios do status.md
       ├─ desvio maior · DDL pendente ─► fluxo/captura.md (BD ou FT, obs 'veio de FT-nnn')
       ├─ regra sem decisão ────────► Em aberto do status.md ─► sa-entrevistar.entrevistar com o produto
       │                              para só o que depende dela
       ├─ texto do requisito muda ──► volta ao especificador (sa-refinar.detalhar)
       └─ arquitetural · irreversível ─► para e pergunta
       revisão do agente: sa-revisar.revisar no sa-revisor (critérios de revisão C: spec · padrões · segurança)
       aceite: sa-verificar.verificar no sa-verificador (Revisão e aceite)
       MR pelo template: o quê · porquê · evidência · risco · foco · Artefatos afetados ─► Fase pr-aberto ─► sa-revisar.mr
 autopilot (por item, escolhido ao assumir e fixo até o fim, decidido por quem desenvolve)
       o sa-desenvolvedor como subagente na worktree .sabia/local/wt/<id> · a pessoa segue na branch base · vários itens em paralelo
       liberado: push da própria branch (sem --force) · merge da branch base nela · abrir/atualizar o MR dela
       bloqueado: merge do MR · ELM · rede
       disjuntor: teto do acordos.md ou 2 reprovações seguidas ─► .sabia/local/loop-<id>.md ─► devolve à pessoa
 retomar: sa-status.painel ('<id>' · 'minha próxima') lê o Retomar do status.md
       ─► 'seguir agora?' ─► sa-desenvolver.codificar
 fechar a sessão: sa-status.fechar-sessao (Retomar · créditos do Kiro em .sabia/creditos/<usuario>.csv)
```
- **Quem puxa**: Quem tem a booleana desenvolvedor. A atribuição é o push da branch <id>.
- **Assumir a tarefa**: Quem pega confirma o tamanho (P · M · G), a trilha e a autonomia (IA supervisionada · IA autopilot · manual), antes da branch. A autonomia vale até o fim da tarefa; no manual, só a geração do código-fonte é da pessoa. 'Vira épico' devolve o item ao produto, sem criar branch.
- **status.md**: Trilha (trivial · rápida · completo) · Autonomia (IA supervisionada · IA autopilot · manual, fixa até o fim da tarefa) · Fase (implementando · revisando · verificando · pr-aberto · retrabalho) · MR (link) · Desvios · Em aberto · Lições aprendidas · Retomar (o que foi feito e o próximo passo exato).
- **Backpressure**: Em camadas: o trecho tocado a cada alteração, a suíte completa uma vez antes do MR, com o último pipeline da branch base como baseline.
- **Plano**: Só na rápida e no completo, pela sa-plano.plano. No completo, por partes, com 'quer revisar agora?' em cada uma. O delta copia o texto aprovado.
- **Branch**: Atualiza só por merge da branch base. Sem rebase, sem --force.
- **Commit e teste**: Id da tarefa no commit só se o acordos.md pedir. O teste automatizado é marcado com o CT-nn do cenário.
- **Autopilot**: O sa-desenvolvedor como subagente na worktree .sabia/local/wt/<id>. Fica liberado o push, o merge da branch base e o MR da própria branch. Merge do MR, ELM e rede ficam bloqueados. O disjuntor grava em .sabia/local/loop-<id>.md e devolve à pessoa. Sem lote.
- **Fim de cada etapa**: Oferece seguir na mesma sessão quando é a mesma tarefa. Para outra tarefa, sugere sessão nova, sem impor.
- **Senioridade**: Não decide nada: nem trilha, nem plano, nem autopilot, nem quem revisa.

## Disciplina: Revisão e aceite
Todo MR de código passa pela revisão do agente, pelo verificador e por um desenvolvedor que não é o autor. A revisão humana só entra por risco. O autor faz o merge com aprovação e CI verde. Depois do merge vêm o status final, o archive da spec, a oferta de finalizar a tarefa no ELM e as lições aprendidas para a curadoria.
```
MR aberto pela sa-desenvolver.codificar, com revisão do agente feita (critérios de revisão C)
 ├─ sa-verificar.verificar   (subagente sa-verificador; o autor chama antes do merge · Fase verificando)
 │     roteiro pelos CT-nn da ficha e da spec ─► exercita a aplicação direto (curl · navegador)
 │     grava CT.csv (uma linha por CT-nn) · evidência no MR
 │     asserção durável: testes automatizados no CI, marcados com o CT-nn
 │     achou demanda ─► fluxo/captura.md
 ├─ sa-revisar.mr   (qualquer desenvolvedor ≠ autor; CODEOWNERS indica o dono · Fase revisando)
 │     apoio: sa-revisar.revisar no subagente sa-revisor (critérios de revisão C)
 │     pendente (MCP do Jenkins): ler o resultado e os logs do último commit da branch
 │     achados nas threads do MR
 │     ├─ corrige ─► o autor ajusta (suggested change no ajuste pequeno)
 │     ├─ adia ───► fluxo/captura.md
 │     ├─ volta ao plano ─► sa-plano.replanejar
 │     ├─ volta à spec ───► especificador (sa-refinar.detalhar)
 │     └─ descarta
 │     reprovado ─► Fase retrabalho ─► sa-desenvolver.codificar · só o bloqueante trava o merge
 ├─ sa-verificar.revisao-humana   (qualquer pessoa; só quando o risco pede; sobre a branch do MR)
 └─► sa-desenvolver.encerrar   (autor)
       aprovação + CI verde ─► merge (ou auto-merge)
       backlog: concluida · concluida_em (fluxo/commit-na-branch-base.md)
          última fatia aberta do épico ─► épico concluido
       ─► sa-especificar.archive (archive e publicação: Especificação)
       ─► com ELM: 'finalizar a tarefa?' ─► sa-elm.finalizar · 'lançar horas?' ─► sa-elm.horas
       ─► Lições aprendidas do status.md ─► curadoria na sa-planejamento.review ─► fim: oferece puxar o próximo
 conhecimento
   ADR: só decisão que atravessa fatias (banco, framework, padrão de integração); o resto no design e no MR
   glossário: GL no DOORS onde já existe; sem ELM, glossario.md opcional
```
- **Faixa de revisão**: Todo MR de código tem 1 aprovação de um desenvolvedor ≠ autor. Sem merge direto.
- **Revisão do agente**: Subagente sa-revisor (sa-revisar.revisar) com os critérios de revisão C: spec · padrões · segurança, mais os critérios de revisão do toolkit. As Regras aprendidas do sabia.md entram como itens dos critérios de revisão.
- **Aceite**: Pipeline de CI + subagente sa-verificador. Ele exercita a aplicação direto e põe a evidência no MR. Sem http.sh, massa/ nem verificacao.md. revisão humana só por risco.
- **CT.csv**: Escrito só pela sa-verificar. Sem as colunas Status e 'Planejado para'. Cada linha liga ao CT-nn da ficha e da spec, que é o id marcado no teste.
- **Achados**: Nas threads do MR, com destino: corrige, adia, volta ao plano, volta à spec ou descarta. Só o bloqueante trava o merge.
- **Merge**: Pelo autor, com aprovação e CI verde. Auto-merge opcional. Sem consolidação depois: o fechamento é o status final, o archive e a publicação.
- **Fecho do épico**: No merge da última fatia aberta, a sa-desenvolver.encerrar grava o épico como concluido.
- **Conhecimento**: A lição nasce no status.md e a curadoria acontece na review. ADR só quando a decisão atravessa fatias. Glossário onde já existe.
- **CI**: Jenkins. A leitura pelo agente depende do MCP do Jenkins (pendente); até lá, a pessoa confere no Jenkins ou roda local.

## Disciplina: Sustentação
Um fluxo só para as seis categorias (AT · IM · BD · IN · OP · EX). Qualquer pessoa registra. Quem atende puxa dentro da reserva de capacidade, atende com a IA só como auxílio e declara resolvido. O que muda o código vira fatia ou bug pela triagem normal.
```
pedido (qualquer pessoa)
 └─► captura ─ fluxo/captura.md (entrada direta: sa-atender.atender ou sa-triar.capturar)
       categoria confirmada antes de gravar: AT · IM · BD · IN · OP · EX
       ─► <categoria>-nnn · nova · registro.md (fluxo/commit-na-branch-base.md)
       ├─ muda o código ─► é fatia ou bug: captura com esse tipo ─► Triagem (sa-triar.triar)
       └─► sa-atender.atender   (quem atende puxa, dentro da reserva de capacidade do acordos.md)
             em-andamento · iniciada_em · responsável · linha 'atendimento' no sprint aberto
             com ELM: 'quer criar o item no ELM?' ─► sa-elm.item (ATD)
             reserva de capacidade estourada ─► sa-status.painel avisa ─► o produto decide na seleção (sa-planejamento.sprint)
             ajuda a pedido: especificador · produto · time (refinamento só quando quem atende pede)
             IA como auxílio, a pedido
                fatos do código e das specs vigentes: sa-pesquisar.pesquisar
                com ELM: 'pesquisar nas regras do ELM?' (bundle ─► ELM ao vivo, só leitura)
                banco só leitura · rascunho de resposta, se pedido
                o agente não executa em ambiente nem responde ao cliente · dado de cliente fora do git
             └─► concluir: a pessoa que atende declara resolvido (nunca a IA)
                   concluida · concluida_em · atividade no registro.md (fluxo/commit-na-branch-base.md)
                   com ELM: 'finalizar a tarefa?' ─► sa-elm.finalizar · 'lançar horas?' ─► sa-elm.horas
                   ├─ lição ─► Lições aprendidas do registro.md ─► curadoria na sa-planejamento.review
                   ├─ desdobramento ─► fluxo/captura.md (obs 'origem <id>') ─► Triagem
                   └─ não procede ─► cancelada · obs com o motivo
```
- **Quem registra**: Qualquer pessoa, pela captura comum.
- **Categoria**: AT · IM · BD · IN · OP · EX, confirmada antes de gravar, porque o id sai dela. Não existe recategorizar. A seção Sustentação do sabia.md descreve cada uma: Categoria · Descrição · Exemplo.
- **Status**: nova → em-andamento → concluida · cancelada.
- **Reserva de capacidade**: A Sustentação consome a reserva de capacidade do acordos.md (soma das linhas de atendimento do sprint). Se estourar, o produto decide na seleção.
- **Refinamento**: Só a pedido de quem atende.
- **Papel da IA**: Auxílio a pedido ou orientação (agent assist). O atendimento é da pessoa: o agente não executa em ambiente nem responde ao cliente.
- **Quem declara resolvido**: Sempre a pessoa que atende, nunca a IA. Não há etapa de confirmação do solicitante.
- **Desdobramento**: Vira demanda nova pela captura, com origem na obs, e segue o fluxo normal da triagem.
- **DDL do desenvolvimento**: A DDL pendente de uma fatia chega como item BD pela captura, com obs 'origem FT-nnn'.

# Skills

## sa-triar
A triagem livre. Qualquer pessoa registra e tria, item a item, direto na branch base. A triagem decide se o item entra (aceita, cancelada, falta informação ou adiada) e define tipo, tamanho, prioridade e pai. Grava a linha e o corpo pela fluxo/commit-na-branch-base.md. Não toca no ELM (só oferece ler o WI pela sa-elm.item) nem no sprint-<nn>.md. O fluxo capturar é só a entrada direta 'registrar sem triar'. As outras skills não o chamam: incluem a fluxo/captura.md.

### sa-triar.triar
Item a item: lê o pedido ou a fila, procura duplicado, decide (cancelada · falta · adiada · aceita), classifica o aceito, grava pela fluxo/commit-na-branch-base.md (um commit por item) e pergunta 'mais algum item para triar?'. Todo ramo grava. O próximo passo do item é só sugestão de sessão nova.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a pessoa (pedido em texto, número do EWM, id do backlog.md ou nada), a sa-triar.capturar ('triar agora?') e a sa-elm.importar-backlog ('seguir para a triagem?'). papel: nenhuma (qualquer pessoa tria). branch: nao. Pré-condição: .sabia/planejamento/backlog.md na branch base. Sem ele, diz 'rode a sa-setup' e para. Aceita qualquer tipo em nova e também fatia ou bug em aceita ou 'adiada até <data>' (retriagem; a triagem trata o adiamento). Pedido em texto não é o caso 'não registrado' da entrada comum: segue para ler. Vizinhos: fatia ou bug elegível → sa-refinar.ajustar; fatia ou bug em-andamento → sa-desenvolver.codificar; épico a-moldar → sa-refinar.moldar; épico em-especificacao → sa-prd.prd; épico fatiado → sa-refinar.ajustar; sustentação em-andamento → sa-atender.atender.
2. **ler** — Lê a entrada. Texto: o próprio pedido. Número do EWM: oferece ler o WI pela sa-elm.item (ler WI). Sem ELM ou sem o sim, pede à pessoa o título, a descrição e o comportamento esperado, sem inventar dado de work item. Defeito vira bug; Item de Backlog vira fatia. Id do backlog.md: a linha e o corpo (ficha ou registro). Nada informado: mostra a fila (linhas nova de fatia e bug, na ordem do backlog.md, com a obs 'falta:' visível), e a pessoa escolhe um item ou 'uma a uma'.
3. **duplicado** — Procura o mesmo pedido no backlog.md da branch base (título parecido, ib igual, obs; inclui as canceladas), nas fichas (.sabia/planejamento/fatias/) e nos registros (.sabia/planejamento/sustentacao/). Achou: mostra e pergunta 'é o mesmo?'. Sim, com o existente aberto: o pedido em texto não vira linha (diz o id existente e vai ao encaminhar), e o item da fila vai ao decidir como duplicado. Sim, com o existente terminal: segue como item novo, com 'origem <id>' na obs (nunca reabre). Não: segue para decidir.
4. **decidir** — Decide o destino do item. Todo ramo segue para o registrar. Duplicado: cancelada, obs 'duplicada de <id>'. Recusa: cancelada, obs 'motivo: <texto>'. Falta informação: fica nova, obs 'falta: <pergunta> · para <relator>', e volta à fila quando o relator responde. Agora não: fatia ou bug fica 'adiada até <AAAA-MM-DD>', obs 'motivo: <texto>'; épico fica a-moldar, no fim da ordem; sustentação fica nova (não tem adiada). Aceito: segue para classificar.
5. **classificar** — Só o item aceito. tipo ∈ {épico, fatia, bug, sustentação}. Sustentação é trabalho sem mudança no repositório, numa categoria da seção Sustentação do sabia.md (AT · IM · BD · IN · OP · EX), confirmada aqui (depois não existe recategorizar). O que muda código ou configuração é fatia ou bug. O que não cabe em G é épico. tamanho ∈ {P, M, G} (linha Tamanhos do acordos.md), só em fatia e bug. prioridade ∈ {crítica, vazio}: crítica = expedite pela política do acordos.md; vazio = vale a ordem das linhas. pai = EP-nn aberto ou vazio, só em fatia e bug. Campos mínimos do corpo. Bug: passos · atual · esperado · reproduzido (sim | não | detalhe insuficiente), reproduzindo só quando é barato. Fatia: pedido · quem pediu · requisito (se souber). Sustentação: pedido · pedido por · prazo. Épico: só a linha. Tipo com série diferente da do id que o item já tem (fatia ou bug ↔ épico ou sustentação, ou outra categoria): nasce a linha da série certa pela fluxo/captura.md, com 'veio de <id>' na obs, e a antiga fica cancelada com 'virou <novo id>'. O id nunca muda. Entre fatia e bug, só a coluna tipo muda.
6. **registrar** — Grava pela fluxo/commit-na-branch-base.md, um commit por item ('backlog: triagem <id>'). O item novo (pedido em texto ou EWM) nasce pela fluxo/captura.md, com a triagem já aplicada na mesma gravação. Status gravado: aceita (fatia e bug, com aceita_em), a-moldar (épico, com aceita_em), nova (sustentação e todo item com 'falta:'), cancelada ou 'adiada até <data>' pelos ramos do decidir. Colunas: id · título · tipo · status · prioridade · tamanho · responsável (vazio) · pai · relator (usuario do equipe.json ou 'externo: <área ou nome>') · ib (só o número, quando veio do EWM) · obs · aceita_em · iniciada_em · concluida_em (AAAA-MM-DD). Corpo da fatia e do bug: a ficha curta .sabia/planejamento/fatias/FT-nnn-<slug>.md, só com a seção Entrada do tipo (padrão sa-refinar/ficha.md). Corpo da sustentação: o registro .sabia/planejamento/sustentacao/<ID>-<slug>.md (padrão sa-atender/registro.md, sem subpasta por categoria). O épico fica só com a linha (o pitch nasce na sa-refinar.moldar). Não toca no ELM nem no sprint-<nn>.md.
7. **encaminhar** — Mostra a linha gravada e o próximo passo do item, só como sugestão de sessão nova (é outra tarefa). Fatia ou bug aceita: sa-refinar.detalhar. Épico a-moldar: sa-refinar.moldar. Sustentação nova: sa-atender.atender. Prioridade crítica: avisa que é expedite e diz quem puxa pela política do acordos.md. Falta, adiada e cancelada: nada a seguir. Pergunta 'mais algum item para triar?'. Sim: volta ao ler, na mesma sessão. Não: fim (a fluxo/commit-na-branch-base.md já voltou à branch anterior).

### sa-triar.capturar
Entrada direta 'registrar sem triar': inclui a fluxo/captura.md, mostra o id gravado e oferece triar. As outras skills não chamam este fluxo: incluem a fluxo/captura.md.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a pessoa ('registra isso', 'anota no backlog', 'abre um bug'). papel: nenhuma. branch: nao. Pedido sem texto: pergunta o que registrar. Não há vizinhos: o fluxo só cria item.
2. **capturar** — Inclui a fluxo/captura.md com o tipo que a pessoa diz, ou que o fluxo pergunta com uma recomendação (a regra do tipo está no classificar da sa-triar.triar). A linha nasce nova (épico: a-moldar), com o corpo mínimo, e é gravada na branch base.
3. **seguir** — Mostra 'capturado <id> · <tipo> · <status>'. Fatia ou bug nova: oferece 'triar agora?' (sa-triar.triar, na mesma sessão). Depois pergunta 'mais algum item para registrar?'. Sim: volta ao capturar. Não: fim.

## sa-refinar
O refinamento do backlog. Tem quatro fluxos: moldar o épico (pitch do Shape Up e go/kill), detalhar a fatia ou o bug com o refinamento conjunto (regras, cenários CT-nn, artefatos afetados e a pasta elm/), fatiar o PRD aprovado e ajustar as fatias até alguém puxar. Qualquer pessoa conduz. Quem tem produto decide o go/kill, ordena e aprova pitch, ficha e fatias. Quem tem especificador aprova os arquivos de elm/. Tudo vai direto na branch base pela fluxo/commit-na-branch-base.md. Absorve a sa-fatiar. O PRD fica na sa-prd.

### sa-refinar.moldar
Épico a-moldar → pitch.md de uma página (problema · limite de investimento · solução em traços · riscos · não objetivos) → go/kill de quem tem produto → go: em-especificacao e 'seguir para o PRD?' (sa-prd.prd); kill: cancelado, pasta mantida.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a sa-triar.triar.encaminhar (sugestão), a pessoa ('moldar o EP-04', 'ideia nova grande') e o 'vira épico' da sa-refinar.detalhar e da sa-desenvolver.iniciar (a linha EP-nn já nasceu pela fluxo/captura.md, com 'veio de FT-nnn'). Ideia grande em texto ainda não registrada: captura como épico e segue. papel: nenhuma (qualquer pessoa conduz; o passo decisao confere produto). branch: nao. Aceita épico em a-moldar. Vizinhos: épico em-especificacao → sa-prd.prd; épico fatiado → sa-refinar.ajustar; fatia ou bug → sa-refinar.detalhar; sustentação → sa-atender.atender.
2. **pitch** — Escreve .sabia/planejamento/epicos/EP-nn-<slug>/pitch.md, pelo padrão sa-refinar/pitch.md. A pasta nasce aqui. No topo, a linha 'Aprovado: —'. Seções, em uma página: Problema · Limite de investimento (<n> semanas) · Solução em traços · Riscos · Não objetivos · Decisões (as tomadas antes do go, em tabela D-nn | Decisão | Quem | Quando | Fonte) · Em aberto (pergunta · para quem · bloqueia) · Decisão (vazia até o passo decisao). As perguntas vão pela sa-entrevistar.entrevistar (até 5 por rodada, cada uma com recomendação), que busca os fatos pela sa-pesquisar. Vigente: specs arquivadas → bundle (docs/elm/<pa>/). Sem bundle, oferece a sa-elm.baixar. Bundle desatualizado (sincronizado_em anterior à última 'Publicação: publicada'): mostra a data e pergunta se baixa. Dúvida que só o cliente resolve: oferece a sa-especificar.prototipo, que devolve aqui. Regra sem fonte fica em aberto (trava decisao-da-pessoa). Ao fim de cada sessão, grava o pitch.md pela fluxo/commit-na-branch-base.md ('EP-nn pitch').
3. **decisao** — O go/kill é de quem tem produto no equipe.json. Sem essa pessoa na sessão: mostra os nomes com produto e vai ao seguir (o épico fica a-moldar). Go: status em-especificacao; no pitch.md, 'Decisão: go' e, na linha do topo, 'Aprovado: <usuário> · <data>'. Kill: status cancelado, obs 'não investir: <motivo>'; no pitch.md, 'Decisão: kill · <motivo>' e, na linha do topo, 'Aprovado: <usuário> · <data>'; a pasta fica. Cabe em G (não é épico): nasce a fatia, já aceita, pela fluxo/captura.md, com 'veio de EP-nn', e o épico fica cancelado com 'virou FT-nnn'. Status, obs e pitch.md vão num commit pela fluxo/commit-na-branch-base.md ('EP-nn go' ou 'EP-nn kill').
4. **seguir** — Go: oferece 'seguir para o PRD?' (sa-prd.prd, que cria o prd.md na pasta do épico) na mesma sessão. Kill: oferece moldar o próximo épico a-moldar, na ordem do backlog.md. Fatia do 'cabe em G': oferece 'seguir para o detalhar?' (sa-refinar.detalhar). Sem decisão: fim, com 'o pitch está na branch base; o go/kill é de <nomes com produto>'.

### sa-refinar.detalhar
Refinamento conjunto (especificador ou P.O. com o Dev, e QA ou UX se houver), pouco antes de alguém puxar: regras e exemplos viram a ficha com cenários CT-nn, os artefatos afetados e, com ELM, a pasta elm/ dos artefatos tocados, na autonomia da especificação escolhida (IA supervisionada · IA autopilot · manual no DOORS). Com a DoR completa, a linha vai para elegível. Curto no bug e no P.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a pessoa, a sa-triar.triar.encaminhar e a sa-refinar.fatiar.proximos (sugestões), a sa-refinar.ajustar (fatia dividida ou editada) e o seguir do próprio fluxo. papel: nenhuma (os passos elm e ficha conferem especificador e produto). branch: nao. Aceita fatia ou bug em aceita ou elegível (é refinável até alguém puxar). Volta da especificação manual ('alterei FT-nnn'): vai direto ao passo elm, que segue pela sincronização. Vizinhos: nova → sa-triar.triar; em-andamento → sa-desenvolver.codificar (a descoberta atualiza a spec da própria fatia); épico a-moldar → sa-refinar.moldar; épico em-especificacao → sa-prd.prd; épico fatiado → sa-refinar.ajustar; sustentação → sa-atender.atender.
2. **regras** — Usa a sa-entrevistar.entrevistar: até 5 perguntas por rodada, cada uma com recomendação; os fatos do código vêm pela sa-pesquisar. Bug ou P: uma rodada curta (regra e exemplos). M ou G: Example Mapping (regras, exemplos e perguntas). Regra vale pela decisão de uma pessoa (trava decisao-da-pessoa) e vai para a tabela Decisões da ficha (D-nn | Decisão | Quem | Quando | Fonte).
3. **cenarios** — Cada exemplo aceito vira um cenário com id CT-nn, numerado na ficha (CT-01, CT-02…; fora da ficha, 'FT-nnn CT-nn'), no formato Dado · Quando · Então, com o Então verificável. O CT-nn é o id que o teste automatizado marca e que o CT.csv (sa-verificar) liga. Na fatia de épico, os cenários partem dos cenários do PRD que os artefatos afetados dela toca.
4. **cobre** — Lista os requisitos tocados, um por linha: '<sigla>-<id> · inclui | altera | exclui · versão de referência <AAAA-MM-DDTHH:MM>'. Requisito existente: <sigla>-<id do ELM>; a versão é o modificado_em do DOORS no bundle. Requisito novo: id provisório <sigla>-<EPnn | FTnnn>-nn (o do PRD na fatia de épico; o da própria fatia no item avulso), sem versão. Sem requisito tocado: 'nenhum requisito'. Sem ELM, o <sigla>-<EP | FT>-nn é o id definitivo e não há versão de referência. Vigente: specs arquivadas → bundle. Sem bundle, oferece a sa-elm.baixar. Bundle desatualizado (sincronizado_em anterior à última 'Publicação: publicada'): mostra a data e pergunta se baixa.
5. **elm** — Só com ELM e com os artefatos afetados tendo inclui, altera ou exclui. Pergunta a autonomia da especificação, que vale até o fim dela: IA supervisionada · IA autopilot · manual, e grava 'Especificação: <autonomia>' no cabeçalho da ficha. Chama a sa-especificar.elm com o especificador presente e a autonomia: ela monta a pasta elm/ dentro da pasta da spec (formato_spec: .kiro/specs/ft-<nnn>-<slug>/elm/ ou openspec/changes/ft-<nnn>-<slug>/elm/), aplica a trava artefato-exclusivo, baixa os originais pela sa-elm.baixar e grava o commit de referência, tudo direto na branch base pela fluxo/commit-na-branch-base.md. IA supervisionada ou IA autopilot: edita e aprova cada arquivo inteiro (HF, UC, REG, MSG, EL, GL). Manual: o especificador altera os artefatos direto no DOORS, e a skill encerra; na volta ('alterei', nesta ou em outra sessão), a sa-especificar.elm sincroniza e segue para a aprovação. Devolve aqui com os arquivos aprovados, pendentes e travados. Artefato travado: a ficha registra em Em aberto 'bloqueada por FT-mmm (<sigla>-<id>)', e a fatia espera a outra ser publicada ou cancelada. Sem o especificador na sessão: os artefatos afetados ficam gravados e o item segue aceita (DoR incompleta).
6. **duvidas** — Dúvida grande: spike pela sa-pesquisar ou protótipo pela sa-especificar.prototipo (só vale com a aprovação do cliente, pela trava aprovacao-do-cliente), que devolve aqui. Dúvida grande não faz o item virar épico. Regra sem fonte: entra em Em aberto da ficha ('<pergunta> · para <nome com produto> · Bloqueia: <CT-nn | a fatia>') e para só o que depende dela. Muitas regras ou mais que G: com corte possível, vai à sa-refinar.ajustar (dividir). Sem corte, vira épico: nasce a linha EP-nn a-moldar pela fluxo/captura.md, com 'veio de FT-nnn', a FT fica cancelada com 'virou EP-nn', e o trabalho segue na sa-refinar.moldar.
7. **ficha** — Grava .sabia/planejamento/fatias/FT-nnn-<slug>.md pelo padrão sa-refinar/ficha.md: '# FT-nnn · <título>', logo abaixo a linha 'Aprovado: <usuário> · <data>' de quem tem produto ('Aprovado: —' até lá), Tipo e Pai, e as seções Entrada (do tipo) · Objetivo (fatia de épico) · Regras · Cenários · Não muda · Artefatos afetados · Em aberto · Decisões (tabela D-nn | Decisão | Quem | Quando | Fonte) · DoR. Seção vazia fica só com o título. Qualquer mudança depois do Aprovado volta a linha para 'Aprovado: —' até o P.O. aprovar de novo. DoR (avisa, não trava): [ ] entrada mínima do tipo · [ ] cenários CT-nn com Então verificável · [ ] Artefatos afetados preenchidos ou 'nenhum requisito' · [ ] com ELM, arquivos de elm/ aprovados pelo especificador · [ ] nenhum artefato afetado bloqueado por outra fatia · [ ] nenhum Em aberto que bloqueie a fatia inteira · [ ] tamanho ≤ G · [ ] ficha aprovada pelo P.O. DoR completa: status elegível. Senão o item fica aceita, e uma elegível que perde um item da DoR volta a aceita. O tamanho da linha se atualiza se mudou. Ficha e linha vão num commit pela fluxo/commit-na-branch-base.md ('backlog: refinamento FT-nnn').
8. **seguir** — Elegível: diz 'elegível para puxar: sa-desenvolver.iniciar FT-nnn' (é outra tarefa: sugere sessão nova). Não elegível: lista o que falta na DoR. Depois oferece 'refinar o próximo?' na mesma sessão. Sim: volta à entrada com a próxima fatia ou bug aceita na ordem do backlog.md. Não: fim.

### sa-refinar.fatiar
PRD aprovado → tabela de fatias verticais com artefatos afetados e tamanho (o especificador com o Dev, fatos pela sa-pesquisar) → ok e ordem de quem tem produto → linhas aceita no backlog.md, fichas e o épico em fatiado, num commit → 'detalhar a primeira?'.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a sa-prd.prd ('seguir para o fatiamento?') e a pessoa ('fatiar o EP-04'). papel: nenhuma (o especificador propõe com o Dev; o passo perguntar confere produto). branch: nao. Aceita épico em em-especificacao com o prd.md na branch base aprovado ('Aprovado: <usuário> · <data>' de quem tem produto). PRD ausente ou sem aprovação: diz 'o PRD vem antes: sa-prd.prd' e para. Vizinhos: épico a-moldar → sa-refinar.moldar; épico fatiado → sa-refinar.ajustar; fatia ou bug → sa-refinar.detalhar.
2. **rascunho** — Lê o prd.md (requisitos, cenários e Decisões) e pede à sa-pesquisar os fatos do trecho de código tocado. Monta a tabela de fatias: id provisório (F1, F2…) · título · Artefatos afetados (os requisitos do PRD que a fatia toca: <sigla>-EPnn-nn no novo, <sigla>-<id do ELM> no existente, com inclui · altera · exclui) · tamanho P/M/G · depende de. Regras: cada fatia é vertical (ponta a ponta) e cabe em G; todo requisito do PRD fica em pelo menos uma fatia; duas fatias que alteram o mesmo artefato existente ficam em sequência (trava artefato-exclusivo).
3. **perguntar** — Mostra a tabela e ajusta até o ok de quem tem produto, que também ordena as fatias. Sem essa pessoa: mostra os nomes com produto e para sem gravar (o rascunho se refaz na próxima vez). Conceito do PRD que muda: vai à sa-prd.mudanca, e o fatiamento volta depois da nova aprovação. O ok não congela nada: a fatia segue editável pela sa-refinar.ajustar até alguém puxar.
4. **gravar** — Grava pela fluxo/commit-na-branch-base.md, num commit ('backlog: fatiamento EP-nn'). Cada fatia ganha uma linha logo abaixo da do épico, na ordem do P.O.: id FT-nnn (maior da série + 1, lido depois do pull), tipo fatia, status aceita, aceita_em, tamanho, pai EP-nn, relator do épico, ib vazia. Cada fatia ganha também a ficha (padrão sa-refinar/ficha.md), com Objetivo, artefatos afetados (sem versão de referência, que entra no detalhar), os cenários do PRD que ela cobre (os CT-nn se numeram no detalhar) e 'Aprovado: <usuário> · <data>' do P.O. O épico vai para fatiado.
5. **proximos** — Mostra as fatias gravadas, na ordem do P.O. Elas ainda passam pelo detalhar para chegar a elegível. Oferece 'detalhar a primeira?' (sa-refinar.detalhar) na mesma sessão. Não: fim.

### sa-refinar.ajustar
O P.O. mexe no backlog refinado até alguém puxar: ordenar, dividir, juntar, editar, cancelar a fatia ou o épico. Também absorve a mudança do PRD nas fatias atingidas. Mostra a prévia, grava num commit e pergunta 'mais algum ajuste?'.

1. **entrada** — Usa a fluxo/entrada.md. Quem chama: a pessoa, a sa-refinar.detalhar ('muitas regras' → dividir) e a sa-prd.mudanca, quando o PRD muda depois de fatiado (com as fatias atingidas pelos artefatos afetados). papel: produto (o P.O. decide cada mudança). branch: nao. Aceita fatia ou bug em aceita ou elegível, e épico em em-especificacao ou fatiado (para ordenar e cancelar). Vizinhos: nova → sa-triar.triar; fatia ou bug em-andamento → sa-desenvolver.codificar (a mudança vira descoberta na spec da própria fatia, e quem ajusta avisa o responsável da linha); épico a-moldar → sa-refinar.moldar; sustentação → sa-atender.atender.
2. **previa** — Mostra o que muda (linhas do backlog.md, fichas e pastas de spec) e só grava com o ok do P.O. Na mudança do PRD, lista as fatias com artefatos afetados atingidos e propõe o ajuste de cada uma (editar, dividir ou cancelar).
3. **ordenar** — Muda a posição das linhas no backlog.md, porque a ordem das linhas é a prioridade. A prioridade crítica é expedite e não depende da ordem.
4. **dividir** — A original fica com a primeira parte, e o id dela não muda. Cada outra parte nasce aceita pela fluxo/captura.md, com o mesmo tipo e pai, 'veio de FT-nnn' na obs, ficha própria e o seus artefatos afetados e cenários. O arquivo de elm/ do requisito que muda de fatia vai junto (git mv para a pasta da spec da nova). Vale também para fatia ou bug sem pai que veio do detalhar.
5. **juntar** — A primeira na ordem absorve as outras (Regras, Cenários renumerados, artefatos afetados e arquivos de elm/). As absorvidas ficam cancelada com 'virou FT-nnn'.
6. **editar** — Muda a ficha (regras, cenários, artefatos afetados) ou o tamanho. A mudança tira o 'Aprovado' da ficha até o P.O. aprovar de novo, e a DoR é refeita: o item que perde um ponto volta de elegível para aceita. Cenário novo em fatia não puxada: entra nela ou numa fatia nova do épico. Cenário novo em fatia já entregue: vira item novo pela fluxo/captura.md, com 'origem FT-nnn'.
7. **cancelar-fatia** — Status cancelada, obs 'motivo: <texto>'. A pasta da spec da fatia (com elm/), se existe na branch base, sai no mesmo commit (git rm), para não valer como vigente nem prender artefato. Se era a última fatia aberta do épico (aberta = não concluida nem cancelada): com alguma concluida, o épico fica concluido, com concluida_em = hoje; sem nenhuma concluida, o épico fica cancelado, obs 'motivo: fatias canceladas'.
8. **cancelar-epico** — Com fatia em-andamento: diz 'conclua ou cancele antes FT-…' e para. Senão: épico cancelado, obs 'motivo: <texto>'; as fatias abertas ficam cancelada, obs 'motivo: épico cancelado', e as pastas de spec delas saem (git rm). A pasta do épico fica. Depois, se a linha tem ib, oferece cancelar o IB pela sa-elm.finalizar.
9. **gravar** — Cada ajuste confirmado vai num commit pela fluxo/commit-na-branch-base.md ('backlog: refinamento <ids>'), com as linhas, as fichas e as pastas de spec que ele mexe.
10. **seguir** — Pergunta 'mais algum ajuste?'. Sim: volta à previa. Não: mostra as linhas mudadas e o próximo passo de cada uma (fatia nova ou editada → sa-refinar.detalhar) e encerra.

## sa-planejamento
Os ritos do ciclo, com políticas escritas: equipe.json e acordos.md, roadmap opcional, seleção com meta e virada no início do ciclo, reabastecimento com o ciclo aberto, review com a curadoria das Regras aprendidas e retrospectiva com dados. Todo estado vai direto na branch base por fluxo/commit-na-branch-base.md, com a regra de ouro: proposta na tela e 'ok' antes de gravar. O ELM fica fora do rito: a iteração é só oferecida (sa-elm.iteracao), e cancelar a tarefa do item que sai da sprint também (sa-elm.finalizar).

### sa-planejamento.inicial
Começo do projeto, ou rever a equipe e os acordos: equipe → acordos → roadmap (opcional) → 'seguir para o planejamento da sprint?'.

1. **entrada** — Começa por pedido direto ('monta o planejamento', 'acordos do time', 'rever a equipe'), pela oferta da sa-setup.configurar ou pela sa-planejamento.sprint quando faltam o equipe.json ou o acordos.md. Qualquer pessoa conduz. Lê .sabia/planejamento/equipe.json e acordos.md, se já existem. Com os dois existentes, mostra os dois e pergunta só o que mudou.
2. **equipe** — Propõe .sabia/planejamento/equipe.json com membros[] = {nome, usuario (usuário do GitLab: o autor do MR e o @dono no CODEOWNERS), elm_login (opcional, perguntado só se o sabia.md tem a seção ELM, lido só pela sa-elm), desenvolvedor, especificador, produto (booleanas), horas_semana, ausencias[{inicio, fim}] (AAAA-MM-DD), ativo}. Quem sai do time fica ativo: false e nunca é apagado. Valida contra o equipe.schema.json e avisa se nenhum membro ativo tem produto (ninguém aprovaria go/kill, PRD e ficha) ou se só um tem desenvolvedor (o revisor do MR precisa ser outro desenvolvedor). Grava junto com os acordos.
3. **acordos** — Propõe .sabia/planejamento/acordos.md como tabela Item | Acordo, com estas chaves: Timebox (<n> semanas; padrão 2) · WIP (<status>: <n>, com os status do backlog.md; padrão em-andamento e em-revisao) · SLE (opcional, <n> dias) · DoD (checklist) · Classes de serviço (expedite = prioridade crítica, puxada sem aprovação) · Reserva de capacidade (<n>% da capacidade em itens, reservada ao atendimento; padrão 20%) · Disjuntor do autopilot (tentativas <n> · tempo <h> · custo <créditos>) · Tamanhos (P = horas · M ≈ 1 dia · G = 2–3 dias; maior que G é épico) · Id no commit (sim | não) · CT no teste (sim | não). Com o 'ok', grava o equipe.json e o acordos.md por fluxo/commit-na-branch-base.md, commit 'planejamento: equipe e acordos'. Pedido de rever a equipe e os acordos: termina aqui e oferece 'seguir para o planejamento da sprint?' (sa-planejamento.sprint).
4. **roadmap** — Pergunta 'usa roadmap?'. Não → pula para o seguir. Sim → .sabia/planejamento/roadmap.md: tabela Release · Objetivo · Épicos · Previsão, com os épicos do backlog.md na ordem de valor e risco (maior incerteza mais cedo). O épico a-moldar aparece como 'a moldar (sa-refinar.moldar)'. A previsão vem da vazão. Com o 'ok', grava por fluxo/commit-na-branch-base.md, commit 'planejamento: roadmap'. O roadmap só muda por este fluxo, a pedido.
5. **seguir** — Oferece 'seguir para o planejamento da sprint?' na mesma sessão. Com o sim, segue para a sa-planejamento.sprint. Sem o sim, termina.

### sa-planejamento.sprint
Seleção do ciclo, no início ou no reabastecimento: virada (no início) → capacidade e reserva de capacidade → especificação → previsão pela ordem das linhas → responsáveis → meta → proposta → grava o sprint-<nn>.md (e o backlog.md dos itens tirados da sprint) → 'seguir para puxar o topo?'.

1. **entrada** — Começa por pedido direto ('planejar a sprint', 'reabastecer a sprint') ou pelo seguir da sa-planejamento.inicial ou da sa-planejamento.retrospectiva. Sem equipe.json ou acordos.md → oferece a sa-planejamento.inicial e para. A sprint aberta é o .sabia/planejamento/sprints/<pai>/sprint-<nn>.md de maior chave (não há campo Situação). Se não existe nenhum, ou se o de maior chave já passou da data de fim, é início do ciclo e vai para a virada. Se está dentro das datas, é reabastecimento: pula a virada, só acrescenta linhas e não muda a meta. Qualquer pessoa conduz, mas a ordem, a meta e o 'ok' são de quem tem produto. Sem a booleana, mostra a proposta, diz quem aprova (equipe.json) e não grava.
2. **virada** — Só no início do ciclo. Lista as linhas da sprint anterior (a de maior chave) cujo item ainda está aberto no backlog.md: especificação aberta é fatia ou bug em nova ou aceita, ou épico em a-moldar ou em-especificacao; desenvolvimento aberto é elegível ou em-andamento; atendimento aberto é nova ou em-andamento. Pergunta 'migrar para esta sprint?', por item ou todos. O migrado ganha na sprint nova uma linha igual (Item · Trabalho · Responsável · Tarefas) e entra primeiro na capacidade. O que não migra volta ao backlog com branch, ficha e pasta mantidas: o item em-andamento passa a elegível e o responsável fica; os outros status não mudam. Com ELM, oferece cancelar a tarefa do item que saiu (sa-elm.finalizar, só a tarefa; o IB fica) e mover os migrados para a iteração nova (sa-elm.iteracao). Linhas de itens concluídos, cancelados ou adiados não migram. A sprint anterior não é alterada; os números ficam para a retrospectiva. Sem sprint anterior, segue direto para a capacidade.
3. **capacidade** — A vazão é a média de itens de desenvolvimento concluídos nas últimas 3 sprints fechadas. Conta as linhas Trabalho = desenvolvimento cujo item tem concluida_em dentro das datas da sprint. Na primeira sprint, usa 1 item por desenvolvedor ativo por semana. A capacidade é essa vazão ajustada pela proporção das horas disponíveis (horas_semana × semanas menos as ausencias do equipe.json) sobre as horas sem ausências. A reserva de capacidade é o % do acordos.md aplicado à capacidade, em itens, e fica para o atendimento. Sobra para o desenvolvimento a capacidade menos a reserva de capacidade, e os migrados consomem essa sobra primeiro. Especificação não entra na vazão.
4. **especificacao** — Propõe as linhas Trabalho = especificação: fatias e bugs aceita que precisam do refinamento (sa-refinar.detalhar) e épicos a-moldar (sa-refinar.moldar) ou em-especificacao (sa-prd.prd), na ordem das linhas do backlog.md. Quem tem produto escolhe. Essas linhas não contam na vazão. Quando a ficha fica elegível, o item pode ser puxado, sem segundo encaixe.
5. **previsao** — Propõe as linhas Trabalho = desenvolvimento: itens elegível (fatia ou bug). Prioridade crítica vem primeiro, e depois vale a ordem das linhas do backlog.md, até a sobra da capacidade. Não entra 'adiada até <data>' antes da data. O item preso pela trava de artefato (sa-status.pendencias) entra com o aviso 'aguarda <FT> (artefato <id>)'. Também propõe as linhas Trabalho = atendimento, até a reserva de capacidade: itens sustentação nova ou em-andamento com prazo dentro da sprint. Os Devs dizem se cabe e quem tem produto decide. A DoR é só o checklist da ficha.
6. **responsaveis** — Pergunta se já há alguém definido para algum item ('FT-031: <usuario>'). Nunca aloca sozinho e só sugere pelo equipe.json se a pessoa pedir. O que fica sem dono entra com Responsável '—', e quem puxar vira o responsável (sa-desenvolver.iniciar, sa-atender.atender).
7. **meta** — Uma frase de resultado de negócio que os itens entregam juntos. É o compromisso do ciclo, e a seleção é previsão. No reabastecimento, a meta fica a mesma.
8. **proposta** — Mostra na tela: '<pai>/Sprint <nn> · <início> → <fim> · meta', a tabela Item · Título · Tipo · Tam. · Trabalho · Responsável (migrados primeiro), a Reserva de capacidade (<n> itens, <p>%) e a Capacidade (vazão prevista · migrados · sobra). <pai> é o ano de início (AAAA), e <nn> é a próxima sprint do ano (ano novo → 01). O início é o dia seguinte ao fim da anterior; sem anterior, pergunta a data. O fim vem do Timebox. 'ok' → gravar. Ajuste → mostra a proposta de novo. Sem o 'ok', nada é gravado.
9. **gravar** — Por fluxo/commit-na-branch-base.md, num commit só ('<pai>/Sprint <nn>: planejamento', ou ': reabastecimento'), grava o sprint-<nn>.md: cabeçalho '# <pai>/Sprint <nn> · AAAA-MM-DD → AAAA-MM-DD', '**Meta:**', '**Reserva de capacidade:** <n> itens (<p>%)', a tabela ## Itens (Item · Trabalho (especificação | desenvolvimento | atendimento) · Responsável · Tarefas) e as seções vazias ## Review e ## Retro. No reabastecimento, só acrescenta linhas. No mesmo commit vai o backlog.md dos itens que a virada tirou (em-andamento → elegível). A coluna Tarefas (DEV · ESP · ATD com o id do EWM) é preenchida depois, por quem puxa, pela sa-elm.item. Com ELM, oferece 'criar a iteração no EWM?' (sa-elm.iteracao), sem travar.
10. **seguir** — Oferece 'seguir para puxar o topo?' (sa-desenvolver.iniciar) na mesma sessão. Sem o sim, termina.

### sa-planejamento.review
Fim do ciclo, com os stakeholders presentes e sem travar: o que foi entregue, com a evidência do MR → retorno no sprint-<nn>.md → pedido novo pela captura → Regras aprendidas (curadoria das Lições aprendidas) → grava → 'seguir para a retrospectiva?'.

1. **entrada** — Começa por 'review da sprint'. A sprint é a aberta, ou a última fechada se a pessoa pedir. Não tem pré-condição de rito. Qualquer pessoa conduz, e o retorno é de quem está presente.
2. **rito** — Mostra os itens concluídos no ciclo: linhas desenvolvimento e atendimento cujo item tem concluida_em dentro das datas da sprint. Cada um aparece com o link do MR, onde está a evidência. Depois vêm os abertos, que vão para a virada do próximo planejamento. O retorno vai na ## Review do sprint-<nn>.md, uma linha por item concluído ('<id> · <retorno>', ou 'sem retorno'). Pedido novo vira linha 'nova' pela captura (fluxo/captura.md), com obs 'origem review <pai>/Sprint <nn>'. Item concluído não reabre: o pedido sobre ele também entra pela captura.
3. **regras aprendidas** — Lista as regras candidatas pela sa-status.licoes-aprendidas, que reúne as Lições aprendidas das fatias e da Sustentação concluídas no ciclo, já cruzadas com as Regras aprendidas do .sabia/sabia.md. Pergunta quais entram. Cada escolhida vira uma linha na seção Regras aprendidas do .sabia/sabia.md: '- <regra> · origem <FT-nnn | AT-nnn…> · AAAA-MM-DD'. A pessoa pode reescrever a regra antes do 'ok'. Nenhuma escolhida → segue.
4. **gravar** — Com o 'ok', grava a ## Review do sprint-<nn>.md e as Regras aprendidas do .sabia/sabia.md por fluxo/commit-na-branch-base.md, commit '<pai>/Sprint <nn>: review'. As linhas da captura seguem o fluxo/captura.md.
5. **seguir** — Oferece 'seguir para a retrospectiva?' (sa-planejamento.retrospectiva). Sem o sim, termina.

### sa-planejamento.retrospectiva
Independente da review: dados da sa-status → bom · melhorar · ações → números e fechamento da sprint → reserva de capacidade revista → grava → 'seguir para o planejamento da próxima?'. O que ficou em aberto é perguntado na virada.

1. **entrada** — Começa por 'retrospectiva' ou 'fechar a sprint'. A sprint é a aberta, ou a última fechada se ainda não tem ## Retro. Não exige a review antes. Qualquer pessoa conduz.
2. **dados** — Usa os números da sa-status.painel (WIP, vazão, lead time = concluida_em − iniciada_em, idade contra o SLE, reserva de capacidade consumida) e a lista da sa-status.pendencias (rastreio). Também mostra os itens que o disjuntor do autopilot devolveu no ciclo.
3. **retro** — Registra na ## Retro do sprint-<nn>.md: bom · melhorar · ações, cada ação com dono (usuario).
4. **fechar** — Na ## Retro, grava a linha 'Números: concluídas <n> (desenvolvimento) · atendimento <n> · meta atingida | não — <por quê> · lead time médio <d> dias'. A sprint não tem Situação: deixa de ser a aberta quando o próximo sprint-<nn>.md é gravado. Os itens em aberto ficam como estão até a virada (sa-planejamento.sprint.virada).
5. **reserva de capacidade** — Compara a reserva de capacidade consumida (as linhas de atendimento) com a reservada. Se ficou muito acima ou abaixo, propõe um novo % a quem tem produto, e o acordos.md só muda com o 'ok'.
6. **gravar** — Com o 'ok', grava o sprint-<nn>.md (e o acordos.md, se mudou) por fluxo/commit-na-branch-base.md, commit '<pai>/Sprint <nn>: retrospectiva'.
7. **seguir** — Oferece 'seguir para o planejamento da próxima sprint?' (sa-planejamento.sprint). Sem o sim, termina.

## sa-especificar
Ferramentas do especificador fora do PRD: o elm/ da fatia (original do DOORS, commit de referência, edição e aprovação do arquivo inteiro), o protótipo, a ATA de reunião e o archive da spec depois do merge. O PRD do épico é da sa-prd, o delta da spec é da sa-plano e a publicação no DOORS é da sa-elm.publicar. Tudo o que esta skill grava vai direto na branch base pelo fluxo/commit-na-branch-base.md. Não há MR de spec nem [ESP] obrigatória.

### sa-especificar.elm
Só com ELM. Prepara o texto oficial que a fatia muda. Para cada artefato afetado (HF, UC, REG, MSG, EL, GL), baixa o original do DOORS pela sa-elm, grava um commit de referência (original + versão de referência) na pasta elm/ da spec e, pela autonomia da ficha (Especificação), edita o arquivo inteiro (IA supervisionada ou IA autopilot) ou, no manual, sincroniza o que o especificador alterou direto no DOORS. O especificador aprova. O git mostra a diferença. É a fonte da publicação e o texto que a sa-plano copia para o delta. Substitui a sa-especificar.fatia da 2.0: sem MR, sem revisão P e sem publicar (no manual, o DOORS já tem o texto).

1. **entrada** — Quem chama: a sa-refinar.detalhar, quando os artefatos afetados têm inclui, altera ou exclui; o Dev, quando acha que o texto precisa mudar; ou um pedido direto ('editar o elm/ da FT-031'). Usa o fluxo/entrada.md. Não existe ou está nova → sa-triar.triar. Cancelada, ou concluida sem 'Publicação: pendente' → a mudança vira item novo pelo fluxo/captura.md. Épico → sa-prd.prd. Sustentação → não tem elm/: diz e para. Aceita fatia e bug em aceita, elegível ou em-andamento, e também concluida com 'Publicação: pendente', para refazer a mescla (passo conferir) do artefato que a publicação pulou, na pasta da spec (no OpenSpec, a arquivada); no fim, oferece a sa-elm.publicar. Sem a chave elm no agentes.json → 'sem ELM, o texto vai só ao delta' e devolve. Sem artefatos afetados → nada a fazer, devolve. Volta da especificação manual ('alterei FT-nnn', pela sa-refinar.detalhar ou direto) → passo sincronizar. Sem pessoa presente (subagente) → diz e para; no IA autopilot, o subagente só faz o passo editar.
2. **tarefa** — Se não há linha (item · especificação) no sprint-<nn>.md aberto, oferece acrescentá-la pelo fluxo/commit-na-branch-base.md e segue com qualquer resposta. 'Quer criar o item no ELM?' leva à sa-elm.item com a tarefa ESP. A resposta não muda o fluxo.
3. **pasta** — A pasta é <spec>/ft-<nnn>-<slug>/elm/. <spec> vem do formato_spec do agentes.json (.kiro/specs ou openspec/changes), e o slug vem da ficha. Se a pasta da spec ainda não existe, ela nasce aqui só com elm/, e a sa-desenvolver.iniciar a reaproveita. Na retomada, cada arquivo segue do ponto em que está: sem commit de referência → baixar; editado sem aprovação → conferir.
4. **trava** — Para cada altera ou exclui, procura o mesmo id no elm/ de outra fatia que ainda segura artefato (não cancelada no backlog.md e sem 'Publicação: publicada' no status.md) em .kiro/specs/*/elm/, openspec/changes/*/elm/ e openspec/changes/archive/*/elm/. A precedência é de quem gravou o arquivo primeiro na branch base, e a outra fatia segura o artefato até ficar cancelada ou com 'Publicação: publicada' (trava artefato-exclusivo). Artefato segurado: mostra a fatia dona, deixa aquele artefato de fora e segue com os outros. A sa-status mostra a trava.
5. **baixar** — Altera e exclui: pede à sa-elm.baixar (modo artefato) o texto inteiro, o título e o modificado_em pelo id e grava elm/<id do ELM>-<tipo>-<slug>.md com o frontmatter (type, title do DOORS, status: draft, sources com o próprio requisito) e o corpo. Inclui: cria EP<nn>-<nn>-<tipo>-<slug>.md ou FT<nnn>-<nn>-<tipo>-<slug>.md (ex.: EP03-01-REG-limite-saque.md), com o frontmatter em status: draft e o id provisório <sigla>-EP<nn>-<nn> ou <sigla>-FT<nnn>-<nn> (ex.: REG-EP03-01). Na fatia de épico, o id é o mesmo do prd.md. A versão de referência também vai à linha dos artefatos afetados da ficha.
6. **referencia** — Grava um commit só com os originais baixados, antes de qualquer edição, pelo fluxo/commit-na-branch-base.md ('FT-nnn elm: original <ids>'). O git mostra a diferença contra esse commit, e a versão de referência é conferida contra ele. O arquivo novo (inclui) não tem commit de referência.
7. **editar** — Pela autonomia da ficha. IA supervisionada: o especificador edita o arquivo inteiro, com o Dev, no estado depois. IA autopilot: o sa-especificador como subagente edita sem perguntas (sa-entrevistar sem pessoa: o que não tem fonte vai ao Em aberto da ficha com a recomendação), sem ELM e sem gravar na branch base; devolve os arquivos, e a sessão grava. Manual: não edita; diz 'altere no DOORS <ids>; avise com alterei FT-nnn' e encerra. No exclui, o texto fica e a Ação diz exclui. Edita só os artefatos afetados; outro que apareça entra nos artefatos afetados da ficha no mesmo commit. O tipo que tem skill de toolkit no prompt sai por ela. Cada sessão grava pelo fluxo/commit-na-branch-base.md ('FT-nnn elm: edita <ids>'), e a edição pode levar várias sessões.
8. **sincronizar** — Só no manual, na volta ('alterei', nesta ou em outra sessão). Para cada artefato afetado, pede à sa-elm.baixar (modo artefato) o texto atual e o modificado_em e regrava o arquivo de elm/: o diff contra o commit de referência mostra o que mudou. Altera: atualiza a Versão de referência no arquivo e na linha dos artefatos afetados. Inclui: pede o id do ELM que o especificador criou, baixa, renomeia para <id do ELM>-<tipo>-<slug>.md e troca o id provisório nos artefatos afetados e no prd.md do épico pai. Exclui: pergunta se foi para a lixeira. Grava o delta com o texto completo na pasta da spec (OpenSpec: specs/<cap>/spec.md com ADDED · MODIFIED · REMOVED; Kiro: requirements.md, bugfix.md no bug) e a linha '**Publicado:** manual <AAAA-MM-DD>' em cada arquivo, para a sa-elm.publicar não reenviar. Commit pelo fluxo/commit-na-branch-base.md ('FT-nnn elm: sincroniza <ids>') e segue para o aprovar; o conferir não roda, porque o arquivo já é o DOORS.
9. **conferir** — Antes de aprovar e em toda retomada (menos no arquivo com '**Publicado:** manual'), pede à sa-elm.baixar a versão atual de cada altera e exclui, sem gravar, e compara com a Versão de referência do commit de referência. Se mudou, mostra o que mudou no DOORS, e o especificador escolhe. Mesclar: novo commit de referência com o original atual e a nova Versão de referência, com a edição reaplicada por cima. Seguir: a sa-elm.publicar vai avisar e pular aquele artefato.
10. **aprovar** — Só quem tem especificador no equipe.json. Mostra a diferença de cada arquivo contra o commit de referência e pede o sim por arquivo. Aprovado → linha 'Aprovado: <usuário> · <AAAA-MM-DD>' no cabeçalho e commit pelo fluxo/commit-na-branch-base.md ('FT-nnn elm: aprova <ids>'). Ajuste → editar. Sem a booleana → lista os especificadores do equipe.json e para; os arquivos ficam editados, sem aprovação. Arquivo editado depois de aprovado perde a linha e volta a este passo.
11. **devolver** — Mostra os arquivos aprovados, os pendentes e os travados. Fatia em-andamento com texto aprovado de novo → avisa o responsável (coluna responsável do backlog.md) que a sa-plano.replanejar recopia o texto para o delta. Com tarefa ESP no sprint.md e tudo aprovado → 'finalizar a tarefa no ELM?' leva à sa-elm.finalizar. Devolve a quem chamou; no pedido direto, termina com o resumo.

### sa-especificar.prototipo
Opcional, para dúvida grande de tela no shaping, no refinamento ou no PRD. Registra a versão v<N> que o cliente vê (um arquivo, só com dado fictício) em .sabia/planejamento/prototipos/<id>-<slug>/ e grava a resposta do cliente no documento do item. Não condiciona o PRD: só a EL depende dele.

1. **entrada** — Quem chama: a sa-refinar.moldar, a sa-refinar.detalhar, a sa-prd.prd (escrever, EL com tela), a sa-prd.mudanca ou um pedido direto ('tenho o protótipo do EP-03', 'o cliente respondeu a v2'). Vale para épico, fatia ou bug. Não existe → sa-triar.triar. Concluido, concluida, cancelado ou cancelada → diz e para. O documento do item é o pitch.md (épico em a-moldar), o prd.md (épico depois do go) ou a ficha. Resposta do cliente a uma versão já registrada → aprovacao.
2. **registrar** — Em prototipos/<id>-<slug>/, os arquivos soltos (fora de uma pasta v<N>/) são a versão nova, com v<N> = a maior + 1 (a primeira é v1). Move-os para prototipos/<id>-<slug>/v<N>/. Aceita só arquivo (PDF, imagens, HTML exportado), nunca link. Confere com a pessoa que todo dado é fictício; dado real → não registra, pede outra versão e para. Grava no Em aberto do documento 'aprovação do cliente da v<N> · cliente · bloqueia: <ids das EL>' e faz o commit dos arquivos e do documento pelo fluxo/commit-na-branch-base.md. Nenhum arquivo novo → diz onde pôr e devolve.
3. **aprovacao** — Pergunta a resposta do cliente. Aprovado, só com quem, data, versão e evidência (ATA-<nn> ou e-mail) → linha na tabela Decisões (D-nn | Protótipo v<N> aprovado | <quem> | <data> | <evidência>), e a linha sai do Em aberto. Ajuste → a linha do Em aberto vira 'ajuste da v<N>: <pedido> · aguardando a v<N+1>'; se a versão nova já está na pasta, volta ao registrar. Aguardando → nada muda. Grava pelo fluxo/commit-na-branch-base.md. O e-mail fica com quem o recebeu.
4. **devolver** — Aprovado → devolve a quem chamou, que segue; se o prd.md já está aprovado e a EL muda, oferece a sa-prd.mudanca. Aguardando, ou ajuste sem a versão nova → devolve com 'aguardando o cliente'; a pendência fica no Em aberto e bloqueia só as EL. Pedido direto: termina com o resumo.

### sa-especificar.reuniao
Opcional. Transforma a transcrição de uma reunião em ATA aprovada (.sabia/planejamento/atas/) e leva as decisões à seção Decisões do documento do item. A transcrição nunca sai da máquina. Aqui nada vai ao ELM: a ATA sobe junto da publicação, sob pergunta da sa-elm.publicar.

1. **entrada** — Quem chama: um pedido direto de quem conduziu a reunião ('tenho a transcrição da reunião do EP-03') ou a oferta da sa-prd.prd, da sa-prd.mudanca, da sa-refinar.moldar ou da sa-refinar.detalhar. Precisa do item (EP-nn ou FT-nnn) não terminal (não existe → sa-triar.triar) e da transcrição em .sabia/local/reunioes/<id>-<AAAA-MM-DD>.<vtt|md>. Não exige [ESP]. ATA em rascunho para a mesma transcrição → aprovar.
2. **transcricao** — O script transcricao.py da skill converte o .vtt ou o .md em falas '[mm:ss] papel: fala' e grava <arquivo>.transcricao.md ao lado. Pergunta o papel de cada falante (nunca deduz) e roda de novo com --papel 'Nome=papel'. Código 1 (nenhuma fala reconhecida) ou 2 (arquivo, codificação ou --papel inválido) → mostra a mensagem e para.
3. **escrever** — Escreve o rascunho em .sabia/local/reunioes/, ao lado da transcrição, pelo padrão requisitos/padrao-ata.md ou pela skill de toolkit da ATA. Cabeçalho: Reunião (AAAA-MM-DD · duração · assunto) · Item · Aprovado (—). Seções: Participantes (nome · papel) · Pauta · Discussão (com [mm:ss]) · Decisões (tabela D-nn | Decisão | Quem | Quando | Fonte, com Quem = <nome> (<papel>) e Fonte = [mm:ss]) · Em aberto · Encaminhamentos (o quê · quem · até). Só entra o que a transcrição diz. Termo novo vai aos Encaminhamentos, não ao glossário.
4. **aprovar** — Mostra a ATA e pede o sim de quem conduziu a reunião. Sim → 'Aprovado: <usuário> · <AAAA-MM-DD>' no cabeçalho, e a ATA vai para .sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md, com <nn> = a maior + 1. Ajuste → escrever. Sem o sim → o rascunho fica em .sabia/local/reunioes/ e devolve.
5. **decisoes** — Cada decisão vira uma linha na tabela Decisões do documento do item (pitch.md antes do go, prd.md, ficha), com Fonte = ATA-<nn> [mm:ss]. O que ficou sem decisão vai ao Em aberto. Um commit leva a ATA e o documento, pelo fluxo/commit-na-branch-base.md ('<id> registrar ATA-<nn>').
6. **devolver** — Decisão que muda um prd.md aprovado → oferece a sa-prd.mudanca. Decisão que muda o texto do elm/ de uma fatia → oferece a sa-especificar.elm. Outra transcrição sem ATA → transcricao. Senão, devolve a quem chamou com as decisões gravadas; no pedido direto, termina com o resumo.

### sa-especificar.archive
Roda depois do merge do código, chamado pela sa-desenvolver.encerrar. No OpenSpec, arquiva a spec da fatia; no Kiro, a deixa no lugar. Com ELM, pergunta se publica no DOORS. Sem a booleana especificador, grava 'Publicação: pendente', e a sa-status mostra a pendência. Nunca trava.

1. **entrada** — Quem chama: a sa-desenvolver.encerrar, depois do registro na branch base e do 'finalizar a tarefa?', ou um pedido direto ('archive da FT-031') com o MR do item mergeado. Sem pasta da spec (trilha trivial) → nada a arquivar, devolve. Spec já arquivada (OpenSpec) ou com a linha Publicação no status.md → pula para o que falta.
2. **arquivar** — Segue o fluxo/commit-na-branch-base.md: base atualizada → comando → commit 'FT-nnn archive' → push com o sim. OpenSpec sem ELM: openspec archive ft-<nnn>-<slug> --yes, que funde o delta na especificação vigente. OpenSpec com ELM: openspec archive ft-<nnn>-<slug> --skip-specs --yes, porque a especificação vigente é o DOORS. Kiro: a pasta fica em .kiro/specs/, que é o vigente, e nada se move.
3. **publicar** — Só com ELM e algo a publicar: arquivos aprovados em elm/ sem '**Publicado:** manual' ou, onde a seção ELM do sabia.md mantém ET, a ET as-built do design.md. Arquivo de elm/ sem aprovação → avisa e fica de fora. Tudo já publicado no manual e nada mais a publicar → grava 'Publicação: publicada <AAAA-MM-DD>' no status.md, sem chamar a sa-elm.publicar. Quem tem especificador responde a 'publicar no DOORS?'. Sim → sa-elm.publicar: confere a versão, publica, renomeia os novos, troca o id provisório e grava 'Publicação: publicada <AAAA-MM-DD>' no status.md. Não, ou pessoa sem a booleana → grava 'Publicação: pendente' no status.md da spec (no OpenSpec, o arquivado) pelo fluxo/commit-na-branch-base.md e mostra os especificadores do equipe.json.
4. **devolver** — Mostra o que foi arquivado e a situação da publicação e devolve à sa-desenvolver.encerrar, que segue. No pedido direto, termina com o resumo.

## sa-prd
Skill do PRD do épico. Depois do go do P.O. no pitch.md (sa-refinar.moldar), escreve o prd.md direto na branch base, proporcional ao tamanho, e grava a aprovação do P.O. no próprio documento. Também muda o PRD aprovado e leva a mudança às fatias. Sem MR, sem [ESP] obrigatória e sem publicar: os requisitos sobem ao DOORS pelas fatias (sa-especificar.elm e sa-especificar.archive).

### sa-prd.prd
go no pitch.md → prd.md na pasta do épico → entender (sa-pesquisar) → esclarecer (sa-entrevistar) → similares → escrever → validar (avisa) → aprovação do P.O. gravada no prd.md → 'seguir para o fatiamento?' (sa-refinar.fatiar).

1. **entrada** — Quem chama: a sa-refinar.moldar no go ('seguir para o PRD?') ou um pedido direto ('escrever o PRD do EP-03', 'aprovar o PRD do EP-03'). Usa o fluxo/entrada.md. Não existe → sa-triar.triar. Tipo diferente de épico → 'PRD é só do épico' e sa-refinar.detalhar. Em a-moldar (sem go) → sa-refinar.moldar. Concluido ou cancelado → diz e para. Fatiado, ou prd.md já aprovado → pergunta: sa-prd.mudanca ou 'seguir para o fatiamento?'. Segue com em-especificacao: prd.md sem aprovação → retoma; pedido de aprovação → aprovar. Sem pessoa presente (subagente) → 'PRD é decisão de pessoa' e para.
2. **assumir** — Grava a pessoa (usuario do equipe.json) na coluna responsável da linha do épico. Se a linha é de outra pessoa, mostra de quem e só assume com o sim. Sem linha (EP-nn · especificação) no sprint-<nn>.md aberto, oferece acrescentá-la e segue com qualquer resposta. Com ELM, 'quer criar o item no ELM?' leva à sa-elm.item com a tarefa ESP. Tudo pelo fluxo/commit-na-branch-base.md.
3. **abrir** — Sem prd.md, cria .sabia/planejamento/epicos/EP-nn-<slug>/prd.md ao lado do pitch.md, pelo padrão sa-prd/prd.md, com '**Aprovado:** —' no topo. Seções: Problema · Objetivos e métricas · Atores · Requisitos · Não objetivos · Decisões · Em aberto · Mudanças (com a 1.0). Problema, limite de investimento e não objetivos partem do pitch.md. As decisões de antes do go ficam no pitch.md, e o PRD as cita.
4. **entender** — Lê o pitch.md e as decisões dele. Com a pessoa presente, pede pistas antes da busca. Os fatos vêm da sa-pesquisar.pesquisar (no subagente sa-pesquisador), só do trecho tocado: o vigente na ordem specs arquivadas → bundle → ELM ao vivo, o código, o GL (ou o glossario.md) e os ADRs.
5. **esclarecer** — Roda a sa-entrevistar.entrevistar sobre o épico, gravando nas seções Decisões e Em aberto do prd.md. Se há transcrição de reunião com o cliente, oferece a sa-especificar.reuniao (opcional). Depois segue para similares.
6. **similares** — Para cada requisito proposto, o vigente da busca define a ação. Inclui: requisito novo, com id provisório <sigla>-EP<nn>-<nn> (ex.: REG-EP03-01). Altera ou exclui: requisito existente, com <sigla>-<id do ELM> (sem ELM, o id da especificação vigente). Registra o impacto de cada altera e exclui. O existente só reutilizado é citado pelo id, sem ação. A versão de referência fica para os artefatos afetados da ficha.
7. **escrever** — Proporcional ao tamanho. Cada requisito é um bloco '### <sigla>-<id> · <título>' com a linha '**Tipo:** HF | UC | REG | MSG | EL | GL · **Ação:** inclui | altera | exclui', pelo padrão do tipo (sa-prd/hf · reg · el · gl). A EL só existe com tela (Telas = sim) e tem como fonte o protótipo aprovado; sem ele → sa-especificar.prototipo, e a EL fica no Em aberto, bloqueando só ela. Sem ET: ela é só as-built, no design.md. A HF traz os cenários Dado · Quando · Então do requisito, sem CT.csv; os CT-nn nascem na ficha. O tipo que tem skill de toolkit no prompt sai por ela. Nunca inventa regra, valor ou ator: sem fonte, vai ao Em aberto. Grava na branch base pelo fluxo/commit-na-branch-base.md a cada rodada ('EP-nn prd: <o quê>').
8. **validar** — Roda o sabia validar-spec (forma e ligações; avisa, não trava). A 'quer revisar agora?', aplica o checklist do padrão prd.md: seções preenchidas, todo requisito com id e ação, nenhuma regra sem fonte e todo em aberto com bloqueia. Achado que é decisão de negócio → esclarecer.
9. **aprovar** — Só quem tem produto no equipe.json. Mostra o prd.md e pede o sim. Sim → 'Aprovado: <usuário> · <AAAA-MM-DD>' no topo do prd.md e commit pelo fluxo/commit-na-branch-base.md ('EP-nn aprovar PRD'). Ajuste → escrever. Em aberto não impede a aprovação: bloqueia só o que depende dele. Sem a booleana → mostra quem tem produto e para. O P.O. aprova depois com 'aprovar o PRD do EP-nn', que entra direto neste passo.
10. **concluir** — Com tarefa ESP no sprint.md, 'finalizar a tarefa no ELM?' leva à sa-elm.finalizar, que oferece as horas. Oferece 'seguir para o fatiamento?' (sa-refinar.fatiar) na mesma sessão. O épico fica em em-especificacao até a sa-refinar.fatiar gravar fatiado. Os requisitos sobem ao DOORS pelas fatias (sa-especificar.elm e sa-especificar.archive), não daqui.

### sa-prd.mudanca
Muda o prd.md aprovado, antes ou depois de fatiar. Tira a aprovação, registra a versão em Mudanças e reescreve; o P.O. reaprova no documento, e a mudança chega às fatias atingidas (sa-refinar.ajustar, aviso ao responsável ou captura).

1. **entrada** — Quem chama: a sa-prd.prd (PRD já aprovado), a sa-refinar.fatiar (conceito do PRD muda), a sa-refinar.ajustar, a sa-especificar.reuniao ou a sa-especificar.prototipo (decisão ou versão que muda o PRD), ou um pedido direto ('mudar o PRD do EP-03'). Precisa de prd.md aprovado e de épico em em-especificacao ou fatiado. Concluido ou cancelado → o escopo novo vai pelo fluxo/captura.md (tipo épico ou fatia, obs 'veio de EP-nn') e para. Sem pessoa presente → diz e para.
2. **versao** — Tira a linha Aprovado do prd.md e acrescenta em Mudanças a linha Versão · Data · O que mudou · Origem (pedido, ATA-<nn>, protótipo v<N> ou FT-nnn). Commit pelo fluxo/commit-na-branch-base.md. Enquanto o PRD estiver sem aprovação, a sa-refinar.fatiar não grava fatias novas.
3. **editar** — Segue os passos similares, escrever e validar da sa-prd.prd só sobre o que muda, com os ids estáveis. Requisito que sai é marcado exclui, e o id dele nunca é reaproveitado.
4. **aprovar** — Igual ao aprovar da sa-prd.prd: só quem tem produto. A linha 'Aprovado: <usuário> · <AAAA-MM-DD>' volta ao topo, com commit 'EP-nn aprovar PRD v<N>'. Sem a booleana → mostra quem tem produto e para.
5. **fatias** — Lista as fatias do épico (pai = EP-nn) cujos artefatos afetados ou cenários citam os requisitos mudados. Nova, aceita ou elegível → oferece a sa-refinar.ajustar (atualizar ficha e artefatos afetados, dividir, juntar ou cancelar). Em-andamento → avisa o responsável (coluna responsável do backlog.md); com ELM, o texto do elm/ volta ao especificador pela sa-especificar.elm. Concluida → o que muda vira item novo pelo fluxo/captura.md, tipo fatia, pai EP-nn, obs 'veio de EP-nn v<N>'.
6. **devolver** — Devolve a quem chamou. No pedido direto, se há fatia atingida, oferece 'seguir para o ajuste das fatias?' (sa-refinar.ajustar); senão, termina com o resumo.

## sa-entrevistar
O esclarecer do Sabiá. Monta a árvore de decisões do trecho tocado, responde pela sa-pesquisar o que tem fonte e pergunta à pessoa só a regra de negócio, com até 5 perguntas por rodada e uma recomendação em cada uma. Grava nas seções Decisões e Em aberto do documento do item (pitch.md, prd.md ou ficha). Quem chama: a sa-refinar, a sa-prd, a sa-desenvolver ou um pedido direto; a triagem e a Sustentação não chamam.

### sa-entrevistar.entrevistar
Esclarecimento proporcional: árvore → rodadas (até 5 perguntas, com recomendação) → registrar no documento do item → linguagem → devolver o resumo. Vale a decisão de uma pessoa, com quem e quando. A lacuna de rotina vira suposição. O que fica em aberto bloqueia só o que depende dele.

1. **entrada** — Quem chama: a sa-refinar.moldar, a sa-refinar.detalhar, a sa-prd.prd, a sa-prd.mudanca, a sa-desenvolver.codificar (regra sem decisão) ou um pedido direto ('vamos alinhar o FT-031', 'responder o em aberto do EP-03'). Quem chama informa o item e o documento. Na chamada direta, o documento sai do id: pitch.md (épico em a-moldar), prd.md (épico depois do go) ou ficha (fatia ou bug). Sem pessoa presente (autopilot) → modo sem perguntas.
2. **arvore** — Monta a árvore só do trecho tocado. Lê as Decisões e o Em aberto já gravados e a ATA, se existir; para 'responder o em aberto', a árvore são as linhas do Em aberto. Com a pessoa presente, pede pistas antes da busca. O que tem fonte, responde sozinho com os fatos da sa-pesquisar.pesquisar: o vigente (specs arquivadas → bundle → ELM ao vivo), o código, os ADRs e o GL ou glossário. Separa a regra de negócio, que vai à pessoa, da lacuna de rotina, que vira suposição.
3. **rodadas** — Até 5 perguntas por rodada, numeradas e cada uma com a recomendação; o 'sim' aceita todas. Pergunta só regra de negócio e decisão sem fonte. A regra de negócio é decidida por quem tem produto ou pelo cliente em reunião. A decisão técnica entre alternativas equivalentes é do Dev e vai ao design.md, não aqui. Resposta que abre ramos → nova rodada. O fluxo termina com a fronteira vazia e o entendimento confirmado, ou quando a pessoa diz 'chega'; o resto vai ao Em aberto. Sem pessoa presente, não pergunta: tudo sem fonte vai ao Em aberto com a recomendação, e quem chamou não trata recomendação como decisão.
4. **registrar** — Só por acréscimo, no documento do item. Em Decisões: uma linha na tabela D-nn | Decisão | Quem | Quando | Fonte, com o próximo D-nn do documento; a suposição leva Quem = 'suposição'. Em Em aberto: pergunta · para quem · bloqueia (ids de requisito ou de fatia; '—' = nada). O em aberto respondido sai do Em aberto e entra em Decisões. Quando outra skill chama, ela grava junto com o documento dela. Na chamada direta, grava pelo fluxo/commit-na-branch-base.md.
5. **linguagem** — Com ELM e o termo no GL do DOORS, cita o GL. Mudar ou criar um GL entra nos artefatos afetados da ficha (GL · altera ou inclui) e vai ao texto oficial pela sa-especificar.elm. Sem ELM, usa o glossario.md opcional (chave glossario do agentes.json; null = não usa), com as colunas Termo · Definição · Evitar, gravado pelo fluxo/commit-na-branch-base.md. Termo novo não é exigido.
6. **devolver** — Chamada por outra skill → devolve o resumo (decisões, suposições e em aberto com o que bloqueia) sem oferta, e quem chamou segue. Chamada direta → mostra o resumo e termina.

## sa-desenvolver
O ciclo de quem desenvolve uma fatia ou um bug (FT-nnn), do puxar ao merge, no sa-desenvolvedor. iniciar: assumir num passo só (tamanho, trilha trivial · rápida · completo e a autonomia: IA supervisionada · IA autopilot · manual, fixa até o fim), atribuição na branch base, branch e pasta da spec. codificar: TDD com backpressure (no manual, só o código-fonte é da pessoa; no 'terminei', segue do validar), revisão do agente no subagente sa-revisor e verificação do agente no subagente sa-verificador, MR com evidência e artefatos afetados. encerrar: merge com 1 aprovação de desenvolvedor ≠ autor e CI verde, concluida na branch base, épico concluido na última fatia e archive da spec. Autonomia ∈ IA supervisionada · IA autopilot · manual. No autopilot, o plano e o código rodam no sa-desenvolvedor como subagente na worktree. Chama sa-plano.plano (rápida e completo), sa-revisar.revisar, sa-verificar.verificar e sa-especificar.archive. Só oferece a sa-elm. Absorve a sa-codificar e a sa-orquestrar.

### sa-desenvolver.iniciar
Quem chama: pedido da pessoa ('vamos trabalhar na FT-031', 'próxima') ou o 'seguir' da sa-status. Pré-condição: fatia ou bug na sprint aberta com status elegível (ou prioridade crítica), e a pessoa com a booleana desenvolvedor. Ordem: conferir → trilha e autonomia (tamanho, trilha, quem codifica) → atribuição na branch base (em-andamento) → branch → pasta da spec e status.md (só rápida e completo) → push → oferta do ELM. Fim: 'seguir?' para sa-plano.plano (rápida e completo) ou sa-desenvolver.codificar (trivial); no autopilot, o sa-desenvolvedor como subagente na worktree; no manual, a sessão encerra (na rápida e no completo, depois do plano) e a volta entra no validar da sa-desenvolver.codificar.

1. **entrada** — Inclui fluxo/entrada.md, que trata: item inexistente, item terminal (concluida, cancelada), 'adiada até <data>' (o passo adiada da entrada comum) e branch <id> de outra pessoa (regra de atribuição da entrada comum). Este fluxo atende fatia ou bug sem branch <id> publicada. Vizinhos: tipo sustentação → sa-atender.atender. Tipo épico → 'sa-status <id>' mostra a fase e o dono. Status nova → sa-triar.triar. Status em-andamento com branch <id> publicada → sa-desenvolver.codificar. Pedido em texto sem id → passo captura. 'Próxima' sem id: pega o primeiro item do sprint-<nn>.md aberto com Trabalho desenvolvimento, status elegível e sem Responsável. Se não houver: 'o topo está vazio; o reabastecimento é do P.O. (sa-planejamento.sprint)', e o fluxo para.
2. **captura** — Pedido em texto ou defeito sem id: inclui fluxo/captura.md, que grava a linha nova com o tipo (fatia ou bug), o id FT-nnn (o maior da série no backlog.md + 1, lido depois do pull), o relator e 'origem <...>' na obs, mais a ficha mínima. Mostra o id e oferece 'seguir para a triagem?' (sa-triar.triar). O fluxo termina aqui.
3. **papel** — Confere no equipe.json, pelo usuario (login do GitLab), a booleana desenvolvedor. Sem ela, diz 'puxar para desenvolvimento exige a booleana desenvolvedor' e para.
4. **sprint e expedite** — O item precisa ter linha no sprint-<nn>.md aberto com Trabalho desenvolvimento. Fora da sprint com prioridade crítica: entra como expedite, pela política do acordos.md, sem aprovação do P.O., e a linha da sprint nasce no passo atribuição. Fora da sprint sem prioridade crítica: diz 'não está na sprint; o reabastecimento é do P.O. (sa-planejamento.sprint)' e para.
5. **DoR** — Status elegível: segue. Status aceita (ainda não refinado): mostra o que falta no checklist DoR da ficha e oferece sa-refinar.detalhar. Só segue com o 'sim' de quem puxa.
6. **WIP** — Conta o WIP por coluna do acordos.md, com os valores do status (em-andamento; em-revisao é derivado do MR aberto), e os MRs parados. Se estiver acima do limite, mostra e recomenda destravar (revisar um MR) antes de puxar. Não trava.
7. **artefato em uso** — Só com ELM. Se a trava artefato-exclusivo (fluxo/travas.json) prende o item, isto é, um <sigla>-<id> com altera ou exclui nos artefatos afetados está no elm/ de outra fatia que tem a precedência (sa-status.painel.trava de artefato), diz 'FT-<x> tem o mesmo <sigla>-<id>; espere ela ser publicada ou cancelada' e para.
8. **registro publicado** — Roda git fetch e confere que a linha do item e a ficha estão em origin/<branch_base>. Se estão só no local, pede antes o push pelo fluxo/commit-na-branch-base.md. Sem remoto, a branch base local vale.
9. **trilha e autonomia** — Assumir a tarefa, num passo só. Quem pega lê o código do trecho tocado e confirma três coisas. Tamanho: o triado (P · M · G), que pode corrigir; o corrigido vai à linha do backlog.md no commit da atribuição. Mais que G vira épico: pelo fluxo/commit-na-branch-base.md nasce a linha EP-nn (tipo épico, status a-moldar, obs 'veio de FT-nnn') e a FT fica 'cancelada' com obs 'virou EP-nn'; com ELM, oferece cancelar a tarefa (sa-elm.finalizar); oferece 'seguir para o pitch?' (sa-refinar.moldar), e o fluxo termina. Trilha: trivial (mudança pequena sem artefatos afetados, sem nenhum arquivo de spec, tudo no MR) · rápida (mudança média ou com artefatos afetados) · completo (desenho novo ou risco); com artefatos afetados a trilha nunca é trivial, porque o delta é obrigatório. Autonomia: IA supervisionada (o sa-desenvolvedor na sessão da pessoa) · IA autopilot (o sa-desenvolvedor como subagente na worktree) · manual (só a geração do código-fonte é da pessoa; status.md, branch e plano seguem como sempre), gravada com o mesmo nome. A autonomia vale até o fim da tarefa: não troca no meio.
10. **atribuição na branch base** — Pelo fluxo/commit-na-branch-base.md, num commit pequeno '<FT> iniciar'. No backlog.md: status em-andamento, responsável = usuario, iniciada_em = hoje (AAAA-MM-DD) e o tamanho, se foi corrigido no passo trilha e autonomia. No sprint-<nn>.md: Responsável na linha Item · desenvolvimento (no expedite, acrescenta essa linha). Se o push for recusado, ou se depois do pull a linha já estiver em-andamento, outra pessoa pegou o item: mostra quem e para.
11. **branch** — Sugere a branch <prefixo_branch do agentes.json>ft-<nnn>-<slug>, com o slug da ficha, e espera o ok. IA supervisionada e manual: git fetch e git switch -c <branch> origin/<branch_base>. Autopilot: git worktree add -b <branch> .sabia/local/wt/<id> origin/<branch_base>, e a pessoa continua na branch base. Sem remoto, a branch sai da branch base local.
12. **pasta e status.md** — Só nas trilhas rápida e completo. A pasta segue o formato_spec do agentes.json: .kiro/specs/ft-<nnn>-<slug>/ no Kiro, openspec/changes/ft-<nnn>-<slug>/ no OpenSpec. Se a pasta já existe na branch base (elm/ criado no refinamento), reaproveita. Grava o status.md pelo padrão sa-desenvolver/status.md: Trilha, Autonomia, Fase — (fica assim até o plano ser aprovado), MR —, Desvios, Em aberto, Lições aprendidas e Retomar ('feito: iniciada · próximo: sa-plano.plano'). Só no Kiro: .config.kiro com specType feature (bugfix no bug da trilha rápida) e o workflowType da trilha. Na trilha trivial, este passo não faz nada.
13. **commit e push** — Commit do status.md e do .config.kiro (rápida e completo). Push da branch (git push -u origin <branch>) com o 'sim'; no trivial a branch vai sem commit novo. É o push que mostra a atribuição ao time e à sa-status. Se a resposta for 'não', a branch fica só local: avisa que ninguém vê a atribuição e segue.
14. **ELM** — Só se o ELM estiver configurado (chave elm do agentes.json): pergunta 'quer criar o item no ELM?' e, com sim, chama sa-elm.item (tarefa DEV), que volta para cá. Sem ELM, não pergunta. A resposta não muda o fluxo.
15. **seguir** — Mostra o resumo '🚦 FT-nnn — título · tamanho · trilha · autonomia · branch · pasta'. IA supervisionada: oferece 'seguir?' na mesma sessão, para sa-plano.plano (rápida e completo) ou sa-desenvolver.codificar (trivial). Manual: na rápida e no completo, oferece a sa-plano.plano como na IA supervisionada, e ela encerra a sessão depois do plano aprovado; no trivial, diz 'codificação manual; avise quando terminar' e encerra a sessão. Na volta ('terminei', nesta ou em outra sessão), a sa-desenvolver.codificar segue do que vem depois da codificação (validar). Autopilot: vai para o passo autopilot.
16. **autopilot** — Lança o sa-desenvolvedor como subagente na worktree .sabia/local/wt/<id> com o id, a trilha e o teto do disjuntor (acordos.md). Ele roda sa-plano.plano (rápida e completo) e depois sa-desenvolver.codificar, até o MR aberto. Os comandos rodam sempre como 'cd .sabia/local/wt/<id> && <comando>', e os arquivos são acessados pelo caminho da worktree. Liberado: push da própria branch (sem --force), merge da branch base nela e abrir ou atualizar o MR dela. Bloqueado: merge do MR, ELM e rede. Os contadores ficam em .sabia/local/loop-<id>.md. A pessoa fica livre na branch base e pode puxar outro item: várias tarefas em paralelo, sem lote. O fluxo termina aqui. O subagente devolve à pessoa no fim do codificar ou quando o disjuntor dispara.

### sa-desenvolver.codificar
Quem chama: sa-desenvolver.iniciar (trivial), sa-plano.plano (plano aprovado), o sa-desenvolvedor como subagente do autopilot, a volta da codificação manual ('terminei', nesta ou em outra sessão) ou um pedido ('retoma a FT-031', 'corrige os achados do MR'). Pré-condição: item em-andamento com branch <id>, e plano aprovado (Fase implementando ou retrabalho) ou trilha trivial. Ordem: preparar → tarefas TDD com backpressure → atualizar com a branch base → validar (suíte completa) → revisar (sa-revisar.revisar no sa-revisor) → verificar (sa-verificar.verificar no sa-verificador) → lições aprendidas → MR. A volta do manual entra no validar, com as mesmas validações. Fim: avisa o revisor e oferece 'seguir?' para o merge. No autopilot, o MR aberto ou o disjuntor devolve o item à pessoa.

1. **entrada** — Inclui fluxo/entrada.md, com a atribuição pela branch <id> (regra de atribuição da entrada comum). Vizinhos: sem branch <id> → sa-desenvolver.iniciar. Rápida ou completo com Fase — (plano não aprovado) → sa-plano.plano. MR aprovado com CI verde, ou MR já mergeado → sa-desenvolver.encerrar. Na retomada, lê o Retomar do status.md (no trivial, o MR ou o último commit) e segue do passo indicado. Volta da codificação manual ('terminei'): segue do passo validar, e dali em diante roda como na IA supervisionada (a pessoa decide e dá o sim). A autonomia do status.md vale até o fim da tarefa: pedido de trocar no meio → diz isso e segue na autonomia atual.
2. **ler antes** — Lê: o tasks.md (rápida e completo; no Kiro, o da Quick Spec, da Bugfix Spec ou da spec completa), o design.md onde existe, o delta com o texto completo dos requisitos tocados, o research.md, a ficha (cenários CT-nn), os Comandos de build e teste do .sabia/sabia.md e as Regras aprendidas do .sabia/sabia.md. No trivial: o pedido e a ficha, se houver. Não lê o ELM, porque o delta já traz o texto.
3. **preparar** — Confere: branch <id> (no autopilot, a worktree), árvore limpa e git pull --ff-only da própria branch. O baseline é o último pipeline da branch base; sem CI, a suíte local rodada antes de mexer. Teste vermelho herdado entra no baseline e não bloqueia. A regra é que nenhum teste verde fique vermelho.
4. **retrabalho** — Vale quando o MR está aberto com thread não resolvida, CI vermelho ou conflito. Grava Fase retrabalho. Cada achado triado como 'corrige' na sa-revisar.mr vira uma tarefa [R<n>] no tasks.md; no trivial, corrige direto. Os outros destinos já saíram na triagem. Conflito se resolve por merge da branch base (git merge origin/<branch_base>), nunca por rebase. No fim, o mesmo MR é atualizado.
5. **tarefa** — Uma tarefa por vez; no trivial, a mudança pedida é a tarefa única. Ciclo: teste pelo ponto de teste do design.md, vermelho pelo motivo certo, verde, arrumar. O teste de um cenário leva o CT-nn no nome. Defeito: teste que reproduz e correção no mesmo ciclo. Nunca se enfraquece teste. Backpressure a cada alteração: compila e roda os testes do trecho tocado (Comandos do .sabia/sabia.md); lint e cobertura não rodam por tarefa. Depois marca a tarefa no tasks.md, atualiza o Retomar e faz um commit pequeno. O id da tarefa do ELM entra na mensagem só se o acordos.md pedir. Refatoração preparatória só como tarefa do plano, em commit separado. O toolkit é transparente, pela configuração do agente, e o resultado é conferido com git status. Grava Fase implementando. Se restar tarefa, repete o passo.
6. **desvio** — Desvio leve: corrige, registra em Desvios e segue. Melhoria ou trabalho fora do escopo: inclui fluxo/captura.md (linha nova com obs 'origem FT-nnn'). Regra sem decisão: Em aberto ao P.O. com 'bloqueia: <tarefa>', e para só essa tarefa. Texto do requisito aprovado precisa mudar: Em aberto ao especificador; a tarefa espera o texto novo, que a sa-plano.replanejar copia. Mudança arquitetural ou irreversível: para e pergunta, depois vai à sa-plano.replanejar. No autopilot, esse último caso devolve à pessoa.
7. **banco** — Banco só em leitura. DDL necessária: inclui fluxo/captura.md com tipo sustentação, série BD-nnn e obs 'origem FT-nnn'. O Em aberto 'BD-nnn' bloqueia só as tarefas que dependem da DDL.
8. **sem progresso** — Duas correções seguidas sem progresso, ou contexto cheio: grava o Retomar, faz commit e sugere sessão nova. No autopilot, conta como tentativa no disjuntor.
9. **atualizar com a branch base** — Roda git fetch. Se a branch está atrás da branch base, faz git merge origin/<branch_base>: fora do autopilot com o 'sim', no autopilot liberado. Conflito: resolve e roda o backpressure do trecho. Nunca rebase.
10. **validar** — Na volta do manual, primeiro compila, roda os testes do trecho tocado e confere um teste com o CT-nn para cada cenário. Cobrir testes e cenários é de quem codificou: a skill aponta o que falta e não trava. Depois, em toda autonomia, roda a suíte completa uma vez: push da branch e o pipeline dela (sem CI, localmente), comparado com o baseline, e a cobertura como o acordos.md ou o pipeline pedem. Vermelho novo vira tarefa nova e volta ao passo tarefa (no manual, vai a quem codificou, que avisa de novo). Falha de ambiente: registra ⚠️ no Retomar; fora do autopilot a pessoa decide, no autopilot devolve à pessoa.
11. **revisar** — Grava Fase revisando. Chama sa-revisar.revisar (critérios de revisão C: spec · padrões · segurança) no subagente sa-revisor, com os critérios de revisão do toolkit. É revisão do agente, sem valor de revisão oficial. Cada achado tem severidade BLOQUEANTE, IMPORTANTE ou SUGESTÃO e é triado. corrige: vira tarefa [R<n>] e volta ao passo tarefa. adia: fluxo/captura.md. volta-plano: sa-plano.replanejar. volta-spec: Em aberto ao especificador. descarta: o motivo vai no MR. Fora do autopilot, a pessoa tria; no autopilot, segue a recomendação do revisor e registra em Desvios. Sem BLOQUEANTE aberto, vai ao passo verificar.
12. **verificar** — Grava Fase verificando. Chama sa-verificar.verificar no subagente sa-verificador: ele sobe a aplicação, exercita os cenários pela URL de teste e devolve o bloco 🔎. Por cenário: ✅ aceito, ❌ rejeitado, ⚠️ ambiente ou 🔁 possível alteração. Fecho: ACEITO, REJEITADO ou AMBIENTE. Rápida e completo: o verificador grava o CT.csv. Trivial: só a evidência, que vai para o MR. ❌ vira tarefa. 🔁 vira Em aberto ao especificador. AMBIENTE: fora do autopilot a pessoa decide, no autopilot devolve à pessoa. ACEITO: vai ao passo lições aprendidas.
13. **disjuntor** — Só no autopilot. A cada etapa, atualiza .sabia/local/loop-<id>.md (tentativas · tempo · custo · reprovações seguidas). Dispara no teto do acordos.md ou em 2 reprovações seguidas na mesma etapa (revisar ou verificar). Então para, grava o motivo e o Retomar, faz commit e push da branch e devolve à pessoa com o resumo. A pessoa resolve o motivo na worktree e relança o autopilot, que zera as reprovações; a autonomia não muda.
14. **lições aprendidas** — Antes do MR, grava as lições aprendidas da fatia na seção Lições aprendidas do status.md, uma linha por lição (lição · regra proposta). No trivial, ficam na seção Lições aprendidas do MR. A curadoria acontece na review do ciclo (sa-planejamento.review).
15. **ADR e as-built** — Decisão que atravessa fatias (banco, framework, integração) vira ADR em docs/adr/NNNN-<titulo>.md, no próprio MR. As outras decisões ficam no design.md. Onde o projeto mantém ET (seção ELM do sabia.md), o design.md fica as-built no MR, e a publicação é do archive.
16. **MR** — Escreve o texto pelo padrão sa-desenvolver/pr.md, ou pelo .gitlab/merge_request_templates/Default.md do projeto. Título '<ID> — <título>'. Seções: O quê · Porquê · Evidência (CI, 🔎, revisão do agente) · Risco (Reversível?, DDL pendente BD-nnn, ADRs) · Foco (como ler) · Artefatos afetados · Lições aprendidas (só no trivial). Entrega, nesta ordem: commit com a árvore limpa; push da branch (com o 'sim'; liberado no autopilot); conferência no remoto (HEAD = origin/<branch>); MR pelo gitlabpr. Se o MR já existe (retrabalho), o push já o atualizou; senão, gitlab_criar_mr. Sem o MCP, a pessoa abre o MR e passa o link. No status.md: Fase pr-aberto, MR <link> e Retomar; depois commit e push.
17. **avisar e seguir** — Avisa que o MR espera a revisão de qualquer desenvolvedor ≠ autor pela sa-revisar.mr, com o dono por área no CODEOWNERS. Com risco alto, sugere a revisão humana (sa-verificar.revisao-humana). Fora do autopilot, com ELM: pergunta 'deseja lançar horas?' e, com sim, chama sa-elm.horas. Fora do autopilot: se o MR já está aprovado com CI verde, oferece 'seguir para o merge?' (sa-desenvolver.encerrar); senão, o fluxo termina esperando a revisão. Autopilot: devolve à pessoa o link do MR, os Desvios e os Em aberto; as perguntas do ELM ficam para o encerrar.

### sa-desenvolver.encerrar
Quem chama: pedido do autor ('mergeia a FT-031', 'o MR foi aprovado'), sa-desenvolver.codificar ou um MR já mergeado (auto-merge ou UI). Pré-condição: MR da branch <id> com 1 aprovação de desenvolvedor ≠ autor e CI verde. Ordem: ler o MR → 'mergear?' → conferir merged → concluida na branch base (mais concluido no épico, se for a última fatia) → 'finalizar a tarefa?' (sa-elm) → archive (sa-especificar.archive) → worktree. Fim: 'seguir para a próxima?'.

1. **entrada** — Inclui fluxo/entrada.md. O merge é do autor do MR; outra pessoa segue a regra de atribuição da entrada comum. Vizinhos: sem MR → sa-desenvolver.codificar. MR sem aprovação → espera a sa-revisar.mr. MR com CI vermelho ou thread aberta → sa-desenvolver.codificar (retrabalho). Item já concluida no backlog.md: se a spec já foi arquivada, diz que não há nada a fazer e oferece o passo seguir; se não foi, vai ao passo archive. MR já mergeado: vai ao passo conferir merged.
2. **ler o MR** — Lê o MR com gitlab_obter_mr pelo link do status.md (no trivial, pela branch). Precisa estar aberto, sem Draft e sem conflito. Conflito: grava 'conflito com a branch base' no Retomar e vai à sa-desenvolver.codificar (retrabalho). Fechado sem merge: avisa e para. Sem o MCP, a pessoa confere na UI e diz.
3. **aprovação e CI** — Confere no MR 1 aprovação vigente de um desenvolvedor ≠ autor (booleana desenvolvedor no equipe.json) e o pipeline verde no último commit. Sem o MCP do Jenkins, a pessoa confere. Se faltar algo, diz o que falta e para.
4. **mergear?** — Mostra '🔀 Merge FT-nnn — título · MR !<iid> · aprovado por <usuario> · CI verde' e pergunta 'Mergear?' (o merge está em ask). Com auto-merge, se o time usa, a pergunta não é feita.
5. **merge** — Roda gitlab_mesclar_mr com remover_origem. Sem o MCP ou sem permissão, a pessoa faz o merge na UI, sem o botão Rebase, e diz 'mergeado'.
6. **conferir merged** — Confere o estado merged no GitLab. Sem o MCP: git fetch e diff vazio entre origin/<branch_base> e a branch nos arquivos da fatia. Se não foi mergeado, para.
7. **concluida na branch base** — Pelo fluxo/commit-na-branch-base.md, commit '<FT> concluir': no backlog.md, status concluida e concluida_em = data do merge. Fatia ou bug com pai EP-nn: se o épico está fatiado e não resta nenhuma outra fatia ou bug dele aberto (nova, aceita, elegível, em-andamento ou adiada), grava também concluido na linha do épico, no mesmo commit.
8. **finalizar a tarefa** — Só com ELM configurado: pergunta 'finalizar a tarefa no ELM?' e, com sim, chama sa-elm.finalizar, que oferece as horas e, na última fatia, a conclusão do IB do épico, e depois volta para cá. Com qualquer resposta, o fluxo segue.
9. **archive** — Rápida e completo: chama sa-especificar.archive na branch base, e ela volta para cá. Sem ELM: no OpenSpec, 'openspec archive <ft> --yes' funde o delta na especificação vigente; no Kiro, as specs em .kiro/specs/ continuam sendo o vigente. Com ELM: no OpenSpec, 'openspec archive <ft> --skip-specs --yes', e depois a pergunta 'publicar no DOORS?'. Quem tem a booleana especificador roda sa-elm.publicar; sem ela, o archive grava 'Publicação: pendente' no status.md arquivado. Trivial: não há spec, nada a arquivar.
10. **worktree** — Só se o item passou pelo autopilot: git worktree remove .sabia/local/wt/<id>, sem --force, com o 'sim', e apaga .sabia/local/loop-<id>.md. Se a worktree tiver arquivos alterados, mostra quais e a pessoa decide.
11. **seguir** — Mostra o resumo: merge, concluida, épico concluido (se for o caso) e publicação. Oferece 'seguir para a próxima?', que vai à sa-desenvolver.iniciar com o próximo item do topo da sprint. O fluxo termina.

## sa-plano
O plano da fatia nas trilhas rápida e completo; o trivial não passa por aqui. Faz a pesquisa (pela sa-pesquisar) e grava o research.md, toma as decisões técnicas, copia o texto aprovado para o delta e escreve design e tasks pela matriz trilha × formato. Quem desenvolve aprova o próprio plano; no autopilot, o subagente aprova e registra. Chamada por sa-desenvolver.iniciar, pelo subagente do autopilot e por sa-desenvolver.codificar (replanejar).

### sa-plano.plano
Quem chama: sa-desenvolver.iniciar (seguir), o subagente do autopilot ou um pedido ('planeja a FT-031'). Pré-condição: item em-andamento, branch <id>, pasta da spec com status.md, trilha rápida ou completo e Fase —. Ordem: ler → texto aprovado → pesquisa → decisões → delta → escrever pela matriz → 'quer revisar agora?' → aprovar. Fim: 'seguir para sa-desenvolver.codificar?' na mesma sessão; no manual, encerra a sessão com o Retomar.

1. **entrada** — Inclui fluxo/entrada.md, com a atribuição pela branch <id>. Vizinhos: trilha trivial → sa-desenvolver.codificar. Sem branch ou sem pasta → sa-desenvolver.iniciar. Fase diferente de — (plano já aprovado) → sa-desenvolver.codificar. Mudança num plano já aprovado → sa-plano.replanejar.
2. **ler** — Lê o status.md (trilha e autonomia), a ficha (regras, cenários CT-nn, artefatos afetados com a versão de referência, linha Aprovado), o elm/ da pasta (com ELM), o prd.md do épico pai, o Projeto e as Regras aprendidas do .sabia/sabia.md e o steering de tecnologia e estrutura. O manual segue as regras da IA supervisionada: a pessoa está presente.
3. **texto aprovado** — Com ELM, cada artefato afetado tem seu arquivo inteiro em elm/ com 'Aprovado: <usuário> · <data>'. Sem ELM, a ficha é que tem o Aprovado. Se faltar aprovação, registra Em aberto (ao especificador, com ELM; ao P.O., na ficha) e para, porque o texto é do refinamento (sa-refinar.detalhar). No autopilot, devolve à pessoa.
4. **pesquisa** — Fora do autopilot, antes pergunta à pessoa se tem pistas de onde olhar. Chama sa-pesquisar.pesquisar no subagente sa-pesquisador, com o escopo (ficha, artefatos afetados, elm/), as pistas e 3 a 7 perguntas: pesquisa curta na rápida, factual na completo. Grava os fatos no research.md pelo padrão sa-plano/research.md e faz commit. Divergência entre documento e código: fora dos artefatos afetados, inclui fluxo/captura.md (obs 'origem FT-nnn'); dentro dos artefatos afetados, Em aberto ao especificador, porque o texto aprovado pode precisar mudar.
5. **decisões** — Escolha técnica com alternativas reais: fora do autopilot, apresenta as opções com a recomendada; no autopilot, decide pela recomendada e registra. O registro fica em Decisões técnicas do design.md; na rápida do OpenSpec, que não tem design.md, numa seção Decisões técnicas do proposal.md. Regra sem decisão fica Em aberto ao P.O. e para só o que depende dela. Decisão arquitetural ou irreversível: para e pergunta; no autopilot, devolve à pessoa. Decisão que atravessa fatias vira ADR no MR (sa-desenvolver.codificar).
6. **delta** — Copia para o delta, sem reescrever, o texto completo de cada requisito tocado, com <sigla>-<id>, inclui · altera · exclui e a versão de referência. OpenSpec: specs/<cap>/spec.md com ADDED (inclui), MODIFIED (altera) e REMOVED (exclui). Kiro: requirements.md (bugfix.md no bug da rápida) com o bloco completo de cada requisito. A fonte, com ELM, é o arquivo aprovado em elm/; sem ELM, é o vigente da especificação vigente com as regras aprovadas da ficha, sem mudar o sentido. Se o delta já existe (sincronização da especificação manual), mantém o texto e só o põe no arquivo da trilha (Kiro: bugfix.md na rápida do bug, requirements.md nas outras). Se quem desenvolve acha que o texto precisa mudar, registra Em aberto ao especificador e não edita.
7. **escrever** — Escreve pela matriz trilha × formato (formato_spec do agentes.json). Rápida fatia: no Kiro, Quick Spec (requirements.md, design.md e tasks.md numa passada, sem portões); no OpenSpec, proposal.md + delta + tasks.md. Rápida bug: no Kiro, Bugfix Spec (bugfix.md, design.md, tasks.md); no OpenSpec, proposal.md + delta MODIFIED + tasks.md. Completo: no Kiro, requirements.md → design.md → tasks.md; no OpenSpec, proposal.md + delta + design.md + tasks.md; nos dois, uma parte por vez, com o passo revisar entre elas. proposal.md: porquê · o que muda · trilha · link da ficha. design.md no Kiro com os títulos exigidos (Overview · Architecture · Components and Interfaces · Data Models · Error Handling · Testing Strategy) mais Decisões técnicas; no OpenSpec, Context · Goals/Non-Goals · Decisions · Risks/Trade-offs. Nos dois, os critérios de pronto (Cenário CT-nn · Como executar · Esperado · Onde verificar). tasks.md: uma tarefa por comportamento, teste primeiro, comando de pronto e CT-nn; no Kiro com _Requirements: N.M_, no OpenSpec com '- [ ] 1.1'. Refatoração preparatória entra como tarefa. A última tarefa é a suíte completa. Aplica as Regras aprendidas. Se o plano mostra que a fatia passa de G, para e oferece 'vira épico', como no passo trilha e autonomia da sa-desenvolver.iniciar.
8. **revisar** — No completo, ao fim de cada parte; na rápida, uma vez no fim. Pergunta 'quer revisar agora?' e, com sim, chama sa-revisar.revisar (critérios de revisão L) no subagente sa-revisor. Achados triados: corrige → ajusta o plano. volta-spec → Em aberto ao especificador. Regra sem decisão → Em aberto ao P.O. No autopilot, não pergunta: roda a análise no completo e pula na rápida. 2 reprovações seguidas disparam o disjuntor (sa-desenvolver.codificar), que devolve à pessoa.
9. **aprovar** — Fora do autopilot, mostra o resumo 🧭 (trilha, arquivos, tarefas, decisões, Em aberto) e quem desenvolve aprova. No autopilot, o subagente aprova e registra 'plano aprovado no autopilot' no Retomar; a pessoa vê o plano no MR. No status.md: Fase implementando e Retomar ('próximo: sa-desenvolver.codificar'). Commit dos arquivos do plano na branch e push (com o 'sim'; liberado no autopilot).
10. **seguir** — Na IA supervisionada, oferece 'seguir para sa-desenvolver.codificar?' na mesma sessão. No manual, grava no status.md o Retomar ('codificação manual; avise quando terminar'), faz commit e push da branch (com o 'sim') e encerra a sessão; na volta ('terminei', nesta ou em outra sessão), a sa-desenvolver.codificar segue do que vem depois da codificação (validar). No autopilot, segue direto.

### sa-plano.replanejar
Quem chama: sa-desenvolver.codificar, quando há divergência arquitetural, achado volta-plano ou texto novo aprovado pelo especificador, com o plano já aprovado. Muda só o que mudou, sem desmarcar o que foi feito, registra o motivo em Desvios, oferece 'quer revisar agora?' na parte alterada e quem desenvolve aprova. Fim: devolve à sa-desenvolver.codificar.

1. **entrada** — Inclui fluxo/entrada.md. Recebe de quem chamou o motivo (esperado × encontrado, achado ou texto novo). Sem plano aprovado (Fase —), manda para sa-plano.plano.
2. **atualizar** — Atualiza o delta, o design.md e o tasks.md (ou os arquivos da rápida) só no que mudou. Texto aprovado novo é copiado de novo para o delta, sem reescrever. Acrescenta tarefas e nunca desmarca as feitas. Registra o motivo em Desvios. Regra sem decisão fica Em aberto ao P.O. e para só o que depende dela.
3. **revisar** — Pergunta 'quer revisar agora?' sobre a parte alterada e, com sim, chama sa-revisar.revisar (critérios de revisão L) no subagente sa-revisor. No autopilot, roda a análise só no completo.
4. **aprovar e devolver** — Quem desenvolve aprova a mudança; no autopilot, o subagente aprova e registra. Atualiza o Retomar, faz commit na branch e devolve à sa-desenvolver.codificar, no passo tarefa.

## sa-pesquisar
Pesquisa neutra e só de leitura, que roda no subagente sa-pesquisador: recebe escopo e perguntas de quem chama e devolve fatos com arquivo:linha. Não grava nada; quem guarda é quem chamou (o research.md é da sa-plano). Chamada por sa-plano.plano, sa-prd.prd, sa-refinar.fatiar, sa-entrevistar.entrevistar e sa-atender.atender.

### sa-pesquisar.pesquisar
Quem chama: uma das cinco skills, pelo subagente sa-pesquisador. Pré-condição: escopo dado por quem chama (ficha, PRD, pedido ou defeito). Ordem: perguntas → investigar → fatos. Fim: devolve os fatos a quem chamou, sem gravar nada.

1. **entrada** — Recebe de quem chamou o escopo, as perguntas e as pistas, se houver. Só leitura, sem pasta nem arquivo próprio. Não conhece o plano nem decide nada.
2. **perguntas** — Se quem chamou não trouxe perguntas, monta de 3 a 7 a partir do escopo, antes de abrir o código.
3. **investigar** — Investiga, nesta ordem. Estrutura: steering e glob dos módulos. Fluxo atual: do ponto de entrada até o dado, lendo os arquivos. Análogos: 1 ou 2, lidos de ponta a ponta com os testes. Reaproveitamento. Dados: MCP de banco só em leitura, guardando só a consulta e a contagem, nunca dado real. Testes: como rodar os da área pelos Comandos do .sabia/sabia.md e o que eles já cobrem. Documentação: a pasta da spec da fatia (delta e elm/), se houver; depois as specs do repositório (openspec/specs e openspec/changes/archive, ou .kiro/specs); depois o bundle (elm_buscar_req_local, só com ELM); por fim, o ELM ao vivo, em leitura. Sem bundle, registra em Não encontrado e segue. Antes de ler código de uma stack, carrega a skill do toolkit dela.
4. **fatos** — Devolve a quem chamou só fatos com arquivo:linha, em até ~150 linhas, nas seções do padrão sa-plano/research.md: Perguntas e respostas · Fluxo atual · Análogos · Reaproveitar · Dados · Testes · Documentação × código · Restrições e riscos · Não encontrado. Divergência entre documento e código é um achado, e o que fazer com ela é de quem chamou. Nada inventado. O fluxo termina aqui.

## sa-revisar
Revisão de plano e de código. O fluxo revisar é o revisor independente. Roda no subagente sa-revisor, com contexto isolado e só leitura, e usa os critérios de revisão do toolkit com os critérios de revisão L (plano da fatia) ou C (código, nos eixos spec · padrões · segurança). Quem chama: sa-plano.plano, sa-plano.replanejar, sa-desenvolver.codificar e sa-revisar.mr. O fluxo mr é a revisão humana oficial do MR de código, feita por qualquer desenvolvedor ≠ autor, em linha no sa-desenvolvedor. Não há critérios de revisão P nem MR de documento: pitch, PRD e ficha vão direto na branch base, com a aprovação gravada no próprio documento.

### sa-revisar.revisar
Entra o pedido de quem chama: os critérios de revisão (L ou C), o item e a parte do plano ou o diff. O subagente lê só os arquivos, junta evidência para cada item dos critérios de revisão e devolve o relatório a quem chamou, sem gravar arquivo nem fazer commit. Só o BLOQUEANTE reprova. Os outros achados a pessoa tria (corrige · adia · volta-plano · volta-spec · descarta).

1. **entrada** — Quem chama: sa-plano.plano (critérios de revisão L, quando a pessoa aceita 'quer revisar agora?' ao fim de uma parte), sa-plano.replanejar (L, só na parte alterada), sa-desenvolver.codificar (C, revisão do agente antes do MR, em qualquer autonomia) e sa-revisar.mr (C, apoio ao revisor humano). O pedido direto também entra ('revisa o plano da FT-nnn', 'revisa o código da FT-nnn'). Roda no subagente sa-revisor, sem o contexto de quem escreveu: julga os arquivos e ignora justificativas (mensagem de commit, texto do pedido). Pré-condição: branch <id> com o plano (L) ou com diff contra origin/<branch_base> (C). Sem isso, devolve 'nada a revisar: o plano é da sa-plano.plano e o código, da sa-desenvolver.codificar'. A trilha trivial não tem plano, então só recebe os critérios de revisão C.
2. **escopo** — Escolhe os critérios de revisão no padrão sa-revisar/criterios-revisao.md, lê os critérios de revisão inteiros e depois a entrada dela. L: a pasta da spec pelo formato_spec do agentes.json. No Kiro, requirements.md (bugfix.md no bug), design.md e tasks.md. No OpenSpec, proposal.md, o delta specs/<cap>/spec.md, tasks.md e, no completo, design.md. Somam-se research.md, a ficha (regras, cenários CT-nn, artefatos afetados), o prd.md na fatia de épico e, com ELM, os arquivos aprovados de elm/ da pasta da spec. C: git diff origin/<branch_base>...HEAD (no autopilot, dentro da worktree .sabia/local/wt/<id>), a mesma pasta da spec e, com o MR aberto, os campos O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados. Na trivial, só o diff, a ficha e o MR. Sempre lê o .sabia/sabia.md (Projeto e Comandos). As Regras aprendidas do sabia.md entram como itens dos critérios de revisão. O delta já traz o texto completo dos requisitos tocados, então o revisor não lê o ELM.
3. **ci** — Só nos critérios de revisão C. O C3 vem do pipeline do último commit da branch, comparado com o último pipeline da branch base (o baseline), lido pelo MCP do Jenkins. Sem esse MCP, vale a saída do passo validar de quem chamou (sa-desenvolver.codificar.validar), ou a pessoa informa o resultado do pipeline. O revisor não roda a suíte, porque o sa-revisor é só leitura, e não aceita 'os testes passaram' sem a saída. Pipeline que falhou por ambiente (serviço fora do ar, credencial) dá C3 = AMBIENTE.
4. **evidencia** — L: cruza item a item (cenário CT-nn → critério → tarefa; regra → origem) e confere que o texto do delta é igual ao texto aprovado da ficha ou de elm/, sem reescrita. Abre os caminhos citados (L4). C: começa por git diff --stat, lê o diff inteiro de produção e de teste e avalia os três eixos separados (spec · padrões · segurança), com um subagente por eixo quando houver. Procura teste removido ou enfraquecido (C4: @Disabled, skip, assert apagado, catch vazio). Banco só por MCP de consulta, só leitura. Achado sem evidência não entra. Vale como evidência arquivo:linha, comando com a saída ou 'procurado em X, não encontrado'.
5. **relatorio** — Devolve o relatório a quem chamou, sem gravar arquivo e sem commit. Formato do padrão, uma linha por achado: # · severidade (BLOQUEANTE · IMPORTANTE · SUGESTÃO) · achado · evidência · correção · origem (L: plano · ficha · PRD; C: código · ambiente) · destino sugerido (corrige · adia · volta-plano · volta-spec · descarta). Nos critérios de revisão C, uma tabela por eixo. O que diverge da spec é achado com destino volta-spec. Problema fora do escopo da fatia vira SUGESTÃO com destino adia. A última linha é exata: na L, 'ANALISE: OK | AJUSTAR'; na C, 'VEREDITO: APROVADO | REVISAR | AMBIENTE'. Só o BLOQUEANTE reprova. Se o C3 não rodou por ambiente, o fecho é AMBIENTE, nunca APROVADO. Quem chamou tria e grava: a sa-plano corrige o plano; a sa-desenvolver.codificar transforma cada 'corrige' em tarefa [R<n>] e leva o resumo à Evidência do MR; a sa-revisar.mr abre as threads no MR.

### sa-revisar.mr
Revisão oficial do MR de código, em qualquer autonomia (IA supervisionada, IA autopilot ou manual). Um desenvolvedor ≠ autor revisa com o apoio do revisar (critérios de revisão C), tria os achados no próprio MR e aprova. Não há merge direto: o merge é do autor, pela sa-desenvolver.encerrar. Roda em linha no sa-desenvolvedor, com a escrita no GitLab em ask.

1. **entrada** — Quem chama: a pessoa, com o id do item ou o link do MR, depois do aviso da sa-desenvolver.codificar de que o MR espera revisão. Pela entrada comum (fluxo/entrada.md): o item existe e não é terminal; não há conferência de sprint. Vizinhos: sem MR aberto da branch <id>, diz 'o MR é aberto pela sa-desenvolver.codificar' e para. MR mergeado com o item ainda não concluida: vai para a sa-desenvolver.encerrar. MR fechado sem merge: mostra e para. MR em Draft: avisa que o autor ainda não pediu revisão e só segue com o 'sim'. Qualquer outro caso: 'use sa-status <id>' e para.
2. **revisor** — Procura a pessoa no equipe.json pelo usuario (login do GitLab). Para revisar, precisa ter desenvolvedor = true e usuario ≠ autor do MR. Se não puder, diz quem pode (o @dono da área no CODEOWNERS e os desenvolvedores do equipe.json) e para. Não há senioridade nem tarefa no EWM.
3. **ler** — Lê o MR pelo gitlabpr (gitlab_obter_mr): O quê · Porquê · Evidência (CI, 🔎) · Risco · Foco · Artefatos afetados, mais os conflitos e as threads abertas. Sem o MCP, a pessoa informa o estado do MR. Lê o CI do último commit pelo MCP do Jenkins; sem ele, usa o estado do pipeline mostrado no MR. Faz git fetch da branch <id>, sem checkout e sem commit. Evidência sem o bloco 🔎 da verificação do agente vira achado, e CI vermelho também.
4. **critérios de revisão** — Chama sa-revisar.revisar no subagente sa-revisor, com os critérios de revisão C sobre git diff origin/<branch_base>...origin/<id>. O relatório apoia a pessoa, mas não substitui a revisão dela.
5. **veredito** — A pessoa tria cada achado. corrige: abre thread no MR. adia: captura pelo fluxo/captura.md (tipo bug ou fatia, obs 'origem FT-nnn'), gravada pelo fluxo/commit-na-branch-base.md. volta-plano: thread para o autor, que segue pela sa-plano.replanejar. volta-spec: thread; o autor registra Em aberto ao especificador no status.md, o especificador decide (com ELM, ajusta o elm/ pela sa-especificar.elm; sem ELM, a decisão entra nas Decisões da ficha) e a sa-plano.replanejar recopia o texto para o delta. descarta: o motivo vai na thread. BLOQUEANTE só sai por corrige ou por descarta com motivo. Ajuste pequeno vai como suggested change, que o autor aplica. Se o Risco do MR pede, oferece revisão humana pela sa-verificar.revisao-humana antes de aprovar. Sem BLOQUEANTE aberto, aprova no MR (em ask). Com BLOQUEANTE aberto, pede mudanças.
6. **entrega** — Tudo fica no MR (aprovação ou threads). O revisor não faz commit na branch nem merge. Diz o próximo passo do autor: com aprovação e CI verde, o merge pela sa-desenvolver.encerrar; com mudanças pedidas, o retrabalho pela sa-desenvolver.codificar no mesmo MR. Com ELM configurado, 'deseja lançar horas?' leva à sa-elm.horas, na tarefa da própria pessoa (não existe tarefa de revisão). Oferece 'seguir para a próxima?': outro MR à espera, ou o próprio trabalho pela sa-status.

## sa-verificar
Aceite contra a spec. O fluxo verificar é o verificador, o subagente sa-verificador, com contexto isolado e o texto verificacao do toolkit. Ele exercita a aplicação direto (curl, navegador, job) contra os cenários CT-nn, devolve o bloco 🔎 a quem chamou e grava o CT.csv, do qual é o único escritor. Quem chama: sa-desenvolver.codificar, antes do MR, e sa-verificar.revisao-humana. O fluxo revisao-humana é a revisão humana, feita só quando o risco pede, por qualquer pessoa, sobre o MR aberto. A asserção durável são os testes automatizados no CI. Não existem http.sh, massa/, arquivo de requisições nem verificacao.md: a evidência vai no MR.

### sa-verificar.verificar
roteiro (cenários CT-nn da ficha e da spec) → ambiente (Executar do sabia.md, nunca produção) → executar (como usuário real) → fora dos cenários → casos (CT.csv, na rápida e no completo) → resultado (🔎 para quem chamou). O verificador não grava status.md, não grava na branch base e não faz commit: quem chamou leva a evidência ao MR e faz as capturas.

1. **entrada** — Quem chama: sa-desenvolver.codificar (verificação do agente antes do MR, em qualquer autonomia), sa-verificar.revisao-humana (os cenários da revisão humana) ou a pessoa ('verifica a FT-nnn'). Roda no subagente sa-verificador, sem o contexto de quem implementou. Pré-condição: branch <id> com o código e a spec da trilha. Sem código, devolve 'a implementação é da sa-desenvolver.codificar'. Lê a seção Verificação de aceite do sabia.md (Executar · URL de teste). Sem essa seção, oferece a sa-setup e para.
2. **roteiro** — Antes de executar, escreve o roteiro de cada cenário com o CT-nn dele. Os cenários vêm da ficha e da spec, conforme a trilha e o formato_spec. trivial: os cenários da ficha e o teste que acompanha a mudança. rápida fatia: o requirements.md da Quick Spec (Kiro) ou o delta (OpenSpec). rápida bug: bugfix.md (Kiro) ou o delta MODIFIED (OpenSpec). completo: requirements.md e design.md (Kiro) ou o delta e o design.md (OpenSpec). O delta já traz o texto aprovado dos requisitos, então o verificador não lê o ELM. Cada cenário tem pré-condição · passos · esperado (o 'Então' com valores) · CT-nn. Entram também a repetição (rodar duas vezes) e o erro em um item, quando se aplicam. Cenário sem CT-nn recebe o próximo CT-nn livre da fatia, citado no 🔎 para o autor levar à spec e ao teste.
3. **ambiente** — Sobe a aplicação ou o job pelo Executar do sabia.md, local ou na URL de teste. Nunca usa produção nem dado real de pessoa. Os dados do cenário nascem pela própria aplicação (as chamadas do cenário) ou pelos fixtures do projeto. Nunca escreve direto no banco; consulta só pelo MCP de banco, em leitura. Se a DDL da fatia não foi aplicada, procura no backlog.md o item BD com obs 'origem FT-nnn': os cenários que dependem dela ficam ⚠️ ambiente, citando o BD-nnn, e os outros seguem. Se não há item BD, o caso vai para o passo 'fora dos cenários'.
4. **executar** — Roda cenário por cenário como usuário real. backend: chamada HTTP com curl na URL de teste (liberado no sa-verificador) e o estado no banco, em leitura. batch: o job, o status da execução e as contagens. frontend: navegador (Playwright ou MCP de browser). dados: a carga e as consultas. mobile: emulador, ou roteiro com a pessoa. biblioteca: testes de contrato públicos. infra: plan, lint ou dry-run, nunca apply. Resultado por cenário ∈ ✅ aceito · ❌ rejeitado · ⚠️ ambiente · 🔁 possível alteração (quando a spec parece errada, não o código), sempre com esperado × obtido e a evidência (comando com a saída, contagem ou captura de tela). Evidência com dado real não sai da máquina: no relatório vai só um resumo, sem identificar pessoas.
5. **fora dos cenários** — Defeito achado fora dos cenários da fatia, e DDL pendente sem item BD, vão para a seção 'Fora dos cenários' do 🔎, com o tipo (bug ou sustentação BD) e uma ficha curta (passos · atual · esperado). Quem chamou faz a captura pelo fluxo/captura.md, com obs 'origem FT-nnn'; no pedido direto, é a própria sessão da pessoa que captura. Isso não vira CT, não entra no veredito e não trava a fatia.
6. **casos** — Na rápida e no completo, reescreve o CT.csv da pasta da spec com uma linha por cenário ✅. Os cenários ❌, ⚠️ e 🔁 não entram. Segue o padrão requisitos/padrao-ct.md (UTF-8 com BOM, ';', LF): Tipo ('Caso de Teste') · Resumo ('<FT-nnn> CT-nn - <título do cenário>') · Responsável (usuario de quem disparou a verificação) · Descrição (objetivo, pré-condições, passos, esperado, evidência). Não há Status nem 'Planejado para'. O '<FT-nnn> CT-nn' é a mesma marca do teste automatizado. Na trivial não há CT.csv: a evidência fica no MR. Quando quem chama é a sa-verificar.revisao-humana, o CT.csv não é reescrito, porque o arquivo é do autor.
7. **resultado** — Devolve a quem chamou o bloco 🔎. Ele abre com '🔎 Verificação <id> · <AAAA-MM-DD>' e traz a tabela CT-nn · resultado · esperado × obtido · evidência, a contagem 'a ✅ · r ❌ · e ⚠️ · p 🔁', a seção 'Fora dos cenários' e, na última linha, 'VERIFICACAO: ACEITO | REJEITADO | AMBIENTE'. Algum ❌ dá REJEITADO; sem ❌ e com algum ⚠️, AMBIENTE; o resto, ACEITO. Quem chamou decide cada 🔁 antes de abrir o MR: código errado vira ❌; se a spec muda, é volta-spec (o especificador). Regra sem fonte vai marcada 'em aberto ao P.O.', e quem chamou a grava no Em aberto do status.md. No pedido direto, a sessão da pessoa faz o commit do CT.csv na branch <id> e o push da própria branch (em ask), põe o 🔎 como comentário no MR, se ele já existir, e oferece 'seguir para a próxima?'.

### sa-verificar.revisao-humana
revisão humana, feito só quando o risco pede (o Risco do MR, o revisor ou o P.O.), por qualquer pessoa, sobre a branch do MR aberto. A pessoa escolhe os cenários e o verificar os roda com ela. Os achados são triados no MR, e só o corrige segura o merge. A revisão humana não grava arquivo na branch do autor nem oferece ELM além das horas.

1. **entrada** — Quem chama: a pessoa ('revisão humana da FT-nnn') ou a oferta da sa-revisar.mr.veredito. Pela entrada comum (fluxo/entrada.md): o item existe e não é terminal. Não há sprint nem booleana: qualquer pessoa faz revisão humana, e quem ela é sai do equipe.json pelo usuario. Vizinhos: sem MR aberto da branch <id>, diz 'a verificação do agente é da sa-desenvolver.codificar' e para. MR mergeado: diz que a revisão humana é antes do merge e para. Qualquer outro caso: 'use sa-status <id>' e para.
2. **branch** — Traz a branch <id> com git fetch, checkout e git pull --ff-only. Com a árvore suja, avisa e para (nunca reset, stash ou rebase). A revisão humana não faz commit nessa branch.
3. **cenarios** — Mostra os cenários CT-nn da spec (na trivial, os da ficha) e o 🔎 da Evidência do MR. A pessoa escolhe os cenários do risco; o padrão são todos os que o Risco cita. Os cenários rodam pelo sa-verificar.verificar com a pessoa acompanhando: ela exercita a tela ou a chamada e confirma cada resultado (✅ · ❌ · ⚠️ · 🔁). Não há contagem de rodadas; o disjuntor vale só no autopilot.
4. **decisao** — Tria cada resultado que não é ✅. ❌: corrige (thread no MR, que segura o merge), adia (captura pelo fluxo/captura.md, tipo bug, obs 'origem FT-nnn') ou descarta (com o motivo). 🔁: a pessoa decide com o autor. Se o código está errado, vira ❌; se a spec muda, é volta-spec (thread; o autor registra Em aberto ao especificador, que decide, com ELM pela sa-especificar.elm, e a sa-plano.replanejar recopia para o delta). ⚠️: thread dizendo o que faltou no ambiente, sem contar como falha. Só o corrige segura o merge.
5. **entrega** — Comenta no MR o bloco 🔎 da revisão humana (cenários, resultado e evidência sem dado real) e abre as threads da decisão, em ask. Sem o MCP gitlabpr, entrega o texto para a pessoa colar. Não há commit na branch: o CT.csv e o status.md são do autor, e o CT.csv volta a ser escrito quando a sa-desenvolver.codificar reverifica depois da correção. Volta a pessoa à branch anterior. Com ELM configurado, 'deseja lançar horas?' leva à sa-elm.horas. Oferece 'seguir para a próxima?'.

## sa-atender
Sustentação das seis categorias: AT · IM · BD · IN · OP · EX (absorve a sa-executar). Qualquer pessoa registra e tria o pedido aqui, puxa dentro da reserva de capacidade, faz o trabalho com a IA só como auxílio e declara resolvido. A categoria só muda o registro.md. O agente não roda script, deploy nem comando em ambiente e não responde ao cliente. O ELM aparece só como oferta da sa-elm. Roda em linha no sa-desenvolvedor; a pesquisa de código vai à sa-pesquisar (sa-pesquisador).

### sa-atender.atender
Um pedido em texto vai para o registrar (captura e triagem, com a categoria confirmada antes de gravar); um id entra direto. Depois: puxar (reserva de capacidade) → assumir (em-andamento e a linha de atendimento no sprint) → executar (a pessoa faz e a IA ajuda a pedido) → finalizar (a pessoa declara resolvido: concluida) → desdobramentos (captura com 'origem <ID>'). O estado é gravado pelo fluxo/commit-na-branch-base.md.

1. **entrada** — Entra um id (AT-, IM-, BD-, IN-, OP- ou EX-nnn) ou um pedido em texto. Pela entrada comum (fluxo/entrada.md), sem sprint e sem branch. Pedido em texto ou id que não existe: passo registrar. Status concluida ou cancelada: mostra e para. Id de outro tipo (EP, FT): diz 'não é Sustentação: veja sa-status <id>' e para. As seis categorias seguem todas neste fluxo. Sem .sabia/sabia.md, oferece a sa-setup.configurar e para.
2. **registrar** — Pedido novo: inclui o fluxo/captura.md com tipo sustentação e já faz a triagem aqui. A pessoa confirma a categoria (AT · IM · BD · IN · OP · EX, pela seção Sustentação do sabia.md: Categoria · Descrição · Exemplo) antes de gravar. A categoria vem antes porque o id nasce da série dela (<sigla>-nnn = o maior da série + 1, lido depois do pull) e nunca muda. Prioridade: crítica (expedite pela política do acordos.md) ou vazio. Pelo fluxo/commit-na-branch-base.md, grava a linha (status nova, relator, aceita_em = hoje, obs 'origem chamado <n>' quando houver) e o registro .sabia/planejamento/sustentacao/<ID>-<slug>.md, pelo padrão sa-atender/registro.md: cabeçalho Categoria · Origem · Pedido por · Prazo (AAAA-MM-DD ou —) · Responsável e a seção Pedido, sem dado de cliente. Se é só para registrar, o fluxo termina aqui. Para atender agora, segue para o passo puxar.
3. **puxar** — Confere a reserva de capacidade consumida (a soma das linhas de atendimento do sprint-<nn>.md aberto) contra a reserva de capacidade do acordos.md. Dentro da reserva de capacidade, ou com prioridade crítica (expedite), segue. Reserva de capacidade estourada: mostra o estouro, e decide quem tem produto no equipe.json (puxar assim mesmo ou esperar). A decisão vai na obs: 'reserva de capacidade estourada: <decisão> (<usuario>, AAAA-MM-DD)'. Sem essa pessoa na sessão, diz quem tem produto e para, com o item ainda nova. Sem sprint aberto, não há reserva de capacidade a conferir.
4. **assumir** — Responsável de outra pessoa: mostra de quem é e só assume com o 'sim', registrando a troca na Atividade (regra de atribuição da entrada comum). Grava pelo fluxo/commit-na-branch-base.md, num commit '<ID> iniciar': no backlog.md, status em-andamento, responsável = usuario e iniciada_em; no registro.md, o Responsável; no sprint-<nn>.md aberto, a linha Item · atendimento · Responsável. Se o item já está em-andamento com a mesma pessoa (retomada), não grava nada. Com ELM configurado, oferece 'quer criar o item no ELM?' (sa-elm.item: IB e tarefa ATD; o id da tarefa vai na coluna Tarefas da linha do sprint).
5. **executar** — A pessoa faz o trabalho, e a IA ajuda quando ela pede. Regras vigentes: specs arquivadas → especificação vigente → bundle, em leitura local. Sem bundle, ou com bundle desatualizado, oferece a sa-elm.baixar; sem ELM, não oferece. Código: pela sa-pesquisar.pesquisar (subagente sa-pesquisador), com o pedido e um escopo fechado; ela devolve fatos. Banco só por MCP de consulta, em leitura; sem o MCP, o agente escreve a SQL e a pessoa roda. Logs pelo MCP elk, se configurado. Rascunho de resposta só se a pessoa pedir; quem envia é a pessoa. Script, deploy, DDL e comando em ambiente são da pessoa (IM · BD · IN · OP · EX), e a Atividade registra o que foi feito · onde · resultado. Dado de cliente fica em .sabia/local/sustentacao/<ID>/, fora do git; no registro ficam só a consulta, a contagem, o caminho e um resumo anônimo. Regra que ninguém decidiu fica em aberto ao P.O. (na Atividade) e para só o que depende dela. Especificador, P.O. ou o time entram quando a pessoa chama. Sessão que termina antes de resolver fecha com o commit '<ID> registrar sessão' do registro.md.
6. **fora do escopo** — Pedido que muda o código ou o comportamento do sistema: captura um item (bug ou fatia) pelo fluxo/captura.md, com obs 'origem <ID>'. Categoria errada depois de gravada: não se recategoriza. O item fica 'cancelada · virou <novo id>', e o item certo nasce pela captura com obs 'origem <ID>'. Nos dois casos, o que já foi feito fica na Atividade.
7. **finalizar** — Quem declara resolvido é a pessoa, nunca a IA, e não é preciso confirmação do solicitante. Grava no registro.md a Resposta enviada (sem dado de cliente) e, se a pessoa informar, a linha Data | Horas. No backlog.md, grava status concluida e concluida_em. Pedido retirado: status cancelada com obs 'motivo: <texto>'. O commit sai no passo desdobramentos. Item com obs 'origem FT-nnn' (por exemplo, a DDL de uma fatia): avisa que a FT-nnn pode seguir; quem desenvolve tira o BD-nnn do Em aberto do status.md dela. Com ELM configurado, 'finalizar a tarefa no ELM?' leva à sa-elm.finalizar, que oferece as horas.
8. **desdobramentos** — Pergunta 'algum desdobramento?'. Nada: segue para o commit. Defeito, mudança ou outro item de Sustentação: captura pelo fluxo/captura.md com obs 'origem <ID>'. Lição, se houver, vai na seção Lições aprendidas do registro.md, uma linha: lição · regra proposta. A resposta que se repete também vira lição. As lições aprendidas vão para a curadoria na review (sa-planejamento.review). Um commit '<ID> concluir' pelo fluxo/commit-na-branch-base.md leva o registro, o backlog.md e as capturas. Oferece 'seguir para a próxima?'.

## sa-elm
Utilitário do ELM: DOORS Next para requisitos e EWM para tarefas, sem ETM. Tudo o que escreve no ELM ou baixa dele passa por esta skill. As outras skills só oferecem ('quer criar o item no ELM?', 'finalizar a tarefa no ELM?', 'deseja lançar horas?', 'publicar no DOORS?') e seguem com qualquer resposta. A skill nunca decide nem para o fluxo de quem a chamou. Tem doze fluxos: regras · setup · item · finalizar · horas · importar-backlog · publicar · iteracao · conferir · lint · baixar · visualizar. Tarefas do EWM: DEV · ESP · ATD.

### sa-elm.regras
Regras comuns, incluídas no início de cada um dos outros onze fluxos: pré-condição, escrita com prévia, leitura livre, identidade, onde os ids moram, títulos e erros do MCP. Nenhuma falha trava quem chamou.

1. **entrada** — É incluído no início de cada fluxo da sa-elm e nunca é chamado sozinho.
2. **pré-condição** — Lê a chave elm do .sabia/config/agentes.json. Com elm: false, sem .sabia/config/elm/pa_<nome>.json ou sem o MCP elm na sessão, diz 'ELM não configurado' e devolve a quem chamou, que segue. Se o MCP der erro config, mostra o campo e oferece a sa-elm.setup.
3. **autopilot** — No autopilot da sa-desenvolver, o ELM fica bloqueado e a sa-elm não roda. A pergunta do ELM é feita quando a pessoa retoma o item.
4. **escrita** — Toda escrita mostra a prévia e espera o 'sim' (ask nos principais sa-desenvolvedor e sa-especificador; deny nos subagentes e no autopilot). É idempotente: se o id já está gravado no Sabiá, não cria de novo. Nunca apaga. A exclusão de requisito vira roteiro manual (sa-elm.publicar), e a remoção de horas só acontece a pedido.
5. **leitura** — Qualquer skill pode ler o ELM para buscar o vigente (elm_ler_req, elm_buscar_req, elm_ler_wi e o bundle pelo MCP local). Escrever no ELM e baixar dele só pela sa-elm.
6. **identidade** — Quem age no ELM é o elm_login da pessoa no equipe.json. Sem elm_login, vale o usuario (o usuário do GitLab). A credencial fica em ~/.config/mcp-elm/elm.properties, e o agente não lê esse arquivo.
7. **onde os ids moram** — O id do IB vai na coluna ib do backlog.md, só o número. O id da tarefa vai na coluna Tarefas da linha Item · Trabalho do sprint-<nn>.md aberto, com o prefixo (DEV 123 · ESP 456 · ATD 789, separados por ' · '). Nenhum id vai no status.md, na ficha ou no registro. Toda gravação no repositório segue o fluxo/commit-na-branch-base.md.
8. **títulos** — Tarefa: '[<DEV|ESP|ATD>] <id> <título do backlog.md>'. IB: '[<id>] <título>'. Cada trabalho tem a sua tarefa: desenvolvimento → DEV, especificação → ESP, atendimento → ATD (as seis categorias da Sustentação usam ATD).
9. **erros do MCP** — entrada → corrige pelo schema e tenta mais uma vez. nao_encontrado → pergunta o id. credencial → pede que a pessoa confira o elm.properties. indisponivel → tenta mais uma vez; se falhar de novo, diz e devolve. Se um id criado no ELM não puder ser gravado no repositório, mostra o id para a pessoa gravar.
10. **fim** — Volta ao fluxo da sa-elm que incluiu as regras.

### sa-elm.setup
Configura o ELM só como dados. Grava o pa e devolve à sa-setup a chave elm, o texto da seção ELM e as regras ELM dos agentes, que a sa-setup aplica antes de regenerar os agentes. Roda na sessão sem agente.

1. **entrada** — Chamada pela sa-setup.configurar quando a resposta a 'usa ELM?' é sim, ou direto ('setup do ELM', 'atualizar o pa'). Roda na sessão sem agente, porque o harness dos agentes nega .sabia/config. Dentro de um agente sa-*, diz isso e para. Em atualização, lê o pa existente e mostra só o que muda.
2. **MCP e credencial** — Confere o MCP elm (vem com o power no Kiro; no opencode, o sabia instalar o instala de forma global) e o ~/.config/mcp-elm/elm.properties. Se faltar algum, diz o comando de instalação ou o que preencher e devolve à sa-setup com elm: false, sem travar.
3. **montar o pa** — Roda o elm_setup_descobrir e segue o roteiro de montagem: project area, time e categoria, tipos (IB, tarefa e, opcional, Defeito), campos obrigatórios e o backlog do produto (a iteração que a importação usa). Não tem bloco do ETM nem IBs de estrutura (Sustentação, Manutenção, categoria), e as tarefas são só DEV · ESP · ATD.
4. **ET** — Pergunta se o projeto mantém ET (sim | não). Com sim, a ET é só as-built e é publicada na finalização do desenvolvimento, pela sa-elm.publicar.
5. **GL** — Com ELM, o glossário é o GL do DOORS. Avisa a sa-setup para não oferecer o glossario.md.
6. **gravar o pa** — Grava o .sabia/config/elm/pa_<nome>.json com o 'sim' da pessoa. O mcp-elm procura o pa em .sabia/config/elm, depois em .kiro/config/elm e em .kiro/config/sdd.
7. **validar** — O elm_status confere a credencial e o pa. Se der erro, mostra o campo e volta ao passo montar o pa.
8. **dados** — Monta, sem gravar, o que a sa-setup vai aplicar: (1) a chave elm do agentes.json, {pa: '<nome>', bundle: '<rm.download do pa>', regras: {allow, ask, deny}}, em que as regras são as dos agentes (leitura allow em todos; escrita ask nos principais sa-desenvolvedor e sa-especificador; deny nos subagentes e no autopilot); (2) o texto da seção ELM do sabia.md: pa, 'ET as-built: sim | não', 'Bundle desatualizado após: <n> dias', os títulos das tarefas DEV · ESP · ATD e o roteiro manual do DOORS Next.
9. **bundle** — Mostra se já existe bundle e oferece 'baixar o bundle agora?' (sa-elm.baixar, modo bundle). É a única oferta de bundle durante a configuração.
10. **devolver** — Se a sa-setup chamou, devolve os dados com o resumo, e ela segue do ponto em que parou. Na chamada direta, oferece seguir para a sa-setup.configurar em atualização, que aplica os dados e regenera os agentes.

### sa-elm.item
Ao assumir um trabalho: cria o IB se faltar, cria e assume a tarefa do trabalho (DEV · ESP · ATD) e grava os ids. A pedido, também cria IB em lote, lê um WI e comenta ou anexa.

1. **entrada** — Vem do 'sim' a 'quer criar o item no ELM?' na skill que assume o trabalho: sa-desenvolver.iniciar (DEV), sa-atender.atender (ATD), sa-especificar.elm ou sa-prd.prd ao começar a especificação (ESP). Também atende pedido direto. Recebe o id do Sabiá e o trabalho.
2. **IB** — Se a coluna ib está vazia, cria o IB '[<id>] <título>' com o título do backlog.md e grava o número na coluna ib. Se já tem ib, usa esse.
3. **linha no sprint** — Procura a linha Item · Trabalho no sprint-<nn>.md aberto. Se não existe, acrescenta (Item · Trabalho · Responsável · Tarefas vazia). Sem sprint aberta, não cria a tarefa: diz que ela nasce quando o item entrar numa sprint e vai para o passo devolver.
4. **tarefa** — Cria a tarefa filha do IB, com o título padrão e a pessoa como dona. Se a PA exige um campo (ex.: estimativa), pergunta e nunca chuta. Depois assume a tarefa (elm_transicao assumir).
5. **gravar ids** — Grava o id com prefixo na coluna Tarefas da linha, ao lado dos que já estão lá, pelo fluxo/commit-na-branch-base.md.
6. **IB em lote** — Só a pedido ('criar o IB dos itens sem IB'): lista as linhas sem ib, menos as canceladas e as concluídas, cria todas com uma confirmação para o lote e grava a coluna ib. Nunca é oferecido na triagem.
7. **ler WI** — A pedido de uma skill ou da pessoa, devolve a descrição e os comentários do WI (elm_ler_wi).
8. **comentar e anexar** — Só a pedido, na tarefa da própria pessoa, com prévia (elm_comentar, elm_anexo). A fonte continua no repositório.
9. **devolver** — Mostra os ids gravados e devolve à skill que chamou, que segue do ponto em que parou.

### sa-elm.finalizar
Ao concluir um trabalho: oferece lançar as horas que faltam, conclui a tarefa, liga aos requisitos dos artefatos afetados e oferece concluir o IB e o IB do épico. Também cancela no EWM o que o Sabiá cancelou ou tirou da sprint.

1. **entrada** — Vem do 'sim' a 'finalizar a tarefa no ELM?' em três pontos: sa-desenvolver.encerrar depois do merge (DEV), sa-atender.atender ao concluir o atendimento (ATD), e sa-especificar.elm com os arquivos aprovados ou sa-prd.prd com o PRD aprovado (ESP). Também atende pedido direto. O cancelamento entra pelo passo cancelar.
2. **achar a tarefa** — Lê o id na coluna Tarefas da linha do item no sprint.md. Sem id, pergunta qual é ou diz que não há tarefa e devolve.
3. **horas antes** — Se a tarefa não tem horas lançadas (elm_horas), oferece 'deseja lançar horas?'. Com sim, vai à sa-elm.horas, que volta para cá. Com não, segue.
4. **concluir** — elm_transicao concluir. Se a PA exigir campo, pergunta.
5. **ligar aos artefatos afetados** — Na DEV, liga a tarefa aos requisitos dos artefatos afetados que já têm id do ELM (elm_ligar implementa). O requisito novo é ligado pela sa-elm.publicar.
6. **IB** — Se era a última tarefa aberta do IB, oferece concluir o IB. Se o item tem pai EP-nn e o épico está 'concluido' no backlog.md (gravado pela sa-desenvolver.encerrar), oferece concluir o IB do épico.
7. **cancelar** — Entrada de quem cancela, em três casos. (1) Item com status 'cancelada' no backlog.md (sa-triar.triar, kill na sa-refinar.moldar, sa-refinar.ajustar): oferece cancelar o IB e as tarefas abertas. (2) Obs 'cancelada · virou EP-nn' (vira épico, na sa-desenvolver.iniciar): cancela as tarefas abertas, mantém o IB e copia o número dele para a coluna ib da linha EP-nn. (3) Item tirado da sprint (sa-planejamento.sprint, na virada): cancela a tarefa daquela sprint e mantém o IB.
8. **devolver** — Mostra o que foi concluído ou cancelado e devolve à skill que chamou.

### sa-elm.horas
Lança horas só quando uma skill pergunta ou a pessoa pede, e nunca trava ninguém. Um pedido completo lança direto. Os relatórios só aparecem a pedido.

1. **entrada** — Vem do 'sim' a 'deseja lançar horas?' em qualquer skill (inclusive a sa-elm.finalizar), ou de pedido direto.
2. **direto** — Um pedido completo ('lançar 8 h hoje na DEV 123') é lançado sem perguntas.
3. **perguntar** — Pergunta as horas, os dias e a tarefa, e sugere as tarefas da pessoa no sprint.md aberto. Horas de revisão e de revisão humana vão para uma tarefa da própria pessoa, sem criar tarefa nova.
4. **lançar** — elm_lancar_horas, com prévia. Um lançamento errado sai com elm_remover_horas, só a pedido.
5. **relatório** — Só a pedido. Semana: as tarefas da pessoa e as horas lançadas. Ciclo: as horas por tarefa na iteração (elm_horas).
6. **devolver** — Se veio da sa-elm.finalizar, volta ao passo concluir. Se veio de outra skill, devolve a ela. No pedido direto, encerra.

### sa-elm.importar-backlog
Uso raro, só a pedido. Traz do EWM os Defeitos e os Itens de Backlog que ainda não estão no backlog.md e grava cada um como linha 'nova' pela captura. A triagem vem depois.

1. **entrada** — Só a pedido ('importar do EWM', 'trazer os defeitos do time').
2. **filtro** — Confirma o pa, a iteração (padrão: backlog do produto), os tipos Defeito e Item de Backlog e o estado inicial. Lista com elm_listar_wi, por tipo.
3. **só os novos** — Tira os WIs cujo número já está na coluna ib do backlog.md, em qualquer status. Rodar de novo traz só o que entrou depois.
4. **gravar** — Cada WI entra pelo fluxo/captura.md. Tipo: Defeito → bug, Item de Backlog → fatia (série FT-nnn). Status nova, pai vazio. Relator: o usuario do equipe.json cujo elm_login criou o WI; se não houver, o nome do criador. ib: o número do WI. Obs: 'origem EWM <n>'. A descrição do WI vira o corpo mínimo da ficha. Uma confirmação vale para o lote, e um único commit vai pelo fluxo/commit-na-branch-base.md.
5. **seguir** — Mostra quantas linhas entraram na fila e oferece 'seguir para a triagem?' (sa-triar.triar). Com não, encerra.

### sa-elm.publicar
Depois do merge, publica no DOORS os arquivos aprovados da pasta elm/ da fatia. Confere a versão de cada artefato (se mudou, avisa e pula), cria os novos, troca o id provisório pelo do ELM e grava 'Publicação: publicada <data>' no status.md. Arquivo com '**Publicado:** manual' (especificação feita direto no DOORS) não é reenviado.

1. **entrada** — Sempre depois do merge. Vem do 'sim' a 'publicar no DOORS?' na sa-especificar.archive, ou de pedido direto, que lista as fatias com 'Publicação: pendente' no status.md (o arquivado, no OpenSpec; o de .kiro/specs/, no Kiro). Só publica quem tem a booleana especificador no equipe.json. Sem ela, diz quem tem e devolve (o archive já gravou 'pendente'). Sem ELM, não há o que publicar e devolve.
2. **fonte** — A fonte é a pasta elm/ da spec da fatia (openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/elm/ ou .kiro/specs/ft-<nnn>-<slug>/elm/), com um arquivo inteiro por artefato (HF, UC, REG, MSG, EL, GL), cada um com a aprovação do especificador. Onde a seção ELM do sabia.md diz 'ET as-built: sim', a ET sai das seções Components and Interfaces · Data Models · Decisões técnicas do design.md da spec. Arquivo com '**Publicado:** manual' fica de fora da prévia e conta como publicado. A ação (inclui · altera · exclui) e a versão de referência vêm dos artefatos afetados da ficha.
3. **conferir a versão** — Para cada altera e cada exclui, lê o modificado_em atual no DOORS. Se for diferente da versão de referência, avisa e pula aquele artefato. O resto segue.
4. **publicar** — Mostra a prévia de tudo e pede um 'sim'. altera: elm_publicar_req com o texto do arquivo e o modificado_em lido. inclui: cria o requisito no DOORS. exclui: o MCP não apaga; mostra o roteiro manual 'mover para a lixeira no DOORS Next: <id>' e pergunta se foi feito.
5. **trocar ids** — No requisito novo, renomeia EP03-01-<tipo>-<slug>.md para <id do ELM>-<tipo>-<slug>.md, com o mesmo título. Troca o id provisório <sigla>-<EP|FT>-nn por <sigla>-<id do ELM> no prd.md do épico pai, nas fichas que o citam e no delta da spec, tudo no mesmo commit.
6. **ligar** — Se houver tarefa DEV do item no sprint.md, liga a ela os requisitos publicados (elm_ligar implementa).
7. **ATA** — Se a pessoa quiser, a ATA aprovada do item sobe junto. Não trava.
8. **marcar** — Se tudo foi publicado (contando os arquivos com '**Publicado:** manual'), grava 'Publicação: publicada <AAAA-MM-DD>' no status.md da fatia. Se algum artefato foi pulado ou uma exclusão não foi feita, mantém 'Publicação: pendente' e lista o que falta. O artefato pulado volta ao especificador: a sa-elm.conferir mostra a diferença, ele mescla e roda a sa-elm.publicar de novo. O commit vai pelo fluxo/commit-na-branch-base.md.
9. **devolver** — Mostra o que foi publicado e o que não foi, oferece 'baixar o bundle agora?' (sa-elm.baixar) e devolve à sa-especificar.archive. No pedido direto, encerra.

### sa-elm.iteracao
Só a pedido: cria no EWM a iteração da sprint e move para ela o IB e as tarefas. Não faz parte do rito.

1. **entrada** — Pedido direto ('criar a iteração no EWM') ou oferta da sa-planejamento.sprint depois de gravar o sprint-<nn>.md. Nunca é pré-condição de planejamento, review ou retrospectiva.
2. **criar** — Cria a iteração '<pai>/Sprint <nn>' com as datas do cabeçalho do sprint-<nn>.md (elm_iteracao), com prévia.
3. **mover** — Move para a iteração o IB e as tarefas das linhas do sprint.md. Na virada, move só os itens migrados. A tarefa do item tirado da sprint é cancelada pela sa-elm.finalizar (passo cancelar).
4. **devolver** — Mostra o que foi movido e devolve à sa-planejamento.sprint. No pedido direto, encerra.

### sa-elm.conferir
Só leitura. Compara as tarefas do sprint.md com o EWM, ou os arquivos de elm/ da fatia com o DOORS atual. O EWM nunca decide o status do backlog.md.

1. **entrada** — Pedido direto: 'confere com o EWM' (modo tarefas) ou 'o DOORS mudou?' (modo artefatos). A sa-especificar.elm também chama o modo artefatos.
2. **tarefas** — Lê as tarefas da coluna Tarefas do sprint.md aberto (elm_ler_wi ou elm_listar_wi) e lista as divergências: tarefa concluída no EWM com o item aberto aqui, ou id que não existe no EWM.
3. **artefatos** — Para cada arquivo de elm/ da fatia, compara o modificado_em atual no DOORS com a versão de referência nos artefatos afetados. Se mudou, mostra o DOORS atual contra o commit de referência. O especificador decide: baixar de novo e mesclar (sa-especificar.elm, passo conferir) ou seguir.
4. **corrigir** — Cada correção pede 'sim' e vai ao fluxo dono: finalizar a tarefa (sa-elm.finalizar) ou corrigir o id na linha (fluxo/commit-na-branch-base.md). O status do item no backlog.md continua decidido no Sabiá.
5. **devolver** — Devolve a lista a quem chamou. No pedido direto, encerra.

### sa-elm.lint
Uso raro, só a pedido. Procura contradições entre o GL e os requisitos do DOORS e os artefatos do repositório.

1. **entrada** — Só a pedido ('lint do ELM').
2. **comparar** — Compara o GL e os requisitos (bundle e, depois, ELM ao vivo) com os ADRs, o glossario.md e as Regras aprendidas do sabia.md.
3. **achados** — Cada achado tem dois caminhos: corrigir na fonte do repositório, com 'sim', ou registrar pelo fluxo/captura.md, com o tipo que a pessoa disser (padrão: fatia) e a obs 'origem lint'. O DOORS só muda pela sa-elm.publicar de uma fatia.
4. **fim** — Mostra o que foi corrigido e o que foi registrado e oferece 'seguir para a triagem?' (sa-triar.triar). Com não, encerra.

### sa-elm.baixar
Só no sentido DOORS → repositório, em dois modos. Bundle: baixa a cópia local, grava sincronizado_em, faz o commit e oferece indexar. Artefato: baixa o original de um requisito para a pasta elm/ da fatia, com o commit de referência. Não envia nada e não tem conflito.

1. **entrada** — Modo bundle: oferecido pela sa-elm.setup, pela sa-elm.publicar e pela skill que busca o vigente e não acha bundle (ou acha um bundle com sincronizado_em anterior à última 'Publicação: publicada'). Também atende pedido direto. Modo artefato: chamado pela sa-especificar.elm (passos baixar e conferir).
2. **pré-condição** — Segue a sa-elm.regras. Sem ELM, diz que a especificação vigente fica no repositório e que não há bundle, e devolve. Com pa incompleto (erro config), oferece a sa-elm.setup.
3. **plano** — Modo bundle: mostra o que mudou no ELM e será baixado, mais os removidos e os inconsistentes. Se a listagem vier incompleta, nada é removido.
4. **baixar bundle** — elm_sync para a pasta do bundle (elm.bundle do agentes.json, ex.: docs/elm/<pa>/). Baixa mesmo sem novidade, para gravar sincronizado_em no sync.md. Como só lê do ELM, não pede 'sim'. Se houver erros, mostra e avisa que a data não mudou.
5. **commit** — Faz o commit do bundle e do sync.md pelo fluxo/commit-na-branch-base.md. Se o bundle está no .gitignore, não há commit. O bundle nunca é editado.
6. **indexar** — Se baixou algo, pergunta 'indexar agora?'. Com sim, roda o elm_indexar_local em segundo plano e, com o índice pronto, oferece a sa-elm.visualizar. Com não, a próxima busca local indexa o que mudou.
7. **artefato** — Modo artefato: confere a trava artefato-exclusivo (fluxo/travas.json): se outra fatia aberta tem o mesmo artefato no elm/ dela, diz qual e devolve sem baixar (a sa-status mostra a trava). Livre: lê o artefato pelo id (texto inteiro, título e modificado_em) e devolve a quem chamou, sem gravar. Quem grava o arquivo em elm/ e o commit de referência é a sa-especificar.elm.
8. **saída** — Modo bundle: '🔄 ELM · baixados <n> · bundle de <data>'. Modo artefato: devolve a quem chamou o texto, o título e a versão de referência (modificado_em), sem gravar.

### sa-elm.visualizar
Igual à 2.0: o elm_explorar_local gera o explorar.html offline a partir do índice, a pedido ou depois do 'sim' da indexação.

1. **entrada** — A pedido, ou depois do 'sim' a 'indexar agora?' na sa-elm.baixar.
2. **gerar** — O elm_explorar_local gera um HTML único e offline na pasta do bundle, com vista 3D ou 2D, busca e filtros. Gerar de novo sobrescreve o arquivo.
3. **sem índice ou bundle** — Sem índice, indexa e roda de novo. Sem bundle, oferece a sa-elm.baixar.
4. **saída** — '🗺️ Bundle · documentos · chunks · galáxias · links · <caminho>', e encerra.

## sa-status
Painel somente leitura do fluxo e porta de entrada do item. Faz a daily: WIP, vazão, lead time, idade contra o SLE, fila de triagem, topo puxável, MRs esperando pessoa, Sustentação com prazo, reserva de capacidade, autopilot devolvido, 'Publicação: pendente' e a trava de precedência de artefato. Recebe '<id>' e 'minha próxima' (vindos da sa-iniciar), mostra o estado e oferece seguir com a skill dona. Também lista as pendências de rastreio, junta as lições aprendidas para a review e fecha a sessão. Só o fechar-sessao grava arquivo, e o EWM fica para a sa-elm.

### sa-status.painel
Coleta (backlog.md e sprint da branch base, branches <id>, status.md, MR, tasks.md, acordos, equipe, Sustentação, autopilot, publicação, trava) → métricas → seções → sugestão → 'seguir com a sugestão?'. Não grava nada.

1. **entrada** — Começa por 'status', 'painel', 'bom dia', 'onde parei' ou 'como está a sprint', ou é chamado pela sa-planejamento.retrospectiva para pegar os números. Sem .sabia/sabia.md → diz que o fluxo não está configurado, oferece a sa-setup.configurar e para. Sem equipe.json ou acordos.md → sugere a sa-planejamento.inicial e segue sem limites de WIP nem SLE.
2. **backlog e sprint** — Roda git fetch --quiet e lê de origin/<branch_base> o .sabia/planejamento/backlog.md (id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em) e a sprint aberta (o sprints/<pai>/sprint-<nn>.md de maior chave: datas, meta, reserva de capacidade, linhas Item · Trabalho · Responsável · Tarefas). A ordem das linhas do backlog.md é a prioridade.
3. **branches e status.md** — Uma branch <id> publicada (refs/remotes/origin/) marca a atribuição. O dono é o autor do primeiro commit dela fora da branch base. Também entram as worktrees .sabia/local/wt/<id> (git worktree list). Na pasta da spec (formato_spec do agentes.json: .kiro/specs/ft-<nnn>-<slug>/ ou openspec/changes/ft-<nnn>-<slug>/), lê o status.md: Trilha · Autonomia · Fase (implementando · revisando · verificando · pr-aberto · retrabalho) · MR · Desvios · Em aberto · Lições aprendidas · Retomar. A trilha trivial não tem status.md, e a fase sai do MR. Item concluida ou cancelada no backlog.md → o status.md da branch não vale.
4. **MR** — Para cada branch <id>, lê pelo MCP gitlabpr (só leitura) o MR: estado, Draft, aprovações, threads abertas, conflito, pipeline e link. Em-revisao é derivado (MR aberto, fora de Draft, sem aprovação) e não se grava. Sem o MCP, usa o link do campo MR do status.md e diz 'MR não conferido'.
5. **tasks.md** — Na rápida e na completa, lê do tasks.md da pasta da spec o [x]/total e o primeiro pendente. Na trivial não há.
6. **acordos e equipe** — Lê do acordos.md o WIP por status, o SLE, as classes de serviço, a reserva de capacidade, o Id no commit e o CT no teste. Lê do equipe.json os membros ativos e as booleanas desenvolvedor · especificador · produto.
7. **identidade** — Regra única, citada pelas outras skills: a pessoa é o membro ativo do equipe.json cujo usuario é o usuário do GitLab da sessão (gitlabpr). Sem o MCP, usa a parte antes do @ do git config user.email ou o nome do git config user.name. Sem correspondência, pergunta o usuario uma vez. 'Minhas' = Responsável no backlog.md ou na linha da sprint igual ao usuario, ou branch <id> da pessoa.
8. **Sustentação** — Itens tipo sustentação nova ou em-andamento, por categoria (AT · IM · BD · IN · OP · EX), com o Prazo do cabeçalho do registro. Prazo '—' fica fora do 'vencendo'.
9. **autopilot** — Para cada .sabia/local/loop-<id>.md com disparo do disjuntor (teto do acordos.md ou 2 reprovações seguidas), marca o item como 'devolvido pelo autopilot → <dono> resolve e relança (sa-desenvolver.iniciar, passo autopilot)'. As worktrees em autopilot aparecem em andamento.
10. **publicação pendente** — Só com a seção ELM no sabia.md. Junta os itens cujo status.md arquivado diz 'Publicação: pendente' (OpenSpec: openspec/changes/archive/*-ft-<nnn>-<slug>/status.md; Kiro: .kiro/specs/ft-<nnn>-<slug>/status.md, que fica no lugar). 'Publicação: publicada <data>' sai da lista. Destino: quem tem especificador, pela sa-elm.publicar.
11. **trava de artefato** — Duas fatias não alteram o mesmo artefato do DOORS ao mesmo tempo. Lê na branch base as pastas elm/ das fatias que ainda seguram artefato, isto é, não cancelada e sem 'Publicação: publicada' no status.md (<pasta da spec>/elm/<id do ELM>-<tipo>-<slug>.md; no OpenSpec, também as arquivadas), e os artefatos afetados das fichas (altera | exclui). Quando o mesmo <id do ELM> aparece em duas fatias, a precedência é da fatia cujo arquivo entrou primeiro na branch base (git log --diff-filter=A). A outra fica 'aguarda <FT> (artefato <id>)' até a primeira ficar cancelada ou com 'Publicação: publicada'. A fatia que só tem o artefato nos artefatos afetados também aguarda.
12. **métricas** — Linha de topo: WIP por status contra o limite do acordos.md (em-revisao contado pelos MRs abertos), vazão do ciclo (itens de desenvolvimento com concluida_em nas datas da sprint, e atendimento à parte), lead time médio do ciclo (concluida_em − iniciada_em, em dias corridos) e idade dos itens em-andamento (hoje − iniciada_em) contra o SLE, quando existe.
13. **expedite** — No topo, os itens com prioridade crítica não terminais, com o próximo passo pela tabela do sa-status.item. A puxada segue a política do acordos.md, sem aprovação.
14. **fila de triagem** — Fatias e bugs nova (com 'falta: <pergunta> · para <relator>', quando houver) → sa-triar.triar. Entram também os 'adiada até <data>' com a data vencida. Os itens sustentação nova não entram aqui: ficam na seção Sustentação.
15. **esperando pessoa** — MR esperando revisão → qualquer desenvolvedor ≠ autor, com o dono por área pelo CODEOWNERS (sa-revisar.mr). MR aprovado com CI verde → o autor faz o merge (sa-desenvolver.encerrar). Em aberto do status.md que bloqueia → quem tem produto responde, nas Decisões da ficha. Documento sem 'Aprovado: <usuário> · <data>': pitch.md esperando go/kill (sa-refinar.moldar), prd.md (sa-prd.prd) e ficha (sa-refinar.detalhar) → quem tem produto. Arquivo de elm/ sem aprovação → quem tem especificador (sa-refinar.detalhar).
16. **retrabalho** — Fase retrabalho, ou MR com threads abertas que pedem mudança → o dono da branch retoma no mesmo MR (sa-desenvolver.codificar).
17. **topo puxável** — Itens elegível, primeiro os que têm linha na sprint aberta e depois os demais, na ordem das linhas. Crítica vem primeiro, e 'adiada até <data>' futura fica fora. O item preso pela trava aparece com 'aguarda'. Só aparece quando o WIP de em-andamento tem folga; senão, diz 'WIP cheio: termine antes'. Destino: sa-desenvolver.iniciar.
18. **refinamento e produto** — Fatias e bugs aceita → sa-refinar.detalhar. Épico a-moldar → sa-refinar.moldar. Épico em-especificacao sem prd.md aprovado → sa-prd.prd. Épico em-especificacao com prd.md aprovado e sem fatias → sa-refinar.fatiar. Épico fatiado mostra o andamento das fatias (pai = EP-nn).
19. **reserva de capacidade** — Linhas de atendimento da sprint aberta contra a '**Reserva de capacidade:** <n> itens' do cabeçalho. Estourou → aviso 'reserva de capacidade estourada: quem tem produto decide o que entra' (sa-atender.atender segue puxando o crítico).
20. **fim do ciclo** — No último dia da sprint, ou depois: '<n> itens em aberto → a virada pergunta no próximo planejamento (sa-planejamento.sprint)'. Mostra também a review (sa-planejamento.review), se a ## Review está vazia, e a retrospectiva (sa-planejamento.retrospectiva), se a ## Retro está vazia.
21. **sugestão** — A ação de maior alavanca, nesta ordem: expedite → MR esperando revisão, MR aprovado esperando merge ou WIP estourado → Sustentação com prazo vencido ou vencendo até o próximo dia útil → autopilot devolvido → terminar o que é da pessoa → puxar o topo → refinar (aceita, épicos) → triar a fila → publicação pendente (só para quem tem especificador).
22. **mostrar** — Painel na ordem: cabeçalho (projeto · <pai>/Sprint <nn> · dias restantes · meta) · métricas · expedite · em andamento (Item · Título · Fase · Autonomia · Tarefas · MR · Idade · Retomar) · esperando pessoa · retrabalho · topo puxável · refinamento e produto · Sustentação e reserva de capacidade · fila de triagem · publicação pendente · trava de artefato · pendências (a contagem da sa-status.pendencias) · fim do ciclo · sugestão. Seção vazia não aparece. Termina com 'seguir com a sugestão?': com o sim, segue pela skill da sugestão na mesma sessão.

### sa-status.item
Vem da sa-iniciar. Recebe '<id>' (FT, EP, AT…, ib ou tarefa do EWM): identifica o item, mostra o estado (status, branch, MR, Fase, trava) e diz a skill.fluxo dona pela tabela única de estado → skill, com 'seguir agora?'. Não grava nada.

1. **entrada** — Começa por '<id>', 'vamos trabalhar na FT-031', 'pegar a AT-012' ou 'retomar a FT-031', pela sa-status.minha-proxima, ou pela entrada comum (fluxo/entrada.md) quando o item não é do fluxo pedido ('use sa-status <id>'). Sem .sabia/sabia.md → oferece a sa-setup.configurar e para.
2. **identificar** — A coleta é a do sa-status.painel. Procura, nesta ordem: o id no backlog.md da branch base; o número na coluna ib; a tarefa ('DEV 123', 'ESP 456', 'ATD 789' ou só o número) na coluna Tarefas dos sprint-<nn>.md. Texto sem id → pedido não registrado → sa-triar.triar (ou sa-triar.capturar, para só registrar). Id que não está em nenhum lugar → diz que não está registrado e oferece as mesmas duas. Nunca inventa dado de item.
3. **estado** — Junta o status e a obs do backlog.md, a linha da sprint aberta, a branch <id> e o dono dela, o status.md (Fase, Retomar), o MR pelo gitlabpr, o loop-<id>.md, a 'Publicação' e a trava de artefato (sa-status.painel.trava de artefato).
4. **terminal** — concluida, concluido, cancelada ou cancelado → mostra o status e a obs e para. 'cancelada · virou EP-nn' → aponta o EP-nn. Concluída com 'Publicação: pendente' → quem tem especificador (sa-elm.publicar).
5. **triagem e refinamento** — Fatia ou bug: nova → sa-triar.triar. 'adiada até <data>' → depois da data, sa-triar.triar; puxar antes da data → sa-desenvolver.iniciar (a entrada comum avisa e registra). aceita → sa-refinar.detalhar, que aguarda se a trava de artefato prende o item.
6. **desenvolvimento** — elegível sem branch → sa-desenvolver.iniciar. elegível com branch (voltou na virada) ou em-andamento sem MR → sa-desenvolver.codificar, pelo Retomar. em-andamento sem branch publicada (a sessão parou antes do push) → só o responsável retoma (sa-desenvolver.iniciar). Retrabalho ou autopilot devolvido → sa-desenvolver.codificar. MR esperando revisão → qualquer desenvolvedor ≠ autor (sa-revisar.mr); ao autor, diz que espera. MR aprovado com CI verde, ou mergeado sem o item concluída → o autor (sa-desenvolver.encerrar). MR fechado sem merge → mostra e aponta sa-desenvolver.codificar. Aceite humano (revisão humana) pedido → qualquer pessoa (sa-verificar.revisao-humana). Trava de artefato → mostra quem tem a precedência e para.
7. **épico** — a-moldar → sa-refinar.moldar. em-especificacao sem prd.md aprovado → sa-prd.prd. em-especificacao com prd.md aprovado → sa-refinar.fatiar. fatiado → lista as fatias (pai = EP-nn) com o próximo passo de cada uma, e ajuste de fatias ou do épico → sa-refinar.ajustar.
8. **Sustentação** — Item sustentação nova ou em-andamento → sa-atender.atender, para as seis categorias.
9. **fora do Sabiá** — Número do EWM ausente no backlog.md e nos sprint-<nn>.md → diz que o Sabiá não o conhece e aponta a sa-elm.conferir, que propõe gravar o id. O IB que agrupa (ex.: Sustentação) não é item: diz o que é e pede o item.
10. **mostrar e seguir** — Mostra '🔀 <id> — <título> · <tipo> · <status> · branch de <usuario> · MR <estado> · <Fase>' e 'Próximo: <skill.fluxo> (<quem pode>)'. Quem pode sai das booleanas: desenvolvedor para sa-desenvolver.* e sa-revisar.mr; produto para go/kill e aprovações; especificador para sa-elm.publicar e elm/; triagem, captura e revisão humana são de qualquer pessoa. Se a pessoa não tem a booleana, diz quem tem (equipe.json) e para. Se tem, pergunta 'seguir agora?': com o sim, segue pela skill.fluxo na mesma sessão; sem o sim, termina.

### sa-status.minha-proxima
Vem da sa-iniciar. 'Minha próxima' lista o trabalho da pessoa (atribuição, revisão, responsável na sprint, aprovações pelas booleanas) na ordem de prioridade; a escolha segue como o sa-status.item. Sem EWM.

1. **entrada** — Começa por 'minha próxima', 'o que eu pego agora?' ou 'minhas tarefas'. A coleta é a do sa-status.painel, e a pessoa vem do sa-status.painel.identidade.
2. **coletar** — Itens com branch <id> da pessoa e trabalho aberto (em-andamento, retrabalho, autopilot devolvido, MR aprovado para mergear). Se tem desenvolvedor, também os MRs de outros esperando revisão (primeiro aqueles em que ela é @dono no CODEOWNERS). Linhas da sprint aberta com Responsável igual à pessoa e item não terminal (especificação, desenvolvimento, atendimento). Itens sustentação com ela como responsável. Se tem produto, documentos esperando 'Aprovado:' e go/kill. Se tem especificador, elm/ sem aprovação e 'Publicação: pendente'.
3. **mostrar** — Tabela # · Item · Trabalho · Estado · Próximo (skill.fluxo). Crítica vem primeiro, depois o que já está em andamento e depois a ordem das linhas do backlog.md. Pergunta 'qual? (número)'.
4. **escolher** — A escolha segue pelo sa-status.item a partir do passo estado, terminando no 'seguir agora?'.
5. **nada** — Nada para a pessoa → oferece o topo puxável do sa-status.painel (sa-desenvolver.iniciar), se ela tem desenvolvedor. Sem a booleana, oferece a fila de triagem (sa-triar.triar). Sem o sim, termina.

### sa-status.pendencias
Pendências de rastreio e de consistência, com a lista fechada abaixo. Cada uma tem destino, e nenhuma trava. O painel mostra a contagem.

1. **entrada** — Chamado pelo sa-status.painel (contagem) e pela sa-planejamento.retrospectiva, ou por pedido direto ('pendências', 'rastreio'). A coleta é a do sa-status.painel.
2. **publicação pendente** — Status.md arquivado com 'Publicação: pendente', só com ELM → quem tem especificador (sa-elm.publicar).
3. **trava de artefato** — Fatia que aguarda o artefato de outra (sa-status.painel.trava de artefato) → mostra quem tem a precedência. Libera quando a primeira fica cancelada ou com 'Publicação: publicada'.
4. **commit sem id** — Só com 'Id no commit: sim' no acordos.md. Commit da branch <id> (git log origin/<branch_base>..origin/<id>) sem o id da tarefa que está na coluna Tarefas da sprint → o dono da branch corrige na próxima mensagem (sa-desenvolver.codificar). Item sem tarefa na sprint não é cobrado.
5. **CT sem teste** — Só com 'CT no teste: sim' no acordos.md. Linha do CT.csv da fatia aberta cujo CT-nn não aparece (git grep) nos testes alterados pela branch (git diff --name-only origin/<branch_base>...origin/<id>) → sa-desenvolver.codificar.
6. **MR mergeado sem concluir** — MR merged com o item ainda não concluida no backlog.md → o autor registra (sa-desenvolver.encerrar).
7. **MR com tarefas pendentes** — Fase pr-aberto sem MR aberto, ou MR aberto com tarefa pendente no tasks.md → sa-desenvolver.codificar.
8. **item sem ficha** — Fatia ou bug elegível ou em-andamento sem ficha (fatias/FT-nnn-<slug>.md), ou bug sem passos · atual · esperado → sa-refinar.detalhar.
9. **atribuição × status** — Item em-andamento sem branch <id> publicada → o responsável retoma (sa-desenvolver.iniciar). Branch <id> publicada com o item em nova ou aceita → sa-desenvolver.iniciar. Branch <id> aberta com o item concluida ou cancelada → o dono apaga a branch remota (sem --force).
10. **fora da sprint** — Item em-andamento sem linha na sprint aberta → quem puxou acrescenta a linha (sa-planejamento.sprint, reabastecimento).
11. **idade acima do SLE** — Só com SLE no acordos.md. Item em-andamento com idade (hoje − iniciada_em) acima do SLE → o dono decide se divide (sa-refinar.ajustar) ou se termina (sa-desenvolver.codificar).
12. **épico sem fechar** — Épico fatiado com todas as fatias terminais e pelo menos uma concluida, ainda sem concluido. Ou com todas canceladas, sem cancelado → sa-refinar.ajustar.
13. **backlog fora da branch base** — backlog.md ou sprint-<nn>.md alterado numa branch de item, quando só muda na branch base (fluxo/commit-na-branch-base.md) → o dono da branch desfaz a alteração na branch.
14. **dado de cliente** — git ls-files: arquivo em .sabia/planejamento/sustentacao/** além do <ID>-<slug>.md, ou *.csv / *.xlsx fora do CT.csv da spec e do .sabia/creditos/<usuario>.csv → quem versionou tira do git (o dado vai para .sabia/local/sustentacao/<ID>/).
15. **mostrar** — Lista '⚠️ <pendência> · <item> → <skill.fluxo> (<quem>)', ou 'nenhuma'. Chamado por outro fluxo, devolve a lista a ele. Direto, oferece 'seguir com a primeira?' e, com o sim, segue pela skill dela.

### sa-status.licoes-aprendidas
Junta, somente leitura, as Lições aprendidas das fatias e da Sustentação concluídas no ciclo, já cruzadas com as Regras aprendidas, e devolve a lista à curadoria da review.

1. **entrada** — Chamado pela sa-planejamento.review.regras aprendidas ou por pedido direto ('lições aprendidas do ciclo'). O ciclo é o da sprint aberta, ou o da última fechada se a pessoa pedir.
2. **coletar** — Itens com concluida_em nas datas da sprint. Das fatias e bugs, lê a seção Lições aprendidas do status.md: no Kiro, .kiro/specs/ft-<nnn>-<slug>/status.md; no OpenSpec, openspec/changes/archive/*-ft-<nnn>-<slug>/status.md ou, se ainda não arquivou, openspec/changes/ft-<nnn>-<slug>/status.md. Na trivial, lê a seção Lições aprendidas da descrição do MR (gitlabpr; sem o MCP, diz que não leu). Da Sustentação, lê a seção Lições aprendidas do registro.
3. **cruzar** — Marca 'já está' na lição que já tem regra equivalente nas Regras aprendidas do .sabia/sabia.md, com o mesmo texto ou a mesma origem.
4. **devolver** — Lista '# · lição · origem <id> · já está?'. Chamado pela review, devolve a lista a ela. Direto, mostra a lista e oferece 'levar à review?' (sa-planejamento.review). Sem o sim, termina.

### sa-status.fechar-sessao
Ao encerrar uma sessão num item: Retomar no status.md (ou Atividade no registro) → tasks.md → 'lançar horas?' (sa-elm) → créditos no .sabia/creditos/<usuario>.csv (Kiro) → commit com 'ok' → 'seguir para a próxima?' ou a frase de retomada.

1. **entrada** — Começa por 'fechar a sessão' ou 'encerrar por hoje', ou pela oferta de fechar no fim de uma entrega. O item é o da branch <id> atual. Na Sustentação, sem branch, é o item que a pessoa informar.
2. **retomar** — Grava no campo Retomar do status.md da fatia o que foi feito e o próximo passo exato, na própria branch. Na trivial, sem status.md, a frase vai na resposta e, com MR aberto, num comentário do MR (em ask). Na Sustentação, vai na seção Atividade do registro.
3. **tasks.md** — Marca no tasks.md só o que está pronto e verde.
4. **horas** — Só com a seção ELM no sabia.md: pergunta 'deseja lançar horas?' e, com o sim, segue para a sa-elm.horas. Não lançar não é falta, e o fechamento segue.
5. **créditos** — Só no Kiro; no opencode, pula. Pergunta '💳 Registrar os créditos desta sessão? (sim)' e roda o script na resposta, porque o Kiro só grava o consumo do turno quando ele termina: uv run --no-project python <skill>/scripts/creditos.py --pasta <cada pasta do git worktree list> --usuario <usuario> --item <id> --skill <skill da sessão>. O script lê ~/.kiro (só leitura) e acrescenta ao .sabia/creditos/<usuario>.csv uma linha por sessão com consumo depois do maior 'ate' já gravado dela: sessao · ate · item · skill · modo (agente: sa-desenvolvedor · sa-especificador · sa-pesquisador · sa-revisor · sa-verificador · padrão) · creditos. Sessão sem consumo novo não gera linha. Nenhum outro arquivo guarda créditos.
6. **commit** — Mostra o git status e propõe o commit do que está pronto, com o status.md, o tasks.md e o CSV de créditos, na branch atual. Na Sustentação, sem branch, o registro e o CSV de créditos vão pelo fluxo/commit-na-branch-base.md ('<ID> registrar sessão'). A mensagem segue o padrão do sabia.md, e o id da tarefa só entra com 'Id no commit: sim'. Grava com o 'ok' e oferece o push da própria branch (em ask, sem --force). Estado do backlog.md e do sprint-<nn>.md não é gravado aqui.
7. **retomada** — Na mesma tarefa, oferece 'seguir para a próxima?' na mesma sessão. Em outra tarefa, termina com a frase para a sessão nova ('vamos trabalhar na FT-031', que entra pelo sa-status.item).

## sa-setup
Wizard que instala o Sabiá no projeto. Roda na sessão sem agente, porque grava o harness que os agentes negam. Escreve o .sabia/sabia.md, o agentes.json, a pasta do produto, os toolkits, o template do MR e os 5 agentes (principais sa-desenvolvedor e sa-especificador; subagentes sa-pesquisador, sa-revisor e sa-verificador) nos formatos do opencode e do Kiro. Decide o formato da spec (formato_spec). Do ELM, só pergunta 'usa ELM?', chama a sa-elm.setup e aplica os dados que ela devolve. Também customiza fluxos e padrões.

### sa-setup.configurar
Instalação e atualização numa sequência só. Pergunta 'usa ELM?' (sim → sa-elm.setup, cujos dados aplica), decide o formato_spec, grava o sabia.md com seções fechadas (Projeto e Comandos por mescla) e gera os 5 agentes.

1. **entrada** — Pedido 'configurar o Sabiá' (inicial) ou 'atualizar a configuração'. Também pode ser chamada depois de uma sa-elm.setup direta, para aplicar os dados do ELM. Roda na sessão sem agente. Dentro de um agente sa-*, diz para abrir a sessão sem agente e para.
2. **pré-checagem** — Confere os alvos instalados (kiro · opencode), a versão do Sabiá contra a do agentes.json e o uv. Se o agentes.json já existe, entra em atualização: mostra a configuração atual e só pergunta o que muda.
3. **projeto** — Lê o README, o AGENTS.md (se houver), o build e o git log e propõe tipos, stack, módulos e regras críticas, cada um com a fonte. Mescla no ## Projeto do .sabia/sabia.md sem reescrever o que já existe; o AGENTS.md, se houver, é só fonte.
4. **comandos** — Detecta e roda uma vez compilar, testes, teste do trecho tocado ({alvo}), lint e cobertura. Mescla na tabela ## Comandos do .sabia/sabia.md (Ação × módulo), que é a branch base do backpressure em camadas.
5. **git** — Detecta a branch base e confere que ela aceita push (ex.: develop), porque o estado e os documentos de planejamento vão direto nela. Se não aceitar, avisa e pede outra branch base. A branch de trabalho é <id>. Mostra o padrão de commit encontrado; o id do WI só entra no commit se o acordos.md pedir.
6. **GitLab** — Testa o gitlab_listar_mrs pelo MCP gitlabpr e mostra o modelo da credencial. A identidade é o usuário do GitLab. Sem GitLab, o MR sai como título e descrição.
7. **banco** — Pergunta qual tool do MCP de banco só faz consulta. Só ela entra nos agentes, sempre em leitura.
8. **formato da spec** — Se algum alvo é Kiro, grava formato_spec: kiro sem perguntar. Se o único alvo é o opencode, pergunta: Kiro (padrão da empresa) ou OpenSpec. Grava no agentes.json e registra na seção Especificação do sabia.md. As skills compiladas leem a chave quando rodam.
9. **pasta do produto** — .sabia/planejamento, com backlog.md, epicos/, fatias/, sprints/, sustentacao/, atas/ e prototipos/.
10. **usa ELM?** — Pergunta 'usa ELM?'. Com sim, chama a sa-elm.setup e segue quando ela devolve a chave elm, o texto da seção ELM e as regras ELM dos agentes, que esta skill aplica nos passos sabia.md e 'agentes.json e perfis'. Com não, ou se a sa-elm.setup voltar sem ELM, grava elm: false.
11. **glossário e ADRs** — Sem GL do DOORS, oferece o .sabia/glossario.md, criado só se a pessoa pedir. ADRs em docs/adr/ são opcionais e servem só para decisão que atravessa fatias.
12. **especificação** — Pergunta 'REG com dados técnicos' (não | sim) e 'Telas' (não | sim; o protótipo só vale com aprovação do cliente) e grava as duas na seção Especificação do sabia.md.
13. **sustentação** — Grava a tabela Sustentação do sabia.md (Categoria · Descrição · Exemplo) com as seis categorias AT · IM · BD · IN · OP · EX. A pessoa ajusta a descrição e o exemplo.
14. **toolkits** — Faz o inventário de skills e toolkits (busca e bloco Fluxos). skills[].papeis e steering[].papeis do toolkit mapeiam 1:1 para os agentes: desenvolvedor → sa-desenvolvedor, especificador e produto → sa-especificador, pesquisador → sa-pesquisador, revisor → sa-revisor, verificador → sa-verificador. Tipos HF, UC, REG, MSG e EL vão ao sa-especificador; a ET as-built, ao sa-desenvolvedor; os critérios de revisão, ao sa-revisor; o texto verificacao, ao sa-verificador. Os desvios usam ids de passo da 2.1 (ex.: sa-desenvolver.codificar.tarefa; o gerador aceita também sa-codificar.codificar.tarefa) e vão ao prompt do agente que roda a skill do passo.
15. **perfis** — Mostra o cartão dos 5 agentes fixos. Principais, escolhidos pela pessoa ao abrir a sessão: sa-desenvolvedor (sa-desenvolver, sa-plano, sa-revisar.mr, sa-verificar.revisao-humana, sa-atender e a sa-especificar.archive que a sa-desenvolver.encerrar chama) e sa-especificador (sa-refinar, sa-prd, sa-especificar, sa-entrevistar, sa-planejamento; inclui as funções de produto). Nos dois: sa-triar, sa-status, sabia e as ofertas da sa-elm. Subagentes: sa-pesquisador (sa-pesquisar), sa-revisor (sa-revisar.revisar, com os critérios de revisão do toolkit) e sa-verificador (sa-verificar.verificar, com o texto verificacao do toolkit). sa-setup e sa-elm.setup ficam na sessão sem agente. A pessoa só marca os extras por agente: skills de toolkit, a tool de banco e os agentes do projeto, que vêm desmarcados e com o 'para quê'.
16. **regras dos perfis** — Mostra os 2 modelos de permissão do perfis.json. build (sa-desenvolvedor e sa-especificador): ler e editar sem restrição por pasta; só o harness (caminhos explícitos) e os segredos em deny; push, merge, curl e wget em ask; rebase, --force, --force-with-lease, reset --hard, --no-verify e destrutivos em deny; GitLab: leitura allow, escrita ask. só leitura (sa-pesquisador e sa-revisor): ler allow, editar deny, comandos e MCP só de leitura. O sa-verificador é só leitura mais rodar a aplicação (Executar do sabia.md), curl na URL de teste e gravar o CT.csv. ELM (agentes.json.elm.regras) só com elm diferente de false. No autopilot (o sa-desenvolvedor como subagente na worktree), ficam liberados o push da própria branch (sem --force), o merge da branch base nela e abrir ou atualizar o MR dela; merge do MR, ELM e rede continuam bloqueados.
17. **verificação** — Em backend ou frontend, pergunta o Executar e a URL de teste (nunca a de produção) e grava na seção Verificação de aceite do sabia.md. O sa-verificador exercita a aplicação direto, por curl ou navegador, e o curl dele fica liberado só para essa URL.
18. **autonomia** — Mostra o backpressure em camadas (trecho tocado a cada alteração, suíte completa antes do MR, baseline do CI) e o disjuntor do autopilot, que mora no acordos.md.
19. **sabia.md** — Grava o .sabia/sabia.md com estas seções, fechadas: Resumo do fluxo · Especificação · Verificação de aceite · Sustentação · ELM (o texto da sa-elm.setup, só com ELM) · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas (regra · origem FT/AT · data). Em atualização, preserva as Regras aprendidas.
20. **ponteiros** — Kiro: .kiro/steering/sabia.md com #[[file:.sabia/sabia.md]]. opencode: .sabia/sabia.md nas instructions do opencode.json, por mescla.
21. **agentes.json e perfis** — Grava o .sabia/config/agentes.json no esquema da referência gerador e roda o gerador, que escreve os 5 agentes e os de toolkit nos alvos, com as regras ELM quando elm não é false.
22. **backlog.md** — Se não existir, cria o backlog.md vazio com as colunas id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em.
23. **template do MR** — Se não existir .gitlab/merge_request_templates/Default.md, cria a partir do padrão sa-desenvolver/pr.md (O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados). Se já existe, não sobrescreve.
24. **CODEOWNERS** — Se não existir CODEOWNERS, sugere um com as pastas do projeto e o @usuario do equipe.json, mas não grava: o time grava. Sem CODEOWNERS, o revisor é qualquer desenvolvedor diferente do autor.
25. **.gitignore** — Põe .sabia/local/ fora do git.
26. **conferir** — Confere os caminhos citados, testa o GitLab, roda um a um os Comandos do .sabia/sabia.md e valida os agentes (opencode debug agents; kiro-cli validate e list), os 5 fixos e os de toolkit. No Kiro, confere também que o agente de toolkit tem as permissões do dono do passo, o workspace confiável e a exclusão de .sabia/local/.
27. **commit** — Sugere o commit, na branch base, dos arquivos gravados. A pessoa confirma.
28. **próximo passo** — Oferece seguir para a sa-planejamento.inicial, que cria o equipe.json (usuario, as booleanas desenvolvedor · especificador · produto e elm_login opcional) e o acordos.md. Se veio só para aplicar os dados de uma sa-elm.setup, aplica e encerra.

### sa-setup.customizar
Mesmo modo da 2.0: trocar, inserir ou remover passo e trocar padrão em .sabia/fluxo/ e .sabia/padrao/, com a branch base pelo --base. O delta vai ao prompt do agente que roda a skill do passo.

1. **entrada** — Pedido 'customizar o passo X', 'trocar o padrão Y' ou 'descustomizar'. Roda na sessão sem agente, porque .sabia/fluxo e .sabia/padrao estão no harness.
2. **achar o ponto** — Casa o pedido com os fluxos compilados da 2.1 pelo id skill.fluxo.passo.
3. **forma** — trocar · inserir · remover · padrão. Remover vale só para passo removível e sem trava (fluxo/travas.json).
4. **copiar com base** — Copia para .sabia/fluxo/ ou .sabia/padrao/, com a branch base pelo --base.
5. **regenerar** — Roda o gerador, que leva o delta ao prompt do agente que roda a skill do passo.
6. **o que mudou** — Mostra o diff contra a branch base e encerra. Descustomizar apaga o override e regenera.

### sa-setup.gerador (referência)
Referência da skill, não é fluxo: o scripts/gerar_agentes.py com o perfis.json gera os 5 agentes nos formatos do opencode e do Kiro. Roda no passo 'agentes.json e perfis' do configurar e no passo regenerar do customizar.

1. **agentes.json** — Esquema fechado: alvos [kiro|opencode] · sabia (versão) · formato_spec (kiro|openspec) · produto · branch_base · prefixo_branch · glossario | null · adr | null · elm: false | {pa, bundle, regras {allow, ask, deny}} · toolkits {} · passos [] · agentes.{sa-desenvolvedor|sa-especificador|sa-pesquisador|sa-revisor|sa-verificador}.{modelo, mcp [], skills [], subagentes [{nome, para}]}.
2. **perfis.json** — Fica em skills/sa-setup/assets/agents/perfis.json, no lugar do papeis.json. Contém harness [], segredos [], os 2 modelos de permissão (build e só leitura) com allow/ask/deny, a condicional banco e os 5 agentes, cada um com permissao (build: sa-desenvolvedor e sa-especificador; leitura: sa-pesquisador, sa-revisor e sa-verificador), mode (primary | subagent), as skills que roda e os subagentes que chama. O sa-verificador tem as liberações (Executar, curl na URL de teste, CT.csv), e o sa-desenvolvedor, o bloco autopilot. As regras ELM não ficam aqui: o gerador as lê de agentes.json.elm.regras. São cerca de 100 padrões.
3. **harness** — Em deny: .kiro/agents, .kiro/settings, .kiro/steering/sabia.md, .opencode, opencode.json, .sabia/config, .sabia/fluxo e .sabia/padrao. Liberados: .kiro/specs, openspec/, .sabia/planejamento e .sabia/creditos.
4. **prompts** — São cinco prompts: sa-desenvolvedor.md, sa-especificador.md, sa-pesquisador.md, sa-revisor.md e sa-verificador.md.
5. **saída** — Kiro: .kiro/agents/sa-<nome>.json para os 5 agentes, só com nomes de capability em tools (sem toolsSettings nem allowedTools). sa-pesquisador e sa-revisor não recebem escrita; os limites por caminho e URL (o CT.csv e a URL de teste do sa-verificador) ficam no prompt. opencode: .opencode/agents/sa-<nome>.md, com mode primary (sa-desenvolvedor, sa-especificador) ou subagent (sa-pesquisador, sa-revisor, sa-verificador) e permission.
6. **toolkit** — skills[].papeis e steering[].papeis mapeiam 1:1 (desenvolvedor → sa-desenvolvedor, especificador e produto → sa-especificador, pesquisador → sa-pesquisador, revisor → sa-revisor, verificador → sa-verificador; sai orquestrador). Tipos HF/REG/EL/GL → sa-especificador; ET as-built → sa-desenvolvedor; critérios de revisão → sa-revisor; verificacao → sa-verificador. O override de fluxo e o desvio de toolkit vão ao prompt do agente que roda a skill do passo; o desvio da codificação é sa-desenvolver.codificar.tarefa (aceita também sa-codificar.codificar.tarefa). Um agente de toolkit (agentes[], ligado em passos[].agente) vira subagente do dono do passo, em .kiro/agents/<toolkit>-<agente>.json e .opencode/agents/<toolkit>-<agente>.md, com as permissões dele. O toolkit.schema.json mantém papeis, os passos usam ids da 2.1 e requer.sabia passa a 2.1.
7. **testes** — O test_gerar_agentes.py cobre 5 agentes × 2 formatos, com e sem elm, o bloco autopilot, as liberações do sa-verificador, o mapeamento 1:1 de papeis e o agente de toolkit com as permissões do dono.

### sa-setup.escrita (referência)
Referência da skill, não é fluxo: onde a sa-setup escreve e onde nunca escreve.

1. **onde escreve** — .sabia/sabia.md, .sabia/config/agentes.json, .sabia/fluxo/, .sabia/padrao/, .sabia/planejamento/backlog.md, .kiro/steering/sabia.md, .kiro/agents/, .opencode/agents/, as instructions do opencode.json, .gitlab/merge_request_templates/Default.md (só se não existir) e .gitignore.
2. **onde não escreve** — .sabia/config/elm/ (é da sa-elm.setup), .sabia/local/, CODEOWNERS (só sugere), equipe.json e acordos.md (são da sa-planejamento.inicial).

## sabia
Guia e roteador do fluxo na 2.1. Explica as fases e os papéis e manda cada pedido para a skill certa entre as 16 skills listadas nas decisões (a tabela o-que-dizer). Não grava nada. O ELM é utilitário (sa-elm), e o references/elm.md saiu desta skill.

### sabia.visao
Abertura do guia: a description, a tese e o as-built compilado na instalação.

1. **description** — Em inglês, até 1024 caracteres: 'Sabiá guide and router for the agent workflow (Kiro and opencode). Use when the person asks how the Sabiá flow works, which skill to use, or makes a request without naming a skill. Covers intake and triage, refinement (shaping with go/kill, three amigos, slicing), sprint planning with WIP limits, development routes (trivial, rápida, complete) in supervised or autopilot mode, merge request review by a developer other than the author, verification, archive and optional publication to IBM ELM through sa-elm. Routes each request to the right sa-* skill.'
2. **tese** — Alinhar antes e verificar depois. O vigente fica no DOORS quando o projeto tem ELM. Sem ELM, fica na especificação vigente do repositório (OpenSpec: openspec/specs/; Kiro: .kiro/specs/).
3. **as-built** — As skills são compiladas na pasta do usuário na instalação (opencode e Kiro), e nada é copiado para o projeto. O override fica em .sabia/fluxo e .sabia/padrao.

### sabia.fases-e-papeis
As fases, do registro ao archive, e os papéis como booleanas. Inclui as listas fechadas de tipo, status, prioridade e tamanho.

1. **fases** — captura (fluxo/captura.md, qualquer pessoa ou skill) → triagem (sa-triar.triar) → refinamento (sa-refinar: moldar · detalhar · fatiar · ajustar; épico: pitch, go/kill e PRD pela sa-prd) → ciclo (sa-planejamento: seleção, reabastecimento, virada, review, retrospectiva) → desenvolvimento (sa-desenvolver: iniciar · codificar · encerrar) → MR e revisão (sa-revisar.mr) → verificação (sa-verificar) → merge → archive (sa-especificar.archive) e 'publicar no DOORS?' (sa-elm.publicar). Sustentação: sa-atender. Não existe consolidação: o fechamento é o merge, o archive e a publicação.
2. **papéis** — São booleanas no equipe.json. desenvolvedor: puxa item para desenvolvimento e revisa o MR de outro autor. especificador: aprova os arquivos de elm/ e publica no ELM. produto: decide go/kill, ordena e aprova pitch, PRD e ficha. Captura, triagem e revisão humana ficam abertos a qualquer pessoa. Não há regra por senioridade.
3. **identidade** — A identidade é o usuário do GitLab: o usuario do equipe.json é o autor do MR e o @dono no CODEOWNERS. O elm_login é opcional e só a sa-elm o lê.
4. **agentes** — A pessoa abre a sessão num dos dois agentes principais: sa-desenvolvedor (desenvolvimento, plano, MR, revisão humana e Sustentação) ou sa-especificador (refinamento, PRD, especificação, entrevista e planejamento; inclui as funções de produto). Triagem, status, o guia e as ofertas da sa-elm rodam nos dois. Pesquisa, revisão do agente e verificação rodam nos subagentes sa-pesquisador, sa-revisor e sa-verificador, de contexto isolado. A booleana do equipe.json continua conferida na pré-condição de cada skill.
5. **tipos e ids** — tipo ∈ {épico, fatia, bug, sustentação}. Séries: épico → EP-nn; fatia e bug → FT-nnn; sustentação → <categoria>-nnn (AT · IM · BD · IN · OP · EX). Fatia e bug têm pai EP-nn ou vazio. O próximo id é o maior da série no backlog.md + 1, lido depois do pull. O id nunca muda. 'Vira épico' cria a linha EP-nn com a obs 'veio de FT-nnn', e a FT fica 'cancelada · virou EP-nn'.
6. **status** — Fatia e bug: nova → aceita → elegível → em-andamento → concluida, mais cancelada e 'adiada até <data>'. em-revisao não se grava: vem do MR aberto. Épico: a-moldar → em-especificacao (go) → fatiado → concluido · cancelado; fecha no merge da última fatia aberta (sa-desenvolver.encerrar). Sustentação: nova → em-andamento → concluida · cancelada.
7. **prioridade e tamanho** — prioridade ∈ {crítica, vazio}. crítica é o expedite, pela política do acordos.md; vazio segue a ordem das linhas. tamanho ∈ {P, M, G}: P = horas, M ≈ 1 dia, G = 2 a 3 dias. Maior que G é épico, e só o épico vai ao pitch e ao go/kill.
8. **trilhas** — Quem desenvolve escolhe a trilha pelo código: trivial (sem arquivo de spec, tudo no MR), rápida ou completo. O formato da spec vem do formato_spec do agentes.json (Kiro ou OpenSpec). A pasta da spec é ft-<nnn>-<slug>.
9. **sustentação** — A categoria é confirmada antes de gravar a triagem, e não se recategoriza depois. Quem atende puxa dentro da reserva de capacidade reservada. A IA auxilia, e a pessoa declara o item resolvido (sa-atender).
10. **estado na branch base** — As linhas do backlog.md e do sprint-<nn>.md vão num commit pequeno direto na branch base, pelo fluxo/commit-na-branch-base.md. Os documentos de planejamento (pitch.md, prd.md, ficha, arquivos de elm/) também vão direto na branch base. MR só existe para código.

### sabia.aprovacoes
Quem aprova o quê. A aprovação de documento fica gravada no próprio documento, e a do código fica no MR.

1. **produto** — O P.O. (booleana produto) decide go/kill e aprova o pitch, o PRD e a ficha, gravando no documento 'Aprovado: <usuário> · <data>'. O que estiver em aberto bloqueia só o que depende dele.
2. **especificador** — Aprova o arquivo inteiro de cada artefato em elm/ e publica depois do merge (sa-elm.publicar).
3. **MR** — Precisa de uma aprovação, de um desenvolvedor diferente do autor (o CODEOWNERS indica o dono), com o CI verde e a evidência do verificador no MR. A revisão humana é feita por qualquer pessoa, conforme o risco.
4. **merge** — O autor faz o merge com a aprovação e o CI verde. Não há rebase: a branch se atualiza só por merge da branch base.

### sabia.autonomia
Autonomia de trabalho: IA supervisionada, IA autopilot ou manual, escolhida antes de começar e fixa até o fim daquele trabalho. Codificação e especificação (só com ELM) têm autonomias independentes. Disjuntor no autopilot.

1. **autonomias** — Codificação: ao assumir a tarefa (sa-desenvolver.iniciar), quem pega escolhe IA supervisionada (o sa-desenvolvedor na sessão da pessoa), IA autopilot (o sa-desenvolvedor como subagente na worktree) ou manual (só a geração do código-fonte é da pessoa; status.md, branch e plano seguem; no 'terminei', o fluxo segue do validar, com as mesmas validações), gravado em Autonomia do status.md. Especificação (só com ELM): ao detalhar a fatia com artefatos afetados, a sa-refinar.detalhar pergunta IA supervisionada (o especificador edita com a skill), IA autopilot (o sa-especificador como subagente edita sem perguntas) ou manual (o especificador altera direto no DOORS e avisa 'alterei'; a skill sincroniza), gravado em Especificação da ficha. A autonomia vale até o fim daquele trabalho, sem troca no meio, e os dois são independentes. O autopilot leva até o MR, que passa pela mesma revisão humana. Não existe lote.
2. **autopilot** — O sa-desenvolvedor roda como subagente na worktree .sabia/local/wt/<id> enquanto a pessoa segue na branch base, e várias tarefas podem correr em paralelo. Ficam liberados o push da própria branch (sem --force), o merge da branch base nela e abrir ou atualizar o MR dela. Merge do MR, ELM e rede continuam bloqueados.
3. **disjuntor** — Dispara pelo teto do acordos.md ou por 2 reprovações seguidas. Grava em .sabia/local/loop-<id>.md e devolve o item à pessoa.

### sabia.principios
Os dez princípios, ajustados às decisões da 2.1.

1. **alinhar antes de escrever** — Até 5 perguntas por rodada, cada uma com recomendação. O agente busca os fatos, e a pessoa toma as decisões. Regra de negócio é decisão de uma pessoa.
2. **cerimônia do tamanho** — Expressa pelas trilhas trivial · rápida · completo e pelo tamanho P · M · G.
3. **fatias verticais** — Cada fatia prova algo demonstrável e mantém os artefatos afetados.
4. **verificação acima de geração** — Backpressure em camadas: o trecho tocado a cada alteração e a suíte completa uma vez antes do MR, com baseline do CI. A asserção que dura são os testes automatizados, marcados com o CT-nn.
5. **gerador ≠ avaliador** — A revisão do agente pelo subagente sa-revisor tem três eixos: spec · padrões · segurança. O aceite é do subagente sa-verificador, de contexto isolado.
6. **estado em disco** — O estado vive em status.md, research.md e no plano. Na mesma tarefa, segue na mesma sessão. Para outra tarefa, sugere sessão nova.
7. **autonomia gradual** — Por item, escolhida por quem desenvolve, com disjuntor.
8. **rastreio leve** — Os artefatos afetados ficam na ficha, e o texto completo dos requisitos fica no delta. Com ELM, a pasta elm/ da fatia é a fonte da publicação no DOORS depois do merge, conferindo a versão. Sem ELM, a especificação vigente fica no repositório.
9. **aprendizado composto** — A lição nasce na seção Lições aprendidas do status.md ou do registro. Na review do ciclo, as escolhidas entram nas Regras aprendidas do sabia.md.
10. **leia o código** — O MR traz o quê, o porquê, a evidência, o risco, o foco e os artefatos afetados. Nada é mergeado sem uma aprovação humana.

### sabia.o-que-dizer
Tabela de roteamento das 16 skills listadas nas decisões. Entrada: um pedido que não nomeia skill. Fim: invoca a skill da linha, ou pergunta qual é a intenção se o pedido couber em duas.

1. **configurar → sa-setup** — Instalar ou atualizar o Sabiá no projeto, os agentes, o formato da spec e 'usa ELM?'. Customizar ou descustomizar um passo ou padrão: sa-setup.customizar.
2. **onde parei → sa-status** — Onde parei, minha próxima, o estado de <id>, fechar a sessão, pendências (publicação pendente, travas de artefato), lições aprendidas para a review.
3. **registrar ou triar → sa-triar** — Registrar uma demanda sem triar: sa-triar.capturar. Triar a fila das linhas 'nova': sa-triar.triar. As outras skills capturam pelo fluxo/captura.md.
4. **refinar → sa-refinar** — Ideia nova, pitch, go/kill: sa-refinar.moldar. Refinamento conjunto, ficha, artefatos afetados e elm/ da fatia: sa-refinar.detalhar. Fatiar o épico: sa-refinar.fatiar. Editar, dividir ou cancelar um item pronto: sa-refinar.ajustar.
5. **PRD → sa-prd** — Escrever o PRD do épico depois do go, ou mudar o PRD.
6. **protótipo, ATA, archive → sa-especificar** — Protótipo de tela e aprovação do cliente, ATA de reunião (transcrição em .sabia/local/reunioes/), archive da spec depois do merge.
7. **alinhar decisões → sa-entrevistar** — Entrevista em rodadas para fechar decisões.
8. **ciclo → sa-planejamento** — Planejamento inicial (equipe.json, acordos.md), planejar a sprint, reabastecer, virada (perguntar se migra os itens em aberto), review com curadoria das Regras aprendidas, retrospectiva.
9. **desenvolver → sa-desenvolver** — Puxar, começar ou retomar e escolher trilha e autonomia: sa-desenvolver.iniciar. Implementar e abrir o MR: sa-desenvolver.codificar. Mergear e fechar: sa-desenvolver.encerrar. Autopilot é uma autonomia da sa-desenvolver.
10. **pesquisar → sa-pesquisar** — Entender o código e devolver fatos, sem gravar nada.
11. **plano → sa-plano** — research.md, design e tasks da fatia, com o texto aprovado copiado para o delta.
12. **revisar → sa-revisar** — Revisão do agente ou revisão do plano: sa-revisar.revisar. Revisar o MR de outro autor: sa-revisar.mr.
13. **verificar → sa-verificar** — Aceite de ponta a ponta, com a evidência no MR e o CT.csv: sa-verificar.verificar. revisão humana: sa-verificar.revisao-humana.
14. **Sustentação → sa-atender** — Atender um item AT · IM · BD · IN · OP · EX.
15. **ELM → sa-elm** — Criar o item ou a tarefa: sa-elm.item. Finalizar ou cancelar a tarefa: sa-elm.finalizar. Lançar horas e relatórios: sa-elm.horas. Publicar no DOORS: sa-elm.publicar. Bundle ou original de um requisito: sa-elm.baixar. Visualização: sa-elm.visualizar. 'Confere com o EWM' e 'o DOORS mudou?': sa-elm.conferir. Importar do EWM: sa-elm.importar-backlog. Iteração: sa-elm.iteracao. Lint: sa-elm.lint. Configurar o ELM: sa-elm.setup.
16. **como funciona → sabia** — Explicar o fluxo, as fases, os papéis e as regras.

### sabia.onde-as-coisas-moram
Tabela dos caminhos do projeto na 2.1.

1. **AGENTS.md** — Do projeto, se houver: a sa-setup só lê, como fonte do Projeto e dos Comandos do .sabia/sabia.md.
2. **.sabia/sabia.md** — Resumo do fluxo · Especificação · Verificação de aceite · Sustentação · ELM · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas. A curadoria da review grava as Regras aprendidas.
3. **.sabia/config/** — agentes.json (as escolhas do projeto e a entrada do gerador), elm/pa_<nome>.json (da sa-elm.setup) e elk/elk-<ambiente>.json. Os 5 agentes gerados (e os de toolkit) ficam em .kiro/agents/ e .opencode/agents/.
4. **.sabia/planejamento/** — backlog.md (id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em), acordos.md, equipe.json, roadmap.md, sprints/<pai>/sprint-<nn>.md (Item · Trabalho · Responsável · Tarefas), fatias/FT-<nnn>-<slug>.md, epicos/EP-nn-<slug>/ (pitch.md; prd.md a partir do go), prototipos/, atas/, sustentacao/<pasta>/.
5. **spec da fatia** — .kiro/specs/ft-<nnn>-<slug>/ ou openspec/changes/ft-<nnn>-<slug>/, com status.md, research.md, os arquivos da trilha, CT.csv e, com ELM, elm/. No OpenSpec, a spec arquivada fica em openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/.
6. **glossário · ADRs · bundle** — GL no DOORS, onde houver ELM; o .sabia/glossario.md é opcional. ADRs em docs/adr/, só para decisão que atravessa fatias. O bundle (elm.bundle, ex.: docs/elm/<pa>/) é cópia local e nunca é editado.
7. **.sabia/creditos/** — <usuario>.csv com os créditos do Kiro por sessão.
8. **.sabia/local/ (fora do git)** — Worktrees do autopilot (wt/<id>), loop-<id>.md, reunioes/ e dados de cliente.

### sabia.tipos-de-artefato
O catálogo fechado da 2.1, com ids e com o lugar onde cada artefato nasce.

1. **catálogo** — HF · UC · REG · MSG · EL · GL · ET · CT · ATA. Artefato existente: <sigla>-<id do ELM>. Novo: <sigla>-<EP|FT>-nn, provisório até a publicação; sem ELM, esse é o id definitivo.
2. **HF REG EL GL** — O texto completo dos requisitos tocados vai no delta da spec. Com ELM, também em elm/ da fatia, um arquivo por artefato, criado no refinamento (sa-refinar.detalhar). EL só quando Telas = sim.
3. **ET** — Só as-built, publicada na finalização do desenvolvimento, nos projetos que mantêm ET.
4. **CT** — Cenários CT-nn na ficha. O CT.csv é escrito só pela sa-verificar, e cada linha liga ao CT-nn marcado no teste automatizado; o toolkit que desvia o CT escreve a Descrição de cada linha pelo padrão dele.
5. **ATA** — Opcional, pela sa-especificar. A decisão vale com quem e quando.

### sabia.fronteiras-de-fase
Como uma skill termina e passa para a próxima.

1. **seguir** — Toda skill termina oferecendo 'seguir para a próxima?' na mesma sessão, quando é a mesma tarefa. Para outra tarefa, sugere sessão nova.
2. **não compactar** — Nunca compactar no meio de uma fase.
3. **autopilot** — Mandar um item para o autopilot é decisão de quem desenvolve, ao assumir a tarefa (sa-desenvolver.iniciar), e vale até o fim dela.

### sabia.regras-de-ouro
Regras que valem em todas as skills.

1. **falha de escrita** — Nunca seguir como se tivesse gravado. Se a gravação falhar, diz o caminho e o que faltou e para a fase.
2. **nada inventado** — Tabela, coluna, regra e id se confirmam no código, no banco (só leitura) ou no ELM. Regra de negócio é decisão de uma pessoa, registrada com quem e quando.
3. **sim da pessoa** — push, merge, curl, wget, escrita no GitLab e escrita no ELM passam pelo ask dos principais sa-desenvolvedor e sa-especificador; nos subagentes e no autopilot, o que não é liberado é deny. rebase, --force, --force-with-lease, reset --hard e --no-verify ficam em deny.
4. **gravar na branch base** — Estado e documentos de planejamento vão pelo fluxo/commit-na-branch-base.md. O código vai por MR, na branch <id>, atualizada só por merge da branch base.
5. **MCPs** — O MR só pelo gitlabpr, nunca pelo gh ou pelo glab. O ELM só pelo MCP elm. Toda escrita no ELM passa pela sa-elm. Busca do vigente: specs arquivadas → bundle → ELM ao vivo.
6. **dado de cliente** — Nunca vai para o git: fica em .sabia/local/. O agente não executa em ambiente de cliente nem responde ao cliente.

### sabia.referencia-desvios-de-toolkit
O references/passos.md continua: toolkit de apoio, de passo e de tipo, lidos do agentes.json. O dono é o agente que roda a skill do passo.

1. **três jeitos** — Apoio, passo e tipo, lidos do agentes.json (toolkits, passos) e aplicados pelo gerador no prompt do agente: skills[].papeis e steering[].papeis mapeiam 1:1 (desenvolvedor → sa-desenvolvedor, especificador e produto → sa-especificador, pesquisador → sa-pesquisador, revisor → sa-revisor, verificador → sa-verificador). Critérios de revisão vão ao sa-revisor, e verificacao, ao sa-verificador.
2. **id do passo** — O desvio aponta para um id da 2.1, no formato skill.fluxo.passo (ex.: sa-desenvolver.codificar.tarefa; o gerador aceita também sa-codificar.codificar.tarefa). O contrato não muda: o toolkit não faz commit, push nem MR.
3. **agente do toolkit** — Vira subagente do agente dono do passo, com as permissões dele, e nunca mais que isso.
4. **tipos com skill de toolkit** — HF, UC, REG, MSG e EL saem pelo sa-especificador, com a aprovação gravada no documento; a ET as-built, pelo sa-desenvolvedor, com a aprovação do MR. Do Sabiá continuam o catálogo, a revisão e a publicação.

## fluxo/ (comum)
Arquivos comuns que as skills incluem: entrada.md (pré-condição de quem pega um item), captura.md (o único jeito de registrar item), commit-na-branch-base.md (estado e documentos de planejamento direto na branch base), travas.json (as regras que o gerador escreve no prompt) e tipos.json (catálogo dos artefatos de requisito). Incluir não é chamar outra skill: o arquivo roda dentro do passo que o inclui e volta a ele.

### fluxo/ (comum).entrada.md
Entrada comum de quem pega um item, nesta ordem: chamado → existe → terminal → adiada → vizinhos → papel → dono → branch. A sprint nunca é pré-condição. Não há regra comum de assumir no ELM.

1. **campos** — O passo entrada na definição de cada fluxo declara quatro campos. de: quem chama (pessoa, skill.fluxo). papel: a booleana do equipe.json que o fluxo exige (desenvolvedor | especificador | produto | nenhuma). branch: fatia | nao. vizinhos: tabela 'tipo e status → skill.fluxo dona'. O campo sprint não existe. Cada fluxo grava o próprio responsável, e o ELM é só oferecido (sa-elm.item).
2. **chamado** — Chamado por outro fluxo (em linha, como subagente ou pelo autopilot): pula a entrada inteira, porque quem chamou já entrou. A passagem (a saída '→ skill.fluxo' de outro fluxo, que a pessoa aceita) não é chamada, e nela a entrada roda.
3. **existe** — Lê o item na branch base: git fetch e depois o backlog.md da branch base (se a branch base local está atrás do remoto, o de origin/<branch_base>; sem rede, o local). Formas de entrada: id do Sabiá (EP-nn, FT-nnn, AT-nnn, IM-nnn, BD-nnn, IN-nnn, OP-nnn, EX-nnn) → a linha; número do EWM → a linha com esse número na coluna ib; tarefa do EWM (DEV · ESP · ATD <n>) → a linha do sprint-<nn>.md que a tem em Tarefas e, por ela, o item. Fatia ou bug com branch <id>: o status.md dela (Fase) completa o estado, mas o status da linha vem da branch base. Pedido em texto ou id que não está no backlog.md: pergunta 'não está registrado: capturo agora?'. Com o sim, roda a fluxo/captura.md (a linha nasce nova; épico, a-moldar) e segue só se os vizinhos do fluxo aceitam esse status; senão diz 'capturado <id>; a triagem é pela sa-triar.triar' e para. Nunca inventa dado de work item: o EWM (pela sa-elm.item) e a pessoa só completam.
4. **terminal** — Status concluida, concluido, cancelada ou cancelado: mostra o status e a obs e para. Com 'virou <id>' na obs, diz 'o item seguiu como <id>'. Pedido novo sobre item terminal não reabre nada: é item novo pela fluxo/captura.md, com 'origem <id>' na obs.
5. **adiada** — Só fatia e bug têm adiada. 'adiada até <data>' com a data no futuro: avisa ('adiada até <data>: <motivo da obs>') e pergunta 'seguir mesmo assim?'. Sim: acrescenta na obs 'adiamento ignorado (<usuario>, AAAA-MM-DD)', e o status volta a aceita. Não: para. Data já passada: o status volta a aceita sem perguntar. A correção grava pela fluxo/commit-na-branch-base.md junto com a próxima gravação do fluxo (ou logo, se o fluxo não grava estado). A regra mora só aqui: as skills não a repetem.
6. **vizinhos** — O estado do item (tipo, status da linha e, na fatia em andamento, a Fase do status.md ou o MR aberto, que dá o em-revisao derivado) casa com uma linha da tabela vizinhos do fluxo: diz '<id> está <estado>: entre pela <skill.fluxo>' e para. Uma linha dos vizinhos vence os casos terminal e adiada (ex.: a triagem trata o adiamento). Estado aceito por este fluxo: segue. Nem deste fluxo nem dos vizinhos: diz 'não é deste fluxo: veja sa-status <id>' e para.
7. **papel** — Usuário da sessão = usuário do GitLab (o MCP gitlabpr informa; sem o MCP, pergunta uma vez na sessão), procurado no campo usuario do equipe.json. Fluxo com papel nenhuma segue mesmo fora do equipe.json, e o relator vira 'externo: <nome>'. Fluxo com papel: se a pessoa está fora do equipe.json, diz 'peça a inclusão na equipe (sa-planejamento.inicial)' e para; se não tem a booleana, diz 'isso é de quem tem <booleana>: <nomes>' e para. Nunca há regra por senioridade.
8. **dono** — Item com responsável diferente do usuário da sessão, num fluxo que grava o responsável: mostra de quem é e só segue com o sim. O fluxo grava o novo responsável na linha.
9. **branch** — branch nao: pula. branch fatia, com a branch <id> do item diferente da atual: pergunta 'troco para <id>?' (nunca oferece descartar, stash ou reset). Sem o sim: para. Árvore suja: avisa e para. Branch aberta numa worktree do autopilot (git worktree list mostra .sabia/local/wt/<id>): diz '<id> está no autopilot: espere a devolução' e para. Sem branch <id>, o fluxo decide pelos vizinhos (ex.: 'sem branch → sa-desenvolver.iniciar').
10. **saida** — Item registrado, deste fluxo, com a pessoa certa e na branch certa: segue para o primeiro passo depois da entrada, ou para o passo que a linha dos vizinhos indica para aquele estado. Toda parada diz a frase do caso, com a skill.fluxo seguinte quando há uma.

### fluxo/ (comum).captura.md
O único mecanismo de registrar item. Toda skill que registra (sa-triar, sa-desenvolver, sa-atender, sa-verificar, sa-revisar, sa-prd, sa-planejamento, sa-elm.importar-backlog, sa-refinar) inclui este arquivo, que grava o tipo, a linha e o corpo mínimo na branch base e volta ao passo que o incluiu.

1. **quem-inclui** — Incluído por toda skill que registra item; não é chamada de skill. Recebe tipo, título, corpo mínimo, relator, origem (opcional), pai (opcional) e ib (opcional). Quem inclui pode gravar na mesma gravação os campos que já decidiu (status aceita, tamanho, prioridade, pai) e as próprias linhas.
2. **tipo** — tipo ∈ {épico, fatia, bug, sustentação}. Na sustentação vem também a categoria (AT · IM · BD · IN · OP · EX, da seção Sustentação do sabia.md), porque ela define a série. Quem inclui diz o tipo. Sem tipo, pergunta à pessoa com recomendação: trabalho sem mudança no repositório é sustentação; defeito é bug; o resto que cabe em G é fatia; maior que G é épico.
3. **duplicado** — Busca leve no backlog.md da branch base (título parecido e ib igual, inclusive canceladas). Achou um aberto: mostra e pergunta 'é o mesmo?'. Sim: não cria e devolve o id existente. Achou um terminal: cria o novo com 'origem <id>' na obs.
4. **id** — Lido depois do pull (fluxo/commit-na-branch-base.md): próximo id = maior id da série no backlog.md + 1, contando as canceladas. Séries: épico → EP-nn; fatia e bug → FT-nnn; sustentação → <categoria>-nnn (AT · IM · BD · IN · OP · EX). Não existe linha 'Próximos ids'. O id nunca muda: troca de série é linha nova com 'veio de <id>', e a antiga fica cancelada com 'virou <novo id>'. Push recusado: o id se recalcula (fluxo/commit-na-branch-base.md).
5. **linha** — Linha nova no fim da tabela (a ordem é a prioridade, e o P.O. reordena pela sa-refinar.ajustar). Campos: status nova (épico: a-moldar); prioridade, tamanho e responsável vazios; pai = EP-nn aberto ou vazio (só fatia e bug); relator = usuario do equipe.json ou 'externo: <área ou nome>'; ib = só o número, quando veio do EWM; obs 'origem <id>' quando nasceu do trabalho em outro item; datas vazias (o épico ganha aceita_em).
6. **corpo** — Fatia: ficha curta .sabia/planejamento/fatias/FT-nnn-<slug>.md, com a seção Entrada (pedido · quem pediu · requisito, se souber). Bug: a mesma ficha, com Entrada (passos · atual · esperado · reproduzido: sim | não | detalhe insuficiente). Sustentação: registro .sabia/planejamento/sustentacao/<ID>-<slug>.md (sem subpasta por categoria), pelo padrão sa-atender/registro.md, com o cabeçalho Categoria · Origem · Pedido por · Prazo · Responsável e a seção Pedido. Épico: só a linha. slug = título em kebab-case, sem acento. Dado de cliente nunca vai ao git: fica em .sabia/local/sustentacao/<ID>/.
7. **gravar** — Grava pela fluxo/commit-na-branch-base.md ('backlog: captura <id>'), ou junto com as linhas de quem incluiu, num commit só. No autopilot não grava: segue a regra do autopilot da fluxo/commit-na-branch-base.md.
8. **devolver** — Mostra 'capturado <id> · <tipo> · <status>' e volta ao passo que incluiu. A triagem do item nova (fatia ou bug) é pela sa-triar.triar. A sustentação nova já está na fila da sa-atender.atender.

### fluxo/ (comum).commit-na-branch-base.md
Regra comum de toda gravação direta na branch base: troca com o sim, árvore limpa, pull --ff-only, commit pequeno só dos arquivos do fluxo, push com o sim, volta à branch anterior. Só código vai por MR.

1. **o-que-grava** — Grava direto na branch base: as linhas de estado (backlog.md e sprint-<nn>.md), o equipe.json, o acordos.md, o roadmap.md, as Regras aprendidas do .sabia/sabia.md, os documentos de planejamento (pitch.md, prd.md, ficha, registro de Sustentação, ATA, protótipos), os arquivos de elm/ da pasta da spec da fatia, o status.md arquivado (Publicação), o bundle docs/elm/<pa>/ (sa-elm.baixar) e, numa sessão sem branch (Sustentação), o .sabia/creditos/<usuario>.csv. Código e o resto da spec (delta, design, tasks, research.md, status.md, CT.csv) vão na branch <id>, com MR. Requisito do Sabiá: a branch base de desenvolvimento do agentes.json aceita push (ex.: develop).
2. **base** — Fora da branch base: pergunta 'Troco para <branch_base>?'. Sem o sim: para sem gravar e mostra o que gravaria.
3. **arvore** — Antes de trocar: git status --porcelain com qualquer alteração faz o fluxo avisar e parar. Nunca faz stash, reset nem descarta nada.
4. **atualizar** — Base local à frente do remoto (commit de gravação ainda não publicado): mostra o commit e pede o sim do push antes de seguir. Depois roda git pull --ff-only. Se falhar, avisa e para.
5. **escrever** — Lê o backlog.md já atualizado (o próximo id se calcula aqui) e escreve só as linhas e os arquivos do fluxo.
6. **commit** — git add só desses caminhos e commit pequeno com a mensagem do fluxo (ex.: 'backlog: triagem FT-031', 'backlog: refinamento FT-031', 'EP-04 go'). O id da tarefa do EWM entra na mensagem só se o acordos.md pedir (chave 'id no commit').
7. **push** — Mostra git show --stat e pergunta 'Publico na <branch_base>?'. Sim: git push (nunca --force). Push recusado porque a branch base andou: desfaz só o próprio commit (git reset --keep HEAD~1), volta ao atualizar, regrava (o id se recalcula) e pergunta de novo. Na segunda recusa, avisa e para. Sem o sim: o commit fica local, e o próximo commit-na-branch-base oferece o push primeiro.
8. **voltar** — Volta à branch anterior (git switch -) sempre que trocou, inclusive depois de uma parada.
9. **autopilot** — O subagente do autopilot (worktree .sabia/local/wt/<id>) não grava na branch base. Anota em Em aberto do status.md 'capturar: <tipo> · <título> · origem <id>' (ou a linha que gravaria) e devolve isso no resumo à pessoa, que grava pela skill que pediu ou pela sa-triar.capturar.

### fluxo/ (comum).travas.json
Catálogo das travas. O gerador escreve o texto curto de cada uma no índice do prompt do agente, e o corpo dos passos nunca as repete. Nenhuma é liberável.

1. **formato** — Cada trava tem {"texto", "liberavel_por": []}. O formato prevê liberavel_por: ["projeto"] e {"liberar": [...], "motivo", "por"} na definição do fluxo do projeto, mas nenhuma trava usa isso. O comentário do arquivo não cita ETM, OKF nem papéis da 2.0. A po-decide-fechamento sai.
2. **sim-da-pessoa** — Push, merge e escrita no ELM e no GitLab só com o 'sim' da pessoa (ask nos principais sa-desenvolvedor e sa-especificador). No autopilot, só três ações dispensam o sim: o push da própria branch (sem --force), o merge da branch base nela e abrir ou atualizar o MR dela. Merge do MR, ELM e rede seguem bloqueados.
3. **backpressure** — Nada é dado como pronto nem vai ao MR sem o validar verde (compila, testes passam, lint e cobertura pelo gate), nas camadas dos Comandos do .sabia/sabia.md (rápida a cada alteração, completa antes do MR) e no CI do MR.
4. **revisao-independente** — O MR é revisado e aprovado por um desenvolvedor que não é o autor. O CODEOWNERS indica o dono da área. Não há regra por senioridade nem revisor único.
5. **aceite-independente** — Quem implementou não verifica: a verificação roda no subagente sa-verificador, de contexto isolado.
6. **pr-lido-por-pessoa** — Merge só com o MR aprovado por uma pessoa e o CI verde. O autopilot nunca faz merge.
7. **toolkit-sem-commit** — O toolkit devolve código e testes, sem commit, push nem MR.
8. **sem-force** — Nunca --force nem --force-with-lease (deny). A branch se atualiza só por merge da branch base, nunca por rebase.
9. **decisao-da-pessoa** — Nunca invente regra, valor ou ator. Sem fonte e sem a decisão de uma pessoa, o item fica em aberto.
10. **aprovacao-do-cliente** — O protótipo só vale aprovado pelo cliente, numa linha da seção Decisões do pitch.md, do prd.md ou da ficha, com quem (nome e papel), data, versão vN e evidência (ATA ou e-mail). A aprovação nunca é deduzida nem dada por quem especifica.
11. **aprovacao-no-documento** — Pitch, PRD e ficha só valem com 'Aprovado: <usuário> · <data>' de quem tem produto, no próprio documento. Arquivo de elm/ só vale com a aprovação de quem tem especificador.
12. **artefato-exclusivo** — Duas fatias não alteram o mesmo artefato do ELM ao mesmo tempo. A segunda fica bloqueada até a primeira ficar cancelada ou com 'Publicação: publicada' (concluida com 'Publicação: pendente' ainda segura o artefato), e a sa-status mostra o bloqueio.
13. **elm-pela-sa-elm** — Só a sa-elm fala com o ELM. As outras skills só oferecem, e a resposta nunca trava o fluxo.

### fluxo/ (comum).tipos.json
Catálogo fechado dos tipos de artefato de requisito: HF, REG, GL, EL, ET, CT e ATA. Um toolkit não cria tipo. O compilador valida o catálogo e gera skills/sabia/references/tipos.md. Saem o ETM, os critérios de revisão P e os passos extintos.

1. **formato** — Chaves de cada tipo: nome; arquivo (o nome do arquivo em elm/); cria (passos skill.fluxo.passo que escrevem o tipo); padrao (o corpo do tipo); elm (DOORS ou null); requisito (entra na publicação de requisitos da sa-elm.publicar); desviavel (os passos de cria em que a skill de um toolkit pode escrever o tipo; lista vazia = não desviável); depois (siglas publicadas antes); embute (siglas embutidas no texto); pendente (tipo declarado sem padrão ou fluxo: não é criado nem publicado). A chave critérios de revisão sai. O compilador valida: sigla única, os passos de cria e desviavel existem na 2.1, o padrão existe e depois não tem ciclo.
2. **nomes-em-elm** — Em elm/ (dentro da pasta da spec da fatia), um arquivo inteiro por artefato. Existente: <id do ELM>-<sigla>-<slug>.md. Novo: <EPnn | FTnnn>-nn-<sigla>-<slug>.md (id provisório <sigla>-<EPnn | FTnnn>-nn), renomeado para <id do ELM>-<sigla>-<slug>.md pela sa-elm.publicar, com o título igual. A troca do id no PRD, nas fichas e no delta vai no mesmo commit. Sem ELM, o id provisório é o definitivo. O delta da spec sempre traz o texto completo dos requisitos tocados.
3. **HF** — História de usuário. cria: sa-prd.prd.escrever (requisito no PRD) e sa-especificar.elm.editar (arquivo em elm/). padrao: requisitos/padrao-hf.md (narrativa, gatilho, fluxo principal com FA e FE, critérios Gherkin por contexto, regras aplicáveis; rótulos em negrito, sem título Markdown). elm: DOORS. requisito: true. desviavel: os dois passos de cria. depois: REG, EL, MSG, UC. embute: REG.
4. **REG** — Regra de negócio. cria: sa-prd.prd.escrever e sa-especificar.elm.editar. padrao: requisitos/padrao-reg.md (módulo, categoria e fonte; a regra numa frase declarativa; condições com a exceção; lógica na forma da categoria). elm: DOORS. requisito: true. desviavel: os dois passos de cria. depois: GL, MSG. embute: nenhum.
4a. **MSG** — Mensagem: o corpo é só o texto, igual ao da tela. cria: os mesmos da REG. padrao: requisitos/padrao-msg.md. elm: DOORS. requisito: true. desviavel: os dois passos de cria. depois: nenhum. embute: nenhum.
4b. **UC** — Caso de uso, só com Casos de uso = sim na seção Especificação do sabia.md (o novo vai em HF). cria: os mesmos da REG. padrao: requisitos/padrao-uc.md (objetivo, atores, gatilho, pré-condições, garantias; fluxo básico; FA e FE com o passo de origem e o retorno). elm: DOORS. requisito: true. desviavel: os dois passos de cria. depois: REG, MSG, GL. embute: nenhum.
5. **GL** — Termo de glossário (o slug é o termo em kebab-case). cria: sa-prd.prd.escrever e sa-especificar.elm.editar. padrao: requisitos/padrao-gl.md. elm: DOORS. requisito: true. desviavel: nenhum. depois: nenhum. embute: nenhum.
6. **EL** — Especificação de layout (só com Telas = sim). cria: sa-prd.prd.escrever e sa-especificar.elm.editar. padrao: requisitos/padrao-el.md (protótipos por visão, campos em 6 colunas, ícones de grid, botões e estados). elm: DOORS. requisito: true. desviavel: os dois passos de cria. depois: REG, MSG. embute: nenhum.
7. **ET** — Especificação técnica, só as-built, onde o projeto mantém ET ('ET as-built: sim' na seção ELM do sabia.md). Não tem arquivo em elm/: são as seções Components and Interfaces · Data Models · Decisões técnicas do design.md (Kiro) ou Decisions (OpenSpec completo), ajustadas ao que foi feito antes do MR e publicadas depois do merge pela sa-elm.publicar. cria: sa-desenvolver.codificar.ADR e as-built. padrao: requisitos/padrao-et.md. elm: DOORS. requisito: true. desviavel: sa-desenvolver.codificar.as-built (o toolkit que define o padrão da ET). depois: HF. Saem a ET inicial no PRD e a escrita pela sa-consolidar.
8. **CT** — Caso de teste. Não tem arquivo em elm/: o cenário CT-nn mora na ficha e na spec, e a evidência no CT.csv. cria: sa-refinar.detalhar.cenarios (o CT-nn) e sa-verificar.verificar.casos (o CT.csv, escrito só pela sa-verificar, pela skill do toolkit quando o CT desvia). padrao: requisitos/padrao-ct.md. elm: null (o ETM sai). requisito: false. desviavel: sa-verificar.verificar.casos. O PRD não grava CT.csv.
9. **ATA** — Ata de reunião. arquivo: ATA-<nn>-<AAAA-MM-DD>-<assunto>.md. cria: sa-especificar.reuniao.escrever. padrao: requisitos/padrao-ata.md. elm: DOORS (sobe sob pergunta da sa-elm.publicar). requisito: false. desviavel: sa-especificar.reuniao.escrever.

# Skills que saem ou se fundem
- **sa-fatiar** (funde): Vira a sa-refinar.fatiar. O antigo refinamento de fatia vira a sa-refinar.ajustar.
- **sa-codificar** (funde): Vira a sa-desenvolver.codificar. Na trilha trivial não há troca de skill.
- **sa-sync** (funde): Vira a sa-elm.baixar (DOORS → repositório, só baixa) e a sa-elm.visualizar. O bundle só existe com ELM.
- **sa-orquestrar** (funde): Vira a autonomia IA autopilot da sa-desenvolver: por item, decidido por quem desenvolve, em subagente na worktree .sabia/local/wt/<id>, com disjuntor. Saem o agente orquestrador e o lote.
- **sa-consolidar** (sai): O status final vai para a sa-desenvolver.encerrar, o archive para a sa-especificar.archive, e a publicação (com a ET as-built) para a sa-elm.publicar. Os gatilhos 'MR mergeado' e 'fecha a FT' vão para a description da sa-desenvolver.
- **sa-executar** (funde): Entra na sa-atender.atender: um fluxo para as seis categorias. A categoria só muda o registro.md, não a skill.
- **sa-aprender** (sai): A skill, a pasta aprendizado/ e o rito registrar → promover saem. A lição nasce em Lições aprendidas do status.md (fatia) ou do registro.md (Sustentação). A curadoria vira um passo da sa-planejamento.review, que grava em Regras aprendidas do sabia.md. As Regras aprendidas entram nos critérios de revisão da sa-revisar.revisar. O lint vai para a sa-elm.lint.
- **sa-iniciar** (funde): '<id>' e 'minha próxima' viram entradas da sa-status.painel: mostra o estado (status do backlog.md, branch <id>, MR, Retomar do status.md) e oferece 'seguir agora?' para a sa-desenvolver.codificar.
- **sa-especificar.especificar** (sai): O épico vai da sa-refinar.moldar (go) direto para a sa-prd.prd, sem linha de especificação no sprint.md.
- **sa-especificar.fatia** (sai): Não existe MR de spec separado. A fatia é especificada na ficha e na pasta elm/ (sa-refinar.detalhar), e a sa-plano.plano copia o texto aprovado para o delta, no MR do código. A sa-especificar fica com prototipo, reuniao e archive.
- **sa-prd.mudanca** (funde): Mudar o PRD é rodar a sa-prd.prd de novo no mesmo prd.md, com nova aprovação do produto. As fatias atingidas passam pela sa-refinar.ajustar.
- **sa-revisar · critérios de revisão P** (sai): A sa-revisar fica com os critérios de revisão L (plano) e C (código). PRD, pitch e ficha são aprovados pelo produto no próprio documento.
- **7 agentes por papel (papeis.json)** (funde): Substituídos por 5 agentes por função (perfis.json): principais sa-desenvolvedor e sa-especificador, subagentes sa-pesquisador, sa-revisor e sa-verificador, gerados nos formatos do opencode e do Kiro. Sai o orquestrador.

# Artefatos
```
<repo>/
├── AGENTS.md                                  # do projeto: a sa-setup só lê, como fonte do sabia.md
├── CODEOWNERS                                 # <padrão> @usuario (raiz, .gitlab/ ou docs/); mantido pelo time, a sa-setup sugere
├── opencode.json                              # alvo opencode: instructions inclui .sabia/sabia.md (harness)
├── .gitignore                                 # .sabia/local/ e <bundle>/explorar.html
├── .gitattributes                             # .sabia/creditos/*.csv merge=union
├── .gitlab/merge_request_templates/
│   └── Default.md                             # template do MR: título <id> — <título> · O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados
├── docs/
│   ├── adr/NNNN-<titulo>.md                   # ADR Nygard, só decisão transversal (chave adr)
│   └── elm/<pa>/                              # bundle (só com ELM; chave bundle = rm.download do pa): só a sa-elm.baixar escreve
│       ├── index.md · log.md                  # índice OKF do bundle
│       ├── sync.md                            # sincronizado_em
│       ├── explorar.html                      # sa-elm.visualizar (fora do git)
│       └── <conceito>.md                      # um requisito oficial por arquivo, com envelope OKF
├── openspec/                                  # formato_spec = openspec
│   ├── specs/<cap>/spec.md                    # especificação vigente: só sem ELM (o archive funde o delta)
│   └── changes/
│       ├── ft-<nnn>-<slug>/                   # rápida e completo; trivial não tem pasta
│       │   ├── proposal.md                    # Why · What Changes · Capabilities · Impact + Fatia e Trilha
│       │   ├── specs/<cap>/spec.md            # delta ADDED/MODIFIED/REMOVED com o texto completo de cada requisito
│       │   ├── design.md                      # só na trilha completo
│       │   ├── tasks.md                       # ## 1. grupo / - [ ] 1.1 tarefa
│       │   ├── research.md · status.md · CT.csv
│       │   └── elm/                           # com ELM: um arquivo inteiro por artefato tocado (nasce no refinamento)
│       └── archive/AAAA-MM-DD-ft-<nnn>-<slug>/  # mudança arquivada depois do merge (1ª fonte da busca do vigente)
├── .kiro/                                     # alvo Kiro / formato_spec = kiro
│   ├── steering/sabia.md                      # #[[file:.sabia/sabia.md]] (harness)
│   ├── settings/                              # do Kiro (harness)
│   ├── agents/sa-<nome>.json · <toolkit>-<agente>.json   # gerados (harness): os 5 agentes e os de toolkit
│   └── specs/ft-<nnn>-<slug>/                 # rápida e completo; fica no lugar depois do merge (vigente sem ELM)
│       ├── .config.kiro                       # specId · workflowType · specType (feature | bugfix)
│       ├── requirements.md | bugfix.md        # fatia | bug, com o bloco completo de cada requisito tocado
│       ├── design.md · tasks.md
│       ├── research.md · status.md · CT.csv
│       └── elm/                               # com ELM
├── .opencode/agents/                          # gerados (harness)
│   ├── sa-desenvolvedor.md · sa-especificador.md   # mode primary, modelo build
│   ├── sa-pesquisador.md · sa-revisor.md      # mode subagent, só leitura
│   ├── sa-verificador.md                      # mode subagent, só leitura + Executar, curl à URL de teste e CT.csv
│   └── <toolkit>-<agente>.md                # mode subagent, permissões do dono do passo
└── .sabia/
    ├── sabia.md                               # steering: Configuração · Verificação de aceite · Sustentação · ELM · Desvios · Tipos · Regras aprendidas
    ├── glossario.md                           # opcional: só sem GL no DOORS (chave glossario)
    ├── creditos/<usuario>.csv                 # Kiro: uma linha por sessão (creditos.py)
    ├── config/                                # harness: só a sessão sem agente escreve
    │   ├── agentes.json                       # escolhas do projeto, entrada do gerador
    │   ├── elm/pa_<nome>.json                 # conexão do MCP elm
    │   └── elk/elk-<ambiente>.json            # conexão do MCP elk
    ├── fluxo/ · padrao/                       # override esparso (harness)
    ├── toolkits/<nome>/toolkit.json           # toolkit do projeto (opcional)
    ├── local/                                 # fora do git
    │   ├── wt/<id>/                           # worktree do autopilot
    │   ├── loop-<id>.md                       # log do disjuntor do autopilot
    │   ├── reunioes/<EP-nn|FT-nnn>-<AAAA-MM-DD>.<ext>   # transcrições
    │   └── sustentacao/<ID>/                  # dados de cliente do atendimento
    └── planejamento/                          # chave produto; gravado direto na branch base (fluxo/commit-na-branch-base.md)
        ├── backlog.md                         # tabela única de 14 colunas; ordem das linhas = prioridade
        ├── acordos.md                         # Item | Acordo: timebox, WIP, SLE, DoD, classes, reserva de capacidade, tamanhos, disjuntor, id no commit, CT no teste
        ├── equipe.json                        # membros: usuario · booleanas · capacidade
        ├── roadmap.md                         # opcional
        ├── sprints/<AAAA>/sprint-<nn>.md       # Meta · Item · Trabalho · Responsável · Tarefas · Review · Retro
        ├── fatias/FT-<nnn>-<slug>.md          # ficha (fatia e bug)
        ├── epicos/EP-<nn>-<slug>/
        │   ├── pitch.md                       # nasce no shaping (Shape Up) com go/kill
        │   └── prd.md                         # nasce no go
        ├── prototipos/<EP-nn|FT-nnn>-<slug>/v<N>/   # versões do protótipo
        ├── atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md   # opcional
        └── sustentacao/<ID>-<slug>.md         # registro do item de Sustentação

~/.sabia/framework/                            # instalação (fora do repositório)
├── fluxo/entrada.md · captura.md · commit-na-branch-base.md   # passos comuns incluídos pelas skills
├── fluxo/tipos.json                           # catálogo HF · UC · REG · MSG · EL · GL · ET · CT · ATA
├── fluxo/travas.json                          # catálogo das travas
├── padrao/<skill>/<arquivo>.md              # modelos (catálogo no esquema dos overrides)
└── skills/sa-setup/assets/agents/perfis.json  # 2 modelos de permissão, os 5 agentes e o harness
~/.sabia/toolkits/<nome>/toolkit.json          # toolkit do usuário
```

- **backlog.md** `.sabia/planejamento/backlog.md` (produto · alinha ao mercado): Tabela única de 14 colunas: id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em. Ordem das linhas = prioridade. Próximo id = maior id da série + 1, lido depois do pull. Sem 'Próximos ids', sem coluna link nem sprint. Gravado só por fluxo/commit-na-branch-base.md.
- **sprint-<nn>.md** `.sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md` (produto · simplifica): Título com chave e datas, Meta, uma linha por item e trabalho (Item · Trabalho · Responsável · Tarefas), Review e Retro. Sem Situação: o andamento vem do status do backlog.md. A sprint aberta é a de maior chave. A reserva de capacidade consumida é a contagem das linhas de atendimento.
- **acordos.md** `.sabia/planejamento/acordos.md` (produto · simplifica): Tabela Item | Acordo com as chaves fechadas Timebox · WIP · SLE (opcional) · DoD · Classes de serviço · Reserva de capacidade · Tamanhos · Disjuntor · Id no commit · CT no teste. As colunas de WIP usam os valores de status do backlog.md.
- **equipe.json** `.sabia/planejamento/equipe.json` (produto · simplifica): membros[] com nome, usuario (usuário do GitLab), elm_login (opcional), desenvolvedor, especificador, produto, horas_semana, ausencias[{inicio, fim}] e ativo. Sem senioridade, papéis, projeto e historico.
- **roadmap.md** `.sabia/planejamento/roadmap.md` (produto · simplifica): Opcional. Tabela Release · Objetivo · Épicos · Previsão. Nasce se o time responder 'usa roadmap?' na sa-planejamento.inicial e é revisto na sa-planejamento.sprint só se o arquivo existir.
- **pasta do épico** `.sabia/planejamento/epicos/EP-<nn>-<slug>/` (especificação · simplifica): Nasce no shaping (sa-refinar.moldar) com o pitch.md; o prd.md nasce no go. No kill, o épico fica cancelado e a pasta permanece. Só pitch.md e prd.md.
- **pitch.md (era rascunho.md)** `.sabia/planejamento/epicos/EP-<nn>-<slug>/pitch.md` (especificação · alinha ao mercado): Pitch do Shape Up: linha 'Aprovado: <usuario> · <data>' no topo (gravada na Decisão por quem tem produto) e as seções Problema · Limite de investimento · Solução em traços · Riscos · Não objetivos · Decisões (tabela D-nn) · Em aberto · Decisão ('go' | 'kill · <motivo>'). Decisões antes do go ficam aqui.
- **prd.md** `.sabia/planejamento/epicos/EP-<nn>-<slug>/prd.md` (especificação · simplifica): Nasce no go. Linha 'Aprovado: <usuario> · <data>' (P.O.) no topo. Seções Problema · Objetivos e métricas · Atores · Requisitos (blocos com id e ação) · Não objetivos · Decisões (tabela D-nn) · Em aberto · Mudanças (Versão | Data | O que mudou | Origem, pela sa-prd.mudanca, com nova aprovação). Sem índice OKF, sem ET inicial e sem CT.
- **decisoes.md** `.sabia/planejamento/epicos/<EP>-<slug>/decisoes.md` (especificação · funde): Não existe. As decisões vão na seção Decisões do pitch.md (antes do go), do prd.md (depois) e da ficha (fatia), com D-nn · Decisão · Quem · Quando · Fonte.
- **status.md do épico** `.sabia/planejamento/epicos/<EP>-<slug>/status.md` (especificação · remove): Não existe. A fase do épico é o status da linha no backlog.md (a-moldar · em-especificacao · fatiado · concluido · cancelado).
- **elm/ do épico (conceitos OKF)** `.sabia/planejamento/epicos/<EP>-<slug>/elm/` (especificação · funde): Não existe. Os requisitos do épico ficam no prd.md. Cada fatia que os cobre leva o arquivo do artefato à pasta elm/ da própria spec.
- **revisao-prd-<N>.md** `.sabia/planejamento/epicos/<EP>-<slug>/revisao-prd-<N>.md` (especificação · remove): Não existe: os critérios de revisão P saiu. O P.O. aprova o PRD no próprio documento.
- **protótipos** `.sabia/planejamento/prototipos/<EP-nn|FT-nnn>-<slug>/v<N>/` (especificação · simplifica): Uma pasta por versão, para épico ou fatia. A aprovação do cliente é um D-nn na seção Decisões do item. A espera pela aprovação é uma linha do Em aberto.
- **ATA** `.sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md` (especificação · simplifica): Opcional. Cabeçalho Reunião · Item · Aprovado, e seções Participantes · Pauta · Discussão · Decisões (D-nn) · Em aberto · Encaminhamentos. Sobe ao DOORS só se pedido (sa-elm.publicar).
- **requisitos HF · UC · REG · MSG · EL · GL** `blocos no prd.md, arquivos em elm/ da fatia e no delta` (especificação · alinha ao mercado): O mesmo corpo por tipo no prd.md, no arquivo de elm/ e no delta (Requirement + Scenario no OpenSpec; Requirement com User Story e EARS no Kiro). O id provisório é <sigla>-<EP|FT>-nn, e o id definitivo, <sigla>-<id do ELM>.
- **ET** `seções do design.md` (especificação · simplifica): Só as-built e só onde o projeto mantém ET (seção ELM do sabia.md: 'ET as-built: sim'). A sa-elm.publicar a publica na finalização do desenvolvimento, a partir de Components and Interfaces, Data Models e Decisões técnicas do design.md.
- **CT (conceito .md)** `elm/CT-nn-<slug>.md` (especificação · remove): Não existe. O cenário tem o id CT-nn na ficha e na spec, e a evidência fica no CT.csv.
- **envelope OKF** `frontmatter dos conceitos` (especificação · simplifica): Fica só no bundle, como formato do download. Os arquivos de elm/ têm um cabeçalho curto (Tipo · Ação · Versão de referência · Aprovado).
- **bundle** `<chave bundle> (padrão docs/elm/<pa>/)` (especificação · simplifica): Cópia de leitura do DOORS, que só a sa-elm.baixar escreve e nunca é editada. É a segunda fonte da busca do vigente (archive → bundle → ELM ao vivo). Desatualizado = sincronizado_em anterior à última publicação; quem lê mostra a data e pergunta se baixa.
- **especificação vigente** `openspec/specs/<cap>/spec.md` (especificação · novo): Só no OpenSpec sem ELM: openspec archive <ft> --yes funde o delta. Com ELM, o vigente é o DOORS (archive com --skip-specs).
- **specs arquivadas** `openspec/changes/archive/AAAA-MM-DD-ft-<nnn>-<slug>/ · .kiro/specs/ft-<nnn>-<slug>/` (especificação · novo): No OpenSpec, a mudança é movida pelo archive depois do merge. No Kiro, a pasta fica no lugar. O status.md arquivado guarda a Publicação.
- **ficha** `.sabia/planejamento/fatias/FT-<nnn>-<slug>.md` (fatia · simplifica): Um modelo para fatia e bug: linha Aprovado no topo, cabeçalho Tipo · Pai · Especificação (só com ELM e artefatos afetados: IA supervisionada · IA autopilot · manual), e seções Entrada (por tipo) · Objetivo · Regras · Cenários (CT-nn) · Não muda · Artefatos afetados · Em aberto · Decisões (tabela D-nn) · DoR. Editável até alguém puxar.
- **pasta da spec (Kiro)** `.kiro/specs/ft-<nnn>-<slug>/` (fatia · simplifica): Nome ft-<nnn>-<slug> em minúsculas. Nasce no refinamento quando há elm/, senão na sa-desenvolver.iniciar. Rápida fatia: Quick Spec (requirements, design, tasks sem portões); rápida bug: Bugfix Spec (bugfix, design, tasks); completo: requirements → design → tasks. Rápida e completo têm também research.md, status.md, CT.csv e .config.kiro.
- **mudança OpenSpec** `openspec/changes/ft-<nnn>-<slug>/` (fatia · novo): Rápida fatia: proposal + delta + tasks; rápida bug: proposal + delta MODIFIED + tasks; completo: proposal + delta + design + tasks. Mais research.md, status.md e CT.csv (e elm/ com ELM).
- **proposal.md** `openspec/changes/ft-<nnn>-<slug>/proposal.md` (fatia · novo): Why · What Changes (no bug: Atual · Esperado · Não muda) · Capabilities · Impact, mais as linhas Fatia (link da ficha) e Trilha. A sa-plano.plano escreve.
- **delta da spec** `openspec/changes/<ft>/specs/<cap>/spec.md · requirements.md | bugfix.md (Kiro)` (fatia · novo): Sempre com o texto completo de cada requisito tocado, como se não houvesse ELM. inclui = ADDED, altera = MODIFIED, exclui = REMOVED (com Reason e Migration). A sa-plano.plano copia o texto aprovado da ficha e de elm/, sem reescrever.
- **.config.kiro** `.kiro/specs/ft-<nnn>-<slug>/.config.kiro` (fatia · mantém): JSON {specId, workflowType: requirements-first, specType: feature | bugfix}. specType = bugfix quando o tipo da linha é bug.
- **requirements.md / bugfix.md** `.kiro/specs/ft-<nnn>-<slug>/` (fatia · alinha ao mercado): Títulos fixos do Kiro. Cada requisito tocado entra completo, com id e Ação. Os critérios EARS N.M citam o CT-nn. No bugfix.md, os requisitos tocados ficam na seção 'Requisitos tocados'.
- **design.md** `<pasta da spec>/design.md` (fatia · mantém): Kiro (completo e Quick Spec): títulos fixos do Kiro mais Decisões técnicas e Riscos. OpenSpec (só completo): Context · Goals / Non-Goals · Decisions · Risks / Trade-offs. É a fonte da ET as-built.
- **tasks.md** `<pasta da spec>/tasks.md` (fatia · alinha ao mercado): Checkboxes no formato da ferramenta. A refatoração preparatória e o achado aceito da revisão do agente ([R<n>]) entram como tarefas.
- **research.md** `<pasta da spec>/research.md` (fatia · mantém): Escrito pela sa-plano.plano com os fatos da sa-pesquisar.pesquisar: Perguntas e respostas · Fluxo atual · Análogos · Reaproveitar · Dados · Testes · Documentação × código · Restrições e riscos · Não encontrado. Curto na rápida.
- **status.md da fatia** `<pasta da spec>/status.md` (fatia · simplifica): Trilha · Autonomia (IA supervisionada · IA autopilot · manual, fixa até o fim da tarefa) · Fase · MR · Publicação, e as seções Desvios · Em aberto · Lições aprendidas · Retomar. No manual, Retomar = 'codificação manual; avise quando terminar'. Saem Responsável, Rodadas, Bloqueio, ELM, Banco, Créditos e Histórico.
- **CT.csv** `<pasta da spec>/CT.csv` (fatia · simplifica): Só a sa-verificar.verificar escreve. Uma linha por cenário aceito, ligada ao CT-nn da ficha/spec. Colunas Tipo · Resumo · Responsável · Descrição, sem Status e sem Planejado para. O PRD não grava CT.csv.
- **elm/ da fatia** `<pasta da spec>/elm/` (fatia · simplifica): Só com ELM. Nasce no refinamento pela sa-especificar.elm (chamada pela sa-refinar.detalhar), direto na branch base, com um arquivo inteiro por artefato tocado (HF, UC, REG, MSG, EL, GL) e o frontmatter type · title · status · sources (status: stable e verified na aprovação). Commit de referência (original), edição (ou, na especificação manual, sincronização do DOORS com publicado: manual <data> no frontmatter) e aprovação do especificador. É a fonte da publicação. O requisito novo leva o nome provisório até a sa-elm.publicar renomear. Trava artefato-exclusivo: a outra fatia espera até esta ficar cancelada ou com 'Publicação: publicada'.
- **template do MR** `.gitlab/merge_request_templates/Default.md` (fatia · alinha ao mercado): A sa-setup o cria do padrão sa-desenvolver/pr.md, se não existir. Título <id> — <título>, seções O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados. A evidência da verificação vai aqui.
- **analise-plano-<N>.md** `.kiro/specs/<ft>/analise-plano-<N>.md` (fatia · remove): Não existe. Quem desenvolve aprova o plano.
- **revisao-codigo-<N>.md** `.kiro/specs/<ft>/revisao-codigo-<N>.md` (fatia · remove): Não existe. A revisão do agente vira tarefas [R<n>] no tasks.md ou comentários no MR, e a revisão oficial fica nas threads do MR.
- **verificacao.md** `.kiro/specs/<ft>/verificacao.md` (fatia · funde): Não existe. O resultado por cenário vai na Evidência do MR.
- **evidencias/** `<pasta da fatia>/evidencias/` (fatia · funde): Não existe. A evidência vai anexa ao MR, e a evidência com dado de cliente nunca sai de .sabia/local/.
- **massa/** `<pasta da spec>/massa/` (fatia · remove): Não existe. O verificador prepara os dados pela própria aplicação ou pelos scripts do projeto.
- **adr/ da fatia** `.kiro/specs/<ft>/adr/` (conhecimento · funde): O ADR transversal nasce direto em docs/adr/, no próprio MR. A decisão local fica no design.md.
- **registro de Sustentação** `.sabia/planejamento/sustentacao/<ID>-<slug>.md` (sustentação · simplifica): Sem subpasta por categoria. Cabeçalho Categoria · Origem · Pedido por · Prazo · Responsável, sem status. Seções Pedido · Critério de pronto · Atividade · Resposta · Horas (opcional) · Lições aprendidas.
- **aprendizado/licoes-aprendidas.md** `.sabia/planejamento/aprendizado/licoes-aprendidas.md` (conhecimento · remove): Não existe. As lições aprendidas ficam na seção Lições aprendidas do status.md e do registro. Na review, as escolhidas vão para Regras aprendidas do sabia.md.
- **glossario.md** `.sabia/glossario.md` (conhecimento · simplifica): Opcional, só onde não há GL no DOORS. Tabela Termo · Definição · Evitar · Fonte.
- **ADR** `docs/adr/NNNN-<titulo>.md` (conhecimento · alinha ao mercado): Nygard: Status (Accepted · Superseded by NNNN · Deprecated) · Context · Decision · Consequences · Origem. NNNN = maior da pasta + 1.
- **créditos** `.sabia/creditos/<usuario>.csv` (conhecimento · novo): Um arquivo por pessoa e uma linha por sessão do Kiro: sessao · ate · item · skill · modo (agente: sa-desenvolvedor · sa-especificador · sa-pesquisador · sa-revisor · sa-verificador · padrão) · creditos. O creditos.py o grava quando a sessão fecha (sa-status). Sai do status.md, do registro e do sprint.
- **.sabia/sabia.md** `.sabia/sabia.md` (configuração · simplifica): Seções fechadas: Resumo do fluxo · Projeto · Especificação · Comandos (backpressure em camadas) · Verificação de aceite · Sustentação · ELM (opcional) · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas. Projeto e Comandos vão para o AGENTS.md. Sem Agentes.
- **agentes.json** `.sabia/config/agentes.json` (configuração · simplifica): Esquema fechado: sabia · alvos · formato_spec · produto · branch_base · prefixo_branch · glossario · adr · bundle · elm · toolkits · passos · agentes (extras dos 5 agentes: modelo, mcp, skills, subagentes). Saem http_sh, massa, comandos, push_pr_no_loop, power e os 7 agentes por papel.
- **perfis.json (era papeis.json)** `skills/sa-setup/assets/agents/perfis.json` (configuração · simplifica): harness · segredos · modelos (build · só leitura) · os 5 agentes (permissao, mode, skills, subagentes), com as liberações do sa-verificador e o bloco autopilot do sa-desenvolvedor. Sem regras do ELM: elas vêm de agentes.json.elm.regras.
- **prompts dos 7 papéis** `skills/sa-setup/assets/agents/sa-<papel>.md` (configuração · remove): Não existe. O gerador monta os 5 prompts (sa-desenvolvedor, sa-especificador, sa-pesquisador, sa-revisor, sa-verificador) a partir do perfis.json.
- **.kiro/agents/*.json** `.kiro/agents/` (configuração · simplifica): Gerados: sa-desenvolvedor.json, sa-especificador.json, sa-pesquisador.json, sa-revisor.json, sa-verificador.json e <toolkit>-<agente>.json (só com passos[].agente, com as permissões do dono do passo). Só nomes de capability em tools, sem toolsSettings. Harness.
- **.opencode/agents/*.md** `.opencode/agents/` (configuração · alinha ao mercado): Gerados: sa-desenvolvedor.md e sa-especificador.md (mode primary), sa-pesquisador.md, sa-revisor.md e sa-verificador.md (mode subagent) e <toolkit>-<agente>.md (subagent, com as permissões do dono do passo), com permission allow/ask/deny. Harness.
- **.kiro/steering/sabia.md** `.kiro/steering/sabia.md` (configuração · mantém): Uma linha: #[[file:.sabia/sabia.md]]. Só com alvo Kiro. Harness.
- **opencode.json** `opencode.json` (configuração · mantém): A sa-setup mescla .sabia/sabia.md em instructions. Nenhuma outra chave do Sabiá. Harness.
- **AGENTS.md** `AGENTS.md` (configuração · novo): do projeto, se houver: a sa-setup só lê, como fonte do .sabia/sabia.md.
- **CODEOWNERS** `CODEOWNERS (raiz, .gitlab/ ou docs/)` (configuração · novo): Linhas <padrão> @usuario. O time mantém; a sa-setup sugere quando falta.
- **pa_<nome>.json** `.sabia/config/elm/pa_<nome>.json` (configuração · simplifica): Muda de .kiro/config/elm/ para .sabia/config/elm/, gravado pela sa-elm.setup na sessão sem agente. Tarefas DEV · ESP · ATD, sem bloco do ETM. O MCP procura em .sabia/config/elm, depois em .kiro/config/elm e em .kiro/config/sdd.
- **elk-<ambiente>.json** `.sabia/config/elk/elk-<ambiente>.json` (configuração · simplifica): Muda de .kiro/config/elk/. Os campos são do mcp-elk; o Sabiá só fixa o caminho.
- **.sabia/local/** `.sabia/local/` (configuração · simplifica): wt/<id>/ (worktree do autopilot), loop-<id>.md (disjuntor), reunioes/ e sustentacao/<ID>/. Fora do git.
- **log do loop (era log do orquestrador)** `.sabia/local/loop-<id>.md` (configuração · simplifica): Um por item, com a tabela da tentativa e a linha Devolvido quando o disjuntor dispara.
- **http.sh** `.sabia/http.sh` (configuração · remove): Não existe. O verificador exercita a aplicação direto (curl ou navegador), na URL de teste do sabia.md.
- **overrides** `.sabia/fluxo/<skill>/<fluxo>/ · .sabia/padrao/<skill>/<arquivo>.md` (configuração · mantém): Override esparso só do que muda, sobre o catálogo de padrões da 2.1.
- **toolkit.json** `.sabia/toolkits/<nome>/toolkit.json · ~/.sabia/toolkits/<nome>/toolkit.json` (configuração · simplifica): papeis continua e mapeia 1:1 para os 5 agentes (produto → sa-especificador; sai orquestrador). Tipos HF/REG/EL/GL → sa-especificador, ET as-built → sa-desenvolvedor, critérios de revisão → sa-revisor, verificacao → sa-verificador; agentes[] viram subagente do dono do passo. comandos vira propostas para a seção Comandos do .sabia/sabia.md, e o passo usa ids da 2.1 (aceita sa-codificar.codificar.tarefa). requer.sabia ≥ 2.1.
- **fluxo/tipos.json** `fluxo/tipos.json` (configuração · simplifica): Catálogo HF · UC · REG · MSG · EL · GL · ET · CT · ATA. Sem critérios de revisão; CT sem elm; ET só do design.md; arquivo = nome em elm/.
- **fluxo/travas.json** `fluxo/travas.json` (configuração · simplifica): Catálogo fechado: sim-da-pessoa (com o que o autopilot libera) · backpressure em camadas · revisao-independente (desenvolvedor ≠ autor) · aceite-independente · pr-lido-por-pessoa · toolkit-sem-commit · sem-force · decisao-da-pessoa · aprovacao-do-cliente · aprovacao-no-documento · artefato-exclusivo (libera quando a outra fatia fica cancelada ou com 'Publicação: publicada'; sem ELM, concluida) · elm-pela-sa-elm. Nenhuma é liberável por pessoa. Sai po-decide-fechamento.
- **.gitignore / .gitattributes** `.gitignore · .gitattributes` (configuração · mantém): .gitignore: .sabia/local/ e <bundle>/explorar.html. .gitattributes: .sabia/creditos/*.csv merge=union. A sa-setup grava as duas linhas, se faltarem.

# Formatos dos arquivos

## backlog.md
`.sabia/planejamento/backlog.md (raiz = chave produto do agentes.json)` · md: título '# Backlog' e uma tabela única, uma linha por item, nas colunas abaixo nesta ordem. A ordem das linhas é a prioridade: o topo é o próximo a puxar. A captura acrescenta no fim; quem tem a booleana produto reordena; prioridade crítica sobe ao topo. Célula sem valor fica vazia. Toda escrita passa por fluxo/commit-na-branch-base.md.  
Escrevem: fluxo/captura.md (linha nova; incluída por sa-triar.capturar, sa-desenvolver.codificar, sa-verificar.verificar, sa-atender.atender e as demais que capturam) · sa-triar.triar · sa-refinar.moldar · sa-refinar.detalhar · sa-refinar.fatiar · sa-refinar.ajustar · sa-planejamento.sprint (virada) · sa-desenvolver.iniciar · sa-desenvolver.encerrar · sa-atender.atender · sa-elm.item (ib) · sa-elm.importar-backlog  
Leem: fluxo/entrada.md · sa-status · sa-triar.triar (duplicado) · sa-refinar.* · sa-planejamento.sprint · sa-desenvolver.iniciar · sa-elm.importar-backlog (ib já presente) · sa-elm.finalizar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `id` | Id estável do item; nunca muda. Série pelo tipo: épico EP-nn; fatia e bug FT-nnn; sustentação <categoria>-nnn | EP-nn · FT-nnn · AT-nnn · IM-nnn · BD-nnn · IN-nnn · OP-nnn · EX-nnn | fluxo/captura.md e sa-elm.importar-backlog: maior id da série no backlog.md + 1 (incluindo canceladas), lido depois do pull |
| `título` | O comportamento ou pedido em linguagem do negócio, numa linha. O <slug> dos arquivos sai daqui: até 5 palavras, kebab-case, minúsculas, sem acento | texto | quem captura; sa-triar.triar e sa-refinar.* ajustam |
| `tipo` | Classe do item; define a série do id e a máquina de status | épico · fatia · bug · sustentação | fluxo/captura.md (cada skill passa o seu: sa-verificar → bug, sa-atender → sustentação); sa-triar.triar confirma; sa-elm.importar-backlog mapeia Defeito → bug, Item de Backlog → fatia |
| `status` | Situação gravada do item. em-revisao é derivado do MR aberto e nunca se grava | fatia e bug: nova · aceita · elegível · em-andamento · concluida · cancelada · adiada até AAAA-MM-DD; épico: a-moldar · em-especificacao · fatiado · concluido · cancelado; sustentação: nova · em-andamento · concluida · cancelada | fatia/bug: nova (captura) → aceita (sa-triar.triar) → elegível (sa-refinar.detalhar; ficha com DoR e Aprovado) → em-andamento (sa-desenvolver.iniciar; sa-planejamento.sprint volta a elegível o que sai da sprint na virada) → concluida (sa-desenvolver.encerrar, no merge); cancelada (sa-triar.triar, sa-refinar.ajustar, ou quem descobre que virou épico); adiada até <data> (sa-triar.triar). Épico: a-moldar (captura ou sa-triar.triar) → em-especificacao (go em sa-refinar.moldar) → fatiado (sa-refinar.fatiar) → concluido (sa-desenvolver.encerrar, no merge da última fatia aberta); cancelado (kill em sa-refinar.moldar, ou sa-refinar.ajustar). Sustentação: nova (captura/sa-atender.atender) → em-andamento → concluida · cancelada (sa-atender.atender) |
| `prioridade` | Classe de serviço. crítica = expedite pela política do acordos.md; vazio = vale a ordem das linhas | crítica · vazio | sa-triar.triar · sa-atender.atender (registro) |
| `tamanho` | Dimensão da fatia ou do bug (linha Tamanhos do acordos.md: P = horas, M ≈ 1 dia, G = 2–3 dias). Maior que G é épico; épico e sustentação ficam vazios | P · M · G · vazio | sa-triar.triar · sa-refinar.fatiar · sa-refinar.detalhar (ajusta) |
| `responsável` | Quem está com o item | usuario do equipe.json · vazio | sa-desenvolver.iniciar (fatia/bug) · sa-atender.atender ao puxar (sustentação); a troca de dono atualiza; épico fica vazio |
| `pai` | Épico de origem da fatia ou do bug | EP-nn · vazio (épico e sustentação sempre vazio) | sa-refinar.fatiar · sa-triar.triar (quando o pedido é de um épico já fatiado) |
| `relator` | Quem trouxe a demanda | usuario do equipe.json · externo: <área ou nome> | fluxo/captura.md · sa-elm.importar-backlog |
| `ib` | Número do IB do item no EWM (a URL sai do pa) | número · vazio (sem ELM ou sem IB) | sa-elm.item · sa-elm.importar-backlog |
| `obs` | Anotações; convenções fechadas separadas por ' · ', o resto é texto livre | duplicada de <id> · falta: <pergunta> · para <relator> · motivo: <texto> · não investir: <motivo> (kill) · origem <id \| chamado <n> \| EWM <n> \| review <AAAA>/Sprint <nn> \| lint> (capturado a partir de outro item ou fonte: achado, desvio, DDL, desdobramento, verificação, review, importação, lint) · veio de <id>[ v<N>] (nasceu de outro: virar épico, dividir, juntar, mudança do PRD) · virou <id> · adiamento ignorado (<usuario>, AAAA-MM-DD) · reserva de capacidade estourada: <decisão> (<usuario>, AAAA-MM-DD) | quem causa a anotação |
| `aceita_em` | Data em que o item sai de nova (fatia/bug: aceita; épico: a-moldar; sustentação: registro triado) | AAAA-MM-DD · vazio | sa-triar.triar · sa-atender.atender |
| `iniciada_em` | Data da entrada em andamento (fatia/bug/sustentação: em-andamento; épico: em-especificacao). Início do lead time | AAAA-MM-DD · vazio | sa-desenvolver.iniciar · sa-atender.atender · sa-refinar.moldar (go) |
| `concluida_em` | Data da conclusão. Lead time = concluida_em − iniciada_em; a vazão é a contagem por período | AAAA-MM-DD · vazio | sa-desenvolver.encerrar · sa-atender.atender |

## sprint-<nn>.md
`.sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md (<AAAA> = ano do início; <nn> com 2 dígitos)` · md: '# <AAAA>/Sprint <nn> · AAAA-MM-DD → AAAA-MM-DD', a linha '**Meta:** <frase>', a linha '**Reserva de capacidade:** <n> itens (<p>%)', a tabela '## Itens' e as seções '## Review' e '## Retro'. A sprint aberta é a de maior chave. Linhas gravadas por fluxo/commit-na-branch-base.md.  
Escrevem: sa-planejamento.sprint (cabeçalho, meta, reserva de capacidade, linhas, virada) · a skill que puxa um item fora da seleção acrescenta a linha que falta (sa-prd.prd.assumir, sa-especificar.elm.tarefa, sa-desenvolver.iniciar no expedite, sa-atender.atender.assumir) · sa-elm.item (linha que falta e Tarefas) · sa-planejamento.review (Review) · sa-planejamento.retrospectiva (Retro)  
Leem: sa-status · sa-planejamento.sprint (virada, capacidade) · sa-desenvolver.iniciar · sa-elm.finalizar · sa-elm.horas · sa-elm.iteracao · sa-elm.conferir

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `chave` | <AAAA>/Sprint <nn>, a mesma do caminho | <AAAA>/Sprint <nn> | sa-planejamento.sprint |
| `datas` | Início = dia seguinte ao fim da anterior (a primeira: a data que o time informa); fim = início + Timebox do acordos.md − 1 | AAAA-MM-DD → AAAA-MM-DD | sa-planejamento.sprint |
| `Meta` | Resultado de negócio do ciclo, numa frase | texto | sa-planejamento.sprint |
| `reserva-capacidade` | Capacidade reservada à Sustentação no ciclo, em itens (o % do acordos.md aplicado à capacidade); a consumida é a contagem das linhas de atendimento | '**Reserva de capacidade:** <n> itens (<p>%)' | sa-planejamento.sprint |
| `Item` | Id da linha do backlog.md. O andamento vem do status do backlog.md | EP-nn · FT-nnn · <categoria>-nnn | sa-planejamento.sprint · a skill que puxa |
| `Trabalho` | O trabalho desta linha. O mesmo item pode ter uma linha de especificação e outra de desenvolvimento. A reserva de capacidade consumida é a contagem das linhas de atendimento | especificação · desenvolvimento · atendimento | sa-planejamento.sprint · a skill que puxa |
| `Responsável` | Quem faz o trabalho da linha | usuario do equipe.json · vazio | sa-planejamento.sprint · quem puxa |
| `Tarefas` | Ids das tarefas do EWM da linha, numa coluna só, com o prefixo do trabalho | DEV <id> · ESP <id> · ATD <id> · vazio (sem ELM) | sa-elm.item |
| `Review` | Retorno dos stakeholders, em itens curtos | lista | sa-planejamento.review |
| `Retro` | Melhorias combinadas: o que muda · quem | lista | sa-planejamento.retrospectiva |

## acordos.md
`.sabia/planejamento/acordos.md` · md: '# Acordos do time' e a tabela Item | Acordo, uma linha por chave abaixo, nesta ordem  
Escrevem: sa-planejamento.inicial (cria) · sa-planejamento.retrospectiva (ajusta)  
Leem: sa-status (WIP, SLE, DoD, reserva de capacidade) · sa-triar.triar (expedite) · sa-desenvolver.iniciar (WIP, expedite) · sa-desenvolver.codificar (disjuntor, id no commit, CT no teste) · sa-atender.atender (reserva de capacidade) · sa-planejamento.sprint (timebox, reserva de capacidade) · sa-refinar.* (tamanhos)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Timebox` | Duração do ciclo | <n> semanas | sa-planejamento.inicial |
| `WIP` | Limite por coluna; as colunas são valores de status de fatia/bug | <status>: <n>, com status ∈ aceita · elegível · em-andamento · em-revisao | sa-planejamento.inicial |
| `SLE` | Expectativa de nível de serviço do lead time (opcional) | <p>% em até <n> dias · vazio | sa-planejamento.inicial |
| `DoD` | Definition of Done, como checklist | itens; padrão: CI verde · 1 aprovação de desenvolvedor ≠ autor · Evidência no MR · Artefatos afetados no MR · Lições aprendidas no status.md | sa-planejamento.inicial |
| `Classes de serviço` | Política por prioridade | expedite = prioridade crítica (vai ao topo e pode passar o WIP em 1) · padrão = ordem das linhas | sa-planejamento.inicial |
| `reserva-capacidade` | Parte da capacidade reservada à Sustentação | <n>% | sa-planejamento.inicial · sa-planejamento.retrospectiva |
| `Tamanhos` | O que vale cada tamanho | P = horas · M ≈ 1 dia · G = 2–3 dias (editável) | sa-planejamento.inicial |
| `Disjuntor` | Teto do autopilot por item; 2 reprovações seguidas disparam sempre | tentativas <n> · tempo <n> h · custo <n> créditos | sa-planejamento.inicial |
| `Id no commit` | Exige o id da tarefa do EWM na mensagem do commit | sim · não | sa-planejamento.inicial |
| `CT no teste` | Exige no teste automatizado a marca '<FT-nnn> CT-nn' do cenário | sim · não | sa-planejamento.inicial |

## equipe.json
`.sabia/planejamento/equipe.json` · json: {"$schema": <URL do equipe.schema.json da sa-planejamento>, "membros": [ ... ]}, em snake_case  
Escrevem: sa-planejamento.inicial (a sa-setup oferece rodar)  
Leem: toda skill na pré-condição (quem a pessoa é e o que pode) · sa-status ('minhas') · sa-planejamento.sprint (capacidade) · sa-revisar.mr (desenvolvedor ≠ autor) · sa-elm.* (elm_login) · creditos.py (usuario)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `membros[].nome` | Nome da pessoa | texto | sa-planejamento.inicial |
| `membros[].usuario` | Identidade única: usuário do GitLab (= autor do MR = @dono no CODEOWNERS = <usuario> do CSV de créditos); vale em responsável, relator e Aprovado | login do GitLab | sa-planejamento.inicial |
| `membros[].elm_login` | Login no ELM, lido só pela sa-elm | texto · ausente | sa-planejamento.inicial (opcional) |
| `membros[].desenvolvedor` | Pode puxar item para desenvolvimento e revisar MR de outro | true · false | sa-planejamento.inicial |
| `membros[].especificador` | Pode publicar no ELM e aprovar arquivos de elm/ | true · false | sa-planejamento.inicial |
| `membros[].produto` | Pode dar go/kill, ordenar o backlog e aprovar pitch, PRD e ficha | true · false | sa-planejamento.inicial |
| `membros[].horas_semana` | Capacidade semanal no time | número | sa-planejamento.inicial |
| `membros[].ausencias` | Períodos fora, descontados da capacidade | [{"inicio": "AAAA-MM-DD", "fim": "AAAA-MM-DD"}] | sa-planejamento.inicial / a pessoa |
| `membros[].ativo` | false = saiu do time; a pessoa continua citável no histórico | true · false | sa-planejamento.inicial |

## roadmap.md
`.sabia/planejamento/roadmap.md (opcional)` · md: tabela Release | Objetivo | Épicos | Previsão  
Escrevem: sa-planejamento.inicial (só se 'usa roadmap?' = sim) · sa-planejamento.sprint (pergunta 'atualizar o roadmap?' só se o arquivo existir)  
Leem: sa-planejamento.sprint · pessoas

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Release` | Nome da release | texto | sa-planejamento.inicial |
| `Objetivo` | Resultado de negócio da release | texto | sa-planejamento.inicial |
| `Épicos` | Épicos da release, em ordem de valor e risco | EP-nn separados por ' · ' | sa-planejamento.inicial · sa-planejamento.sprint |
| `Previsão` | Sprint prevista pela vazão (concluídas por sprint, da concluida_em do backlog.md) | <AAAA>/Sprint <nn> · vazio | sa-planejamento.sprint |

## ficha da fatia
`.sabia/planejamento/fatias/FT-<nnn>-<slug>.md (fatia e bug)` · md: '# FT-<nnn> · <título>', '**Aprovado:** <usuario> · AAAA-MM-DD | —' logo abaixo do título, a linha de cabeçalho (Tipo · Pai · Especificação, esta só com ELM e artefatos afetados com inclui, altera ou exclui) e as seções abaixo, nesta ordem. Uma seção sem conteúdo fica só com o título. Gravada direto na branch base e editável até alguém puxar (status em-andamento).  
Escrevem: fluxo/captura.md (cabeçalho e Entrada mínima) · sa-triar.triar (Entrada) · sa-refinar.detalhar (Especificação, Regras, Cenários, Não muda, artefatos afetados, Em aberto, Decisões, DoR, Aprovado) · sa-especificar.elm (versão de referência e id nos artefatos afetados, na sincronização do manual) · sa-refinar.fatiar (Objetivo, artefatos afetados, Pai) · sa-refinar.ajustar · sa-entrevistar.entrevistar (Decisões, Em aberto) · sa-elm.publicar (troca o id provisório nos artefatos afetados)  
Leem: sa-desenvolver.iniciar (DoR) · sa-plano.plano · sa-desenvolver.codificar · sa-revisar.revisar · sa-verificar.verificar · sa-especificar.elm (Especificação) · sa-status

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Aprovado` | Aprovação do P.O. (booleana produto), no topo do arquivo | <usuario> · AAAA-MM-DD · — | sa-refinar.detalhar |
| `Tipo` | Tipo da linha do backlog.md | fatia · bug | fluxo/captura.md |
| `Pai` | Épico de origem | EP-nn · — | sa-refinar.fatiar |
| `Especificação` | Autonomia da especificação, escolhida no detalhar e fixa até o fim dela; independente da autonomia da codificação. Manual = o especificador altera direto no DOORS e a skill sincroniza na volta ('alterei') | IA supervisionada · IA autopilot · manual · linha ausente (sem ELM ou artefatos afetados sem inclui/altera/exclui) | sa-refinar.detalhar |
| `Entrada` | O pedido mínimo por tipo. bug: Passos · Atual · Esperado · Reproduzido; fatia: Pedido · Quem pediu · Requisito citado (opcional) | Reproduzido ∈ sim · não · detalhe insuficiente | fluxo/captura.md · sa-triar.triar |
| `Objetivo` | Para que serve a fatia do épico (opcional) | texto | sa-refinar.fatiar |
| `Regras` | Regras do Example Mapping | linhas 'R<n> · <texto> · fonte: <D-nn \| <sigla>-<id>>' | sa-refinar.detalhar |
| `Cenários` | Critérios de aceite. O CT-nn é sequencial na ficha; a marca no teste e o CT.csv usam '<FT-nnn> CT-nn' | '**CT-nn · <título>**' + Dado / Quando / Então (Então verificável, com valores) | sa-refinar.detalhar |
| `Não muda` | O que não pode mudar (regressão) | lista | sa-refinar.detalhar |
| `Artefatos afetados` | Requisitos tocados, um por linha, ou a linha 'nenhum requisito' | '<sigla>-<id> · inclui \| altera \| exclui · versão de referência <modificado_em do DOORS \| —>'; <sigla> ∈ HF · UC · REG · MSG · EL · GL; <id> = id do ELM ou provisório <EP\|FT>nn-nn (ex.: REG-EP03-01); versão '—' no requisito novo e sem ELM | sa-refinar.detalhar · sa-refinar.fatiar |
| `Em aberto` | Perguntas sem decisão | tabela Pergunta \| Para quem \| Bloqueia; Bloqueia ∈ esta fatia · CT-nn · <sigla>-<id> · nada | sa-refinar.detalhar · sa-entrevistar.entrevistar |
| `Decisões` | Decisões de pessoas sobre a fatia | tabela D-nn \| Decisão \| Quem \| Quando \| Fonte; D-nn sequencial no arquivo; Quem = '<nome> (<papel>)' ou 'suposição'; Quando = AAAA-MM-DD; Fonte ∈ conversa · ATA-nn · e-mail · protótipo v<N> | sa-entrevistar.entrevistar · sa-refinar.detalhar · sa-especificar.reuniao |
| `DoR` | Checklist que avisa e não trava | [ ] entrada mínima do tipo · [ ] cenários CT-nn com Então verificável · [ ] Artefatos afetados preenchidos ou 'nenhum requisito' · [ ] com ELM, arquivos de elm/ aprovados pelo especificador · [ ] nenhum artefato afetado bloqueado por outra fatia · [ ] nenhum Em aberto que bloqueie a fatia inteira · [ ] tamanho ≤ G · [ ] ficha aprovada pelo P.O. | sa-refinar.detalhar |

## pitch.md
`.sabia/planejamento/epicos/EP-<nn>-<slug>/pitch.md` · md: '# EP-<nn> · <título>', '**Aprovado:** <usuario> · AAAA-MM-DD | —' logo abaixo do título (gravada na Decisão) e as seções abaixo, nesta ordem (Shape Up). Gravado direto na branch base.  
Escrevem: sa-refinar.moldar (pitch e Decisão; a Decisão exige a booleana produto) · sa-entrevistar.entrevistar (Decisões, Em aberto) · sa-especificar.reuniao e sa-especificar.prototipo (Decisões, Em aberto)  
Leem: sa-prd.prd (pré-condição: go) · sa-status · sa-planejamento.sprint

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Aprovado` | Quem tem produto registrou a Decisão (go ou kill), no topo do arquivo | <usuario> · AAAA-MM-DD · — | sa-refinar.moldar (passo decisao) |
| `Problema` | Quem sofre, quando e quanto custa hoje | texto | sa-refinar.moldar |
| `Limite de investimento` | Tempo que se aceita investir | <n> semanas | sa-refinar.moldar |
| `Solução em traços` | Os elementos da solução, sem detalhe | lista | sa-refinar.moldar |
| `Riscos` | Buracos de coelho conhecidos | lista | sa-refinar.moldar |
| `Não objetivos` | O que fica fora | lista | sa-refinar.moldar |
| `Decisões` | Decisões antes do go; os D-nn continuam no prd.md | tabela D-nn \| Decisão \| Quem \| Quando \| Fonte; D-nn sequencial no arquivo; Quem = '<nome> (<papel>)' ou 'suposição'; Quando = AAAA-MM-DD; Fonte ∈ conversa · ATA-nn · e-mail · protótipo v<N>; os D-nn continuam no prd.md | sa-refinar.moldar · sa-entrevistar.entrevistar |
| `Em aberto` | Perguntas sem decisão (inclui 'aprovação do cliente da v<N>') | tabela Pergunta \| Para quem \| Bloqueia; Bloqueia ∈ go · <sigla>-<id> · nada | sa-refinar.moldar · sa-especificar.prototipo |
| `Decisão` | O go/kill de quem tem produto. go → status em-especificacao e nasce o prd.md; kill → status cancelado, obs 'não investir: <motivo>', a pasta fica | 'Decisão: go' \| 'Decisão: kill · <motivo>'; vazia até o go/kill | sa-refinar.moldar (passo decisao) |

## prd.md
`.sabia/planejamento/epicos/EP-<nn>-<slug>/prd.md` · md: '# PRD — EP-<nn> <título>', '**Aprovado:** <usuario> · AAAA-MM-DD | —' logo abaixo do título e as seções abaixo. Nasce no go e é gravado direto na branch base. Cada mudança depois da aprovação (sa-prd.mudanca) ganha uma linha em Mudanças e uma nova aprovação.  
Escrevem: sa-prd.prd · sa-prd.mudanca (tira a aprovação, Mudanças, reescreve) · sa-entrevistar.entrevistar (Decisões, Em aberto) · sa-especificar.reuniao (Decisões) · sa-elm.publicar (troca o id provisório pelo do ELM)  
Leem: sa-refinar.fatiar · sa-refinar.detalhar · sa-plano.plano · sa-status

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Aprovado` | Aprovação do P.O. (booleana produto) | <usuario> · AAAA-MM-DD · — | sa-prd.prd · sa-prd.mudanca (tira e pede de novo) |
| `Problema` | O problema na visão de quem sofre | texto | sa-prd.prd |
| `Objetivos e métricas` | O que muda e como se mede | lista objetivo · métrica | sa-prd.prd |
| `Atores` | Quem interage | tabela Ator \| Quem é \| Como interage | sa-prd.prd |
| `Requisitos` | Um bloco por requisito, com o corpo do tipo (padrões sa-prd/hf · reg · el · gl). HF traz cenários Dado/Quando/Então; o CT-nn é dado na ficha | '### <id> · <título>' + '**Tipo:** HF \| REG \| EL \| GL · **Ação:** inclui \| altera \| exclui'; <id> novo = <sigla>-EP<nn>-<nn> (provisório), existente = <sigla>-<id do ELM> | sa-prd.prd |
| `Não objetivos` | Fora do épico | lista | sa-prd.prd |
| `Decisões` | Continua a numeração D-nn do pitch.md | tabela D-nn \| Decisão \| Quem \| Quando \| Fonte; D-nn sequencial no arquivo; Quem = '<nome> (<papel>)' ou 'suposição'; Quando = AAAA-MM-DD; Fonte ∈ conversa · ATA-nn · e-mail · protótipo v<N>; continua a numeração do pitch.md | sa-prd.prd · sa-entrevistar.entrevistar |
| `Em aberto` | Bloqueia só o que depende dele | como na ficha; Bloqueia ∈ <sigla>-<id> · FT-nnn · nada | sa-prd.prd · sa-entrevistar.entrevistar |
| `Mudanças` | Uma linha por versão depois da primeira aprovação | tabela Versão \| Data \| O que mudou \| Origem; Versão = v<N>; Origem ∈ pedido · ATA-nn · protótipo v<N> · FT-nnn. A aprovação de cada versão é a linha Aprovado do topo | sa-prd.mudanca |

## registro de Sustentação
`.sabia/planejamento/sustentacao/<ID>-<slug>.md` · md: '# <ID> · <título>', uma linha de cabeçalho e as seções abaixo. Sem status: a situação está no backlog.md. Gravado direto na branch base.  
Escrevem: fluxo/captura.md · sa-atender.atender · sa-status (fechar a sessão: Atividade)  
Leem: sa-atender.atender · sa-status (prazo, lições aprendidas) · sa-planejamento.review (lições aprendidas)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Categoria` | Categoria confirmada antes de gravar (não se recategoriza); define a série do id | AT · Atendimento · IM · Implantação · BD · Banco de dados · IN · Infra · OP · Operação · EX · Apoio a outros times | sa-atender.atender · sa-triar.triar |
| `Origem` | De onde veio o pedido | chamado <n> · EWM <n> · pedido · origem <id> (desdobramento ou DDL de fatia) | fluxo/captura.md |
| `Pedido por` | Área ou papel, sem nome de pessoa | texto | fluxo/captura.md |
| `Prazo` | Data-limite | AAAA-MM-DD · — | fluxo/captura.md · sa-atender.atender |
| `Responsável` | Quem atende | usuario · — | sa-atender.atender |
| `Pedido` | O que o cliente precisa, sem dado pessoal | texto | fluxo/captura.md |
| `Critério de pronto` | Quando se considera resolvido | uma frase | sa-atender.atender |
| `Atividade` | O que foi feito: consultas, pesquisa de código (arquivo:linha), passos. Dado de cliente fica em .sabia/local/sustentacao/<ID>/ | linhas 'AAAA-MM-DD · feito · próximo' | sa-atender.atender · sa-status (fechar a sessão) |
| `Resposta` | Texto enviado, sem dado que identifique pessoas | texto | sa-atender.atender |
| `Horas` | Horas informadas pela pessoa (opcional; nunca bloqueia) | tabela Data \| Horas (AAAA-MM-DD \| decimal) | sa-atender.atender |
| `Lições` | Candidatas às Regras aprendidas | tabela Lição \| Regra proposta | sa-atender.atender |

## ATA
`.sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md (<nn> = maior da pasta + 1; <assunto> pela regra do slug)` · md: cabeçalho e seções abaixo. Opcional. Gravada direto na branch base; aprovada, não muda.  
Escrevem: sa-especificar.reuniao (da transcrição em .sabia/local/reunioes/)  
Leem: sa-prd.prd · sa-refinar.* · sa-elm.publicar (sobe só se pedido)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Reunião` | Data, duração e assunto | AAAA-MM-DD · <h>h<mm> · <assunto> | sa-especificar.reuniao |
| `Item` | Item a que a ATA pertence | EP-nn · FT-nnn | sa-especificar.reuniao |
| `Aprovado` | Aprovação de quem conduziu a reunião (não é a aprovação de produto) | <usuario> · AAAA-MM-DD · — | sa-especificar.reuniao (passo aprovar) |
| `Participantes` | Só nome e papel | tabela Nome \| Papel | sa-especificar.reuniao |
| `Pauta · Discussão` | Temas e o resumo do que se disse, com [mm:ss] | listas | sa-especificar.reuniao |
| `Decisões` | Só as ditas pelo P.O. ou pelo representante do cliente; o D-nn é o próximo livre na seção Decisões do item, para onde a decisão é copiada | tabela D-nn \| Decisão \| Quem \| Quando \| Fonte; Quem = '<nome> (<papel>)'; Quando = data da reunião; Fonte = 'ATA-nn [mm:ss]' | sa-especificar.reuniao |
| `Em aberto` | Perguntas para a próxima reunião | '<pergunta> — para <nome (papel)>' | sa-especificar.reuniao |
| `Encaminhamentos` | Ações combinadas | tabela O quê \| Quem \| Até (AAAA-MM-DD · —) | sa-especificar.reuniao |

## protótipos
`.sabia/planejamento/prototipos/<EP-nn|FT-nnn>-<slug>/v<N>/` · pasta por versão com os arquivos do protótipo (imagens, html, export da ferramenta), só com dado fictício  
Escrevem: sa-especificar.prototipo  
Leem: sa-prd.prd (EL) · sa-refinar.detalhar · sa-verificar.verificar (texto visível)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `v<N>` | Versão, sequencial a partir de 1 | v1, v2, … | sa-especificar.prototipo |
| `aprovação` | Não fica na pasta: é um D-nn em Decisões do pitch.md, do prd.md ou da ficha, com Decisão 'Protótipo v<N> aprovado', Quem (o cliente: nome e papel), Quando e Fonte (ATA-nn ou e-mail) | D-nn | sa-especificar.prototipo |
| `espera` | Linha no Em aberto do item: 'aprovação do cliente da v<N>' | Bloqueia ∈ <sigla>-<id> · go · nada | sa-especificar.prototipo |

## pasta da spec (Kiro e OpenSpec)
`.kiro/specs/ft-<nnn>-<slug>/ (formato_spec = kiro) · openspec/changes/ft-<nnn>-<slug>/ (formato_spec = openspec); <nnn> e <slug> da ficha, em minúsculas` · pasta. Matriz trilha × formato: trivial = sem pasta (tudo no MR). Rápida fatia = Kiro: requirements.md, design.md, tasks.md (Quick Spec, sem portões) | OpenSpec: proposal.md, specs/<cap>/spec.md, tasks.md. Rápida bug = Kiro: bugfix.md, design.md, tasks.md | OpenSpec: proposal.md, delta MODIFIED, tasks.md. Completo = Kiro: requirements.md → design.md → tasks.md, com 'quer revisar agora?' | OpenSpec: proposal.md, delta, design.md, tasks.md. Rápida e completo têm também research.md, status.md, CT.csv; o Kiro tem .config.kiro; com ELM e artefatos afetados, elm/. Artefatos afetados com inclui/altera/exclui exigem trilha rápida ou completo.  
Escrevem: sa-refinar.detalhar (cria a pasta e elm/, com ELM) · sa-desenvolver.iniciar (cria a pasta, ou reusa a que está na branch base, com status.md e .config.kiro) · sa-plano.plano · sa-verificar.verificar (CT.csv) · sa-especificar.archive (move no OpenSpec)  
Leem: Kiro / openspec CLI · sa-status · sa-revisar.revisar · sa-verificar.verificar · sa-especificar.archive · sa-elm.publicar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `nome da pasta` | Um nome só nos dois formatos, no archive e no argumento do openspec archive | ft-<nnn>-<slug> | quem cria a pasta |
| `arquivos por trilha` | Ver a matriz no formato | trivial · rápida · completo | sa-plano.plano |

## proposal.md
`openspec/changes/ft-<nnn>-<slug>/proposal.md` · md (template do OpenSpec): '## Why' · '## What Changes' · '## Capabilities' (### New Capabilities / ### Modified Capabilities) · '## Impact', e no topo as linhas '**Fatia:** [FT-<nnn>](<caminho da ficha>) · **Trilha:** rápida | completo'  
Escrevem: sa-plano.plano  
Leem: openspec CLI · sa-revisar.revisar · sa-desenvolver.codificar · sa-verificar.verificar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Fatia` | Link para a ficha | link | sa-plano.plano |
| `Trilha` | Trilha da fatia | rápida · completo | sa-plano.plano |
| `Why` | Motivo, a partir da Entrada e do Objetivo da ficha | texto | sa-plano.plano |
| `What Changes` | O que muda. No bug: Atual · Esperado · Não muda | lista | sa-plano.plano |
| `Capabilities` | As <cap> do delta, novas ou modificadas | <cap> em kebab-case | sa-plano.plano |
| `Impact` | Código, APIs e dados afetados | lista | sa-plano.plano |

## delta OpenSpec
`openspec/changes/ft-<nnn>-<slug>/specs/<cap>/spec.md` · md do OpenSpec: '## ADDED Requirements' · '## MODIFIED Requirements' · '## REMOVED Requirements'; em cada uma, blocos '### Requirement: <id> <título>' com o texto completo e '#### Scenario: CT-nn <título>' com - **WHEN** / - **THEN**. Texto copiado, sem reescrever, da ficha, do prd.md e dos arquivos aprovados de elm/.  
Escrevem: sa-plano.plano · sa-elm.publicar (troca o id provisório)  
Leem: openspec validate/archive · sa-revisar.revisar · sa-desenvolver.codificar · sa-verificar.verificar · busca do vigente

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `operação` | Mapeia a ação dos artefatos afetados | ADDED = inclui · MODIFIED = altera · REMOVED = exclui (RENAMED não se usa: renomear é altera) | sa-plano.plano |
| `### Requirement: <id> <título>` | Cabeçalho com o id dos artefatos afetados | <sigla> ∈ HF · UC · REG · MSG · EL · GL; <id> = id do ELM ou provisório <EP\|FT>nn-nn; sem ELM e sem requisito prévio: provisório definitivo | sa-plano.plano |
| `texto` | Requisito completo (MODIFIED traz o texto inteiro novo) | corpo do tipo | sa-plano.plano |
| `#### Scenario` | Cenário da ficha que prova o requisito | CT-nn <título> + WHEN/THEN | sa-plano.plano |
| `**Reason** · **Migration**` | Obrigatórios no REMOVED | texto | sa-plano.plano |
| `<cap>` | Capability; um requisito vive em uma só. Requisito existente na especificação vigente mantém a <cap> de lá; o novo usa o slug do épico (pai) ou o da fatia sem pai | kebab-case | sa-plano.plano |

## requirements.md (Kiro)
`.kiro/specs/ft-<nnn>-<slug>/requirements.md (fatia; rápida e completo)` · md com os títulos fixos do Kiro: '# Requirements Document' · '## Introduction' · '## Glossary' · '## Requirements' · '### Requirement N: <id> <título>' · '#### Acceptance Criteria'  
Escrevem: sa-plano.plano · sa-elm.publicar (troca o id provisório)  
Leem: Kiro · sa-revisar.revisar · sa-desenvolver.codificar · sa-verificar.verificar · busca do vigente (sem ELM)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Introduction` | Resumo da fatia e link da ficha | texto | sa-plano.plano |
| `Glossary` | Termos usados | lista · 'Não se aplica.' | sa-plano.plano |
| `Requirement N` | Um por requisito tocado, com o bloco completo (HF: **User Story:** Como/quero/para; REG/EL/GL: o corpo do tipo) e a linha '**Ação:** inclui \| altera \| exclui'. Requisito sem DOORS: só o título | <id> como no delta; Ação ∈ inclui · altera · exclui | sa-plano.plano |
| `Acceptance Criteria` | Critérios EARS N.M, cada um com o CT-nn que o evidência | 'N.M QUANDO\|ENQUANTO\|SE\|ONDE … ENTÃO o sistema DEVE … (CT-nn)' | sa-plano.plano |

## bugfix.md (Kiro)
`.kiro/specs/ft-<nnn>-<slug>/bugfix.md (bug; rápida)` · md com os títulos fixos do Kiro: '# Bugfix Requirements Document' · '## Introduction' · '## Bug Analysis' · '### Current Behavior (Defect)' · '### Expected Behavior (Correct)' · '### Unchanged Behavior (Regression Prevention)' · '### Bug Condition' · '### Fix Property' · '### Preservation Property', mais '## Requisitos tocados' quando os artefatos afetados têm requisito  
Escrevem: sa-plano.plano · sa-elm.publicar (troca o id provisório)  
Leem: Kiro · sa-desenvolver.codificar · sa-verificar.verificar · sa-revisar.revisar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Current / Expected / Unchanged Behavior` | Atual com evidência · esperado com fonte · o que não muda (da Entrada e de Não muda da ficha) | texto com CT-nn | sa-plano.plano |
| `Bug Condition · Fix Property · Preservation Property` | Condição do defeito e propriedades da correção | texto | sa-plano.plano |
| `Requisitos tocados` | Bloco completo de cada requisito dos artefatos afetados | '### <id> <título>' + '**Ação:** altera \| exclui' + texto | sa-plano.plano |

## .config.kiro
`.kiro/specs/ft-<nnn>-<slug>/.config.kiro` · json de uma linha  
Escrevem: sa-desenvolver.iniciar  
Leem: Kiro

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `specId` | UUID da spec | uuid v4 | sa-desenvolver.iniciar |
| `workflowType` | Fluxo do Kiro | requirements-first | sa-desenvolver.iniciar |
| `specType` | Pelo tipo da linha no backlog.md | feature (fatia) · bugfix (bug) | sa-desenvolver.iniciar |

## design.md
`<pasta da spec>/design.md (Kiro: completo e rápida; OpenSpec: só completo)` · md. Kiro: '# Design Document: FT-<nnn> <título>' · '## Overview' · '## Architecture' · '## Components and Interfaces' · '## Data Models' · '## Correctness Properties' · '## Error Handling' · '## Testing Strategy' · '## Decisões técnicas' · '## Riscos'. OpenSpec: '## Context' · '## Goals / Non-Goals' · '## Decisions' · '## Risks / Trade-offs'. Seção fixa sem conteúdo leva 'Não se aplica.'.  
Escrevem: sa-plano.plano (na completo, por partes, com 'quer revisar agora?') · sa-plano.replanejar  
Leem: sa-desenvolver.codificar · sa-revisar.revisar · sa-elm.publicar (ET as-built)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Components and Interfaces · Data Models (Kiro) / Decisions (OpenSpec)` | Contratos e dados; com 'ET as-built: sim', formam a ET publicada | texto e tabelas | sa-plano.plano; sa-desenvolver.codificar ajusta ao que foi feito antes do MR |
| `Correctness Properties` | Propriedades verificáveis com **Validates: Requirements N.M** | lista | sa-plano.plano |
| `Decisões técnicas` | Decisão local · motivo; a transversal vira ADR em docs/adr/ | '<decisão> — <motivo> (ADR NNNN \| local)' | sa-plano.plano |

## tasks.md
`<pasta da spec>/tasks.md (rápida e completo)` · md. Kiro: '# Implementation Plan: FT-<nnn> <título>' · '## Overview' · '## Tasks' · '## Task Dependency Graph' · '## Notes'. OpenSpec: '## <n>. <grupo>' com '- [ ] <n>.<m> <tarefa>'  
Escrevem: sa-plano.plano · sa-plano.replanejar · sa-desenvolver.codificar (marca [x] só o pronto e verde; acrescenta [R<n>]) · sa-status (fechar a sessão: marca o pronto)  
Leem: sa-desenvolver.codificar · sa-status (contagem [x]/total e o primeiro pendente)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `tarefa` | Passo executável; refatoração preparatória é tarefa | '- [ ] N.M <tarefa>' · '- [x] …' · '- [ ]* …' (opcional, Kiro) | sa-plano.plano |
| `_Requirements: N.M_` | Ligação ao critério (só Kiro) | lista de N.M | sa-plano.plano |
| `[R<n>]` | Prefixo de tarefa que nasce de achado aceito da revisão do agente | [R1], [R2], … | sa-desenvolver.codificar |
| `Task Dependency Graph` | Ondas de tarefas paralelas (só Kiro) | lista | sa-plano.plano |

## research.md
`<pasta da spec>/research.md (rápida curto; completo)` · md: '# Pesquisa — FT-<nnn> <título>' e as seções abaixo; seção sem conteúdo leva 'Não se aplica.'  
Escrevem: sa-plano.plano (com os fatos devolvidos pela sa-pesquisar.pesquisar)  
Leem: sa-plano.plano · sa-desenvolver.codificar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Perguntas e respostas` | As perguntas feitas à pesquisa e o fato que responde | pergunta → fato (arquivo:linha) | sa-plano.plano |
| `Fluxo atual · Análogos · Reaproveitar · Dados · Testes` | Fatos do código | 'arquivo:linha — fato' | sa-plano.plano |
| `Documentação × código` | Divergências entre o requisito vigente e o código | '<sigla>-<id> × arquivo:linha — divergência' | sa-plano.plano |
| `Restrições e riscos · Não encontrado` | Limites e o que a pesquisa não achou | lista | sa-plano.plano |

## status.md da fatia
`<pasta da spec>/status.md (rápida e completo)` · md: '# FT-<nnn> — <título>', a tabela Campo | Valor (Trilha, Autonomia, Fase, MR, Publicação) e as seções Desvios, Em aberto, Lições aprendidas, Retomar  
Escrevem: sa-desenvolver.iniciar (cria; no manual, Autonomia e Retomar) · sa-desenvolver.codificar (Fase, MR, Desvios, Em aberto, Lições aprendidas, Retomar) · sa-plano.plano/replanejar (Fase, Desvios, Em aberto) · sa-status.fechar-sessao (Retomar) · sa-especificar.archive (Publicação: pendente) · sa-elm.publicar (Publicação: publicada)  
Leem: sa-status · sa-desenvolver.codificar (retomar; no manual, segue do validar) · sa-planejamento.review (Lições aprendidas, inclusive no archive)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Trilha` | Trilha escolhida por quem desenvolve | rápida · completo (trivial não tem status.md) | sa-desenvolver.iniciar; a troca é um Desvio |
| `Autonomia` | Autonomia da codificação, escolhida ao assumir e fixa até o fim da tarefa. Manual = só a geração do código-fonte é da pessoa | IA supervisionada · IA autopilot · manual | sa-desenvolver.iniciar (ao assumir) |
| `Fase` | Andamento da codificação | — (antes de codificar) · implementando · revisando · verificando · pr-aberto · retrabalho | sa-desenvolver.codificar |
| `MR` | MR da fatia | !<iid> <url> · — | sa-desenvolver.codificar |
| `Publicação` | Estado da publicação no DOORS depois do merge (só com ELM e arquivos em elm/) | pendente · publicada AAAA-MM-DD · linha ausente | sa-especificar.archive · sa-elm.publicar |
| `Desvios` | O que saiu do plano | tabela Data \| Tipo \| O quê \| Decisão; Tipo ∈ plano · trilha · disjuntor · atribuição | sa-desenvolver.codificar · sa-plano.replanejar |
| `Em aberto` | Pergunta ao especificador ou ao P.O., ou dependência (ex.: item BD da DDL) | tabela Pergunta \| Para quem \| Bloqueia; Bloqueia ∈ tarefa N.M · MR · nada | sa-desenvolver.codificar · sa-plano.plano |
| `Lições` | Candidatas às Regras aprendidas | tabela Lição \| Origem \| Regra proposta; Origem ∈ tarefa N.M · MR !<n> · CT-nn | sa-desenvolver.codificar (antes do MR) |
| `Retomar` | O que foi feito e o próximo passo exato | 'Feito: … · Próximo: …' · no manual: 'codificação manual; avise quando terminar' | sa-status.fechar-sessao · sa-desenvolver.codificar (pausa) · sa-desenvolver.iniciar (manual) |

## CT.csv
`<pasta da spec>/CT.csv (rápida e completo)` · csv: UTF-8 com BOM, LF, separador ';', aspas duplas na Descrição (aspas internas dobradas). Linha 1 = cabeçalho; depois, uma linha por cenário aceito na verificação (rejeitado ou com possível alteração não entra)  
Escrevem: sa-verificar.verificar (só ela)  
Leem: sa-status ('CT sem teste': CT-nn sem a marca no teste) · revisor do MR · importação manual em ferramenta de teste

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Tipo` | Tipo do artefato de teste na importação | Caso de Teste | sa-verificar.verificar |
| `Resumo` | Liga a linha ao cenário; '<FT-nnn> CT-nn' é a marca do teste automatizado | '<FT-nnn> CT-nn - <título do cenário>' | sa-verificar.verificar |
| `Responsável` | Quem verificou (no autopilot, quem desenvolve) | usuario do equipe.json | sa-verificar.verificar |
| `Descrição` | Bloco com OBJETIVO (requisito e CT-nn) · PRÉ-CONDIÇÕES · PASSOS · RESULTADO ESPERADO (o Então) · EVIDÊNCIA (FT, data, obtido, link do MR) | texto entre aspas | sa-verificar.verificar |

## elm/ (pasta e arquivo de artefato)
`<pasta da spec>/elm/<id do ELM>-<TIPO>-<slug>.md (existente) · <pasta da spec>/elm/<EP|FT><nn>-<nn>-<TIPO>-<slug>.md (novo, ex.: EP03-01-REG-teto-do-desconto.md)` · md, um arquivo inteiro por artefato tocado: o frontmatter type · title (igual ao do DOORS) · status (draft | stable) · verified (na aprovação) · sources, na especificação manual publicado: manual AAAA-MM-DD, e o corpo inteiro do artefato, sem título Markdown; o id vai no nome do arquivo, e a ação e a versão de referência, nos artefatos afetados da ficha. Só com ELM, nascido no refinamento e gravado direto na branch base. Commit de referência (original + versão de referência) antes da edição, para o git mostrar a diferença. Duas fatias não têm o mesmo artefato em elm/ ao mesmo tempo (trava artefato-exclusivo): a segunda fica bloqueada até a primeira ficar cancelada ou com 'Publicação: publicada'; a sa-status mostra o bloqueio  
Escrevem: sa-especificar.elm (chamada pela sa-refinar.detalhar.elm ou direto: grava o original que a sa-elm.baixar devolve, faz o commit de referência, edita (no manual, sincroniza do DOORS e marca Publicado) e aprova; aceita também a fatia concluida com 'Publicação: pendente' para refazer a mescla do artefato que a publicação pulou) · sa-elm.publicar (renomeia o novo e troca o id provisório no prd.md, nas fichas e no delta, no mesmo commit)  
Leem: sa-plano.plano (copia para o delta) · sa-elm.publicar (fonte; pula o Publicado) · sa-especificar.archive (tudo Publicado → publicada) · sa-especificar.elm e sa-elm.conferir (DOORS atual × commit de referência) · sa-status

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Aprovado` | Aprovação do arquivo inteiro (booleana especificador), no topo do arquivo | <usuario> · AAAA-MM-DD · — | sa-especificar.elm |
| `Tipo` | Tipo do artefato | HF · UC · REG · MSG · EL · GL | sa-especificar.elm |
| `Ação` | O que a fatia faz com ele | inclui · altera · exclui | sa-especificar.elm |
| `Versão de referência` | modificado_em do artefato no DOORS na hora do download; a sa-elm.publicar compara e, se mudou, avisa e pula | data-hora ISO do DOORS · — (novo) | sa-especificar.elm |
| `Publicado` | Só na especificação manual: o texto já está no DOORS; a sa-elm.publicar não reenvia | manual AAAA-MM-DD · linha ausente | sa-especificar.elm (sincronizar) |
| `corpo` | Texto completo pelo padrão do tipo (sa-prd/hf · reg · el · gl); no exclui, o original | md | sa-especificar.elm |

## especificação vigente
`openspec/specs/<cap>/spec.md (só OpenSpec sem ELM)` · md do OpenSpec: '# <cap> Specification' · '## Purpose' · '## Requirements' com '### Requirement:' e '#### Scenario:'  
Escrevem: sa-especificar.archive (openspec archive ft-<nnn>-<slug> --yes funde o delta)  
Leem: busca do vigente (sa-prd.prd, sa-refinar.detalhar, sa-pesquisar.pesquisar, sa-plano.plano)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Requirements` | Requisitos vigentes depois do merge | blocos do delta fundidos | sa-especificar.archive |

## specs arquivadas
`openspec/changes/archive/AAAA-MM-DD-ft-<nnn>-<slug>/ · .kiro/specs/ft-<nnn>-<slug>/ (Kiro não move)` · pasta da mudança, inteira  
Escrevem: sa-especificar.archive (OpenSpec sem ELM: openspec archive <ft> --yes; com ELM: openspec archive <ft> --skip-specs --yes) · sa-elm.publicar (renomeia elm/ e grava Publicação)  
Leem: 1ª fonte da busca do vigente · sa-status (Publicação pendente) · sa-planejamento.review (Lições aprendidas)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `AAAA-MM-DD` | Data do archive, prefixada pelo openspec | AAAA-MM-DD | openspec CLI |
| `status.md → Publicação` | Pendência de rastreio que a sa-status mostra | pendente · publicada AAAA-MM-DD | sa-especificar.archive · sa-elm.publicar |

## template do MR
`.gitlab/merge_request_templates/Default.md (fonte: padrão sa-desenvolver/pr.md)` · md; o título vai na primeira linha; seções na ordem abaixo  
Escrevem: sa-setup (cria do padrão se faltar; não sobrescreve) · sa-desenvolver.codificar (preenche o MR) · sa-verificar.verificar (Evidência)  
Leem: revisor humano · sa-revisar.mr · sa-elm.finalizar (Artefatos afetados)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `título` | Id e título do item | <FT-nnn> — <título> | sa-desenvolver.codificar |
| `O quê` | 1–3 linhas do comportamento entregue | texto | sa-desenvolver.codificar |
| `Porquê` | Motivo e link da ficha e da pasta da spec | texto + links | sa-desenvolver.codificar |
| `Evidência` | CI (pipeline), verificação por cenário com evidência, revisão humana quando houve | por CT-nn: ✅ aceito · ❌ rejeitado · ⚠️ ambiente · 🔁 possível alteração (volta ao especificador) | sa-desenvolver.codificar · sa-verificar.verificar · sa-verificar.revisao-humana |
| `Risco` | Reversível? · DDL pendente · ADRs | 'Reversível: sim \| não — <o que fazer>' · 'DDL: — \| BD-nnn' · 'ADRs: NNNN \| —' | sa-desenvolver.codificar |
| `Foco` | Ordem de leitura sugerida, do teste do cenário principal ao código | lista de arquivos | sa-desenvolver.codificar |
| `Artefatos afetados` | Requisitos tocados (como na ficha) ou 'nenhum requisito' | '<sigla>-<id> · inclui \| altera \| exclui' | sa-desenvolver.codificar |

## .sabia/sabia.md
`.sabia/sabia.md` · md: '# Sabiá — <projeto>' e as seções H2 abaixo, nesta ordem e só elas. Lido como steering por todo agente  
Escrevem: sa-setup (gera e regrava preservando Regras aprendidas; aplica o texto da seção ELM que a sa-elm.setup produz) · sa-planejamento.review (só Regras aprendidas)  
Leem: todos os agentes (steering) · sa-status (existência) · sa-verificar.verificar (Verificação de aceite) · sa-elm.* (ELM) · sa-atender.atender (Sustentação) · sa-plano.plano e sa-revisar.revisar (Regras aprendidas)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Resumo do fluxo` | Texto curto do fluxo do Sabiá | texto do framework | sa-setup |
| `## Especificação` | Escolhas da spec e espelho legível do agentes.json, que é a fonte | Alvos (kiro · opencode) · Formato da spec (kiro · openspec) · Telas (não \| sim; EL só com sim) · REG com dados técnicos (não \| sim) · Base · Prefixo da branch · Padrão de commit ('<id> <descrição>'; com Id no commit = sim: 'Task <id EWM> - <descrição>') | sa-setup (passos formato da spec, especificação e git) |
| `## Verificação de aceite` | Como subir e exercitar a aplicação | tabela Item \| <módulo>: Executar (comando) · URL de teste (nunca produção) · Onde verificar (resposta · banco · log) · Token (nome da variável de ambiente, nunca o valor) | sa-setup |
| `## Sustentação` | Categorias fixas | tabela Categoria \| Descrição \| Exemplo, com as linhas AT Atendimento · IM Implantação · BD Banco de dados · IN Infra · OP Operação · EX Apoio a outros times | sa-setup |
| `## ELM` | Só com ELM; texto produzido pela sa-elm.setup | pa: <nome> · ET as-built: sim \| não · Tarefas: [DEV] <id> <título> · [ESP] <id> <título> · [ATD] <id> <título> · Manual no DOORS Next: <texto \| nada> | sa-setup (aplica) |
| `## Desvios de toolkit` | Gerada da chave passos do agentes.json | tabela Passo \| Toolkit \| Para \| Skill \| Agente | sa-setup |
| `## Tipos com skill de toolkit` | Gerada dos tipos dos toolkits ligados | tabela Tipo \| Skill \| Fluxo e padrão \| Toolkit \| Passo de desvio | sa-setup |
| `## Regras aprendidas` | Regras escolhidas na curadoria da review | '- <regra> · <FT-nnn \| AT-nnn> · AAAA-MM-DD' | sa-planejamento.review |

## agentes.json
`.sabia/config/agentes.json (harness)` · json  
Escrevem: sa-setup (sessão sem agente; aplica a chave elm que a sa-elm.setup produz)  
Leem: gerador da sa-setup · sa-setup (atualização) · fluxo/commit-na-branch-base.md (base) · todas as skills (produto, formato_spec, caminhos)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `sabia` | Versão do Sabiá que gerou | semver | sa-setup |
| `alvos` | Ferramentas do time | ["kiro"] · ["opencode"] · ["kiro","opencode"] | sa-setup |
| `formato_spec` | Formato da spec: alvo Kiro → kiro, sem perguntar; só opencode → pergunta | kiro · openspec | sa-setup |
| `produto` | Pasta do produto | caminho (padrão .sabia/planejamento) | sa-setup |
| `branch_base` | Branch de desenvolvimento; precisa aceitar push | nome da branch (ex.: develop) | sa-setup |
| `prefixo_branch` | Prefixo da branch do item | texto (ex.: feature/) · "" | sa-setup |
| `glossario` | Caminho do glossário | caminho · null | sa-setup |
| `adr` | Pasta dos ADRs | caminho (padrão docs/adr) | sa-setup |
| `bundle` | Pasta do bundle (= rm.download do pa) | caminho · null | sa-setup (vindo da sa-elm.setup) |
| `elm` | Uso do ELM | false · {"pa": "<nome>", "regras": {"allow": [...], "ask": [...], "deny": [...]}} | sa-setup (vindo da sa-elm.setup) |
| `toolkits` | Toolkits ligados | {"<nome>": "<versão>"} | sa-setup |
| `passos` | Desvios de passo por toolkit | [{"passo": "<skill.fluxo.passo>", "toolkit", "skill", "agente"?}] | sa-setup |
| `agentes` | Extras por agente | {"sa-desenvolvedor"\|"sa-especificador"\|"sa-pesquisador"\|"sa-revisor"\|"sa-verificador": {"modelo"?, "mcp": [], "skills": [], "subagentes": [{"nome", "para"}]}} | sa-setup |

## perfis.json
`skills/sa-setup/assets/agents/perfis.json (framework, não do projeto)` · json  
Escrevem: framework (mantenedor do Sabiá)  
Leem: gerador da sa-setup · compilador (agente por fluxo)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `harness` | Caminhos que nenhum agente escreve (deny de edição) | .kiro/agents/** · .kiro/settings/** · .kiro/steering/sabia.md · .opencode/** · opencode.json · .sabia/config/** · .sabia/fluxo/** · .sabia/padrao/** | framework |
| `segredos` | Padrões negados à leitura e à escrita | .env* · *.pem · *.key · id_rsa* · elm.properties | framework |
| `modelos.build` | Modelo de permissão dos principais (sa-desenvolvedor, sa-especificador), sem restrição por pasta | {read: allow, edit: allow fora do harness (.kiro/specs/** e openspec/** liberados), bash: {allow: build/test/git leitura/commit, ask: git push da própria branch sem --force · git merge origin/<branch_base> · curl/wget à URL de teste, deny: git push --force* · git push --force-with-lease* · git rebase* · destrutivos}, mcp: {allow: gitlabpr leitura, ask: criar/atualizar MR · mesclar MR}} | framework |
| `modelos.leitura` | Modelo só leitura (sa-pesquisador, sa-revisor; base do sa-verificador) | {read: allow, edit: deny, bash: só leitura (git log/diff/show, grep, ls), mcp: só leitura} | framework |
| `agentes.<nome>` | Os 5 agentes | {descricao (inglês), permissao: build \| leitura, mode: primary \| subagent, skills: [], subagentes: []}; sa-desenvolvedor {build, primary, sa-desenvolver · sa-plano · sa-revisar.mr · sa-verificar.revisao-humana · sa-atender · sa-especificar.archive, chama sa-pesquisador · sa-revisor · sa-verificador} · sa-especificador {build, primary, sa-refinar · sa-prd · sa-especificar · sa-entrevistar · sa-planejamento, chama sa-pesquisador} · sa-pesquisador {leitura, subagent, sa-pesquisar} · sa-revisor {leitura, subagent, sa-revisar.revisar} · sa-verificador {leitura, subagent, sa-verificar.verificar}; nos dois principais também sa-triar · sa-status · sabia · sa-elm (menos setup) | framework |
| `agentes.sa-verificador.liberacoes` | O que o sa-verificador tem além do só leitura | bash allow: os comandos Executar do sabia.md · curl/wget só à URL de teste; edit allow: <pasta da spec>/CT.csv | framework |
| `agentes.sa-desenvolvedor.autopilot` | O que vira allow quando o sa-desenvolvedor roda como subagente na worktree (sem pessoa, o resto do ask é deny) | push da própria branch sem --force · merge da branch base na branch · abrir/atualizar o MR da própria branch (merge do MR, ELM e rede seguem negados) | framework |

## .kiro/agents/*.json
`.kiro/agents/sa-desenvolvedor.json · sa-especificador.json · sa-pesquisador.json · sa-revisor.json · sa-verificador.json · <toolkit>-<agente>.json (este último só com passos[].agente)` · json do agente do Kiro; gerado, nunca escrito à mão (harness)  
Escrevem: gerador da sa-setup  
Leem: Kiro · sa-setup (validação)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `name · description` | Nome do agente e descrição em inglês | sa-desenvolvedor · sa-especificador · sa-pesquisador · sa-revisor · sa-verificador · <toolkit>-<agente> | gerador |
| `prompt` | Prompt do agente: índice das travas, override de fluxo e desvios de toolkit dos passos das skills que ele roda; limites por caminho e URL | texto | gerador |
| `tools` | Só nomes de capability (sem toolsSettings nem allowedTools); sa-pesquisador e sa-revisor sem escrita | lista de capabilities | gerador |
| `resources` | Steering | file://.kiro/steering/sabia.md | gerador |

## .opencode/agents/*.md
`.opencode/agents/sa-desenvolvedor.md · sa-especificador.md · sa-pesquisador.md · sa-revisor.md · sa-verificador.md · <toolkit>-<agente>.md` · md com frontmatter; gerado (harness)  
Escrevem: gerador da sa-setup  
Leem: opencode · sa-setup (validação)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `description` | Descrição em inglês | texto | gerador |
| `mode` | Papel na ferramenta | primary (sa-desenvolvedor, sa-especificador) · subagent (sa-pesquisador, sa-revisor, sa-verificador, agentes de toolkit) | gerador |
| `model` | Modelo, se agentes.<nome>.modelo existir no agentes.json | id do modelo · ausente | gerador |
| `permission` | Regras do modelo de permissão do agente no perfis.json (o agente de toolkit usa as do dono do passo), mais agentes.json.elm.regras | {read\|edit\|bash\|task\|skill\|webfetch\|<mcp>: allow \| ask \| deny \| {padrão: allow\|ask\|deny}} | gerador |
| `corpo` | Prompt do agente | texto | gerador |

## .kiro/steering/sabia.md
`.kiro/steering/sabia.md (só alvo Kiro; harness)` · md de uma linha  
Escrevem: sa-setup  
Leem: Kiro

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `#[[file:.sabia/sabia.md]]` | Inclui o sabia.md como steering | linha fixa | sa-setup |

## opencode.json
`opencode.json (raiz; só alvo opencode; harness)` · json mesclado (o resto é do projeto)  
Escrevem: sa-setup  
Leem: opencode

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `instructions[]` | Contém .sabia/sabia.md | lista de caminhos | sa-setup (mescla sem duplicar) |

## AGENTS.md
`AGENTS.md (raiz)` · md; a sa-setup mescla as duas seções e não reescreve o que existe  
Escrevem: sa-setup  
Leem: todos os agentes · sa-desenvolver.codificar (backpressure) · sa-verificar.verificar

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `## Projeto` | Tipos, stack, módulos e regras críticas | lista | sa-setup |
| `## Comandos` | Backpressure em camadas, por módulo | tabela Ação \| <módulo>: compilar · testes · teste do trecho tocado ({alvo}) · lint · cobertura · baseline (último pipeline verde da branch base) | sa-setup |

## CODEOWNERS
`CODEOWNERS (raiz, .gitlab/ ou docs/)` · texto do GitLab: uma linha '<padrão> @usuario [@usuario…]'  
Escrevem: o time (a sa-setup sugere quando falta, com as pastas do projeto e os usuarios do equipe.json)  
Leem: GitLab · sa-revisar.mr (revisor sugerido) · sa-desenvolver.codificar (indica o revisor no MR) · sa-status

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `padrão` | Glob de caminho | glob | o time |
| `@dono` | usuario do equipe.json | @login do GitLab | o time |

## pa_<nome>.json
`.sabia/config/elm/pa_<nome>.json (harness)` · json no schema do mcp-elm  
Escrevem: sa-elm.setup (sessão sem agente)  
Leem: MCP elm · sa-elm.* (pré-condição)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `credencial e servidor` | Conexão (segredo fora do arquivo, no elm.properties) | conforme mcp-elm | sa-elm.setup |
| `ccm (EWM)` | Projeto, ccm.backlog, tipos (IB, tarefa, defeito), campos e links | conforme mcp-elm | sa-elm.setup |
| `tarefas por prefixo` | Tipo e título das tarefas | DEV · ESP · ATD | sa-elm.setup |
| `horas` | Lançamento de horas | conforme mcp-elm | sa-elm.setup |
| `rm (DOORS Next)` | Projeto, rm.artefatos (HF · UC · REG · MSG · EL · GL · ET · ATA) e rm.download (pasta do bundle) | conforme mcp-elm | sa-elm.setup |

## elk-<ambiente>.json
`.sabia/config/elk/elk-<ambiente>.json (harness)` · json no schema do mcp-elk  
Escrevem: a pessoa, na sessão sem agente (o Sabiá só fixa o caminho)  
Leem: MCP elk (procura em .sabia/config/elk, depois em .kiro/config/elk e em .kiro/config/sdd)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `<ambiente>` | Ambiente do ELK | nome do ambiente | a pessoa |
| `conteúdo` | Definido pelo mcp-elk | conforme mcp-elk | a pessoa |

## bundle
`<chave bundle> (padrão docs/elm/<pa>/)` · pasta: index.md e log.md (índice OKF), sync.md, explorar.html e um <conceito>.md por requisito, com envelope OKF. Nunca editado à mão. Commit por fluxo/commit-na-branch-base.md  
Escrevem: sa-elm.baixar · sa-elm.visualizar (explorar.html)  
Leem: busca do vigente pelo MCP elm local (sa-prd.prd, sa-refinar.detalhar, sa-pesquisar.pesquisar, sa-plano.plano, sa-desenvolver.codificar, sa-atender.atender)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `sync.md · sincronizado_em` | Data-hora da última baixa; desatualizado = sincronizado_em anterior à última publicação (a data mais recente de 'Publicação: publicada' nos status.md); quem lê o bundle mostra a data e pergunta se baixa (sa-elm.baixar) | AAAA-MM-DDTHH:MM | sa-elm.baixar |
| `index.md · log.md` | Índice e registro OKF | OKF | sa-elm.baixar |
| `<conceito>.md` | Cópia oficial do requisito; frontmatter OKF (type, title, status, sources, generated, verified) e corpo | OKF | sa-elm.baixar |
| `explorar.html` | Visualização offline (fora do git) | html | sa-elm.visualizar |

## ADR
`<chave adr>/NNNN-<titulo>.md (padrão docs/adr)` · md Nygard: '# NNNN · <título>' e as seções abaixo. NNNN = maior da pasta + 1; num conflito no merge, o MR renumera o próprio. Revertido vira Superseded, nunca é apagado  
Escrevem: sa-desenvolver.codificar (no próprio MR)  
Leem: sa-plano.plano · sa-prd.prd · sa-revisar.revisar · sa-elm.lint

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Status` | Estado; nasce Accepted no MR | Accepted · Superseded by NNNN · Deprecated | sa-desenvolver.codificar |
| `Context · Decision · Consequences` | Seções Nygard | texto | sa-desenvolver.codificar |
| `Origem` | De onde veio | <FT-nnn \| AT-nnn> · MR !<n> | sa-desenvolver.codificar |

## glossario.md
`<chave glossario> (padrão .sabia/glossario.md; só sem GL no DOORS)` · md: tabela Termo | Definição | Evitar | Fonte  
Escrevem: sa-entrevistar.entrevistar · sa-setup (cria se pedido)  
Leem: sa-prd.prd · sa-refinar.detalhar · sa-elm.lint

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `Termo` | Termo canônico | texto | sa-entrevistar.entrevistar |
| `Definição` | Uma frase | texto | sa-entrevistar.entrevistar |
| `Evitar` | Sinônimos que não se usam | lista · — | sa-entrevistar.entrevistar |
| `Fonte` | De onde veio | D-nn · ATA-nn · arquivo:linha | sa-entrevistar.entrevistar |

## créditos
`.sabia/creditos/<usuario>.csv (<usuario> = equipe.json membros[].usuario)` · csv UTF-8, separador ',', cabeçalho na linha 1; só no alvo Kiro; entra no commit que fecha a sessão (merge=union no .gitattributes)  
Escrevem: sa-status (fechar a sessão), pelo creditos.py  
Leem: a pessoa (custo por item e skill)

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `sessao` | Id curto da sessão do Kiro; com ate, é a chave | texto | creditos.py |
| `ate` | Último turno contado (o --desde do próximo) | AAAA-MM-DDTHH:MM:SS (hora local) | creditos.py |
| `item` | Id da branch atual | FT-nnn · EP-nn · <categoria>-nnn · — | sa-status |
| `skill` | Skill principal da sessão | nome da skill · — | sa-status (pergunta ou deduz) |
| `modo` | Agente do Kiro na sessão | sa-desenvolvedor · sa-especificador · sa-pesquisador · sa-revisor · sa-verificador · padrão | creditos.py |
| `creditos` | Soma da sessão | decimal com ponto | creditos.py |

## .sabia/local/
`.sabia/local/ (no .gitignore)` · pastas e md locais, nunca versionados  
Escrevem: sa-desenvolver.codificar (wt, loop) · sa-especificar.reuniao (reunioes) · sa-atender.atender (sustentacao)  
Leem: sa-desenvolver.codificar · sa-desenvolver.encerrar (remove wt) · sa-status

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `wt/<id>/` | Worktree do autopilot do item; a pessoa segue na branch base | git worktree | sa-desenvolver.codificar (ao rodar em autopilot); sa-desenvolver.encerrar remove |
| `loop-<id>.md` | Log do disjuntor: tabela Quando \| Etapa \| Tentativa \| Resultado \| Tempo \| Custo, e a linha 'Devolvido: <motivo> · AAAA-MM-DD HH:MM' quando o teto do acordos.md ou 2 reprovações seguidas disparam | Etapa ∈ tarefa · revisar · verificar; Resultado ∈ ok · falhou · reprovado | sa-desenvolver.codificar |
| `reunioes/` | Transcrições | <EP-nn \| FT-nnn>-<AAAA-MM-DD>.<vtt \| md> | sa-especificar.reuniao |
| `sustentacao/<ID>/` | Dados de cliente do atendimento | arquivos | sa-atender.atender |

## toolkit.json
`.sabia/toolkits/<nome>/toolkit.json · ~/.sabia/toolkits/<nome>/toolkit.json` · json no toolkit.schema.json da sa-setup  
Escrevem: autor do toolkit  
Leem: sa-setup · gerador · compilador

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `nome · versao · descricao · autor` | Manifesto; descricao em inglês | texto · semver | autor |
| `customiza · deteccao` | O que o toolkit customiza e como se detecta o projeto | conforme schema | autor |
| `tipos-de-projeto` | Onde se aplica | backend · batch · frontend · mobile · dados · biblioteca · infra | autor |
| `skills[]` | Skills do toolkit, com os papéis que as usam (1:1 com os agentes) e o passo de desvio | {nome, papeis: [desenvolvedor \| especificador \| produto \| pesquisador \| revisor \| verificador], passo?: {passo: <skill.fluxo.passo da 2.1>}}; desenvolvedor → sa-desenvolvedor · especificador e produto → sa-especificador · pesquisador → sa-pesquisador · revisor → sa-revisor · verificador → sa-verificador; sai orquestrador. Desvio da codificação: sa-desenvolver.codificar.tarefa (aceita sa-codificar.codificar.tarefa) | autor |
| `steering[]` | Steering extra por papel (mesmo mapeamento) | {arquivo, papeis: [desenvolvedor \| especificador \| produto \| pesquisador \| revisor \| verificador]} | autor |
| `comandos` | Propostas para ## Comandos do .sabia/sabia.md | conforme schema | autor |
| `verificacao · tipos · critérios de revisão · agentes[]` | Apoio: tipos HF/REG/EL/GL → sa-especificador, ET as-built → sa-desenvolvedor; critérios de revisão (somam-se às do Sabiá) → sa-revisor; verificacao → sa-verificador; agentes[] viram subagente do dono do passo, com as permissões dele | critérios de revisão[].severidade ∈ BLOQUEANTE · IMPORTANTE · SUGESTÃO | autor |
| `requer` | Versão mínima do Sabiá (semver exato; o CLI recusa o toolkit abaixo dela) | {"sabia": "2.1.6"} | autor |

## tipos.json
`fluxo/tipos.json (framework)` · json: {"$comment", "tipos": {<sigla>: {...}}}; o compilador valida e gera a referência de tipos da skill sabia  
Escrevem: framework  
Leem: compilador · sa-elm.publicar · sa-prd.prd · sa-refinar.detalhar · sa-especificar.elm · sa-plano.plano

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `<sigla>` | Tipo do catálogo fechado | HF · UC · REG · MSG · EL · GL · ET · CT · ATA | framework |
| `nome` | Nome legível | História de usuário · Regra de negócio · Especificação de layout · Termo de glossário · Especificação técnica · Ata de reunião · Caso de teste | framework |
| `arquivo` | Onde o tipo mora | HF/REG/EL/GL: elm/<id>-<TIPO>-<slug>.md · ET: seções do design.md · ATA: atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md · CT: linha do CT.csv | framework |
| `cria` | Passos (skill.fluxo.passo) que escrevem | HF/REG/EL/GL: sa-prd.prd.escrever · sa-especificar.elm.editar; ET: sa-desenvolver.codificar.ADR e as-built; ATA: sa-especificar.reuniao.escrever; CT: sa-refinar.detalhar.cenarios · sa-verificar.verificar.casos | framework |
| `padrao` | Modelo do corpo | requisitos/padrao-hf.md · requisitos/padrao-reg.md · requisitos/padrao-el.md · requisitos/padrao-gl.md · sa-plano/plano.md (ET) · requisitos/padrao-ata.md · requisitos/padrao-ct.md | framework |
| `elm` | Destino no ELM | DOORS (HF, REG, EL, GL, ET, ATA) · null (CT) | framework |
| `requisito` | Entra na publicação de requisitos | true (HF, REG, EL, GL, ET) · false (ATA, CT) | framework |
| `desviavel` | Passos (skill.fluxo.passo) onde uma skill de toolkit pode escrever o tipo | HF/UC/REG/MSG/EL: sa-prd.prd.escrever · sa-especificar.elm.editar; ATA: sa-especificar.reuniao.escrever; ET: sa-desenvolver.codificar.as-built; CT: sa-verificar.verificar.casos; GL: [] | framework |
| `depois` | Siglas publicadas antes | HF: [REG, EL, MSG, UC] · UC: [REG, MSG, GL] · REG: [GL, MSG] · EL: [REG, MSG] · ET: [HF] · demais: [] | framework |
| `embute` | Siglas embutidas no texto publicado | HF: [REG] · demais: [] | framework |

## travas.json
`fluxo/travas.json (framework)` · json: {"$comment", "travas": {<id>: {"texto", "liberavel_por": []}}}; o gerador escreve o texto curto no prompt dos agentes  
Escrevem: framework  
Leem: gerador · compilador

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `<id>` | Trava do catálogo fechado | sim-da-pessoa · backpressure · revisao-independente · aceite-independente · pr-lido-por-pessoa · toolkit-sem-commit · sem-force · decisao-da-pessoa · aprovacao-do-cliente · artefato-elm-exclusivo | framework |
| `texto` | Regra curta | sim-da-pessoa: commit, push, merge e escrita no ELM e no GitLab só com o sim (ask nos principais); no autopilot, só push da própria branch, merge da branch base nela e o MR dela · backpressure: trecho tocado a cada tarefa, suíte completa antes do MR, baseline do último pipeline da branch base · revisao-independente: MR aprovado por 1 desenvolvedor ≠ autor · aceite-independente: quem implementou não verifica (sa-verificador) · pr-lido-por-pessoa: merge só depois de uma pessoa ler o MR · toolkit-sem-commit · sem-force: nunca --force nem --force-with-lease; a branch se atualiza só por merge da branch base · decisao-da-pessoa · aprovacao-do-cliente: protótipo vale só com D-nn do cliente · artefato-elm-exclusivo: dois itens abertos não alteram o mesmo artefato de elm/ | framework |
| `liberavel_por` | Quem pode liberar | [] (nenhuma é liberável) | framework |

## overrides e catálogo de padrões
`.sabia/fluxo/<skill>/<fluxo>/… · .sabia/padrao/<skill>/<arquivo>.md (harness)` · cópia esparsa (com --base) só do passo ou padrão que muda  
Escrevem: sa-setup (customizar)  
Leem: compilador · gerador

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `padrões da 2.1` | Nomes válidos para override | sa-refinar/pitch.md · sa-refinar/ficha.md · sa-prd/prd.md · requisitos/padrao-hf.md · requisitos/padrao-reg.md · requisitos/padrao-el.md · requisitos/padrao-gl.md · requisitos/padrao-ata.md · sa-elm/elm-arquivo.md · sa-atender/registro.md · sa-desenvolver/status.md · sa-desenvolver/pr.md · sa-desenvolver/loop.md · sa-plano/plano.md · sa-plano/research.md · requisitos/padrao-ct.md · sa-revisar/criterios-revisao.md (L e C) · sa-entrevistar/glossario.md | framework |

## .gitignore / .gitattributes
`.gitignore · .gitattributes (raiz)` · texto do git; a sa-setup acrescenta as linhas que faltam  
Escrevem: sa-setup  
Leem: git

| Campo | Significado | Valores | Preenche |
|---|---|---|---|
| `.gitignore` | Fora do git | .sabia/local/ · <bundle>/explorar.html | sa-setup |
| `.gitattributes` | CSV de créditos sem conflito | .sabia/creditos/*.csv merge=union | sa-setup |

# Agentes
```
5 agentes · fonte: perfis.json (2 modelos de permissão + 5 agentes) + agentes.json do projeto
   ─► gerador da sa-setup ─► .kiro/agents/sa-<nome>.json e .opencode/agents/sa-<nome>.md
principais (a pessoa escolhe ao abrir a sessão; a pré-condição da skill confere a booleana)
├─ sa-desenvolvedor   (mode primary · build)
│    skills: sa-desenvolver · sa-plano · sa-revisar.mr · sa-verificar.revisao-humana · sa-atender · sa-especificar.archive
│    chama: sa-pesquisador · sa-revisor · sa-verificador
│    └─ autopilot (o próprio sa-desenvolvedor como subagente na worktree .sabia/local/wt/<id>, sem a pessoa)
│          allow: push da própria branch (sem --force) · merge da branch base nela · abrir/atualizar o MR dela
│          deny: merge do MR · ELM · rede (curl, wget) · todo o resto que era ask
├─ sa-especificador   (mode primary · build · inclui as funções de produto)
│    skills: sa-refinar · sa-prd · sa-especificar · sa-entrevistar · sa-planejamento
│    chama: sa-pesquisador
└─ nos dois: sa-triar · sa-status · sabia · ofertas da sa-elm
subagentes (contexto isolado, chamados por um principal)
├─ sa-pesquisador   (só leitura) ── sa-pesquisar.pesquisar
├─ sa-revisor       (só leitura) ── sa-revisar.revisar + critérios de revisão do toolkit
└─ sa-verificador   (só leitura + liberações) ── sa-verificar.verificar + verificacao do toolkit
      allow: comandos Executar do sabia.md (sobe a aplicação) · curl/wget só à URL de teste
             · editar só <pasta da spec>/CT.csv
agente de toolkit (agentes[], ligado em passos[].agente) ─► subagente do dono do passo, com as permissões dele

2 modelos de permissão
├─ build   (sa-desenvolvedor · sa-especificador; sem restrição por pasta)
│    ler ──────── allow
│                 deny: segredos (**/.env*, **/*.pem, **/*.key, ~/.ssh, ~/.aws, ~/.config/mcp-*)
│    editar ───── allow: workspace (código, .kiro/specs/**, openspec/**, .sabia/planejamento/**,
│                        .sabia/sabia.md, .sabia/creditos/**)
│                 deny (harness): .kiro/agents · .kiro/settings · .kiro/steering/sabia.md · .opencode
│                        · opencode.json · .sabia/config · .sabia/fluxo · .sabia/padrao
│    comandos ─── allow
│                 ask: git push · git merge · curl · wget
│                 deny: git rebase · push --force / --force-with-lease · reset --hard · clean -f
│                       · --no-verify · sudo · kubectl · helm · terraform apply
│    MCP ──────── GitLab: leitura allow · escrita ask (abrir MR, comentar, merge)
│                 ELM (regras da sa-elm.setup, só com ELM): leitura allow · escrita ask
│                 elk (logs) · banco (só a tool de consulta): leitura allow
└─ só leitura   (sa-pesquisador · sa-revisor; base do sa-verificador)
     ler ──────── allow · segredos deny
     editar ───── deny
     comandos ─── só leitura (git status · diff · log · show · grep · ls-files) · resto deny
     MCP ──────── só leitura (GitLab · ELM · elk · banco) · escrita deny
quem a pessoa é: usuario do equipe.json = usuário do GitLab; a pré-condição da skill confere a booleana
quem grava o harness: sa-setup.configurar e sa-elm.setup, na sessão sem agente, fora dos 5 agentes
   sa-elm.setup só produz dados (pa em .sabia/config/elm/pa_<nome>.json, chave elm do agentes.json,
   seção ELM do sabia.md, regras ELM dos agentes); a sa-setup aplica e regenera os agentes
Kiro: só nomes de capability em tools (sem toolsSettings); limites por caminho e URL no prompt
```
# Pendências
- **MCP do Jenkins (CI/CD)** (em desenvolvimento na empresa): O Jenkins roda o pipeline a cada commit em cada branch monitorada. Com o MCP, o revisor (sa-revisar.mr) e o codificar leem o resultado e os logs do último commit da branch, e a suíte completa antes do MR é conferida pelo pipeline. Até lá, a pessoa confere no Jenkins ou roda local.
- **sabia validar-spec (CLI)** (a construir): Validador de forma e ligações da spec nos dois formatos (Kiro e OpenSpec): notação <sigla>-<id> e id provisório <sigla>-<EP ou FT>-nn, artefatos afetados (inclui · altera · exclui · versão de referência), CT-nn, seções obrigatórias e arquivos de elm/. A skill chama, avisa e não trava. O conteúdo fica com a revisão.
- **Busca da configuração no mcp-elm e no mcp-elk** (a construir): Os dois MCPs procuram a configuração em .sabia/config/<mcp>, depois em .kiro/config/<mcp> e por fim em .kiro/config/sdd. O elk-<ambiente>.json fica em .sabia/config/elk/.
- **Conferir o .config.kiro no Kiro real** (a conferir): Validar num Kiro real o .config.kiro da pasta da spec para cada trilha (Quick Spec, Bugfix Spec, requirements → design → tasks), se os subagentes sa-pesquisador, sa-revisor e sa-verificador exigem declaração própria e se o sa-desenvolvedor roda como subagente no autopilot.
- **Autopilot no opencode** (a conferir): Conferir se o sa-desenvolvedor, em mode primary, pode ser chamado como subagente no autopilot ou se o gerador precisa de mode all para ele.
- **Revisão de termos** (depois de finalizar a 2.1): Ajuste dos termos em português (termo de mercado, tradução, termo do Sabiá, proposto), por disciplina, incluindo o nome da DoR.
- **ELM como toolkit** (2.2): Tirar o ELM do núcleo: a sa-elm, a coluna ib do backlog.md, a pasta elm/ e a marca 'Publicação' viriam do toolkit. Sem o toolkit, o Sabiá funciona com a especificação vigente no repositório.