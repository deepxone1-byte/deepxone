-- Migration: Add reference_id to contact_submissions
-- Date: 2026-02-07
-- Description: Adds a unique reference ID for contact form submissions

ALTER TABLE contact_submissions
ADD COLUMN reference_id VARCHAR(50) NULL AFTER id;

CREATE UNIQUE INDEX idx_reference_id ON contact_submissions(reference_id);
