"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ingestion_controller_1 = require("./ingestion.controller");
describe('IngestionController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ingestion_controller_1.IngestionController],
        }).compile();
        controller = module.get(ingestion_controller_1.IngestionController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=ingestion.controller.spec.js.map