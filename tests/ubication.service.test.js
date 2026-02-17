const Ubication = require('../src/ubication');
const UbicationService = require('../src/services/ubication.service');
const { cleanDatabase, closeDatabase } = require('./helpers/testHelper');

describe('Testing Ubication Service', () => {
    let ubicationService;

    beforeEach(async () => {
        ubicationService = new UbicationService();
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    test('should create a new ubication using the service', async () => {
        const ubication = await ubicationService.createUbication('A-1-1', 'Main Warehouse');

        expect(ubication).toBeInstanceOf(Ubication);
        expect(ubication).toEqual({
            code: 'A-1-1',
            name: 'Main Warehouse'
        });
    });

    test('should return all created ubications', async () => {
        await ubicationService.createUbication('A-1-1', 'Main Warehouse');
        await ubicationService.createUbication('B-1-1', 'Secondary Warehouse');

        const ubications = await ubicationService.getAllUbications();

        expect(ubications).toHaveLength(2);
        expect(ubications[0].code).toBe('A-1-1');
        expect(ubications[1].code).toBe('B-1-1');
    });

    test('should return ubication by code', async () => {
        await ubicationService.createUbication('A-1-1', 'Main Warehouse');

        const ubication = await ubicationService.getUbicationByCode('A-1-1');

        expect(ubication).toBeInstanceOf(Ubication);
        expect(ubication.name).toBe('Main Warehouse');
    });

    test('should return null when ubication code does not exist', async () => {
        const ubication = await ubicationService.getUbicationByCode('Z-9-9');

        expect(ubication).toBeNull();
    });

    test('should throw error when trying to create duplicated ubication code', async () => {
        await ubicationService.createUbication('A-1-1', 'Main Warehouse');

        await expect(ubicationService.createUbication('A-1-1', 'Duplicate Warehouse')).rejects.toThrow('Ubication code already exists');
    });

    test('should throw error if code or name are missing', async () => {
        await expect(ubicationService.createUbication()).rejects.toThrow('Code/Name are required');
    });
});