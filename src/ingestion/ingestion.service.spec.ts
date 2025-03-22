import { Test, TestingModule } from "@nestjs/testing";
import { IngestionService } from "./ingestion.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Ingestion } from "./entities/ingestion.entity";
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
    it("should return ingestion status for a valid document ID", async () => {
      mockIngestionRepository.findOne.mockResolvedValue(mockIngestionEntity);

      const result = await service.getIngestionStatus(
        mockIngestionEntity.documentId
      );

      expect(result).toEqual({
        documentId: mockIngestionEntity.documentId,
        status: mockIngestionEntity.status,
      });

      expect(mockIngestionRepository.findOne).toHaveBeenCalledWith({
        where: { documentId: mockIngestionEntity.documentId },
      });
    });

    it("should throw a not found error if the document does not exist", async () => {
      mockIngestionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getIngestionStatus("nonexistent-id")
      ).rejects.toThrowError(
        new HttpException(
          { status: "Not Found", message: "Document does not exist." },
          HttpStatus.NOT_FOUND
        )
      );
    });

    it("should throw an error if retrieving status fails", async () => {
      mockIngestionRepository.findOne.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        service.getIngestionStatus("1234-5678")
      ).rejects.toThrowError(
        new HttpException(
          { status: "Error", message: "Failed to retrieve ingestion status." },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
