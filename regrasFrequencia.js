/**
 * Regras de Negócio - Cálculo de Frequência
 * ------------------------------------------------------------------
 * Funções PURAS (sem efeitos colaterais) que implementam as regras
 * matemáticas levantadas na Engenharia de Requisitos junto ao padre.
 *
 * São o alvo principal dos testes de unidade no Jest:
 *  - Particionamento de Equivalência
 *  - Análise de Valor Limite
 */

const {
  validarInteiroNaoNegativo,
  validarInteiroPositivo,
} = require("./validacoes");

// Frequência mínima exigida para aprovação (regra do cliente).
const PERCENTUAL_MINIMO = 75;

/**
 * Calcula o percentual de presença.
 *
 * Faltas justificadas (ex.: atestado médico) são ABONADAS: elas saem
 * do denominador, de modo que não prejudicam o catequizando.
 *
 * Fórmula: presencas / (totalAulas - faltasJustificadas) * 100
 *
 * @param {number} totalAulas - Total de encontros realizados (> 0)
 * @param {number} presencas - Encontros em que o aluno esteve presente (>= 0)
 * @param {number} [faltasJustificadas=0] - Faltas abonadas (>= 0)
 * @returns {number} Percentual de presença (0 a 100), arredondado a 2 casas
 * @throws {TypeError|RangeError}
 */
function calcularPercentualPresenca(totalAulas, presencas, faltasJustificadas = 0) {
  validarInteiroPositivo(totalAulas, "totalAulas");
  validarInteiroNaoNegativo(presencas, "presencas");
  validarInteiroNaoNegativo(faltasJustificadas, "faltasJustificadas");

  if (presencas > totalAulas) {
    throw new RangeError(
      "As presenças não podem ser maiores que o total de aulas."
    );
  }
  if (faltasJustificadas > totalAulas) {
    throw new RangeError(
      "As faltas justificadas não podem ser maiores que o total de aulas."
    );
  }
  if (presencas + faltasJustificadas > totalAulas) {
    throw new RangeError(
      "A soma de presenças e faltas justificadas não pode exceder o total de aulas."
    );
  }

  const aulasConsideradas = totalAulas - faltasJustificadas;

  // Se todas as aulas foram abonadas, considera-se 100% (não há o que cobrar).
  if (aulasConsideradas === 0) {
    return 100;
  }

  const percentual = (presencas / aulasConsideradas) * 100;
  return arredondar(percentual);
}

/**
 * Define o status de aprovação a partir de um percentual.
 * Regra de Valor Limite: exatamente 75% APROVA; 74,99% REPROVA.
 *
 * @param {number} percentual - Percentual de presença (0 a 100)
 * @returns {"Aprovado"|"Reprovado"}
 * @throws {TypeError|RangeError}
 */
function verificarAprovacao(percentual) {
  if (typeof percentual !== "number" || Number.isNaN(percentual)) {
    throw new TypeError('O campo "percentual" deve ser um número válido.');
  }
  if (percentual < 0 || percentual > 100) {
    throw new RangeError('O campo "percentual" deve estar entre 0 e 100.');
  }
  return percentual >= PERCENTUAL_MINIMO ? "Aprovado" : "Reprovado";
}

/**
 * Arredonda um número para 2 casas decimais, evitando os erros
 * clássicos de ponto flutuante (ex.: 76.665 → 76.67).
 *
 * @param {number} valor
 * @returns {number}
 */
function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

module.exports = {
  PERCENTUAL_MINIMO,
  calcularPercentualPresenca,
  verificarAprovacao,
  arredondar,
};
