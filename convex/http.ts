import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS pre-flight
http.route({
  path: "/api/tickets",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/tickets/create",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/tickets/reply",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/tickets/delete",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/auth/login",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

http.route({
  path: "/api/auth/register",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// Health check
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "online", timestamp: new Date().toISOString() }),
      { status: 200, headers: corsHeaders }
    );
  }),
});

// GET /api/tickets
http.route({
  path: "/api/tickets",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const tickets = await ctx.runQuery(api.tickets.list, {});
      return new Response(JSON.stringify(tickets), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }),
});

// POST /api/tickets/create
http.route({
  path: "/api/tickets/create",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const ticketId = await ctx.runMutation(api.tickets.create, {
        title: body.title,
        category: body.category,
        priority: body.priority,
        description: body.description,
        photo: body.photo,
        authorName: body.authorName,
        authorEmail: body.authorEmail,
      });
      return new Response(JSON.stringify({ success: true, ticketId }), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }),
});

// POST /api/tickets/reply
http.route({
  path: "/api/tickets/reply",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      await ctx.runMutation(api.tickets.addReply, {
        ticketId: body.ticketId,
        authorName: body.authorName,
        message: body.message,
        photo: body.photo,
      });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }),
});

// POST /api/tickets/delete
http.route({
  path: "/api/tickets/delete",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const result = await ctx.runMutation(api.tickets.remove, { ticketId: body.ticketId });
      return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }),
});

// POST /api/auth/login
http.route({
  path: "/api/auth/login",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const user = await ctx.runMutation(api.auth.login, {
        email: body.email,
        password: body.password,
      });
      return new Response(JSON.stringify(user), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 401, headers: corsHeaders });
    }
  }),
});

// POST /api/auth/register
http.route({
  path: "/api/auth/register",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const user = await ctx.runMutation(api.auth.register, {
        name: body.name,
        email: body.email,
        password: body.password,
        type: body.type,
        dept: body.dept,
        cargo: body.cargo,
      });
      return new Response(JSON.stringify(user), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: corsHeaders });
    }
  }),
});

// POST /api/seed
http.route({
  path: "/api/seed",
  method: "POST",
  handler: httpAction(async (ctx) => {
    try {
      const result = await ctx.runMutation(api.seed.seedData, {});
      return new Response(JSON.stringify({ message: result }), { status: 200, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }),
});

export default http;
