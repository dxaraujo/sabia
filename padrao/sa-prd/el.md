---
{"resumo": "Corpo do leiaute (EL): uma tela do protótipo aprovado, com protótipos por visão, campos em tabela de 6 colunas, ícones de grid, botões e estados, no texto visível."}
---
# Leiaute (EL)

Uma tela, como o cliente a aprovou no protótipo. Só com a linha Telas = `sim` na seção Especificação do
`.sabia/sabia.md`, e escrita da versão aprovada (o D-nn `Protótipo v<N> aprovado`). Sem protótipo aprovado, a EL fica
no Em aberto.

```markdown
**Design system:** <nome> (<url>)   <!-- do steering do projeto; sem ele, a linha sai -->
**Descrição:** <o que o ator faz na tela>
**Breadcrumb:** <caminho de navegação>
**Título da tela:** <título visível>
(*) campos obrigatórios

## 1. Protótipos

**Visão <perfil>:** prototipos/<id>-<slug>/v<N>/<arquivo> · aprovado em D-<nn>

## 2. <Filtros | Formulário>

| Campo | Componente | Obrigatório | Máscara / placeholder | Valor padrão | Informações adicionais |
|---|---|---|---|---|---|
| "<Período>*" | Datepicker | sim | dd/mm/aaaa | mês atual | <dependência, visibilidade por perfil> |

## 3. <Grid de resultados>

| Coluna | Componente | Formato | Informações adicionais |
|---|---|---|---|
| "<Vagas>" | Coluna de tabela | <livres / total> | — |

| Ícone | Habilitado quando | Desabilitado quando | Tooltip habilitado | Tooltip desabilitado |
|---|---|---|---|---|
| "<Inscrever>" | <vaga e período aberto> | <fora do período> | "<Inscrever-se>" | "<Inscrições encerradas>" |

## 4. Botões de ação

| Botão | Componente | Habilitado quando | Efeito |
|---|---|---|---|
| "<Pesquisar>" | Button (primário) | <sempre> | <lista os eventos do filtro> |

## Estados

| Estado | O que a tela mostra | Mensagem |
|---|---|---|
| Carregando | <indicador no grid> | — |
| Vazio | <grid vazio com o texto> | MSG-<id> |
| Erro de carga | <aviso no lugar do grid, com "Tentar de novo"> | MSG-<id> |
| Sem permissão | <a tela não abre; volta ao início> | MSG-<id> |
```

- **Componente**, lista fechada: Select (inclui autocomplete) · Input · Datepicker · Checkbox · Textarea · Upload ·
  Button · Label · Coluna de tabela · Botões ícone · Tag · Tooltip · Modal.
- **Só a tela:** layout, campos, componentes e estados. O comportamento é da HF, a regra da REG, o texto da mensagem
  da MSG.
- **Texto visível igual ao do protótipo** (rótulo, ação, tooltip), palavra por palavra. Divergência entre o
  protótipo, a HF e o banco → Em aberto, nunca escolhida na escrita.
- **Nada inventado:** campo ou ação sem história, regra ou D-nn que a sustente → Em aberto.
- **Ícone de grid:** habilitado quando o perfil pode e nenhuma regra impede; desabilitado quando o perfil pode mas uma
  regra impede naquele registro; oculto quando a ação nunca vale para o perfil. Tooltip nos dois estados.
- **Componente reutilizável** (modal, grid comum) tem EL própria, citada com **Conforme** EL-<id>.
- **Referência só para baixo:** REG, MSG, GL e outra EL, nunca a HF (a HF aponta a EL na linha Telas).
- Nome técnico (coluna, tabela) não entra. Só dado fictício; nenhuma imagem no corpo.
- Seção sem conteúdo sai, menos Protótipos e Estados.

## Checklist

- [ ] Protótipo da versão aprovada, por visão.
- [ ] Todo campo com rótulo visível e componente da lista; obrigatório com asterisco.
- [ ] Erro de campo mostrado junto do campo que o causou (MSG na Informações adicionais).
- [ ] Todo ícone com habilitação, desabilitação, os dois tooltips e um aria-label descritivo.
- [ ] Ordem de foco por teclado igual à ordem da tela.
- [ ] Os quatro estados ditos (ou por que não se aplicam).
