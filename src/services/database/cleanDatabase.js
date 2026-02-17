const pool = require('../../config/database');

async function cleanDatabase() {
    try {
        console.log('Cleaning database...');

        // Drop and recreate ubications table
        await pool.query('DROP TABLE IF EXISTS ubications CASCADE;');
        
        await pool.query(`
            CREATE TABLE ubications (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database cleaned and tables recreated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
}

cleanDatabase();
