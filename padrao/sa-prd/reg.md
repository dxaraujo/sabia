---
{"resumo": "Corpo da regra (REG): módulo, categoria e fonte; a regra numa frase declarativa; condições de aplicação com a exceção; a lógica na forma da categoria, com a resposta à violação; referências para baixo."}
---
# Regra (REG)

Uma regra, testável, com os valores. O mesmo corpo serve ao bloco do `prd.md` e ao arquivo de `elm/`.

```markdown
**Módulo:** <módulo> · **Categoria:** Validação | Cálculo | Permissão | Status | Abrangência | Temporal
**Fonte:** D-<nn> | ATA-<nn> [mm:ss] | <sigla>-<id>

## Descrição

Uma turma tem no máximo **40** inscrições **Confirmadas**.

## Condições de aplicação

**Quando se aplica:** <situação>
**Quando não se aplica:** <exceção, como a fonte disse | nenhuma>

## Lógica

**Validação:** o sistema verifica:
- <condição>, e;
- <condição>.
**Se não passa:** <recusa> e exibe MSG-<id> <título>.

## Referências   <!-- só se houver -->

- REG-<id> <título> · MSG-<id> <título> · GL-<id> <termo>
```

A Lógica tem a forma da categoria:

| Categoria | Forma |
|---|---|
| Validação | **Validação:** o sistema verifica (itens ligados por "e;" ou "ou;") · **Se não passa:** a resposta, com a MSG |
| Cálculo | fórmula com unidades, arredondamento e um exemplo numérico |
| Permissão | tabela perfil × operação |
| Status | tabela de transições: de · para · quem · condição |
| Abrangência | tabela perfil × o que vê |
| Temporal | período ou prazo, com o calendário (dias corridos ou úteis) e o que acontece ao vencer |

- **Declarativa:** a Descrição é a regra numa frase, com os valores. A Lógica diz só como a regra é avaliada e a
  resposta à violação. O que o processo faz depois (lista de espera, reenvio, aviso) fica na HF ou no UC.
- **Atômica:** uma regra por REG. Várias validações ("N° Validação") são várias REG, citadas entre si em
  Referências.
- **Fonte** obrigatória. Sem fonte, a regra não entra: vai ao Em aberto. A exceção também vem da fonte; a que a
  fonte não diz vai ao Em aberto, porque sem ela a regra não é testável.
- **Nomes técnicos:** só com a linha REG com dados técnicos = `sim` na seção Especificação do `.sabia/sabia.md`,
  entre parênteses no próprio item, na forma original (`(TB_TURMA.QT_VAGAS)`). Com `não`, só o rótulo que o
  usuário vê.
- **Mensagem:** pelo id da MSG, dentro da Lógica; o texto mora na MSG.
- **Referência só para baixo:** REG, MSG e GL, nunca a HF, a EL ou a ET que usam a regra. Existente no ELM →
  link para o arquivo; novo → só o id provisório.
- Seção sem conteúdo sai, menos Descrição, Condições de aplicação e Lógica.

## Checklist

- [ ] Categoria e Fonte no topo; a Descrição numa frase declarativa, com os valores.
- [ ] Quando não se aplica dito pela fonte, ou no Em aberto.
- [ ] A Lógica na forma da categoria; a violação com a MSG; nada do passo seguinte do processo.
- [ ] Uma regra só.
- [ ] Sem termo vago (superlativo, subjetivo, "etc.", "se possível", "quando for o caso").
