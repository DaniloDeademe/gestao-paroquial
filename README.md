# Sistema de Controle de Presença — Catequese

> **Projeto Integrado · UNIFEOB · Arquitetura de Softwares · 2º Trimestre 2026**

Este projeto é um núcleo de regras de negócio com interface web que automatiza o controle de frequência e a decisão de aprovação dos catequizandos, conforme levantado junto ao cliente (o pároco da paróquia Santo Antônio, em Santo Antônio do Jardim/SP).

O repositório está dividido em duas frentes: a **Interface de Usuário** (HTML/CSS/JS puro, pronta para uso) e a **Engenharia de Testes** (Suíte robusta em Node.js/Jest que valida as regras de negócio).

---

## ⚖️ O que reprova ou não o catequizando (Regras de Negócio)

A regra central decide a aprovação com base em três critérios. O aluno só é **APROVADO** se passar em **TODOS os critérios ativos**. Falhar em um já reprova.

| # | Critério | Regra | Status |
| --- | --- | --- | --- |
| 1 | Presença na **catequese** | >= 75% | Obrigatório |
| 2 | Presença na **missa** | >= 75% | Obrigatório |
| 3 | **Atividades / provas** | média >= 6,0 | **Opcional** |

* Os critérios de presença (1 e 2) são avaliados **separadamente**.
* **Faltas justificadas** (atestado) são **abonadas**: saem do denominador da conta, não prejudicando o aluno.
* A função `arredondar()` corrige erros nativos de ponto flutuante do JavaScript.
* O critério de notas (3) é **opcional**: hoje a paróquia avalia só por presença, então fica desligado por padrão.

---

## 🖥️ A Interface do Sistema (Front-end)

A versão visual do sistema foi feita em código simples e direto, sem frameworks complexos e sem etapa de "build". É só abrir e usar.

### Estrutura de Arquivos da Interface

| Arquivo | O que faz |
| --- | --- |
| `index.html` | A página. Só a estrutura — carrega os scripts. |
| `style.css` | Toda a aparência (cores da paróquia, layout mobile). |
| `regras.js` | As regras de negócio explicadas acima de forma direta. |
| `dados.js` | Dados de exemplo, salvamento e ligação com a base de dados. |
| `app.js` | A interface: telas, navegação, geração de QR Code e formulários. |

### Como testar no computador

Dê **dois cliques** em `index.html`. Abre no navegador e funciona.
*Nota: Se o navegador bloquear o JavaScript por estar abrindo direto do disco (`file://`) e a tela ficar branca, abra a pasta no terminal e rode `python -m http.server`, acessando `http://localhost:8000`.*

### Usuários e senhas de acesso

| Perfil | Usuário | Senha |
| --- | --- | --- |
| Pároco | `pe.adriano` | `paroquia` |
| Catequista | `maria` | `catequese` |
| Escritório | `secretaria` | `paroquia` |

Na tela de login há um atalho **"Acessos de demonstração"** que preenche os campos automaticamente.

### Como publicar online rapidamente

1. Acesse **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Arraste a pasta inteira para a página.
3. Você recebe um link público na hora (Também funciona perfeitamente via Vercel ou GitHub Pages).

---

## ⚙️ Arquitetura e Engenharia de Testes (QA)

As regras de negócio foram estritamente validadas na etapa de Engenharia de Software utilizando Jest e Stryker.

### Como executar os testes

```bash
npm install            # Instala o framework Jest e o Stryker
npm test               # Roda os testes unitários e gera o relatório de cobertura
npm run test:mutation  # Roda a análise de mutação (avalia a qualidade dos testes)
```

### Arquitetura em camadas (`src/`)

A lógica foi modularizada para isolar responsabilidades durante os testes:

* `validacoes.js` — Validação de tipos e limites (reutilizável)
* `regrasFrequencia.js` — Cálculo de presença + aprovação por frequência (PURO)
* `regrasNotas.js` — Cálculo de média + aprovação por nota (FUTURO/OPCIONAL)
* `regrasAprovacao.js` — Regra consolidada dos 3 critérios (decisão final)
* `Catequizando.js` — Entidade: registra presenças e notas (UC01)
* `casosDeUso.js` — Orquestração: emite relatório/boletim (UC02)
* `index.js` — API pública (ponto de entrada)

### Estratégia de Verificação e Validação

A suíte conta com **267 testes** distribuídos em diferentes abordagens:

* **Testes de unidade (caixa-branca e caixa-preta):** Validação de tipos, limites e cálculos.
* **Testes parametrizados:** Tabelas de casos iteradas automaticamente.
* **Property-based testing:** Propriedades invariantes verificadas em centenas de entradas aleatórias (ex: percentual nunca passa de 100%).
* **Testes de robustez (Fuzzing):** Inserção de entradas extremas e adversas.
* **Tabela de Decisão:** Validação formal de todas as 12 combinações possíveis de condições de aprovação.
* **Testes de integração (End-to-End):** Simulação de um trimestre real, com turma inteira e geração de métricas de relatório pastoral.
* **Testes de regressão:** Documentação em código de bugs corrigidos (como erro de dízima ou divisão por zero) para evitar reincidência.
* **Mutation Killing:** Testes escritos exclusivamente para eliminar mutantes sobreviventes detectados pelo Stryker.

### Métricas de Qualidade Alcançadas

| Métrica | Resultado |
| --- | --- |
| Testes aprovados | **267** |
| Cobertura de linhas | **100%** |
| Cobertura de branches | **100%** |
| Cobertura de funções | **100%** |
| **Mutation score** (núcleo) | **100%** |

Uma cobertura de 100% garante que todas as linhas de código são executadas durante a verificação. O *Mutation score* de 100% garante que os testes construídos realmente **detectam falhas**, atestando o rigor e a confiabilidade do software entregue.