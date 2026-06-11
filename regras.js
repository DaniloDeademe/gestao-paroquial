/* ==========================================================================
 * regras.js — Regras de Negócio da Catequese
 * --------------------------------------------------------------------------
 * Este arquivo concentra TODA a lógica de aprovação, do mesmo jeito que foi
 * especificado e testado com Jest na etapa de Engenharia de Software.
 *
 * Regra do cliente (o pároco):
 *   - Mínimo de 75% de presença na CATEQUESE
 *   - Mínimo de 75% de presença nas MISSAS (avaliado separadamente)
 *   - Faltas justificadas (atestado) são ABONADAS: saem do denominador
 *   - O catequizando só é APROVADO se passar nos DOIS critérios
 * ========================================================================== */

// Percentual mínimo exigido (a regra dos 75% em uma constante).
var PERCENTUAL_MINIMO = 75;

/**
 * Arredonda para 2 casas decimais corrigindo o erro de ponto flutuante do
 * JavaScript (ex.: 0.1 + 0.2 !== 0.3). Mesma função do projeto em Jest.
 */
function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula o percentual de presença de uma lista de registros de um tipo.
 * @param {Array} presencas - lista de objetos { tipo, situacao }
 * @param {string} tipo - 'catequese' ou 'missa'
 * @returns {number|null} percentual de 0 a 100, ou null se não há registros
 */
function calcularPercentual(presencas, tipo) {
  var doTipo = presencas.filter(function (p) { return p.tipo === tipo; });
  if (doTipo.length === 0) return null; // ainda não houve encontros

  var presentes = doTipo.filter(function (p) { return p.situacao === 'presente'; }).length;
  var justificadas = doTipo.filter(function (p) { return p.situacao === 'justificada'; }).length;

  // Faltas justificadas saem do denominador (são abonadas).
  var denominador = doTipo.length - justificadas;

  // Se TODAS as aulas foram justificadas, não há o que cobrar: 100%.
  if (denominador === 0) return 100;

  return arredondar((presentes / denominador) * 100);
}

/**
 * Decide o status a partir de um percentual.
 * @returns {string} 'Aprovado', 'Reprovado' ou 'Sem dados'
 */
function statusPorPercentual(percentual) {
  if (percentual === null) return 'Sem dados';
  return percentual >= PERCENTUAL_MINIMO ? 'Aprovado' : 'Reprovado';
}

/**
 * Avalia a situação completa de um catequizando.
 * @param {Object} aluno - { id, ... }
 * @param {Array} todasPresencas - todas as presenças do sistema
 * @returns {Object} resultado consolidado com percentuais, status e motivos
 */
function avaliarAluno(aluno, todasPresencas) {
  var minhas = todasPresencas.filter(function (p) {
    return p.catequizandoId === aluno.id;
  });

  var pCatequese = calcularPercentual(minhas, 'catequese');
  var pMissa = calcularPercentual(minhas, 'missa');

  var statusCatequese = statusPorPercentual(pCatequese);
  var statusMissa = statusPorPercentual(pMissa);

  // Monta a lista de motivos de reprovação (útil para o boletim).
  var motivos = [];
  if (statusCatequese === 'Reprovado') motivos.push('Frequência insuficiente na catequese');
  if (statusMissa === 'Reprovado') motivos.push('Frequência insuficiente nas missas');

  // Status geral: aprovado SÓ se passar nos dois critérios.
  var statusGeral;
  if (statusCatequese === 'Aprovado' && statusMissa === 'Aprovado') {
    statusGeral = 'Aprovado';
  } else if (statusCatequese === 'Sem dados' || statusMissa === 'Sem dados') {
    statusGeral = 'Em andamento';
  } else {
    statusGeral = 'Reprovado';
  }

  return {
    percentualCatequese: pCatequese,
    percentualMissa: pMissa,
    statusCatequese: statusCatequese,
    statusMissa: statusMissa,
    statusGeral: statusGeral,
    motivos: motivos,
  };
}
