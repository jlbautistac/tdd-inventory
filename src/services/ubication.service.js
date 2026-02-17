const Ubication = require('../ubication');
const pool = require('../config/database');

class UbicationService {
    constructor() {
        // Database connection is managed by the pool
    }

    async createUbication(code, name) {
        try {
            // Validate input first (using Ubication class validation)
            const ubication = new Ubication(code, name);

            // Check if code already exists
            const existingQuery = 'SELECT * FROM ubications WHERE code = $1';
            const existingResult = await pool.query(existingQuery, [code]);

            if (existingResult.rows.length > 0) {
                throw new Error('Ubication code already exists');
            }

            // Insert new ubication
            const insertQuery = 'INSERT INTO ubications (code, name) VALUES ($1, $2) RETURNING *';
            const result = await pool.query(insertQuery, [code, name]);

            // Return ubication object
            const row = result.rows[0];
            const newUbication = new Ubication(row.code, row.name);
            return newUbication;
        } catch (error) {
            // Re-throw the error to be handled by the caller
            throw error;
        }
    }

    async getAllUbications() {
        try {
            const query = 'SELECT * FROM ubications ORDER BY code';
            const result = await pool.query(query);

            // Convert database rows to Ubication objects
            return result.rows.map(row => {
                const ubication = new Ubication(row.code, row.name);
                return ubication;
            });
        } catch (error) {
            throw error;
        }
    }

    async getUbicationByCode(code) {
        try {
            const query = 'SELECT * FROM ubications WHERE code = $1';
            const result = await pool.query(query, [code]);

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return new Ubication(row.code, row.name);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UbicationService;