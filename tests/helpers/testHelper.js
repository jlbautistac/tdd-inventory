const pool = require('../../src/config/database');

/**
 * Clean all data from the database tables
 */
async function cleanDatabase() {
    await pool.query('DELETE FROM ubications');
}

/**
 * Close database connection pool
 */
async function closeDatabase() {
    await pool.end();
}

module.exports = {
    cleanDatabase,
    closeDatabase
};
