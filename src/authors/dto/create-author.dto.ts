import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateBookDto } from 'src/books/dto/create-book.dto';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsArray()
  @IsOptional()
  @Type(() => CreateBookDto)
  @ValidateNested({ each: true })
  books?: CreateBookDto[];
}
