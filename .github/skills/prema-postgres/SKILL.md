# PREMA PostgreSQL Schema & Query Best Practices

## Overview
Database schema design, indexing, Row Level Security (RLS), and query performance guidelines for PREMA.

---

## 🗄️ Database Architecture & Privacy Controls

1. **Strict RLS Enforcement**:
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE safety_events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
   ```
2. **User Data Access Policy Example**:
   ```sql
   CREATE POLICY "Users can view matched partner profiles"
     ON profiles FOR SELECT
     USING (
       auth.uid() = id OR
       EXISTS (
         SELECT 1 FROM matches
         WHERE (user_1 = auth.uid() AND user_2 = profiles.id)
            OR (user_2 = auth.uid() AND user_1 = profiles.id)
       )
     );
   ```
3. **Performance Indexing**:
   - Create B-Tree indexes on foreign keys (`user_id`, `match_id`, `conversation_id`).
   - Create GIN indexes on JSONB fields (`astrology_data`, `personality_vectors`).
   - Create Spatial indexes (PostGIS or earthdistance) for city-level radius queries.
4. **Data Types**: Use native `UUID` for primary keys, `TIMESTAMPTZ` for timestamps, and `DECIMAL` for currency values.
