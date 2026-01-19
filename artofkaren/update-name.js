const mysql = require('mysql2/promise');

async function updateName() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'rootpass',
      database: 'artofkaren'
    });

    console.log('🔄 Updating Karen\'s name to Karen Duplisea...');

    // Update user's full_name
    await connection.query(
      `UPDATE users SET full_name = 'Karen Duplisea' WHERE username = 'karen'`
    );
    console.log('✅ Updated user name in users table');

    // Update blog post 1 content
    await connection.query(
      `UPDATE blog_posts
       SET content = REPLACE(content, 'Karen Martinez', 'Karen Duplisea')
       WHERE title LIKE '%Journey from Traditional to Digital%'`
    );
    console.log('✅ Updated blog post 1 content');

    // Update blog post 2 content (if it mentions the name)
    await connection.query(
      `UPDATE blog_posts
       SET content = REPLACE(content, 'Karen Martinez', 'Karen Duplisea')
       WHERE title LIKE '%5 Mistakes%'`
    );
    console.log('✅ Updated blog post 2 content');

    await connection.end();
    console.log('✅ All updates completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateName();
