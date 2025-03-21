export declare enum IngestionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Ingestion {
    id: string;
    documentId: string;
    userId: string;
    title: string;
    status: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}
