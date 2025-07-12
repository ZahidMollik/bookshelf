import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
export class UpdateBookDtoWithId extends PartialType(CreateBookDto) {
  @IsNumber()
  @IsNotEmpty()
  id?: number;
}
