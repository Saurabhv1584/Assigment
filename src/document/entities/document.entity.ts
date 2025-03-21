import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';


@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  key: string;

  @Column()
  url: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}

