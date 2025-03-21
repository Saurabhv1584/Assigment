import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { IngestionModule } from 'src/ingestion/ingestion.module';
import { JwtModule } from 'src/auth/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    JwtModule,
    IngestionModule
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
