import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAuthorDto } from 'src/authors/dto/create-author.dto';

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

  @ValidateNested()
  @Type(() => CreateAuthorDto)
  author: CreateAuthorDto;
}
