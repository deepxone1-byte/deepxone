import fs from 'fs';
import path from 'path';
import pool from '../config/database';
import logger from '../config/logger';

async function runMigration() {
  try {
    logger.info('Starting database migration...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and filter out empty statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    const connection = await pool.getConnection();

    try {
      for (const statement of statements) {
        const trimmed = statement.trim();
        if (trimmed.toLowerCase().includes('create table')) {
          const tableName = trimmed.match(/create table[^`]*`?(\w+)`?/i)?.[1] || 'unknown';
          logger.info(`Creating table: ${tableName}`);
          await connection.query(statement);
        }
      }

      logger.info('✅ Database migration completed successfully');
    } finally {
      connection.release();
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
