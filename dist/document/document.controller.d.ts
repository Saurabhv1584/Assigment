import { DocumentService } from "./document.service";
export declare class DocumentController {
    private readonly documentService;
    constructor(documentService: DocumentService);
    uploadFile(file: Express.Multer.File, title: string, req: any): Promise<any>;
    listFiles(): Promise<any>;
    getFile(id: number): Promise<any>;
    deleteFile(id: number): Promise<any>;
}
