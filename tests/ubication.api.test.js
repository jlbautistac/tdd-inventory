const UbicationAPI = require('../src/api/ubication.api');
const { cleanDatabase, closeDatabase } = require('./helpers/testHelper');

describe('Testing Ubication API', () => {
    let ubicationAPI;

    beforeEach(async () => {
        ubicationAPI = new UbicationAPI();
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('POST /ubications - Create Ubication', () => {
        test('should create a new ubication and return 201 status', async () => {
            const response = await ubicationAPI.createUbication('A-1-1', 'Main Warehouse');

            expect(response.status).toBe(201);
            expect(response.data).toEqual({
                code: 'A-1-1',
                name: 'Main Warehouse'
            });
        });

        test('should return 400 when code is missing', async () => {
            const response = await ubicationAPI.createUbication(null, 'Main Warehouse');

            expect(response.status).toBe(400);
            expect(response.error).toBe('Code/Name are required');
        });

        test('should return 400 when name is missing', async () => {
            const response = await ubicationAPI.createUbication('A-1-1', null);

            expect(response.status).toBe(400);
            expect(response.error).toBe('Code/Name are required');
        });

        test('should return 409 when ubication code already exists', async () => {
            await ubicationAPI.createUbication('A-1-1', 'Main Warehouse');
            const response = await ubicationAPI.createUbication('A-1-1', 'Duplicate Warehouse');

            expect(response.status).toBe(409);
            expect(response.error).toBe('Ubication code already exists');
        });
    });

    describe('GET /ubications - Get All Ubications', () => {
        test('should return all ubications with 200 status', async () => {
            await ubicationAPI.createUbication('A-1-1', 'Main Warehouse');
            await ubicationAPI.createUbication('B-1-1', 'Secondary Warehouse');

            const response = await ubicationAPI.getAllUbications();

            expect(response.status).toBe(200);
            expect(response.data).toHaveLength(2);
            expect(response.data[0].code).toBe('A-1-1');
            expect(response.data[1].code).toBe('B-1-1');
        });

        test('should return empty array when no ubications exist', async () => {
            const response = await ubicationAPI.getAllUbications();

            expect(response.status).toBe(200);
            expect(response.data).toEqual([]);
        });
    });

    describe('GET /ubications/:code - Get Ubication By Code', () => {
        test('should return ubication with 200 status when code exists', async () => {
            await ubicationAPI.createUbication('A-1-1', 'Main Warehouse');

            const response = await ubicationAPI.getUbicationByCode('A-1-1');

            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                code: 'A-1-1',
                name: 'Main Warehouse'
            });
        });

        test('should return 404 when ubication code does not exist', async () => {
            const response = await ubicationAPI.getUbicationByCode('Z-9-9');

            expect(response.status).toBe(404);
            expect(response.error).toBe('Ubication not found');
        });

        test('should return 400 when code parameter is missing', async () => {
            const response = await ubicationAPI.getUbicationByCode(null);

            expect(response.status).toBe(400);
            expect(response.error).toBe('Code parameter is required');
        });
    });
});