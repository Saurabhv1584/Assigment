import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Ingestion } from './entities/ingestion.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { JwtModule } from 'src/auth/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion]), JwtModule],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
