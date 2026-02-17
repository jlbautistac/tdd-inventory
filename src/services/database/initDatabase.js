require('dotenv').config();
const { Client } = require('pg');
const pool = require('../../config/database');

async function initDatabase() {
    let adminClient;
    
    try {
        console.log('Initializing database...');

        // First, connect to postgres database to create our database if it doesn't exist
        adminClient = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: 'postgres', // Connect to default postgres database
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await adminClient.connect();
        console.log('Connected to PostgreSQL server');

        // Check if database exists
        const dbCheckResult = await adminClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_NAME]
        );

        if (dbCheckResult.rows.length === 0) {
            // Create database if it doesn't exist
            console.log(`Creating database ${process.env.DB_NAME}...`);
            await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created successfully`);
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists`);
        }

        await adminClient.end();

        // Now connect to our database and create tables
        console.log('Creating tables...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ubications (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database initialized successfully');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        if (adminClient) {
            await adminClient.end();
        }
        await pool.end();
        process.exit(1);
    }
}

initDatabase();
