/* ==========================================================================
 * app.js — Interface do Sistema de Catequese (HTML/CSS/JS puro)
 * ========================================================================== */

// Estado global da aplicação
let USUARIO = null;
let ABA = 'inicio';
let VISAO = null;
let QR_MODE = false;

// Estado do formulário de inscrição
let _inscPasso = 1;

// Estado da recuperação de senha
let _recupLogin = '';
let _recupErro = '';
let _recupSucesso = false;
let _inscErro = '';
let _inscDados = {};
let _inscDependentes = [];
let _inscPastorais = [];
let _inscSucesso = false;

// --------------------------------------------------------------------------
// Ícones SVG (inline)
// --------------------------------------------------------------------------
const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="21"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="17" y1="17" x2="17" y2="17"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  check2: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
  grad: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  church: '<path d="M10 9h4"/><path d="M12 7v5"/><path d="M12 2l4 4v3l4 2v11H4V11l4-2V6z"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  calPlus: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  fileWarn: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="16"/><line x1="12" y1="19" x2="12.01" y2="19"/>'
};

function ic(nome, classe) {
  classe = classe || '';
  return '<svg class="ic ' + classe + '" viewBox="0 0 24 24">' + (ICONS[nome] || '') + '</svg>';
}

// --------------------------------------------------------------------------
// Utilidades
// --------------------------------------------------------------------------
function esc(txt) {
  if (txt === null || txt === undefined) return '';
  return String(txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function iniciais(nome) {
  return nome.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('');
}

function fmtData(iso) {
  if (!iso) return '—';
  var p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function fmtDataExtenso(iso) {
  var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  var p = iso.split('-');
  return parseInt(p[2]) + ' de ' + meses[parseInt(p[1]) - 1] + ' de ' + p[0];
}

function idadeAnos(dataNasc) {
  if (!dataNasc) return null;
  var hoje = new Date();
  var nasc = new Date(dataNasc);
  var anos = hoje.getFullYear() - nasc.getFullYear();
  var m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return anos;
}

const ROTULO_PERFIL = { padre: 'Pároco', catequista: 'Catequista', escritorio: 'Escritório paroquial' };

function pillStatus(status) {
  var classe = status === 'Aprovado' ? 'pill-success' : status === 'Reprovado' ? 'pill-danger' : status === 'Em andamento' ? 'pill-neutral' : 'pill-neutral';
  var icone = status === 'Aprovado' ? 'check2' : status === 'Reprovado' ? 'xCircle' : 'clock';
  return '<span class="pill ' + classe + '">' + ic(icone) + ' ' + status + '</span>';
}

// --------------------------------------------------------------------------
// Roteamento principal de renderização
// --------------------------------------------------------------------------
function render() {
  var app = document.getElementById('app');

  if (QR_MODE) { app.innerHTML = telaQR(); ligarEventosQR(); return; }
  if (VISAO && VISAO.tipo === 'inscricao') { app.innerHTML = telaInscricao(); ligarEventosInscricao(); return; }
  if (VISAO && VISAO.tipo === 'recuperacao') { app.innerHTML = telaRecuperacaoSenha(); ligarEventosRecuperacao(); return; }
  if (!USUARIO) { app.innerHTML = telaLogin(); ligarEventosLogin(); return; }

  if (VISAO && VISAO.tipo === 'turma') { app.innerHTML = telaTurmaDetalhe(VISAO.id); ligarEventosApp(); return; }
  if (VISAO && VISAO.tipo === 'pagina') { app.innerHTML = telaPaginaInterna(VISAO.pagina); ligarEventosApp(); return; }

  var conteudo = '';
  if (ABA === 'inicio') conteudo = telaDashboard();
  else if (ABA === 'turmas') conteudo = telaTurmas();
  else if (ABA === 'agenda') conteudo = telaAgenda();
  else if (ABA === 'apostilas') conteudo = telaApostilas();
  else if (ABA === 'mais') conteudo = telaMais();

  app.innerHTML = header(USUARIO.nome, false, null, true) + '<main>' + conteudo + '</main>' + bottomNav();
  ligarEventosApp();
}

/* ==========================================================================
 * TELA — LOGIN
 * ========================================================================== */
let _mostrarSenha = false;
let _erroLogin = '';

function telaLogin() {
  var usuarios = DADOS.usuarios || [];
  var demoItens = usuarios.map(function (u) {
    return '<button class="demo-item" data-login="' + esc(u.login) + '">' +
      '<div class="info"><p>' + esc(ROTULO_PERFIL[u.tipo]) + '</p>' +
      '<p>utilizador: <span class="mono">' + esc(u.login) + '</span></p></div>' +
      '<span class="preencher">Preencher</span></button>';
  }).join('');

  return '' +
  '<div id="tela-login"><div class="login-box">' +
    '<img class="logo" src="' + LOGO_URL + '" alt="Paróquia Santo Antônio" />' +
    '<p class="login-sub">Sistema de Catequese</p>' +
    '<h1 class="serif login-titulo">Entrar</h1>' +
    '<p class="login-desc">Aceda com o seu utilizador e senha</p>' +

    (_erroLogin ? '<div class="erro-box">' + ic('alert') + ' ' + esc(_erroLogin) + '</div>' : '') +

    '<div class="campo"><label>Utilizador</label>' +
      '<input id="in-login" type="text" placeholder="Ex: maria" autocapitalize="none" autocorrect="off" /></div>' +

    '<div class="campo"><label>Senha</label>' +
      '<div class="senha-wrap">' +
        '<input id="in-senha" type="' + (_mostrarSenha ? 'text' : 'password') + '" placeholder="A sua senha" />' +
        '<button class="senha-toggle" id="btn-toggle-senha" type="button">' + ic(_mostrarSenha ? 'eyeOff' : 'eye') + '</button>' +
      '</div></div>' +

    '<button class="btn btn-primary btn-lg" id="btn-entrar">' + ic('login') + ' Entrar</button>' +

    '<div class="text-center" style="margin-top:4px">' +
      '<button id="btn-esqueci-senha" style="background:none;border:none;color:var(--terracota);font-size:13px;cursor:pointer;text-decoration:underline">Esqueci minha senha</button>' +
    '</div>' +

    '<details class="demo-acessos"><summary>' + ic('chevronRight') + ' Acessos de demonstração</summary>' +
      '<div class="stack" style="margin-top:12px">' + demoItens +
      '<p class="muted text-center" style="padding-top:4px">Toque num acesso para preencher e depois clique em Entrar.</p></div>' +
    '</details>' +

    '<div class="text-center"><button class="link-qr" id="btn-abrir-qr">' + ic('qr') + ' Ecrã de presença por QR Code</button></div>' +

    '<div class="text-center" style="margin-top:12px">' +
      '<button class="btn btn-primary btn-lg" id="btn-inscricao" style="width:100%">' + ic('userPlus') + ' Fazer inscrição na catequese</button>' +
    '</div>' +

    '<div class="login-footer">Paróquia Santo Antônio · Santo Antônio do Jardim, SP</div>' +
  '</div></div>';
}

function fazerLogin() {
  var login = (document.getElementById('in-login').value || '').trim().toLowerCase();
  var senha = document.getElementById('in-senha').value || '';
  var u = (DADOS.usuarios || []).find(function (x) {
    return x.login.toLowerCase() === login && x.senha === senha;
  });
  if (!u) {
    _erroLogin = 'Utilizador ou senha incorretos. Verifique e tente novamente.';
    render();
    return;
  }
  _erroLogin = '';
  USUARIO = { tipo: u.tipo, nome: u.nome, login: u.login };
  ABA = 'inicio'; VISAO = null;
  render();
}

function ligarEventosLogin() {
  var btnEntrar = document.getElementById('btn-entrar');
  if (btnEntrar) btnEntrar.onclick = fazerLogin;

  var inLogin = document.getElementById('in-login');
  var inSenha = document.getElementById('in-senha');
  [inLogin, inSenha].forEach(function (el) {
    if (!el) return;
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter') fazerLogin(); });
  });

  var toggle = document.getElementById('btn-toggle-senha');
  if (toggle) toggle.onclick = function () {
    var lv = inLogin ? inLogin.value : '';
    var sv = inSenha ? inSenha.value : '';
    _mostrarSenha = !_mostrarSenha;
    render();
    var nl = document.getElementById('in-login'); if (nl) nl.value = lv;
    var ns = document.getElementById('in-senha'); if (ns) { ns.value = sv; ns.focus(); }
  };

  document.querySelectorAll('.demo-item').forEach(function (btn) {
    btn.onclick = function () {
      document.getElementById('in-login').value = btn.getAttribute('data-login');
      document.getElementById('in-senha').value = '';
      _erroLogin = '';
      document.getElementById('in-senha').focus();
    };
  });

  var btnInscricao = document.getElementById('btn-inscricao');
  if (btnInscricao) btnInscricao.onclick = function () {
    _inscPasso = 1; _inscDados = {}; _inscDependentes = []; _inscPastorais = []; _inscErro = ''; _inscSucesso = false;
    VISAO = { tipo: 'inscricao' };
    render();
  };

  var btnQr = document.getElementById('btn-abrir-qr');
  if (btnQr) btnQr.onclick = function () { QR_MODE = true; render(); };

  var btnEsqueci = document.getElementById('btn-esqueci-senha');
  if (btnEsqueci) btnEsqueci.onclick = function () {
    _recupLogin = ''; _recupErro = ''; _recupSucesso = false;
    VISAO = { tipo: 'recuperacao' };
    render();
  };
}

/* ==========================================================================
 * HEADER + NAVEGAÇÃO INFERIOR
 * ========================================================================== */
function header(titulo, comVoltar, subtitulo, comLogout) {
  var esquerda = comVoltar
    ? '<button class="icon-btn" id="btn-voltar">' + ic('arrowLeft') + '</button>'
    : '<img src="' + ICONE_URL + '" alt="" style="width: 36px; height: 36px; object-fit: contain;" />'; 
  var meio = subtitulo
    ? '<div class="titulo-area"><p class="small">Paróquia Santo Antônio</p><p class="serif nome">' + esc(titulo) + '</p></div>'
    : '<div class="titulo-area"><p class="serif nome">' + esc(titulo) + '</p></div>';
  var direita = comLogout
    ? '<button class="icon-btn" id="btn-logout">' + ic('logout') + '</button>'
    : '';
  return '<header class="app-header"><div class="inner">' + esquerda + meio + direita + '</div></header>';
}

function bottomNav() {
  var itens = [
    { id: 'inicio', label: 'Início', icone: 'home' },
    { id: 'turmas', label: 'Turmas', icone: 'users' },
    { id: 'agenda', label: 'Agenda', icone: 'calendar' },
    { id: 'apostilas', label: 'Apostilas', icone: 'book' },
    { id: 'mais', label: 'Mais', icone: 'more' }
  ];
  var botoes = itens.map(function (it) {
    return '<button class="nav-btn ' + (ABA === it.id ? 'ativo' : '') + '" data-aba="' + it.id + '">' +
      ic(it.icone) + '<span>' + it.label + '</span></button>';
  }).join('');
  return '<nav class="bottom-nav"><div class="inner">' + botoes + '</div></nav>';
}

/* ==========================================================================
 * TELA — DASHBOARD
 * ========================================================================== */
function telaDashboard() {
  var u = USUARIO;
  var totalAlunos = DADOS.catequizandos.length;
  var totalTurmas = DADOS.turmas.length;
  var avaliados = DADOS.catequizandos.map(function (a) { return { aluno: a, av: avaliarAluno(a, DADOS.presencas) }; });
  var aprovados = avaliados.filter(function (x) { return x.av.statusGeral === 'Aprovado'; }).length;
  var reprovados = avaliados.filter(function (x) { return x.av.statusGeral === 'Reprovado'; }).length;
  var taxa = avaliados.length ? Math.round(aprovados / avaliados.length * 100) : 0;

  var proximo = DADOS.eventos.filter(function (e) { return new Date(e.data) >= new Date(); })
    .sort(function (a, b) { return a.data.localeCompare(b.data); })[0];

  var saudacao =
    '<div style="padding-top:4px">' +
      '<p class="eyebrow">' + ROTULO_PERFIL[u.tipo] + '</p>' +
      '<h2 class="serif page-titulo">Olá, ' + esc(u.nome.split(' ')[0]) + '</h2>' +
      '<p class="muted" style="font-size:14px;color:var(--cinza-texto)">' +
      (u.tipo === 'padre' ? 'Acompanhe a vida da catequese da paróquia.' :
       u.tipo === 'catequista' ? 'Aqui você cuida da sua turma e dos seus catequizandos.' :
       'Cadastros, agenda e organização da catequese.') + '</p>' +
    '</div>';

  var html = saudacao;

  if (u.tipo === 'padre' || u.tipo === 'escritorio') {
    var proximoHtml = proximo
      ? '<div class="row-between"><div><p class="serif" style="font-size:18px">' + esc(proximo.titulo) + '</p>' +
        '<p style="font-size:14px;color:var(--cinza-texto)">' + fmtDataExtenso(proximo.data) + '</p></div>' +
        '<span class="pill pill-accent">' + esc((DADOS.turmas.find(function (t) { return t.id === proximo.turmaId; }) || {}).nivel || '—') + '</span></div>'
      : '<div class="text-center" style="padding: 24px 16px; opacity: 0.8;">' +
          '<img src="assets/IgrejaMatriz - Preto.svg" style="width: 64px; margin-bottom: 12px; opacity: 0.3;" alt="" />' +
          '<p class="muted">Nenhum evento agendado.</p>' +
        '</div>';

    html += '<div class="grid-2" style="margin-top:16px">' +
      '<div class="card card-pad"><div class="muted" style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' + ic('users') + ' Catequizandos</div>' +
        '<p class="serif metric-num">' + totalAlunos + '</p><p class="muted">em ' + totalTurmas + ' turmas</p></div>' +
      '<div class="card card-pad"><div class="muted" style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' + ic('trending') + ' Taxa de aprovação</div>' +
        '<p class="serif metric-num">' + taxa + '<span class="small">%</span></p><p class="muted">' + aprovados + ' aprovados · ' + reprovados + ' em risco</p></div>' +
    '</div>' +
    '<div class="card card-pad" style="margin-top:10px">' +
      '<div class="row-between" style="margin-bottom:8px"><div class="muted" style="display:flex;align-items:center;gap:6px">' + ic('calPlus') + ' Próximo evento</div>' +
      '<button class="btn btn-sm" style="background:none;color:var(--terracota);padding:0" data-goto-aba="agenda">Ver agenda</button></div>' +
      proximoHtml +
    '</div>';
  }

  if (u.tipo === 'catequista') {
    var minhas = DADOS.turmas.filter(function (t) {
      return DADOS.catequistas.find(function (c) { return c.nome === u.nome && c.turmas.indexOf(t.id) >= 0; });
    });
    html += '<p class="section-label">As minhas turmas</p>';
    if (minhas.length === 0) {
      html += '<div class="text-center" style="padding: 48px 16px; opacity: 0.8;">' +
          '<img src="assets/PadroeiroSantoAntônio - Preto.svg" style="width: 64px; margin-bottom: 12px; opacity: 0.3;" alt="" />' +
          '<p class="muted">Nenhuma turma atribuída a você.</p>' +
        '</div>';
    } else {
      html += minhas.map(function (t) {
        var n = DADOS.catequizandos.filter(function (a) { return a.turmaId === t.id; }).length;
        return '<button class="item-lista" data-turma="' + t.id + '" style="flex-direction:column;align-items:stretch;gap:0">' +
          '<div class="row-between"><div><span class="pill pill-accent">' + esc(t.nivel) + '</span>' +
          '<p class="serif" style="font-size:18px;margin-top:6px">' + esc(t.nome) + '</p>' +
          '<p class="muted">' + esc(t.diaSemana) + ' · ' + esc(t.sala) + '</p></div>' + ic('chevronRight', '') + '</div>' +
          '<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.05);font-size:12px;color:var(--cinza-texto);display:flex;gap:6px;align-items:center">' + ic('users') + ' ' + n + ' alunos</div>' +
        '</button>';
      }).join('<div style="height:10px"></div>');
    }
  }

  if (u.tipo === 'padre') {
    var risco = avaliados.filter(function (x) {
      return x.av.statusGeral === 'Reprovado' ||
        (x.av.percentualCatequese !== null && x.av.percentualCatequese < 80 && x.av.percentualCatequese >= 75);
    }).slice(0, 4);
    if (risco.length) {
      html += '<div class="row-between" style="margin-top:16px"><p class="section-label" style="margin:0">Atenção pastoral</p>' +
        '<button class="btn btn-sm" style="background:none;color:var(--terracota);padding:0" data-goto-pagina="relatorios">Ver relatórios</button></div>';
      html += '<div class="card card-lista" style="margin-top:8px">' + risco.map(function (x) {
        var turma = DADOS.turmas.find(function (t) { return t.id === x.aluno.turmaId; });
        var tone = x.av.statusGeral === 'Reprovado' ? 'pill-danger' : 'pill-warning';
        var label = x.av.statusGeral === 'Reprovado' ? 'Em risco' : 'Limite';
        return '<div style="padding:14px;display:flex;align-items:center;gap:12px">' +
          '<div class="avatar cinza" style="background:' + (x.av.statusGeral === 'Reprovado' ? '#fff1f2' : '#fffbeb') + '">' + ic('alert') + '</div>' +
          '<div style="flex:1;min-width:0"><p style="font-size:14px;font-weight:500">' + esc(x.aluno.nome) + '</p>' +
          '<p class="muted">' + esc((turma || {}).nome || '') + ' · ' + (x.av.percentualCatequese == null ? '—' : x.av.percentualCatequese) + '% cat / ' + (x.av.percentualMissa == null ? '—' : x.av.percentualMissa) + '% missa</p></div>' +
          '<span class="pill ' + tone + '">' + label + '</span></div>';
      }).join('') + '</div>';
    }
  }

  return html;
}

/* ==========================================================================
 * TELA — TURMAS
 * ========================================================================== */
function telaTurmas() {
  var u = USUARIO;
  var turmas = u.tipo === 'catequista'
    ? DADOS.turmas.filter(function (t) { return DADOS.catequistas.find(function (c) { return c.nome === u.nome && c.turmas.indexOf(t.id) >= 0; }); })
    : DADOS.turmas;

  var botaoNova = (u.tipo === 'padre' || u.tipo === 'escritorio')
    ? '<button class="btn btn-primary btn-sm" id="btn-nova-turma">' + ic('plus') + ' Nova turma</button>' : '';

  var lista = turmas.map(function (t) {
    var alunos = DADOS.catequizandos.filter(function (a) { return a.turmaId === t.id; });
    var cats = DADOS.catequistas.filter(function (c) { return c.turmas.indexOf(t.id) >= 0; });
    var aprov = alunos.map(function (a) { return avaliarAluno(a, DADOS.presencas); }).filter(function (av) { return av.statusGeral === 'Aprovado'; }).length;
    return '<button class="item-lista" data-turma="' + t.id + '" style="flex-direction:column;align-items:stretch;gap:0">' +
      '<div class="row-between"><div style="min-width:0"><span class="pill pill-accent">' + esc(t.nivel) + '</span>' +
      '<p class="serif" style="font-size:18px;margin-top:6px">' + esc(t.nome) + '</p>' +
      '<p class="muted">' + esc(t.diaSemana) + ' · ' + esc(t.sala) + '</p></div>' + ic('chevronRight') + '</div>' +
      '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,0,0,0.05);display:flex;gap:12px;font-size:12px;color:var(--cinza-texto)">' +
        '<span style="display:inline-flex;align-items:center;gap:4px">' + ic('users') + ' ' + alunos.length + '</span>' +
        '<span style="display:inline-flex;align-items:center;gap:4px">' + ic('grad') + ' ' + cats.length + '</span>' +
        '<span style="display:inline-flex;align-items:center;gap:4px">' + ic('check2') + ' ' + aprov + '/' + alunos.length + ' aprov.</span>' +
      '</div></button>';
  }).join('<div style="height:10px"></div>');

  if (turmas.length === 0) {
    lista = '<div class="text-center" style="padding: 48px 16px; opacity: 0.8;">' +
        '<img src="assets/PadroeiroSantoAntônio - Preto.svg" style="width: 64px; margin-bottom: 12px; opacity: 0.3;" alt="" />' +
        '<p class="muted">Nenhuma turma encontrada.</p>' +
      '</div>';
  }

  return '<div class="row-between" style="padding-top:4px"><h2 class="serif page-titulo">Turmas</h2>' + botaoNova + '</div>' +
    '<div style="margin-top:12px">' + lista + '</div>';
}

/* ==========================================================================
 * TELA — DETALHE DA TURMA
 * ========================================================================== */
let _subtabTurma = 'catequizandos';
let _presTipo = 'catequese';
let _presData = new Date().toISOString().slice(0, 10);
let _presRegistros = {};

function telaTurmaDetalhe(turmaId) {
  var turma = DADOS.turmas.find(function (t) { return t.id === turmaId; });
  if (!turma) return header('Turma', true) + '<main><p class="muted">Turma não encontrada.</p></main>';
  var alunos = DADOS.catequizandos.filter(function (a) { return a.turmaId === turmaId; });

  var infoCard = '<div class="card card-pad" style="margin-bottom:12px"><div class="row-between">' +
    '<div><span class="pill pill-accent">' + esc(turma.nivel) + '</span>' +
    '<p style="font-size:14px;color:var(--cinza-texto);margin-top:8px">' + esc(turma.diaSemana) + ' · ' + esc(turma.sala) + '</p>' +
    '<p class="muted">Ano letivo ' + turma.anoLetivo + '</p></div>' +
    '<div style="text-align:right"><p class="serif metric-num">' + alunos.length + '</p><p class="muted">catequizandos</p></div>' +
    '</div></div>';

  var subtabs = '<div class="subtabs">' +
    ['catequizandos:Catequizandos', 'presenca:Presença', 'catequistas:Catequistas'].map(function (s) {
      var id = s.split(':')[0], label = s.split(':')[1];
      return '<button class="subtab ' + (_subtabTurma === id ? 'ativo' : '') + '" data-subtab="' + id + '">' + label + '</button>';
    }).join('') + '</div>';

  var corpo = '';
  if (_subtabTurma === 'catequizandos') corpo = subCatequizandos(turmaId, alunos);
  else if (_subtabTurma === 'presenca') corpo = subPresenca(turmaId, alunos);
  else if (_subtabTurma === 'catequistas') corpo = subCatequistas(turmaId);

  return header(turma.nome, true) + '<main>' + infoCard + subtabs + corpo + '</main>';
}

function subCatequizandos(turmaId, alunos) {
  var u = USUARIO;
  var botaoAdd = (u.tipo === 'padre' || u.tipo === 'escritorio')
    ? '<button class="btn btn-outline btn-block" id="btn-novo-aluno" data-turma="' + turmaId + '" style="margin-bottom:8px">' + ic('userPlus') + ' Adicionar catequizando</button>' : '';
  var lista = alunos.map(function (a) {
    var av = avaliarAluno(a, DADOS.presencas);
    return '<button class="item-lista" data-boletim="' + a.id + '">' +
      '<div class="avatar">' + esc(iniciais(a.nome)) + '</div>' +
      '<div class="corpo"><p class="t">' + esc(a.nome) + '</p><p class="s">' + idadeAnos(a.dataNasc) + ' anos</p></div>' +
      '<div style="text-align:right">' + pillStatus(av.statusGeral) +
      '<p class="muted" style="margin-top:4px">' + (av.percentualCatequese == null ? '—' : av.percentualCatequese) + '% / ' + (av.percentualMissa == null ? '—' : av.percentualMissa) + '%</p></div>' +
    '</button>';
  }).join('<div style="height:8px"></div>');
  return botaoAdd + lista;
}

function subPresenca(turmaId, alunos) {
  _presRegistros = {};
  DADOS.presencas.forEach(function (p) {
    if (p.data === _presData && p.tipo === _presTipo && alunos.find(function (a) { return a.id === p.catequizandoId; })) {
      _presRegistros[p.catequizandoId] = p.situacao;
    }
  });

  var controles = '<div class="card card-pad" style="margin-bottom:12px">' +
    '<div class="grid-2">' +
      '<div class="campo" style="margin:0"><label>Tipo de encontro</label><select id="sel-tipo">' +
        '<option value="catequese"' + (_presTipo === 'catequese' ? ' selected' : '') + '>Catequese</option>' +
        '<option value="missa"' + (_presTipo === 'missa' ? ' selected' : '') + '>Missa</option></select></div>' +
      '<div class="campo" style="margin:0"><label>Data</label><input type="date" id="in-data" value="' + _presData + '" /></div>' +
    '</div>' +
    '<p class="muted" style="margin-top:12px">Toque em <b>P</b> (presente), <b>F</b> (falta) ou <b>J</b> (justificada) ao lado de cada aluno.</p></div>';

  var linhas = alunos.map(function (a) {
    var sit = _presRegistros[a.id];
    return '<div style="padding:12px;display:flex;align-items:center;gap:12px">' +
      '<div style="flex:1;min-width:0"><p style="font-size:14px;font-weight:500">' + esc(a.nome) + '</p></div>' +
      '<div class="pfj" data-aluno="' + a.id + '">' +
        '<button class="' + (sit === 'presente' ? 'on-p' : '') + '" data-sit="presente">P</button>' +
        '<button class="' + (sit === 'falta' ? 'on-f' : '') + '" data-sit="falta">F</button>' +
        '<button class="' + (sit === 'justificada' ? 'on-j' : '') + '" data-sit="justificada">J</button>' +
      '</div></div>';
  }).join('');

  return controles + '<div class="card card-lista">' + linhas + '</div>' +
    '<div style="margin-top:12px"><button class="btn btn-primary btn-lg" id="btn-salvar-presenca" data-turma="' + turmaId + '">' + ic('check') + ' Salvar presenças</button></div>';
}

function subCatequistas(turmaId) {
  var cats = DADOS.catequistas.filter(function (c) { return c.turmas.indexOf(turmaId) >= 0; });
  return cats.map(function (c) {
    return '<div class="card card-pad" style="margin-bottom:8px"><div style="display:flex;align-items:center;gap:12px">' +
      '<div class="avatar cinza">' + esc(iniciais(c.nome)) + '</div>' +
      '<div style="flex:1;min-width:0"><p style="font-size:14px;font-weight:500">' + esc(c.nome) + '</p><p class="muted">' + esc(c.telefone) + '</p></div>' +
      '<span class="pill ' + (c.nivel === 'responsavel' ? 'pill-accent' : 'pill-neutral') + '">' + (c.nivel === 'responsavel' ? 'Responsável' : 'Auxiliar') + '</span>' +
      '</div></div>';
  }).join('');
}

async function salvarPresencas(turmaId) {
  var alunos = DADOS.catequizandos.filter(function (a) { return a.turmaId === turmaId; });
  var ids = alunos.map(function (a) { return parseInt(a.id); }); // Converte IDs para o formato do Supabase
  
  var btn = document.getElementById('btn-salvar-presenca');
  if (btn) {
    // Coloca o botão a girar para o catequista saber que está a carregar
    btn.innerHTML = '<div class="spin" style="width:20px;height:20px;border-width:2px;border-top-color:#fff;margin:0 auto"></div>';
    btn.disabled = true;
  }

  var novos = [];
  Object.keys(_presRegistros).forEach(function (alunoId) {
    var sit = _presRegistros[alunoId];
    if (sit) {
      novos.push({ 
        catequizando_id: parseInt(alunoId), 
        data_encontro: _presData, 
        tipo: _presTipo, 
        situacao: sit 
      });
    }
  });

  // Envia para o Supabase!
  var sucesso = await salvarPresencasNaNuvem(ids, _presData, _presTipo, novos);
  
  if (sucesso) {
    render(); // Força a atualização do ecrã com os dados reais da nuvem
    
    // Mostra um visto no botão para dar feedback visual
    var btnNovo = document.getElementById('btn-salvar-presenca');
    if (btnNovo) {
      btnNovo.innerHTML = ic('check') + ' Salvo na nuvem!';
      btnNovo.disabled = false;
    }
  } else {
    if (btn) {
      btn.innerHTML = 'Erro ao salvar';
      btn.disabled = false;
    }
    alert('Ocorreu um erro ao salvar na base de dados.');
  }
}
/* ==========================================================================
 * TELA — AGENDA
 * ========================================================================== */
function telaAgenda() {
  var u = USUARIO;
  var eventos = DADOS.eventos.slice().sort(function (a, b) { return a.data.localeCompare(b.data); });
  var hoje = new Date().toISOString().slice(0, 10);
  var tipoIcone = { confissao: 'fileText', eucaristia: 'award', crisma: 'award', retiro: 'mapPin', encontro: 'users' };

  function cardEvento(e) {
    var turma = DADOS.turmas.find(function (t) { return t.id === e.turmaId; });
    return '<div class="card card-pad" style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
      '<div class="avatar" style="border-radius:12px;width:48px;height:48px">' + ic(tipoIcone[e.tipo] || 'calendar') + '</div>' +
      '<div style="flex:1;min-width:0"><p style="font-size:14px;font-weight:500">' + esc(e.titulo) + '</p>' +
      '<p class="muted">' + fmtDataExtenso(e.data) + '</p>' +
      (turma ? '<p class="muted">' + esc(turma.nivel) + '</p>' : '') + '</div></div>';
  }

  var proximos = eventos.filter(function (e) { return e.data >= hoje; });
  var passados = eventos.filter(function (e) { return e.data < hoje; });

  var botaoNovo = (u.tipo === 'padre' || u.tipo === 'escritorio')
    ? '<button class="btn btn-primary btn-sm" id="btn-novo-evento">' + ic('plus') + ' Novo evento</button>' : '';

  var html = '<div class="row-between" style="padding-top:4px"><h2 class="serif page-titulo">Agenda</h2>' + botaoNovo + '</div>';
  if (proximos.length) html += '<p class="section-label">Próximos</p>' + proximos.map(cardEvento).join('');
  if (passados.length) html += '<p class="section-label">Já realizados</p>' + passados.map(cardEvento).join('');
  
  if (proximos.length === 0 && passados.length === 0) {
    html += '<div class="text-center" style="padding: 48px 16px; opacity: 0.8;">' +
        '<img src="assets/IgrejaMatriz - Preto.svg" style="width: 64px; margin-bottom: 12px; opacity: 0.3;" alt="" />' +
        '<p class="muted">A agenda está vazia.</p>' +
      '</div>';
  }

  return html;
}

/* ==========================================================================
 * TELA — APOSTILAS
 * ========================================================================== */
let _filtroApostila = 'todas';

function telaApostilas() {
  var u = USUARIO;
  var niveis = [];
  DADOS.apostilas.forEach(function (a) { if (niveis.indexOf(a.nivel) < 0) niveis.push(a.nivel); });
  var filtradas = _filtroApostila === 'todas' ? DADOS.apostilas : DADOS.apostilas.filter(function (a) { return a.nivel === _filtroApostila; });

  var chips = '<button class="chip-filtro ' + (_filtroApostila === 'todas' ? 'on' : '') + '" data-filtro="todas">Todas</button>' +
    niveis.map(function (n) { return '<button class="chip-filtro ' + (_filtroApostila === n ? 'on' : '') + '" data-filtro="' + esc(n) + '">' + esc(n) + '</button>'; }).join('');

  var lista = filtradas.map(function (a) {
    return '<div class="card card-pad" style="display:flex;align-items:center;gap:12px;margin-bottom:8px">' +
      '<div style="width:44px;height:56px;border-radius:6px;background:linear-gradient(180deg,#fff7ed,#fed7aa);display:flex;align-items:center;justify-content:center;border:1px solid #fdba74;flex-shrink:0">' + ic('book', '') + '</div>' +
      '<div style="flex:1;min-width:0"><p class="eyebrow">Capítulo ' + a.capitulo + ' · ' + esc(a.nivel) + '</p>' +
      '<p class="serif" style="font-size:16px;margin-top:2px">' + esc(a.titulo) + '</p></div>' +
      '<button class="icon-btn" onclick="window.open(\'' + esc(a.url) + '\', \'_blank\')" title="Baixar material">' + ic('download') + '</button></div>';
  }).join('');

  var botaoNova = (u.tipo === 'padre' || u.tipo === 'escritorio')
    ? '<button class="btn btn-primary btn-sm" id="btn-nova-apostila">' + ic('plus') + ' Nova</button>' : '';

  return '<div class="row-between" style="padding-top:4px"><h2 class="serif page-titulo">Apostilas</h2>' + botaoNova + '</div>' +
    '<p class="muted" style="color:var(--cinza-texto);font-size:14px;margin-top:4px">Material da catequese para download e consulta</p>' +
    '<div style="display:flex;gap:8px;overflow-x:auto;margin:12px -16px;padding:0 16px 4px" id="chips-apostila">' + chips + '</div>' +
    (lista || '<p class="muted text-center" style="margin-top:24px">Nenhuma apostila encontrada.</p>');
}

/* ==========================================================================
 * TELA — MAIS (menu)
 * ========================================================================== */
function telaMais() {
  var u = USUARIO;
  var pendentes = (DADOS.paroquianos || []).filter(function (p) { return p.status === 'pendente'; }).length;
  var badgePend = pendentes > 0 ? ' <span style="background:var(--vermelho);color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:99px">' + pendentes + '</span>' : '';
  var itens = [
    { id: 'inscricoes', label: 'Inscrições' + badgePend, icone: 'fileText', who: ['padre', 'escritorio'] },
    { id: 'catequistas', label: 'Catequistas', icone: 'grad', who: ['padre', 'escritorio'] },
    { id: 'catequizandos', label: 'Catequizandos', icone: 'users', who: ['padre', 'escritorio'] },
    { id: 'relatorios', label: 'Relatórios', icone: 'chart', who: ['padre'] },
    { id: 'usuarios', label: 'Utilizadores e acessos', icone: 'key', who: ['padre', 'escritorio'] },
    { id: 'qr', label: 'Ecrã QR Code (demo)', icone: 'qr', who: ['padre', 'catequista', 'escritorio'] }
  ];
  var lista = itens.filter(function (it) { return it.who.indexOf(u.tipo) >= 0; }).map(function (it) {
    return '<button class="item-lista" data-mais="' + it.id + '" style="border-radius:0">' +
      '<div class="avatar cinza" style="width:36px;height:36px;border-radius:8px">' + ic(it.icone) + '</div>' +
      '<span style="flex:1;font-size:14px">' + it.label + '</span>' + ic('chevronRight') + '</button>';
  }).join('');

  return '<h2 class="serif page-titulo" style="padding-top:4px">Mais</h2>' +
    '<div class="card card-lista" style="overflow:hidden">' + lista + '</div>' +
    '<div class="card card-pad" style="margin-top:12px">' +
      '<p class="eyebrow" style="margin-bottom:8px">Sobre</p>' +
      '<p style="font-size:14px;font-weight:500">Paróquia Santo Antônio</p>' +
      '<p class="muted">Pe. Adriano Roberto · Pe. Jorge Merloni (Vigário)</p>' +
      '<p class="muted" style="margin-top:8px">Praça João Pessoa, 78 · Centro</p>' +
      '<p class="muted">Santo Antônio do Jardim, SP · 13.995-000</p>' +
      '<a href="https://www.instagram.com/paroquiasantoantonio_saj/" target="_blank" rel="noopener" style="font-size:12px;color:var(--terracota);margin-top:8px;display:inline-block">@paroquiasantoantonio_saj</a>' +
    '</div>' +
    '<button id="btn-sair" style="width:100%;text-align:center;font-size:14px;color:var(--cinza-claro);background:none;border:none;padding:12px;cursor:pointer">' + ic('logout') + ' Sair / trocar perfil</button>';
}

/* ==========================================================================
 * PÁGINAS INTERNAS (acessadas via "Mais")
 * ========================================================================== */
function telaPaginaInterna(pagina) {
  var titulos = { catequistas: 'Catequistas', catequizandos: 'Catequizandos', relatorios: 'Relatórios', usuarios: 'Utilizadores', inscricoes: 'Inscrições' };
  var corpo = '';
  if (pagina === 'relatorios') corpo = pgRelatorios();
  else if (pagina === 'catequistas') corpo = pgCatequistas();
  else if (pagina === 'catequizandos') corpo = pgCatequizandos();
  else if (pagina === 'usuarios') corpo = pgUsuarios();
  else if (pagina === 'inscricoes') corpo = pgInscricoes();
  return header(titulos[pagina] || '', true) + '<main>' + corpo + '</main>';
}

function pgRelatorios() {
  var stats = DADOS.turmas.map(function (t) {
    var alunos = DADOS.catequizandos.filter(function (a) { return a.turmaId === t.id; });
    var avs = alunos.map(function (a) { return avaliarAluno(a, DADOS.presencas); });
    
    var aprov = avs.filter(function (a) { return a.statusGeral === 'Aprovado'; }).length;
    var reprov = avs.filter(function (a) { return a.statusGeral === 'Reprovado'; }).length;
    
    var pc = avs.filter(function (a) { return a.percentualCatequese !== null; }).map(function (a) { return a.percentualCatequese; });
    var pm = avs.filter(function (a) { return a.percentualMissa !== null; }).map(function (a) { return a.percentualMissa; });
    
    var mc = pc.length ? Math.round(pc.reduce(function (s, x) { return s + x; }, 0) / pc.length) : 0;
    var mm = pm.length ? Math.round(pm.reduce(function (s, x) { return s + x; }, 0) / pm.length) : 0;
    
    return { turma: t, total: alunos.length, aprov: aprov, reprov: reprov, mc: mc, mm: mm };
  });

  var totalGeral = stats.reduce(function (s, x) { return s + x.total; }, 0);
  var aprovGeral = stats.reduce(function (s, x) { return s + x.aprov; }, 0);
  var taxa = totalGeral ? Math.round(aprovGeral / totalGeral * 100) : 0;

  function barra(valor) {
    var ok = valor >= 75;
    return '<div class="barra"><div class="marca75"></div><div class="preenche ' + (ok ? 'ok' : 'nao') + '" style="width:' + valor + '%;background:' + (ok ? 'var(--verde)' : 'var(--amarelo)') + '"></div></div>';
  }

  var cards = '<div class="grid-2" id="relatorio-print-area">' +
    '<div class="card card-pad"><p class="eyebrow">Total</p><p class="serif metric-num" style="margin-top:4px">' + totalGeral + '</p><p class="muted">catequizandos</p></div>' +
    '<div class="card card-pad"><p class="eyebrow">Aprovação</p><p class="serif metric-num" style="margin-top:4px">' + taxa + '%</p><p class="muted">' + aprovGeral + ' de ' + totalGeral + '</p></div>' +
  '</div>';

  var porTurma = stats.map(function (s) {
    return '<div class="card card-pad" style="margin-bottom:8px">' +
      '<div class="row-between" style="margin-bottom:12px"><div><span class="pill pill-accent">' + esc(s.turma.nivel) + '</span>' +
      '<p class="serif" style="font-size:16px;margin-top:6px">' + esc(s.turma.nome) + '</p></div>' +
      '<div style="text-align:right"><p class="serif" style="font-size:22px">' + (s.total ? Math.round(s.aprov / s.total * 100) : 0) + '%</p><p class="muted">' + s.aprov + ' de ' + s.total + '</p></div></div>' +
      '<div class="stack">' +
        '<div><div class="row-between" style="font-size:12px"><span style="color:var(--cinza-texto)">Catequese (média)</span><span style="font-weight:500">' + s.mc + '%</span></div>' + barra(s.mc) + '</div>' +
        '<div><div class="row-between" style="font-size:12px"><span style="color:var(--cinza-texto)">Missa (média)</span><span style="font-weight:500">' + s.mm + '%</span></div>' + barra(s.mm) + '</div>' +
      '</div>' +
      (s.reprov > 0 ? '<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.05);display:flex;align-items:center;gap:8px;font-size:12px;color:#9f1239">' + ic('alert') + ' ' + s.reprov + ' catequizando(s) em risco</div>' : '') +
    '</div>';
  }).join('');

  return '<div class="row-between" style="padding-top:4px;margin-bottom:16px;">' +
      '<h2 class="serif page-titulo" style="display:none"></h2>' +
      '<button class="btn btn-outline btn-sm" onclick="window.print()" style="margin-left:auto">' + ic('printer') + ' Imprimir Relatório Geral</button>' +
    '</div>' + 
    cards + '<p class="section-label">Por turma</p>' + porTurma;
}

function pgCatequistas() {
  var aviso = '<div class="info-box amarelo" style="margin-bottom:12px"><b>Sobre os níveis:</b> O catequista <i>Responsável</i> conduz a turma. O <i>Auxiliar</i> está em formação, aprendendo com o responsável antes de assumir uma turma própria.</div>';
  var botao = '<button class="btn btn-primary btn-sm" id="btn-novo-catequista">' + ic('plus') + ' Novo</button>';
  var lista = DADOS.catequistas.map(function (c) {
    var turmas = DADOS.turmas.filter(function (t) { return c.turmas.indexOf(t.id) >= 0; });
    return '<div class="card card-pad" style="margin-bottom:8px"><div style="display:flex;align-items:flex-start;gap:12px">' +
      '<div class="avatar cinza">' + esc(iniciais(c.nome)) + '</div>' +
      '<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><p style="font-size:14px;font-weight:500">' + esc(c.nome) + '</p>' +
      '<span class="pill ' + (c.nivel === 'responsavel' ? 'pill-accent' : 'pill-neutral') + '">' + (c.nivel === 'responsavel' ? 'Responsável' : 'Auxiliar (em formação)') + '</span></div>' +
      '<p class="muted" style="margin-top:2px">' + esc(c.telefone) + '</p>' +
      '<p class="muted" style="margin-top:4px">' + (turmas.length ? esc(turmas.map(function (t) { return t.nome; }).join(', ')) : 'Sem turma atribuída') + '</p></div></div></div>';
  }).join('');
  return '<div class="row-between"><h2 class="serif page-titulo" style="display:none"></h2>' + botao + '</div>' + aviso + lista;
}

function pgCatequizandos() {
  var botao = '<button class="btn btn-primary btn-sm" id="btn-novo-catequizando">' + ic('userPlus') + ' Novo</button>';
  var lista = DADOS.catequizandos.map(function (a) {
    var turma = DADOS.turmas.find(function (t) { return t.id === a.turmaId; });
    return '<button class="item-lista" data-boletim="' + a.id + '" style="border-radius:0">' +
      '<div class="avatar" style="width:36px;height:36px">' + esc(iniciais(a.nome)) + '</div>' +
      '<div class="corpo"><p class="t">' + esc(a.nome) + '</p><p class="s">' + esc((turma || {}).nome || '') + ' · ' + idadeAnos(a.dataNasc) + ' anos</p></div>' +
      ic('chevronRight') + '</button>';
  }).join('');
  return '<div class="row-between" style="margin-bottom:8px"><h2 class="serif page-titulo" style="display:none"></h2>' + botao + '</div>' +
    '<div class="card card-lista" style="overflow:hidden">' + lista + '</div>';
}

function pgUsuarios() {
  var usuarios = DADOS.usuarios || [];
  var botao = '<button class="btn btn-primary btn-sm" id="btn-novo-usuario">' + ic('userPlus') + ' Novo acesso</button>';
  var aviso = '<div class="info-box" style="margin-bottom:12px;display:flex;align-items:flex-start;gap:8px">' + ic('shield', '') +
    ' Aqui você cria os logins de quem vai usar o sistema. Cada pessoa entra com o seu próprio utilizador e senha, e o perfil define o que ela pode fazer.</div>';
  var lista = usuarios.map(function (u) {
    var ehVoce = u.login === USUARIO.login;
    return '<div class="card card-pad" style="margin-bottom:8px"><div style="display:flex;align-items:center;gap:12px">' +
      '<div class="avatar cinza">' + esc(iniciais(u.nome)) + '</div>' +
      '<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><p style="font-size:14px;font-weight:500">' + esc(u.nome) + '</p>' +
      (ehVoce ? '<span class="pill pill-success">você</span>' : '') + '</div>' +
      '<p class="muted" style="margin-top:2px">utilizador: <span class="mono">' + esc(u.login) + '</span></p></div>' +
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span class="pill ' + (u.tipo === 'padre' ? 'pill-accent' : 'pill-neutral') + '">' + ROTULO_PERFIL[u.tipo] + '</span>' +
      '<button class="icon-btn" data-redefinir-senha="' + u.id + '" title="Redefinir senha">' + ic('key') + '</button>' +
      '<button class="icon-btn" data-remover-usuario="' + u.id + '" title="Remover acesso">' + ic('trash') + '</button>' +
      '</div></div></div>';
  }).join('');
  return '<div class="row-between"><h2 class="serif page-titulo" style="display:none"></h2>' + botao + '</div>' + aviso + lista;
}

/* ==========================================================================
 * MODAIS
 * ========================================================================== */
function abrirModal(titulo, corpoHtml) {
  document.getElementById('modal-container').innerHTML =
    '<div class="modal-overlay" id="modal-overlay"><div class="modal">' +
      '<div class="modal-head"><h3 class="serif">' + esc(titulo) + '</h3>' +
      '<button class="icon-btn" id="modal-fechar">' + ic('x') + '</button></div>' +
      '<div class="modal-body">' + corpoHtml + '</div>' +
    '</div></div>';
  document.getElementById('modal-fechar').onclick = fecharModal;
  document.getElementById('modal-overlay').onclick = function (e) { if (e.target.id === 'modal-overlay') fecharModal(); };
}
function fecharModal() { document.getElementById('modal-container').innerHTML = ''; }

function abrirBoletim(alunoId) {
  var aluno = DADOS.catequizandos.find(function (a) { return String(a.id) === String(alunoId); });
  if (!aluno) return;
  var turma = DADOS.turmas.find(function (t) { return String(t.id) === String(aluno.turmaId); });
  
  var av = avaliarAluno(aluno, DADOS.presencas);
  var pres = DADOS.presencas.filter(function (p) { return String(p.catequizandoId) === String(aluno.id); });
  var presCat = pres.filter(function (p) { return p.tipo === 'catequese'; });
  var presMissa = pres.filter(function (p) { return p.tipo === 'missa'; });

  function barraPerc(pct, label, status) {
    var ok = pct !== null && pct >= 75;
    return '<div class="card card-pad"><div class="row-between" style="margin-bottom:4px">' +
      '<span class="muted">' + label + '</span>' + pillStatus(status) + '</div>' +
      '<div style="display:flex;align-items:baseline;gap:8px"><span class="serif metric-num">' + (pct == null ? '—' : pct) + '<span class="small">%</span></span>' +
      '<span class="muted">/ mínimo 75%</span></div>' +
      (pct == null ? '' : '<div class="barra"><div class="marca75"></div><div class="preenche ' + (ok ? 'ok' : 'nao') + '" style="width:' + Math.min(pct, 100) + '%"></div></div>') +
      '</div>';
  }

  function htmlHistorico(lista) {
    return lista.slice(-8).map(function (p) {
      var c = p.situacao === 'presente' ? 'p' : p.situacao === 'falta' ? 'f' : 'j';
      return '<div class="q ' + c + '" title="' + fmtData(p.data) + ' · ' + p.situacao + '">' + p.situacao[0].toUpperCase() + '</div>';
    }).join('');
  }

  var bannerClasse = av.statusGeral === 'Aprovado' ? 'ok' : av.statusGeral === 'Reprovado' ? 'nao' : 'neutro';
  var bannerTitulo = av.statusGeral === 'Aprovado' ? 'Apto a receber o sacramento' : av.statusGeral === 'Reprovado' ? 'Requer atenção pastoral' : 'Em formação';
  var motivosHtml = av.motivos.length
    ? '<ul style="margin-top:8px;list-style:none;font-size:14px;color:var(--cinza-texto)">' + av.motivos.map(function (m) {
        return '<li style="display:flex;align-items:flex-start;gap:6px;margin-top:4px">' + ic('fileWarn') + ' ' + esc(m) + '</li>';
      }).join('') + '</ul>' : '';

  var corpo =
    '<div class="stack" id="boletim-print-area">' +
      '<div style="display:flex;align-items:flex-start;gap:12px">' +
        '<div class="avatar lg">' + esc(iniciais(aluno.nome)) + '</div>' +
        '<div style="flex:1"><p class="serif" style="font-size:20px">' + esc(aluno.nome) + '</p>' +
        '<p class="muted">' + esc((turma || {}).nivel || '') + ' · ' + esc((turma || {}).nome || '') + '</p>' +
        '<p class="muted">' + idadeAnos(aluno.dataNasc) + ' anos · responsável: ' + esc(aluno.responsavel) + '</p></div>' +
      '</div>' +
      '<div class="status-banner ' + bannerClasse + '">' +
        '<div class="row-between"><p class="eyebrow">Status geral</p>' + pillStatus(av.statusGeral) + '</div>' +
        '<p class="serif" style="font-size:22px;margin-top:4px">' + bannerTitulo + '</p>' + motivosHtml +
      '</div>' +
      '<div class="grid-2">' + barraPerc(av.percentualCatequese, 'Frequência catequese', av.statusCatequese) +
        barraPerc(av.percentualMissa, 'Frequência missa', av.statusMissa) + '</div>' +
      '<div><p class="eyebrow" style="margin-bottom:8px">Histórico recente</p>' +
        '<div class="card" style="overflow:hidden"><div style="display:grid;grid-template-columns:1fr 1fr">' +
          '<div style="padding:12px;border-right:1px solid rgba(0,0,0,0.05)"><p class="muted" style="margin-bottom:8px">Catequese (' + presCat.length + ')</p><div class="hist">' + htmlHistorico(presCat) + '</div></div>' +
          '<div style="padding:12px"><p class="muted" style="margin-bottom:8px">Missa (' + presMissa.length + ')</p><div class="hist">' + htmlHistorico(presMissa) + '</div></div>' +
        '</div></div></div>' +
      '<div style="display:flex;gap:8px; margin-top: 16px;" class="no-print">' +
        '<button class="btn btn-outline" style="flex:1" id="bol-pdf">' + ic('download') + ' Baixar PDF</button>' +
        '<button class="btn btn-outline" style="flex:1" id="bol-print" onclick="window.print()">' + ic('printer') + ' Imprimir Boletim</button>' +
      '</div>' +
    '</div>';

  abrirModal('Boletim do catequizando', corpo);
  document.getElementById('bol-pdf').onclick = function () { window.print(); };
}

function modalNovaTurma() {
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Nome da turma</label><input id="nt-nome" placeholder="Ex: Eucaristia I — Manhã" /></div>' +
    '<div class="campo"><label>Nível</label><select id="nt-nivel"><option>Eucaristia I</option><option>Eucaristia II</option><option>Crisma I</option><option>Crisma II</option></select></div>' +
    '<div class="grid-2"><div class="campo" style="margin:0"><label>Dia/horário</label><input id="nt-dia" placeholder="Sábado, 9h" /></div>' +
    '<div class="campo" style="margin:0"><label>Sala</label><input id="nt-sala" placeholder="Sala 1" /></div></div>' +
    '<button class="btn btn-primary btn-lg" id="nt-salvar">' + ic('check') + ' Criar turma</button></div>';
  abrirModal('Nova turma', corpo);
  document.getElementById('nt-salvar').onclick = function () {
    var nome = document.getElementById('nt-nome').value.trim();
    if (!nome) { alert('Informe o nome da turma.'); return; }
    var nova = { id: novoId(), nome: nome, nivel: document.getElementById('nt-nivel').value, anoLetivo: new Date().getFullYear(),
      diaSemana: document.getElementById('nt-dia').value, sala: document.getElementById('nt-sala').value };
    fecharModal();
    atualizar('turmas', DADOS.turmas.concat([nova]));
  };
}

function modalNovoEvento() {
  var opcoesTurma = '<option value="">Todas as turmas</option>' + DADOS.turmas.map(function (t) { return '<option value="' + t.id + '">' + esc(t.nome) + '</option>'; }).join('');
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Título</label><input id="ne-titulo" placeholder="Ex: Confissão de preparação" /></div>' +
    '<div class="campo"><label>Data</label><input id="ne-data" type="date" /></div>' +
    '<div class="campo"><label>Tipo</label><select id="ne-tipo"><option value="encontro">Encontro</option><option value="confissao">Confissão</option><option value="eucaristia">Primeira Eucaristia</option><option value="crisma">Crisma</option><option value="retiro">Retiro</option></select></div>' +
    '<div class="campo"><label>Turma (opcional)</label><select id="ne-turma">' + opcoesTurma + '</select></div>' +
    '<button class="btn btn-primary btn-lg" id="ne-salvar">' + ic('calPlus') + ' Salvar evento</button></div>';
  abrirModal('Novo evento', corpo);
  document.getElementById('ne-salvar').onclick = function () {
    var titulo = document.getElementById('ne-titulo').value.trim();
    var data = document.getElementById('ne-data').value;
    if (!titulo || !data) { alert('Informe título e data.'); return; }
    var novo = { id: novoId(), titulo: titulo, data: data, tipo: document.getElementById('ne-tipo').value, turmaId: document.getElementById('ne-turma').value };
    fecharModal();
    atualizar('eventos', DADOS.eventos.concat([novo]));
  };
}

function modalNovoAluno(turmaIdFixa) {
  var opcoesTurma = DADOS.turmas.map(function (t) { return '<option value="' + t.id + '"' + (t.id === turmaIdFixa ? ' selected' : '') + '>' + esc(t.nome) + '</option>'; }).join('');
  var campoTurma = turmaIdFixa ? '' : '<div class="campo"><label>Turma</label><select id="na-turma"><option value="">Selecione...</option>' + opcoesTurma + '</select></div>';
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Nome completo</label><input id="na-nome" placeholder="Ex: João Pedro Silva" /></div>' +
    '<div class="campo"><label>Data de nascimento</label><input id="na-nasc" type="date" /></div>' +
    campoTurma +
    '<div class="campo"><label>Responsável</label><input id="na-resp" placeholder="Pai, mãe ou responsável" /></div>' +
    '<div class="campo"><label>Telefone</label><input id="na-tel" placeholder="(19) 9XXXX-XXXX" /></div>' +
    '<button class="btn btn-primary btn-lg" id="na-salvar">' + ic('check') + ' Cadastrar</button></div>';
  abrirModal('Novo catequizando', corpo);
  document.getElementById('na-salvar').onclick = function () {
    var nome = document.getElementById('na-nome').value.trim();
    var turmaId = turmaIdFixa || (document.getElementById('na-turma') ? document.getElementById('na-turma').value : '');
    if (!nome || !turmaId) { alert('Nome e turma são obrigatórios.'); return; }
    var novo = { id: novoId(), nome: nome, turmaId: turmaId, dataNasc: document.getElementById('na-nasc').value,
      responsavel: document.getElementById('na-resp').value || '—', telefone: document.getElementById('na-tel').value };
    fecharModal();
    atualizar('catequizandos', DADOS.catequizandos.concat([novo]));
  };
}

function modalNovoCatequista() {
  var checks = DADOS.turmas.map(function (t) {
    return '<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#fff;border:1px solid var(--borda);border-radius:12px;cursor:pointer;margin-bottom:6px">' +
      '<input type="checkbox" value="' + t.id + '" class="nc-turma" style="width:16px;height:16px;accent-color:var(--terracota)" /> <span style="font-size:14px">' + esc(t.nome) + '</span></label>';
  }).join('');
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Nome completo</label><input id="nc-nome" /></div>' +
    '<div class="campo"><label>Telefone</label><input id="nc-tel" placeholder="(19) 9XXXX-XXXX" /></div>' +
    '<div class="campo"><label>Nível</label><select id="nc-nivel"><option value="responsavel">Responsável pela turma</option><option value="auxiliar">Auxiliar (em formação)</option></select></div>' +
    '<div><label style="display:block;font-size:12px;font-weight:500;color:var(--cinza-texto);margin-bottom:6px">Turmas atendidas</label>' + checks + '</div>' +
    '<button class="btn btn-primary btn-lg" id="nc-salvar">' + ic('check') + ' Cadastrar</button></div>';
  abrirModal('Novo catequista', corpo);
  document.getElementById('nc-salvar').onclick = function () {
    var nome = document.getElementById('nc-nome').value.trim();
    if (!nome) { alert('O nome é obrigatório.'); return; }
    var turmas = Array.prototype.slice.call(document.querySelectorAll('.nc-turma:checked')).map(function (c) { return c.value; });
    var novo = { id: novoId(), nome: nome, telefone: document.getElementById('nc-tel').value, nivel: document.getElementById('nc-nivel').value, turmas: turmas };
    fecharModal();
    atualizar('catequistas', DADOS.catequistas.concat([novo]));
  };
}

function modalNovoUsuario() {
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Nome da pessoa</label><input id="nu-nome" placeholder="Ex: João Carlos Oliveira" /></div>' +
    '<div class="campo"><label>Utilizador (para entrar no sistema)</label><input id="nu-login" placeholder="Ex: joao" autocapitalize="none" autocorrect="off" /></div>' +
    '<div class="campo"><label>Senha</label><input id="nu-senha" placeholder="Defina uma senha" /></div>' +
    '<div class="campo"><label>Perfil de acesso</label><select id="nu-tipo">' +
      '<option value="catequista">Catequista — regista presença da própria turma</option>' +
      '<option value="escritorio">Escritório — cadastros, agenda e relatórios</option>' +
      '<option value="padre">Pároco — acesso completo</option></select></div>' +
    '<div id="nu-erro"></div>' +
    '<button class="btn btn-primary btn-lg" id="nu-salvar">' + ic('key') + ' Criar acesso</button></div>';
  abrirModal('Novo acesso', corpo);
  document.getElementById('nu-salvar').onclick = function () {
    var nome = document.getElementById('nu-nome').value.trim();
    var login = document.getElementById('nu-login').value.trim().toLowerCase();
    var senha = document.getElementById('nu-senha').value;
    var erroEl = document.getElementById('nu-erro');
    erroEl.innerHTML = '';
    if (!nome || !login || !senha) { erroEl.innerHTML = '<div class="erro-box">' + ic('alert') + ' Preencha nome, utilizador e senha.</div>'; return; }
    if ((DADOS.usuarios || []).some(function (u) { return u.login.toLowerCase() === login; })) {
      erroEl.innerHTML = '<div class="erro-box">' + ic('alert') + ' Já existe um utilizador com esse login.</div>'; return;
    }
    var novo = { id: novoId(), nome: nome, login: login, senha: senha, tipo: document.getElementById('nu-tipo').value };
    fecharModal();
    atualizar('usuarios', (DADOS.usuarios || []).concat([novo]));
  };
}

function removerUsuario(id) {
  var usuarios = DADOS.usuarios || [];
  var u = usuarios.find(function (x) { return x.id === String(id); });
  if (!u) return;
  if (u.login === USUARIO.login) { alert('Não pode remover o utilizador com o qual está ligado.'); return; }
  var padres = usuarios.filter(function (x) { return x.tipo === 'padre'; });
  if (u.tipo === 'padre' && padres.length <= 1) { alert('Não é possível remover o único utilizador com perfil de Pároco.'); return; }
  if (confirm('Remover o acesso de "' + u.nome + '"? Essa pessoa não poderá mais entrar no sistema.')) {
    atualizar('usuarios', usuarios.filter(function (x) { return x.id !== String(id); }));
  }
}

function modalNovaApostila() {
  var corpo = '<div class="stack">' +
    '<div class="campo"><label>Título do material</label><input id="nap-titulo" placeholder="Ex: Encontro 1 - O Pai Nosso" /></div>' +
    '<div class="campo"><label>Nível</label><select id="nap-nivel"><option>Eucaristia I</option><option>Eucaristia II</option><option>Crisma I</option><option>Crisma II</option></select></div>' +
    '<div class="campo"><label>Capítulo / Ordem (Número)</label><input id="nap-capitulo" type="number" placeholder="Ex: 1" value="1" /></div>' +
    '<div class="campo"><label>Ficheiro (PDF, Word, Imagem)</label><input id="nap-arquivo" type="file" style="background:rgba(255,255,255,0.9);padding:8px" /></div>' +
    '<button class="btn btn-primary btn-lg" id="nap-salvar">' + ic('check') + ' Enviar apostila</button></div>';
  
  abrirModal('Nova apostila', corpo);

  document.getElementById('nap-salvar').onclick = async function () {
    var titulo = document.getElementById('nap-titulo').value.trim();
    var nivel = document.getElementById('nap-nivel').value;
    var capitulo = document.getElementById('nap-capitulo').value || 1;
    var arquivoInput = document.getElementById('nap-arquivo');

    if (!titulo || arquivoInput.files.length === 0) { alert('Preencha o título e selecione um ficheiro para enviar.'); return; }

    var btn = document.getElementById('nap-salvar');
    btn.innerHTML = '<div class="spin" style="width:20px;height:20px;border-width:2px;border-top-color:#fff;margin:0 auto"></div>';
    btn.disabled = true;

    var sucesso = await uploadApostila(arquivoInput.files[0], titulo, nivel, parseInt(capitulo));
    
    if (sucesso) {
      fecharModal();
    } else {
      btn.innerHTML = ic('check') + ' Enviar apostila';
      btn.disabled = false;
    }
  };
}

/* ==========================================================================
 * TELA — QR CODE
 * ========================================================================== */
let _qrStep = 'form';
let _qrNome = '';
let _qrCatequista = '';
let _qrLocal = null;

function telaQR() {
  var topo = '<header class="app-header"><div class="inner">' +
    '<button class="icon-btn" id="qr-voltar">' + ic('arrowLeft') + '</button>' +
    '<img src="' + ICONE_URL + '" alt="" style="width: 36px; height: 36px; object-fit: contain;" />' +
    '<div class="titulo-area"><p class="small">Paróquia Santo Antônio</p><p class="serif nome">Registo de presença</p></div>' +
  '</div></header>';

  var corpo = '';
  if (_qrStep === 'form') {
    corpo = '<div style="max-width:420px;margin:0 auto;padding:32px 16px">' +
      '<div class="text-center" style="margin-bottom:24px">' +
        '<div class="avatar" style="width:80px;height:80px;border-radius:20px;margin:0 auto 12px">' + ic('qr', '') + '</div>' +
        '<h1 class="serif" style="font-size:24px">Olá!</h1>' +
        '<p class="muted" style="margin-top:4px">Confirme a sua presença na catequese de hoje</p></div>' +
      '<div class="card card-pad stack">' +
        '<div class="campo" style="margin:0"><label>O seu nome completo</label><input id="qr-nome" placeholder="Digite o seu nome" /></div>' +
        '<div class="campo" style="margin:0"><label>Nome do seu catequista</label><input id="qr-cat" placeholder="Ex: Maria Aparecida" /></div>' +
        '<p class="muted">Ao confirmar, enviamos a sua localização para o(a) catequista validar a presença.</p>' +
        '<button class="btn btn-primary btn-lg" id="qr-confirmar">' + ic('check') + ' Confirmar presença</button>' +
      '</div></div>';
  } else if (_qrStep === 'loading') {
    corpo = '<div class="text-center" style="padding:64px 16px"><div class="spin" style="margin:0 auto 16px"></div><p class="muted">A captar localização...</p></div>';
  } else {
    corpo = '<div style="max-width:420px;margin:0 auto;padding:32px 16px" class="text-center">' +
      '<div class="avatar" style="width:80px;height:80px;background:var(--verde-bg);color:var(--verde);margin:0 auto 16px">' + ic('check') + '</div>' +
      '<h1 class="serif" style="font-size:24px;margin-bottom:8px">Presença registada!</h1>' +
      '<p class="muted" style="margin-bottom:24px">O(a) catequista <b>' + esc(_qrCatequista) + '</b> vai validar no sistema. Já pode entrar.</p>' +
      '<div class="card card-pad stack" style="text-align:left">' +
        '<div class="row-between"><span class="muted">Nome</span><span style="font-size:13px;font-weight:500">' + esc(_qrNome) + '</span></div>' +
        '<div class="row-between"><span class="muted">Catequista</span><span style="font-size:13px;font-weight:500">' + esc(_qrCatequista) + '</span></div>' +
        '<div class="row-between"><span class="muted">Data e hora</span><span style="font-size:13px;font-weight:500">' + new Date().toLocaleString('pt-PT') + '</span></div>' +
        '<div class="row-between"><span class="muted">Localização</span><span style="font-size:13px;font-weight:500">' + (_qrLocal && !_qrLocal.erro ? _qrLocal.lat + ', ' + _qrLocal.lng : 'não capturada') + '</span></div>' +
      '</div>' +
      '<button class="link-qr" id="qr-voltar2" style="margin-top:24px">Voltar à demonstração</button></div>';
  }
  return '<div style="min-height:100vh">' + topo + corpo + '</div>';
}

function ligarEventosQR() {
  var v1 = document.getElementById('qr-voltar');
  var v2 = document.getElementById('qr-voltar2');
  var sair = function () { QR_MODE = false; _qrStep = 'form'; _qrNome = ''; _qrCatequista = ''; _qrLocal = null; render(); };
  if (v1) v1.onclick = sair;
  if (v2) v2.onclick = sair;

  var confirmar = document.getElementById('qr-confirmar');
  if (confirmar) confirmar.onclick = function () {
    _qrNome = document.getElementById('qr-nome').value.trim();
    _qrCatequista = document.getElementById('qr-cat').value.trim();
    if (!_qrNome || !_qrCatequista) { alert('Preencha o seu nome e o nome do catequista.'); return; }
    _qrStep = 'loading'; render();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) { _qrLocal = { lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) }; setTimeout(function () { _qrStep = 'done'; render(); }, 600); },
        function () { _qrLocal = { erro: true }; setTimeout(function () { _qrStep = 'done'; render(); }, 600); },
        { timeout: 3000 }
      );
    } else { _qrLocal = { erro: true }; setTimeout(function () { _qrStep = 'done'; render(); }, 600); }
  };
}

/* ==========================================================================
 * ROTEAMENTO DE EVENTOS
 * ========================================================================== */
function ligarEventosApp() {
  var btnVoltar = document.getElementById('btn-voltar');
  if (btnVoltar) btnVoltar.onclick = function () { VISAO = null; render(); };
  var btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.onclick = function () { USUARIO = null; ABA = 'inicio'; VISAO = null; render(); };

  document.querySelectorAll('.nav-btn').forEach(function (b) {
    b.onclick = function () { ABA = b.getAttribute('data-aba'); VISAO = null; render(); };
  });

  document.querySelectorAll('[data-goto-aba]').forEach(function (b) {
    b.onclick = function () { ABA = b.getAttribute('data-goto-aba'); VISAO = null; render(); };
  });
  document.querySelectorAll('[data-goto-pagina]').forEach(function (b) {
    b.onclick = function () { VISAO = { tipo: 'pagina', pagina: b.getAttribute('data-goto-pagina') }; render(); };
  });

  document.querySelectorAll('[data-turma]').forEach(function (b) {
    if (b.id === 'btn-nova-turma' || b.id === 'btn-novo-aluno' || b.id === 'btn-salvar-presenca') return;
    b.onclick = function () { _subtabTurma = 'catequizandos'; VISAO = { tipo: 'turma', id: b.getAttribute('data-turma') }; render(); };
  });

  document.querySelectorAll('[data-subtab]').forEach(function (b) {
    b.onclick = function () { _subtabTurma = b.getAttribute('data-subtab'); render(); };
  });

  document.querySelectorAll('[data-boletim]').forEach(function (b) {
    b.onclick = function () { abrirBoletim(b.getAttribute('data-boletim')); };
  });

  document.querySelectorAll('[data-mais]').forEach(function (b) {
    b.onclick = function () {
      var destino = b.getAttribute('data-mais');
      if (destino === 'qr') { QR_MODE = true; render(); }
      else { VISAO = { tipo: 'pagina', pagina: destino }; render(); }
    };
  });

  var bNovaTurma = document.getElementById('btn-nova-turma'); if (bNovaTurma) bNovaTurma.onclick = modalNovaTurma;
  var bNovoEvento = document.getElementById('btn-novo-evento'); if (bNovoEvento) bNovoEvento.onclick = modalNovoEvento;
  var bNovoCateq = document.getElementById('btn-novo-catequista'); if (bNovoCateq) bNovoCateq.onclick = modalNovoCatequista;
  var bNovoAlunoP = document.getElementById('btn-novo-catequizando'); if (bNovoAlunoP) bNovoAlunoP.onclick = function () { modalNovoAluno(null); };
  var bNovoUsuario = document.getElementById('btn-novo-usuario'); if (bNovoUsuario) bNovoUsuario.onclick = modalNovoUsuario;
  var bNovoAluno = document.getElementById('btn-novo-aluno'); if (bNovoAluno) bNovoAluno.onclick = function () { modalNovoAluno(bNovoAluno.getAttribute('data-turma')); };
  var bNovaApostila = document.getElementById('btn-nova-apostila'); if (bNovaApostila) bNovaApostila.onclick = modalNovaApostila;

  document.querySelectorAll('[data-remover-usuario]').forEach(function (b) {
    b.onclick = function () { removerUsuario(b.getAttribute('data-remover-usuario')); };
  });

  document.querySelectorAll('[data-redefinir-senha]').forEach(function (b) {
    b.onclick = function () { modalRedefinirSenha(b.getAttribute('data-redefinir-senha')); };
  });

  var selTipo = document.getElementById('sel-tipo');
  if (selTipo) selTipo.onchange = function () { _presTipo = selTipo.value; render(); };
  var inData = document.getElementById('in-data');
  if (inData) inData.onchange = function () { _presData = inData.value; render(); };
document.querySelectorAll('.pfj').forEach(function (grupo) {
    var alunoId = grupo.getAttribute('data-aluno'); // <-- O erro estava aqui!
    grupo.querySelectorAll('button').forEach(function (bt) {
      bt.onclick = function () {
        var sit = bt.getAttribute('data-sit');
        _presRegistros[alunoId] = (_presRegistros[alunoId] === sit) ? undefined : sit;
        grupo.querySelectorAll('button').forEach(function (x) { x.className = ''; });
        if (_presRegistros[alunoId]) {
          bt.className = sit === 'presente' ? 'on-p' : sit === 'falta' ? 'on-f' : 'on-j';
        }
      };
    });
  });
  var bSalvarPres = document.getElementById('btn-salvar-presenca');
  if (bSalvarPres) bSalvarPres.onclick = function () { salvarPresencas(bSalvarPres.getAttribute('data-turma')); };

  document.querySelectorAll('[data-filtro]').forEach(function (b) {
    b.onclick = function () { _filtroApostila = b.getAttribute('data-filtro'); render(); };
  });

  var bSair = document.getElementById('btn-sair');
  if (bSair) bSair.onclick = function () { USUARIO = null; ABA = 'inicio'; VISAO = null; render(); };

  document.querySelectorAll('[data-par]').forEach(function (btn) {
    btn.onclick = function () { modalParoquiano(btn.getAttribute('data-par')); };
  });
}

// 4. FUNÇÃO PARA SALVAR PRESENÇAS NA NUVEM
async function salvarPresencasNaNuvem(alunosIds, dataEncontro, tipo, novosRegistros) {
  try {
    // 1. Apaga as presenças antigas dessa turma nessa data (para não duplicar)
    await supabaseClient
      .from('presencas')
      .delete()
      .in('catequizando_id', alunosIds)
      .eq('data_encontro', dataEncontro)
      .eq('tipo', tipo);

    // 2. Insere as novas marcações no banco de dados
    if (novosRegistros.length > 0) {
      let { error } = await supabaseClient.from('presencas').insert(novosRegistros);
      if (error) throw error;
    }

    // 3. Atualiza a memória local puxando da nuvem para manter o sistema rápido
    let resPres = await supabaseClient.from('presencas').select('*');
    if (resPres.data) {
      DADOS.presencas = resPres.data.map(p => ({
        id: String(p.id), catequizandoId: String(p.catequizando_id), data: p.data_encontro, tipo: p.tipo, situacao: p.situacao
      }));
    }
    return true;
  } catch (erro) {
    console.error("Erro ao salvar presenças:", erro);
    return false;
  }
}

/* ==========================================================================
 * INSCRIÇÃO — Tela pública multi-etapas
 * ========================================================================== */
function telaInscricao() {
  if (_inscSucesso) return inscTelaSucesso();
  var titulos = ['', 'Dados Pessoais', 'Contato e Endereço', 'Família', 'Sacramentos e Vínculos', 'Confirmação'];
  var pct = Math.round((_inscPasso / 5) * 100);
  var progresso =
    '<div style="padding:0 16px 16px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<p style="font-size:13px;font-weight:500;color:var(--terracota)">Passo ' + _inscPasso + ' de 5</p>' +
        '<p style="font-size:12px;color:var(--cinza-texto)">' + titulos[_inscPasso] + '</p>' +
      '</div>' +
      '<div style="height:4px;background:#e5e7eb;border-radius:2px">' +
        '<div style="height:4px;width:' + pct + '%;background:var(--terracota);border-radius:2px"></div>' +
      '</div>' +
    '</div>';
  var corpo = '';
  if (_inscPasso === 1) corpo = inscPasso1();
  else if (_inscPasso === 2) corpo = inscPasso2();
  else if (_inscPasso === 3) corpo = inscPasso3();
  else if (_inscPasso === 4) corpo = inscPasso4();
  else if (_inscPasso === 5) corpo = inscPasso5();
  var btnVoltar = _inscPasso > 1
    ? '<button class="btn" id="insc-voltar">' + ic('arrowLeft') + ' Voltar</button>'
    : '<button class="btn" id="insc-cancelar">Cancelar</button>';
  var btnAvancar = _inscPasso < 5
    ? '<button class="btn btn-primary" id="insc-avancar">Próximo ' + ic('chevronRight') + '</button>'
    : '<button class="btn btn-primary" id="insc-enviar">' + ic('check') + ' Enviar inscrição</button>';
  return '<div style="min-height:100vh;background:var(--fundo)">' +
    '<div style="background:#fff;padding:16px;border-bottom:1px solid var(--borda);display:flex;align-items:center;gap:12px">' +
      '<img src="' + ICONE_URL + '" style="width:32px;height:32px" />' +
      '<div><p style="font-size:14px;font-weight:600">Inscrição na Catequese</p>' +
      '<p style="font-size:12px;color:var(--cinza-texto)">Paróquia Santo Antônio</p></div>' +
    '</div>' +
    progresso +
    '<div style="padding:0 16px 100px">' +
      (_inscErro ? '<div class="erro-box" style="margin-bottom:16px">' + ic('alert') + ' ' + esc(_inscErro) + '</div>' : '') +
      corpo +
    '</div>' +
    '<div style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:#fff;border-top:1px solid var(--borda);display:flex;justify-content:space-between;align-items:center">' +
      btnVoltar + btnAvancar +
    '</div>' +
  '</div>';
}

function inscTelaSucesso() {
  return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:32px;text-align:center;gap:16px">' +
    '<div style="width:72px;height:72px;background:var(--verde-bg);border-radius:50%;display:flex;align-items:center;justify-content:center">' + ic('check2') + '</div>' +
    '<h1 class="serif" style="font-size:24px">Inscrição enviada!</h1>' +
    '<p style="font-size:15px;color:#444;max-width:300px;line-height:1.6">Sua inscrição foi recebida com sucesso. A secretaria da paróquia irá analisá-la e entrará em contato.</p>' +
    '<p style="font-size:13px;color:var(--cinza-texto)">Paróquia Santo Antônio · (19) 3654-1258</p>' +
    '<button class="btn btn-primary" id="insc-nova">Nova inscrição</button>' +
    '<button class="btn" id="insc-voltar-login">Voltar ao login</button>' +
  '</div>';
}

function inscPasso1() {
  var d = _inscDados;
  var tipos = [['catequizando','Catequizando'],['catecumeno','Catecúmeno'],['catequista','Catequista'],['dizimista','Dizimista'],['nubente','Nubente'],['arrecadador','Arrecadador']];
  var optTipos = tipos.map(function(t){ return '<option value="'+t[0]+'"'+(d.tipoCadastro===t[0]?' selected':'')+'>'+t[1]+'</option>'; }).join('');
  var optEsc = ['','Fundamental incompleto','Fundamental completo','Médio incompleto','Médio completo','Superior incompleto','Superior completo','Pós-graduação'].map(function(e){ return '<option value="'+e+'"'+(d.escolaridade===e?' selected':'')+'>'+e+'</option>'; }).join('');
  var optEc = ['','Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','União estável'].map(function(e){ return '<option value="'+e+'"'+(d.estadoCivil===e?' selected':'')+'>'+e+'</option>'; }).join('');
  return '<div class="stack">' +
    '<div class="campo"><label>Tipo de cadastro <span style="color:var(--vermelho)">*</span></label><select id="i-tipo">'+optTipos+'</select></div>' +
    '<div class="campo"><label>Nome completo <span style="color:var(--vermelho)">*</span></label><input id="i-nome" placeholder="Ex: João Pedro da Silva" value="'+esc(d.nomeCompleto||'')+'" /></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>CPF</label><input id="i-cpf" placeholder="000.000.000-00" value="'+esc(d.cpf||'')+'" /></div>' +
      '<div class="campo"><label>RG</label><input id="i-rg" placeholder="00.000.000-0" value="'+esc(d.rg||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Data de nascimento</label><input id="i-datanasc" type="date" value="'+esc(d.dataNascimento||'')+'" /></div>' +
      '<div class="campo"><label>Sexo</label><select id="i-sexo"><option value="">—</option><option value="M"'+(d.sexo==='M'?' selected':'')+'>Masculino</option><option value="F"'+(d.sexo==='F'?' selected':'')+'>Feminino</option></select></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 60px;gap:12px">' +
      '<div class="campo"><label>Naturalidade</label><input id="i-natural" placeholder="Santo Antônio do Jardim" value="'+esc(d.naturalidade||'')+'" /></div>' +
      '<div class="campo"><label>UF</label><input id="i-uf-nasc" maxlength="2" style="text-transform:uppercase" value="'+esc(d.ufNascimento||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Estado civil</label><select id="i-estadocivil">'+optEc+'</select></div>' +
      '<div class="campo"><label>Profissão</label><input id="i-prof" value="'+esc(d.profissao||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Escolaridade</label><select id="i-esc">'+optEsc+'</select></div>' +
      '<div class="campo"><label>Formação</label><input id="i-formacao" value="'+esc(d.formacao||'')+'" /></div>' +
    '</div>' +
  '</div>';
}

function inscPasso2() {
  var d = _inscDados;
  return '<div class="stack">' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota)">Contatos</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Celular / WhatsApp <span style="color:var(--vermelho)">*</span></label><input id="i-cel" type="tel" placeholder="(19) 9XXXX-XXXX" value="'+esc(d.telefoneCelular||'')+'" /></div>' +
      '<div class="campo"><label>Tel. residencial</label><input id="i-resid" type="tel" value="'+esc(d.telefoneResidencial||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Tel. de recado</label><input id="i-recado" type="tel" value="'+esc(d.telefoneRecado||'')+'" /></div>' +
      '<div class="campo"><label>E-mail</label><input id="i-email" type="email" value="'+esc(d.email||'')+'" /></div>' +
    '</div>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:8px">Endereço</p>' +
    '<div style="display:grid;grid-template-columns:110px 1fr;gap:12px">' +
      '<div class="campo"><label>CEP</label><input id="i-cep" maxlength="9" placeholder="00000-000" value="'+esc(d.cep||'')+'" /></div>' +
      '<div class="campo"><label>Logradouro</label><input id="i-logr" value="'+esc(d.logradouro||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:80px 1fr;gap:12px">' +
      '<div class="campo"><label>Número</label><input id="i-num" value="'+esc(d.numero||'')+'" /></div>' +
      '<div class="campo"><label>Complemento</label><input id="i-comp" placeholder="Apto, Casa..." value="'+esc(d.complemento||'')+'" /></div>' +
    '</div>' +
    '<div class="campo"><label>Bairro</label><input id="i-bairro" value="'+esc(d.bairro||'')+'" /></div>' +
    '<div style="display:grid;grid-template-columns:1fr 60px;gap:12px">' +
      '<div class="campo"><label>Cidade</label><input id="i-cidade" value="'+esc(d.cidade||'')+'" /></div>' +
      '<div class="campo"><label>UF</label><input id="i-uf" maxlength="2" style="text-transform:uppercase" value="'+esc(d.uf||'')+'" /></div>' +
    '</div>' +
  '</div>';
}

function inscPasso3() {
  var d = _inscDados;
  var depRows = _inscDependentes.map(function(dep, i) {
    return '<div style="display:grid;grid-template-columns:1fr 130px 110px 28px;gap:8px;align-items:center;margin-bottom:8px">' +
      '<input placeholder="Nome" value="'+esc(dep.nome||'')+'" data-dep-nome="'+i+'" style="font-size:13px" />' +
      '<input type="date" value="'+esc(dep.dataNasc||'')+'" data-dep-nasc="'+i+'" style="font-size:12px" />' +
      '<input placeholder="Parentesco" value="'+esc(dep.parentesco||'')+'" data-dep-par="'+i+'" style="font-size:13px" />' +
      '<button type="button" data-dep-del="'+i+'" style="color:var(--vermelho);background:none;border:none;cursor:pointer;font-size:20px;line-height:1">×</button>' +
    '</div>';
  }).join('');
  return '<div class="stack">' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota)">Filiação</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Nome do pai</label><input id="i-pai" value="'+esc(d.nomePai||'')+'" /></div>' +
      '<div class="campo"><label>Profissão do pai</label><input id="i-profpai" value="'+esc(d.profissaoPai||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Nome da mãe</label><input id="i-mae" value="'+esc(d.nomeMae||'')+'" /></div>' +
      '<div class="campo"><label>Profissão da mãe</label><input id="i-profmae" value="'+esc(d.profissaoMae||'')+'" /></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:end">' +
      '<div class="campo"><label>Pais casados na Igreja?</label><select id="i-casados"><option value="">—</option><option value="sim"'+(d.paisCasadosIgreja==='sim'?' selected':'')+'>Sim</option><option value="nao"'+(d.paisCasadosIgreja==='nao'?' selected':'')+'>Não</option></select></div>' +
      '<div class="campo"><label>Paróquia do casamento</label><input id="i-parqcas" value="'+esc(d.paroquiaCasamento||'')+'" /></div>' +
    '</div>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:8px">Cônjuge (se casado)</p>' +
    '<div class="campo"><label>Nome do cônjuge</label><input id="i-conjuge" value="'+esc(d.nomeConjuge||'')+'" /></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Nasc. cônjuge</label><input id="i-nascconj" type="date" value="'+esc(d.dataNascConjuge||'')+'" /></div>' +
      '<div class="campo"><label>Data do matrimônio</label><input id="i-matrim" type="date" value="'+esc(d.dataMatrimonio||'')+'" /></div>' +
    '</div>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:8px">Dependentes</p>' +
    '<div id="dep-lista">'+depRows+'</div>' +
    '<button type="button" id="insc-add-dep" class="btn btn-sm" style="width:100%">'+ic('plus')+' Adicionar dependente</button>' +
  '</div>';
}

function inscPasso4() {
  var d = _inscDados;
  var anos = [2026,2027,2028,2029,2030,2031];
  var etapasHtml = anos.map(function(ano) {
    return '<div style="text-align:center">' +
      '<label style="font-size:11px;display:block;margin-bottom:4px">'+ano+'</label>' +
      '<input id="i-etapa-'+ano+'" style="width:100%;text-align:center;font-size:13px" value="'+esc((d.etapas&&d.etapas[ano])?d.etapas[ano]:'')+'" placeholder="—" />' +
    '</div>';
  }).join('');
  var pastRows = _inscPastorais.map(function(p, i) {
    return '<div style="background:var(--fundo);border-radius:8px;padding:10px;margin-bottom:8px;border:1px solid var(--borda)">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">' +
        '<input placeholder="Realidade Eclesial" value="'+esc(p.realidade||'')+'" data-past-real="'+i+'" style="font-size:13px" />' +
        '<input placeholder="Grupo/Descrição" value="'+esc(p.descricao||'')+'" data-past-desc="'+i+'" style="font-size:13px" />' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">' +
        '<input placeholder="Função" value="'+esc(p.funcao||'')+'" data-past-func="'+i+'" style="font-size:13px" />' +
        '<input placeholder="Pastoral" value="'+esc(p.pastoral||'')+'" data-past-past="'+i+'" style="font-size:13px" />' +
        '<input placeholder="Ministério" value="'+esc(p.ministerio||'')+'" data-past-min="'+i+'" style="font-size:13px" />' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;justify-content:space-between">' +
        '<div style="display:flex;align-items:center;gap:8px"><label style="font-size:12px">Início:</label><input type="date" value="'+esc(p.dataInicio||'')+'" data-past-data="'+i+'" style="font-size:12px" /></div>' +
        '<button type="button" data-past-del="'+i+'" style="color:var(--vermelho);background:none;border:none;cursor:pointer;font-size:20px">×</button>' +
      '</div>' +
    '</div>';
  }).join('');
  return '<div class="stack">' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota)">Batismo</p>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--fundo);border-radius:8px;border:1px solid var(--borda);cursor:pointer">' +
      '<input type="checkbox" id="i-batizado" style="width:16px;height:16px;accent-color:var(--terracota)"'+(d.batizado?' checked':'')+' /> <span style="font-size:14px;font-weight:500">Batizado(a)</span>' +
    '</label>' +
    '<div id="i-batismo-campos" style="'+(d.batizado?'':'display:none')+'">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div class="campo"><label>Data do batismo</label><input id="i-dtbat" type="date" value="'+esc(d.dataBatismo||'')+'" /></div>' +
        '<div class="campo"><label>Paróquia</label><input id="i-parqbat" value="'+esc(d.paroquiaBatismo||'')+'" /></div>' +
      '</div>' +
      '<div class="campo"><label>(Arqui)Diocese</label><input id="i-diocese" value="'+esc(d.dioceseBatismo||'')+'" /></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' +
        '<div class="campo"><label>Livro</label><input id="i-livro" value="'+esc(d.livroBatismo||'')+'" /></div>' +
        '<div class="campo"><label>Folha</label><input id="i-folha" value="'+esc(d.folhaBatismo||'')+'" /></div>' +
        '<div class="campo"><label>Número</label><input id="i-numbat" value="'+esc(d.numeroBatismo||'')+'" /></div>' +
      '</div>' +
    '</div>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:8px">Vínculos Paroquiais</p>' +
    '<div class="campo"><label>Comunidade</label><input id="i-comunidade" value="'+esc(d.comunidade||'')+'" /></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="campo"><label>Código do catequista</label><input id="i-codcat" value="'+esc(d.codigoCatequista||'')+'" /></div>' +
      '<div class="campo"><label>Código dizimista</label><input id="i-coddiz" value="'+esc(d.codigoDizimista||'')+'" /></div>' +
    '</div>' +
    '<label style="display:flex;align-items:center;gap:10px;cursor:pointer"><input type="checkbox" id="i-dizimista" style="width:16px;height:16px;accent-color:var(--terracota)"'+(d.dizimista?' checked':'')+' /> <span style="font-size:14px">Dizimista</span></label>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:8px">Etapas da Catequese</p>' +
    '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">'+etapasHtml+'</div>' +
    '<p style="font-size:13px;font-weight:600;color:var(--terracota);margin-top:16px">Grupos e Pastorais</p>' +
    '<div id="past-lista">'+pastRows+'</div>' +
    '<button type="button" id="insc-add-past" class="btn btn-sm" style="width:100%">'+ic('plus')+' Adicionar pastoral</button>' +
  '</div>';
}

function inscPasso5() {
  var d = _inscDados;
  return '<div class="stack">' +
    '<div class="card card-pad">' +
      '<p style="font-size:13px;font-weight:600;margin-bottom:10px">Revisão</p>' +
      '<p style="font-size:14px"><b>Nome:</b> '+esc(d.nomeCompleto||'—')+'</p>' +
      '<p style="font-size:14px"><b>Tipo:</b> '+esc(d.tipoCadastro||'—')+'</p>' +
      '<p style="font-size:14px"><b>Nascimento:</b> '+fmtData(d.dataNascimento||'')+'</p>' +
      '<p style="font-size:14px"><b>Celular:</b> '+esc(d.telefoneCelular||'—')+'</p>' +
      '<p style="font-size:14px"><b>E-mail:</b> '+esc(d.email||'—')+'</p>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--borda);border-radius:12px;padding:16px">' +
      '<p style="font-size:13px;font-weight:600;margin-bottom:8px">Termo de Responsabilidade</p>' +
      '<p style="font-size:13px;color:#555;line-height:1.6;font-style:italic">"Catequese é processo permanente de educação na fé. Ao inscrever seu(sua) filho(a) na catequese, você está se comprometendo a fazer parte deste processo, ou seja, ter um compromisso de participar com seu(sua) filho(a) das atividades da Paróquia (Missa das crianças e reuniões). É responsabilidade sua a educação religiosa de seu(sua) filho(a) pois, não se deve esquecer que \'os pais são os primeiros catequistas dos filhos\'. Sem o seu compromisso e apoio, o trabalho catequético será em vão."</p>' +
    '</div>' +
    '<label style="display:flex;align-items:flex-start;gap:12px;padding:16px;background:var(--verde-bg);border-radius:12px;border:1px solid #86efac;cursor:pointer">' +
      '<input type="checkbox" id="i-termo" style="width:20px;height:20px;min-width:20px;accent-color:var(--verde);margin-top:2px"'+(d.termoResponsabilidade?' checked':'')+' />' +
      '<span style="font-size:14px">Li e concordo com o Termo de Responsabilidade, comprometendo-me a participar das atividades da catequese.</span>' +
    '</label>' +
    '<p style="font-size:12px;color:var(--cinza-texto);text-align:center">Data da inscrição: '+new Date().toLocaleDateString('pt-BR')+'</p>' +
  '</div>';
}

function inscColetarPasso() {
  _inscErro = '';
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function chk(id) { var el = document.getElementById(id); return el ? el.checked : false; }
  if (_inscPasso === 1) {
    if (!val('i-tipo')) { _inscErro = 'Selecione o tipo de cadastro.'; render(); return false; }
    if (!val('i-nome')) { _inscErro = 'O nome completo é obrigatório.'; render(); return false; }
    Object.assign(_inscDados, { tipoCadastro: val('i-tipo'), nomeCompleto: val('i-nome'), cpf: val('i-cpf'), rg: val('i-rg'), dataNascimento: val('i-datanasc'), sexo: val('i-sexo'), naturalidade: val('i-natural'), ufNascimento: val('i-uf-nasc').toUpperCase(), estadoCivil: val('i-estadocivil'), profissao: val('i-prof'), escolaridade: val('i-esc'), formacao: val('i-formacao') });
  } else if (_inscPasso === 2) {
    if (!val('i-cel')) { _inscErro = 'O celular/WhatsApp é obrigatório.'; render(); return false; }
    Object.assign(_inscDados, { telefoneCelular: val('i-cel'), telefoneResidencial: val('i-resid'), telefoneRecado: val('i-recado'), email: val('i-email'), cep: val('i-cep'), logradouro: val('i-logr'), numero: val('i-num'), complemento: val('i-comp'), bairro: val('i-bairro'), cidade: val('i-cidade'), uf: val('i-uf').toUpperCase() });
  } else if (_inscPasso === 3) {
    Object.assign(_inscDados, { nomePai: val('i-pai'), profissaoPai: val('i-profpai'), nomeMae: val('i-mae'), profissaoMae: val('i-profmae'), paisCasadosIgreja: val('i-casados'), paroquiaCasamento: val('i-parqcas'), nomeConjuge: val('i-conjuge'), dataNascConjuge: val('i-nascconj'), dataMatrimonio: val('i-matrim') });
    document.querySelectorAll('[data-dep-nome]').forEach(function(el){ var i=parseInt(el.getAttribute('data-dep-nome')); if(_inscDependentes[i]) _inscDependentes[i].nome=el.value; });
    document.querySelectorAll('[data-dep-nasc]').forEach(function(el){ var i=parseInt(el.getAttribute('data-dep-nasc')); if(_inscDependentes[i]) _inscDependentes[i].dataNasc=el.value; });
    document.querySelectorAll('[data-dep-par]').forEach(function(el){ var i=parseInt(el.getAttribute('data-dep-par')); if(_inscDependentes[i]) _inscDependentes[i].parentesco=el.value; });
  } else if (_inscPasso === 4) {
    var etapas = {};
    [2026,2027,2028,2029,2030,2031].forEach(function(a){ var v=val('i-etapa-'+a); if(v) etapas[a]=v; });
    document.querySelectorAll('[data-past-real]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-real')); if(_inscPastorais[i]) _inscPastorais[i].realidade=el.value; });
    document.querySelectorAll('[data-past-desc]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-desc')); if(_inscPastorais[i]) _inscPastorais[i].descricao=el.value; });
    document.querySelectorAll('[data-past-func]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-func')); if(_inscPastorais[i]) _inscPastorais[i].funcao=el.value; });
    document.querySelectorAll('[data-past-past]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-past')); if(_inscPastorais[i]) _inscPastorais[i].pastoral=el.value; });
    document.querySelectorAll('[data-past-min]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-min')); if(_inscPastorais[i]) _inscPastorais[i].ministerio=el.value; });
    document.querySelectorAll('[data-past-data]').forEach(function(el){ var i=parseInt(el.getAttribute('data-past-data')); if(_inscPastorais[i]) _inscPastorais[i].dataInicio=el.value; });
    Object.assign(_inscDados, { batizado: chk('i-batizado'), dataBatismo: val('i-dtbat'), paroquiaBatismo: val('i-parqbat'), dioceseBatismo: val('i-diocese'), livroBatismo: val('i-livro'), folhaBatismo: val('i-folha'), numeroBatismo: val('i-numbat'), comunidade: val('i-comunidade'), codigoCatequista: val('i-codcat'), dizimista: chk('i-dizimista'), codigoDizimista: val('i-coddiz'), etapas: etapas });
  } else if (_inscPasso === 5) {
    _inscDados.termoResponsabilidade = chk('i-termo');
  }
  return true;
}

function ligarEventosInscricao() {
  var btnAv = document.getElementById('insc-avancar');
  if (btnAv) btnAv.onclick = function() {
    if (!inscColetarPasso()) return;
    _inscPasso++; _inscErro = ''; render(); window.scrollTo(0,0);
  };
  var btnVolt = document.getElementById('insc-voltar');
  if (btnVolt) btnVolt.onclick = function() {
    inscColetarPasso();
    _inscPasso--; _inscErro = ''; render(); window.scrollTo(0,0);
  };
  var btnCanc = document.getElementById('insc-cancelar');
  if (btnCanc) btnCanc.onclick = function() {
    VISAO = null; _inscPasso = 1; _inscDados = {}; _inscDependentes = []; _inscPastorais = []; _inscErro = ''; render();
  };
  var btnEnv = document.getElementById('insc-enviar');
  if (btnEnv) btnEnv.onclick = async function() {
    if (!inscColetarPasso()) return;
    if (!_inscDados.termoResponsabilidade) { _inscErro = 'Você precisa aceitar o Termo de Responsabilidade para continuar.'; render(); return; }
    btnEnv.disabled = true; btnEnv.textContent = 'Enviando...';
    var ok = await salvarInscricao(Object.assign({}, _inscDados, { dependentes: _inscDependentes, pastorais: _inscPastorais }));
    if (ok) { _inscSucesso = true; render(); }
    else { _inscErro = 'Erro ao enviar. Verifique sua conexão e tente novamente.'; render(); }
  };
  var btnAddDep = document.getElementById('insc-add-dep');
  if (btnAddDep) btnAddDep.onclick = function() { inscColetarPasso(); _inscDependentes.push({nome:'',dataNasc:'',parentesco:''}); render(); };
  document.querySelectorAll('[data-dep-del]').forEach(function(btn) {
    btn.onclick = function() { inscColetarPasso(); _inscDependentes.splice(parseInt(btn.getAttribute('data-dep-del')),1); render(); };
  });
  var btnAddPast = document.getElementById('insc-add-past');
  if (btnAddPast) btnAddPast.onclick = function() { inscColetarPasso(); _inscPastorais.push({realidade:'',descricao:'',funcao:'',ministerio:'',dataInicio:'',pastoral:''}); render(); };
  document.querySelectorAll('[data-past-del]').forEach(function(btn) {
    btn.onclick = function() { inscColetarPasso(); _inscPastorais.splice(parseInt(btn.getAttribute('data-past-del')),1); render(); };
  });
  var chkBat = document.getElementById('i-batizado');
  if (chkBat) chkBat.onchange = function() { var c = document.getElementById('i-batismo-campos'); if(c) c.style.display = chkBat.checked ? '' : 'none'; };
  var btnNova = document.getElementById('insc-nova');
  if (btnNova) btnNova.onclick = function() { _inscPasso=1; _inscDados={}; _inscDependentes=[]; _inscPastorais=[]; _inscErro=''; _inscSucesso=false; render(); };
  var btnLoginRet = document.getElementById('insc-voltar-login');
  if (btnLoginRet) btnLoginRet.onclick = function() { VISAO=null; _inscPasso=1; _inscDados={}; _inscDependentes=[]; _inscPastorais=[]; _inscErro=''; _inscSucesso=false; render(); };
}

/* ==========================================================================
 * PAINEL DE INSCRIÇÕES — Admin (Pároco / Escritório)
 * ========================================================================== */
function pgInscricoes() {
  var lista = DADOS.paroquianos || [];
  var pend = lista.filter(function(p){ return p.status==='pendente'; }).length;
  var aprov = lista.filter(function(p){ return p.status==='aprovado'; }).length;
  var rej = lista.filter(function(p){ return p.status==='rejeitado'; }).length;
  var resumo =
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">' +
      '<div class="card card-pad" style="text-align:center"><p style="font-size:22px;font-weight:700;color:var(--amarelo)">'+pend+'</p><p style="font-size:12px;color:var(--cinza-texto)">Pendentes</p></div>' +
      '<div class="card card-pad" style="text-align:center"><p style="font-size:22px;font-weight:700;color:var(--verde)">'+aprov+'</p><p style="font-size:12px;color:var(--cinza-texto)">Aprovados</p></div>' +
      '<div class="card card-pad" style="text-align:center"><p style="font-size:22px;font-weight:700;color:var(--vermelho)">'+rej+'</p><p style="font-size:12px;color:var(--cinza-texto)">Rejeitados</p></div>' +
    '</div>';
  if (!lista.length) {
    return resumo + '<div class="card card-pad" style="text-align:center;color:var(--cinza-texto)">'+ic('fileText')+'<p style="margin-top:8px">Nenhuma inscrição recebida ainda.</p></div>';
  }
  var itens = lista.map(function(p) {
    var cor = p.status==='aprovado' ? 'pill-success' : p.status==='rejeitado' ? 'pill-danger' : 'pill-neutral';
    var ico = p.status==='aprovado' ? 'check2' : p.status==='rejeitado' ? 'xCircle' : 'clock';
    var label = p.status==='aprovado' ? 'Aprovado' : p.status==='rejeitado' ? 'Rejeitado' : 'Pendente';
    return '<button class="item-lista" data-par="'+p.id+'" style="border-radius:0">' +
      '<div class="avatar cinza" style="width:36px;height:36px">'+esc(iniciais(p.nomeCompleto))+'</div>' +
      '<div class="corpo"><p class="t">'+esc(p.nomeCompleto)+'</p>' +
        '<p class="s">'+esc(p.tipoCadastro||'—')+' · '+fmtData(p.dataInscricao||'')+'</p></div>' +
      '<span class="pill '+cor+'">'+ic(ico)+' '+label+'</span>' +
    '</button>';
  }).join('');
  return resumo + '<div class="card card-lista" style="overflow:hidden">'+itens+'</div>';
}

function modalParoquiano(id) {
  var p = (DADOS.paroquianos||[]).find(function(x){ return x.id===String(id); });
  if (!p) return;
  function linha(label, valor) { return valor ? '<p style="font-size:13px;margin-bottom:6px"><span style="color:var(--cinza-texto);font-size:11px;text-transform:uppercase;display:block">'+label+'</span>'+esc(String(valor))+'</p>' : ''; }
  var statusLabel = p.status==='aprovado'?'Aprovado':p.status==='rejeitado'?'Rejeitado':'Pendente';
  var statusCor = p.status==='aprovado'?'var(--verde)':p.status==='rejeitado'?'var(--vermelho)':'var(--amarelo)';
  var camposAcao = p.status==='pendente'
    ? '<div class="campo" style="margin-top:12px"><label>Observação (opcional)</label><textarea id="par-obs" rows="2" style="width:100%;padding:8px;border:1px solid var(--borda);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical"></textarea></div>' +
      '<div style="display:flex;gap:8px;margin-top:12px">' +
        '<button class="btn btn-primary" id="par-aprovar" style="flex:1">'+ic('check')+' Aprovar</button>' +
        '<button class="btn" id="par-rejeitar" style="flex:1;color:var(--vermelho);border-color:var(--vermelho)">'+ic('x')+' Rejeitar</button>' +
      '</div>'
    : '<p style="margin-top:12px;font-size:13px">Status: <b style="color:'+statusCor+'">'+statusLabel+'</b>' +
        (p.aprovadoPor ? ' por '+esc(p.aprovadoPor) : '') +
        (p.dataAprovacao ? ' em '+fmtData(p.dataAprovacao.slice(0,10)) : '') + '</p>' +
        (p.observacaoAprovacao ? '<p style="font-size:13px;font-style:italic;color:#666;margin-top:4px">"'+esc(p.observacaoAprovacao)+'"</p>' : '') +
        (p.status!=='aprovado' ? '<button class="btn btn-primary" id="par-reaprovar" style="margin-top:12px;width:100%">'+ic('check')+' Aprovar agora</button>' : '');
  var corpo =
    linha('Tipo de cadastro', p.tipoCadastro) +
    linha('Data de nascimento', fmtData(p.dataNascimento||'')) +
    linha('Sexo', p.sexo==='M'?'Masculino':p.sexo==='F'?'Feminino':null) +
    linha('CPF', p.cpf) + linha('RG', p.rg) +
    linha('Naturalidade', p.naturalidade&&p.ufNascimento ? p.naturalidade+' / '+p.ufNascimento : (p.naturalidade||p.ufNascimento)) +
    linha('Estado civil', p.estadoCivil) + linha('Profissão', p.profissao) +
    '<hr style="border:none;border-top:1px solid var(--borda);margin:10px 0" />' +
    linha('Celular', p.telefoneCelular) + linha('E-mail', p.email) +
    linha('Endereço', [p.logradouro, p.numero, p.complemento].filter(Boolean).join(', ')) +
    linha('Bairro', p.bairro) + linha('Cidade/UF', [p.cidade, p.uf].filter(Boolean).join(' / ')) +
    '<hr style="border:none;border-top:1px solid var(--borda);margin:10px 0" />' +
    linha('Pai', [p.nomePai, p.profissaoPai].filter(Boolean).join(' — ')) +
    linha('Mãe', [p.nomeMae, p.profissaoMae].filter(Boolean).join(' — ')) +
    linha('Cônjuge', p.nomeConjuge) +
    linha('Batizado', p.batizado ? 'Sim'+(p.dataBatismo?' — '+fmtData(p.dataBatismo):'') : null) +
    linha('Paróquia de batismo', p.paroquiaBatismo) +
    linha('Comunidade', p.comunidade) +
    linha('Termo assinado', p.termoResponsabilidade ? 'Sim' : 'Não') +
    (p.dependentes&&p.dependentes.length ? '<p style="font-size:11px;text-transform:uppercase;color:var(--cinza-texto);margin-top:8px">Dependentes</p>' + p.dependentes.map(function(d){ return '<p style="font-size:13px">• '+esc(d.nome)+(d.parentesco?' ('+d.parentesco+')':'')+(d.dataNasc?' — '+fmtData(d.dataNasc):'')+'</p>'; }).join('') : '') +
    camposAcao;
  abrirModal(p.nomeCompleto, corpo);
  var btnApr = document.getElementById('par-aprovar');
  var btnRej = document.getElementById('par-rejeitar');
  var btnReapr = document.getElementById('par-reaprovar');
  if (btnApr) btnApr.onclick = async function() {
    var obs = document.getElementById('par-obs') ? document.getElementById('par-obs').value.trim() : '';
    btnApr.disabled = true;
    await atualizarStatusParoquiano(id, 'aprovado', obs);
    fecharModal();
  };
  if (btnRej) btnRej.onclick = async function() {
    var obs = document.getElementById('par-obs') ? document.getElementById('par-obs').value.trim() : '';
    btnRej.disabled = true;
    await atualizarStatusParoquiano(id, 'rejeitado', obs);
    fecharModal();
  };
  if (btnReapr) btnReapr.onclick = async function() {
    btnReapr.disabled = true;
    await atualizarStatusParoquiano(id, 'aprovado', '');
    fecharModal();
  };
}

/* ==========================================================================
 * RECUPERAÇÃO DE SENHA — Tela pública
 * ========================================================================== */
function telaRecuperacaoSenha() {
  var semDados = (DADOS.usuarios || []).length === 0;
  var contato =
    '<div style="background:#fff;border:1px solid var(--borda);border-radius:12px;padding:16px;margin-top:8px">' +
      '<p style="font-size:13px;font-weight:600;margin-bottom:8px">Entre em contato com a secretaria</p>' +
      '<p style="font-size:14px;margin-bottom:6px">' + ic('phone', '') + ' <a href="tel:+551936541258" style="color:var(--terracota)">(19) 3654-1258</a></p>' +
      '<p style="font-size:14px">' + ic('phone', '') + ' <a href="tel:+5519996703725" style="color:var(--terracota)">(19) 99670-3725</a> <span style="font-size:12px;color:var(--cinza-texto)">(WhatsApp)</span></p>' +
    '</div>';

  var corpo = '';
  if (_recupSucesso) {
    corpo =
      '<div style="text-align:center;padding:24px 0;display:flex;flex-direction:column;align-items:center;gap:16px">' +
        '<div style="width:64px;height:64px;background:var(--verde-bg);border-radius:50%;display:flex;align-items:center;justify-content:center">' + ic('check2') + '</div>' +
        '<p style="font-size:16px;font-weight:600">Solicitação anotada!</p>' +
        '<p style="font-size:14px;color:#555;max-width:300px;line-height:1.5">Ligue ou mande mensagem para a secretaria informando seu nome e o utilizador <b>' + esc(_recupLogin) + '</b>. Eles irão redefinir sua senha.</p>' +
        contato +
        '<button class="btn btn-primary" style="width:100%;margin-top:8px" id="recup-voltar-login">' + ic('arrowLeft') + ' Voltar ao login</button>' +
      '</div>';
  } else if (semDados) {
    corpo =
      '<div class="stack">' +
        '<div class="info-box" style="display:flex;align-items:flex-start;gap:10px">' +
          ic('alert') +
          '<p style="font-size:13px;line-height:1.5">Não foi possível verificar os utilizadores agora. Entre em contato diretamente com a secretaria para redefinir sua senha.</p>' +
        '</div>' +
        contato +
        '<button class="btn" style="width:100%;margin-top:8px" id="recup-voltar">' + ic('arrowLeft') + ' Voltar ao login</button>' +
      '</div>';
  } else {
    corpo =
      '<div class="stack">' +
        '<div class="info-box" style="display:flex;align-items:flex-start;gap:10px">' +
          ic('alert') +
          '<p style="font-size:13px;line-height:1.5">Informe seu utilizador abaixo para registrar a solicitação e, em seguida, entre em contato com a secretaria.</p>' +
        '</div>' +
        (_recupErro
          ? '<div class="erro-box" style="margin-bottom:4px">' + ic('alert') + ' ' + esc(_recupErro) + '</div>' +
            '<p style="font-size:13px;color:#555;margin-bottom:8px">Caso não se lembre do seu utilizador, entre em contato diretamente:</p>' +
            contato
          : '') +
        '<div class="campo">' +
          '<label>Seu utilizador</label>' +
          '<input id="recup-login" type="text" placeholder="Ex: maria" autocapitalize="none" autocorrect="off" value="' + esc(_recupLogin) + '" />' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" id="recup-enviar">' + ic('check') + ' Confirmar solicitação</button>' +
        '<button class="btn" id="recup-voltar" style="width:100%">' + ic('arrowLeft') + ' Voltar ao login</button>' +
      '</div>';
  }
  return '<div style="min-height:100vh;background:var(--fundo)">' +
    '<div style="background:#fff;padding:16px;border-bottom:1px solid var(--borda);display:flex;align-items:center;gap:12px">' +
      '<img src="' + ICONE_URL + '" style="width:32px;height:32px" />' +
      '<div><p style="font-size:14px;font-weight:600">Recuperação de senha</p>' +
      '<p style="font-size:12px;color:var(--cinza-texto)">Paróquia Santo Antônio</p></div>' +
    '</div>' +
    '<div style="padding:24px 16px">' + corpo + '</div>' +
  '</div>';
}

function ligarEventosRecuperacao() {
  var btnEnv = document.getElementById('recup-enviar');
  if (btnEnv) btnEnv.onclick = function () {
    var login = (document.getElementById('recup-login').value || '').trim().toLowerCase();
    if (!login) { _recupErro = 'Informe seu utilizador.'; render(); return; }
    var existe = (DADOS.usuarios || []).some(function (u) { return u.login.toLowerCase() === login; });
    if (!existe) {
      _recupErro = 'Utilizador "' + login + '" não encontrado. Verifique a escrita ou use os contatos abaixo.';
      _recupLogin = login;
      render();
      return;
    }
    _recupLogin = login;
    _recupErro = '';
    _recupSucesso = true;
    render();
  };

  document.querySelectorAll('#recup-voltar, #recup-voltar-login').forEach(function (btn) {
    if (btn) btn.onclick = function () { VISAO = null; _recupErro = ''; _recupSucesso = false; render(); };
  });
}

/* ==========================================================================
 * MODAL — Redefinir senha (admin)
 * ========================================================================== */
function modalRedefinirSenha(id) {
  var u = (DADOS.usuarios || []).find(function (x) { return x.id === String(id); });
  if (!u) return;
  var corpo =
    '<div class="stack">' +
      '<p style="font-size:14px">Redefinindo a senha de <b>' + esc(u.nome) + '</b>.</p>' +
      '<div class="campo">' +
        '<label>Nova senha <span style="color:var(--vermelho)">*</span></label>' +
        '<div class="senha-wrap">' +
          '<input id="rds-nova" type="password" placeholder="Mínimo 4 caracteres" />' +
          '<button class="senha-toggle" id="rds-toggle" type="button">' + ic('eye') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="campo">' +
        '<label>Confirmar nova senha <span style="color:var(--vermelho)">*</span></label>' +
        '<input id="rds-confirmar" type="password" placeholder="Repita a senha" />' +
      '</div>' +
      '<div id="rds-erro"></div>' +
      '<button class="btn btn-primary btn-lg" id="rds-salvar">' + ic('key') + ' Salvar nova senha</button>' +
    '</div>';
  abrirModal('Redefinir senha', corpo);

  var toggle = document.getElementById('rds-toggle');
  if (toggle) toggle.onclick = function () {
    var inp = document.getElementById('rds-nova');
    if (!inp) return;
    var visivel = inp.type === 'text';
    inp.type = visivel ? 'password' : 'text';
    toggle.innerHTML = ic(visivel ? 'eye' : 'eyeOff');
  };

  document.getElementById('rds-salvar').onclick = async function () {
    var nova = (document.getElementById('rds-nova').value || '');
    var conf = (document.getElementById('rds-confirmar').value || '');
    var erroEl = document.getElementById('rds-erro');
    erroEl.innerHTML = '';
    if (nova.length < 4) { erroEl.innerHTML = '<div class="erro-box">' + ic('alert') + ' A senha precisa ter pelo menos 4 caracteres.</div>'; return; }
    if (nova !== conf) { erroEl.innerHTML = '<div class="erro-box">' + ic('alert') + ' As senhas não coincidem.</div>'; return; }
    var btn = document.getElementById('rds-salvar');
    btn.disabled = true; btn.textContent = 'Salvando...';
    var ok = await atualizarSenhaUsuario(id, nova);
    if (ok) {
      fecharModal();
      abrirModal('Senha redefinida', '<div style="text-align:center;padding:16px 0"><div style="font-size:48px">✓</div><p style="margin-top:8px">A senha de <b>' + esc(u.nome) + '</b> foi atualizada com sucesso.</p></div>');
    } else {
      btn.disabled = false; btn.innerHTML = ic('key') + ' Salvar nova senha';
      erroEl.innerHTML = '<div class="erro-box">' + ic('alert') + ' Erro ao salvar. Verifique sua conexão.</div>';
    }
  };
}

/* ==========================================================================
 * INICIALIZAÇÃO
 * ========================================================================== */
(function iniciar() {
  carregarDadosDaNuvem();
})();