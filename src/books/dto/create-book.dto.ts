import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  publishAt: Date;
}

export class CreateBookWithAuthorDto extends CreateBookDto {
  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}
