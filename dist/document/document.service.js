"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
const document_entity_1 = require("./entities/document.entity");
const ingestion_service_1 = require("../ingestion/ingestion.service");
const ingestion_entity_1 = require("../ingestion/entities/ingestion.entity");
let DocumentService = class DocumentService {
    constructor(documentRepository, ingestionManagementService) {
        this.documentRepository = documentRepository;
        this.ingestionManagementService = ingestionManagementService;
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }
    async uploadFile(file, title, userId) {
        const key = `${(0, uuid_1.v4)()}-${file.originalname}`;
        try {
            await this.ingestionManagementService.triggerIngestion('key', userId, title, ingestion_entity_1.IngestionStatus.PROCESSING, 'Pending');
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const data = await this.s3.upload(params).promise();
            common_1.Logger.log("File uploaded successfully");
            const document = this.documentRepository.create({
                title,
                key,
                url: data.Location,
                createdBy: userId,
            });
            const response = await this.documentRepository.save(document);
            await this.ingestionManagementService.triggerIngestion(`${response.id}`, userId, title, ingestion_entity_1.IngestionStatus.COMPLETED, 'Success');
            return response;
        }
        catch (error) {
            common_1.Logger.log(`upload failed for key: ${key} , send complete log to AWS athena / elastic search`);
            await this.ingestionManagementService.triggerIngestion('key', userId, title, ingestion_entity_1.IngestionStatus.FAILED, error.message);
            throw new common_1.HttpException(`File upload failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(title, key, url, createdBy) {
        try {
            const document = this.documentRepository.create({
                title,
                key,
                url,
                createdBy,
            });
            return await this.documentRepository.save(document);
        }
        catch (error) {
            throw new common_1.HttpException(`Document creation failed: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async listFiles() {
        try {
            const params = {
                Bucket: this.bucketName,
            };
            const data = await this.s3.listObjectsV2(params).promise();
            const files = data.Contents.map((item) => ({
                key: item.Key,
                lastModified: item.LastModified,
                size: item.Size,
                storageClass: item.StorageClass,
            }));
            return files;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to list files: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getFile(id) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.HttpException("Document not found", common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const params = {
                Bucket: this.bucketName,
                Key: document.key,
            };
            const file = await this.s3.getObject(params).promise();
            return {
                title: document.title,
                url: document.url,
                contentType: file.ContentType,
                content: file.Body,
                size: file.ContentLength,
                lastModified: file.LastModified,
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to retrieve file from S3: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFile(id) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.HttpException("Document not found", common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const params = {
                Bucket: this.bucketName,
                Key: document.key,
            };
            await this.s3.deleteObject(params).promise();
            common_1.Logger.log(`File deleted from S3: ${document.key}`);
            await this.documentRepository.delete(id);
            common_1.Logger.log(`Document deleted from database: ${id}`);
        }
        catch (error) {
            common_1.Logger.log("delete failed for id: " + id);
            throw new common_1.HttpException(`Failed to delete file: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ingestion_service_1.IngestionService])
], DocumentService);
//# sourceMappingURL=document.service.js.map