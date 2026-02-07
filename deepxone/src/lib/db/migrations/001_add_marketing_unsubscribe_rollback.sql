-- Rollback: Remove marketing unsubscribe functionality
-- Date: 2026-02-07

-- Drop the marketing_unsubscribes table
DROP TABLE IF EXISTS marketing_unsubscribes;

-- Remove unsubscribed_at column from contact_submissions
ALTER TABLE contact_submissions
DROP COLUMN unsubscribed_at;
