import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { Ingestion } from './entities/ingestion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '../auth/jwt/jwt.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [IngestionController],
    providers: [
      {
        provide: getRepositoryToken(Ingestion),
        useClass: Ingestion,
      },
      IngestionService,
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn().mockReturnValue('test-token'),
          verify: jest.fn().mockReturnValue({ userId: '123' }),
        },
      },
    ],
  }).compile();

  controller = module.get<IngestionController>(IngestionController);
  service = module.get<IngestionService>(IngestionService);
});

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatus', () => {
    it('should return ingestion status for a valid document ID', async () => {
      const mockStatus = { documentId: '1234-5678', status: 'Processing' };
      jest.spyOn(service, 'getIngestionStatus').mockResolvedValue(mockStatus);

      const result = await controller.getStatus('1234-5678');

      expect(result).toEqual(mockStatus);
      expect(service.getIngestionStatus).toHaveBeenCalledWith('1234-5678');
    });

    it('should throw an error if ingestion status is not found', async () => {
      jest.spyOn(service, 'getIngestionStatus').mockRejectedValue(new Error('No data found'));

      await expect(controller.getStatus('invalid-id')).rejects.toThrowError('No data found');
      expect(service.getIngestionStatus).toHaveBeenCalledWith('invalid-id');
    });
  });
});
