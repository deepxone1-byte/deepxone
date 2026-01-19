// Script to create artofkaren database in MySQL
const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpass',
  });

  try {
    console.log('Connected to MySQL');

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS artofkaren CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✓ Database "artofkaren" created or already exists');

    // Show databases to confirm
    const [databases] = await connection.query('SHOW DATABASES LIKE "artofkaren"');
    if (databases.length > 0) {
      console.log('✓ Confirmed: artofkaren database exists');
    }

  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createDatabase();
