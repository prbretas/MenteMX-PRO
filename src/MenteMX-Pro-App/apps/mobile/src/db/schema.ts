/**
 * Schema SQLite com Drizzle ORM — MenteMX Pro
 * 9 entidades: pilot, bike, event, session, lap, setup,
 * mx_score_history, streak_milestone, pending_operation
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ─── 1. PILOT ──────────────────────────────────────────────────────
export const pilot = sqliteTable('pilot', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  currentStreak: integer('current_streak').notNull().default(0),
  recordStreak: integer('record_streak').notNull().default(0),
  lastSessionDate: text('last_session_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deviceId: text('device_id'),
});

// ─── 2. BIKE ───────────────────────────────────────────────────────
export const bike = sqliteTable('bike', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  displacementCc: integer('displacement_cc').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── 3. EVENT ──────────────────────────────────────────────────────
export const event = sqliteTable('event', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  name: text('name').notNull(),
  eventDate: text('event_date').notNull(),
  type: text('type', { enum: ['race', 'training'] }).notNull(),
  location: text('location'),
  startPosition: integer('start_position'),
  holeshot: integer('holeshot', { mode: 'boolean' }),
  finalPosition: integer('final_position'),
  status: text('status', { enum: ['scheduled', 'completed'] }).notNull().default('scheduled'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── 4. SESSION ────────────────────────────────────────────────────
export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  bikeId: text('bike_id').references(() => bike.id),
  eventId: text('event_id').references(() => event.id),
  lapCount: integer('lap_count').notNull().default(0),
  bestLapMs: integer('best_lap_ms'),
  avgLapMs: real('avg_lap_ms'),
  consistencyIndex: real('consistency_index'),
  mentalScore: integer('mental_score'),
  physicalScore: integer('physical_score'),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  updatedAt: text('updated_at').notNull(),
});

// ─── 5. LAP ────────────────────────────────────────────────────────
export const lap = sqliteTable('lap', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => session.id),
  lapNumber: integer('lap_number').notNull(),
  lapTimeMs: integer('lap_time_ms').notNull(),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
  recordedAt: text('recorded_at').notNull(),
});

// ─── 6. SETUP ──────────────────────────────────────────────────────
export const setup = sqliteTable('setup', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  bikeId: text('bike_id').references(() => bike.id),
  terrain: text('terrain', { enum: ['mud', 'sand', 'mixed'] }).notNull(),
  frontCompressionClicks: integer('front_compression_clicks'),
  frontReboundClicks: integer('front_rebound_clicks'),
  rearCompressionClicks: integer('rear_compression_clicks'),
  rearReboundClicks: integer('rear_rebound_clicks'),
  rearLinkHeightMm: real('rear_link_height_mm'),
  frontTirePressure: real('front_tire_pressure'),
  rearTirePressure: real('rear_tire_pressure'),
  tireBrandModel: text('tire_brand_model'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── 7. MX_SCORE_HISTORY ───────────────────────────────────────────
export const mxScoreHistory = sqliteTable('mx_score_history', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  score: integer('score').notNull(),
  bestTimeFactor: real('best_time_factor').notNull(),
  consistencyFactor: real('consistency_factor').notNull(),
  frequencyFactor: real('frequency_factor').notNull(),
  evolutionFactor: real('evolution_factor').notNull(),
  calculatedAt: text('calculated_at').notNull(),
});

// ─── 8. STREAK_MILESTONE ───────────────────────────────────────────
export const streakMilestone = sqliteTable('streak_milestone', {
  id: text('id').primaryKey(),
  pilotId: text('pilot_id').notNull().references(() => pilot.id),
  milestoneDays: integer('milestone_days').notNull(),
  achievedAt: text('achieved_at').notNull(),
});

// ─── 9. PENDING_OPERATION ──────────────────────────────────────────
export const pendingOperation = sqliteTable('pending_operation', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  opType: text('op_type', { enum: ['INSERT', 'UPDATE', 'DELETE'] }).notNull(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  payload: text('payload').notNull(), // JSON stringified
  createdAt: text('created_at').notNull(),
  synced: integer('synced', { mode: 'boolean' }).notNull().default(false),
});
