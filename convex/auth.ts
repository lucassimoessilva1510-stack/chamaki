import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

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
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailNorm = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) throw new ConvexError("Informe um e-mail valido.");
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", emailNorm))
      .first();

    if (existing) {
      throw new ConvexError("E-mail já cadastrado.");
    }

    if (!args.name.trim()) throw new ConvexError("Informe seu nome.");
    if (args.password.length < 6) throw new ConvexError("Senha: minimo 6 caracteres.");
    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: emailNorm,
      passwordHash,
      type: args.type,
      dept: args.dept,
      cargo: args.cargo,
      avatar: args.avatar,
    });

    return {
      _id: userId,
      name: args.name.trim(),
      email: emailNorm,
      type: args.type,
      dept: args.dept,
      cargo: args.cargo,
      avatar: args.avatar,
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
    const emailNorm = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", emailNorm))
      .first();

    if (!user) {
      throw new ConvexError("E-mail não cadastrado.");
    }

    const passwordHash = await hashPassword(args.password);
    const isMatch = user.passwordHash === passwordHash;

    if (!isMatch) {
      throw new ConvexError("Senha incorreta.");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      dept: user.dept,
      cargo: user.cargo,
      avatar: user.avatar,
    };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    dept: v.optional(v.string()),
    cargo: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailNorm = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", emailNorm))
      .first();

    if (!user) throw new ConvexError("Usuário não encontrado.");

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.dept !== undefined) updates.dept = args.dept;
    if (args.cargo !== undefined) updates.cargo = args.cargo;
    if (args.avatar !== undefined) updates.avatar = args.avatar;

    await ctx.db.patch(user._id, updates);
    const { passwordHash: _passwordHash, ...profile } = { ...user, ...updates };
    return profile;
  },
});

// Get all tech users
export const listTechs = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => u.type === "tec")
      .map((u) => ({
        name: u.name,
        email: u.email,
        dept: u.dept,
        cargo: u.cargo,
        avatar: u.avatar,
      }));
  },
});
