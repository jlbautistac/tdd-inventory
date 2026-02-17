const express = require('express');
const router = express.Router();
const UbicationAPI = require('../ubication.api');

const ubicationAPI = new UbicationAPI();

/**
 * POST /api/ubications
 * Create a new ubication
 */
router.post('/', async (req, res) => {
    const { code, name } = req.body;
    const response = await ubicationAPI.createUbication(code, name);
    
    res.status(response.status).json(response.data || { error: response.error });
});

/**
 * GET /api/ubications
 * Get all ubications
 */
router.get('/', async (req, res) => {
    const response = await ubicationAPI.getAllUbications();
    res.status(response.status).json(response.data);
});

/**
 * GET /api/ubications/:code
 * Get ubication by code
 */
router.get('/:code', async (req, res) => {
    const { code } = req.params;
    const response = await ubicationAPI.getUbicationByCode(code);
    
    res.status(response.status).json(response.data || { error: response.error });
});

module.exports = router;
