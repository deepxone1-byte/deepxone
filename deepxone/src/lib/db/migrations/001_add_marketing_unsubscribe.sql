-- Migration: Add marketing unsubscribe functionality
-- Date: 2026-02-07
-- Description: Adds unsubscribed_at column to contact_submissions and creates marketing_unsubscribes table

-- Add unsubscribed_at column to contact_submissions
ALTER TABLE contact_submissions
ADD COLUMN unsubscribed_at TIMESTAMP NULL DEFAULT NULL;

-- Create marketing_unsubscribes table for compliance tracking
CREATE TABLE IF NOT EXISTS marketing_unsubscribes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    unsubscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email),
    INDEX idx_unsubscribed_at (unsubscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
