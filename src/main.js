/* ═══════════════════════════════════════════
   ChamaKi — Main Application
   Convex real-time backend + Top Navbar UI
   ═══════════════════════════════════════════ */
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// ── Convex Client ──
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const client = new ConvexClient(CONVEX_URL);

// ── State ──
let currentUser = null; // { name, email, type, dept?, cargo? }
let tickets = [];
let currentPage = "";
let selectedTicket = null;
let ticketSubscription = null;

// Persist session
function saveSession() {
  if (currentUser) localStorage.setItem("chamaki_user", JSON.stringify(currentUser));
  else localStorage.removeItem("chamaki_user");
}
function loadSession() {
  try {
    const s = localStorage.getItem("chamaki_user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// ── Icons ──
function icon(id, w) {
  return `<svg width="${w || 18}" height="${w || 18}"><use href="#${id}"/></svg>`;
}

// ── Toast ──
function toast(msg, type) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast-notification " + (type || "info") + " show";
  setTimeout(() => t.classList.remove("show"), 3500);
}

// ── Show/Hide Screens ──
function showScreen(id) {
  ["landing", "authCli", "authTec", "appShell"].forEach((s) => {
    document.getElementById(s).classList.add("hide");
  });
  document.getElementById(id).classList.remove("hide");
}

// ══════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════
function renderLanding() {
  document.getElementById("landing").innerHTML = `
    <div class="landing-page">
      <div class="landing-header">
        <div class="landing-logo">
          <div class="landing-logo-icon">${icon("i-headphones", 22)}</div>
          <span class="landing-title">ChamaKi</span>
        </div>
        <div class="landing-subtitle">Sistema de Help Desk e Gestao de Chamados de TI</div>
      </div>
      <div class="portal-cards">
        <div class="portal-card" id="pcColab">
          <div class="portal-card-stripe colab"></div>
          <div class="portal-card-icon colab">${icon("i-user", 24)}</div>
          <h2>Portal do Colaborador</h2>
          <p>Precisa de suporte tecnico? Crie sua conta, registre um chamado e acompanhe o andamento da solucao em tempo real.</p>
          <div class="portal-card-action colab">Abrir chamado &rarr;</div>
        </div>
        <div class="portal-card" id="pcTech">
          <div class="portal-card-stripe tech"></div>
          <div class="portal-card-icon tech">${icon("i-wrench", 24)}</div>
          <h2>Portal do Tecnico</h2>
          <p>Area restrita da equipe de suporte de TI. Gerencie chamados, assuma atendimentos, resolva incidentes e acompanhe metricas de SLA.</p>
          <div class="portal-card-action tech">Acessar painel &rarr;</div>
        </div>
      </div>
      <div class="landing-footer">
        Universidade Sao Judas Tadeu &middot; Projeto e Engenharia de Software &middot; 2026/2<br>
        Orientador: Prof. Raulison Resende
      </div>
    </div>`;
  document.getElementById("pcColab").onclick = () => goAuth("cli");
  document.getElementById("pcTech").onclick = () => goAuth("tec");
}

// ══════════════════════════════════════════════
// AUTH SCREENS
// ══════════════════════════════════════════════
function goAuth(mode) {
  if (mode === "cli") {
    renderAuthCli();
    showScreen("authCli");
  } else {
    renderAuthTec();
    showScreen("authTec");
  }
}

function renderAuthCli() {
  document.getElementById("authCli").innerHTML = `
    <div class="auth-screen">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo-sm">${icon("i-headphones", 18)}</div>
        <span class="auth-brand">ChamaKi</span>
      </div>
      <div class="auth-desc">Portal do Colaborador</div>
      <div class="tab-bar">
        <button class="tab-btn active" id="cTabLogin">Entrar</button>
        <button class="tab-btn" id="cTabReg">Criar conta</button>
      </div>
      <div id="cAuthError" class="auth-error"></div>
      <div id="cLoginForm">
        <div class="form-group"><label>E-mail</label><input type="email" id="cEmail" placeholder="seuemail@gmail.com"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="cPass" placeholder="Sua senha"></div>
        <button class="btn btn-primary" id="cLoginBtn">Entrar</button>
      </div>
      <div id="cRegForm" class="hide">
        <div class="form-group"><label>Nome completo</label><input id="rn" placeholder="Seu nome completo"></div>
        <div class="form-group"><label>E-mail</label><input id="re" placeholder="seuemail@gmail.com"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="rp" placeholder="Minimo 6 caracteres"></div>
        <div class="form-group"><label>Confirmar senha</label><input type="password" id="rp2" placeholder="Repita a senha"></div>
        <button class="btn btn-primary" id="cRegBtn">Criar conta</button>
      </div>
      <button class="back-link" id="cBack">${icon("i-chevron-left", 14)} Voltar</button>
    </div>
    </div>`;

  // Tab switching
  const tabLogin = document.getElementById("cTabLogin");
  const tabReg = document.getElementById("cTabReg");
  tabLogin.onclick = () => { tabLogin.classList.add("active"); tabReg.classList.remove("active"); document.getElementById("cLoginForm").classList.remove("hide"); document.getElementById("cRegForm").classList.add("hide"); hideError("cAuthError"); };
  tabReg.onclick = () => { tabReg.classList.add("active"); tabLogin.classList.remove("active"); document.getElementById("cRegForm").classList.remove("hide"); document.getElementById("cLoginForm").classList.add("hide"); hideError("cAuthError"); };

  document.getElementById("cLoginBtn").onclick = loginCli;
  document.getElementById("cRegBtn").onclick = regCli;
  document.getElementById("cBack").onclick = goLanding;
}

function renderAuthTec() {
  document.getElementById("authTec").innerHTML = `
    <div class="auth-screen">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo-sm">${icon("i-headphones", 18)}</div>
        <span class="auth-brand">ChamaKi</span>
      </div>
      <div class="auth-desc">Portal do Tecnico</div>
      <div class="tab-bar">
        <button class="tab-btn active" id="tTabLogin">Entrar</button>
        <button class="tab-btn" id="tTabReg">Criar conta</button>
      </div>
      <div id="tAuthError" class="auth-error"></div>
      <div id="tLoginForm">
        <div class="auth-alert">${icon("i-shield", 16)} Acesso restrito a equipe de suporte de TI.</div>
        <div class="form-group"><label>E-mail corporativo</label><input type="email" id="tEmail" placeholder="nome@empresa.com"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="tPass" placeholder="Sua senha"></div>
        <button class="btn btn-primary" id="tLoginBtn">Acessar painel</button>
      </div>
      <div id="tRegForm" class="hide">
        <div class="auth-alert">${icon("i-shield", 16)} Registro de nova conta tecnica.</div>
        <div class="form-group"><label>Nome completo</label><input id="trn" placeholder="Seu nome completo"></div>
        <div class="form-group"><label>E-mail corporativo</label><input id="tre" placeholder="nome@empresa.com"></div>
        <div class="form-group"><label>Departamento</label>
          <select id="trd"><option>TI</option><option>Infraestrutura</option><option>Seguranca da Informacao</option><option>Suporte N1</option><option>Suporte N2</option><option>Desenvolvimento</option></select>
        </div>
        <div class="form-group"><label>Cargo</label><input id="trc" placeholder="Ex: Analista de Suporte"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="trp" placeholder="Minimo 6 caracteres"></div>
        <div class="form-group"><label>Confirmar senha</label><input type="password" id="trp2" placeholder="Repita a senha"></div>
        <button class="btn btn-primary" id="tRegBtn">Criar conta tecnica</button>
      </div>
      <button class="back-link" id="tBack">${icon("i-chevron-left", 14)} Voltar</button>
    </div>
    </div>`;

  const tabLogin = document.getElementById("tTabLogin");
  const tabReg = document.getElementById("tTabReg");
  tabLogin.onclick = () => { tabLogin.classList.add("active"); tabReg.classList.remove("active"); document.getElementById("tLoginForm").classList.remove("hide"); document.getElementById("tRegForm").classList.add("hide"); hideError("tAuthError"); };
  tabReg.onclick = () => { tabReg.classList.add("active"); tabLogin.classList.remove("active"); document.getElementById("tRegForm").classList.remove("hide"); document.getElementById("tLoginForm").classList.add("hide"); hideError("tAuthError"); };

  document.getElementById("tLoginBtn").onclick = loginTec;
  document.getElementById("tRegBtn").onclick = regTec;
  document.getElementById("tBack").onclick = goLanding;
}

function showError(elId, msg) {
  const el = document.getElementById(elId);
  el.textContent = msg; el.style.display = "block";
}
function hideError(elId) {
  document.getElementById(elId).style.display = "none";
}

// ── Auth Logic (calls Convex) ──
async function loginCli() {
  const email = document.getElementById("cEmail").value.trim();
  const pass = document.getElementById("cPass").value;
  if (!email || !pass) { showError("cAuthError", "Preencha todos os campos."); return; }
  if (pass.length < 6) { showError("cAuthError", "Senha deve ter no minimo 6 caracteres."); return; }
  try {
    const user = await client.mutation(api.auth.login, { email, password: pass });
    if (user.type !== "cli") { showError("cAuthError", "Este e-mail pertence a um tecnico. Use o Portal do Tecnico."); return; }
    currentUser = user;
    saveSession();
    enterApp();
  } catch (e) {
    showError("cAuthError", e.message || "Erro ao fazer login.");
  }
}

async function regCli() {
  const name = document.getElementById("rn").value.trim();
  const email = document.getElementById("re").value.trim();
  const pass = document.getElementById("rp").value;
  const pass2 = document.getElementById("rp2").value;
  if (!name || !email || !pass) { showError("cAuthError", "Preencha todos os campos."); return; }
  if (pass.length < 6) { showError("cAuthError", "Senha: minimo 6 caracteres."); return; }
  if (pass !== pass2) { showError("cAuthError", "As senhas nao conferem."); return; }
  try {
    const user = await client.mutation(api.auth.register, { name, email, password: pass, type: "cli" });
    currentUser = user;
    saveSession();
    toast("Conta criada com sucesso!", "success");
    enterApp();
  } catch (e) {
    showError("cAuthError", e.message || "Erro ao criar conta.");
  }
}

async function loginTec() {
  const email = document.getElementById("tEmail").value.trim();
  const pass = document.getElementById("tPass").value;
  if (!email || !pass) { showError("tAuthError", "Preencha todos os campos."); return; }
  if (pass.length < 6) { showError("tAuthError", "Senha: minimo 6 caracteres."); return; }
  try {
    const user = await client.mutation(api.auth.login, { email, password: pass });
    if (user.type !== "tec") { showError("tAuthError", "Acesso negado. Este e-mail nao e de tecnico."); return; }
    currentUser = user;
    saveSession();
    enterApp();
  } catch (e) {
    showError("tAuthError", e.message || "Erro ao fazer login.");
  }
}

async function regTec() {
  const name = document.getElementById("trn").value.trim();
  const email = document.getElementById("tre").value.trim();
  const pass = document.getElementById("trp").value;
  const pass2 = document.getElementById("trp2").value;
  if (!name || !email || !pass) { showError("tAuthError", "Preencha todos os campos."); return; }
  if (pass.length < 6) { showError("tAuthError", "Senha: minimo 6 caracteres."); return; }
  if (pass !== pass2) { showError("tAuthError", "As senhas nao conferem."); return; }
  try {
    const dept = document.getElementById("trd").value;
    const cargo = document.getElementById("trc").value || "Analista de Suporte";
    const user = await client.mutation(api.auth.register, { name, email, password: pass, type: "tec", dept, cargo });
    currentUser = user;
    saveSession();
    toast("Conta tecnica criada!", "success");
    enterApp();
  } catch (e) {
    showError("tAuthError", e.message || "Erro ao criar conta.");
  }
}

// ══════════════════════════════════════════════
// APP — Enter, Navbar, Subscribe
// ══════════════════════════════════════════════
function enterApp() {
  showScreen("appShell");
  subscribeTickets();
  buildNavbar();
  goPage(currentUser.type === "cli" ? "cdash" : "tdash");
}

function subscribeTickets() {
  if (ticketSubscription) ticketSubscription();
  ticketSubscription = client.onUpdate(api.tickets.list, {}, (result) => {
    tickets = result || [];
    render(); // re-render current page with fresh data
  });
}

function goLanding() {
  currentUser = null;
  saveSession();
  if (ticketSubscription) { ticketSubscription(); ticketSubscription = null; }
  showScreen("landing");
  renderLanding();
}

function buildNavbar() {
  const isCli = currentUser.type === "cli";
  const ini = initials(currentUser.name);
  const openN = tickets.filter((t) => t.status === "Aberto").length;

  document.getElementById("navbar").innerHTML = `
    <div class="navbar-brand">
      <div class="navbar-brand-icon">${icon("i-headphones", 16)}</div>
      <span class="navbar-brand-text">ChamaKi</span>
      <span class="navbar-mode ${isCli ? "colab" : "tech"}">${isCli ? "Colaborador" : "Tecnico"}</span>
    </div>
    <button class="navbar-toggle" id="navToggle">${icon("i-menu", 22)}</button>
    <div class="navbar-links" id="navLinks">
      ${isCli ? `
        <button class="nav-link" data-p="cdash">${icon("i-home", 16)}<span>Inicio</span></button>
        <button class="nav-link" data-p="ctickets">${icon("i-ticket", 16)}<span>Meus chamados</span></button>
        <button class="nav-link" data-p="cnew">${icon("i-plus", 16)}<span>Novo chamado</span></button>
        <button class="nav-link" data-p="ckb">${icon("i-book", 16)}<span>Base de conhecimento</span></button>
        <button class="nav-link" data-p="cpro">${icon("i-user", 16)}<span>Meu perfil</span></button>
      ` : `
        <button class="nav-link" data-p="tdash">${icon("i-home", 16)}<span>Dashboard</span></button>
        <button class="nav-link" data-p="tall">${icon("i-list", 16)}<span>Chamados</span></button>
        <button class="nav-link" data-p="tmanage">${icon("i-wrench", 16)}<span>Gestao</span>${openN ? `<span class="nav-badge">${openN}</span>` : ""}</button>
        <button class="nav-link" data-p="tkb">${icon("i-book", 16)}<span>Base de conhecimento</span></button>
        <button class="nav-link" data-p="tpro">${icon("i-user", 16)}<span>Meu perfil</span></button>
      `}
    </div>
    <div class="navbar-user">
      <div class="navbar-avatar ${isCli ? "colab" : "tech"}">${ini}</div>
      <div>
        <div class="navbar-uname">${currentUser.name.split(" ").slice(0, 2).join(" ")}</div>
        <div class="navbar-urole">${isCli ? "Colaborador" : (currentUser.cargo || "Analista TI")}</div>
      </div>
      <button class="navbar-logout" id="navLogout">${icon("i-logout", 14)} Sair</button>
    </div>`;

  // Event listeners
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.onclick = () => {
      const p = btn.dataset.p;
      if (p === "cnew") { openModal(); return; }
      goPage(p);
      // Close mobile menu
      document.getElementById("navLinks").classList.remove("open");
    };
  });
  document.getElementById("navLogout").onclick = goLanding;
  document.getElementById("navToggle").onclick = () => {
    document.getElementById("navLinks").classList.toggle("open");
  };
}

function goPage(p) {
  currentPage = p;
  document.querySelectorAll(".nav-link").forEach((b) => b.classList.toggle("active", b.dataset.p === p));
  render();
}

function render() {
  const mc = document.getElementById("mc");
  if (!mc) return;
  const pages = {
    cdash: rCDash, ctickets: rCTickets, ckb: rKB, cpro: rPro, cdet: rCDet,
    tdash: rTDash, tall: rTAll, tmanage: rTManage, tkb: rKB, tpro: rPro, tdet: rTDet,
  };
  mc.innerHTML = (pages[currentPage] || rCDash)();
  buildNavbar();
  bindPageEvents();
}

// ══════════════════════════════════════════════
// CLIENT PAGES
// ══════════════════════════════════════════════
function rCDash() {
  const my = tickets.filter((t) => t.authorEmail === currentUser.email);
  const op = my.filter((t) => t.status === "Aberto").length;
  const pr = my.filter((t) => t.status === "Em Atendimento").length;
  const dn = my.filter((t) => t.status === "Resolvido").length;

  return `
    <div class="page-header">
      <div><div class="page-title">Meus chamados</div><div class="page-desc">Acompanhe suas solicitacoes de suporte</div></div>
      <button class="btn btn-sm btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue">${icon("i-ticket")}</div><div><div class="stat-value">${my.length}</div><div class="stat-label">Total</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${op}</div><div class="stat-label">Aguardando</div></div></div>
      <div class="stat-card"><div class="stat-icon blue">${icon("i-wrench")}</div><div><div class="stat-value">${pr}</div><div class="stat-label">Em atendimento</div></div></div>
      <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${dn}</div><div class="stat-label">Resolvidos</div></div></div>
    </div>
    ${my.length ? `
    <div class="data-card"><div class="data-card-header"><h2>Chamados recentes</h2></div>
    <table><thead><tr><th>ID</th><th>Titulo</th><th>Status</th><th>SLA</th></tr></thead>
    <tbody>${my.map((t) => `<tr data-view="${t.ticketId}"><td><span class="ticket-id">${t.ticketId}</span></td><td>${t.title}</td><td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td><td class="sla-text">${sla(t._creationTime)}</td></tr>`).join("")}</tbody></table></div>
    ` : `<div class="empty-state"><div class="empty-state-icon">${icon("i-ticket", 48)}</div><h3>Nenhum chamado registrado</h3><p>Clique em "Novo chamado" para solicitar suporte tecnico.</p></div>`}`;
}

function rCTickets() {
  const my = tickets.filter((t) => t.authorEmail === currentUser.email);
  return `
    <div class="page-header">
      <div><div class="page-title">Meus chamados</div><div class="page-desc">${my.length} chamado(s)</div></div>
      <button class="btn btn-sm btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo</button>
    </div>
    <div class="data-card"><div class="data-card-header"><h2>Historico completo</h2></div>
    <table><thead><tr><th>ID</th><th>Titulo</th><th>Categoria</th><th>Prioridade</th><th>Responsavel</th><th>Status</th><th>SLA</th></tr></thead>
    <tbody>${my.map((t) => `<tr data-view="${t.ticketId}"><td><span class="ticket-id">${t.ticketId}</span></td><td>${t.title}</td><td><span class="cat-tag">${t.category}</span></td><td>${prioH(t.priority)}</td><td style="font-size:12px;color:var(--text2)">${t.assigneeName || "Aguardando"}</td><td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td><td class="sla-text">${sla(t._creationTime)}</td></tr>`).join("")}</tbody></table></div>`;
}

function rCDet() {
  if (!selectedTicket) return "";
  const t = tickets.find((x) => x.ticketId === selectedTicket);
  if (!t) return `<p>Chamado nao encontrado.</p>`;
  return detailHTML(t, "ctickets", false);
}

// ══════════════════════════════════════════════
// TECH PAGES
// ══════════════════════════════════════════════
function rTDash() {
  const op = tickets.filter((t) => t.status === "Aberto").length;
  const pr = tickets.filter((t) => t.status === "Em Atendimento").length;
  const dn = tickets.filter((t) => t.status === "Resolvido").length;
  const tot = tickets.length;
  const crit = tickets.filter((t) => t.priority === "crit" && t.status !== "Resolvido").length;
  const cats = {}; tickets.forEach((t) => { cats[t.category] = (cats[t.category] || 0) + 1; });
  const mx = Math.max(...Object.values(cats), 1);

  return `
    <div class="page-header"><div><div class="page-title">Dashboard</div><div class="page-desc">Visao geral do service desk</div></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon blue">${icon("i-ticket")}</div><div><div class="stat-value">${tot}</div><div class="stat-label">Total</div></div></div>
      <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${op}</div><div class="stat-label">Abertos</div></div></div>
      <div class="stat-card"><div class="stat-icon blue">${icon("i-wrench")}</div><div><div class="stat-value">${pr}</div><div class="stat-label">Em atendimento</div></div></div>
      <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${dn}</div><div class="stat-label">Resolvidos</div></div></div>
      <div class="stat-card"><div class="stat-icon purple">${icon("i-alert")}</div><div><div class="stat-value">${crit}</div><div class="stat-label">Criticos ativos</div></div></div>
    </div>
    <div class="charts-row">
      <div class="chart-card"><div class="chart-title">Chamados por categoria</div>
        ${Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, v]) => `<div class="bar-row"><div class="bar-label">${c}</div><div class="bar-track"><div class="bar-fill" style="width:${(v / mx) * 100}%;background:var(--accent)">${v}</div></div></div>`).join("")}
      </div>
      <div class="chart-card"><div class="chart-title">Distribuicao por status</div>
        <div class="bar-row"><div class="bar-label">Aberto</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (op / tot) * 100 : 0}%;background:var(--warning)">${op}</div></div></div>
        <div class="bar-row"><div class="bar-label">Em atendimento</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (pr / tot) * 100 : 0}%;background:var(--accent)">${pr}</div></div></div>
        <div class="bar-row"><div class="bar-label">Resolvido</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (dn / tot) * 100 : 0}%;background:var(--success)">${dn}</div></div></div>
      </div>
    </div>
    <div class="data-card"><div class="data-card-header"><h2>Chamados aguardando atendimento</h2></div>
    <table><thead><tr><th>ID</th><th>Titulo</th><th>Solicitante</th><th>Prioridade</th><th>SLA</th><th></th></tr></thead>
    <tbody>${tickets.filter((t) => t.status === "Aberto").map((t) => `<tr><td><span class="ticket-id">${t.ticketId}</span></td><td>${t.title}</td><td style="font-size:12px">${t.authorName}</td><td>${prioH(t.priority)}</td><td class="sla-text">${sla(t._creationTime)}</td><td><button class="btn btn-sm btn-accent" data-assume="${t.ticketId}">Assumir</button></td></tr>`).join("")}</tbody></table></div>`;
}

function rTAll() {
  return `
    <div class="page-header"><div><div class="page-title">Todos os chamados</div><div class="page-desc">${tickets.length} registros</div></div></div>
    <div class="data-card"><div class="data-card-header"><h2>Lista completa</h2>
      <div class="filter-bar"><input id="fs" placeholder="Buscar..." data-filter="search"><select id="fst" data-filter="status"><option value="">Status</option><option>Aberto</option><option>Em Atendimento</option><option>Resolvido</option></select><select id="fpr" data-filter="priority"><option value="">Prioridade</option><option value="crit">Critica</option><option value="high">Alta</option><option value="med">Media</option><option value="low">Baixa</option></select></div>
    </div>
    <table><thead><tr><th>ID</th><th>Titulo</th><th>Solicitante</th><th>Categoria</th><th>Prioridade</th><th>Tecnico</th><th>Status</th><th>SLA</th></tr></thead>
    <tbody id="tBody">${tRows(tickets)}</tbody></table></div>`;
}

function tRows(list) {
  return list.map((t) => `<tr data-view="${t.ticketId}"><td><span class="ticket-id">${t.ticketId}</span></td><td>${t.title}</td><td style="font-size:12px">${t.authorName}</td><td><span class="cat-tag">${t.category}</span></td><td>${prioH(t.priority)}</td><td style="font-size:12px">${t.assigneeName || "—"}</td><td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td><td class="sla-text">${sla(t._creationTime)}</td></tr>`).join("");
}

function rTManage() {
  const active = tickets.filter((t) => t.status !== "Resolvido");
  return `
    <div class="page-header"><div><div class="page-title">Gestao de chamados</div><div class="page-desc">Gerencie atendimentos e resolucoes</div></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${tickets.filter((t) => t.status === "Aberto").length}</div><div class="stat-label">Aguardando</div></div></div>
      <div class="stat-card"><div class="stat-icon blue">${icon("i-wrench")}</div><div><div class="stat-value">${tickets.filter((t) => t.status === "Em Atendimento").length}</div><div class="stat-label">Em andamento</div></div></div>
      <div class="stat-card"><div class="stat-icon purple">${icon("i-alert")}</div><div><div class="stat-value">${tickets.filter((t) => t.priority === "crit" && t.status !== "Resolvido").length}</div><div class="stat-label">Criticos</div></div></div>
    </div>
    <div class="data-card"><div class="data-card-header"><h2>Chamados ativos (${active.length})</h2></div>
    <table><thead><tr><th>ID</th><th>Titulo</th><th>Solicitante</th><th>Prioridade</th><th>Status</th><th>Tecnico</th><th>SLA</th><th>Acoes</th></tr></thead>
    <tbody>${active.map((t) => `<tr><td><span class="ticket-id">${t.ticketId}</span></td><td>${t.title}</td><td style="font-size:12px">${t.authorName}</td><td>${prioH(t.priority)}</td><td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td><td style="font-size:12px">${t.assigneeName || "—"}</td><td class="sla-text">${sla(t._creationTime)}</td><td>${t.status === "Aberto" ? `<button class="btn btn-sm btn-accent" data-assume="${t.ticketId}">Assumir</button>` : `<button class="btn btn-sm btn-success" data-resolve="${t.ticketId}">Resolver</button> <button class="btn btn-sm btn-outline" data-view="${t.ticketId}">Detalhes</button>`}</td></tr>`).join("")}</tbody></table></div>`;
}

function rTDet() {
  if (!selectedTicket) return "";
  const t = tickets.find((x) => x.ticketId === selectedTicket);
  if (!t) return `<p>Chamado nao encontrado.</p>`;
  return detailHTML(t, "tmanage", true);
}

// ══════════════════════════════════════════════
// SHARED PAGES
// ══════════════════════════════════════════════
function detailHTML(t, back, isTec) {
  const iconMap = { file: "i-file", wrench: "i-wrench", msg: "i-msg", check: "i-check", alert: "i-alert" };
  const colorMap = { file: "default", wrench: "action", msg: "default", check: "resolved", alert: "alert" };

  return `
    <div class="detail-view">
      <button class="btn btn-sm btn-outline" data-gopage="${back}">${icon("i-chevron-left", 14)} Voltar</button>
      <div class="detail-header">
        <span class="ticket-id" style="font-size:15px">${t.ticketId}</span>
        <h2>${t.title}</h2>
        <span class="status-badge ${statusClass(t.status)}">${t.status}</span>
      </div>
      <div class="detail-meta-grid">
        <div class="detail-meta-item"><div class="detail-meta-label">Solicitante</div><div class="detail-meta-value">${t.authorName}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Categoria</div><div class="detail-meta-value">${t.category}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Prioridade</div><div class="detail-meta-value">${prioH(t.priority)}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Tecnico responsavel</div><div class="detail-meta-value">${t.assigneeName || "Nao atribuido"}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Criado em</div><div class="detail-meta-value">${new Date(t._creationTime).toLocaleDateString("pt-BR")}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Tempo aberto</div><div class="detail-meta-value sla-text">${sla(t._creationTime)}</div></div>
      </div>
      <div class="data-card" style="padding:20px">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:16px">Historico do chamado</h3>
        <div class="timeline-container">
          ${t.timeline.map((e) => `
            <div class="timeline-entry">
              <div class="timeline-dot ${colorMap[e.type] || "default"}">${icon(iconMap[e.type] || "i-msg", 14)}</div>
              <div class="timeline-body">
                <div class="timeline-time">${e.time}</div>
                <div class="timeline-message">${e.message}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>
      ${isTec && t.status !== "Resolvido" ? `
      <div class="reply-section">
        <h3>Adicionar resposta</h3>
        <div class="form-group"><textarea id="replyMsg" rows="3" placeholder="Escreva uma atualizacao..."></textarea></div>
        <div class="reply-actions">
          ${t.status === "Aberto" ? `<button class="btn btn-sm btn-accent" data-assume="${t.ticketId}">Assumir</button>` : ""}
          <button class="btn btn-sm btn-outline" data-reply="${t.ticketId}">Enviar resposta</button>
          <button class="btn btn-sm btn-success" data-resolve="${t.ticketId}">Resolver</button>
        </div>
      </div>` : ""}
    </div>`;
}

const kbList = [
  { t: "Como redefinir sua senha", d: "Acesse o portal de autoatendimento, clique em \"Esqueci minha senha\" e siga as instrucoes enviadas ao seu e-mail." },
  { t: "Configurar VPN no notebook", d: "Baixe o cliente VPN, importe o perfil .ovpn fornecido pela equipe de TI e conecte com suas credenciais de rede." },
  { t: "Instalar impressora de rede", d: "Acesse Configuracoes > Dispositivos > Impressoras > Adicionar impressora. Informe o IP fornecido pela TI." },
  { t: "Configurar e-mail no celular", d: "Utilize o app Microsoft Outlook. Adicione sua conta corporativa — o Exchange sera configurado automaticamente." },
  { t: "Solicitar novo software", d: "Abra um chamado na categoria \"Software\" informando o nome do programa, versao e justificativa de uso." },
  { t: "Politica de senhas corporativas", d: "Minimo 8 caracteres com letras maiusculas, minusculas, numeros e simbolos. Troca obrigatoria a cada 90 dias." },
];

function rKB() {
  return `
    <div class="page-header"><div><div class="page-title">Base de conhecimento</div><div class="page-desc">Consulte os artigos antes de abrir um chamado</div></div></div>
    <div class="kb-grid">${kbList.map((a) => `<div class="kb-article"><h3>${a.t}</h3><p>${a.d}</p></div>`).join("")}</div>`;
}

function rPro() {
  const ini = initials(currentUser.name);
  const isTec = currentUser.type === "tec";
  const my = tickets.filter((t) => isTec ? t.assigneeName === currentUser.name : t.authorEmail === currentUser.email);

  return `
    <div class="page-header"><div><div class="page-title">Meu perfil</div><div class="page-desc">Gerencie suas informacoes pessoais</div></div></div>
    <div class="profile-layout">
      <div class="profile-card">
        <div class="profile-avatar ${isTec ? "tech" : "colab"}">${ini}</div>
        <div class="profile-name">${currentUser.name}</div>
        <div class="profile-role">${isTec ? (currentUser.cargo || "Analista TI") : "Colaborador"}</div>
        <div class="form-group"><label>Nome</label><input value="${currentUser.name}" id="pn"></div>
        <div class="form-group"><label>E-mail</label><input value="${currentUser.email}" id="pe" readonly style="opacity:.6"></div>
        ${isTec ? `<div class="form-group"><label>Departamento</label><input value="${currentUser.dept || ""}" id="pd"></div><div class="form-group"><label>Cargo</label><input value="${currentUser.cargo || ""}" id="pc"></div>` : ""}
        <button class="btn btn-sm btn-accent" data-action="savePro" style="width:100%;justify-content:center;margin-top:10px">Salvar alteracoes</button>
      </div>
      <div>
        <div class="profile-card" style="margin-bottom:14px">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:14px">Estatisticas</h3>
          <div class="stats-grid" style="margin-bottom:0">
            <div class="stat-card"><div class="stat-icon blue">${icon("i-ticket")}</div><div><div class="stat-value">${my.length}</div><div class="stat-label">${isTec ? "Atendimentos" : "Chamados"}</div></div></div>
            <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${my.filter((t) => t.status === "Resolvido").length}</div><div class="stat-label">Resolvidos</div></div></div>
          </div>
        </div>
        <div class="profile-card">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:14px">Informacoes da conta</h3>
          <div class="detail-meta-item" style="margin-bottom:8px"><div class="detail-meta-label">Tipo de acesso</div><div class="detail-meta-value">${isTec ? "Tecnico (acesso completo)" : "Colaborador (padrao)"}</div></div>
          <div class="detail-meta-item"><div class="detail-meta-label">Status</div><div class="detail-meta-value" style="color:var(--success)">Ativa</div></div>
        </div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
// EVENT BINDING (called after each render)
// ══════════════════════════════════════════════
function bindPageEvents() {
  // View ticket detail
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      selectedTicket = el.dataset.view;
      currentPage = currentUser.type === "cli" ? "cdet" : "tdet";
      render();
    };
  });

  // Assume ticket
  document.querySelectorAll("[data-assume]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      try {
        await client.mutation(api.tickets.assume, { ticketId: el.dataset.assume, techName: currentUser.name });
        toast(`${el.dataset.assume} assumido!`, "success");
      } catch (err) { toast(err.message, "error"); }
    };
  });

  // Resolve ticket
  document.querySelectorAll("[data-resolve]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      try {
        await client.mutation(api.tickets.resolve, { ticketId: el.dataset.resolve });
        toast(`${el.dataset.resolve} resolvido!`, "success");
      } catch (err) { toast(err.message, "error"); }
    };
  });

  // Reply
  document.querySelectorAll("[data-reply]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      const msg = document.getElementById("replyMsg")?.value?.trim();
      if (!msg) { toast("Escreva uma mensagem.", "error"); return; }
      try {
        await client.mutation(api.tickets.addReply, { ticketId: el.dataset.reply, authorName: currentUser.name, message: msg });
        toast("Resposta enviada!", "success");
      } catch (err) { toast(err.message, "error"); }
    };
  });

  // Go page
  document.querySelectorAll("[data-gopage]").forEach((el) => {
    el.onclick = () => goPage(el.dataset.gopage);
  });

  // Open modal
  document.querySelectorAll("[data-action='openModal']").forEach((el) => {
    el.onclick = openModal;
  });

  // Save profile
  document.querySelectorAll("[data-action='savePro']").forEach((el) => {
    el.onclick = savePro;
  });

  // Filters
  const fsEl = document.getElementById("fs");
  const fstEl = document.getElementById("fst");
  const fprEl = document.getElementById("fpr");
  if (fsEl) fsEl.oninput = applyFilters;
  if (fstEl) fstEl.onchange = applyFilters;
  if (fprEl) fprEl.onchange = applyFilters;
}

function applyFilters() {
  const s = (document.getElementById("fs")?.value || "").toLowerCase();
  const st = document.getElementById("fst")?.value || "";
  const pr = document.getElementById("fpr")?.value || "";
  let f = tickets;
  if (s) f = f.filter((t) => t.title.toLowerCase().includes(s) || t.ticketId.toLowerCase().includes(s));
  if (st) f = f.filter((t) => t.status === st);
  if (pr) f = f.filter((t) => t.priority === pr);
  const tb = document.getElementById("tBody");
  if (tb) tb.innerHTML = tRows(f);
  // re-bind view events on new rows
  document.querySelectorAll("#tBody [data-view]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      selectedTicket = el.dataset.view;
      currentPage = "tdet";
      render();
    };
  });
}

// ══════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════
function openModal() { document.getElementById("nModal").classList.add("active"); }
function closeModal() { document.getElementById("nModal").classList.remove("active"); }

async function createTicket() {
  const title = document.getElementById("nT").value.trim();
  if (!title) { toast("Informe o titulo do chamado.", "error"); return; }
  const desc = document.getElementById("nD").value.trim();
  try {
    const ticketId = await client.mutation(api.tickets.create, {
      title,
      category: document.getElementById("nC").value,
      priority: document.getElementById("nPr").value,
      description: desc || undefined,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
    });
    closeModal();
    document.getElementById("nT").value = "";
    document.getElementById("nD").value = "";
    toast(`Chamado ${ticketId} criado!`, "success");
    goPage(currentUser.type === "cli" ? "ctickets" : "tall");
  } catch (err) {
    toast(err.message || "Erro ao criar chamado.", "error");
  }
}

async function savePro() {
  const name = document.getElementById("pn")?.value?.trim();
  if (!name) { toast("Nome e obrigatorio.", "error"); return; }
  try {
    const updates = { email: currentUser.email, name };
    if (currentUser.type === "tec") {
      updates.dept = document.getElementById("pd")?.value || undefined;
      updates.cargo = document.getElementById("pc")?.value || undefined;
    }
    await client.mutation(api.auth.updateProfile, updates);
    currentUser.name = name;
    if (updates.dept) currentUser.dept = updates.dept;
    if (updates.cargo) currentUser.cargo = updates.cargo;
    saveSession();
    toast("Perfil atualizado!", "success");
    render();
  } catch (err) { toast(err.message, "error"); }
}

// ══════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════
function prioH(p) {
  const labels = { crit: "Critica", high: "Alta", med: "Media", low: "Baixa" };
  const dots = { crit: "critical", high: "high", med: "medium", low: "low" };
  return `<span class="priority-indicator"><span class="priority-dot ${dots[p] || "medium"}"></span>${labels[p] || p}</span>`;
}
function statusClass(s) {
  return s === "Aberto" ? "status-open" : s === "Em Atendimento" ? "status-progress" : "status-resolved";
}
function sla(creationTime) {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(creationTime).getTime()) / 864e5));
  return diff === 0 ? "Hoje" : diff + " dia" + (diff > 1 ? "s" : "");
}
function initials(n) {
  return n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// Expose to global for modal buttons (onclick in HTML)
window.app = { closeModal, createTicket };

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
function init() {
  renderLanding();

  // Check for saved session
  const saved = loadSession();
  if (saved) {
    currentUser = saved;
    enterApp();
  } else {
    showScreen("landing");
  }
}

init();
