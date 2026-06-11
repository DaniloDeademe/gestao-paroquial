/* ==========================================================================
 * dados.js — Ligação ao Supabase (Base de Dados Real)
 * ========================================================================== */

const LOGO_URL = "assets/Santo Antônio do Jardim SP RGB 1.svg"; 
const ICONE_URL = "assets/PadroeiroSantoAntônio2.svg"; 

// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://kmaprgbdghsyftbwminu.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYXByZ2JkZ2hzeWZ0YndtaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjkxNDgsImV4cCI6MjA5Njc0NTE0OH0.Y8kuTIfgVWFYtc4NtVlPoC-ZI5nbHFJrwfbuVuBaNdg'; // <- NÃO ESQUEÇA DE COLAR SUA CHAVE AQUI

// MUDANÇA AQUI: Trocamos o nome para 'supabaseClient' para não dar conflito com a biblioteca original!
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

var DADOS = {
  turmas: [], catequistas: [], catequizandos: [], presencas: [], eventos: [], usuarios: [],
  apostilas: [ 
    { id: 'ap1', nivel: 'Eucaristia I', titulo: 'Quem é Jesus para mim', capitulo: 1, paginas: 18 },
    { id: 'ap2', nivel: 'Eucaristia I', titulo: 'O Pai Nosso', capitulo: 2, paginas: 14 }
  ]
};

// 2. FUNÇÃO PARA CARREGAR DADOS DA NUVEM
async function carregarDadosDaNuvem() {
  try {
    // Note que agora usamos 'supabaseClient.from(...)'
    
    let resUsers = await supabaseClient.from('usuarios').select('*');
    if (resUsers.data) {
      DADOS.usuarios = resUsers.data.map(u => ({
        id: u.id, nome: u.nome, login: u.login, senha: u.senha_hash, tipo: u.tipo_perfil
      }));
    }

    let resTurmas = await supabaseClient.from('turmas').select('*');
    if (resTurmas.data) {
      DADOS.turmas = resTurmas.data.map(t => ({
        id: t.id, nome: t.nome, nivel: t.nivel, anoLetivo: t.ano_letivo, diaSemana: t.dia_semana, sala: t.sala
      }));
    }

    let resAlunos = await supabaseClient.from('catequizandos').select('*');
    if (resAlunos.data) {
      DADOS.catequizandos = resAlunos.data.map(a => ({
        id: a.id, nome: a.nome, turmaId: a.turma_id, dataNasc: a.data_nasc, responsavel: a.responsavel, telefone: a.telefone
      }));
    }

    let resEventos = await supabaseClient.from('eventos').select('*');
    if (resEventos.data) {
      DADOS.eventos = resEventos.data.map(e => ({
        id: e.id, titulo: e.titulo, data: e.data_evento, tipo: e.tipo, turmaId: e.turma_id
      }));
    }

    let resPres = await supabaseClient.from('presencas').select('*');
    if (resPres.data) {
      DADOS.presencas = resPres.data.map(p => ({
        id: p.id, catequizandoId: p.catequizando_id, data: p.data_encontro, tipo: p.tipo, situacao: p.situacao
      }));
    }

    let resCat = await supabaseClient.from('catequistas').select('*, catequista_turma(turma_id)');
    if (resCat.data) {
      DADOS.catequistas = resCat.data.map(c => ({
        id: c.id, nome: c.nome, nivel: c.nivel, telefone: c.telefone,
        turmas: c.catequista_turma ? c.catequista_turma.map(ct => ct.turma_id) : []
      }));
    }

    concluirCarregamento();

  } catch (erro) {
    console.error("Erro na nuvem:", erro);
    alert("Falha ao comunicar com o banco de dados. Aperte F12 e veja a aba Console.");
    concluirCarregamento(); 
  }
}

function concluirCarregamento() {
  render();
  var boot = document.getElementById('boot');
  if (boot) boot.style.display = 'none';
}

function atualizar(chave, valorNovo) {
  DADOS[chave] = valorNovo;
  render(); 
}

function novoId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}