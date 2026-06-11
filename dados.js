/* ==========================================================================
 * dados.js — Ligação ao Supabase (Base de Dados Real)
 * ========================================================================== */

const LOGO_URL = "assets/Santo Antônio do Jardim SP RGB 1.svg"; 
const ICONE_URL = "assets/PadroeiroSantoAntônio2.svg"; 

// 1. CONFIGURAÇÃO DO SUPABASE
// Substitua estas strings pelos valores reais do seu painel Supabase (Project Settings > API)
const SUPABASE_URL = 'https://supabase.com/dashboard/project/kmaprgbdghsyftbwminu';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYXByZ2JkZ2hzeWZ0YndtaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjkxNDgsImV4cCI6MjA5Njc0NTE0OH0.Y8kuTIfgVWFYtc4NtVlPoC-ZI5nbHFJrwfbuVuBaNdg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// A variável DADOS vai manter a cópia local do que vem da base de dados
var DADOS = {
  turmas: [],
  catequistas: [],
  catequizandos: [],
  presencas: [],
  eventos: [],
  usuarios: [],
  // As apostilas continuam locais por agora, pois costumam ser material fixo
  apostilas: [
    { id: 'ap1', nivel: 'Eucaristia I', titulo: 'Quem é Jesus para mim', capitulo: 1, paginas: 18 },
    { id: 'ap2', nivel: 'Eucaristia I', titulo: 'O Pai Nosso', capitulo: 2, paginas: 14 },
    { id: 'ap3', nivel: 'Eucaristia I', titulo: 'A Última Ceia', capitulo: 3, paginas: 22 },
    { id: 'ap4', nivel: 'Eucaristia II', titulo: 'Mistério da Eucaristia', capitulo: 1, paginas: 24 },
    { id: 'ap5', nivel: 'Eucaristia II', titulo: 'Os Mandamentos', capitulo: 2, paginas: 20 },
    { id: 'ap6', nivel: 'Crisma I', titulo: 'O Espírito Santo', capitulo: 1, paginas: 28 },
    { id: 'ap7', nivel: 'Crisma I', titulo: 'Os Dons do Espírito', capitulo: 2, paginas: 26 }
  ]
};

// 2. FUNÇÃO PARA CARREGAR DADOS DA NUVEM (SELECT)
async function carregarDadosDaNuvem() {
  try {
    // Busca dados das tabelas criadas no Supabase
    let resTurmas = await supabase.from('turmas').select('*');
    if (!resTurmas.error && resTurmas.data) DADOS.turmas = resTurmas.data;

    let resAlunos = await supabase.from('catequizandos').select('*');
    if (!resAlunos.error && resAlunos.data) DADOS.catequizandos = resAlunos.data;

    let resCat = await supabase.from('catequistas').select('*');
    if (!resCat.error && resCat.data) DADOS.catequistas = resCat.data;

    let resPres = await supabase.from('presencas').select('*');
    if (!resPres.error && resPres.data) DADOS.presencas = resPres.data;

    let resEventos = await supabase.from('eventos').select('*');
    if (!resEventos.error && resEventos.data) DADOS.eventos = resEventos.data;

    let resUsers = await supabase.from('usuarios').select('*');
    if (!resUsers.error && resUsers.data) DADOS.usuarios = resUsers.data;

    // Quando terminar, avisa o app.js para desenhar o ecrã
    concluirCarregamento();

  } catch (erro) {
    console.error("Erro ao carregar dados do Supabase:", erro);
    alert("Não foi possível ligar à base de dados. Verifique as credenciais no dados.js.");
    concluirCarregamento(); // Fallback para não bloquear o ecrã
  }
}

function concluirCarregamento() {
  render();
  var boot = document.getElementById('boot');
  if (boot) boot.style.display = 'none';
}

// 3. ATUALIZAR DADOS (Ponte entre app.js e Supabase)
// Esta função faz o "Optimistic UI": atualiza o ecrã imediatamente e depois envia para a base de dados.
function atualizar(chave, valorNovo) {
  // Atualiza visualmente na hora
  DADOS[chave] = valorNovo;
  render();

  // No futuro, aqui fará as queries de INSERT/UPDATE do SQL em vez de substituir o array todo.
  console.log(`Gravação acionada para a tabela: [${chave}]. Prepare as queries de INSERT no Supabase.`);
}

// Gerador de IDs locais (quando passar 100% para SQL, o próprio Supabase vai gerar isto automaticamente)
function novoId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}