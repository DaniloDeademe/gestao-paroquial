/**
 * Testes por Tabela de Decisão - Regra Consolidada de Aprovação
 * ==================================================================
 * Técnica de Caixa-Preta: mapeia TODAS as combinações de condições de
 * entrada para suas ações esperadas, garantindo que nenhuma regra de
 * negócio fique sem teste.
 *
 * CONDIÇÕES:
 *   C1 - Presença na catequese >= 75% ?
 *   C2 - Presença na missa >= 75% ?
 *   C3 - Média de atividades >= 6,0 ? (só quando notas ativadas)
 *
 * AÇÃO:
 *   A - statusGeral (Aprovado / Reprovado)
 *
 * ┌────────────────────────── SEM NOTAS (C3 ignorado) ──────────────────────┐
 * │ Regra │ C1  │ C2  │ Ação esperada │
 * │  R1   │ V   │ V   │ Aprovado      │
 * │  R2   │ V   │ F   │ Reprovado     │
 * │  R3   │ F   │ V   │ Reprovado     │
 * │  R4   │ F   │ F   │ Reprovado     │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────── COM NOTAS (C3 ativo) ──────────────────────────┐
 * │ Regra │ C1  │ C2  │ C3  │ Ação esperada │
 * │  R5   │ V   │ V   │ V   │ Aprovado      │
 * │  R6   │ V   │ V   │ F   │ Reprovado     │
 * │  R7   │ V   │ F   │ V   │ Reprovado     │
 * │  R8   │ V   │ F   │ F   │ Reprovado     │
 * │  R9   │ F   │ V   │ V   │ Reprovado     │
 * │  R10  │ F   │ V   │ F   │ Reprovado     │
 * │  R11  │ F   │ F   │ V   │ Reprovado     │
 * │  R12  │ F   │ F   │ F   │ Reprovado     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const { avaliarSituacao } = require("../src/regrasAprovacao");

// Cenários de presença que satisfazem (V) ou não (F) cada condição.
const PRES_OK = { totalAulas: 20, presencas: 18 }; // 90% → V
const PRES_NAO = { totalAulas: 20, presencas: 10 }; // 50% → F

// Conjuntos de atividades que satisfazem (V) ou não (F) o critério de nota.
const NOTA_OK = [8, 9, 7]; // média 8 → V
const NOTA_NAO = [4, 3, 5]; // média 4 → F

// ─────────────────────────────────────────────────────────────────────────────
// TABELA DE DECISÃO - SEM NOTAS
// ─────────────────────────────────────────────────────────────────────────────
describe("Tabela de Decisão - aprovação sem notas (R1-R4)", () => {
  // [regra, catequese, missa, statusEsperado, qtdMotivos]
  test.each([
    ["R1", PRES_OK, PRES_OK, "Aprovado", 0],
    ["R2", PRES_OK, PRES_NAO, "Reprovado", 1],
    ["R3", PRES_NAO, PRES_OK, "Reprovado", 1],
    ["R4", PRES_NAO, PRES_NAO, "Reprovado", 2],
  ])(
    "%s: catequese e missa → %s (%i motivo(s))",
    (regra, catequese, missa, esperado, qtdMotivos) => {
      const r = avaliarSituacao({ catequese, missa });
      expect(r.statusGeral).toBe(esperado);
      expect(r.motivos).toHaveLength(qtdMotivos);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TABELA DE DECISÃO - COM NOTAS
// ─────────────────────────────────────────────────────────────────────────────
describe("Tabela de Decisão - aprovação com notas (R5-R12)", () => {
  // [regra, catequese, missa, atividades, statusEsperado, qtdMotivos]
  test.each([
    ["R5", PRES_OK, PRES_OK, NOTA_OK, "Aprovado", 0],
    ["R6", PRES_OK, PRES_OK, NOTA_NAO, "Reprovado", 1],
    ["R7", PRES_OK, PRES_NAO, NOTA_OK, "Reprovado", 1],
    ["R8", PRES_OK, PRES_NAO, NOTA_NAO, "Reprovado", 2],
    ["R9", PRES_NAO, PRES_OK, NOTA_OK, "Reprovado", 1],
    ["R10", PRES_NAO, PRES_OK, NOTA_NAO, "Reprovado", 2],
    ["R11", PRES_NAO, PRES_NAO, NOTA_OK, "Reprovado", 2],
    ["R12", PRES_NAO, PRES_NAO, NOTA_NAO, "Reprovado", 3],
  ])(
    "%s: catequese/missa/notas → %s (%i motivo(s))",
    (regra, catequese, missa, atividades, esperado, qtdMotivos) => {
      const r = avaliarSituacao({
        catequese,
        missa,
        atividades,
        avaliarNotas: true,
      });
      expect(r.statusGeral).toBe(esperado);
      expect(r.motivos).toHaveLength(qtdMotivos);
    }
  );

  test("R5 (aprovação plena) não gera nenhum motivo de reprovação", () => {
    const r = avaliarSituacao({
      catequese: PRES_OK,
      missa: PRES_OK,
      atividades: NOTA_OK,
      avaliarNotas: true,
    });
    expect(r.motivos).toEqual([]);
    expect(r.avaliouNotas).toBe(true);
  });

  test("R12 (falha total) lista os três motivos na ordem correta", () => {
    const r = avaliarSituacao({
      catequese: PRES_NAO,
      missa: PRES_NAO,
      atividades: NOTA_NAO,
      avaliarNotas: true,
    });
    expect(r.motivos).toEqual([
      "Frequência insuficiente na catequese.",
      "Frequência insuficiente nas missas.",
      "Aproveitamento insuficiente nas atividades.",
    ]);
  });
});
