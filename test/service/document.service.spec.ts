// import { Test, TestingModule } from "@nestjs/testing";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { DocumentService } from "src/document/document.service";
// import { Document } from "src/document/entities/document.entity";
// import { NotFoundException } from "@nestjs/common";
// import { IngestionService } from "src/ingestion/ingestion.service";

// describe("DocumentService", () => {
//   let service: DocumentService;
//   let repository: Repository<Document>;

//   const mockRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//     find: jest.fn(),
//     getFile: jest.fn(),
//     remove: jest.fn(),
//     listFiles: jest.fn(),
//   };

//   const ingestionRepo = {
//     create: jest.fn(),
//     save: jest.fn(),
//     findOne: jest.fn(),
//   }

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DocumentService,
//         {
//           provide: getRepositoryToken(Document),
//           useValue: mockRepository,
//         },
//         {
//           provide: IngestionService,
//           useValue: ingestionRepo,
//         },
//       ],
//     }).compile();
  
//     service = module.get<DocumentService>(DocumentService);
//     repository = module.get<Repository<Document>>(getRepositoryToken(Document));
//   });
  
//   it("should be defined", () => {
//     expect(service).toBeDefined();
//   });

// //   describe("create", () => {
// //     const createDocumentDto = {
// //       title: "Test Document",
// //       description: "Test Description",
// //     };

// //     const mockFile = {
// //       path: "/path/to/file",
// //       mimetype: "application/pdf",
// //       size: 1024,
// //     } as Express.Multer.File;

// //     const mockUser = { id: "1", email: "test@example.com" };

// //     it("should create a new document", async () => {
// //       const document = {
// //         id: "1",
// //         ...createDocumentDto,
// //         fileUrl: mockFile.path,
// //         fileType: mockFile.mimetype,
// //         fileSize: mockFile.size,
// //         // createdBy: mockUser,
// //       };

// //       mockRepository.create.mockReturnValue(document);
// //       mockRepository.save.mockResolvedValue(document);

// //       const result = await service.create(createDocumentDto, mockFile, mockUser);

// //       expect(result).toEqual(document);
// //       expect(mockRepository.create).toHaveBeenCalled();
// //       expect(mockRepository.save).toHaveBeenCalled();
// //     });
// //   });

//   describe.only("listFiles", () => {
//     it("should return an array of documents", async () => {
//       const documents = [
//         { id: "1", title: "Doc 1" },
//         { id: "2", title: "Doc 2" },
//       ];
//       mockRepository.find.mockResolvedValue(documents);

//       const result = await service.listFiles();

//       expect(result).toEqual(documents);
//       expect(mockRepository.find).toHaveBeenCalledWith({
//         relations: ["createdBy"],
//       });
//     });
//   });

//   describe("getFile", () => {
//     it("should find a document by id", async () => {
//       const document = { id: "1", title: "Test Document" };
//       mockRepository.getFile.mockResolvedValue(document);

//       const result = await service.getFile(1);

//       expect(result).toEqual(document);
//     });

//     it("should throw NotFoundException if document not found", async () => {
//       mockRepository.getFile.mockResolvedValue(null);

//       await expect(service.getFile(1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
