---
{"resumo": "Escreve os requisitos do prd.md, um bloco por requisito com Tipo e Ação, pelo padrão do tipo; o tipo com skill de toolkit no prompt sai por ela."}
---
## Entrada

O `prd.md`, as decisões e a ação de cada requisito (passo `similares`) e a seção Especificação do `.sabia/sabia.md`
(Telas, REG com dados técnicos).

## Faça

Tipo com skill de toolkit no seu prompt (sem agente: a seção Tipos com skill de toolkit do `.sabia/sabia.md`) → o
bloco desse tipo sai pela skill, com o fluxo e o padrão do tipo; na volta, confira o bloco pelo formato abaixo.

Proporcional ao tamanho. Cada requisito é um bloco na seção Requisitos:

```markdown
### <sigla>-<id> · <título>
**Tipo:** HF | UC | REG | MSG | EL | GL · **Ação:** inclui | altera | exclui

<corpo pelo padrão do tipo, com os títulos dois níveis abaixo>
```

- Corpo pelo padrão do tipo: `sa-prd/hf.md`, `sa-prd/uc.md`, `sa-prd/reg.md`, `sa-prd/msg.md`, `sa-prd/el.md`,
  `sa-prd/gl.md`. Os títulos do corpo descem dois níveis dentro do bloco (`##` → `####`, `###` → `#####`), para não
  fecharem a seção Requisitos; o padrão continua com o nível dele, que é o do arquivo de `elm/` e do DOORS. Sem
  frontmatter no bloco: ele só existe no arquivo de `elm/`. No altera, o texto
  inteiro no estado depois; no exclui, o vigente e o motivo.
- **HF:** os cenários Dado · Quando · Então do requisito, com o Então verificável. Sem CT.csv: os CT-nn nascem na
  ficha.
- **UC:** só com Casos de uso = `sim`; o comportamento novo vai em HF.
- **EL:** só com Telas = `sim`, e a fonte é o protótipo aprovado (um D-nn `Protótipo v<N> aprovado`). Sem ele →
  `sa-especificar.prototipo`; a EL fica no Em aberto, bloqueando só ela.
- **Sem ET:** a ET é só as-built, no `design.md` da fatia.
- Nunca invente regra, valor ou ator: sem fonte, vai ao Em aberto (`Pergunta | Para quem | Bloqueia`).

Grave a cada rodada pela gravação comum na base (passo `gravar`, commit `EP-nn prd: <o quê>`), e volte aqui.

## Saída

Os blocos escritos e gravados → passo `validar`.

## Pare se

Nenhum caso próprio deste passo: o que falta vai ao Em aberto e bloqueia só o que depende dele.
