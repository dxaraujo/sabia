# MCP elm — tools, retornos e erros

Quem fala com o ELM é o MCP `elm`. Ele lê o `pa` do projeto: `.sabia/config/elm/pa_<nome>.json`, com tipos,
campos, padrões, pastas e ids. A skill passa só `projeto` (o caminho absoluto da raiz do repositório), `pa` (quando o
projeto tem mais de um) e os ids e o conteúdo. Nunca repasse
campos, URLs ou ids internos do `pa`: o MCP resolve. Os parâmetros de cada tool estão no schema dela.

Toda tool devolve `{"ok": true, "dados": {…}}` ou `{"ok": false, "erro": {"codigo", "detalhe", "campo"}}`.
`elm_ler_wi` e `elm_ler_req` devolvem Markdown.

## Tools

| Operação | Tool | Tipo |
|---|---|---|
| conferir a conexão e o `pa` | `elm_status` | leitura |
| descobrir a PA para montar o `pa` | `elm_setup_descobrir` | só na sessão sem agente |
| backlog do produto (`ccm.backlog`) | `elm_backlog` | só na sessão sem agente |
| ler · listar work items | `elm_ler_wi(id)` · `elm_listar_wi(iteracao, dono, tipo, pai, titulo_prefixo, estado)` | leitura |
| criar · atualizar (pai, iteração, campos) | `elm_criar_wi` · `elm_atualizar_wi` | escrita |
| assumir · concluir · reabrir · cancelar | `elm_transicao(id, alvo)` | escrita |
| comentar · anexar | `elm_comentar` · `elm_anexo` | escrita |
| horas lançadas · relatório da iteração | `elm_horas(id)` · `elm_horas(iteracao)` | leitura |
| lançar · remover horas | `elm_lancar_horas` · `elm_remover_horas(id, data)` | escrita |
| ligar WI e requisito (`implementa`, `rastreia`, `relacionado`) | `elm_ligar` | escrita |
| buscar · ler requisito | `elm_buscar_req` · `elm_ler_req` | leitura |
| criar (sem `id`) · atualizar (com `id` e `modificado_em`) requisito | `elm_publicar_req(sigla, titulo, texto_md, id?, modificado_em?, embutir?)` | escrita |
| iteração da sprint | `elm_iteracao` | escrita |
| baixar o bundle (plano · baixar) | `elm_sync(direcao)` | só baixa |
| bundle local: buscar · ler · listar · indexar | `elm_buscar_req_local` · `elm_ler_req_local` · `elm_listar_req_local` · `elm_indexar_local` | leitura |
| visualização offline do bundle | `elm_explorar_local` | leitura |

## Erros

| Código | O que fazer |
|---|---|
| `entrada` | o parâmetro (`campo`) está errado: corrija pelo schema e tente mais uma vez; persistindo, mostre o `detalhe` e devolva |
| `nao_encontrado` | mostre o id e pergunte; nunca troque de id por conta própria. Com `campo: "bundle"`: não há bundle → busque no ELM ao vivo e ofereça a `sa-elm.baixar` |
| `credencial` | peça que a pessoa confira o `~/.config/mcp-elm/elm.properties` (o agente não lê esse arquivo) |
| `indisponivel` | tente mais uma vez; falhou de novo → diga e devolva |
| `config` | o `pa` está incompleto: diga o campo e ofereça a `sa-elm.setup` |
| `permissao` · `precondicao` | mostre o atributo ou o campo; pergunte o valor, nunca chute. Com `campo: "indice"`: indexe (`elm_indexar_local`) e rode de novo |
| `conflito` | o requisito mudou no DOORS depois da leitura: avise e pule aquele artefato |
| `ja_estava` · `ja_existia` | nada a fazer: siga |

Os campos que a PA exige por regra de processo (criar, mudar de estado, lançar horas) ficam em `obrigatorios` do tipo
no `pa` e são exigidos já na criação. Estimativa → pergunte e passe `estimativa_h`; outro campo sem padrão → ofereça
a `sa-elm.setup`.

## Publicação de requisitos

- **Ordem**: a de publicação do catálogo de tipos (cada um nasce com os ids que cita: MSG → GL → REG → UC → EL → HF → ET). A
  referência só aponta para baixo, então nada é republicado para ganhar um id novo.
- **Texto**: o corpo do arquivo de `elm/`, sem o frontmatter. Requisito já publicado citado com link para o arquivo
  (`[REG-2087 <título>](2087-REG-<slug>.md)`) → `[REG-2087 <título>](2087)`; requisito novo citado → o id provisório
  como texto, até ganhar o id. Os tipos
  da coluna Embute do catálogo (as regras citadas por uma história) vão em `embutir`; o resto fica hyperlink.
- **Depois de publicar**: `elm_ler_req(<id>)` devolve o `modificado_em` novo, que o próximo `altera` usa como versão de referência.

## O que o MCP não grava (roteiro manual)

Exclusão de requisito (mover para a lixeira no DOORS Next), atributos de requisito, links requisito ↔ requisito
(*satisfaz*, *restringe*), módulos, change sets e baselines. Quando o processo do projeto exigir (linha `Manual no
DOORS Next` da seção ELM do `sabia.md`), entregue o roteiro com os ids exatos e pergunte se foi feito.

## Bundle local

O bundle (chave `elm.bundle` do `agentes.json`, ex.: `docs/elm/<pa>/`) é a cópia local, em OKF, dos requisitos do DOORS:
`index.md` e `log.md` (índice), `sync.md` (`sincronizado_em`), `explorar.html` (fora do git) e um `<conceito>.md` por
requisito. Consulte sempre pelas tools `elm_*_local`, nunca lendo os arquivos. `indexando: true, restantes: <n>` → a
busca usou o que já estava indexado, e a indexação segue em segundo plano.
