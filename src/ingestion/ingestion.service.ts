import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ingestion } from "./entities/ingestion.entity";

@Injectable()
// rename => IngestionManagementService
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>
  ) {}

  // Trigger ingestion (mock API)
  async triggerIngestion(documentId: string, userId: string, title: string, status: string, message: string): Promise<any> {
    try {
      const document = this.ingestionRepository.create({
        documentId,
        userId, 
        title, 
        status,
        message
      });
      const response = await this.ingestionRepository.save(document);
  
      return { id: documentId , message: `Ingestion is ${status}.` };
    } catch (error) {
      Logger.log(`Error while ingestion: ${error.message}`);
      throw new HttpException(
        { status: "Error", message: "Failed to ingestion status." },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get ingestion status
  // 
  async getIngestionStatus(id: string): Promise<{ documentId: string; status: string }> {
    try {
      const document = await this.ingestionRepository.findOne({
        where: { id: id },
      });
  
      if (!document) {
        throw new HttpException(
          { status: "Not Found", message: "Document does not exist." },
          HttpStatus.NOT_FOUND,
        );
      }
      Logger.log(`Retrieved ingestion status for document ID: ${id}`);
      return { documentId: document.id, status: document.status };
    } catch (error) {
      Logger.log(`Error while retrieving ingestion status: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { status: "Error", message: "Failed to retrieve ingestion status." },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
