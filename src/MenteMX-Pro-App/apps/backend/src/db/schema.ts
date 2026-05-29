/**
 * Schema PostgreSQL com Drizzle ORM — MenteMX Pro Backend
 * Espelha as 9 entidades do schema SQLite do mobile.
 */

import { pgTable, text, integer, real, boolean, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ─────────────────────────────────────────────────────────
export const eventTypeEnum = pgEnum('event_type', ['race', 'training']);
export const eventStatusEnum = pgEnum('event_status', ['scheduled', 'completed']);
export const terrainEnum = pgEnum('terrain_type', ['mud', 'sand', 'mixed']);
export const opTypeEnum = pgEnum('op_type', ['INSERT', 'UPDATE', 'DELETE']);

// ─── 1. PILOT ──────────────────────────────────────────────────────
export const pilot = pgTable('pilot', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  currentStreak: integer('current_streak').notNull().default(0),
  recordStreak: integer('record_streak').notNull().default(0),
  lastSessionDate: timestamp('last_session_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deviceId: text('device_id'),
});

// ─── 2. BIKE ───────────────────────────────────────────────────────
export const bike = pgTable('bike', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  displacementCc: integer('displacement_cc').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── 3. EVENT ──────────────────────────────────────────────────────
export const event = pgTable('event', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  name: text('name').notNull(),
  eventDate: timestamp('event_date').notNull(),
  type: eventTypeEnum('type').notNull(),
  location: text('location'),
  startPosition: integer('start_position'),
  holeshot: boolean('holeshot'),
  finalPosition: integer('final_position'),
  status: eventStatusEnum('status').notNull().default('scheduled'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── 4. SESSION ────────────────────────────────────────────────────
export const session = pgTable('session', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  bikeId: uuid('bike_id').references(() => bike.id),
  eventId: uuid('event_id').references(() => event.id),
  lapCount: integer('lap_count').notNull().default(0),
  bestLapMs: integer('best_lap_ms'),
  avgLapMs: real('avg_lap_ms'),
  consistencyIndex: real('consistency_index'),
  mentalScore: integer('mental_score'),
  physicalScore: integer('physical_score'),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── 5. LAP ────────────────────────────────────────────────────────
export const lap = pgTable('lap', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => session.id),
  lapNumber: integer('lap_number').notNull(),
  lapTimeMs: integer('lap_time_ms').notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  recordedAt: timestamp('recorded_at').notNull(),
});

// ─── 6. SETUP ──────────────────────────────────────────────────────
export const setup = pgTable('setup', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  bikeId: uuid('bike_id').references(() => bike.id),
  terrain: terrainEnum('terrain').notNull(),
  frontCompressionClicks: integer('front_compression_clicks'),
  frontReboundClicks: integer('front_rebound_clicks'),
  rearCompressionClicks: integer('rear_compression_clicks'),
  rearReboundClicks: integer('rear_rebound_clicks'),
  rearLinkHeightMm: real('rear_link_height_mm'),
  frontTirePressure: real('front_tire_pressure'),
  rearTirePressure: real('rear_tire_pressure'),
  tireBrandModel: text('tire_brand_model'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── 7. MX_SCORE_HISTORY ───────────────────────────────────────────
export const mxScoreHistory = pgTable('mx_score_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  score: integer('score').notNull(),
  bestTimeFactor: real('best_time_factor').notNull(),
  consistencyFactor: real('consistency_factor').notNull(),
  frequencyFactor: real('frequency_factor').notNull(),
  evolutionFactor: real('evolution_factor').notNull(),
  calculatedAt: timestamp('calculated_at').notNull().defaultNow(),
});

// ─── 8. STREAK_MILESTONE ───────────────────────────────────────────
export const streakMilestone = pgTable('streak_milestone', {
  id: uuid('id').primaryKey().defaultRandom(),
  pilotId: uuid('pilot_id').notNull().references(() => pilot.id),
  milestoneDays: integer('milestone_days').notNull(),
  achievedAt: timestamp('achieved_at').notNull().defaultNow(),
});

// ─── 9. PENDING_OPERATION ──────────────────────────────────────────
export const pendingOperation = pgTable('pending_operation', {
  id: uuid('id').primaryKey().defaultRandom(),
  deviceId: text('device_id').notNull(),
  opType: opTypeEnum('op_type').notNull(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  payload: text('payload').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  synced: boolean('synced').notNull().default(false),
});
