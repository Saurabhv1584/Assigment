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
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ingestion_entity_1 = require("./entities/ingestion.entity");
let IngestionService = class IngestionService {
    constructor(ingestionRepository) {
        this.ingestionRepository = ingestionRepository;
    }
    async triggerIngestion(documentId, userId, title, status, message) {
        try {
            const document = this.ingestionRepository.create({
                documentId,
                userId,
                title,
                status,
                message
            });
            const response = await this.ingestionRepository.save(document);
            return { id: documentId, message: `Ingestion is ${status}.` };
        }
        catch (error) {
            common_1.Logger.error(`Error while ingestion: ${error.message}`);
            throw new common_1.HttpException({ status: "Error", message: "Failed to ingestion status." }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getIngestionStatus(documentId) {
        try {
            const document = await this.ingestionRepository.findOne({
                where: { id: documentId },
            });
            if (!document) {
                throw new common_1.HttpException({ status: "Not Found", message: "Document does not exist." }, common_1.HttpStatus.NOT_FOUND);
            }
            common_1.Logger.log(`Retrieved ingestion status for document ID: ${documentId}`);
            return { documentId: document.id, status: document.status };
        }
        catch (error) {
            common_1.Logger.error(`Error while retrieving ingestion status: ${error.message}`);
            throw new common_1.HttpException({ status: "Error", message: "Failed to retrieve ingestion status." }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ingestion_entity_1.Ingestion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map