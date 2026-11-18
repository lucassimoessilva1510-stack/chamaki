import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    type: v.union(v.literal("cli"), v.literal("tec")),
    dept: v.optional(v.string()),
    cargo: v.optional(v.string()),
    avatar: v.optional(v.string()),
  }).index("by_email", ["email"]),

  tickets: defineTable({
    ticketId: v.string(),
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    status: v.string(),
    authorName: v.string(),
    authorEmail: v.string(),
    assigneeName: v.optional(v.string()),
    photo: v.optional(v.string()),
    timeline: v.array(
      v.object({
        time: v.string(),
        message: v.string(),
        type: v.string(),
        authorType: v.optional(v.union(v.literal("cli"), v.literal("tec"))),
        photo: v.optional(v.string()),
      })
    ),
  })
    .index("by_ticketId", ["ticketId"])
    .index("by_status", ["status"])
    .index("by_authorEmail", ["authorEmail"]),

  counter: defineTable({
    name: v.string(),
    value: v.number(),
  }).index("by_name", ["name"]),
});
