/**
 * Testes de Regressão - Bugs Documentados e Casos de Borda
 * ==================================================================
 * Cada teste aqui corresponde a um problema REAL identificado durante o
 * desenvolvimento. Mantê-los na suíte garante que, se alguém alterar o
 * código no futuro e reintroduzir o bug, o teste falhará imediatamente.
 *
 * Esta é uma prática central de Qualidade de Software: a suíte de testes
 * funciona como uma "rede de segurança" viva contra regressões.
 */

const {
  calcularPercentualPresenca,
  verificarAprovacao,
  arredondar,
} = require("../src/regrasFrequencia");
const { avaliarSituacao } = require("../src/regrasAprovacao");
const Catequizando = require("../src/Catequizando");
const { emitirRelatorio } = require("../src/casosDeUso");

// ─────────────────────────────────────────────────────────────────────────────
describe("Regressão - precisão de ponto flutuante", () => {
  /**
   * BUG #1: Em JavaScript, 0.1 + 0.2 !== 0.3. Sem tratamento, cálculos de
   * porcentagem geravam dízimas como 74.99999999 que reprovavam alunos que
   * deveriam ter exatamente 75%. A função arredondar() com Number.EPSILON
   * corrige isso.
   */
  test("BUG #1: cálculo que daria 74.9999... deve resultar em 75 exato", () => {
    // 3/4 = 0.75 — caso clássico onde a multiplicação pode introduzir ruído
    const resultado = calcularPercentualPresenca(4, 3);
    expect(resultado).toBe(75);
    // Garante que o aluno no limite NÃO é reprovado por erro numérico
    expect(verificarAprovacao(resultado)).toBe("Aprovado");
  });

  test("BUG #1b: arredondamento de .5 deve subir (76.665 → 76.67)", () => {
    // Sem Number.EPSILON, Math.round(76.665 * 100)/100 retornava 76.66
    expect(arredondar(76.665)).toBe(76.67);
  });

  test("BUG #1c: percentual de 7 presenças em 8 não pode quebrar", () => {
    // 7/8 = 0.875 → 87.5%
    expect(calcularPercentualPresenca(8, 7)).toBe(87.5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Regressão - divisão por zero em faltas justificadas", () => {
  /**
   * BUG #2: Quando TODAS as aulas eram justificadas, o denominador
   * (totalAulas - faltasJustificadas) virava zero, causando divisão por
   * zero e retornando NaN ou Infinity. A regra de negócio decidiu que,
   * nesse caso, o aluno tem 100% (não há aulas a cobrar).
   */
  test("BUG #2: todas as aulas justificadas retorna 100%, não NaN", () => {
    const resultado = calcularPercentualPresenca(10, 0, 10);
    expect(resultado).toBe(100);
    expect(Number.isNaN(resultado)).toBe(false);
    expect(Number.isFinite(resultado)).toBe(true);
  });

  test("BUG #2b: status de quem teve tudo justificado é Aprovado", () => {
    const resultado = calcularPercentualPresenca(5, 0, 5);
    expect(verificarAprovacao(resultado)).toBe("Aprovado");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Regressão - mutação acidental do relatório", () => {
  /**
   * BUG #3: O relatório retornado podia ser alterado externamente, o que
   * permitiria "fraudar" um boletim já emitido (ex: mudar Reprovado para
   * Aprovado). A solução foi congelar o objeto com Object.freeze().
   */
  test("BUG #3: não é possível alterar o status de um relatório emitido", () => {
    const relatorio = emitirRelatorio(
      "João",
      { totalAulas: 20, presencas: 10 }, // 50% → Reprovado
      { totalAulas: 10, presencas: 8 }
    );
    expect(relatorio.statusGeral).toBe("Reprovado");

    // Tentativa de fraude: alterar o objeto congelado
    try {
      relatorio.statusGeral = "Aprovado";
    } catch (e) {
      // Em strict mode lança TypeError; fora dele, silenciosamente ignora
    }
    // O status permanece Reprovado de qualquer forma
    expect(relatorio.statusGeral).toBe("Reprovado");
    expect(Object.isFrozen(relatorio)).toBe(true);
  });

  test("BUG #3b: array interno de atividades não vaza pela cópia", () => {
    const aluno = new Catequizando("Maria");
    aluno.registrarAtividade(8);
    const copia = aluno.resumoAtividades();
    copia.push({ nota: 0, peso: 1 }); // tenta poluir
    expect(aluno.resumoAtividades()).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Regressão - critério de notas sendo aplicado por engano", () => {
  /**
   * BUG #4: Em uma versão, quando uma turma sem avaliação numérica tinha
   * atividades acidentalmente preenchidas, o sistema reprovava alunos com
   * boa presença por causa de notas que não deveriam contar. A regra
   * confirmou que notas só entram quando avaliarNotas === true.
   */
  test("BUG #4: notas presentes mas avaliarNotas=false não reprovam", () => {
    const r = avaliarSituacao({
      catequese: { totalAulas: 20, presencas: 18 }, // 90%
      missa: { totalAulas: 20, presencas: 18 }, // 90%
      atividades: [1, 2, 1], // média péssima
      avaliarNotas: false, // mas desligado
    });
    expect(r.statusGeral).toBe("Aprovado");
    expect(r.avaliouNotas).toBe(false);
  });

  test("BUG #4b: lista de atividades vazia com avaliarNotas=true não quebra", () => {
    const r = avaliarSituacao({
      catequese: { totalAulas: 20, presencas: 18 },
      missa: { totalAulas: 20, presencas: 18 },
      atividades: [],
      avaliarNotas: true,
    });
    expect(r.statusGeral).toBe("Aprovado");
    expect(r.avaliouNotas).toBe(false); // vazia = ignorada
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Regressão - contadores de catequese e missa não se misturam", () => {
  /**
   * BUG #5: Uma refatoração do método interno _aplicarSituacao acidentalmente
   * incrementava o contador errado, fazendo presença de missa contar como
   * catequese. Este teste blinda a separação dos dois contextos.
   */
  test("BUG #5: presença na missa não afeta o percentual da catequese", () => {
    const aluno = new Catequizando("Pedro");
    // Só registra missa, nunca catequese de presença
    aluno.registrarCatequese("falta");
    for (let i = 0; i < 10; i++) aluno.registrarMissa("presente");

    const resumoCat = aluno.resumoCatequese();
    const resumoMissa = aluno.resumoMissa();
    expect(resumoCat.presencas).toBe(0); // catequese intacta
    expect(resumoMissa.presencas).toBe(10); // missa correta
  });
});
