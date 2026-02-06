# Migration Note

This migration adds CircuitBreakerState and CronRun tables.

To apply manually:
1. Go to https://dashboard.render.com/d/dpg-d61r6sggjchc739rfqbg-a (PostgreSQL)
2. Click "Connect" → "PSQL Command"
3. Run: \i prisma/migrations/20260205120000_add_circuit_breaker_state/migration.sql

Or apply via Render Shell:
render psql north-polar-post-db < prisma/migrations/20260205120000_add_circuit_breaker_state/migration.sql
