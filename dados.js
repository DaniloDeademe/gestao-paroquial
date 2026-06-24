/* ==========================================================================
 * dados.js — Ligação ao Supabase (Base de Dados Real)
 * ========================================================================== */

const LOGO_URL = "assets/Santo Antônio do Jardim SP RGB 1.svg"; 
const ICONE_URL = "assets/PadroeiroSantoAntônio2.svg"; 

// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://kmaprgbdghsyftbwminu.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYXByZ2JkZ2hzeWZ0YndtaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjkxNDgsImV4cCI6MjA5Njc0NTE0OH0.Y8kuTIfgVWFYtc4NtVlPoC-ZI5nbHFJrwfbuVuBaNdg'; // <- COLE A SUA CHAVE AQUI

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let DADOS = {
  turmas: [], catequistas: [], catequizandos: [], presencas: [], eventos: [], usuarios: [],
  apostilas: [], paroquianos: []
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

    let resApostilas = await supabaseClient.from('apostilas').select('*');
    if (resApostilas.data) {
      DADOS.apostilas = resApostilas.data.map(ap => ({
        id: String(ap.id), titulo: ap.titulo, nivel: ap.nivel, capitulo: ap.capitulo, url: ap.arquivo_url
      }));
    }

    let resPar = await supabaseClient.from('paroquianos').select('*').order('created_at', { ascending: false });
    if (resPar.data) {
      DADOS.paroquianos = resPar.data.map(mapParoquiano);
    }

    concluirCarregamento();

  } catch (erro) {
    console.error("Erro na nuvem:", erro);
    var boot = document.getElementById('boot');
    if (boot) boot.style.display = 'none';
    var app = document.getElementById('app');
    if (app) {
      app.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:16px;padding:32px;text-align:center">' +
          '<img src="' + ICONE_URL + '" style="width:64px;opacity:0.35" />' +
          '<p style="font-size:18px;font-weight:600;color:#1A1A1A">Falha na conexão</p>' +
          '<p style="font-size:14px;color:#666;max-width:280px;line-height:1.5">Não foi possível comunicar com o banco de dados.<br>Verifique sua internet e tente novamente.</p>' +
          '<button onclick="location.reload()" style="margin-top:8px;padding:12px 24px;background:#B85F2F;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">Tentar novamente</button>' +
        '</div>';
    }
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

// 4. MAPEAMENTO DE PAROQUIANO (snake_case → camelCase)
function mapParoquiano(p) {
  return {
    id: String(p.id),
    tipoCadastro: p.tipo_cadastro,
    nomeCompleto: p.nome_completo,
    cpf: p.cpf,
    rg: p.rg,
    dataNascimento: p.data_nascimento,
    sexo: p.sexo,
    naturalidade: p.naturalidade,
    ufNascimento: p.uf_nascimento,
    estadoCivil: p.estado_civil,
    profissao: p.profissao,
    escolaridade: p.escolaridade,
    formacao: p.formacao,
    telefoneCelular: p.telefone_celular,
    telefoneResidencial: p.telefone_residencial,
    telefoneRecado: p.telefone_recado,
    email: p.email,
    cep: p.cep,
    logradouro: p.logradouro,
    numero: p.numero,
    complemento: p.complemento,
    bairro: p.bairro,
    cidade: p.cidade,
    uf: p.uf,
    nomePai: p.nome_pai,
    profissaoPai: p.profissao_pai,
    nomeMae: p.nome_mae,
    profissaoMae: p.profissao_mae,
    paisCasadosIgreja: p.pais_casados_igreja,
    paroquiaCasamento: p.paroquia_casamento,
    nomeConjuge: p.nome_conjuge,
    dataNascConjuge: p.data_nasc_conjuge,
    dataMatrimonio: p.data_matrimonio,
    dependentes: p.dependentes || [],
    batizado: p.batizado,
    dataBatismo: p.data_batismo,
    paroquiaBatismo: p.paroquia_batismo,
    dioceseBatismo: p.diocese_batismo,
    livroBatismo: p.livro_batismo,
    folhaBatismo: p.folha_batismo,
    numeroBatismo: p.numero_batismo,
    comunidade: p.comunidade,
    dataInscricao: p.data_inscricao,
    codigoCatequista: p.codigo_catequista,
    dizimista: p.dizimista,
    codigoDizimista: p.codigo_dizimista,
    etapas: p.etapas || {},
    pastorais: p.pastorais || [],
    termoResponsabilidade: p.termo_responsabilidade,
    status: p.status || 'pendente',
    observacaoAprovacao: p.observacao_aprovacao,
    dataAprovacao: p.data_aprovacao,
    aprovadoPor: p.aprovado_por,
    criadoEm: p.created_at
  };
}

// 5. SALVAR NOVA INSCRIÇÃO
async function salvarInscricao(dados) {
  try {
    let { data, error } = await supabaseClient.from('paroquianos').insert([{
      tipo_cadastro: dados.tipoCadastro,
      nome_completo: dados.nomeCompleto,
      cpf: dados.cpf || null,
      rg: dados.rg || null,
      data_nascimento: dados.dataNascimento || null,
      sexo: dados.sexo || null,
      naturalidade: dados.naturalidade || null,
      uf_nascimento: dados.ufNascimento || null,
      estado_civil: dados.estadoCivil || null,
      profissao: dados.profissao || null,
      escolaridade: dados.escolaridade || null,
      formacao: dados.formacao || null,
      telefone_celular: dados.telefoneCelular || null,
      telefone_residencial: dados.telefoneResidencial || null,
      telefone_recado: dados.telefoneRecado || null,
      email: dados.email || null,
      cep: dados.cep || null,
      logradouro: dados.logradouro || null,
      numero: dados.numero || null,
      complemento: dados.complemento || null,
      bairro: dados.bairro || null,
      cidade: dados.cidade || null,
      uf: dados.uf || null,
      nome_pai: dados.nomePai || null,
      profissao_pai: dados.profissaoPai || null,
      nome_mae: dados.nomeMae || null,
      profissao_mae: dados.profissaoMae || null,
      pais_casados_igreja: dados.paisCasadosIgreja === 'sim',
      paroquia_casamento: dados.paroquiaCasamento || null,
      nome_conjuge: dados.nomeConjuge || null,
      data_nasc_conjuge: dados.dataNascConjuge || null,
      data_matrimonio: dados.dataMatrimonio || null,
      dependentes: dados.dependentes || [],
      batizado: dados.batizado || false,
      data_batismo: dados.dataBatismo || null,
      paroquia_batismo: dados.paroquiaBatismo || null,
      diocese_batismo: dados.dioceseBatismo || null,
      livro_batismo: dados.livroBatismo || null,
      folha_batismo: dados.folhaBatismo || null,
      numero_batismo: dados.numeroBatismo || null,
      comunidade: dados.comunidade || null,
      data_inscricao: new Date().toISOString().slice(0, 10),
      codigo_catequista: dados.codigoCatequista || null,
      dizimista: dados.dizimista || false,
      codigo_dizimista: dados.codigoDizimista || null,
      etapas: dados.etapas || {},
      pastorais: dados.pastorais || [],
      termo_responsabilidade: dados.termoResponsabilidade || false,
      status: 'pendente'
    }]).select();
    if (error) throw error;
    if (data && data.length > 0) {
      DADOS.paroquianos = [mapParoquiano(data[0])].concat(DADOS.paroquianos);
    }
    return true;
  } catch (erro) {
    console.error('Erro ao salvar inscrição:', erro);
    return false;
  }
}

// 6. REDEFINIR SENHA DE USUÁRIO
async function atualizarSenhaUsuario(id, novaSenha) {
  try {
    let { error } = await supabaseClient
      .from('usuarios')
      .update({ senha_hash: novaSenha })
      .eq('id', id);
    if (error) throw error;
    DADOS.usuarios = DADOS.usuarios.map(function (u) {
      return u.id === String(id) ? Object.assign({}, u, { senha: novaSenha }) : u;
    });
    return true;
  } catch (erro) {
    console.error('Erro ao redefinir senha:', erro);
    return false;
  }
}

// 7. APROVAR / REJEITAR INSCRIÇÃO
async function atualizarStatusParoquiano(id, status, observacao) {
  try {
    let { error } = await supabaseClient.from('paroquianos').update({
      status: status,
      observacao_aprovacao: observacao || null,
      data_aprovacao: new Date().toISOString(),
      aprovado_por: USUARIO ? USUARIO.nome : null
    }).eq('id', id);
    if (error) throw error;
    DADOS.paroquianos = DADOS.paroquianos.map(function (p) {
      if (p.id === String(id)) {
        return Object.assign({}, p, {
          status: status,
          observacaoAprovacao: observacao || null,
          dataAprovacao: new Date().toISOString(),
          aprovadoPor: USUARIO ? USUARIO.nome : null
        });
      }
      return p;
    });
    render();
    return true;
  } catch (erro) {
    console.error('Erro ao atualizar inscrição:', erro);
    return false;
  }
}