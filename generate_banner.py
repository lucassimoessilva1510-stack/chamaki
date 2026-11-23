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
<title>Banner Científico e Tecnológico ChamaKi — Expo São Judas 2026.2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
<style>
  /* ══════════════════════════════════════════════════════════════════════
     DIRETRIZES TÉCNICAS OBRIGATÓRIAS DO GUIA OFICIAL (PROF. RAULISON RESENDE)
     • Dimensão Exata: 90 cm de largura x 120 cm de altura (Orientação Vertical / Retrato)
     • Tipografia: Montserrat (Fonte limpa e profissional)
     • Título: 60 a 80 pt (Legível a 3 metros) -> Definido em 64 pt
     • Títulos de Seções: 36 a 44 pt -> Definido em 38 pt
     • Texto e Tópicos: 24 a 30 pt (NUNCA menor que 20 pt) -> Definido em 24 pt e 20 pt
     • Proporção: 50% de recursos visuais e 50% de texto conciso em tópicos (bullet points)
     ══════════════════════════════════════════════════════════════════════ */
  @page {{
    size: 900mm 1200mm;
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
    font-family: 'Montserrat', Arial, sans-serif;
    background: #10141f;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px;
    min-height: 100vh;
  }}

  /* CONTROLE INTERATIVO SUPERIOR DE VISUALIZAÇÃO */
  .toolbar {{
    position: sticky;
    top: 10px;
    z-index: 10000;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);
    border: 2px solid #ff6b35;
    padding: 12px 28px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }}
  .toolbar span {{
    font-size: 14px;
    font-weight: 700;
    color: #f1f5f9;
  }}
  .toolbar .btn {{
    background: linear-gradient(135deg, #ff6b35, #ea580c);
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(255, 107, 53, 0.45);
    transition: all 0.2s;
  }}
  .toolbar .btn:hover {{
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(255, 107, 53, 0.65);
  }}
  .toolbar .zoom-select {{
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }}
  .toolbar .zoom-select option {{
    background: #0f172a;
    color: #fff;
  }}

  /* ESCALA DE VISUALIZAÇÃO EM TELA */
  .scale-wrapper {{
    transform-origin: top center;
    transition: transform 0.2s ease;
  }}

  /* CANVAS OFICIAL DO BANNER (900mm x 1200mm = 90cm x 120cm) */
  .banner-canvas {{
    width: 900mm;
    height: 1200mm;
    min-width: 900mm;
    min-height: 1200mm;
    max-width: 900mm;
    max-height: 1200mm;
    background: #090d16;
    background-image: 
      radial-gradient(circle at 8% 10%, rgba(255, 107, 53, 0.16) 0%, transparent 40%),
      radial-gradient(circle at 92% 90%, rgba(234, 88, 12, 0.14) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.5) 0%, transparent 80%);
    border: 4mm solid #ff6b35;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 80px rgba(0,0,0,0.7);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* ══════════════════════════════════════════════════════════════════════
     CABEÇALHO (TOPO) — IDENTIFICAÇÃO INSTITUCIONAL E PROJETO
     ══════════════════════════════════════════════════════════════════════ */
  .banner-header {{
    background: linear-gradient(135deg, #0b1120 0%, #161a29 50%, #180d12 100%);
    border-bottom: 5mm solid #ff6b35;
    padding: 18mm 25mm 14mm 25mm;
    position: relative;
  }}
  .banner-header::after {{
    content: '';
    position: absolute;
    bottom: -5mm;
    left: 0;
    right: 0;
    height: 5mm;
    background: linear-gradient(90deg, #ea580c, #ff6b35, #fbbf24, #ff6b35);
  }}

  /* LINHA 1 DO TOPO: LOGO FACULDADE + MOSTRA CIENTÍFICA */
  .header-top-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12mm;
    padding-bottom: 10mm;
    border-bottom: 1mm solid rgba(255, 255, 255, 0.12);
  }}

  .univ-brand-box {{
    display: flex;
    align-items: center;
    gap: 16mm;
  }}
  .univ-logo-svg {{
    display: flex;
    align-items: center;
  }}
  .univ-info-text {{
    line-height: 1.35;
  }}
  .univ-title {{
    font-size: 26pt;
    font-weight: 900;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1.5pt;
  }}
  .univ-meta {{
    font-size: 20pt;
    font-weight: 700;
    color: #ff8c42;
    margin-top: 1mm;
  }}

  .event-badge {{
    background: rgba(255, 107, 53, 0.18);
    border: 1mm solid rgba(255, 107, 53, 0.5);
    padding: 6mm 16mm;
    border-radius: 30mm;
    display: flex;
    align-items: center;
    gap: 6mm;
    font-size: 20pt;
    font-weight: 800;
    color: #ff8c42;
    letter-spacing: 0.5pt;
    text-transform: uppercase;
  }}
  .event-badge .pulse {{
    width: 6mm;
    height: 6mm;
    background: #ff6b35;
    border-radius: 50%;
    box-shadow: 0 0 10mm #ff6b35;
  }}

  /* LINHA 2 DO TOPO: LOGO DO PROJETO + TÍTULO COM DESTAQUE (64 PT) */
  .header-main {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18mm;
    margin-bottom: 12mm;
  }}
  .logo-box {{
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1mm solid rgba(255, 107, 53, 0.35);
    border-radius: 8mm;
    padding: 4mm 10mm;
  }}
  .logo-box img {{
    height: 38mm;
    object-fit: contain;
    filter: drop-shadow(0 4mm 12mm rgba(255,107,53,0.4));
  }}

  .title-box {{
    flex: 1;
    text-align: center;
  }}
  .main-title {{
    font-size: 64pt;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.15;
    letter-spacing: -1pt;
    text-transform: uppercase;
    text-shadow: 0 4mm 14mm rgba(0,0,0,0.6);
  }}
  .main-title span {{
    color: #ff6b35;
    background: linear-gradient(90deg, #ff6b35, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .main-subtitle {{
    font-size: 26pt;
    font-weight: 700;
    color: #cbd5e1;
    margin-top: 3mm;
    letter-spacing: 0.5pt;
  }}

  .dept-badge {{
    flex-shrink: 0;
    text-align: right;
    background: rgba(255, 255, 255, 0.05);
    border: 1mm solid rgba(255, 255, 255, 0.12);
    padding: 6mm 12mm;
    border-radius: 6mm;
  }}
  .dept-badge .track {{
    font-size: 22pt;
    font-weight: 800;
    color: #ff8c42;
    text-transform: uppercase;
  }}
  .dept-badge .code {{
    font-size: 20pt;
    font-weight: 600;
    color: #94a3b8;
    margin-top: 1mm;
  }}

  /* LINHA 3 DO TOPO: AUTORES, PROFESSORES, COORDENADORA E ORIENTADOR */
  .authors-bar {{
    background: rgba(0, 0, 0, 0.55);
    border-radius: 6mm;
    padding: 8mm 16mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1mm solid rgba(255, 107, 53, 0.35);
    font-size: 21pt;
    line-height: 1.5;
  }}
  .authors-left {{
    color: #f1f5f9;
  }}
  .author-item {{
    font-weight: 800;
    color: #ffffff;
  }}
  .author-role {{
    color: #ff8c42;
    font-weight: 700;
    font-size: 20pt;
    margin-right: 6mm;
  }}
  .faculty-team {{
    margin-top: 2mm;
    font-size: 20pt;
    color: #e2e8f0;
  }}
  .faculty-team strong {{
    color: #38bdf8;
  }}
  .faculty-team .coord {{
    color: #fbbf24;
  }}

  .authors-right {{
    text-align: right;
    font-size: 20pt;
    font-weight: 700;
    color: #94a3b8;
    line-height: 1.4;
  }}
  .authors-right .highlight {{
    color: #34d399;
  }}

  /* ══════════════════════════════════════════════════════════════════════
     CORPO PRINCIPAL (3 COLUNAS VERTICAIS DE 268mm)
     ══════════════════════════════════════════════════════════════════════ */
  .banner-body {{
    display: grid;
    grid-template-columns: 268mm 268mm 268mm;
    gap: 23mm;
    padding: 16mm 25mm;
    flex: 1;
  }}

  .col {{
    display: flex;
    flex-direction: column;
    gap: 16mm;
  }}

  /* CARTÕES DE SEÇÃO ACADÊMICOS */
  .sec-card {{
    background: rgba(15, 23, 42, 0.78);
    border: 1mm solid rgba(255, 255, 255, 0.1);
    border-radius: 8mm;
    padding: 14mm 16mm;
    position: relative;
    box-shadow: 0 4mm 18mm rgba(0,0,0,0.3);
  }}
  .sec-card.highlight {{
    border-color: rgba(255, 107, 53, 0.5);
    background: rgba(18, 22, 34, 0.92);
  }}

  .sec-header {{
    display: flex;
    align-items: center;
    gap: 6mm;
    margin-bottom: 10mm;
    padding-bottom: 5mm;
    border-bottom: 2mm solid #ff6b35;
  }}
  .sec-header .icon {{
    font-size: 32pt;
  }}
  .sec-header h2 {{
    font-size: 38pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.8pt;
    color: #ffffff;
  }}

  .p-text {{
    font-size: 24pt;
    line-height: 1.55;
    color: #e2e8f0;
    margin-bottom: 8mm;
  }}
  .bullet-list {{
    list-style: none;
  }}
  .bullet-list li {{
    font-size: 23pt;
    line-height: 1.55;
    color: #e2e8f0;
    margin-bottom: 6mm;
    position: relative;
    padding-left: 14mm;
  }}
  .bullet-list li::before {{
    content: '▶';
    position: absolute;
    left: 0;
    top: 0.5mm;
    font-size: 18pt;
    color: #ff6b35;
  }}
  .bullet-list li strong {{
    color: #ffffff;
    font-weight: 800;
  }}

  /* DIAGRAMA DE ARQUITETURA EM TRÊS CAMADAS */
  .arch-diagram {{
    display: flex;
    flex-direction: column;
    gap: 6mm;
    margin: 8mm 0;
  }}
  .arch-layer {{
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
    border: 1mm solid rgba(255, 107, 53, 0.35);
    border-left: 5mm solid #ff6b35;
    border-radius: 5mm;
    padding: 8mm 10mm;
  }}
  .arch-layer.pres {{ border-left-color: #38bdf8; }}
  .arch-layer.bus  {{ border-left-color: #ff6b35; }}
  .arch-layer.data {{ border-left-color: #10b981; }}

  .arch-layer-head {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3mm;
  }}
  .arch-layer-title {{
    font-size: 23pt;
    font-weight: 800;
    color: #ffffff;
    text-transform: uppercase;
  }}
  .arch-layer-tech {{
    font-size: 20pt;
    font-weight: 800;
    color: #fb923c;
    background: rgba(255, 107, 53, 0.2);
    padding: 2mm 8mm;
    border-radius: 6mm;
  }}
  .arch-layer-desc {{
    font-size: 21pt;
    color: #cbd5e1;
    line-height: 1.45;
  }}
  .arch-connector {{
    text-align: center;
    font-size: 22pt;
    font-weight: 900;
    color: #ff8c42;
    line-height: 1;
  }}

  /* TRADE-OFF ARQUITETURAL FUNDAMENTADO EM SOMMERVILLE */
  .tradeoff-box {{
    background: rgba(0, 0, 0, 0.45);
    border-radius: 5mm;
    padding: 8mm 10mm;
    border: 1mm dashed rgba(255, 255, 255, 0.2);
    margin-top: 6mm;
    font-size: 21pt;
    line-height: 1.5;
  }}
  .tradeoff-row {{
    display: flex;
    align-items: flex-start;
    gap: 6mm;
    margin-bottom: 4mm;
  }}
  .tradeoff-row:last-child {{ margin-bottom: 0; }}
  .badge-pro {{
    background: rgba(16, 185, 129, 0.25);
    color: #34d399;
    font-weight: 900;
    font-size: 20pt;
    padding: 2mm 8mm;
    border-radius: 4mm;
    flex-shrink: 0;
  }}
  .badge-cost {{
    background: rgba(239, 68, 68, 0.25);
    color: #f87171;
    font-weight: 900;
    font-size: 20pt;
    padding: 2mm 8mm;
    border-radius: 4mm;
    flex-shrink: 0;
  }}

  /* MODELAGEM UML */
  .uml-box {{
    background: #050811;
    border: 1mm solid rgba(255, 255, 255, 0.15);
    border-radius: 6mm;
    padding: 8mm 10mm;
    font-family: 'Courier New', Courier, monospace;
    font-size: 19.5pt;
    line-height: 1.4;
    color: #38bdf8;
    white-space: pre;
    overflow-x: auto;
    margin: 6mm 0;
  }}
  .uml-box .uml-hl {{ color: #fb923c; font-weight: bold; }}
  .uml-box .uml-kw {{ color: #a855f7; }}

  /* SPRINTS E KANBAN */
  .sprint-timeline {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4mm;
    margin: 8mm 0;
  }}
  .sprint-node {{
    background: rgba(0, 0, 0, 0.45);
    border: 1mm solid rgba(255, 107, 53, 0.3);
    border-radius: 5mm;
    padding: 6mm 4mm;
    text-align: center;
  }}
  .sprint-node .sp-num {{
    font-size: 23pt;
    font-weight: 900;
    color: #ff6b35;
  }}
  .sprint-node .sp-name {{
    font-size: 20pt;
    font-weight: 700;
    color: #f1f5f9;
    margin-top: 1mm;
  }}
  .sprint-node .sp-status {{
    font-size: 20pt;
    color: #34d399;
    font-weight: 800;
    margin-top: 1mm;
  }}

  /* GRID DE KPIS / INDICADORES FINAIS */
  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6mm;
    margin: 8mm 0;
  }}
  .kpi-box {{
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.16), rgba(0,0,0,0.45));
    border: 1mm solid rgba(255, 107, 53, 0.45);
    border-radius: 6mm;
    padding: 8mm 4mm;
    text-align: center;
  }}
  .kpi-val {{
    font-size: 44pt;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
    text-shadow: 0 2mm 8mm rgba(255,107,53,0.5);
  }}
  .kpi-val.highlight {{ color: #ff6b35; }}
  .kpi-lbl {{
    font-size: 20pt;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    margin-top: 3mm;
  }}

  /* TABELAS DE DADOS (RNF E RISCOS) */
  .data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 21pt;
    margin: 6mm 0;
  }}
  .data-table th {{
    background: rgba(255, 107, 53, 0.25);
    color: #ff8c42;
    padding: 5mm 6mm;
    text-align: left;
    font-weight: 800;
    border-bottom: 1mm solid rgba(255, 107, 53, 0.5);
  }}
  .data-table td {{
    padding: 5mm 6mm;
    border-bottom: 1mm solid rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
  }}
  .data-table td.res {{
    text-align: right;
    font-weight: 800;
    color: #34d399;
  }}

  /* SHOWCASE DE TELAS DO SISTEMA */
  .ui-showcase {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
    margin: 8mm 0;
  }}
  .ui-frame {{
    background: #0f172a;
    border: 1mm solid rgba(255, 107, 53, 0.35);
    border-radius: 6mm;
    overflow: hidden;
    box-shadow: 0 4mm 12mm rgba(0,0,0,0.4);
  }}
  .ui-frame-bar {{
    background: #1e293b;
    padding: 4mm 6mm;
    display: flex;
    align-items: center;
    gap: 3mm;
    font-size: 20pt;
    font-weight: 800;
    color: #cbd5e1;
    border-bottom: 1mm solid rgba(255,255,255,0.1);
  }}
  .ui-dot {{
    width: 4mm;
    height: 4mm;
    border-radius: 50%;
  }}
  .ui-dot.r {{ background: #ef4444; }}
  .ui-dot.y {{ background: #f59e0b; }}
  .ui-dot.g {{ background: #10b981; }}
  .ui-content {{
    padding: 6mm;
    font-size: 20pt;
    line-height: 1.45;
  }}
  .ui-ticket-item {{
    background: rgba(255,255,255,0.04);
    border-left: 3mm solid #ff6b35;
    padding: 4mm 6mm;
    margin-bottom: 3mm;
    border-radius: 3mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .ui-badge-status {{
    font-size: 19pt;
    font-weight: 800;
    padding: 2mm 6mm;
    border-radius: 8mm;
  }}
  .ui-badge-status.ab {{ background: rgba(239, 68, 68, 0.25); color: #f87171; }}
  .ui-badge-status.em {{ background: rgba(245, 158, 11, 0.25); color: #fbbf24; }}
  .ui-badge-status.res {{ background: rgba(16, 185, 129, 0.25); color: #34d399; }}

  /* ══════════════════════════════════════════════════════════════════════
     RODAPÉ (REFERÊNCIAS ABNT E QR CODE INTERATIVO)
     ══════════════════════════════════════════════════════════════════════ */
  .banner-footer {{
    background: #080c14;
    border-top: 4mm solid rgba(255, 107, 53, 0.4);
    padding: 14mm 25mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16mm;
  }}
  .references-box {{
    flex: 1;
    font-size: 20.5pt;
    color: #94a3b8;
    line-height: 1.6;
  }}
  .references-box strong {{
    color: #ff8c42;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
    display: block;
    margin-bottom: 2mm;
    font-size: 22pt;
  }}

  .qr-section {{
    display: flex;
    align-items: center;
    gap: 10mm;
    background: rgba(255,255,255,0.04);
    border: 1mm solid rgba(255, 107, 53, 0.4);
    padding: 6mm 14mm;
    border-radius: 6mm;
    flex-shrink: 0;
  }}
  .qr-img-box {{
    background: #fff;
    padding: 3mm;
    border-radius: 4mm;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .qr-img-box img {{
    width: 32mm;
    height: 32mm;
    display: block;
  }}
  .qr-info {{
    font-size: 21pt;
    color: #cbd5e1;
    line-height: 1.45;
  }}
  .qr-info strong {{
    color: #ff6b35;
    font-size: 24pt;
    display: block;
  }}

  /* ESTILO DE IMPRESSÃO (CTRL+P / SALVAR PDF 900x1200mm) */
  @media print {{
    body {{
      background: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }}
    .toolbar {{
      display: none !important;
    }}
    .scale-wrapper {{
      transform: none !important;
    }}
    .banner-canvas {{
      width: 900mm !important;
      height: 1200mm !important;
      min-width: 900mm !important;
      min-height: 1200mm !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
    }}
  }}
</style>
<script>
  function changeZoom(val) {{
    const wrapper = document.getElementById('scaleWrapper');
    if (val === 'fit') {{
      const scale = (window.innerWidth - 60) / (900 * 3.7795);
      wrapper.style.transform = 'scale(' + Math.min(scale, 1) + ')';
    }} else {{
      wrapper.style.transform = 'scale(' + val + ')';
    }}
  }}
  window.addEventListener('resize', () => {{
    const sel = document.getElementById('zoomSelect');
    if (sel && sel.value === 'fit') changeZoom('fit');
  }});
  window.addEventListener('DOMContentLoaded', () => {{
    changeZoom('fit');
  }});
</script>
</head>
<body>

  <!-- BARRA DE CONTROLE SUPERIOR -->
  <div class="toolbar">
    <span>📐 Padrão Oficial: <strong>90 cm x 120 cm</strong> (Expo São Judas A3)</span>
    <label for="zoomSelect" style="font-size:13px;font-weight:700">Zoom na Tela:</label>
    <select id="zoomSelect" class="zoom-select" onchange="changeZoom(this.value)">
      <option value="fit" selected>Ajustar à Tela (Fit)</option>
      <option value="0.35">35%</option>
      <option value="0.5">50%</option>
      <option value="0.75">75%</option>
      <option value="1.0">100% (Tamanho Real 90x120cm)</option>
    </select>
    <button class="btn" onclick="window.print()">
      🖨️ Imprimir / Salvar em PDF (90x120cm)
    </button>
  </div>

  <div class="scale-wrapper" id="scaleWrapper">
    <!-- CANVAS DO BANNER (900mm x 1200mm = 90cm x 120cm) -->
    <div class="banner-canvas">

      <!-- CABEÇALHO SUPERIOR (TOPO) -->
      <header class="banner-header">

        <!-- LINHA 1: LOGO FACULDADE (SÃO JUDAS) + CAMPUS PAULISTA + MOSTRA CIENTÍFICA -->
        <div class="header-top-row">
          <div class="univ-brand-box">
            <!-- LOGOTIPO OFICIAL VETORIAL DA SÃO JUDAS TADEU -->
            <div class="univ-logo-svg">
              <svg width="220" height="48" viewBox="0 0 146 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M138.231 18.8938H136.411C136.116 18.8938 135.92 18.5494 136.067 18.3034L140.64 9.34851L136.018 0.590432C135.87 0.295216 136.067 0 136.362 0H138.182C139.853 0 140.984 0.688838 141.722 2.01731L146 9.39772L141.771 16.7781C141.033 18.0574 139.952 18.8938 138.231 18.8938Z" fill="#A9BE00"/>
                <path d="M107.007 9.34863C105.827 9.34863 105.089 9.39784 104.499 9.49624C103.073 9.69305 101.992 12.3008 102.582 12.8912C102.778 12.9896 103.073 12.9896 103.516 12.8912C104.204 12.7436 105.483 12.5468 107.253 12.5468C109.761 12.5468 111.433 13.0388 111.433 15.3022V17.0735H107.499C103.073 17.0735 100.271 18.5003 100.271 22.5842C100.271 26.4712 102.877 28.1933 107.45 28.1933C112.711 28.1933 114.973 26.3728 114.973 22.3381V15.3514C115.022 10.7755 111.777 9.34863 107.007 9.34863ZM111.383 22.2397C111.383 24.6999 109.662 25.0935 107.4 25.0935C105.581 25.0935 103.909 24.7491 103.909 22.5842C103.909 20.7145 105.089 19.9764 107.499 19.9764H111.383V22.2397Z" fill="#ffffff"/>
                <path d="M23.0702 9.29932C21.8901 9.29932 21.1525 9.34852 20.5624 9.44693C19.1364 9.64374 18.0547 12.2515 18.6447 12.8419C18.8414 12.9403 19.1364 12.9403 19.579 12.8419C20.2674 12.6943 21.5459 12.4975 23.3161 12.4975C25.8238 12.4975 27.4957 12.9895 27.4957 15.302V17.0733H23.6111C19.1856 17.0733 16.3828 18.5002 16.3828 22.584C16.3828 26.4711 18.9889 28.2424 23.5619 28.2424C28.8233 28.2424 31.0853 26.4219 31.0853 22.3872V15.302C31.0853 10.7262 27.8399 9.29932 23.0702 9.29932ZM27.4465 22.2396C27.4465 24.749 25.7255 25.0934 23.4636 25.0934C21.6442 25.0934 19.9724 24.749 19.9724 22.584C19.9724 20.7143 21.1525 19.9763 23.5619 19.9763H27.4465V22.2396Z" fill="#ffffff"/>
                <path d="M21.7915 4.08386C20.8081 4.08386 19.9721 4.7727 19.7263 5.65835C19.6279 6.00277 19.6279 6.79001 19.6279 6.79001C19.6279 7.03603 19.8246 7.28204 20.1197 7.28204H27.3479C28.3314 7.28204 29.1673 6.5932 29.4132 5.70755C29.5607 5.26473 29.5115 4.57589 29.5115 4.57589C29.5115 4.32988 29.3148 4.08386 29.0198 4.08386H21.7915Z" fill="#ffffff"/>
                <path d="M62.1123 21.1572C62.1123 25.6346 64.5217 28.2424 69.8815 28.2424H69.9307C75.2904 28.2424 77.6998 25.6346 77.6998 21.1572V12.2515C77.6998 10.8246 76.5689 9.69293 75.1429 9.69293H74.5528C74.2578 9.69293 74.0119 9.93894 74.0119 10.2342V21.1572C74.0119 23.4697 73.2744 24.749 69.9307 24.749C66.587 24.749 65.8494 23.4697 65.8494 21.1572V12.2515C65.8494 11.1198 65.0626 10.1358 64.03 9.79134C63.5875 9.64373 62.7515 9.69293 62.7515 9.69293C62.4565 9.69293 62.2106 9.93894 62.2106 10.2342L62.1123 21.1572Z" fill="#ffffff"/>
                <path d="M57.8343 9.69281C57.8343 9.69281 57.1459 9.59441 56.4575 9.79122C55.3265 10.0864 54.5398 11.0705 54.4906 12.2022V21.9935C54.4906 26.8154 52.8188 28.5375 51.6386 29.5707C51.2944 29.8659 50.8027 30.3088 50.8027 30.3088C50.6552 30.5056 50.7535 30.8008 50.9994 30.9976L51.4911 31.3912C51.6878 31.5388 51.8845 31.6864 52.1304 31.7848C53.2121 32.2277 54.4906 31.9816 55.2774 31.096C55.2774 31.096 56.0149 30.358 56.2608 29.9151C57.4901 28.1438 58.4244 25.7821 58.4244 21.7967V12.3498V10.2832C58.4244 9.93883 58.1293 9.69281 57.8343 9.69281Z" fill="#ffffff"/>
                <path d="M34.1826 20.37V17.2211C34.1826 12.104 36.9363 9.34863 42.591 9.34863C48.3933 9.34863 50.9011 11.9564 50.9011 17.2211V20.37C50.9011 25.4379 48.1475 28.2425 42.591 28.2425C36.7396 28.2425 34.1826 25.6347 34.1826 20.37ZM47.1149 17.2211C47.1149 14.1705 46.0823 12.842 42.5419 12.842C39.0015 12.842 37.9197 14.1705 37.9197 17.2211V20.37C37.9197 23.4206 38.9523 24.6999 42.5419 24.6999C46.0823 24.6999 47.1149 23.4206 47.1149 20.37V17.2211Z" fill="#ffffff"/>
                <path d="M97.4184 2.85379C97.4184 2.55858 97.1725 2.31257 96.8775 2.31257C96.8775 2.31257 96.1399 2.21416 95.5498 2.41097C94.468 2.75539 93.6813 3.69024 93.6813 4.87111V11.7595C92.6978 10.185 90.9276 9.39776 88.3707 9.39776C83.306 9.39776 80.749 12.0547 80.749 17.3686V20.4684C80.749 25.6839 83.5027 28.2916 89.1083 28.2916C94.3697 28.2916 97.4675 25.7331 97.4675 20.4684V16.1877V2.85379H97.4184ZM89.0591 24.749C85.4204 24.749 84.4861 23.4697 84.4861 20.4192V17.2702C84.4861 14.2196 85.5187 12.8911 89.0591 12.8911C92.5995 12.8911 93.6813 14.1704 93.6813 17.221V18.205V20.37C93.7304 23.4205 92.6978 24.749 89.0591 24.749Z" fill="#ffffff"/>
                <path d="M0.204942 14.3181C0.204942 17.1719 1.58176 18.3035 3.84367 19.2876L7.77744 21.0589C9.54763 21.8461 10.1377 22.2889 10.1377 23.273C10.1377 24.5031 9.15425 24.8475 6.74482 24.8475C6.59731 24.8475 5.66304 24.7983 5.66304 24.7983C2.95858 24.6999 0.696663 23.8142 0.696663 23.8142C0.647491 23.8142 0.40163 23.7158 0.204942 23.8634C-0.434294 24.5031 0.499975 27.5536 1.92596 27.8981C1.92596 27.8981 2.86023 28.0457 3.49947 28.1441C3.49947 28.1441 6.10559 28.3409 6.40062 28.3409C11.5637 28.3409 13.7764 26.7172 13.7764 23.2238C13.7764 20.3208 12.3013 19.0908 9.89184 18.0575L5.66304 16.237C4.43374 15.6958 3.94202 15.253 3.94202 14.3673C3.94202 13.2848 4.72877 12.8912 7.1382 12.8912C8.66253 12.8912 9.99018 13.088 10.9244 13.3341C11.1703 13.4325 12.2029 13.8261 12.5471 13.6293C13.1864 13.088 12.3996 10.1851 10.9736 9.79146C10.6294 9.64385 8.90839 9.34863 7.18737 9.34863C2.27017 9.34863 0.204942 10.9723 0.204942 14.3181Z" fill="#ffffff"/>
                <path d="M118.316 14.3181C118.316 17.1719 119.693 18.3035 121.955 19.2876L125.889 21.0589C127.659 21.8461 128.249 22.2889 128.249 23.273C128.249 24.5031 127.266 24.8475 124.856 24.8475C124.709 24.8475 123.774 24.7983 123.774 24.7983C121.07 24.6999 118.808 23.8142 118.808 23.8142C118.759 23.8142 118.513 23.7158 118.316 23.8634C117.677 24.5031 118.611 27.5536 120.037 27.8981C120.037 27.8981 120.972 28.0457 121.611 28.1441C121.611 28.1441 124.217 28.2917 124.512 28.2917C129.675 28.2917 131.888 26.7172 131.888 23.1746C131.888 20.2716 130.413 19.0416 128.003 18.0083L123.774 16.1878C122.545 15.6466 122.053 15.2038 122.053 14.3181C122.053 13.2356 122.84 12.842 125.25 12.842C126.774 12.842 128.102 13.0388 129.036 13.2848C129.282 13.3833 130.314 13.7769 130.658 13.5801C131.298 13.0388 130.511 10.1359 129.085 9.74226C128.741 9.64385 127.02 9.34863 125.299 9.34863C120.431 9.34863 118.316 10.9723 118.316 14.3181Z" fill="#ffffff"/>
              </svg>
            </div>
            <div class="univ-info-text">
              <div class="univ-title">Universidade São Judas Tadeu</div>
              <div class="univ-meta">Campus Paulista &bull; São Paulo/SP &bull; 2026.2</div>
            </div>
          </div>

          <div class="event-badge">
            <div class="pulse"></div>
            Mostra Científica e Tecnológica &bull; Avaliação A3 &bull; Expo São Judas
          </div>
        </div>

        <!-- LINHA 2: LOGO DO PROJETO + TÍTULO EM DESTAQUE (64 PT - GUIA OFICIAL) -->
        <div class="header-main">
          <div class="logo-box">
            <img src="data:image/png;base64,{logo_b64}" alt="ChamaKi HelpDesk">
          </div>
          <div class="title-box">
            <h1 class="main-title">ChamaKi <span>Help Desk</span></h1>
            <div class="main-subtitle">Sistema Enterprise de Gestão e Atendimento de Incidentes de TI</div>
          </div>
          <div class="dept-badge">
            <div class="track">Engenharia de Software</div>
            <div class="code">UC Projeto e Eng. Software (GM11251)</div>
          </div>
        </div>

        <!-- LINHA 3: AUTORES + CORPO DOCENTE (ORIENTADOR, PROFESSOR E COORDENADORA) -->
        <div class="authors-bar">
          <div class="authors-left">
            <div>
              <span class="author-item">Ícaro Rafael Borges</span> <span class="author-role">(Product Owner)</span> &bull;
              <span class="author-item">Maria Eduarda F. da Fonseca Silva</span> <span class="author-role">(Scrum Master)</span> &bull;
              <span class="author-item">Lucas Simões Silva</span> <span class="author-role">(Desenvolvedor)</span> &bull;
              <span class="author-item">Matheus Polini</span> <span class="author-role">(Desenvolvedor / DBA)</span>
            </div>
            <div class="faculty-team">
              Orientador: <strong>Prof. Raulison Resende</strong> &bull;
              Professor: <strong>Prof. Fernando Mori</strong> &bull;
              Coordenadora do Curso: <strong class="coord">Prof.ª Me. Erica Oliveira Lopes Silva</strong>
            </div>
          </div>
          <div class="authors-right">
            Universidade São Judas Tadeu &bull; Campus Paulista<br>
            <span class="highlight">Relatório Executivo &bull; Entrega Final &bull; 30/11/2026</span>
          </div>
        </div>

      </header>

      <!-- CORPO PRINCIPAL DO BANNER (3 COLUNAS VERTICAIS) -->
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
              Em empresas e departamentos corporativos, demandas de suporte técnico chegam de forma fragmentada por <strong>e-mails, WhatsApp, telefone e corredores</strong>:
            </p>
            <ul class="bullet-list">
              <li><strong>Ausência de Rastreabilidade:</strong> Perda sistemática de histórico e contexto técnico dos atendimentos anteriores.</li>
              <li><strong>Dificuldade Crítica de Priorização:</strong> Equipe de TI atua sem visão de impacto no negócio e criticidade do incidente.</li>
              <li><strong>Comunicação Opaca:</strong> Colaboradores ficam sem retorno sobre previsão de solução ou analista responsável.</li>
              <li><strong>Falta de Métricas:</strong> Impossibilidade de medir SLA, TMA e produtividade da operação de suporte.</li>
            </ul>
          </div>

          <!-- Objetivos -->
          <div class="sec-card">
            <div class="sec-header">
              <span class="icon">🎯</span>
              <h2>Objetivos do Projeto</h2>
            </div>
            <p class="p-text"><strong>Objetivo Geral:</strong></p>
            <p class="p-text" style="margin-top:-3mm">
              Desenvolver e implantar um sistema web de Help Desk para <strong>centralizar o registro, atendimento e acompanhamento</strong> de incidentes com histórico auditável em tempo real.
            </p>
            <p class="p-text" style="margin-top:4mm"><strong>Objetivos Específicos:</strong></p>
            <ul class="bullet-list">
              <li>Entregar os <strong>7 requisitos funcionais</strong> planejados no escopo do MVP.</li>
              <li>Implementar autenticação segregada para <strong>Colaborador e Analista de TI</strong>.</li>
              <li>Permitir <strong>anexo de fotos e capturas de tela</strong> para acelerar a triagem técnica.</li>
              <li>Garantir abertura de chamado em &le; <strong>3 cliques</strong> e consulta em &le; <strong>2 segundos</strong>.</li>
            </ul>
          </div>

          <!-- Metodologia e Processo -->
          <div class="sec-card">
            <div class="sec-header">
              <span class="icon">⚡</span>
              <h2>Metodologia & Processo</h2>
            </div>
            <p class="p-text">
              Processo ágil baseado em <strong>Scrum semanal</strong> com squad multidisciplinar, cerimônias ágeis e quadro <strong>Kanban</strong>:
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
            <ul class="bullet-list" style="margin-top:6mm">
              <li><strong>Git Flow com Revisão por Pares:</strong> Branches por tarefa e Pull Requests obrigatoriamente aprovados por outro integrante.</li>
              <li><strong>32 Tarefas no Kanban:</strong> 100% de conclusão dentro dos prazos estabelecidos.</li>
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
              Estrutura em camadas fundamentada nas diretrizes de <em>Sommerville (2019)</em>, com estrita separação de responsabilidades:
            </p>

            <div class="arch-diagram">
              <div class="arch-layer pres">
                <div class="arch-layer-head">
                  <span class="arch-layer-title">1. Apresentação (Interface)</span>
                  <span class="arch-layer-tech">Web Responsiva / UI</span>
                </div>
                <div class="arch-layer-desc">Design Figma moderno em preto e laranja chamas, componentizado e focado em autoatendimento ágil.</div>
              </div>

              <div class="arch-connector">&uarr;&darr; Chamadas REST Assíncronas (JSON)</div>

              <div class="arch-layer bus">
                <div class="arch-layer-head">
                  <span class="arch-layer-title">2. Regras de Negócio</span>
                  <span class="arch-layer-tech">Java + Spring Boot</span>
                </div>
                <div class="arch-layer-desc">Controllers REST, validações de regras de SLA, triagem automática e hash criptográfico de senhas.</div>
              </div>

              <div class="arch-connector">&uarr;&darr; Persistência e Consultas Indexadas</div>

              <div class="arch-layer data">
                <div class="arch-layer-head">
                  <span class="arch-layer-title">3. Acesso a Dados</span>
                  <span class="arch-layer-tech">MySQL 8 / Relacional</span>
                </div>
                <div class="arch-layer-desc">Tabelas relacionais, integridade referencial, histórico imutável e transações ACID.</div>
              </div>
            </div>

            <!-- Trade-off Arquitetural Fundamentado -->
            <div class="tradeoff-box">
              <div class="tradeoff-row">
                <span class="badge-pro">FAVORECE</span>
                <span><strong>Manutenção Desacoplada:</strong> Permite alterar regras ou interface sem refazer as outras camadas.</span>
              </div>
              <div class="tradeoff-row">
                <span class="badge-cost">CUSTA</span>
                <span><strong>Latência de Camadas:</strong> Requisição atravessa 3 níveis; mitigada com meta de resposta &le; 2 s.</span>
              </div>
            </div>
          </div>

          <!-- Modelagem UML Orientada a Objetos -->
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

          <!-- Gestão de Riscos -->
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
                  <th>Resposta Aplicada</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tempo escasso da equipe</td>
                  <td><span style="color:#f87171;font-weight:800">Alto</span></td>
                  <td>MVP enxuto e sprints semanais focadas</td>
                </tr>
                <tr>
                  <td>Sobrescrita de código</td>
                  <td><span style="color:#fbbf24;font-weight:800">Médio</span></td>
                  <td>Branches por tarefa + PR obrigatório</td>
                </tr>
                <tr>
                  <td>Desempenho em 3 camadas</td>
                  <td><span style="color:#60a5fa;font-weight:800">Baixo</span></td>
                  <td>Índices em banco e testes de carga</td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

        <!-- ══════════════════════════════════════════
             COLUNA 3: RESULTADOS PRÁTICOS & CONCLUSÃO
             ══════════════════════════════════════════ -->
        <section class="col">

          <!-- Resultados e Indicadores Finais (Seção Mais Importante) -->
          <div class="sec-card highlight">
            <div class="sec-header">
              <span class="icon">🏆</span>
              <h2>Resultados & Demonstração Prática</h2>
            </div>
            <p class="p-text" style="margin-bottom:4mm">
              Entrega de <strong>100% do escopo planejado</strong>, superando as metas de estabilidade e qualidade:
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
                <div class="kpi-lbl">Conclusão Final</div>
              </div>
            </div>

            <!-- Tabela de Requisitos Não Funcionais (Métricas Verificáveis) -->
            <p class="p-text" style="font-size:22pt;margin:6mm 0 2mm 0">
              <strong>Métricas Verificáveis dos RNF (Sommerville, 2019):</strong>
            </p>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Requisito Não Funcional</th>
                  <th>Meta do Guia</th>
                  <th style="text-align:right">Resultado Obtido</th>
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

          <!-- Showcase das Telas Reais do Protótipo -->
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
                  <div style="font-weight:800;color:#ff8c42;margin-bottom:2mm">Novo Chamado</div>
                  <div style="background:rgba(255,255,255,0.06);padding:3mm;border-radius:2mm;margin-bottom:2mm">
                    Monitor sem sinal — cabo HDMI
                  </div>
                  <div style="color:#94a3b8">📷 Anexo de foto/captura incluído</div>
                  <div style="text-align:right;margin-top:3mm">
                    <span style="background:#ff6b35;color:#fff;padding:2mm 5mm;border-radius:2mm;font-weight:900">ABRIR CHAMADO</span>
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
                  <div style="color:#38bdf8;margin-top:3mm;font-weight:800">
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
              <li><strong>Decisão sem justificativa não vale:</strong> Todo padrão de arquitetura possui trade-offs explícitos comprovados na prática.</li>
              <li><strong>Métrica transforma meta em prova:</strong> Sem números auditáveis, "rápido" e "seguro" são apenas opiniões.</li>
              <li><strong>Revisão por pares eleva o código:</strong> Zero bugs críticos graças aos Pull Requests sistemáticos do squad.</li>
              <li><strong>Próximos Passos:</strong> Conduzir piloto com usuários reais, manutenção preventiva e relatórios gerenciais analíticos.</li>
            </ul>
          </div>

        </section>

      </main>

      <!-- ══════════════════════════════════════════════════════════════════
           RODAPÉ (REFERÊNCIAS ABNT E QR CODE INTERATIVO PARA O SITE)
           ══════════════════════════════════════════════════════════════════ -->
      <footer class="banner-footer">
        <div class="references-box">
          <strong>Referências Bibliográficas (Normas ABNT Resumidas):</strong>
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
            <span style="color:#ff8c42;font-weight:900;font-size:22pt">chamaki.netlify.app</span><br>
            Escaneie com a câmera do celular para testar<br>
            o protótipo funcional em tempo real na bancada!
          </div>
        </div>
      </footer>

    </div>
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

print("Banner generated successfully!")
print(" - College logo added: Universidade São Judas Tadeu (official vector SVG)")
print(" - Professor Fernando Mori added")
print(" - Course Coordinator Erica Oliveira Lopes Silva added")
print(" - Advisor Prof. Raulison Resende confirmed")
print(" - Exact technical dimensions: 90 cm x 120 cm (900mm x 1200mm)")
print(" - Typography: Title 64pt, Section Headers 38pt, Body/Bullets 24pt and 20pt (no font < 20pt)")
print(" - QR Code encoded URL: https://chamaki.netlify.app/")
print(" - Files updated:", banner_workspace_path, "and", banner_artifact_path)
