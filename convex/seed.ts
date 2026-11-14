import { mutation } from "./_generated/server";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "__chamaki_salt__");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingCounter = await ctx.db
      .query("counter")
      .withIndex("by_name", (q) => q.eq("name", "tickets"))
      .first();
    if (existingCounter) {
      return "Dados já foram inseridos anteriormente.";
    }

    // ── Seed tech users ──
    const techs = [
      { name: "Ícaro Rafael Borges", email: "icaro@empresa.com", dept: "TI", cargo: "Product Owner" },
      { name: "Lucas Simões Silva", email: "lucas@empresa.com", dept: "TI", cargo: "Desenvolvedor" },
      { name: "Maria Eduarda F. da F. Silva", email: "maria@empresa.com", dept: "TI", cargo: "Scrum Master" },
      { name: "Matheus Polini", email: "matheus@empresa.com", dept: "TI", cargo: "Desenvolvedor / DBA" },
    ];
    const defaultHash = await hashPassword("123");

    for (const t of techs) {
      await ctx.db.insert("users", { ...t, passwordHash: defaultHash, type: "tec" as const, avatar: "" });
    }

    // ── Seed client users ──
    const clients = [
      { name: "Ana Costa", email: "ana@gmail.com" },
      { name: "Carlos Mendes", email: "carlos@outlook.com" },
      { name: "Fernanda Lima", email: "fernanda@gmail.com" },
      { name: "Roberto Alves", email: "roberto@hotmail.com" },
      { name: "Juliana Martins", email: "juliana@gmail.com" },
      { name: "Pedro Santos", email: "pedro@yahoo.com" },
    ];
    for (const c of clients) {
      await ctx.db.insert("users", { ...c, passwordHash: defaultHash, type: "cli" as const, avatar: "" });
    }

    // ── Seed tickets ──
    const tickets = [
      {
        ticketId: "CHK-001",
        title: "Impressora HP LaserJet não liga — 3º andar",
        category: "Impressora",
        priority: "high",
        status: "Aberto",
        authorName: "Ana Costa",
        authorEmail: "ana@gmail.com",
        timeline: [
          {
            time: "15/10 09:30",
            message: "Chamado registrado por Ana Costa — impressora sem resposta ao ligar. Modelo: HP LaserJet Pro M404dn.",
            type: "file",
          },
        ],
      },
      {
        ticketId: "CHK-002",
        title: "VPN corporativa desconecta após 10 minutos",
        category: "Rede / VPN",
        priority: "crit",
        status: "Em Atendimento",
        authorName: "Carlos Mendes",
        authorEmail: "carlos@outlook.com",
        assigneeName: "Matheus Polini",
        timeline: [
          {
            time: "16/10 14:00",
            message: "Chamado registrado por Carlos Mendes — VPN desconecta automaticamente.",
            type: "file",
          },
          {
            time: "16/10 15:20",
            message: "Chamado assumido por Matheus Polini.",
            type: "wrench",
          },
          {
            time: "17/10 10:00",
            message: "Matheus Polini: Verificando configurações de firewall corporativo e logs do servidor VPN.",
            type: "msg",
          },
        ],
      },
      {
        ticketId: "CHK-003",
        title: "Monitor externo sem sinal — cabo HDMI",
        category: "Hardware",
        priority: "med",
        status: "Resolvido",
        authorName: "Fernanda Lima",
        authorEmail: "fernanda@gmail.com",
        assigneeName: "Lucas Simões Silva",
        timeline: [
          { time: "14/10 08:45", message: "Chamado registrado por Fernanda Lima.", type: "file" },
          { time: "14/10 10:00", message: "Chamado assumido por Lucas Simões Silva.", type: "wrench" },
          { time: "14/10 11:30", message: "Lucas Simões Silva: Cabo HDMI substituído. Monitor funcionando perfeitamente.", type: "msg" },
          { time: "14/10 11:45", message: "Chamado resolvido com sucesso.", type: "check" },
        ],
      },
      {
        ticketId: "CHK-004",
        title: "Acesso negado ao sistema ERP — módulo financeiro",
        category: "Acesso / Permissões",
        priority: "high",
        status: "Aberto",
        authorName: "Roberto Alves",
        authorEmail: "roberto@hotmail.com",
        timeline: [
          { time: "18/10 07:50", message: "Chamado registrado — não consegue acessar o módulo de contas a pagar no ERP.", type: "file" },
        ],
      },
      {
        ticketId: "CHK-005",
        title: "Licença Office 365 não ativa no notebook",
        category: "Software",
        priority: "med",
        status: "Em Atendimento",
        authorName: "Juliana Martins",
        authorEmail: "juliana@gmail.com",
        assigneeName: "Maria Eduarda F. da F. Silva",
        timeline: [
          { time: "17/10 13:00", message: "Chamado registrado por Juliana Martins.", type: "file" },
          { time: "17/10 16:00", message: "Chamado assumido por Maria Eduarda F. da F. Silva.", type: "wrench" },
        ],
      },
      {
        ticketId: "CHK-006",
        title: "Teclado USB — teclas Enter e Espaço falhando",
        category: "Hardware",
        priority: "low",
        status: "Aberto",
        authorName: "Pedro Santos",
        authorEmail: "pedro@yahoo.com",
        timeline: [
          { time: "19/10 11:00", message: "Chamado registrado — teclado com teclas intermitentes.", type: "file" },
        ],
      },
      {
        ticketId: "CHK-007",
        title: "E-mail não recebe anexos acima de 5 MB",
        category: "E-mail",
        priority: "med",
        status: "Aberto",
        authorName: "Ana Costa",
        authorEmail: "ana@gmail.com",
        timeline: [
          { time: "20/10 08:15", message: "Chamado registrado — anexos grandes são rejeitados.", type: "file" },
        ],
      },
      {
        ticketId: "CHK-008",
        title: "Sistema de ponto eletrônico fora do ar",
        category: "Sistema Interno",
        priority: "crit",
        status: "Em Atendimento",
        authorName: "Roberto Alves",
        authorEmail: "roberto@hotmail.com",
        assigneeName: "Ícaro Rafael Borges",
        timeline: [
          { time: "20/10 09:00", message: "URGENTE: Sistema de ponto eletrônico inacessível.", type: "alert" },
          { time: "20/10 09:15", message: "Chamado assumido por Ícaro Rafael Borges — prioridade máxima.", type: "wrench" },
          { time: "20/10 10:30", message: "Ícaro Rafael Borges: Servidor reiniciado. Monitorando estabilidade do banco.", type: "msg" },
        ],
      },
      {
        ticketId: "CHK-009",
        title: "Setup completo de notebook novo — SO e aplicativos",
        category: "Software",
        priority: "low",
        status: "Resolvido",
        authorName: "Juliana Martins",
        authorEmail: "juliana@gmail.com",
        assigneeName: "Matheus Polini",
        timeline: [
          { time: "12/10 14:00", message: "Chamado registrado — notebook para onboarding de novo colaborador.", type: "file" },
          { time: "12/10 15:00", message: "Chamado assumido por Matheus Polini.", type: "wrench" },
          { time: "13/10 09:00", message: "Matheus Polini: SO, Office, antivírus e VPN instalados e testados.", type: "msg" },
          { time: "13/10 09:30", message: "Chamado resolvido com sucesso.", type: "check" },
        ],
      },
      {
        ticketId: "CHK-010",
        title: "Wi-Fi com sinal fraco no 2º andar — reuniões travando",
        category: "Rede / VPN",
        priority: "med",
        status: "Aberto",
        authorName: "Fernanda Lima",
        authorEmail: "fernanda@gmail.com",
        timeline: [
          { time: "21/10 10:30", message: "Chamado registrado — reuniões no Teams/Meet travando frequentemente.", type: "file" },
        ],
      },
      {
        ticketId: "CHK-011",
        title: "Projetor da sala de reuniões não conecta via HDMI",
        category: "Hardware",
        priority: "med",
        status: "Resolvido",
        authorName: "Carlos Mendes",
        authorEmail: "carlos@outlook.com",
        assigneeName: "Lucas Simões Silva",
        timeline: [
          { time: "10/10 16:00", message: "Chamado registrado por Carlos Mendes.", type: "file" },
          { time: "10/10 16:30", message: "Chamado assumido por Lucas Simões Silva.", type: "wrench" },
          { time: "10/10 17:15", message: "Lucas Simões Silva: Adaptador HDMI/Type-C substituído. Funcionando 100%.", type: "check" },
        ],
      },
      {
        ticketId: "CHK-012",
        title: "Criação de conta AD para novo colaborador — início 24/10",
        category: "Acesso / Permissões",
        priority: "high",
        status: "Aberto",
        authorName: "Ana Costa",
        authorEmail: "ana@gmail.com",
        timeline: [
          { time: "22/10 08:00", message: "Chamado registrado — acesso ao AD e e-mail necessário até 24/10.", type: "file" },
        ],
      },
    ];

    for (const t of tickets) {
      await ctx.db.insert("tickets", t as any);
    }

    // Set counter
    await ctx.db.insert("counter", { name: "tickets", value: 12 });

    return "Dados iniciais inseridos com sucesso! 4 técnicos, 6 colaboradores, 12 chamados.";
  },
});
