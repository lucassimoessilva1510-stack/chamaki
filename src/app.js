/* ═══════════════════════════════════════════
   ChamaKi — Black & Flame Orange Theme
   Full Real-Time Help Desk with Image Attachments
   and Ticket Deletion Support
   ═══════════════════════════════════════════ */

import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import logoDark from "./logo_dark.png";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://laudable-mink-785.convex.cloud";
let convex = null;
try {
  if (CONVEX_URL) {
    convex = new ConvexClient(CONVEX_URL);
  }
} catch (e) {
  console.warn("ConvexClient initialization warning:", e);
}

// ── State ──
let currentUser = null;
let tickets = [];
let currentPage = "";
let selectedTicketId = null;
let convexUnsub = null;

let currentUploadedPhoto = null;
let currentReplyPhoto = null;



// ── Icons ──
function icon(id, w) {
  return `<svg width="${w || 18}" height="${w || 18}"><use href="#${id}"/></svg>`;
}

// ── Toast ──
function toast(msg, type) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = "toast-notification " + (type || "info") + " show";
  setTimeout(() => t.classList.remove("show"), 3500);
}

// ── Show Screen ──
function showScreen(id) {
  ["landing", "authCli", "authTec", "appShell"].forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hide");
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove("hide");
}

// ── Lightbox ──
function openLightbox(src) {
  if (!src) return;
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  if (lb && img) {
    img.src = src;
    lb.classList.add("active");
  }
}
window.openLightbox = openLightbox;

// ── Session ──
function saveSession() {
  try {
    if (currentUser) localStorage.setItem("chamaki_user", JSON.stringify(currentUser));
    else localStorage.removeItem("chamaki_user");
  } catch { toast("O navegador bloqueou o armazenamento da sessao.", "error"); }
}
function loadSession() {
  try {
    const s = localStorage.getItem("chamaki_user");
    const user = s ? JSON.parse(s) : null;
    return user && typeof user.name === "string" && typeof user.email === "string" && ["cli", "tec"].includes(user.type) ? user : null;
  } catch { return null; }
}

// ── Real-Time Sync ──
function updateTickets(data) {
  if (!Array.isArray(data)) throw new Error("Resposta de chamados invalida.");
  const next = data.map(t => ({ ...t, createdTime: t.createdTime || t._creationTime }));
  if (JSON.stringify(next) === JSON.stringify(tickets)) return;
  if (currentUser) {
    for (const ticket of next) {
      const previous = tickets.find(item => item.ticketId === ticket.ticketId);
      const isTechnician = currentUser.type === "tec";
      if (!previous || (!isTechnician && ticket.authorEmail !== currentUser.email)) continue;
      const incomingType = isTechnician ? "cli" : "tec";
      if (ticketReplies(ticket).slice(ticketReplies(previous).length)
        .some(reply => (reply.authorType || "tec") === incomingType)) {
        toast(`Nova resposta no chamado ${ticket.ticketId}.`, "info");
      }
    }
  }
  tickets = next;
  if (currentUser && !document.getElementById("appShell").classList.contains("hide")) render();
}

async function syncTickets() {
  try {
    if (!convex) throw new Error("Conexao com o banco indisponivel. Verifique VITE_CONVEX_URL.");
    updateTickets(await convex.query(api.tickets.list, {}));
  } catch (err) {
    console.error("Falha ao sincronizar chamados:", err);
    toast("Nao foi possivel atualizar os chamados. Tente novamente.", "error");
  }
}

function startSync() {
  // Real-time subscription to Convex Cloud
  if (convex) {
    try {
      if (convexUnsub) convexUnsub();
      convexUnsub = convex.onUpdate(
        api.tickets.list,
        {},
        (data) => updateTickets(data),
        (err) => {
          console.warn("Convex live sync notice:", err);
          toast("Nao foi possivel sincronizar os chamados.", "error");
        }
      );
    } catch (e) {
      console.warn("Convex subscription failed:", e);
    }
  }

  // The Convex subscription supplies the initial snapshot and subsequent updates.
}

// ══════════════════════════════════════════════
// LANDING PAGE
// ══════════════════════════════════════════════
function renderLanding() {
  const el = document.getElementById("landing");
  if (!el) return;
  el.innerHTML = `
    <div class="landing-page animate-fade">
      <div class="landing-header">
        <div class="landing-logo">
          <img src="${logoDark}" alt="ChamaKi HelpDesk" class="landing-logo-img">
        </div>
        <div class="landing-subtitle">Sistema Enterprise de Help Desk e Gestão de Incidentes de TI</div>
      </div>
      <div class="portal-cards">
        <div class="portal-card" id="pcColab">
          <div class="portal-card-stripe"></div>
          <div class="portal-card-icon">${icon("i-user", 26)}</div>
          <h2>Portal do Colaborador</h2>
          <p>Precisa de suporte técnico? Abra seu chamado com anexo de foto/print do erro e acompanhe a resolução em tempo real.</p>
          <div class="portal-card-action">Abrir chamado &rarr;</div>
        </div>
        <div class="portal-card" id="pcTech">
          <div class="portal-card-stripe"></div>
          <div class="portal-card-icon">${icon("i-wrench", 26)}</div>
          <h2>Portal do Técnico</h2>
          <p>Área restrita aos analistas de TI. Gerencie filas, assuma atendimentos, solucione chamados e controle métricas de SLA.</p>
          <div class="portal-card-action">Acessar painel &rarr;</div>
        </div>
      </div>
      <div class="landing-footer">
        Universidade São Judas Tadeu &middot; Projeto e Engenharia de Software &middot; 2026/2<br>
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
  const el = document.getElementById("authCli");
  el.innerHTML = `
    <div class="auth-screen">
    <div class="auth-container animate-fade">
      <div class="auth-header" style="justify-content:center;margin-bottom:8px">
        <img src="${logoDark}" alt="ChamaKi" class="auth-logo-img">
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
        <button class="btn btn-primary" id="cLoginBtn">Entrar no sistema</button>
      </div>
      <div id="cRegForm" class="hide">
        <div class="form-group"><label>Nome completo</label><input id="rn" placeholder="Seu nome completo"></div>
        <div class="form-group"><label>E-mail pessoal</label><input type="email" id="re" placeholder="seuemail@gmail.com"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="rp" placeholder="Mínimo 6 caracteres"></div>
        <div class="form-group"><label>Confirmar senha</label><input type="password" id="rp2" placeholder="Repita a senha"></div>
        <button class="btn btn-primary" id="cRegBtn">Criar conta</button>
      </div>
      <button class="back-link" id="cBack">${icon("i-chevron-left", 14)} Voltar</button>
    </div>
    </div>`;

  const tabLogin = document.getElementById("cTabLogin");
  const tabReg = document.getElementById("cTabReg");
  tabLogin.onclick = () => { tabLogin.classList.add("active"); tabReg.classList.remove("active"); document.getElementById("cLoginForm").classList.remove("hide"); document.getElementById("cRegForm").classList.add("hide"); hideError("cAuthError"); };
  tabReg.onclick = () => { tabReg.classList.add("active"); tabLogin.classList.remove("active"); document.getElementById("cRegForm").classList.remove("hide"); document.getElementById("cLoginForm").classList.add("hide"); hideError("cAuthError"); };

  document.getElementById("cLoginBtn").onclick = handleLoginCli;
  document.getElementById("cRegBtn").onclick = handleRegCli;
  document.getElementById("cBack").onclick = () => { showScreen("landing"); renderLanding(); };
}

function renderAuthTec() {
  const el = document.getElementById("authTec");
  el.innerHTML = `
    <div class="auth-screen">
    <div class="auth-container animate-fade">
      <div class="auth-header" style="justify-content:center;margin-bottom:8px">
        <img src="${logoDark}" alt="ChamaKi" class="auth-logo-img">
      </div>
      <div class="auth-desc">Portal do Técnico</div>
      <div class="tab-bar">
        <button class="tab-btn active" id="tTabLogin">Entrar</button>
        <button class="tab-btn" id="tTabReg">Criar conta</button>
      </div>
      <div id="tAuthError" class="auth-error"></div>
      <div id="tLoginForm">
        <div class="auth-alert">${icon("i-shield", 16)} Acesso restrito aos analistas e técnicos de TI.</div>
        <div class="form-group"><label>E-mail corporativo</label><input type="email" id="tEmail" placeholder="nome@empresa.com"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="tPass" placeholder="Sua senha"></div>
        <button class="btn btn-primary" id="tLoginBtn">Acessar painel técnico</button>
      </div>
      <div id="tRegForm" class="hide">
        <div class="auth-alert">${icon("i-shield", 16)} Cadastro de novo membro da equipe técnica.</div>
        <div class="form-group"><label>Nome completo</label><input id="trn" placeholder="Seu nome completo"></div>
        <div class="form-group"><label>E-mail corporativo</label><input type="email" id="tre" placeholder="nome@empresa.com"></div>
        <div class="form-group"><label>Departamento</label>
          <select id="trd"><option>TI</option><option>Infraestrutura</option><option>Segurança da Informação</option><option>Suporte N1</option><option>Suporte N2</option><option>Desenvolvimento</option></select>
        </div>
        <div class="form-group"><label>Cargo</label><input id="trc" placeholder="Ex: Analista de Suporte"></div>
        <div class="form-group"><label>Senha</label><input type="password" id="trp" placeholder="Mínimo 6 caracteres"></div>
        <div class="form-group"><label>Confirmar senha</label><input type="password" id="trp2" placeholder="Repita a senha"></div>
        <button class="btn btn-primary" id="tRegBtn">Criar conta técnica</button>
      </div>
      <button class="back-link" id="tBack">${icon("i-chevron-left", 14)} Voltar</button>
    </div>
    </div>`;

  const tabLogin = document.getElementById("tTabLogin");
  const tabReg = document.getElementById("tTabReg");
  tabLogin.onclick = () => { tabLogin.classList.add("active"); tabReg.classList.remove("active"); document.getElementById("tLoginForm").classList.remove("hide"); document.getElementById("tRegForm").classList.add("hide"); hideError("tAuthError"); };
  tabReg.onclick = () => { tabReg.classList.add("active"); tabLogin.classList.remove("active"); document.getElementById("tRegForm").classList.remove("hide"); document.getElementById("tLoginForm").classList.add("hide"); hideError("tAuthError"); };

  document.getElementById("tLoginBtn").onclick = handleLoginTec;
  document.getElementById("tRegBtn").onclick = handleRegTec;
  document.getElementById("tBack").onclick = () => { showScreen("landing"); renderLanding(); };
}

function errorMessage(error) {
  // ConvexError.data contains the public message; .message includes a stack trace.
  if (typeof error?.data === "string" && error.data.trim()) return error.data;
  const message = error?.message;
  if (typeof message === "string" && message && !message.includes("[CONVEX")) return message;
  return "Nao foi possivel concluir a operacao. Tente novamente em instantes.";
}

function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = msg; el.style.display = "block"; }
}
function hideError(elId) {
  const el = document.getElementById(elId);
  if (el) el.style.display = "none";
}

// ── Auth Handlers ──
async function handleLoginCli() {
  const email = document.getElementById("cEmail").value.trim();
  const password = document.getElementById("cPass").value;
  if (!email || !password) { showError("cAuthError", "Preencha todos os campos."); return; }
  if (password.length < 6 && password !== "123") { showError("cAuthError", "Senha deve ter no mínimo 6 caracteres."); return; }

  try {
    let data = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        data = await convex.mutation(api.auth.login, { email, password });
      } catch (err) {
        console.warn("Convex login notice:", err);
          throw err;
      }
    }

    if (data.type !== "cli") throw new Error("Este e-mail é de técnico. Use o Portal do Técnico.");
    currentUser = data;
    saveSession();
    enterApp();
  } catch (err) {
    showError("cAuthError", errorMessage(err));
  }
}

async function handleRegCli() {
  const name = document.getElementById("rn").value.trim();
  const email = document.getElementById("re").value.trim();
  const password = document.getElementById("rp").value;
  const password2 = document.getElementById("rp2").value;
  if (!name || !email || !password) { showError("cAuthError", "Preencha todos os campos."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("cAuthError", "Informe um e-mail valido."); return; }
  if (password.length < 6) { showError("cAuthError", "Senha: mínimo 6 caracteres."); return; }
  if (password !== password2) { showError("cAuthError", "As senhas não conferem."); return; }

  try {
    let data = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        data = await convex.mutation(api.auth.register, { name, email, password, type: "cli" });
      } catch (err) {
        console.warn("Convex register notice:", err);
          throw err;
      }
    }

    currentUser = data;
    saveSession();
    toast("Conta criada com sucesso!", "success");
    enterApp();
  } catch (err) {
    showError("cAuthError", errorMessage(err));
  }
}

async function handleLoginTec() {
  const email = document.getElementById("tEmail").value.trim();
  const password = document.getElementById("tPass").value;
  if (!email || !password) { showError("tAuthError", "Preencha todos os campos."); return; }
  if (password.length < 6 && password !== "123") { showError("tAuthError", "Senha: mínimo 6 caracteres."); return; }

  try {
    let data = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        data = await convex.mutation(api.auth.login, { email, password });
      } catch (err) {
        console.warn("Convex login notice:", err);
          throw err;
      }
    }

    if (data.type !== "tec") throw new Error("Acesso negado. Este e-mail não pertence a um técnico.");
    currentUser = data;
    saveSession();
    enterApp();
  } catch (err) {
    showError("tAuthError", errorMessage(err));
  }
}

async function handleRegTec() {
  const name = document.getElementById("trn").value.trim();
  const email = document.getElementById("tre").value.trim();
  const password = document.getElementById("trp").value;
  const password2 = document.getElementById("trp2").value;
  if (!name || !email || !password) { showError("tAuthError", "Preencha todos os campos."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("tAuthError", "Informe um e-mail valido."); return; }
  if (password.length < 6) { showError("tAuthError", "Senha: mínimo 6 caracteres."); return; }
  if (password !== password2) { showError("tAuthError", "As senhas não conferem."); return; }

  const dept = document.getElementById("trd").value;
  const cargo = document.getElementById("trc").value || "Analista de Suporte";

  try {
    let data = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        data = await convex.mutation(api.auth.register, { name, email, password, type: "tec", dept, cargo });
      } catch (err) {
        console.warn("Convex register notice:", err);
          throw err;
      }
    }

    currentUser = data;
    saveSession();
    toast("Conta técnica criada com sucesso!", "success");
    enterApp();
  } catch (err) {
    showError("tAuthError", errorMessage(err));
  }
}

// ══════════════════════════════════════════════
// TOP NAVBAR & APPLICATION SHELL
// ══════════════════════════════════════════════
function enterApp() {
  showScreen("appShell");
  startSync();
  buildNavbar();
  goPage(currentUser.type === "cli" ? "cdash" : "tdash");
}

function buildNavbar() {
  const isCli = currentUser.type === "cli";
  const ini = initials(currentUser.name);
  const openN = tickets.filter((t) => t.status === "Aberto").length;
  const avatarHtml = currentUser.avatar 
    ? `<img src="${currentUser.avatar}" alt="Avatar">`
    : ini;

  const nb = document.getElementById("navbar");
  nb.className = "navbar";
  nb.innerHTML = `
    <div class="navbar-brand">
      <img src="${logoDark}" alt="ChamaKi" class="navbar-logo-img" onclick="goPage('${isCli ? "cdash" : "tdash"}')" style="cursor:pointer">
      <span class="navbar-mode ${isCli ? "colab" : "tech"}">${isCli ? "Colaborador" : "Técnico"}</span>
      <span class="live-pill" title="Sincronização com outros computadores em tempo real"><span class="live-dot"></span> Ao vivo</span>
    </div>
    <button class="navbar-toggle" id="navToggle" title="Menu">${icon("i-menu", 22)}</button>
    <div class="navbar-links" id="navLinks">
      ${isCli ? `
        <button class="nav-link" data-p="cdash">${icon("i-home", 16)}<span>Início</span></button>
        <button class="nav-link" data-p="ctickets">${icon("i-ticket", 16)}<span>Meus chamados</span></button>
        <button class="nav-link" data-p="cnew">${icon("i-plus", 16)}<span>Novo chamado</span></button>
        <button class="nav-link" data-p="ckb">${icon("i-book", 16)}<span>Base de conhecimento</span></button>
        <button class="nav-link" data-p="cpro">${icon("i-user", 16)}<span>Meu perfil</span></button>
      ` : `
        <button class="nav-link" data-p="tdash">${icon("i-home", 16)}<span>Dashboard</span></button>
        <button class="nav-link" data-p="tall">${icon("i-list", 16)}<span>Todos os chamados</span></button>
        <button class="nav-link" data-p="tmanage">${icon("i-wrench", 16)}<span>Gestão</span>${openN ? `<span class="nav-badge">${openN}</span>` : ""}</button>
        <button class="nav-link" data-p="tkb">${icon("i-book", 16)}<span>Base de conhecimento</span></button>
        <button class="nav-link" data-p="tpro">${icon("i-user", 16)}<span>Meu perfil</span></button>
      `}
    </div>
    <div class="navbar-user">
      <div class="navbar-avatar" onclick="goPage('${isCli ? "cpro" : "tpro"}')" style="cursor:pointer" title="Ver perfil">${avatarHtml}</div>
      <div>
        <div class="navbar-uname">${currentUser.name.split(" ").slice(0, 2).join(" ")}</div>
        <div class="navbar-urole">${isCli ? "Colaborador" : (currentUser.cargo || "Analista TI")}</div>
      </div>
      <button class="navbar-logout" id="navLogout" title="Sair do sistema">${icon("i-logout", 14)} Sair</button>
    </div>`;

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.onclick = () => {
      const p = btn.dataset.p;
      if (p === "cnew") { openModal(); return; }
      goPage(p);
      document.getElementById("navLinks").classList.remove("open");
    };
  });
  document.getElementById("navLogout").onclick = logout;
  document.getElementById("navToggle").onclick = () => {
    document.getElementById("navLinks").classList.toggle("open");
  };
}

function logout() {
  currentUser = null;
  saveSession();
  if (convexUnsub) convexUnsub();
  convexUnsub = null;
  tickets = [];
  selectedTicketId = null;
  currentReplyPhoto = null;
  showScreen("landing");
  renderLanding();
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
  const replyForm = mc.querySelector("#replyForm");
  const replyInput = replyForm?.querySelector("textarea");
  const restoreFocus = replyInput && document.activeElement === replyInput;
  mc.innerHTML = (pages[currentPage] || rCDash)();
  const nextReplyForm = mc.querySelector("#replyForm");
  if (replyForm && nextReplyForm && replyForm.dataset.ticket === nextReplyForm.dataset.ticket) {
    nextReplyForm.replaceWith(replyForm);
    if (restoreFocus) replyInput.focus({ preventScroll: true });
  } else {
    currentReplyPhoto = null;
  }
  buildNavbar();
  bindPageEvents();
}

// ══════════════════════════════════════════════
// COLABORADOR PAGES
// ══════════════════════════════════════════════
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function ticketReplies(ticket) {
  return (ticket.timeline || []).filter(entry => entry.type === "msg");
}

function replyPreview(ticket) {
  const replies = ticketReplies(ticket);
  if (!replies.length) return '<div class="reply-preview muted">Nenhuma mensagem na conversa</div>';
  const last = replies[replies.length - 1];
  return `<div class="reply-preview"><strong>Última mensagem</strong><span>${escapeHTML(last.message)}</span></div>`;
}

function repliesHTML(ticket) {
  const replies = ticketReplies(ticket);
  return `<section class="data-card ticket-conversation" aria-labelledby="conversationTitle" aria-live="polite">
    <h3 id="conversationTitle">${icon("i-msg", 18)} Conversa do chamado</h3>
    ${replies.length ? replies.map(reply => `<article class="conversation-message ${reply.authorType === "cli" ? "from-collaborator" : ""}">
      <div class="timeline-time"><strong>${reply.authorType === "cli" ? "Colaborador" : "Equipe de TI"}</strong> · ${escapeHTML(reply.time)}</div>
      <p>${escapeHTML(reply.message)}</p>
      ${reply.photo && /^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i.test(reply.photo) ? `<button type="button" class="conversation-attachment" data-reply-photo="${escapeHTML(reply.photo)}"><img src="${escapeHTML(reply.photo)}" class="timeline-attached-img" alt="Ampliar imagem anexada"></button>` : ""}
    </article>`).join("") : '<p class="reply-empty">Ainda não há mensagens. Use a conversa para trocar informações sobre o chamado.</p>'}
  </section>`;
}

function rCDash() {
  const my = tickets.filter((t) => t.authorEmail === currentUser.email);
  const op = my.filter((t) => t.status === "Aberto").length;
  const pr = my.filter((t) => t.status === "Em Atendimento").length;
  const dn = my.filter((t) => t.status === "Resolvido").length;

  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Meus Chamados</div><div class="page-desc">Acompanhe suas solicitações com atualização em tempo real</div></div>
        <button class="btn btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon orange">${icon("i-ticket")}</div><div><div class="stat-value">${my.length}</div><div class="stat-label">Total registrados</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${op}</div><div class="stat-label">Aguardando atendimento</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${icon("i-wrench")}</div><div><div class="stat-value">${pr}</div><div class="stat-label">Em andamento</div></div></div>
        <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${dn}</div><div class="stat-label">Resolvidos</div></div></div>
      </div>
      ${my.length ? `
      <div class="data-card">
        <div class="data-card-header"><h2>Chamados recentes</h2></div>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Status</th><th>Tempo</th><th>Ações</th></tr></thead>
          <tbody>${my.map((t) => `
            <tr data-view="${t.ticketId}">
              <td><span class="ticket-id">${t.ticketId}</span></td>
              <td>
                ${t.photo ? `<img src="${t.photo}" class="table-photo-thumb" onclick="event.stopPropagation();openLightbox('${t.photo}')" title="Ver foto em tela cheia">` : ''}
                ${escapeHTML(t.title)}
                ${replyPreview(t)}
              </td>
              <td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td>
              <td class="sla-text">${calcSLA(t.createdTime)}</td>
              <td>
                <button class="btn btn-sm btn-outline" data-view="${t.ticketId}">${icon("i-msg", 13)} Ver conversa</button>
                <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}" title="Excluir chamado">${icon("i-trash", 13)} Excluir</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>` : `
      <div class="empty-state">
        <div class="empty-state-icon">${icon("i-ticket", 48)}</div>
        <h3>Nenhum chamado registrado</h3>
        <p>Clique em "Novo chamado" para solicitar assistência técnica com foto ou print.</p>
      </div>`}
    </div>`;
}

function rCTickets() {
  const my = tickets.filter((t) => t.authorEmail === currentUser.email);
  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Histórico de Chamados</div><div class="page-desc">${my.length} chamado(s) encontrado(s)</div></div>
        <button class="btn btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
      </div>
      <div class="data-card">
        <div class="data-card-header"><h2>Todos os meus chamados</h2></div>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Categoria</th><th>Prioridade</th><th>Responsável</th><th>Status</th><th>Tempo</th><th>Ações</th></tr></thead>
          <tbody>${my.map((t) => `
            <tr data-view="${t.ticketId}">
              <td><span class="ticket-id">${t.ticketId}</span></td>
              <td>
                ${t.photo ? `<img src="${t.photo}" class="table-photo-thumb" onclick="event.stopPropagation();openLightbox('${t.photo}')" title="Ver foto anexada">` : ''}
                ${escapeHTML(t.title)}
                ${replyPreview(t)}
              </td>
              <td><span class="cat-tag">${t.category}</span></td>
              <td>${prioH(t.priority)}</td>
              <td style="font-size:12px;color:var(--text2)">${t.assigneeName || "Aguardando"}</td>
              <td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td>
              <td class="sla-text">${calcSLA(t.createdTime)}</td>
              <td>
                <button class="btn btn-sm btn-outline" data-view="${t.ticketId}">${icon("i-msg", 13)} Ver conversa</button>
                <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}" title="Excluir">${icon("i-trash", 13)}</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function rCDet() {
  const t = tickets.find((x) => x.ticketId === selectedTicketId && x.authorEmail === currentUser.email);
  if (!t) return `<p>Chamado não encontrado.</p>`;
  return detailHTML(t, "ctickets", false);
}

// ══════════════════════════════════════════════
// TÉCNICO PAGES
// ══════════════════════════════════════════════
function rTDash() {
  const op = tickets.filter((t) => t.status === "Aberto").length;
  const pr = tickets.filter((t) => t.status === "Em Atendimento").length;
  const dn = tickets.filter((t) => t.status === "Resolvido").length;
  const tot = tickets.length;
  const crit = tickets.filter((t) => t.priority === "crit" && t.status !== "Resolvido").length;

  const cats = {};
  tickets.forEach((t) => { cats[t.category] = (cats[t.category] || 0) + 1; });
  const mx = Math.max(...Object.values(cats), 1);

  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Dashboard Operacional</div><div class="page-desc">Painel central de controle de chamados e métricas de SLA</div></div>
        <button class="btn btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon orange">${icon("i-ticket")}</div><div><div class="stat-value">${tot}</div><div class="stat-label">Total geral</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${op}</div><div class="stat-label">Abertos</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${icon("i-wrench")}</div><div><div class="stat-value">${pr}</div><div class="stat-label">Em andamento</div></div></div>
        <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${dn}</div><div class="stat-label">Resolvidos</div></div></div>
        <div class="stat-card"><div class="stat-icon purple">${icon("i-alert")}</div><div><div class="stat-value">${crit}</div><div class="stat-label">Críticos pendentes</div></div></div>
      </div>
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-title">Chamados por categoria</div>
          ${Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, v]) => `
            <div class="bar-row">
              <div class="bar-label">${c}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${(v / mx) * 100}%;background:var(--orange-gradient)">${v}</div></div>
            </div>
          `).join("")}
        </div>
        <div class="chart-card">
          <div class="chart-title">Distribuição por status</div>
          <div class="bar-row"><div class="bar-label">Aberto</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (op / tot) * 100 : 0}%;background:var(--warning)">${op}</div></div></div>
          <div class="bar-row"><div class="bar-label">Em atendimento</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (pr / tot) * 100 : 0}%;background:var(--orange)">${pr}</div></div></div>
          <div class="bar-row"><div class="bar-label">Resolvido</div><div class="bar-track"><div class="bar-fill" style="width:${tot ? (dn / tot) * 100 : 0}%;background:var(--success)">${dn}</div></div></div>
        </div>
      </div>
      <div class="data-card">
        <div class="data-card-header"><h2>Fila de espera (Aguardando atendimento)</h2></div>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Solicitante</th><th>Prioridade</th><th>Tempo</th><th>Ações</th></tr></thead>
          <tbody>${tickets.filter((t) => t.status === "Aberto").map((t) => `
            <tr data-view="${t.ticketId}">
              <td><span class="ticket-id">${t.ticketId}</span></td>
              <td>
                ${t.photo ? `<img src="${t.photo}" class="table-photo-thumb" onclick="event.stopPropagation();openLightbox('${t.photo}')" title="Ver foto">` : ''}
                ${t.title}
              </td>
              <td style="font-size:12px">${t.authorName}</td>
              <td>${prioH(t.priority)}</td>
              <td class="sla-text">${calcSLA(t.createdTime)}</td>
              <td>
                <button class="btn btn-sm btn-accent" data-assume="${t.ticketId}">Assumir</button>
                <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}" title="Excluir">${icon("i-trash", 13)}</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function rTAll() {
  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Todos os Chamados</div><div class="page-desc">${tickets.length} chamados registrados no banco compartilhado</div></div>
        <button class="btn btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
      </div>
      <div class="data-card">
        <div class="data-card-header">
          <h2>Lista completa</h2>
          <div class="filter-bar">
            <input id="fs" placeholder="Buscar por título ou ID..." data-filter="search">
            <select id="fst" data-filter="status"><option value="">Todos os status</option><option>Aberto</option><option>Em Atendimento</option><option>Resolvido</option></select>
            <select id="fpr" data-filter="priority"><option value="">Todas as prioridades</option><option value="crit">Crítica</option><option value="high">Alta</option><option value="med">Média</option><option value="low">Baixa</option></select>
          </div>
        </div>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Solicitante</th><th>Categoria</th><th>Prioridade</th><th>Técnico</th><th>Status</th><th>Tempo</th><th>Ações</th></tr></thead>
          <tbody id="tBody">${tRows(tickets)}</tbody>
        </table>
      </div>
    </div>`;
}

function tRows(list) {
  return list.map((t) => `
    <tr data-view="${t.ticketId}">
      <td><span class="ticket-id">${t.ticketId}</span></td>
      <td>
        ${t.photo ? `<img src="${t.photo}" class="table-photo-thumb" onclick="event.stopPropagation();openLightbox('${t.photo}')" title="Ver print">` : ''}
        ${t.title}
      </td>
      <td style="font-size:12px">${t.authorName}</td>
      <td><span class="cat-tag">${t.category}</span></td>
      <td>${prioH(t.priority)}</td>
      <td style="font-size:12px">${t.assigneeName || "—"}</td>
      <td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td>
      <td class="sla-text">${calcSLA(t.createdTime)}</td>
      <td>
        <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}" title="Excluir">${icon("i-trash", 13)}</button>
      </td>
    </tr>
  `).join("");
}

function rTManage() {
  const active = tickets.filter((t) => t.status !== "Resolvido");
  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Gestão de Chamados</div><div class="page-desc">Painel operacional para resolução, atribuição e exclusão</div></div>
        <button class="btn btn-accent" data-action="openModal">${icon("i-plus", 14)} Novo chamado</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-icon orange">${icon("i-clock")}</div><div><div class="stat-value">${tickets.filter((t) => t.status === "Aberto").length}</div><div class="stat-label">Aguardando</div></div></div>
        <div class="stat-card"><div class="stat-icon orange">${icon("i-wrench")}</div><div><div class="stat-value">${tickets.filter((t) => t.status === "Em Atendimento").length}</div><div class="stat-label">Em andamento</div></div></div>
        <div class="stat-card"><div class="stat-icon purple">${icon("i-alert")}</div><div><div class="stat-value">${tickets.filter((t) => t.priority === "crit" && t.status !== "Resolvido").length}</div><div class="stat-label">Críticos</div></div></div>
      </div>
      <div class="data-card">
        <div class="data-card-header"><h2>Chamados ativos (${active.length})</h2></div>
        <table>
          <thead><tr><th>ID</th><th>Título</th><th>Solicitante</th><th>Prioridade</th><th>Status</th><th>Técnico</th><th>Tempo</th><th>Ações</th></tr></thead>
          <tbody>${active.map((t) => `
            <tr data-view="${t.ticketId}">
              <td><span class="ticket-id">${t.ticketId}</span></td>
              <td>
                ${t.photo ? `<img src="${t.photo}" class="table-photo-thumb" onclick="event.stopPropagation();openLightbox('${t.photo}')" title="Ver anexo">` : ''}
                ${t.title}
              </td>
              <td style="font-size:12px">${t.authorName}</td>
              <td>${prioH(t.priority)}</td>
              <td><span class="status-badge ${statusClass(t.status)}">${t.status}</span></td>
              <td style="font-size:12px">${t.assigneeName || "—"}</td>
              <td class="sla-text">${calcSLA(t.createdTime)}</td>
              <td>
                ${t.status === "Aberto" ? `
                  <button class="btn btn-sm btn-accent" data-assume="${t.ticketId}">Assumir</button>
                ` : `
                  <button class="btn btn-sm btn-success" data-resolve="${t.ticketId}">Resolver</button>
                  <button class="btn btn-sm btn-outline" data-view="${t.ticketId}">Detalhes</button>
                `}
                <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}" title="Excluir">${icon("i-trash", 13)}</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function rTDet() {
  const t = tickets.find((x) => x.ticketId === selectedTicketId);
  if (!t) return `<p>Chamado não encontrado.</p>`;
  return detailHTML(t, "tmanage", true);
}

// ══════════════════════════════════════════════
// DETAIL / KB / PROFILE
// ══════════════════════════════════════════════
function detailHTML(t, back, isTec) {
  const iconMap = { file: "i-file", wrench: "i-wrench", msg: "i-msg", check: "i-check", alert: "i-alert" };
  const colorMap = { file: "default", wrench: "action", msg: "default", check: "resolved", alert: "alert" };

  return `
    <div class="detail-view animate-fade">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <button class="btn btn-sm btn-outline" data-gopage="${back}">${icon("i-chevron-left", 14)} Voltar</button>
        <button class="btn btn-sm btn-delete" data-delete="${t.ticketId}">${icon("i-trash", 14)} Excluir este chamado</button>
      </div>

      <div class="detail-header">
        <span class="ticket-id" style="font-size:17px">${t.ticketId}</span>
        <h2>${t.title}</h2>
        <span class="status-badge ${statusClass(t.status)}">${t.status}</span>
      </div>

      <div class="detail-meta-grid">
        <div class="detail-meta-item"><div class="detail-meta-label">Solicitante</div><div class="detail-meta-value">${t.authorName}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Categoria</div><div class="detail-meta-value">${t.category}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Prioridade</div><div class="detail-meta-value">${prioH(t.priority)}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Técnico responsável</div><div class="detail-meta-value">${t.assigneeName || "Não atribuído"}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Aberto em</div><div class="detail-meta-value">${formatDate(t.createdTime)}</div></div>
        <div class="detail-meta-item"><div class="detail-meta-label">Tempo decorrido</div><div class="detail-meta-value sla-text">${calcSLA(t.createdTime)}</div></div>
      </div>

      ${t.photo ? `
      <div class="attached-photo-card">
        <h3>${icon("i-image", 16)} Foto / Captura de tela anexada</h3>
        <img src="${t.photo}" class="attached-photo-preview" onclick="openLightbox('${t.photo}')" title="Clique para ampliar">
        <p style="font-size:11px;color:var(--text3);margin-top:8px">Clique na imagem para expandir em tela cheia.</p>
      </div>` : ''}

      <div class="data-card" style="padding:22px">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:18px;color:#fff">Histórico e Andamento</h3>
        <div class="timeline-container">
          ${(t.timeline || []).filter(e => e.type !== "msg").map((e) => `
            <div class="timeline-entry">
              <div class="timeline-dot ${colorMap[e.type] || "default"}">${icon(iconMap[e.type] || "i-msg", 14)}</div>
              <div class="timeline-body">
                <div class="timeline-time">${e.time}</div>
                <div class="timeline-message">${escapeHTML(e.message)}</div>
                ${e.photo ? `<img src="${e.photo}" class="timeline-attached-img" onclick="openLightbox('${e.photo}')" title="Clique para ampliar">` : ''}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      ${repliesHTML(t)}
      ${t.status !== "Resolvido" ? `
      <form id="replyForm" class="reply-section" data-ticket="${t.ticketId}">
        <div class="form-group">
          <label for="replyMsg">Sua mensagem</label>
          <textarea id="replyMsg" rows="3" required maxlength="4000" placeholder="Escreva uma mensagem..."></textarea>
        </div>
        
        <div style="margin-bottom:12px">
          <label style="font-size:11px;color:var(--text2);cursor:pointer;display:inline-flex;align-items:center;gap:6px">
            ${icon("i-camera", 16)} <span id="replyPhotoLabel">Anexar print na resposta</span>
            <input type="file" id="replyPhotoFile" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none" onchange="window.app.handleReplyPhoto(this)">
          </label>
          <div id="replyPreviewBox" class="hide" style="margin-top:6px;display:inline-flex;align-items:center;gap:8px">
            <img id="replyPreviewImg" style="width:40px;height:40px;border-radius:4px;object-fit:cover;border:1px solid var(--orange)">
            <button type="button" class="btn btn-sm btn-outline" onclick="window.app.clearReplyPhoto()" style="padding:3px 8px;font-size:11px">Remover foto</button>
          </div>
        </div>

        <div class="reply-actions">
          <button type="submit" class="btn btn-sm btn-accent">Enviar mensagem</button>
        </div>
      </form>` : '<p class="reply-empty">A conversa foi encerrada porque o chamado foi resolvido.</p>'}
      ${isTec && t.status !== "Resolvido" ? `
        <div class="reply-actions">
          ${t.status === "Aberto" ? `<button class="btn btn-sm btn-outline" data-assume="${t.ticketId}">Assumir chamado</button>` : ""}
          <button class="btn btn-sm btn-success" data-resolve="${t.ticketId}">Resolver chamado</button>
        </div>` : ""}
    </div>`;
}

const kbList = [
  { t: "Como redefinir sua senha de rede", d: "Acesse o portal de autoatendimento, clique em 'Esqueci minha senha' e siga as instruções enviadas para o seu e-mail cadastrado." },
  { t: "Configurar VPN corporativa no notebook", d: "Baixe o cliente OpenVPN, importe o perfil fornecido pela TI e conecte utilizando suas credenciais corporativas." },
  { t: "Instalação e mapeamento de impressoras", d: "Acesse Configurações > Dispositivos > Impressoras > Adicionar. Insira o endereço IP ou nome do servidor fornecido pela TI." },
  { t: "Configurar e-mail corporativo no smartphone", d: "Instale o app Microsoft Outlook, adicione sua conta corporativa com autenticação em duas etapas." },
  { t: "Solicitação de novos softwares ou licenças", d: "Abra um chamado na categoria 'Software' com a justificativa de negócio e aprovação do gestor imediato." },
  { t: "Política de segurança e senhas", d: "Senhas devem conter no mínimo 8 caracteres com letras maiúsculas, minúsculas, números e símbolos. Troca recomendada a cada 90 dias." }
];

function rKB() {
  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Base de Conhecimento</div><div class="page-desc">Consulte artigos de autoatendimento antes de registrar um chamado</div></div>
      </div>
      <div class="kb-grid">${kbList.map((a) => `<div class="kb-article"><h3>${a.t}</h3><p>${a.d}</p></div>`).join("")}</div>
    </div>`;
}

function rPro() {
  const ini = initials(currentUser.name);
  const isTec = currentUser.type === "tec";
  const my = tickets.filter((t) => isTec ? t.assigneeName === currentUser.name : t.authorEmail === currentUser.email);
  const avatarHtml = currentUser.avatar 
    ? `<img src="${currentUser.avatar}" alt="Avatar">`
    : ini;

  return `
    <div class="animate-fade">
      <div class="page-header">
        <div><div class="page-title">Meu Perfil</div><div class="page-desc">Gerencie seus dados e foto de perfil</div></div>
      </div>
      <div class="profile-layout">
        <div class="profile-card">
          <div class="profile-avatar-wrap" onclick="document.getElementById('proAvatarFile').click()" title="Clique para alterar foto de perfil">
            <div class="profile-avatar">${avatarHtml}</div>
            <div class="profile-avatar-badge">${icon("i-camera", 14)}</div>
          </div>
          <input type="file" id="proAvatarFile" accept="image/*" style="display:none" onchange="window.app.uploadProfilePhoto(this)">

          <div class="profile-name">${currentUser.name}</div>
          <div class="profile-role">${isTec ? (currentUser.cargo || "Analista TI") : "Colaborador"}</div>

          <div class="form-group"><label>Nome</label><input value="${currentUser.name}" id="pn"></div>
          <div class="form-group"><label>E-mail</label><input value="${currentUser.email}" id="pe" readonly style="opacity:.6"></div>
          ${isTec ? `
            <div class="form-group"><label>Departamento</label><input value="${currentUser.dept || ""}" id="pd"></div>
            <div class="form-group"><label>Cargo</label><input value="${currentUser.cargo || ""}" id="pc"></div>
          ` : ""}
          <button class="btn btn-accent" data-action="savePro" style="width:100%;justify-content:center;margin-top:14px">Salvar alterações</button>
        </div>
        <div>
          <div class="profile-card" style="margin-bottom:16px">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:16px;color:#fff">Estatísticas</h3>
            <div class="stats-grid" style="margin-bottom:0">
              <div class="stat-card"><div class="stat-icon orange">${icon("i-ticket")}</div><div><div class="stat-value">${my.length}</div><div class="stat-label">${isTec ? "Atendimentos" : "Chamados"}</div></div></div>
              <div class="stat-card"><div class="stat-icon green">${icon("i-check")}</div><div><div class="stat-value">${my.filter((t) => t.status === "Resolvido").length}</div><div class="stat-label">Resolvidos</div></div></div>
            </div>
          </div>
          <div class="profile-card">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:16px;color:#fff">Dados da Conta</h3>
            <div class="detail-meta-item" style="margin-bottom:10px"><div class="detail-meta-label">Tipo de Acesso</div><div class="detail-meta-value">${isTec ? "Técnico de Suporte TI (Acesso total)" : "Colaborador (Autoatendimento)"}</div></div>
            <div class="detail-meta-item"><div class="detail-meta-label">Status da Conta</div><div class="detail-meta-value" style="color:var(--success)">Ativa &bull; Sincronização em tempo real</div></div>
          </div>
        </div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
// EVENT BINDINGS
// ══════════════════════════════════════════════
function bindPageEvents() {
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      selectedTicketId = el.dataset.view;
      currentPage = currentUser.type === "cli" ? "cdet" : "tdet";
      render();
    };
  });

  // Assume ticket
  document.querySelectorAll("[data-assume]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      const ticketId = el.dataset.assume;
      try {
                if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
        if (convex) {
          try {
            await convex.mutation(api.tickets.assume, { ticketId, techName: currentUser.name });
          } catch (err) {
            console.warn("Convex assume notice:", err);
          throw err;
          }
        }

        toast(`Chamado ${ticketId} assumido!`, "success");
        syncTickets();
      } catch (err) { toast(errorMessage(err), "error"); }
    };
  });

  // Resolve ticket
  document.querySelectorAll("[data-resolve]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      const ticketId = el.dataset.resolve;
      try {
                if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
        if (convex) {
          try {
            await convex.mutation(api.tickets.resolve, { ticketId });
          } catch (err) {
            console.warn("Convex resolve notice:", err);
          throw err;
          }
        }

        toast(`Chamado ${ticketId} resolvido com sucesso!`, "success");
        syncTickets();
      } catch (err) { toast(errorMessage(err), "error"); }
    };
  });

  // Reply
  document.querySelectorAll("[data-reply-photo]").forEach(button => {
    button.onclick = () => openLightbox(button.dataset.replyPhoto);
  });
  const replyForm = document.getElementById("replyForm");
  if (replyForm) {
    replyForm.onsubmit = async (event) => {
      event.preventDefault();
      const submit = replyForm.querySelector('[type="submit"]');
      const input = replyForm.querySelector("textarea");
      const message = input.value.trim();
      if (submit.disabled) return;
      if (!message) { toast("Escreva uma mensagem.", "error"); return; }
      submit.disabled = true;
      input.readOnly = true;
      const photoInput = replyForm.querySelector("#replyPhotoFile");
      photoInput.disabled = true;
      try {
        if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
        await convex.mutation(api.tickets.addReply, {
          ticketId: replyForm.dataset.ticket,
          authorName: currentUser.name,
          authorType: currentUser.type,
          message,
          photo: currentReplyPhoto || undefined,
        });
        if (replyForm.isConnected) {
          input.value = "";
          photoInput.disabled = false;
          clearReplyPhoto();
        }
        toast("Mensagem enviada!", "success");
      } catch (err) {
        toast(errorMessage(err), "error");
      } finally {
        submit.disabled = false;
        input.readOnly = false;
        photoInput.disabled = false;
      }
    };
  }

  // Delete ticket (Excluir chamado)
  document.querySelectorAll("[data-delete]").forEach((el) => {
    el.onclick = async (e) => {
      e.stopPropagation();
      const ticketId = el.dataset.delete;
      if (!confirm(`Tem certeza que deseja excluir permanentemente o chamado ${ticketId}?`)) return;

      try {
                if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
        if (convex) {
          try {
            await convex.mutation(api.tickets.remove, { ticketId });
          } catch (err) {
            console.warn("Convex delete notice:", err);
          throw err;
          }
        }

        toast(`Chamado ${ticketId} excluído com sucesso!`, "success");
        
        // If we were inside the detail page of that ticket, go back
        if (currentPage === "cdet" || currentPage === "tdet") {
          goPage(currentUser.type === "cli" ? "ctickets" : "tmanage");
        }
        syncTickets();
      } catch (err) { toast(errorMessage(err), "error"); }
    };
  });

  document.querySelectorAll("[data-gopage]").forEach((el) => {
    el.onclick = () => goPage(el.dataset.gopage);
  });

  document.querySelectorAll("[data-action='openModal']").forEach((el) => {
    el.onclick = openModal;
  });

  document.querySelectorAll("[data-action='savePro']").forEach((el) => {
    el.onclick = saveProfile;
  });

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
  if (tb) {
    tb.innerHTML = tRows(f);
    bindPageEvents();
  }
}

// ── Modals & Photo Uploads ──
function openModal() {
  document.getElementById("nModal").classList.add("active");
  removePhoto();
}
function closeModal() {
  document.getElementById("nModal").classList.remove("active");
  removePhoto();
}

function removePhoto() {
  currentUploadedPhoto = null;
  const input = document.getElementById("nPhotoFile");
  if (input) input.value = "";
  const prevBox = document.getElementById("previewContainer");
  if (prevBox) prevBox.classList.add("hide");
}

function handleReplyPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type) || file.size > 500_000) {
    clearReplyPhoto();
    toast("Selecione uma imagem PNG, JPEG, GIF ou WebP de até 500 KB.", "error");
    return;
  }
  const reader = new FileReader();
  const submit = input.form.querySelector('[type="submit"]');
  submit.disabled = true;
  reader.onload = (e) => {
    if (!input.isConnected || input.files[0] !== file) return;
    currentReplyPhoto = e.target.result;
    document.getElementById("replyPreviewImg").src = currentReplyPhoto;
    document.getElementById("replyPreviewBox").classList.remove("hide");
    document.getElementById("replyPhotoLabel").textContent = "Foto anexada!";
  };
  reader.onerror = () => {
    if (!input.isConnected || input.files[0] !== file) return;
    clearReplyPhoto();
    toast("Não foi possível ler a imagem.", "error");
  };
  reader.onloadend = () => {
    if (input.isConnected && input.files[0] === file) submit.disabled = false;
  };
  reader.readAsDataURL(file);
}

function clearReplyPhoto() {
  const input = document.getElementById("replyPhotoFile");
  if (!input || input.disabled) return;
  currentReplyPhoto = null;
  input.value = "";
  input.form.querySelector('[type="submit"]').disabled = false;
  document.getElementById("replyPreviewBox").classList.add("hide");
  document.getElementById("replyPhotoLabel").textContent = "Anexar print na resposta";
}

async function uploadProfilePhoto(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    try {
            if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
      if (convex) {
        try {
          await convex.mutation(api.auth.updateProfile, { email: currentUser.email, avatar: base64 });
        } catch (err) {
          console.warn("Convex update profile photo notice:", err);
          throw err;
        }
      }

      currentUser.avatar = base64;
      saveSession();
      toast("Foto de perfil atualizada!", "success");
      render();
    } catch (err) { toast(errorMessage(err), "error"); }
  };
  reader.readAsDataURL(file);
}

async function createTicket() {
  const title = document.getElementById("nT").value.trim();
  if (!title) { toast("Informe o título do chamado.", "error"); return; }
  const category = document.getElementById("nC").value;
  const priority = document.getElementById("nPr").value;
  const description = document.getElementById("nD").value.trim();

  try {
    let ticketId = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        ticketId = await convex.mutation(api.tickets.create, {
          title,
          category,
          priority,
          description: description || undefined,
          photo: currentUploadedPhoto || undefined,
          authorName: currentUser.name,
          authorEmail: currentUser.email
        });
      } catch (err) {
        console.warn("Convex create ticket notice:", err);
          throw err;
      }
    }


    closeModal();
    document.getElementById("nT").value = "";
    document.getElementById("nD").value = "";
    removePhoto();
    toast(`Chamado ${ticketId || ""} criado com sucesso!`, "success");
    await syncTickets();
    goPage(currentUser.type === "cli" ? "ctickets" : "tall");
  } catch (err) {
    toast(errorMessage(err), "error");
  }
}

async function saveProfile() {
  const name = document.getElementById("pn")?.value?.trim();
  if (!name) { toast("Nome é obrigatório.", "error"); return; }
  const dept = document.getElementById("pd")?.value;
  const cargo = document.getElementById("pc")?.value;

  try {
    let data = null;
    if (!convex) throw new Error("Banco indisponivel. Verifique VITE_CONVEX_URL.");
    if (convex) {
      try {
        data = await convex.mutation(api.auth.updateProfile, {
          email: currentUser.email,
          name,
          dept: dept || undefined,
          cargo: cargo || undefined
        });
      } catch (err) {
        console.warn("Convex save profile notice:", err);
          throw err;
      }
    }

    currentUser = { ...currentUser, ...data };
    saveSession();
    toast("Perfil atualizado com sucesso!", "success");
    render();
  } catch (err) { toast(errorMessage(err), "error"); }
}

// ── Utilities ──
function prioH(p) {
  const labels = { crit: "Crítica", high: "Alta", med: "Média", low: "Baixa" };
  const dots = { crit: "critical", high: "high", med: "medium", low: "low" };
  return `<span class="priority-indicator"><span class="priority-dot ${dots[p] || "medium"}"></span>${labels[p] || p}</span>`;
}
function statusClass(s) {
  return s === "Aberto" ? "status-open" : s === "Em Atendimento" ? "status-progress" : "status-resolved";
}
function calcSLA(dateStr) {
  if (!dateStr) return "Recente";
  try {
    const d = new Date(dateStr);
    const diffDays = Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
    return diffDays === 0 ? "Hoje" : diffDays + " dia" + (diffDays > 1 ? "s" : "");
  } catch { return "Recente"; }
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  } catch { return dateStr; }
}
function initials(n) {
  return (n || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

window.app = {
  closeModal,
  createTicket,
  removePhoto,
  handleReplyPhoto,
  clearReplyPhoto,
  uploadProfilePhoto
};

// ── Init ──
function init() {
  // Setup file listener for new ticket modal
  const fileInput = document.getElementById("nPhotoFile");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          currentUploadedPhoto = e.target.result;
          document.getElementById("nPhotoPreview").src = currentUploadedPhoto;
          document.getElementById("previewContainer").classList.remove("hide");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  renderLanding();
  const saved = loadSession();
  if (saved) {
    currentUser = saved;
    enterApp();
  } else {
    showScreen("landing");
  }
}

window.addEventListener("DOMContentLoaded", init);
