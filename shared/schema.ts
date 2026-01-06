import { pgTable, serial, text, timestamp, integer, varchar, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Sessions table - for tracking visitor sessions without cookies
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fingerprint: varchar('fingerprint', { length: 64 }).notNull(),
  firstSeen: timestamp('first_seen').defaultNow().notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
  visitCount: integer('visit_count').default(1).notNull(),
});

// Page visits table
export const pageVisits = pgTable('page_visits', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }), // Supports IPv6
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  // Geolocation data (populated via API)
  country: varchar('country', { length: 100 }),
  countryCode: varchar('country_code', { length: 2 }),
  city: varchar('city', { length: 100 }),
  region: varchar('region', { length: 100 }),
  // Page metadata
  path: varchar('path', { length: 500 }).default('/'),
});

// Link clicks table
export const linkClicks = pgTable('link_clicks', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  linkUrl: text('link_url').notNull(),
  linkLabel: varchar('link_label', { length: 200 }),
  referrerPath: varchar('referrer_path', { length: 500 }),
});

// Chat conversations table (groups messages by session)
export const chatConversations = pgTable('chat_conversations', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  messageCount: integer('message_count').default(0).notNull(),
  // Metadata
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
});

// Chat messages table (individual messages)
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => chatConversations.id).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  // Token usage for AI messages
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
});

// Relations
export const sessionsRelations = relations(sessions, ({ many }) => ({
  pageVisits: many(pageVisits),
  linkClicks: many(linkClicks),
  chatConversations: many(chatConversations),
}));

export const pageVisitsRelations = relations(pageVisits, ({ one }) => ({
  session: one(sessions, {
    fields: [pageVisits.sessionId],
    references: [sessions.id],
  }),
}));

export const linkClicksRelations = relations(linkClicks, ({ one }) => ({
  session: one(sessions, {
    fields: [linkClicks.sessionId],
    references: [sessions.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  session: one(sessions, {
    fields: [chatConversations.sessionId],
    references: [sessions.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

// Type exports for use in application
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type PageVisit = typeof pageVisits.$inferSelect;
export type NewPageVisit = typeof pageVisits.$inferInsert;
export type LinkClick = typeof linkClicks.$inferSelect;
export type NewLinkClick = typeof linkClicks.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
