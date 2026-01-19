const mysql = require('mysql2/promise');

async function addOAuthColumns() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'rootpass',
      database: 'artofkaren'
    });

    console.log('🔄 Adding OAuth columns to users table...');

    // Add google_id column
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN google_id VARCHAR(255) UNIQUE
      `);
      console.log('✅ Added google_id column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  google_id column already exists');
      } else {
        throw error;
      }
    }

    // Add provider column
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN provider VARCHAR(50) DEFAULT 'local'
      `);
      console.log('✅ Added provider column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  provider column already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ OAuth columns migration completed!');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addOAuthColumns();
