import { Test, TestingModule } from "@nestjs/testing";
import { IngestionService } from "src/ingestion/ingestion.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Ingestion } from "src/ingestion/entities/ingestion.entity";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";

describe("IngestionService", () => {
  let service: IngestionService;
  let ingestionRepository: Repository<Ingestion>;

  const mockIngestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockIngestionEntity = {
    documentId: "1234-5678",
    userId: "user-123",
    title: "Test Document",
    status: "Processing",
    message: "Ingestion in progress",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepository,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionRepository = module.get<Repository<Ingestion>>(
      getRepositoryToken(Ingestion)
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("triggerIngestion", () => {
    it("should successfully trigger ingestion and return status", async () => {
      mockIngestionRepository.create.mockReturnValue(mockIngestionEntity);
      mockIngestionRepository.save.mockResolvedValue(mockIngestionEntity);

      const response = await service.triggerIngestion(
        mockIngestionEntity.documentId,
        mockIngestionEntity.userId,
        mockIngestionEntity.title,
        mockIngestionEntity.status,
        mockIngestionEntity.message
      );

      expect(response).toEqual({
        id: mockIngestionEntity.documentId,
        message: "Ingestion is Processing.",
      });

      expect(mockIngestionRepository.create).toHaveBeenCalledWith(
        mockIngestionEntity
      );
      expect(mockIngestionRepository.save).toHaveBeenCalledWith(
        mockIngestionEntity
      );
    });

    it("should throw an error if ingestion fails", async () => {
      mockIngestionRepository.save.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        service.triggerIngestion(
          mockIngestionEntity.documentId,
          mockIngestionEntity.userId,
          mockIngestionEntity.title,
          mockIngestionEntity.status,
          mockIngestionEntity.message
        )
      ).rejects.toThrowError(
        new HttpException(
          { status: "Error", message: "Failed to ingestion status." },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("getIngestionStatus", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return ingestion status for a valid document ID", async () => {
      const mockIngestionEntity = {
        id: "ec46d24a-ebe1-4296-9350-df9301d3c825",
        documentId: "key",
        status: "processing",
      };
  
      mockIngestionRepository.findOne = jest.fn().mockResolvedValue(mockIngestionEntity);
  
      const result = await service.getIngestionStatus(mockIngestionEntity.id);
  
      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockIngestionEntity.id },
      });
  
      expect(result).toEqual({
        documentId: mockIngestionEntity.id,
        status: mockIngestionEntity.status,
      });
    });
  
    it("should throw Not Found exception if document ID is not found", async () => {
      mockIngestionRepository.findOne = jest.fn().mockResolvedValue(null);
    
      await expect(
        service.getIngestionStatus("ec46d24a-ebe1-4296-9350-df9301d3c820")
      ).rejects.toThrowError(
        new HttpException(
          { status: "Not Found", message: "Document does not exist." },
          HttpStatus.NOT_FOUND,
        ),
      );
    
      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({
        where: { id: "ec46d24a-ebe1-4296-9350-df9301d3c820" },
      });
    });
    
  
    it("should handle database errors gracefully", async () => {
      mockIngestionRepository.findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));
  
      await expect(service.getIngestionStatus("1234-5678")).rejects.toThrowError(
        new HttpException(
          { status: "Error", message: "Failed to retrieve ingestion status." },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
  
      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1234-5678" },
      });
    });
  });
  
});
