-- MenteMX Pro - Initial Schema Migration
-- 9 entidades: pilot, bike, event, session, lap, setup,
-- mx_score_history, streak_milestone, pending_operation

CREATE TABLE IF NOT EXISTS pilot (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  record_streak INTEGER NOT NULL DEFAULT 0,
  last_session_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  device_id TEXT
);

CREATE TABLE IF NOT EXISTS bike (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  displacement_cc INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('race', 'training')),
  location TEXT,
  start_position INTEGER,
  holeshot INTEGER,
  final_position INTEGER,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  bike_id TEXT REFERENCES bike(id),
  event_id TEXT REFERENCES event(id),
  lap_count INTEGER NOT NULL DEFAULT 0,
  best_lap_ms INTEGER,
  avg_lap_ms REAL,
  consistency_index REAL,
  mental_score INTEGER,
  physical_score INTEGER,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lap (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES session(id),
  lap_number INTEGER NOT NULL,
  lap_time_ms INTEGER NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  recorded_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS setup (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  bike_id TEXT REFERENCES bike(id),
  terrain TEXT NOT NULL CHECK(terrain IN ('mud', 'sand', 'mixed')),
  front_compression_clicks INTEGER,
  front_rebound_clicks INTEGER,
  rear_compression_clicks INTEGER,
  rear_rebound_clicks INTEGER,
  rear_link_height_mm REAL,
  front_tire_pressure REAL,
  rear_tire_pressure REAL,
  tire_brand_model TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mx_score_history (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  score INTEGER NOT NULL,
  best_time_factor REAL NOT NULL,
  consistency_factor REAL NOT NULL,
  frequency_factor REAL NOT NULL,
  evolution_factor REAL NOT NULL,
  calculated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS streak_milestone (
  id TEXT PRIMARY KEY,
  pilot_id TEXT NOT NULL REFERENCES pilot(id),
  milestone_days INTEGER NOT NULL,
  achieved_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pending_operation (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  op_type TEXT NOT NULL CHECK(op_type IN ('INSERT', 'UPDATE', 'DELETE')),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  synced INTEGER NOT NULL DEFAULT 0
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_bike_pilot ON bike(pilot_id);
CREATE INDEX IF NOT EXISTS idx_event_pilot ON event(pilot_id);
CREATE INDEX IF NOT EXISTS idx_event_date ON event(event_date);
CREATE INDEX IF NOT EXISTS idx_session_pilot ON session(pilot_id);
CREATE INDEX IF NOT EXISTS idx_session_bike ON session(bike_id);
CREATE INDEX IF NOT EXISTS idx_lap_session ON lap(session_id);
CREATE INDEX IF NOT EXISTS idx_setup_pilot ON setup(pilot_id);
CREATE INDEX IF NOT EXISTS idx_mx_score_pilot ON mx_score_history(pilot_id);
CREATE INDEX IF NOT EXISTS idx_streak_pilot ON streak_milestone(pilot_id);
CREATE INDEX IF NOT EXISTS idx_pending_synced ON pending_operation(synced);
