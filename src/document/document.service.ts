import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Document } from "./entities/document.entity";
import { IngestionService } from "src/ingestion/ingestion.service";
import { IngestionStatus } from "src/ingestion/entities/ingestion.entity";

@Injectable()
export class DocumentService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private ingestionManagementService: IngestionService
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || "default-bucket";
  }

  async uploadFile(
    file: Express.Multer.File,
    title: string,
    userId: string
  ): Promise<any> {
    const key = `${uuidv4()}-${file.originalname}`;
    try {
      // ingestion => stattus => processing
      await this.ingestionManagementService.triggerIngestion(
        'key',
        userId,
        title,
        IngestionStatus.PROCESSING,
        'Pending'
      );
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const data = await this.s3.upload(params).promise();
      Logger.log("File uploaded successfully");
      // return data;

      const document = this.documentRepository.create({
        title,
        key,
        url: data.Location,
        createdBy: userId,
      });
      const response = await this.documentRepository.save(document);
      await this.ingestionManagementService.triggerIngestion(
        `${response.id}`,
        userId,
        title,
        IngestionStatus.COMPLETED,
        'Success'
      );

      return response;
    } catch (error) {
      // ingestion => status => fail
      Logger.log(
        `upload failed for key: ${key} , send complete log to AWS athena / elastic search`
      );
      await this.ingestionManagementService.triggerIngestion(
        'key',
        userId,
        title,
        IngestionStatus.FAILED,
        error.message
      );

      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listFiles(): Promise<any[]> {
    try {
      const params = {
        Bucket: this.bucketName,
      };  

      // Fetch the list of objects from S3
      const data = await this.s3.listObjectsV2(params).promise();

      // Map the list of S3 objects to a simplified format
      const files = data.Contents.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        storageClass: item.StorageClass,
      }));

      return files;
    } catch (error) {
      throw new HttpException(
        `Failed to list files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFile(id: number): Promise<any> {
    // Step 1: Fetch the document from the database using the ID
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new HttpException("Document not found", HttpStatus.NOT_FOUND);
    }

    try {
      // Step 2: Get the file from S3 using the document key
      const params = {
        Bucket: this.bucketName,
        Key: document.key,
      };

      const file = await this.s3.getObject(params).promise();

      // Return the file content and metadata
      return {
        title: document.title,
        url: document.url,
        contentType: file.ContentType,
        content: file.Body,
        size: file.ContentLength,
        lastModified: file.LastModified,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve file from S3: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(id: number): Promise<void> {
    // Step 1: Find the document in the database
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new HttpException("Document not found", HttpStatus.NOT_FOUND);
    }

    try {
      // Step 2: Delete the file from S3
      const params = {
        Bucket: this.bucketName,
        Key: document.key,
      };
      await this.s3.deleteObject(params).promise();
      Logger.log(`File deleted from S3: ${document.key}`);

      // Step 3: Delete the document record from the database
      await this.documentRepository.delete(id);
      Logger.log(`Document deleted from database: ${id}`);
    } catch (error) {
      Logger.log("delete failed for id: " + id);
      throw new HttpException(
        `Failed to delete file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
