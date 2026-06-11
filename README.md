# Sistema de Controle de Presença — Catequese

Projeto Integrado · UNIFEOB · Arquitetura de Softwares · 2º Trimestre 2026

Núcleo de regras de negócio que automatiza o controle de frequência e a
decisão de aprovação dos catequizandos, conforme levantado junto ao cliente
(o padre da paróquia).

## Como executar

```bash
npm install            # instala Jest e Stryker
npm test               # testes unitários + relatório de cobertura
npm run test:mutation  # análise de mutação (qualidade dos testes)
```

## O que reprova ou não o catequizando

A regra central (`avaliarSituacao`) decide a aprovação com base em três
critérios. O aluno só é **APROVADO** se passar em **TODOS os critérios ativos**:

| # | Critério | Regra | Status |
|---|----------|-------|--------|
| 1 | Presença na **catequese** | >= 75% | Obrigatório |
| 2 | Presença na **missa** | >= 75% | Obrigatório |
| 3 | **Atividades / provas** | média >= 6,0 | **Opcional** |

- Os critérios de presença (1 e 2) são avaliados **separadamente**: falhar em
  qualquer um reprova o aluno.
- O critério de notas (3) é **opcional**: hoje a paróquia avalia só por
  presença, então fica desligado por padrão. Quando adotar provas, ativa-se
  com `avaliarNotas: true`.
- **Faltas justificadas** (atestado) são abonadas: saem do denominador, de
  modo que não prejudicam o catequizando.

## Arquitetura em camadas

```
src/
├── validacoes.js         → Validação de tipos e limites (reutilizável)
├── regrasFrequencia.js   → Cálculo de presença + aprovação por frequência (PURO)
├── regrasNotas.js        → Cálculo de média + aprovação por nota (FUTURO/OPCIONAL)
├── regrasAprovacao.js    → Regra consolidada dos 3 critérios (decisão final)
├── Catequizando.js       → Entidade: registra presenças e notas (UC01)
├── casosDeUso.js         → Orquestração: emite relatório/boletim (UC02)
└── index.js              → API pública (ponto de entrada)
```

## Estratégia de testes

A suíte vai muito além dos exemplos básicos, aplicando um conjunto amplo de
técnicas de Verificação & Validação. São **267 testes** distribuídos por
categoria:

### Testes de unidade (caixa-branca e caixa-preta)
- `validacoes.test.js` — validação de tipos e limites.
- `regrasFrequencia.test.js` — cálculo de presença e aprovação.
- `regrasAprovacao.test.js` — regra consolidada dos 3 critérios.
- `Catequizando.test.js` — entidade e registro de presença (UC01).
- `casosDeUso.test.js` — emissão de relatório/boletim (UC02).
- `index.test.js` — integridade da API pública.

### Técnicas avançadas
- **`regrasFrequencia.avancado.test.js`**
  - *Testes parametrizados* (`test.each`): tabelas de casos.
  - *Property-based testing*: propriedades invariantes verificadas em
    centenas de entradas aleatórias (ex.: percentual sempre entre 0 e 100;
    monotonicidade; idempotência do arredondamento).
  - *Testes de robustez / fuzzing*: entradas extremas e adversas.
- **`tabelaDecisao.test.js`** — Tabela de Decisão formal: todas as 12
  combinações de condições (catequese × missa × notas) mapeadas para ações.
- **`integracao.test.js`** — Testes de integração ponta-a-ponta: simula um
  trimestre real e uma turma inteira, incluindo as métricas do relatório do
  padre (taxa de aprovação, presença média, principal motivo de reprovação).
- **`regressao.test.js`** — Testes de regressão: cada teste documenta um bug
  real já corrigido (precisão de ponto flutuante, divisão por zero, mutação
  do relatório, etc.), impedindo que voltem.
- **`mutationKilling.test.js`** — Testes escritos para eliminar mutantes
  sobreviventes (mensagens e tipos de erro exatos, operadores de fronteira,
  condições isoladas de guardas compostas).

### Análise de mutação (Stryker)
Mede a **qualidade** dos testes, não apenas a cobertura: o Stryker altera o
código (cria "mutantes", ex.: troca `>=` por `>`) e verifica se algum teste
detecta a mudança. O relatório HTML é gerado em `relatorios/mutacao.html`.

## Métricas de qualidade alcançadas

| Métrica | Resultado |
|---------|-----------|
| Testes | **267 passando** |
| Cobertura de linhas | **100%** |
| Cobertura de branches | **100%** |
| Cobertura de funções | **100%** |
| **Mutation score** (núcleo) | **100%** |

Cobertura de 100% garante que todo o código é executado pelos testes.
Mutation score de 100% garante que os testes realmente **detectam falhas** —
um nível de rigor bem acima do convencional.

> Observação de escopo: o foco da avaliação é a **frequência**. O módulo de
> **notas** (`regrasNotas.js`) é uma funcionalidade preparada para o futuro;
> está implementado e validado por testes-fumaça, mas fica fora da cobertura
> e da mutação obrigatórias para não travar o projeto enquanto a avaliação
> por provas não é adotada.
