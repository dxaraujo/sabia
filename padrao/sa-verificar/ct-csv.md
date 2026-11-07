---
{"resumo": "Formato do CT.csv da fatia: uma linha por cenário aceito na verificação, ligada ao CT-nn da ficha e da spec, que é a mesma marca do teste automatizado."}
---
# `CT.csv` — casos de teste da fatia

Escrito só pela `sa-verificar.verificar`, na quick e no completo (a trivial não tem: a prova fica no MR). Uma linha
por cenário ✅ aceito na verificação; o rejeitado, o de ambiente e o de possível alteração não entram. Cada linha
liga ao CT-nn da ficha e da spec, que é o id marcado no teste automatizado. Serve à leitura do revisor, à conferência
"CT sem teste" da `sa-status` e à importação manual numa ferramenta de teste.

## Arquivo

- `<pasta da spec>/CT.csv` (`.kiro/specs/ft-<nnn>-<slug>/` ou `openspec/changes/ft-<nnn>-<slug>/`).
- UTF-8 **com BOM**, quebras de linha **LF**, separador `;`. Grave já assim: o conteúdo começa pelo caractere BOM
  (U+FEFF) e usa só `\n`, inclusive dentro da Descrição.
- Linha 1 = o cabeçalho `Tipo;Resumo;Responsável;Descrição`; depois, uma linha por cenário aceito, na ordem do CT-nn.
- Cada verificação reescreve o arquivo inteiro.

## Colunas (nesta ordem)

| # | Coluna | Valor |
|---|---|---|
| 1 | Tipo | `Caso de Teste` |
| 2 | Resumo | `<FT-nnn> CT-nn - <título do cenário>` |
| 3 | Responsável | o `usuario` do `equipe.json` de quem verificou (no autopilot, quem desenvolve) |
| 4 | Descrição | o bloco abaixo, entre aspas duplas, com quebras de linha reais |

## Descrição

```
"OBJETIVO:
<o que o caso comprova> (<sigla>-<id> do Cobre, se houver · CT-nn)

PRÉ-CONDIÇÕES:
- <estado criado pela aplicação ou pelos fixtures>

PASSOS:
1. <chamada, job ou tela> com <entradas>
2. <onde conferir: resposta, consulta, log, tela>

RESULTADO ESPERADO:
- <o 'Então' do cenário, com valores>

EVIDÊNCIA (FT-<nnn>, <AAAA-MM-DD>):
- <resumo do obtido, sem dado real>
- MR: <link do MR | —>"
```

Aspas duplas dentro do texto são dobradas (`""`), como manda o CSV.

## Exemplo

```
Tipo;Resumo;Responsável;Descrição
Caso de Teste;FT-031 CT-01 - Bloquear após a terceira tentativa;joao.lima;"OBJETIVO:
Bloquear a conta na terceira senha errada (REG-118 · CT-01)

PRÉ-CONDIÇÕES:
- conta ativa criada pelo POST /contas

PASSOS:
1. POST /login com a senha errada, três vezes
2. GET /contas/<id>

RESULTADO ESPERADO:
- situacao = ""BLOQUEADA"" e a mensagem ""Conta bloqueada""

EVIDÊNCIA (FT-031, 2026-11-07):
- 3ª tentativa devolveu 423 e situacao = BLOQUEADA
- MR: —"
```
