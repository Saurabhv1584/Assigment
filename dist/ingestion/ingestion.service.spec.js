"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const ingestion_service_1 = require("./ingestion.service");
const ingestion_entity_1 = require("./entities/ingestion.entity");
describe('IngestionService', () => {
    let service;
    let repository;
    let pythonService;
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
    };
    const mockPythonService = {
        emit: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                ingestion_service_1.IngestionService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(ingestion_entity_1.Ingestion),
                    useValue: mockRepository,
                },
                {
                    provide: 'PYTHON_SERVICE',
                    useValue: mockPythonService,
                },
            ],
        }).compile();
        service = module.get(ingestion_service_1.IngestionService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(ingestion_entity_1.Ingestion));
        pythonService = module.get('PYTHON_SERVICE');
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        const createIngestionDto = {
            name: 'Test Ingestion',
            description: 'Test Description',
        };
        const mockUser = { id: '1', email: 'test@example.com' };
        it('should create a new ingestion and trigger Python service', async () => {
            const ingestion = Object.assign(Object.assign({ id: '1' }, createIngestionDto), { status: ingestion_entity_1.IngestionStatus.PENDING, initiatedBy: mockUser });
            mockRepository.create.mockReturnValue(ingestion);
            mockRepository.save.mockResolvedValue(ingestion);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
            expect(mockPythonService.emit).toHaveBeenCalledWith('start_ingestion', Object.assign({ ingestionId: ingestion.id }, createIngestionDto));
        });
    });
    describe('updateStatus', () => {
        it('should update ingestion status', async () => {
            const ingestion = {
                id: '1',
                status: ingestion_entity_1.IngestionStatus.PENDING,
            };
            mockRepository.findOne.mockResolvedValue(ingestion);
            mockRepository.save.mockResolvedValue(Object.assign(Object.assign({}, ingestion), { status: ingestion_entity_1.IngestionStatus.COMPLETED }));
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=ingestion.service.spec.js.map