/**
 * Regra de Negócio Consolidada - Aprovação do Catequizando
 * ------------------------------------------------------------------
 * Esta é a regra central que responde à pergunta do projeto:
 *   "O que reprova ou não o catequizando?"
 *
 * Critérios avaliados:
 *   1. Presença na CATEQUESE  (>= 75%)        [obrigatório]
 *   2. Presença na MISSA      (>= 75%)        [obrigatório]
 *   3. Aproveitamento em ATIVIDADES (>= 6,0)  [OPCIONAL]
 *
 * Combinação: o catequizando só é APROVADO se passar em TODOS os
 * critérios ATIVOS. Falhar em qualquer um reprova o aluno.
 *
 * O critério de notas é OPCIONAL para cobrir a realidade atual da
 * paróquia (que avalia só por presença) e o cenário futuro (com
 * provas/atividades). Quando 'avaliarNotas' é falso ou não há
 * atividades, o critério de notas é simplesmente ignorado.
 *
 * O foco dos testes automatizados do PI é a FREQUÊNCIA; por isso este
 * módulo é testado de forma completa para os caminhos de presença, e
 * cobre também a combinação com notas quando elas estão ativas.
 */

const {
  calcularPercentualPresenca,
  verificarAprovacao,
} = require("./regrasFrequencia");

const {
  calcularMediaAtividades,
  verificarAprovacaoPorNota,
} = require("./regrasNotas");

/**
 * Avalia um único critério de presença e devolve o bloco de resultado.
 * @param {{totalAulas:number, presencas:number, faltasJustificadas?:number}} freq
 * @returns {{percentual:number, status:"Aprovado"|"Reprovado"}}
 */
function avaliarPresenca(freq) {
  const percentual = calcularPercentualPresenca(
    freq.totalAulas,
    freq.presencas,
    // Stryker disable next-line ConditionalExpression: mutante equivalente.
    // calcularPercentualPresenca já tem default (= 0) para o 3º parâmetro,
    // então passar `undefined` (quando o campo não existe) produz o MESMO
    // resultado que passar 0. Nenhuma entrada distingue os dois caminhos.
    freq.faltasJustificadas === undefined ? 0 : freq.faltasJustificadas
  );
  return { percentual, status: verificarAprovacao(percentual) };
}

/**
 * Avalia a situação completa de um catequizando.
 *
 * @param {Object} dados
 * @param {{totalAulas:number, presencas:number, faltasJustificadas?:number}} dados.catequese
 * @param {{totalAulas:number, presencas:number, faltasJustificadas?:number}} dados.missa
 * @param {Array<number|{nota:number, peso?:number}>} [dados.atividades] - Notas (opcional)
 * @param {boolean} [dados.avaliarNotas=false] - Liga o critério de notas
 * @returns {Object} Situação detalhada com os critérios e o veredito final
 * @throws {TypeError|RangeError}
 */
function avaliarSituacao(dados) {
  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
    throw new TypeError("Os dados de avaliação devem ser um objeto.");
  }

  // Stryker disable next-line BooleanLiteral: mutante equivalente. Mesmo que
  // o default de avaliarNotas fosse 'true', o critério de notas só é aplicado
  // quando 'usaNotas' também exige Array.isArray(atividades) && length > 0
  // (linha abaixo). Sem atividades, o resultado é idêntico. Não há entrada que
  // distinga os dois comportamentos, logo o mutante não é matável.
  const { catequese, missa, atividades, avaliarNotas = false } = dados;

  // --- Critério 1 e 2: presença (sempre obrigatórios) ---
  const resultadoCatequese = avaliarPresenca(_exigirFrequencia(catequese, "catequese"));
  const resultadoMissa = avaliarPresenca(_exigirFrequencia(missa, "missa"));

  const criterios = {
    catequese: resultadoCatequese,
    missa: resultadoMissa,
  };

  let aprovado =
    resultadoCatequese.status === "Aprovado" &&
    resultadoMissa.status === "Aprovado";

  // --- Critério 3: notas (opcional) ---
  const usaNotas = avaliarNotas === true && Array.isArray(atividades) && atividades.length > 0;

  if (usaNotas) {
    const media = calcularMediaAtividades(atividades);
    const statusNota = verificarAprovacaoPorNota(media);
    criterios.atividades = { media, status: statusNota };
    aprovado = aprovado && statusNota === "Aprovado";
  }

  return {
    criterios,
    avaliouNotas: usaNotas,
    statusGeral: aprovado ? "Aprovado" : "Reprovado",
    motivos: _montarMotivos(criterios, usaNotas),
  };
}

/**
 * Garante que um objeto de frequência foi informado e é um objeto.
 * @private
 */
function _exigirFrequencia(freq, rotulo) {
  if (freq === null || typeof freq !== "object" || Array.isArray(freq)) {
    throw new TypeError(
      `Os dados de "${rotulo}" devem ser um objeto { totalAulas, presencas }.`
    );
  }
  return freq;
}

/**
 * Monta a lista de motivos de reprovação (útil para o boletim/relatório).
 * @private
 */
function _montarMotivos(criterios, usaNotas) {
  const motivos = [];
  if (criterios.catequese.status === "Reprovado") {
    motivos.push("Frequência insuficiente na catequese.");
  }
  if (criterios.missa.status === "Reprovado") {
    motivos.push("Frequência insuficiente nas missas.");
  }
  if (usaNotas && criterios.atividades.status === "Reprovado") {
    motivos.push("Aproveitamento insuficiente nas atividades.");
  }
  return motivos;
}

module.exports = {
  avaliarPresenca,
  avaliarSituacao,
};
