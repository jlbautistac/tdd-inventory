const UbicationService = require('../services/ubication.service');

class UbicationAPI {
    constructor() {
        this.ubicationService = new UbicationService();
    }

    async createUbication(code, name) {
        try {
            const ubication = await this.ubicationService.createUbication(code, name);
            return {
                status: 201,
                data: {
                    code: ubication.code,
                    name: ubication.name
                }
            };
        } catch (error) {
            if (error.message === 'Code/Name are required') {
                return {
                    status: 400,
                    error: error.message
                };
            }
            
            if (error.message === 'Ubication code already exists') {
                return {
                    status: 409,
                    error: error.message
                };
            }

            return {
                status: 500,
                error: 'Internal server error'
            };
        }
    }

    async getAllUbications() {
        const ubications = await this.ubicationService.getAllUbications();
        return {
            status: 200,
            data: ubications.map(ub => ({
                code: ub.code,
                name: ub.name
            }))
        };
    }

    async getUbicationByCode(code) {
        if (!code) {
            return {
                status: 400,
                error: 'Code parameter is required'
            };
        }

        const ubication = await this.ubicationService.getUbicationByCode(code);
        
        if (!ubication) {
            return {
                status: 404,
                error: 'Ubication not found'
            };
        }

        return {
            status: 200,
            data: {
                code: ubication.code,
                name: ubication.name
            }
        };
    }
}

module.exports = UbicationAPI;
