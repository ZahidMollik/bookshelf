import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishAt: Date;
}
