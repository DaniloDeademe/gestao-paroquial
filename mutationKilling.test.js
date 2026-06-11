/**
 * Testes de Eliminação de Mutantes (Mutation Killing)
 * ==================================================================
 * Estes testes foram escritos especificamente para "matar" mutantes que
 * sobreviveram à análise de mutação (Stryker). Um mutante sobrevive
 * quando uma alteração no código (ex: trocar >= por >, ou apagar uma
 * mensagem de erro) NÃO é detectada por nenhum teste.
 *
 * Matar mutantes força os testes a verificarem:
 *  - A MENSAGEM exata dos erros (não só que "algum" erro ocorreu).
 *  - O TIPO específico de cada erro (TypeError vs RangeError).
 *  - CADA condição isolada de guardas compostas (||, &&).
 *  - Os limites exatos de cada operador relacional.
 *
 * Resultado: suíte robusta que detecta regressões sutis.
 */

const {
  calcularPercentualPresenca,
  verificarAprovacao,
} = require("../src/regrasFrequencia");
const { avaliarSituacao } = require("../src/regrasAprovacao");
const {
  validarInteiroNaoNegativo,
  validarInteiroPositivo,
  validarTextoObrigatorio,
} = require("../src/validacoes");

// ─────────────────────────────────────────────────────────────────────────────
// Matar mutantes de MENSAGEM e TIPO em validações
// ─────────────────────────────────────────────────────────────────────────────
describe("Mutation killing - mensagens e tipos exatos das validações", () => {
  test("erro de não-número traz a mensagem e o tipo corretos", () => {
    expect(() => validarInteiroNaoNegativo("x", "presencas")).toThrow(TypeError);
    expect(() => validarInteiroNaoNegativo("x", "presencas")).toThrow(
      'O campo "presencas" deve ser um número válido.'
    );
  });

  test("erro de Infinity traz a mensagem de 'finito'", () => {
    expect(() => validarInteiroNaoNegativo(Infinity, "totalAulas")).toThrow(
      RangeError
    );
    expect(() => validarInteiroNaoNegativo(Infinity, "totalAulas")).toThrow(
      'O campo "totalAulas" deve ser um número finito.'
    );
  });

  test("erro de decimal traz a mensagem de 'inteiro'", () => {
    expect(() => validarInteiroNaoNegativo(3.5, "presencas")).toThrow(
      'O campo "presencas" deve ser um número inteiro.'
    );
  });

  test("erro de negativo traz a mensagem de 'não pode ser negativo'", () => {
    expect(() => validarInteiroNaoNegativo(-1, "presencas")).toThrow(
      'O campo "presencas" não pode ser negativo.'
    );
  });

  test("erro de zero no positivo traz 'maior que zero'", () => {
    expect(() => validarInteiroPositivo(0, "totalAulas")).toThrow(
      'O campo "totalAulas" deve ser maior que zero.'
    );
  });

  test("erro de texto vazio traz 'é obrigatório' e é TypeError", () => {
    expect(() => validarTextoObrigatorio("", "nome")).toThrow(TypeError);
    expect(() => validarTextoObrigatorio("", "nome")).toThrow(
      'O campo "nome" é obrigatório.'
    );
  });

  // Isola cada condição do guard composto: typeof !== "string"  ||  trim === ""
  test("texto: rejeita não-string (primeira condição do OU)", () => {
    expect(() => validarTextoObrigatorio(123, "nome")).toThrow(
      'O campo "nome" é obrigatório.'
    );
  });

  test("texto: rejeita string só de espaços (segunda condição do OU)", () => {
    expect(() => validarTextoObrigatorio("    ", "nome")).toThrow(
      'O campo "nome" é obrigatório.'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Matar mutantes de OPERADOR RELACIONAL na fronteira (>= vs > vs <)
// ─────────────────────────────────────────────────────────────────────────────
describe("Mutation killing - fronteira exata de aprovação (>=)", () => {
  /**
   * Se alguém trocar `percentual >= 75` por `percentual > 75`, o caso de
   * EXATAMENTE 75% passaria a reprovar. Este teste mata esse mutante.
   * Se trocar por `<`, ambos os casos quebram.
   */
  test("75% exato aprova (mata mutante >= → >)", () => {
    expect(verificarAprovacao(75)).toBe("Aprovado");
  });

  test("74.99% reprova (mata mutante >= → >=algo-menor)", () => {
    expect(verificarAprovacao(74.99)).toBe("Reprovado");
  });

  test("75.01% aprova (confirma direção do operador)", () => {
    expect(verificarAprovacao(75.01)).toBe("Aprovado");
  });

  // Limites de validação de percentual: < 0 e > 100
  test("percentual 0 é válido e reprova (mata mutante de limite inferior)", () => {
    expect(verificarAprovacao(0)).toBe("Reprovado");
  });

  test("percentual 100 é válido e aprova (mata mutante de limite superior)", () => {
    expect(verificarAprovacao(100)).toBe("Aprovado");
  });

  test("percentual -0.01 é rejeitado (logo abaixo de 0)", () => {
    expect(() => verificarAprovacao(-0.01)).toThrow(RangeError);
  });

  test("percentual 100.01 é rejeitado (logo acima de 100)", () => {
    expect(() => verificarAprovacao(100.01)).toThrow(RangeError);
  });

  // Mata mutantes que apagam as mensagens de erro de verificarAprovacao.
  test("erro de tipo inválido em verificarAprovacao traz a mensagem exata", () => {
    expect(() => verificarAprovacao("75")).toThrow(
      'O campo "percentual" deve ser um número válido.'
    );
  });

  test("erro de fora de faixa em verificarAprovacao traz a mensagem exata", () => {
    expect(() => verificarAprovacao(150)).toThrow(
      'O campo "percentual" deve estar entre 0 e 100.'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Matar mutantes nas comparações de presença x total
// ─────────────────────────────────────────────────────────────────────────────
describe("Mutation killing - comparações de presença e total", () => {
  /**
   * Guarda: `presencas > totalAulas`. Trocar > por >= reprovaria o caso
   * válido presencas === totalAulas (presença perfeita). Este teste mata
   * esse mutante ao confirmar que presença == total é PERMITIDA.
   */
  test("presencas igual ao total é válido (mata mutante > → >=)", () => {
    expect(calcularPercentualPresenca(10, 10)).toBe(100);
  });

  test("presencas um a mais que o total é rejeitado", () => {
    expect(() => calcularPercentualPresenca(10, 11)).toThrow(
      "As presenças não podem ser maiores que o total de aulas."
    );
  });

  test("faltas justificadas igual ao total é válido (mata mutante > → >=)", () => {
    // 0 presenças, 10 justificadas, 10 total → tudo abonado → 100%
    expect(calcularPercentualPresenca(10, 0, 10)).toBe(100);
  });

  test("faltas justificadas uma a mais que o total é rejeitado", () => {
    expect(() => calcularPercentualPresenca(10, 0, 11)).toThrow(
      "As faltas justificadas não podem ser maiores que o total de aulas."
    );
  });

  test("soma presencas+justificadas igual ao total é válida (limite)", () => {
    // 6 presenças + 4 justificadas = 10 = total → válido. 6/(10-4)=100%
    expect(calcularPercentualPresenca(10, 6, 4)).toBe(100);
  });

  test("soma presencas+justificadas um a mais que o total é rejeitada", () => {
    expect(() => calcularPercentualPresenca(10, 7, 4)).toThrow(
      "A soma de presenças e faltas justificadas não pode exceder o total de aulas."
    );
  });

  // Guarda de aulasConsideradas === 0 (mata mutante que troca o valor de retorno)
  test("quando aulasConsideradas é 0, retorna exatamente 100 (não 0)", () => {
    const resultado = calcularPercentualPresenca(3, 0, 3);
    expect(resultado).toBe(100);
    expect(resultado).not.toBe(0);
  });

  /**
   * Mata mutantes que apagam o NOME do campo passado às validações internas.
   * Confirma que o erro de "presencas" cita "presencas", e o de
   * "faltasJustificadas" cita "faltasJustificadas" — garantindo que a
   * mensagem que chega ao usuário identifica corretamente o campo culpado.
   */
  test("erro em presenças negativas cita o campo 'presencas'", () => {
    expect(() => calcularPercentualPresenca(10, -1)).toThrow(
      'O campo "presencas" não pode ser negativo.'
    );
  });

  test("erro em presenças decimais cita o campo 'presencas'", () => {
    expect(() => calcularPercentualPresenca(10, 2.5)).toThrow(
      'O campo "presencas" deve ser um número inteiro.'
    );
  });

  test("erro em faltas justificadas negativas cita o campo 'faltasJustificadas'", () => {
    expect(() => calcularPercentualPresenca(10, 5, -1)).toThrow(
      'O campo "faltasJustificadas" não pode ser negativo.'
    );
  });

  test("erro em faltas justificadas decimais cita o campo 'faltasJustificadas'", () => {
    expect(() => calcularPercentualPresenca(10, 5, 1.5)).toThrow(
      'O campo "faltasJustificadas" deve ser um número inteiro.'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Matar mutantes em avaliarSituacao (guarda de entrada e default de faltas)
// ─────────────────────────────────────────────────────────────────────────────
describe("Mutation killing - guardas de avaliarSituacao", () => {
  const ok = { totalAulas: 20, presencas: 18 };

  test("rejeita null com a mensagem exata", () => {
    expect(() => avaliarSituacao(null)).toThrow(
      "Os dados de avaliação devem ser um objeto."
    );
  });

  test("rejeita array com a mensagem exata (isola Array.isArray do OU)", () => {
    expect(() => avaliarSituacao([])).toThrow(
      "Os dados de avaliação devem ser um objeto."
    );
  });

  test("rejeita string (isola typeof do OU)", () => {
    expect(() => avaliarSituacao("texto")).toThrow(TypeError);
  });

  test("catequese ausente traz mensagem específica de catequese", () => {
    expect(() => avaliarSituacao({ missa: ok })).toThrow(
      'Os dados de "catequese" devem ser um objeto { totalAulas, presencas }.'
    );
  });

  // Mata o mutante `freq === null` da guarda de _exigirFrequencia: passar
  // null explicitamente (em vez de undefined) isola essa primeira condição.
  test("rejeita catequese explicitamente null com a mensagem correta", () => {
    expect(() => avaliarSituacao({ catequese: null, missa: ok })).toThrow(
      'Os dados de "catequese" devem ser um objeto { totalAulas, presencas }.'
    );
  });

  test("rejeita missa explicitamente null com a mensagem correta", () => {
    expect(() => avaliarSituacao({ catequese: ok, missa: null })).toThrow(
      'Os dados de "missa" devem ser um objeto { totalAulas, presencas }.'
    );
  });

  test("missa ausente traz mensagem específica de missa", () => {
    expect(() => avaliarSituacao({ catequese: ok })).toThrow(
      'Os dados de "missa" devem ser um objeto { totalAulas, presencas }.'
    );
  });

  /**
   * Mata o mutante em `faltasJustificadas === undefined ? 0 : ...`.
   * Se o default for alterado, um cenário SEM faltas justificadas mudaria
   * de resultado. Confirma que ausência do campo = zero abonos.
   */
  test("ausência de faltasJustificadas equivale a zero abonos", () => {
    const semCampo = avaliarSituacao({
      catequese: { totalAulas: 20, presencas: 14 }, // 70%
      missa: ok,
    });
    const comZero = avaliarSituacao({
      catequese: { totalAulas: 20, presencas: 14, faltasJustificadas: 0 },
      missa: ok,
    });
    expect(semCampo.criterios.catequese.percentual).toBe(70);
    expect(comZero.criterios.catequese.percentual).toBe(70);
    expect(semCampo.criterios.catequese.percentual).toBe(
      comZero.criterios.catequese.percentual
    );
  });

  /**
   * Mata mutantes no AND da aprovação geral: aprovado = cat && missa && nota.
   * Cada combinação isola a contribuição de um operando.
   */
  test("aprovação exige catequese E missa (isola o AND)", () => {
    // só catequese boa
    expect(
      avaliarSituacao({ catequese: ok, missa: { totalAulas: 20, presencas: 10 } })
        .statusGeral
    ).toBe("Reprovado");
    // só missa boa
    expect(
      avaliarSituacao({ catequese: { totalAulas: 20, presencas: 10 }, missa: ok })
        .statusGeral
    ).toBe("Reprovado");
    // ambas boas
    expect(avaliarSituacao({ catequese: ok, missa: ok }).statusGeral).toBe(
      "Aprovado"
    );
  });

  /**
   * Mata mutantes na condição `typeof freq !== "object"` de _exigirFrequencia.
   * Passar um tipo primitivo (string/número) que NÃO é null nem array isola
   * exatamente a verificação de typeof.
   */
  test("rejeita catequese como string (isola typeof em _exigirFrequencia)", () => {
    expect(() => avaliarSituacao({ catequese: "20", missa: ok })).toThrow(
      'Os dados de "catequese" devem ser um objeto'
    );
  });

  test("rejeita catequese como número (isola typeof em _exigirFrequencia)", () => {
    expect(() => avaliarSituacao({ catequese: 90, missa: ok })).toThrow(
      'Os dados de "catequese" devem ser um objeto'
    );
  });

  test("rejeita missa como string (isola typeof em _exigirFrequencia)", () => {
    expect(() => avaliarSituacao({ catequese: ok, missa: "ok" })).toThrow(
      'Os dados de "missa" devem ser um objeto'
    );
  });

  test("rejeita catequese como booleano (cobre outro primitivo)", () => {
    expect(() => avaliarSituacao({ catequese: true, missa: ok })).toThrow(
      TypeError
    );
  });

  /**
   * Mata o mutante da primeira condição da guarda de avaliarSituacao:
   * `dados === null`. Passar undefined isola este ramo (undefined !== null,
   * mas typeof undefined !== "object" pega — então confirmamos que null
   * especificamente também é tratado com a mesma mensagem).
   */
  test("rejeita undefined com a mensagem de objeto", () => {
    expect(() => avaliarSituacao(undefined)).toThrow(
      "Os dados de avaliação devem ser um objeto."
    );
  });

  test("rejeita número como dados (isola typeof do primeiro guard)", () => {
    expect(() => avaliarSituacao(42)).toThrow(
      "Os dados de avaliação devem ser um objeto."
    );
  });
});
