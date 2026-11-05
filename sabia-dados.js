
/* dados do mapa, tirados dos fluxos do Sabiá 2.0 (fluxo/ e padrao/ do repositório) */
(function(){
"use strict";
const LINES={
 epico:{nome:"Épico",c:"--l-epico",sub:"entrevista → PRD → fatias",
  quando:"Funcionalidade com várias histórias ou decisão de produto em aberto. O épico entra numa sprint para ser especificado: a [ESP] nasce no planejamento. O Especificador conduz a entrevista, as atas de reunião, o protótipo (projeto com tela) e o PRD, e aprova no GATE do PRD. O PRD vai para a base e a [ESP] termina com a publicação no ELM. Logo em seguida, o P.O. ou o SM fatia; as fatias aprovadas no GATE do backlog ficam no backlog, de onde seguem pelas linhas da fatia."},
 hitl:{nome:"Fatia · HITL",c:"--l-hitl",sub:"pessoas nos papéis",
  quando:"O Dev implementa e abre o PR depois da revisão automática do desenvolvedor. Um Dev Sênior revisa o PR ([REV]), outra pessoa verifica ([VER]) e o Dev faz o merge. Vale para a trilha padrão e para a rápida.",
  sen:{jr:"Sempre HITL.",pl:"HITL ou AFK pelos critérios da fatia, propostos pelo Sabiá e confirmados pela pessoa.",sr:"Só com motivo forte, registrado: decisão de produto ou de UX, dado sensível, risco alto."}},
 afk:{nome:"Fatia · AFK",c:"--l-afk",dash:true,sub:"a IA leva a fatia até o PR",
  quando:"Revisão e verificação rodam por subagente antes do PR, e só existe a [DEV]. Um Dev Sênior aprova o PR na [APR] e quem disparou faz o merge. Roda uma fatia pelas skills, ou várias pelo sa-orquestrar.",
  sen:{jr:"Não pode: o Júnior não começa fatia AFK nem dispara o loop.",pl:"Se os critérios da fatia permitirem. No loop, a escolha do GATE do plano vale para o lote.",sr:"AFK por padrão, sem GATE do plano."}},
 atd:{nome:"Sustentação · Atendimento",c:"--l-atd",sub:"sa-atender",
  quando:"Chamado ou pedido do cliente que não muda o repositório: consulta, extração, explicação, conferência. Mudança de código ou de config é fatia rápida."},
 min:{nome:"Sustentação · demais categorias",c:"--l-min",sub:"sa-executar",
  quando:"Implantação [IMPL], Banco de dados [BD], Infra [INF], Operação [OPE] e Apoio a outros times [EXT]. A pessoa executa fora do repositório; a sa-executar assume a tarefa, grava o item em-andamento na base, registra o que foi feito, lança horas e conclui a tarefa e o IB do item."},
 sprint:{nome:"Ciclo da sprint",c:"--l-sprint",sub:"sa-planejamento",
  quando:"A sprint é ritmo de inspeção, não escopo congelado. Planeja pela vazão, puxa e encaixa durante, sincroniza com o EWM e o git e fecha com review, retrospectiva e virada. A sincronização e a consolidação das fatias prontas são pré-condição dos três ritos de fechamento."}
};
const SENNOME={jr:"Júnior",pl:"Pleno",sr:"Sênior"};

const ROUTES={
 epico:{pts:[[70,404],[436,404],[436,100],[1310,100],[1310,52],[200,52],[200,386]]},
 afk:{pts:[[70,412],[448,412],[448,290],[990,290],[990,190],[1360,190],[1360,444],[1020,444]]},
 hitl:{pts:[[70,420],[460,420],[460,298],[1345,298],[1345,430],[1020,430]]},
 atd:{pts:[[70,428],[480,428],[480,580],[1010,580]]},
 min:{pts:[[70,436],[468,436],[468,680],[830,680]]},
 sprint:{ring:{cx:300,cy:565,r:121}}
};
const TEXTS=[
 {x:30,y:300,t:"ENTRADA"},{x:458,y:84,t:"PRODUTO · ÉPICO"},{x:476,y:214,t:"FATIA · PADRÃO OU RÁPIDA"},
 {x:1004,y:174,t:"AFK · SUBAGENTES ANTES DO PR"},{x:1004,y:330,t:"HITL · PESSOAS DEPOIS DO PR"},
 {x:1030,y:410,t:"DEPOIS DO MERGE"},{x:500,y:556,t:"SUSTENTAÇÃO"},
 {x:760,y:44,t:"fatias aprovadas: encaixe na sprint ou próximo planejamento",cls:"badge-t",a:"middle"},
 {x:300,y:556,t:"CICLO DA",cls:"ringtxt",a:"middle"},{x:300,y:572,t:"SPRINT",cls:"ringtxt",a:"middle"},{x:300,y:590,t:"sa-planejamento",cls:"skill",a:"middle"}
];
const DECOR=[{pts:[[135,381],[135,399]]}];

const r=(a,d)=>a*Math.PI/180;
const RG=ROUTES.sprint.ring;const rp=a=>({x:+(RG.cx+RG.r*Math.cos(r(a))).toFixed(1),y:+(RG.cy+RG.r*Math.sin(r(a))).toFixed(1)});

const S={
/* ---------- entrada ---------- */
 triar:{x:70,y:420,g:"hub",lab:"below",nome:"Triagem",sk:"sa-triar",
  papel:"P.O. ou SM (analista de negócio)",agente:"sa-produto",tarefa:"não assume tarefa; o commit vai na [GB] Gerenciamento do backlog",
  faz:["Recebe pedido em texto, item do EWM (elm_ler_wi) ou um lote de itens do EWM","Procura duplicados no backlog.md, nas fichas, nos registros de Sustentação e nos status.md das branches","Decide a trilha; na dúvida, a mais leve. Padrão com mais de ~3 cenários ou mais de uma regra nova vira épico","Fatia (padrão ou rápida): os artefatos do ELM que ela inclui, altera ou exclui, pelos similares, com o impacto; lista confirmada por quem tria (sem o “sim”: falta: artefatos afetados)","Registra e pergunta “mais algum item?”. Não começa nada: indica o hub sa-iniciar; item fora da sprint entra pelo encaixe ou pelo próximo planejamento"],
  arq:["<produto>/backlog.md","um commit no fim da sessão: backlog: triagem <ids>","créditos em Créditos de gestão da sprint aberta (Atividade triagem) e num comentário na [GB]"],
  elm:["Todo item triado tem o seu IB no backlog do EWM, no estado inicial (elm_criar_wi), com “sim”; o de origem em outro estado volta a ele (reabrir)","Em toda sessão, antes do primeiro item: o item do backlog ainda sem IB nasce no EWM sem esperar a sprint (espelhamento); IB de título parecido é perguntado, nunca duplicado","Horas da triagem na [GB]: só o SM lança; o P.O. nunca, nem quando também é o SM","Sem o MCP: ELM pendente e o fluxo segue"],
  ctx:{
   epico:{faz:["Épico: várias histórias ou decisão de produto em aberto","Registra EP-nn, prioridade —, prd —, po = o P.O. ativo; com o problema, quem pede e o resultado: elegivel, senão novo com falta:","Título com mais de 3 palavras: cria <produto>/epicos/<EP>-<slug>/ com rascunho.md, decisoes.md e o status.md do épico (Fase rascunho)","Para especificar, o épico entra numa sprint com a [ESP]: planejamento ou encaixe (P.O. ou SM)"],
    elm:["Épico no backlog do produto, no estado inicial (elm_criar_wi); item de origem do tipo épico vira o próprio épico; de outro tipo, fica sob ele","Sem o MCP: ELM pendente e o fluxo segue"]},
   hitl:{faz:["Fatia padrão sem épico: regra de negócio clara","Rodadas da sa-entrevistar na seção Decisões da ficha, que nasce aqui com o próximo FT","Seção Artefatos afetados da ficha: inclui · altera · exclui, com o impacto revisto; id que já está na ficha de outra fatia não terminal → bloqueada-por","Grava trilha, origem Manutenção, ficha, tamanho, bloqueada-por e o modo proposto pelos critérios de autonomia do fatiamento","elegivel se passa na Definition of Ready; linha com Especificado — → nova com falta: especificação (a [ESP] FT nasce quando ela entrar na sprint); senão nova com falta:"],
    arq:["<produto>/backlog.md (## Fatias, origem Manutenção)","<produto>/fatias/FT-<nnn>-<slug>.md","um commit no fim da sessão: backlog: triagem <ids>"],
    elm:["Com item de origem: elm_atualizar_wi(origem, backlog), sob a Manutenção se não tem pai; sem: IB [FT-nnn] sob a Manutenção","A 1ª fatia sem épico cria antes o IB Manutenção, filho da Sustentação","Sem o MCP: ELM pendente e o fluxo segue"]},
   atd:{faz:["Pedido do cliente que não muda o repositório: Atendimento","Entrevista curta (sa-entrevistar, modo atendimento); muda o repositório ou tem regra em aberto: volta à triagem, como fatia ou épico","Próximo AT-nnn, status aberto; entra na sprint aberta se cabe na reserva de Sustentação + retrabalho (estourou: fica fora da sprint, e o P.O. decide no Encaixe)","Responsável sugerido: quem tem atende: true no equipe.json"],
    arq:["<produto>/backlog.md (### Atendimento da ## Sustentação)","<produto>/sustentacao/atendimento/AT-<nnn>-<slug>.md (Situação aberto)","na sprint: linha na ### Atendimento da ## Sustentação"],
    elm:["IB [AT-<nnn>] <pedido> (dono = o P.O.), filho do IB Atendimento: no backlog, ou na iteração da sprint se já entra nela","A tarefa [ATD] AT-<nnn> (dono = quem atende) nasce quando o item entra numa sprint","1º item da categoria: o IB Atendimento nasce junto, filho da Sustentação, e o id abre a ### Atendimento"]},
   min:{faz:["Implantação, Banco de dados, Infra, Operação ou Apoio a outros times","Uma mensagem com pedido, origem, prazo, quem faz, critério de pronto e estimativa","Próximo id da série (IM-, BD-, IN-, OP-, EX-), status aberto; entra na sprint aberta se cabe na reserva"],
    arq:["<produto>/backlog.md (### <Categoria> da ## Sustentação)","<produto>/sustentacao/<pasta>/<ID>-<slug>.md"],
    elm:["IB [<ID>] <pedido> (dono = o P.O.), filho do IB <Categoria>; a tarefa ([IMPL], [BD]…) nasce quando o item entra numa sprint","O IB <Categoria> nasce com o 1º item dela, filho da Sustentação"]}},
  trv:{rapida:{faz:["Fatia rápida: defeito ou ajuste de até 1 dia, sem regra nova (inclui de REG ou HF é regra nova), inclusive o diff que cabe numa frase","Uma rodada no formato da entrevista","Ficha de comportamento (atual · esperado · não muda), artefatos afetados e como verificar; tamanho P ou M","elegivel se passa na Definition of Ready; senão nova com falta: (linha com Especificado —: falta: especificação)"]}}},
 ficha:{x:135,y:362,g:"gate",lab:"above",nome:"GATE da ficha",sk:"P.O.",
  papel:"P.O.",agente:"sa-produto",tarefa:"—",
  aviso:"Só a fatia sem épico tem ficha própria da triagem. A fatia de épico chega ao backlog pelo GATE do backlog.",
  faz:["O P.O. aprova as regras, os cenários e os artefatos afetados da fatia padrão sem épico","Sem aprovação: nova com falta: aprovação do P.O.","Artefato afetado sem Especificado: a [ESP] FT da fatia (sa-especificar.fatia) escreve, revisa, aprova e publica no ELM antes do desenvolvimento","Mudar uma ficha aprovada a faz voltar a rascunho; a fatia elegivel ou planejada volta a nova","Retomada pela triagem: “aprova a ficha da FT-040”"],
  arq:["<produto>/fatias/FT-<nnn>-<slug>.md: Situação aprovada por <login> em <data>","backlog.md: elegivel"],elm:["—"],
  trv:{rapida:{aviso:"A fatia rápida é sempre sem épico e tem a sua ficha, de comportamento.",faz:["Na rápida, a ficha é de comportamento (atual · esperado · não muda) e traz o como verificar","A aprovação do P.O. só é pedida quando o esperado vem de uma decisão nova","Tamanho P ou M"]}}},
 backlog:{x:200,y1:396,y2:444,g:"pill",lab:"below",an:"end",dx:6,nome:"Backlog",sk:"backlog.md",
  papel:"P.O. (ordem e prioridade)",agente:"sa-produto",tarefa:"—",
  faz:["O backlog.md é a fonte; o backlog do produto no EWM é a cópia, com todo IB no estado inicial","## Épicos, ## Fatias (uma tabela, origem EP-nn ou Manutenção) e ## Sustentação (uma ### por categoria), com status, prioridade, sprint, responsável, ids do EWM e créditos","Situação gravada por quem a causa, no backlog e na sprint: fatia nova → elegivel → planejada → iniciada → pronta → concluida; épico novo → elegivel → planejado → iniciado → concluido; Sustentação aberto → em-andamento → concluido","Fatia elegivel = passou na Definition of Ready (modo declarado; artefatos afetados confirmados e especificados; na rápida, tamanho até M)","Fatia nova com só falta: especificação entra na sprint como especificação, com a [ESP] FT; ao concluí-la, fica elegivel e é oferecida ao encaixe","Fatia de épico: depois do GATE do backlog não se divide nem se junta; o P.O. ainda a cancela","Linha da ## Sustentação: IB Sustentação, a [GB] do pai atual (dona: o SM) e o IB Manutenção; cada ### <Categoria> abre com o IB dela"],
  arq:["<produto>/backlog.md"],elm:["Backlog do produto no EWM (ccm.backlog do pa)"]},
 planejar:{x:300,y1:396,y2:444,g:"pill",lab:"above",nome:"Planejar a sprint",sk:"sa-planejamento",
  papel:"P.O. ou SM, com o time",agente:"sa-produto",tarefa:"não assume tarefa; créditos num comentário na [GB] e em Créditos de gestão; horas, só o SM",
  faz:["Capacidade: horas de revisão (o limite principal), vazão das 3 últimas sprints, especificação e reserva de Sustentação e retrabalho","Especificação: uma [ESP] por épico elegivel a especificar do topo; a fatia nova (só falta: especificação, recomendada pela prioridade) entra como especificação, com a [ESP] FT-<nnn>; a pendência de especificação da [GB] entra com a [ESP] <id> Revisão <n>","Previsão: entram as elegivel, de épico e de Manutenção, respeitando bloqueada-por; o modo final sai da senioridade do responsável","Fatia HITL ganha revisor (Dev Sênior) e verificador (nunca quem implementa)","Meta; o pai é o da sprint anterior (pai novo só quando a pessoa diz, com o nome que ela der: 2026, Entrega 3…) e a <nn> é a próxima dentro dele; proposta e “ok”; depois de publicar, sincroniza: uma tabela das divergências e das por fora, ou 🔄 iguais"],
  arq:["sprints/<pai>/sprint-<nn>.md (antes da publicação: Publicação no EWM: pendente)","backlog.md: planejada (o épico da [ESP]: planejado), sprint, responsavel e modo final","modo inicial: equipe.json (um P.O. e um SM ativos), acordos.md (Scrumban), roadmap.md"],
  elm:["elm_iteracao(“<pai>/Sprint n”): cria a iteração e o pai que faltar (na primeira sprint do projeto, no topo da timeline)",s=>s.line==="afk"?"Os IBs só mudam de iteração; na fatia AFK, só a [DEV]":s.line==="hitl"?"Os IBs só mudam de iteração; na fatia HITL, [DEV], [REV] e [VER]":"Épicos e IBs só mudam de iteração; tarefas [ESP], [DEV] e, no HITL, [REV] e [VER]","Tarefa que ficou no backlog do EWM move com o dono e a estimativa do papel; só nasce o papel que falta","A [APR] não nasce aqui. A [GB] nasce no modo inicial, no backlog, com o IB Sustentação, e move para a 1ª sprint do projeto; pai novo → [GB] nova, na 1ª sprint dele","Primeira sprint numa PA com várias timelines: configure antes o backlog do produto, cuja timeline passa a valer, ou use o caminho com o ancestral"],
  sen:{jr:"Responsável Júnior: sempre HITL",pl:"Pleno: modo pelos critérios da fatia, confirmado pela pessoa",sr:"Sênior: AFK por padrão; HITL só com motivo, registrado no obs"},
  ctx:{epico:{faz:["Entram os épicos elegivel; épico novo no topo: confere a DoR do épico e grava elegivel; não passa, não barra: entra com o que falta, que é trabalho da [ESP]","Seção Especificação: uma [ESP] por épico, com responsável e horas, dentro da capacidade de especificação","Pendência de especificação na [GB] (PRD aprovado que precisa mudar, com a [ESP] concluída numa sprint fechada): a [ESP] EP-<nn> Revisão <n>","Épico iniciado com o PRD aprovado esperando o fatiamento não ganha Revisão","Depois do “ok”, a [ESP] nasce filha do épico"],sen:null},
   atd:{faz:["O item de Sustentação entra na sprint aberta já na triagem, se cabe na reserva","Sem sprint aberta, fica aberto, fora de sprint, e entra no próximo planejamento, como as fatias","Sustentação que estoura a reserva: o P.O. decide no Encaixe; a Sustentação nunca tira fatia sozinha"],sen:null},
   min:{faz:["O item de Sustentação entra na sprint aberta já na triagem, se cabe na reserva","Sem sprint aberta, fica aberto, fora de sprint, e entra no próximo planejamento, como as fatias","Sustentação que estoura a reserva: o P.O. decide no Encaixe; a Sustentação nunca tira fatia sozinha"],sen:null}}},
 iniciar:{x:400,y1:396,y2:444,g:"hubpill",lab:"above",nome:"Hub",sk:"sa-iniciar",
  papel:"qualquer papel",agente:"todos, menos o pesquisador e o orquestrador; e a sessão padrão",tarefa:"a do papel",
  faz:["Recebe um item registrado, uma tarefa do EWM ou “minha próxima tarefa”","Procura nos status.md das branches, depois no backlog.md da base, depois no EWM","Diz a skill do papel e para; não confere compromisso, não toca no EWM nem cria branch","Texto ou id fora do backlog: sa-triar; tarefa sem prefixo do Sabiá: sincroniza a sprint","[GB]: pedido de sprint → sa-planejamento; fatia pronta → sa-consolidar; senão sa-triar","Tarefa já fechada no EWM encaminha igual: a skill do papel mostra o estado e oferece reabrir ou fechar o item"],
  arq:["lê status.md, backlog.md e a sprint"],elm:["elm_listar_wi(dono, iteracao) em “minha próxima tarefa”","Sprint com Publicação no EWM: pendente: lê as linhas do sprint-<nn>.md e indica sincroniza a sprint"],
  ctx:{epico:{faz:["EP ou [ESP] (também a [ESP] FT-nnn e a [ESP] <id> Revisão <n>) → sa-especificar, no sa-especificador","EP com o PRD na base e a Especificação ainda iniciada → sa-especificar (retoma a publicação)","EP aprovado na base com a Especificação concluida → sa-fatiar, do P.O. ou do SM (sa-produto)","EP fatiado (cancelar fatias ou o épico) → sa-fatiar.refinamento","Texto ou id fora do backlog → sa-triar"]},
   hitl:{faz:["FT, DF/IB do backlog ou [DEV] → sa-desenvolver","[REV] e [APR] → sa-revisar (Dev Sênior); [VER] → sa-verificar","aceita → sa-desenvolver.encerrar.merge (merge); pronta na base → sa-consolidar","iniciada no backlog sem status.md em branch → sa-desenvolver (só o responsável retoma)","bloqueada aguardando especificação [ESP] FT-nnn → pela linha da [ESP] FT na sprint: sa-especificar, ou, concluída, o Dev (sa-plano ou sa-codificar)","FT nova com falta: especificação → na sprint, sa-especificar; fora dela, planejamento ou encaixe"]},
   afk:{faz:["Fatia AFK → sa-desenvolver; várias planejadas → o sa-orquestrar é oferecido","verificada → sa-codificar.codificar.pr (abrir o PR)","aguardando-aprovacao-pr sem a [APR] concluída → sa-revisar (Dev Sênior); com ela → sa-desenvolver.encerrar.merge","pronta na base → sa-consolidar"]},
   atd:{faz:["AT-nnn ou [ATD] → sa-atender, no sa-produto"]},
   min:{faz:["IM, BD, IN, OP, EX ou [IMPL]… → sa-executar, no sa-produto"]}}},

/* ---------- épico ---------- */
 especificar:{x:520,y:100,lab:"below",nome:"Especificar",sk:"sa-especificar",
  papel:"Especificador",agente:"sa-especificador",tarefa:"[ESP] EP-<nn> Especificação (ou Revisão <n>)",
  faz:["Entrada: EP-nn ou [ESP] EP-nn com a linha viva na seção Especificação da sprint aberta; fora da sprint, manda ao P.O. ou ao SM","Completa com a pessoa a DoR do épico que faltar (o problema, quem pede, o resultado e o po): é trabalho desta [ESP]","Grava na base só a situação: épico iniciado e Especificação iniciada (commit EP-<nn> iniciar); assume a [ESP]","Monta a pasta de trabalho (local, anexos da [ESP] ou base), com reunioes/ e, com Telas = sim, prototipo/","Encaminha pela Fase: transcrição sem ATA aprovada → sa-especificar.reuniao; protótipo novo ou aguardando o cliente → sa-especificar.prototipo; rascunho ou em-revisao → sa-prd; aprovado na pasta → PRD na base","Toda sessão fecha com créditos, comentário, anexos e horas na [ESP], num “sim”"],
  arq:["backlog.md: iniciado · sprint-<nn>.md: Especificação iniciada (commit EP-<nn> iniciar)",".sabia/local/especificacao/<EP>-<slug>/ (até o GATE do PRD): rascunho.md, decisoes.md, status.md, reunioes/, prototipo/","status.md do épico (Fase, créditos)"],
  elm:["elm_transicao assumir a [ESP]; fora da iteração da sprint: antes, move com o IB do épico","Fechar a sessão: elm_comentar (Sessão de especificação — EP-<nn> · <UTC>) · elm_anexo enviar (os .md e os elm-<arquivo>.md; a transcrição não) · elm_lancar_horas","Sem o MCP: ELM pendente no rascunho.md até o PRD ir à base"]},
 entrevistar:{x:600,y:100,lab:"below",dy:23,nome:"Entrevistar",sk:"sa-entrevistar",
  papel:"Especificador, com o P.O. e o cliente",agente:"sa-especificador",tarefa:"[ESP]",
  faz:["Árvore de decisões; responde sozinha o que tem fonte (código, bundle, glossário, banco, ATA aprovada): confirmada","Rodadas pela fronteira de decisões, sempre com a resposta recomendada","Termina com a fronteira vazia e o entendimento confirmado; “chega” deixa o resto em aberto","Termo novo fica no decisoes.md e vai ao glossário no GATE do PRD","Reunião com o cliente: a transcrição (.vtt ou .md) em reunioes/ vira ATA (sa-especificar.reuniao): escrita (D-nn reservados), aprovada por uma pessoa, publicada e ligada à [ESP] sem esperar o GATE; os D-nn passam a decidida","Telas = sim: protótipo (sa-especificar.prototipo), versão vN anexada na [ESP], só dado fictício; a aprovação do cliente vira um D-nn (quem, data, versão e evidência: ATA ou e-mail); épico sem tela: um D-nn da pessoa"],
  arq:["decisoes.md na pasta de trabalho (só acréscimo)","elm/ATA-<nn>-<AAAA-MM-DD>-<assunto>.md · rascunho.md (dúvidas, protótipo)","reunioes/ (transcrição, só nesta máquina) · prototipo/prototipo-v<N>-<slug>.<ext>"],
  elm:["elm_buscar_req_local · elm_ler_req_local","ATA aprovada: elm_publicar_req (sigla ATA) + elm_ligar à [ESP] (rastreia), com “sim”","Protótipo: elm_anexo enviar na [ESP], com “sim”"]},
 prd:{x:680,y:100,lab:"below",nome:"PRD",sk:"sa-prd",
  papel:"Especificador",agente:"sa-especificador, com os subagentes pesquisador e revisor",tarefa:"[ESP]",
  faz:["Entender: a descrição longa; explora o bundle, o código, o glossário e os ADRs antes de perguntar (pesquisador)","Entrevistar: sa-entrevistar; transcrição nova sem ATA passa antes pela reunião","Similares: antes de criar qualquer arquivo em elm/, uma decisão por artefato (reutilizar, alterar, excluir, criar novo) e o impacto de cada alteração e exclusão","Escrever: prd.md e um conceito por artefato novo, alterado ou excluído (HF, REG, GL; EL do protótipo aprovado, com Telas = sim; CT planejado de cada cenário; ET inicial, pela linha ET), status draft","Tipo com skill de toolkit no prompt: sai por ela e volta ao passo; o contrato e a revisão continuam do Sabiá","Acima do limite do acordos.md (sem a linha, 9 ou mais histórias): propõe dividir o épico","Mudança (sa-prd.mudanca): o PRD aprovado e ainda não fatiado muda só por pedido explícito (da pessoa ou de uma ATA), na [ESP] aberta, reaberta na sprint ou na [ESP] EP-<nn> Revisão <n>; editado direto na base, numa versão nova (1.1, 1.2…), com revisão P e GATE de novo; fatiado, o PRD não muda (a [ESP] FT da fatia, ou a sa-triar)","Nunca é AFK"],
  arq:["prd.md (pasta de trabalho)","elm/HF-*, REG-*, GL-*, EL-*, CT-*, ET-* (pasta de trabalho)"],elm:["elm_buscar_req_local · elm_buscar_req (similares)","Não registra nada no EWM"]},
 revprd:{x:760,y:100,lab:"below",dy:36,nome:"Revisão do PRD",sk:"rubrica P",
  papel:"subagente sa-revisor",agente:"sa-revisor (subagente)",tarefa:"[ESP]",
  faz:["Revisão independente, em contexto limpo, pela rubrica P (os itens de rubrica de um toolkit se somam a ela)","Até 2 rodadas; Fase em-revisao no status.md do épico (na mudança, em-revisao (de: aprovado))","AJUSTAR → volta ao PRD; achado que é decisão de negócio → volta à entrevista"],
  arq:["revisao-prd-<N>.md na pasta do PRD"],elm:["—"]},
 gprd:{x:840,y:100,g:"gate",lab:"below",nome:"GATE do PRD",sk:"Especificador",
  papel:"Especificador (quem especifica)",agente:"sa-especificador",tarefa:"[ESP]",
  faz:["Quem especifica aprova o PRD e, com ele, todos os conceitos de elm/: os novos, os alterados e os excluídos","Decisão em aberto que muda comportamento → volta à entrevista","Aprovado: Fase aprovado no status.md do épico; prd.md v1.0 (na mudança, 1.1, 1.2…); cada conceito da rodada stable (o excluído segue deprecated) com verified humano; a ATA já veio aprovada","Primeiro GATE: grava só na pasta de trabalho e diz “use sa-especificar EP-<nn>”; mudança antes do fatiamento: commit EP-<nn> aprovar PRD na base"],
  arq:["status.md do épico: Fase aprovado","prd.md: versão, data e quem aprovou no rodapé","elm/: status stable e verified"],elm:["Sem verified humano, nada é publicado"]},
 prdbase:{x:920,y:100,lab:"below",dy:36,nome:"PRD na base",sk:"sa-especificar",
  papel:"Especificador",agente:"sa-especificador",tarefa:"[ESP]",
  faz:["Primeiro GATE: fecha antes a sessão, para a [ESP] ter a versão aprovada","Gravar na base: copia a pasta de trabalho, fora de reunioes/ (a transcrição fica nesta máquina), para <produto>/epicos/<EP>-<slug>/, com as revisões e só as versões registradas do protótipo (substitui o rascunho, as decisões e o status.md da triagem)","Backlog: só o link prd (e a pasta, se estava —); o épico segue iniciado","Um commit, EP-<nn> aprovar PRD; a partir daí a base é a fonte","PRD já na base (a mudança ou a retomada da publicação): nada aqui"],
  arq:["<produto>/epicos/<EP>-<slug>/: prd.md, decisoes.md, rascunho.md, status.md, elm/, prototipo/, revisao-prd-<N>.md","backlog.md (link prd)"],elm:["—"]},
 elmpub:{x:1000,y:100,lab:"below",nome:"Publicar no ELM",sk:"DOORS Next · ETM",
  papel:"Especificador",agente:"sa-especificador",tarefa:"[ESP]",
  aviso:"A [ESP] termina com a publicação do que o GATE do PRD aprovou. Projeto sem ELM pula este passo.",
  faz:["Numa confirmação, com prévia: os conceitos do elm/ do épico na base (fora a ATA, publicada na aprovação dela) e os CT planejados","Filtro: stable com verified humano; o já publicado na versão aprovada é “sem mudança”","Ordem GL → REG → EL → HF → ET, com a 2ª passada HF ↔ EL; HF → REG vira embed","Similar igual ou que se sobrepõe → volta à escrita do PRD","Liga cada requisito criado ou atualizado à [ESP] (rastreia)","exclui → roteiro da lixeira do DOORS Next; CT já publicado e alterado → atualizar no ETM à mão","Grava de volta o resource e o id (vão no commit da conclusão) e sugere a sa-sync","Sem o “sim”: a [ESP] não conclui; fecha a sessão e para"],
  arq:["conceitos em <produto>/epicos/<EP>-<slug>/elm/ (resource, id, sources)","id no glossário"],elm:["elm_publicar_req (requisitos) · elm_criar_ct (CT planejado, com Casos de teste = ETM)","elm_ligar(wi = [ESP], req, rastreia)","Conflito → mostra os dois lados e pergunta","Sem o MCP: ELM pendente [EP-<nn> publicar] no rodapé do PRD","Atributos e links requisito↔requisito: roteiro manual"]},
 espfim:{x:1080,y:100,lab:"below",dy:23,nome:"Concluir a [ESP]",sk:"sa-especificar",
  papel:"Especificador",agente:"sa-especificador",tarefa:"[ESP]",
  faz:["PRD já na base ao chegar aqui (mudança ou retomada): fecha a sessão antes do commit","Um commit, EP-<nn> concluir especificação: o que a publicação gravou de volta e a linha do épico na seção Especificação concluida, com os Créditos","Saldo de horas e conclusão da [ESP], numa confirmação","O épico segue iniciado","Diz: “Próximo: fatiar o EP-<nn> — P.O. ou SM, agente sa-produto (sa-fatiar). O fatiamento vem logo em seguida.” e para"],
  arq:["sprint-<nn>.md: Especificação concluida (+ Créditos)","conceitos e glossário (o que a publicação gravou)","status.md do épico (créditos)"],elm:["elm_horas · elm_lancar_horas · elm_transicao concluir a [ESP]","Sem o MCP: ELM pendente [ESP EP-<nn> concluir] no rodapé do PRD"]},
 fatiar:{x:1160,y:100,lab:"below",nome:"Fatiar",sk:"sa-fatiar",
  papel:"P.O. ou SM",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["Entrada: Fase aprovado no status.md do épico, na base, com a [ESP] concluída e publicada; nunca é AFK","Rascunho de fatias verticais (o pesquisador relê o código), com ids provisórios FT-?n","Confere a cobertura (cada cenário em uma fatia), a fatia ponta a ponta e os artefatos afetados de cada fatia, do PRD (HF, REG, GL, EL e CT; a ET não)","altera ou exclui já na ficha de outra fatia não terminal → bloqueada-por","Propõe tamanho, dependências e modo; tipo de trabalho novo começa HITL","Conceito do PRD que precisa mudar → sa-prd.mudanca (Especificador), antes de fatiar","Refinamento (sa-fatiar.refinamento): cancela fatias ou o épico, por decisão do P.O.; depois do GATE, a fatia não se divide nem se junta"],
  arq:["rascunho na conversa (nada gravado antes do GATE)"],elm:["Refinamento: elm_transicao(id, “cancelar”) no IB da fatia ou do épico cancelado, com “sim”"]},
 gbacklog:{x:1240,y:100,g:"gate",lab:"below",nome:"GATE do backlog",sk:"P.O. ou SM",
  papel:"P.O. ou SM",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["Aprova as fatias: granularidade, dependências, AFK ou HITL; repete até o “ok”, que não vale sem a fatia ponta a ponta","Grava na base: os ids reais (FT-nnn) no lugar dos provisórios; fatias elegivel ou nova (falta:), com origem EP-nn, cobre e a prioridade do épico","Fichas “padrão de épico”, com a seção Artefatos afetados vinda do PRD","Fase fatiado no status.md do épico; o status do épico não muda","Créditos (e horas, só do SM) na [GB]; commit backlog: fatiamento EP-<nn>","Próximo: alocar as fatias — com sprint aberta, o encaixe; sem ela, o planejamento"],
  arq:["backlog.md · fatias/FT-<nnn>-<slug>.md · status.md do épico","sprint-<nn>.md: Créditos de gestão (com sprint aberta)","commit backlog: fatiamento EP-<nn>"],elm:["Um IB por fatia sob o épico, no backlog do produto e no estado inicial, com “sim”; sem o MCP: pendente na coluna elm","elm_comentar com os créditos na [GB]; horas na [GB] só pelo SM"]},

/* ---------- fatia: trecho comum ---------- */
 espft:{x:505,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Especificar a fatia",sk:"sa-especificar",
  papel:"Especificador",agente:"sa-especificador",tarefa:"[ESP] FT-<nnn> Especificação (ou Revisão <n>)",
  aviso:"Só na fatia com artefato afetado (inclui · altera · exclui). Sem artefato, esta etapa fica desmarcada e a fatia vai direto ao desenvolvimento.",
  faz:["Entrada: a fatia nova com falta: especificação, com a linha viva na seção Especificação da sprint aberta (a [ESP] FT nasce no planejamento ou no encaixe)","Assumir: linha iniciada na Especificação da sprint e a [ESP] FT assumida","Trabalho: completa a ficha (entrevista, se preciso) e confere a DoR fora a especificação; sem artefato afetado, vai à conclusão","Artefatos: por linha de Artefatos afetados, a cópia da versão aprovada mais nova (altera, exclui) ou os similares (inclui), na pasta de trabalho","Escrever: cada artefato no estado depois, pelas regras de escrita do PRD; desviável por tipo para a skill de um toolkit","Revisão P pelo subagente sa-revisor, até 2 rodadas; decisão de negócio volta ao trabalho","GATE do especificador: aprovado → stable e verified humano","Publicar no ELM numa confirmação, cada requisito ligado à [ESP] FT (rastreia)","Concluir: passou na DoR → elegivel e a oferta do encaixe na sprint aberta, onde nasce a [DEV]; desdobramento → sa-triar","A fatia iniciada que volta à especificação (plano, revisão, verificação, aprovação do PR) volta aqui: a [ESP] reaberta, a Revisão <n> ou a do encaixe"],
  arq:[".sabia/local/especificacao/ (pasta de trabalho da fatia; anexos elm-*.md na [ESP] FT a cada sessão)","sprint-<nn>.md: Especificação iniciada (commit FT-<nnn> iniciar especificação)",".kiro/specs/ft-<nnn>-<slug>/elm/ e a coluna Especificado da ficha (commit FT-<nnn> aprovar especificação)","backlog.md: elegivel e a linha da sprint concluida, com os Créditos","ficha: linha de créditos por sessão (commit FT-<nnn> registrar sessão)"],
  elm:["elm_transicao assumir a [ESP] FT","Publicação dos conceitos aprovados e dos CT planejados, numa confirmação (escopo [ESP] FT)","elm_ligar([ESP] FT, requisito, rastreia) por requisito criado ou atualizado","exclui: roteiro da lixeira no DOORS Next, até a pessoa confirmar","Saldo de horas e conclusão da [ESP] FT"]},
 desenvolver:{x:577,y1:290,y2:298,g:"pill",lab:"above",nome:"Desenvolver",sk:"sa-desenvolver",
  papel:"Dev",agente:"sa-desenvolvedor",tarefa:"[DEV] FT-<nnn> Implementar",fase:"nenhuma → pesquisando",
  faz:["Entrada: a fatia com linha viva em Fatias na sprint aberta; fora dela, “fale com o P.O. ou o SM”: a puxada é o encaixe","Compromisso: Definition of Ready (falhou: ainda é especificação), trilha, responsável e modo da primeira atribuição, WIP de revisão, registro publicado na base e dono do item pai","Grava iniciada na base, no backlog e na sprint (commit <FT> iniciar, push com “sim”); só então sugere a branch e espera o “ok”","Cria a pasta da fatia com status.md e .config.kiro e assume a [DEV] (iniciando o pai)","Fatia já iniciada: retoma pela fase, sem repetir o compromisso; [DEV] já fechada no EWM: mostra o estado e oferece reabrir (PR mergeado → sa-desenvolver.encerrar.merge)","Encaminha pela fase e para"],
  arq:["backlog.md e sprint-<nn>.md: iniciada, na base (commit <FT> iniciar)",".kiro/specs/<ft>-<slug>/status.md (fase pesquisando)",".kiro/specs/<ft>-<slug>/.config.kiro (feature ou bugfix)","commit e push com “sim”"],
  elm:["elm_transicao(“assumir”, iniciar_pai) na [DEV]; já fechada → reabrir, com “sim”","Primeira atribuição que virou HITL: pergunta o revisor (Dev Sênior) e o verificador e cria a [REV] e a [VER]; que virou AFK: as duas são canceladas","Item do EWM pendente ou sem link: cria ou completa, com o P.O. como dono"],
  sen:{jr:"Júnior: sempre HITL; segue normalmente",pl:"Pleno: segue no modo gravado na sprint",sr:"Sênior em HITL só com motivo forte, registrado na sprint"},
  ctx:{afk:{nome:"Desenvolver ou loop",sk:"sa-desenvolver · sa-orquestrar",agente:"sa-desenvolvedor (uma fatia) · sa-orquestrador (lote)",tarefa:"[DEV], a única tarefa do AFK",
   faz:["Uma fatia: o Dev conduz pelas skills, com revisão e verificação por subagente","Várias planejadas: o sa-orquestrar, disparado por Dev Pleno ou Sênior; candidatas planejada e AFK da sprint aberta, desbloqueadas; uma confirmação para o lote; paralelismo de 1 a 3","No loop: o orquestrador grava a iniciada do lote na base, num commit; com o push conferido, nasce uma worktree por fatia em .sabia/local/wt/<ft>, com a [DEV] criada e assumida na confirmação do lote"],
   arq:["backlog.md e sprint-<nn>.md: iniciada do lote (commit <FT…> iniciar)",".sabia/local/wt/<ft>/ (loop)",".kiro/specs/<ft>-<slug>/status.md","log do lote em .sabia/local/"],
   elm:["Só a [DEV], assumida com iniciar_pai","No loop, as horas são lançadas numa pergunta só, no fim; os créditos ficam para o merge (rateio 1/n)"],
   sen:{jr:"Não começa fatia AFK nem dispara o loop",pl:"Dispara o loop; uma pergunta só sobre o GATE do plano, para o lote",sr:"Dispara o loop; sem GATE do plano"}}}},
 pesquisar:{x:649,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Pesquisar",sk:"sa-pesquisar",
  papel:"Dev, pelo subagente",agente:"sa-pesquisador (só leitura)",tarefa:"[DEV]",fase:"pesquisando → planejando",
  faz:["De 3 a 7 perguntas sobre o código","Investiga o código e os requisitos pelo bundle; sem bundle, registra e indica a sa-sync","Devolve fatos com arquivo:linha, sem opinar sobre o como",s=>s.line==="afk"?"Chamada pela sa-plano ou pelo loop":"Chamada pela sa-plano"],
  arq:[".kiro/specs/<ft>-<slug>/research.md (até ~150 linhas)","o commit é da sa-plano"],elm:["elm_buscar_req_local · elm_ler_req_local"],
  trv:{rapida:{faz:["Pesquisa curta sobre o defeito ou o pedido","De 3 a 7 perguntas; fatos com arquivo:linha","O commit é da sa-plano"]}}},
 plano:{x:721,y1:290,y2:298,g:"pill",lab:"above",nome:"Plano",sk:"sa-plano",
  papel:"Dev",agente:"sa-desenvolvedor",tarefa:"[DEV]",fase:"planejando",
  faz:["Sem research.md: sa-pesquisar antes",s=>s.line==="afk"?"Lacuna de negócio: para (é do P.O.). Escolha técnica: decide e registra":"Lacuna de negócio: para (é do P.O.). Escolha técnica: apresenta à pessoa","Spec do Kiro: requirements.md, design.md e tasks.md, com a forma do programa e o contrato de pronto","Mais de 200 linhas ou mais de 8 tarefas: bloqueada (de: planejando), plano acima do limite; o P.O. decide: de épico, seguir com o plano ou cancelar e registrar as partes pela sa-triar; sem épico, dividir pela sa-triar","Artefato do ELM ou do PRD que precisa mudar: bloqueada (aguardando especificação [ESP] FT-<nnn>), pela Volta à especificação"],
  arq:["requirements.md · design.md · tasks.md","decisoes.md"],elm:["Horas na [DEV] (lançar não conclui)"],
  trv:{rapida:{sk:"sa-plano · bugfix.md",faz:["Spec de bugfix do Kiro: bugfix.md, design.md e tasks.md","O teste que reproduz o defeito e a correção formam um ciclo só","Lacuna de negócio: para (é do P.O.)"],arq:["bugfix.md · design.md · tasks.md","decisoes.md"]}}},
 analise:{x:793,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Análise do plano",sk:"rubrica L",
  papel:"subagente sa-revisor",agente:"sa-revisor (subagente do desenvolvedor)",tarefa:"[DEV]",fase:"planejando",
  faz:s=>["Análise independente do plano pela rubrica L"+(s.tr==="rapida"?", sobre o bugfix.md":""),"OK: segue para o gate da sa-plano: "+(s.line==="afk"?"troca de modo e GATE":"GATE"),s.tr==="rapida"?"AJUSTAR por falta do plano: corrige, até 2 rodadas. Lacuna de negócio: para, é do P.O.":"AJUSTAR por falta do plano: corrige, até 2 rodadas. Por falta do PRD ou da ficha: volta às decisões (artefato a mudar: volta à especificação)","Sem subagente: para em “plano pronto para análise”"],
  arq:["analise-plano-<N>.md","commit registrar análise do plano <N>"],elm:["—"],
  ctx:{afk:{aviso:"Plano AFK com risco (regra sensível, muitos cenários, integração externa, mudança de dado): antes do GATE, o fluxo sugere a troca para HITL."}}},
 gplano:{x:865,y:294,g:"gate",lab:"above",nome:"GATE do plano",sk:"[APR] Aprovar plano",
  papel:"Dev Sênior, de preferência quem vai revisar o PR",agente:"sa-revisor (sa-revisar)",tarefa:"[APR] FT-<nnn> Aprovar plano",fase:"aguardando-aprovacao-plano → implementando",
  faz:["Com GATE: a [APR] nasce aqui; fase aguardando-aprovacao-plano; commit registrar plano → push → conferir → horas na [DEV]","O Dev Sênior dono da [APR] aprova na sessão dele: implementando e “plano aprovado por <login>”; commit → push → conferir → conclui a [APR]","Reprovado: fase planejando; a mesma [APR] segue em andamento e o Dev replaneja","Vale para as duas trilhas e os dois modos"],
  arq:["status.md: Histórico e Achados abertos"],elm:["elm_criar_wi da [APR], filha do IB da fatia","elm_transicao assumir/concluir, na sa-revisar"],
  sen:{jr:"Sempre",pl:"O fluxo pergunta. Se pedir, segue como o Júnior; se dispensar: implementando e “Pleno dispensou o GATE do plano”",sr:"Nunca: aprova o próprio plano (“plano do Sênior”), mesmo mudando a expectativa de um teste existente"},
  ctx:{afk:{aviso:"No loop, a escolha do GATE é uma só para o lote. Com GATE, a fatia pausa em aguardando-aprovacao-plano e o lote segue."}}},
 implementar:{x:937,y1:290,y2:298,g:"pill",lab:"above",dy:-26,nome:"Implementar",sk:"sa-codificar",
  papel:"Dev",agente:"sa-desenvolvedor",tarefa:"[DEV]",fase:"implementando",
  faz:s=>[s.sen==="jr"?"Exige no Histórico a linha do GATE do plano aprovado":s.sen==="sr"?"Exige no Histórico a linha do plano do Sênior":s.sen==="pl"?"Exige no Histórico a linha do GATE aprovado ou da dispensa do Pleno":"Exige no Histórico a linha do GATE (ou do plano do Sênior, ou da dispensa do Pleno)","Uma tarefa por vez: vermelho → verde → arrumar → backpressure (compilar, testes, lint) → commit","Oráculo protegido: teste não se apaga nem se afrouxa","Duas correções sem avanço: bloqueada (de: implementando)","Conflito no merge (retrabalho com a linha conflito no merge): antes de tudo, a branch atualizada com a base, por merge","Validação completa no fim"],
  arq:["código e testes · tasks.md · status.md"],elm:["—"],
  ctx:{hitl:{aviso:"No HITL, antes do PR há só a revisão automática do desenvolvedor (pré-PR)."},afk:{aviso:"No AFK, depois daqui vêm a revisão e a verificação por subagente (até a fase verificada), ainda antes do PR."}},
  trv:{rapida:{faz:s=>[s.sen==="jr"?"Exige no Histórico a linha do GATE do plano aprovado":s.sen==="sr"?"Exige no Histórico a linha do plano do Sênior":s.sen==="pl"?"Exige no Histórico a linha do GATE aprovado ou da dispensa do Pleno":"Exige no Histórico a linha do GATE (ou do plano do Sênior, ou da dispensa do Pleno)","O teste que reproduz o defeito e a correção formam um ciclo só","Backpressure a cada tarefa; oráculo protegido","Duas correções sem avanço: bloqueada (de: implementando)"]}}},

/* ---------- fatia: HITL ---------- */
 prepr:{x:1020,y:298,lab:"above",dx:4,nome:"Pré-PR",sk:"rubrica C",
  papel:"subagente sa-revisor",agente:"chamado pelo sa-desenvolvedor",tarefa:"[DEV]",fase:"implementando",
  faz:["Revisão automática antes do PR, pela rubrica C, com o contexto “pré-PR”","O relatório fica só na conversa: não grava revisao-codigo nem conta rodada","REVISAR: tarefas [R<n>], até 2 vezes; persistindo, a pessoa decide abrir o PR com os achados ou corrigir","APROVADO, ou sem subagente: segue para o PR"],
  arq:["—"],elm:["—"]},
 pr_h:{x:1105,y:298,lab:"above",nome:"PR aberto",sk:"gitlab_criar_mr",
  papel:"Dev",agente:"sa-desenvolvedor",tarefa:"[DEV] em andamento",fase:"pr-aberto",
  faz:["ADRs (as decisões “Vira ADR? sim” do design.md) e, pela linha ET do sabia.md, a ET as-built escrita do design.md e do código (fatia de épico com ET inicial: ligada a ela) vão no PR","Branch desatualizada (o backlog.md, as sprints e as specs de outras fatias que o time grava na base não contam): com “sim”, git merge origin/<base>; nunca rebase, que tira o sha aprovado","Commit → push → conferir no remoto → gitlab_listar_mrs (se já existe, é esse) ou gitlab_criar_mr","Push “não”: a fase não muda; para em “aguardando o PR”","Horas na [DEV] (lança, não conclui) e avisa o revisor"],
  arq:["texto do PR, com caminho de leitura e evidência","adr/ · elm/ET-<slug>.md (as-built, status draft)"],elm:["gitlab_criar_mr, com a confirmação da ferramenta","Sem GitLab: entrega título e descrição e a pessoa abre"]},
 revisar:{x:1190,y:298,lab:"above",nome:"Revisar",sk:"sa-revisar",
  papel:"Revisor (Dev Sênior)",agente:"sa-revisor",tarefa:"[REV] FT-<nnn> Revisar",fase:"pr-aberto → em-revisao → em-verificacao",
  faz:["Só Dev Sênior ativo; quem implementou, só se for o único Sênior (revisor único)","gitlab_obter_mr, troca para a branch do PR, fase em-revisao","[REV] já concluída e o PR mudou (retrabalho da VER, conflito no merge): reabre antes de assumir","Rubrica C nos dois eixos, spec e padrões, sobre o diff; julga os ADRs e a ET as-built (C15); indica a possível alteração no Drift de negócio","Possível alteração: a pessoa decide — volta à especificação (bloqueada, [ESP] FT) ou código errado (achado)","APROVADO: em-verificacao. REVISAR: retrabalho (de: em-revisao)","Entrega: créditos → commit → push → conferir → saldo e conclusão da [REV] → avisa o verificador"],
  arq:["revisao-codigo-<N>.md","commit FT-<nnn> revisão <N>: <veredito>"],elm:["elm_transicao reabrir/assumir/concluir a [REV]","gitlab_obter_mr"],
  sen:{jr:"O PR do Júnior é revisado por um Dev Sênior",pl:"O PR do Pleno é revisado por um Dev Sênior",sr:"O PR do Sênior vai para outro Sênior; se ele é o único Sênior ativo, ele mesmo (revisor único na Observação)"}},
 verificar:{x:1275,y:298,lab:"above",nome:"Verificar",sk:"sa-verificar",
  papel:"Verificador (QA)",agente:"sa-verificador",tarefa:"[VER] FT-<nnn> Verificar",fase:"em-verificacao → aceita",
  faz:["Só depois da revisão APROVADO; nunca quem implementa","Os cenários pelo fluxo verificar: roteiro (do contrato de pronto) → ambiente → executar → casos → resultado","Executa na aplicação de verdade (API, batch, tela, carga), com repetição e erro em um item; nunca em produção","CT.csv: a evidência de cada cenário verificado, ligada ao CT planejado que o prova; CT novo só para o cenário sem CT planejado","Possível alteração indicada: a pessoa decide — volta à especificação (bloqueada, [ESP] FT) ou código errado (cenário rejeitado)","ACEITO: aceita. REJEITADO: retrabalho (de: em-verificacao)","[VER] já concluída e o PR mudou (conflito no merge): reabre antes de assumir","Entrega: créditos → commit → push → conferir → saldo e conclusão da [VER] → avisa o Dev: aceita, à espera do merge"],
  arq:["verificacao.md · CT.csv · evidencias/ · massa/"],elm:["elm_transicao reabrir/assumir/concluir a [VER]"],
  trv:{rapida:{faz:["Só depois da revisão APROVADO; nunca quem implementa","Roteiro no verificacao.md a partir do contrato de pronto","Executa na aplicação de verdade, nunca em produção","CT.csv: um CT novo por comportamento do bugfix.md, com a evidência","ACEITO: aceita. REJEITADO: retrabalho (de: em-verificacao)"]}}},

/* ---------- fatia: AFK ---------- */
 rev_a:{x:1050,y:190,lab:"below",nome:"Revisão C",sk:"subagente",
  papel:"subagente sa-revisor",agente:"chamado pelo desenvolvedor ou pelo orquestrador",tarefa:"[DEV]",fase:"revisando",
  faz:["Rubrica C nos dois eixos, sobre o diff; grava o drift de negócio","APROVADO: segue para a verificação","REVISAR: tarefas [R<n>] e volta à implementação; a 2ª reprovação → bloqueada (de: revisando)"],
  arq:["revisao-codigo-<N>.md","commit registrar revisão <N>"],elm:["Subagente não faz push nem toca no ELM"]},
 ver_a:{x:1130,y:190,lab:"below",nome:"Verificação",sk:"subagente",
  papel:"subagente sa-verificador",agente:"chamado pelo desenvolvedor ou pelo orquestrador",tarefa:"[DEV]",fase:"verificando → verificada",
  faz:["O fluxo verificar: roteiro → ambiente → executar → casos → resultado, na aplicação de verdade, nunca em produção","ACEITO: verificada (quem grava é o verificador) e CT.csv","Possível alteração: indicada no bloco 🔁; quem decide é o Dev Sênior na [APR]","REJEITADO: volta à implementação e passa de novo pela revisão; a 2ª rejeição → bloqueada (de: verificando)"],
  arq:["verificacao.md · CT.csv","commit registrar verificação"],elm:["—"]},
 pr_a:{x:1210,y:190,lab:"below",nome:"PR",sk:"gitlab_criar_mr",
  papel:"Dev, ou o orquestrador se o lote autorizou",agente:"sa-desenvolvedor · sa-orquestrador",tarefa:"[DEV]",fase:"verificada → aguardando-aprovacao-pr",
  faz:["Começa só com a fase verificada","Commit → push → conferir → gitlab_criar_mr","Cria a [APR] Aprovar PR para um Dev Sênior, de preferência outro que não quem disparou","Push ou PR não autorizado no lote: a fatia fica verificada e o Dev abre o PR pela sa-codificar","Horas na [DEV] e avisa o Sênior da [APR]"],
  arq:["texto do PR"],elm:["elm_criar_wi da [APR] Aprovar PR","gitlab_criar_mr"]},
 aprpr:{x:1290,y:190,g:"gate",lab:"below",nome:"Aprovar PR",sk:"[APR]",
  papel:"Dev Sênior dono da [APR]",agente:"sa-revisor (sa-revisar)",tarefa:"[APR] FT-<nnn> Aprovar PR",fase:"aguardando-aprovacao-pr",
  faz:["Lê o PR de verdade, na sessão dele (Como ler, revisão aprovada, evidências, ADRs e ET as-built); anota o sha e roda o backpressure","[APR] já concluída e o PR mudou (conflito no merge): reabre antes de assumir","Possível alteração indicada: decide — volta à especificação (bloqueada, aviso ao especificador) ou código errado (mudanças pedidas)","Aprovado: sem commit nem fase (o sha não muda); comentário “PR aprovado, sha <sha>” na [APR], saldo e conclusão; liga a [DEV] aos requisitos que a fatia cobre","Mudanças pedidas: retrabalho (de: aguardando-aprovacao-pr), com a mesma [APR] e o mesmo PR"],
  arq:["status.md: Achados abertos, se houver"],elm:["elm_transicao reabrir/assumir/concluir · elm_comentar com o sha","elm_ligar(wi = [DEV], req, implementa) por requisito que a fatia cobre"],
  sen:{jr:"—",pl:"Um Dev Sênior aprova o PR AFK do Pleno",sr:"Outro Sênior, de preferência; ele mesmo só se for o único Sênior ativo"}},

/* ---------- depois do merge ---------- */
 merge:{x:1240,y1:430,y2:444,g:"pill",lab:"below",nome:"Merge",sk:"sa-desenvolver",
  papel:"Dev responsável (no AFK, quem disparou)",agente:"sa-desenvolvedor, o único com gitlab_mesclar_mr",tarefa:"[DEV]",fase:"aceita | aguardando-aprovacao-pr → pronta",
  ctx:{hitl:{papel:"Dev responsável",faz:["Pré-condição: fase aceita (REV APROVADO e VER ACEITO registrados)","PR aberto, sem Draft; o sha tem de ser o aprovado (rebase tira o sha: volta à revisão). Conflito → retrabalho (de: aceita), com a linha “conflito no merge”","gitlab_mesclar_mr(iid, sha, remover_origem=true), com confirmação; sem o MCP, a pessoa mergeia na interface, sem o botão Rebase","Na base: Lições candidatas, créditos e Fase pronta no status.md; pronta no backlog e na sprint; commit <FT> registrar merge e push","Conclui a [DEV] com o saldo, ligada aos requisitos que a fatia cobre, e avisa o P.O. ou o SM"]},
   afk:{papel:"quem disparou o loop (ou o Dev da fatia)",faz:["Pré-condição: a [APR] Aprovar PR concluída, com o sha no comentário","PR aberto, sem Draft; o sha tem de ser o aprovado (rebase tira o sha: volta à revisão). Conflito → retrabalho (de: aguardando-aprovacao-pr), com a linha “conflito no merge”","gitlab_mesclar_mr(iid, sha, remover_origem=true), com confirmação; sem o MCP, a pessoa mergeia na interface, sem o botão Rebase","Na base: Lições candidatas, créditos do lote (rateio 1/n) e Fase pronta no status.md; pronta no backlog e na sprint; commit <FT> registrar merge e push","Conclui a [DEV] com o saldo; a pessoa remove a worktree do loop (git worktree remove, sem --force) e avisa o P.O. ou o SM"]}},
  faz:["Pré-condição: no HITL, fase aceita; no AFK, a [APR] concluída com o sha no comentário","Possível alteração pendente no Drift de negócio (sem decisão, ou com a [ESP] FT não concluída): o merge espera","PR aberto, sem Draft; o sha tem de ser o aprovado (rebase tira o sha: volta à revisão). Conflito → retrabalho, com a linha “conflito no merge”","gitlab_mesclar_mr(iid, sha, remover_origem=true), com confirmação; sem o MCP, a pessoa mergeia na interface, sem o botão Rebase","Na base: Lições candidatas, créditos e Fase pronta no status.md; pronta no backlog e na sprint; commit <FT> registrar merge e push","PR mergeado por fora: confere o merge e registra; pronta já gravada pela sincronização → só conclui a [DEV]","Conclui a [DEV] com o saldo (no HITL, ligada aos requisitos que a fatia cobre; no AFK, o Dev Sênior já ligou na [APR]); a pessoa remove a worktree (git worktree remove, sem --force) e avisa o P.O. ou o SM"],
  arq:["status.md da base: pronta, Lições candidatas, Créditos","backlog.md e sprint-<nn>.md: pronta","commit <FT> registrar merge (só esses três)"],elm:["gitlab_obter_mr · gitlab_mesclar_mr","elm_lancar_horas · elm_transicao concluir a [DEV]","HITL: elm_ligar(wi = [DEV], req, implementa) por requisito que a fatia cobre"]},
 consolidar:{x:1130,y1:430,y2:444,g:"pill",lab:"below",nome:"Consolidar",sk:"sa-consolidar",
  papel:"P.O. ou SM",agente:"sa-produto",tarefa:"[GB] (só o SM lança horas; não conclui)",fase:"pronta → concluida",
  aviso:"É pré-condição da review, da retrospectiva e da virada. A trilha rápida também passa por aqui. Os requisitos e os CT planejados já foram publicados na conclusão da [ESP].",
  faz:s=>["Entrada: Fase pronta no status.md da base; sem ela, o Dev registra o merge (sa-desenvolver.encerrar) ou, mergeado por fora, “sincroniza a sprint”","Drift de negócio, marcado pela revisão e pela verificação: divergência depois do merge vira débito técnico de especificação na sprint aberta; não reabre especificação nem altera artefato (a correção é decisão do P.O.)","Publica no ELM numa confirmação: a ET as-built do PR (pela linha ET; stable e verified de quem consolida), ligada à [DEV]; os casos de teste (ETM: o CT planejado ligado ao IB e o CT novo criado; CSV: o CT.csv é a entrega)","Conclui o IB da fatia (e, na última fatia, o épico: concluido no backlog e na Fase do status.md dele; o cancelado fica como está); não conclui "+(s.line==="afk"?"a [DEV] nem a [APR]":"[DEV], [REV], [VER] nem [APR]"),"Leva os ADRs do PR à pasta de ADRs e corrige o glossário","Fecha: Fase concluida, backlog concluida, sprint concluida com os Créditos; créditos da sessão num comentário na [GB]; lições pela sa-aprender"],
  arq:["status.md da base: Fase concluida","backlog.md: concluida, concluida-em e os ids do EWM que faltam","sprint-<nn>.md: concluida, Tarefa ELM, Créditos, a linha em Créditos de gestão e o Débito de especificação","pasta de ADRs · glossário","commit <id> consolidar"],
  elm:["ET as-built: elm_publicar_req (sigla ET, com a linha Código: PR · merge) · elm_ligar(wi = [DEV], req = ET, implementa)","ETM: elm_ligar(IB, CT planejado) · elm_criar_ct do CT novo; erro → CT.csv importado à mão","elm_comentar + elm_transicao concluir no IB (e no épico)","elm_comentar com os créditos na [GB]; elm_lancar_horas na [GB] só pelo SM (o P.O. nunca)"],
  trv:{rapida:{aviso:"É pré-condição da review, da retrospectiva e da virada.",faz:s=>["Entrada: Fase pronta no status.md da base; sem ela, o Dev registra o merge (sa-desenvolver.encerrar) ou, mergeado por fora, “sincroniza a sprint”","Drift de negócio: divergência depois do merge vira débito técnico de especificação na sprint aberta, sem reabrir especificação","Publica a ET as-built do PR (se houver), ligada à [DEV], e os casos de teste (ETM: os CT novos do CT.csv; CSV: o CT.csv é a entrega)","Conclui o IB da fatia; não conclui "+(s.line==="afk"?"a [DEV] nem a [APR]":"[DEV], [REV], [VER] nem [APR]"),"Leva os ADRs do PR à pasta de ADRs","Fecha: Fase concluida, backlog concluida, sprint concluida com os Créditos; créditos da sessão num comentário na [GB]; lições pela sa-aprender"],elm:["elm_ligar(wi = [DEV], req = ET, implementa) quando há ET as-built","ETM: elm_criar_ct por CT novo; erro → CT.csv importado à mão","elm_comentar + elm_transicao concluir no IB","elm_comentar com os créditos na [GB]; elm_lancar_horas na [GB] só pelo SM (o P.O. nunca)"]}}},
 aprender:{x:1020,y1:430,y2:444,g:"pill",lab:"below",term:true,nome:"Aprender",sk:"sa-aprender",
  papel:"qualquer pessoa",agente:"sa-produto (registrar, promover e retrospectiva)",tarefa:"—",
  faz:["Registrar: fatos, causa (proposta pelo agente, confirmada pela pessoa) e uma entrada L-nnn","Segunda ocorrência da mesma causa: propõe promover a regra R-nn, de preferência como checagem determinística","Retrospectiva de fatia, épico ou sprint, com dados de fluxo, autonomia AFK/HITL e créditos","A de sprint começa pela sincronização com o EWM (a tabela ou 🔄 iguais) e pela consolidação das pronta"],
  arq:["<produto>/aprendizado/licoes.md","Regras aprendidas no .sabia/sabia.md (promover)","<produto>/aprendizado/avaliacoes/"],elm:["Retrospectiva na sessão do P.O. ou do SM: os créditos num comentário na [GB]"]},

/* ---------- Sustentação: Atendimento ---------- */
 atd1:{x:560,y:580,lab:"below",nome:"Assumir",sk:"sa-atender",
  papel:"quem atende",agente:"sa-produto",tarefa:"[ATD] AT-<nnn> <pedido>",
  faz:["Lê a linha e o registro na base (troca para a base com “sim”; pull --ff-only)","Pedido novo ou fora do backlog: sa-triar. Outra categoria: sa-executar","Sem linha viva na sprint aberta: Encaixe do P.O. e para","[ATD] já fechada: mostra o estado; reabre, ou o AT vai a concluido","Grava em-andamento no backlog, na sprint e no registro: commit AT-<nnn> iniciar","Pedido que muda o sistema ou regra não decidida: volta à triagem"],
  arq:["<produto>/sustentacao/atendimento/AT-<nnn>-<slug>.md","backlog.md · sprint-<nn>.md: em-andamento"],elm:["elm_transicao assumir (ja_estava · conflito → forcar · já fechada → reabrir)","Falta o IB [AT-nnn] ou a [ATD]: cria antes","Sem o MCP: ELM pendente no campo **ELM:** do registro"]},
 atd2:{x:650,y:580,lab:"below",nome:"Consultar",sk:"só leitura",
  papel:"quem atende",agente:"sa-produto, com o subagente sa-pesquisador",tarefa:"[ATD]",
  faz:["Banco só em leitura, pelo MCP de consulta","Bundle do ELM pelo pesquisador; sem bundle, ELM remoto","Código só em escopo fechado; lógica complexa: sa-pesquisar antes"],
  arq:["registro: ## Consultas (SQL e contagem) · ## Pesquisa de código"],elm:["elm_buscar_req_local · elm_ler_req_local"]},
 atd3:{x:740,y:580,lab:"below",nome:"Extrair",sk:"fora do git",
  papel:"quem atende",agente:"sa-produto",tarefa:"[ATD]",
  faz:["Dado real (linhas, telas, planilhas) nunca vai para o git","No registro ficam só a SQL, a contagem, o caminho e um resumo que não identifica pessoas","Sessão que não conclui o AT: créditos no registro e commit AT-<nnn> registrar sessão"],
  arq:[".sabia/local/sustentacao/atendimento/AT-<nnn>/<arquivo>"],elm:["elm_lancar_horas a qualquer momento (não conclui)"]},
 atd4:{x:830,y:580,lab:"below",nome:"Responder",sk:"“ok” da pessoa",
  papel:"quem atende",agente:"sa-produto",tarefa:"[ATD]",
  faz:["Rascunho da resposta para o “ok” da pessoa","Quem envia é a pessoa; o agente não manda e-mail nem responde chamado"],
  arq:["registro: ## Resposta enviada (sem dado de cliente)"],elm:["—"]},
 atd5:{x:920,y:580,lab:"below",nome:"Concluir",sk:"saldo",
  papel:"quem atende",agente:"sa-produto",tarefa:"[ATD]",
  faz:["“enviei” ou “conclui o AT-012”","elm_horas mostra o lançado; pergunta só o saldo","Registro: Situação concluido e créditos. Backlog: concluido e concluida-em. Sprint: situação e créditos"],
  arq:["registro · backlog.md · sprint-<nn>.md"],elm:["elm_lancar_horas + elm_transicao concluir na [ATD] e no IB [AT-nnn], numa confirmação","Sem o MCP: ELM pendente [<chave>]"]},
 atd6:{x:1010,y:580,lab:"below",term:true,nome:"Desdobrar",sk:"commit e saída",
  papel:"quem atende",agente:"sa-produto",tarefa:"—",
  faz:["Pergunta o desdobramento: arquivar · alteração ou regra que ninguém decidiu (sa-triar, origem AT-<nnn>) · lição (sa-aprender)","Grava a resposta em Saída e faz o commit único AT-<nnn> concluir, na base","O sa-produto não faz push: entrega o comando pronto"],
  arq:["registro · backlog.md · sprint-<nn>.md"],elm:["—"]},

/* ---------- Sustentação: demais categorias ---------- */
 min1:{x:560,y:680,lab:"below",nome:"Assumir",sk:"sa-executar",
  papel:"quem faz o item",agente:"sa-produto",tarefa:"[IMPL] [BD] [INF] [OPE] [EXT]",
  faz:["Entrada: IM-, BD-, IN-, OP-, EX-nnn ou a tarefa, com linha na ### <Categoria> da ## Sustentação e registro. AT-nnn: sa-atender; pedido novo ou fora do backlog: sa-triar; concluido ou cancelado: para","Sem linha viva na sprint aberta: Encaixe do P.O. e para","Tarefa já fechada: mostra o estado; reabre, ou o item vai a concluido","Grava em-andamento no backlog, na sprint e no registro: commit <ID> iniciar","A pessoa executa o trabalho; o agente não roda script, deploy nem comando em ambiente"],
  arq:["<produto>/sustentacao/<categoria>/<ID>-<slug>.md","backlog.md · sprint-<nn>.md: em-andamento"],elm:["elm_transicao assumir (de outra pessoa: pergunta e forcar; já fechada: reabrir)","Falta o IB do item ou a tarefa: cria antes"]},
 min2:{x:650,y:680,lab:"below",nome:"Registrar",sk:"no registro",
  papel:"quem faz o item",agente:"sa-produto",tarefa:"a da categoria",
  faz:["## O que foi feito: passos e evidência (o que, onde, resultado, link do chamado ou da mudança)","Sem dado de cliente"],
  arq:["registro da categoria",".sabia/local/sustentacao/<categoria>/<ID>/<arquivo>"],elm:["elm_comentar · elm_anexo enviar, se a pessoa quiser"]},
 min3:{x:740,y:680,lab:"below",nome:"Lançar horas",sk:"várias vezes",
  papel:"quem faz o item",agente:"sa-produto",tarefa:"a da categoria",
  faz:["A qualquer momento, em várias sessões","Uma linha por lançamento na tabela Horas","Lançar não conclui","Sessão que não conclui o item: créditos no registro e commit <ID> registrar sessão"],
  arq:["registro: ## Horas · ## Créditos"],elm:["elm_lancar_horas"]},
 min4:{x:830,y:680,lab:"below",term:true,nome:"Concluir",sk:"<ID> concluir",
  papel:"quem faz o item",agente:"sa-produto",tarefa:"a da categoria",
  faz:["Saldo de horas e conclusão numa confirmação","Registro: Situação concluido e créditos. Backlog: concluido e concluida-em. Sprint: situação e créditos","Um commit <ID> concluir","Desdobramento que muda o repositório: sa-triar com origem <ID>"],
  arq:["registro · backlog.md · sprint-<nn>.md"],elm:["elm_horas · elm_lancar_horas · elm_transicao concluir na tarefa e no IB do item"]},

/* ---------- ciclo da sprint ---------- */
 durante:Object.assign(rp(-30),{lab:"in-left",nome:"Durante",sk:"encaixe · troca",
  papel:"P.O., SM ou quem puxa com a aprovação do P.O. (encaixe) · P.O. ou SM (troca)",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["Encaixe é a puxada: todo item entra na sprint aberta por ele, pelo P.O., pelo SM ou por quem puxa com a aprovação do P.O. registrada","A puxada natural é a elegivel do topo com WIP de revisão folgado; a que fura a fila, com WIP no limite, a Sustentação além da reserva e a linha encaixe da sincronização pedem a decisão explícita do P.O.: entra na folga, entra no lugar de uma planejada, entra como especificação ou fica para a próxima","Fatia que concluiu a [ESP] FT (elegivel): a [DEV] nasce no encaixe; fatia nova: entra como especificação, com a [ESP] FT; a Volta à especificação com a [ESP] concluída numa sprint fechada: a [ESP] <id> Revisão <n>","A que sai fica nova ou elegivel, sem sprint, e a linha recebe saiu da sprint; o IB e as tarefas voltam ao backlog do EWM, o IB no estado inicial","Troca AFK → HITL: o P.O. ou o SM grava o modo, sugere revisor e verificador de menor alocação e cria a [REV] e a [VER] que faltam"],
  arq:["sprint-<nn>.md: encaixe: <decisão> (<quem>, <data>)","sprint-<nn>.md: saiu da sprint: encaixe de <FT> (<quem>, <data>)","backlog.md: planejada, sprint, responsavel · modo HITL"],elm:["Encaixe: o IB entra na iteração; a tarefa que já existe move com o dono e a estimativa, só nasce a que falta","A que sai: elm_atualizar_wi(ids, iteracao = backlog)","Troca: a [REV] e a [VER] que já existem movem, as que faltam nascem com o mesmo pai da [DEV]; nenhuma [APR] nasce"]}),
 sincroniza:Object.assign(rp(30),{lab:"in-left",nome:"Sincroniza",sk:"EWM · git ↔ sprint",
  papel:"P.O. ou SM",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["“sincroniza a sprint”: leva o Sabiá até onde o trabalho chegou, também o feito por fora (código, PR, merge, tarefas no EWM)","Cruza o EWM (a iteração da sprint e a de backlog, sem filtro de tipo), o status.md com a fase, a sprint × o backlog e o git (branch, PR, merge)","Itens conhecidos: estado, iteração, dono e estimativa; as tarefas de papel pela fase; o IB do backlog fora do estado inicial; o WI que sumiu. Por fora: entra com o mesmo id","Item do backlog sem IB: linha EWM: criar no backlog (espelhamento)","Git: PR mergeado por fora → pronta, [DEV] concluída, [APR], [REV] e [VER] canceladas; PR aberto ou branch com commits → iniciada","Uma tabela, agrupada por item, com a solução em cada linha (arquivo: · EWM: · manter: · encaixe · triar); “ok” aplica tudo, ou a pessoa ajusta linhas","A situação da fatia e do épico só muda pela skill ou pela evidência do git; na Sustentação, o arquivo recebe o EWM. Sai da sprint, encaixe e épico com a [ESP]: “sim” do P.O.","Nada diverge: sempre a linha “<chave> × EWM: iguais — <n> itens conferidos”","Roda depois de publicar, na pré-condição dos ritos (a rede de proteção roda aqui) e sob pedido. Publicação no EWM: pendente → a primeira linha cria a iteração. Sem o MCP, só as linhas do git"],
  arq:["sprint-<nn>.md · backlog.md · registros de sustentacao/**","status.md: pronta na base (merge por fora) · fase na branch (iniciada por fora)","commit <pai>/Sprint <nn>: sincronizar com o EWM"],elm:["elm_listar_wi (sprint e backlog) · elm_ler_wi","elm_atualizar_wi: iteração, dono, estimativa, título, pai","elm_transicao concluir · reabrir · cancelar","gitlab_listar_mrs: aberto, merged, closed","elm_comentar com os créditos na [GB]"]}),
 review:Object.assign(rp(90),{lab:"above",nome:"Review",sk:"rito",
  papel:"P.O. e time",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["Pré-condição: sincroniza (com a rede de proteção) e confere as fatias pronta que esperam a consolidação, e as de PR mergeado sem pronta. Alguma: para; só segue com o “sim” do P.O. (Fechamento sem consolidar)","Abre pelo resumo do Status das Fatias: concluídas · prontas sem consolidar · iniciadas e planejadas que migram","Cada fatia concluída: o cenário entregue e a evidência do verificacao.md","Depois, o débito técnico de especificação sem tarefa; a correção é decisão do P.O.","Retorno do P.O. na ## Review (ou “sem retorno”); pedido novo → sa-triar (origem: review <chave>); nunca reabre fatia concluída"],
  arq:["sprint-<nn>.md: ## Review (commit <pai>/Sprint <nn>: review)","**Fechamento sem consolidar:** FT-… (<P.O.>, <data>)"],elm:["—"]}),
 retro:Object.assign(rp(150),{lab:"left",nome:"Retro",sk:"sa-aprender",
  papel:"time",agente:"sa-produto",tarefa:"[GB]",
  faz:["A pré-condição vale de novo","Retrospectiva com dados pela sa-aprender: fluxo, autonomia AFK/HITL, créditos","Bom · melhorar · ações, cada ação com dono","Créditos da sessão em Créditos de gestão; do P.O. ou do SM, também num comentário na [GB]"],
  arq:["sprint-<nn>.md: ## Retrospectiva, Créditos de gestão","aprendizado/licoes.md"],elm:["elm_comentar com os créditos na [GB] (sessão do P.O. ou do SM)"]}),
 virada:Object.assign(rp(210),{lab:"left",nome:"Virada",sk:"fecha e replaneja",
  papel:"P.O. ou SM",agente:"sa-produto",tarefa:"[GB] (horas só do SM)",
  faz:["A pré-condição antes da virada: a sincronização dela é a da virada, antes da migração","Números: horas planejadas × lançadas por tipo (DEV, REV, APR, VER, ESP e Sustentação) pelo elm_horas, créditos só do git, a versão do Sabiá; a [GB] sem horas não é falta","Migram as linhas fora de situação terminal (fatias, Especificação, Sustentação) e o débito de especificação sem tarefa: migrada para <chave> na que fecha, migrada de <chave> na próxima; a com saiu da sprint não migra","Vazão, lead time e horas por tipo no histórico; reserva de Sustentação + retrabalho; replaneja com as migradas primeiro, e a próxima nasce com Publicação no EWM: pendente","EWM, nesta ordem: iteração e plano da próxima, o movimento só do que está aberto (o fechado fica onde fechou, com as horas), as linhas novas e a sincronização da próxima","Virada pela metade (sem o MCP, falha no movimento): os arquivos seguem, e a sincronização da próxima faz o movimento","Pai novo, só quando a pessoa diz: nasce a [GB] dele e a antiga conclui com o saldo do SM; a Sustentação, a Manutenção e os IBs de categoria não mudam"],
  arq:["sprint-<nn>.md: ## Números, Situação fechada, migrada para","próxima sprint: migrada de, Publicação no EWM: pendente","backlog.md: sprint e creditos","equipe.json: historico"],elm:["elm_horas(iteracao)","elm_iteracao da próxima (pai novo: a [GB] dele)","elm_atualizar_wi(ids abertos, iteração nova): move, nunca recria"]})
};
S.triar.ctx.afk=S.triar.ctx.hitl;
/* a estação Planejar também é do anel; na linha da sprint ela mostra o planejamento completo */
S.planejar.ctx.sprint={sen:S.planejar.sen};

const ALL={
 epico:["triar","backlog","planejar","iniciar","especificar","entrevistar","prd","revprd","gprd","prdbase","elmpub","espfim","fatiar","gbacklog","backlog@fim"],
 hitl:["triar","ficha","backlog","planejar","iniciar","espft","desenvolver","pesquisar","plano","analise","gplano","implementar","prepr","pr_h","revisar","verificar","merge","consolidar","aprender"],
 afk:["triar","ficha","backlog","planejar","iniciar","espft","desenvolver","pesquisar","plano","analise","gplano","implementar","rev_a","ver_a","pr_a","aprpr","merge","consolidar","aprender"],
 atd:["triar","backlog","planejar","iniciar","atd1","atd2","atd3","atd4","atd5","atd6"],
 min:["triar","backlog","planejar","iniciar","min1","min2","min3","min4"],
 sprint:["planejar","durante","sincroniza","review","retro","virada","planejar@fim"]
};
const SKIP={
 espft:s=>s.art==="nao"?"Sem artefato afetado: a fatia vai direto ao desenvolvimento":null,
 gplano:s=>s.sen==="sr"?"Sênior: aprova o próprio plano (sem GATE)":null
};
const VIA={
 "triar>ficha":"fatia sem épico: a ficha","ficha>backlog":"ficha aprovada: elegivel",
 "epico:triar>backlog":"épico novo ou elegivel","atd:triar>backlog":"AT-nnn e IB [AT-nnn]; na sprint se cabe na reserva","min:triar>backlog":"item e IB do item; a tarefa, na sprint",
 "epico:backlog>planejar":"o épico entra na sprint","hitl:backlog>planejar":"selecionada pela vazão (ou pelo encaixe)","afk:backlog>planejar":"selecionada pela vazão (ou pelo encaixe)",
 "atd:backlog>planejar":"sem sprint aberta: no próximo planejamento","min:backlog>planejar":"sem sprint aberta: no próximo planejamento",
 "epico:planejar>iniciar":"[ESP] criada (ou movida) no EWM","hitl:planejar>iniciar":"[DEV], [REV] e [VER] criadas ou movidas","afk:planejar>iniciar":"só a [DEV]",
 "atd:planejar>iniciar":"a [ATD] nasce com o item na sprint","min:planejar>iniciar":"a tarefa nasce com o item na sprint",
 "iniciar>especificar":"[ESP] → sa-especificar","iniciar>espft":"[ESP] FT → sa-especificar","hitl:espft>desenvolver":"elegivel: [DEV] → sa-desenvolver","afk:espft>desenvolver":"elegivel: uma fatia ou o lote do loop","hitl:iniciar>desenvolver":"[DEV] → sa-desenvolver","afk:iniciar>desenvolver":"uma fatia ou o lote do loop",
 "iniciar>atd1":"[ATD] → sa-atender","iniciar>min1":"[IMPL]… → sa-executar",
 "especificar>entrevistar":"pasta de trabalho","entrevistar>prd":"decisões, ATAs e protótipo aprovado","prd>revprd":"subagente revisor","revprd>gprd":"OK: o P.O. decide",
 "gprd>prdbase":"aprovado: sa-especificar","prdbase>elmpub":"PRD aprovado na base","elmpub>espfim":"publicado e ligado à [ESP]","espfim>fatiar":"[ESP] concluída: P.O. ou SM, agente sa-produto","fatiar>gbacklog":"rascunho das fatias",
 "gbacklog>backlog":"fatias no backlog e IBs no EWM: encaixe ou planejamento",
 "desenvolver>pesquisar":"iniciada na base, branch, status.md e [DEV]","pesquisar>plano":"research.md","plano>analise":"subagente revisor","analise>gplano":"OK: troca de modo e GATE",
 "gplano>implementar":"plano aprovado","analise>implementar":s=>s.sen==="sr"?"plano do Sênior":"Pleno dispensou o GATE",
 "implementar>prepr":"validação completa","prepr>pr_h":"APROVADO: push e PR","pr_h>revisar":"o revisor assume a [REV]","revisar>verificar":"APROVADO, depois do push","verificar>merge":"ACEITO: aceita",
 "implementar>rev_a":"fase revisando","rev_a>ver_a":"APROVADO","ver_a>pr_a":"ACEITO: verificada","pr_a>aprpr":"aguardando-aprovacao-pr e [APR] Aprovar PR","aprpr>merge":"aprovado com o sha",
 "merge>consolidar":"pronta na base; avisa o P.O. ou o SM","consolidar>aprender":"lições candidatas",
 "atd1>atd2":"[ATD] assumida; AT em-andamento","atd2>atd3":"consultas registradas","atd3>atd4":"resultado fora do git","atd4>atd5":"a pessoa enviou","atd5>atd6":"[ATD] e IB do AT concluídos",
 "min1>min2":"tarefa assumida; item em-andamento","min2>min3":"trabalho registrado","min3>min4":"saldo",
 "planejar>durante":"sprint publicada no EWM","durante>sincroniza":"por fora, divergências e git","sincroniza>review":"último dia: pré-condição","review>retro":"pré-condição de novo","retro>virada":"ações com dono","virada>planejar":"migradas primeiro"
};

const EXTRA=[
 /* desenhados no mapa */
 {id:"sr_bypass",f:"analise",t:"implementar",kind:"alt",lines:["hitl","afk"],pts:[[793,310],[793,334],[937,334],[937,312]],rad:10,lp:[865,334],
  when:s=>s.sen!=="jr",why:"Júnior: o GATE do plano é obrigatório",
  lab:s=>s.sen==="sr"?"Sênior aprova o próprio plano (plano do Sênior)":s.sen==="pl"?"Pleno dispensou o GATE (registrado no Histórico)":"sem GATE: Sênior, ou Pleno que dispensa",
  short:s=>s.sen==="pl"?"Pleno: se dispensar":s.sen==="sr"?"Sênior: sem GATE":"sem GATE: Sênior · Pleno"},
 {id:"cons_rev",f:"consolidar",t:"review",kind:"xfer",lines:["hitl","afk"],toLine:"sprint",
  lab:"a consolidação é pré-condição da review, da retrospectiva e da virada",short:"consolidação: pré-condição da review"},
 /* aparecem com a linha e a estação escolhidas */
 {id:"an_rep",f:"analise",t:"plano",kind:"loop",lines:["hitl","afk"],bend:-1,lab:s=>s.tr==="rapida"?"AJUSTAR: corrige o plano, até 2 rodadas; lacuna de negócio para no P.O.":"AJUSTAR: corrige o plano, até 2 rodadas; falta do PRD ou da ficha volta às decisões",short:"AJUSTAR ↺ até 2 rodadas"},
 {id:"gate_rep",f:"gplano",t:"plano",kind:"loop",lines:["hitl","afk"],bend:-1,when:s=>s.sen!=="sr",lab:"reprovado: fase planejando; a mesma [APR] segue em andamento",short:"reprovado ↺"},
 {id:"troca",f:"analise",t:"durante",kind:"xfer",lines:["afk"],toLine:"sprint",bend:-1,tname:"Troca para HITL (P.O.)",
  lab:"plano AFK com risco: o Dev aceita a sugestão; bloqueada (aguardando troca para HITL); o P.O. troca",short:"risco: troca para HITL"},
 {id:"retoma",f:"durante",t:"desenvolver",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Desenvolver (HITL)",
  lab:"trocada para HITL: o Dev retoma pela sa-desenvolver e volta ao sa-plano.plano.gate, com GATE pela senioridade",short:"o Dev retoma no HITL"},
 {id:"encaixe",f:"desenvolver",t:"durante",kind:"xfer",lines:["hitl","afk"],toLine:"sprint",tname:"Encaixe (P.O.)",
  lab:"fora da sprint: “fale com o P.O. ou o SM”; a puxada é sempre o encaixe",short:"fora da sprint: encaixe"},
 {id:"pre_rep",f:"prepr",t:"implementar",kind:"loop",lines:["hitl"],bend:-1,lab:"REVISAR: tarefas [R<n>], até 2 vezes; persistindo, a pessoa decide",short:"REVISAR ↺ até 2 vezes"},
 {id:"rev_rep",f:"revisar",t:"implementar",kind:"loop",lines:["hitl"],bend:-1,lab:"REVISAR: retrabalho (de: em-revisao); a [REV] fica em andamento; correção no mesmo PR",short:"REVISAR ↺ mesmo PR"},
 {id:"ver_rej",f:"verificar",t:"implementar",kind:"loop",lines:["hitl"],bend:-1,lab:"REJEITADO: retrabalho (de: em-verificacao); o PR volta a passar pela revisão",short:"REJEITADO ↺ volta à revisão"},
 {id:"reva_rep",f:"rev_a",t:"implementar",kind:"loop",lines:["afk"],bend:1,lab:"REVISAR: tarefas [R<n>], até 2 rodadas; a 2ª reprovação bloqueia",short:"REVISAR ↺ até 2 rodadas"},
 {id:"vera_rej",f:"ver_a",t:"implementar",kind:"loop",lines:["afk"],bend:1,lab:"REJEITADO: volta à implementação e passa de novo pela revisão; a 2ª rejeição bloqueia",short:"REJEITADO ↺ e revisa de novo"},
 {id:"apr_rep",f:"aprpr",t:"implementar",kind:"loop",lines:["afk"],bend:1,lab:"mudanças pedidas: retrabalho (de: aguardando-aprovacao-pr); a mesma [APR] e o mesmo PR",short:"mudanças ↺ mesmo PR"},
 {id:"revprd_rep",f:"revprd",t:"prd",kind:"loop",lines:["epico"],bend:1,lab:"AJUSTAR: volta ao PRD, até 2 rodadas",short:"AJUSTAR ↺"},
 {id:"gprd_rep",f:"gprd",t:"entrevistar",kind:"loop",lines:["epico"],bend:1,lab:"decisão em aberto que muda comportamento: volta à entrevista",short:"decisão em aberto ↺"},
 {id:"gbk_rep",f:"gbacklog",t:"fatiar",kind:"loop",lines:["epico"],bend:1,lab:"repete até o “ok”; precisa da fatia ponta a ponta",short:"ajustes ↺"},
 {id:"prd_mud",f:"fatiar",t:"prd",kind:"loop",lines:["epico"],bend:1,lab:"conceito do PRD que precisa mudar: sa-prd.mudanca (Especificador), antes de fatiar; versão nova do PRD, revisão P e GATE de novo, e a [ESP] publica a versão nova",short:"mudança do PRD ↺"},
 {id:"atd_back",f:"atd1",t:"triar",kind:"xfer",lines:["atd"],toLine:"hitl",tname:"Triagem",lab:"muda o sistema ou tem regra não decidida: volta à triagem",short:"não é Sustentação: triagem"},
 {id:"atd_alt",f:"atd6",t:"triar",kind:"xfer",lines:["atd"],toLine:"hitl",tname:"Triagem",lab:"alteração (defeito ou mudança) ou regra que ninguém decidiu: sa-triar com origem AT-<nnn>",short:"alteração ou regra: triagem"},
 {id:"atd_lic",f:"atd6",t:"aprender",kind:"xfer",lines:["atd"],toLine:"hitl",tname:"Aprender",lab:"consulta reaproveitável: lição pela sa-aprender",short:"lição: aprender"},
 {id:"min_enc",f:"min1",t:"durante",kind:"xfer",lines:["min"],toLine:"sprint",tname:"Encaixe (P.O.)",lab:"fora da sprint ou da reserva: Encaixe do P.O.",short:"fora da reserva: encaixe"},
 {id:"min_tri",f:"min4",t:"triar",kind:"xfer",lines:["min"],toLine:"hitl",tname:"Triagem",lab:"desdobramento que muda o repositório: sa-triar com origem <ID>",short:"muda o repositório: triagem"},
 {id:"sync_tri",f:"sincroniza",t:"triar",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Triagem",lab:"item por fora que não está no backlog (fatia, épico ou Sustentação): sa-triar (importar do EWM)",short:"fora do backlog: triagem"},
 {id:"rev_novo",f:"review",t:"triar",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Triagem",lab:"pedido novo na review: sa-triar (origem: review <chave>); nunca reabre fatia concluída",short:"pedido novo: triagem"},
 {id:"retro_apr",f:"retro",t:"aprender",kind:"xfer",lines:["sprint"],toLine:"hitl",tname:"Aprender",lab:"retrospectiva com dados pela sa-aprender",short:"retrospectiva: aprender"}
];

const SERV=[
 {sk:"sabia",nome:"Instalar e compilar",desc:"CLI: instalar, atualizar, rota e toolkits",papel:"quem instala o Sabiá na máquina",agente:"terminal (npx sabia)",tarefa:"—",
  faz:["npx sabia@next instalar: baixa o framework para ~/.sabia/framework/, pergunta os alvos (Kiro, opencode) e compila as skills","Compilar (as-built): fluxo/ + padrao/ + skills/ do framework viram uma skill por sa-*, com a tabela de cada fluxo e um arquivo por passo, em ~/.sabia/compilado/<alvo>/; o toolkit fica fora da compilação: a skill só marca o gancho ⇢ no passo com desvio","Instala na pasta do usuário: no opencode, ~/.config/opencode/skills/; no Kiro, o power (kiro-cli powers install). Nada vai para o projeto","sabia atualizar recompila (também quando só o compilador mudou); sabia desinstalar apaga a instalação e a compilação","sabia rota <arquivo> (ou <tasks.md>#<tarefa>): o passo com desvio, o dono, o toolkit e as travas; sabia rota --fluxo <skill.fluxo>: o fluxo resolvido no projeto, em tabela, grafo ASCII e Mermaid; sabia rota --mapa: as arestas entre fluxos","sabia toolkits listar|baixar|instalar|atualizar|remover: toolkits em ~/.sabia/toolkits/, com a origem e o sha; pelo nome do índice ou por <url-git|pasta>[@ref][#subpasta] (toolkit numa subpasta de um monorepo; pasta local com @ref vem do commit)","remover avisa quando o agentes.json do projeto ainda usa o toolkit"],
  arq:["~/.sabia/framework/ · ~/.sabia/compilado/<alvo>/","~/.sabia/inventario.json","~/.sabia/toolkits/<nome>/ (.origem.json)"],elm:["O mcp.json sobe os MCPs do Sabiá (mcp-elm, mcp-gitlabpr, mcp-elk) com uvx"]},
 {sk:"sa-setup",nome:"Configurar o projeto",desc:"Wizard de 9 etapas, atualização e customizar",papel:"quem configura o projeto",agente:"sessão padrão",tarefa:"—",
  faz:["Roda na sessão padrão; uma pergunta por mensagem; nada é gravado antes do “ok” da revisão (W8)","Projeto, comandos (roda de verdade), git, PR e banco; avisa que quem desenvolve precisa de push na base","Pasta do produto, glossário, ADRs e o pa do ELM, montado bloco a bloco com a pessoa (inclui a Categoria do IB Manutenção); as políticas do ELM: ET, Casos de teste (ETM ou CSV), REG com dados técnicos e Telas","Inventário de skills e toolkits; um cartão por agente para escolher as skills; os desvios de toolkit vão ao agente dono do passo, e os tipos com skill de toolkit, ao dono de cada passo de desvio do tipo","Modo atualização: “atualizar a configuração do Sabiá” e “atualizar os agentes do Sabiá”; acrescenta só o que falta","Modo customizar: trocar, inserir ou remover um passo de fluxo e trocar um padrão neste projeto (C1 a C4); “o que este projeto mudou?”; descustomizar"],
  arq:[".sabia/sabia.md (preserva ## Regras aprendidas) e o ponteiro .kiro/steering/sabia.md",".sabia/config/agentes.json",".kiro/config/elm/pa_<nome>.json",".kiro/agents/sa-*.json · .opencode/agents/sa-*.md (gerados)",".sabia/fluxo/ · .sabia/padrao/ (só ao customizar) · .sabia/http.sh (opcional)","pasta do produto: backlog.md mínimo (Épicos, Fatias, Sustentação), aprendizado/, fatias/"],
  elm:["elm_setup_descobrir para montar o pa","elm_backlog: backlog do produto no EWM","elm_status confere a configuração"]},
 {sk:"sa-status",nome:"Onde parei",desc:"Painel, próxima ação e fechar a sessão",papel:"qualquer pessoa",agente:"todos, menos o pesquisador",tarefa:"a do papel de quem fecha a sessão",
  faz:["Só leitura: status.md das branches, worktrees e remotas, PRs, backlog, sprint e acordos","Painel: em andamento, iniciadas sem branch, esperando pessoa (com o WIP e a possível alteração: quem decide), retrabalho, aguardando especificação, prontas esperando consolidação, elegíveis, épicos pela Fase, PRD aprovado aguardando fatiamento, pendência e débito de especificação, reserva, EWM, fechamento, ELM pendente","EWM pela listagem da sprint, só leitura: por fora, divergências e ids a conferir; sprint com Publicação no EWM: pendente não é listada","Sugere a próxima ação de maior alavanca","Fechar a sessão: Histórico, tasks.md, horas na tarefa do papel e créditos do Kiro (creditos.py); commit só com “ok”, nunca push (fatia mergeada: o Gravar na base)","P.O. ou SM no agente de produto: os créditos também num comentário na [GB]; horas na [GB], só o SM (o P.O. nunca)"],
  arq:["linha de créditos no status.md, na ficha, no status.md do épico ou em Créditos de gestão"],elm:["elm_listar_wi da iteração da sprint, sem tipo, no painel","ELM pendente conta os itens do backlog sem IB → sa-triar ou sincroniza a sprint","elm_horas · elm_lancar_horas ao fechar a sessão","elm_comentar: créditos na [GB]","gitlab_listar_mrs"]},
 {sk:"sa-sync",nome:"Sincronizar o bundle",desc:"Cópia local do DOORS Next, nas duas vias",papel:"quem precisa do bundle",agente:"sessão padrão",tarefa:"—",
  faz:["Plano, conflitos perguntados, baixar e enviar com “sim”; o baixar grava a data da sincronização (sync.md)","Commit ELM - Sincronizar bundle na sessão padrão, mesmo sem nada baixado; num agente, entrega o comando","Pergunta se indexa o bundle","Visualização: o explorar.html na pasta do bundle, que abre no navegador sem internet (busca e filtros por tipo, pasta e galáxia)"],
  arq:["bundle do ELM (caminho no sabia.md) · sync.md · explorar.html"],elm:["elm_sync · elm_indexar_local · elm_explorar_local"]}
];

const ROLES=[
 {nome:"P.O. / SM",who:"analista de negócio; um P.O. e um SM ativos, que podem ser a mesma pessoa",tarefa:"[GB] do SM",c:"--navy",agente:"sa-produto",st:"triar",line:"hitl",
  faz:["Triagem (com os artefatos afetados da fatia) e GATE da ficha","Fatiamento do PRD aprovado e GATE do backlog, logo depois da [ESP]; refinamento só cancela","Planejamento, encaixe, troca de modo e ritos","Sincronização com o EWM: leva o Sabiá até onde o trabalho chegou","Consolidação da fatia pronta: ET as-built, casos de teste e débito de especificação","Horas na [GB], só do SM; o P.O. nunca lança. Os créditos de cada sessão vão num comentário nela"]},
 {nome:"Especificador",who:"uma [ESP] por sessão: o épico ou a fatia",tarefa:"[ESP]",c:"--teal",agente:"sa-especificador",st:"especificar",line:"epico",
  faz:["Entrevista em rodadas e a ATA de cada reunião com o cliente","Protótipo aprovado pelo cliente antes do PRD, no projeto com tela","PRD e revisão P; aprova os artefatos no GATE do PRD","PRD na base, publicação no ELM ligada à [ESP] e conclusão da [ESP]","Mudança do PRD aprovado ainda não fatiado (sa-prd.mudanca)","[ESP] FT da fatia: os artefatos que ela inclui, altera ou exclui, revisados, aprovados e publicados"]},
 {nome:"Dev",who:"a fatia é dele de ponta a ponta",tarefa:"[DEV]",c:"--blue",agente:"sa-desenvolvedor",st:"desenvolver",line:"hitl",
  faz:["Compromisso, iniciada na base, branch e pasta da fatia","Pesquisa, plano e implementação com TDD","PR e retrabalho no mesmo PR","Merge do PR aprovado e pronta na base","[DEV] já fechada na retomada: reabrir, ou o registro do merge se o PR já entrou"]},
 {nome:"Revisor",who:"sempre um Dev Sênior",tarefa:"[REV]",c:"--cyan",agente:"sa-revisor",st:"revisar",line:"hitl",
  faz:["Lê o PR nos dois eixos: spec e padrões","Indica a possível alteração; com a pessoa, decide se volta à especificação","PR mudou depois da aprovação: reabre a [REV]","Revisor único, se for o só Sênior ativo"]},
 {nome:"Aprovador",who:"Dev Sênior, nos gates sem tarefa de papel",tarefa:"[APR]",c:"--navy",agente:"sa-revisor",st:"gplano",line:"hitl",
  faz:["GATE do plano, em aguardando-aprovacao-plano (Júnior sempre, Pleno se pedir)","Aprovar PR do AFK, em aguardando-aprovacao-pr, com o sha; liga a [DEV] aos requisitos","A mesma [APR] volta depois de ajustes; já concluída, reabre"]},
 {nome:"Verificador",who:"QA; nunca quem implementa",tarefa:"[VER]",c:"--green",agente:"sa-verificador",st:"verificar",line:"hitl",
  faz:["Aceite de ponta a ponta com evidência; aceito, a fatia vai a aceita","Indica a possível alteração; com a pessoa, decide se volta à especificação","Nunca em produção","CT.csv: a evidência de cada cenário, ligada ao CT planejado"]},
 {nome:"Quem faz a Sustentação",who:"quem tem atende: true",tarefa:"[ATD] [IMPL] …",c:"--teal",agente:"sa-produto",st:"atd1",line:"atd",
  faz:["Atendimento pela sa-atender","Demais categorias pela sa-executar","Um IB por item; a tarefa nasce quando ele entra na sprint","Tarefa já fechada na retomada: reabrir ou concluir o item","Dado de cliente fora do git"]},
 {nome:"Orquestrador",who:"agente do loop AFK",tarefa:"[DEV] de quem disparou",c:"--blue",agente:"sa-orquestrador",st:"desenvolver",line:"afk",
  faz:["Lote de fatias AFK planejadas, uma worktree por fatia","A iniciada do lote na base, num commit só, antes das worktrees","Uma fase por contexto limpo, com subagentes","Para no PR, em aguardando-aprovacao-pr; nunca faz merge"]}
];

const AGENTS=[
 {id:"sa-produto",quem:"P.O., SM, quem faz a Sustentação",skills:["triar","entrevistar","fatiar","planejamento","atender","executar","consolidar","aprender","iniciar","status"],sub:"pesquisador",push:"não faz",pk:"no",obs:"Escreve a pasta do produto, glossário, ADRs e .sabia/local/sustentacao/; o único que grava o .sabia/sabia.md (só ## Regras aprendidas, pela sa-aprender, e só na raiz); entrega o comando de push. Fatia o PRD publicado (GATE do backlog). Créditos de cada sessão do P.O. ou do SM num comentário na [GB]. Na consolidação, recebe a skill de toolkit do tipo ET (sa-consolidar.consolidar.elm)"},
 {id:"sa-especificador",quem:"Especificador",skills:["especificar","entrevistar","prd","iniciar","status"],sub:"pesquisador · revisor",push:"não faz",pk:"no",obs:"Uma [ESP] por sessão, do épico ou da fatia: pasta de trabalho .sabia/local/especificacao/, ATA, protótipo, PRD e GATE do PRD; publica no ELM na conclusão da [ESP], ligando cada requisito a ela (rastreia). Recebe as skills de toolkit dos tipos desviáveis (sa-prd.prd.escrever, sa-especificar.fatia.escrever, sa-especificar.reuniao.escrever)"},
 {id:"sa-pesquisador",quem:"subagente de quem planeja ou atende",skills:["pesquisar"],sub:"—",push:"não faz",pk:"no",obs:"Só leitura; escreve só o research.md; MCP de banco só para consulta"},
 {id:"sa-desenvolvedor",quem:"Dev",skills:["plano","codificar","desenvolver","iniciar","status"],sub:"pesquisador · revisor · verificador (e os agentes de toolkit ligados)",push:"pergunta",pk:"ask",obs:"Único com gitlab_mesclar_mr (merge do PR aprovado, com confirmação); no HITL, liga a [DEV] aos requisitos ao concluí-la. Grava na base a situação da fatia (iniciada, pronta) no backlog.md e em sprints/, com push da base perguntado. Recebe o desvio de toolkit do passo sa-codificar.codificar.tarefa"},
 {id:"sa-revisor",quem:"Revisor e aprovador (Dev Sênior)",skills:["revisar","iniciar","status"],sub:"—",push:"pergunta",pk:"ask",obs:"Assume a [REV] ou a [APR]; na [APR] Aprovar PR aprovada, liga a [DEV] aos requisitos; revisa também o PRD e os artefatos da [ESP] FT (rubrica P); como subagente, sem push e sem ELM"},
 {id:"sa-verificador",quem:"Verificador (QA)",skills:["verificar","iniciar","status"],sub:"—",push:"pergunta",pk:"ask",obs:"Nunca contra produção nem com dado real; sem acesso ao GitLab"},
 {id:"sa-orquestrador",quem:"loop AFK",skills:["orquestrar","status","desenvolver","plano","codificar"],sub:"pesquisador · desenvolvedor · revisor · verificador",push:"no loop",pk:"loop",obs:"Grava a iniciada do lote no backlog.md e em sprints/, num commit na base, com push perguntado. Push e PR das branches só se o lote autorizou; nunca faz merge nem escreve código"}
];

const TREE=[
 {d:".sabia/",open:true,c:[
  {f:"sabia.md",b:"gen",w:"sa-setup grava o arquivo; a seção ## Regras aprendidas é da sa-aprender (promover), no sa-produto",q:"sempre carregado (pelo ponteiro .kiro/steering/sabia.md e pelo opencode.json)",o:"O único steering do fluxo, um por projeto: resumo, configuração (pasta do produto, comandos, git, banco, autonomia, agentes, tabela Sustentação), as políticas do ELM (ET, Casos de teste, REG com dados técnicos, Telas), as tabelas Desvios de toolkit e Tipos com skill de toolkit e as regras aprendidas. A setup refaz o arquivo e preserva as Regras aprendidas.",st:"aprender",line:"hitl"},
  {d:"config/",c:[{f:"agentes.json",b:"gen",w:"sa-setup",q:"ao configurar ou atualizar os agentes",o:"As escolhas do projeto para os agentes: caminhos, comandos, skills, MCPs, toolkits e passos por agente, e a versão do Sabiá (\"sabia\"). É a entrada do gerador."}]},
  {d:"fluxo/  (só ao customizar)",c:[{f:"<skill>/<fluxo>/passos/<passo>.md",b:"gen",w:"sa-setup, modo customizar (sessão padrão; nenhum agente escreve)",q:"trocar ou inserir um passo",o:"O passo que o projeto trocou (com a base: o sha do original) ou inseriu. O agente dono do fluxo recebe só o delta no prompt."},{f:"<skill>/<fluxo>/<fluxo>.md",b:"gen",w:"sa-setup, modo customizar",q:"inserir ou remover um passo",o:"Só as operações: inserir (id, depois) e remover. Passo com trava não sai."}]},
  {d:"padrao/  (só ao customizar)",c:[{f:"<skill>/<nome>.md",b:"gen",w:"sa-setup, modo customizar",q:"trocar um padrão",o:"O padrão de artefato trocado neste projeto (PRD, status.md, ficha…); vale para todos os agentes."}]},
  {f:"http.sh",b:"gen",w:"sa-setup (opcional)",q:"na verificação",o:"Única chamada HTTP que o verificador faz sem perguntar: só à URL de teste, com corpo da pasta massa/.",st:"verificar",line:"hitl"},
  {f:"glossario.md · adr/",b:"git",w:"GATE do PRD · sa-consolidar (leva os ADRs do PR)",q:"termos novos e decisões que devem durar",o:"Ficam em .sabia/; o projeto que já os tem em outro lugar aponta o caminho no sabia.md.",st:"consolidar",line:"hitl"},
  {d:"planejamento/  (pasta do produto)",open:true,c:[
   {f:"backlog.md",b:"git",w:"cada situação, quem a muda: sa-triar · sa-fatiar · sa-planejamento · sa-especificar · Dev e orquestrador (iniciada, pronta) · sa-consolidar · sa-atender · sa-executar",q:"a cada triagem, GATE, sprint, início, merge e consolidação",o:"Épicos, uma tabela de Fatias (origem EP-nn ou Manutenção) e a Sustentação, com uma seção por categoria: situação, prioridade, sprint, responsável, ids do EWM com o tipo e créditos. A linha da Sustentação: o IB Sustentação e a [GB], criados no modo inicial, e o IB Manutenção; cada categoria abre com o IB dela. Todo IB triado nasce no backlog do EWM, no estado inicial.",st:"backlog",line:"hitl"},
   {f:"equipe.json",b:"git",w:"sa-planejamento (modo inicial e virada)",q:"ao formar o time e na virada",o:"Pessoas, papéis, senioridade dos Devs, quem atende, horas de revisão e especificação e o histórico de vazão. Exatamente um P.O. e um SM ativos, que podem ser a mesma pessoa; o SM é o dono da [GB].",st:"planejar",line:"sprint"},
   {f:"acordos.md",b:"git",w:"sa-planejamento",q:"modo inicial",o:"Cadência Scrumban, WIP das fases que esperam pessoa, Definition of Ready e Done, tamanhos, a reserva de Sustentação e retrabalho e o lançamento de horas: na [GB], só o SM; o P.O. nunca.",st:"planejar",line:"sprint"},
   {f:"roadmap.md",b:"git",w:"sa-planejamento",q:"modo inicial e revisões",o:"Épicos ordenados por valor e risco; sem PRD = a descobrir.",st:"planejar",line:"sprint"},
   {d:"epicos/<EP>-<slug>/",c:[{f:"rascunho.md · decisoes.md",b:"git",w:"sa-triar (pasta antecipada) · sa-especificar (com o PRD aprovado)",q:"na triagem do épico; no GATE do PRD, a versão da especificação",o:"O caderno do levantamento (pedido, levantamento de cada sessão, dúvidas para a próxima reunião, versões do protótipo, pendências do ELM) e as decisões D-nn. A triagem também cria o status.md do épico, na Fase rascunho.",st:"triar",line:"epico"},
    {f:"prd.md · elm/ · revisao-prd-<N>.md",b:"git",w:"sa-especificar (PRD na base) · sa-prd.mudanca",q:"depois do GATE do PRD",o:"O PRD aprovado (registro de decisões, com a seção Mudanças), os conceitos OKF (HF, REG, GL, EL, CT planejado, ET inicial e as ATAs) e as revisões P. Os ids do ELM voltam aos conceitos na publicação.",st:"prdbase",line:"epico"},
    {f:"prototipo/",b:"git",w:"sa-especificar (PRD na base)",q:"com Telas = sim, no GATE do PRD",o:"As versões registradas do protótipo (prototipo-v<N>-<slug>.<ext>), só com dado fictício; cada uma também é anexo da [ESP].",st:"entrevistar",line:"epico"},
    {f:"status.md",b:"git",w:"sa-triar cria · sa-especificar · sa-prd · sa-fatiar · sa-consolidar",q:"a cada fase e a cada sessão",o:"A Fase do épico (rascunho → em-revisao → aprovado → fatiado → concluido; em-revisao (de: aprovado) na mudança antes do fatiamento), a [ESP], o responsável, o início e os créditos de cada sessão. Até o GATE do PRD vale o da pasta de trabalho.",st:"especificar",line:"epico"}]},
   {d:"fatias/",c:[{f:"FT-<nnn>-<slug>.md",b:"git",w:"sa-triar (Manutenção) · sa-fatiar (de épico) · sa-especificar.fatia (Especificado e Créditos)",q:"na triagem, no fatiamento e na [ESP] FT",o:"A ficha: regras e cenários na padrão; Comportamento e Como verificar na rápida; a seção Artefatos afetados (inclui · altera · exclui, com o impacto e a coluna Especificado). Os créditos da [ESP] FT na seção Créditos. No rodapé, as pendências do ELM da fatia não iniciada, dividida ou cancelada e as da [ESP] FT.",st:"ficha",line:"hitl"}]},
   {d:"sprints/2026/",c:[{f:"sprint-03.md",b:"git",w:"sa-planejamento; cada situação, quem a muda",q:"planejar, encaixe, sincronizar, review, retro, virada e a cada situação",o:"Meta, fatias, especificação (as [ESP] de épico e de fatia, com a Revisão <n>), Sustentação (uma seção por categoria), capacidade, Créditos de gestão, Débito de especificação, review, retrospectiva e números. Status e Situação ao vivo, no mesmo commit do backlog.md. Créditos de gestão: uma linha por sessão do P.O. ou do SM, com o mesmo número no comentário da [GB]. Publicação no EWM: pendente no cabeçalho enquanto a sprint não foi publicada. O item que volta ganha linha nova: a viva é a sem saiu da sprint. A chave é 2026/Sprint 03; a ordem das sprints é a da data de início (o nome do pai é livre).",st:"planejar",line:"sprint"}]},
   {d:"sustentacao/",c:[{d:"atendimento/",c:[{f:"AT-012-<slug>.md",b:"git",w:"sa-triar cria; sa-atender completa",q:"por item de Atendimento",o:"Pedido, consultas (SQL e contagem), resposta enviada, horas, créditos e saída. Sem dado de cliente.",st:"atd1",line:"atd"}]},
    {d:"operacao/",c:[{f:"OP-001-<slug>.md",b:"git",w:"sa-triar cria; sa-executar completa",q:"por item de Operação",o:"Pedido e O que foi feito: passos e evidência, sem dado de cliente. As outras categorias seguem o mesmo formato, cada uma na sua pasta.",st:"min2",line:"min"}]}]},
   {d:"aprendizado/",c:[{f:"licoes.md",b:"git",w:"sa-aprender (a consolidação chama o modo registrar)",q:"a cada lição",o:"Lições L-nnn, que podem virar checagem ou regra do revisor.",st:"aprender",line:"hitl"},
    {f:"avaliacoes/",b:"git",w:"sa-aprender",q:"casos de avaliação",o:"Casos para avaliar o fluxo em retrospectivas.",st:"aprender",line:"hitl"}]}
  ]},
  {d:"local/  (fora do git)",c:[
   {f:"wt/<ft>/",b:"local",w:"sa-orquestrador",q:"uma por fatia AFK do lote",o:"Worktree da fatia no loop; quem remove é a pessoa, depois do merge.",st:"desenvolver",line:"afk"},
   {f:"especificacao/<EP>-<slug>/",b:"local",w:"sa-especificar · sa-prd · revisor",q:"até o GATE do PRD",o:"Pasta de trabalho do épico: rascunho.md, decisoes.md, status.md, prd.md, elm/ e as revisões do PRD; reunioes/ (a transcrição, que nunca vai para anexo, base nem ELM) e, com Telas = sim, prototipo/. O que sobe à [ESP] como anexo é a última versão de cada .md.",st:"especificar",line:"epico"},
   {f:"especificacao/FT-<nnn>-<slug>/elm/",b:"local",w:"sa-especificar.fatia",q:"na [ESP] FT, até a aprovação",o:"Os conceitos que a fatia inclui, altera ou exclui, em trabalho; aprovados, vão à base em .kiro/specs/ft-<nnn>-<slug>/elm/.",st:"ficha",line:"hitl"},
   {f:"sustentacao/<pasta>/<ID>/<arquivo>",b:"local",w:"sa-atender · sa-executar",q:"quando há dado real",o:"Dado de cliente: extrações, telas, planilhas. Nunca vai para o git.",st:"atd3",line:"atd"},
   {f:"verificacao/<ft>/",b:"local",w:"verificador",q:"na verificação",o:"Evidências com dado sensível.",st:"verificar",line:"hitl"},
   {f:"loop-*.md",b:"local",w:"sa-orquestrador",q:"a cada lote",o:"Log do lote do loop AFK.",st:"desenvolver",line:"afk"}
 ]}
 ]},
 {d:".kiro/",open:true,c:[
  {d:"steering/",c:[{f:"sabia.md",b:"gen",w:"sa-setup",q:"sempre carregado",o:"Ponteiro para o .sabia/sabia.md."}]},
  {d:"config/elm/",c:[{f:"pa_<nome>.json",b:"gen",w:"sa-setup, com a pessoa, bloco a bloco",q:"um por project area",o:"Configuração do ELM lida pelo mcp-elm: tipos, campos obrigatórios, classificação por prefixo, iterações e o backlog do produto."}]},
  {d:"agents/",c:[{f:"sa-*.json",b:"gen",w:"gerar_agentes.py da sa-setup",q:"“atualizar os agentes do Sabiá”",o:"Sete agentes no formato V3, com permissões mínimas por papel, as skills escolhidas e o delta do que o projeto customizou."}]},
  {d:"specs/<ft>-<slug>/  (na branch da fatia)",open:true,c:[
   {f:"status.md · .config.kiro",b:"git",w:"sa-desenvolver cria; quem conduz a fase atualiza; pronta, o Dev na base ou a sincronização, pelo merge por fora",q:"a cada fase",o:"Fase, branch, PR, modo, Histórico, drift de negócio, Lições candidatas e créditos. Depois do merge vale o da base: pronta e concluida só existem lá.",st:"desenvolver",line:"hitl"},
   {f:"research.md",b:"git",w:"sa-pesquisar (commit da sa-plano)",q:"antes do plano",o:"Pesquisa compactada com arquivo:linha.",st:"pesquisar",line:"hitl"},
   {f:"requirements.md · bugfix.md",b:"git",w:"sa-plano",q:"plano (bugfix.md na rápida)",o:"Spec do Kiro: o que a fatia precisa fazer.",st:"plano",line:"hitl"},
   {f:"design.md · tasks.md · decisoes.md",b:"git",w:"sa-plano",q:"plano",o:"A forma do programa, as tarefas e as decisões da fatia.",st:"plano",line:"hitl"},
   {f:"analise-plano-<N>.md",b:"git",w:"subagente sa-revisor (rubrica L)",q:"a cada rodada da análise",o:"A análise independente do plano.",st:"analise",line:"hitl"},
   {f:"revisao-codigo-<N>.md",b:"git",w:"sa-revisar ([REV] ou subagente no AFK)",q:"a cada rodada",o:"Revisão nos dois eixos: spec e padrões.",st:"revisar",line:"hitl"},
   {f:"verificacao.md · CT.csv · evidencias/ · massa/",b:"git",w:"sa-verificar",q:"no aceite",o:"Cenários executados com evidência; CT.csv (Tipo, Resumo, Responsável, Status, Planejado para, Descrição; só os cenários aprovados), cada linha ligada ao CT planejado que ela prova.",st:"verificar",line:"hitl"},
   {f:"elm/ET-<slug>.md · adr/",b:"git",w:"Dev, no PR",q:"no PR",o:"Especificação técnica as-built (pela linha ET; ligada à ET inicial do épico, se houver) e decisões técnicas; a consolidação publica a ET no ELM e leva os ADRs à pasta de ADRs.",st:"pr_h",line:"hitl"},
   {f:"elm/ (só os conceitos da [ESP] FT)",b:"git",w:"sa-especificar.fatia (aprovação)",q:"na aprovação da [ESP] FT, direto na base",o:"Os conceitos aprovados que a fatia inclui, altera ou exclui (a pasta sem status.md não é fatia iniciada); sobem ao ELM na conclusão da [ESP] FT.",st:"ficha",line:"hitl"}
  ]},
 ]},
 {d:".opencode/",c:[{d:"agents/",c:[{f:"sa-*.md",b:"gen",w:"gerar_agentes.py da sa-setup",q:"“atualizar os agentes do Sabiá”",o:"Os mesmos sete agentes, no formato do opencode (permission). O gerador lista o que não tem tradução."}]}]}
];

const GATES=[
 {n:"PRD",q:"Especificador",o:"O quê e o porquê: histórias, cenários, regras e fora de escopo, com todos os artefatos de elm/ (novos, alterados e excluídos). Aprovado, a Fase do status.md do épico vai a aprovado e a [ESP] publica no ELM. Nunca é AFK.",st:"gprd",line:"epico"},
 {n:"Protótipo",q:"Cliente",o:"No projeto com tela, a versão vN do protótipo, aprovada pelo cliente num D-nn com quem, data, versão e evidência (ATA ou e-mail), antes do PRD; nunca deduzida nem dada por quem especifica.",st:"entrevistar",line:"epico"},
 {n:"ATA",q:"uma pessoa, na [ESP]",o:"A ATA de cada reunião com o cliente, escrita da transcrição; aprovada, sobe ao DOORS Next ligada à [ESP], sem esperar o GATE do PRD.",st:"entrevistar",line:"epico"},
 {n:"Backlog",q:"P.O. ou SM",o:"As fatias: granularidade, dependências e AFK ou HITL; precisa da fatia ponta a ponta. Aprovado, a Fase do status.md do épico vai a fatiado; o status do épico não muda. Depois dele, a fatia não se divide nem se junta.",st:"gbacklog",line:"epico"},
 {n:"Ficha",q:"P.O.",o:"A fatia padrão sem épico: regras, cenários e artefatos afetados. Na rápida, só quando o esperado vem de decisão nova.",st:"ficha",line:"hitl"},
 {n:"Especificação da fatia",q:"Especificador, na [ESP] FT",o:"Os artefatos do ELM que a fatia inclui, altera ou exclui, depois da revisão P; aprovados, vão à base e sobem ao ELM na conclusão da [ESP] FT.",st:"espft",line:"hitl"},
 {n:"Plano",q:"Dev Sênior na [APR] Aprovar plano",o:"A forma do programa e o contrato de pronto, com a fatia em aguardando-aprovacao-plano. Júnior sempre, Pleno se pedir, Sênior nunca.",st:"gplano",line:"hitl"},
 {n:"PR · HITL",q:"[REV] Dev Sênior e [VER]",o:"O código lido de verdade, nos dois eixos, e o aceite com evidência; aceito, a fatia fica em aceita. O merge é do Dev, que grava pronta na base.",st:"revisar",line:"hitl"},
 {n:"PR · AFK",q:"Dev Sênior na [APR] Aprovar PR",o:"O PR que a IA levou até o fim, em aguardando-aprovacao-pr, lido por uma pessoa, com o sha anotado para o merge.",st:"aprpr",line:"afk"}
];

const PHASES={
 hitl:[
  {f:"pesquisando",sub:"sa-pesquisar",st:"pesquisar"},
  {f:"planejando",sub:"plano e análise L",st:"plano"},
  {f:"aguardando-aprovacao-plano",sub:"GATE do plano",st:"gplano",skip:c=>c.sen==="sr"?"Sênior: sem GATE":null},
  {f:"implementando",sub:"TDD e pré-PR",st:"implementar"},
  {f:"pr-aberto",sub:"PR aberto",st:"pr_h"},
  {f:"em-revisao",sub:"[REV] Dev Sênior",st:"revisar"},
  {f:"em-verificacao",sub:"[VER]",st:"verificar"},
  {f:"aceita",sub:"merge pelo Dev",st:"merge"},
  {f:"pronta",sub:"na base; espera a consolidação",st:"consolidar"},
  {f:"concluida",sub:"consolidada",st:"consolidar"}],
 afk:[
  {f:"pesquisando",sub:"sa-pesquisar",st:"pesquisar"},
  {f:"planejando",sub:"plano e análise L",st:"plano"},
  {f:"aguardando-aprovacao-plano",sub:"GATE do plano",st:"gplano",skip:c=>c.sen==="sr"?"Sênior: sem GATE":null},
  {f:"implementando",sub:"TDD",st:"implementar"},
  {f:"revisando",sub:"revisão C (subagente)",st:"rev_a"},
  {f:"verificando",sub:"verificação (subagente)",st:"ver_a"},
  {f:"verificada",sub:"espera o PR",st:"pr_a"},
  {f:"aguardando-aprovacao-pr",sub:"[APR] Aprovar PR",st:"aprpr"},
  {f:"pronta",sub:"na base; espera a consolidação",st:"consolidar"},
  {f:"concluida",sub:"consolidada",st:"consolidar"}]
};
const PHNOTE=c=>{
 const sen=c.sen==="jr"&&c.mode==="afk"?"O Júnior não começa fatia AFK: estas fases valem para Pleno e Sênior. ":c.sen==="pl"?"Pleno: aguardando-aprovacao-plano só se ele pedir a aprovação. ":"";
 const modo=c.mode==="afk"?"No AFK, a revisão e a verificação rodam por subagente antes do PR; sem push autorizado no lote, a fatia fica em verificada até o Dev abrir o PR. ":"No HITL, antes do PR há só a revisão automática do desenvolvedor. ";
 const tr=c.tr==="rapida"?"Na trilha rápida as fases são as mesmas; o plano é o bugfix.md. ":"";
 return sen+modo+tr+"Retrabalho: retrabalho (de: <fase>), no mesmo PR; conflito no merge também volta a retrabalho. Bloqueio: bloqueada (de: <fase>), com o motivo; resolvido, volta à skill da fase de origem. Artefato do ELM que precisa mudar: bloqueada, aguardando especificação [ESP] FT-<nnn>, até a [ESP] FT concluir. O Dev grava iniciada na base antes de criar a branch, e pronta depois do merge; pronta e concluida só existem no status.md da base.";
};

const STATUSES=`
<div class="stbox"><h3>Épico</h3><div class="flowr"><span>novo</span><em>→</em><span>elegivel</span><em>→</em><span>planejado</span><em>→</em><span>iniciado</span><em>→</em><span>concluido</span></div><p>Elegível na DoR do épico, planejado com a [ESP] na sprint, iniciado ao assumir a [ESP], concluído na consolidação da última fatia. Desvio: <code>cancelado</code>. O detalhe é a Fase do <code>status.md</code> do épico: <code>rascunho → em-revisao → aprovado → fatiado → concluido</code>; a mudança do PRD aprovado e ainda não fatiado passa por <code>em-revisao (de: aprovado)</code>. Na sprint, a Especificação vai de <code>planejada</code> a <code>iniciada</code> e <code>concluida</code>, depois do GATE do PRD e da publicação.</p></div>
<div class="stbox"><h3>Ficha</h3><div class="flowr"><span>rascunho</span><em>→</em><span>aprovada por &lt;login&gt; em &lt;data&gt;</span></div><p>Mudar uma ficha aprovada a faz voltar a rascunho. Na rápida, a aprovação só é pedida quando o esperado vem de decisão nova.</p></div>
<div class="stbox"><h3>Fatia no backlog e na sprint</h3><div class="flowr"><span>nova</span><em>→</em><span>elegivel</span><em>→</em><span>planejada</span><em>→</em><span>iniciada</span><em>→</em><span>pronta</span><em>→</em><span>concluida</span></div><p>Elegível na DoR, planejada pela sa-planejamento, iniciada pelo Dev antes da branch, pronta pelo Dev no merge, concluída pela consolidação. A <code>nova</code> que entra na sprint para a [ESP] FT fica <code>nova</code>, <code>em especificação</code>, até a [ESP] FT concluir. A sincronização também grava iniciada e pronta, pela evidência do git. A planejada que sai da sprint volta a nova ou elegivel; de iniciada em diante nada volta. Desvios: <code>dividida</code>, <code>cancelada</code>.</p></div>
<div class="stbox"><h3>Item de Sustentação</h3><div class="flowr"><span>aberto</span><em>→</em><span>em-andamento</span><em>→</em><span>concluido</span></div><p><code>aberto</code> ao ser triado, na sprint ou fora dela; <code>em-andamento</code> ao assumir a tarefa; <code>concluido</code> com a tarefa e o IB. O que sai da sprint segue <code>aberto</code>. Desvio: <code>cancelado</code>.</p></div>`;

const ELM_HTML=`
<div class="elm3">
 <div class="sys" style="--c:var(--navy)"><h3>DOORS Next</h3><p class="sub">requisitos · publicados na conclusão da [ESP]</p><ul><li>História de Usuário (HF), Regra (REG) embutida na HF, Termos de Glossário (GL), Leiaute (EL, com Telas = <code>sim</code>), especificação técnica (ET)</li><li>Aprovados no GATE da [ESP] (o do PRD, no épico; o da [ESP] FT, na fatia) e publicados na conclusão dela, GL → REG → EL → HF → ET, cada um ligado à [ESP] (<b>rastreia</b>)</li><li>A ATA de reunião sobe na aprovação dela, ligada à [ESP]</li><li>ET inicial no PRD (pela linha ET); a as-built, na consolidação, ligada à [DEV] (<b>implementa</b>)</li><li>A [DEV] implementa os requisitos que a fatia cobre: o Dev liga no merge (HITL); o Dev Sênior, na [APR] Aprovar PR (AFK)</li><li>O excluído vai à lixeira por roteiro manual</li><li>Bundle local pela <code>sa-sync</code>, consultado só pelo MCP</li></ul></div>
 <div class="sys" style="--c:var(--blue)"><h3>EWM</h3><p class="sub">trabalho · o backlog do EWM é a cópia do <code>backlog.md</code></p><ul><li>Todo item triado nasce no backlog do produto, no estado inicial, e volta a ele quando sai da sprint; o backlog do EWM é a fonte dos relatórios das demandas, e nenhum item espera a sprint para nascer nele</li><li>Entrar na sprint move, nunca recria: a tarefa que ficou no backlog move com o dono e a estimativa</li><li>Iteração da sprint: <code>&lt;pai&gt;/Sprint n</code>; gravada sem publicar, leva <b>Publicação no EWM: pendente</b></li><li>A virada move só o aberto; o que fechou fica na iteração em que fechou, com as horas</li><li>Tarefas por papel, com horas; lançar não conclui</li><li>Sustentação (uma por produto), Manutenção e um IB por categoria, no backlog; o modo inicial cria a Sustentação e a [GB]</li><li>“Sincroniza a sprint”: o EWM, os arquivos e o git numa tabela, uma solução por linha; o PR mergeado por fora vira <code>pronta</code></li></ul></div>
 <div class="sys" style="--c:var(--green)"><h3>ETM</h3><p class="sub">testes · linha Casos de teste = <code>ETM</code> ou <code>CSV</code></p><ul><li>CT planejado de cada cenário da HF, aprovado no GATE da [ESP] e publicado na conclusão dela (<code>elm_criar_ct</code>), com o link <b>valida</b> para a história</li><li>Na consolidação, o CT planejado é ligado ao IB e só o CT novo da verificação é criado</li><li>Com <code>CSV</code>, o <code>CT.csv</code> da fatia é a entrega; sem permissão no ETM, ele é importado à mão</li></ul></div>
</div>
<div class="ewmtree" aria-label="Hierarquia de work items no EWM"><span class="m">EWM · backlog do produto e iterações</span>
<span class="c1">Épico [EP-07] …</span>                                      <span class="m">nasce na triagem, no backlog do produto</span>
├─ [ESP] EP-07 Especificação                         <span class="m">nasce no planejamento · conclui depois do GATE do PRD e da publicação</span>
└─ <span class="c2">IB [FT-031] …</span>                                     <span class="m">nasce no GATE do backlog</span>
   ├─ [ESP] FT-031 Especificação                     <span class="m">quem especifica · com artefato afetado, antes da [DEV]</span>
   ├─ [DEV] FT-031 Implementar                       <span class="m">Dev · conclui no merge</span>
   ├─ [REV] FT-031 Revisar · [VER] FT-031 Verificar  <span class="m">só HITL · concluem ao aprovar e ao aceitar</span>
   └─ [APR] FT-031 Aprovar plano · Aprovar PR        <span class="m">Dev Sênior · nasce no gate</span>
<span class="c4">Sustentação</span>                                          <span class="m">uma por produto · nasce no modo inicial e fica no backlog</span>
├─ [GB] Gerenciamento do backlog                     <span class="m">SM · uma por iteração pai · modo inicial: no backlog, move com a 1ª sprint</span>
├─ <span class="c3">Manutenção</span>                                        <span class="m">pai das fatias sem épico · fica no backlog</span>
│  └─ <span class="c2">IB [FT-040] …</span>                                  <span class="m">fatia sem épico · as tarefas como na FT-031</span>
├─ <span class="c3">Atendimento</span>                                       <span class="m">nasce com o 1º item da categoria · fica no backlog</span>
│  └─ IB [AT-013] …                                  <span class="m">nasce na triagem · dono = P.O.</span>
│     └─ [ATD] AT-013 …                              <span class="m">nasce quando o item entra numa sprint</span>
└─ <span class="c3">Operação</span>
   └─ IB [OP-001] … → [OPE] OP-001 …</div>
<div class="scroll"><table><thead><tr><th>Tarefa</th><th>Pai</th><th>Quem</th><th>Nasce</th><th>Conclui</th></tr></thead><tbody>
 <tr><td><span class="tag t">[ESP]</span></td><td>épico · IB da fatia (<code>[ESP] FT</code>)</td><td>quem especifica</td><td>planejamento ou encaixe; a <code>Revisão &lt;n&gt;</code>, quando a anterior concluiu numa sprint fechada</td><td>depois do GATE da [ESP] e da publicação do aprovado no ELM</td></tr>
 <tr><td><span class="tag t">[DEV]</span></td><td>IB da fatia</td><td>Dev</td><td>planejamento, encaixe ou loop</td><td>no merge</td></tr>
 <tr><td><span class="tag t">[REV]</span> <span class="tag t">[VER]</span></td><td>IB da fatia</td><td>Dev Sênior · verificador (só HITL)</td><td>planejamento, encaixe, primeira atribuição em HITL ou troca AFK → HITL</td><td>ao aprovar · ao aceitar, depois do push</td></tr>
 <tr><td><span class="tag t">[APR]</span></td><td>IB da fatia</td><td>Dev Sênior</td><td>no gate: GATE do plano (sa-plano) ou PR do AFK (sa-codificar, loop)</td><td>na aprovação</td></tr>
 <tr><td><span class="tag t">[ATD]</span> <span class="tag t">[IMPL]</span> <span class="tag t">[BD]</span> <span class="tag t">[INF]</span> <span class="tag t">[OPE]</span> <span class="tag t">[EXT]</span></td><td>IB do item ([AT-nnn] …)</td><td>quem faz o item</td><td>quando o item entra numa sprint, ou trazida pela sincronização</td><td>ao finalizar, com o IB do item</td></tr>
 <tr><td><span class="tag t">[GB]</span></td><td>Sustentação</td><td>SM</td><td>modo inicial, no backlog, e move para a 1ª sprint; pai novo: nasce na 1ª sprint dele</td><td>na troca de pai; senão move na virada</td></tr>
</tbody></table></div>
<p style="font-size:13px;margin-top:10px"><b style="color:var(--title)">Lançar ≠ concluir.</b> Lançar horas é registro de empenho, a qualquer momento numa tarefa iniciada. Concluir é da skill do papel, com o saldo. Na [GB], só o SM lança; o P.O. nunca, nem quando também é o SM, e cada sessão do P.O. ou do SM deixa os créditos num comentário nela. Nada é apagado no EWM: o que deixou de valer é cancelado (<code>elm_transicao</code> cancelar); a pendência fica só para a falha. Entrega de todo papel do HITL: commit → push → conferir no remoto → lançar ou concluir → avisar o próximo.</p>`;

const SENCARDS=`
<div data-sen="jr"><b>Júnior</b><div class="m"><span class="pill">sempre HITL</span><span class="pill">GATE do plano sempre</span></div><p>Não começa fatia AFK nem dispara o loop. O PR é revisado por um Dev Sênior.</p></div>
<div data-sen="pl"><b>Pleno</b><div class="m"><span class="pill">HITL ou AFK</span><span class="pill">GATE: pergunta</span></div><p>O modo sai dos critérios da fatia, confirmados pela pessoa. Pode disparar o loop; a escolha do GATE vale para o lote.</p></div>
<div data-sen="sr"><b>Sênior</b><div class="m"><span class="pill">AFK por padrão</span><span class="pill">GATE: nunca</span></div><p>Aprova o próprio plano. HITL só com motivo forte, registrado. O PR dele vai para outro Sênior, ou para ele mesmo se for o único (revisor único).</p></div>`;

const GOLDEN=`
<div><b>Alinhar antes de escrever</b>Entrevista em rodadas, com recomendação. Fatos o agente busca, decisões a pessoa toma.</div>
<div><b>Gerador ≠ avaliador</b>Revisão e verificação em contexto limpo, com os eixos spec e padrões separados.</div>
<div><b>Verificação acima de geração</b>Teste primeiro, backpressure a cada passo e oráculo protegido.</div>
<div><b>Contexto limpo, estado em disco</b>Uma fatia por sessão; o <code>status.md</code>, o <code>research.md</code> e o plano carregam o fio.</div>
<div><b>Autonomia gradual</b>HITL até o tipo de trabalho provar que anda sozinho; o AFK é limitado pela revisão humana.</div>
<div><b>Toda skill diz a próxima e para</b>Nenhuma invoca a do passo seguinte; quem segue é a pessoa, ou o orquestrador no loop.</div>`;

const INTRO=`<div class="ph"><h3>Escolha uma linha</h3><div class="sk">ou clique numa estação do mapa</div></div>
<div class="pb fade"><p style="font-size:14px">Cada linha é um caminho pelos fluxos do Sabiá. Ao escolher uma, o mapa acende o caminho dela e a ficha mostra o itinerário, passo a passo, com as transições. Use ▶ para o trem percorrer a linha.</p>
<div class="trans">${Object.keys(LINES).map(k=>`<button class="tr" data-line-pick="${k}" style="--tc:var(${LINES[k].c})${k==="sprint"?";color:var(--navy)":""}"><span class="ico">→</span><b>${LINES[k].nome}</b><span>${LINES[k].sub}</span></button>`).join("")}</div>
<div class="blk"><h4>Senioridade de quem implementa</h4><div class="crow">${["jr","pl","sr"].map(k=>`<button class="chip snr" data-sen-pick="${k}">${SENNOME[k]}</button>`).join("")}</div></div></div>`;

const SENRULE={jrAfk:"Júnior: sempre HITL. Não começa fatia AFK nem dispara o sa-orquestrar; com fatia AFK, a sa-desenvolver manda para a sa-planejamento."};

window.SABIA={LINES,SENNOME,SENRULE,ROUTES,TEXTS,DECOR,S,ALL,SKIP,VIA,EXTRA,SERV,ROLES,AGENTS,TREE,GATES,PHASES,PHNOTE,STATUSES,ELM_HTML,SENCARDS,GOLDEN,INTRO};
})();

/* motor do mapa: desenha linhas, estações e transições a partir dos dados; mantém o estado (linha, estação, senioridade, trilha) e a ficha lateral em sincronia */
