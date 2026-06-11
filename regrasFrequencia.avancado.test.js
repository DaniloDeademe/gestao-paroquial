/**
 * Testes Avançados - Regras de Frequência
 * ==================================================================
 * Complementa regrasFrequencia.test.js com técnicas mais robustas:
 *
 *  - Testes Parametrizados (test.each): tabelas de casos, reduzindo
 *    duplicação e tornando a intenção de cada cenário explícita.
 *  - Property-Based Testing: verifica PROPRIEDADES INVARIANTES que
 *    devem valer para QUALQUER entrada válida, não apenas exemplos.
 *  - Testes de Robustez: entradas extremas e adversas.
 */

const {
  calcularPercentualPresenca,
  verificarAprovacao,
  arredondar,
  PERCENTUAL_MINIMO,
} = require("../src/regrasFrequencia");

// ─────────────────────────────────────────────────────────────────────────────
// TESTES PARAMETRIZADOS - Tabela de cálculo de presença
// ─────────────────────────────────────────────────────────────────────────────
describe("calcularPercentualPresenca - tabela de casos (test.each)", () => {
  // [totalAulas, presencas, faltasJustificadas, percentualEsperado, descrição]
  test.each([
    [10, 10, 0, 100, "presença total"],
    [10, 0, 0, 0, "ausência total"],
    [10, 5, 0, 50, "metade"],
    [4, 3, 0, 75, "limite exato de aprovação"],
    [4, 1, 0, 25, "um quarto"],
    [3, 1, 0, 33.33, "dízima arredondada para baixo"],
    [3, 2, 0, 66.67, "dízima arredondada para cima"],
    [8, 7, 0, 87.5, "fração com meio ponto"],
    [20, 14, 2, 77.78, "com 2 faltas justificadas"],
    [20, 14, 0, 70, "sem faltas justificadas"],
    [100, 75, 0, 75, "limite com base 100"],
    [100, 74, 0, 74, "logo abaixo do limite"],
    [7, 5, 1, 83.33, "justificada altera denominador"],
    [5, 0, 5, 100, "todas as aulas justificadas"],
  ])(
    "total=%i presenças=%i justificadas=%i → %f%% (%s)",
    (total, presencas, justificadas, esperado) => {
      expect(calcularPercentualPresenca(total, presencas, justificadas)).toBe(
        esperado
      );
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTES PARAMETRIZADOS - Tabela de aprovação (valor limite detalhado)
// ─────────────────────────────────────────────────────────────────────────────
describe("verificarAprovacao - tabela de valor limite (test.each)", () => {
  test.each([
    [0, "Reprovado"],
    [50, "Reprovado"],
    [74, "Reprovado"],
    [74.9, "Reprovado"],
    [74.99, "Reprovado"],
    [74.999, "Reprovado"],
    [75, "Aprovado"],
    [75.001, "Aprovado"],
    [75.01, "Aprovado"],
    [76, "Aprovado"],
    [90, "Aprovado"],
    [100, "Aprovado"],
  ])("percentual %f%% → %s", (percentual, esperado) => {
    expect(verificarAprovacao(percentual)).toBe(esperado);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY-BASED TESTING - Propriedades invariantes
// ─────────────────────────────────────────────────────────────────────────────
describe("calcularPercentualPresenca - propriedades invariantes", () => {
  // Gera N casos aleatórios válidos e verifica propriedades que SEMPRE valem.
  const NUM_CASOS = 500;

  function casoAleatorio() {
    const total = 1 + Math.floor(Math.random() * 200); // 1 a 200 aulas
    const presencas = Math.floor(Math.random() * (total + 1)); // 0 a total
    return { total, presencas };
  }

  test("propriedade: o percentual está sempre entre 0 e 100", () => {
    for (let i = 0; i < NUM_CASOS; i++) {
      const { total, presencas } = casoAleatorio();
      const p = calcularPercentualPresenca(total, presencas);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
  });

  test("propriedade: presença total sempre resulta em 100%", () => {
    for (let i = 0; i < NUM_CASOS; i++) {
      const total = 1 + Math.floor(Math.random() * 200);
      expect(calcularPercentualPresenca(total, total)).toBe(100);
    }
  });

  test("propriedade: ausência total sempre resulta em 0%", () => {
    for (let i = 0; i < NUM_CASOS; i++) {
      const total = 1 + Math.floor(Math.random() * 200);
      expect(calcularPercentualPresenca(total, 0)).toBe(0);
    }
  });

  test("propriedade: monotonicidade - mais presenças nunca diminui o percentual", () => {
    for (let i = 0; i < NUM_CASOS; i++) {
      const total = 2 + Math.floor(Math.random() * 200);
      const presencas = Math.floor(Math.random() * total); // 0 a total-1
      const menor = calcularPercentualPresenca(total, presencas);
      const maior = calcularPercentualPresenca(total, presencas + 1);
      expect(maior).toBeGreaterThanOrEqual(menor);
    }
  });

  test("propriedade: faltas justificadas nunca reduzem o percentual", () => {
    for (let i = 0; i < NUM_CASOS; i++) {
      const total = 5 + Math.floor(Math.random() * 100);
      const presencas = Math.floor(Math.random() * (total - 2));
      const semAbono = calcularPercentualPresenca(total, presencas, 0);
      const comAbono = calcularPercentualPresenca(total, presencas, 1);
      expect(comAbono).toBeGreaterThanOrEqual(semAbono);
    }
  });
});

describe("verificarAprovacao - propriedades invariantes", () => {
  test("propriedade: o retorno é sempre 'Aprovado' ou 'Reprovado'", () => {
    for (let i = 0; i < 500; i++) {
      const percentual = Math.random() * 100;
      const status = verificarAprovacao(percentual);
      expect(["Aprovado", "Reprovado"]).toContain(status);
    }
  });

  test("propriedade: a fronteira de decisão é exatamente PERCENTUAL_MINIMO", () => {
    for (let i = 0; i < 500; i++) {
      const percentual = Math.random() * 100;
      const status = verificarAprovacao(percentual);
      if (percentual >= PERCENTUAL_MINIMO) {
        expect(status).toBe("Aprovado");
      } else {
        expect(status).toBe("Reprovado");
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTES DE ROBUSTEZ - Entradas extremas e adversas
// ─────────────────────────────────────────────────────────────────────────────
describe("calcularPercentualPresenca - robustez (entradas extremas)", () => {
  test("lida com número muito grande de aulas", () => {
    expect(calcularPercentualPresenca(1000000, 750000)).toBe(75);
  });

  test("lida com 1 única aula presente", () => {
    expect(calcularPercentualPresenca(1, 1)).toBe(100);
  });

  test("lida com 1 única aula ausente", () => {
    expect(calcularPercentualPresenca(1, 0)).toBe(0);
  });

  // Fuzzing: entradas inválidas variadas nunca devem retornar valor silencioso
  test.each([
    [null, 5],
    [undefined, 5],
    ["10", 5],
    [NaN, 5],
    [Infinity, 5],
    [-Infinity, 5],
    [10.5, 5],
    [10, "5"],
    [10, null],
    [10, NaN],
    [10, 5.5],
    [{}, 5],
    [[], 5],
    [10, {}],
    [true, 5],
  ])("rejeita entrada inválida (total=%p, presencas=%p)", (total, presencas) => {
    expect(() => calcularPercentualPresenca(total, presencas)).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTES DE PRECISÃO NUMÉRICA - Ponto flutuante
// ─────────────────────────────────────────────────────────────────────────────
describe("arredondar - precisão de ponto flutuante (test.each)", () => {
  test.each([
    [76.665, 76.67],
    [33.3333, 33.33],
    [66.6666, 66.67],
    [0.005, 0.01],
    [0.004, 0],
    [99.999, 100],
    [50.0, 50],
    [12.345, 12.35],
    [12.344, 12.34],
  ])("arredonda %f → %f", (entrada, esperado) => {
    expect(arredondar(entrada)).toBe(esperado);
  });

  test("propriedade: arredondar nunca produz mais de 2 casas decimais", () => {
    for (let i = 0; i < 500; i++) {
      const valor = Math.random() * 100;
      const r = arredondar(valor);
      const casas = (r.toString().split(".")[1] || "").length;
      expect(casas).toBeLessThanOrEqual(2);
    }
  });

  test("propriedade: arredondar é idempotente (arredondar duas vezes = uma vez)", () => {
    for (let i = 0; i < 500; i++) {
      const valor = Math.random() * 100;
      expect(arredondar(arredondar(valor))).toBe(arredondar(valor));
    }
  });
});
