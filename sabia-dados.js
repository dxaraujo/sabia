/* dados do mapa, tirados dos fluxos do Sabiá 2.1.6 (fluxo/, template/ e skills/ do repositório) */
(function(){
"use strict";
const LINES={
 epico:{nome:"Épico",c:"--l-epico",sub:"pitch → decisão de investimento → PRD → fatias",
  quando:"Demanda maior que G. Quem tem produto decide investir ou cancelar sobre o pitch de uma página (Shape Up). Ao investir, quem especifica escreve o PRD, que o produto aprova no próprio documento. Logo depois, o especificador propõe as fatias com o Dev, e o produto aprova e ordena; cada fatia segue pelo detalhar. O épico fecha no merge da última fatia aberta."},
 hitl:{nome:"Fatia · IA supervisionada",c:"--l-hitl",sub:"a IA na sessão da pessoa; ou manual",
  quando:"Fatia ou bug que cabe em G. O refinamento faz a ficha (regras, cenários CT-nn e artefatos afetados) e, com ELM, os arquivos de elm/; o produto aprova e a fatia fica elegível. Quem puxa escolhe tamanho, trilha e autonomia. Na IA supervisionada o sa-desenvolvedor trabalha na sessão da pessoa; no manual, só a geração do código-fonte é dela. Revisão e verificação do agente, em subagente antes do MR; um desenvolvedor que não é o autor revisa; o autor faz o merge."},
 afk:{nome:"Fatia · IA autopilot",c:"--l-afk",dash:true,sub:"subagente na worktree até o MR",
  quando:"Escolhido por quem desenvolve ao assumir, e fixo até o fim da tarefa. O sa-desenvolvedor roda como subagente na worktree .sabia/local/wt/<id>: plano, codificação, revisão e verificação do agente e o MR. A pessoa segue livre na branch base. O disjuntor devolve o item à pessoa no teto do acordos.md ou em 2 reprovações seguidas. O MR passa pela mesma revisão humana, e o merge nunca é do autopilot."},
 atd:{nome:"Sustentação",c:"--l-atd",sub:"sa-atender · seis categorias",
  quando:"Atendimento, Implantação, Banco de dados, Infra, Operação e Apoio a outros times (AT · IM · BD · IN · OP · EX), num fluxo só. Qualquer pessoa registra; quem atende puxa dentro da reserva de capacidade, faz o trabalho com a IA só como auxílio e declara resolvido. O que muda o código vira fatia ou bug pela triagem."},
 sprint:{nome:"Ciclo da sprint",c:"--l-sprint",sub:"sa-planejamento",
  quando:"Ciclo com políticas escritas no acordos.md: seleção pela vazão, puxada com sinal de WIP e daily pela sa-status. A review faz a curadoria das Regras aprendidas, a retrospectiva leva as melhorias ao acordos.md, e a virada acontece no planejamento da sprint seguinte. O ELM fica fora do rito."}
};
const ROTAS=[["trivial","Trivial"],["rapida","Rápida"],["completo","Completo"]],ROTA0="rápida";

const ROUTES={
 epico:{pts:[[70,404],[436,404],[436,100],[960,100],[960,52],[200,52],[200,386]]},
 afk:{pts:[[70,412],[448,412],[448,290],[740,290],[740,190],[1130,190],[1130,290],[1360,290],[1360,444],[1000,444]]},
 hitl:{pts:[[70,420],[460,420],[460,298],[1345,298],[1345,430],[1000,430]]},
 atd:{pts:[[70,428],[480,428],[480,580],[960,580]]},
 sprint:{ring:{cx:300,cy:565,r:121}}
};
const TEXTS=[
 {x:30,y:300,t:"ENTRADA"},{x:458,y:84,t:"PRODUTO · ÉPICO",l:"epico"},{x:476,y:214,t:"FATIA · REFINAR E ASSUMIR",l:"hitl afk"},
 {x:1000,y:170,t:"IA AUTOPILOT · SUBAGENTE NA WORKTREE",l:"afk"},{x:880,y:340,t:"IA SUPERVISIONADA OU MANUAL",l:"hitl"},
 {x:1140,y:340,t:"MR · REVISÃO HUMANA",l:"hitl afk"},{x:1030,y:410,t:"DEPOIS DO MERGE",l:"hitl afk"},{x:500,y:556,t:"SUSTENTAÇÃO",l:"atd"},
 {x:580,y:44,t:"fatias aceita no backlog: cada uma segue pelo detalhar",cls:"badge-t",a:"middle",l:"epico"},
 {x:300,y:556,t:"CICLO DA",cls:"ringtxt",a:"middle",l:"sprint"},{x:300,y:572,t:"SPRINT",cls:"ringtxt",a:"middle",l:"sprint"},{x:300,y:590,t:"sa-planejamento",cls:"skill",a:"middle",l:"sprint"}
];
const DECOR=[];

const r=(a,d)=>a*Math.PI/180;
const RG=ROUTES.sprint.ring;const rp=a=>({x:+(RG.cx+RG.r*Math.cos(r(a))).toFixed(1),y:+(RG.cy+RG.r*Math.sin(r(a))).toFixed(1)});

const S={
/* ---------- entrada ---------- */
 triar:{x:70,y:420,g:"hub",lab:"below",nome:"Triagem",sk:"sa-triar",
  papel:"qualquer pessoa (na prática, P.O. e SM)",agente:"sa-especificador ou sa-desenvolvedor",tarefa:"—",
  faz:["Cadastro comum (fluxo/cadastro.md): toda skill que registra item usa a mesma; a entrada direta “registrar sem triar” é a sa-triar.cadastrar","Tipo e série: épico EP-nn, fatia e bug FT-nnn, sustentação <categoria>-nnn; o id é o maior da série + 1, lido depois do pull, e nunca muda","Procura duplicado no backlog.md, nas fichas e nos registros","Decide: cancelada (duplicado ou recusa), nova com falta: <pergunta>, adiada até <data> ou aceita","Aceita: tamanho P · M · G, prioridade crítica (urgente) ou vazia, e o pai; maior que G é épico","Encaminha só como sugestão: trilha e autonomia são de quem puxa"],
  arq:[".sabia/planejamento/backlog.md: id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em","um commit pequeno por item, direto na branch base (fluxo/commit-na-branch-base.md)"],
  elm:["Pedido pelo número do EWM: o WI é lido pela sa-elm; a coluna ib guarda só o número do IB","Importar do EWM, só a pedido: sa-elm.importar-backlog (Defeito → bug · Item de Backlog → fatia)","Sem ELM, nenhuma oferta aparece"],
  ctx:{
   epico:{faz:["Épico: demanda maior que G; nasce a-moldar, só com a linha (a pasta nasce no pitch)","Fatia que passa de G vira épico: linha EP-nn nova com obs veio de FT-nnn, e a FT fica cancelada · virou EP-nn","Oferece a sa-refinar.moldar"]},
   hitl:{faz:["Fatia ou bug que cabe em G: aceita, com tamanho, prioridade e pai (EP-nn ou vazio)","Bug: ficha curta com passos · atual · esperado · reproduzido","Ficha curta em .sabia/planejamento/fatias/FT-<nnn>-<slug>.md, com a Entrada","Oferece a sa-refinar.detalhar"]},
   atd:{faz:["Sustentação: a categoria (AT · IM · BD · IN · OP · EX) é confirmada antes de gravar, porque o id sai dela; não se recategoriza","Registro em .sabia/planejamento/sustentacao/<ID>-<slug>.md: Categoria · Origem · Pedido por · Prazo · Responsável e o Pedido","Fica nova na fila da Sustentação e oferece a sa-atender.atender"],
    arq:[".sabia/planejamento/backlog.md (linha nova)",".sabia/planejamento/sustentacao/<ID>-<slug>.md","dado de cliente fica em .sabia/local/sustentacao/<ID>/, fora do git"]}}},
 backlog:{x:200,y1:396,y2:444,g:"pill",lab:"below",an:"end",dx:6,nome:"Backlog",sk:"backlog.md",
  papel:"produto (ordem das linhas)",agente:"—",tarefa:"—",
  faz:["Uma linha por item, com o tipo e o id da série; o corpo é achado pelo id (sem coluna link nem sprint)","A ordem das linhas é a prioridade; crítica é o item urgente, pela política do acordos.md","Fatia e bug: nova → aceita → elegível → em-andamento → concluida, mais cancelada e adiada até <data>; em-revisao vem do MR aberto e não se grava","Épico: a-moldar → em-especificacao → fatiado → concluido · cancelado","Sustentação: nova → em-andamento → concluida · cancelada","Até alguém puxar, a sa-refinar.ajustar ordena, divide, junta, edita ou cancela, com o ok do P.O.","aceita_em, iniciada_em e concluida_em dão o lead time"],
  arq:[".sabia/planejamento/backlog.md, gravado direto na branch base"],elm:["Coluna ib: só o número do IB; as tarefas DEV · ESP · ATD ficam na sprint"]},
 planejar:{x:300,y1:396,y2:444,g:"pill",lab:"above",dx:-8,nome:"Planejar a sprint",sk:"sa-planejamento",
  papel:"o time; quem tem produto decide",agente:"sa-especificador",tarefa:"—",
  faz:["Início do ciclo (com a virada) ou reabastecimento quando o topo esvazia","Capacidade pela vazão das 3 últimas sprints, ajustada pelas horas; a reserva de capacidade do acordos.md fica para o atendimento","Especificação: fatias e bugs aceita a refinar, épicos a moldar ou em especificação; não contam na vazão","Desenvolvimento: itens elegível, crítica primeiro e depois a ordem do backlog.md, até a sobra; atendimento até a reserva de capacidade","Responsável só quando já definido (nunca aloca sozinho); a meta é uma frase de resultado","Proposta com o ok de quem tem produto"],
  arq:[".sabia/planejamento/sprints/<AAAA>/sprint-<nn>.md: Item · Trabalho (especificação | desenvolvimento | atendimento) · Responsável · Tarefas","sem coluna de situação: o andamento é o status do backlog.md","na primeira vez, a sa-planejamento.inicial grava equipe.json, acordos.md e o roadmap.md opcional"],
  elm:["Só a pedido: sa-elm.iteracao cria <pai>/Sprint <nn> e move o IB e as tarefas das linhas","Na virada, a tarefa do item que saiu é cancelada (sa-elm.finalizar); o IB fica"],
  ctx:{epico:{faz:["Linha especificação para o épico a-moldar (sa-refinar.moldar) ou em-especificacao (sa-prd.prd)","Não é pré-condição: a skill que puxa acrescenta a linha no sprint aberto"]},
   hitl:{faz:["Fatia ou bug aceita entra como especificação (sa-refinar.detalhar)","Item elegível entra como desenvolvimento; a ficha que fica elegível durante a sprint é puxada sem segundo encaixe","Urgente (crítica) entra sem aprovação: a linha nasce na atribuição","O item preso pela trava de artefato entra com o aviso aguarda <FT> (artefato <id>)"]},
   atd:{faz:["Linha atendimento: Sustentação nova ou em-andamento com prazo na sprint, até a reserva de capacidade","Reserva de capacidade consumida = soma das linhas de atendimento; estourou, o produto decide na seleção"]}}},
 item:{x:400,y1:396,y2:444,g:"hubpill",lab:"above",nome:"Porta do item",sk:"sa-status.item",
  papel:"qualquer pessoa",agente:"sa-desenvolvedor ou sa-especificador",tarefa:"—",
  faz:["Recebe <id> (EP, FT, AT…), o número do IB ou a tarefa do EWM; texto sem id vai à triagem","Junta status, obs, linha da sprint, branch e dono, status.md, MR, loop do autopilot, publicação e trava","Mostra o estado e a skill.fluxo dona; quem tem a booleana segue na mesma sessão (“seguir agora?”)","“minha próxima” (sa-status.minha-proxima): atribuição, revisões, sprint, Sustentação e aprovações pelas booleanas, crítica primeiro"],
  arq:["só leitura"],elm:["Acha o item também pelo ib ou pela tarefa do EWM"],
  ctx:{epico:{faz:["a-moldar → sa-refinar.moldar","em-especificacao sem prd.md aprovado → sa-prd.prd; aprovado → sa-refinar.fatiar","fatiado → as fatias com o próximo passo de cada uma; ajuste → sa-refinar.ajustar"]},
   hitl:{faz:["nova → sa-triar.triar · aceita → sa-refinar.detalhar · elegível → sa-desenvolver.iniciar","em-andamento sem MR → sa-desenvolver.codificar, pelo Retomar; retrabalho também","MR esperando revisão → qualquer desenvolvedor ≠ autor (sa-revisar.mr); aprovado com CI verde → o autor (sa-desenvolver.encerrar)","Revisão humana pedida → qualquer pessoa (sa-verificar.revisao-humana)","Trava de artefato: mostra quem tem a precedência e para"]},
   afk:{faz:["elegível → sa-desenvolver.iniciar, onde se escolhe o autopilot","Autopilot devolvido pelo disjuntor → sa-desenvolver.codificar, com o motivo do loop-<id>.md","MR esperando revisão → qualquer desenvolvedor ≠ autor (sa-revisar.mr); aprovado com CI verde → o autor (sa-desenvolver.encerrar)","Trava de artefato: mostra quem tem a precedência e para"]},
   atd:{faz:["Sustentação nova ou em-andamento → sa-atender.atender"]}}},

/* ---------- épico ---------- */
 moldar:{x:520,y:100,lab:"below",nome:"Moldar",sk:"sa-refinar.moldar",
  papel:"produto com o Dev",agente:"sa-especificador",tarefa:"—",
  faz:["Shape Up: pitch.md de uma página na pasta do épico, com problema · limite de investimento · esboço da solução · riscos · fora do escopo · decisão de investimento · Decisões","As perguntas pela sa-entrevistar e o vigente do bundle; regra sem fonte fica em aberto","Dúvida de tela: protótipo pela sa-especificar.prototipo, só com dado fictício","Ideia grande ainda não registrada: cadastro como épico antes"],
  arq:[".sabia/planejamento/epicos/EP-nn-<slug>/pitch.md, direto na branch base (commit EP-nn pitch)"],elm:["Original de um requisito, a pedido: sa-elm.baixar"]},
 gogk:{x:600,y:100,g:"gate",lab:"below",dy:23,nome:"Decisão de investimento",sk:"produto",
  papel:"quem tem produto",agente:"sa-especificador",tarefa:"—",
  faz:["investir: épico em-especificacao e iniciada_em = hoje; Decisão: investir e **Aprovado:** <usuario> · <data> no topo do pitch.md (commit EP-nn investir)","cancelar: cancelado, com obs não investir: <motivo>; a pasta fica (commit EP-nn cancelar)","Cabe em G: o épico fica cancelado com virou FT-nnn, e a fatia nasce aceita, com a ficha curta tirada do pitch","Sem quem tem produto na sessão: o épico segue a-moldar e só o pitch grava"],
  arq:["pitch.md · backlog.md"],elm:["cancelar: a sa-elm.finalizar oferece cancelar o IB"]},
 entrevistar:{x:680,y:100,lab:"below",dx:-6,nome:"Esclarecer",sk:"sa-entrevistar",
  papel:"quem especifica, com o produto",agente:"sa-especificador",tarefa:"—",
  faz:["Árvore de decisões só do trecho tocado; o que tem fonte responde sozinha, pela sa-pesquisar","Até 5 perguntas por rodada, numeradas, cada uma com a recomendação; o sim aceita todas","Regra de negócio vale pela decisão de uma pessoa; lacuna de rotina vira suposição registrada","Registro só por acréscimo: D-nn em Decisões (D-nn | Decisão | Quem | Quando | Fonte) e Em aberto com para quem e o que bloqueia","Reunião: a transcrição em .sabia/local/reunioes/ vira ATA aprovada por quem conduziu (sa-especificar.reuniao), e as decisões vão às Decisões com Fonte ATA-nn [mm:ss]","Protótipo: versão vN em prototipos/; vale só com a aprovação do cliente num D-nn, com quem, data, versão e evidência"],
  arq:["seções Decisões e Em aberto do pitch.md, do prd.md ou da ficha",".sabia/planejamento/atas/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md",".sabia/planejamento/prototipos/<id>-<slug>/v<N>/"],
  elm:["Com ELM, cita o GL do DOORS e leva a mudança de termo aos artefatos afetados; sem ELM, o termo vai ao glossario.md opcional","A ATA aprovada pode subir junto na publicação"]},
 prd:{x:760,y:100,lab:"below",nome:"PRD",sk:"sa-prd.prd",
  papel:"quem especifica escreve; o produto aprova",agente:"sa-especificador, com o subagente sa-pesquisador",tarefa:"ESP, se quiser criar no ELM",
  faz:["Assume: responsável do épico; oferece a linha EP-nn · especificação no sprint aberto","prd.md ao lado do pitch.md, proporcional ao tamanho: objetivos · métricas · requisitos com id · fora do escopo · Decisões · Em aberto","Vigente só do trecho tocado: specs arquivadas → bundle → ELM ao vivo, em leitura","Similares: para cada requisito, o vigente define a ação (inclui · altera · exclui) e o id; o impacto de cada altera e exclui","Um bloco por requisito: ### <sigla>-<id> · <título>, com Tipo (HF · UC · REG · MSG · EL · GL) e Ação, e o corpo pelo template do tipo, sem título Markdown","Id: <sigla>-<id do ELM> no existente; <sigla>-EPnn-nn provisório no novo","HF com cenários Dado · Quando · Então; UC só com Casos de uso = sim; EL só com Telas = sim e o protótipo aprovado; sem ET (só as-built)","Tipo com skill de toolkit: o bloco sai por ela (⇢)","Validar: o checklist do template do prd.md; decisão de negócio volta ao esclarecer"],
  arq:[".sabia/planejamento/epicos/EP-nn-<slug>/prd.md (commit EP-nn prd: <o quê>, a cada rodada)"],elm:["Com ELM: “quer criar o item no ELM?” → sa-elm.item (tarefa ESP)","O PRD não publica: os requisitos sobem pelas fatias, depois do merge"]},
 gprd:{x:840,y:100,g:"gate",lab:"below",dy:23,nome:"PRD aprovado",sk:"produto",
  papel:"quem tem produto",agente:"sa-especificador",tarefa:"ESP",
  faz:["Mostra o prd.md e o Em aberto, com o que cada um bloqueia; o Em aberto não impede a aprovação","Sim: **Aprovado:** <usuario> · <data> no topo (commit EP-nn aprovar PRD)","Ajuste: volta ao escrever","Concluir: oferece finalizar a ESP e seguir para o fatiamento; o épico fica em-especificacao até lá","Mudança depois: sa-prd.mudanca tira o Aprovado, registra a versão em Mudanças, reaprova e leva a mudança às fatias atingidas"],
  arq:["prd.md"],elm:["Com ELM: “finalizar a tarefa?” → sa-elm.finalizar (ESP)"]},
 fatiar:{x:920,y:100,lab:"below",nome:"Fatiar",sk:"sa-refinar.fatiar",
  papel:"quem especifica propõe com o Dev; o produto aprova e ordena",agente:"sa-especificador, com o subagente sa-pesquisador",tarefa:"—",
  faz:["Lê o PRD e pede à sa-pesquisar os fatos do código tocado","Tabela de fatias verticais P · M · G, com artefatos afetados, tamanho e dependência","Ajusta até o ok e a ordem de quem tem produto; conceito do PRD que muda vai à sa-prd.mudanca","Duas fatias abertas não alteram o mesmo artefato ao mesmo tempo: a segunda espera (trava de artefato)","Grava as linhas FT-nnn aceita logo abaixo do épico (pai EP-nn), as fichas com Objetivo, artefatos afetados e cenários do PRD e o épico fatiado, num commit","Oferece detalhar a primeira"],
  arq:["backlog.md · .sabia/planejamento/fatias/FT-<nnn>-<slug>.md"],elm:["—"]},

/* ---------- fatia: refinar e assumir ---------- */
 detalhar:{x:490,y1:290,y2:298,g:"pill",lab:"above",nome:"Detalhar",sk:"sa-refinar.detalhar",
  papel:"quem especifica, com o Dev (e o QA); o bug sem requisito tocado, o Dev sozinho",agente:"sa-especificador",tarefa:"—",
  faz:["Refinamento conjunto: regras e exemplos pela sa-entrevistar; rodada curta no bug e no P, Example Mapping no M e no G","Cenários CT-nn: Dado · Quando · Então, com o Então verificável","Artefatos afetados: <sigla>-<id> · inclui | altera | exclui · versão de referência, um por requisito tocado; sem requisito, nenhum requisito","Id do requisito novo: <sigla>-<EPnn|FTnnn>-nn, provisório até a publicação; sem ELM, definitivo","Dúvida grande: investigação técnica (sa-pesquisar), protótipo ou reunião; regra sem fonte: Em aberto, que bloqueia só o que depende dela","Muitas regras: dividir pela sa-refinar.ajustar; mais que G sem corte: vira épico"],
  arq:[".sabia/planejamento/fatias/FT-<nnn>-<slug>.md: Entrada · Objetivo · Regras · Cenários · Não muda · Artefatos afetados · Em aberto · Decisões · DoR"],
  elm:["Versão de referência do bundle; sem bundle, ou desatualizado, oferece a sa-elm.baixar"]},
 elm:{x:560,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Texto do ELM",sk:"sa-especificar.elm",
  papel:"quem tem especificador",agente:"sa-especificador",tarefa:"ESP, se quiser criar no ELM",
  aviso:"Só com ELM e artefatos afetados com inclui, altera ou exclui. Sem eles, a ficha basta, e o texto completo vai ao delta no plano.",
  faz:["Autonomia da especificação, perguntado uma vez e fixo até o fim: IA supervisionada · IA autopilot · manual (Especificação na ficha)","Pasta elm/ dentro da pasta da spec, direto na branch base: um arquivo inteiro por artefato afetado (HF · UC · REG · MSG · EL · GL)","Trava: artefato que está no elm/ de outra fatia aberta fica de fora até ela ser publicada ou cancelada","altera e exclui: o original do DOORS pela sa-elm.baixar e um commit de referência, antes de editar; inclui: arquivo novo com o id provisório","Manual: o especificador altera no DOORS e avisa “alterei”; a skill baixa, atualiza a versão de referência, grava o delta e marca publicado: manual","Antes de aprovar, compara o DOORS com a versão de referência; mudou, o especificador mescla ou segue","Aprovação arquivo por arquivo, contra o commit de referência e pelo Checklist do template do tipo: status: stable e verified"],
  arq:["<pasta da spec>/elm/<id do ELM>-<TIPO>-<slug>.md; novo: <EP|FT><nn>-<nn>-<TIPO>-<slug>.md","frontmatter type · title · status · sources; corpo pelo template do tipo, sem título Markdown","commit FT-nnn elm: aprova <ids>"],
  elm:["sa-elm.baixar: o original e a versão de referência (modificado_em do DOORS)","Com ELM: tarefa ESP pela sa-elm.item, a pedido"]},
 gficha:{x:630,y:294,g:"gate",lab:"below",nome:"Ficha aprovada",sk:"produto",
  papel:"quem tem produto",agente:"sa-especificador",tarefa:"—",
  faz:["DoR pelo checklist da ficha (avisa, não trava): entrada mínima, CT-nn verificáveis, artefatos afetados, elm/ aprovado, sem trava, sem Em aberto que bloqueie tudo, tamanho ≤ G","Só quem tem produto aprova: **Aprovado:** <usuario> · <data> no topo da ficha; bug sem artefatos afetados dispensa","DoR completa → elegível; senão fica aceita (a elegível que perde um item volta a aceita)","Mudança depois do Aprovado volta a linha para **Aprovado:** — até a nova aprovação","Oferece refinar o próximo item aceita"],
  arq:["ficha e backlog.md num commit (backlog: refinamento FT-nnn)"],elm:["—"]},
 iniciar:{x:700,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Assumir",sk:"sa-desenvolver.iniciar",
  papel:"quem tem desenvolvedor",agente:"sa-desenvolvedor",tarefa:"DEV, se quiser criar no ELM",fase:"elegível → em-andamento",
  faz:["Confere: linha desenvolvimento na sprint aberta, ou urgente (crítica); fora disso, o reabastecimento é do P.O.","DoR da ficha (aceita: oferece a sa-refinar.detalhar), sinal de WIP do acordos.md (avisa, não trava), trava de artefato e o registro publicado na branch base","Assumir num passo só: tamanho (P · M · G), trilha (trivial · rápida · completo) e autonomia (IA supervisionada · IA autopilot · manual), fixa até o fim","Com artefatos afetados, a trilha nunca é trivial: o delta é obrigatório. Maior que G: vira épico, sem branch","Atribuição na branch base: em-andamento, responsável, iniciada_em e a linha da sprint, num commit pequeno","Branch <prefixo>ft-<nnn>-<slug> a partir da branch base; rápida e completo: pasta da spec com o status.md (no Kiro, também o .config.kiro); o push mostra a atribuição"],
  arq:["backlog.md e sprint-<nn>.md na branch base (commit da atribuição)","<pasta da spec>/status.md: Trilha · Autonomia · Fase — · MR"],
  elm:["Com ELM: “quer criar o item no ELM?” → sa-elm.item (IB [<id>] e tarefa [DEV] <id>); a resposta não muda o fluxo"],
  ctx:{afk:{faz:["As mesmas conferências e a mesma atribuição na branch base","Autonomia IA autopilot: a branch nasce numa worktree, .sabia/local/wt/<id>, e a pessoa continua na branch base","Lança o sa-desenvolvedor como subagente com o id, a trilha, a worktree e o teto do disjuntor","Liberado ao subagente: push da própria branch (sem --force), merge da branch base nela e abrir ou atualizar o MR dela; bloqueado: merge do MR, ELM e rede","Ele não grava na branch base: o que gravaria vai ao Em aberto como cadastrar: <tipo> · <título>","A pessoa fica livre para puxar outro item: várias tarefas em paralelo, sem lote"],
    arq:["backlog.md e sprint-<nn>.md na branch base (commit da atribuição)",".sabia/local/wt/<id>/ e .sabia/local/loop-<id>.md, fora do git"]}},
  trv:{trivial:{arq:["backlog.md e sprint-<nn>.md na branch base (commit da atribuição)","trivial: sem pasta da spec nem status.md; o estado fica no MR e no último commit"]}}},

/* ---------- fatia: IA supervisionada ou manual ---------- */
 plano:{x:780,y:298,lab:"above",nome:"Plano",sk:"sa-plano.plano",
  papel:"quem desenvolve (aprova o próprio plano)",agente:"sa-desenvolvedor, com os subagentes sa-pesquisador e sa-revisor",tarefa:"DEV",fase:"—",
  faz:["Lê status.md, ficha, elm/, o prd.md do épico pai, Projeto e Regras aprendidas do sabia.md e o steering","Texto aprovado: cada arquivo de elm/ com ELM, a ficha sem ELM; sem aprovação, Em aberto e para","Pesquisa: pede pistas, chama a sa-pesquisar no sa-pesquisador e grava os fatos no research.md","Decisões técnicas com alternativas reais e a recomendada; arquitetural ou irreversível espera a pessoa","Delta: copia, sem reescrever, o texto completo de cada requisito tocado, com id, ação e versão de referência","Escreve pela matriz trilha × formato; “quer revisar agora?”: critérios de revisão L no sa-revisor","Resumo 🧭 e a aprovação de quem desenvolve; Fase implementando","O plano mostra que passa de G: vira épico"],
  arq:["research.md · o delta · design e tasks pela matriz trilha × formato"],elm:["Não lê o ELM: o texto vem de elm/ e da ficha"],
  trv:{rapida:{arq:["Kiro Quick Spec: requirements.md · design.md · tasks.md, sem portões; no bug, bugfix.md · design.md · tasks.md","OpenSpec: proposal.md · delta em specs/<cap>/spec.md · tasks.md (no bug, delta MODIFIED)","research.md · status.md"]},
   completo:{arq:["Kiro: requirements.md → design.md → tasks.md, cada um com “quer revisar agora?”","OpenSpec: proposal.md · delta · design.md · tasks.md","research.md · status.md"]}}},
 codificar:{x:870,y:298,lab:"above",dy:-26,nome:"Codificar",sk:"sa-desenvolver.codificar",
  papel:"quem desenvolve; no manual, a pessoa escreve o código",agente:"sa-desenvolvedor",tarefa:"DEV",fase:"implementando",
  faz:["Preparar: branch certa, árvore limpa, pull --ff-only e o baseline do último pipeline da branch base","Uma tarefa por vez em TDD: vermelho, verde, arrumar; backpressure do trecho tocado a cada alteração; commit pequeno","Teste automatizado marcado com o CT-nn do cenário (CT no teste, no acordos.md)","Desvio leve: registra em Desvios; fora do escopo e DDL: cadastro (BD-nnn, origem FT-nnn); regra sem decisão: Em aberto; arquitetural: para e pergunta","Duas correções seguidas sem progresso, ou contexto cheio: Retomar, commit e sessão nova","Atualiza a branch só por merge da branch base, nunca rebase","Validar: a suíte completa uma vez pelo pipeline da branch, contra o baseline, e a cobertura; a evidência é o comando e o resultado","Manual: só a geração do código-fonte é da pessoa; no “terminei”, o fluxo segue do validar, com as mesmas validações"],
  arq:["código e testes · tasks.md · status.md (Fase, Desvios, Em aberto, Retomar)"],elm:["—"],
  trv:{trivial:{arq:["código e testes, sem tasks.md nem status.md"]}}},
 autorrev:{x:960,y:298,lab:"above",nome:"Revisão do agente",sk:"sa-revisar.revisar",
  papel:"subagente sa-revisor",agente:"sa-revisor, chamado pela sa-desenvolver.codificar",tarefa:"DEV",fase:"revisando",
  faz:["Contexto isolado: critérios de revisão C nos eixos spec · padrões · segurança, mais os critérios de revisão do toolkit e as Regras aprendidas","Lê o diff inteiro e caça teste enfraquecido; o C3 vem do pipeline da branch ou do validar","Cada achado com severidade BLOQUEANTE, IMPORTANTE ou SUGESTÃO e o destino sugerido","Quem desenvolve tria: corrige (tarefa [R<n>]) · adia (cadastro) · volta-plano (sa-plano.replanejar) · volta-spec (Em aberto ao especificador) · descarta (o motivo vai no MR)","É revisão do agente: não vale como a revisão do MR"],
  arq:["nenhum arquivo: o resumo vai à Evidência do MR"],elm:["—"]},
 verif:{x:1050,y:298,lab:"above",dy:-26,nome:"Verificação do agente",sk:"sa-verificar.verificar",
  papel:"subagente sa-verificador",agente:"sa-verificador, chamado pela sa-desenvolver.codificar",tarefa:"DEV",fase:"verificando",
  faz:["Roteiro de cada CT-nn antes de executar: pré-condição · passos · esperado, com a repetição e o erro em um item","Sobe a aplicação pelo Executar do sabia.md, local ou na URL de teste, nunca em produção","Exercita como usuário real (curl, navegador) e marca ✅ aceito · ❌ rejeitado · ⚠️ ambiente · 🔁 possível alteração","Fora dos cenários: defeito ou DDL pendente vão ao 🔎, para quem chamou cadastrar","Rápida e completo: reescreve o CT.csv, uma linha por cenário ✅","❌ vira tarefa; 🔁 se decide antes do MR (código errado vira ❌; a spec que muda vai ao especificador)"],
  arq:["<pasta da spec>/CT.csv: Tipo;Resumo;Responsável;Descrição","a evidência no bloco 🔎, que vai à Evidência do MR"],elm:["—"],
  trv:{trivial:{arq:["sem CT.csv: a evidência do 🔎 vai ao MR"]}}},

/* ---------- fatia: IA autopilot ---------- */
 pl_a:{x:770,y:190,lab:"below",nome:"Plano",sk:"sa-plano",
  papel:"o subagente; quem desenvolve recebe o resumo",agente:"sa-desenvolvedor como subagente",tarefa:"DEV",fase:"—",
  faz:["As etapas da sa-plano.plano, na worktree: research.md pelo sa-pesquisador, delta copiado, design e tasks","Falta a aprovação do texto (elm/ ou ficha): Em aberto e devolve à pessoa","Escolha técnica: a recomendada, registrada; arquitetural ou irreversível sem decisão: devolve à pessoa","Critérios de revisão L no sa-revisor; a 2ª reprovação seguida dispara o disjuntor","O subagente aprova o plano e registra; Fase implementando, e segue direto"],
  arq:["research.md · o delta · design e tasks, na worktree"],elm:["—"],
  trv:{rapida:{arq:["Kiro Quick Spec (ou Bugfix Spec no bug) · OpenSpec proposal + delta + tasks, na worktree","research.md · status.md"]},completo:{arq:["Kiro requirements → design → tasks · OpenSpec proposal + delta + design + tasks, na worktree","research.md · status.md"]}}},
 cod_a:{x:880,y:190,lab:"below",nome:"Codificar",sk:"sa-desenvolver",
  papel:"o subagente",agente:"sa-desenvolvedor como subagente",tarefa:"DEV",fase:"implementando",
  faz:["TDD e backpressure como na sessão, com os comandos na worktree (cd .sabia/local/wt/<id> && …)","Push da própria branch e merge da branch base nela liberados; rebase e --force, nunca","Desvio arquitetural ou irreversível: devolve à pessoa","Sem progresso ou contexto cheio: conta como tentativa no disjuntor","Validar: a suíte completa pelo pipeline da branch; falha de ambiente devolve à pessoa"],
  arq:["código e testes · tasks.md · status.md · .sabia/local/loop-<id>.md"],elm:["—"]},
 rev_a:{x:990,y:190,lab:"below",nome:"Revisão do agente",sk:"sa-revisor",
  papel:"subagente sa-revisor",agente:"sa-revisor, chamado pelo autopilot",tarefa:"DEV",fase:"revisando",
  faz:["Critérios de revisão C nos eixos spec · padrões · segurança, em contexto isolado","Os achados seguem a recomendação do revisor, registrados em Desvios","Reprovado: conta no disjuntor e volta à codificação"],
  arq:["status.md: Desvios"],elm:["—"]},
 ver_a:{x:1100,y:190,lab:"below",dx:28,nome:"Verificação do agente",sk:"sa-verificador",
  papel:"subagente sa-verificador",agente:"sa-verificador, chamado pelo autopilot",tarefa:"DEV",fase:"verificando",
  faz:["Os CT-nn exercitados como na sessão, nunca em produção","CT.csv na rápida e no completo; o Responsável é quem desenvolve","REJEITADO ou AMBIENTE: conta no disjuntor","ACEITO: Lições aprendidas, as-built e o MR, aberto pelo subagente"],
  arq:["<pasta da spec>/CT.csv"],elm:["—"]},

/* ---------- MR e revisão humana ---------- */
 mr:{x:1160,y1:290,y2:298,g:"pill",lab:"above",nome:"MR",sk:"gitlabpr",
  papel:"quem desenvolve (o autor)",agente:"sa-desenvolvedor",tarefa:"DEV",fase:"pr-aberto",
  faz:["Lições aprendidas da fatia na seção Lições aprendidas do status.md (no trivial, no MR)","As-built: decisão que atravessa fatias vira ADR em docs/adr/; onde o projeto mantém ET, o design.md fica as-built (Components and Interfaces · Data Models · Decisões técnicas)","Texto pelo template: O quê · Porquê · Evidência (CI, revisão do agente, 🔎) · Risco · Foco · Artefatos afetados","Commit, push com o sim, conferência no remoto e gitlab_criar_mr, com remover a branch de origem","Avisa que o MR espera um desenvolvedor ≠ autor e sugere revisão humana no risco alto"],
  arq:["status.md: Fase pr-aberto e o MR","docs/adr/NNNN-<titulo>.md · design.md (ET as-built)",".gitlab/merge_request_templates/Default.md"],
  elm:["Nada vai ao ELM no MR: a ET as-built sobe depois do merge","Com ELM, oferece lançar horas (sa-elm.horas)"],
  ctx:{afk:{faz:["O subagente grava as Lições aprendidas e o as-built e abre ou atualiza o MR da própria branch","Devolve à pessoa o resumo: o MR, os Desvios, o Em aberto e o que ficou do ELM","Daqui em diante, tudo é igual à IA supervisionada: revisão humana e merge do autor"]}}},
 revmr:{x:1240,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Revisar o MR",sk:"sa-revisar.mr",
  papel:"um desenvolvedor ≠ autor (o CODEOWNERS indica o dono)",agente:"sa-desenvolvedor, com o subagente sa-revisor",tarefa:"—",fase:"em-revisao, derivado do MR aberto",
  faz:["Confere a booleana desenvolvedor e o usuario ≠ autor do MR","Lê o MR (O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados), as threads e o CI do último commit; git fetch, sem checkout nem commit","Apoio: critérios de revisão C no sa-revisor sobre o diff; o relatório não substitui a leitura da pessoa","Tria cada achado em thread: corrige (suggested change no ajuste pequeno) · adia (cadastro) · volta-plano · volta-spec · descarta","Sem BLOQUEANTE aberto: aprova no MR; com BLOQUEANTE: pede mudanças","O Risco pede revisão humana: oferece a sa-verificar.revisao-humana antes de aprovar"],
  arq:["tudo fica no MR"],elm:["Com ELM, oferece as horas (sa-elm.horas)"]},
 revhum:{x:1320,y1:290,y2:298,g:"pill",lab:"above",nome:"Revisão humana",sk:"por risco",
  papel:"qualquer pessoa",agente:"sa-desenvolvedor, com o subagente sa-verificador",tarefa:"—",
  aviso:"Só quando o risco pede: o Risco do MR, o revisor ou o P.O.",
  faz:["Traz a branch do MR (fetch, checkout, pull --ff-only); árvore suja para; sem commit na branch","A pessoa escolhe os CT-nn do risco; a sa-verificar.verificar roda com ela, que exercita e confirma cada resultado","❌ corrige, adia ou descarta; 🔁 se decide com o autor; ⚠️ vira thread sem contar como falha","Comenta o 🔎 da revisão humana no MR e abre as threads, com o sim"],
  arq:["o MR"],elm:["Com ELM, oferece as horas (sa-elm.horas)"]},

/* ---------- depois do merge ---------- */
 merge:{x:1240,y1:430,y2:444,g:"pill",lab:"below",nome:"Encerrar",sk:"sa-desenvolver.encerrar",
  papel:"o autor do MR",agente:"sa-desenvolvedor",tarefa:"DEV",fase:"em-andamento → concluida",
  faz:["Lê o MR: aberto, sem Draft e sem conflito; conflito com a branch base volta à codificação, por merge","Confere 1 aprovação vigente de um desenvolvedor ≠ autor e o pipeline verde no último commit","“Mergear?” e gitlab_mesclar_mr removendo a branch de origem (ou o auto-merge, se o time usa); sem o MCP, a pessoa mergeia na UI, sem o botão Rebase","concluida e concluida_em na branch base; última fatia aberta de um épico fatiado → épico concluido, no mesmo commit","Rápida e completo: sa-especificar.archive","Oferece puxar o próximo do topo da sprint"],
  arq:["backlog.md (commit <FT> concluir)"],
  elm:["Com ELM: “finalizar a tarefa?” → sa-elm.finalizar (conclui a DEV, liga-a aos artefatos afetados que já tem id e oferece concluir o IB e o do épico)","“lançar horas?” → sa-elm.horas; qualquer resposta segue"],
  ctx:{afk:{faz:["Igual à IA supervisionada: o merge é do autor, com a aprovação e o CI verde; o autopilot nunca faz merge","concluida e concluida_em na branch base; última fatia aberta de um épico fatiado → épico concluido","Item que passou pelo autopilot: remove a worktree sem --force e apaga o loop-<id>.md","Rápida e completo: sa-especificar.archive"]}}},
 archive:{x:1130,y1:430,y2:444,g:"pill",lab:"below",dy:26,nome:"Archive",sk:"sa-especificar.archive",
  papel:"quem desenvolve",agente:"sa-desenvolvedor",tarefa:"—",
  faz:["Fatia ou bug concluida com o MR mergeado; sem delta, nada a arquivar","OpenSpec sem ELM: openspec archive ft-<nnn>-<slug> --yes funde o delta na especificação vigente","OpenSpec com ELM: --skip-specs --yes; Kiro: nada se move, o vigente são as specs em .kiro/specs/","Com ELM e algo a publicar: pergunta a quem tem especificador se publica no DOORS","Sem a booleana: Publicação: pendente no status.md, e a sa-status mostra"],
  arq:["openspec/changes/archive/<AAAA-MM-DD>-ft-<nnn>-<slug>/","status.md: Publicação"],elm:["sa-elm.publicar, com o sim de quem tem especificador"]},
 publicar:{x:1020,y1:430,y2:444,g:"pill",lab:"below",term:true,nome:"Publicar no DOORS",sk:"sa-elm.publicar",
  papel:"quem tem especificador",agente:"sa-desenvolvedor ou sa-especificador (oferta da sa-elm)",tarefa:"DEV (para ligar)",
  aviso:"Só com ELM. A fonte são os arquivos aprovados de elm/ e a ET as-built, onde o projeto mantém ET.",
  faz:["Fonte: os arquivos aprovados de elm/, a ET as-built do design.md e os artefatos afetados da ficha","Confere a versão: para cada altera e exclui, o modificado_em do DOORS contra a versão de referência; mudou → avisa e pula","Prévia e um sim, na ordem do catálogo de tipos (MSG · GL · REG · UC · EL · HF · ET); sobe só o corpo, sem o frontmatter, e o link para arquivo vira (id)","altera: atualiza pelo id; inclui: cria e guarda o id novo; exclui: roteiro para a lixeira do DOORS Next","Troca os ids: renomeia o arquivo para <id do ELM>-<TIPO>-<slug>.md e troca o provisório no prd.md, nas fichas, no delta, no design.md e em elm/, num commit","Liga os requisitos publicados à tarefa DEV (implementa); a ATA do item sobe junto, se a pessoa quiser","Publicação: publicada <data> no status.md; artefato pulado ou exclusão por fazer mantém pendente, e o especificador refaz a mescla"],
  arq:["status.md: Publicação · elm/ renomeado (commit elm: publicar FT-<nnn>)"],
  elm:["elm_publicar_req · elm_ligar(DEV, requisito, implementa)","Sem a booleana especificador: Publicação: pendente, até quem a tem rodar a sa-elm.publicar","No fim, oferece baixar o bundle"]},

/* ---------- Sustentação ---------- */
 atd1:{x:560,y:580,lab:"below",nome:"Puxar",sk:"reserva de capacidade",
  papel:"quem atende",agente:"sa-desenvolvedor",tarefa:"—",
  faz:["Entrada: id de Sustentação nova ou em-andamento; pedido novo é registrado antes, pelo cadastro comum (categoria, prioridade e critério de pronto)","Confere a reserva de capacidade consumida (as linhas de atendimento do sprint aberto) contra a reserva de capacidade do acordos.md","Dentro da reserva de capacidade, ou com prioridade crítica: segue; estourada: quem tem produto decide"],
  arq:["lê sprint-<nn>.md e acordos.md"],elm:["—"]},
 atd2:{x:650,y:580,lab:"below",dy:26,nome:"Assumir",sk:"<ID> iniciar",
  papel:"quem atende",agente:"sa-desenvolvedor",tarefa:"ATD, se quiser criar no ELM",
  faz:["Commit <ID> iniciar na branch base: em-andamento, responsável e iniciada_em no backlog","Responsável no registro e a linha atendimento no sprint aberto"],
  arq:["backlog.md · sprint-<nn>.md · .sabia/planejamento/sustentacao/<ID>-<slug>.md"],elm:["Com ELM: “quer criar o item no ELM?” → sa-elm.item (IB e tarefa [ATD] <id>)"]},
 atd3:{x:740,y:580,lab:"below",nome:"Atender",sk:"IA a pedido",
  papel:"quem atende",agente:"sa-desenvolvedor, com o subagente sa-pesquisador",tarefa:"ATD",
  faz:["A pessoa faz o trabalho; a IA ajuda a pedido: regras vigentes, pesquisa de código (sa-pesquisar), banco só em leitura, logs e rascunho de resposta","O agente não executa em ambiente nem responde ao cliente","Ajuda de especificador, produto ou time a pedido; refinamento só quando quem atende pede","Pedido que muda o código: vira bug ou fatia pelo cadastro, com origem <ID>; categoria errada: cancelada · virou <novo id>, e o certo nasce pelo cadastro","Sessão que termina antes de resolver: Atividade no registro e commit <ID> registrar sessão"],
  arq:["registro: Atividade",".sabia/local/sustentacao/<ID>/ (dado real, fora do git)"],
  elm:["Com ELM: “pesquisar nas regras do ELM?” (bundle, depois o ELM ao vivo, só leitura)"]},
 atd4:{x:830,y:580,lab:"below",nome:"Resolver",sk:"quem atende",
  papel:"quem atende",agente:"sa-desenvolvedor",tarefa:"ATD",
  faz:["Só a pessoa que atende declara resolvido, nunca a IA; não há confirmação do solicitante","Resposta e Horas no registro; concluida e concluida_em no backlog (ou cancelada, com o motivo)","Avisa a fatia de origem, quando há"],
  arq:["registro · backlog.md"],elm:["Com ELM: “finalizar a tarefa?” → sa-elm.finalizar · “lançar horas?” → sa-elm.horas"]},
 atd5:{x:920,y:580,lab:"below",term:true,nome:"Desdobrar",sk:"<ID> concluir",
  papel:"quem atende",agente:"sa-desenvolvedor",tarefa:"—",
  faz:["“algum desdobramento?”: cada um vira cadastro com origem <ID> e segue pela triagem","A lição vai à seção Lições aprendidas do registro, para a curadoria da review","Um commit <ID> concluir leva o registro, o backlog e os cadastros"],
  arq:["registro · backlog.md · cadastros"],elm:["—"]},

/* ---------- ciclo da sprint ---------- */
 durante:Object.assign(rp(-30),{lab:"in-left",nome:"Durante",sk:"puxar com WIP",
  papel:"membro do time",agente:"sa-desenvolvedor ou sa-especificador",tarefa:"a do trabalho",
  faz:["Puxa o topo com sinal de WIP: desenvolvimento → sa-desenvolver.iniciar · atendimento → sa-atender.atender · especificação → sa-refinar.detalhar ou sa-prd.prd","Item fora da seleção (urgente, cadastro puxado na hora, especificação que fechou): a skill que puxa acrescenta a linha no sprint aberto; não há segundo encaixe","Urgente: prioridade crítica, urgente pela política, sem aprovação; pode passar o WIP em 1","Reabastecimento quando o topo esvazia: sa-planejamento.sprint"],
  arq:["sprint-<nn>.md: a linha que faltava","backlog.md: o status, por quem muda"],elm:["Com ELM, ao assumir: sa-elm.item (DEV · ESP · ATD); horas só por pergunta ou pedido"]}),
 inspecao:Object.assign(rp(30),{lab:"in-left",nome:"Daily",sk:"sa-status.painel",
  papel:"qualquer pessoa",agente:"sa-desenvolvedor ou sa-especificador",tarefa:"—",
  faz:["Só leitura, da branch base remota: backlog, sprint, branches, status.md, MRs e worktrees","WIP por status contra o limite, vazão, lead time, idade contra o SLE e urgente","MRs esperando pessoa, retrabalho, topo puxável, refinamento e produto, Sustentação e reserva de capacidade, fila de triagem","Pendências de rastreio (sa-status.pendencias): publicação pendente, trava de artefato, commit sem id, CT sem teste, MR mergeado sem concluir…; nenhuma trava","Sugere a ação de maior alavanca","Fechar a sessão (sa-status.fechar-sessao): Retomar, tasks.md, horas a pedido e os créditos do Kiro"],
  arq:["só leitura",".sabia/creditos/<usuario>.csv (fechar a sessão, no Kiro)"],elm:["Publicação pendente: o especificador roda a sa-elm.publicar"]}),
 review:Object.assign(rp(90),{lab:"above",nome:"Review",sk:"rito · curadoria",
  papel:"o time, com os stakeholders quando disponíveis",agente:"sa-especificador",tarefa:"—",
  faz:["Não trava o ciclo","Os concluídos com o link do MR e os abertos; o retorno por item","Pedido novo vai ao cadastro","Curadoria: as Lições aprendidas do ciclo (sa-status.licoes-aprendidas) e quais entram em Regras aprendidas do sabia.md, no formato regra · origem FT/AT · data"],
  arq:["sprint-<nn>.md: ## Review e .sabia/sabia.md: Regras aprendidas, num commit"],elm:["—"]}),
 retro:Object.assign(rp(150),{lab:"left",nome:"Retro",sk:"rito · acordos.md",
  papel:"o time",agente:"sa-especificador",tarefa:"—",
  faz:["Independente da review","Dados: os números do painel, as pendências de rastreio e os itens devolvidos pelo disjuntor do autopilot","Bom · melhorar · ações, cada ação com dono","Números: concluídas, atendimento, meta e lead time médio","Reserva de capacidade consumida × reservada: um novo % proposto a quem tem produto","As melhorias vão ao acordos.md"],
  arq:["sprint-<nn>.md: ## Retro · acordos.md, se mudou (um commit)"],elm:["—"]}),
 virada:Object.assign(rp(210),{lab:"left",nome:"Virada",sk:"migra ou volta",
  papel:"quem tem produto decide",agente:"sa-especificador",tarefa:"—",
  faz:["No planejamento da sprint seguinte: os itens abertos da anterior migram ou voltam ao backlog","Migra: linha igual na sprint nova, primeiro na capacidade","Não migra: volta ao backlog com branch, ficha e pasta; em-andamento passa a elegível e o responsável fica","A sprint anterior não muda: os números ficam para a retrospectiva; não existe incompleto no fechamento"],
  arq:["sprint-<nn>.md novo · backlog.md dos que saíram"],elm:["Com ELM: cancela a tarefa do item que saiu (o IB fica) e move os migrados (sa-elm.iteracao)"]})
};
S.triar.ctx.afk=S.triar.ctx.hitl;
S.planejar.ctx.afk=S.planejar.ctx.hitl;

const ALL={
 epico:["triar","backlog","planejar","item","moldar","gogk","entrevistar","prd","gprd","fatiar","backlog@fim"],
 hitl:["triar","backlog","planejar","item","detalhar","elm","gficha","iniciar","plano","codificar","autorrev","verif","mr","revmr","revhum","merge","archive","publicar"],
 afk:["triar","backlog","planejar","item","detalhar","elm","gficha","iniciar","pl_a","cod_a","rev_a","ver_a","mr","revmr","revhum","merge","archive","publicar"],
 atd:["triar","backlog","planejar","item","atd1","atd2","atd3","atd4","atd5"],
 sprint:["planejar","durante","inspecao","review","retro","virada","planejar@fim"]
};
const TRIV=s=>s.tr==="trivial"?"Trivial: sem plano nem arquivo de spec; tudo no MR":null;
const SKIP={
 elm:s=>s.art==="nao"?"Sem ELM, ou artefatos afetados sem inclui, altera ou exclui: sem elm/":null,
 plano:TRIV,pl_a:TRIV,
 archive:s=>s.tr==="trivial"?"Trivial: sem spec a arquivar":null,
 publicar:s=>s.tr==="trivial"?"Trivial: sem spec, nada a publicar":s.art==="nao"?"Sem arquivos de elm/: nada dos artefatos afetados a publicar":null
};
/* combinação que o fluxo não aceita: aparece como aviso na ficha */
const AVISO=s=>["hitl","afk"].includes(s.line)&&s.tr==="trivial"&&s.art==="sim"?"Com artefatos afetados, a trilha nunca é trivial: o delta é obrigatório. Escolha rápida ou completo, ou veja a fatia sem artefatos.":null;
const VIA={
 "epico:triar>backlog":"a-moldar: só a linha","hitl:triar>backlog":"aceita, com tamanho e prioridade","afk:triar>backlog":"aceita, com tamanho e prioridade","atd:triar>backlog":"nova, com o registro",
 "epico:backlog>planejar":"linha especificação, opcional","hitl:backlog>planejar":"aceita: linha especificação","afk:backlog>planejar":"aceita: linha especificação","atd:backlog>planejar":"linha atendimento, até a reserva de capacidade",
 "planejar>item":"sprint gravada; puxa o topo",
 "item>moldar":"a-moldar → sa-refinar.moldar","moldar>gogk":"pitch de uma página","gogk>entrevistar":"investir: em-especificacao, sa-prd.prd","entrevistar>prd":"Decisões e Em aberto no prd.md","prd>gprd":"prd.md escrito e validado","gprd>fatiar":"Aprovado: sa-refinar.fatiar","fatiar>backlog":"FT-nnn aceita, pai EP-nn; épico fatiado",
 "item>detalhar":"aceita → sa-refinar.detalhar","detalhar>elm":"com ELM e artefatos afetados: sa-especificar.elm","detalhar>gficha":"sem elm/: a ficha basta","elm>gficha":"arquivos de elm/ aprovados","gficha>iniciar":"elegível: puxada com sinal de WIP",
 "iniciar>plano":"rápida ou completo: sa-plano.plano","plano>codificar":"plano aprovado: Fase implementando","codificar>autorrev":"tarefas marcadas, validar verde","autorrev>verif":"achados triados","verif>mr":"ACEITO: Lições aprendidas, as-built e MR",
 "iniciar>pl_a":"IA autopilot: subagente na worktree","iniciar>cod_a":"trivial: direto à codificação","pl_a>cod_a":"plano aprovado pelo subagente","cod_a>rev_a":"validar verde","rev_a>ver_a":"achados pela recomendação do revisor","ver_a>mr":"ACEITO: o subagente abre o MR",
 "mr>revmr":"um desenvolvedor ≠ autor","revmr>revhum":"o Risco pede: revisão humana","revhum>merge":"aprovado e CI verde","merge>archive":"concluida na branch base","archive>publicar":"com ELM: publicar no DOORS?",
 "item>atd1":"nova ou em-andamento → sa-atender.atender","atd1>atd2":"dentro da reserva de capacidade ou crítica","atd2>atd3":"em-andamento (<ID> iniciar)","atd3>atd4":"resolvido ou retirado","atd4>atd5":"concluida",
 "planejar>durante":"sprint-<nn>.md gravado","durante>inspecao":"todo dia","inspecao>review":"fim do timebox","review>retro":"Regras aprendidas gravadas","retro>virada":"o próximo sa-planejamento.sprint","virada>planejar":"migrados primeiro na capacidade"
};

const EXTRA=[
 /* desenhados no mapa */
 {id:"triv",f:"iniciar",t:"codificar",kind:"alt",lines:["hitl"],pts:[[700,310],[700,330],[870,330],[870,310]],rad:10,lp:[785,330],
  when:s=>s.tr==="trivial",why:"rápida e completo passam pelo plano",
  lab:"trivial: sem plano nem arquivo de spec, tudo no MR",short:"trivial: direto ao código"},
 {id:"licoes-aprendidas",f:"merge",t:"review",kind:"xfer",lines:["hitl","afk"],toLine:"sprint",
  lab:"as Lições aprendidas do status.md vão à curadoria da review do ciclo (Regras aprendidas)",short:"Lições aprendidas: curadoria na review"},
 /* aparecem com a linha e a estação escolhidas */
 {id:"g_fatia",f:"gogk",t:"detalhar",kind:"xfer",lines:["epico"],toLine:"hitl",tname:"Detalhar (fatia)",lab:"cabe em G: o épico fica cancelado com virou FT-nnn, e a fatia nasce aceita",short:"cabe em G: vira fatia"},
 {id:"prd_esc",f:"prd",t:"entrevistar",kind:"loop",lines:["epico"],bend:1,lab:"achado que é decisão de negócio: volta ao esclarecer",short:"decisão de negócio ↺"},
 {id:"gprd_rep",f:"gprd",t:"prd",kind:"loop",lines:["epico"],bend:1,lab:"ajuste pedido: volta ao escrever",short:"ajuste ↺"},
 {id:"prd_mud",f:"fatiar",t:"prd",kind:"loop",lines:["epico"],bend:1,lab:"conceito do PRD que muda: sa-prd.mudanca (versão nova em Mudanças e nova aprovação do produto)",short:"mudança do PRD ↺"},
 {id:"det_ep",f:"detalhar",t:"moldar",kind:"xfer",lines:["hitl","afk"],toLine:"epico",tname:"Moldar (épico)",lab:"mais que G sem corte: vira épico (EP-nn a-moldar; a FT fica cancelada · virou EP-nn)",short:"mais que G: vira épico"},
 {id:"det_aj",f:"detalhar",t:"backlog",kind:"loop",lines:["hitl","afk"],bend:-1,lab:"muitas regras: dividir pela sa-refinar.ajustar ('veio de FT-nnn')",short:"dividir ↺"},
 {id:"ficha_rep",f:"gficha",t:"detalhar",kind:"loop",lines:["hitl","afk"],bend:-1,lab:"DoR incompleta ou sem o sim do produto: fica aceita",short:"aceita ↺"},
 {id:"ini_det",f:"iniciar",t:"detalhar",kind:"loop",lines:["hitl","afk"],bend:-1,lab:"aceita, sem ficha elegível: mostra a DoR e oferece a sa-refinar.detalhar",short:"aceita: refinar ↺"},
 {id:"ini_ep",f:"iniciar",t:"moldar",kind:"xfer",lines:["hitl","afk"],toLine:"epico",tname:"Moldar (épico)",lab:"maior que G ao assumir: vira épico, sem branch",short:"maior que G: épico"},
 {id:"ini_fora",f:"iniciar",t:"durante",kind:"xfer",lines:["hitl","afk"],toLine:"sprint",tname:"Seleção (produto)",lab:"fora da sprint sem prioridade crítica: o reabastecimento é do P.O. (sa-planejamento.sprint)",short:"fora da sprint: reabastecer"},
 {id:"cod_rep",f:"codificar",t:"plano",kind:"loop",lines:["hitl"],bend:-1,lab:"desvio arquitetural ou texto novo aprovado: sa-plano.replanejar, que muda só o que mudou",short:"replanejar ↺"},
 {id:"rev_cod",f:"autorrev",t:"codificar",kind:"loop",lines:["hitl"],bend:-1,lab:"corrige: tarefas [R<n>]; volta-plano: sa-plano.replanejar",short:"corrige ↺"},
 {id:"ver_cod",f:"verif",t:"codificar",kind:"loop",lines:["hitl"],bend:-1,lab:"REJEITADO: o ❌ vira tarefa",short:"REJEITADO ↺"},
 {id:"reva_cod",f:"rev_a",t:"cod_a",kind:"loop",lines:["afk"],bend:1,lab:"reprovado: conta no disjuntor e volta à codificação",short:"reprovado ↺"},
 {id:"vera_cod",f:"ver_a",t:"cod_a",kind:"loop",lines:["afk"],bend:1,lab:"REJEITADO: conta no disjuntor e volta à codificação",short:"REJEITADO ↺"},
 {id:"disj",f:"ver_a",t:"iniciar",kind:"loop",lines:["afk"],bend:1,lab:"disjuntor: teto do acordos.md (tentativas · tempo · custo) ou 2 reprovações seguidas; grava Devolvido no loop-<id>.md e devolve à pessoa, que resolve e relança o autopilot",short:"disjuntor: devolve ↺"},
 {id:"mr_cod",f:"revmr",t:"codificar",kind:"loop",lines:["hitl"],bend:-1,lab:"pede mudanças: Fase retrabalho; o autor corrige no mesmo MR",short:"pede mudanças ↺"},
 {id:"mr_coda",f:"revmr",t:"cod_a",kind:"loop",lines:["afk"],bend:1,lab:"pede mudanças: Fase retrabalho; a correção sai no mesmo MR",short:"pede mudanças ↺"},
 {id:"mr_spec",f:"revmr",t:"elm",kind:"loop",lines:["hitl","afk"],bend:-1,lab:"volta-spec: o especificador decide (com ELM, ajusta o elm/); a sa-plano.replanejar recopia o texto para o delta",short:"volta-spec ↺"},
 {id:"uat_cod",f:"revhum",t:"codificar",kind:"loop",lines:["hitl"],bend:-1,lab:"❌ corrige: thread no MR, e o autor ajusta",short:"❌ corrige ↺"},
 {id:"merge_conf",f:"merge",t:"codificar",kind:"loop",lines:["hitl"],bend:1,lab:"conflito com a branch base: retrabalho, por merge da branch base (nunca rebase)",short:"conflito ↺"},
 {id:"atd_fora",f:"atd3",t:"triar",kind:"xfer",lines:["atd"],toLine:"hitl",tname:"Triagem",lab:"muda o código: vira bug ou fatia pelo cadastro, com origem <ID>",short:"muda o código: triagem"},
 {id:"atd_desd",f:"atd5",t:"triar",kind:"xfer",lines:["atd"],toLine:"hitl",tname:"Triagem",lab:"desdobramento: cadastro com origem <ID>, segue pela triagem",short:"desdobramento: triagem"},
 {id:"atd_folga",f:"atd1",t:"planejar",kind:"xfer",lines:["atd"],toLine:"sprint",tname:"Seleção (produto)",lab:"reserva de capacidade estourada: quem tem produto decide na seleção",short:"reserva de capacidade estourada: produto"},
 {id:"dur_ini",f:"durante",t:"iniciar",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Assumir (desenvolvedor)",lab:"puxa o topo com sinal de WIP: sa-desenvolver.iniciar",short:"puxa o topo"},
 {id:"insp_pub",f:"inspecao",t:"publicar",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Publicar (especificador)",lab:"Publicação: pendente: quem tem especificador roda a sa-elm.publicar",short:"publicação pendente"},
 {id:"rev_cap",f:"review",t:"triar",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Triagem",lab:"pedido novo na review: cadastro, depois a triagem",short:"pedido novo: cadastro"}
];

const SERV=[
 {sk:"sabia",nome:"Instalar e compilar",desc:"CLI: instalar, atualizar, toolkits e rota",papel:"quem instala o Sabiá na máquina",agente:"terminal (npx sabia)",tarefa:"—",
  faz:["npx sabia instalar: baixa o framework para ~/.sabia/framework/, detecta ou pergunta os alvos (Kiro, opencode) e compila as skills","Compilar (as-built): fluxo/ + template/ + skills/ viram uma skill por sa-*, com a tabela de cada fluxo e um arquivo por passo, em ~/.sabia/compilado/<alvo>/; os templates dos tipos moram na skill sabia (references/template/requisitos/)","Instala na pasta do usuário: no opencode, ~/.config/opencode/skills e os MCPs; no Kiro, o power (kiro-cli powers install). Nada vai para o projeto","sabia atualizar recompila, também quando só o compilador mudou; sabia desinstalar tira o Sabiá das ferramentas","sabia toolkits [instalar | atualizar | remover]: toolkits em ~/.sabia/toolkits/, pelo nome do índice ou por <url-git|pasta>[@ref][#subpasta]","sabia rota <arquivo> (ou <tasks.md>#<tarefa>): o passo com desvio de toolkit, o dono, o toolkit e as travas; --fluxo <skill.fluxo>: o fluxo resolvido no projeto (tabela, grafo ASCII e Mermaid); --mapa: as arestas entre fluxos"],
  arq:["~/.sabia/framework/ · ~/.sabia/compilado/<alvo>/ · ~/.sabia/toolkits/","~/.sabia/inventario.json · ~/.sabia/indices.json"],elm:["Registra os MCPs elm, gitlabpr e elk (uvx); --sem-mcp não registra"]},
 {sk:"sa-setup",nome:"Configurar o projeto",desc:"Configurar e customizar, na sessão sem agente",papel:"quem configura o projeto",agente:"sessão sem agente",tarefa:"—",
  faz:["Inicial, atualização ou aplicar os dados de uma sa-elm.setup; nada de agente: roda na sessão sem agente","sabia.md: ## Projeto e ## Comandos (roda cada comando uma vez; backpressure em camadas); o AGENTS.md do projeto, se houver, é só fonte","Git (a branch base aceita push), GitLab pelo MCP gitlabpr e banco só pela tool de consulta","formato_spec: Kiro com alvo Kiro; só opencode, pergunta Kiro ou OpenSpec","“usa ELM?”: com sim, chama a sa-elm.setup; no sabia.md, Especificação (REG com dados técnicos, Telas, Casos de uso), Sustentação e Verificação de aceite","Toolkits: desvios de passo e de tipo ligados aos agentes pelo papel; o gerador escreve os 5 agentes e os de toolkit","Template do MR, CODEOWNERS sugerido, .gitignore e .gitattributes (merge=union dos créditos)","Customizar: trocar, inserir ou remover um passo, ou trocar um template (o de um tipo, em .sabia/template/requisitos/template-<tipo>.md); “o que este projeto mudou?”; descustomizar"],
  arq:[".sabia/sabia.md (Projeto, Comandos; preserva as Regras aprendidas)",".sabia/config/agentes.json · .kiro/agents/sa-*.json · .opencode/agents/sa-*.md (gerados)",".sabia/fluxo/ · .sabia/template/ (só ao customizar)","backlog.md vazio, com as colunas"],
  elm:["sa-elm.setup: monta o pa_<nome>.json, pergunta pela ET as-built e devolve os dados que a sa-setup aplica","Com ELM, o glossário é o GL do DOORS"]},
 {sk:"sa-status",nome:"Onde parei",desc:"Painel, item, minha próxima, pendências, lições aprendidas",papel:"qualquer pessoa",agente:"sa-desenvolvedor ou sa-especificador",tarefa:"—",
  faz:["painel: a daily, só leitura, com a sugestão de maior alavanca","item: a porta de entrada de <id>, com a skill.fluxo dona e o “seguir agora?”","minha próxima: o trabalho da pessoa, crítica primeiro","pendências: lista fechada de rastreio e consistência, cada uma com destino; nenhuma trava","lições aprendidas: as do ciclo, cruzadas com as Regras aprendidas, para a review","fechar a sessão: Retomar, tasks.md, horas a pedido, créditos do Kiro e o commit com ok"],
  arq:[".sabia/creditos/<usuario>.csv: sessao · ate · item · skill · modo · creditos"],elm:["Horas só com ELM e só com o sim (sa-elm.horas)"]},
 {sk:"sa-elm",nome:"ELM utilitário",desc:"DOORS e EWM, sempre por oferta",papel:"quem trabalha no item",agente:"sa-desenvolvedor ou sa-especificador; o setup, na sessão sem agente",tarefa:"DEV · ESP · ATD",
  faz:["Só com ELM configurado; as outras skills oferecem e nunca param por causa dele; no autopilot, não roda","item: o IB [<id>] <título> e a tarefa [DEV|ESP|ATD] <id> <título>, ao assumir; os ids na coluna ib e em Tarefas","horas: só por pergunta ou pedido (“8 h hoje na DEV 123”); relatório da semana ou do ciclo a pedido","finalizar: conclui a tarefa, liga a DEV aos artefatos afetados e oferece concluir o IB; cancela o que o Sabiá cancelou","publicar: depois do merge, por quem tem especificador","baixar e visualizar: o bundle e o original de um requisito; explorar.html offline","conferir (“confere com o EWM”, “o DOORS mudou?”), importar-backlog, iteracao e lint, a pedido","Toda escrita com prévia e um sim; nada se apaga: o que deixou de valer é cancelado"],
  arq:["bundle (chave elm.bundle do agentes.json, ex.: docs/elm/<pa>/) · sync.md · explorar.html",".sabia/config/elm/pa_<nome>.json"],elm:["MCP elm; busca do vigente: specs arquivadas → bundle → ELM ao vivo"]}
];

const ROLES=[
 {nome:"Produto",who:"booleana produto no equipe.json (o P.O.)",tarefa:"aprova no documento",c:"--navy",agente:"sa-especificador",st:"gogk",line:"epico",
  faz:["Decisão de investimento do épico sobre o pitch","Aprova o PRD e a ficha: Aprovado: <usuário> · <data> no topo","Ordena o backlog (a ordem das linhas é a prioridade) e ajusta até alguém puxar","Decide a seleção da sprint, a virada e a reserva de capacidade estourada"]},
 {nome:"Especificador",who:"booleana especificador",tarefa:"ESP",c:"--teal",agente:"sa-especificador",st:"elm",line:"hitl",
  faz:["Conduz o refinamento com o Dev: ficha, CT-nn e artefatos afetados","Escreve o PRD do épico e propõe as fatias","Com ELM, monta e aprova os arquivos de elm/ (status: stable e verified)","Publica no DOORS depois do merge (sa-elm.publicar)"]},
 {nome:"Desenvolvedor",who:"booleana desenvolvedor",tarefa:"DEV",c:"--blue",agente:"sa-desenvolvedor",st:"iniciar",line:"hitl",
  faz:["Puxa com sinal de WIP e escolhe tamanho, trilha e autonomia","Plano, TDD, revisão e verificação do agente, em subagente, e o MR","Revisa o MR de outro autor","Merge do próprio MR, com a aprovação e o CI verde"]},
 {nome:"Revisor do MR",who:"um desenvolvedor que não é o autor; o CODEOWNERS indica o dono",tarefa:"MR",c:"--cyan",agente:"sa-desenvolvedor",st:"revmr",line:"hitl",
  faz:["Lê o MR de verdade, com os critérios de revisão C do sa-revisor como apoio","Tria cada achado: corrige · adia · volta-plano · volta-spec · descarta","Aprova sem BLOQUEANTE aberto, ou pede mudanças","Oferece a revisão humana quando o risco pede"]},
 {nome:"Qualquer pessoa",who:"sem booleana",tarefa:"—",c:"--green",agente:"sa-desenvolvedor ou sa-especificador",st:"triar",line:"hitl",
  faz:["Cadastro e triagem","Revisão humana, quando o risco pede","Atende a Sustentação dentro da reserva de capacidade e declara resolvido","Consulta o painel e a porta do item"]},
 {nome:"Subagentes",who:"contexto isolado, só leitura",tarefa:"—",c:"--orange",agente:"sa-pesquisador · sa-revisor · sa-verificador",st:"autorrev",line:"hitl",
  faz:["sa-pesquisador: fatos com arquivo:linha, sem gravar","sa-revisor: critérios de revisão L do plano e C do código (spec · padrões · segurança)","sa-verificador: sobe a aplicação, exercita os CT-nn e grava só o CT.csv","Gerador ≠ avaliador: quem implementou não verifica"]}
];

const AGENTS=[
 {id:"sa-desenvolvedor",quem:"quem desenvolve e quem atende; também o autopilot, como subagente",skills:["desenvolver","plano","revisar","verificar","atender","especificar","triar","status","sabia","elm"],sub:"pesquisador · revisor · verificador · desenvolvedor (autopilot)",push:"pergunta",pk:"ask",
  obs:"Principal, permissão build. Desenvolvimento, plano, MR, revisão do MR de outro autor, revisão humana, Sustentação e archive. No autopilot, na worktree: push da própria branch, merge da branch base nela e o MR dela liberados; merge do MR, ELM e rede bloqueados. Recebe o desvio de toolkit da sa-desenvolver.codificar.tarefa e o tipo ET"},
 {id:"sa-especificador",quem:"quem especifica e quem tem produto",skills:["refinar","prd","especificar","entrevistar","planejamento","triar","status","sabia","elm"],sub:"pesquisador · revisor · verificador · especificador",push:"pergunta",pk:"ask",
  obs:"Principal, permissão build. Refinamento, PRD, especificação, entrevista e planejamento; inclui as funções de produto. Recebe as skills de toolkit dos tipos desviáveis da especificação (HF, UC, REG, MSG, EL) e da ATA"},
 {id:"sa-pesquisador",quem:"subagente de quem planeja, especifica, fatia ou atende",skills:["pesquisar"],sub:"—",push:"não faz",pk:"no",
  obs:"Só leitura. Devolve fatos com arquivo:linha, em até ~150 linhas; quem grava o research.md é a sa-plano"},
 {id:"sa-revisor",quem:"subagente: revisão do agente e apoio à revisão do MR",skills:["revisar"],sub:"—",push:"não faz",pk:"no",
  obs:"Só leitura. Critérios de revisão L (plano) e C (código: spec · padrões · segurança), mais os critérios de revisão do toolkit e as Regras aprendidas; devolve o relatório sem gravar"},
 {id:"sa-verificador",quem:"subagente da verificação do agente",skills:["verificar"],sub:"—",push:"não faz",pk:"no",
  obs:"Só leitura, mais o Executar do sabia.md, curl na URL de teste e a escrita do CT.csv. Nunca produção nem a branch base. Recebe o texto de verificação do toolkit e o desvio do tipo CT"}
];

const TREE=[
 {f:"AGENTS.md",b:"git",w:"o projeto; o Sabiá não escreve nele",q:"na configuração, como fonte",o:"Do projeto, se houver: mostra que o projeto já tem IA configurada e vale como steering de base. A sa-setup o lê como fonte do Projeto e dos Comandos do .sabia/sabia.md.",st:"codificar",line:"hitl"},
 {d:".sabia/",open:true,c:[
  {f:"sabia.md",b:"gen",w:"sa-setup; as Regras aprendidas, a curadoria da review",q:"sempre carregado (steering do Kiro e instructions do opencode.json)",o:"Resumo do fluxo · Especificação · Verificação de aceite · Sustentação · ELM · Desvios de toolkit · Tipos com skill de toolkit · Regras aprendidas (regra · origem FT/AT · data). A setup refaz o arquivo e preserva as Regras aprendidas.",st:"review",line:"sprint"},
  {d:"config/",c:[{f:"agentes.json",b:"gen",w:"sa-setup",q:"ao configurar ou atualizar os agentes",o:"As escolhas do projeto e a entrada do gerador: alvos, versão do Sabiá, formato_spec, pasta do produto, branch_base, prefixo da branch, glossário, ADRs, elm, toolkits, passos e, por agente, modelo, MCPs, skills extras e subagentes."},
   {f:"elm/pa_<nome>.json",b:"gen",w:"sa-elm.setup, aplicado pela sa-setup",q:"só com ELM",o:"A configuração do ELM do projeto, lida pelo mcp-elm; conferida contra o schema antes de gravar."}]},
  {d:"fluxo/  (só ao customizar)",c:[{f:"<skill>/<fluxo>/passos/<passo>.md",b:"gen",w:"sa-setup.customizar (sessão sem agente; nenhum agente escreve)",q:"trocar ou inserir um passo",o:"O passo que o projeto trocou (com a branch base: o sha do original) ou inseriu. O agente que roda a skill recebe só o delta no prompt."},{f:"<skill>/<fluxo>/<fluxo>.md",b:"gen",w:"sa-setup.customizar",q:"inserir ou remover um passo",o:"Só as operações: inserir (id, depois) e remover. Passo com trava não sai."}]},
  {d:"template/  (só ao customizar)",c:[{f:"<skill>/<nome>.md",b:"gen",w:"sa-setup.customizar",q:"trocar um template",o:"O template trocado neste projeto (ficha, pitch, PRD, status.md…); vale para todos os agentes."},
   {f:"requisitos/template-<tipo>.md",b:"gen",w:"sa-setup.customizar",q:"trocar o template de um tipo",o:"HF, UC, REG, MSG, EL, GL, ET, CT ou ATA. A cópia vale sobre o template em vigor do tipo: o do Sabiá ou o do toolkit que desvia o tipo (a branch base é o sha do template copiado).",st:"elm",line:"hitl"}]},
  {f:"glossario.md",b:"git",w:"sa-entrevistar (termo novo)",q:"opcional, só sem GL do DOORS",o:"Com ELM, o glossário é o GL do DOORS e este arquivo não existe.",st:"entrevistar",line:"epico"},
  {d:"creditos/",c:[{f:"<usuario>.csv",b:"git",w:"sa-status.fechar-sessao (creditos.py)",q:"ao fechar a sessão, no Kiro",o:"Uma linha por sessão: sessao · ate · item · skill · modo · creditos; merge=union no .gitattributes.",st:"inspecao",line:"sprint"}]},
  {d:"planejamento/  (pasta do produto)",open:true,c:[
   {f:"backlog.md",b:"git",w:"quem muda o status: sa-triar · sa-refinar · sa-desenvolver · sa-atender · sa-planejamento (virada)",q:"a cada cadastro, triagem, refinamento, atribuição e conclusão",o:"Uma linha por item: id · título · tipo · status · prioridade · tamanho · responsável · pai · relator · ib · obs · aceita_em · iniciada_em · concluida_em. A ordem das linhas é a prioridade. Commit pequeno direto na branch base.",st:"backlog",line:"hitl"},
   {f:"equipe.json",b:"git",w:"sa-planejamento.inicial",q:"ao formar o time e ao rever",o:"Membros com usuario do GitLab (autor do MR, @dono no CODEOWNERS), as booleanas desenvolvedor · especificador · produto, horas, ausências e ativo; elm_login é opcional. A pessoa nunca é apagada: ativo: false.",st:"planejar",line:"sprint"},
   {f:"acordos.md",b:"git",w:"sa-planejamento.inicial; ajusta a retrospectiva",q:"no começo e a cada retrospectiva",o:"Timebox, WIP por status, SLE opcional, DoD, classes de serviço (crítica = urgente), reserva de capacidade, tamanhos, disjuntor do autopilot, id no commit e CT no teste.",st:"retro",line:"sprint"},
   {f:"roadmap.md",b:"git",w:"sa-planejamento.inicial",q:"opcional",o:"Releases com objetivo, épicos em ordem de valor e risco e a previsão pela vazão.",st:"planejar",line:"sprint"},
   {d:"sprints/2026/",c:[{f:"sprint-03.md",b:"git",w:"sa-planejamento.sprint; a linha que falta, a skill que puxa",q:"no planejamento, na puxada, na review e na retro",o:"Cabeçalho com a chave 2026/Sprint 03 e as datas, a meta e a reserva de capacidade; Itens: Item · Trabalho (especificação | desenvolvimento | atendimento) · Responsável · Tarefas (DEV · ESP · ATD); ## Review e ## Retro. Sem situação própria: o andamento é o status do backlog.md.",st:"planejar",line:"sprint"}]},
   {d:"epicos/EP-04-<slug>/",c:[{f:"pitch.md",b:"git",w:"sa-refinar.moldar",q:"no shaping",o:"Uma página: problema · limite de investimento · esboço da solução · riscos · fora do escopo · decisão de investimento · Decisões. Ao investir ou ao cancelar, **Aprovado:** <usuario> · <data> no topo; ao cancelar, a pasta fica.",st:"moldar",line:"epico"},
    {f:"prd.md",b:"git",w:"sa-prd.prd · sa-prd.mudanca",q:"a partir da decisão de investir",o:"Objetivos · métricas · requisitos com id (um bloco por requisito, com Tipo e Ação) · fora do escopo · Decisões · Em aberto · Mudanças. Aprovado pelo produto no topo.",st:"prd",line:"epico"}]},
   {d:"fatias/",c:[{f:"FT-031-<slug>.md",b:"git",w:"cadastro cria; sa-refinar.fatiar e sa-refinar.detalhar completam",q:"no cadastro, no fatiamento e no refinamento",o:"A ficha: Aprovado no topo; Tipo · Pai · Especificação; Entrada · Objetivo · Regras · Cenários (CT-nn) · Não muda · Artefatos afetados (<sigla>-<id> · inclui | altera | exclui · versão de referência) · Em aberto · Decisões · DoR.",st:"detalhar",line:"hitl"}]},
   {d:"prototipos/",c:[{f:"<id>-<slug>/v<N>/",b:"git",w:"sa-especificar.prototipo",q:"dúvida de tela, a pedido",o:"As versões do protótipo, só com dado fictício; a aprovação do cliente é um D-nn com quem, data, versão e evidência.",st:"entrevistar",line:"epico"}]},
   {d:"atas/",c:[{f:"ATA-<nn>-<AAAA-MM-DD>-<assunto>.md",b:"git",w:"sa-especificar.reuniao",q:"opcional, depois de uma reunião",o:"A ATA aprovada por quem conduziu, escrita só do que a transcrição diz; as decisões vão às Decisões do documento do item.",st:"entrevistar",line:"epico"}]},
   {d:"sustentacao/",c:[{f:"AT-012-<slug>.md",b:"git",w:"cadastro cria; sa-atender completa",q:"por item de Sustentação",o:"O registro: Categoria · Origem · Pedido por · Prazo · Responsável; Pedido, Atividade, Resposta, Horas e Lições aprendidas. Sem dado de cliente.",st:"atd3",line:"atd"}]}
  ]},
  {d:"local/  (fora do git)",c:[
   {f:"wt/<id>/",b:"local",w:"sa-desenvolver.iniciar (IA autopilot)",q:"um por item no autopilot",o:"A worktree do autopilot; o encerrar a remove sem --force.",st:"iniciar",line:"afk"},
   {f:"loop-<id>.md",b:"local",w:"o autopilot (disjuntor)",q:"a cada etapa do autopilot",o:"Tentativas, tempo, custo e reprovações; no teto, a linha Devolvido com o motivo.",st:"ver_a",line:"afk"},
   {f:"reunioes/",b:"local",w:"quem conduziu a reunião",q:"antes da ATA",o:"A transcrição (.vtt ou .md) e o rascunho da ATA; nunca vão para o git.",st:"entrevistar",line:"epico"},
   {f:"sustentacao/<ID>/",b:"local",w:"sa-atender",q:"quando há dado real",o:"Dado de cliente: extrações, telas, planilhas. Nunca vai para o git.",st:"atd3",line:"atd"}
  ]}
 ]},
 {d:".kiro/",open:true,c:[
  {d:"specs/ft-031-<slug>/  (formato Kiro)",open:true,c:[
   {f:"status.md · .config.kiro",b:"git",w:"sa-desenvolver.iniciar cria; quem conduz a fase grava",q:"rápida e completo",o:"Rota · Autonomia · Fase (— · implementando · revisando · verificando · pr-aberto · retrabalho) · MR · Publicação; Desvios, Em aberto, Lições aprendidas e Retomar. A trivial não tem.",st:"iniciar",line:"hitl"},
   {f:"research.md",b:"git",w:"sa-plano (fatos do sa-pesquisador)",q:"no plano",o:"Fatos com arquivo:linha, em até ~150 linhas.",st:"plano",line:"hitl"},
   {f:"requirements.md · bugfix.md · design.md · tasks.md",b:"git",w:"sa-plano · sa-plano.replanejar",q:"rápida e completo",o:"O delta com o texto completo de cada requisito tocado, copiado sem reescrever; o design (as-built onde há ET: Components and Interfaces · Data Models · Decisões técnicas) e as tarefas.",st:"plano",line:"hitl"},
   {f:"CT.csv",b:"git",w:"só a sa-verificar.verificar",q:"rápida e completo",o:"Tipo;Resumo;Responsável;Descrição, uma linha por cenário ✅, ligada ao CT-nn da ficha e da spec, que é a marca do teste automatizado.",st:"verif",line:"hitl"},
   {f:"elm/<id>-<TIPO>-<slug>.md",b:"git",w:"sa-especificar.elm (aprova quem tem especificador)",q:"só com ELM e artefatos afetados",o:"Um arquivo inteiro por artefato afetado, com frontmatter type · title · status · sources; o corpo pelo template do tipo. Fonte da publicação no DOORS.",st:"elm",line:"hitl"}]},
  {d:"agents/",c:[{f:"sa-*.json",b:"gen",w:"gerador da sa-setup",q:"“regenerar os agentes”",o:"Os 5 agentes no formato do motor v3, só com nomes de capability, mais os de toolkit."}]},
  {d:"steering/",c:[{f:"sabia.md",b:"gen",w:"sa-setup",q:"sempre carregado",o:"Ponteiro para o .sabia/sabia.md."}]}
 ]},
 {d:"openspec/changes/  (formato OpenSpec)",c:[
  {f:"ft-031-<slug>/",b:"git",w:"sa-plano · sa-desenvolver · sa-verificar · sa-especificar.elm",q:"rápida e completo",o:"proposal.md, o delta em specs/<cap>/spec.md (ADDED · MODIFIED · REMOVED), design.md no completo, tasks.md, research.md, status.md, CT.csv e, com ELM, elm/.",st:"plano",line:"hitl"},
  {f:"archive/<AAAA-MM-DD>-ft-031-<slug>/",b:"git",w:"sa-especificar.archive",q:"depois do merge",o:"A spec arquivada; sem ELM, o delta se funde em openspec/specs/.",st:"archive",line:"hitl"}]},
 {d:".opencode/",c:[{d:"agents/",c:[{f:"sa-*.md",b:"gen",w:"gerador da sa-setup",q:"“regenerar os agentes”",o:"Os mesmos 5 agentes, com mode primary (sa-desenvolvedor, sa-especificador) ou subagent e permission."}]}]},
 {d:"docs/",c:[{f:"adr/NNNN-<titulo>.md",b:"git",w:"sa-desenvolver.codificar (no MR)",q:"só decisão que atravessa fatias",o:"Formato Nygard: Status · Context · Decision · Consequences · Origem FT-nnn.",st:"mr",line:"hitl"},
  {f:"elm/<pa>/",b:"git",w:"sa-elm.baixar",q:"só com ELM",o:"O bundle: cópia local do DOORS, consultada pelo MCP e nunca editada; o explorar.html fica fora do git.",st:"detalhar",line:"hitl"}]},
 {d:".gitlab/",c:[{f:"merge_request_templates/Default.md",b:"gen",w:"sa-setup",q:"se não existir",o:"O template do MR: O quê · Porquê · Evidência · Risco · Foco · Artefatos afetados.",st:"mr",line:"hitl"}]}
];

const GATES=[
 {n:"Decisão de investimento",q:"produto",o:"O pitch de uma página: problema, limite de investimento, esboço da solução, riscos e fora do escopo. Investir: em-especificacao e o PRD. Cancelar: cancelado, e a pasta fica. Cabe em G: vira fatia.",st:"gogk",line:"epico"},
 {n:"PRD",q:"produto",o:"O prd.md com os requisitos, cada um com tipo, ação e id. O Em aberto bloqueia só o que depende dele. Aprovado, segue para o fatiamento.",st:"gprd",line:"epico"},
 {n:"Protótipo",q:"cliente",o:"A versão vN, só com dado fictício, vale aprovada pelo cliente num D-nn com quem, data, versão e evidência (ATA ou e-mail); nunca deduzida nem dada por quem especifica.",st:"entrevistar",line:"epico"},
 {n:"ATA",q:"quem conduziu a reunião",o:"Escrita só do que a transcrição diz; aprovada, ganha o número, vai para atas/, e as decisões entram nas Decisões do documento com a fonte.",st:"entrevistar",line:"epico"},
 {n:"Arquivos de elm/",q:"especificador",o:"Cada artefato afetado, arquivo inteiro, contra o commit de referência e pelo checklist do template do tipo. Aprovado: status: stable com verified. Editado depois, volta a draft.",st:"elm",line:"hitl"},
 {n:"Ficha",q:"produto",o:"Regras, cenários CT-nn e artefatos afetados, com a DoR do template. Aprovada e com a DoR completa, a fatia fica elegível. Bug sem artefatos afetados dispensa a aprovação.",st:"gficha",line:"hitl"},
 {n:"MR",q:"um desenvolvedor ≠ autor",o:"O código lido por uma pessoa, com a Evidência (CI, revisão do agente e 🔎) e os artefatos afetados; sem BLOQUEANTE aberto, aprova. O merge é do autor, com a aprovação e o CI verde; o autopilot nunca faz merge.",st:"revmr",line:"hitl"},
 {n:"Revisão humana",q:"qualquer pessoa, por risco",o:"Só quando o risco pede: os CT-nn escolhidos, exercitados pela pessoa sobre a branch do MR, com o 🔎 no MR.",st:"revhum",line:"hitl"}
];

const PHASES={
 hitl:[
  {f:"elegivel",sub:"ficha aprovada, DoR completa",st:"gficha"},
  {f:"em-andamento",sub:"atribuição na branch base, branch <id>",st:"iniciar"},
  {f:"—",sub:"plano (rápida e completo)",st:"plano",skip:c=>c.tr==="trivial"?"trivial: sem plano":null},
  {f:"implementando",sub:"TDD e backpressure",st:"codificar"},
  {f:"revisando",sub:"revisão do agente (sa-revisor)",st:"autorrev"},
  {f:"verificando",sub:"verificação do agente (sa-verificador)",st:"verif"},
  {f:"pr-aberto",sub:"MR; em-revisao é derivado",st:"mr"},
  {f:"concluida",sub:"merge pelo autor",st:"merge"}],
 afk:[
  {f:"elegivel",sub:"ficha aprovada, DoR completa",st:"gficha"},
  {f:"em-andamento",sub:"atribuição; worktree .sabia/local/wt/<id>",st:"iniciar"},
  {f:"—",sub:"plano no subagente",st:"pl_a",skip:c=>c.tr==="trivial"?"trivial: sem plano":null},
  {f:"implementando",sub:"TDD na worktree",st:"cod_a"},
  {f:"revisando",sub:"revisão do agente (sa-revisor)",st:"rev_a"},
  {f:"verificando",sub:"verificação do agente (sa-verificador)",st:"ver_a"},
  {f:"pr-aberto",sub:"MR aberto pelo subagente",st:"mr"},
  {f:"concluida",sub:"merge pelo autor",st:"merge"}]
};
const PHNOTE=c=>{
 const autonomia=c.mode==="afk"?"No IA autopilot, o sa-desenvolvedor roda como subagente na worktree até o MR; o disjuntor devolve o item à pessoa no teto do acordos.md ou em 2 reprovações seguidas. ":"Na IA supervisionada, o sa-desenvolvedor trabalha na sessão da pessoa; no manual, só a geração do código-fonte é dela, e no “terminei” o fluxo segue do validar. ";
 const tr=c.tr==="trivial"?"Na trilha trivial não há status.md: o estado fica no MR e no último commit. ":"";
 return autonomia+tr+"retrabalho: MR com thread aberta, CI vermelho ou conflito volta à codificação, no mesmo MR. A situação fica no backlog.md (elegível, em-andamento, concluida); a Fase, no status.md da pasta da spec. em-revisao não se grava: vem do MR aberto.";
};

const STATUSES=`
<div class="stbox"><h3>Épico</h3><div class="flowr"><span>a-moldar</span><em>→</em><span>em-especificacao</span><em>→</em><span>fatiado</span><em>→</em><span>concluido</span></div><p>Nasce <code>a-moldar</code> no cadastro. O investir do produto o leva a <code>em-especificacao</code>, com o PRD; o fatiamento, a <code>fatiado</code>. Fecha no merge da última fatia aberta (<code>sa-desenvolver.encerrar</code>). Desvio: <code>cancelado</code> (cancelar, ou cabe em G e virou fatia).</p></div>
<div class="stbox"><h3>Fatia e bug</h3><div class="flowr"><span>nova</span><em>→</em><span>aceita</span><em>→</em><span>elegivel</span><em>→</em><span>em-andamento</span><em>→</em><span>concluida</span></div><p>Nova no cadastro, aceita na triagem, elegível no refinamento (ficha aprovada e DoR completa), em-andamento na atribuição, concluída no merge. <code>em-revisao</code> não se grava: vem do MR aberto. Desvios: <code>cancelada</code> e <code>adiada até &lt;data&gt;</code>. Na virada, o item que não migra volta de <code>em-andamento</code> a <code>elegivel</code>.</p></div>
<div class="stbox"><h3>Fase do status.md</h3><div class="flowr"><span>—</span><em>→</em><span>implementando</span><em>→</em><span>revisando</span><em>→</em><span>verificando</span><em>→</em><span>pr-aberto</span></div><p>Só em rápida e completo. <code>—</code> até o plano ser aprovado; <code>retrabalho</code> quando o MR tem thread aberta, CI vermelho ou conflito. Com ELM, a linha <code>Publicação</code> vai de <code>pendente</code> a <code>publicada &lt;data&gt;</code> depois do merge.</p></div>
<div class="stbox"><h3>Sustentação</h3><div class="flowr"><span>nova</span><em>→</em><span>em-andamento</span><em>→</em><span>concluida</span></div><p><code>nova</code> ao ser registrada, <code>em-andamento</code> ao assumir, <code>concluida</code> quando a pessoa que atende declara resolvido. Desvio: <code>cancelada</code>, também quando a categoria estava errada (virou outro id).</p></div>`;

const ELM_HTML=`
<div class="elm3">
 <div class="sys" style="--c:var(--navy)"><h3>DOORS Next</h3><p class="sub">requisitos · publicados depois do merge</p><ul><li>História de usuário (HF), Caso de uso (UC, com Casos de uso = <code>sim</code>), Regra (REG, embutida na HF), Mensagem (MSG), Especificação de layout (EL, com Telas = <code>sim</code>), Termo de glossário (GL) e a ET as-built, onde o projeto mantém ET</li><li>A fonte é a pasta <code>elm/</code> da fatia: um arquivo inteiro por artefato afetado, aprovado por quem tem <code>especificador</code> (<code>status: stable</code> com <code>verified</code>)</li><li>A <code>sa-elm.publicar</code> confere a versão de referência de cada altera e exclui (mudou → avisa e pula), sobe só o corpo, na ordem MSG · GL · REG · UC · EL · HF · ET, e troca o id provisório pelo do ELM num commit</li><li>Os requisitos publicados ficam ligados à tarefa DEV (<b>implementa</b>); a ATA do item sobe junto, se a pessoa quiser</li><li>O excluído vai à lixeira por roteiro manual</li><li>Bundle local pela <code>sa-elm.baixar</code>, consultado só pelo MCP</li></ul></div>
 <div class="sys" style="--c:var(--blue)"><h3>EWM</h3><p class="sub">trabalho · só por oferta, nunca trava</p><ul><li>Ao assumir um trabalho: “quer criar o item no ELM?” → o IB <code>[&lt;id&gt;] &lt;título&gt;</code> e a tarefa <code>[DEV|ESP|ATD] &lt;id&gt; &lt;título&gt;</code>, com a pessoa como dona</li><li>O número do IB fica na coluna <code>ib</code> do <code>backlog.md</code>; a tarefa, na coluna Tarefas do <code>sprint-&lt;nn&gt;.md</code></li><li>Horas só por pergunta ou pedido; o relatório, a pedido</li><li>Ao concluir: “finalizar a tarefa?” conclui, liga a DEV aos artefatos afetados e oferece concluir o IB e o do épico</li><li>Iteração <code>&lt;pai&gt;/Sprint &lt;nn&gt;</code> só a pedido; na virada, a tarefa do item que saiu é cancelada e o IB fica</li><li>Nada se apaga: o que deixou de valer é cancelado</li></ul></div>
 <div class="sys" style="--c:var(--green)"><h3>Sem ELM</h3><p class="sub">nenhuma oferta aparece</p><ul><li>A especificação vigente fica no repositório: no OpenSpec, o archive funde o delta em <code>openspec/specs/</code>; no Kiro, o vigente são as specs em <code>.kiro/specs/</code></li><li>O delta sempre traz o texto completo dos requisitos tocados, com ou sem ELM</li><li>O id <code>&lt;sigla&gt;-&lt;EP|FT&gt;-nn</code> é definitivo</li><li>Os casos de teste ficam no <code>CT.csv</code> da fatia, ligados ao <code>CT-nn</code> marcado no teste automatizado</li></ul></div>
</div>
<div class="ewmtree" aria-label="Hierarquia de work items no EWM"><span class="m">EWM · só o que a pessoa aceitou criar</span>
<span class="c1">IB [EP-04] …</span>                                         <span class="m">o épico · o número na coluna ib</span>
├─ [ESP] EP-04 …                                     <span class="m">PRD · ao assumir, a pedido</span>
└─ <span class="c2">IB [FT-031] …</span>                                     <span class="m">fatia do épico · nasce filho do IB do épico</span>
   ├─ [ESP] FT-031 …                                 <span class="m">texto do elm/ · quem especifica</span>
   └─ [DEV] FT-031 …                                 <span class="m">quem desenvolve · liga aos requisitos publicados</span>
<span class="c2">IB [FT-040] …</span>                                        <span class="m">fatia ou bug sem épico</span>
└─ [DEV] FT-040 …
<span class="c3">IB [AT-012] …</span>                                        <span class="m">Sustentação, qualquer das seis categorias</span>
└─ [ATD] AT-012 …                                    <span class="m">quem atende</span></div>
<div class="scroll"><table><thead><tr><th>Tarefa</th><th>Pai</th><th>Quem</th><th>Nasce</th><th>Conclui</th></tr></thead><tbody>
 <tr><td><span class="tag t">ESP</span></td><td>IB do épico ou da fatia</td><td>quem especifica</td><td>ao assumir o PRD ou o texto do <code>elm/</code>, com o sim</td><td>ao concluir o trabalho, com o sim</td></tr>
 <tr><td><span class="tag t">DEV</span></td><td>IB da fatia ou do bug</td><td>quem desenvolve</td><td>ao assumir (<code>sa-desenvolver.iniciar</code>), com o sim</td><td>no encerrar, depois do merge</td></tr>
 <tr><td><span class="tag t">ATD</span></td><td>IB do item de Sustentação</td><td>quem atende</td><td>ao assumir (<code>sa-atender.atender</code>), com o sim</td><td>quando a pessoa declara resolvido</td></tr>
</tbody></table></div>
<p style="font-size:13px;margin-top:10px"><b style="color:var(--title)">ELM utilitário.</b> Tudo o que fala com o ELM é da <code>sa-elm</code>; as outras skills só oferecem, e a resposta nunca para o fluxo. No autopilot, o MCP <code>elm</code> é negado: o que ficou do ELM volta no resumo e é perguntado quando a pessoa retoma. Lançar horas é uma ajuda, não uma obrigação.</p>`;

const MODOS=`
<div data-line="hitl"><b>IA supervisionada</b><div class="m"><span class="pill">na sessão da pessoa</span><span class="pill">a pessoa tria</span></div><p>O sa-desenvolvedor trabalha na sessão; quem desenvolve aprova o plano e tria os achados da revisão e da verificação do agente.</p></div>
<div data-line="afk"><b>IA autopilot</b><div class="m"><span class="pill">subagente na worktree</span><span class="pill">disjuntor</span></div><p>O sa-desenvolvedor roda em .sabia/local/wt/&lt;id&gt; até o MR, e a pessoa segue na branch base. O MR passa pela mesma revisão humana.</p></div>
<div data-line="hitl"><b>Manual</b><div class="m"><span class="pill">só o código-fonte</span><span class="pill">“terminei”</span></div><p>Status.md, branch e plano seguem como sempre; no “terminei”, o fluxo continua do validar, com as mesmas validações.</p></div>`;

const GOLDEN=`
<div><b>Alinhar antes de escrever</b>Até 5 perguntas por rodada, cada uma com recomendação. Fatos o agente busca; regra de negócio é decisão de uma pessoa.</div>
<div><b>Gerador ≠ avaliador</b>Revisão e verificação do agente em subagentes de contexto isolado, e o MR aprovado por um desenvolvedor que não é o autor.</div>
<div><b>Verificação acima de geração</b>TDD, backpressure em camadas e o teste automatizado marcado com o CT-nn.</div>
<div><b>Estado em disco</b>O status.md, o research.md e o plano carregam o fio; o estado vai à branch base num commit pequeno.</div>
<div><b>Autonomia gradual</b>Por item, escolhida por quem desenvolve, com disjuntor; o merge é sempre de uma pessoa.</div>
<div><b>Rastreio leve</b>Os artefatos afetados na ficha e o texto completo no delta; com ELM, o elm/ da fatia publica no DOORS depois do merge.</div>`;

const INTRO=`<div class="ph"><h3>Escolha uma linha</h3><div class="sk">ou clique numa estação do mapa</div></div>
<div class="pb fade"><p style="font-size:14px">Cada linha é um caminho pelos fluxos do Sabiá. Ao escolher uma, o mapa acende o caminho dela e a ficha mostra o itinerário, passo a passo, com as transições. Use ▶ para o trem percorrer a linha.</p>
<div class="trans">${Object.keys(LINES).map(k=>`<button class="tr" data-line-pick="${k}" style="--tc:var(${LINES[k].c})${k==="sprint"?";color:var(--navy)":""}"><span class="ico">→</span><b>${LINES[k].nome}</b><span>${LINES[k].sub}</span></button>`).join("")}</div>
<p style="font-size:13px;margin-top:10px">Na fatia, a trilha (trivial · rápida · completo) e os artefatos do ELM mudam o itinerário.</p></div>`;

window.SABIA={LINES,ROTAS,ROTA0,AVISO,ROUTES,TEXTS,DECOR,S,ALL,SKIP,VIA,EXTRA,SERV,ROLES,AGENTS,TREE,GATES,PHASES,PHNOTE,STATUSES,ELM_HTML,MODOS,GOLDEN,INTRO};
})();
