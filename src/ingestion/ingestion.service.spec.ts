import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionService } from './ingestion.service';
import { Ingestion, IngestionStatus } from './entities/ingestion.entity';
import { ClientProxy } from '@nestjs/microservices';

describe('IngestionService', () => {
  let service: IngestionService;
  let repository: Repository<Ingestion>;
  let pythonService: ClientProxy;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockRepository,
        },
        {
          provide: 'PYTHON_SERVICE',
          useValue: mockPythonService,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repository = module.get<Repository<Ingestion>>(getRepositoryToken(Ingestion));
    pythonService = module.get<ClientProxy>('PYTHON_SERVICE');
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
      const ingestion = {
        id: '1',
        ...createIngestionDto,
        status: IngestionStatus.PENDING,
        initiatedBy: mockUser,
      };

      mockRepository.create.mockReturnValue(ingestion);
      mockRepository.save.mockResolvedValue(ingestion);

      // const result = await service.create(createIngestionDto, mockUser);

      // expect(result).toEqual(ingestion);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockPythonService.emit).toHaveBeenCalledWith('start_ingestion', {
        ingestionId: ingestion.id,
        ...createIngestionDto,
      });
    });
  });

  describe('updateStatus', () => {
    it('should update ingestion status', async () => {
      const ingestion = {
        id: '1',
        status: IngestionStatus.PENDING,
      };

      mockRepository.findOne.mockResolvedValue(ingestion);
      mockRepository.save.mockResolvedValue({
        ...ingestion,
        status: IngestionStatus.COMPLETED,
      });

      // const result = await service.updateStatus('1', IngestionStatus.COMPLETED);

      // expect(result.status).toBe(IngestionStatus.COMPLETED);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
