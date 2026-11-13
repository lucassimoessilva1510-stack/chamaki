import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple SHA-256 hash (runs on Convex server via Web Crypto)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "__chamaki_salt__");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Register a new user
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    type: v.union(v.literal("cli"), v.literal("tec")),
    dept: v.optional(v.string()),
    cargo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("E-mail ja cadastrado.");
    }

    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      type: args.type,
      dept: args.dept,
      cargo: args.cargo,
    });

    return {
      _id: userId,
      name: args.name,
      email: args.email,
      type: args.type,
      dept: args.dept,
      cargo: args.cargo,
    };
  },
});

// Login
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("E-mail nao encontrado.");
    }

    const passwordHash = await hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new Error("Senha incorreta.");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      dept: user.dept,
      cargo: user.cargo,
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    newEmail: v.optional(v.string()),
    dept: v.optional(v.string()),
    cargo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("Usuario nao encontrado.");

    const updates: any = { name: args.name };
    if (args.newEmail) updates.email = args.newEmail;
    if (args.dept !== undefined) updates.dept = args.dept;
    if (args.cargo !== undefined) updates.cargo = args.cargo;

    await ctx.db.patch(user._id, updates);
    return { ...user, ...updates };
  },
});

// Check if an email belongs to a tech user
export const checkTechEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user?.type === "tec";
  },
});

// Get all tech users
export const listTechs = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => u.type === "tec")
      .map((u) => ({ name: u.name, email: u.email, dept: u.dept, cargo: u.cargo }));
  },
});
