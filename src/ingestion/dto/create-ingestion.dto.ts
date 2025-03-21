import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIngestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
