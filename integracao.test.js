/**
 * Testes de Integração (End-to-End) - Cenário Real de Catequese
 * ==================================================================
 * Diferente dos testes de unidade (que isolam cada função), estes
 * testes exercitam o FLUXO COMPLETO do sistema, da forma como ele será
 * usado na prática pela paróquia:
 *
 *   1. Cria-se a turma de catequizandos.
 *   2. Registra-se a presença ao longo de várias semanas (catequese + missa).
 *   3. Emite-se o relatório/boletim de cada um.
 *   4. Geram-se métricas da turma para o relatório do padre.
 *
 * Valida que as camadas (entidade → regras → casos de uso) funcionam
 * integradas e produzem resultados coerentes.
 */

const Catequizando = require("../src/Catequizando");
const { emitirRelatorio, emitirRelatorioLote } = require("../src/casosDeUso");

// ─────────────────────────────────────────────────────────────────────────────
// Cenário 1: Um trimestre completo de catequese
// ─────────────────────────────────────────────────────────────────────────────
describe("Integração - trimestre completo de um catequizando", () => {
  test("aluno exemplar: presença perfeita em catequese e missa → Aprovado", () => {
    const joao = new Catequizando("João Pedro");

    // 12 encontros de catequese, todos presentes
    for (let i = 0; i < 12; i++) joao.registrarCatequese("presente");
    // 12 missas, todas presentes
    for (let i = 0; i < 12; i++) joao.registrarMissa("presente");

    const boletim = emitirRelatorio(joao);
    expect(boletim.presencaCatequese).toBe(100);
    expect(boletim.presencaMissa).toBe(100);
    expect(boletim.statusGeral).toBe("Aprovado");
    expect(boletim.motivos).toEqual([]);
  });

  test("aluno faltante: muitas ausências na missa → Reprovado por missa", () => {
    const maria = new Catequizando("Maria Clara");

    // Catequese ok: 11 de 12 = 91.67%
    for (let i = 0; i < 11; i++) maria.registrarCatequese("presente");
    maria.registrarCatequese("falta");
    // Missa ruim: 6 de 12 = 50%
    for (let i = 0; i < 6; i++) maria.registrarMissa("presente");
    for (let i = 0; i < 6; i++) maria.registrarMissa("falta");

    const boletim = emitirRelatorio(maria);
    expect(boletim.statusCatequese).toBe("Aprovado");
    expect(boletim.statusMissa).toBe("Reprovado");
    expect(boletim.statusGeral).toBe("Reprovado");
    expect(boletim.motivos).toContain("Frequência insuficiente nas missas.");
  });

  test("aluno com doença prolongada: faltas justificadas o salvam → Aprovado", () => {
    const pedro = new Catequizando("Pedro Henrique");

    // Catequese: ficou doente 3 semanas (justificadas), presente nas outras 9
    for (let i = 0; i < 9; i++) pedro.registrarCatequese("presente");
    for (let i = 0; i < 3; i++) pedro.registrarCatequese("justificada");
    // Sem abono seria 9/12 = 75%, com abono 9/9 = 100%
    // Missa ok
    for (let i = 0; i < 10; i++) pedro.registrarMissa("presente");
    for (let i = 0; i < 2; i++) pedro.registrarMissa("justificada");

    const boletim = emitirRelatorio(pedro);
    expect(boletim.presencaCatequese).toBe(100);
    expect(boletim.statusGeral).toBe("Aprovado");
  });

  test("aluno no limite: exatamente 75% em ambos após várias semanas → Aprovado", () => {
    const ana = new Catequizando("Ana Beatriz");

    // Catequese: 9 presenças, 3 faltas = 9/12 = 75%
    for (let i = 0; i < 9; i++) ana.registrarCatequese("presente");
    for (let i = 0; i < 3; i++) ana.registrarCatequese("falta");
    // Missa: 9 presenças, 3 faltas = 75%
    for (let i = 0; i < 9; i++) ana.registrarMissa("presente");
    for (let i = 0; i < 3; i++) ana.registrarMissa("falta");

    const boletim = emitirRelatorio(ana);
    expect(boletim.presencaCatequese).toBe(75);
    expect(boletim.presencaMissa).toBe(75);
    expect(boletim.statusGeral).toBe("Aprovado");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cenário 2: Turma inteira + métricas para o padre
// ─────────────────────────────────────────────────────────────────────────────
describe("Integração - turma inteira e métricas do relatório", () => {
  // Helper: cria um aluno com X% catequese e Y% missa (sobre 20 encontros).
  function criarAluno(nome, presCatequese, presMissa) {
    const aluno = new Catequizando(nome);
    for (let i = 0; i < 20; i++) {
      aluno.registrarCatequese(i < presCatequese ? "presente" : "falta");
    }
    for (let i = 0; i < 20; i++) {
      aluno.registrarMissa(i < presMissa ? "presente" : "falta");
    }
    return aluno;
  }

  let turma;
  let relatorios;

  beforeEach(() => {
    turma = [
      criarAluno("Aluno A", 20, 20), // 100/100 → Aprovado
      criarAluno("Aluno B", 18, 16), //  90/80  → Aprovado
      criarAluno("Aluno C", 15, 15), //  75/75  → Aprovado (limite)
      criarAluno("Aluno D", 14, 18), //  70/90  → Reprovado (catequese)
      criarAluno("Aluno E", 20, 10), // 100/50  → Reprovado (missa)
      criarAluno("Aluno F", 8, 9), //    40/45  → Reprovado (ambos)
    ];
    relatorios = emitirRelatorioLote(turma);
  });

  test("gera um boletim para cada aluno da turma", () => {
    expect(relatorios).toHaveLength(6);
    relatorios.forEach((r) => {
      expect(r).toHaveProperty("catequizando");
      expect(r).toHaveProperty("statusGeral");
    });
  });

  test("calcula corretamente quantos foram aprovados e reprovados", () => {
    const aprovados = relatorios.filter((r) => r.statusGeral === "Aprovado");
    const reprovados = relatorios.filter((r) => r.statusGeral === "Reprovado");
    expect(aprovados).toHaveLength(3); // A, B, C
    expect(reprovados).toHaveLength(3); // D, E, F
  });

  test("métrica: taxa de aprovação da turma (eficácia da catequese)", () => {
    const total = relatorios.length;
    const aprovados = relatorios.filter((r) => r.statusGeral === "Aprovado").length;
    const taxaAprovacao = (aprovados / total) * 100;
    expect(taxaAprovacao).toBe(50); // 3 de 6
  });

  test("métrica: presença média da turma na catequese", () => {
    const soma = relatorios.reduce((acc, r) => acc + r.presencaCatequese, 0);
    const media = soma / relatorios.length;
    // (100+90+75+70+100+40)/6 = 79.17
    expect(media).toBeCloseTo(79.17, 1);
  });

  test("métrica: identifica o principal motivo de reprovação na turma", () => {
    const motivos = relatorios
      .filter((r) => r.statusGeral === "Reprovado")
      .flatMap((r) => r.motivos);
    // Conta ocorrências de cada motivo
    const contagem = {};
    motivos.forEach((m) => {
      contagem[m] = (contagem[m] || 0) + 1;
    });
    expect(contagem["Frequência insuficiente na catequese."]).toBe(2); // D e F
    expect(contagem["Frequência insuficiente nas missas."]).toBe(2); // E e F
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cenário 3: Consistência entre as duas formas de entrada
// ─────────────────────────────────────────────────────────────────────────────
describe("Integração - consistência entre entidade e objetos crus", () => {
  test("mesma frequência produz o mesmo resultado por qualquer caminho", () => {
    // Via entidade
    const aluno = new Catequizando("Teste");
    for (let i = 0; i < 16; i++) aluno.registrarCatequese("presente");
    for (let i = 0; i < 4; i++) aluno.registrarCatequese("falta");
    for (let i = 0; i < 8; i++) aluno.registrarMissa("presente");
    for (let i = 0; i < 2; i++) aluno.registrarMissa("falta");
    const viaEntidade = emitirRelatorio(aluno);

    // Via objetos crus (mesmos números)
    const viaObjetos = emitirRelatorio(
      "Teste",
      { totalAulas: 20, presencas: 16 },
      { totalAulas: 10, presencas: 8 }
    );

    expect(viaEntidade.presencaCatequese).toBe(viaObjetos.presencaCatequese);
    expect(viaEntidade.presencaMissa).toBe(viaObjetos.presencaMissa);
    expect(viaEntidade.statusGeral).toBe(viaObjetos.statusGeral);
  });
});
