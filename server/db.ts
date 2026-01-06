import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set - analytics features will be disabled');
}

// Neon connection for serverless environments (GCP Cloud Run)
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// Export database instance (null if not configured)
export const db = sql ? drizzle(sql, { schema }) : null;

// Type export
export type DB = NonNullable<typeof db>;

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return db !== null;
}
