-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a simple keep-alive function that queries the database
CREATE OR REPLACE FUNCTION keep_alive()
RETURNS void AS $$
BEGIN
  -- Simple query to keep the database active
  PERFORM 1;
  -- Log the keep-alive ping (optional)
  RAISE NOTICE 'Keep-alive ping at %', now();
END;
$$ LANGUAGE plpgsql;

-- Schedule the keep-alive function to run every 30 minutes
-- This prevents the project from going to sleep due to inactivity
SELECT cron.schedule(
  'keep-alive-ping',
  '*/30 * * * *', -- every 30 minutes
  'SELECT keep_alive();'
);