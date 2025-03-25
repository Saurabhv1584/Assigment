import { Test, TestingModule } from "@nestjs/testing";
import { DocumentService } from "src/document/document.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Document } from "src/document/entities/document.entity";
import { S3 } from "aws-sdk";
import { Repository } from "typeorm";
import { IngestionService } from "src/ingestion/ingestion.service";
import { v4 as uuidv4 } from "uuid";

describe("DocumentService", () => {
  let service: DocumentService;
  let documentRepository: Repository<Document>;
  let s3: S3;
  let ingestionService: IngestionService;

  const mockDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    getFile: jest.fn(),
    delete: jest.fn(),
    listFiles: jest.fn(),
  };

  const mockS3 = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    getObject: jest.fn(),
    deleteObject: jest.fn(),
    listObjectsV2: jest.fn(),
  };

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: S3,
          useValue: mockS3,
        },
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<Document>>(
      getRepositoryToken(Document)
    );
    (service as any).s3 = mockS3;
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("uploadFile", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const file: Express.Multer.File = {
      originalname: "test-file.txt",
      buffer: Buffer.from("dummy file content"),
      mimetype: "text/plain",
      fieldname: "file",
      encoding: "7bit",
      size: 1024,
      destination: "",
      filename: "",
      path: "",
      stream: null,
    };
    it("should upload a file to S3, save document in the repository, and trigger ingestion", async () => {
      process.env.AWS_S3_BUCKET_NAME = "my-s3-dummy-bucket";
      const title = "Test Document";
      const userId = "user-123";
      const mockKey = `${uuidv4()}-${file.originalname}`;
      const mockS3Response = { Location: `https://s3.amazonaws.com/my-s3-dummy-bucket/${mockKey}` };
    
      mockIngestionService.triggerIngestion.mockResolvedValue(undefined);
    
      mockS3.upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockS3Response),
      });
    
      const mockDocument = {
        id: 1,
        title,
        key: mockKey,
        url: mockS3Response.Location,
        createdBy: userId,
      };
      mockDocumentRepository.create.mockReturnValue(mockDocument);
      mockDocumentRepository.save.mockResolvedValue(mockDocument);
    
      const result = await service.uploadFile(file, title, userId);
    
      expect(mockIngestionService.triggerIngestion).toHaveBeenNthCalledWith(
        1, 
        "key", 
        userId, 
        title, 
        expect.stringMatching(/processing/i),
        "Pending"
      );
    
      expect(mockIngestionService.triggerIngestion).toHaveBeenNthCalledWith(
        2, 
        `${mockDocument.id}`, 
        userId, 
        title, 
        expect.stringMatching(/completed/i),
        "Success"
      );
    
      expect(mockDocumentRepository.create).toHaveBeenCalledWith({
        title,
        key: expect.any(String),
        url: mockS3Response.Location,
        createdBy: userId,
      });
    
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(mockDocument);
    
      expect(result).toEqual(mockDocument);
    });
    

    it("should handle upload failure and trigger ingestion with FAILED status", async () => {
      const title = "Test Document";
      const userId = "user-123";
    
      mockIngestionService.triggerIngestion.mockResolvedValue(undefined);
    
      mockS3.upload.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("S3 upload error")),
      });
    
      await expect(service.uploadFile(file, title, userId)).rejects.toThrow(
        "File upload failed: S3 upload error"
      );
    
      expect(mockIngestionService.triggerIngestion).toHaveBeenNthCalledWith(
        1,
        "key",
        userId,
        title,
        expect.stringMatching(/processing/i),
        "Pending"
      );
    
      expect(mockS3.upload).toHaveBeenCalled();
    
      expect(mockIngestionService.triggerIngestion).toHaveBeenNthCalledWith(
        2,
        "key",
        userId,
        title,
        expect.stringMatching(/failed/i),
        "S3 upload error"
      );
    });
    
  });

  describe("listFiles", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return a list of files from S3", async () => {
      process.env.AWS_S3_BUCKET_NAME = "my-s3-dummy-bucket";

      const mockS3Response = {
        Contents: [
          {
            Key: "file1.txt",
            LastModified: new Date("2024-03-01T12:00:00Z"),
            Size: 1024,
            StorageClass: "STANDARD",
          },
          {
            Key: "file2.txt",
            LastModified: new Date("2024-03-02T14:30:00Z"),
            Size: 2048,
            StorageClass: "STANDARD_IA",
          },
        ],
      };

      mockS3.listObjectsV2.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockS3Response),
      });

      const result = await service.listFiles();

      expect(result).toEqual([
        {
          key: "file1.txt",
          lastModified: new Date("2024-03-01T12:00:00Z"),
          size: 1024,
          storageClass: "STANDARD",
        },
        {
          key: "file2.txt",
          lastModified: new Date("2024-03-02T14:30:00Z"),
          size: 2048,
          storageClass: "STANDARD_IA",
        },
      ]);
    });

    it("should throw an error if S3 listObjectsV2 fails", async () => {
      mockS3.listObjectsV2.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("S3 error")),
      });

      await expect(service.listFiles()).rejects.toThrow(
        "Failed to list files: S3 error"
      );
    });
  });

  describe("getFile", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return a file from S3", async () => {
      // ✅ Mock environment variable before calling the service
      process.env.AWS_S3_BUCKET_NAME = "my-s3-dummy-bucket";

      const id = 1;
      const mockDocument = {
        id,
        key: "test-key",
        title: "test-title",
        url: "http://test-url",
      };
      const mockFileData = { Body: Buffer.from("test content") };
      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      mockS3.getObject = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockFileData),
      });

      const result = await service.getFile(id);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });

      expect(result).toEqual({
        title: mockDocument.title,
        url: mockDocument.url,
        contentType: undefined,
        content: mockFileData.Body,
        size: undefined,
        lastModified: undefined,
      });
    });

    it("should throw an error if document is not found", async () => {
      const id = 1;

      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.getFile(id)).rejects.toThrow("Document not found");
    });
  });

  describe("deleteFile", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const id = 1;
    it("should delete a file from S3 and remove the document from the repository", async () => {
      const mockDocument = {
        id,
        key: "test-key",
        title: "test-title",
        url: "http://test-url",
      };

      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
      mockS3.deleteObject.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      mockDocumentRepository.delete.mockResolvedValue(mockDocument);

      await service.deleteFile(id);
      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockDocumentRepository.delete).toHaveBeenCalledWith(id);
    });

    it("should throw an error if document is not found", async () => {
      mockDocumentRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteFile(id)).rejects.toThrow(
        "Document not found"
      );
    });
  });
});
