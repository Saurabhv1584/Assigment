import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IngestionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED= 'failed'
}

@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  documentId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ default: ''})
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
