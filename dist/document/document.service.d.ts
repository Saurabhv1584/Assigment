import { Repository } from "typeorm";
import { Document } from "./entities/document.entity";
import { IngestionService } from "src/ingestion/ingestion.service";
export declare class DocumentService {
    private documentRepository;
    private ingestionManagementService;
    private s3;
    private bucketName;
    constructor(documentRepository: Repository<Document>, ingestionManagementService: IngestionService);
    uploadFile(file: Express.Multer.File, title: string, userId: string): Promise<any>;
    create(title: string, key: string, url: string, createdBy: string): Promise<Document>;
    listFiles(): Promise<any[]>;
    getFile(id: number): Promise<any>;
    deleteFile(id: number): Promise<void>;
}
