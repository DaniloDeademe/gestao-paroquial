/* ==========================================================================
 * dados.js — Ligação ao Supabase (Base de Dados Real)
 * ========================================================================== */

const LOGO_URL = "assets/Santo Antônio do Jardim SP RGB 1.svg"; 
const ICONE_URL = "assets/PadroeiroSantoAntônio2.svg"; 

// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://kmaprgbdghsyftbwminu.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYXByZ2JkZ2hzeWZ0YndtaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjkxNDgsImV4cCI6MjA5Njc0NTE0OH0.Y8kuTIfgVWFYtc4NtVlPoC-ZI5nbHFJrwfbuVuBaNdg'; // <- COLE A SUA CHAVE AQUI

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

var DADOS = {
  turmas: [], catequistas: [], catequizandos: [], presencas: [], eventos: [], usuarios: [],
  apostilas: [] // Agora começa vazio, pois vamos buscar à nuvem!
};

// 2. FUNÇÃO PARA CARREGAR DADOS DA NUVEM
async function carregarDadosDaNuvem() {
  try {
    let resUsers = await supabaseClient.from('usuarios').select('*');
    if (resUsers.data) {
      DADOS.usuarios = resUsers.data.map(u => ({
        id: String(u.id), nome: u.nome, login: u.login, senha: u.senha_hash, tipo: u.tipo_perfil
      }));
    }

    let resTurmas = await supabaseClient.from('turmas').select('*');
    if (resTurmas.data) {
      DADOS.turmas = resTurmas.data.map(t => ({
        id: String(t.id), nome: t.nome, nivel: t.nivel, anoLetivo: t.ano_letivo, diaSemana: t.dia_semana, sala: t.sala
      }));
    }

    let resAlunos = await supabaseClient.from('catequizandos').select('*');
    if (resAlunos.data) {
      DADOS.catequizandos = resAlunos.data.map(a => ({
        id: String(a.id), nome: a.nome, turmaId: String(a.turma_id), dataNasc: a.data_nasc, responsavel: a.responsavel, telefone: a.telefone
      }));
    }

    let resEventos = await supabaseClient.from('eventos').select('*');
    if (resEventos.data) {
      DADOS.eventos = resEventos.data.map(e => ({
        id: String(e.id), titulo: e.titulo, data: e.data_evento, tipo: e.tipo, turmaId: String(e.turma_id)
      }));
    }

    let resPres = await supabaseClient.from('presencas').select('*');
    if (resPres.data) {
      DADOS.presencas = resPres.data.map(p => ({
        id: String(p.id), catequizandoId: String(p.catequizando_id), data: p.data_encontro, tipo: p.tipo, situacao: p.situacao
      }));
    }

    let resCat = await supabaseClient.from('catequistas').select('*, catequista_turma(turma_id)');
    if (resCat.data) {
      DADOS.catequistas = resCat.data.map(c => ({
        id: String(c.id), nome: c.nome, nivel: c.nivel, telefone: c.telefone,
        turmas: c.catequista_turma ? c.catequista_turma.map(ct => String(ct.turma_id)) : []
      }));
    }

    // Busca das Apostilas
    let resApostilas = await supabaseClient.from('apostilas').select('*');
    if (resApostilas.data) {
      DADOS.apostilas = resApostilas.data.map(ap => ({
        id: String(ap.id), titulo: ap.titulo, nivel: ap.nivel, capitulo: ap.capitulo, url: ap.arquivo_url
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

// 3. FUNÇÃO DE UPLOAD DE APOSTILAS
async function uploadApostila(arquivo, titulo, nivel, capitulo) {
  try {
    // 1. Gera um nome único para não substituir ficheiros com nomes iguais
    const extensao = arquivo.name.split('.').pop();
    const nomeUnico = Date.now() + '_' + Math.random().toString(36).slice(2, 7) + '.' + extensao;
    
    // 2. Envia o ficheiro para a pasta 'apostilas' no Supabase Storage
    let resUpload = await supabaseClient.storage.from('apostilas').upload(nomeUnico, arquivo);
    if (resUpload.error) throw resUpload.error;

    // 3. Pega o link público para download
    const resUrl = supabaseClient.storage.from('apostilas').getPublicUrl(nomeUnico);
    const urlPublica = resUrl.data.publicUrl;

    // 4. Salva as informações da apostila (com o link) na tabela do banco
    let resDb = await supabaseClient.from('apostilas').insert([
      { titulo: titulo, nivel: nivel, capitulo: capitulo, arquivo_url: urlPublica }
    ]).select();
    
    if (resDb.error) throw resDb.error;

    // 5. Atualiza a tela em tempo real
    if (resDb.data && resDb.data.length > 0) {
      let ap = resDb.data[0];
      DADOS.apostilas.push({
        id: String(ap.id), titulo: ap.titulo, nivel: ap.nivel, capitulo: ap.capitulo, url: ap.arquivo_url
      });
      render();
    }
    return true;

  } catch (erro) {
    console.error("Erro no upload:", erro);
    alert("Ocorreu um erro ao enviar a apostila.");
    return false;
  }
}