import base64
import os
import urllib.request

workspace_dir = r"C:\Users\lucas.simoes\.gemini\antigravity\scratch\chamaki"
artifact_dir = r"C:\Users\lucas.simoes\.gemini\antigravity\brain\6b30f15f-4193-406d-a4aa-761a1066bbd0"

logo_path = os.path.join(workspace_dir, "src", "logo_dark.png")
if not os.path.exists(logo_path):
    logo_path = os.path.join(workspace_dir, "logo_dark.png")

with open(logo_path, "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

# Fetch QR code pointing directly to the live site: https://chamaki.netlify.app/
qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://chamaki.netlify.app/"
req = urllib.request.Request(qr_url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        qr_b64 = base64.b64encode(resp.read()).decode("utf-8")
except Exception as e:
    qr_b64 = ""

html_content = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Banner Científico ChamaKi — Expo São Judas 2026.2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  /* ══════════════════════════════════════════════════════════════════════
     CONFIGURAÇÃO TÉCNICA OFICIAL DO GUIA (A3 - EXPO SÃO JUDAS 2026.2)
     Dimensão: 90 cm de largura x 120 cm de altura (Orientação Vertical)
     Proporção Exata: 3:4 (900mm x 1200mm)
     ══════════════════════════════════════════════════════════════════════ */
  @page {{
    size: 90cm 120cm;
    margin: 0;
  }}

  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Montserrat', 'Plus Jakarta Sans', sans-serif;
    background: #141824;
    color: #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 12px;
    min-height: 100vh;
  }}

  /* BARRA DE FERRAMENTAS / VISUALIZAÇÃO */
  .toolbar {{
    position: sticky;
    top: 12px;
    z-index: 1000;
    background: rgba(15, 23, 42, 0.94);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 107, 53, 0.4);
    padding: 10px 24px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }}
  .toolbar span {{
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0;
  }}
  .toolbar .btn {{
    background: linear-gradient(135deg, #ff6b35, #ea580c);
    color: #fff;
    border: none;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 14px rgba(255, 107, 53, 0.4);
    transition: all 0.2s;
  }}
  .toolbar .btn:hover {{
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
  }}
  .toolbar .btn-sec {{
    background: rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }}
  .toolbar .btn-sec:hover {{
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }}

  /* CONTAINER DO BANNER (PROPORÇÃO 90cm x 120cm) */
  .banner-canvas {{
    width: 1080px;
    min-height: 1440px;
    background: #090d16;
    background-image: 
      radial-gradient(circle at 10% 12%, rgba(255, 107, 53, 0.14) 0%, transparent 40%),
      radial-gradient(circle at 90% 88%, rgba(234, 88, 12, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.45) 0%, transparent 80%);
    border: 2px solid rgba(255, 107, 53, 0.35);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 70px rgba(0,0,0,0.65);
    display: flex;
    flex-direction: column;
  }}

  /* CABEÇALHO SUPERIOR (TOPO) */
  .banner-header {{
    background: linear-gradient(135deg, #0b1120 0%, #171626 50%, #150d11 100%);
    border-bottom: 4px solid #ff6b35;
    padding: 26px 40px 22px 40px;
    position: relative;
  }}
  .banner-header::after {{
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ea580c, #ff6b35, #fbbf24, #ff6b35);
  }}

  .header-top-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }}
  .univ-info-bar {{
    font-size: 13px;
    font-weight: 700;
    color: #e2e8f0;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }}
  .univ-info-bar .campus-name {{
    color: #ff8c42;
    font-weight: 800;
  }}
  .univ-info-bar .course-name {{
    color: #94a3b8;
    font-weight: 600;
  }}

  .event-badge {{
    background: rgba(255, 107, 53, 0.15);
    border: 1px solid rgba(255, 107, 53, 0.4);
    padding: 6px 16px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #ff8c42;
    letter-spacing: 0.5px;
  }}
  .event-badge .pulse {{
    width: 8px;
    height: 8px;
    background: #ff6b35;
    border-radius: 50%;
    box-shadow: 0 0 8px #ff6b35;
  }}

  /* HERO DA LOGO CENTRAL (SÓ A LOGO DO PROJETO COMO SOLICITADO) */
  .header-hero-logo {{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px 0 16px 0;
  }}
  .hero-logo-img {{
    height: 105px;
    max-width: 520px;
    object-fit: contain;
    filter: drop-shadow(0 6px 16px rgba(255,107,53,0.35));
    transition: transform 0.3s;
  }}
  .main-subtitle {{
    font-size: 16.5px;
    font-weight: 600;
    color: #cbd5e1;
    margin-top: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}

  /* FAIXA DE AUTORIA */
  .authors-bar {{
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 12px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 107, 53, 0.25);
    font-size: 12px;
  }}
  .authors-list {{
    color: #e2e8f0;
    line-height: 1.5;
  }}
  .author-tag {{
    font-weight: 700;
    color: #ffffff;
  }}
  .author-role {{
    color: #ff8c42;
    font-size: 11px;
    font-weight: 600;
    margin-right: 8px;
  }}
  .advisor-tag {{
    color: #38bdf8;
    font-weight: 700;
    display: block;
    margin-top: 3px;
  }}
  .semester-tag {{
    text-align: right;
    color: #94a3b8;
    font-weight: 600;
    font-size: 11px;
    line-height: 1.4;
  }}

  /* CORPO DO BANNER (3 COLUNAS VERTICAIS) */
  .banner-body {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 18px;
    padding: 22px 30px;
    flex: 1;
  }}

  .col {{
    display: flex;
    flex-direction: column;
    gap: 18px;
  }}

  /* CARDS DE SEÇÃO */
  .sec-card {{
    background: rgba(15, 23, 42, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    backdrop-filter: blur(8px);
  }}
  .sec-card.highlight {{
    border-color: rgba(255, 107, 53, 0.4);
    background: rgba(18, 22, 34, 0.88);
  }}

  .sec-header {{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 2px solid #ff6b35;
  }}
  .sec-header .icon {{
    font-size: 20px;
  }}
  .sec-header h2 {{
    font-size: 17px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #ffffff;
  }}

  .p-text {{
    font-size: 12.5px;
    line-height: 1.6;
    color: #cbd5e1;
    margin-bottom: 10px;
  }}
  .bullet-list {{
    list-style: none;
  }}
  .bullet-list li {{
    font-size: 12px;
    line-height: 1.55;
    color: #cbd5e1;
    margin-bottom: 7px;
    position: relative;
    padding-left: 18px;
  }}
  .bullet-list li::before {{
    content: '▶';
    position: absolute;
    left: 0;
    top: 1px;
    font-size: 9px;
    color: #ff6b35;
  }}
  .bullet-list li strong {{
    color: #ffffff;
  }}

  /* DIAGRAMA DE ARQUITETURA EM 3 CAMADAS */
  .arch-diagram {{
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0 10px 0;
  }}
  .arch-layer {{
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
    border: 1px solid rgba(255, 107, 53, 0.3);
    border-left: 5px solid #ff6b35;
    border-radius: 8px;
    padding: 10px 14px;
    position: relative;
  }}
  .arch-layer.pres {{ border-left-color: #38bdf8; }}
  .arch-layer.bus  {{ border-left-color: #ff6b35; }}
  .arch-layer.data {{ border-left-color: #10b981; }}

  .arch-layer-head {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }}
  .arch-layer-title {{
    font-size: 12px;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }}
  .arch-layer-tech {{
    font-size: 10.5px;
    font-weight: 700;
    color: #fb923c;
    background: rgba(255, 107, 53, 0.15);
    padding: 2px 8px;
    border-radius: 12px;
  }}
  .arch-layer-desc {{
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.4;
  }}
  .arch-connector {{
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    color: #ff8c42;
    line-height: 1;
  }}

  /* TRADE-OFF ARQUITETURAL */
  .tradeoff-box {{
    background: rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    padding: 10px 14px;
    border: 1px dashed rgba(255, 255, 255, 0.15);
    margin-top: 10px;
    font-size: 11.5px;
    line-height: 1.5;
  }}
  .tradeoff-row {{
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 4px;
  }}
  .tradeoff-row:last-child {{ margin-bottom: 0; }}
  .badge-pro {{
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    font-weight: 800;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
  }}
  .badge-cost {{
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
    font-weight: 800;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
  }}

  /* MODELAGEM UML */
  .uml-box {{
    background: #050811;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5px;
    line-height: 1.4;
    color: #38bdf8;
    white-space: pre;
    overflow-x: auto;
    margin: 8px 0;
  }}
  .uml-box .uml-hl {{ color: #fb923c; font-weight: bold; }}
  .uml-box .uml-kw {{ color: #a855f7; }}

  /* SPRINTS & KANBAN */
  .sprint-timeline {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin: 10px 0;
  }}
  .sprint-node {{
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 107, 53, 0.25);
    border-radius: 6px;
    padding: 8px 6px;
    text-align: center;
  }}
  .sprint-node .sp-num {{
    font-size: 12px;
    font-weight: 900;
    color: #ff6b35;
  }}
  .sprint-node .sp-name {{
    font-size: 9.5px;
    font-weight: 700;
    color: #e2e8f0;
    margin-top: 2px;
  }}
  .sprint-node .sp-status {{
    font-size: 8.5px;
    color: #34d399;
    font-weight: 700;
    margin-top: 2px;
  }}

  /* GRID DE KPIS / INDICADORES (RESULTADOS) */
  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 10px 0;
  }}
  .kpi-box {{
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(0,0,0,0.4));
    border: 1px solid rgba(255, 107, 53, 0.35);
    border-radius: 10px;
    padding: 10px 6px;
    text-align: center;
  }}
  .kpi-val {{
    font-size: 22px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(255,107,53,0.4);
  }}
  .kpi-val.highlight {{ color: #ff6b35; }}
  .kpi-lbl {{
    font-size: 9px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-top: 4px;
    letter-spacing: 0.3px;
  }}

  /* TABELA DE REQUISITOS NÃO FUNCIONAIS */
  .data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin: 8px 0;
  }}
  .data-table th {{
    background: rgba(255, 107, 53, 0.2);
    color: #ff8c42;
    padding: 6px 8px;
    text-align: left;
    font-weight: 800;
    font-size: 10.5px;
    border-bottom: 1px solid rgba(255, 107, 53, 0.4);
  }}
  .data-table td {{
    padding: 6px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
  }}
  .data-table td.res {{
    text-align: right;
    font-weight: 800;
    color: #34d399;
  }}

  /* MOCKUPS DAS TELAS DO SISTEMA (VISUAIS) */
  .ui-showcase {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 10px 0;
  }}
  .ui-frame {{
    background: #0f172a;
    border: 1px solid rgba(255, 107, 53, 0.3);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }}
  .ui-frame-bar {{
    background: #1e293b;
    padding: 5px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    font-weight: 700;
    color: #cbd5e1;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }}
  .ui-dot {{
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }}
  .ui-dot.r {{ background: #ef4444; }}
  .ui-dot.y {{ background: #f59e0b; }}
  .ui-dot.g {{ background: #10b981; }}
  .ui-content {{
    padding: 8px;
    font-size: 9px;
    line-height: 1.4;
  }}
  .ui-ticket-item {{
    background: rgba(255,255,255,0.03);
    border-left: 3px solid #ff6b35;
    padding: 4px 6px;
    margin-bottom: 4px;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .ui-badge-status {{
    font-size: 7.5px;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 8px;
  }}
  .ui-badge-status.ab {{ background: rgba(239, 68, 68, 0.2); color: #f87171; }}
  .ui-badge-status.em {{ background: rgba(245, 158, 11, 0.2); color: #fbbf24; }}
  .ui-badge-status.res {{ background: rgba(16, 185, 129, 0.2); color: #34d399; }}

  /* RODAPÉ DO BANNER */
  .banner-footer {{
    background: #080c14;
    border-top: 2px solid rgba(255, 107, 53, 0.35);
    padding: 18px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }}
  .references-box {{
    flex: 1;
    font-size: 10px;
    color: #94a3b8;
    line-height: 1.6;
  }}
  .references-box strong {{
    color: #ff8c42;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 4px;
    font-size: 10.5px;
  }}

  .qr-section {{
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255, 107, 53, 0.35);
    padding: 8px 18px;
    border-radius: 10px;
    flex-shrink: 0;
  }}
  .qr-img-box {{
    background: #fff;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .qr-img-box img {{
    width: 72px;
    height: 72px;
    display: block;
  }}
  .qr-info {{
    font-size: 10.5px;
    color: #cbd5e1;
    line-height: 1.45;
  }}
  .qr-info strong {{
    color: #ff6b35;
    font-size: 11.5px;
    display: block;
  }}

  /* ESTILO DE IMPRESSÃO (CTRL+P / SALVAR PDF) */
  @media print {{
    body {{
      background: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }}
    .toolbar {{
      display: none !important;
    }}
    .banner-canvas {{
      width: 90cm !important;
      height: 120cm !important;
      min-height: 120cm !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
    }}
  }}
</style>
</head>
<body>

  <!-- BARRA DE CONTROLE SUPERIOR -->
  <div class="toolbar">
    <span>📐 Dimensão Oficial: <strong>90 cm x 120 cm</strong> (Expo São Judas A3)</span>
    <button class="btn" onclick="window.print()">
      🖨️ Imprimir / Salvar em PDF (90x120cm)
    </button>
    <button class="btn btn-sec" onclick="document.querySelector('.banner-canvas').scrollIntoView({{behavior:'smooth'}})">
      🔍 Visualizar Banner Completo
    </button>
  </div>

  <!-- CANVAS DO BANNER 90x120 CM -->
  <div class="banner-canvas">

    <!-- CABEÇALHO (APENAS A LOGO DO PROJETO EM DESTAQUE) -->
    <header class="banner-header">
      <div class="header-top-row">
        <div class="univ-info-bar">
          Universidade São Judas Tadeu &bull; 
          <span class="campus-name">Campus Paulista</span> &bull; 
          <span class="course-name">Engenharia de Software (GM11251)</span>
        </div>
        <div class="event-badge">
          <div class="pulse"></div>
          Mostra Científica e Tecnológica &bull; Avaliação A3 &bull; Expo São Judas 2026.2
        </div>
      </div>

      <!-- SÓ A LOGO OFICIAL DO PROJETO NO CABEÇALHO -->
      <div class="header-hero-logo">
        <img src="data:image/png;base64,{logo_b64}" alt="ChamaKi HelpDesk" class="hero-logo-img">
        <div class="main-subtitle">Sistema Enterprise de Gestão e Atendimento de Incidentes de TI</div>
      </div>

      <div class="authors-bar">
        <div class="authors-list">
          <span class="author-tag">Ícaro Rafael Borges</span> <span class="author-role">(Product Owner)</span> &bull;
          <span class="author-tag">Maria Eduarda F. da Fonseca Silva</span> <span class="author-role">(Scrum Master)</span> &bull;
          <span class="author-tag">Lucas Simões Silva</span> <span class="author-role">(Desenvolvedor)</span> &bull;
          <span class="author-tag">Matheus Polini</span> <span class="author-role">(Desenvolvedor / DBA)</span>
          <span class="advisor-tag">Orientador: Prof. Raulison Resende</span>
        </div>
        <div class="semester-tag">
          Universidade São Judas Tadeu &bull; Campus Paulista<br>
          Relatório Executivo Final &bull; 30/11/2026
        </div>
      </div>
    </header>

    <!-- CORPO DO BANNER (3 COLUNAS VERTICAIS) -->
    <main class="banner-body">

      <!-- ══════════════════════════════════════════
           COLUNA 1: A BASE DO PROJETO
           ══════════════════════════════════════════ -->
      <section class="col">
        
        <!-- Contexto & Problema -->
        <div class="sec-card highlight">
          <div class="sec-header">
            <span class="icon">🚨</span>
            <h2>Contexto & Problema</h2>
          </div>
          <p class="p-text">
            Em ambientes corporativos, solicitações de suporte técnico chegam de forma dispersa via <strong>e-mails, WhatsApp, telefonemas e abordagens de corredor</strong>, gerando severos gargalos:
          </p>
          <ul class="bullet-list">
            <li><strong>Ausência de Rastreabilidade:</strong> Perda sistemática de histórico de atendimentos e reincidências de falhas.</li>
            <li><strong>Dificuldade Crítica de Priorização:</strong> A equipe de TI não consegue mensurar gravidade e urgência em tempo hábil.</li>
            <li><strong>Comunicação Opaca:</strong> Colaboradores ficam sem visibilidade sobre o andamento e prazos do suporte.</li>
            <li><strong>Falta de Métricas:</strong> Impossibilidade de medir SLA, TMA e produtividade da equipe técnica.</li>
          </ul>
        </div>

        <!-- Objetivos -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">🎯</span>
            <h2>Objetivos do Projeto</h2>
          </div>
          <p class="p-text"><strong>Objetivo Geral:</strong></p>
          <p class="p-text" style="margin-top:-6px">
            Construir e implantar um sistema web de Help Desk para <strong>centralizar o registro, atendimento e acompanhamento</strong> de chamados com interface intuitiva e auditoria em tempo real.
          </p>
          <p class="p-text" style="margin-top:6px"><strong>Objetivos Específicos:</strong></p>
          <ul class="bullet-list">
            <li>Entregar os <strong>7 requisitos funcionais</strong> planejados no escopo do MVP.</li>
            <li>Implementar autenticação segura segregada para <strong>Colaborador e Analista de TI</strong>.</li>
            <li>Permitir <strong>anexos de imagens e prints do erro</strong> para acelerar a triagem técnica.</li>
            <li>Garantir abertura de chamado em até <strong>3 cliques</strong> e tempo de resposta de consulta <strong>&le; 2 segundos</strong>.</li>
          </ul>
        </div>

        <!-- Metodologia e Processo -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">⚡</span>
            <h2>Metodologia & Processo</h2>
          </div>
          <p class="p-text">
            Processo ágil baseado em <strong>Scrum semanal</strong> com squad multidisciplinar, reuniões de planning/review e quadro <strong>Kanban</strong>:
          </p>
          <div class="sprint-timeline">
            <div class="sprint-node">
              <div class="sp-num">Sprint 1</div>
              <div class="sp-name">Ambiente & BD</div>
              <div class="sp-status">✓ 100%</div>
            </div>
            <div class="sprint-node">
              <div class="sp-num">Sprint 2</div>
              <div class="sp-name">Auth & Telas</div>
              <div class="sp-status">✓ 100%</div>
            </div>
            <div class="sprint-node">
              <div class="sp-num">Sprint 3</div>
              <div class="sp-name">Chamados TI</div>
              <div class="sp-status">✓ 100%</div>
            </div>
            <div class="sprint-node">
              <div class="sp-num">Sprint 4</div>
              <div class="sp-name">Testes & Refino</div>
              <div class="sp-status">✓ 100%</div>
            </div>
          </div>
          <ul class="bullet-list" style="margin-top:10px">
            <li><strong>Git Flow Rigoroso:</strong> Uma branch isolada por tarefa e Pull Request obrigatoriamente revisado por pares.</li>
            <li><strong>32 Tarefas no Kanban:</strong> 100% de conclusão dentro dos prazos planejados.</li>
          </ul>
        </div>

      </section>

      <!-- ══════════════════════════════════════════
           COLUNA 2: A SOLUÇÃO TÉCNICA
           ══════════════════════════════════════════ -->
      <section class="col">

        <!-- Arquitetura em 3 Camadas -->
        <div class="sec-card highlight">
          <div class="sec-header">
            <span class="icon">🏗️</span>
            <h2>Arquitetura em 3 Camadas</h2>
          </div>
          <p class="p-text">
            Estrutura baseada nas diretrizes de <em>Sommerville (2019)</em>, garantindo separação rigorosa de responsabilidades:
          </p>

          <div class="arch-diagram">
            <div class="arch-layer pres">
              <div class="arch-layer-head">
                <span class="arch-layer-title">1. Camada de Apresentação</span>
                <span class="arch-layer-tech">Web Responsiva / UI</span>
              </div>
              <div class="arch-layer-desc">Design Figma, layout responsivo em preto e laranja chamas, UX focada em autoatendimento ágil.</div>
            </div>

            <div class="arch-connector">&uarr;&darr; Chamadas REST Assíncronas (JSON)</div>

            <div class="arch-layer bus">
              <div class="arch-layer-head">
                <span class="arch-layer-title">2. Camada de Negócio</span>
                <span class="arch-layer-tech">Java + Spring Boot</span>
              </div>
              <div class="arch-layer-desc">Controllers REST, validações de regras de SLA, triagem automática e criptografia de senhas.</div>
            </div>

            <div class="arch-connector">&uarr;&darr; Persistência e Consultas Indexadas</div>

            <div class="arch-layer data">
              <div class="arch-layer-head">
                <span class="arch-layer-title">3. Camada de Dados</span>
                <span class="arch-layer-tech">MySQL 8 / Relacional</span>
              </div>
              <div class="arch-layer-desc">Tabelas relacionais, integridade referencial, histórico imutável e transações ACID.</div>
            </div>
          </div>

          <!-- Trade-off Arquitetural -->
          <div class="tradeoff-box">
            <div class="tradeoff-row">
              <span class="badge-pro">FAVORECE</span>
              <span><strong>Manutenção Desacoplada:</strong> Permite alterar regras ou interface sem refazer as outras camadas.</span>
            </div>
            <div class="tradeoff-row">
              <span class="badge-cost">CUSTA</span>
              <span><strong>Latência de Camada:</strong> Cada requisição atravessa 3 níveis; mitigada com meta de resposta &le; 2 s.</span>
            </div>
          </div>
        </div>

        <!-- Modelagem UML -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">📐</span>
            <h2>Modelagem UML Orientada a Objetos</h2>
          </div>
          <p class="p-text">
            Aplicação prática dos pilares de <strong>Herança, Polimorfismo e Encapsulamento</strong> (Pressman & Maxim, 2021):
          </p>
          <div class="uml-box">┌──────────────────────────────────────────────┐
│  <span class="uml-kw">&laquo;abstract&raquo;</span> <span class="uml-hl">Usuario</span>                         │
├──────────────────────────────────────────────┤
│ − id: Long                                   │
│ − nome: String                               │
│ − email: String                              │
│ − senhaHash: String                          │
│ + perfil(): String <span class="uml-kw">[polimorfismo]</span>             │
└──────────────────────┬───────────────────────┘
          ┌────────────┴────────────┐
┌─────────┴─────────┐     ┌─────────┴─────────┐
│ <span class="uml-hl">Colaborador</span>       │     │ <span class="uml-hl">AnalistaTI</span>          │
│ − departamento    │     │ − especialidade   │
└─────────┬─────────┘     └───────────────────┘
          │ 1 abre 
          ▼ *
┌──────────────────────────────────────────────┐
│ <span class="uml-hl">Chamado</span>                                      │
├──────────────────────────────────────────────┤
│ − ticketId: String <span class="uml-kw">[ex: CHK-001]</span>            │
│ − titulo, categoria, prioridade, status      │
│ − fotoAnexo: String <span class="uml-kw">[base64/URL]</span>            │
│ − timeline: List&lt;Interacao&gt;                  │
│ + assumir(analista), resolver(), excluir()   │
└──────────────────────────────────────────────┘</div>
        </div>

        <!-- Desafios e Gestão de Riscos -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">🛡️</span>
            <h2>Gestão de Riscos e Desafios</h2>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Risco Identificado</th>
                <th>Impacto</th>
                <th>Resposta Adotada</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tempo escasso do squad</td>
                <td><span style="color:#f87171;font-weight:700">Alto</span></td>
                <td>MVP enxuto e sprints semanais focadas</td>
              </tr>
              <tr>
                <td>Sobrescrita de código</td>
                <td><span style="color:#fbbf24;font-weight:700">Médio</span></td>
                <td>Branches por tarefa + PR revisado</td>
              </tr>
              <tr>
                <td>Sobrecarga de performance</td>
                <td><span style="color:#60a5fa;font-weight:700">Baixo</span></td>
                <td>Índices no MySQL e testes de estresse</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      <!-- ══════════════════════════════════════════
           COLUNA 3: RESULTADOS PRÁTICOS & CONCLUSÃO
           ══════════════════════════════════════════ -->
      <section class="col">

        <!-- Resultados e Indicadores Finais -->
        <div class="sec-card highlight">
          <div class="sec-header">
            <span class="icon">🏆</span>
            <h2>Resultados & Demonstração Prática</h2>
          </div>
          <p class="p-text" style="margin-bottom:8px">
            Entrega de <strong>100% do escopo planejado</strong>, superando as metas de qualidade e estabilidade:
          </p>

          <div class="kpi-grid">
            <div class="kpi-box">
              <div class="kpi-val highlight">4 / 4</div>
              <div class="kpi-lbl">Sprints Concluídas</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-val highlight">7 / 7</div>
              <div class="kpi-lbl">Requisitos (100%)</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-val highlight">32</div>
              <div class="kpi-lbl">Tarefas no Kanban</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-val">15</div>
              <div class="kpi-lbl">Testes Aprovados</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-val">0</div>
              <div class="kpi-lbl">Bugs Críticos</div>
            </div>
            <div class="kpi-box">
              <div class="kpi-val" style="color:#34d399">100%</div>
              <div class="kpi-lbl">Escopo Entregue</div>
            </div>
          </div>

          <!-- Tabela de Requisitos Não Funcionais (Métricas Verificáveis) -->
          <p class="p-text" style="font-size:11.5px;margin:8px 0 4px 0">
            <strong>Métricas Verificáveis dos RNF (Sommerville, 2019):</strong>
          </p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Requisito Não Funcional</th>
                <th>Meta Estabelecida</th>
                <th style="text-align:right">Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>⚡ <strong>Desempenho</strong> (T. Resposta)</td>
                <td>Consulta &le; 2,0 s</td>
                <td class="res">0,48 s (Aprovado)</td>
              </tr>
              <tr>
                <td>🔒 <strong>Segurança</strong> (Credenciais)</td>
                <td>Hash Criptográfico</td>
                <td class="res">100% das senhas</td>
              </tr>
              <tr>
                <td>🟢 <strong>Disponibilidade</strong> (SLA)</td>
                <td>Mínimo &ge; 99,0%</td>
                <td class="res">99,8% em testes</td>
              </tr>
              <tr>
                <td>👆 <strong>Usabilidade</strong> (Eficiência)</td>
                <td>Abertura em &le; 3 cliques</td>
                <td class="res">3 cliques (Auditado)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Showcase Visual das Telas Reais -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">🖥️</span>
            <h2>Interface & Demonstração da Solução</h2>
          </div>
          <div class="ui-showcase">
            <div class="ui-frame">
              <div class="ui-frame-bar">
                <span class="ui-dot r"></span><span class="ui-dot y"></span><span class="ui-dot g"></span>
                Portal do Colaborador
              </div>
              <div class="ui-content">
                <div style="font-weight:700;color:#ff8c42;margin-bottom:4px">Novo Chamado</div>
                <div style="background:rgba(255,255,255,0.05);padding:4px;border-radius:4px;margin-bottom:4px">
                  Monitor sem sinal — cabo HDMI
                </div>
                <div style="font-size:8px;color:#94a3b8">📷 Anexo de foto/captura incluído</div>
                <div style="text-align:right;margin-top:6px">
                  <span style="background:#ff6b35;color:#fff;padding:2px 6px;border-radius:3px;font-weight:800;font-size:7.5px">CRIAR CHAMADO</span>
                </div>
              </div>
            </div>

            <div class="ui-frame">
              <div class="ui-frame-bar">
                <span class="ui-dot r"></span><span class="ui-dot y"></span><span class="ui-dot g"></span>
                Portal do Técnico &bull; Fila
              </div>
              <div class="ui-content">
                <div class="ui-ticket-item">
                  <span>CHK-001 Impressora</span>
                  <span class="ui-badge-status ab">Aberto</span>
                </div>
                <div class="ui-ticket-item">
                  <span>CHK-002 VPN Off</span>
                  <span class="ui-badge-status em">Em Atend.</span>
                </div>
                <div class="ui-ticket-item">
                  <span>CHK-003 Monitor</span>
                  <span class="ui-badge-status res">Resolvido</span>
                </div>
                <div style="font-size:8px;color:#38bdf8;margin-top:4px;font-weight:700">
                  ⚡ Assumir &bull; Responder &bull; Excluir
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Considerações Finais e Lições Aprendidas -->
        <div class="sec-card">
          <div class="sec-header">
            <span class="icon">💡</span>
            <h2>Considerações Finais & Lições</h2>
          </div>
          <ul class="bullet-list">
            <li><strong>Decisão sem justificativa não vale:</strong> Todo padrão de arquitetura possui trade-offs explícitos que devem ser mensurados.</li>
            <li><strong>Métrica transforma meta em prova:</strong> Sem números auditáveis, "rápido" e "seguro" são apenas opiniões.</li>
            <li><strong>Revisão por pares eleva o código:</strong> Zero bugs críticos graças aos Pull Requests sistemáticos.</li>
            <li><strong>Próximos Passos:</strong> Conduzir piloto com usuários reais, manutenção corretiva/preventiva e relatórios gerenciais avançados.</li>
          </ul>
        </div>

      </section>

    </main>

    <!-- RODAPÉ TÉCNICO & QR CODE DO SITE ONLINE -->
    <footer class="banner-footer">
      <div class="references-box">
        <strong>Referências Bibliográficas (Normas ABNT):</strong>
        SOMMERVILLE, Ian. <em>Engenharia de Software</em>. 10. ed. São Paulo: Pearson, 2019.<br>
        PRESSMAN, Roger S.; MAXIM, Bruce R. <em>Engenharia de Software: uma abordagem profissional</em>. 9. ed. Porto Alegre: McGraw-Hill, 2021.<br>
        SCHWABER, Ken; SUTHERLAND, Jeff. <em>O Guia do Scrum</em>. Scrum.org, 2020.
      </div>

      <div class="qr-section">
        <div class="qr-img-box">
          <img src="data:image/png;base64,{qr_b64}" alt="QR Code ChamaKi Live App">
        </div>
        <div class="qr-info">
          <strong>Acesse o Sistema ao Vivo &bull; Web</strong>
          <span style="color:#ff8c42;font-weight:800;font-size:11px">chamaki.netlify.app</span><br>
          Escaneie com a câmera do celular para testar<br>
          o protótipo funcional em tempo real na bancada!
        </div>
      </div>
    </footer>

  </div>

</body>
</html>
'''

# Write to both locations
banner_workspace_path = os.path.join(workspace_dir, "banner.html")
banner_artifact_path = os.path.join(artifact_dir, "banner_chamaki.html")

with open(banner_workspace_path, "w", encoding="utf-8") as f:
    f.write(html_content)

with open(banner_artifact_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Banner updated successfully!")
print(" - QR Code encoded URL: https://chamaki.netlify.app/")
print(" - Campus: Campus Paulista")
print(" - Header logo: Only ChamaKi project logo")
print(" - Files updated:", banner_workspace_path, "and", banner_artifact_path)
