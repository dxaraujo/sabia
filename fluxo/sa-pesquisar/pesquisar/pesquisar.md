---
{"fluxo": "pesquisar", "dono": "sa-pesquisador",
 "travas_gerais": [],
 "passos": [
   {"id": "perguntas"},
   {"id": "investigar"},
   {"id": "research"}
 ]}
---
# Pesquisar — entender antes de planejar

Uma linha errada na pesquisa vira um plano errado, que vira centenas de linhas de código erradas. A pesquisa é
barata de revisar e cara de errar — por isso ela é um arquivo curto, factual e verificável.

Prefira o agente **`sa-pesquisador`** (somente leitura, contexto próprio): ele lê dezenas de arquivos e devolve
só o conteúdo do `research.md`, que quem o chamou grava como veio. Sem o agente, faça você mesmo e, ao terminar, trabalhe a partir do arquivo, não da memória da
leitura.

Entrada: pasta da fatia `.kiro/specs/<ft>-<slug>/` com `status.md`; a fatia no `backlog.md` (`cobre`); o PRD do épico
(histórias e regras cobertas), a ficha da fatia sem épico (`<produto>/fatias/`) ou, na trilha rápida, o
defeito/pedido; a seção Artefatos afetados da ficha e os conceitos aprovados na `[ESP] FT`, em `elm/` da pasta da
fatia, que valem sobre o PRD e o bundle.

## Regras

- Somente leitura: nenhum arquivo além de `research.md` (e, fora do agente pesquisador, a linha do `status.md`). O
  agente pesquisador não grava nada: devolve o `research.md` inteiro na resposta.
- Nunca invente arquivo, classe, coluna ou rota. Não achou → seção "Não encontrado".
