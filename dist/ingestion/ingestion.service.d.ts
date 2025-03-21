import { Repository } from "typeorm";
import { Ingestion } from "./entities/ingestion.entity";
export declare class IngestionService {
    private ingestionRepository;
    constructor(ingestionRepository: Repository<Ingestion>);
    triggerIngestion(documentId: string, userId: string, title: string, status: string, message: string): Promise<any>;
    getIngestionStatus(documentId: string): Promise<{
        documentId: string;
        status: string;
    }>;
}
