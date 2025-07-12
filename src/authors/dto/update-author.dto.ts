import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateBookDtoWithId } from 'src/books/dto/update-book.dto';

export class UpdateAuthorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsOptional()
  @Type(() => UpdateBookDtoWithId)
  @ValidateNested({ each: true })
  books?: UpdateBookDtoWithId[];
}
