import { IngestionService } from './ingestion.service';
export declare class IngestionController {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    getStatus(id: string): Promise<{
        documentId: string;
        status: string;
    }>;
}
