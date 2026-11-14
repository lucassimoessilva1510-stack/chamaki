import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all tickets (real-time subscription)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tickets").order("desc").collect();
  },
});

// List tickets by author email
export const listByAuthor = query({
  args: { authorEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_authorEmail", (q) => q.eq("authorEmail", args.authorEmail))
      .order("desc")
      .collect();
  },
});

// Get a single ticket by ticketId
export const getByTicketId = query({
  args: { ticketId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .first();
  },
});

// Get next ticket number
async function getNextTicketNumber(ctx: any): Promise<string> {
  const counter = await ctx.db
    .query("counter")
    .withIndex("by_name", (q: any) => q.eq("name", "tickets"))
    .first();

  let num = 1;
  if (counter) {
    num = counter.value + 1;
    await ctx.db.patch(counter._id, { value: num });
  } else {
    await ctx.db.insert("counter", { name: "tickets", value: 1 });
  }
  return `CHK-${String(num).padStart(3, "0")}`;
}

// Create a new ticket
export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    description: v.optional(v.string()),
    photo: v.optional(v.string()),
    authorName: v.string(),
    authorEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const ticketId = await getNextTicketNumber(ctx);
    const now = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeline = [
      {
        time: now,
        message: `Chamado registrado por ${args.authorName}${args.description ? " — " + args.description : ""}.`,
        type: "file",
        photo: args.photo,
      },
    ];

    await ctx.db.insert("tickets", {
      ticketId,
      title: args.title,
      category: args.category,
      priority: args.priority,
      status: "Aberto",
      authorName: args.authorName,
      authorEmail: args.authorEmail,
      assigneeName: undefined,
      photo: args.photo,
      timeline,
    });

    return ticketId;
  },
});

// Assume a ticket (tech takes ownership)
export const assume = mutation({
  args: {
    ticketId: v.string(),
    techName: v.string(),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .first();
    if (!ticket) throw new Error("Chamado não encontrado");

    const now = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    await ctx.db.patch(ticket._id, {
      status: "Em Atendimento",
      assigneeName: args.techName,
      timeline: [
        ...ticket.timeline,
        {
          time: now,
          message: `Chamado assumido por ${args.techName}.`,
          type: "wrench",
        },
      ],
    });
  },
});

// Resolve a ticket
export const resolve = mutation({
  args: { ticketId: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .first();
    if (!ticket) throw new Error("Chamado não encontrado");

    const now = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    await ctx.db.patch(ticket._id, {
      status: "Resolvido",
      timeline: [
        ...ticket.timeline,
        {
          time: now,
          message: "Chamado resolvido com sucesso.",
          type: "check",
        },
      ],
    });
  },
});

// Add reply to ticket timeline
export const addReply = mutation({
  args: {
    ticketId: v.string(),
    authorName: v.string(),
    message: v.string(),
    photo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .first();
    if (!ticket) throw new Error("Chamado não encontrado");

    const now = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    await ctx.db.patch(ticket._id, {
      timeline: [
        ...ticket.timeline,
        {
          time: now,
          message: `${args.authorName}: ${args.message}`,
          type: "msg",
          photo: args.photo,
        },
      ],
    });
  },
});

// Delete ticket
export const remove = mutation({
  args: { ticketId: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .first();
    if (!ticket) throw new Error("Chamado não encontrado para exclusão.");

    await ctx.db.delete(ticket._id);
    return { success: true, ticketId: args.ticketId };
  },
});

// Stats query
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const tickets = await ctx.db.query("tickets").collect();
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Aberto").length;
    const inProgress = tickets.filter((t) => t.status === "Em Atendimento").length;
    const resolved = tickets.filter((t) => t.status === "Resolvido").length;
    return { total, open, inProgress, resolved };
  },
});
